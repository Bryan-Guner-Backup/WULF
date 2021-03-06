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
import { Gestures } from "../../../src/gesture";
import {
  DoubletapRecognizer,
  SwipeXYRecognizer,
  TapRecognizer,
  TapzoomRecognizer,
} from "../../../src/gesture-recognizers";
import { Layout } from "../../../src/layout";
import { assert } from "../../../src/asserts";
import { bezierCurve } from "../../../src/curve";
import { continueMotion } from "../../../src/motion";
import { historyFor } from "../../../src/history";
import { isLoaded, loadPromise } from "../../../src/event-helper";
import {
  layoutRectFromDomRect,
  layoutRectLtwh,
  moveLayoutRect,
} from "../../../src/layout-rect";
import { parseSrcset } from "../../../src/srcset";
import { timer } from "../../../src/timer";
import * as dom from "../../../src/dom";
import * as st from "../../../src/style";
import * as tr from "../../../src/transition";

/** @private @const {!Object<string, boolean>} */
const SUPPORTED_ELEMENTS_ = {
  "amp-img": true,
  "amp-anim": true,
};

/** @private @const {!Curve} */
const ENTER_CURVE_ = bezierCurve(0.4, -0.3, 0.2, 1);

/** @private @const {!Curve} */
const EXIT_CURVE_ = bezierCurve(0.4, 0, 0.2, 1);

/** @private @const {!Curve} */
const PAN_ZOOM_CURVE_ = bezierCurve(0.4, 0, 0.2, 1.4);

/**
 * This class is responsible providing all operations necessary for viewing
 * an image, such as full-bleed display, zoom and pan, etc.
 * @package  Visible for testing only!
 * TODO(dvoytenko): move to the separate file once build system is ready.
 */
export class ImageViewer {
  /**
   * @param {!AmpImageLightbox} lightbox
   */
  constructor(lightbox) {
    /** @private {!AmpImageLightbox} */
    this.lightbox_ = lightbox;

    /** @private {!Element} */
    this.viewer_ = document.createElement("div");
    this.viewer_.classList.add("-amp-image-lightbox-viewer");

    /** @private {!Element} */
    this.image_ = document.createElement("img");
    this.image_.classList.add("-amp-image-lightbox-viewer-image");
    this.viewer_.appendChild(this.image_);

    /** @private {?Srcset} */
    this.srcset_ = null;

    /** @private {number} */
    this.sourceWidth_ = 0;

    /** @private {number} */
    this.sourceHeight_ = 0;

    /** @private {!LayoutRect} */
    this.viewerBox_ = layoutRectLtwh(0, 0, 0, 0);

    /** @private {!LayoutRect} */
    this.imageBox_ = layoutRectLtwh(0, 0, 0, 0);

    /** @private {number} */
    this.scale_ = 1;
    /** @private {number} */
    this.startScale_ = 1;
    /** @private {number} */
    this.maxSeenScale_ = 1;
    /** @private {number} */
    this.minScale_ = 1;
    /** @private {number} */
    this.maxScale_ = 2;

    /** @private {number} */
    this.startX_ = 0;
    /** @private {number} */
    this.startY_ = 0;
    /** @private {number} */
    this.posX_ = 0;
    /** @private {number} */
    this.posY_ = 0;
    /** @private {number} */
    this.minX_ = 0;
    /** @private {number} */
    this.minY_ = 0;
    /** @private {number} */
    this.maxX_ = 0;
    /** @private {number} */
    this.maxY_ = 0;

    /** @private {?Motion} */
    this.motion_ = null;

    this.setupGestures_();
  }

  /**
   * Returns the root element of the image viewer.
   * @return {!Element}
   */
  getElement() {
    return this.viewer_;
  }

  /**
   * Returns the img element of the image viewer.
   * @return {!Element}
   */
  getImage() {
    return this.image_;
  }

  /**
   * Returns the boundaries of the viewer.
   * @return {!LayoutRect}
   */
  getViewerBox() {
    return this.viewerBox_;
  }

  /**
   * Returns the boundaries of the image element.
   * @return {!LayoutRect}
   */
  getImageBox() {
    return this.imageBox_;
  }

  /**
   * Returns the boundaries of the image element with the offset if it was
   * moved by a gesture.
   * @return {!LayoutRect}
   */
  getImageBoxWithOffset() {
    if (this.posX_ == 0 && this.posY_ == 0) {
      return this.imageBox_;
    }
    return moveLayoutRect(this.imageBox_, this.posX_, this.posY_);
  }

  /**
   * Resets the image viewer to the initial state.
   */
  reset() {
    this.image_.setAttribute("src", "");
    this.srcset_ = null;
    this.imageBox_ = layoutRectLtwh(0, 0, 0, 0);
    this.sourceWidth_ = 0;
    this.sourceHeight_ = 0;

    this.maxSeenScale_ = 1;
    this.scale_ = 1;
    this.startScale_ = 1;
    this.maxScale_ = 2;

    this.startX_ = 0;
    this.startY_ = 0;
    this.posX_ = 0;
    this.posY_ = 0;
    this.minX_ = 0;
    this.minY_ = 0;
    this.maxX_ = 0;
    this.maxY_ = 0;

    if (this.motion_) {
      this.motion_.halt();
    }
    this.motion_ = null;
  }

  /**
   * Initializes the image viewer to the target image element such as
   * "amp-img". The target image element may or may not yet have the img
   * element initialized.
   * @param {!Element} sourceElement
   * @param {?Element} sourceImage
   */
  init(sourceElement, sourceImage) {
    this.sourceWidth_ = sourceElement./*OK*/ offsetWidth;
    this.sourceHeight_ = sourceElement./*OK*/ offsetHeight;
    this.srcset_ = parseSrcset(
      sourceElement.getAttribute("srcset") || sourceElement.getAttribute("src")
    );
    if (sourceImage && isLoaded(sourceImage) && sourceImage.src) {
      // Set src provisionally to the known loaded value for fast display.
      // It will be updated later.
      this.image_.setAttribute("src", sourceImage.src);
    }
  }

  /**
   * Measures the image viewer and image sizes and positioning.
   * @return {!Promise}
   */
  measure() {
    this.viewerBox_ = layoutRectFromDomRect(
      this.viewer_.getBoundingClientRect()
    );

    let sf = Math.min(
      this.viewerBox_.width / this.sourceWidth_,
      this.viewerBox_.height / this.sourceHeight_
    );
    let width = Math.min(this.sourceWidth_ * sf, this.viewerBox_.width);
    let height = Math.min(this.sourceHeight_ * sf, this.viewerBox_.height);

    // TODO(dvoytenko): This is to reduce very small expansions that often
    // look like a stutter. To be evaluated if this is still the right
    // idea.
    if (width - this.sourceWidth_ <= 16) {
      width = this.sourceWidth_;
      height = this.sourceHeight_;
    }

    this.imageBox_ = layoutRectLtwh(
      Math.round((this.viewerBox_.width - width) / 2),
      Math.round((this.viewerBox_.height - height) / 2),
      Math.round(width),
      Math.round(height)
    );

    st.setStyles(this.image_, {
      top: st.px(this.imageBox_.top),
      left: st.px(this.imageBox_.left),
      width: st.px(this.imageBox_.width),
      height: st.px(this.imageBox_.height),
    });

    // Reset zoom and pan.
    this.startScale_ = this.scale_ = 1;
    this.startX_ = this.posX_ = 0;
    this.startY_ = this.posY_ = 0;
    this.updatePanZoomBounds_(this.scale_);
    this.updatePanZoom_();

    return this.updateSrc_();
  }

  /**
   * @return {!Promise}
   * @private
   */
  updateSrc_() {
    this.maxSeenScale_ = Math.max(this.maxSeenScale_, this.scale_);
    let width = this.imageBox_.width * this.maxSeenScale_;
    let src = this.srcset_.select(width, this.lightbox_.getDpr()).url;
    if (src == this.image_.getAttribute("src")) {
      return Promise.resolve();
    }
    // Notice that we will wait until the next event cycle to set the "src".
    // This ensures that the already available image will show immediately
    // and then naturally upgrade to a higher quality image.
    return timer.promise(1).then(() => {
      this.image_.setAttribute("src", src);
      return loadPromise(this.image_);
    });
  }

  /** @private */
  setupGestures_() {
    let gestures = Gestures.get(this.image_);

    // Toggle viewer mode.
    gestures.onGesture(TapRecognizer, () => {
      this.lightbox_.toggleViewMode();
    });

    // Movable.
    gestures.onGesture(SwipeXYRecognizer, (e) => {
      this.onMove_(e.data.deltaX, e.data.deltaY, false);
      if (e.data.last) {
        this.onMoveRelease_(e.data.velocityX, e.data.velocityY);
      }
    });
    gestures.onPointerDown(() => {
      if (this.motion_) {
        this.motion_.halt();
      }
    });

    // Zoomable.
    gestures.onGesture(DoubletapRecognizer, (e) => {
      let newScale;
      if (this.scale_ == 1) {
        newScale = this.maxScale_;
      } else {
        newScale = this.minScale_;
      }
      let deltaX = this.viewerBox_.width / 2 - e.data.clientX;
      let deltaY = this.viewerBox_.height / 2 - e.data.clientY;
      this.onZoom_(newScale, deltaX, deltaY, true).then(() => {
        return this.onZoomRelease_(0, 0, 0, 0, 0, 0);
      });
    });
    gestures.onGesture(TapzoomRecognizer, (e) => {
      this.onZoomInc_(
        e.data.centerClientX,
        e.data.centerClientY,
        e.data.deltaX,
        e.data.deltaY
      );
      if (e.data.last) {
        this.onZoomRelease_(
          e.data.centerClientX,
          e.data.centerClientY,
          e.data.deltaX,
          e.data.deltaY,
          e.data.velocityY,
          e.data.velocityY
        );
      }
    });
  }

  /**
   * Returns value bound to min and max values +/- extent.
   * @param {number} v
   * @param {number} min
   * @param {number} max
   * @param {number} extent
   * @return {number}
   * @private
   */
  boundValue_(v, min, max, extent) {
    return Math.max(min - extent, Math.min(max + extent, v));
  }

  /**
   * Returns the scale within the allowed range with possible extent.
   * @param {number} s
   * @param {boolean} allowExtent
   * @return {number}
   * @private
   */
  boundScale_(s, allowExtent) {
    return this.boundValue_(
      s,
      this.minScale_,
      this.maxScale_,
      allowExtent ? 0.25 : 0
    );
  }

  /**
   * Returns the X position within the allowed range with possible extent.
   * @param {number} x
   * @param {boolean} allowExtent
   * @return {number}
   * @private
   */
  boundX_(x, allowExtent) {
    return this.boundValue_(
      x,
      this.minX_,
      this.maxX_,
      allowExtent && this.scale_ > 1 ? this.viewerBox_.width * 0.25 : 0
    );
  }

  /**
   * Returns the Y position within the allowed range with possible extent.
   * @param {number} y
   * @param {boolean} allowExtent
   * @return {number}
   * @private
   */
  boundY_(y, allowExtent) {
    return this.boundValue_(
      y,
      this.minY_,
      this.maxY_,
      allowExtent ? this.viewerBox_.height * 0.25 : 0
    );
  }

  /**
   * Updates X/Y bounds based on the provided scale value. The min/max bounds
   * are calculated to allow full pan of the image regardless of the scale
   * value.
   * @param {number} scale
   * @private
   */
  updatePanZoomBounds_(scale) {
    let maxY = 0;
    let minY = 0;
    let dh = this.viewerBox_.height - this.imageBox_.height * scale;
    if (dh >= 0) {
      minY = maxY = 0;
    } else {
      minY = dh / 2;
      maxY = -minY;
    }

    let maxX = 0;
    let minX = 0;
    let dw = this.viewerBox_.width - this.imageBox_.width * scale;
    if (dw >= 0) {
      minX = maxX = 0;
    } else {
      minX = dw / 2;
      maxX = -minX;
    }

    this.minX_ = minX;
    this.minY_ = minY;
    this.maxX_ = maxX;
    this.maxY_ = maxY;
  }

  /**
   * Updates pan/zoom of the image based on the current values.
   * @private
   */
  updatePanZoom_() {
    st.setStyles(this.image_, {
      transform:
        st.translate(this.posX_, this.posY_) + " " + st.scale(this.scale_),
    });
    if (this.scale_ != 1) {
      this.lightbox_.toggleViewMode(true);
    }
  }

  /**
   * Performs a one-step or an animated motion (panning).
   * @param {number} deltaX
   * @param {number} deltaY
   * @param {boolean} animate
   * @private
   */
  onMove_(deltaX, deltaY, animate) {
    let newPosX = this.boundX_(this.startX_ + deltaX, true);
    let newPosY = this.boundY_(this.startY_ + deltaY, true);
    this.set_(this.scale_, newPosX, newPosY, animate);
  }

  /**
   * Performs actions once the motion gesture has been complete. The motion
   * may continue based on the final velocity.
   * @param {number} veloX
   * @param {number} veloY
   * @private
   */
  onMoveRelease_(veloX, veloY) {
    let deltaY = this.posY_ - this.startY_;
    if (this.scale_ == 1 && Math.abs(deltaY) > 10) {
      this.lightbox_.close();
      return;
    }

    // Continue motion.
    this.motion_ = continueMotion(
      this.posX_,
      this.posY_,
      veloX,
      veloY,
      (x, y) => {
        let newPosX = this.boundX_(x, true);
        let newPosY = this.boundY_(y, true);
        if (
          Math.abs(newPosX - this.posX_) < 1 &&
          Math.abs(newPosY - this.posY_) < 1
        ) {
          // Hit the wall: stop motion.
          return false;
        }
        this.set_(this.scale_, newPosX, newPosY, false);
        return true;
      }
    );

    // Snap back.
    this.motion_.thenAlways(() => {
      this.motion_ = null;
      return this.release_();
    });
  }

  /**
   * Performs a one-step zoom action.
   * @param {number} centerClientX
   * @param {number} centerClientY
   * @param {number} deltaX
   * @param {number} deltaY
   * @private
   */
  onZoomInc_(centerClientX, centerClientY, deltaX, deltaY) {
    let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    let zoomSign =
      Math.abs(deltaY) > Math.abs(deltaX)
        ? Math.sign(deltaY)
        : Math.sign(-deltaX);
    if (zoomSign == 0) {
      return;
    }

    let newScale = this.startScale_ * (1 + (zoomSign * dist) / 100);
    let deltaCenterX = this.viewerBox_.width / 2 - centerClientX;
    let deltaCenterY = this.viewerBox_.height / 2 - centerClientY;
    deltaX = Math.min(deltaCenterX, deltaCenterX * (dist / 100));
    deltaY = Math.min(deltaCenterY, deltaCenterY * (dist / 100));
    this.onZoom_(newScale, deltaX, deltaY, false);
  }

  /**
   * Performs a one-step or an animated zoom action.
   * @param {number} scale
   * @param {number} deltaX
   * @param {number} deltaY
   * @param {boolean} animate
   * @return {!Promise}
   * @private
   */
  onZoom_(scale, deltaX, deltaY, animate) {
    let newScale = this.boundScale_(scale, true);
    if (newScale == this.scale_) {
      return;
    }

    this.updatePanZoomBounds_(newScale);

    let newPosX = this.boundX_(this.startX_ + deltaX * newScale, false);
    let newPosY = this.boundY_(this.startY_ + deltaY * newScale, false);
    return this.set_(newScale, newPosX, newPosY, animate);
  }

  /**
   * Performs actions after the gesture that was performing zooming has been
   * released. The zooming may continue based on the final velocity.
   * @param {number} centerClientX
   * @param {number} centerClientY
   * @param {number} deltaX
   * @param {number} deltaY
   * @param {number} veloX
   * @param {number} veloY
   * @return {!Promise}
   * @private
   */
  onZoomRelease_(centerClientX, centerClientY, deltaX, deltaY, veloX, veloY) {
    let promise;
    if (veloX == 0 && veloY == 0) {
      promise = Promise.resolve();
    } else {
      promise = continueMotion(deltaX, deltaY, veloX, veloY, (x, y) => {
        this.onZoomInc_(centerClientX, centerClientY, x, y);
        return true;
      }).thenAlways();
    }

    let relayout = this.scale_ > this.startScale_;
    return promise
      .then(() => {
        return this.release_();
      })
      .then(() => {
        if (relayout) {
          this.updateSrc_();
        }
      });
  }

  /**
   * Sets or animates pan/zoom parameters.
   * @param {number} newScale
   * @param {number} newPosX
   * @param {number} newPosY
   * @param {boolean} animate
   * @return {!Promise}
   * @private
   */
  set_(newScale, newPosX, newPosY, animate) {
    let ds = newScale - this.scale_;
    let dx = newPosX - this.posX_;
    let dy = newPosY - this.posY_;
    let dist = Math.sqrt(dx * dx + dy * dy);

    let dur = 0;
    if (animate) {
      let maxDur = 250;
      dur = Math.min(
        maxDur,
        Math.max(
          maxDur * dist * 0.01, // Moving component.
          maxDur * Math.abs(ds)
        )
      ); // Zooming component.
    }

    let promise;
    if (dur > 16 && animate) {
      let scaleFunc = tr.numeric(this.scale_, newScale);
      let xFunc = tr.numeric(this.posX_, newPosX);
      let yFunc = tr.numeric(this.posY_, newPosY);
      promise = Animation.animate(
        (time) => {
          this.scale_ = scaleFunc(time);
          this.posX_ = xFunc(time);
          this.posY_ = yFunc(time);
          this.updatePanZoom_();
        },
        dur,
        PAN_ZOOM_CURVE_
      ).thenAlways(() => {
        this.scale_ = newScale;
        this.posX_ = newPosX;
        this.posY_ = newPosY;
        this.updatePanZoom_();
      });
    } else {
      this.scale_ = newScale;
      this.posX_ = newPosX;
      this.posY_ = newPosY;
      this.updatePanZoom_();
      if (animate) {
        promise = Promise.resolve();
      } else {
        promise = undefined;
      }
    }

    return promise;
  }

  /**
   * Sets or animates pan/zoom parameters after release of the gesture.
   * @return {!Promise}
   * @private
   */
  release_() {
    let newScale = this.boundScale_(this.scale_, false);
    if (newScale != this.scale_) {
      this.updatePanZoomBounds_(newScale);
    }
    let newPosX = this.boundX_((this.posX_ / this.scale_) * newScale, false);
    let newPosY = this.boundY_((this.posY_ / this.scale_) * newScale, false);
    return this.set_(newScale, newPosX, newPosY, true).then(() => {
      this.startScale_ = this.scale_;
      this.startX_ = this.posX_;
      this.startY_ = this.posY_;
    });
  }
}

/**
 * This class implements "amp-image-lightbox" extension element.
 */
class AmpImageLightbox extends AMP.BaseElement {
  /** @override */
  isLayoutSupported(layout) {
    return layout == Layout.NODISPLAY;
  }

  /** @override */
  isReadyToBuild() {
    return true;
  }

  /** @override */
  buildCallback() {
    /** @private {number} */
    this.historyId_ = -1;

    /** @private {boolean} */
    this.active_ = false;

    /** @private {boolean} */
    this.entering_ = false;

    /** @private {?Element} */
    this.sourceElement_ = null;

    /** @private {?Element} */
    this.sourceImage_ = null;

    /** @private {?Unlisten} */
    this.unlistenViewport_ = null;

    /** @private {!Element} */
    this.container_ = document.createElement("div");
    this.container_.classList.add("-amp-image-lightbox-container");
    this.element.appendChild(this.container_);

    /** @private {!ImageViewer} */
    this.imageViewer_ = new ImageViewer(this);
    this.container_.appendChild(this.imageViewer_.getElement());

    /** @private {!Element} */
    this.captionElement_ = document.createElement("div");
    this.captionElement_.classList.add("amp-image-lightbox-caption");
    this.captionElement_.classList.add("-amp-image-lightbox-caption");
    this.container_.appendChild(this.captionElement_);

    let gestures = Gestures.get(this.element);
    this.element.addEventListener("click", (e) => {
      if (!this.entering_ && !this.imageViewer_.getImage().contains(e.target)) {
        this.close();
      }
    });
    gestures.onGesture(TapRecognizer, () => {
      if (!this.entering_) {
        this.close();
      }
    });
    gestures.onGesture(SwipeXYRecognizer, () => {
      // Consume to block scroll events and side-swipe.
    });
  }

  /** @override */
  activate(invocation) {
    if (this.active_) {
      return;
    }

    let source = invocation.source;
    assert(
      source && SUPPORTED_ELEMENTS_[source.tagName.toLowerCase()],
      "Unsupported element: %s",
      source.tagName
    );

    this.active_ = true;
    this.reset_();
    this.init_(source);

    // Prepare to enter in lightbox
    this.requestFullOverlay();

    this.enter_();

    this.unlistenViewport_ = this.getViewport().onChanged(() => {
      if (this.active_) {
        this.imageViewer_.measure();
      }
    });

    this.getHistory_()
      .push(this.close.bind(this))
      .then((historyId) => {
        this.historyId_ = historyId;
      });
  }

  /**
   * Closes the lightbox.
   */
  close() {
    if (!this.active_) {
      return;
    }
    this.active_ = false;
    this.entering_ = false;

    this.exit_();

    if (this.unlistenViewport_) {
      this.unlistenViewport_();
      this.unlistenViewport_ = null;
    }

    this.cancelFullOverlay();
    if (this.historyId_ != -1) {
      this.getHistory_().pop(this.historyId_);
    }
  }

  /**
   * Toggles the view mode.
   * @param {boolean=} opt_on
   */
  toggleViewMode(opt_on) {
    if (opt_on !== undefined) {
      this.container_.classList.toggle("-amp-image-lightbox-view-mode", opt_on);
    } else {
      this.container_.classList.toggle("-amp-image-lightbox-view-mode");
    }
  }

  /**
   * @param {!Element} sourceElement
   * @param {!Element} sourceImage
   * @private
   */
  init_(sourceElement) {
    this.sourceElement_ = sourceElement;

    // Initialize the viewer.
    this.sourceImage_ = dom.elementByTag(sourceElement, "img");
    this.imageViewer_.init(this.sourceElement_, this.sourceImage_);

    // Discover caption.
    let caption = null;

    // 1. Check <figure> and <figcaption>.
    if (!caption) {
      let figure = dom.closestByTag(sourceElement, "figure");
      if (figure) {
        caption = dom.elementByTag(figure, "figcaption");
      }
    }

    // 2. Check "aria-describedby".
    if (!caption) {
      let describedBy = sourceElement.getAttribute("aria-describedby");
      caption = document.getElementById(describedBy);
    }

    if (caption) {
      dom.copyChildren(caption, this.captionElement_);
    }
    this.captionElement_.classList.toggle("-amp-empty", !caption);
  }

  /** @private */
  reset_() {
    this.imageViewer_.reset();
    dom.removeChildren(this.captionElement_);
    this.sourceElement_ = null;
    this.sourceImage_ = null;
    this.toggleViewMode(false);
  }

  /**
   * @return {!Promise}
   * @private
   */
  enter_() {
    this.entering_ = true;

    st.setStyles(this.element, {
      opacity: 0,
      display: "",
    });
    this.imageViewer_.measure();

    let anim = new Animation();
    let dur = 500;

    // Lightbox background fades in.
    anim.add(
      0,
      tr.setStyles(this.element, {
        opacity: tr.numeric(0, 1),
      }),
      0.6,
      ENTER_CURVE_
    );

    // Try to transition from the source image.
    let transLayer = null;
    if (
      this.sourceImage_ &&
      isLoaded(this.sourceImage_) &&
      this.sourceImage_.src
    ) {
      transLayer = document.createElement("div");
      transLayer.classList.add("-amp-image-lightbox-trans");
      document.body.appendChild(transLayer);

      let rect = layoutRectFromDomRect(
        this.sourceImage_.getBoundingClientRect()
      );
      let clone = this.sourceImage_.cloneNode(true);
      st.setStyles(clone, {
        position: "absolute",
        top: st.px(rect.top),
        left: st.px(rect.left),
        width: st.px(rect.width),
        height: st.px(rect.height),
      });
      transLayer.appendChild(clone);

      this.sourceImage_.classList.add("-amp-ghost");

      // Move the image to the location given by the lightbox.
      let imageBox = this.imageViewer_.getImageBox();
      let dx = imageBox.left - rect.left;
      let dy = imageBox.top - rect.top;
      // Duration will be somewhere between 0.2 and 0.8 depending on how far
      // the image needs to move.
      let motionTime = Math.max(0.2, Math.min(0.8, (Math.abs(dy) / 250) * 0.8));
      anim.add(
        0,
        tr.setStyles(clone, {
          transform: tr.translate(tr.numeric(0, dx), tr.numeric(0, dy)),
        }),
        motionTime,
        ENTER_CURVE_
      );

      // Fade in the container. This will mostly affect the caption.
      st.setStyles(this.container_, { opacity: 0 });
      anim.add(
        0.8,
        tr.setStyles(this.container_, {
          opacity: tr.numeric(0, 1),
        }),
        0.1,
        ENTER_CURVE_
      );

      // At the end, fade out the transition image.
      anim.add(
        0.9,
        tr.setStyles(transLayer, {
          opacity: tr.numeric(1, 0.01),
        }),
        0.1,
        EXIT_CURVE_
      );
    }

    return anim.start(dur).thenAlways(() => {
      this.entering_ = false;
      st.setStyles(this.element, { opacity: "" });
      st.setStyles(this.container_, { opacity: "" });
      if (transLayer) {
        document.body.removeChild(transLayer);
      }
    });
  }

  /**
   * @return {!Promise}
   * @private
   */
  exit_() {
    let image = this.imageViewer_.getImage();
    let imageBox = this.imageViewer_.getImageBoxWithOffset();

    let anim = new Animation();
    let dur = 500;

    // Lightbox background fades out.
    anim.add(
      0,
      tr.setStyles(this.element, {
        opacity: tr.numeric(1, 0),
      }),
      0.9,
      EXIT_CURVE_
    );

    // Try to transition to the source image.
    let transLayer = null;
    if (isLoaded(image) && image.src && this.sourceImage_) {
      transLayer = document.createElement("div");
      transLayer.classList.add("-amp-image-lightbox-trans");
      document.body.appendChild(transLayer);

      let rect = layoutRectFromDomRect(
        this.sourceImage_.getBoundingClientRect()
      );
      let newLeft = imageBox.left + (imageBox.width - rect.width) / 2;
      let newTop = imageBox.top + (imageBox.height - rect.height) / 2;
      let clone = image.cloneNode(true);
      st.setStyles(clone, {
        position: "absolute",
        top: st.px(newTop),
        left: st.px(newLeft),
        width: st.px(rect.width),
        height: st.px(rect.height),
        transform: "",
      });
      transLayer.appendChild(clone);

      // Fade out the container.
      anim.add(
        0,
        tr.setStyles(this.container_, {
          opacity: tr.numeric(1, 0),
        }),
        0.1,
        EXIT_CURVE_
      );

      // Move the image back to where it is in the article.
      let dx = rect.left - newLeft;
      let dy = rect.top - newTop;
      let move = tr.setStyles(clone, {
        transform: tr.translate(tr.numeric(0, dx), tr.numeric(0, dy)),
      });
      // Duration will be somewhere between 0.2 and 0.8 depending on how far
      // the image needs to move. Start the motion later too, but no later
      // than 0.2.
      let motionTime = Math.max(0.2, Math.min(0.8, (Math.abs(dy) / 250) * 0.8));
      anim.add(
        Math.min(0.8 - motionTime, 0.2),
        (time, complete) => {
          move(time);
          if (complete) {
            this.sourceImage_.classList.remove("-amp-ghost");
          }
        },
        motionTime,
        EXIT_CURVE_
      );

      // Fade out the transition image.
      anim.add(
        0.8,
        tr.setStyles(transLayer, {
          opacity: tr.numeric(1, 0.01),
        }),
        0.2,
        EXIT_CURVE_
      );

      // Duration will be somewhere between 300ms and 700ms depending on
      // how far the image needs to move.
      dur = Math.max(Math.min((Math.abs(dy) / 250) * dur, dur), 300);
    }

    return anim.start(dur).thenAlways(() => {
      if (this.sourceImage_) {
        this.sourceImage_.classList.remove("-amp-ghost");
      }
      st.setStyles(this.element, {
        display: "none",
        opacity: "",
      });
      st.setStyles(this.container_, { opacity: "" });
      if (transLayer) {
        document.body.removeChild(transLayer);
      }
      this.reset_();
    });
  }

  /** @private {!History} */
  getHistory_() {
    return historyFor(this.element.ownerDocument.defaultView);
  }
}

AMP.registerElement("amp-image-lightbox", AmpImageLightbox, $CSS$);
