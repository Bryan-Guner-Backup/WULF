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

import { Curves, bezierCurve, getCurve } from "../../src/curve";

describe("Curve", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
    sandbox = null;
  });

  it("bezierCurve", () => {
    let curve = bezierCurve(0.75, 0, 0.75, 0.9);
    expect(curve(0.2)).to.be.closeTo(0.024374631, 1e-6);
    expect(curve(0.6)).to.be.closeTo(0.317459494, 1e-6);
    expect(curve(0.9)).to.be.closeTo(0.905205002, 1e-6);

    curve = bezierCurve(0, 0, 0.58, 1);
    expect(curve(0.2)).to.be.closeTo(0.308366667, 1e-6);
    expect(curve(0.6)).to.be.closeTo(0.785139061, 1e-6);
    expect(curve(0.9)).to.be.closeTo(0.982973389, 1e-6);
  });

  it("getCurve", () => {
    // Null case.
    expect(getCurve(null)).to.equal(null);
    expect(getCurve(undefined)).to.equal(null);

    // Function is passed through.
    let func = () => {};
    expect(getCurve(func)).to.equal(func);

    // String is translated.
    expect(getCurve("linear")).to.equal(Curves.LINEAR);
    expect(getCurve("ease")).to.equal(Curves.EASE);
    expect(getCurve("ease-in")).to.equal(Curves.EASE_IN);
    expect(getCurve("ease-out")).to.equal(Curves.EASE_OUT);
    expect(getCurve("ease-in-out")).to.equal(Curves.EASE_IN_OUT);
  });
});
