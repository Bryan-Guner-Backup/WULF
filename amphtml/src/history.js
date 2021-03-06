/**
 * Copyright 2015 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Pass } from "./pass";
import { assert } from "./asserts";
import { getService } from "./service";
import { log } from "./log";
import { timer } from "./timer";
import { viewerFor } from "./viewer";

/** @private @const */
let TAG_ = "History";

/** @private @const */
let HISTORY_PROP_ = "AMP.History";

/**
 * @return {*}
 * @private
 */
function historyState_(stackIndex) {
  let state = {};
  state[HISTORY_PROP_] = stackIndex;
  return state;
}

/** @typedef {number} */
var HistoryId;

export class History {
  /**
   * @param {!HistoryBinding} binding
   */
  constructor(binding) {
    /** @private @const {!HistoryBinding} */
    this.binding_ = binding;

    /** @private {number} */
    this.stackIndex_ = 0;

    /** @private {!Array<!Function|undefined>} */
    this.stackOnPop_ = [];

    /**
     * @private {!Array<!{callback: function():!Promise>,
     *   resolve: !Function, reject: !Function}} */
    this.queue_ = [];

    this.binding_.setOnStackIndexUpdated(this.onStackIndexUpdated_.bind(this));
  }

  /** @private */
  cleanup_() {
    this.binding_.cleanup_();
  }

  /**
   * Pushes new state into history stack with an optional callback to be called
   * when this state is popped.
   * @param {!Function=} opt_onPop
   * @return {!Promise<!HistoryId>}
   */
  push(opt_onPop) {
    return this.enque_(() => {
      return this.binding_.push().then((stackIndex) => {
        this.onStackIndexUpdated_(stackIndex);
        if (opt_onPop) {
          this.stackOnPop_[stackIndex] = opt_onPop;
        }
        return stackIndex;
      });
    });
  }

  /**
   * Pops a previously pushed state from the history stack. If onPop callback
   * has been registered, it will be called. All states coming after this
   * state will also be popped and their callbacks executed.
   * @param {!HistoryId} stateId
   * @return {!Promise}
   */
  pop(stateId) {
    return this.enque_(() => {
      return this.binding_.pop(stateId).then((stackIndex) => {
        this.onStackIndexUpdated_(stackIndex);
      });
    });
  }

  /**
   * @param {number} stackIndex
   * @private
   */
  onStackIndexUpdated_(stackIndex) {
    this.stackIndex_ = stackIndex;
    this.doPop_();
  }

  /** @private */
  doPop_() {
    if (this.stackIndex_ >= this.stackOnPop_.length - 1) {
      return;
    }

    let toPop = [];
    for (let i = this.stackOnPop_.length - 1; i > this.stackIndex_; i--) {
      if (this.stackOnPop_[i]) {
        toPop.push(this.stackOnPop_[i]);
        this.stackOnPop_[i] = undefined;
      }
    }
    this.stackOnPop_.splice(this.stackIndex_ + 1);

    if (toPop.length > 0) {
      for (let i = 0; i < toPop.length; i++) {
        // With the same delay timeouts must observe the order, although
        // there's no hard requirement in this case to follow the pop order.
        timer.delay(toPop[i], 1);
      }
    }
  }

  /**
   * @param {function():!Promise<RESULT>} callback
   * @return {!Promise<RESULT>}
   * @template RESULT
   * @private
   */
  enque_(callback) {
    let resolve;
    let reject;
    var promise = new Promise((aResolve, aReject) => {
      resolve = aResolve;
      reject = aReject;
    });

    this.queue_.push({ callback: callback, resolve: resolve, reject: reject });
    if (this.queue_.length == 1) {
      this.deque_();
    }

    return promise;
  }

  /**
   * @private
   */
  deque_() {
    if (this.queue_.length == 0) {
      return;
    }

    let task = this.queue_[0];
    let promise;
    try {
      promise = task.callback();
    } catch (e) {
      promise = Promise.reject(e);
    }

    promise
      .then(
        (result) => {
          task.resolve(result);
        },
        (reason) => {
          log.error(TAG_, "failed to execute a task:", reason);
          task.reject(reason);
        }
      )
      .then(() => {
        this.queue_.splice(0, 1);
        this.deque_();
      });
  }
}

/**
 * HistoryBinding is an interface that defines an underlying technology behind
 * the {@link History}.
 * @interface
 */
class HistoryBinding {
  /** @private */
  cleanup_() {}

  /**
   * Configres a callback to be called when stack index has been updated.
   * @param {function(number)} callback
   * @protected
   */
  setOnStackIndexUpdated(callback) {}

  /**
   * Pushes new state into the history stack. Returns promise that yields new
   * stack index.
   * @return {!Promise<number>}
   */
  push() {}

  /**
   * Pops a previously pushed state from the history stack. All states coming
   * after this state will also be popped. Returns promise that yields new
   * state index.
   * @param {number} stackIndex
   * @return {!Promise<number>}
   */
  pop(stackIndex) {}
}

/**
 * Implementation of HistoryBinding based on the native window. It uses
 * window.history properties and events.
 *
 * Visible for testing.
 *
 * @implements {HistoryBinding}
 */
export class HistoryBindingNatural_ {
  /**
   * @param {!Window} win
   */
  constructor(win) {
    /** @const {!Window} */
    this.win = win;

    let history = this.win.history;

    /** @private {number} */
    this.startIndex_ = history.length - 1;
    if (history.state && history.state[HISTORY_PROP_] !== undefined) {
      this.startIndex_ = Math.min(
        history.state[HISTORY_PROP_],
        this.startIndex_
      );
    }

    /** @private {number} */
    this.stackIndex_ = this.startIndex_;

    /**
     * @private {{promise: !Promise, resolve: !Function,
     *   reject: !Function}|undefined}
     */
    this.waitingState_;

    /** @private {?function(number)} */
    this.onStackIndexUpdated_ = null;

    // A number of browsers do not support history.state. In this cases,
    // History will track its own version. See unsupportedState_.
    /** @private {boolean} @const */
    this.supportsState_ = "state" in history;

    /** @private {*} */
    this.unsupportedState_ = historyState_(this.stackIndex_);

    // There are still browsers who do not support push/replaceState.
    let pushState, replaceState;
    if (history.pushState && history.replaceState) {
      /** @private @const {function(*, string=, string=)|undefined} */
      this.origPushState_ = history.pushState.bind(history);
      /** @private @const {function(*, string=, string=)|undefined} */
      this.origReplaceState_ = history.replaceState.bind(history);
      pushState = (state, opt_title, opt_url) => {
        this.unsupportedState_ = state;
        this.origPushState_(state, opt_title, opt_url);
      };
      replaceState = (state, opt_title, opt_url) => {
        this.unsupportedState_ = state;
        this.origReplaceState_(state, opt_title, opt_url);
      };
    } else {
      pushState = (state, opt_title, opt_url) => {
        this.unsupportedState_ = state;
      };
      replaceState = (state, opt_title, opt_url) => {
        this.unsupportedState_ = state;
      };
    }

    /** @private @const {function(*, string=, string=)} */
    this.pushState_ = pushState;

    /** @private @const {function(*, string=, string=)} */
    this.replaceState_ = replaceState;

    try {
      this.replaceState_(historyState_(this.stackIndex_));
    } catch (e) {
      log.error(TAG_, "Initial replaceState failed: " + e.message);
    }

    history.pushState = this.historyPushState_.bind(this);
    history.replaceState = this.historyReplaceState_.bind(this);

    let eventPass = new Pass(this.onHistoryEvent_.bind(this), 50);
    this.popstateHandler_ = (e) => {
      log.fine(
        TAG_,
        "popstate event: " +
          this.win.history.length +
          ", " +
          JSON.stringify(e.state)
      );
      eventPass.schedule();
    };
    this.hashchangeHandler_ = () => {
      log.fine(
        TAG_,
        "hashchange event: " +
          this.win.history.length +
          ", " +
          this.win.location.hash
      );
      eventPass.schedule();
    };
    this.win.addEventListener("popstate", this.popstateHandler_);
    this.win.addEventListener("hashchange", this.hashchangeHandler_);
  }

  /** @override */
  cleanup_() {
    if (this.origPushState_) {
      this.win.history.pushState = this.origPushState_;
    }
    if (this.origReplaceState_) {
      this.win.history.replaceState = this.origReplaceState_;
    }
    this.win.removeEventListener("popstate", this.popstateHandler_);
    this.win.removeEventListener("hashchange", this.hashchangeHandler_);
  }

  /** @override */
  setOnStackIndexUpdated(callback) {
    this.onStackIndexUpdated_ = callback;
  }

  /** @override */
  push() {
    return this.whenReady_(() => {
      this.historyPushState_();
      return Promise.resolve(this.stackIndex_);
    });
  }

  /** @override */
  pop(stackIndex) {
    // On pop, stack is not allowed to go prior to the starting point.
    stackIndex = Math.max(stackIndex, this.startIndex_);
    return this.whenReady_(() => {
      return this.back_(this.stackIndex_ - stackIndex + 1);
    });
  }

  /**
   * @param {number} stackIndex
   * @return {!Promise}
   */
  backTo(stackIndex) {
    // On pop, stack is not allowed to go prior to the starting point.
    stackIndex = Math.max(stackIndex, this.startIndex_);
    return this.whenReady_(() => {
      return this.back_(this.stackIndex_ - stackIndex);
    });
  }

  /** @private */
  onHistoryEvent_() {
    let state = this.getState_();
    log.fine(
      TAG_,
      "history event: " + this.win.history.length + ", " + JSON.stringify(state)
    );
    let stackIndex = state ? state[HISTORY_PROP_] : undefined;
    let newStackIndex = this.stackIndex_;
    let waitingState = this.waitingState_;
    this.waitingState_ = undefined;

    if (newStackIndex > this.win.history.length - 2) {
      // Make sure stack has enough space. Whether we are going forward or
      // backward, the stack should have at least one extra cell.
      newStackIndex = this.win.history.length - 2;
      this.updateStackIndex_(newStackIndex);
    }

    if (stackIndex == undefined) {
      // A new navigation forward by the user.
      newStackIndex = newStackIndex + 1;
    } else if (stackIndex < this.win.history.length) {
      // A simple trip back.
      newStackIndex = stackIndex;
    } else {
      // Generally not possible, but for posterity.
      newStackIndex = this.win.history.length - 1;
    }

    // If state index has been updated as the result replace the state.
    if (!state) {
      state = {};
    }
    state[HISTORY_PROP_] = newStackIndex;
    this.replaceState_(state, undefined, undefined);

    // Update the stack, pop squeezed states.
    if (newStackIndex != this.stackIndex_) {
      this.updateStackIndex_(newStackIndex);
    }

    // User navigation is allowed to move past the starting point of
    // the history stack.
    if (newStackIndex < this.startIndex_) {
      this.startIndex_ = newStackIndex;
    }

    if (waitingState) {
      waitingState.resolve();
    }
  }

  /** @private */
  getState_() {
    if (this.supportsState_) {
      return this.win.history.state;
    }
    return this.unsupportedState_;
  }

  /** @private */
  assertReady_() {
    assert(!this.waitingState_, "The history must not be in the waiting state");
  }

  /**
   * @param {function():!Promise<RESULT>} callback
   * @return {!Promise<RESULT>}
   * @template RESULT
   * @private
   */
  whenReady_(callback) {
    if (!this.waitingState_) {
      return callback();
    }
    return this.waitingState_.promise.then(callback, callback);
  }

  /**
   * @return {!Promise}
   * @private
   */
  wait_() {
    this.assertReady_();
    let resolve;
    let reject;
    let promise = timer.timeoutPromise(
      500,
      new Promise((aResolve, aReject) => {
        resolve = aResolve;
        reject = aReject;
      })
    );
    this.waitingState_ = {
      promise: promise,
      resolve: resolve,
      reject: reject,
    };
    return promise;
  }

  /**
   * @param {number} steps
   * @return {!Promise}
   */
  back_(steps) {
    this.assertReady_();
    if (steps <= 0) {
      return Promise.resolve(this.stackIndex_);
    }
    this.unsupportedState_ = historyState_(this.stackIndex_ - steps);
    let promise = this.wait_();
    this.win.history.go(-steps);
    return promise.then(() => {
      return Promise.resolve(this.stackIndex_);
    });
  }

  /**
   * @param {*} state
   * @param {string|undefined} title
   * @param {string|undefined} url
   * @private
   */
  historyPushState_(state, title, url) {
    this.assertReady_();
    if (!state) {
      state = {};
    }
    let len = this.win.history.length;
    let stackIndex = this.stackIndex_ + 1;
    state[HISTORY_PROP_] = stackIndex;
    this.pushState_(state, title, url);
    if (stackIndex != this.win.history.length - 1) {
      stackIndex = this.win.history.length - 1;
      state[HISTORY_PROP_] = stackIndex;
      this.replaceState_(state);
    }
    this.updateStackIndex_(stackIndex);
  }

  /**
   * @param {*} state
   * @param {string|undefined} title
   * @param {string|undefined} url
   * @private
   */
  historyReplaceState_(state, title, url) {
    this.assertReady_();
    if (!state) {
      state = {};
    }
    let stackIndex = Math.min(this.stackIndex_, this.win.history.length - 1);
    state[HISTORY_PROP_] = stackIndex;
    this.replaceState_(state, title, url);
    this.updateStackIndex_(stackIndex);
  }

  /**
   * @param {number} stackIndex
   * @private
   */
  updateStackIndex_(stackIndex) {
    this.assertReady_();
    stackIndex = Math.min(stackIndex, this.win.history.length - 1);
    if (this.stackIndex_ != stackIndex) {
      log.fine(
        TAG_,
        "stack index changed: " + this.stackIndex_ + " -> " + stackIndex
      );
      this.stackIndex_ = stackIndex;
      if (this.onStackIndexUpdated_) {
        this.onStackIndexUpdated_(stackIndex);
      }
    }
  }
}

/**
 * Implementation of HistoryBinding that assumes a virtual history that
 * relies on viewer's "pushHistory", "popHistory" and "historyPopped"
 * protocol.
 *
 * Visible for testing.
 *
 * @implements {HistoryBinding}
 */
export class HistoryBindingVirtual_ {
  /**
   * @param {!Viewer} viewer
   */
  constructor(viewer) {
    /** @private @const {!Viewer} */
    this.viewer_ = viewer;

    /** @private {number} */
    this.stackIndex_ = 0;

    /** @private {?function(number)} */
    this.onStackIndexUpdated_ = null;

    /** @private {!Unlisten} */
    this.unlistenOnHistoryPopped_ = this.viewer_.onHistoryPoppedEvent(
      this.onHistoryPopped_.bind(this)
    );
  }

  /** @override */
  cleanup_() {
    this.unlistenOnHistoryPopped_();
  }

  /** @override */
  setOnStackIndexUpdated(callback) {
    this.onStackIndexUpdated_ = callback;
  }

  /** @override */
  push() {
    // Current implemention doesn't wait for response from viewer.
    this.updateStackIndex_(this.stackIndex_ + 1);
    this.viewer_.postPushHistory(this.stackIndex_);
    return Promise.resolve(this.stackIndex_);
  }

  /** @override */
  pop(stackIndex) {
    if (stackIndex > this.stackIndex_) {
      return Promise.resolve(this.stackIndex_);
    }
    this.viewer_.postPopHistory(stackIndex);
    this.updateStackIndex_(stackIndex - 1);
    return Promise.resolve(this.stackIndex_);
  }

  /**
   * @param {!ViewerHistoryPoppedEvent} event
   * @private
   */
  onHistoryPopped_(event) {
    this.updateStackIndex_(event.newStackIndex);
  }

  /**
   * @param {number} stackIndex
   * @private
   */
  updateStackIndex_(stackIndex) {
    if (this.stackIndex_ != stackIndex) {
      log.fine(
        TAG_,
        "stack index changed: " + this.stackIndex_ + " -> " + stackIndex
      );
      this.stackIndex_ = stackIndex;
      if (this.onStackIndexUpdated_) {
        this.onStackIndexUpdated_(stackIndex);
      }
    }
  }
}

/**
 * @param {!Window} window
 * @return {!History}
 * @private
 */
function createHistory_(window) {
  let viewer = viewerFor(window);
  let binding;
  if (viewer.isOvertakeHistory()) {
    binding = new HistoryBindingVirtual_(viewer);
  } else {
    binding = new HistoryBindingNatural_(window);
  }
  return new History(binding);
}

/**
 * @param {!Window} window
 * @return {!History}
 */
export function historyFor(window) {
  return getService(window, "history", () => {
    return createHistory_(window);
  });
}
