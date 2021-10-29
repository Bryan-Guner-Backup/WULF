"use strict";
exports.__esModule = true;
var chalk = require('chalk');
var chromafi = require('chromafi');
var logOutputTo = console.log;
var logErrorTo = console.error;
function echoMsgBox(msg, colorFn, log) {
    if (log === void 0) { log = logOutputTo; }
    var width = 80;
    var toDump = false;
    if (typeof msg !== 'string' || width - 2 < msg.length) {
        toDump = msg;
        msg = ' ';
    }
    colorFn =
        colorFn ||
            function (x) {
                return x;
            };
    msg = ' '.repeat(((width - msg.length) / 2) | 0) + msg;
    log();
    log(colorFn(' '.repeat(width)));
    log(colorFn(msg + ' '.repeat(width - msg.length)));
    log(colorFn(' '.repeat(width)));
    log();
    if (!!toDump) {
        dump_(toDump, log);
    }
}
function dump_(data, logTo) {
    if (logTo === void 0) { logTo = logErrorTo; }
    if (!/function|string|object/.test(typeof data)) {
        data = '' + data;
    }
    logTo(chromafi(data, {
        indent: 2,
        lineNumbers: false,
        colors: {
            string: chalk.green
        }
    }));
}
exports.dump_ = dump_;
function dump(data) {
    dump_(data, logOutputTo);
}
exports.dump = dump;
function error_(msg, logTo) {
    if (logTo === void 0) { logTo = logErrorTo; }
    echoMsgBox(msg, chalk.bgRed.whiteBright, logTo);
}
exports.error_ = error_;
function error(msg) {
    error_(msg, logOutputTo);
}
exports.error = error;
function info_(msg, logTo) {
    if (logTo === void 0) { logTo = logErrorTo; }
    echoMsgBox(msg, chalk.bgBlue.whiteBright, logTo);
}
exports.info_ = info_;
function info(msg) {
    info_(msg, logOutputTo);
}
exports.info = info;
function warn_(msg, logTo) {
    if (logTo === void 0) { logTo = logErrorTo; }
    echoMsgBox(msg, chalk.bgYellowBright.black, logTo);
}
exports.warn_ = warn_;
function warn(msg) {
    warn_(msg, logOutputTo);
}
exports.warn = warn;
function success_(msg, logTo) {
    if (logTo === void 0) { logTo = logErrorTo; }
    echoMsgBox(msg, chalk.bgGreen.whiteBright, logTo);
}
exports.success_ = success_;
function success(msg) {
    success_(msg, logOutputTo);
}
exports.success = success;
function kill(data, headline) {
    if (headline === void 0) { headline = ''; }
    if (!!data) {
        headline.length && warn_(headline);
        error_(data);
    }
    process.exit(1);
}
exports.kill = kill;
function throwLogConfig(conf) {
    logOutputTo = conf.defaltLog || logOutputTo;
    logErrorTo = conf.defaltError || logErrorTo;
}
exports.throwLogConfig = throwLogConfig;
;
