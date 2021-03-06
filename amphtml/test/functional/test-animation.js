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

import { Animation } from "../../src/animation";
import * as sinon from "sinon";

describe("Animation", () => {
  let sandbox;
  let vsync;
  let vsyncTasks;
  let anim;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    clock = sandbox.useFakeTimers();
    vsyncTasks = [];
    vsync = {
      createTask: (task) => {
        return () => {
          vsyncTasks.push(task);
        };
      },
    };
    anim = new Animation(vsync);
  });

  afterEach(() => {
    expect(vsyncTasks.length).to.equal(0);
    anim = null;
    vsync = null;
    vsyncTasks = null;
    clock.restore();
    clock = null;
    sandbox.restore();
    sandbox = null;
  });

  function runVsync() {
    let tasks = vsyncTasks.slice(0);
    vsyncTasks = [];
    tasks.forEach(function (task) {
      let state = {};
      if (task.measure) {
        task.measure(state);
      }
      task.mutate(state);
    });
  }

  it("animation", () => {
    let tr1 = -1;
    let tr2 = -1;
    anim.add(
      0,
      (time) => {
        tr1 = time;
      },
      0.8
    );
    anim.add(
      0.2,
      (time) => {
        tr2 = time;
      },
      0.8
    );

    let ap = anim.start(1000);
    let resolveCalled = false;
    ap.resolve_ = () => {
      resolveCalled = true;
    };

    tr1 = tr2 = -1;
    runVsync();
    expect(tr1).to.equal(0);
    expect(tr2).to.equal(-1);

    tr1 = tr2 = -1;
    clock.tick(100); // 100
    runVsync();
    expect(tr1).to.be.closeTo(0.1 / 0.8, 1e-3);
    expect(tr2).to.equal(-1);

    tr1 = tr2 = -1;
    clock.tick(100); // 200
    runVsync();
    expect(tr1).to.be.closeTo(0.2 / 0.8, 1e-3);
    expect(tr2).to.equal(0);

    tr1 = tr2 = -1;
    clock.tick(100); // 300
    runVsync();
    expect(tr1).to.be.closeTo(0.3 / 0.8, 1e-3);
    expect(tr2).to.be.closeTo(0.1 / 0.8, 1e-3);

    tr1 = tr2 = -1;
    clock.tick(200); // 500
    runVsync();
    expect(tr1).to.be.closeTo(0.5 / 0.8, 1e-3);
    expect(tr2).to.be.closeTo(0.3 / 0.8, 1e-3);

    tr1 = tr2 = -1;
    clock.tick(200); // 700
    runVsync();
    expect(tr1).to.be.closeTo(0.7 / 0.8, 1e-3);
    expect(tr2).to.be.closeTo(0.5 / 0.8, 1e-3);

    tr1 = tr2 = -1;
    clock.tick(100); // 800
    runVsync();
    expect(tr1).to.equal(1);
    expect(tr2).to.be.closeTo(0.6 / 0.8, 1e-3);

    tr1 = tr2 = -1;
    clock.tick(100); // 900
    runVsync();
    expect(tr1).to.equal(-1);
    expect(tr2).to.be.closeTo(0.7 / 0.8, 1e-3);

    tr1 = tr2 = -1;
    expect(resolveCalled).to.equal(false);
    clock.tick(100); // 1000
    runVsync();
    expect(tr1).to.equal(-1);
    expect(tr2).to.equal(1, 1e-3);
    expect(resolveCalled).to.equal(true);

    tr1 = tr2 = -1;
    clock.tick(100); // 1100
    runVsync();
    expect(tr1).to.equal(-1);
    expect(tr2).to.equal(-1);
  });

  it("should animate out-of-bounds time", () => {
    let tr1 = -1;
    // Linear curve between -0.5 and 1.5
    let curve = (time) => {
      return time * 2 - 0.5;
    };
    anim.add(
      0,
      (time) => {
        tr1 = time;
      },
      1,
      curve
    );

    let ap = anim.start(1000);
    let resolveCalled = false;
    ap.resolve_ = () => {
      resolveCalled = true;
    };

    tr1 = -1;
    runVsync();
    expect(tr1).to.equal(-0.5);

    tr1 = -1;
    clock.tick(500); // 500
    runVsync();
    expect(tr1).to.be.closeTo(0.5, 1e-3);

    tr1 = -1;
    clock.tick(400); // 900
    runVsync();
    expect(tr1).to.be.closeTo(1.3, 1e-3);

    clock.tick(100); // 1000
    runVsync();
    expect(tr1).to.equal(1);
  });

  it("halt freeze", () => {
    let tr1 = -1;
    let tr2 = -1;
    anim.add(
      0,
      (time) => {
        tr1 = time;
      },
      0.8
    );
    anim.add(
      0.2,
      (time) => {
        tr2 = time;
      },
      0.8
    );

    let ap = anim.start(1000);
    let rejectCalled = false;
    ap.reject_ = () => {
      rejectCalled = true;
    };

    tr1 = tr2 = -1;
    runVsync();
    expect(tr1).to.equal(0);
    expect(tr2).to.equal(-1);

    tr1 = tr2 = -1;
    ap.halt(0);
    expect(tr1).to.equal(-1);
    expect(tr2).to.equal(-1);

    runVsync();
    expect(rejectCalled).to.equal(true);
  });

  it("halt reset", () => {
    let tr1 = -1;
    let tr2 = -1;
    anim.add(
      0,
      (time) => {
        tr1 = time;
      },
      0.8
    );
    anim.add(
      0.2,
      (time) => {
        tr2 = time;
      },
      0.8
    );

    let ap = anim.start(1000);
    let rejectCalled = false;
    ap.reject_ = () => {
      rejectCalled = true;
    };

    tr1 = tr2 = -1;
    runVsync();
    expect(tr1).to.equal(0);
    expect(tr2).to.equal(-1);

    tr1 = tr2 = -1;
    ap.halt(-1);
    expect(tr1).to.equal(0);
    expect(tr2).to.equal(0);

    runVsync();
    expect(rejectCalled).to.equal(true);
  });

  it("halt forward", () => {
    let tr1 = -1;
    let tr2 = -1;
    anim.add(
      0,
      (time) => {
        tr1 = time;
      },
      0.8
    );
    anim.add(
      0.2,
      (time) => {
        tr2 = time;
      },
      0.8
    );

    let ap = anim.start(1000);
    let rejectCalled = false;
    ap.reject_ = () => {
      rejectCalled = true;
    };

    tr1 = tr2 = -1;
    runVsync();
    expect(tr1).to.equal(0);
    expect(tr2).to.equal(-1);

    tr1 = tr2 = -1;
    ap.halt(1);
    expect(tr1).to.equal(1);
    expect(tr2).to.equal(1);

    runVsync();
    expect(rejectCalled).to.equal(true);
  });
});
