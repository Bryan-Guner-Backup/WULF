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

import { getCurve } from "./curve";
import * as st from "./style";

/**
 * Transition function that accepts normtime, typically between 0 and 1 and
 * performs an arbitrary animation action. Notice that sometimes normtime can
 * dip above 1 or below 0. This is an acceptable case for some curves. The
 * second argument is a boolean value that equals "true" for the completed
 * transition and "false" for ongoing.
 * @typedef {function(normtime, boolean):RESULT}
 * @template RESULT
 */
class Transition {}

export const NOOP = function (time) {
  return null;
};

/**
 * Returns a transition that combines a number of other transitions and
 * invokes them all in parallel.
 * @param {!Array<!Transition>} transitions
 * @return {!Transition<void>}
 */
export function all(transitions) {
  return (time, complete) => {
    for (let i = 0; i < transitions.length; i++) {
      let tr = transitions[i];
      tr(time, complete);
    }
  };
}

/**
 * Returns the specified transition with the time curved via specified curve
 * function.
 * @param {!Transition<RESULT>} transition
 * @param {!Curve|string} curve
 * @return {!Transition<RESULT>}
 * @template RESULT
 */
export function withCurve(transition, curve) {
  curve = getCurve(curve);
  return (time, complete) => {
    return transition(complete ? 1 : curve(time), complete);
  };
}

/**
 * A transition that sets the CSS style of the specified element. The styles
 * a specified as a map from CSS property names to transition functions for
 * each of these properties.
 * @param {!Element} element
 * @param {!Object<string, !Transition>} styles
 * @return {!Transition<void>}
 */
export function setStyles(element, styles) {
  return (time, complete) => {
    for (let k in styles) {
      st.setStyle(element, k, styles[k](time, complete));
    }
  };
}

/**
 * A basic numeric interpolation.
 * @param {number} start
 * @param {number} end
 * @return {!Transition<number>}
 */
export function numeric(start, end) {
  return (time) => {
    return start + (end - start) * time;
  };
}

/**
 * Spring numeric interpolation.
 * @param {number} start
 * @param {number} end
 * @param {number} extended
 * @param {number} threshold
 * @return {!Transition<number>}
 */
export function spring(start, end, extended, threshold) {
  if (end == extended) {
    return (time) => {
      return numeric(start, end)(time);
    };
  }
  return (time) => {
    if (time < threshold) {
      return start + (extended - start) * (time / threshold);
    }
    return extended + (end - extended) * ((time - threshold) / (1 - threshold));
  };
}

/**
 * Adds "px" units.
 * @param {!Transition<number>} transition
 * @return {!Transition<string>}
 */
export function px(transition) {
  return (time) => {
    return transition(time) + "px";
  };
}

/**
 * A transition for "translateX" of CSS "transform" property.
 * @param {!Transition<number|string>} transition
 * @return {!Transition<string>}
 */
export function translateX(transition) {
  return (time) => {
    let res = transition(time);
    if (typeof res == "string") {
      return `translateX(${res})`;
    }
    return `translateX(${res}px)`;
  };
}

/**
 * A transition for "translate(x, y)" of CSS "transform" property.
 * @param {!Transition<number|string>} transitionX
 * @param {!Transition<number|string>|undefined} opt_transitionY
 * @return {!Transition<string>}
 */
export function translate(transitionX, opt_transitionY) {
  return (time) => {
    let x = transitionX(time);
    if (typeof x == "number") {
      x = st.px(x);
    }
    if (!opt_transitionY) {
      return `translate(${x})`;
    }

    let y = opt_transitionY(time);
    if (typeof y == "number") {
      y = st.px(y);
    }
    return `translate(${x},${y})`;
  };
}

/**
 * A transition for "scale" of CSS "transform" property.
 * @param {!Transition<number|string>} transition
 * @return {!Transition<string>}
 */
export function scale(transition) {
  return (time) => {
    return `scale(${transition(time)})`;
  };
}
