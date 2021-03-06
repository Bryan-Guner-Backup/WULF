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
  Layout,
  assertLength,
  getLengthNumeral,
  getLengthUnits,
  parseLength,
  parseLayout,
} from "../../src/layout";
import { applyLayout_ } from "../../src/custom-element";

describe("Layout", () => {
  var div;

  beforeEach(() => {
    div = document.createElement("div");
  });

  it("parseLayout", () => {
    expect(parseLayout("nodisplay")).to.equal("nodisplay");
    expect(parseLayout("fixed")).to.equal("fixed");
    expect(parseLayout("fixed-height")).to.equal("fixed-height");
    expect(parseLayout("responsive")).to.equal("responsive");
    expect(parseLayout("container")).to.equal("container");
    expect(parseLayout("fill")).to.equal("fill");
  });

  it("parseLayout - failure", () => {
    expect(parseLayout("abc")).to.be.undefined;
    expect(parseLayout("xyz")).to.be.undefined;
  });

  it("parseLength", () => {
    expect(parseLength(10)).to.equal("10px");
    expect(parseLength("10")).to.equal("10px");
    expect(parseLength("10px")).to.equal("10px");
    expect(parseLength("10em")).to.equal("10em");
    expect(parseLength("10vmin")).to.equal("10vmin");

    expect(parseLength(10.1)).to.equal("10.1px");
    expect(parseLength("10.2")).to.equal("10.2px");
    expect(parseLength("10.1px")).to.equal("10.1px");
    expect(parseLength("10.1em")).to.equal("10.1em");
    expect(parseLength("10.1vmin")).to.equal("10.1vmin");

    expect(parseLength(undefined)).to.equal(undefined);
    expect(parseLength(null)).to.equal(undefined);
    expect(parseLength("")).to.equal(undefined);
  });

  it("getLengthUnits", () => {
    expect(getLengthUnits("10px")).to.equal("px");
    expect(getLengthUnits("10em")).to.equal("em");
    expect(getLengthUnits("10vmin")).to.equal("vmin");

    expect(getLengthUnits("10.1px")).to.equal("px");
    expect(getLengthUnits("10.1em")).to.equal("em");
    expect(getLengthUnits("10.1vmin")).to.equal("vmin");
  });

  it("getLengthNumeral", () => {
    expect(getLengthNumeral("10")).to.equal(10);
    expect(getLengthNumeral("10px")).to.equal(10);
    expect(getLengthNumeral("10em")).to.equal(10);
    expect(getLengthNumeral("10vmin")).to.equal(10);

    expect(getLengthNumeral("10.1")).to.equal(10.1);
    expect(getLengthNumeral("10.1px")).to.equal(10.1);
    expect(getLengthNumeral("10.1em")).to.equal(10.1);
    expect(getLengthNumeral("10.1vmin")).to.equal(10.1);
  });

  it("assertLength", () => {
    expect(assertLength("10px")).to.equal("10px");
    expect(assertLength("10em")).to.equal("10em");
    expect(assertLength("10vmin")).to.equal("10vmin");

    expect(assertLength("10.1px")).to.equal("10.1px");
    expect(assertLength("10.1em")).to.equal("10.1em");
    expect(assertLength("10.1vmin")).to.equal("10.1vmin");

    expect(function () {
      assertLength(10);
    }).to.throw(/Invalid length value/);
    expect(function () {
      assertLength("10");
    }).to.throw(/Invalid length value/);
    expect(function () {
      assertLength(undefined);
    }).to.throw(/Invalid length value/);
    expect(function () {
      assertLength(null);
    }).to.throw(/Invalid length value/);
    expect(function () {
      assertLength("");
    }).to.throw(/Invalid length value/);
  });

  it("layout=nodisplay", () => {
    div.setAttribute("layout", "nodisplay");
    expect(applyLayout_(div)).to.equal(Layout.NODISPLAY);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("");
    expect(div.style.display).to.equal("none");
    expect(div).to.have.class("-amp-layout-nodisplay");
    expect(div).to.not.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=fixed", () => {
    div.setAttribute("layout", "fixed");
    div.setAttribute("width", 100);
    div.setAttribute("height", 200);
    expect(applyLayout_(div)).to.equal(Layout.FIXED);
    expect(div.style.width).to.equal("100px");
    expect(div.style.height).to.equal("200px");
    expect(div).to.have.class("-amp-layout-fixed");
    expect(div).to.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=fixed - default with width/height", () => {
    div.setAttribute("width", 100);
    div.setAttribute("height", 200);
    expect(applyLayout_(div)).to.equal(Layout.FIXED);
    expect(div.style.width).to.equal("100px");
    expect(div.style.height).to.equal("200px");
  });

  it("layout=fixed - requires width/height", () => {
    div.setAttribute("layout", "fixed");
    expect(() => applyLayout_(div)).to.throw(
      /to be available and be an integer/
    );
  });

  it("layout=fixed-height", () => {
    div.setAttribute("layout", "fixed-height");
    div.setAttribute("height", 200);
    expect(applyLayout_(div)).to.equal(Layout.FIXED_HEIGHT);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("200px");
    expect(div).to.have.class("-amp-layout-fixed-height");
    expect(div).to.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=fixed-height, with width=auto", () => {
    div.setAttribute("layout", "fixed-height");
    div.setAttribute("height", 200);
    div.setAttribute("width", "auto");
    expect(applyLayout_(div)).to.equal(Layout.FIXED_HEIGHT);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("200px");
    expect(div).to.have.class("-amp-layout-fixed-height");
    expect(div).to.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=fixed-height, prohibit width!=auto", () => {
    div.setAttribute("layout", "fixed-height");
    div.setAttribute("height", 200);
    div.setAttribute("width", 300);
    expect(function () {
      applyLayout_(div);
    }).to.throw(/Expected width to be either absent or equal "auto"/);
  });

  it("layout=fixed-height - default with height", () => {
    div.setAttribute("height", 200);
    expect(applyLayout_(div)).to.equal(Layout.FIXED_HEIGHT);
    expect(div.style.height).to.equal("200px");
    expect(div.style.width).to.equal("");
  });

  it("layout=fixed-height - default with height and width=auto", () => {
    div.setAttribute("height", 200);
    div.setAttribute("width", "auto");
    expect(applyLayout_(div)).to.equal(Layout.FIXED_HEIGHT);
    expect(div.style.height).to.equal("200px");
    expect(div.style.width).to.equal("");
  });

  it("layout=fixed-height - requires height", () => {
    div.setAttribute("layout", "fixed-height");
    expect(() => applyLayout_(div)).to.throw(
      /to be available and be an integer/
    );
  });

  it("layout=responsive", () => {
    div.setAttribute("layout", "responsive");
    div.setAttribute("width", 100);
    div.setAttribute("height", 200);
    expect(applyLayout_(div)).to.equal(Layout.RESPONSIVE);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("");
    expect(div).to.have.class("-amp-layout-responsive");
    expect(div).to.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(1);
    expect(div.children[0].tagName.toLowerCase()).to.equal("i-amp-sizer");
    expect(div.children[0].style.paddingTop).to.equal("200%");
  });

  it("layout=fill", () => {
    div.setAttribute("layout", "fill");
    expect(applyLayout_(div)).to.equal(Layout.FILL);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("");
    expect(div).to.have.class("-amp-layout-fill");
    expect(div).to.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=container", () => {
    div.setAttribute("layout", "container");
    expect(applyLayout_(div)).to.equal(Layout.CONTAINER);
    expect(div.style.width).to.equal("");
    expect(div.style.height).to.equal("");
    expect(div).to.have.class("-amp-layout-container");
    expect(div).to.not.have.class("-amp-layout-size-defined");
    expect(div.children.length).to.equal(0);
  });

  it("layout=unknown", () => {
    div.setAttribute("layout", "foo");
    expect(function () {
      applyLayout_(div);
    }).to.throw(/Unknown layout: foo/);
  });

  it("should configure natural dimensions; default layout", () => {
    let pixel = document.createElement("amp-pixel");
    expect(applyLayout_(pixel)).to.equal(Layout.FIXED);
    expect(pixel.style.width).to.equal("1px");
    expect(pixel.style.height).to.equal("1px");
  });

  it("should configure natural dimensions; default layout; with width", () => {
    let pixel = document.createElement("amp-pixel");
    pixel.setAttribute("width", "11");
    expect(applyLayout_(pixel)).to.equal(Layout.FIXED);
    expect(pixel.style.width).to.equal("11px");
    expect(pixel.style.height).to.equal("1px");
  });

  it("should configure natural dimensions; default layout; with height", () => {
    let pixel = document.createElement("amp-pixel");
    pixel.setAttribute("height", "11");
    expect(applyLayout_(pixel)).to.equal(Layout.FIXED);
    expect(pixel.style.width).to.equal("1px");
    expect(pixel.style.height).to.equal("11px");
  });

  it("should configure natural dimensions; layout=fixed", () => {
    let pixel = document.createElement("amp-pixel");
    pixel.setAttribute("layout", "fixed");
    expect(applyLayout_(pixel)).to.equal(Layout.FIXED);
    expect(pixel.style.width).to.equal("1px");
    expect(pixel.style.height).to.equal("1px");
  });

  it("should configure natural dimensions; layout=fixed-height", () => {
    let pixel = document.createElement("amp-pixel");
    pixel.setAttribute("layout", "fixed-height");
    expect(applyLayout_(pixel)).to.equal(Layout.FIXED_HEIGHT);
    expect(pixel.style.height).to.equal("1px");
    expect(pixel.style.width).to.equal("");
  });
});
