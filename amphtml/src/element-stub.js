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

import { BaseElement } from "./base-element";
import { Layout } from "./layout";

/** @type {!Array} */
export const stubbedElements = [];

export class ElementStub extends BaseElement {
  constructor(element) {
    super(element);
    stubbedElements.push(this);
  }

  /** @override */
  isLayoutSupported(layout) {
    // Always returns true and will eventually call this method on the actual
    // element.
    return true;
  }

  createdCallback() {
    this.element.classList.add("amp-unresolved");
    this.element.classList.add("-amp-unresolved");
  }

  upgrade(newImpl) {
    // TODO(dvoytenko): this might be too early given that the children may
    // not be available yet.
    this.element.classList.remove("amp-unresolved");
    this.element.classList.remove("-amp-unresolved");
    newImpl.createdCallback();
  }
}
