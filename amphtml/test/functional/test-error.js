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

import { getErrorReportUrl, installErrorReporting } from "../../src/error";
import { setModeForTesting } from "../../src/mode";
import { parseUrl, parseQueryString } from "../../src/url";
import * as sinon from "sinon";

describe("reportErrorToServer", () => {
  let sandbox;
  let clock;
  let onError;

  beforeEach(() => {
    onError = window.onerror;
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
    sinon.spy(window, "Image");
  });

  afterEach(() => {
    window.onerror = onError;
    clock.restore();
    sandbox.restore();
    setModeForTesting(null);
    Image.restore();
  });

  it("reportError with error object", () => {
    var e = new Error("XYZ");
    var url = parseUrl(
      getErrorReportUrl(undefined, undefined, undefined, undefined, e)
    );
    var query = parseQueryString(url.search);
    expect(
      url.href.indexOf("https://cdn.ampproject.org/error/report.gif")
    ).to.equal(0);

    expect(query.m).to.equal("XYZ");
    expect(query.el).to.equal("u");
    expect(query.a).to.equal("0");
    expect(query.s).to.equal(e.stack);
    expect(e.message).to.contain("_reported_");
  });

  it("reportError with associatedElement", () => {
    var e = new Error("XYZ");
    var el = document.createElement("foo-bar");
    e.associatedElement = el;
    var url = parseUrl(
      getErrorReportUrl(undefined, undefined, undefined, undefined, e)
    );
    var query = parseQueryString(url.search);

    expect(query.m).to.equal("XYZ");
    expect(query.el).to.equal("FOO-BAR");
    expect(query.a).to.equal("0");
    expect(query.v).to.equal("$internalRuntimeVersion$");
  });

  it("reportError mark asserts", () => {
    var e = new Error("XYZ");
    e.fromAssert = true;
    var url = parseUrl(
      getErrorReportUrl(undefined, undefined, undefined, undefined, e)
    );
    var query = parseQueryString(url.search);

    expect(query.m).to.equal("XYZ");
    expect(query.a).to.equal("1");
    expect(query.v).to.equal("$internalRuntimeVersion$");
  });

  it("reportError without error object", () => {
    var url = parseUrl(
      getErrorReportUrl("foo bar", "foo.js", "11", "22", undefined)
    );
    var query = parseQueryString(url.search);
    expect(
      url.href.indexOf("https://cdn.ampproject.org/error/report.gif")
    ).to.equal(0);

    expect(query.m).to.equal("foo bar");
    expect(query.f).to.equal("foo.js");
    expect(query.l).to.equal("11");
    expect(query.c).to.equal("22");
  });
});
