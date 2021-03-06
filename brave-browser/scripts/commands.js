/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const program = require("commander");
const path = require("path");
const fs = require("fs-extra");
const config = require("../lib/config");
const util = require("../lib/util");
const build = require("../lib/build");
const versions = require("../lib/versions");
const start = require("../lib/start");
const updatePatches = require("../lib/updatePatches");
const pullL10n = require("../lib/pullL10n");
const pushL10n = require("../lib/pushL10n");
const chromiumRebaseL10n = require("../lib/chromiumRebaseL10n");
const createDist = require("../lib/createDist");
const upload = require("../lib/upload");
const test = require("../lib/test");

program.version(process.env.npm_package_version);

program.command("versions").action(versions);

program
  .command("build")
  .option("-C <build_dir>", "build config (out/Debug, out/Release")
  .option("--target_arch <target_arch>", "target architecture", "x64")
  .option("--mac_signing_identifier <id>", "The identifier to use for signing")
  .option(
    "--mac_signing_keychain <keychain>",
    "The identifier to use for signing",
    "login"
  )
  .option("--debug_build <debug_build>", "keep debugging symbols")
  .option("--official_build <official_build>", "force official build settings")
  .option("--brave_google_api_key <brave_google_api_key>")
  .option("--brave_google_api_endpoint <brave_google_api_endpoint>")
  .option("--no_branding_update", "don't copy BRANDING to the chrome theme dir")
  .option(
    "--channel <target_chanel>",
    "target channel to build",
    /^(beta|dev|nightly|release)$/i,
    "release"
  )
  .arguments("[build_config]")
  .action(build);

program
  .command("create_dist")
  .option("-C <build_dir>", "build config (out/Debug, out/Release")
  .option("--target_arch <target_arch>", "target architecture", "x64")
  .option("--mac_signing_identifier <id>", "The identifier to use for signing")
  .option(
    "--mac_signing_keychain <keychain>",
    "The identifier to use for signing",
    "login"
  )
  .option("--debug_build <debug_build>", "keep debugging symbols")
  .option("--official_build <official_build>", "force official build settings")
  .option("--brave_google_api_key <brave_google_api_key>")
  .option("--brave_google_api_endpoint <brave_google_api_endpoint>")
  .option("--no_branding_update", "don't copy BRANDING to the chrome theme dir")
  .option(
    "--channel <target_chanel>",
    "target channel to build",
    /^(beta|dev|nightly|release)$/i,
    "release"
  )
  .arguments("[build_config]")
  .action(createDist);

program
  .command("upload")
  .option("--target_arch <target_arch>", "target architecture", "x64")
  .action(upload);

program
  .command("start")
  .option("--v [log_level]", "set log level to [log_level]", parseInt, "0")
  .option(
    "--user_data_dir_name [base_name]",
    "set user data directory base name to [base_name]",
    "brave-development"
  )
  .option("--no_sandbox", "disable the sandbox")
  .option("--disable_brave_extension", "disable loading the Brave extension")
  .option("--disable_pdfjs_extension", "disable loading the PDFJS extension")
  .arguments("[build_config]")
  .action(start);

program.command("pull_l10n").action(pullL10n);

program.command("push_l10n").action(pushL10n);

program.command("chromium_rebase_l10n").action(chromiumRebaseL10n);

program.command("update_patches").action(updatePatches);

program
  .command("cibuild")
  .option("--target_arch <target_arch>", "target architecture", "x64")
  .action((options) => {
    options.official_build = true;
    build("Release", options);
  });

program
  .command("test <suite>")
  .option("--v [log_level]", "set log level to [log_level]", parseInt, "0")
  .option("--filter <filter>", "set test filter")
  .arguments("[build_config]")
  .action(test);

program.parse(process.argv);
