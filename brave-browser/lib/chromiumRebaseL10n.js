/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const config = require("../lib/config");
const util = require("../lib/util");
const { rebaseBraveStringFilesOnChromiumL10nFiles } = require("./l10nUtil");

const chromiumRebaseL10n = (options) => {
  rebaseBraveStringFilesOnChromiumL10nFiles();
};

module.exports = chromiumRebaseL10n;
