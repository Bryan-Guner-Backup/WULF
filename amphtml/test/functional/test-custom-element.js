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

import { BaseElement } from "../../src/base-element";
import { ElementStub } from "../../src/element-stub";
import { Layout } from "../../src/layout";
import { createAmpElementProto } from "../../src/custom-element";
import { resources } from "../../src/resources";
import * as sinon from "sinon";

describe("CustomElement", () => {
  let testElementCreatedCallback;
  let testElementFirstAttachedCallback;
  let testElementBuildCallback;
  let testElementLayoutCallback;
  let testElementViewportCallback;
  let testElementDocumentInactiveCallback;
  let testElementIsReadyToBuild = true;

  class TestElement extends BaseElement {
    isLayoutSupported(layout) {
      return true;
    }
    createdCallback() {
      testElementCreatedCallback();
    }
    firstAttachedCallback() {
      testElementFirstAttachedCallback();
    }
    isReadyToBuild() {
      return testElementIsReadyToBuild;
    }
    buildCallback() {
      testElementBuildCallback();
    }
    layoutCallback() {
      testElementLayoutCallback();
      return Promise.resolve();
    }
    viewportCallback(inViewport) {
      testElementViewportCallback(inViewport);
    }
    documentInactiveCallback() {
      testElementDocumentInactiveCallback();
      return true;
    }
  }

  let ElementClass = document.registerElement("amp-test", {
    prototype: createAmpElementProto(window, "amp-test", TestElement),
  });

  let StubElementClass = document.registerElement("amp-stub", {
    prototype: createAmpElementProto(window, "amp-stub", ElementStub),
  });

  let sandbox;
  let resourcesMock;
  let clock;

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    resourcesMock = sandbox.mock(resources);
    clock = sandbox.useFakeTimers();

    testElementCreatedCallback = sinon.spy();
    testElementFirstAttachedCallback = sinon.spy();
    testElementBuildCallback = sinon.spy();
    testElementLayoutCallback = sinon.spy();
    testElementViewportCallback = sinon.spy();
    testElementDocumentInactiveCallback = sinon.spy();
  });

  afterEach(() => {
    resourcesMock.verify();
    resourcesMock.restore();
    resourcesMock = null;
    clock.restore();
    sandbox.restore();
    sandbox = null;
  });

  it("Element - createdCallback", () => {
    let element = new ElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(element.isUpgraded()).to.equal(true);
    expect(element.readyState).to.equal("loading");
    expect(element.everAttached).to.equal(false);
    expect(element.layout_).to.equal(Layout.NODISPLAY);
    expect(testElementCreatedCallback.callCount).to.equal(1);
  });

  it("StubElement - createdCallback", () => {
    let element = new StubElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(element.isUpgraded()).to.equal(false);
    expect(element.readyState).to.equal("loading");
    expect(element.everAttached).to.equal(false);
    expect(element.layout_).to.equal(Layout.NODISPLAY);
    expect(testElementCreatedCallback.callCount).to.equal(0);
  });

  it("Element - updateLayoutBox", () => {
    let element = new ElementClass();
    expect(element.layoutWidth_).to.equal(-1);
    expect(element.implementation_.layoutWidth_).to.equal(-1);

    element.updateLayoutBox({ top: 0, left: 0, width: 111, height: 51 });
    expect(element.layoutWidth_).to.equal(111);
    expect(element.implementation_.layoutWidth_).to.equal(111);
  });

  it("StubElement - upgrade", () => {
    let element = new StubElementClass();
    expect(element.isUpgraded()).to.equal(false);
    expect(testElementCreatedCallback.callCount).to.equal(0);

    element.layout_ = Layout.FILL;
    element.updateLayoutBox({ top: 0, left: 0, width: 111, height: 51 });
    resourcesMock.expects("upgraded").withExactArgs(element).once();

    element.upgrade(TestElement);

    expect(element.isUpgraded()).to.equal(true);
    expect(element.implementation_ instanceof TestElement).to.equal(true);
    expect(element.implementation_.layout_).to.equal(Layout.FILL);
    expect(element.implementation_.layoutWidth_).to.equal(111);
    expect(testElementCreatedCallback.callCount).to.equal(1);
    expect(testElementFirstAttachedCallback.callCount).to.equal(0);
    expect(element.isBuilt()).to.equal(false);
  });

  it("Element - build allowed", () => {
    let element = new ElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(0);

    testElementIsReadyToBuild = true;
    element.build(false);

    expect(element.isBuilt()).to.equal(true);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(false);
    expect(element.classList.contains("amp-notbuilt")).to.equal(false);
    expect(testElementBuildCallback.callCount).to.equal(1);
  });

  it("Element - buildCallback cannot be called twice", () => {
    let element = new ElementClass();
    expect(element.isBuilt()).to.equal(false);
    expect(testElementBuildCallback.callCount).to.equal(0);

    testElementIsReadyToBuild = true;
    let res = element.build(false);
    expect(res).to.equal(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(1);

    // Call again.
    res = element.build(false);
    expect(res).to.equal(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(1);
  });

  it("Element - build not allowed", () => {
    let element = new ElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(0);

    testElementIsReadyToBuild = false;
    element.build(false);

    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(0);
  });

  it("Element - build not allowed but forced", () => {
    let element = new ElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(0);

    testElementIsReadyToBuild = false;
    element.build(true);

    expect(element.isBuilt()).to.equal(true);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(false);
    expect(element.classList.contains("amp-notbuilt")).to.equal(false);
    expect(testElementBuildCallback.callCount).to.equal(1);
  });

  it("StubElement - build never allowed", () => {
    let element = new StubElementClass();
    expect(element.classList.contains("-amp-element")).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(element.classList.contains("-amp-notbuilt")).to.equal(true);
    expect(element.classList.contains("amp-notbuilt")).to.equal(true);
    expect(testElementBuildCallback.callCount).to.equal(0);

    expect(() => {
      element.build(true);
    }).to.throw(/Cannot build unupgraded element/);

    expect(element.isBuilt()).to.equal(false);
    expect(testElementBuildCallback.callCount).to.equal(0);
  });

  it("Element - attachedCallback", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementFirstAttachedCallback.callCount).to.equal(0);
    expect(element.everAttached).to.equal(false);
    expect(element.layout_).to.equal(Layout.NODISPLAY);

    resourcesMock.expects("add").withExactArgs(element).once();
    element.attachedCallback();

    expect(element.everAttached).to.equal(true);
    expect(element.layout_).to.equal(Layout.FILL);
    expect(element.implementation_.layout_).to.equal(Layout.FILL);
    expect(testElementFirstAttachedCallback.callCount).to.equal(1);
  });

  it("StubElement - attachedCallback", () => {
    let element = new StubElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementFirstAttachedCallback.callCount).to.equal(0);
    expect(element.everAttached).to.equal(false);
    expect(element.layout_).to.equal(Layout.NODISPLAY);

    resourcesMock.expects("add").withExactArgs(element).once();
    element.attachedCallback();

    expect(element.everAttached).to.equal(true);
    expect(element.layout_).to.equal(Layout.FILL);
    expect(element.implementation_.layout_).to.equal(Layout.FILL);
    // Not upgraded yet!
    expect(testElementCreatedCallback.callCount).to.equal(0);
    expect(testElementFirstAttachedCallback.callCount).to.equal(0);

    // Upgrade
    resourcesMock.expects("upgraded").withExactArgs(element).once();
    element.upgrade(TestElement);

    expect(element.layout_).to.equal(Layout.FILL);
    expect(element.implementation_.layout_).to.equal(Layout.FILL);
    // Now it's called.
    expect(testElementCreatedCallback.callCount).to.equal(1);
    expect(testElementFirstAttachedCallback.callCount).to.equal(1);
  });

  it("Element - detachedCallback", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementFirstAttachedCallback.callCount).to.equal(0);
    expect(element.everAttached).to.equal(false);
    expect(element.layout_).to.equal(Layout.NODISPLAY);

    resourcesMock.expects("add").withExactArgs(element).once();
    element.attachedCallback();

    resourcesMock.expects("remove").withExactArgs(element).once();
    element.detachedCallback();

    expect(element.everAttached).to.equal(true);
    expect(element.layout_).to.equal(Layout.FILL);
    expect(element.implementation_.layout_).to.equal(Layout.FILL);
    expect(testElementFirstAttachedCallback.callCount).to.equal(1);
  });

  it("Element - layoutCallback before build", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementLayoutCallback.callCount).to.equal(0);

    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.layoutCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    expect(testElementLayoutCallback.callCount).to.equal(0);
  });

  it("StubElement - layoutCallback before build or upgrade", () => {
    let element = new StubElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementLayoutCallback.callCount).to.equal(0);

    expect(element.isUpgraded()).to.equal(false);
    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.layoutCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    resourcesMock.expects("upgraded").withExactArgs(element).once();
    element.upgrade(TestElement);

    expect(element.isUpgraded()).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.layoutCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    expect(testElementLayoutCallback.callCount).to.equal(0);
  });

  it("Element - layoutCallback", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    element.build(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementLayoutCallback.callCount).to.equal(0);

    let p = element.layoutCallback();
    expect(testElementLayoutCallback.callCount).to.equal(1);
    return p.then(() => {
      expect(element.readyState).to.equal("complete");
    });
  });

  it("StubElement - layoutCallback", () => {
    let element = new StubElementClass();
    element.setAttribute("layout", "fill");
    resourcesMock.expects("upgraded").withExactArgs(element).once();
    element.upgrade(TestElement);
    element.build(true);
    expect(element.isUpgraded()).to.equal(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementLayoutCallback.callCount).to.equal(0);

    let p = element.layoutCallback();
    expect(testElementLayoutCallback.callCount).to.equal(1);
    return p.then(() => {
      expect(element.readyState).to.equal("complete");
    });
  });

  it("Element - viewportCallback before build", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementViewportCallback.callCount).to.equal(0);

    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.viewportCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    expect(testElementViewportCallback.callCount).to.equal(0);
  });

  it("StubElement - viewportCallback before build or upgrade", () => {
    let element = new StubElementClass();
    element.setAttribute("layout", "fill");
    expect(testElementViewportCallback.callCount).to.equal(0);

    expect(element.isUpgraded()).to.equal(false);
    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.viewportCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    resourcesMock.expects("upgraded").withExactArgs(element).once();
    element.upgrade(TestElement);

    expect(element.isUpgraded()).to.equal(true);
    expect(element.isBuilt()).to.equal(false);
    expect(() => {
      element.viewportCallback();
    }).to.throw(/Must be upgraded and built to receive viewport events/);

    expect(testElementViewportCallback.callCount).to.equal(0);
  });

  it("Element - viewportCallback", () => {
    let element = new ElementClass();
    element.setAttribute("layout", "fill");
    element.build(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementViewportCallback.callCount).to.equal(0);

    element.viewportCallback(true);
    expect(element.implementation_.inViewport_).to.equal(true);
    expect(testElementViewportCallback.callCount).to.equal(1);
  });

  it("StubElement - viewportCallback", () => {
    let element = new StubElementClass();
    element.setAttribute("layout", "fill");
    resourcesMock.expects("upgraded").withExactArgs(element).once();
    element.upgrade(TestElement);
    element.build(true);
    expect(element.isUpgraded()).to.equal(true);
    expect(element.isBuilt()).to.equal(true);
    expect(testElementViewportCallback.callCount).to.equal(0);

    element.viewportCallback(true);
    expect(element.implementation_.inViewport_).to.equal(true);
    expect(testElementViewportCallback.callCount).to.equal(1);
  });

  it("should enqueue actions until built", () => {
    let element = new ElementClass();
    let handler = sinon.spy();
    element.implementation_.executeAction = handler;
    expect(element.actionQueue_).to.not.equal(null);

    let inv = {};
    element.enqueAction(inv);
    expect(element.actionQueue_.length).to.equal(1);
    expect(element.actionQueue_[0]).to.equal(inv);
    expect(handler.callCount).to.equal(0);
  });

  it("should execute action immediately after built", () => {
    let element = new ElementClass();
    let handler = sinon.spy();
    element.implementation_.executeAction = handler;
    element.build(true);

    let inv = {};
    element.enqueAction(inv);
    expect(handler.callCount).to.equal(1);
    expect(handler.getCall(0).args[0]).to.equal(inv);
    expect(handler.getCall(0).args[1]).to.equal(false);
  });

  it("should dequeue all actions after build", () => {
    let element = new ElementClass();
    let handler = sinon.spy();
    element.implementation_.executeAction = handler;

    let inv1 = {};
    let inv2 = {};
    element.enqueAction(inv1);
    element.enqueAction(inv2);
    expect(element.actionQueue_.length).to.equal(2);
    expect(element.actionQueue_[0]).to.equal(inv1);
    expect(element.actionQueue_[1]).to.equal(inv2);
    expect(handler.callCount).to.equal(0);

    element.build(true);
    clock.tick(10);
    expect(handler.callCount).to.equal(2);
    expect(handler.getCall(0).args[0]).to.equal(inv1);
    expect(handler.getCall(0).args[1]).to.equal(true);
    expect(handler.getCall(1).args[0]).to.equal(inv2);
    expect(handler.getCall(1).args[1]).to.equal(true);
    expect(element.actionQueue_).to.equal(null);
  });

  it("should apply media condition", () => {
    let element1 = new ElementClass();
    element1.setAttribute("media", "(min-width: 1px)");
    element1.applyMediaQuery();
    expect(element1).to.not.have.class("-amp-hidden-by-media-query");

    let element2 = new ElementClass();
    element2.setAttribute("media", "(min-width: 1111111px)");
    element2.applyMediaQuery();
    expect(element2).to.have.class("-amp-hidden-by-media-query");
  });

  it("should change height without sizer", () => {
    let element = new ElementClass();
    element.changeHeight(111);
    expect(element.style.height).to.equal("111px");
  });

  it("should change height with sizer", () => {
    let element = new ElementClass();
    element.sizerElement_ = document.createElement("div");
    element.changeHeight(111);
    expect(element.sizerElement_.style.paddingTop).to.equal("111px");
    expect(element.style.height).to.equal("");
  });

  it("Element - documentInactiveCallback", () => {
    let element = new ElementClass();

    // Non-built element doesn't receive documentInactiveCallback.
    element.documentInactiveCallback();
    expect(testElementDocumentInactiveCallback.callCount).to.equal(0);

    // Built element receives documentInactiveCallback.
    element.build(true);
    element.documentInactiveCallback();
    expect(testElementDocumentInactiveCallback.callCount).to.equal(1);
  });

  it("StubElement - documentInactiveCallback", () => {
    let element = new StubElementClass();

    // Unupgraded document doesn't receive documentInactiveCallback.
    element.documentInactiveCallback();
    expect(testElementDocumentInactiveCallback.callCount).to.equal(0);
  });
});
