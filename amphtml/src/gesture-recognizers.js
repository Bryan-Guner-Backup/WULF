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

import { GestureRecognizer } from "./gesture";
import { assert } from "./asserts";
import { calcVelocity } from "./motion";
import { timer } from "./timer";

/**
 * A "tap" gesture.
 * @typedef {{
 *   clientX: number,
 *   clientY: number
 * }}
 */
var Tap;

/**
 * Recognizes "tap" gestures.
 * @extends {GestureRecognizer<Tap>}
 */
export class TapRecognizer extends GestureRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("tap", manager);

    /** @private {number} */
    this.startX_ = 0;

    /** @private {number} */
    this.startY_ = 0;

    /** @private {number} */
    this.lastX_ = 0;

    /** @private {number} */
    this.lastY_ = 0;
  }

  /** @override */
  onTouchStart(e) {
    let touches = e.touches;
    if (!touches || touches.length != 1) {
      return false;
    }
    this.startX_ = touches[0].clientX;
    this.startY_ = touches[0].clientY;
    return true;
  }

  /** @override */
  onTouchMove(e) {
    let touches = e.changedTouches || e.touches;
    if (touches && touches.length == 1) {
      this.lastX_ = touches[0].clientX;
      this.lastY_ = touches[0].clientY;
      let dx = Math.abs(this.lastX_ - this.startX_) >= 8;
      let dy = Math.abs(this.lastY_ - this.startY_) >= 8;
      if (dx || dy) {
        return false;
      }
    }
    return true;
  }

  /** @override */
  onTouchEnd(e) {
    this.signalReady(0);
  }

  /** @override */
  acceptStart() {
    this.signalEmit({ clientX: this.lastX_, clientY: this.lastY_ }, null);
    this.signalEnd();
  }
}

/**
 * A "doubletap" gesture.
 * @typedef {{
 *   clientX: number,
 *   clientY: number
 * }}
 */
var Doubletap;

/**
 * Recognizes a "doubletap" gesture. This gesture will block a single "tap"
 * for about 300ms while it's expecting the second "tap".
 * @extends {GestureRecognizer<Doubletap>}
 */
export class DoubletapRecognizer extends GestureRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("doubletap", manager);

    /** @private {number} */
    this.startX_ = 0;

    /** @private {number} */
    this.startY_ = 0;

    /** @private {number} */
    this.lastX_ = 0;

    /** @private {number} */
    this.lastY_ = 0;

    /** @private {number} */
    this.tapCount_ = 0;
  }

  /** @override */
  onTouchStart(e) {
    if (this.tapCount_ > 1) {
      return false;
    }
    let touches = e.touches;
    if (!touches || touches.length != 1) {
      return false;
    }
    this.startX_ = touches[0].clientX;
    this.startY_ = touches[0].clientY;
    return true;
  }

  /** @override */
  onTouchMove(e) {
    let touches = e.changedTouches || e.touches;
    if (touches && touches.length == 1) {
      this.lastX_ = touches[0].clientX;
      this.lastY_ = touches[0].clientY;
      let dx = Math.abs(this.lastX_ - this.startX_) >= 8;
      let dy = Math.abs(this.lastY_ - this.startY_) >= 8;
      if (dx || dy) {
        this.acceptCancel();
        return false;
      }
    }
    return true;
  }

  /** @override */
  onTouchEnd(e) {
    this.tapCount_++;
    if (this.tapCount_ < 2) {
      this.signalPending(300);
    } else {
      this.signalReady(0);
    }
  }

  /** @override */
  acceptStart() {
    this.tapCount_ = 0;
    this.signalEmit({ clientX: this.lastX_, clientY: this.lastY_ }, null);
    this.signalEnd();
  }

  /** @override */
  acceptCancel() {
    this.tapCount_ = 0;
  }
}

/**
 * A "swipe-xy", "swipe-x" or "swipe-y" gesture. A number of these gestures
 * may be emitted for a single touch series.
 * @typedef {{
 *   first: boolean,
 *   last: boolean,
 *   deltaX: number,
 *   deltaY: number,
 *   velocityX: number,
 *   velocityY: number
 * }}
 */
var Swipe;

/**
 * Recognizes swipe gestures. This gesture will yield about 10ms to other
 * gestures.
 * @extends {GestureRecognizer<Swipe>}
 */
class SwipeRecognizer extends GestureRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(type, manager, horiz, vert) {
    super(type, manager);

    /** @private {boolean} */
    this.horiz_ = horiz;

    /** @private {boolean} */
    this.vert_ = vert;

    /** @private {boolean} */
    this.eventing_ = false;

    /** @private {number} */
    this.startX_ = 0;

    /** @private {number} */
    this.startY_ = 0;

    /** @private {number} */
    this.lastX_ = 0;

    /** @private {number} */
    this.lastY_ = 0;

    /** @private {number} */
    this.prevX_ = 0;

    /** @private {number} */
    this.prevY_ = 0;

    /** @private {time} */
    this.startTime_ = 0;

    /** @private {time} */
    this.lastTime_ = 0;

    /** @private {time} */
    this.prevTime_ = 0;

    /** @private {number} */
    this.velocityX_ = 0;

    /** @private {number} */
    this.velocityY_ = 0;
  }

  /** @override */
  onTouchStart(e) {
    let touches = e.touches;
    if (!touches || touches.length != 1) {
      return false;
    }
    this.startTime_ = timer.now();
    this.startX_ = touches[0].clientX;
    this.startY_ = touches[0].clientY;
    return true;
  }

  /** @override */
  onTouchMove(e) {
    let touches = e.changedTouches || e.touches;
    if (touches && touches.length == 1) {
      let x = touches[0].clientX;
      let y = touches[0].clientY;
      this.lastX_ = x;
      this.lastY_ = y;
      if (this.eventing_) {
        this.emit_(false, false, e);
      } else {
        let dx = Math.abs(x - this.startX_);
        let dy = Math.abs(y - this.startY_);
        // Swipe is penalized slightly since it's one of the least demanding
        // gesture, thus -10 in signalReady.
        if (this.horiz_ && this.vert_) {
          if (dx >= 8 || dy >= 8) {
            this.signalReady(-10);
          }
        } else if (this.horiz_) {
          if (dx >= 8 && dx > dy) {
            this.signalReady(-10);
          } else if (dy >= 8) {
            return false;
          }
        } else if (this.vert_) {
          if (dy >= 8 && dy > dx) {
            this.signalReady(-10);
          } else if (dx >= 8) {
            return false;
          }
        } else {
          return false;
        }
      }
    }
    return true;
  }

  /** @override */
  onTouchEnd(e) {
    this.end_(e);
  }

  /** @override */
  acceptStart() {
    this.eventing_ = true;
    // Reset start coordinates to where the gesture began to avoid visible
    // jump, but preserve them as "prev" coordinates to calculate the right
    // velocity.
    this.prevX_ = this.startX_;
    this.prevY_ = this.startY_;
    this.prevTime_ = this.startTime_;
    this.startX_ = this.lastX_;
    this.startY_ = this.lastY_;
    this.emit_(true, false, null);
  }

  /** @override */
  acceptCancel() {
    this.eventing_ = false;
  }

  /**
   * @param {boolean} first
   * @param {boolean} last
   * @param {?Event} event
   * @private
   */
  emit_(first, last, event) {
    this.lastTime_ = timer.now();
    let deltaTime = this.lastTime_ - this.prevTime_;
    // It's often that `touchend` arrives on the next frame. These should
    // be ignored to avoid a significant velocity downgrade.
    if ((!last && deltaTime > 4) || (last && deltaTime > 16)) {
      this.velocityX_ = calcVelocity(
        this.lastX_ - this.prevX_,
        deltaTime,
        this.velocityX_
      );
      this.velocityY_ = calcVelocity(
        this.lastY_ - this.prevY_,
        deltaTime,
        this.velocityY_
      );
      this.velocityX_ = Math.abs(this.velocityX_) > 1e-4 ? this.velocityX_ : 0;
      this.velocityY_ = Math.abs(this.velocityY_) > 1e-4 ? this.velocityY_ : 0;
      this.prevX_ = this.lastX_;
      this.prevY_ = this.lastY_;
      this.prevTime_ = this.lastTime_;
    }

    this.signalEmit(
      {
        first: first,
        last: last,
        time: this.lastTime_,
        deltaX: this.horiz_ ? this.lastX_ - this.startX_ : 0,
        deltaY: this.vert_ ? this.lastY_ - this.startY_ : 0,
        velocityX: this.horiz_ ? this.velocityX_ : 0,
        velocityY: this.vert_ ? this.velocityY_ : 0,
      },
      event
    );
  }

  /**
   * @param {?Event} event
   * @private
   */
  end_(event) {
    if (this.eventing_) {
      this.eventing_ = false;
      this.emit_(false, true, event);
      this.signalEnd();
    }
  }
}

/**
 * Recognizes "swipe-xy" gesture. Yields about 10ms to other gestures.
 */
export class SwipeXYRecognizer extends SwipeRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("swipe-xy", manager, true, true);
  }
}

/**
 * Recognizes "swipe-x" gesture. Yields about 10ms to other gestures.
 */
export class SwipeXRecognizer extends SwipeRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("swipe-x", manager, true, false);
  }
}

/**
 * Recognizes "swipe-y" gesture. Yields about 10ms to other gestures.
 */
export class SwipeYRecognizer extends SwipeRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("swipe-y", manager, false, true);
  }
}

/**
 * A "tapzoom" gesture. It has a center, delta off the center center and
 * the velocity of moving away from the center.
 * @typedef {{
 *   first: boolean,
 *   last: boolean,
 *   centerClientX: number,
 *   centerClientY: number,
 *   deltaX: number,
 *   deltaY: number,
 *   velocityX: number,
 *   velocityY: number
 * }}
 */
var Tapzoom;

/**
 * Recognizes a "tapzoom" gesture. This gesture will block other gestures
 * for about 400ms after first "tap" while it's expecting swipe.
 * @extends {GestureRecognizer<Tapzoom>}
 */
export class TapzoomRecognizer extends GestureRecognizer {
  /**
   * @param {!Gestures} manager
   */
  constructor(manager) {
    super("tapzoom", manager);

    /** @private {boolean} */
    this.eventing_ = false;

    /** @private {number} */
    this.startX_ = 0;

    /** @private {number} */
    this.startY_ = 0;

    /** @private {number} */
    this.lastX_ = 0;

    /** @private {number} */
    this.lastY_ = 0;

    /** @private {number} */
    this.tapX_ = 0;

    /** @private {number} */
    this.tapY_ = 0;

    /** @private {number} */
    this.tapCount_ = 0;

    /** @private {number} */
    this.prevX_ = 0;

    /** @private {number} */
    this.prevY_ = 0;

    /** @private {time} */
    this.startTime_ = 0;

    /** @private {time} */
    this.lastTime_ = 0;

    /** @private {time} */
    this.prevTime_ = 0;

    /** @private {number} */
    this.velocityX_ = 0;

    /** @private {number} */
    this.velocityY_ = 0;
  }

  /** @override */
  onTouchStart(e) {
    if (this.eventing_) {
      return false;
    }
    let touches = e.touches;
    if (!touches || touches.length != 1) {
      return false;
    }
    this.startX_ = touches[0].clientX;
    this.startY_ = touches[0].clientY;
    return true;
  }

  /** @override */
  onTouchMove(e) {
    let touches = e.changedTouches || e.touches;
    if (touches && touches.length == 1) {
      this.lastX_ = touches[0].clientX;
      this.lastY_ = touches[0].clientY;
      if (this.eventing_) {
        this.emit_(false, false, e);
      } else {
        let dx = Math.abs(this.lastX_ - this.startX_) >= 8;
        let dy = Math.abs(this.lastY_ - this.startY_) >= 8;
        if (dx || dy) {
          if (this.tapCount_ == 0) {
            this.acceptCancel();
            return false;
          } else {
            this.signalReady(0);
          }
        }
      }
    }
    return true;
  }

  /** @override */
  onTouchEnd(e) {
    if (this.eventing_) {
      this.end_(e);
      return;
    }

    this.tapCount_++;
    if (this.tapCount_ == 1) {
      this.signalPending(400);
      this.tapX_ = this.lastX_;
      this.tapY_ = this.lastY_;
      return;
    }

    this.acceptCancel();
  }

  /** @override */
  acceptStart() {
    this.tapCount_ = 0;
    this.eventing_ = true;
    this.emit_(true, false, null);
  }

  /** @override */
  acceptCancel() {
    this.tapCount_ = 0;
    this.eventing_ = false;
  }

  /**
   * @param {boolean} first
   * @param {boolean} last
   * @param {?Event} event
   * @private
   */
  emit_(first, last, event) {
    this.lastTime_ = timer.now();
    if (first) {
      this.startTime_ = this.lastTime_;
      this.velocityX_ = this.velocityY_ = 0;
    } else if (this.lastTime_ - this.prevTime_ > 2) {
      this.velocityX_ = calcVelocity(
        this.lastX_ - this.prevX_,
        this.lastTime_ - this.prevTime_,
        this.velocityX_
      );
      this.velocityY_ = calcVelocity(
        this.lastY_ - this.prevY_,
        this.lastTime_ - this.prevTime_,
        this.velocityY_
      );
    }
    this.prevX_ = this.lastX_;
    this.prevY_ = this.lastY_;
    this.prevTime_ = this.lastTime_;

    this.signalEmit(
      {
        first: first,
        last: last,
        centerClientX: this.startX_,
        centerClientY: this.startY_,
        deltaX: this.lastX_ - this.startX_,
        deltaY: this.lastY_ - this.startY_,
        velocityX: this.velocityX_,
        velocityY: this.velocityY_,
      },
      event
    );
  }

  /**
   * @param {?Event} event
   * @private
   */
  end_(event) {
    if (this.eventing_) {
      this.eventing_ = false;
      this.emit_(false, true, event);
      this.signalEnd();
    }
  }
}
