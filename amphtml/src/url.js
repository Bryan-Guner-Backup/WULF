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

import { assert } from "./asserts";

/**
 * Returns a Location-like object for the given URL. If it is relative,
 * the URL gets resolved.
 * @param {string} url
 * @return {!Location}
 */
export function parseUrl(url) {
  var a = document.createElement("a");
  a.href = url;
  var info = {
    href: a.href,
    protocol: a.protocol,
    host: a.host,
    hostname: a.hostname,
    port: a.port == "0" ? "" : a.port,
    pathname: a.pathname,
    search: a.search,
    hash: a.hash,
  };
  info.origin = a.origin || getOrigin(info);
  assert(info.origin, "Origin must exist");
  return info;
}

/**
 * Asserts that a given url is HTTPS or protocol relative.
 * Provides an exception for localhost.
 * @param {string} urlString
 * @param {!Element} elementContext Element where the url was found.
 */
export function assertHttpsUrl(urlString, elementContext) {
  var url = parseUrl(urlString);
  assert(
    url.protocol == "https:" ||
      /^(\/\/)/.test(urlString) ||
      url.hostname == "localhost" ||
      url.hostname.endsWith(".localhost"),
    "%s source must start with " +
      '"https://" or "//" or be relative and served from ' +
      "https. Invalid value: %s",
    elementContext,
    urlString
  );
}

/**
 * Parses the query string of an URL. This method returns a simple key/value
 * map. If there are duplicate keys the latest value is returned.
 * @param {string} queryString
 * @return {!Object<string, string>}
 */
export function parseQueryString(queryString) {
  var params = Object.create(null);
  if (!queryString) {
    return params;
  }
  if (queryString.startsWith("?") || queryString.startsWith("#")) {
    queryString = queryString.substr(1);
  }
  let pairs = queryString.split("&");
  for (let i = 0; i < pairs.length; i++) {
    let pair = pairs[i];
    let eqIndex = pair.indexOf("=");
    let name;
    let value;
    if (eqIndex != -1) {
      name = decodeURIComponent(pair.substring(0, eqIndex)).trim();
      value = decodeURIComponent(pair.substring(eqIndex + 1)).trim();
    } else {
      name = decodeURIComponent(pair).trim();
      value = "";
    }
    if (name) {
      params[name] = value;
    }
  }
  return params;
}

/**
 * @param {!Location} info
 * @return {string}
 */
function getOrigin(info) {
  return info.protocol + "//" + info.host;
}

/**
 * Returns the URL without fragment. If URL doesn't contain fragment, the same
 * string is returned.
 * @param {string} url
 * @return {string}
 */
export function removeFragment(url) {
  let index = url.indexOf("#");
  if (index == -1) {
    return url;
  }
  return url.substring(0, index);
}
