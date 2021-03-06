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
  createFixtureIframe,
  expectBodyToBecomeVisible,
} from "../../testing/iframe.js";

describe("Rendering of amp-img", () => {
  var fixture;
  beforeEach(() => {
    return createFixtureIframe("test/fixtures/images.html", 500).then((f) => {
      fixture = f;
    });
  });

  it("should show the body", () => {
    return expectBodyToBecomeVisible(fixture.win);
  });

  it("should be present", () => {
    expect(fixture.doc.querySelectorAll("amp-img")).to.have.length(15);
    // 5 image visible in 500 pixel height.
    return fixture.awaitEvent("amp:load:start", 3).then(function () {
      expect(fixture.doc.querySelectorAll("amp-img img[src]")).to.have.length(
        3
      );
    });
  });

  it("should resize and load more elements", () => {
    var p = fixture.awaitEvent("amp:load:start", 11).then(function () {
      expect(fixture.doc.querySelectorAll("amp-img img[src]")).to.have.length(
        11
      );
      fixture.iframe.height = 2000;
      fixture.win.dispatchEvent(new fixture.win.Event("resize"));
      return fixture.awaitEvent("amp:load:start", 13).then(function () {
        expect(fixture.doc.querySelectorAll("amp-img img[src]")).to.have.length(
          13
        );
      });
    });
    fixture.iframe.height = 1500;
    fixture.win.dispatchEvent(new fixture.win.Event("resize"));
    return p;
  });

  it("should respect media queries", () => {
    return fixture.awaitEvent("amp:load:start", 3).then(function () {
      var smallScreen = fixture.doc.getElementById("img3");
      var largeScreen = fixture.doc.getElementById("img3_1");
      expect(smallScreen.className).to.not.match(/-amp-hidden-by-media-query/);
      expect(largeScreen.className).to.match(/-amp-hidden-by-media-query/);
      expect(smallScreen.offsetHeight).to.not.equal(0);
      expect(largeScreen.offsetHeight).to.equal(0);
      fixture.iframe.width = 600;
      fixture.win.dispatchEvent(new fixture.win.Event("resize"));
      return fixture.awaitEvent("amp:load:start", 4).then(function () {
        expect(smallScreen.className).to.match(/-amp-hidden-by-media-query/);
        expect(largeScreen.className).to.not.match(
          /-amp-hidden-by-media-query/
        );
        expect(smallScreen.offsetHeight).to.equal(0);
        expect(largeScreen.offsetHeight).to.not.equal(0);
      });
    });
  });
});
