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

import {
  History,
  HistoryBindingNatural_,
  HistoryBindingVirtual_,
} from "../../src/history";
import { listenOncePromise } from "../../src/event-helper";
import * as sinon from "sinon";

describe("History", () => {
  let sandbox;
  let clock;
  let bindingMock;
  let onStackIndexUpdated;
  let history;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();

    let binding = {
      cleanup_: () => {},
      setOnStackIndexUpdated: (callback) => {
        onStackIndexUpdated = callback;
      },
      push: () => {},
      pop(stackIndex) {},
    };
    bindingMock = sandbox.mock(binding);

    history = new History(binding);
  });

  afterEach(() => {
    bindingMock.verify();
    bindingMock = null;
    history.cleanup_();
    history = null;
    clock.restore();
    clock = null;
    sandbox.restore();
    sandbox = null;
  });

  it.skipOnFirefox("should initialize correctly", () => {
    expect(history.stackIndex_).to.equal(window.history.length - 1);
    expect(history.stackOnPop_.length).to.equal(0);
    expect(onStackIndexUpdated).to.not.equal(null);
  });

  it("should push new state", () => {
    let onPop = sinon.spy();
    bindingMock
      .expects("push")
      .withExactArgs()
      .returns(Promise.resolve(11))
      .once();
    return history.push(onPop).then((historyId) => {
      expect(history.stackIndex_).to.equal(11);
      expect(history.stackOnPop_.length).to.equal(12);
      expect(history.stackOnPop_[11]).to.equal(onPop);
      expect(onPop.callCount).to.equal(0);
    });
  });

  it("should pop previously pushed state", () => {
    let onPop = sinon.spy();
    bindingMock
      .expects("push")
      .withExactArgs()
      .returns(Promise.resolve(11))
      .once();
    bindingMock
      .expects("pop")
      .withExactArgs(11)
      .returns(Promise.resolve(10))
      .once();
    return history.push(onPop).then((historyId) => {
      expect(historyId).to.equal(11);
      expect(history.stackOnPop_.length).to.equal(12);
      expect(history.stackOnPop_[11]).to.equal(onPop);
      expect(onPop.callCount).to.equal(0);
      return history.pop(historyId).then(() => {
        expect(history.stackIndex_).to.equal(10);
        expect(history.stackOnPop_.length).to.equal(11);
        clock.tick(1);
        expect(onPop.callCount).to.equal(1);
      });
    });
  });

  it("should return and call callback when history popped", () => {
    let onPop = sinon.spy();
    bindingMock
      .expects("push")
      .withExactArgs()
      .returns(Promise.resolve(11))
      .once();
    return history.push(onPop).then((historyId) => {
      expect(onPop.callCount).to.equal(0);
      onStackIndexUpdated(10);
      clock.tick(1);
      expect(history.stackIndex_).to.equal(10);
      expect(history.stackOnPop_.length).to.equal(11);
      clock.tick(1);
      expect(onPop.callCount).to.equal(1);
    });
  });
});

describe("HistoryBindingNatural", () => {
  let sandbox;
  let clock;
  let onStackIndexUpdated;
  let history;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
    onStackIndexUpdated = sinon.spy();
    history = new HistoryBindingNatural_(window);
    history.setOnStackIndexUpdated(onStackIndexUpdated);
  });

  afterEach(() => {
    history.cleanup_();
    history = null;
    clock.restore();
    clock = null;
    sandbox.restore();
    sandbox = null;
  });

  it("should initialize correctly", () => {
    expect(history.stackIndex_).to.equal(window.history.length - 1);
    expect(history.startIndex_).to.equal(window.history.length - 1);
    expect(history.unsupportedState_["AMP.History"]).to.equal(
      window.history.length - 1
    );
    expect(onStackIndexUpdated.callCount).to.equal(0);
  });

  it("should initialize correctly with preexisting state", () => {
    history.origPushState_({ "AMP.History": window.history.length }, undefined);
    history.origReplaceState_(
      { "AMP.History": window.history.length - 2 },
      undefined
    );
    let history2 = new HistoryBindingNatural_(window);
    expect(history2.stackIndex_).to.equal(window.history.length - 2);
    expect(history2.startIndex_).to.equal(window.history.length - 2);
    expect(history.unsupportedState_["AMP.History"]).to.equal(
      window.history.length - 2
    );
    history2.cleanup_();
    history.origReplaceState_(
      { "AMP.History": window.history.length - 1 },
      undefined
    );
    expect(onStackIndexUpdated.callCount).to.equal(0);
  });

  it("should override history.pushState and set its properties", () => {
    window.history.pushState({ a: 111 });
    expect(history.unsupportedState_.a).to.equal(111);
    expect(history.unsupportedState_["AMP.History"]).to.equal(
      window.history.length - 1
    );
    expect(onStackIndexUpdated.callCount).to.equal(1);
    expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(
      window.history.length - 1
    );
  });

  it("should override history.replaceState and set its properties", () => {
    window.history.replaceState({ a: 112 });
    expect(history.unsupportedState_.a).to.equal(112);
    expect(history.unsupportedState_["AMP.History"]).to.equal(
      window.history.length - 1
    );
    expect(onStackIndexUpdated.callCount).to.equal(0);
  });

  it("should push new state in the window.history and notify", () => {
    return history.push().then((stackIndex) => {
      expect(history.stackIndex_).to.equal(stackIndex);
      expect(history.stackIndex_).to.equal(window.history.length - 1);
      expect(history.unsupportedState_["AMP.History"]).to.equal(
        window.history.length - 1
      );
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(
        window.history.length - 1
      );
    });
  });

  it("should pop a state from the window.history and notify", () => {
    return history.push().then((stackIndex) => {
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(
        window.history.length - 1
      );
      let histPromise = listenOncePromise(window, "popstate").then(() => {
        clock.tick(100);
      });
      let popPromise = history.pop(stackIndex);
      return Promise.all([histPromise, popPromise]).then((results) => {
        expect(results[1]).to.equal(window.history.length - 2);
        expect(history.stackIndex_).to.equal(window.history.length - 2);
        expect(history.unsupportedState_["AMP.History"]).to.equal(
          window.history.length - 2
        );
        expect(onStackIndexUpdated.callCount).to.equal(2);
        expect(onStackIndexUpdated.getCall(1).args[0]).to.equal(
          window.history.length - 2
        );
      });
    });
  });

  it("should update its state and notify on history.back", () => {
    return history.push().then((stackIndex) => {
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(
        window.history.length - 1
      );
      let histPromise = listenOncePromise(window, "popstate").then(() => {
        clock.tick(100);
      });
      window.history.go(-1);
      return histPromise.then(() => {
        clock.tick(100);
        expect(history.stackIndex_).to.equal(window.history.length - 2);
        expect(history.unsupportedState_["AMP.History"]).to.equal(
          window.history.length - 2
        );
        expect(onStackIndexUpdated.callCount).to.equal(2);
        expect(onStackIndexUpdated.getCall(1).args[0]).to.equal(
          window.history.length - 2
        );
      });
    });
  });
});

describe("HistoryBindingVirtual", () => {
  let sandbox;
  let clock;
  let onStackIndexUpdated;
  let viewerHistoryPoppedHandler;
  let viewerMock;
  let history;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
    onStackIndexUpdated = sinon.spy();
    viewerHistoryPoppedHandler = undefined;
    let viewer = {
      onHistoryPoppedEvent: (handler) => {
        viewerHistoryPoppedHandler = handler;
        return () => {};
      },
      postPushHistory: (stackIndex) => {},
      postPopHistory: (stackIndex) => {},
    };
    viewerMock = sandbox.mock(viewer);
    history = new HistoryBindingVirtual_(viewer);
    history.setOnStackIndexUpdated(onStackIndexUpdated);
  });

  afterEach(() => {
    viewerMock.verify();
    viewerMock = null;
    history.cleanup_();
    history = null;
    clock.restore();
    clock = null;
    sandbox.restore();
    sandbox = null;
  });

  it("should initialize correctly", () => {
    expect(history.stackIndex_).to.equal(0);
    expect(onStackIndexUpdated.callCount).to.equal(0);
    expect(viewerHistoryPoppedHandler).to.not.equal(undefined);
  });

  it("should push new state to viewer and notify", () => {
    viewerMock.expects("postPushHistory").withExactArgs(1).once();
    return history.push().then((stackIndex) => {
      expect(stackIndex).to.equal(1);
      expect(history.stackIndex_).to.equal(1);
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(1);
    });
  });

  it("should pop a state from the window.history and notify", () => {
    viewerMock.expects("postPushHistory").withExactArgs(1).once();
    viewerMock.expects("postPopHistory").withExactArgs(1).once();
    return history.push().then((stackIndex) => {
      expect(stackIndex).to.equal(1);
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(1);
      return history.pop(stackIndex).then((newStackIndex) => {
        expect(newStackIndex).to.equal(0);
        expect(history.stackIndex_).to.equal(0);
        expect(onStackIndexUpdated.callCount).to.equal(2);
        expect(onStackIndexUpdated.getCall(1).args[0]).to.equal(0);
      });
    });
  });

  it("should update its state and notify on history.back", () => {
    viewerMock.expects("postPushHistory").withExactArgs(1).once();
    return history.push().then((stackIndex) => {
      expect(stackIndex).to.equal(1);
      expect(onStackIndexUpdated.callCount).to.equal(1);
      expect(onStackIndexUpdated.getCall(0).args[0]).to.equal(1);
      viewerHistoryPoppedHandler({ newStackIndex: 0 });
      clock.tick(1);
      expect(history.stackIndex_).to.equal(0);
      expect(onStackIndexUpdated.callCount).to.equal(2);
      expect(onStackIndexUpdated.getCall(1).args[0]).to.equal(0);
    });
  });
});
