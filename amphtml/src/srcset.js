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

import { assert } from "./asserts";

/**
 * A single source within a srcset. Only one: width or DPR can be specified at
 * a time.
 * @typedef {{
 *   url: string,
 *   width: (number|undefined),
 *   dpr: (number|undefined)
 * }}
 */
var SrcsetSource;

/**
 * Parses the text representation of srcset into Srcset object.
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes.
 * See http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-img-srcset.
 * @param {string} s
 * @return {!Srcset}
 */
export function parseSrcset(s) {
  // General grammar: (URL [NUM[w|x]],)*
  // Example 1: "image1.png 100w, image2.png 50w"
  // Example 2: "image1.png 2x, image2.png"
  // Example 3: "image1,100w.png 100w, image2.png 50w"
  let sSources = s.match(
    /\s*([^\s]*)(\s+(-?(\d+(\.(\d+)?)?|\.\d+)[a-zA-Z]))?(\s*,)?/g
  );
  assert(sSources.length > 0, "srcset has to have at least one source");
  let sources = [];
  sSources.forEach((sSource) => {
    sSource = sSource.trim();
    if (sSource.substr(-1) == ",") {
      sSource = sSource.substr(0, sSource.length - 1).trim();
    }
    let parts = sSource.split(/\s+/, 2);
    if (
      parts.length == 0 ||
      (parts.length == 1 && !parts[0]) ||
      (parts.length == 2 && !parts[0] && !parts[1])
    ) {
      return;
    }
    let url = parts[0].trim();
    if (parts.length == 1 || (parts.length == 2 && !parts[1])) {
      // If no "w" or "x" specified, we assume it's "1x".
      sources.push({ url: url, dpr: 1 });
    } else {
      let spec = parts[1].trim().toLowerCase();
      let lastChar = spec.substring(spec.length - 1);
      if (lastChar == "w") {
        sources.push({ url: url, width: parseFloat(spec) });
      } else if (lastChar == "x") {
        sources.push({ url: url, dpr: parseFloat(spec) });
      }
    }
  });
  return new Srcset(sources);
}

/**
 * A srcset object contains one or more sources.
 *
 * There are two types of sources: width-based and DPR-based. Only one type
 * of sources allowed to be specified within a single srcset. Depending on a
 * usecase, the components are free to choose any source that best corresponds
 * to the required rendering quality and network and CPU conditions. See
 * "select" method for details on how this selection is performed.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Attributes
 */
export class Srcset {
  /**
   * @param {!Array<!SrcsetSource>} sources
   */
  constructor(sources) {
    assert(sources.length > 0, "Srcset must have at least one source");
    /** @private @const {!Array<!SrcsetSource>} */
    this.sources_ = sources;

    // Only one type of source specified can be used - width or DPR.
    let hasWidth = false;
    let hasDpr = false;
    this.sources_.forEach((source) => {
      assert(
        (source.width || source.dpr) && (!source.width || !source.dpr),
        "Either dpr or width must be specified"
      );
      hasWidth = hasWidth || !!source.width;
      hasDpr = hasDpr || !!source.dpr;
    });
    assert(
      !hasWidth || !hasDpr,
      "Srcset cannot have both width and dpr sources"
    );

    // Source and assert duplicates.
    if (hasWidth) {
      this.sources_.sort((s1, s2) => {
        assert(s1.width != s2.width, "Duplicate width: %s", s1.width);
        return s2.width - s1.width;
      });
    } else {
      this.sources_.sort((s1, s2) => {
        assert(s1.dpr != s2.dpr, "Duplicate dpr: %s", s1.dpr);
        return s2.dpr - s1.dpr;
      });
    }

    /** @private @const {boolean} */
    this.widthBased_ = hasWidth;

    /** @private @const {boolean} */
    this.dprBased_ = hasDpr;
  }

  /**
   * Performs selection for specified width and DPR. Here, width is the width
   * in screen pixels and DPR is the device-pixel-ratio or pixel density of
   * the device. Depending on the circumstances, such as low network conditions,
   * it's possible to manipulate the result of this method by passing a lower
   * DPR value.
   *
   * The source selection depends on whether this is width-based or DPR-based
   * srcset.
   *
   * In a width-based source, the source's width is the physical width of a
   * resource (e.g. an image). Depending on the provided DPR, this width is
   * converted to the screen pixels as following:
   *   pixelWidth = sourceWidth / DPR
   *
   * Then, the source closest to the requested "width" is selected using
   * the "pixelWidth". The slight preference is given to the bigger sources to
   * ensure the most optimal quality.
   *
   * In a DPR-based source, the source's DPR is used to return the source that
   * is closest to the requested DPR.
   *
   * Based on
   * http://www.w3.org/html/wg/drafts/html/master/semantics.html#attr-img-srcset.
   * @param {number} width
   * @param {number} dpr
   * @return {!SrcsetSource}
   */
  select(width, dpr) {
    assert(width, "width=%s", width);
    assert(dpr, "dpr=%s", dpr);
    let index = -1;
    if (this.widthBased_) {
      index = this.selectByWidth_(width, dpr);
    } else if (this.dprBased_) {
      index = this.selectByDpr_(width, dpr);
    }
    if (index != -1) {
      return this.sources_[index];
    }
    return this.getLast();
  }

  /**
   * @param {number} width
   * @param {number} dpr
   * @return {number}
   * @private
   */
  selectByWidth_(width, dpr) {
    let minIndex = -1;
    let minWidth = 1000000;
    let minScore = 1000000;
    for (let i = 0; i < this.sources_.length; i++) {
      let source = this.sources_[i];
      let sourceWidth;
      if (source.width) {
        sourceWidth = source.width / dpr;
      } else {
        // Default source: no width: assume values are half of of the
        // minimum values seen.
        sourceWidth = minWidth / 2;
      }
      minWidth = Math.min(minWidth, sourceWidth);
      // The calculation is slightly biased toward higher width by offsetting
      // score by negative 0.2.
      let score = Math.abs((sourceWidth - width) / width - 0.2);
      if (score < minScore) {
        minScore = score;
        minIndex = i;
      }
    }
    return minIndex;
  }

  /**
   * @param {number} width
   * @param {number} dpr
   * @return {number}
   * @private
   */
  selectByDpr_(width, dpr) {
    let minIndex = -1;
    let minScore = 1000000;
    for (let i = 0; i < this.sources_.length; i++) {
      let source = this.sources_[i];
      // Default DPR = 1.
      let sourceDpr = source.dpr || 1;
      let score = Math.abs(sourceDpr - dpr);
      if (score < minScore) {
        minScore = score;
        minIndex = i;
      }
    }
    return minIndex;
  }

  /**
   * Returns the last source in the srcset, which is the default source.
   * @return {!SrcsetSource}
   */
  getLast() {
    return this.sources_[this.sources_.length - 1];
  }
}
