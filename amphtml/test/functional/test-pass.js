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

import { Pass } from "../../src/pass";
import { timer } from "../../src/timer";

describe("Pass", () => {
  let sandbox;
  let pass;
  let timerMock;
  let handlerCalled;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    timerMock = sandbox.mock(timer);
    handlerCalled = 0;
    pass = new Pass(() => {
      handlerCalled++;
    });
  });

  afterEach(() => {
    pass = null;
    expect(handlerCalled).to.equal(0);
    timerMock.verify();
    timerMock.restore();
    timerMock = null;
    sandbox.restore();
    sandbox = null;
  });

  it("handler called", () => {
    var delayedFunc = null;
    timerMock
      .expects("delay")
      .withExactArgs(
        sinon.match((value) => {
          delayedFunc = value;
          return true;
        }),
        0
      )
      .returns(1)
      .once();
    pass.schedule();
    expect(pass.isPending()).to.equal(true);

    delayedFunc();
    expect(handlerCalled).to.equal(1);
    expect(pass.isPending()).to.equal(false);

    // RESET
    handlerCalled = 0;
  });

  it("schedule no delay", () => {
    timerMock
      .expects("delay")
      .withExactArgs(sinon.match.func, 0)
      .returns(1)
      .once();
    timerMock.expects("cancel").never();
    pass.schedule();
  });

  it("schedule with delay", () => {
    timerMock
      .expects("delay")
      .withExactArgs(sinon.match.func, 111)
      .returns(1)
      .once();
    timerMock.expects("cancel").never();
    pass.schedule(111);
  });

  it("schedule later", () => {
    timerMock
      .expects("delay")
      .withExactArgs(sinon.match.func, 111)
      .returns(1)
      .once();
    timerMock.expects("cancel").never();
    pass.schedule(111);
    // Will never schedule b/c there's an earlier pass still pending.
    let isScheduled = pass.schedule(222);
    expect(isScheduled).to.equal(false);
  });

  it("schedule earlier", () => {
    timerMock
      .expects("delay")
      .withExactArgs(sinon.match.func, 222)
      .returns(1)
      .once();
    timerMock
      .expects("delay")
      .withExactArgs(sinon.match.func, 111)
      .returns(2)
      .once();
    timerMock.expects("cancel").withExactArgs(1).once();
    pass.schedule(222);
    // Will re-schedule b/c the existing pass is later.
    let isScheduled = pass.schedule(111);
    expect(isScheduled).to.equal(true);
  });
});
