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

import { writeScript } from "../src/3p";

/**
 * @param {!Window} global
 * @param {!Object} data
 */
export function doubleclick(global, data) {
  var loaded = new Promise((resolve, reject) => {
    var s = document.createElement("script");
    s.src = "https://www.googletagservices.com/tag/js/gpt.js";
    s.onload = resolve;
    s.onerror = reject;
    global.document.body.appendChild(s);
  });

  loaded.then(() => {
    global.googletag.cmd.push(function () {
      var dimensions = [[parseInt(data.width, 10), parseInt(data.height, 10)]];
      var slot = googletag
        .defineSlot(data.slot, dimensions, "c")
        .addService(googletag.pubads());
      googletag.pubads().enableSingleRequest();
      googletag.pubads().set("page_url", context.location.href);
      googletag.enableServices();

      if (data.targeting) {
        for (var key in data.targeting) {
          slot.setTargeting(key, data.targeting[key]);
        }
      }

      if (data.categoryExclusion) {
        slot.setCategoryExclusion(data.categoryExclusion);
      }

      if (data.tagForChildDirectedTreatment != undefined) {
        googletag
          .pubads()
          .setTagForChildDirectedTreatment(data.tagForChildDirectedTreatment);
      }

      if (data.cookieOptions) {
        googletag.pubads().setCookieOptions(data.cookieOptions);
      }

      googletag.pubads().addEventListener("slotRenderEnded", function (event) {
        if (event.isEmpty) {
          context.noContentAvailable();
        }
      });

      global.googletag.display("c");
    });
  });
}
