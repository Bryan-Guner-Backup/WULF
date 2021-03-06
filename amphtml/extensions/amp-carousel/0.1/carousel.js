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

import { Animation } from "../../../src/animation";
import { BaseCarousel } from "./base-carousel";
import { Gestures } from "../../../src/gesture";
import { Layout } from "../../../src/layout";
import { SwipeXRecognizer } from "../../../src/gesture-recognizers";
import { bezierCurve } from "../../../src/curve";
import { continueMotion } from "../../../src/motion";
import * as st from "../../../src/style";
import * as tr from "../../../src/transition";

export class AmpCarousel extends BaseCarousel {
  /** @override */
  isLayoutSupported(layout) {
    return layout == Layout.FIXED || layout == Layout.FIXED_HEIGHT;
  }

  /** @override */
  buildCarousel() {
    /** @private {number} */
    this.pos_ = 0;

    /** @private {!Array<!Element>} */
    this.cells_ = this.getRealChildren();

    /** @private {!Element} */
    this.container_ = document.createElement("div");
    st.setStyles(this.container_, {
      whiteSpace: "nowrap",
      position: "absolute",
      zIndex: 1,
      top: 0,
      left: 0,
      bottom: 0,
    });
    this.element.appendChild(this.container_);

    this.cells_.forEach((cell) => {
      this.setAsOwner(cell);
      cell.style.display = "inline-block";
      if (cell != this.cells_[0]) {
        // TODO(dvoytenko): this has to be customizable
        cell.style.marginLeft = "8px";
      }
      this.container_.appendChild(cell);
    });
  }

  /** @override */
  layoutCallback() {
    this.doLayout_(this.pos_);
    this.preloadNext_(this.pos_, 1);
    this.setControlsState();
    return Promise.resolve();
  }

  /** @override */
  viewportCallback(inViewport) {
    this.updateInViewport_(this.pos_, this.pos_);
  }

  /** @override */
  goCallback(dir, animate) {
    var newPos = this.nextPos_(this.pos_, dir);
    if (newPos != this.pos_) {
      var oldPos = this.pos_;
      this.pos_ = newPos;

      if (!animate) {
        this.commitSwitch_(oldPos, newPos);
      } else {
        Animation.animate(
          tr.setStyles(this.container_, {
            transform: tr.translateX(tr.numeric(-oldPos, -newPos)),
          }),
          200,
          "ease-out"
        ).thenAlways(() => {
          this.commitSwitch_(oldPos, newPos);
        });
      }
    }
  }

  /**
   * @param {number} oldPos
   * @param {number} newPos
   * @private
   */
  commitSwitch_(oldPos, newPos) {
    st.setStyles(this.container_, {
      transform: st.translateX(-newPos),
    });
    this.doLayout_(newPos);
    this.preloadNext_(newPos, Math.sign(newPos - oldPos));
    this.updateInViewport_(newPos, oldPos);
  }

  /**
   * @param {number} pos
   * @param {number} dir
   * @private
   */
  nextPos_(pos, dir) {
    let containerWidth = this.element./*OK*/ offsetWidth;
    let fullWidth = this.container_./*OK*/ scrollWidth;
    let newPos = pos + dir * containerWidth;
    if (newPos < 0) {
      return 0;
    }
    if (fullWidth >= containerWidth && newPos > fullWidth - containerWidth) {
      return fullWidth - containerWidth;
    }
    return newPos;
  }

  /**
   * @param {number} pos
   * @param {function()} callback
   * @private
   */
  withinWindow_(pos, callback) {
    let containerWidth = this.getLayoutWidth();
    for (let i = 0; i < this.cells_.length; i++) {
      let cell = this.cells_[i];
      if (
        cell./*OK*/ offsetLeft + cell./*OK*/ offsetWidth >= pos &&
        cell./*OK*/ offsetLeft <= pos + containerWidth
      ) {
        callback(cell);
      }
    }
  }

  /**
   * @param {number} pos
   * @private
   */
  doLayout_(pos) {
    this.withinWindow_(pos, (cell) => {
      this.scheduleLayout(cell);
    });
  }

  /**
   * @param {number} pos
   * @param {number} dir
   * @private
   */
  preloadNext_(pos, dir) {
    var nextPos = this.nextPos_(pos, dir);
    if (nextPos != pos) {
      this.withinWindow_(nextPos, (cell) => {
        this.schedulePreload(cell);
      });
    }
  }

  /**
   * @param {number} newPos
   * @param {number} oldPos
   * @private
   */
  updateInViewport_(newPos, oldPos) {
    let seen = [];
    this.withinWindow_(newPos, (cell) => {
      seen.push(cell);
      this.updateInViewport(cell, true);
    });
    if (oldPos != newPos) {
      this.withinWindow_(oldPos, (cell) => {
        if (seen.indexOf(cell) == -1) {
          this.updateInViewport(cell, false);
        }
      });
    }
  }

  /** @override */
  setupGestures() {
    /** @private {number} */
    this.startPos_ = 0;
    /** @private {number} */
    this.minPos_ = 0;
    /** @private {number} */
    this.maxPos_ = 0;
    /** @private {number} */
    this.extent_ = 0;
    /** @private {?Motion} */
    this.motion_ = null;

    let gestures = Gestures.get(this.element);
    gestures.onGesture(SwipeXRecognizer, (e) => {
      if (e.data.first) {
        this.onSwipeStart_(e.data);
      }
      this.onSwipe_(e.data);
      if (e.data.last) {
        this.onSwipeEnd_(e.data);
      }
    });
    gestures.onPointerDown(() => {
      if (this.motion_) {
        this.motion_.halt();
        this.motion_ = null;
      }
    });
  }

  /**
   * @param {!Swipe} swipe
   * @private
   */
  onSwipeStart_(swipe) {
    this.updateBounds_();
    this.startPos_ = this.pos_;
    this.motion_ = null;
  }

  /**
   * @param {!Swipe} swipe
   * @private
   */
  onSwipe_(swipe) {
    this.pos_ = this.boundPos_(this.startPos_ - swipe.deltaX, true);
    st.setStyles(this.container_, {
      transform: st.translateX(-this.pos_),
    });
    if (Math.abs(swipe.velocityX) < 0.05) {
      this.commitSwitch_(this.startPos_, this.pos_);
    }
  }

  /**
   * @param {!Swipe} swipe
   * @return {!Promise}
   * @private
   */
  onSwipeEnd_(swipe) {
    let promise;
    if (Math.abs(swipe.velocityX) > 0.1) {
      this.motion_ = continueMotion(
        this.pos_,
        0,
        -swipe.velocityX,
        0,
        (x, y) => {
          let newPos =
            (this.boundPos_(x, true) + this.boundPos_(x, false)) * 0.5;
          if (Math.abs(newPos - this.pos_) <= 1) {
            // Hit the wall: stop motion.
            return false;
          }
          this.pos_ = newPos;
          st.setStyles(this.container_, {
            transform: st.translateX(-this.pos_),
          });
          return true;
        }
      );
      promise = this.motion_.thenAlways();
    } else {
      promise = Promise.resolve();
    }
    return promise
      .then(() => {
        let newPos = this.boundPos_(this.pos_, false);
        if (Math.abs(newPos - this.pos_) < 1) {
          return undefined;
        }
        let posFunc = tr.numeric(this.pos_, newPos);
        return Animation.animate(
          (time) => {
            this.pos_ = posFunc(time);
            st.setStyles(this.container_, {
              transform: st.translateX(-this.pos_),
            });
          },
          250,
          bezierCurve(0.4, 0, 0.2, 1.4)
        ).thenAlways();
      })
      .then(() => {
        this.commitSwitch_(this.startPos_, this.pos_);
        this.startPos_ = this.pos_;
        this.motion_ = null;
      });
  }

  /** @private */
  updateBounds_() {
    let containerWidth = this.element./*OK*/ offsetWidth;
    let scrollWidth = this.container_./*OK*/ scrollWidth;
    this.minPos_ = 0;
    this.maxPos_ = Math.max(scrollWidth - containerWidth, 0);
    this.extent_ = Math.min(containerWidth * 0.4, 200);
  }

  /**
   * @param {number} pos
   * @param {boolean} allowExtent
   * @return {number}
   * @private
   */
  boundPos_(pos, allowExtent) {
    let extent = allowExtent ? this.extent_ : 0;
    return Math.min(
      this.maxPos_ + extent,
      Math.max(this.minPos_ - extent, pos)
    );
  }

  /** @override */
  hasPrev() {
    return this.pos_ != 0;
  }

  /** @override */
  hasNext() {
    let containerWidth = this.getLayoutWidth();
    let scrollWidth = this.container_./*OK*/ scrollWidth;
    let maxPos = Math.max(scrollWidth - containerWidth, 0);
    return this.pos_ != maxPos;
  }
}
