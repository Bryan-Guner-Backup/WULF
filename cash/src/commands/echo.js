"use strict";

const _ = require("lodash");

const interfacer = require("./../util/interfacer");

const echo = {
  exec(arg, options) {
    const self = this;
    options = options || {};

    try {
      let text = arg || "";
      text = !_.isArray(text) ? [text] : text;
      let result = text.join(" ");
      let out = "";
      if (options.e && !options.E) {
        for (let i = 0; i < result.length; ++i) {
          const nxt = result[i] + (result[i + 1] || "");
          if (nxt === "\\b") {
            out = out.slice(0, out.length - 1);
            i++;
          } else if (nxt === "\\c") {
            break;
          } else if (nxt === "\\n") {
            out += "\n";
            i++;
          } else if (nxt === "\\r") {
            out += "\r";
            i++;
          } else if (nxt === "\\t") {
            out += "     ";
            i++;
          } else if (nxt === "\\\\") {
            out += "\\";
            i += 2;
          } else {
            out += result[i];
          }
        }
        result = out;
      }

      // Bug: If nothing is passed, ensure we keep
      // a blank line. Vorpal is designed to just
      // eat blank lines, so we have a problem.
      result = result === "" ? "" : result;

      this.log(result);
      return 0;
    } catch (e) {
      /* istanbul ignore next */
      return echo.error.call(self, e);
    }
  },

  error(e) {
    /* istanbul ignore next */
    this.log(e.stack);
    /* istanbul ignore next */
    return 2;
  },
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return echo;
  }
  vorpal.api.echo = echo;
  vorpal
    .command("echo [arg...]")
    .option("-e", "enable interpretation of the following backslash escapes")
    .option("-E", "explicitly suppress interpretation of backslash escapes")
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: echo,
        args: args.arg,
        options: args.options,
        callback,
      });
    });
};
