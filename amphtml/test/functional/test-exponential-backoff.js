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

import { exponentialBackoff } from "../../src/exponential-backoff";
import * as sinon from "sinon";

describe("exponentialBackoff", () => {
  let sandbox;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
  });

  afterEach(() => {
    clock.restore();
    sandbox.restore();
  });

  it("should backoff exponentially", () => {
    var count = 0;
    var backoff = exponentialBackoff();
    var backoff2 = exponentialBackoff();
    var increment = () => {
      count++;
    };

    backoff(increment);
    expect(count).to.equal(0);
    clock.tick(600);
    expect(count).to.equal(0);
    // Account for jitter
    clock.tick(701);
    expect(count).to.equal(1);

    // Round 2
    backoff(increment);
    expect(count).to.equal(1);
    clock.tick(1200);
    expect(count).to.equal(1);
    clock.tick(1800);
    expect(count).to.equal(2);

    // Round 3
    backoff(increment);
    expect(count).to.equal(2);
    clock.tick(2200);
    expect(count).to.equal(2);
    clock.tick(3200);
    expect(count).to.equal(3);

    // 2nd independent backoff
    backoff2(increment);
    expect(count).to.equal(3);
    clock.tick(600);
    expect(count).to.equal(3);
    clock.tick(701);
    expect(count).to.equal(4);
  });
});
