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

import { Observable } from "./observable";
import { getService } from "./service";
import { layoutRectLtwh } from "./layout-rect";
import { log } from "./log";
import { onDocumentReady } from "./document-state";
import { platform } from "./platform";
import { px, setStyle, setStyles } from "./style";
import { timer } from "./timer";
import { viewerFor } from "./viewer";

let TAG_ = "Viewport";

/**
 * @typedef {{
 *   relayoutAll: boolean,
 *   top: number,
 *   width: number,
 *   height: number,
 *   velocity: number
 * }}
 */
var ViewportChangedEvent;

/**
 * This object represents the viewport. It tracks scroll position, resize
 * and other events and notifies interesting parties when viewport has changed
 * and how.
 */
export class Viewport {
  /**
   * @param {!ViewportBinding} binding
   * @param {!Viewer} viewer
   */
  constructor(binding, viewer) {
    /** @const {!ViewportBinding} */
    this.binding_ = binding;

    /** @const {!Viewer} */
    this.viewer_ = viewer;

    /** @private {number} */
    this.width_ = this.getSize().width;

    /** @private {number} */
    this./*OK*/ scrollTop_ = this.binding_.getScrollTop();

    /** @private {number} */
    this./*OK*/ scrollLeft_ = this.binding_.getScrollLeft();

    /** @private {number} */
    this.paddingTop_ = viewer.getPaddingTop();

    /** @private {number} */
    this.scrollMeasureTime_ = 0;

    /** @private {boolean} */
    this.scrollTracking_ = false;

    /** @private @const {!Observable<!ViewportChangedEvent>} */
    this.changeObservable_ = new Observable();

    this.viewer_.onViewportEvent(() => {
      this.binding_.updateViewerViewport(this.viewer_);
      let paddingTop = this.viewer_.getPaddingTop();
      if (paddingTop != this.paddingTop_) {
        this.paddingTop_ = paddingTop;
        this.binding_.updatePaddingTop(this.paddingTop_);
      }
    });
    this.binding_.updateViewerViewport(this.viewer_);
    this.binding_.updatePaddingTop(this.paddingTop_);

    this.binding_.onScroll(this.scroll_.bind(this));
    this.binding_.onResize(this.resize_.bind(this));
    this.changed_(/* relayoutAll */ false, /* velocity */ 0);
  }

  /** For testing. */
  cleanup_() {
    this.binding_.cleanup_();
  }

  /**
   * Returns the top padding mandated by the viewer.
   * @return {number}
   */
  getPaddingTop() {
    return this.paddingTop_;
  }

  /**
   * Returns the viewport's top position in the document. This is essentially
   * the scroll position.
   * @return {number}
   * @deprecated Use {@link getScrollTop}
   */
  getTop() {
    return this.getScrollTop();
  }

  /**
   * Returns the viewport's vertical scroll position.
   * @return {number}
   */
  getScrollTop() {
    return this./*OK*/ scrollTop_;
  }

  /**
   * Returns the viewport's horizontal scroll position.
   * @return {number}
   */
  getScrollLeft() {
    return this./*OK*/ scrollLeft_;
  }

  /**
   * Returns the size of the viewport.
   * @return {!{width: number, height: number}}
   */
  getSize() {
    return this.binding_.getSize();
  }

  /**
   * Returns the width of the viewport.
   * @return {number}
   */
  getWidth() {
    return this.binding_.getSize().width;
  }

  /**
   * Returns the scroll width of the content within the viewport.
   * @return {number}
   */
  getScrollWidth() {
    return this.binding_.getScrollWidth();
  }

  /**
   * Returns the rect of the viewport which includes scroll positions and size.
   * @return {!LayoutRect}
   */
  getRect() {
    var scrollTop = this.binding_.getScrollTop();
    var scrollLeft = this.binding_.getScrollLeft();
    var size = this.binding_.getSize();
    return layoutRectLtwh(scrollLeft, scrollTop, size.width, size.height);
  }

  /**
   * Returns the rect of the element within the document.
   * @param {!Element} el
   * @return {!LayoutRect}
   */
  getLayoutRect(el) {
    return this.binding_.getLayoutRect(el);
  }

  /**
   * Scrolls element into view much like Element. scrollIntoView does but
   * in the AMP/Viewer environment.
   * @param {!Element} element
   */
  scrollIntoView(element) {
    let elementTop = this.binding_.getLayoutRect(element).top;
    let newScrollTop = Math.max(0, elementTop - this.paddingTop_);
    this.binding_.setScrollTop(newScrollTop);
  }

  /**
   * Registers the handler for ViewportChangedEvent events.
   * @param {!function(!ViewportChangedEvent)} handler
   * @return {!Unlisten}
   */
  onChanged(handler) {
    return this.changeObservable_.add(handler);
  }

  /**
   * @param {boolean} relayoutAll
   * @param {number} velocity
   * @private
   */
  changed_(relayoutAll, velocity) {
    var size = this.getSize();
    log.fine(
      TAG_,
      "changed event: " +
        "relayoutAll=" +
        relayoutAll +
        "; " +
        "top=" +
        this.scrollTop_ +
        "; " +
        "bottom=" +
        (this.scrollTop_ + size.height) +
        "; " +
        "velocity=" +
        velocity
    );
    this.changeObservable_.fire({
      relayoutAll: relayoutAll,
      top: this.scrollTop_,
      width: size.width,
      height: size.height,
      velocity: velocity,
    });
  }

  /** @private */
  scroll_() {
    this.scrollLeft_ = this.binding_.getScrollLeft();

    if (this.scrollTracking_) {
      return;
    }

    var newScrollTop = this.binding_.getScrollTop();
    if (newScrollTop < 0) {
      // iOS and some other browsers use negative values of scrollTop for
      // overscroll. Overscroll does not affect the viewport and thus should
      // be ignored here.
      return;
    }

    this.scrollTracking_ = true;
    this.scrollTop_ = newScrollTop;
    this.scrollMeasureTime_ = timer.now();
    timer.delay(() => this.scrollDeferred_(), 500);
  }

  /** @private */
  scrollDeferred_() {
    this.scrollTracking_ = false;
    var newScrollTop = this.binding_.getScrollTop();
    var now = timer.now();
    var velocity = 0;
    if (now != this.scrollMeasureTime_) {
      velocity =
        (newScrollTop - this.scrollTop_) / (now - this.scrollMeasureTime_);
    }
    log.fine(
      TAG_,
      "scroll: " + "scrollTop=" + newScrollTop + "; " + "velocity=" + velocity
    );
    this.scrollTop_ = newScrollTop;
    this.scrollMeasureTime_ = now;
    // TODO(dvoytenko): confirm the desired value and document it well.
    // Currently, this is 20px/second -> 0.02px/millis
    if (Math.abs(velocity) < 0.02) {
      this.changed_(/* relayoutAll */ false, velocity);
    } else {
      timer.delay(() => {
        if (!this.scrollTracking_) {
          this.scrollDeferred_();
        }
      }, 250);
    }
  }

  /** @private */
  resize_() {
    let oldWidth = this.width_;
    this.width_ = this.getSize().width;
    this.changed_(oldWidth != this.width_, 0);
  }
}

/**
 * ViewportBinding is an interface that defines an underlying technology behind
 * the {@link Viewport}.
 * @interface
 */
class ViewportBinding {
  /**
   * Register a callback for scroll events.
   * @param {function()} callback
   */
  onScroll(callback) {}

  /**
   * Register a callback for resize events.
   * @param {function()} callback
   */
  onResize(callback) {}

  /**
   * Updates binding with the new viewer's viewport info.
   * @param {!Viewer} viewer
   */
  updateViewerViewport(viewer) {}

  /**
   * Updates binding with the new padding.
   * @param {number} paddingTop
   */
  updatePaddingTop(paddingTop) {}

  /**
   * Returns the size of the viewport.
   * @return {!{width: number, height: number}}
   */
  getSize() {}

  /**
   * Returns the top scroll position for the viewport.
   * @return {number}
   */
  getScrollTop() {}

  /**
   * Sets scroll top position to the specified value or the nearest possible.
   * @param {number} scrollTop
   */
  setScrollTop(scrollTop) {}

  /**
   * Returns the left scroll position for the viewport.
   * @return {number}
   */
  getScrollLeft() {}

  /**
   * Returns the scroll width of the content within the viewport.
   * @return {number}
   */
  getScrollWidth() {}

  /**
   * Returns the rect of the element within the document.
   * @param {!Element} el
   * @return {!LayoutRect}
   */
  getLayoutRect(el) {}

  /** For testing. */
  cleanup_() {}
}

/**
 * Implementation of ViewportBinding based on the native window. It assumes that
 * the native window is sized properly and events represent the actual
 * scroll/resize events. This mode is applicable to a standalone document
 * display or when an iframe has a fixed size.
 *
 * Visible for testing.
 *
 * @implements {ViewportBinding}
 */
export class ViewportBindingNatural_ {
  /**
   * @param {!Window} win
   */
  constructor(win) {
    /** @const {!Window} */
    this.win = win;

    /** @private @const {!Observable} */
    this.scrollObservable_ = new Observable();

    /** @private @const {!Observable} */
    this.resizeObservable_ = new Observable();

    this.win.addEventListener("scroll", () => this.scrollObservable_.fire());
    this.win.addEventListener("resize", () => this.resizeObservable_.fire());

    log.fine(TAG_, "initialized natural viewport");
  }

  /** @override */
  cleanup_() {
    // TODO(dvoytenko): remove listeners
  }

  /** @override */
  onScroll(callback) {
    this.scrollObservable_.add(callback);
  }

  /** @override */
  onResize(callback) {
    this.resizeObservable_.add(callback);
  }

  /** @override */
  updateViewerViewport(viewer) {
    // Viewer's viewport is ignored since this window is fully accurate.
  }

  /** @override */
  updatePaddingTop(paddingTop) {
    this.win.document.documentElement.style.paddingTop = px(paddingTop);
  }

  /** @override */
  getSize() {
    // Notice, that documentElement./*OK*/clientHeight is buggy on iOS Safari
    // and thus cannot be used. But when the values are undefined, fallback to
    // documentElement./*OK*/clientHeight.
    if (platform.isIos() && !platform.isChrome()) {
      var winWidth = this.win./*OK*/ innerWidth;
      var winHeight = this.win./*OK*/ innerHeight;
      if (winWidth && winHeight) {
        return { width: winWidth, height: winHeight };
      }
    }
    var el = this.win.document.documentElement;
    return { width: el./*OK*/ clientWidth, height: el./*OK*/ clientHeight };
  }

  /** @override */
  getScrollTop() {
    return (
      this.getScrollingElement_()./*OK*/ scrollTop ||
      this.win./*OK*/ pageYOffset
    );
  }

  /** @override */
  getScrollLeft() {
    return (
      this.getScrollingElement_()./*OK*/ scrollLeft ||
      this.win./*OK*/ pageXOffset
    );
  }

  /** @override */
  getScrollWidth() {
    return this.getScrollingElement_()./*OK*/ scrollWidth;
  }

  /** @override */
  getLayoutRect(el) {
    var scrollTop = this.getScrollTop();
    var scrollLeft = this.getScrollLeft();
    var b = el./*OK*/ getBoundingClientRect();
    return layoutRectLtwh(
      Math.round(b.left + scrollLeft),
      Math.round(b.top + scrollTop),
      Math.round(b.width),
      Math.round(b.height)
    );
  }

  /** @override */
  setScrollTop(scrollTop) {
    this.getScrollingElement_()./*OK*/ scrollTop = scrollTop;
  }

  /**
   * @return {!Element}
   * @private
   */
  getScrollingElement_() {
    var doc = this.win.document;
    if (doc./*OK*/ scrollingElement) {
      return doc./*OK*/ scrollingElement;
    }
    if (doc.body) {
      return doc.body;
    }
    return doc.documentElement;
  }
}

/**
 * Implementation of ViewportBinding based on the native window in case when
 * the AMP document is embedded in a IFrame on iOS. It assumes that the native
 * window is sized properly and events represent the actual resize events.
 * The main difference from natural binding is that in this case, the document
 * itself is not scrollable, but instead only "body" is scrollable.
 *
 * Visible for testing.
 *
 * @implements {ViewportBinding}
 */
export class ViewportBindingNaturalIosEmbed_ {
  /**
   * @param {!Window} win
   */
  constructor(win) {
    /** @const {!Window} */
    this.win = win;

    /** @private {number} */
    this.scrollWidth_ = 0;

    /** @private {?Element} */
    this.scrollPosEl_ = null;

    /** @private {?Element} */
    this.scrollMoveEl_ = null;

    /** @private {!{x: number, y: number}} */
    this.pos_ = { x: 0, y: 0 };

    /** @private @const {!Observable} */
    this.scrollObservable_ = new Observable();

    /** @private @const {!Observable} */
    this.resizeObservable_ = new Observable();

    onDocumentReady(this.win.document, () => {
      // Microtask is necessary here to let Safari to recalculate scrollWidth
      // post DocumentReady signal.
      timer.delay(() => {
        this.setup_();
      }, 0);
    });
    this.win.addEventListener("resize", () => this.resizeObservable_.fire());

    log.fine(TAG_, "initialized natural viewport for iOS embeds");
  }

  /** @private */
  setup_() {
    let documentElement = this.win.document.documentElement;
    let documentBody = this.win.document.body;

    // TODO(dvoytenko): need to also find a way to do this on resize.
    this.scrollWidth_ = documentBody./*OK*/ scrollWidth || 0;

    // Embedded scrolling on iOS is rather complicated. IFrames cannot be sized
    // and be scrollable. Sizing iframe by scrolling height has a big negative
    // that "fixed" position is essentially impossible. The only option we
    // found is to reset scrolling on the AMP doc, which overrides natural BODY
    // scrolling with overflow:auto. We need the following styling:
    // html {
    //   overflow: auto;
    //   -webkit-overflow-scrolling: touch;
    // }
    // body {
    //   position: absolute;
    //   overflow: auto;
    //   -webkit-overflow-scrolling: touch;
    // }
    setStyles(documentElement, {
      overflow: "auto",
      webkitOverflowScrolling: "touch",
    });
    setStyles(documentBody, {
      overflow: "auto",
      webkitOverflowScrolling: "touch",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    });

    // Insert scrollPos element into DOM. See {@link onScrolled_} for why
    // this is needed.
    this.scrollPosEl_ = this.win.document.createElement("div");
    this.scrollPosEl_.id = "-amp-scrollpos";
    setStyles(this.scrollPosEl_, {
      position: "absolute",
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      visibility: "hidden",
    });
    documentBody.appendChild(this.scrollPosEl_);

    // Insert scrollMove element into DOM. See {@link adjustScrollPos_} for why
    // this is needed.
    this.scrollMoveEl_ = this.win.document.createElement("div");
    this.scrollMoveEl_.id = "-amp-scrollmove";
    setStyles(this.scrollMoveEl_, {
      position: "absolute",
      top: 0,
      left: 0,
      width: 0,
      height: 0,
      visibility: "hidden",
    });
    documentBody.appendChild(this.scrollMoveEl_);

    documentBody.addEventListener("scroll", this.onScrolled_.bind(this));
  }

  /** @override */
  updateViewerViewport(viewer) {
    // Viewer's viewport is ignored since this window is fully accurate.
  }

  /** @override */
  updatePaddingTop(paddingTop) {
    onDocumentReady(this.win.document, () => {
      this.win.document.body.style.paddingTop = px(paddingTop);
    });
  }

  /** @override */
  cleanup_() {
    // TODO(dvoytenko): remove listeners
  }

  /** @override */
  onScroll(callback) {
    this.scrollObservable_.add(callback);
  }

  /** @override */
  onResize(callback) {
    this.resizeObservable_.add(callback);
  }

  /** @override */
  getSize() {
    return {
      width: this.win./*OK*/ innerWidth,
      height: this.win./*OK*/ innerHeight,
    };
  }

  /** @override */
  getScrollTop() {
    return Math.round(this.pos_.y);
  }

  /** @override */
  getScrollLeft() {
    return Math.round(this.pos_.x);
  }

  /** @override */
  getScrollWidth() {
    return Math.max(this.scrollWidth_, this.win./*OK*/ innerWidth);
  }

  /** @override */
  getLayoutRect(el) {
    var b = el./*OK*/ getBoundingClientRect();
    return layoutRectLtwh(
      Math.round(b.left + this.pos_.x),
      Math.round(b.top + this.pos_.y),
      Math.round(b.width),
      Math.round(b.height)
    );
  }

  /** @override */
  setScrollTop(scrollTop) {
    this.setScrollPos_(scrollTop || 1);
  }

  /**
   * @param {!Event} event
   * @private
   */
  onScrolled_(event) {
    // We have to use a special "positioning" element on iOS due to the
    // following bugs:
    // - https://code.google.com/p/chromium/issues/detail?id=2891
    // - https://code.google.com/p/chromium/issues/detail?id=157855
    // - https://bugs.webkit.org/show_bug.cgi?id=106133
    // - https://bugs.webkit.org/show_bug.cgi?id=149264
    // This is an iOS-specific issue in the context of AMP, but Chrome bugs
    // are listed for reference. In a nutshell, this is because WebKit (and
    // Chrome as well) redirect body's scrollTop to documentElement instead of
    // body. Since in this case we are actually using direct body scrolling,
    // body's scrollTop would always return wrong values.
    // This will all change with a complete migration when
    // document./*OK*/scrollingElement will point to document.documentElement.
    // This already works correctly in Chrome with "scroll-top-left-interop"
    // flag turned on "chrome://flags/#scroll-top-left-interop".
    if (!this.scrollPosEl_) {
      return;
    }
    this.adjustScrollPos_(event);
    let rect = this.scrollPosEl_./*OK*/ getBoundingClientRect();
    if (this.pos_.x != -rect.left || this.pos_.y != -rect.top) {
      this.pos_.x = -rect.left;
      this.pos_.y = -rect.top;
      this.scrollObservable_.fire();
    }
  }

  /** @private */
  setScrollPos_(scrollPos) {
    if (!this.scrollMoveEl_) {
      return;
    }
    setStyle(this.scrollMoveEl_, "transform", `translateY(${scrollPos}px)`);
    this.scrollMoveEl_./*OK*/ scrollIntoView(true);
  }

  /**
   * @param {!Event=} opt_event
   * @private
   */
  adjustScrollPos_(opt_event) {
    if (!this.scrollPosEl_ || !this.scrollMoveEl_) {
      return;
    }

    // Scroll document into a safe position to avoid scroll freeze on iOS.
    // This means avoiding scrollTop to be minimum (0) or maximum value.
    // This is very sad but very necessary. See #330 for more details.
    let scrollTop = -this.scrollPosEl_./*OK*/ getBoundingClientRect().top;
    if (scrollTop == 0) {
      this.setScrollPos_(1);
      if (opt_event) {
        opt_event.preventDefault();
      }
      return;
    }

    // TODO(dvoytenko, #330): Ideally we would do the same for the overscroll
    // on the bottom. Unfortunately, iOS Safari misreports scrollHeight in
    // this case.
  }
}

/**
 * Implementation of ViewportBinding that assumes a virtual viewport that is
 * sized outside of the AMP runtime (e.g. in a parent window) and passed here
 * via config and events. Applicable to cases where a parent window expands the
 * iframe to all available height and leaves scrolling to the parent window.
 *
 * Visible for testing.
 *
 * @implements {ViewportBinding}
 */
export class ViewportBindingVirtual_ {
  /**
   * @param {!Window} win
   * @param {!Viewer} viewer
   */
  constructor(win, viewer) {
    /** @private @const {!Window} */
    this.win = win;

    /** @private {number} */
    this.width_ = viewer.getViewportWidth();

    /** @private {number} */
    this.height_ = viewer.getViewportHeight();

    /** @private {number} */
    this./*OK*/ scrollTop_ = viewer.getScrollTop();

    /** @private @const {!Observable} */
    this.scrollObservable_ = new Observable();

    /** @private @const {!Observable} */
    this.resizeObservable_ = new Observable();

    log.fine(TAG_, "initialized virtual viewport");
  }

  /** @override */
  cleanup_() {
    // TODO(dvoytenko): remove listeners
  }

  /** @override */
  updateViewerViewport(viewer) {
    if (viewer.getScrollTop() != this./*OK*/ scrollTop_) {
      this./*OK*/ scrollTop_ = viewer.getScrollTop();
      this.scrollObservable_.fire();
    }
    if (
      viewer.getViewportWidth() != this.width_ ||
      viewer.getViewportHeight() != this.height_
    ) {
      this.width_ = viewer.getViewportWidth();
      this.height_ = viewer.getViewportHeight();
      this.resizeObservable_.fire();
    }
  }

  /** @override */
  updatePaddingTop(paddingTop) {
    this.win.document.documentElement.style.paddingTop = px(paddingTop);
  }

  /** @override */
  onScroll(callback) {
    this.scrollObservable_.add(callback);
  }

  /** @override */
  onResize(callback) {
    this.resizeObservable_.add(callback);
  }

  /** @override */
  getSize() {
    return { width: this.width_, height: this.height_ };
  }

  /** @override */
  getScrollTop() {
    return this./*OK*/ scrollTop_;
  }

  /** @override */
  getScrollLeft() {
    return 0;
  }

  /** @override */
  getScrollWidth() {
    return this.win.document.documentElement./*OK*/ scrollWidth;
  }

  /**
   * Returns the rect of the element within the document.
   * @param {!Element} el
   * @return {!LayoutRect}
   */
  getLayoutRect(el) {
    var b = el./*OK*/ getBoundingClientRect();
    return layoutRectLtwh(
      Math.round(b.left),
      Math.round(b.top),
      Math.round(b.width),
      Math.round(b.height)
    );
  }

  /** @override */
  setScrollTop(scrollTop) {
    // TODO(dvoytenko): communicate to the viewer.
  }
}

/**
 * @param {!Window} window
 * @return {!Viewport}
 * @private
 */
function createViewport_(window) {
  let viewer = viewerFor(window);
  let binding;
  if (viewer.getViewportType() == "virtual") {
    binding = new ViewportBindingVirtual_(window, viewer);
  } else if (viewer.getViewportType() == "natural-ios-embed") {
    binding = new ViewportBindingNaturalIosEmbed_(window);
  } else {
    binding = new ViewportBindingNatural_(window);
  }
  return new Viewport(binding, viewer);
}

/**
 * @param {!Window} window
 * @return {!Viewport}
 */
export function viewportFor(window) {
  return getService(window, "viewport", () => {
    return createViewport_(window);
  });
}

export const viewport = viewportFor(window);
