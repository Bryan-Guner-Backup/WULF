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

/**
 * This type signifies a callback that can be called to remove the listener.
 * @typedef {function()}
 */
class Unlisten {}

/**
 * This class helps to manage observers. Observers can be added, removed or
 * fired through and instance of this class.
 * @template TYPE
 */
export class Observable {
  constructor() {
    /** @const {!Array<function(TYPE)>} */
    this.handlers_ = [];
  }

  /**
   * Adds the observer to this instance.
   * @param {function(TYPE)} handler Observer's handler.
   * @return {!Unlisten}
   */
  add(handler) {
    this.handlers_.push(handler);
    return () => {
      this.remove(handler);
    };
  }

  /**
   * Removes the observer from this instance.
   * @param {function(TYPE)} handler Observer's instance.
   */
  remove(handler) {
    for (let i = 0; i < this.handlers_.length; i++) {
      if (handler == this.handlers_[i]) {
        this.handlers_.splice(i, 1);
        break;
      }
    }
  }

  /**
   * Fires an event. All observers are called.
   * @param {TYPE} event
   */
  fire(event) {
    this.handlers_.forEach((handler) => {
      handler(event);
    });
  }

  /**
   * Returns number of handlers. Mostly needed for tests.
   * @return {number}
   */
  getHandlerCount() {
    return this.handlers_.length;
  }
}
