!(function (e) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = e();
  else if ("function" == typeof define && define.amd) define([], e);
  else {
    var f;
    "undefined" != typeof window
      ? (f = window)
      : "undefined" != typeof global
      ? (f = global)
      : "undefined" != typeof self && (f = self),
      (f.to5 = e());
  }
})(function () {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = "MODULE_NOT_FOUND"), f);
        }
        var l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function (e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function (require, module, exports) {
          (function (root, mod) {
            if (typeof exports == "object" && typeof module == "object")
              return mod(exports);
            if (typeof define == "function" && define.amd)
              return define(["exports"], mod);
            mod(root.acorn || (root.acorn = {}));
          })(this, function (exports) {
            "use strict";
            exports.version = "0.9.1";
            var options, input, inputLen, sourceFile;
            exports.parse = function (inpt, opts) {
              input = String(inpt);
              inputLen = input.length;
              setOptions(opts);
              initTokenState();
              var startPos = options.locations
                ? [tokPos, new Position()]
                : tokPos;
              initParserState();
              return parseTopLevel(options.program || startNodeAt(startPos));
            };
            var defaultOptions = (exports.defaultOptions = {
              ecmaVersion: 5,
              strictSemicolons: false,
              allowTrailingCommas: true,
              forbidReserved: false,
              allowReturnOutsideFunction: false,
              locations: false,
              onToken: null,
              onComment: null,
              ranges: false,
              program: null,
              sourceFile: null,
              directSourceFile: null,
              preserveParens: false,
            });
            exports.parseExpressionAt = function (inpt, pos, opts) {
              input = String(inpt);
              inputLen = input.length;
              setOptions(opts);
              initTokenState(pos);
              initParserState();
              return parseExpression();
            };
            var isArray = function (obj) {
              return Object.prototype.toString.call(obj) === "[object Array]";
            };
            function setOptions(opts) {
              options = {};
              for (var opt in defaultOptions)
                options[opt] =
                  opts && has(opts, opt) ? opts[opt] : defaultOptions[opt];
              sourceFile = options.sourceFile || null;
              if (isArray(options.onToken)) {
                var tokens = options.onToken;
                options.onToken = function (token) {
                  tokens.push(token);
                };
              }
              if (isArray(options.onComment)) {
                var comments = options.onComment;
                options.onComment = function (
                  block,
                  text,
                  start,
                  end,
                  startLoc,
                  endLoc
                ) {
                  var comment = {
                    type: block ? "Block" : "Line",
                    value: text,
                    start: start,
                    end: end,
                  };
                  if (options.locations) {
                    comment.loc = new SourceLocation();
                    comment.loc.start = startLoc;
                    comment.loc.end = endLoc;
                  }
                  if (options.ranges) comment.range = [start, end];
                  comments.push(comment);
                };
              }
              if (options.strictMode) {
                strict = true;
              }
              if (options.ecmaVersion >= 7) {
                isKeyword = isEcma7Keyword;
              } else if (options.ecmaVersion === 6) {
                isKeyword = isEcma6Keyword;
              } else {
                isKeyword = isEcma5AndLessKeyword;
              }
            }
            var getLineInfo = (exports.getLineInfo = function (input, offset) {
              for (var line = 1, cur = 0; ; ) {
                lineBreak.lastIndex = cur;
                var match = lineBreak.exec(input);
                if (match && match.index < offset) {
                  ++line;
                  cur = match.index + match[0].length;
                } else break;
              }
              return { line: line, column: offset - cur };
            });
            function Token() {
              this.type = tokType;
              this.value = tokVal;
              this.start = tokStart;
              this.end = tokEnd;
              if (options.locations) {
                this.loc = new SourceLocation();
                this.loc.end = tokEndLoc;
                this.startLoc = tokStartLoc;
                this.endLoc = tokEndLoc;
              }
              if (options.ranges) this.range = [tokStart, tokEnd];
            }
            exports.Token = Token;
            exports.tokenize = function (inpt, opts) {
              input = String(inpt);
              inputLen = input.length;
              setOptions(opts);
              initTokenState();
              skipSpace();
              function getToken(forceRegexp) {
                lastEnd = tokEnd;
                readToken(forceRegexp);
                return new Token();
              }
              getToken.jumpTo = function (pos, reAllowed) {
                tokPos = pos;
                if (options.locations) {
                  tokCurLine = 1;
                  tokLineStart = lineBreak.lastIndex = 0;
                  var match;
                  while ((match = lineBreak.exec(input)) && match.index < pos) {
                    ++tokCurLine;
                    tokLineStart = match.index + match[0].length;
                  }
                }
                tokRegexpAllowed = reAllowed;
                skipSpace();
              };
              getToken.noRegexp = function () {
                tokRegexpAllowed = false;
              };
              getToken.options = options;
              return getToken;
            };
            var tokPos;
            var tokStart, tokEnd;
            var tokStartLoc, tokEndLoc;
            var tokType, tokVal;
            var tokRegexpAllowed;
            var tokCurLine, tokLineStart;
            var lastStart, lastEnd, lastEndLoc;
            var inFunction,
              inGenerator,
              inAsync,
              labels,
              strict,
              inXJSChild,
              inXJSTag,
              inXJSChildExpression;
            var metParenL;
            var inTemplate;
            function initParserState() {
              lastStart = lastEnd = tokPos;
              if (options.locations) lastEndLoc = new Position();
              inFunction = inGenerator = inAsync = strict = false;
              labels = [];
              skipSpace();
              readToken();
            }
            function raise(pos, message) {
              var loc = getLineInfo(input, pos);
              message += " (" + loc.line + ":" + loc.column + ")";
              var err = new SyntaxError(message);
              err.pos = pos;
              err.loc = loc;
              err.raisedAt = tokPos;
              throw err;
            }
            var empty = [];
            var _num = { type: "num" },
              _regexp = { type: "regexp" },
              _string = { type: "string" };
            var _name = { type: "name" },
              _eof = { type: "eof" };
            var _xjsName = { type: "xjsName" },
              _xjsText = { type: "xjsText" };
            var _break = { keyword: "break" },
              _case = { keyword: "case", beforeExpr: true },
              _catch = { keyword: "catch" };
            var _continue = { keyword: "continue" },
              _debugger = { keyword: "debugger" },
              _default = { keyword: "default" };
            var _do = { keyword: "do", isLoop: true },
              _else = { keyword: "else", beforeExpr: true };
            var _finally = { keyword: "finally" },
              _for = { keyword: "for", isLoop: true },
              _function = { keyword: "function" };
            var _if = { keyword: "if" },
              _return = { keyword: "return", beforeExpr: true },
              _switch = { keyword: "switch" };
            var _throw = { keyword: "throw", beforeExpr: true },
              _try = { keyword: "try" },
              _var = { keyword: "var" };
            var _let = { keyword: "let" },
              _const = { keyword: "const" };
            var _while = { keyword: "while", isLoop: true },
              _with = { keyword: "with" },
              _new = { keyword: "new", beforeExpr: true };
            var _this = { keyword: "this" };
            var _class = { keyword: "class" },
              _extends = { keyword: "extends", beforeExpr: true };
            var _export = { keyword: "export" },
              _import = { keyword: "import" };
            var _yield = { keyword: "yield", beforeExpr: true };
            var _async = { keyword: "async" },
              _await = { keyword: "await", beforeExpr: true };
            var _null = { keyword: "null", atomValue: null },
              _true = { keyword: "true", atomValue: true };
            var _false = { keyword: "false", atomValue: false };
            var _in = { keyword: "in", binop: 7, beforeExpr: true };
            var keywordTypes = {
              break: _break,
              case: _case,
              catch: _catch,
              continue: _continue,
              debugger: _debugger,
              default: _default,
              do: _do,
              else: _else,
              finally: _finally,
              for: _for,
              function: _function,
              if: _if,
              return: _return,
              switch: _switch,
              throw: _throw,
              try: _try,
              var: _var,
              let: _let,
              const: _const,
              while: _while,
              with: _with,
              null: _null,
              true: _true,
              false: _false,
              new: _new,
              in: _in,
              instanceof: { keyword: "instanceof", binop: 7, beforeExpr: true },
              this: _this,
              typeof: { keyword: "typeof", prefix: true, beforeExpr: true },
              void: { keyword: "void", prefix: true, beforeExpr: true },
              delete: { keyword: "delete", prefix: true, beforeExpr: true },
              class: _class,
              extends: _extends,
              export: _export,
              import: _import,
              yield: _yield,
              await: _await,
              async: _async,
            };
            var _bracketL = { type: "[", beforeExpr: true },
              _bracketR = { type: "]" },
              _braceL = { type: "{", beforeExpr: true };
            var _braceR = { type: "}" },
              _parenL = { type: "(", beforeExpr: true },
              _parenR = { type: ")" };
            var _comma = { type: ",", beforeExpr: true },
              _semi = { type: ";", beforeExpr: true };
            var _colon = { type: ":", beforeExpr: true },
              _dot = { type: "." },
              _question = { type: "?", beforeExpr: true };
            var _arrow = { type: "=>", beforeExpr: true },
              _bquote = { type: "`" },
              _dollarBraceL = { type: "${", beforeExpr: true };
            var _ltSlash = { type: "</" };
            var _ellipsis = { type: "...", prefix: true, beforeExpr: true };
            var _slash = { binop: 10, beforeExpr: true },
              _eq = { isAssign: true, beforeExpr: true };
            var _assign = { isAssign: true, beforeExpr: true };
            var _incDec = { postfix: true, prefix: true, isUpdate: true },
              _prefix = { prefix: true, beforeExpr: true };
            var _logicalOR = { binop: 1, beforeExpr: true };
            var _logicalAND = { binop: 2, beforeExpr: true };
            var _bitwiseOR = { binop: 3, beforeExpr: true };
            var _bitwiseXOR = { binop: 4, beforeExpr: true };
            var _bitwiseAND = { binop: 5, beforeExpr: true };
            var _equality = { binop: 6, beforeExpr: true };
            var _relational = { binop: 7, beforeExpr: true };
            var _bitShift = { binop: 8, beforeExpr: true };
            var _plusMin = { binop: 9, prefix: true, beforeExpr: true };
            var _modulo = { binop: 10, beforeExpr: true };
            var _star = { binop: 10, beforeExpr: true };
            var _lt = { binop: 7, beforeExpr: true },
              _gt = { binop: 7, beforeExpr: true };
            exports.tokTypes = {
              bracketL: _bracketL,
              bracketR: _bracketR,
              braceL: _braceL,
              braceR: _braceR,
              parenL: _parenL,
              parenR: _parenR,
              comma: _comma,
              semi: _semi,
              colon: _colon,
              dot: _dot,
              ellipsis: _ellipsis,
              question: _question,
              slash: _slash,
              eq: _eq,
              name: _name,
              eof: _eof,
              num: _num,
              regexp: _regexp,
              string: _string,
              arrow: _arrow,
              bquote: _bquote,
              dollarBraceL: _dollarBraceL,
              xjsName: _xjsName,
              xjsText: _xjsText,
              star: _star,
              assign: _assign,
            };
            for (var kw in keywordTypes)
              exports.tokTypes["_" + kw] = keywordTypes[kw];
            function makePredicate(words) {
              words = words.split(" ");
              var f = "",
                cats = [];
              out: for (var i = 0; i < words.length; ++i) {
                for (var j = 0; j < cats.length; ++j)
                  if (cats[j][0].length == words[i].length) {
                    cats[j].push(words[i]);
                    continue out;
                  }
                cats.push([words[i]]);
              }
              function compareTo(arr) {
                if (arr.length == 1)
                  return (f +=
                    "return str === " + JSON.stringify(arr[0]) + ";");
                f += "switch(str){";
                for (var i = 0; i < arr.length; ++i)
                  f += "case " + JSON.stringify(arr[i]) + ":";
                f += "return true}return false;";
              }
              if (cats.length > 3) {
                cats.sort(function (a, b) {
                  return b.length - a.length;
                });
                f += "switch(str.length){";
                for (var i = 0; i < cats.length; ++i) {
                  var cat = cats[i];
                  f += "case " + cat[0].length + ":";
                  compareTo(cat);
                }
                f += "}";
              } else {
                compareTo(words);
              }
              return new Function("str", f);
            }
            var isReservedWord3 = makePredicate(
              "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"
            );
            var isReservedWord5 = makePredicate(
              "class enum extends super const export import"
            );
            var isStrictReservedWord = makePredicate(
              "implements interface let package private protected public static yield"
            );
            var isStrictBadIdWord = makePredicate("eval arguments");
            var ecma5AndLessKeywords =
              "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
            var isEcma5AndLessKeyword = makePredicate(ecma5AndLessKeywords);
            var ecma6AndLessKeywords =
              ecma5AndLessKeywords +
              " let const class extends export import yield";
            var isEcma6Keyword = makePredicate(ecma6AndLessKeywords);
            var isEcma7Keyword = makePredicate(
              ecma6AndLessKeywords + " async await"
            );
            var isKeyword = isEcma5AndLessKeyword;
            var nonASCIIwhitespace =
              /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
            var nonASCIIidentifierStartChars =
              "????????-????-????-????-????-????????-????????-????????-??????-????-????-????-????-??????-????-????-????-????????-??????????????-????????-????-??????-???????????-???????????????-??????-??????-????????????-??????-??????-????????????-??????-?????????-??????????????????-????????????-????????????-??????-????????????????????????-?????????-??????-??????-??????-??????-????????????-??????????????????-????????????-??????-????????????-???????????????-????????????-??????-??????-???????????????????????????-??????-?????????-??????-??????-??????-?????????????????????-??????-??????-??????-??????-????????????????????????-??????-??????-??????????????????-??????-??????-??????-?????????-??????-????????????-???????????????????????????-??????-??????-??????????????????-???????????????-?????????-?????????-??????-??????-??????-?????????-??????-???????????????-??????-?????????-????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-???????????????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-????????????-????????????-?????????-???????????????-??????-??????-??????-?????????-??????-??????-??????-??????-????????????-????????????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-?????????-???????????????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-?????????????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-???";
            var nonASCIIidentifierChars =
              "??-????-????-????????????????-????-??????-????-????????-????-??????-????-????-????-?????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-?????????-????????????-???????????????-??????-?????????-????????????-?????????-?????????-?????????-??????-??????-????????????-??????-?????????-????????????-??????????????????-?????????-??????-??????-?????????-??????-??????-??????-??????-??????????????????-??????-?????????-??????-??????-??????????????????-??????-??????-??????-??????-???????????????-???????????????-?????????-??????-???????????????-??????-??????-?????????-????????????-??????-????????????-?????????????????????-????????????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????????????????-?????????-??????-??????-?????????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-????????????-??????-?????????????????????-?????????-??????-?????????-??????-????????????-?????????-????????????????????????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-???????????????-??????-?????????-?????????????????????-????????????-????????????-?????????-??????-????????????-??????-??????";
            var nonASCIIidentifierStart = new RegExp(
              "[" + nonASCIIidentifierStartChars + "]"
            );
            var nonASCIIidentifier = new RegExp(
              "[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]"
            );
            var newline = /[\n\r\u2028\u2029]/;
            var lineBreak = /\r\n|[\n\r\u2028\u2029]/g;
            var isIdentifierStart = (exports.isIdentifierStart = function (
              code
            ) {
              if (code < 65) return code === 36;
              if (code < 91) return true;
              if (code < 97) return code === 95;
              if (code < 123) return true;
              return (
                code >= 170 &&
                nonASCIIidentifierStart.test(String.fromCharCode(code))
              );
            });
            var isIdentifierChar = (exports.isIdentifierChar = function (code) {
              if (code < 48) return code === 36;
              if (code < 58) return true;
              if (code < 65) return false;
              if (code < 91) return true;
              if (code < 97) return code === 95;
              if (code < 123) return true;
              return (
                code >= 170 &&
                nonASCIIidentifier.test(String.fromCharCode(code))
              );
            });
            function Position() {
              this.line = tokCurLine;
              this.column = tokPos - tokLineStart;
            }
            function initTokenState(pos) {
              if (pos) {
                tokPos = pos;
                tokLineStart = Math.max(0, input.lastIndexOf("\n", pos));
                tokCurLine = input.slice(0, tokLineStart).split(newline).length;
              } else {
                tokCurLine = 1;
                tokPos = tokLineStart = 0;
              }
              tokRegexpAllowed = true;
              metParenL = 0;
              inTemplate = inXJSChild = inXJSTag = false;
            }
            function finishToken(type, val, shouldSkipSpace) {
              tokEnd = tokPos;
              if (options.locations) tokEndLoc = new Position();
              tokType = type;
              if (
                shouldSkipSpace !== false &&
                !(inXJSChild && tokType !== _braceL)
              ) {
                skipSpace();
              }
              tokVal = val;
              tokRegexpAllowed = type.beforeExpr;
              if (options.onToken) {
                options.onToken(new Token());
              }
            }
            function skipBlockComment() {
              var startLoc =
                options.onComment && options.locations && new Position();
              var start = tokPos,
                end = input.indexOf("*/", (tokPos += 2));
              if (end === -1) raise(tokPos - 2, "Unterminated comment");
              tokPos = end + 2;
              if (options.locations) {
                lineBreak.lastIndex = start;
                var match;
                while (
                  (match = lineBreak.exec(input)) &&
                  match.index < tokPos
                ) {
                  ++tokCurLine;
                  tokLineStart = match.index + match[0].length;
                }
              }
              if (options.onComment)
                options.onComment(
                  true,
                  input.slice(start + 2, end),
                  start,
                  tokPos,
                  startLoc,
                  options.locations && new Position()
                );
            }
            function skipLineComment(startSkip) {
              var start = tokPos;
              var startLoc =
                options.onComment && options.locations && new Position();
              var ch = input.charCodeAt((tokPos += startSkip));
              while (
                tokPos < inputLen &&
                ch !== 10 &&
                ch !== 13 &&
                ch !== 8232 &&
                ch !== 8233
              ) {
                ++tokPos;
                ch = input.charCodeAt(tokPos);
              }
              if (options.onComment)
                options.onComment(
                  false,
                  input.slice(start + startSkip, tokPos),
                  start,
                  tokPos,
                  startLoc,
                  options.locations && new Position()
                );
            }
            function skipSpace() {
              while (tokPos < inputLen) {
                var ch = input.charCodeAt(tokPos);
                if (ch === 32) {
                  ++tokPos;
                } else if (ch === 13) {
                  ++tokPos;
                  var next = input.charCodeAt(tokPos);
                  if (next === 10) {
                    ++tokPos;
                  }
                  if (options.locations) {
                    ++tokCurLine;
                    tokLineStart = tokPos;
                  }
                } else if (ch === 10 || ch === 8232 || ch === 8233) {
                  ++tokPos;
                  if (options.locations) {
                    ++tokCurLine;
                    tokLineStart = tokPos;
                  }
                } else if (ch > 8 && ch < 14) {
                  ++tokPos;
                } else if (ch === 47) {
                  var next = input.charCodeAt(tokPos + 1);
                  if (next === 42) {
                    skipBlockComment();
                  } else if (next === 47) {
                    skipLineComment(2);
                  } else break;
                } else if (ch === 160) {
                  ++tokPos;
                } else if (
                  ch >= 5760 &&
                  nonASCIIwhitespace.test(String.fromCharCode(ch))
                ) {
                  ++tokPos;
                } else {
                  break;
                }
              }
            }
            function readToken_dot() {
              var next = input.charCodeAt(tokPos + 1);
              if (next >= 48 && next <= 57) return readNumber(true);
              var next2 = input.charCodeAt(tokPos + 2);
              if (options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
                tokPos += 3;
                return finishToken(_ellipsis);
              } else {
                ++tokPos;
                return finishToken(_dot);
              }
            }
            function readToken_slash() {
              var next = input.charCodeAt(tokPos + 1);
              if (tokRegexpAllowed) {
                ++tokPos;
                return readRegexp();
              }
              if (next === 61) return finishOp(_assign, 2);
              return finishOp(_slash, 1);
            }
            function readToken_mult_modulo(code) {
              var next = input.charCodeAt(tokPos + 1);
              if (next === 61) return finishOp(_assign, 2);
              return finishOp(code === 42 ? _star : _modulo, 1);
            }
            function readToken_pipe_amp(code) {
              var next = input.charCodeAt(tokPos + 1);
              if (next === code)
                return finishOp(code === 124 ? _logicalOR : _logicalAND, 2);
              if (next === 61) return finishOp(_assign, 2);
              return finishOp(code === 124 ? _bitwiseOR : _bitwiseAND, 1);
            }
            function readToken_caret() {
              var next = input.charCodeAt(tokPos + 1);
              if (next === 61) return finishOp(_assign, 2);
              return finishOp(_bitwiseXOR, 1);
            }
            function readToken_plus_min(code) {
              var next = input.charCodeAt(tokPos + 1);
              if (next === code) {
                if (
                  next == 45 &&
                  input.charCodeAt(tokPos + 2) == 62 &&
                  newline.test(input.slice(lastEnd, tokPos))
                ) {
                  skipLineComment(3);
                  skipSpace();
                  return readToken();
                }
                return finishOp(_incDec, 2);
              }
              if (next === 61) return finishOp(_assign, 2);
              return finishOp(_plusMin, 1);
            }
            function readToken_lt_gt(code) {
              var next = input.charCodeAt(tokPos + 1);
              var size = 1;
              if (next === code) {
                size =
                  code === 62 && input.charCodeAt(tokPos + 2) === 62 ? 3 : 2;
                if (input.charCodeAt(tokPos + size) === 61)
                  return finishOp(_assign, size + 1);
                return finishOp(_bitShift, size);
              }
              if (
                next == 33 &&
                code == 60 &&
                input.charCodeAt(tokPos + 2) == 45 &&
                input.charCodeAt(tokPos + 3) == 45
              ) {
                skipLineComment(4);
                skipSpace();
                return readToken();
              }
              if (next === 61) {
                size = input.charCodeAt(tokPos + 2) === 61 ? 3 : 2;
                return finishOp(_relational, size);
              }
              if (next === 47) {
                size = 2;
                return finishOp(_ltSlash, size);
              }
              return code === 60
                ? finishOp(_lt, size)
                : finishOp(_gt, size, !inXJSTag);
            }
            function readToken_eq_excl(code) {
              var next = input.charCodeAt(tokPos + 1);
              if (next === 61)
                return finishOp(
                  _equality,
                  input.charCodeAt(tokPos + 2) === 61 ? 3 : 2
                );
              if (code === 61 && next === 62 && options.ecmaVersion >= 6) {
                tokPos += 2;
                return finishToken(_arrow);
              }
              return finishOp(code === 61 ? _eq : _prefix, 1);
            }
            function getTemplateToken(code) {
              if (tokType === _string) {
                if (code === 96) {
                  ++tokPos;
                  return finishToken(_bquote);
                } else if (
                  code === 36 &&
                  input.charCodeAt(tokPos + 1) === 123
                ) {
                  tokPos += 2;
                  return finishToken(_dollarBraceL);
                }
              }
              if (code === 125) {
                ++tokPos;
                return finishToken(_braceR, undefined, false);
              }
              return readTmplString();
            }
            function getTokenFromCode(code) {
              switch (code) {
                case 46:
                  return readToken_dot();
                case 40:
                  ++tokPos;
                  return finishToken(_parenL);
                case 41:
                  ++tokPos;
                  return finishToken(_parenR);
                case 59:
                  ++tokPos;
                  return finishToken(_semi);
                case 44:
                  ++tokPos;
                  return finishToken(_comma);
                case 91:
                  ++tokPos;
                  return finishToken(_bracketL);
                case 93:
                  ++tokPos;
                  return finishToken(_bracketR);
                case 123:
                  ++tokPos;
                  return finishToken(_braceL);
                case 125:
                  ++tokPos;
                  return finishToken(_braceR, undefined, !inXJSChildExpression);
                case 58:
                  ++tokPos;
                  return finishToken(_colon);
                case 63:
                  ++tokPos;
                  return finishToken(_question);
                case 96:
                  if (options.ecmaVersion >= 6) {
                    ++tokPos;
                    return finishToken(_bquote, undefined, false);
                  }
                case 48:
                  var next = input.charCodeAt(tokPos + 1);
                  if (next === 120 || next === 88) return readRadixNumber(16);
                  if (options.ecmaVersion >= 6) {
                    if (next === 111 || next === 79) return readRadixNumber(8);
                    if (next === 98 || next === 66) return readRadixNumber(2);
                  }
                case 49:
                case 50:
                case 51:
                case 52:
                case 53:
                case 54:
                case 55:
                case 56:
                case 57:
                  return readNumber(false);
                case 34:
                case 39:
                  return inXJSTag ? readXJSStringLiteral() : readString(code);
                case 47:
                  return readToken_slash();
                case 37:
                case 42:
                  return readToken_mult_modulo(code);
                case 124:
                case 38:
                  return readToken_pipe_amp(code);
                case 94:
                  return readToken_caret();
                case 43:
                case 45:
                  return readToken_plus_min(code);
                case 60:
                case 62:
                  return readToken_lt_gt(code);
                case 61:
                case 33:
                  return readToken_eq_excl(code);
                case 126:
                  return finishOp(_prefix, 1);
              }
              return false;
            }
            function readToken(forceRegexp) {
              if (!forceRegexp) tokStart = tokPos;
              else tokPos = tokStart + 1;
              if (options.locations) tokStartLoc = new Position();
              if (forceRegexp) return readRegexp();
              if (tokPos >= inputLen) return finishToken(_eof);
              var code = input.charCodeAt(tokPos);
              if (
                inXJSChild &&
                tokType !== _braceL &&
                code !== 60 &&
                code !== 123 &&
                code !== 125
              ) {
                return readXJSText(["<", "{"]);
              }
              if (inTemplate) return getTemplateToken(code);
              if (isIdentifierStart(code) || code === 92) return readWord();
              var tok = getTokenFromCode(code);
              if (tok === false) {
                var ch = String.fromCharCode(code);
                if (ch === "\\" || nonASCIIidentifierStart.test(ch))
                  return readWord();
                raise(tokPos, "Unexpected character '" + ch + "'");
              }
              return tok;
            }
            function finishOp(type, size, shouldSkipSpace) {
              var str = input.slice(tokPos, tokPos + size);
              tokPos += size;
              finishToken(type, str, shouldSkipSpace);
            }
            var regexpUnicodeSupport = false;
            try {
              new RegExp("???", "u");
              regexpUnicodeSupport = true;
            } catch (e) {}
            function readRegexp() {
              var content = "",
                escaped,
                inClass,
                start = tokPos;
              for (;;) {
                if (tokPos >= inputLen)
                  raise(start, "Unterminated regular expression");
                var ch = nextChar();
                if (newline.test(ch))
                  raise(start, "Unterminated regular expression");
                if (!escaped) {
                  if (ch === "[") inClass = true;
                  else if (ch === "]" && inClass) inClass = false;
                  else if (ch === "/" && !inClass) break;
                  escaped = ch === "\\";
                } else escaped = false;
                ++tokPos;
              }
              var content = input.slice(start, tokPos);
              ++tokPos;
              var mods = readWord1();
              var tmp = content;
              if (mods) {
                var validFlags = /^[gmsiy]*$/;
                if (options.ecmaVersion >= 6) validFlags = /^[gmsiyu]*$/;
                if (!validFlags.test(mods))
                  raise(start, "Invalid regular expression flag");
                if (mods.indexOf("u") >= 0 && !regexpUnicodeSupport) {
                  tmp = tmp
                    .replace(/\\u\{([0-9a-fA-F]{5,6})\}/g, "x")
                    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
                }
              }
              try {
                new RegExp(tmp);
              } catch (e) {
                if (e instanceof SyntaxError)
                  raise(
                    start,
                    "Error parsing regular expression: " + e.message
                  );
                raise(e);
              }
              try {
                var value = new RegExp(content, mods);
              } catch (err) {
                value = null;
              }
              return finishToken(_regexp, {
                pattern: content,
                flags: mods,
                value: value,
              });
            }
            function readInt(radix, len) {
              var start = tokPos,
                total = 0;
              for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
                var code = input.charCodeAt(tokPos),
                  val;
                if (code >= 97) val = code - 97 + 10;
                else if (code >= 65) val = code - 65 + 10;
                else if (code >= 48 && code <= 57) val = code - 48;
                else val = Infinity;
                if (val >= radix) break;
                ++tokPos;
                total = total * radix + val;
              }
              if (tokPos === start || (len != null && tokPos - start !== len))
                return null;
              return total;
            }
            function readRadixNumber(radix) {
              tokPos += 2;
              var val = readInt(radix);
              if (val == null)
                raise(tokStart + 2, "Expected number in radix " + radix);
              if (isIdentifierStart(input.charCodeAt(tokPos)))
                raise(tokPos, "Identifier directly after number");
              return finishToken(_num, val);
            }
            function readNumber(startsWithDot) {
              var start = tokPos,
                isFloat = false,
                octal = input.charCodeAt(tokPos) === 48;
              if (!startsWithDot && readInt(10) === null)
                raise(start, "Invalid number");
              if (input.charCodeAt(tokPos) === 46) {
                ++tokPos;
                readInt(10);
                isFloat = true;
              }
              var next = input.charCodeAt(tokPos);
              if (next === 69 || next === 101) {
                next = input.charCodeAt(++tokPos);
                if (next === 43 || next === 45) ++tokPos;
                if (readInt(10) === null) raise(start, "Invalid number");
                isFloat = true;
              }
              if (isIdentifierStart(input.charCodeAt(tokPos)))
                raise(tokPos, "Identifier directly after number");
              var str = input.slice(start, tokPos),
                val;
              if (isFloat) val = parseFloat(str);
              else if (!octal || str.length === 1) val = parseInt(str, 10);
              else if (/[89]/.test(str) || strict)
                raise(start, "Invalid number");
              else val = parseInt(str, 8);
              return finishToken(_num, val);
            }
            function readCodePoint() {
              var ch = input.charCodeAt(tokPos),
                code;
              if (ch === 123) {
                if (options.ecmaVersion < 6) unexpected();
                ++tokPos;
                code = readHexChar(input.indexOf("}", tokPos) - tokPos);
                ++tokPos;
                if (code > 1114111) unexpected();
              } else {
                code = readHexChar(4);
              }
              if (code <= 65535) {
                return String.fromCharCode(code);
              }
              var cu1 = ((code - 65536) >> 10) + 55296;
              var cu2 = ((code - 65536) & 1023) + 56320;
              return String.fromCharCode(cu1, cu2);
            }
            function readString(quote) {
              ++tokPos;
              var out = "";
              for (;;) {
                if (tokPos >= inputLen)
                  raise(tokStart, "Unterminated string constant");
                var ch = input.charCodeAt(tokPos);
                if (ch === quote) {
                  ++tokPos;
                  return finishToken(_string, out);
                }
                if (ch === 92) {
                  out += readEscapedChar();
                } else {
                  ++tokPos;
                  if (newline.test(String.fromCharCode(ch))) {
                    raise(tokStart, "Unterminated string constant");
                  }
                  out += String.fromCharCode(ch);
                }
              }
            }
            function readTmplString() {
              var out = "";
              for (;;) {
                if (tokPos >= inputLen)
                  raise(tokStart, "Unterminated string constant");
                var ch = input.charCodeAt(tokPos);
                if (
                  ch === 96 ||
                  (ch === 36 && input.charCodeAt(tokPos + 1) === 123)
                )
                  return finishToken(_string, out);
                if (ch === 92) {
                  out += readEscapedChar();
                } else {
                  ++tokPos;
                  if (newline.test(String.fromCharCode(ch))) {
                    if (ch === 13 && input.charCodeAt(tokPos) === 10) {
                      ++tokPos;
                      ch = 10;
                    }
                    if (options.locations) {
                      ++tokCurLine;
                      tokLineStart = tokPos;
                    }
                  }
                  out += String.fromCharCode(ch);
                }
              }
            }
            function readEscapedChar() {
              var ch = input.charCodeAt(++tokPos);
              var octal = /^[0-7]+/.exec(input.slice(tokPos, tokPos + 3));
              if (octal) octal = octal[0];
              while (octal && parseInt(octal, 8) > 255)
                octal = octal.slice(0, -1);
              if (octal === "0") octal = null;
              ++tokPos;
              if (octal) {
                if (strict) raise(tokPos - 2, "Octal literal in strict mode");
                tokPos += octal.length - 1;
                return String.fromCharCode(parseInt(octal, 8));
              } else {
                switch (ch) {
                  case 110:
                    return "\n";
                  case 114:
                    return "\r";
                  case 120:
                    return String.fromCharCode(readHexChar(2));
                  case 117:
                    return readCodePoint();
                  case 116:
                    return "	";
                  case 98:
                    return "\b";
                  case 118:
                    return "";
                  case 102:
                    return "\f";
                  case 48:
                    return "\x00";
                  case 13:
                    if (input.charCodeAt(tokPos) === 10) ++tokPos;
                  case 10:
                    if (options.locations) {
                      tokLineStart = tokPos;
                      ++tokCurLine;
                    }
                    return "";
                  default:
                    return String.fromCharCode(ch);
                }
              }
            }
            var XHTMLEntities = {
              quot: '"',
              amp: "&",
              apos: "'",
              lt: "<",
              gt: ">",
              nbsp: "??",
              iexcl: "??",
              cent: "??",
              pound: "??",
              curren: "??",
              yen: "??",
              brvbar: "??",
              sect: "??",
              uml: "??",
              copy: "??",
              ordf: "??",
              laquo: "??",
              not: "??",
              shy: "??",
              reg: "??",
              macr: "??",
              deg: "??",
              plusmn: "??",
              sup2: "??",
              sup3: "??",
              acute: "??",
              micro: "??",
              para: "??",
              middot: "??",
              cedil: "??",
              sup1: "??",
              ordm: "??",
              raquo: "??",
              frac14: "??",
              frac12: "??",
              frac34: "??",
              iquest: "??",
              Agrave: "??",
              Aacute: "??",
              Acirc: "??",
              Atilde: "??",
              Auml: "??",
              Aring: "??",
              AElig: "??",
              Ccedil: "??",
              Egrave: "??",
              Eacute: "??",
              Ecirc: "??",
              Euml: "??",
              Igrave: "??",
              Iacute: "??",
              Icirc: "??",
              Iuml: "??",
              ETH: "??",
              Ntilde: "??",
              Ograve: "??",
              Oacute: "??",
              Ocirc: "??",
              Otilde: "??",
              Ouml: "??",
              times: "??",
              Oslash: "??",
              Ugrave: "??",
              Uacute: "??",
              Ucirc: "??",
              Uuml: "??",
              Yacute: "??",
              THORN: "??",
              szlig: "??",
              agrave: "??",
              aacute: "??",
              acirc: "??",
              atilde: "??",
              auml: "??",
              aring: "??",
              aelig: "??",
              ccedil: "??",
              egrave: "??",
              eacute: "??",
              ecirc: "??",
              euml: "??",
              igrave: "??",
              iacute: "??",
              icirc: "??",
              iuml: "??",
              eth: "??",
              ntilde: "??",
              ograve: "??",
              oacute: "??",
              ocirc: "??",
              otilde: "??",
              ouml: "??",
              divide: "??",
              oslash: "??",
              ugrave: "??",
              uacute: "??",
              ucirc: "??",
              uuml: "??",
              yacute: "??",
              thorn: "??",
              yuml: "??",
              OElig: "??",
              oelig: "??",
              Scaron: "??",
              scaron: "??",
              Yuml: "??",
              fnof: "??",
              circ: "??",
              tilde: "??",
              Alpha: "??",
              Beta: "??",
              Gamma: "??",
              Delta: "??",
              Epsilon: "??",
              Zeta: "??",
              Eta: "??",
              Theta: "??",
              Iota: "??",
              Kappa: "??",
              Lambda: "??",
              Mu: "??",
              Nu: "??",
              Xi: "??",
              Omicron: "??",
              Pi: "??",
              Rho: "??",
              Sigma: "??",
              Tau: "??",
              Upsilon: "??",
              Phi: "??",
              Chi: "??",
              Psi: "??",
              Omega: "??",
              alpha: "??",
              beta: "??",
              gamma: "??",
              delta: "??",
              epsilon: "??",
              zeta: "??",
              eta: "??",
              theta: "??",
              iota: "??",
              kappa: "??",
              lambda: "??",
              mu: "??",
              nu: "??",
              xi: "??",
              omicron: "??",
              pi: "??",
              rho: "??",
              sigmaf: "??",
              sigma: "??",
              tau: "??",
              upsilon: "??",
              phi: "??",
              chi: "??",
              psi: "??",
              omega: "??",
              thetasym: "??",
              upsih: "??",
              piv: "??",
              ensp: "???",
              emsp: "???",
              thinsp: "???",
              zwnj: "???",
              zwj: "???",
              lrm: "???",
              rlm: "???",
              ndash: "???",
              mdash: "???",
              lsquo: "???",
              rsquo: "???",
              sbquo: "???",
              ldquo: "???",
              rdquo: "???",
              bdquo: "???",
              dagger: "???",
              Dagger: "???",
              bull: "???",
              hellip: "???",
              permil: "???",
              prime: "???",
              Prime: "???",
              lsaquo: "???",
              rsaquo: "???",
              oline: "???",
              frasl: "???",
              euro: "???",
              image: "???",
              weierp: "???",
              real: "???",
              trade: "???",
              alefsym: "???",
              larr: "???",
              uarr: "???",
              rarr: "???",
              darr: "???",
              harr: "???",
              crarr: "???",
              lArr: "???",
              uArr: "???",
              rArr: "???",
              dArr: "???",
              hArr: "???",
              forall: "???",
              part: "???",
              exist: "???",
              empty: "???",
              nabla: "???",
              isin: "???",
              notin: "???",
              ni: "???",
              prod: "???",
              sum: "???",
              minus: "???",
              lowast: "???",
              radic: "???",
              prop: "???",
              infin: "???",
              ang: "???",
              and: "???",
              or: "???",
              cap: "???",
              cup: "???",
              int: "???",
              there4: "???",
              sim: "???",
              cong: "???",
              asymp: "???",
              ne: "???",
              equiv: "???",
              le: "???",
              ge: "???",
              sub: "???",
              sup: "???",
              nsub: "???",
              sube: "???",
              supe: "???",
              oplus: "???",
              otimes: "???",
              perp: "???",
              sdot: "???",
              lceil: "???",
              rceil: "???",
              lfloor: "???",
              rfloor: "???",
              lang: "???",
              rang: "???",
              loz: "???",
              spades: "???",
              clubs: "???",
              hearts: "???",
              diams: "???",
            };
            function readXJSEntity() {
              var str = "",
                count = 0,
                entity;
              var ch = nextChar();
              if (ch !== "&")
                raise(tokPos, "Entity must start with an ampersand");
              tokPos++;
              while (tokPos < inputLen && count++ < 10) {
                ch = nextChar();
                tokPos++;
                if (ch === ";") {
                  break;
                }
                str += ch;
              }
              if (str[0] === "#" && str[1] === "x") {
                entity = String.fromCharCode(parseInt(str.substr(2), 16));
              } else if (str[0] === "#") {
                entity = String.fromCharCode(parseInt(str.substr(1), 10));
              } else {
                entity = XHTMLEntities[str];
              }
              return entity;
            }
            function readXJSText(stopChars) {
              var str = "";
              while (tokPos < inputLen) {
                var ch = nextChar();
                if (stopChars.indexOf(ch) !== -1) {
                  break;
                }
                if (ch === "&") {
                  str += readXJSEntity();
                } else {
                  ++tokPos;
                  if (ch === "\r" && nextChar() === "\n") {
                    str += ch;
                    ++tokPos;
                    ch = "\n";
                  }
                  if (ch === "\n" && options.locations) {
                    tokLineStart = tokPos;
                    ++tokCurLine;
                  }
                  str += ch;
                }
              }
              return finishToken(_xjsText, str);
            }
            function readXJSStringLiteral() {
              var quote = input.charCodeAt(tokPos);
              if (quote !== 34 && quote !== 39) {
                raise("String literal must starts with a quote");
              }
              ++tokPos;
              readXJSText([String.fromCharCode(quote)]);
              if (quote !== input.charCodeAt(tokPos)) {
                unexpected();
              }
              ++tokPos;
              return finishToken(tokType, tokVal);
            }
            function readHexChar(len) {
              var n = readInt(16, len);
              if (n === null) raise(tokStart, "Bad character escape sequence");
              return n;
            }
            var containsEsc;
            function readWord1() {
              containsEsc = false;
              var word,
                first = true,
                start = tokPos;
              for (;;) {
                var ch = input.charCodeAt(tokPos);
                if (isIdentifierChar(ch) || (inXJSTag && ch === 45)) {
                  if (containsEsc) word += nextChar();
                  ++tokPos;
                } else if (ch === 92 && !inXJSTag) {
                  if (!containsEsc) word = input.slice(start, tokPos);
                  containsEsc = true;
                  if (input.charCodeAt(++tokPos) != 117)
                    raise(tokPos, "Expecting Unicode escape sequence \\uXXXX");
                  ++tokPos;
                  var esc = readHexChar(4);
                  var escStr = String.fromCharCode(esc);
                  if (!escStr) raise(tokPos - 1, "Invalid Unicode escape");
                  if (!(first ? isIdentifierStart(esc) : isIdentifierChar(esc)))
                    raise(tokPos - 4, "Invalid Unicode escape");
                  word += escStr;
                } else {
                  break;
                }
                first = false;
              }
              return containsEsc ? word : input.slice(start, tokPos);
            }
            function readWord() {
              var word = readWord1();
              var type = inXJSTag ? _xjsName : _name;
              if (!containsEsc && isKeyword(word)) type = keywordTypes[word];
              return finishToken(type, word);
            }
            function next() {
              lastStart = tokStart;
              lastEnd = tokEnd;
              lastEndLoc = tokEndLoc;
              readToken();
            }
            function setStrict(strct) {
              strict = strct;
              tokPos = tokStart;
              if (options.locations) {
                while (tokPos < tokLineStart) {
                  tokLineStart = input.lastIndexOf("\n", tokLineStart - 2) + 1;
                  --tokCurLine;
                }
              }
              skipSpace();
              readToken();
            }
            function Node() {
              this.type = null;
              this.start = tokStart;
              this.end = null;
            }
            exports.Node = Node;
            function SourceLocation() {
              this.start = tokStartLoc;
              this.end = null;
              if (sourceFile !== null) this.source = sourceFile;
            }
            function startNode() {
              var node = new Node();
              if (options.locations) node.loc = new SourceLocation();
              if (options.directSourceFile)
                node.sourceFile = options.directSourceFile;
              if (options.ranges) node.range = [tokStart, 0];
              return node;
            }
            function storeCurrentPos() {
              return options.locations ? [tokStart, tokStartLoc] : tokStart;
            }
            function startNodeAt(pos) {
              var node = new Node(),
                start = pos;
              if (options.locations) {
                node.loc = new SourceLocation();
                node.loc.start = start[1];
                start = pos[0];
              }
              node.start = start;
              if (options.directSourceFile)
                node.sourceFile = options.directSourceFile;
              if (options.ranges) node.range = [start, 0];
              return node;
            }
            function finishNode(node, type) {
              node.type = type;
              node.end = lastEnd;
              if (options.locations) node.loc.end = lastEndLoc;
              if (options.ranges) node.range[1] = lastEnd;
              return node;
            }
            function isUseStrict(stmt) {
              return (
                options.ecmaVersion >= 5 &&
                stmt.type === "ExpressionStatement" &&
                stmt.expression.type === "Literal" &&
                stmt.expression.value === "use strict"
              );
            }
            function eat(type) {
              if (tokType === type) {
                next();
                return true;
              } else {
                return false;
              }
            }
            function canInsertSemicolon() {
              return (
                !options.strictSemicolons &&
                (tokType === _eof ||
                  tokType === _braceR ||
                  newline.test(input.slice(lastEnd, tokStart)))
              );
            }
            function semicolon() {
              if (!eat(_semi) && !canInsertSemicolon()) unexpected();
            }
            function expect(type) {
              eat(type) || unexpected();
            }
            function nextChar() {
              return input.charAt(tokPos);
            }
            function unexpected(pos) {
              raise(pos != null ? pos : tokStart, "Unexpected token");
            }
            function has(obj, propName) {
              return Object.prototype.hasOwnProperty.call(obj, propName);
            }
            function toAssignable(node, allowSpread, checkType) {
              if (options.ecmaVersion >= 6 && node) {
                switch (node.type) {
                  case "Identifier":
                  case "MemberExpression":
                    break;
                  case "ObjectExpression":
                    node.type = "ObjectPattern";
                    for (var i = 0; i < node.properties.length; i++) {
                      var prop = node.properties[i];
                      if (prop.kind !== "init") unexpected(prop.key.start);
                      toAssignable(prop.value, false, checkType);
                    }
                    break;
                  case "ArrayExpression":
                    node.type = "ArrayPattern";
                    for (
                      var i = 0, lastI = node.elements.length - 1;
                      i <= lastI;
                      i++
                    ) {
                      toAssignable(node.elements[i], i === lastI, checkType);
                    }
                    break;
                  case "SpreadElement":
                    if (allowSpread) {
                      toAssignable(node.argument, false, checkType);
                      checkSpreadAssign(node.argument);
                    } else {
                      unexpected(node.start);
                    }
                    break;
                  default:
                    if (checkType) unexpected(node.start);
                }
              }
              return node;
            }
            function checkSpreadAssign(node) {
              if (node.type !== "Identifier" && node.type !== "ArrayPattern")
                unexpected(node.start);
            }
            function checkFunctionParam(param, nameHash) {
              switch (param.type) {
                case "Identifier":
                  if (
                    isStrictReservedWord(param.name) ||
                    isStrictBadIdWord(param.name)
                  )
                    raise(
                      param.start,
                      "Defining '" + param.name + "' in strict mode"
                    );
                  if (has(nameHash, param.name))
                    raise(param.start, "Argument name clash in strict mode");
                  nameHash[param.name] = true;
                  break;
                case "ObjectPattern":
                  for (var i = 0; i < param.properties.length; i++)
                    checkFunctionParam(param.properties[i].value, nameHash);
                  break;
                case "ArrayPattern":
                  for (var i = 0; i < param.elements.length; i++) {
                    var elem = param.elements[i];
                    if (elem) checkFunctionParam(elem, nameHash);
                  }
                  break;
              }
            }
            function checkPropClash(prop, propHash) {
              if (options.ecmaVersion >= 6) return;
              var key = prop.key,
                name;
              switch (key.type) {
                case "Identifier":
                  name = key.name;
                  break;
                case "Literal":
                  name = String(key.value);
                  break;
                default:
                  return;
              }
              var kind = prop.kind || "init",
                other;
              if (has(propHash, name)) {
                other = propHash[name];
                var isGetSet = kind !== "init";
                if (
                  ((strict || isGetSet) && other[kind]) ||
                  !(isGetSet ^ other.init)
                )
                  raise(key.start, "Redefinition of property");
              } else {
                other = propHash[name] = {
                  init: false,
                  get: false,
                  set: false,
                };
              }
              other[kind] = true;
            }
            function checkLVal(expr, isBinding) {
              switch (expr.type) {
                case "Identifier":
                  if (
                    strict &&
                    (isStrictBadIdWord(expr.name) ||
                      isStrictReservedWord(expr.name))
                  )
                    raise(
                      expr.start,
                      isBinding
                        ? "Binding " + expr.name + " in strict mode"
                        : "Assigning to " + expr.name + " in strict mode"
                    );
                  break;
                case "MemberExpression":
                  if (!isBinding) break;
                case "ObjectPattern":
                  for (var i = 0; i < expr.properties.length; i++)
                    checkLVal(expr.properties[i].value, isBinding);
                  break;
                case "ArrayPattern":
                  for (var i = 0; i < expr.elements.length; i++) {
                    var elem = expr.elements[i];
                    if (elem) checkLVal(elem, isBinding);
                  }
                  break;
                case "SpreadElement":
                  break;
                default:
                  raise(expr.start, "Assigning to rvalue");
              }
            }
            function parseTopLevel(node) {
              var first = true;
              if (!node.body) node.body = [];
              while (tokType !== _eof) {
                var stmt = parseStatement();
                node.body.push(stmt);
                if (first && isUseStrict(stmt)) setStrict(true);
                first = false;
              }
              lastStart = tokStart;
              lastEnd = tokEnd;
              lastEndLoc = tokEndLoc;
              return finishNode(node, "Program");
            }
            var loopLabel = { kind: "loop" },
              switchLabel = { kind: "switch" };
            function parseStatement() {
              if (tokType === _slash || (tokType === _assign && tokVal == "/="))
                readToken(true);
              var starttype = tokType,
                node = startNode();
              switch (starttype) {
                case _break:
                case _continue:
                  return parseBreakContinueStatement(node, starttype.keyword);
                case _debugger:
                  return parseDebuggerStatement(node);
                case _do:
                  return parseDoStatement(node);
                case _for:
                  return parseForStatement(node);
                case _async:
                  return parseAsync(node, true);
                case _function:
                  return parseFunctionStatement(node);
                case _class:
                  return parseClass(node, true);
                case _if:
                  return parseIfStatement(node);
                case _return:
                  return parseReturnStatement(node);
                case _switch:
                  return parseSwitchStatement(node);
                case _throw:
                  return parseThrowStatement(node);
                case _try:
                  return parseTryStatement(node);
                case _var:
                case _let:
                case _const:
                  return parseVarStatement(node, starttype.keyword);
                case _while:
                  return parseWhileStatement(node);
                case _with:
                  return parseWithStatement(node);
                case _braceL:
                  return parseBlock();
                case _semi:
                  return parseEmptyStatement(node);
                case _export:
                  return parseExport(node);
                case _import:
                  return parseImport(node);
                default:
                  var maybeName = tokVal,
                    expr = parseExpression();
                  if (
                    starttype === _name &&
                    expr.type === "Identifier" &&
                    eat(_colon)
                  )
                    return parseLabeledStatement(node, maybeName, expr);
                  else return parseExpressionStatement(node, expr);
              }
            }
            function parseBreakContinueStatement(node, keyword) {
              var isBreak = keyword == "break";
              next();
              if (eat(_semi) || canInsertSemicolon()) node.label = null;
              else if (tokType !== _name) unexpected();
              else {
                node.label = parseIdent();
                semicolon();
              }
              for (var i = 0; i < labels.length; ++i) {
                var lab = labels[i];
                if (node.label == null || lab.name === node.label.name) {
                  if (lab.kind != null && (isBreak || lab.kind === "loop"))
                    break;
                  if (node.label && isBreak) break;
                }
              }
              if (i === labels.length)
                raise(node.start, "Unsyntactic " + keyword);
              return finishNode(
                node,
                isBreak ? "BreakStatement" : "ContinueStatement"
              );
            }
            function parseDebuggerStatement(node) {
              next();
              semicolon();
              return finishNode(node, "DebuggerStatement");
            }
            function parseDoStatement(node) {
              next();
              labels.push(loopLabel);
              node.body = parseStatement();
              labels.pop();
              expect(_while);
              node.test = parseParenExpression();
              semicolon();
              return finishNode(node, "DoWhileStatement");
            }
            function parseForStatement(node) {
              next();
              labels.push(loopLabel);
              expect(_parenL);
              if (tokType === _semi) return parseFor(node, null);
              if (tokType === _var || tokType === _let) {
                var init = startNode(),
                  varKind = tokType.keyword,
                  isLet = tokType === _let;
                next();
                parseVar(init, true, varKind);
                finishNode(init, "VariableDeclaration");
                if (
                  (tokType === _in ||
                    (options.ecmaVersion >= 6 &&
                      tokType === _name &&
                      tokVal === "of")) &&
                  init.declarations.length === 1 &&
                  !(isLet && init.declarations[0].init)
                )
                  return parseForIn(node, init);
                return parseFor(node, init);
              }
              var init = parseExpression(false, true);
              if (
                tokType === _in ||
                (options.ecmaVersion >= 6 &&
                  tokType === _name &&
                  tokVal === "of")
              ) {
                checkLVal(init);
                return parseForIn(node, init);
              }
              return parseFor(node, init);
            }
            function parseFunctionStatement(node) {
              next();
              return parseFunction(node, true, false);
            }
            function parseAsync(node, isStatement) {
              if (options.ecmaVersion < 7) {
                unexpected();
              }
              next();
              switch (tokType) {
                case _function:
                  next();
                  return parseFunction(node, isStatement, true);
                  if (!isStatement) unexpected();
                case _name:
                  var id = parseIdent(tokType !== _name);
                  if (eat(_arrow)) {
                    return parseArrowExpression(node, [id], true);
                  }
                case _parenL:
                  var oldParenL = ++metParenL;
                  var exprList = [];
                  next();
                  if (tokType !== _parenR) {
                    var val = parseExpression();
                    exprList =
                      val.type === "SequenceExpression"
                        ? val.expressions
                        : [val];
                  }
                  expect(_parenR);
                  if (metParenL === oldParenL && eat(_arrow)) {
                    return parseArrowExpression(node, exprList, true);
                  }
                default:
                  unexpected();
              }
            }
            function parseIfStatement(node) {
              next();
              node.test = parseParenExpression();
              node.consequent = parseStatement();
              node.alternate = eat(_else) ? parseStatement() : null;
              return finishNode(node, "IfStatement");
            }
            function parseReturnStatement(node) {
              if (!inFunction && !options.allowReturnOutsideFunction)
                raise(tokStart, "'return' outside of function");
              next();
              if (eat(_semi) || canInsertSemicolon()) node.argument = null;
              else {
                node.argument = parseExpression();
                semicolon();
              }
              return finishNode(node, "ReturnStatement");
            }
            function parseSwitchStatement(node) {
              next();
              node.discriminant = parseParenExpression();
              node.cases = [];
              expect(_braceL);
              labels.push(switchLabel);
              for (var cur, sawDefault; tokType != _braceR; ) {
                if (tokType === _case || tokType === _default) {
                  var isCase = tokType === _case;
                  if (cur) finishNode(cur, "SwitchCase");
                  node.cases.push((cur = startNode()));
                  cur.consequent = [];
                  next();
                  if (isCase) cur.test = parseExpression();
                  else {
                    if (sawDefault)
                      raise(lastStart, "Multiple default clauses");
                    sawDefault = true;
                    cur.test = null;
                  }
                  expect(_colon);
                } else {
                  if (!cur) unexpected();
                  cur.consequent.push(parseStatement());
                }
              }
              if (cur) finishNode(cur, "SwitchCase");
              next();
              labels.pop();
              return finishNode(node, "SwitchStatement");
            }
            function parseThrowStatement(node) {
              next();
              if (newline.test(input.slice(lastEnd, tokStart)))
                raise(lastEnd, "Illegal newline after throw");
              node.argument = parseExpression();
              semicolon();
              return finishNode(node, "ThrowStatement");
            }
            function parseTryStatement(node) {
              next();
              node.block = parseBlock();
              node.handler = null;
              if (tokType === _catch) {
                var clause = startNode();
                next();
                expect(_parenL);
                clause.param = parseIdent();
                if (strict && isStrictBadIdWord(clause.param.name))
                  raise(
                    clause.param.start,
                    "Binding " + clause.param.name + " in strict mode"
                  );
                expect(_parenR);
                clause.guard = null;
                clause.body = parseBlock();
                node.handler = finishNode(clause, "CatchClause");
              }
              node.guardedHandlers = empty;
              node.finalizer = eat(_finally) ? parseBlock() : null;
              if (!node.handler && !node.finalizer)
                raise(node.start, "Missing catch or finally clause");
              return finishNode(node, "TryStatement");
            }
            function parseVarStatement(node, kind) {
              next();
              parseVar(node, false, kind);
              semicolon();
              return finishNode(node, "VariableDeclaration");
            }
            function parseWhileStatement(node) {
              next();
              node.test = parseParenExpression();
              labels.push(loopLabel);
              node.body = parseStatement();
              labels.pop();
              return finishNode(node, "WhileStatement");
            }
            function parseWithStatement(node) {
              if (strict) raise(tokStart, "'with' in strict mode");
              next();
              node.object = parseParenExpression();
              node.body = parseStatement();
              return finishNode(node, "WithStatement");
            }
            function parseEmptyStatement(node) {
              next();
              return finishNode(node, "EmptyStatement");
            }
            function parseLabeledStatement(node, maybeName, expr) {
              for (var i = 0; i < labels.length; ++i)
                if (labels[i].name === maybeName)
                  raise(
                    expr.start,
                    "Label '" + maybeName + "' is already declared"
                  );
              var kind = tokType.isLoop
                ? "loop"
                : tokType === _switch
                ? "switch"
                : null;
              labels.push({ name: maybeName, kind: kind });
              node.body = parseStatement();
              labels.pop();
              node.label = expr;
              return finishNode(node, "LabeledStatement");
            }
            function parseExpressionStatement(node, expr) {
              node.expression = expr;
              semicolon();
              return finishNode(node, "ExpressionStatement");
            }
            function parseParenExpression() {
              expect(_parenL);
              var val = parseExpression();
              expect(_parenR);
              return val;
            }
            function parseBlock(allowStrict) {
              var node = startNode(),
                first = true,
                oldStrict;
              node.body = [];
              expect(_braceL);
              while (!eat(_braceR)) {
                var stmt = parseStatement();
                node.body.push(stmt);
                if (first && allowStrict && isUseStrict(stmt)) {
                  oldStrict = strict;
                  setStrict((strict = true));
                }
                first = false;
              }
              if (oldStrict === false) setStrict(false);
              return finishNode(node, "BlockStatement");
            }
            function parseFor(node, init) {
              node.init = init;
              expect(_semi);
              node.test = tokType === _semi ? null : parseExpression();
              expect(_semi);
              node.update = tokType === _parenR ? null : parseExpression();
              expect(_parenR);
              node.body = parseStatement();
              labels.pop();
              return finishNode(node, "ForStatement");
            }
            function parseForIn(node, init) {
              var type = tokType === _in ? "ForInStatement" : "ForOfStatement";
              next();
              node.left = init;
              node.right = parseExpression();
              expect(_parenR);
              node.body = parseStatement();
              labels.pop();
              return finishNode(node, type);
            }
            function parseVar(node, noIn, kind) {
              node.declarations = [];
              node.kind = kind;
              for (;;) {
                var decl = startNode();
                decl.id =
                  options.ecmaVersion >= 6
                    ? toAssignable(parseExprAtom())
                    : parseIdent();
                checkLVal(decl.id, true);
                decl.init = eat(_eq)
                  ? parseExpression(true, noIn)
                  : kind === _const.keyword
                  ? unexpected()
                  : null;
                node.declarations.push(finishNode(decl, "VariableDeclarator"));
                if (!eat(_comma)) break;
              }
              return node;
            }
            function parseExpression(noComma, noIn) {
              var start = storeCurrentPos();
              var expr = parseMaybeAssign(noIn);
              if (!noComma && tokType === _comma) {
                var node = startNodeAt(start);
                node.expressions = [expr];
                while (eat(_comma))
                  node.expressions.push(parseMaybeAssign(noIn));
                return finishNode(node, "SequenceExpression");
              }
              return expr;
            }
            function parseMaybeAssign(noIn) {
              var start = storeCurrentPos();
              var left = parseMaybeConditional(noIn);
              if (tokType.isAssign) {
                var node = startNodeAt(start);
                node.operator = tokVal;
                node.left = tokType === _eq ? toAssignable(left) : left;
                checkLVal(left);
                next();
                node.right = parseMaybeAssign(noIn);
                return finishNode(node, "AssignmentExpression");
              }
              return left;
            }
            function parseMaybeConditional(noIn) {
              var start = storeCurrentPos();
              var expr = parseExprOps(noIn);
              if (eat(_question)) {
                var node = startNodeAt(start);
                node.test = expr;
                node.consequent = parseExpression(true);
                expect(_colon);
                node.alternate = parseExpression(true, noIn);
                return finishNode(node, "ConditionalExpression");
              }
              return expr;
            }
            function parseExprOps(noIn) {
              var start = storeCurrentPos();
              return parseExprOp(parseMaybeUnary(), start, -1, noIn);
            }
            function parseExprOp(left, leftStart, minPrec, noIn) {
              var prec = tokType.binop;
              if (prec != null && (!noIn || tokType !== _in)) {
                if (prec > minPrec) {
                  var node = startNodeAt(leftStart);
                  node.left = left;
                  node.operator = tokVal;
                  var op = tokType;
                  next();
                  var start = storeCurrentPos();
                  node.right = parseExprOp(
                    parseMaybeUnary(),
                    start,
                    prec,
                    noIn
                  );
                  finishNode(
                    node,
                    op === _logicalOR || op === _logicalAND
                      ? "LogicalExpression"
                      : "BinaryExpression"
                  );
                  return parseExprOp(node, leftStart, minPrec, noIn);
                }
              }
              return left;
            }
            function parseMaybeUnary() {
              if (tokType.prefix) {
                var node = startNode(),
                  update = tokType.isUpdate,
                  nodeType;
                if (tokType === _ellipsis) {
                  nodeType = "SpreadElement";
                } else {
                  nodeType = update ? "UpdateExpression" : "UnaryExpression";
                  node.operator = tokVal;
                  node.prefix = true;
                }
                tokRegexpAllowed = true;
                next();
                node.argument = parseMaybeUnary();
                if (update) checkLVal(node.argument);
                else if (
                  strict &&
                  node.operator === "delete" &&
                  node.argument.type === "Identifier"
                )
                  raise(node.start, "Deleting local variable in strict mode");
                return finishNode(node, nodeType);
              }
              var start = storeCurrentPos();
              var expr = parseExprSubscripts();
              while (tokType.postfix && !canInsertSemicolon()) {
                var node = startNodeAt(start);
                node.operator = tokVal;
                node.prefix = false;
                node.argument = expr;
                checkLVal(expr);
                next();
                expr = finishNode(node, "UpdateExpression");
              }
              return expr;
            }
            function parseExprSubscripts() {
              var start = storeCurrentPos();
              return parseSubscripts(parseExprAtom(), start);
            }
            function parseSubscripts(base, start, noCalls) {
              if (eat(_dot)) {
                var node = startNodeAt(start);
                node.object = base;
                node.property = parseIdent(true);
                node.computed = false;
                return parseSubscripts(
                  finishNode(node, "MemberExpression"),
                  start,
                  noCalls
                );
              } else if (eat(_bracketL)) {
                var node = startNodeAt(start);
                node.object = base;
                node.property = parseExpression();
                node.computed = true;
                expect(_bracketR);
                return parseSubscripts(
                  finishNode(node, "MemberExpression"),
                  start,
                  noCalls
                );
              } else if (!noCalls && eat(_parenL)) {
                var node = startNodeAt(start);
                node.callee = base;
                node.arguments = parseExprList(_parenR, false);
                return parseSubscripts(
                  finishNode(node, "CallExpression"),
                  start,
                  noCalls
                );
              } else if (tokType === _bquote) {
                var node = startNodeAt(start);
                node.tag = base;
                node.quasi = parseTemplate();
                return parseSubscripts(
                  finishNode(node, "TaggedTemplateExpression"),
                  start,
                  noCalls
                );
              }
              return base;
            }
            function parseExprAtom() {
              switch (tokType) {
                case _this:
                  var node = startNode();
                  next();
                  return finishNode(node, "ThisExpression");
                case _yield:
                  if (inGenerator) return parseYield();
                case _await:
                  if (inAsync) return parseAwait();
                case _name:
                  var start = storeCurrentPos();
                  var id = parseIdent(tokType !== _name);
                  if (eat(_arrow)) {
                    return parseArrowExpression(startNodeAt(start), [id]);
                  }
                  return id;
                case _regexp:
                  var node = startNode();
                  node.regex = { pattern: tokVal.pattern, flags: tokVal.flags };
                  node.value = tokVal.value;
                  node.raw = input.slice(tokStart, tokEnd);
                  next();
                  return finishNode(node, "Literal");
                case _num:
                case _string:
                case _xjsText:
                  var node = startNode();
                  node.value = tokVal;
                  node.raw = input.slice(tokStart, tokEnd);
                  next();
                  return finishNode(node, "Literal");
                case _null:
                case _true:
                case _false:
                  var node = startNode();
                  node.value = tokType.atomValue;
                  node.raw = tokType.keyword;
                  next();
                  return finishNode(node, "Literal");
                case _parenL:
                  var start = storeCurrentPos();
                  var val, exprList;
                  next();
                  if (options.ecmaVersion >= 7 && tokType === _for) {
                    val = parseComprehension(startNodeAt(start), true);
                  } else {
                    var oldParenL = ++metParenL;
                    if (tokType !== _parenR) {
                      val = parseExpression();
                      exprList =
                        val.type === "SequenceExpression"
                          ? val.expressions
                          : [val];
                    } else {
                      exprList = [];
                    }
                    expect(_parenR);
                    if (metParenL === oldParenL && eat(_arrow)) {
                      val = parseArrowExpression(startNodeAt(start), exprList);
                    } else {
                      if (!val) unexpected(lastStart);
                      if (options.ecmaVersion >= 6) {
                        for (var i = 0; i < exprList.length; i++) {
                          if (exprList[i].type === "SpreadElement")
                            unexpected();
                        }
                      }
                      if (options.preserveParens) {
                        var par = startNodeAt(start);
                        par.expression = val;
                        val = finishNode(par, "ParenthesizedExpression");
                      }
                    }
                  }
                  return val;
                case _bracketL:
                  var node = startNode();
                  next();
                  if (options.ecmaVersion >= 7 && tokType === _for) {
                    return parseComprehension(node, false);
                  }
                  node.elements = parseExprList(_bracketR, true, true);
                  return finishNode(node, "ArrayExpression");
                case _braceL:
                  return parseObj();
                case _async:
                  return parseAsync(startNode(), false);
                case _function:
                  var node = startNode();
                  next();
                  return parseFunction(node, false, false);
                case _class:
                  return parseClass(startNode(), false);
                case _new:
                  return parseNew();
                case _bquote:
                  return parseTemplate();
                case _lt:
                  return parseXJSElement();
                default:
                  unexpected();
              }
            }
            function parseNew() {
              var node = startNode();
              next();
              var start = storeCurrentPos();
              node.callee = parseSubscripts(parseExprAtom(), start, true);
              if (eat(_parenL)) node.arguments = parseExprList(_parenR, false);
              else node.arguments = empty;
              return finishNode(node, "NewExpression");
            }
            function parseTemplate() {
              var node = startNode();
              node.expressions = [];
              node.quasis = [];
              inTemplate = true;
              next();
              for (;;) {
                var elem = startNode();
                elem.value = {
                  cooked: tokVal,
                  raw: input.slice(tokStart, tokEnd),
                };
                elem.tail = false;
                next();
                node.quasis.push(finishNode(elem, "TemplateElement"));
                if (tokType === _bquote) {
                  elem.tail = true;
                  break;
                }
                inTemplate = false;
                expect(_dollarBraceL);
                node.expressions.push(parseExpression());
                inTemplate = true;
                tokPos = tokEnd;
                expect(_braceR);
              }
              inTemplate = false;
              next();
              return finishNode(node, "TemplateLiteral");
            }
            function parseObj() {
              var node = startNode(),
                first = true,
                propHash = {};
              node.properties = [];
              next();
              while (!eat(_braceR)) {
                if (!first) {
                  expect(_comma);
                  if (options.allowTrailingCommas && eat(_braceR)) break;
                } else first = false;
                var prop = startNode(),
                  isGenerator,
                  isAsync;
                if (options.ecmaVersion >= 7) {
                  isAsync = eat(_async);
                  if (isAsync && tokType === _star) unexpected();
                }
                if (options.ecmaVersion >= 6) {
                  prop.method = false;
                  prop.shorthand = false;
                  isGenerator = eat(_star);
                }
                parsePropertyName(prop);
                if (eat(_colon)) {
                  prop.value = parseExpression(true);
                  prop.kind = "init";
                } else if (options.ecmaVersion >= 6 && tokType === _parenL) {
                  prop.kind = "init";
                  prop.method = true;
                  prop.value = parseMethod(isGenerator, isAsync);
                } else if (
                  options.ecmaVersion >= 5 &&
                  !prop.computed &&
                  prop.key.type === "Identifier" &&
                  (prop.key.name === "get" || prop.key.name === "set")
                ) {
                  if (isGenerator || isAsync) unexpected();
                  prop.kind = prop.key.name;
                  parsePropertyName(prop);
                  prop.value = parseMethod(false, false);
                } else if (
                  options.ecmaVersion >= 6 &&
                  !prop.computed &&
                  prop.key.type === "Identifier"
                ) {
                  prop.kind = "init";
                  prop.value = prop.key;
                  prop.shorthand = true;
                } else unexpected();
                checkPropClash(prop, propHash);
                node.properties.push(finishNode(prop, "Property"));
              }
              return finishNode(node, "ObjectExpression");
            }
            function parsePropertyName(prop) {
              if (options.ecmaVersion >= 6) {
                if (eat(_bracketL)) {
                  prop.computed = true;
                  prop.key = parseExpression();
                  expect(_bracketR);
                  return;
                } else {
                  prop.computed = false;
                }
              }
              prop.key =
                tokType === _num || tokType === _string
                  ? parseExprAtom()
                  : parseIdent(true);
            }
            function initFunction(node, isAsync) {
              node.id = null;
              node.params = [];
              if (options.ecmaVersion >= 6) {
                node.defaults = [];
                node.rest = null;
                node.generator = false;
              }
              if (options.ecmaVersion >= 7) {
                node.async = isAsync;
              }
            }
            function parseFunction(
              node,
              isStatement,
              isAsync,
              allowExpressionBody
            ) {
              initFunction(node, isAsync);
              if (options.ecmaVersion >= 6) {
                if (isAsync && tokType === _star) unexpected();
                node.generator = eat(_star);
              }
              if (isStatement || tokType === _name) {
                node.id = parseIdent();
              }
              parseFunctionParams(node);
              parseFunctionBody(node, allowExpressionBody);
              return finishNode(
                node,
                isStatement ? "FunctionDeclaration" : "FunctionExpression"
              );
            }
            function parseMethod(isGenerator, isAsync) {
              var node = startNode();
              initFunction(node, isAsync);
              parseFunctionParams(node);
              var allowExpressionBody;
              if (options.ecmaVersion >= 6) {
                node.generator = isGenerator;
                allowExpressionBody = true;
              } else {
                allowExpressionBody = false;
              }
              parseFunctionBody(node, allowExpressionBody);
              return finishNode(node, "FunctionExpression");
            }
            function parseArrowExpression(node, params, isAsync) {
              initFunction(node, isAsync);
              var defaults = node.defaults,
                hasDefaults = false;
              for (var i = 0, lastI = params.length - 1; i <= lastI; i++) {
                var param = params[i];
                if (
                  param.type === "AssignmentExpression" &&
                  param.operator === "="
                ) {
                  hasDefaults = true;
                  params[i] = param.left;
                  defaults.push(param.right);
                } else {
                  toAssignable(param, i === lastI, true);
                  defaults.push(null);
                  if (param.type === "SpreadElement") {
                    params.length--;
                    node.rest = param.argument;
                    break;
                  }
                }
              }
              node.params = params;
              if (!hasDefaults) node.defaults = [];
              parseFunctionBody(node, true);
              return finishNode(node, "ArrowFunctionExpression");
            }
            function parseFunctionParams(node) {
              var defaults = [],
                hasDefaults = false;
              expect(_parenL);
              for (;;) {
                if (eat(_parenR)) {
                  break;
                } else if (options.ecmaVersion >= 6 && eat(_ellipsis)) {
                  node.rest = toAssignable(parseExprAtom(), false, true);
                  checkSpreadAssign(node.rest);
                  expect(_parenR);
                  defaults.push(null);
                  break;
                } else {
                  node.params.push(
                    options.ecmaVersion >= 6
                      ? toAssignable(parseExprAtom(), false, true)
                      : parseIdent()
                  );
                  if (options.ecmaVersion >= 6) {
                    if (eat(_eq)) {
                      hasDefaults = true;
                      defaults.push(parseExpression(true));
                    } else {
                      defaults.push(null);
                    }
                  }
                  if (!eat(_comma)) {
                    expect(_parenR);
                    break;
                  }
                }
              }
              if (hasDefaults) node.defaults = defaults;
            }
            function parseFunctionBody(node, allowExpression) {
              var isExpression = allowExpression && tokType !== _braceL;
              var oldInAsync = inAsync;
              inAsync = node.async;
              if (isExpression) {
                node.body = parseExpression(true);
                node.expression = true;
              } else {
                var oldInFunc = inFunction,
                  oldInGen = inGenerator,
                  oldLabels = labels;
                inFunction = true;
                inGenerator = node.generator;
                labels = [];
                node.body = parseBlock(true);
                node.expression = false;
                inFunction = oldInFunc;
                inGenerator = oldInGen;
                labels = oldLabels;
              }
              inAsync = oldInAsync;
              if (
                strict ||
                (!isExpression &&
                  node.body.body.length &&
                  isUseStrict(node.body.body[0]))
              ) {
                var nameHash = {};
                if (node.id) checkFunctionParam(node.id, {});
                for (var i = 0; i < node.params.length; i++)
                  checkFunctionParam(node.params[i], nameHash);
                if (node.rest) checkFunctionParam(node.rest, nameHash);
              }
            }
            function parseClass(node, isStatement) {
              next();
              node.id =
                tokType === _name
                  ? parseIdent()
                  : isStatement
                  ? unexpected()
                  : null;
              node.superClass = eat(_extends) ? parseExpression() : null;
              var classBody = startNode();
              classBody.body = [];
              expect(_braceL);
              while (!eat(_braceR)) {
                var method = startNode();
                if (tokType === _name && tokVal === "static") {
                  next();
                  method["static"] = true;
                } else {
                  method["static"] = false;
                }
                var isAsync = false;
                if (options.ecmaVersion >= 7) {
                  isAsync = eat(_async);
                  if (isAsync && tokType === _star) unexpected();
                }
                var isGenerator = eat(_star);
                parsePropertyName(method);
                if (
                  tokType !== _parenL &&
                  !method.computed &&
                  method.key.type === "Identifier" &&
                  (method.key.name === "get" || method.key.name === "set")
                ) {
                  if (isGenerator || isAsync) unexpected();
                  method.kind = method.key.name;
                  parsePropertyName(method);
                } else {
                  method.kind = "";
                }
                method.value = parseMethod(isGenerator, isAsync);
                classBody.body.push(finishNode(method, "MethodDefinition"));
                eat(_semi);
              }
              node.body = finishNode(classBody, "ClassBody");
              return finishNode(
                node,
                isStatement ? "ClassDeclaration" : "ClassExpression"
              );
            }
            function parseExprList(close, allowTrailingComma, allowEmpty) {
              var elts = [],
                first = true;
              while (!eat(close)) {
                if (!first) {
                  expect(_comma);
                  if (
                    allowTrailingComma &&
                    options.allowTrailingCommas &&
                    eat(close)
                  )
                    break;
                } else first = false;
                if (allowEmpty && tokType === _comma) elts.push(null);
                else elts.push(parseExpression(true));
              }
              return elts;
            }
            function parseIdent(liberal) {
              var node = startNode();
              if (liberal && options.forbidReserved == "everywhere")
                liberal = false;
              if (tokType === _name) {
                if (
                  !liberal &&
                  ((options.forbidReserved &&
                    (options.ecmaVersion === 3
                      ? isReservedWord3
                      : isReservedWord5)(tokVal)) ||
                    (strict && isStrictReservedWord(tokVal))) &&
                  input.slice(tokStart, tokEnd).indexOf("\\") == -1
                )
                  raise(tokStart, "The keyword '" + tokVal + "' is reserved");
                node.name = tokVal;
              } else if (liberal && tokType.keyword) {
                node.name = tokType.keyword;
              } else {
                unexpected();
              }
              tokRegexpAllowed = false;
              next();
              return finishNode(node, "Identifier");
            }
            function parseExport(node) {
              next();
              if (
                tokType === _var ||
                tokType === _const ||
                tokType === _let ||
                tokType === _function ||
                tokType === _class ||
                tokType === _async
              ) {
                node.declaration = parseStatement();
                node["default"] = false;
                node.specifiers = null;
                node.source = null;
              } else if (eat(_default)) {
                node.declaration = parseExpression(true);
                node["default"] = true;
                node.specifiers = null;
                node.source = null;
                semicolon();
              } else {
                var isBatch = tokType === _star;
                node.declaration = null;
                node["default"] = false;
                node.specifiers = parseExportSpecifiers();
                if (tokType === _name && tokVal === "from") {
                  next();
                  node.source =
                    tokType === _string ? parseExprAtom() : unexpected();
                } else {
                  if (isBatch) unexpected();
                  node.source = null;
                }
                semicolon();
              }
              return finishNode(node, "ExportDeclaration");
            }
            function parseExportSpecifiers() {
              var nodes = [],
                first = true;
              if (tokType === _star) {
                var node = startNode();
                next();
                nodes.push(finishNode(node, "ExportBatchSpecifier"));
              } else {
                expect(_braceL);
                while (!eat(_braceR)) {
                  if (!first) {
                    expect(_comma);
                    if (options.allowTrailingCommas && eat(_braceR)) break;
                  } else first = false;
                  var node = startNode();
                  node.id = parseIdent(tokType === _default);
                  if (tokType === _name && tokVal === "as") {
                    next();
                    node.name = parseIdent(true);
                  } else {
                    node.name = null;
                  }
                  nodes.push(finishNode(node, "ExportSpecifier"));
                }
              }
              return nodes;
            }
            function parseImport(node) {
              next();
              if (tokType === _string) {
                node.specifiers = [];
                node.source = parseExprAtom();
                node.kind = "";
              } else {
                node.specifiers = parseImportSpecifiers();
                if (tokType !== _name || tokVal !== "from") unexpected();
                next();
                node.source =
                  tokType === _string ? parseExprAtom() : unexpected();
                node.kind = node.specifiers[0]["default"] ? "default" : "named";
              }
              semicolon();
              return finishNode(node, "ImportDeclaration");
            }
            function parseImportSpecifiers() {
              var nodes = [],
                first = true;
              if (tokType === _star) {
                var node = startNode();
                next();
                if (tokType !== _name || tokVal !== "as") unexpected();
                next();
                node.name = parseIdent();
                checkLVal(node.name, true);
                nodes.push(finishNode(node, "ImportBatchSpecifier"));
                return nodes;
              }
              if (tokType === _name) {
                var node = startNode();
                node.id = parseIdent();
                checkLVal(node.id, true);
                node.name = null;
                node["default"] = true;
                nodes.push(finishNode(node, "ImportSpecifier"));
                if (!eat(_comma)) return nodes;
              }
              expect(_braceL);
              while (!eat(_braceR)) {
                if (!first) {
                  expect(_comma);
                  if (options.allowTrailingCommas && eat(_braceR)) break;
                } else first = false;
                var node = startNode();
                node.id = parseIdent(true);
                if (tokType === _name && tokVal === "as") {
                  next();
                  node.name = parseIdent();
                } else {
                  node.name = null;
                }
                checkLVal(node.name || node.id, true);
                node["default"] = false;
                nodes.push(finishNode(node, "ImportSpecifier"));
              }
              return nodes;
            }
            function parseYield() {
              var node = startNode();
              next();
              if (eat(_semi) || canInsertSemicolon()) {
                node.delegate = false;
                node.argument = null;
              } else {
                node.delegate = eat(_star);
                node.argument = parseExpression(true);
              }
              return finishNode(node, "YieldExpression");
            }
            function parseAwait() {
              var node = startNode();
              next();
              if (eat(_semi) || canInsertSemicolon()) {
                unexpected();
              }
              node.delegate = eat(_star);
              node.argument = parseExpression(true);
              return finishNode(node, "AwaitExpression");
            }
            function parseComprehension(node, isGenerator) {
              node.blocks = [];
              while (tokType === _for) {
                var block = startNode();
                next();
                expect(_parenL);
                block.left = toAssignable(parseExprAtom());
                checkLVal(block.left, true);
                if (tokType !== _name || tokVal !== "of") unexpected();
                next();
                block.of = true;
                block.right = parseExpression();
                expect(_parenR);
                node.blocks.push(finishNode(block, "ComprehensionBlock"));
              }
              node.filter = eat(_if) ? parseParenExpression() : null;
              node.body = parseExpression();
              expect(isGenerator ? _parenR : _bracketR);
              node.generator = isGenerator;
              return finishNode(node, "ComprehensionExpression");
            }
            function getQualifiedXJSName(object) {
              if (object.type === "XJSIdentifier") {
                return object.name;
              }
              if (object.type === "XJSNamespacedName") {
                return object.namespace.name + ":" + object.name.name;
              }
              if (object.type === "XJSMemberExpression") {
                return (
                  getQualifiedXJSName(object.object) +
                  "." +
                  getQualifiedXJSName(object.property)
                );
              }
            }
            function parseXJSIdentifier() {
              var node = startNode();
              if (tokType === _xjsName) {
                node.name = tokVal;
              } else if (tokType.keyword) {
                node.name = tokType.keyword;
              } else {
                unexpected();
              }
              tokRegexpAllowed = false;
              next();
              return finishNode(node, "XJSIdentifier");
            }
            function parseXJSNamespacedName() {
              var node = startNode();
              node.namespace = parseXJSIdentifier();
              expect(_colon);
              node.name = parseXJSIdentifier();
              return finishNode(node, "XJSNamespacedName");
            }
            function parseXJSMemberExpression() {
              var start = storeCurrentPos();
              var node = parseXJSIdentifier();
              while (eat(_dot)) {
                var newNode = startNodeAt(start);
                newNode.object = node;
                newNode.property = parseXJSIdentifier();
                node = finishNode(newNode, "XJSMemberExpression");
              }
              return node;
            }
            function parseXJSElementName() {
              switch (nextChar()) {
                case ":":
                  return parseXJSNamespacedName();
                case ".":
                  return parseXJSMemberExpression();
                default:
                  return parseXJSIdentifier();
              }
            }
            function parseXJSAttributeName() {
              if (nextChar() === ":") {
                return parseXJSNamespacedName();
              }
              return parseXJSIdentifier();
            }
            function parseXJSAttributeValue() {
              switch (tokType) {
                case _braceL:
                  var node = parseXJSExpressionContainer();
                  if (node.expression.type === "XJSEmptyExpression") {
                    raise(
                      node.start,
                      "XJS attributes must only be assigned a non-empty " +
                        "expression"
                    );
                  }
                  return node;
                case _lt:
                  return parseXJSElement();
                case _xjsText:
                  return parseExprAtom();
                default:
                  raise(
                    tokStart,
                    "XJS value should be either an expression or a quoted XJS text"
                  );
              }
            }
            function parseXJSEmptyExpression() {
              if (tokType !== _braceR) {
                unexpected();
              }
              var tmp;
              tmp = tokStart;
              tokStart = lastEnd;
              lastEnd = tmp;
              tmp = tokStartLoc;
              tokStartLoc = lastEndLoc;
              lastEndLoc = tmp;
              return finishNode(startNode(), "XJSEmptyExpression");
            }
            function parseXJSExpressionContainer() {
              var node = startNode();
              var origInXJSTag = inXJSTag,
                origInXJSChild = inXJSChild;
              inXJSTag = false;
              inXJSChild = false;
              inXJSChildExpression = origInXJSChild;
              next();
              node.expression =
                tokType === _braceR
                  ? parseXJSEmptyExpression()
                  : parseExpression();
              inXJSTag = origInXJSTag;
              inXJSChild = origInXJSChild;
              inXJSChildExpression = false;
              expect(_braceR);
              return finishNode(node, "XJSExpressionContainer");
            }
            function parseXJSAttribute() {
              if (tokType === _braceL) {
                var tokStart1 = tokStart,
                  tokStartLoc1 = tokStartLoc;
                var origInXJSTag = inXJSTag;
                inXJSTag = false;
                next();
                var node = parseMaybeUnary();
                inXJSTag = origInXJSTag;
                expect(_braceR);
                node.type = "XJSSpreadAttribute";
                node.start = tokStart1;
                node.end = lastEnd;
                if (options.locations) {
                  node.loc.start = tokStartLoc1;
                  node.loc.end = lastEndLoc;
                }
                if (options.ranges) {
                  node.range = [tokStart1, lastEnd];
                }
                return node;
              }
              var node = startNode();
              node.name = parseXJSAttributeName();
              if (tokType === _eq) {
                next();
                node.value = parseXJSAttributeValue();
              } else {
                node.value = null;
              }
              return finishNode(node, "XJSAttribute");
            }
            function parseXJSChild() {
              switch (tokType) {
                case _braceL:
                  return parseXJSExpressionContainer();
                case _xjsText:
                  return parseExprAtom();
                default:
                  return parseXJSElement();
              }
            }
            function parseXJSOpeningElement() {
              var node = startNode(),
                attributes = (node.attributes = []);
              var origInXJSChild = inXJSChild;
              var origInXJSTag = inXJSTag;
              inXJSChild = false;
              inXJSTag = true;
              next();
              node.name = parseXJSElementName();
              while (
                tokType !== _eof &&
                tokType !== _slash &&
                tokType !== _gt
              ) {
                attributes.push(parseXJSAttribute());
              }
              inXJSTag = false;
              if ((node.selfClosing = !!eat(_slash))) {
                inXJSTag = origInXJSTag;
                inXJSChild = origInXJSChild;
              } else {
                inXJSChild = true;
              }
              expect(_gt);
              return finishNode(node, "XJSOpeningElement");
            }
            function parseXJSClosingElement() {
              var node = startNode();
              var origInXJSChild = inXJSChild;
              var origInXJSTag = inXJSTag;
              inXJSChild = false;
              inXJSTag = true;
              tokRegexpAllowed = false;
              expect(_ltSlash);
              node.name = parseXJSElementName();
              skipSpace();
              inXJSChild = origInXJSChild;
              inXJSTag = origInXJSTag;
              tokRegexpAllowed = false;
              expect(_gt);
              return finishNode(node, "XJSClosingElement");
            }
            function parseXJSElement() {
              var node = startNode();
              var children = [];
              var origInXJSChild = inXJSChild;
              var openingElement = parseXJSOpeningElement();
              var closingElement = null;
              if (!openingElement.selfClosing) {
                while (tokType !== _eof && tokType !== _ltSlash) {
                  inXJSChild = true;
                  children.push(parseXJSChild());
                }
                inXJSChild = origInXJSChild;
                closingElement = parseXJSClosingElement();
                if (
                  getQualifiedXJSName(closingElement.name) !==
                  getQualifiedXJSName(openingElement.name)
                ) {
                  raise(
                    closingElement.start,
                    "Expected corresponding XJS closing tag for '" +
                      getQualifiedXJSName(openingElement.name) +
                      "'"
                  );
                }
              }
              if (!origInXJSChild && tokType === _lt) {
                raise(
                  tokStart,
                  "Adjacent XJS elements must be wrapped in an enclosing tag"
                );
              }
              node.openingElement = openingElement;
              node.closingElement = closingElement;
              node.children = children;
              return finishNode(node, "XJSElement");
            }
          });
        },
        {},
      ],
      2: [
        function (require, module, exports) {
          var transform =
            (module.exports = require("./transformation/transform"));
          transform.transform = transform;
          transform.run = function (code, opts) {
            opts = opts || {};
            opts.sourceMap = "inline";
            return new Function(transform(code, opts).code)();
          };
          transform.load = function (url, callback, opts, hold) {
            opts = opts || {};
            opts.filename = opts.filename || url;
            var xhr = window.ActiveXObject
              ? new window.ActiveXObject("Microsoft.XMLHTTP")
              : new window.XMLHttpRequest();
            xhr.open("GET", url, true);
            if ("overrideMimeType" in xhr) xhr.overrideMimeType("text/plain");
            xhr.onreadystatechange = function () {
              if (xhr.readyState !== 4) return;
              var status = xhr.status;
              if (status === 0 || status === 200) {
                var param = [xhr.responseText, opts];
                if (!hold) transform.run.apply(transform, param);
                if (callback) callback(param);
              } else {
                throw new Error("Could not load " + url);
              }
            };
            xhr.send(null);
          };
          var runScripts = function () {
            var scripts = [];
            var types = ["text/ecmascript-6", "text/6to5"];
            var index = 0;
            var exec = function () {
              var param = scripts[index];
              if (param instanceof Array) {
                transform.run.apply(transform, param);
                index++;
                exec();
              }
            };
            var run = function (script, i) {
              var opts = {};
              if (script.src) {
                transform.load(
                  script.src,
                  function (param) {
                    scripts[i] = param;
                    exec();
                  },
                  opts,
                  true
                );
              } else {
                opts.filename = "embedded";
                scripts[i] = [script.innerHTML, opts];
              }
            };
            var _scripts = window.document.getElementsByTagName("script");
            for (var i in _scripts) {
              var _script = _scripts[i];
              if (types.indexOf(_script.type) >= 0) scripts.push(_script);
            }
            for (i in scripts) {
              run(scripts[i], i);
            }
            exec();
          };
          if (window.addEventListener) {
            window.addEventListener("DOMContentLoaded", runScripts, false);
          } else {
            window.attachEvent("onload", runScripts);
          }
        },
        { "./transformation/transform": 27 },
      ],
      3: [
        function (require, module, exports) {
          module.exports = File;
          var SHEBANG_REGEX = /^\#\!.*/;
          var transform = require("./transformation/transform");
          var generate = require("./generation/generator");
          var Scope = require("./traverse/scope");
          var util = require("./util");
          var t = require("./types");
          var _ = require("lodash");
          function File(opts) {
            this.opts = File.normaliseOptions(opts);
            this.moduleFormatter = this.getModuleFormatter(this.opts.modules);
            this.declarations = {};
            this.uids = {};
            this.ast = {};
          }
          File.declarations = [
            "extends",
            "class-props",
            "slice",
            "apply-constructor",
            "tagged-template-literal",
          ];
          File.normaliseOptions = function (opts) {
            opts = _.cloneDeep(opts || {});
            _.defaults(opts, {
              whitespace: true,
              blacklist: [],
              whitelist: [],
              sourceMap: false,
              filename: "unknown",
              modules: "common",
              runtime: false,
              code: true,
            });
            opts.filename = opts.filename.replace(/\\/g, "/");
            _.defaults(opts, {
              sourceFileName: opts.filename,
              sourceMapName: opts.filename,
            });
            if (opts.runtime === true) {
              opts.runtime = "to5Runtime";
            }
            transform._ensureTransformerNames("blacklist", opts.blacklist);
            transform._ensureTransformerNames("whitelist", opts.whitelist);
            return opts;
          };
          File.prototype.getModuleFormatter = function (type) {
            var ModuleFormatter = transform.moduleFormatters[type];
            if (!ModuleFormatter) {
              var loc = util.resolve(type);
              if (loc) ModuleFormatter = require(loc);
            }
            if (!ModuleFormatter) {
              throw new ReferenceError("unknown module formatter type " + type);
            }
            return new ModuleFormatter(this);
          };
          File.prototype.parseShebang = function (code) {
            var shebangMatch = code.match(SHEBANG_REGEX);
            if (shebangMatch) {
              this.shebang = shebangMatch[0];
              code = code.replace(SHEBANG_REGEX, "");
            }
            return code;
          };
          File.prototype.addDeclaration = function (name) {
            if (!_.contains(File.declarations, name)) {
              throw new ReferenceError("unknown declaration " + name);
            }
            var declar = this.declarations[name];
            if (declar) return declar.uid;
            var ref;
            var runtimeNamespace = this.opts.runtime;
            if (runtimeNamespace) {
              name = t.identifier(t.toIdentifier(name));
              return t.memberExpression(t.identifier(runtimeNamespace), name);
            } else {
              ref = util.template(name);
            }
            var uid = t.identifier(this.generateUid(name));
            this.declarations[name] = { uid: uid, node: ref };
            return uid;
          };
          File.prototype.errorWithNode = function (node, msg, Error) {
            Error = Error || SyntaxError;
            var loc = node.loc.start;
            var err = new Error("Line " + loc.line + ": " + msg);
            err.loc = loc;
            return err;
          };
          File.prototype.parse = function (code) {
            code = (code || "") + "";
            var self = this;
            this.code = code;
            code = this.parseShebang(code);
            return util.parse(this.opts, code, function (tree) {
              self.transform(tree);
              return self.generate();
            });
          };
          File.prototype.transform = function (ast) {
            this.ast = ast;
            this.scope = new Scope(null, ast.program);
            var self = this;
            _.each(transform.transformers, function (transformer) {
              transformer.transform(self);
            });
          };
          File.prototype.generate = function () {
            var opts = this.opts;
            var ast = this.ast;
            if (!opts.code) {
              return { code: "", map: null, ast: ast };
            }
            var result = generate(ast, opts, this.code);
            if (this.shebang) {
              result.code = this.shebang + "\n" + result.code;
            }
            if (opts.sourceMap === "inline") {
              result.code += "\n" + util.sourceMapToComment(result.map);
            }
            result.ast = result;
            return result;
          };
          File.prototype.generateUid = function (name, scope) {
            name = t.toIdentifier(name);
            scope = scope || this.scope;
            var uid;
            do {
              uid = this._generateUid(name);
            } while (scope.has(uid));
            return uid;
          };
          File.prototype._generateUid = function (name) {
            var uids = this.uids;
            var i = uids[name] || 1;
            var id = name;
            if (i > 1) id += i;
            uids[name] = i + 1;
            return "_" + id;
          };
        },
        {
          "./generation/generator": 5,
          "./transformation/transform": 27,
          "./traverse/scope": 56,
          "./types": 59,
          "./util": 61,
          lodash: 92,
        },
      ],
      4: [
        function (require, module, exports) {
          module.exports = Buffer;
          var util = require("../util");
          var _ = require("lodash");
          function Buffer(position, format) {
            this.position = position;
            this._indent = format.indent.base;
            this.format = format;
            this.buf = "";
          }
          Buffer.prototype.get = function () {
            return util.trimRight(this.buf);
          };
          Buffer.prototype.getIndent = function () {
            if (this.format.compact) {
              return "";
            } else {
              return util.repeat(this._indent, this.format.indent.style);
            }
          };
          Buffer.prototype.indentSize = function () {
            return this.getIndent().length;
          };
          Buffer.prototype.indent = function () {
            this._indent++;
          };
          Buffer.prototype.dedent = function () {
            this._indent--;
          };
          Buffer.prototype.semicolon = function () {
            if (this.format.semicolons) this.push(";");
          };
          Buffer.prototype.ensureSemicolon = function () {
            if (!this.isLast(";")) this.semicolon();
          };
          Buffer.prototype.rightBrace = function () {
            this.newline(true);
            this.push("}");
          };
          Buffer.prototype.keyword = function (name) {
            this.push(name);
            this.push(" ");
          };
          Buffer.prototype.space = function () {
            if (this.buf && !this.isLast([" ", "\n"])) {
              this.push(" ");
            }
          };
          Buffer.prototype.removeLast = function (cha) {
            if (!this.isLast(cha)) return;
            this.buf = this.buf.slice(0, -1);
            this.position.unshift(cha);
          };
          Buffer.prototype.newline = function (i, removeLast) {
            if (!this.buf) return;
            if (this.format.compact) return;
            if (this.endsWith("{\n")) return;
            if (_.isBoolean(i)) {
              removeLast = i;
              i = null;
            }
            if (_.isNumber(i)) {
              if (this.endsWith(util.repeat(i, "\n"))) return;
              var self = this;
              _.times(i, function () {
                self.newline(null, removeLast);
              });
              return;
            }
            if (removeLast && this.isLast("\n")) this.removeLast("\n");
            this.removeLast(" ");
            this.buf = this.buf.replace(/\n +$/, "\n");
            this._push("\n");
          };
          Buffer.prototype.push = function (str, noIndent) {
            if (this._indent && !noIndent && str !== "\n") {
              var indent = this.getIndent();
              str = str.replace(/\n/g, "\n" + indent);
              if (this.isLast("\n")) str = indent + str;
            }
            this._push(str);
          };
          Buffer.prototype._push = function (str) {
            this.position.push(str);
            this.buf += str;
          };
          Buffer.prototype.endsWith = function (str) {
            return this.buf.slice(-str.length) === str;
          };
          Buffer.prototype.isLast = function (cha, trimRight) {
            var buf = this.buf;
            if (trimRight) buf = util.trimRight(buf);
            var chars = [].concat(cha);
            return _.contains(chars, _.last(buf));
          };
        },
        { "../util": 61, lodash: 92 },
      ],
      5: [
        function (require, module, exports) {
          module.exports = function (ast, opts, code) {
            var gen = new CodeGenerator(ast, opts, code);
            return gen.generate();
          };
          module.exports.CodeGenerator = CodeGenerator;
          var Whitespace = require("./whitespace");
          var SourceMap = require("./source-map");
          var Position = require("./position");
          var Buffer = require("./buffer");
          var util = require("../util");
          var n = require("./node");
          var t = require("../types");
          var _ = require("lodash");
          function CodeGenerator(ast, opts, code) {
            opts = opts || {};
            this.comments = ast.comments || [];
            this.tokens = ast.tokens || [];
            this.format = CodeGenerator.normaliseOptions(opts);
            this.ast = ast;
            this.whitespace = new Whitespace(this.tokens, this.comments);
            this.position = new Position();
            this.map = new SourceMap(this.position, opts, code);
            this.buffer = new Buffer(this.position, this.format);
          }
          _.each(Buffer.prototype, function (fn, key) {
            CodeGenerator.prototype[key] = function () {
              return fn.apply(this.buffer, arguments);
            };
          });
          CodeGenerator.normaliseOptions = function (opts) {
            opts = opts.format || {};
            opts = _.merge(
              {
                parentheses: true,
                semicolons: true,
                comments: true,
                compact: false,
                indent: { adjustMultilineComment: true, style: "  ", base: 0 },
              },
              opts
            );
            return opts;
          };
          CodeGenerator.generators = {
            templateLiterals: require("./generators/template-literals"),
            comprehensions: require("./generators/comprehensions"),
            expressions: require("./generators/expressions"),
            statements: require("./generators/statements"),
            classes: require("./generators/classes"),
            methods: require("./generators/methods"),
            modules: require("./generators/modules"),
            types: require("./generators/types"),
            base: require("./generators/base"),
            jsx: require("./generators/jsx"),
          };
          _.each(CodeGenerator.generators, function (generator) {
            _.extend(CodeGenerator.prototype, generator);
          });
          CodeGenerator.prototype.generate = function () {
            var ast = this.ast;
            this.print(ast);
            return { map: this.map.get(), code: this.buffer.get() };
          };
          CodeGenerator.prototype.buildPrint = function (parent) {
            var self = this;
            var print = function (node, opts) {
              return self.print(node, parent, opts);
            };
            print.sequence = function (nodes, opts) {
              opts = opts || {};
              opts.statement = true;
              return self.printJoin(print, nodes, opts);
            };
            print.join = function (nodes, opts) {
              return self.printJoin(print, nodes, opts);
            };
            print.block = function (node) {
              return self.printBlock(print, node);
            };
            print.indentOnComments = function (node) {
              return self.printAndIndentOnComments(print, node);
            };
            return print;
          };
          CodeGenerator.prototype.print = function (node, parent, opts) {
            if (!node) return "";
            var self = this;
            opts = opts || {};
            var newline = function (leading) {
              if (!opts.statement && !n.isUserWhitespacable(node, parent)) {
                return;
              }
              var lines = 0;
              if (node.start != null) {
                if (leading) {
                  lines = self.whitespace.getNewlinesBefore(node);
                } else {
                  lines = self.whitespace.getNewlinesAfter(node);
                }
              } else {
                if (!leading) lines++;
                var needs = n.needsWhitespaceAfter;
                if (leading) needs = n.needsWhitespaceBefore;
                lines += needs(node, parent);
              }
              self.newline(lines);
            };
            if (this[node.type]) {
              this.printLeadingComments(node, parent);
              newline(true);
              if (opts.before) opts.before();
              this.map.mark(node, "start");
              var needsParens =
                parent !== node._parent && n.needsParens(node, parent);
              if (needsParens) this.push("(");
              this[node.type](node, this.buildPrint(node), parent);
              if (needsParens) this.push(")");
              this.map.mark(node, "end");
              if (opts.after) opts.after();
              newline(false);
              this.printTrailingComments(node, parent);
            } else {
              throw new ReferenceError(
                "unknown node " + node.type + " " + JSON.stringify(node)
              );
            }
          };
          CodeGenerator.prototype.printJoin = function (print, nodes, opts) {
            opts = opts || {};
            var self = this;
            var len = nodes.length;
            if (opts.indent) self.indent();
            _.each(nodes, function (node, i) {
              print(node, {
                statement: opts.statement,
                after: function () {
                  if (opts.iterator) {
                    opts.iterator(node, i);
                  }
                  if (opts.separator && i < len - 1) {
                    self.push(opts.separator);
                  }
                },
              });
            });
            if (opts.indent) self.dedent();
          };
          CodeGenerator.prototype.printAndIndentOnComments = function (
            print,
            node
          ) {
            var indent = !!node.leadingComments;
            if (indent) this.indent();
            print(node);
            if (indent) this.dedent();
          };
          CodeGenerator.prototype.printBlock = function (print, node) {
            if (t.isEmptyStatement(node)) {
              this.semicolon();
            } else {
              this.push(" ");
              print(node);
            }
          };
          CodeGenerator.prototype.generateComment = function (comment) {
            var val = comment.value;
            if (comment.type === "Line") {
              val = "//" + val;
            } else {
              val = "/*" + val + "*/";
            }
            return val;
          };
          CodeGenerator.prototype.printTrailingComments = function (
            node,
            parent
          ) {
            this._printComments(
              this.getComments("trailingComments", node, parent)
            );
          };
          CodeGenerator.prototype.printLeadingComments = function (
            node,
            parent
          ) {
            this._printComments(
              this.getComments("leadingComments", node, parent)
            );
          };
          CodeGenerator.prototype.getComments = function (key, node, parent) {
            if (t.isExpressionStatement(parent)) {
              return [];
            }
            var comments = [];
            var nodes = [node];
            var self = this;
            if (t.isExpressionStatement(node)) {
              nodes.push(node.argument);
            }
            _.each(nodes, function (node) {
              comments = comments.concat(self._getComments(key, node));
            });
            return comments;
          };
          CodeGenerator.prototype._getComments = function (key, node) {
            return (node && node[key]) || [];
          };
          CodeGenerator.prototype._printComments = function (comments) {
            if (this.format.compact) return;
            if (!this.format.comments) return;
            if (!comments || !comments.length) return;
            var self = this;
            _.each(comments, function (comment) {
              self.newline(self.whitespace.getNewlinesBefore(comment));
              var column = self.position.column;
              var val = self.generateComment(comment);
              if (column && !self.isLast(["\n", " ", "[", "{"])) {
                self._push(" ");
                column++;
              }
              if (
                comment.type === "Block" &&
                self.format.indent.adjustMultilineComment
              ) {
                var offset = comment.loc.start.column;
                if (offset) {
                  var newlineRegex = new RegExp(
                    "\\n\\s{1," + offset + "}",
                    "g"
                  );
                  val = val.replace(newlineRegex, "\n");
                }
                var indent = Math.max(self.indentSize(), column);
                val = val.replace(/\n/g, "\n" + util.repeat(indent));
              }
              if (column === 0) {
                val = self.getIndent() + val;
              }
              self._push(val);
              self.newline(self.whitespace.getNewlinesAfter(comment));
            });
          };
        },
        {
          "../types": 59,
          "../util": 61,
          "./buffer": 4,
          "./generators/base": 6,
          "./generators/classes": 7,
          "./generators/comprehensions": 8,
          "./generators/expressions": 9,
          "./generators/jsx": 10,
          "./generators/methods": 11,
          "./generators/modules": 12,
          "./generators/statements": 13,
          "./generators/template-literals": 14,
          "./generators/types": 15,
          "./node": 16,
          "./position": 19,
          "./source-map": 20,
          "./whitespace": 21,
          lodash: 92,
        },
      ],
      6: [
        function (require, module, exports) {
          exports.File = function (node, print) {
            print(node.program);
          };
          exports.Program = function (node, print) {
            print.sequence(node.body);
          };
          exports.BlockStatement = function (node, print) {
            if (node.body.length === 0) {
              this.push("{}");
            } else {
              this.push("{");
              this.newline();
              print.sequence(node.body, { indent: true });
              this.removeLast("\n");
              this.rightBrace();
            }
          };
        },
        {},
      ],
      7: [
        function (require, module, exports) {
          exports.ClassExpression = exports.ClassDeclaration = function (
            node,
            print
          ) {
            this.push("class");
            if (node.id) {
              this.space();
              print(node.id);
            }
            if (node.superClass) {
              this.push(" extends ");
              print(node.superClass);
            }
            this.space();
            print(node.body);
          };
          exports.ClassBody = function (node, print) {
            if (node.body.length === 0) {
              this.push("{}");
            } else {
              this.push("{");
              this.newline();
              this.indent();
              print.sequence(node.body);
              this.dedent();
              this.rightBrace();
            }
          };
          exports.MethodDefinition = function (node, print) {
            if (node.static) {
              this.push("static ");
            }
            this._method(node, print);
          };
        },
        {},
      ],
      8: [
        function (require, module, exports) {
          exports.ComprehensionBlock = function (node, print) {
            this.keyword("for");
            this.push("(");
            print(node.left);
            this.push(" of ");
            print(node.right);
            this.push(")");
          };
          exports.ComprehensionExpression = function (node, print) {
            this.push(node.generator ? "(" : "[");
            print.join(node.blocks, { separator: " " });
            this.space();
            if (node.filter) {
              this.keyword("if");
              this.push("(");
              print(node.filter);
              this.push(")");
              this.space();
            }
            print(node.body);
            this.push(node.generator ? ")" : "]");
          };
        },
        {},
      ],
      9: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          exports.UnaryExpression = function (node, print) {
            var hasSpace = /[a-z]$/.test(node.operator);
            var arg = node.argument;
            if (t.isUpdateExpression(arg) || t.isUnaryExpression(arg)) {
              hasSpace = true;
            }
            if (t.isUnaryExpression(arg) && arg.operator === "!") {
              hasSpace = false;
            }
            this.push(node.operator);
            if (hasSpace) this.space();
            print(node.argument);
          };
          exports.ParenthesizedExpression = function (node, print) {
            this.push("(");
            print(node.expression);
            this.push(")");
          };
          exports.UpdateExpression = function (node, print) {
            if (node.prefix) {
              this.push(node.operator);
              print(node.argument);
            } else {
              print(node.argument);
              this.push(node.operator);
            }
          };
          exports.ConditionalExpression = function (node, print) {
            print(node.test);
            this.push(" ? ");
            print(node.consequent);
            this.push(" : ");
            print(node.alternate);
          };
          exports.NewExpression = function (node, print) {
            this.push("new ");
            print(node.callee);
            if (node.arguments.length || this.format.parentheses) {
              this.push("(");
              print.join(node.arguments, { separator: ", " });
              this.push(")");
            }
          };
          exports.SequenceExpression = function (node, print) {
            print.join(node.expressions, { separator: ", " });
          };
          exports.ThisExpression = function () {
            this.push("this");
          };
          exports.CallExpression = function (node, print) {
            print(node.callee);
            this.push("(");
            print.join(node.arguments, { separator: ", " });
            this.push(")");
          };
          var buildYieldAwait = function (keyword) {
            return function (node, print) {
              this.push(keyword);
              if (node.delegate) this.push("*");
              if (node.argument) {
                this.space();
                print(node.argument);
              }
            };
          };
          exports.YieldExpression = buildYieldAwait("yield");
          exports.AwaitExpression = buildYieldAwait("await");
          exports.EmptyStatement = function () {
            this.semicolon();
          };
          exports.ExpressionStatement = function (node, print) {
            print(node.expression);
            this.semicolon();
          };
          exports.BinaryExpression =
            exports.LogicalExpression =
            exports.AssignmentExpression =
              function (node, print) {
                print(node.left);
                this.push(" " + node.operator + " ");
                print(node.right);
              };
          exports.MemberExpression = function (node, print) {
            print(node.object);
            if (node.computed) {
              this.push("[");
              print(node.property);
              this.push("]");
            } else {
              if (
                t.isLiteral(node.object) &&
                util.isInteger(node.object.value)
              ) {
                this.push(".");
              }
              this.push(".");
              print(node.property);
            }
          };
        },
        { "../../types": 59, "../../util": 61 },
      ],
      10: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          exports.XJSAttribute = function (node, print) {
            print(node.name);
            if (node.value) {
              this.push("=");
              print(node.value);
            }
          };
          exports.XJSIdentifier = function (node) {
            this.push(node.name);
          };
          exports.XJSNamespacedName = function (node, print) {
            print(node.namespace);
            this.push(":");
            print(node.name);
          };
          exports.XJSMemberExpression = function (node, print) {
            print(node.object);
            this.push(".");
            print(node.property);
          };
          exports.XJSSpreadAttribute = function (node, print) {
            this.push("{...");
            print(node.argument);
            this.push("}");
          };
          exports.XJSExpressionContainer = function (node, print) {
            this.push("{");
            print(node.expression);
            this.push("}");
          };
          exports.XJSElement = function (node, print) {
            var self = this;
            var open = node.openingElement;
            print(open);
            if (open.selfClosing) return;
            this.indent();
            _.each(node.children, function (child) {
              if (t.isLiteral(child)) {
                self.push(child.value);
              } else {
                print(child);
              }
            });
            this.dedent();
            print(node.closingElement);
          };
          exports.XJSOpeningElement = function (node, print) {
            this.push("<");
            print(node.name);
            if (node.attributes.length > 0) {
              this.space();
              print.join(node.attributes, { separator: " " });
            }
            this.push(node.selfClosing ? " />" : ">");
          };
          exports.XJSClosingElement = function (node, print) {
            this.push("</");
            print(node.name);
            this.push(">");
          };
          exports.XJSEmptyExpression = function () {};
        },
        { "../../types": 59, lodash: 92 },
      ],
      11: [
        function (require, module, exports) {
          var t = require("../../types");
          exports._params = function (node, print) {
            var self = this;
            this.push("(");
            print.join(node.params, {
              separator: ", ",
              iterator: function (param, i) {
                var def = node.defaults && node.defaults[i];
                if (def) {
                  self.push(" = ");
                  print(def);
                }
              },
            });
            if (node.rest) {
              if (node.params.length) {
                this.push(", ");
              }
              this.push("...");
              print(node.rest);
            }
            this.push(")");
          };
          exports._method = function (node, print) {
            var value = node.value;
            var kind = node.kind;
            var key = node.key;
            if (!kind || kind === "init") {
              if (value.generator) {
                this.push("*");
              }
            } else {
              this.push(kind + " ");
            }
            if (value.async) this.push("async ");
            if (node.computed) {
              this.push("[");
              print(key);
              this.push("]");
            } else {
              print(key);
            }
            this._params(value, print);
            this.space();
            print(value.body);
          };
          exports.FunctionDeclaration = exports.FunctionExpression = function (
            node,
            print
          ) {
            if (node.async) this.push("async ");
            this.push("function");
            if (node.generator) this.push("*");
            this.space();
            if (node.id) print(node.id);
            this._params(node, print);
            this.space();
            print(node.body);
          };
          exports.ArrowFunctionExpression = function (node, print) {
            if (node.async) this.push("async ");
            if (
              node.params.length === 1 &&
              !node.defaults.length &&
              !node.rest &&
              t.isIdentifier(node.params[0])
            ) {
              print(node.params[0]);
            } else {
              this._params(node, print);
            }
            this.push(" => ");
            print(node.body);
          };
        },
        { "../../types": 59 },
      ],
      12: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          exports.ImportSpecifier = exports.ExportSpecifier = function (
            node,
            print
          ) {
            print(node.id);
            if (node.name) {
              this.push(" as ");
              print(node.name);
            }
          };
          exports.ExportBatchSpecifier = function () {
            this.push("*");
          };
          exports.ExportDeclaration = function (node, print) {
            this.push("export ");
            var specifiers = node.specifiers;
            if (node.default) {
              this.push("default ");
            }
            if (node.declaration) {
              print(node.declaration);
              if (t.isStatement(node.declaration)) return;
            } else {
              if (
                specifiers.length === 1 &&
                t.isExportBatchSpecifier(specifiers[0])
              ) {
                print(specifiers[0]);
              } else {
                this.push("{");
                if (specifiers.length) {
                  this.space();
                  print.join(specifiers, { separator: ", " });
                  this.space();
                }
                this.push("}");
              }
              if (node.source) {
                this.push(" from ");
                print(node.source);
              }
            }
            this.ensureSemicolon();
          };
          exports.ImportDeclaration = function (node, print) {
            var self = this;
            this.push("import ");
            var specfiers = node.specifiers;
            if (specfiers && specfiers.length) {
              var foundImportSpecifier = false;
              _.each(node.specifiers, function (spec, i) {
                if (+i > 0) {
                  self.push(", ");
                }
                if (
                  !spec.default &&
                  spec.type !== "ImportBatchSpecifier" &&
                  !foundImportSpecifier
                ) {
                  foundImportSpecifier = true;
                  self.push("{ ");
                }
                print(spec);
              });
              if (foundImportSpecifier) {
                this.push(" }");
              }
              this.push(" from ");
            }
            print(node.source);
            this.semicolon();
          };
          exports.ImportBatchSpecifier = function (node, print) {
            this.push("* as ");
            print(node.name);
          };
        },
        { "../../types": 59, lodash: 92 },
      ],
      13: [
        function (require, module, exports) {
          var t = require("../../types");
          exports.WithStatement = function (node, print) {
            this.keyword("with");
            this.push("(");
            print(node.object);
            this.push(")");
            print.block(node.body);
          };
          exports.IfStatement = function (node, print) {
            this.keyword("if");
            this.push("(");
            print(node.test);
            this.push(") ");
            print.indentOnComments(node.consequent);
            if (node.alternate) {
              if (this.isLast("}")) this.space();
              this.keyword("else");
              print.indentOnComments(node.alternate);
            }
          };
          exports.ForStatement = function (node, print) {
            this.keyword("for");
            this.push("(");
            print(node.init);
            this.push(";");
            if (node.test) {
              this.space();
              print(node.test);
            }
            this.push(";");
            if (node.update) {
              this.space();
              print(node.update);
            }
            this.push(")");
            print.block(node.body);
          };
          exports.WhileStatement = function (node, print) {
            this.keyword("while");
            this.push("(");
            print(node.test);
            this.push(")");
            print.block(node.body);
          };
          var buildForXStatement = function (op) {
            return function (node, print) {
              this.keyword("for");
              this.push("(");
              print(node.left);
              this.push(" " + op + " ");
              print(node.right);
              this.push(")");
              print.block(node.body);
            };
          };
          exports.ForInStatement = buildForXStatement("in");
          exports.ForOfStatement = buildForXStatement("of");
          exports.DoWhileStatement = function (node, print) {
            this.keyword("do");
            print(node.body);
            this.space();
            this.keyword("while");
            this.push("(");
            print(node.test);
            this.push(");");
          };
          var buildLabelStatement = function (prefix, key) {
            return function (node, print) {
              this.push(prefix);
              var label = node[key || "label"];
              if (label) {
                this.space();
                print(label);
              }
              this.semicolon();
            };
          };
          exports.ContinueStatement = buildLabelStatement("continue");
          exports.ReturnStatement = buildLabelStatement("return", "argument");
          exports.BreakStatement = buildLabelStatement("break");
          exports.LabeledStatement = function (node, print) {
            print(node.label);
            this.push(": ");
            print(node.body);
          };
          exports.TryStatement = function (node, print) {
            this.keyword("try");
            print(node.block);
            this.space();
            print(node.handler);
            if (node.finalizer) {
              this.space();
              this.push("finally ");
              print(node.finalizer);
            }
          };
          exports.CatchClause = function (node, print) {
            this.keyword("catch");
            this.push("(");
            print(node.param);
            this.push(") ");
            print(node.body);
          };
          exports.ThrowStatement = function (node, print) {
            this.push("throw ");
            print(node.argument);
            this.semicolon();
          };
          exports.SwitchStatement = function (node, print) {
            this.keyword("switch");
            this.push("(");
            print(node.discriminant);
            this.push(") {");
            print.sequence(node.cases, { indent: true });
            this.push("}");
          };
          exports.SwitchCase = function (node, print) {
            if (node.test) {
              this.push("case ");
              print(node.test);
              this.push(":");
            } else {
              this.push("default:");
            }
            this.space();
            print.sequence(node.consequent, { indent: true });
          };
          exports.DebuggerStatement = function () {
            this.push("debugger;");
          };
          exports.VariableDeclaration = function (node, print, parent) {
            this.push(node.kind + " ");
            print.join(node.declarations, { separator: ", " });
            if (!t.isFor(parent)) {
              this.semicolon();
            }
          };
          exports.VariableDeclarator = function (node, print) {
            if (node.init) {
              print(node.id);
              this.push(" = ");
              print(node.init);
            } else {
              print(node.id);
            }
          };
        },
        { "../../types": 59 },
      ],
      14: [
        function (require, module, exports) {
          var _ = require("lodash");
          exports.TaggedTemplateExpression = function (node, print) {
            print(node.tag);
            print(node.quasi);
          };
          exports.TemplateElement = function (node) {
            this._push(node.value.raw);
          };
          exports.TemplateLiteral = function (node, print) {
            this.push("`");
            var quasis = node.quasis;
            var self = this;
            var len = quasis.length;
            _.each(quasis, function (quasi, i) {
              print(quasi);
              if (i + 1 < len) {
                self.push("${ ");
                print(node.expressions[i]);
                self.push(" }");
              }
            });
            this._push("`");
          };
        },
        { lodash: 92 },
      ],
      15: [
        function (require, module, exports) {
          var _ = require("lodash");
          exports.Identifier = function (node) {
            this.push(node.name);
          };
          exports.SpreadElement = function (node, print) {
            this.push("...");
            print(node.argument);
          };
          exports.ObjectExpression = exports.ObjectPattern = function (
            node,
            print
          ) {
            var props = node.properties;
            if (props.length) {
              this.push("{");
              this.space();
              print.join(props, { separator: ", ", indent: true });
              this.space();
              this.push("}");
            } else {
              this.push("{}");
            }
          };
          exports.Property = function (node, print) {
            if (node.method || node.kind === "get" || node.kind === "set") {
              this._method(node, print);
            } else {
              if (node.computed) {
                this.push("[");
                print(node.key);
                this.push("]");
              } else {
                print(node.key);
                if (node.shorthand) return;
              }
              this.push(": ");
              print(node.value);
            }
          };
          exports.ArrayExpression = exports.ArrayPattern = function (
            node,
            print
          ) {
            var elems = node.elements;
            var self = this;
            var len = elems.length;
            this.push("[");
            _.each(elems, function (elem, i) {
              if (!elem) {
                self.push(",");
              } else {
                if (i > 0) self.push(" ");
                print(elem);
                if (i < len - 1) self.push(",");
              }
            });
            this.push("]");
          };
          exports.Literal = function (node) {
            var val = node.value;
            var type = typeof val;
            if (type === "string") {
              val = JSON.stringify(val);
              val = val.replace(/[\u007f-\uffff]/g, function (c) {
                return (
                  "\\u" + ("0000" + c.charCodeAt(0).toString(16)).slice(-4)
                );
              });
              this.push(val);
            } else if (type === "boolean" || type === "number") {
              this.push(JSON.stringify(val));
            } else if (node.regex) {
              this.push("/" + node.regex.pattern + "/" + node.regex.flags);
            } else if (val === null) {
              this.push("null");
            }
          };
        },
        { lodash: 92 },
      ],
      16: [
        function (require, module, exports) {
          module.exports = Node;
          var whitespace = require("./whitespace");
          var parens = require("./parentheses");
          var t = require("../../types");
          var _ = require("lodash");
          var find = function (obj, node, parent) {
            var result;
            _.each(obj, function (fn, type) {
              if (t["is" + type](node)) {
                result = fn(node, parent);
                if (result != null) return false;
              }
            });
            return result;
          };
          function Node(node, parent) {
            this.parent = parent;
            this.node = node;
          }
          Node.prototype.isUserWhitespacable = function () {
            var parent = this.parent;
            var node = this.node;
            if (t.isUserWhitespacable(node) || t.isSequenceExpression(parent)) {
              return true;
            }
            return false;
          };
          Node.prototype.needsWhitespace = function (type) {
            var parent = this.parent;
            var node = this.node;
            if (!node) return 0;
            if (t.isExpressionStatement(node)) {
              node = node.expression;
            }
            var lines = find(whitespace[type].nodes, node, parent);
            if (lines) return lines;
            _.each(find(whitespace[type].list, node, parent), function (expr) {
              lines = Node.needsWhitespace(expr, node, type);
              if (lines) return false;
            });
            return lines || 0;
          };
          Node.prototype.needsWhitespaceBefore = function () {
            return this.needsWhitespace("before");
          };
          Node.prototype.needsWhitespaceAfter = function () {
            return this.needsWhitespace("after");
          };
          Node.prototype.needsParens = function () {
            var parent = this.parent;
            var node = this.node;
            if (!parent) return false;
            if (t.isNewExpression(parent) && parent.callee === node) {
              return (
                t.isCallExpression(node) ||
                _.some(node, function (val) {
                  return t.isCallExpression(val);
                })
              );
            }
            return find(parens, node, parent);
          };
          _.each(Node.prototype, function (fn, key) {
            Node[key] = function (node, parent) {
              var n = new Node(node, parent);
              var args = _.toArray(arguments).slice(2);
              return n[key].apply(n, args);
            };
          });
        },
        {
          "../../types": 59,
          "./parentheses": 17,
          "./whitespace": 18,
          lodash: 92,
        },
      ],
      17: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          var PRECEDENCE = {};
          _.each(
            [
              ["||"],
              ["&&"],
              ["|"],
              ["^"],
              ["&"],
              ["==", "===", "!=", "!=="],
              ["<", ">", "<=", ">=", "in", "instanceof"],
              [">>", "<<", ">>>"],
              ["+", "-"],
              ["*", "/", "%"],
            ],
            function (tier, i) {
              _.each(tier, function (op) {
                PRECEDENCE[op] = i;
              });
            }
          );
          exports.Binary = function (node, parent) {
            if (t.isCallExpression(parent) && parent.callee === node) {
              return true;
            }
            if (t.isUnaryLike(parent)) {
              return true;
            }
            if (t.isMemberExpression(parent) && parent.object === node) {
              return true;
            }
            if (t.isBinary(parent)) {
              var parentOp = parent.operator;
              var parentPos = PRECEDENCE[parentOp];
              var nodeOp = node.operator;
              var nodePos = PRECEDENCE[nodeOp];
              if (parentPos > nodePos) {
                return true;
              }
              if (parentPos === nodePos && parent.right === node) {
                return true;
              }
            }
          };
          exports.BinaryExpression = function (node, parent) {
            if (node.operator === "in") {
              if (t.isVariableDeclarator(parent)) {
                return true;
              }
              if (t.isFor(parent)) {
                return true;
              }
            }
          };
          exports.SequenceExpression = function (node, parent) {
            if (t.isForStatement(parent)) {
              return false;
            }
            if (t.isExpressionStatement(parent) && parent.expression === node) {
              return false;
            }
            return true;
          };
          exports.YieldExpression = function (node, parent) {
            return (
              t.isBinary(parent) ||
              t.isUnaryLike(parent) ||
              t.isCallExpression(parent) ||
              t.isMemberExpression(parent) ||
              t.isNewExpression(parent) ||
              t.isConditionalExpression(parent) ||
              t.isYieldExpression(parent)
            );
          };
          exports.Literal = function (node, parent) {
            if (
              _.isNumber(node.value) &&
              t.isMemberExpression(parent) &&
              parent.object === node
            ) {
              return true;
            }
          };
          exports.ClassExpression = function (node, parent) {
            return t.isExpressionStatement(parent);
          };
          exports.UnaryLike = function (node, parent) {
            return t.isMemberExpression(parent) && parent.object === node;
          };
          exports.FunctionExpression = function (node, parent) {
            if (t.isExpressionStatement(parent)) {
              return true;
            }
            if (t.isMemberExpression(parent) && parent.object === node) {
              return true;
            }
            if (t.isCallExpression(parent) && parent.callee === node) {
              return true;
            }
          };
          exports.AssignmentExpression = exports.ConditionalExpression =
            function (node, parent) {
              if (t.isUnaryLike(parent)) {
                return true;
              }
              if (t.isBinary(parent)) {
                return true;
              }
              if (t.isCallExpression(parent) && parent.callee === node) {
                return true;
              }
              if (t.isConditionalExpression(parent) && parent.test === node) {
                return true;
              }
              if (t.isMemberExpression(parent) && parent.object === node) {
                return true;
              }
              return false;
            };
        },
        { "../../types": 59, lodash: 92 },
      ],
      18: [
        function (require, module, exports) {
          var _ = require("lodash");
          var t = require("../../types");
          exports.before = {
            nodes: {
              Property: function (node, parent) {
                if (parent.properties[0] === node) {
                  return 1;
                }
              },
              SwitchCase: function (node, parent) {
                if (parent.cases[0] === node) {
                  return 1;
                }
              },
              CallExpression: function (node) {
                if (t.isFunction(node.callee)) {
                  return 1;
                }
              },
            },
          };
          exports.after = {
            nodes: {},
            list: {
              VariableDeclaration: function (node) {
                return _.map(node.declarations, "init");
              },
              ArrayExpression: function (node) {
                return node.elements;
              },
              ObjectExpression: function (node) {
                return node.properties;
              },
            },
          };
          _.each(
            {
              Function: 1,
              Class: 1,
              For: 1,
              SwitchStatement: 1,
              IfStatement: { before: 1 },
              CallExpression: { after: 1 },
              Literal: { after: 1 },
            },
            function (amounts, type) {
              if (_.isNumber(amounts))
                amounts = { after: amounts, before: amounts };
              _.each(amounts, function (amount, key) {
                exports[key].nodes[type] = function () {
                  return amount;
                };
              });
            }
          );
        },
        { "../../types": 59, lodash: 92 },
      ],
      19: [
        function (require, module, exports) {
          module.exports = Position;
          var _ = require("lodash");
          function Position() {
            this.line = 1;
            this.column = 0;
          }
          Position.prototype.push = function (str) {
            var self = this;
            _.each(str, function (cha) {
              if (cha === "\n") {
                self.line++;
                self.column = 0;
              } else {
                self.column++;
              }
            });
          };
          Position.prototype.unshift = function (str) {
            var self = this;
            _.each(str, function (cha) {
              if (cha === "\n") {
                self.line--;
              } else {
                self.column--;
              }
            });
          };
        },
        { lodash: 92 },
      ],
      20: [
        function (require, module, exports) {
          module.exports = SourceMap;
          var sourceMap = require("source-map");
          var t = require("../types");
          function SourceMap(position, opts, code) {
            this.position = position;
            this.opts = opts;
            if (opts.sourceMap) {
              this.map = new sourceMap.SourceMapGenerator({
                file: opts.sourceMapName,
              });
              this.map.setSourceContent(opts.sourceFileName, code);
            } else {
              this.map = null;
            }
          }
          SourceMap.prototype.get = function () {
            var map = this.map;
            if (map) {
              return map.toJSON();
            } else {
              return map;
            }
          };
          SourceMap.prototype.mark = function (node, type) {
            var loc = node.loc;
            if (!loc) return;
            var map = this.map;
            if (!map) return;
            if (t.isProgram(node) || t.isFile(node)) return;
            var position = this.position;
            var generated = { line: position.line, column: position.column };
            var original = loc[type];
            if (
              generated.line === original.line &&
              generated.column === original.column
            )
              return;
            map.addMapping({
              source: this.opts.sourceFileName,
              generated: generated,
              original: original,
            });
          };
        },
        { "../types": 59, "source-map": 114 },
      ],
      21: [
        function (require, module, exports) {
          module.exports = Whitespace;
          var _ = require("lodash");
          function Whitespace(tokens, comments) {
            this.tokens = _.sortBy(tokens.concat(comments), "start");
            this.used = [];
          }
          Whitespace.prototype.getNewlinesBefore = function (node) {
            var startToken;
            var endToken;
            var tokens = this.tokens;
            _.each(tokens, function (token, i) {
              if (node.start === token.start) {
                startToken = tokens[i - 1];
                endToken = token;
                return false;
              }
            });
            return this.getNewlinesBetween(startToken, endToken);
          };
          Whitespace.prototype.getNewlinesAfter = function (node) {
            var startToken;
            var endToken;
            var tokens = this.tokens;
            _.each(tokens, function (token, i) {
              if (node.end === token.end) {
                startToken = token;
                endToken = tokens[i + 1];
                return false;
              }
            });
            return this.getNewlinesBetween(startToken, endToken);
          };
          Whitespace.prototype.getNewlinesBetween = function (
            startToken,
            endToken
          ) {
            var start = startToken ? startToken.loc.end.line : 1;
            var end = endToken.loc.start.line;
            var lines = 0;
            for (var line = start; line < end; line++) {
              if (!_.contains(this.used, line)) {
                this.used.push(line);
                lines++;
              }
            }
            return lines;
          };
        },
        { lodash: 92 },
      ],
      22: [
        function (require, module, exports) {
          var t = require("./types");
          var _ = require("lodash");
          var types = require("ast-types");
          var def = types.Type.def;
          def("File")
            .bases("Node")
            .build("program")
            .field("program", def("Program"));
          def("ParenthesizedExpression")
            .bases("Expression")
            .build("expression")
            .field("expression", def("Expression"));
          def("ImportBatchSpecifier")
            .bases("Specifier")
            .build("name")
            .field("name", def("Identifier"));
          types.finalize();
          var estraverse = require("estraverse");
          _.extend(estraverse.VisitorKeys, t.VISITOR_KEYS);
        },
        { "./types": 59, "ast-types": 75, estraverse: 87, lodash: 92 },
      ],
      23: [
        function (require, module, exports) {
          module.exports = AMDFormatter;
          var CommonJSFormatter = require("./common");
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          function AMDFormatter(file) {
            this.file = file;
            this.ids = {};
          }
          util.inherits(AMDFormatter, CommonJSFormatter);
          AMDFormatter.prototype.transform = function (ast) {
            var program = ast.program;
            var body = program.body;
            var names = [t.literal("exports")];
            _.each(this.ids, function (id, name) {
              names.push(t.literal(name));
            });
            names = t.arrayExpression(names);
            var params = _.values(this.ids);
            params.unshift(t.identifier("exports"));
            var container = t.functionExpression(
              null,
              params,
              t.blockStatement(body)
            );
            var call = t.callExpression(t.identifier("define"), [
              names,
              container,
            ]);
            program.body = [t.expressionStatement(call)];
          };
          AMDFormatter.prototype._push = function (node) {
            var id = node.source.value;
            var ids = this.ids;
            if (ids[id]) {
              return ids[id];
            } else {
              return (this.ids[id] = t.identifier(this.file.generateUid(id)));
            }
          };
          AMDFormatter.prototype.import = function (node) {
            this._push(node);
          };
          AMDFormatter.prototype.importSpecifier = function (
            specifier,
            node,
            nodes
          ) {
            var key = t.getSpecifierName(specifier);
            var id = specifier.id;
            if (specifier.default) {
              id = t.identifier("default");
            }
            var ref;
            if (t.isImportBatchSpecifier(specifier)) {
              ref = this._push(node);
            } else {
              ref = t.memberExpression(this._push(node), id, false);
            }
            nodes.push(
              t.variableDeclaration("var", [t.variableDeclarator(key, ref)])
            );
          };
          AMDFormatter.prototype.exportSpecifier = function (
            specifier,
            node,
            nodes
          ) {
            var self = this;
            return this._exportSpecifier(
              function () {
                return self._push(node);
              },
              specifier,
              node,
              nodes
            );
          };
        },
        { "../../types": 59, "../../util": 61, "./common": 24, lodash: 92 },
      ],
      24: [
        function (require, module, exports) {
          module.exports = CommonJSFormatter;
          var util = require("../../util");
          var t = require("../../types");
          function CommonJSFormatter(file) {
            this.file = file;
          }
          CommonJSFormatter.prototype.import = function (node, nodes) {
            nodes.push(
              util.template("require", { MODULE_NAME: node.source.raw }, true)
            );
          };
          CommonJSFormatter.prototype.importSpecifier = function (
            specifier,
            node,
            nodes
          ) {
            var variableName = t.getSpecifierName(specifier);
            if (specifier.default) {
              specifier.id = t.identifier("default");
            }
            var templateName = "require-assign";
            if (specifier.type !== "ImportBatchSpecifier")
              templateName += "-key";
            nodes.push(
              util.template(templateName, {
                VARIABLE_NAME: variableName,
                MODULE_NAME: node.source.raw,
                KEY: specifier.id,
              })
            );
          };
          CommonJSFormatter.prototype.export = function (node, nodes) {
            var declar = node.declaration;
            if (node.default) {
              var ref = declar;
              if (t.isClass(ref) || t.isFunction(ref)) {
                if (ref.id) {
                  nodes.push(t.toStatement(ref));
                  ref = ref.id;
                }
              }
              nodes.push(
                util.template("exports-default", { VALUE: ref }, true)
              );
            } else {
              var assign;
              if (t.isVariableDeclaration(declar)) {
                var decl = declar.declarations[0];
                if (decl.init) {
                  decl.init = util.template("exports-assign", {
                    VALUE: decl.init,
                    KEY: decl.id,
                  });
                }
                nodes.push(declar);
              } else {
                assign = util.template(
                  "exports-assign",
                  { VALUE: declar.id, KEY: declar.id },
                  true
                );
                nodes.push(t.toStatement(declar));
                nodes.push(assign);
                if (t.isFunctionDeclaration(declar)) {
                  assign._blockHoist = true;
                }
              }
            }
          };
          CommonJSFormatter.prototype._exportSpecifier = function (
            getRef,
            specifier,
            node,
            nodes
          ) {
            var variableName = t.getSpecifierName(specifier);
            var inherits = false;
            if (node.specifiers.length === 1) inherits = node;
            if (node.source) {
              if (t.isExportBatchSpecifier(specifier)) {
                nodes.push(
                  util.template("exports-wildcard", { OBJECT: getRef() }, true)
                );
              } else {
                nodes.push(
                  util.template(
                    "exports-assign-key",
                    {
                      VARIABLE_NAME: variableName.name,
                      OBJECT: getRef(),
                      KEY: specifier.id,
                    },
                    true
                  )
                );
              }
            } else {
              nodes.push(
                util.template(
                  "exports-assign",
                  { VALUE: specifier.id, KEY: variableName },
                  true
                )
              );
            }
          };
          CommonJSFormatter.prototype.exportSpecifier = function (
            specifier,
            node,
            nodes
          ) {
            return this._exportSpecifier(
              function () {
                return t.callExpression(t.identifier("require"), [node.source]);
              },
              specifier,
              node,
              nodes
            );
          };
        },
        { "../../types": 59, "../../util": 61 },
      ],
      25: [
        function (require, module, exports) {
          module.exports = IgnoreFormatter;
          var t = require("../../types");
          function IgnoreFormatter() {}
          IgnoreFormatter.prototype.import = function () {};
          IgnoreFormatter.prototype.importSpecifier = function () {};
          IgnoreFormatter.prototype.export = function (node, nodes) {
            var declar = t.toStatement(node.declaration, true);
            if (declar) nodes.push(t.inherits(declar, node));
          };
          IgnoreFormatter.prototype.exportSpecifier = function () {};
        },
        { "../../types": 59 },
      ],
      26: [
        function (require, module, exports) {
          module.exports = UMDFormatter;
          var AMDFormatter = require("./amd");
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          function UMDFormatter(file) {
            this.file = file;
            this.ids = {};
          }
          util.inherits(UMDFormatter, AMDFormatter);
          UMDFormatter.prototype.transform = function (ast) {
            var program = ast.program;
            var body = program.body;
            var names = [];
            _.each(this.ids, function (id, name) {
              names.push(t.literal(name));
            });
            var ids = _.values(this.ids);
            var args = [t.identifier("exports")].concat(ids);
            var factory = t.functionExpression(
              null,
              args,
              t.blockStatement(body)
            );
            var runner = util.template("umd-runner-body", {
              AMD_ARGUMENTS: t.arrayExpression(
                [t.literal("exports")].concat(names)
              ),
              COMMON_ARGUMENTS: names.map(function (name) {
                return t.callExpression(t.identifier("require"), [name]);
              }),
            });
            var call = t.callExpression(runner, [factory]);
            program.body = [t.expressionStatement(call)];
          };
        },
        { "../../types": 59, "../../util": 61, "./amd": 23, lodash: 92 },
      ],
      27: [
        function (require, module, exports) {
          module.exports = transform;
          var Transformer = require("./transformer");
          var File = require("../file");
          var _ = require("lodash");
          function transform(code, opts) {
            var file = new File(opts);
            return file.parse(code);
          }
          transform._ensureTransformerNames = function (type, keys) {
            _.each(keys, function (key) {
              if (!_.has(transform.transformers, key)) {
                throw new ReferenceError(
                  "unknown transformer " + key + " specified in " + type
                );
              }
            });
          };
          transform.transformers = {};
          transform.moduleFormatters = {
            common: require("./modules/common"),
            ignore: require("./modules/ignore"),
            amd: require("./modules/amd"),
            umd: require("./modules/umd"),
          };
          _.each(
            {
              modules: require("./transformers/modules"),
              propertyNameShorthand: require("./transformers/property-name-shorthand"),
              constants: require("./transformers/constants"),
              arrayComprehension: require("./transformers/array-comprehension"),
              generatorComprehension: require("./transformers/generator-comprehension"),
              arrowFunctions: require("./transformers/arrow-functions"),
              classes: require("./transformers/classes"),
              _propertyLiterals: require("./transformers/_property-literals"),
              computedPropertyNames: require("./transformers/computed-property-names"),
              spread: require("./transformers/spread"),
              templateLiterals: require("./transformers/template-literals"),
              propertyMethodAssignment: require("./transformers/property-method-assignment"),
              defaultParameters: require("./transformers/default-parameters"),
              restParameters: require("./transformers/rest-parameters"),
              destructuring: require("./transformers/destructuring"),
              forOf: require("./transformers/for-of"),
              letScoping: require("./transformers/let-scoping"),
              unicodeRegex: require("./transformers/unicode-regex"),
              react: require("./transformers/react"),
              _aliasFunctions: require("./transformers/_alias-functions"),
              _blockHoist: require("./transformers/_block-hoist"),
              _declarations: require("./transformers/_declarations"),
              generators: require("./transformers/generators"),
              useStrict: require("./transformers/use-strict"),
              _memberExpressionKeywords: require("./transformers/_member-expression-keywords"),
              _moduleFormatter: require("./transformers/_module-formatter"),
            },
            function (transformer, key) {
              transform.transformers[key] = new Transformer(key, transformer);
            }
          );
        },
        {
          "../file": 3,
          "./modules/amd": 23,
          "./modules/common": 24,
          "./modules/ignore": 25,
          "./modules/umd": 26,
          "./transformer": 28,
          "./transformers/_alias-functions": 29,
          "./transformers/_block-hoist": 30,
          "./transformers/_declarations": 31,
          "./transformers/_member-expression-keywords": 32,
          "./transformers/_module-formatter": 33,
          "./transformers/_property-literals": 34,
          "./transformers/array-comprehension": 35,
          "./transformers/arrow-functions": 36,
          "./transformers/classes": 37,
          "./transformers/computed-property-names": 38,
          "./transformers/constants": 39,
          "./transformers/default-parameters": 40,
          "./transformers/destructuring": 41,
          "./transformers/for-of": 42,
          "./transformers/generator-comprehension": 43,
          "./transformers/generators": 44,
          "./transformers/let-scoping": 45,
          "./transformers/modules": 46,
          "./transformers/property-method-assignment": 47,
          "./transformers/property-name-shorthand": 48,
          "./transformers/react": 49,
          "./transformers/rest-parameters": 50,
          "./transformers/spread": 51,
          "./transformers/template-literals": 52,
          "./transformers/unicode-regex": 53,
          "./transformers/use-strict": 54,
          lodash: 92,
        },
      ],
      28: [
        function (require, module, exports) {
          module.exports = Transformer;
          var traverse = require("../traverse");
          var t = require("../types");
          var _ = require("lodash");
          function Transformer(key, transformer) {
            this.transformer = Transformer.normalise(transformer);
            this.key = key;
          }
          Transformer.normalise = function (transformer) {
            if (_.isFunction(transformer)) {
              transformer = { ast: transformer };
            }
            _.each(transformer, function (fns, type) {
              if (type[0] === "_") return;
              if (_.isFunction(fns)) fns = { enter: fns };
              transformer[type] = fns;
            });
            return transformer;
          };
          Transformer.prototype.transform = function (file) {
            if (!this.canRun(file)) return;
            var transformer = this.transformer;
            var ast = file.ast;
            var astRun = function (key) {
              if (transformer.ast && transformer.ast[key]) {
                transformer.ast[key](ast, file);
              }
            };
            astRun("enter");
            var build = function (exit) {
              return function (node, parent, scope) {
                var types = [node.type].concat(t.ALIAS_KEYS[node.type] || []);
                var fns = transformer.all;
                _.each(types, function (type) {
                  fns = transformer[type] || fns;
                });
                if (!fns) return;
                var fn = fns.enter;
                if (exit) fn = fns.exit;
                if (!fn) return;
                return fn(node, parent, file, scope);
              };
            };
            traverse(ast, { enter: build(), exit: build(true) });
            astRun("exit");
          };
          Transformer.prototype.canRun = function (file) {
            var opts = file.opts;
            var key = this.key;
            var blacklist = opts.blacklist;
            if (blacklist.length && _.contains(blacklist, key)) return false;
            if (key[0] !== "_") {
              var whitelist = opts.whitelist;
              if (whitelist.length && !_.contains(whitelist, key)) return false;
            }
            return true;
          };
        },
        { "../traverse": 55, "../types": 59, lodash: 92 },
      ],
      29: [
        function (require, module, exports) {
          var traverse = require("../../traverse");
          var t = require("../../types");
          var go = function (getBody, node, file, scope) {
            var argumentsId;
            var thisId;
            var getArgumentsId = function () {
              return (argumentsId =
                argumentsId ||
                t.identifier(file.generateUid("arguments", scope)));
            };
            var getThisId = function () {
              return (thisId =
                thisId || t.identifier(file.generateUid("this", scope)));
            };
            traverse(node, function (node) {
              if (!node._aliasFunction) {
                if (t.isFunction(node)) {
                  return false;
                } else {
                  return;
                }
              }
              traverse(node, function (node, parent) {
                if (t.isFunction(node) && !node._aliasFunction) {
                  return false;
                }
                if (node._ignoreAliasFunctions) return;
                var getId;
                if (t.isIdentifier(node) && node.name === "arguments") {
                  getId = getArgumentsId;
                } else if (t.isThisExpression(node)) {
                  getId = getThisId;
                } else {
                  return;
                }
                if (t.isReferenced(node, parent)) return getId();
              });
              return false;
            });
            var body;
            var pushDeclaration = function (id, init) {
              body = body || getBody();
              body.unshift(
                t.variableDeclaration("var", [t.variableDeclarator(id, init)])
              );
            };
            if (argumentsId) {
              pushDeclaration(argumentsId, t.identifier("arguments"));
            }
            if (thisId) {
              pushDeclaration(thisId, t.identifier("this"));
            }
          };
          exports.Program = function (node, parent, file, scope) {
            go(
              function () {
                return node.body;
              },
              node,
              file,
              scope
            );
          };
          exports.FunctionDeclaration = exports.FunctionExpression = function (
            node,
            parent,
            file,
            scope
          ) {
            go(
              function () {
                t.ensureBlock(node);
                return node.body.body;
              },
              node,
              file,
              scope
            );
          };
        },
        { "../../traverse": 55, "../../types": 59 },
      ],
      30: [
        function (require, module, exports) {
          exports.BlockStatement = exports.Program = {
            exit: function (node) {
              var unshift = [];
              node.body = node.body.filter(function (bodyNode) {
                if (bodyNode._blockHoist) {
                  unshift.push(bodyNode);
                  return false;
                } else {
                  return true;
                }
              });
              node.body = unshift.concat(node.body);
            },
          };
        },
        {},
      ],
      31: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          module.exports = function (ast, file) {
            var body = ast.program.body;
            _.each(file.declarations, function (declar) {
              body.unshift(
                t.variableDeclaration("var", [
                  t.variableDeclarator(declar.uid, declar.node),
                ])
              );
            });
          };
        },
        { "../../types": 59, lodash: 92 },
      ],
      32: [
        function (require, module, exports) {
          var esutils = require("esutils");
          var t = require("../../types");
          exports.MemberExpression = function (node) {
            var prop = node.property;
            if (
              t.isIdentifier(prop) &&
              esutils.keyword.isKeywordES6(prop.name, true)
            ) {
              node.property = t.literal(prop.name);
              node.computed = true;
            }
          };
        },
        { "../../types": 59, esutils: 91 },
      ],
      33: [
        function (require, module, exports) {
          var transform = require("../transform");
          exports.ast = {
            exit: function (ast, file) {
              if (!transform.transformers.modules.canRun(file)) return;
              if (file.moduleFormatter.transform) {
                file.moduleFormatter.transform(ast);
              }
            },
          };
        },
        { "../transform": 27 },
      ],
      34: [
        function (require, module, exports) {
          var esutils = require("esutils");
          var t = require("../../types");
          var _ = require("lodash");
          exports.Property = function (node) {
            var key = node.key;
            if (
              t.isLiteral(key) &&
              _.isString(key.value) &&
              esutils.keyword.isIdentifierName(key.value)
            ) {
              key.type = "Identifier";
              key.name = key.value;
              delete key.value;
              node.computed = false;
            }
          };
        },
        { "../../types": 59, esutils: 91, lodash: 92 },
      ],
      35: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          var singleArrayExpression = function (node) {
            var block = node.blocks[0];
            var templateName = "array-expression-comprehension-map";
            if (node.filter)
              templateName = "array-expression-comprehension-filter";
            var result = util.template(templateName, {
              STATEMENT: node.body,
              FILTER: node.filter,
              ARRAY: block.right,
              KEY: block.left,
            });
            _.each([result.callee.object, result], function (call) {
              if (t.isCallExpression(call)) {
                call.arguments[0]._aliasFunction = true;
              }
            });
            return result;
          };
          var multiple = function (node, file) {
            var uid = file.generateUid("arr");
            var container = util.template("array-comprehension-container", {
              KEY: uid,
            });
            container.callee.expression._aliasFunction = true;
            var block = container.callee.expression.body;
            var body = block.body;
            var returnStatement = body.pop();
            body.push(
              exports._build(node, function () {
                return util.template(
                  "array-push",
                  { STATEMENT: node.body, KEY: uid },
                  true
                );
              })
            );
            body.push(returnStatement);
            return container;
          };
          exports._build = function (node, buildBody) {
            var self = node.blocks.shift();
            if (!self) return;
            var child = exports._build(node, buildBody);
            if (!child) {
              child = buildBody();
              if (node.filter) {
                child = t.ifStatement(node.filter, t.blockStatement([child]));
              }
            }
            return t.forOfStatement(
              t.variableDeclaration("var", [t.variableDeclarator(self.left)]),
              self.right,
              t.blockStatement([child])
            );
          };
          exports.ComprehensionExpression = function (node, parent, file) {
            if (node.generator) return;
            if (
              node.blocks.length === 1 &&
              t.isArrayExpression(node.blocks[0].right)
            ) {
              return singleArrayExpression(node);
            } else {
              return multiple(node, file);
            }
          };
        },
        { "../../types": 59, "../../util": 61, lodash: 92 },
      ],
      36: [
        function (require, module, exports) {
          var t = require("../../types");
          exports.ArrowFunctionExpression = function (node) {
            t.ensureBlock(node);
            node._aliasFunction = true;
            node.expression = false;
            node.type = "FunctionExpression";
            return node;
          };
        },
        { "../../types": 59 },
      ],
      37: [
        function (require, module, exports) {
          var traverse = require("../../traverse");
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          exports.ClassDeclaration = function (node, parent, file, scope) {
            return t.variableDeclaration("let", [
              t.variableDeclarator(node.id, new Class(node, file, scope).run()),
            ]);
          };
          exports.ClassExpression = function (node, parent, file, scope) {
            return new Class(node, file, scope).run();
          };
          var getMemberExpressionObject = function (node) {
            while (t.isMemberExpression(node)) {
              node = node.object;
            }
            return node;
          };
          function Class(node, file, scope) {
            this.scope = scope;
            this.node = node;
            this.file = file;
            this.instanceMutatorMap = {};
            this.staticMutatorMap = {};
            this.hasConstructor = false;
            this.className =
              node.id || t.identifier(file.generateUid("class", scope));
            this.superName = node.superClass;
          }
          Class.prototype.run = function () {
            var superClassArgument = this.superName;
            var superClassCallee = this.superName;
            var superName = this.superName;
            var className = this.className;
            var file = this.file;
            if (superName) {
              if (t.isMemberExpression(superName)) {
                superClassArgument = superClassCallee =
                  getMemberExpressionObject(superName);
              } else if (!t.isIdentifier(superName)) {
                superClassArgument = superName;
                superClassCallee = superName = t.identifier(
                  file.generateUid("ref", this.scope)
                );
              }
            }
            this.superName = superName;
            var container = util.template("class", { CLASS_NAME: className });
            var block = container.callee.expression.body;
            var body = (this.body = block.body);
            var constructor = (this.constructor = body[0].declarations[0].init);
            if (this.node.id) constructor.id = className;
            var returnStatement = body.pop();
            if (superName) {
              body.push(
                t.expressionStatement(
                  t.callExpression(file.addDeclaration("extends"), [
                    className,
                    superName,
                  ])
                )
              );
              container.arguments.push(superClassArgument);
              container.callee.expression.params.push(superClassCallee);
            }
            this.buildBody();
            if (body.length === 1) {
              return constructor;
            } else {
              body.push(returnStatement);
              return container;
            }
          };
          Class.prototype.buildBody = function () {
            var constructor = this.constructor;
            var className = this.className;
            var superName = this.superName;
            var classBody = this.node.body.body;
            var body = this.body;
            var self = this;
            _.each(classBody, function (node) {
              self.replaceInstanceSuperReferences(node);
              if (node.key.name === "constructor") {
                self.pushConstructor(node);
              } else {
                self.pushMethod(node);
              }
            });
            if (!this.hasConstructor && superName) {
              constructor.body.body.push(
                util.template(
                  "class-super-constructor-call",
                  { SUPER_NAME: superName },
                  true
                )
              );
            }
            var instanceProps;
            var staticProps;
            if (!_.isEmpty(this.instanceMutatorMap)) {
              var protoId = util.template("prototype-identifier", {
                CLASS_NAME: className,
              });
              instanceProps = util.buildDefineProperties(
                this.instanceMutatorMap,
                protoId
              );
            }
            if (!_.isEmpty(this.staticMutatorMap)) {
              staticProps = util.buildDefineProperties(
                this.staticMutatorMap,
                className
              );
            }
            if (instanceProps || staticProps) {
              staticProps = staticProps || t.literal(null);
              var args = [className, staticProps];
              if (instanceProps) args.push(instanceProps);
              body.push(
                t.expressionStatement(
                  t.callExpression(
                    this.file.addDeclaration("class-props"),
                    args
                  )
                )
              );
            }
          };
          Class.prototype.pushMethod = function (node) {
            var methodName = node.key;
            var mutatorMap = this.instanceMutatorMap;
            if (node.static) mutatorMap = this.staticMutatorMap;
            var kind = node.kind;
            if (kind === "") {
              kind = "value";
              util.pushMutatorMap(
                mutatorMap,
                methodName,
                "writable",
                t.identifier("true")
              );
            }
            util.pushMutatorMap(mutatorMap, methodName, kind, node);
          };
          Class.prototype.superIdentifier = function (methodNode, id, parent) {
            var methodName = methodNode.key;
            var superName = this.superName || t.identifier("Function");
            if (parent.property === id) {
              return;
            } else if (t.isCallExpression(parent, { callee: id })) {
              parent.arguments.unshift(t.thisExpression());
              if (methodName.name === "constructor") {
                return t.memberExpression(superName, t.identifier("call"));
              } else {
                id = superName;
                if (!methodNode.static) {
                  id = t.memberExpression(id, t.identifier("prototype"));
                }
                id = t.memberExpression(id, methodName, methodNode.computed);
                return t.memberExpression(id, t.identifier("call"));
              }
            } else if (t.isMemberExpression(parent) && !methodNode.static) {
              return t.memberExpression(superName, t.identifier("prototype"));
            } else {
              return superName;
            }
          };
          Class.prototype.replaceInstanceSuperReferences = function (
            methodNode
          ) {
            var method = methodNode.value;
            var self = this;
            traverse(method, function (node, parent) {
              if (t.isIdentifier(node, { name: "super" })) {
                return self.superIdentifier(methodNode, node, parent);
              } else if (t.isCallExpression(node)) {
                var callee = node.callee;
                if (!t.isMemberExpression(callee)) return;
                if (callee.object.name !== "super") return;
                callee.property = t.memberExpression(
                  callee.property,
                  t.identifier("call")
                );
                node.arguments.unshift(t.thisExpression());
              }
            });
          };
          Class.prototype.pushConstructor = function (method) {
            if (method.kind !== "") {
              throw this.file.errorWithNode(
                method,
                "illegal kind for constructor method"
              );
            }
            var construct = this.constructor;
            var fn = method.value;
            this.hasConstructor = true;
            t.inherits(construct, fn);
            construct.defaults = fn.defaults;
            construct.params = fn.params;
            construct.body = fn.body;
            construct.rest = fn.rest;
          };
        },
        {
          "../../traverse": 55,
          "../../types": 59,
          "../../util": 61,
          lodash: 92,
        },
      ],
      38: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          exports.ObjectExpression = function (node, parent, file) {
            var hasComputed = false;
            var computed = [];
            node.properties = node.properties.filter(function (prop) {
              if (prop.computed) {
                hasComputed = true;
                computed.unshift(prop);
                return false;
              } else {
                return true;
              }
            });
            if (!hasComputed) return;
            var objId = util.getUid(parent, file);
            var container = util.template("function-return-obj", {
              KEY: objId,
              OBJECT: node,
            });
            var containerCallee = container.callee.expression;
            var containerBody = containerCallee.body.body;
            containerCallee._aliasFunction = true;
            _.each(computed, function (prop) {
              containerBody.unshift(
                t.expressionStatement(
                  t.assignmentExpression(
                    "=",
                    t.memberExpression(objId, prop.key, true),
                    prop.value
                  )
                )
              );
            });
            return container;
          };
        },
        { "../../types": 59, "../../util": 61, lodash: 92 },
      ],
      39: [
        function (require, module, exports) {
          var traverse = require("../../traverse");
          var t = require("../../types");
          var _ = require("lodash");
          exports.Program =
            exports.BlockStatement =
            exports.ForInStatement =
            exports.ForOfStatement =
            exports.ForStatement =
              function (node, parent, file) {
                var constants = {};
                var check = function (node, names, parent) {
                  _.each(names, function (name) {
                    if (!_.has(constants, name)) return;
                    if (
                      parent &&
                      t.isBlockStatement(parent) &&
                      parent !== constants[name]
                    )
                      return;
                    throw file.errorWithNode(node, name + " is read-only");
                  });
                };
                var getIds = function (node) {
                  return t.getIds(node, false, ["MemberExpression"]);
                };
                _.each(node.body, function (child, parent) {
                  if (
                    child &&
                    t.isVariableDeclaration(child, { kind: "const" })
                  ) {
                    _.each(child.declarations, function (declar) {
                      _.each(getIds(declar), function (name) {
                        check(declar, [name], parent);
                        constants[name] = parent;
                      });
                      declar._ignoreConstant = true;
                    });
                    child._ignoreConstant = true;
                    child.kind = "let";
                  }
                });
                if (_.isEmpty(constants)) return;
                traverse(node, function (child, parent) {
                  if (child._ignoreConstant) return;
                  if (
                    t.isDeclaration(child) ||
                    t.isAssignmentExpression(child)
                  ) {
                    check(child, getIds(child), parent);
                  }
                });
              };
        },
        { "../../traverse": 55, "../../types": 59, lodash: 92 },
      ],
      40: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          exports.Function = function (node) {
            if (!node.defaults || !node.defaults.length) return;
            t.ensureBlock(node);
            _.each(node.defaults, function (def, i) {
              if (!def) return;
              var param = node.params[i];
              node.body.body.unshift(
                util.template(
                  "if-undefined-set-to",
                  { VARIABLE: param, DEFAULT: def },
                  true
                )
              );
            });
            node.defaults = [];
          };
        },
        { "../../types": 59, "../../util": 61, lodash: 92 },
      ],
      41: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          var buildVariableAssign = function (kind, id, init) {
            if (kind === false) {
              return t.expressionStatement(
                t.assignmentExpression("=", id, init)
              );
            } else {
              return t.variableDeclaration(kind, [
                t.variableDeclarator(id, init),
              ]);
            }
          };
          var push = function (kind, nodes, elem, parentId) {
            if (t.isObjectPattern(elem)) {
              pushObjectPattern(kind, nodes, elem, parentId);
            } else if (t.isArrayPattern(elem)) {
              pushArrayPattern(kind, nodes, elem, parentId);
            } else if (t.isMemberExpression(elem)) {
              nodes.push(buildVariableAssign(false, elem, parentId));
            } else {
              nodes.push(buildVariableAssign(kind, elem, parentId));
            }
          };
          var pushObjectPattern = function (kind, nodes, pattern, parentId) {
            _.each(pattern.properties, function (prop) {
              var pattern2 = prop.value;
              var patternId2 = t.memberExpression(parentId, prop.key);
              if (t.isPattern(pattern2)) {
                push(kind, nodes, pattern2, patternId2);
              } else {
                nodes.push(buildVariableAssign(kind, pattern2, patternId2));
              }
            });
          };
          var pushArrayPattern = function (kind, nodes, pattern, parentId) {
            _.each(pattern.elements, function (elem, i) {
              if (!elem) return;
              var newPatternId;
              if (t.isSpreadElement(elem)) {
                newPatternId = t.callExpression(
                  t.memberExpression(parentId, t.identifier("slice")),
                  [t.literal(i)]
                );
                elem = elem.argument;
              } else {
                newPatternId = t.memberExpression(parentId, t.literal(i), true);
              }
              push(kind, nodes, elem, newPatternId);
            });
          };
          var pushPattern = function (opts) {
            var kind = opts.kind;
            var nodes = opts.nodes;
            var pattern = opts.pattern;
            var parentId = opts.id;
            var file = opts.file;
            var scope = opts.scope;
            if (!t.isMemberExpression(parentId) && !t.isIdentifier(parentId)) {
              var key = t.identifier(file.generateUid("ref", scope));
              nodes.push(
                t.variableDeclaration("var", [
                  t.variableDeclarator(key, parentId),
                ])
              );
              parentId = key;
            }
            push(kind, nodes, pattern, parentId);
          };
          exports.ForInStatement = exports.ForOfStatement = function (
            node,
            parent,
            file,
            scope
          ) {
            var declar = node.left;
            if (!t.isVariableDeclaration(declar)) return;
            var pattern = declar.declarations[0].id;
            if (!t.isPattern(pattern)) return;
            var key = t.identifier(file.generateUid("ref", scope));
            node.left = t.variableDeclaration(declar.kind, [
              t.variableDeclarator(key, null),
            ]);
            var nodes = [];
            push(declar.kind, nodes, pattern, key);
            t.ensureBlock(node);
            var block = node.body;
            block.body = nodes.concat(block.body);
          };
          exports.Function = function (node, parent, file, scope) {
            var nodes = [];
            var hasDestructuring = false;
            node.params = node.params.map(function (pattern) {
              if (!t.isPattern(pattern)) return pattern;
              hasDestructuring = true;
              var parentId = t.identifier(file.generateUid("ref", scope));
              pushPattern({
                kind: "var",
                nodes: nodes,
                pattern: pattern,
                id: parentId,
                file: file,
                scope: scope,
              });
              return parentId;
            });
            if (!hasDestructuring) return;
            t.ensureBlock(node);
            var block = node.body;
            block.body = nodes.concat(block.body);
          };
          exports.ExpressionStatement = function (node, parent, file, scope) {
            var expr = node.expression;
            if (expr.type !== "AssignmentExpression") return;
            if (!t.isPattern(expr.left)) return;
            var nodes = [];
            var ref = t.identifier(file.generateUid("ref", scope));
            nodes.push(
              t.variableDeclaration("var", [
                t.variableDeclarator(ref, expr.right),
              ])
            );
            push(false, nodes, expr.left, ref);
            return nodes;
          };
          exports.AssignmentExpression = function (node, parent, file) {
            if (parent.type === "ExpressionStatement") return;
            if (!t.isPattern(node.left)) return;
            throw file.errorWithNode(
              node,
              "AssignmentExpression destructuring outside of a ExpressionStatement is forbidden due to current 6to5 limitations"
            );
          };
          exports.VariableDeclaration = function (node, parent, file, scope) {
            if (t.isForInStatement(parent) || t.isForOfStatement(parent))
              return;
            var nodes = [];
            var hasPattern = false;
            _.each(node.declarations, function (declar) {
              if (t.isPattern(declar.id)) {
                hasPattern = true;
                return false;
              }
            });
            if (!hasPattern) return;
            _.each(node.declarations, function (declar) {
              var patternId = declar.init;
              var pattern = declar.id;
              if (t.isPattern(pattern) && patternId) {
                pushPattern({
                  kind: node.kind,
                  nodes: nodes,
                  pattern: pattern,
                  id: patternId,
                  file: file,
                  scope: scope,
                });
              } else {
                nodes.push(
                  buildVariableAssign(node.kind, declar.id, declar.init)
                );
              }
            });
            if (!t.isProgram(parent) && !t.isBlockStatement(parent)) {
              var declar;
              _.each(nodes, function (node) {
                declar = declar || t.variableDeclaration(node.kind, []);
                if (
                  !t.isVariableDeclaration(node) &&
                  declar.kind !== node.kind
                ) {
                  throw file.errorWithNode(
                    node,
                    "Cannot use this node within the current parent"
                  );
                }
                declar.declarations = declar.declarations.concat(
                  node.declarations
                );
              });
              return declar;
            }
            return nodes;
          };
        },
        { "../../types": 59, lodash: 92 },
      ],
      42: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          exports.ForOfStatement = function (node, parent, file, scope) {
            var left = node.left;
            var declar;
            var stepKey = t.identifier(file.generateUid("step", scope));
            var stepValue = t.memberExpression(stepKey, t.identifier("value"));
            if (t.isIdentifier(left)) {
              declar = t.expressionStatement(
                t.assignmentExpression("=", left, stepValue)
              );
            } else if (t.isVariableDeclaration(left)) {
              declar = t.variableDeclaration(left.kind, [
                t.variableDeclarator(left.declarations[0].id, stepValue),
              ]);
            } else {
              throw file.errorWithNode(
                left,
                "Unknown node type " + left.type + " in ForOfStatement"
              );
            }
            var node2 = util.template("for-of", {
              ITERATOR_KEY: file.generateUid("iterator", scope),
              STEP_KEY: stepKey,
              OBJECT: node.right,
            });
            t.ensureBlock(node);
            var block = node2.body;
            block.body.push(declar);
            block.body = block.body.concat(node.body.body);
            return node2;
          };
        },
        { "../../types": 59, "../../util": 61 },
      ],
      43: [
        function (require, module, exports) {
          var arrayComprehension = require("./array-comprehension");
          var t = require("../../types");
          exports.ComprehensionExpression = function (node) {
            if (!node.generator) return;
            var body = [];
            var container = t.functionExpression(
              null,
              [],
              t.blockStatement(body),
              true
            );
            body.push(
              arrayComprehension._build(node, function () {
                return t.expressionStatement(t.yieldExpression(node.body));
              })
            );
            return t.callExpression(container, []);
          };
        },
        { "../../types": 59, "./array-comprehension": 35 },
      ],
      44: [
        function (require, module, exports) {
          var regenerator = require("regenerator-6to5");
          module.exports = regenerator.transform;
        },
        { "regenerator-6to5": 99 },
      ],
      45: [
        function (require, module, exports) {
          var traverse = require("../../traverse");
          var util = require("../../util");
          var t = require("../../types");
          var _ = require("lodash");
          var isLet = function (node) {
            if (!t.isVariableDeclaration(node)) return false;
            if (node._let) return true;
            if (node.kind !== "let") return false;
            node._let = true;
            node.kind = "var";
            return true;
          };
          var isVar = function (node) {
            return (
              t.isVariableDeclaration(node, { kind: "var" }) && !isLet(node)
            );
          };
          var standardiseLets = function (declars) {
            _.each(declars, function (declar) {
              delete declar._let;
            });
          };
          exports.VariableDeclaration = function (node) {
            isLet(node);
          };
          exports.For = function (node, parent, file, scope) {
            var init = node.left || node.init;
            if (isLet(init)) {
              t.ensureBlock(node);
              node.body._letDeclars = [init];
            }
            if (t.isLabeledStatement(parent)) {
              node.label = parent.label;
            }
            var letScoping = new LetScoping(
              node,
              node.body,
              parent,
              file,
              scope
            );
            letScoping.run();
            if (node.label && !t.isLabeledStatement(parent)) {
              return t.labeledStatement(node.label, node);
            }
          };
          exports.BlockStatement = function (block, parent, file, scope) {
            if (!t.isFor(parent)) {
              var letScoping = new LetScoping(
                false,
                block,
                parent,
                file,
                scope
              );
              letScoping.run();
            }
          };
          function LetScoping(forParent, block, parent, file, scope) {
            this.forParent = forParent;
            this.parent = parent;
            this.scope = scope;
            this.block = block;
            this.file = file;
            this.letReferences = {};
            this.body = [];
          }
          LetScoping.prototype.run = function () {
            var block = this.block;
            if (block._letDone) return;
            block._letDone = true;
            this.info = this.getInfo();
            if (t.isFunction(this.parent)) return this.noClosure();
            if (!this.info.keys.length) return this.noClosure();
            var referencesInClosure = this.getLetReferences();
            if (!referencesInClosure) return this.noClosure();
            this.has = this.checkFor();
            this.hoistVarDeclarations();
            standardiseLets(this.info.declarators);
            var letReferences = _.values(this.letReferences);
            var fn = t.functionExpression(
              null,
              letReferences,
              t.blockStatement(block.body)
            );
            fn._aliasFunction = true;
            block.body = this.body;
            var params = this.getParams(letReferences);
            var call = t.callExpression(fn, params);
            var ret = t.identifier(this.file.generateUid("ret", this.scope));
            this.build(ret, call);
          };
          LetScoping.prototype.noClosure = function () {
            var replacements = this.info.duplicates;
            var declarators = this.info.declarators;
            var block = this.block;
            standardiseLets(declarators);
            if (_.isEmpty(replacements)) return;
            var replace = function (node, parent) {
              if (!t.isIdentifier(node)) return;
              if (!t.isReferenced(node, parent)) return;
              node.name = replacements[node.name] || node.name;
            };
            var traverseReplace = function (node, parent) {
              replace(node, parent);
              traverse(node, replace);
            };
            var forParent = this.forParent;
            if (forParent) {
              traverseReplace(forParent.right, forParent);
              traverseReplace(forParent.test, forParent);
              traverseReplace(forParent.update, forParent);
            }
            traverse(block, replace);
          };
          LetScoping.prototype.getInfo = function () {
            var block = this.block;
            var scope = this.scope;
            var file = this.file;
            var opts = {
              outsideKeys: [],
              declarators: block._letDeclars || [],
              duplicates: {},
              keys: [],
            };
            var duplicates = function (id, key) {
              var has = scope.parentGet(key);
              if (has && has !== id) {
                opts.duplicates[key] = id.name = file.generateUid(key, scope);
              }
            };
            _.each(opts.declarators, function (declar) {
              opts.declarators.push(declar);
              var keys = t.getIds(declar, true);
              _.each(keys, duplicates);
              keys = _.keys(keys);
              opts.outsideKeys = opts.outsideKeys.concat(keys);
              opts.keys = opts.keys.concat(keys);
            });
            _.each(block.body, function (declar) {
              if (!isLet(declar)) return;
              _.each(t.getIds(declar, true), function (id, key) {
                duplicates(id, key);
                opts.keys.push(key);
              });
            });
            return opts;
          };
          LetScoping.prototype.checkFor = function () {
            var has = { hasContinue: false, hasReturn: false, hasBreak: false };
            if (this.forParent) {
              traverse(this.block, function (node) {
                var replace;
                if (t.isFunction(node) || t.isFor(node)) {
                  return false;
                } else if (t.isBreakStatement(node) && !node.label) {
                  has.hasBreak = true;
                  replace = t.returnStatement(t.literal("break"));
                } else if (t.isContinueStatement(node) && !node.label) {
                  has.hasContinue = true;
                  replace = t.returnStatement(t.literal("continue"));
                } else if (t.isReturnStatement(node)) {
                  has.hasReturn = true;
                  replace = t.returnStatement(
                    t.objectExpression([
                      t.property(
                        "init",
                        t.identifier("v"),
                        node.argument || t.identifier("undefined")
                      ),
                    ])
                  );
                }
                if (replace) return t.inherits(replace, node);
              });
            }
            return has;
          };
          LetScoping.prototype.hoistVarDeclarations = function () {
            var self = this;
            traverse(this.block, function (node) {
              if (t.isForStatement(node)) {
                if (isVar(node.init)) {
                  node.init = t.sequenceExpression(self.pushDeclar(node.init));
                }
              } else if (t.isFor(node)) {
                if (isVar(node.left)) {
                  node.left = node.left.declarations[0].id;
                }
              } else if (isVar(node)) {
                return self.pushDeclar(node).map(t.expressionStatement);
              } else if (t.isFunction(node)) {
                return false;
              }
            });
          };
          LetScoping.prototype.getParams = function (params) {
            var info = this.info;
            params = _.cloneDeep(params);
            _.each(params, function (param) {
              param.name = info.duplicates[param.name] || param.name;
            });
            return params;
          };
          LetScoping.prototype.getLetReferences = function () {
            var closurify = false;
            var self = this;
            traverse(this.block, function (node, parent, scope) {
              if (t.isFunction(node)) {
                traverse(node, function (node, parent) {
                  if (!t.isIdentifier(node)) return;
                  if (!t.isReferenced(node, parent)) return;
                  if (scope.hasOwn(node.name)) return;
                  closurify = true;
                  if (!_.contains(self.info.outsideKeys, node.name)) return;
                  self.letReferences[node.name] = node;
                });
                return false;
              } else if (t.isFor(node)) {
                return false;
              }
            });
            return closurify;
          };
          LetScoping.prototype.pushDeclar = function (node) {
            this.body.push(
              t.variableDeclaration(
                node.kind,
                node.declarations.map(function (declar) {
                  return t.variableDeclarator(declar.id);
                })
              )
            );
            var replace = [];
            _.each(node.declarations, function (declar) {
              if (!declar.init) return;
              var expr = t.assignmentExpression("=", declar.id, declar.init);
              replace.push(t.inherits(expr, declar));
            });
            return replace;
          };
          LetScoping.prototype.build = function (ret, call) {
            var has = this.has;
            if (has.hasReturn || has.hasBreak || has.hasContinue) {
              this.buildHas(ret, call);
            } else {
              this.body.push(t.expressionStatement(call));
            }
          };
          LetScoping.prototype.buildHas = function (ret, call) {
            var body = this.body;
            body.push(
              t.variableDeclaration("var", [t.variableDeclarator(ret, call)])
            );
            var forParent = this.forParent;
            var retCheck;
            var has = this.has;
            var cases = [];
            if (has.hasReturn) {
              retCheck = util.template("let-scoping-return", { RETURN: ret });
            }
            if (has.hasBreak || has.hasContinue) {
              var label = (forParent.label =
                forParent.label ||
                t.identifier(this.file.generateUid("loop", this.scope)));
              if (has.hasBreak) {
                cases.push(
                  t.switchCase(t.literal("break"), [t.breakStatement(label)])
                );
              }
              if (has.hasContinue) {
                cases.push(
                  t.switchCase(t.literal("continue"), [
                    t.continueStatement(label),
                  ])
                );
              }
              if (has.hasReturn) {
                cases.push(t.switchCase(null, [retCheck]));
              }
              if (cases.length === 1) {
                var single = cases[0];
                body.push(
                  t.ifStatement(
                    t.binaryExpression("===", ret, single.test),
                    single.consequent[0]
                  )
                );
              } else {
                body.push(t.switchStatement(ret, cases));
              }
            } else {
              if (has.hasReturn) body.push(retCheck);
            }
          };
        },
        {
          "../../traverse": 55,
          "../../types": 59,
          "../../util": 61,
          lodash: 92,
        },
      ],
      46: [
        function (require, module, exports) {
          var _ = require("lodash");
          exports.ImportDeclaration = function (node, parent, file) {
            var nodes = [];
            if (node.specifiers.length) {
              _.each(node.specifiers, function (specifier) {
                file.moduleFormatter.importSpecifier(specifier, node, nodes);
              });
            } else {
              file.moduleFormatter.import(node, nodes);
            }
            return nodes;
          };
          exports.ExportDeclaration = function (node, parent, file) {
            var nodes = [];
            if (node.declaration) {
              file.moduleFormatter.export(node, nodes);
            } else {
              _.each(node.specifiers, function (specifier) {
                file.moduleFormatter.exportSpecifier(specifier, node, nodes);
              });
            }
            return nodes;
          };
        },
        { lodash: 92 },
      ],
      47: [
        function (require, module, exports) {
          var util = require("../../util");
          var _ = require("lodash");
          exports.Property = function (node) {
            if (node.method) node.method = false;
          };
          exports.ObjectExpression = function (node, parent, file) {
            var mutatorMap = {};
            node.properties = node.properties.filter(function (prop) {
              if (prop.kind === "get" || prop.kind === "set") {
                util.pushMutatorMap(
                  mutatorMap,
                  prop.key,
                  prop.kind,
                  prop.value
                );
                return false;
              } else {
                return true;
              }
            });
            if (_.isEmpty(mutatorMap)) return;
            var objId = util.getUid(parent, file);
            return util.template("object-define-properties-closure", {
              KEY: objId,
              OBJECT: node,
              CONTENT: util.template("object-define-properties", {
                OBJECT: objId,
                PROPS: util.buildDefineProperties(mutatorMap),
              }),
            });
          };
        },
        { "../../util": 61, lodash: 92 },
      ],
      48: [
        function (require, module, exports) {
          exports.Property = function (node) {
            if (node.shorthand) node.shorthand = false;
          };
        },
        {},
      ],
      49: [
        function (require, module, exports) {
          var esutils = require("esutils");
          var t = require("../../types");
          var _ = require("lodash");
          exports.XJSIdentifier = function (node) {
            if (esutils.keyword.isIdentifierName(node.name)) {
              node.type = "Identifier";
            } else {
              return t.literal(node.name);
            }
          };
          exports.XJSNamespacedName = function (node, parent, file) {
            throw file.errorWithNode(
              node,
              "Namespace tags are not supported. ReactJSX is not XML."
            );
          };
          exports.XJSMemberExpression = {
            exit: function (node) {
              node.computed = t.isLiteral(node.property);
              node.type = "MemberExpression";
            },
          };
          exports.XJSExpressionContainer = function (node) {
            return node.expression;
          };
          exports.XJSAttribute = {
            exit: function (node) {
              var value = node.value || t.literal(true);
              return t.property("init", node.name, value);
            },
          };
          exports.XJSOpeningElement = {
            exit: function (node) {
              var tagExpr = node.name;
              var args = [];
              var tagName;
              if (t.isIdentifier(tagExpr)) {
                tagName = tagExpr.name;
              } else if (t.isLiteral(tagExpr)) {
                tagName = tagExpr.value;
              }
              if (
                tagName &&
                (/[a-z]/.exec(tagName[0]) || _.contains(tagName, "-"))
              ) {
                args.push(t.literal(tagName));
              } else {
                args.push(tagExpr);
              }
              var props = node.attributes;
              if (props.length) {
                var _props = [];
                var objs = [];
                var pushProps = function () {
                  if (!_props.length) return;
                  objs.push(t.objectExpression(_props));
                  _props = [];
                };
                while (props.length) {
                  var prop = props.shift();
                  if (t.isXJSSpreadAttribute(prop)) {
                    pushProps();
                    objs.push(prop.argument);
                  } else {
                    _props.push(prop);
                  }
                }
                pushProps();
                if (objs.length === 1) {
                  props = objs[0];
                } else {
                  if (!t.isObjectExpression(objs[0])) {
                    objs.unshift(t.objectExpression([]));
                  }
                  props = t.callExpression(
                    t.memberExpression(
                      t.identifier("React"),
                      t.identifier("__spread")
                    ),
                    objs
                  );
                }
              } else {
                props = t.literal(null);
              }
              args.push(props);
              tagExpr = t.memberExpression(
                t.identifier("React"),
                t.identifier("createElement")
              );
              return t.callExpression(tagExpr, args);
            },
          };
          exports.XJSElement = {
            exit: function (node) {
              var callExpr = node.openingElement;
              _.each(node.children, function (child) {
                if (t.isLiteral(child)) {
                  var lines = child.value.split(/\r\n|\n|\r/);
                  _.each(lines, function (line, i) {
                    var isFirstLine = i === 0;
                    var isLastLine = i === lines.length - 1;
                    var trimmedLine = line.replace(/\t/g, " ");
                    if (!isFirstLine) {
                      trimmedLine = trimmedLine.replace(/^[ ]+/, "");
                    }
                    if (!isLastLine) {
                      trimmedLine = trimmedLine.replace(/[ ]+$/, "");
                    }
                    if (trimmedLine) {
                      callExpr.arguments.push(t.literal(trimmedLine));
                    }
                  });
                  return;
                }
                callExpr.arguments.push(child);
              });
              return t.inherits(callExpr, node);
            },
          };
          var addDisplayName = function (id, call) {
            if (!call || !t.isCallExpression(call)) return;
            var callee = call.callee;
            if (!t.isMemberExpression(callee)) return;
            var obj = callee.object;
            if (!t.isIdentifier(obj, { name: "React" })) return;
            var prop = callee.property;
            if (!t.isIdentifier(prop, { name: "createClass" })) return;
            var args = call.arguments;
            if (args.length !== 1) return;
            var first = args[0];
            if (!t.isObjectExpression(first)) return;
            var props = first.properties;
            var safe = true;
            _.each(props, function (prop) {
              if (t.isIdentifier(prop.key, { name: "displayName" })) {
                return (safe = false);
              }
            });
            if (safe) {
              props.unshift(
                t.property("init", t.identifier("displayName"), t.literal(id))
              );
            }
          };
          exports.AssignmentExpression =
            exports.Property =
            exports.VariableDeclarator =
              function (node) {
                var left, right;
                if (t.isAssignmentExpression(node)) {
                  left = node.left;
                  right = node.right;
                } else if (t.isProperty(node)) {
                  left = node.key;
                  right = node.value;
                } else if (t.isVariableDeclarator(node)) {
                  left = node.id;
                  right = node.init;
                }
                if (t.isMemberExpression(left)) {
                  left = left.property;
                }
                if (t.isIdentifier(left)) {
                  addDisplayName(left.name, right);
                }
              };
        },
        { "../../types": 59, esutils: 91, lodash: 92 },
      ],
      50: [
        function (require, module, exports) {
          var util = require("../../util");
          var t = require("../../types");
          exports.Function = function (node, parent, file) {
            if (!node.rest) return;
            var rest = node.rest;
            delete node.rest;
            var templateName = "arguments-slice-assign";
            if (node.params.length) templateName += "-arg";
            t.ensureBlock(node);
            var template = util.template(templateName, {
              SLICE_KEY: file.addDeclaration("slice"),
              VARIABLE_NAME: rest,
              SLICE_ARG: t.literal(node.params.length),
            });
            template.declarations[0].init.arguments[0]._ignoreAliasFunctions = true;
            node.body.body.unshift(template);
          };
        },
        { "../../types": 59, "../../util": 61 },
      ],
      51: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          var getSpreadLiteral = function (spread) {
            var literal = spread.argument;
            if (!t.isArrayExpression(literal)) {
              literal = t.callExpression(
                t.memberExpression(t.identifier("Array"), t.identifier("from")),
                [literal]
              );
            }
            return literal;
          };
          var hasSpread = function (nodes) {
            var has = false;
            _.each(nodes, function (node) {
              if (t.isSpreadElement(node)) {
                has = true;
                return false;
              }
            });
            return has;
          };
          var build = function (props) {
            var nodes = [];
            var _props = [];
            var push = function () {
              if (!_props.length) return;
              nodes.push(t.arrayExpression(_props));
              _props = [];
            };
            _.each(props, function (prop) {
              if (t.isSpreadElement(prop)) {
                push();
                nodes.push(getSpreadLiteral(prop));
              } else {
                _props.push(prop);
              }
            });
            push();
            return nodes;
          };
          exports.ArrayExpression = function (node) {
            var elements = node.elements;
            if (!hasSpread(elements)) return;
            var nodes = build(elements);
            var first = nodes.shift();
            if (!nodes.length) return first;
            return t.callExpression(
              t.memberExpression(first, t.identifier("concat")),
              nodes
            );
          };
          exports.CallExpression = function (node) {
            var args = node.arguments;
            if (!hasSpread(args)) return;
            var contextLiteral = t.literal(null);
            node.arguments = [];
            var nodes = build(args);
            var first = nodes.shift();
            if (nodes.length) {
              node.arguments.push(
                t.callExpression(
                  t.memberExpression(first, t.identifier("concat")),
                  nodes
                )
              );
            } else {
              node.arguments.push(first);
            }
            var callee = node.callee;
            if (t.isMemberExpression(callee)) {
              contextLiteral = callee.object;
              if (callee.computed) {
                callee.object = t.memberExpression(
                  callee.object,
                  callee.property,
                  true
                );
                callee.property = t.identifier("apply");
                callee.computed = false;
              } else {
                callee.property = t.memberExpression(
                  callee.property,
                  t.identifier("apply")
                );
              }
            } else {
              node.callee = t.memberExpression(
                node.callee,
                t.identifier("apply")
              );
            }
            node.arguments.unshift(contextLiteral);
          };
          exports.NewExpression = function (node, parent, file) {
            var args = node.arguments;
            if (!hasSpread(args)) return;
            var nodes = build(args);
            var first = nodes.shift();
            if (nodes.length) {
              args = t.callExpression(
                t.memberExpression(first, t.identifier("concat")),
                nodes
              );
            } else {
              args = first;
            }
            return t.callExpression(file.addDeclaration("apply-constructor"), [
              node.callee,
              args,
            ]);
          };
        },
        { "../../types": 59, lodash: 92 },
      ],
      52: [
        function (require, module, exports) {
          var t = require("../../types");
          var _ = require("lodash");
          var buildBinaryExpression = function (left, right) {
            return t.binaryExpression("+", left, right);
          };
          exports.TaggedTemplateExpression = function (node, parent, file) {
            var args = [];
            var quasi = node.quasi;
            var strings = [];
            var raw = [];
            _.each(quasi.quasis, function (elem) {
              strings.push(t.literal(elem.value.cooked));
              raw.push(t.literal(elem.value.raw));
            });
            args.push(
              t.callExpression(file.addDeclaration("tagged-template-literal"), [
                t.arrayExpression(strings),
                t.arrayExpression(raw),
              ])
            );
            _.each(quasi.expressions, function (expr) {
              args.push(expr);
            });
            return t.callExpression(node.tag, args);
          };
          exports.TemplateLiteral = function (node) {
            var nodes = [];
            _.each(node.quasis, function (elem) {
              nodes.push(t.literal(elem.value.raw));
              var expr = node.expressions.shift();
              if (expr) {
                if (t.isBinary(expr)) expr = t.parenthesizedExpression(expr);
                nodes.push(expr);
              }
            });
            if (nodes.length > 1) {
              var last = _.last(nodes);
              if (t.isLiteral(last, { value: "" })) nodes.pop();
              var root = buildBinaryExpression(nodes.shift(), nodes.shift());
              _.each(nodes, function (node) {
                root = buildBinaryExpression(root, node);
              });
              return root;
            } else {
              return nodes[0];
            }
          };
        },
        { "../../types": 59, lodash: 92 },
      ],
      53: [
        function (require, module, exports) {
          var rewritePattern = require("regexpu/rewrite-pattern");
          var _ = require("lodash");
          exports.Literal = function (node) {
            var regex = node.regex;
            if (!regex) return;
            var flags = regex.flags.split("");
            if (!_.contains(regex.flags, "u")) return;
            _.pull(flags, "u");
            regex.pattern = rewritePattern(regex.pattern, regex.flags);
            regex.flags = flags.join("");
          };
        },
        { lodash: 92, "regexpu/rewrite-pattern": 113 },
      ],
      54: [
        function (require, module, exports) {
          var t = require("../../types");
          module.exports = function (ast) {
            var body = ast.program.body;
            var first = body[0];
            var noStrict =
              !first ||
              !t.isExpressionStatement(first) ||
              !t.isLiteral(first.expression) ||
              first.expression.value !== "use strict";
            if (noStrict) {
              body.unshift(t.expressionStatement(t.literal("use strict")));
            }
          };
        },
        { "../../types": 59 },
      ],
      55: [
        function (require, module, exports) {
          module.exports = traverse;
          var Scope = require("./scope");
          var t = require("../types");
          var _ = require("lodash");
          function traverse(parent, callbacks, opts) {
            if (!parent) return;
            if (_.isArray(parent)) {
              _.each(parent, function (node) {
                traverse(node, callbacks, opts);
              });
              return;
            }
            var keys = t.VISITOR_KEYS[parent.type];
            if (!keys) return;
            opts = opts || {};
            if (_.isArray(opts)) opts = { blacklist: opts };
            var blacklistTypes = opts.blacklist || [];
            if (_.isFunction(callbacks)) callbacks = { enter: callbacks };
            _.each(keys, function (key) {
              var nodes = parent[key];
              if (!nodes) return;
              var handle = function (obj, key) {
                var node = obj[key];
                if (!node) return;
                if (_.contains(blacklistTypes, node.type)) return;
                var maybeReplace = function (result) {
                  if (result === false) return;
                  if (result != null) node = obj[key] = result;
                };
                var opts2 = _.clone(opts);
                if (t.isScope(node)) opts2.scope = new Scope(opts.scope, node);
                if (callbacks.enter) {
                  var result = callbacks.enter(node, parent, opts2.scope);
                  maybeReplace(result);
                  if (result === false) return;
                }
                traverse(node, callbacks, opts2);
                if (callbacks.exit) {
                  maybeReplace(callbacks.exit(node, parent, opts2.scope));
                }
              };
              if (_.isArray(nodes)) {
                _.each(nodes, function (node, i) {
                  handle(nodes, i);
                });
                parent[key] = _.flatten(parent[key]);
              } else {
                handle(parent, key);
              }
            });
          }
          traverse.removeProperties = function (tree) {
            var clear = function (node) {
              delete node.extendedRange;
              delete node._scopeIds;
              delete node._parent;
              delete node.tokens;
              delete node.range;
              delete node.start;
              delete node.end;
              delete node.loc;
              delete node.raw;
              clearComments(node.trailingComments);
              clearComments(node.leadingComments);
            };
            var clearComments = function (comments) {
              _.each(comments, clear);
            };
            clear(tree);
            traverse(tree, clear);
            return tree;
          };
          traverse.hasType = function (tree, type, blacklistTypes) {
            blacklistTypes = [].concat(blacklistTypes || []);
            var has = false;
            if (_.contains(blacklistTypes, tree.type)) return false;
            if (tree.type === type) return true;
            traverse(
              tree,
              function (node) {
                if (node.type === type) {
                  has = true;
                  return false;
                }
              },
              { blacklist: blacklistTypes }
            );
            return has;
          };
        },
        { "../types": 59, "./scope": 56, lodash: 92 },
      ],
      56: [
        function (require, module, exports) {
          module.exports = Scope;
          var traverse = require("./index");
          var t = require("../types");
          var _ = require("lodash");
          var FOR_KEYS = ["left", "init"];
          function Scope(parent, block) {
            this.parent = parent;
            this.block = block;
            this.ids = this.getIds();
            this.getIds();
          }
          Scope.prototype.getIds = function () {
            var block = this.block;
            if (block._scopeIds) return block._scopeIds;
            var self = this;
            var ids = (block._scopeIds = {});
            if (t.isFor(block)) {
              _.each(FOR_KEYS, function (key) {
                var node = block[key];
                if (t.isLet(node)) self.add(node, ids);
              });
              block = block.body;
            }
            if (t.isBlockStatement(block) || t.isProgram(block)) {
              _.each(block.body, function (node) {
                if (t.isLet(node)) self.add(node, ids);
              });
            }
            if (t.isCatchClause(block)) {
              self.add(block.param, ids);
            }
            if (t.isProgram(block) || t.isFunction(block)) {
              traverse(block, function (node) {
                if (t.isFor(node)) {
                  _.each(FOR_KEYS, function (key) {
                    var declar = node[key];
                    if (t.isVar(declar)) self.add(declar, ids);
                  });
                }
                if (t.isFunction(node)) return false;
                if (t.isDeclaration(node) && !t.isLet(node)) {
                  self.add(node, ids);
                }
              });
            }
            if (t.isFunction(block)) {
              this.add(block.rest, ids);
              _.each(block.params, function (param) {
                self.add(param, ids);
              });
            }
            return ids;
          };
          Scope.prototype.add = function (node, ids) {
            if (!node) return;
            _.merge(ids || this.ids, t.getIds(node, true));
          };
          Scope.prototype.get = function (id) {
            return id && (this.getOwn(id) || this.parentGet(id));
          };
          Scope.prototype.getOwn = function (id) {
            return _.has(this.ids, id) && this.ids[id];
          };
          Scope.prototype.parentGet = function (id) {
            return this.parent && this.parent.get(id);
          };
          Scope.prototype.has = function (id) {
            return id && (this.hasOwn(id) || this.parentHas(id));
          };
          Scope.prototype.hasOwn = function (id) {
            return !!this.getOwn(id);
          };
          Scope.prototype.parentHas = function (id) {
            return this.parent && this.parent.has(id);
          };
        },
        { "../types": 59, "./index": 55, lodash: 92 },
      ],
      57: [
        function (require, module, exports) {
          module.exports = {
            ExpressionStatement: ["Statement"],
            BreakStatement: ["Statement"],
            ContinueStatement: ["Statement"],
            DebuggerStatement: ["Statement"],
            DoWhileStatement: ["Statement"],
            IfStatement: ["Statement"],
            ReturnStatement: ["Statement"],
            SwitchStatement: ["Statement"],
            ThrowStatement: ["Statement"],
            TryStatement: ["Statement"],
            WhileStatement: ["Statement"],
            WithStatement: ["Statement"],
            EmptyStatement: ["Statement"],
            LabeledStatement: ["Statement"],
            VariableDeclaration: ["Statement", "Declaration"],
            ExportDeclaration: ["Statement", "Declaration"],
            ImportDeclaration: ["Statement", "Declaration"],
            ArrowFunctionExpression: ["Scope", "Function"],
            FunctionDeclaration: [
              "Statement",
              "Declaration",
              "Scope",
              "Function",
            ],
            FunctionExpression: ["Scope", "Function"],
            BlockStatement: ["Statement", "Scope"],
            Program: ["Scope"],
            CatchClause: ["Scope"],
            LogicalExpression: ["Binary"],
            BinaryExpression: ["Binary"],
            UnaryExpression: ["UnaryLike"],
            SpreadProperty: ["UnaryLike"],
            SpreadElement: ["UnaryLike"],
            ClassDeclaration: ["Statement", "Declaration", "Class"],
            ClassExpression: ["Class"],
            ForOfStatement: ["Statement", "For", "Scope"],
            ForInStatement: ["Statement", "For", "Scope"],
            ForStatement: ["Statement", "For", "Scope"],
            ObjectPattern: ["Pattern"],
            ArrayPattern: ["Pattern"],
            Property: ["UserWhitespacable"],
            XJSElement: ["UserWhitespacable"],
          };
        },
        {},
      ],
      58: [
        function (require, module, exports) {
          module.exports = {
            ArrayExpression: ["elements"],
            AssignmentExpression: ["operator", "left", "right"],
            BinaryExpression: ["operator", "left", "right"],
            BlockStatement: ["body"],
            CallExpression: ["callee", "arguments"],
            ConditionalExpression: ["test", "consequent", "alternate"],
            ExpressionStatement: ["expression"],
            File: ["program", "comments", "tokens"],
            FunctionExpression: ["id", "params", "body", "generator"],
            Identifier: ["name"],
            IfStatement: ["test", "consequent", "alternate"],
            Literal: ["value"],
            MemberExpression: ["object", "property", "computed"],
            NewExpression: ["callee", "arguments"],
            ObjectExpression: ["properties"],
            ParenthesizedExpression: ["expression"],
            Program: ["body"],
            Property: ["kind", "key", "value", "computed"],
            ReturnStatement: ["argument"],
            SequenceExpression: ["expressions"],
            UnaryExpression: ["operator", "argument", "prefix"],
            VariableDeclaration: ["kind", "declarations"],
            VariableDeclarator: ["id", "init"],
          };
        },
        {},
      ],
      59: [
        function (require, module, exports) {
          var _ = require("lodash");
          var t = exports;
          t.VISITOR_KEYS = require("./visitor-keys");
          _.each(t.VISITOR_KEYS, function (keys, type) {
            t["is" + type] = function (node, opts) {
              return node && node.type === type && t.shallowEqual(node, opts);
            };
          });
          t.BUILDER_KEYS = _.defaults(
            require("./builder-keys"),
            t.VISITOR_KEYS
          );
          _.each(t.BUILDER_KEYS, function (keys, type) {
            t[type[0].toLowerCase() + type.slice(1)] = function () {
              var args = arguments;
              var node = { type: type };
              _.each(keys, function (key, i) {
                node[key] = args[i];
              });
              return node;
            };
          });
          t.ALIAS_KEYS = require("./alias-keys");
          var _aliases = {};
          _.each(t.ALIAS_KEYS, function (aliases, type) {
            _.each(aliases, function (alias) {
              var types = (_aliases[alias] = _aliases[alias] || []);
              types.push(type);
            });
          });
          _.each(_aliases, function (types, type) {
            t[type.toUpperCase() + "_TYPES"] = types;
            t["is" + type] = function (node, opts) {
              return (
                node &&
                _.contains(types, node.type) &&
                t.shallowEqual(node, opts)
              );
            };
          });
          t.shallowEqual = function (actual, expected) {
            var same = true;
            if (expected) {
              _.each(expected, function (val, key) {
                if (actual[key] !== val) {
                  return (same = false);
                }
              });
            }
            return same;
          };
          t.isReferenced = function (node, parent) {
            if (t.isProperty(parent) && parent.key === node) return false;
            var isMemberExpression = t.isMemberExpression(parent);
            var isComputedProperty =
              isMemberExpression && parent.property === node && parent.computed;
            var isObject = isMemberExpression && parent.object === node;
            if (!isMemberExpression || isComputedProperty || isObject)
              return true;
            return false;
          };
          t.toIdentifier = function (name) {
            if (t.isIdentifier(name)) return name.name;
            name = name.replace(/[^a-zA-Z0-9]/g, "-");
            name = name.replace(/^[-0-9]+/, "");
            name = name.replace(/[-_\s]+(.)?/g, function (match, c) {
              return c ? c.toUpperCase() : "";
            });
            return name;
          };
          t.ensureBlock = function (node) {
            node.body = t.toBlock(node.body, node);
          };
          t.toStatement = function (node, ignore) {
            if (t.isStatement(node)) {
              return node;
            }
            var mustHaveId = false;
            var newType;
            if (t.isClass(node)) {
              mustHaveId = true;
              newType = "ClassDeclaration";
            } else if (t.isFunction(node)) {
              mustHaveId = true;
              newType = "FunctionDeclaration";
            }
            if (mustHaveId && !node.id) {
              newType = false;
            }
            if (!newType) {
              if (ignore) {
                return false;
              } else {
                throw new Error("cannot turn " + node.type + " to a statement");
              }
            }
            node.type = newType;
            return node;
          };
          t.toBlock = function (node, parent) {
            if (t.isBlockStatement(node)) {
              return node;
            }
            if (!_.isArray(node)) {
              if (!t.isStatement(node)) {
                if (t.isFunction(parent)) {
                  node = t.returnStatement(node);
                } else {
                  node = t.expressionStatement(node);
                }
              }
              node = [node];
            }
            return t.blockStatement(node);
          };
          t.getIds = function (node, map, ignoreTypes) {
            ignoreTypes = ignoreTypes || [];
            var search = [node];
            var ids = {};
            while (search.length) {
              var id = search.shift();
              if (!id) continue;
              if (_.contains(ignoreTypes, id.type)) continue;
              var nodeKey = t.getIds.nodes[id.type];
              var arrKey = t.getIds.arrays[id.type];
              if (t.isIdentifier(id)) {
                ids[id.name] = id;
              } else if (nodeKey) {
                if (id[nodeKey]) search.push(id[nodeKey]);
              } else if (arrKey) {
                search = search.concat(id[arrKey] || []);
              }
            }
            if (!map) ids = _.keys(ids);
            return ids;
          };
          t.isLet = function (node) {
            return (
              t.isVariableDeclaration(node) &&
              (node.kind !== "var" || node._let)
            );
          };
          t.isVar = function (node) {
            return t.isVariableDeclaration(node, { kind: "var" }) && !node._let;
          };
          t.getIds.nodes = {
            AssignmentExpression: "left",
            ImportSpecifier: "id",
            ExportSpecifier: "id",
            VariableDeclarator: "id",
            FunctionDeclaration: "id",
            ClassDeclaration: "id",
            ParenthesizedExpression: "expression",
            MemeberExpression: "object",
            SpreadElement: "argument",
            Property: "value",
          };
          t.getIds.arrays = {
            ExportDeclaration: "specifiers",
            ImportDeclaration: "specifiers",
            VariableDeclaration: "declarations",
            ArrayPattern: "elements",
            ObjectPattern: "properties",
          };
          t.inherits = function (child, parent) {
            child.loc = parent.loc;
            child.end = parent.end;
            child.range = parent.range;
            child.start = parent.start;
            child.leadingComments = parent.leadingComments;
            child.trailingComments = parent.trailingComments;
            return child;
          };
          t.getSpecifierName = function (specifier) {
            return specifier.name || specifier.id;
          };
        },
        {
          "./alias-keys": 57,
          "./builder-keys": 58,
          "./visitor-keys": 60,
          lodash: 92,
        },
      ],
      60: [
        function (require, module, exports) {
          module.exports = {
            ArrayExpression: ["elements"],
            ArrayPattern: ["elements"],
            ArrowFunctionExpression: ["params", "defaults", "rest", "body"],
            AssignmentExpression: ["left", "right"],
            AwaitExpression: ["argument"],
            BinaryExpression: ["left", "right"],
            BlockStatement: ["body"],
            BreakStatement: ["label"],
            CallExpression: ["callee", "arguments"],
            CatchClause: ["param", "body"],
            ClassBody: ["body"],
            ClassDeclaration: ["id", "body", "superClass"],
            ClassExpression: ["id", "body", "superClass"],
            ComprehensionBlock: ["left", "right", "body"],
            ComprehensionExpression: ["filter", "blocks", "body"],
            ConditionalExpression: ["test", "consequent", "alternate"],
            ContinueStatement: ["label"],
            DebuggerStatement: [],
            DoWhileStatement: ["body", "test"],
            EmptyStatement: [],
            ExportBatchSpecifier: [],
            ExportDeclaration: ["declaration", "specifiers", "source"],
            ExportSpecifier: ["id", "name"],
            ExpressionStatement: ["expression"],
            File: ["program"],
            ForInStatement: ["left", "right", "body"],
            ForOfStatement: ["left", "right", "body"],
            ForStatement: ["init", "test", "update", "body"],
            FunctionDeclaration: ["id", "params", "defaults", "rest", "body"],
            FunctionExpression: ["id", "params", "defaults", "rest", "body"],
            Identifier: [],
            IfStatement: ["test", "consequent", "alternate"],
            ImportBatchSpecifier: ["id"],
            ImportDeclaration: ["specifiers", "source"],
            ImportSpecifier: ["id", "name"],
            LabeledStatement: ["label", "body"],
            Literal: [],
            LogicalExpression: ["left", "right"],
            MemberExpression: ["object", "property"],
            MethodDefinition: ["key", "value"],
            NewExpression: ["callee", "arguments"],
            ObjectExpression: ["properties"],
            ObjectPattern: ["properties"],
            ParenthesizedExpression: ["expression"],
            Program: ["body"],
            Property: ["key", "value"],
            ReturnStatement: ["argument"],
            SequenceExpression: ["expressions"],
            SpreadElement: ["argument"],
            SwitchCase: ["test", "consequent"],
            SwitchStatement: ["discriminant", "cases"],
            TaggedTemplateExpression: ["tag", "quasi"],
            TemplateElement: [],
            TemplateLiteral: ["quasis", "expressions"],
            ThisExpression: [],
            ThrowStatement: ["argument"],
            TryStatement: [
              "block",
              "handlers",
              "handler",
              "guardedHandlers",
              "finalizer",
            ],
            UnaryExpression: ["argument"],
            UpdateExpression: ["argument"],
            VariableDeclaration: ["declarations"],
            VariableDeclarator: ["id", "init"],
            WhileStatement: ["test", "body"],
            WithStatement: ["object", "body"],
            XJSAttribute: ["name", "value"],
            XJSClosingElement: ["name"],
            XJSElement: ["openingElement", "closingElement", "children"],
            XJSEmptyExpression: [],
            XJSExpressionContainer: ["expression"],
            XJSIdentifier: [],
            XJSMemberExpression: ["object", "property"],
            XJSNamespacedName: ["namespace", "name"],
            XJSOpeningElement: ["name", "attributes"],
            XJSSpreadAttribute: ["argument"],
            YieldExpression: ["argument"],
          };
        },
        {},
      ],
      61: [
        function (require, module, exports) {
          (function (Buffer, __dirname) {
            require("./patch");
            var estraverse = require("estraverse");
            var traverse = require("./traverse");
            var acorn = require("acorn-6to5");
            var path = require("path");
            var util = require("util");
            var fs = require("fs");
            var t = require("./types");
            var _ = require("lodash");
            exports.inherits = util.inherits;
            exports.canCompile = function (filename, altExts) {
              var exts = altExts || [".js", ".jsx", ".es6"];
              var ext = path.extname(filename);
              return _.contains(exts, ext);
            };
            exports.isInteger = function (i) {
              return _.isNumber(i) && i % 1 === 0;
            };
            exports.resolve = function (loc) {
              try {
                return require.resolve(loc);
              } catch (err) {
                return null;
              }
            };
            exports.trimRight = function (str) {
              return str.replace(/[\n\s]+$/g, "");
            };
            exports.list = function (val) {
              return val ? val.split(",") : [];
            };
            exports.getUid = function (parent, file) {
              var node;
              if (t.isAssignmentExpression(parent)) {
                node = parent.left;
              } else if (t.isVariableDeclarator(parent)) {
                node = parent.id;
              }
              var id = "ref";
              if (t.isIdentifier(node)) id = node.name;
              return t.identifier(file.generateUid(id));
            };
            exports.isAbsolute = function (loc) {
              if (!loc) return false;
              if (loc[0] === "/") return true;
              if (loc[1] === ":" && loc[2] === "\\") return true;
              return false;
            };
            exports.sourceMapToComment = function (map) {
              var json = JSON.stringify(map);
              var base64 = new Buffer(json).toString("base64");
              return (
                "//# sourceMappingURL=data:application/json;base64," + base64
              );
            };
            exports.pushMutatorMap = function (mutatorMap, key, kind, method) {
              var alias;
              if (t.isIdentifier(key)) {
                alias = key.name;
                if (method.computed) alias = "computed:" + alias;
              } else if (t.isLiteral(key)) {
                alias = String(key.value);
              } else {
                alias = JSON.stringify(
                  traverse.removeProperties(_.cloneDeep(key))
                );
              }
              var map;
              if (_.has(mutatorMap, alias)) {
                map = mutatorMap[alias];
              } else {
                map = {};
              }
              mutatorMap[alias] = map;
              map._key = key;
              if (method.computed) {
                map._computed = true;
              }
              map[kind] = method;
            };
            exports.buildDefineProperties = function (mutatorMap) {
              var objExpr = t.objectExpression([]);
              _.each(mutatorMap, function (map) {
                var mapNode = t.objectExpression([]);
                var propNode = t.property(
                  "init",
                  map._key,
                  mapNode,
                  map._computed
                );
                _.each(map, function (node, key) {
                  if (key[0] === "_") return;
                  node = _.clone(node);
                  if (t.isMethodDefinition(node)) node = node.value;
                  mapNode.properties.push(
                    t.property("init", t.identifier(key), node)
                  );
                });
                objExpr.properties.push(propNode);
              });
              return objExpr;
            };
            exports.template = function (name, nodes, keepExpression) {
              var template = exports.templates[name];
              if (!template)
                throw new ReferenceError("unknown template " + name);
              if (nodes === true) {
                keepExpression = true;
                nodes = null;
              }
              template = _.cloneDeep(template);
              if (!_.isEmpty(nodes)) {
                traverse(template, function (node) {
                  if (t.isIdentifier(node) && _.has(nodes, node.name)) {
                    var newNode = nodes[node.name];
                    if (_.isString(newNode)) {
                      node.name = newNode;
                    } else {
                      return newNode;
                    }
                  }
                });
              }
              var node = template.body[0];
              if (!keepExpression && t.isExpressionStatement(node)) {
                node = node.expression;
                if (t.isParenthesizedExpression(node)) node = node.expression;
              }
              return node;
            };
            exports.codeFrame = function (lines, lineNumber, colNumber) {
              colNumber = Math.max(colNumber, 0);
              lines = lines.split("\n");
              var start = Math.max(lineNumber - 3, 0);
              var end = Math.min(lines.length, lineNumber + 3);
              var width = (end + "").length;
              if (!lineNumber && !colNumber) {
                start = 0;
                end = lines.length;
              }
              return (
                "\n" +
                lines
                  .slice(start, end)
                  .map(function (line, i) {
                    var curr = i + start + 1;
                    var gutter = curr === lineNumber ? "> " : "  ";
                    var sep = curr + exports.repeat(width + 1);
                    gutter += sep + "| ";
                    var str = gutter + line;
                    if (colNumber && curr === lineNumber) {
                      str += "\n";
                      str += exports.repeat(gutter.length - 2);
                      str += "|" + exports.repeat(colNumber) + "^";
                    }
                    return str;
                  })
                  .join("\n")
              );
            };
            exports.repeat = function (width, cha) {
              cha = cha || " ";
              return new Array(width + 1).join(cha);
            };
            exports.parse = function (opts, code, callback) {
              try {
                var comments = [];
                var tokens = [];
                var ast = acorn.parse(code, {
                  allowReturnOutsideFunction: true,
                  preserveParens: true,
                  ecmaVersion: Infinity,
                  strictMode: true,
                  onComment: comments,
                  locations: true,
                  onToken: tokens,
                  ranges: true,
                });
                estraverse.attachComments(ast, comments, tokens);
                ast = t.file(ast, comments, tokens);
                traverse(ast, function (node, parent) {
                  node._parent = parent;
                });
                if (callback) {
                  return callback(ast);
                } else {
                  return ast;
                }
              } catch (err) {
                if (!err._6to5) {
                  err._6to5 = true;
                  var message = opts.filename + ": " + err.message;
                  var loc = err.loc;
                  if (loc) {
                    var frame = exports.codeFrame(code, loc.line, loc.column);
                    message += frame;
                  }
                  if (err.stack)
                    err.stack = err.stack.replace(err.message, message);
                  err.message = message;
                }
                throw err;
              }
            };
            exports.parseTemplate = function (loc, code) {
              var ast = exports.parse({ filename: loc }, code).program;
              return traverse.removeProperties(ast);
            };
            var loadTemplates = function () {
              var templates = {};
              var templatesLoc = __dirname + "/templates";
              if (!fs.existsSync(templatesLoc)) {
                throw new Error(
                  "no templates directory - this is most likely the " +
                    "result of a broken `npm publish`. Please report to " +
                    "https://githut.com/6to5/6to5/issues"
                );
              }
              _.each(fs.readdirSync(templatesLoc), function (name) {
                if (name[0] === ".") return;
                var key = path.basename(name, path.extname(name));
                var loc = templatesLoc + "/" + name;
                var code = fs.readFileSync(loc, "utf8");
                templates[key] = exports.parseTemplate(loc, code);
              });
              return templates;
            };
            try {
              exports.templates = require("../../templates.json");
            } catch (err) {
              if (err.code !== "MODULE_NOT_FOUND") throw err;
              Object.defineProperty(exports, "templates", {
                get: function () {
                  return (exports.templates = loadTemplates());
                },
              });
            }
          }.call(this, require("buffer").Buffer, "/lib/6to5"));
        },
        {
          "../../templates.json": 124,
          "./patch": 22,
          "./traverse": 55,
          "./types": 59,
          "acorn-6to5": 1,
          buffer: 78,
          estraverse: 87,
          fs: 76,
          lodash: 92,
          path: 83,
          util: 86,
        },
      ],
      62: [
        function (require, module, exports) {
          var types = require("../lib/types");
          var Type = types.Type;
          var def = Type.def;
          var or = Type.or;
          var builtin = types.builtInTypes;
          var isString = builtin.string;
          var isNumber = builtin.number;
          var isBoolean = builtin.boolean;
          var isRegExp = builtin.RegExp;
          var shared = require("../lib/shared");
          var defaults = shared.defaults;
          var geq = shared.geq;
          def("Node")
            .field("type", isString)
            .field(
              "loc",
              or(def("SourceLocation"), null),
              defaults["null"],
              true
            );
          def("SourceLocation")
            .build("start", "end", "source")
            .field("start", def("Position"))
            .field("end", def("Position"))
            .field("source", or(isString, null), defaults["null"]);
          def("Position")
            .build("line", "column")
            .field("line", geq(1))
            .field("column", geq(0));
          def("Program")
            .bases("Node")
            .build("body")
            .field("body", [def("Statement")]);
          def("Function")
            .bases("Node")
            .field("id", or(def("Identifier"), null), defaults["null"])
            .field("params", [def("Pattern")])
            .field("body", or(def("BlockStatement"), def("Expression")));
          def("Statement").bases("Node");
          def("EmptyStatement").bases("Statement").build();
          def("BlockStatement")
            .bases("Statement")
            .build("body")
            .field("body", [def("Statement")]);
          def("ExpressionStatement")
            .bases("Statement")
            .build("expression")
            .field("expression", def("Expression"));
          def("IfStatement")
            .bases("Statement")
            .build("test", "consequent", "alternate")
            .field("test", def("Expression"))
            .field("consequent", def("Statement"))
            .field("alternate", or(def("Statement"), null), defaults["null"]);
          def("LabeledStatement")
            .bases("Statement")
            .build("label", "body")
            .field("label", def("Identifier"))
            .field("body", def("Statement"));
          def("BreakStatement")
            .bases("Statement")
            .build("label")
            .field("label", or(def("Identifier"), null), defaults["null"]);
          def("ContinueStatement")
            .bases("Statement")
            .build("label")
            .field("label", or(def("Identifier"), null), defaults["null"]);
          def("WithStatement")
            .bases("Statement")
            .build("object", "body")
            .field("object", def("Expression"))
            .field("body", def("Statement"));
          def("SwitchStatement")
            .bases("Statement")
            .build("discriminant", "cases", "lexical")
            .field("discriminant", def("Expression"))
            .field("cases", [def("SwitchCase")])
            .field("lexical", isBoolean, defaults["false"]);
          def("ReturnStatement")
            .bases("Statement")
            .build("argument")
            .field("argument", or(def("Expression"), null));
          def("ThrowStatement")
            .bases("Statement")
            .build("argument")
            .field("argument", def("Expression"));
          def("TryStatement")
            .bases("Statement")
            .build("block", "handler", "finalizer")
            .field("block", def("BlockStatement"))
            .field("handler", or(def("CatchClause"), null), function () {
              return (this.handlers && this.handlers[0]) || null;
            })
            .field(
              "handlers",
              [def("CatchClause")],
              function () {
                return this.handler ? [this.handler] : [];
              },
              true
            )
            .field("guardedHandlers", [def("CatchClause")], defaults.emptyArray)
            .field(
              "finalizer",
              or(def("BlockStatement"), null),
              defaults["null"]
            );
          def("CatchClause")
            .bases("Node")
            .build("param", "guard", "body")
            .field("param", def("Pattern"))
            .field("guard", or(def("Expression"), null), defaults["null"])
            .field("body", def("BlockStatement"));
          def("WhileStatement")
            .bases("Statement")
            .build("test", "body")
            .field("test", def("Expression"))
            .field("body", def("Statement"));
          def("DoWhileStatement")
            .bases("Statement")
            .build("body", "test")
            .field("body", def("Statement"))
            .field("test", def("Expression"));
          def("ForStatement")
            .bases("Statement")
            .build("init", "test", "update", "body")
            .field(
              "init",
              or(def("VariableDeclaration"), def("Expression"), null)
            )
            .field("test", or(def("Expression"), null))
            .field("update", or(def("Expression"), null))
            .field("body", def("Statement"));
          def("ForInStatement")
            .bases("Statement")
            .build("left", "right", "body", "each")
            .field("left", or(def("VariableDeclaration"), def("Expression")))
            .field("right", def("Expression"))
            .field("body", def("Statement"))
            .field("each", isBoolean);
          def("DebuggerStatement").bases("Statement").build();
          def("Declaration").bases("Statement");
          def("FunctionDeclaration")
            .bases("Function", "Declaration")
            .build("id", "params", "body")
            .field("id", def("Identifier"));
          def("FunctionExpression")
            .bases("Function", "Expression")
            .build("id", "params", "body");
          def("VariableDeclaration")
            .bases("Declaration")
            .build("kind", "declarations")
            .field("kind", or("var", "let", "const"))
            .field("declarations", [
              or(def("VariableDeclarator"), def("Identifier")),
            ]);
          def("VariableDeclarator")
            .bases("Node")
            .build("id", "init")
            .field("id", def("Pattern"))
            .field("init", or(def("Expression"), null));
          def("Expression").bases("Node", "Pattern");
          def("ThisExpression").bases("Expression").build();
          def("ArrayExpression")
            .bases("Expression")
            .build("elements")
            .field("elements", [or(def("Expression"), null)]);
          def("ObjectExpression")
            .bases("Expression")
            .build("properties")
            .field("properties", [def("Property")]);
          def("Property")
            .bases("Node")
            .build("kind", "key", "value")
            .field("kind", or("init", "get", "set"))
            .field("key", or(def("Literal"), def("Identifier")))
            .field("value", def("Expression"));
          def("SequenceExpression")
            .bases("Expression")
            .build("expressions")
            .field("expressions", [def("Expression")]);
          var UnaryOperator = or(
            "-",
            "+",
            "!",
            "~",
            "typeof",
            "void",
            "delete"
          );
          def("UnaryExpression")
            .bases("Expression")
            .build("operator", "argument", "prefix")
            .field("operator", UnaryOperator)
            .field("argument", def("Expression"))
            .field("prefix", isBoolean, defaults["true"]);
          var BinaryOperator = or(
            "==",
            "!=",
            "===",
            "!==",
            "<",
            "<=",
            ">",
            ">=",
            "<<",
            ">>",
            ">>>",
            "+",
            "-",
            "*",
            "/",
            "%",
            "&",
            "|",
            "^",
            "in",
            "instanceof",
            ".."
          );
          def("BinaryExpression")
            .bases("Expression")
            .build("operator", "left", "right")
            .field("operator", BinaryOperator)
            .field("left", def("Expression"))
            .field("right", def("Expression"));
          var AssignmentOperator = or(
            "=",
            "+=",
            "-=",
            "*=",
            "/=",
            "%=",
            "<<=",
            ">>=",
            ">>>=",
            "|=",
            "^=",
            "&="
          );
          def("AssignmentExpression")
            .bases("Expression")
            .build("operator", "left", "right")
            .field("operator", AssignmentOperator)
            .field("left", def("Pattern"))
            .field("right", def("Expression"));
          var UpdateOperator = or("++", "--");
          def("UpdateExpression")
            .bases("Expression")
            .build("operator", "argument", "prefix")
            .field("operator", UpdateOperator)
            .field("argument", def("Expression"))
            .field("prefix", isBoolean);
          var LogicalOperator = or("||", "&&");
          def("LogicalExpression")
            .bases("Expression")
            .build("operator", "left", "right")
            .field("operator", LogicalOperator)
            .field("left", def("Expression"))
            .field("right", def("Expression"));
          def("ConditionalExpression")
            .bases("Expression")
            .build("test", "consequent", "alternate")
            .field("test", def("Expression"))
            .field("consequent", def("Expression"))
            .field("alternate", def("Expression"));
          def("NewExpression")
            .bases("Expression")
            .build("callee", "arguments")
            .field("callee", def("Expression"))
            .field("arguments", [def("Expression")]);
          def("CallExpression")
            .bases("Expression")
            .build("callee", "arguments")
            .field("callee", def("Expression"))
            .field("arguments", [def("Expression")]);
          def("MemberExpression")
            .bases("Expression")
            .build("object", "property", "computed")
            .field("object", def("Expression"))
            .field("property", or(def("Identifier"), def("Expression")))
            .field("computed", isBoolean);
          def("Pattern").bases("Node");
          def("ObjectPattern")
            .bases("Pattern")
            .build("properties")
            .field("properties", [def("PropertyPattern")]);
          def("PropertyPattern")
            .bases("Pattern")
            .build("key", "pattern")
            .field("key", or(def("Literal"), def("Identifier")))
            .field("pattern", def("Pattern"));
          def("ArrayPattern")
            .bases("Pattern")
            .build("elements")
            .field("elements", [or(def("Pattern"), null)]);
          def("SwitchCase")
            .bases("Node")
            .build("test", "consequent")
            .field("test", or(def("Expression"), null))
            .field("consequent", [def("Statement")]);
          def("Identifier")
            .bases("Node", "Expression", "Pattern")
            .build("name")
            .field("name", isString);
          def("Literal")
            .bases("Node", "Expression")
            .build("value")
            .field("value", or(isString, isBoolean, null, isNumber, isRegExp));
        },
        { "../lib/shared": 73, "../lib/types": 74 },
      ],
      63: [
        function (require, module, exports) {
          require("./core");
          var types = require("../lib/types");
          var def = types.Type.def;
          var or = types.Type.or;
          var builtin = types.builtInTypes;
          var isString = builtin.string;
          var isBoolean = builtin.boolean;
          def("XMLDefaultDeclaration")
            .bases("Declaration")
            .field("namespace", def("Expression"));
          def("XMLAnyName").bases("Expression");
          def("XMLQualifiedIdentifier")
            .bases("Expression")
            .field("left", or(def("Identifier"), def("XMLAnyName")))
            .field("right", or(def("Identifier"), def("Expression")))
            .field("computed", isBoolean);
          def("XMLFunctionQualifiedIdentifier")
            .bases("Expression")
            .field("right", or(def("Identifier"), def("Expression")))
            .field("computed", isBoolean);
          def("XMLAttributeSelector")
            .bases("Expression")
            .field("attribute", def("Expression"));
          def("XMLFilterExpression")
            .bases("Expression")
            .field("left", def("Expression"))
            .field("right", def("Expression"));
          def("XMLElement")
            .bases("XML", "Expression")
            .field("contents", [def("XML")]);
          def("XMLList")
            .bases("XML", "Expression")
            .field("contents", [def("XML")]);
          def("XML").bases("Node");
          def("XMLEscape").bases("XML").field("expression", def("Expression"));
          def("XMLText").bases("XML").field("text", isString);
          def("XMLStartTag")
            .bases("XML")
            .field("contents", [def("XML")]);
          def("XMLEndTag")
            .bases("XML")
            .field("contents", [def("XML")]);
          def("XMLPointTag")
            .bases("XML")
            .field("contents", [def("XML")]);
          def("XMLName")
            .bases("XML")
            .field("contents", or(isString, [def("XML")]));
          def("XMLAttribute").bases("XML").field("value", isString);
          def("XMLCdata").bases("XML").field("contents", isString);
          def("XMLComment").bases("XML").field("contents", isString);
          def("XMLProcessingInstruction")
            .bases("XML")
            .field("target", isString)
            .field("contents", or(isString, null));
        },
        { "../lib/types": 74, "./core": 62 },
      ],
      64: [
        function (require, module, exports) {
          require("./core");
          var types = require("../lib/types");
          var def = types.Type.def;
          var or = types.Type.or;
          var builtin = types.builtInTypes;
          var isBoolean = builtin.boolean;
          var isObject = builtin.object;
          var isString = builtin.string;
          var defaults = require("../lib/shared").defaults;
          def("Function")
            .field("generator", isBoolean, defaults["false"])
            .field("expression", isBoolean, defaults["false"])
            .field(
              "defaults",
              [or(def("Expression"), null)],
              defaults.emptyArray
            )
            .field("rest", or(def("Identifier"), null), defaults["null"]);
          def("FunctionDeclaration").build(
            "id",
            "params",
            "body",
            "generator",
            "expression"
          );
          def("FunctionExpression").build(
            "id",
            "params",
            "body",
            "generator",
            "expression"
          );
          def("ArrowFunctionExpression")
            .bases("Function", "Expression")
            .build("params", "body", "expression")
            .field("id", null, defaults["null"])
            .field("generator", false);
          def("YieldExpression")
            .bases("Expression")
            .build("argument", "delegate")
            .field("argument", or(def("Expression"), null))
            .field("delegate", isBoolean, defaults["false"]);
          def("GeneratorExpression")
            .bases("Expression")
            .build("body", "blocks", "filter")
            .field("body", def("Expression"))
            .field("blocks", [def("ComprehensionBlock")])
            .field("filter", or(def("Expression"), null));
          def("ComprehensionExpression")
            .bases("Expression")
            .build("body", "blocks", "filter")
            .field("body", def("Expression"))
            .field("blocks", [def("ComprehensionBlock")])
            .field("filter", or(def("Expression"), null));
          def("ComprehensionBlock")
            .bases("Node")
            .build("left", "right", "each")
            .field("left", def("Pattern"))
            .field("right", def("Expression"))
            .field("each", isBoolean);
          def("ModuleSpecifier")
            .bases("Literal")
            .build("value")
            .field("value", isString);
          def("Property")
            .field("method", isBoolean, defaults["false"])
            .field("shorthand", isBoolean, defaults["false"])
            .field("computed", isBoolean, defaults["false"]);
          def("MethodDefinition")
            .bases("Declaration")
            .build("kind", "key", "value")
            .field("kind", or("init", "get", "set", ""))
            .field("key", or(def("Literal"), def("Identifier")))
            .field("value", def("Function"));
          def("SpreadElement")
            .bases("Node")
            .build("argument")
            .field("argument", def("Expression"));
          def("ArrayExpression").field("elements", [
            or(def("Expression"), def("SpreadElement"), null),
          ]);
          def("NewExpression").field("arguments", [
            or(def("Expression"), def("SpreadElement")),
          ]);
          def("CallExpression").field("arguments", [
            or(def("Expression"), def("SpreadElement")),
          ]);
          def("SpreadElementPattern")
            .bases("Pattern")
            .build("argument")
            .field("argument", def("Pattern"));
          var ClassBodyElement = or(
            def("MethodDefinition"),
            def("VariableDeclarator"),
            def("ClassPropertyDefinition"),
            def("ClassProperty")
          );
          def("ClassProperty")
            .bases("Declaration")
            .build("id")
            .field("id", def("Identifier"));
          def("ClassPropertyDefinition")
            .bases("Declaration")
            .build("definition")
            .field("definition", ClassBodyElement);
          def("ClassBody")
            .bases("Declaration")
            .build("body")
            .field("body", [ClassBodyElement]);
          def("ClassDeclaration")
            .bases("Declaration")
            .build("id", "body", "superClass")
            .field("id", def("Identifier"))
            .field("body", def("ClassBody"))
            .field("superClass", or(def("Expression"), null), defaults["null"]);
          def("ClassExpression")
            .bases("Expression")
            .build("id", "body", "superClass")
            .field("id", or(def("Identifier"), null), defaults["null"])
            .field("body", def("ClassBody"))
            .field("superClass", or(def("Expression"), null), defaults["null"]);
          def("Specifier").bases("Node");
          def("NamedSpecifier")
            .bases("Specifier")
            .field("id", def("Identifier"))
            .field("name", or(def("Identifier"), null), defaults["null"]);
          def("ExportSpecifier").bases("NamedSpecifier").build("id", "name");
          def("ExportBatchSpecifier").bases("Specifier").build();
          def("ImportSpecifier").bases("NamedSpecifier").build("id", "name");
          def("ImportNamespaceSpecifier")
            .bases("Specifier")
            .build("id")
            .field("id", def("Identifier"));
          def("ImportDefaultSpecifier")
            .bases("Specifier")
            .build("id")
            .field("id", def("Identifier"));
          def("ExportDeclaration")
            .bases("Declaration")
            .build("default", "declaration", "specifiers", "source")
            .field("default", isBoolean)
            .field(
              "declaration",
              or(def("Declaration"), def("Expression"), null)
            )
            .field(
              "specifiers",
              [or(def("ExportSpecifier"), def("ExportBatchSpecifier"))],
              defaults.emptyArray
            )
            .field(
              "source",
              or(def("ModuleSpecifier"), null),
              defaults["null"]
            );
          def("ImportDeclaration")
            .bases("Declaration")
            .build("specifiers", "source")
            .field(
              "specifiers",
              [
                or(
                  def("ImportSpecifier"),
                  def("ImportNamespaceSpecifier"),
                  def("ImportDefaultSpecifier")
                ),
              ],
              defaults.emptyArray
            )
            .field("source", def("ModuleSpecifier"));
          def("TaggedTemplateExpression")
            .bases("Expression")
            .field("tag", def("Expression"))
            .field("quasi", def("TemplateLiteral"));
          def("TemplateLiteral")
            .bases("Expression")
            .build("quasis", "expressions")
            .field("quasis", [def("TemplateElement")])
            .field("expressions", [def("Expression")]);
          def("TemplateElement")
            .bases("Node")
            .build("value", "tail")
            .field("value", { cooked: isString, raw: isString })
            .field("tail", isBoolean);
        },
        { "../lib/shared": 73, "../lib/types": 74, "./core": 62 },
      ],
      65: [
        function (require, module, exports) {
          require("./core");
          var types = require("../lib/types");
          var def = types.Type.def;
          var or = types.Type.or;
          var builtin = types.builtInTypes;
          var isBoolean = builtin.boolean;
          var defaults = require("../lib/shared").defaults;
          def("Function").field("async", isBoolean, defaults["false"]);
          def("SpreadProperty")
            .bases("Node")
            .build("argument")
            .field("argument", def("Expression"));
          def("ObjectExpression").field("properties", [
            or(def("Property"), def("SpreadProperty")),
          ]);
          def("SpreadPropertyPattern")
            .bases("Pattern")
            .build("argument")
            .field("argument", def("Pattern"));
          def("ObjectPattern").field("properties", [
            or(def("PropertyPattern"), def("SpreadPropertyPattern")),
          ]);
          def("AwaitExpression")
            .bases("Expression")
            .build("argument", "all")
            .field("argument", or(def("Expression"), null))
            .field("all", isBoolean, defaults["false"]);
        },
        { "../lib/shared": 73, "../lib/types": 74, "./core": 62 },
      ],
      66: [
        function (require, module, exports) {
          require("./core");
          var types = require("../lib/types");
          var def = types.Type.def;
          var or = types.Type.or;
          var builtin = types.builtInTypes;
          var isString = builtin.string;
          var isBoolean = builtin.boolean;
          var defaults = require("../lib/shared").defaults;
          def("XJSAttribute")
            .bases("Node")
            .build("name", "value")
            .field("name", or(def("XJSIdentifier"), def("XJSNamespacedName")))
            .field(
              "value",
              or(def("Literal"), def("XJSExpressionContainer"), null),
              defaults["null"]
            );
          def("XJSIdentifier")
            .bases("Node")
            .build("name")
            .field("name", isString);
          def("XJSNamespacedName")
            .bases("Node")
            .build("namespace", "name")
            .field("namespace", def("XJSIdentifier"))
            .field("name", def("XJSIdentifier"));
          def("XJSMemberExpression")
            .bases("MemberExpression")
            .build("object", "property")
            .field(
              "object",
              or(def("XJSIdentifier"), def("XJSMemberExpression"))
            )
            .field("property", def("XJSIdentifier"))
            .field("computed", isBoolean, defaults.false);
          var XJSElementName = or(
            def("XJSIdentifier"),
            def("XJSNamespacedName"),
            def("XJSMemberExpression")
          );
          def("XJSSpreadAttribute")
            .bases("Node")
            .build("argument")
            .field("argument", def("Expression"));
          var XJSAttributes = [
            or(def("XJSAttribute"), def("XJSSpreadAttribute")),
          ];
          def("XJSExpressionContainer")
            .bases("Expression")
            .build("expression")
            .field("expression", def("Expression"));
          def("XJSElement")
            .bases("Expression")
            .build("openingElement", "closingElement", "children")
            .field("openingElement", def("XJSOpeningElement"))
            .field(
              "closingElement",
              or(def("XJSClosingElement"), null),
              defaults["null"]
            )
            .field(
              "children",
              [
                or(
                  def("XJSElement"),
                  def("XJSExpressionContainer"),
                  def("XJSText"),
                  def("Literal")
                ),
              ],
              defaults.emptyArray
            )
            .field("name", XJSElementName, function () {
              return this.openingElement.name;
            })
            .field("selfClosing", isBoolean, function () {
              return this.openingElement.selfClosing;
            })
            .field("attributes", XJSAttributes, function () {
              return this.openingElement.attributes;
            });
          def("XJSOpeningElement")
            .bases("Node")
            .build("name", "attributes", "selfClosing")
            .field("name", XJSElementName)
            .field("attributes", XJSAttributes, defaults.emptyArray)
            .field("selfClosing", isBoolean, defaults["false"]);
          def("XJSClosingElement")
            .bases("Node")
            .build("name")
            .field("name", XJSElementName);
          def("XJSText")
            .bases("Literal")
            .build("value")
            .field("value", isString);
          def("XJSEmptyExpression").bases("Expression").build();
          def("TypeAnnotatedIdentifier")
            .bases("Pattern")
            .build("annotation", "identifier")
            .field("annotation", def("TypeAnnotation"))
            .field("identifier", def("Identifier"));
          def("TypeAnnotation")
            .bases("Pattern")
            .build(
              "annotatedType",
              "templateTypes",
              "paramTypes",
              "returnType",
              "unionType",
              "nullable"
            )
            .field("annotatedType", def("Identifier"))
            .field("templateTypes", or([def("TypeAnnotation")], null))
            .field("paramTypes", or([def("TypeAnnotation")], null))
            .field("returnType", or(def("TypeAnnotation"), null))
            .field("unionType", or(def("TypeAnnotation"), null))
            .field("nullable", isBoolean);
          def("Identifier").field(
            "annotation",
            or(def("TypeAnnotation"), null),
            defaults["null"]
          );
          def("Function").field(
            "returnType",
            or(def("TypeAnnotation"), null),
            defaults["null"]
          );
          def("ClassProperty").field(
            "id",
            or(def("Identifier"), def("TypeAnnotatedIdentifier"))
          );
        },
        { "../lib/shared": 73, "../lib/types": 74, "./core": 62 },
      ],
      67: [
        function (require, module, exports) {
          require("./core");
          var types = require("../lib/types");
          var def = types.Type.def;
          var or = types.Type.or;
          var geq = require("../lib/shared").geq;
          def("ForOfStatement")
            .bases("Statement")
            .build("left", "right", "body")
            .field("left", or(def("VariableDeclaration"), def("Expression")))
            .field("right", def("Expression"))
            .field("body", def("Statement"));
          def("LetStatement")
            .bases("Statement")
            .build("head", "body")
            .field("head", [def("VariableDeclarator")])
            .field("body", def("Statement"));
          def("LetExpression")
            .bases("Expression")
            .build("head", "body")
            .field("head", [def("VariableDeclarator")])
            .field("body", def("Expression"));
          def("GraphExpression")
            .bases("Expression")
            .build("index", "expression")
            .field("index", geq(0))
            .field("expression", def("Literal"));
          def("GraphIndexExpression")
            .bases("Expression")
            .build("index")
            .field("index", geq(0));
        },
        { "../lib/shared": 73, "../lib/types": 74, "./core": 62 },
      ],
      68: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("../main");
          var getFieldNames = types.getFieldNames;
          var getFieldValue = types.getFieldValue;
          var isArray = types.builtInTypes.array;
          var isObject = types.builtInTypes.object;
          var isDate = types.builtInTypes.Date;
          var isRegExp = types.builtInTypes.RegExp;
          var hasOwn = Object.prototype.hasOwnProperty;
          function astNodesAreEquivalent(a, b, problemPath) {
            if (isArray.check(problemPath)) {
              problemPath.length = 0;
            } else {
              problemPath = null;
            }
            return areEquivalent(a, b, problemPath);
          }
          astNodesAreEquivalent.assert = function (a, b) {
            var problemPath = [];
            if (!astNodesAreEquivalent(a, b, problemPath)) {
              if (problemPath.length === 0) {
                assert.strictEqual(a, b);
              } else {
                assert.ok(
                  false,
                  "Nodes differ in the following path: " +
                    problemPath.map(subscriptForProperty).join("")
                );
              }
            }
          };
          function subscriptForProperty(property) {
            if (/[_$a-z][_$a-z0-9]*/i.test(property)) {
              return "." + property;
            }
            return "[" + JSON.stringify(property) + "]";
          }
          function areEquivalent(a, b, problemPath) {
            if (a === b) {
              return true;
            }
            if (isArray.check(a)) {
              return arraysAreEquivalent(a, b, problemPath);
            }
            if (isObject.check(a)) {
              return objectsAreEquivalent(a, b, problemPath);
            }
            if (isDate.check(a)) {
              return isDate.check(b) && +a === +b;
            }
            if (isRegExp.check(a)) {
              return (
                isRegExp.check(b) &&
                a.source === b.source &&
                a.global === b.global &&
                a.multiline === b.multiline &&
                a.ignoreCase === b.ignoreCase
              );
            }
            return a == b;
          }
          function arraysAreEquivalent(a, b, problemPath) {
            isArray.assert(a);
            var aLength = a.length;
            if (!isArray.check(b) || b.length !== aLength) {
              if (problemPath) {
                problemPath.push("length");
              }
              return false;
            }
            for (var i = 0; i < aLength; ++i) {
              if (problemPath) {
                problemPath.push(i);
              }
              if (i in a !== i in b) {
                return false;
              }
              if (!areEquivalent(a[i], b[i], problemPath)) {
                return false;
              }
              if (problemPath) {
                assert.strictEqual(problemPath.pop(), i);
              }
            }
            return true;
          }
          function objectsAreEquivalent(a, b, problemPath) {
            isObject.assert(a);
            if (!isObject.check(b)) {
              return false;
            }
            if (a.type !== b.type) {
              if (problemPath) {
                problemPath.push("type");
              }
              return false;
            }
            var aNames = getFieldNames(a);
            var aNameCount = aNames.length;
            var bNames = getFieldNames(b);
            var bNameCount = bNames.length;
            if (aNameCount === bNameCount) {
              for (var i = 0; i < aNameCount; ++i) {
                var name = aNames[i];
                var aChild = getFieldValue(a, name);
                var bChild = getFieldValue(b, name);
                if (problemPath) {
                  problemPath.push(name);
                }
                if (!areEquivalent(aChild, bChild, problemPath)) {
                  return false;
                }
                if (problemPath) {
                  assert.strictEqual(problemPath.pop(), name);
                }
              }
              return true;
            }
            if (!problemPath) {
              return false;
            }
            var seenNames = Object.create(null);
            for (i = 0; i < aNameCount; ++i) {
              seenNames[aNames[i]] = true;
            }
            for (i = 0; i < bNameCount; ++i) {
              name = bNames[i];
              if (!hasOwn.call(seenNames, name)) {
                problemPath.push(name);
                return false;
              }
              delete seenNames[name];
            }
            for (name in seenNames) {
              problemPath.push(name);
              break;
            }
            return false;
          }
          module.exports = astNodesAreEquivalent;
        },
        { "../main": 75, assert: 77 },
      ],
      69: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("./types");
          var n = types.namedTypes;
          var isNumber = types.builtInTypes.number;
          var isArray = types.builtInTypes.array;
          var Path = require("./path");
          var Scope = require("./scope");
          function NodePath(value, parentPath, name) {
            assert.ok(this instanceof NodePath);
            Path.call(this, value, parentPath, name);
          }
          require("util").inherits(NodePath, Path);
          var NPp = NodePath.prototype;
          Object.defineProperties(NPp, {
            node: {
              get: function () {
                Object.defineProperty(this, "node", {
                  configurable: true,
                  value: this._computeNode(),
                });
                return this.node;
              },
            },
            parent: {
              get: function () {
                Object.defineProperty(this, "parent", {
                  configurable: true,
                  value: this._computeParent(),
                });
                return this.parent;
              },
            },
            scope: {
              get: function () {
                Object.defineProperty(this, "scope", {
                  configurable: true,
                  value: this._computeScope(),
                });
                return this.scope;
              },
            },
          });
          NPp.replace = function () {
            delete this.node;
            delete this.parent;
            delete this.scope;
            return Path.prototype.replace.apply(this, arguments);
          };
          NPp.prune = function () {
            var remainingNodePath = this.parent;
            this.replace();
            if (n.VariableDeclaration.check(remainingNodePath.node)) {
              var declarations = remainingNodePath.get("declarations").value;
              if (!declarations || declarations.length === 0) {
                return remainingNodePath.prune();
              }
            } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
              if (!remainingNodePath.get("expression").value) {
                return remainingNodePath.prune();
              }
            }
            return remainingNodePath;
          };
          NPp._computeNode = function () {
            var value = this.value;
            if (n.Node.check(value)) {
              return value;
            }
            var pp = this.parentPath;
            return (pp && pp.node) || null;
          };
          NPp._computeParent = function () {
            var value = this.value;
            var pp = this.parentPath;
            if (!n.Node.check(value)) {
              while (pp && !n.Node.check(pp.value)) {
                pp = pp.parentPath;
              }
              if (pp) {
                pp = pp.parentPath;
              }
            }
            while (pp && !n.Node.check(pp.value)) {
              pp = pp.parentPath;
            }
            return pp || null;
          };
          NPp._computeScope = function () {
            var value = this.value;
            var pp = this.parentPath;
            var scope = pp && pp.scope;
            if (n.Node.check(value) && Scope.isEstablishedBy(value)) {
              scope = new Scope(this, scope);
            }
            return scope || null;
          };
          NPp.getValueProperty = function (name) {
            return types.getFieldValue(this.value, name);
          };
          NPp.needsParens = function (assumeExpressionContext) {
            if (!this.parent) return false;
            var node = this.node;
            if (node !== this.value) return false;
            var parent = this.parent.node;
            assert.notStrictEqual(node, parent);
            if (!n.Expression.check(node)) return false;
            if (isUnaryLike(node))
              return (
                n.MemberExpression.check(parent) &&
                this.name === "object" &&
                parent.object === node
              );
            if (isBinary(node)) {
              if (n.CallExpression.check(parent) && this.name === "callee") {
                assert.strictEqual(parent.callee, node);
                return true;
              }
              if (isUnaryLike(parent)) return true;
              if (n.MemberExpression.check(parent) && this.name === "object") {
                assert.strictEqual(parent.object, node);
                return true;
              }
              if (isBinary(parent)) {
                var po = parent.operator;
                var pp = PRECEDENCE[po];
                var no = node.operator;
                var np = PRECEDENCE[no];
                if (pp > np) {
                  return true;
                }
                if (pp === np && this.name === "right") {
                  assert.strictEqual(parent.right, node);
                  return true;
                }
              }
            }
            if (n.SequenceExpression.check(node)) {
              if (n.ForStatement.check(parent)) {
                return false;
              }
              if (
                n.ExpressionStatement.check(parent) &&
                this.name === "expression"
              ) {
                return false;
              }
              return true;
            }
            if (n.YieldExpression.check(node))
              return (
                isBinary(parent) ||
                n.CallExpression.check(parent) ||
                n.MemberExpression.check(parent) ||
                n.NewExpression.check(parent) ||
                n.ConditionalExpression.check(parent) ||
                isUnaryLike(parent) ||
                n.YieldExpression.check(parent)
              );
            if (n.NewExpression.check(parent) && this.name === "callee") {
              assert.strictEqual(parent.callee, node);
              return containsCallExpression(node);
            }
            if (
              n.Literal.check(node) &&
              isNumber.check(node.value) &&
              n.MemberExpression.check(parent) &&
              this.name === "object"
            ) {
              assert.strictEqual(parent.object, node);
              return true;
            }
            if (
              n.AssignmentExpression.check(node) ||
              n.ConditionalExpression.check(node)
            ) {
              if (isUnaryLike(parent)) return true;
              if (isBinary(parent)) return true;
              if (n.CallExpression.check(parent) && this.name === "callee") {
                assert.strictEqual(parent.callee, node);
                return true;
              }
              if (
                n.ConditionalExpression.check(parent) &&
                this.name === "test"
              ) {
                assert.strictEqual(parent.test, node);
                return true;
              }
              if (n.MemberExpression.check(parent) && this.name === "object") {
                assert.strictEqual(parent.object, node);
                return true;
              }
            }
            if (
              assumeExpressionContext !== true &&
              !this.canBeFirstInStatement() &&
              this.firstInStatement()
            )
              return true;
            return false;
          };
          function isBinary(node) {
            return (
              n.BinaryExpression.check(node) || n.LogicalExpression.check(node)
            );
          }
          function isUnaryLike(node) {
            return (
              n.UnaryExpression.check(node) ||
              (n.SpreadElement && n.SpreadElement.check(node)) ||
              (n.SpreadProperty && n.SpreadProperty.check(node))
            );
          }
          var PRECEDENCE = {};
          [
            ["||"],
            ["&&"],
            ["|"],
            ["^"],
            ["&"],
            ["==", "===", "!=", "!=="],
            ["<", ">", "<=", ">=", "in", "instanceof"],
            [">>", "<<", ">>>"],
            ["+", "-"],
            ["*", "/", "%"],
          ].forEach(function (tier, i) {
            tier.forEach(function (op) {
              PRECEDENCE[op] = i;
            });
          });
          function containsCallExpression(node) {
            if (n.CallExpression.check(node)) {
              return true;
            }
            if (isArray.check(node)) {
              return node.some(containsCallExpression);
            }
            if (n.Node.check(node)) {
              return types.someField(node, function (name, child) {
                return containsCallExpression(child);
              });
            }
            return false;
          }
          NPp.canBeFirstInStatement = function () {
            var node = this.node;
            return (
              !n.FunctionExpression.check(node) &&
              !n.ObjectExpression.check(node)
            );
          };
          NPp.firstInStatement = function () {
            return firstInStatement(this);
          };
          function firstInStatement(path) {
            for (var node, parent; path.parent; path = path.parent) {
              node = path.node;
              parent = path.parent.node;
              if (
                n.BlockStatement.check(parent) &&
                path.parent.name === "body" &&
                path.name === 0
              ) {
                assert.strictEqual(parent.body[0], node);
                return true;
              }
              if (
                n.ExpressionStatement.check(parent) &&
                path.name === "expression"
              ) {
                assert.strictEqual(parent.expression, node);
                return true;
              }
              if (
                n.SequenceExpression.check(parent) &&
                path.parent.name === "expressions" &&
                path.name === 0
              ) {
                assert.strictEqual(parent.expressions[0], node);
                continue;
              }
              if (n.CallExpression.check(parent) && path.name === "callee") {
                assert.strictEqual(parent.callee, node);
                continue;
              }
              if (n.MemberExpression.check(parent) && path.name === "object") {
                assert.strictEqual(parent.object, node);
                continue;
              }
              if (
                n.ConditionalExpression.check(parent) &&
                path.name === "test"
              ) {
                assert.strictEqual(parent.test, node);
                continue;
              }
              if (isBinary(parent) && path.name === "left") {
                assert.strictEqual(parent.left, node);
                continue;
              }
              if (
                n.UnaryExpression.check(parent) &&
                !parent.prefix &&
                path.name === "argument"
              ) {
                assert.strictEqual(parent.argument, node);
                continue;
              }
              return false;
            }
            return true;
          }
          module.exports = NodePath;
        },
        { "./path": 71, "./scope": 72, "./types": 74, assert: 77, util: 86 },
      ],
      70: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("./types");
          var NodePath = require("./node-path");
          var Node = types.namedTypes.Node;
          var isArray = types.builtInTypes.array;
          var isObject = types.builtInTypes.object;
          var isFunction = types.builtInTypes.function;
          var hasOwn = Object.prototype.hasOwnProperty;
          var undefined;
          function PathVisitor() {
            assert.ok(this instanceof PathVisitor);
            this._reusableContextStack = [];
            this._methodNameTable = computeMethodNameTable(this);
            this.Context = makeContextConstructor(this);
          }
          function computeMethodNameTable(visitor) {
            var typeNames = Object.create(null);
            for (var methodName in visitor) {
              if (/^visit[A-Z]/.test(methodName)) {
                typeNames[methodName.slice("visit".length)] = true;
              }
            }
            var supertypeTable = types.computeSupertypeLookupTable(typeNames);
            var methodNameTable = Object.create(null);
            for (var typeName in supertypeTable) {
              if (hasOwn.call(supertypeTable, typeName)) {
                methodName = "visit" + supertypeTable[typeName];
                if (isFunction.check(visitor[methodName])) {
                  methodNameTable[typeName] = methodName;
                }
              }
            }
            return methodNameTable;
          }
          PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
            if (methods instanceof PathVisitor) {
              return methods;
            }
            if (!isObject.check(methods)) {
              return new PathVisitor();
            }
            function Visitor() {
              assert.ok(this instanceof Visitor);
              PathVisitor.call(this);
            }
            var Vp = (Visitor.prototype = Object.create(PVp));
            Vp.constructor = Visitor;
            extend(Vp, methods);
            extend(Visitor, PathVisitor);
            isFunction.assert(Visitor.fromMethodsObject);
            isFunction.assert(Visitor.visit);
            return new Visitor();
          };
          function extend(target, source) {
            for (var property in source) {
              if (hasOwn.call(source, property)) {
                target[property] = source[property];
              }
            }
            return target;
          }
          PathVisitor.visit = function visit(node, methods) {
            var visitor = PathVisitor.fromMethodsObject(methods);
            if (node instanceof NodePath) {
              visitor.visit(node);
              return node.value;
            }
            var rootPath = new NodePath({ root: node });
            visitor.visit(rootPath.get("root"));
            return rootPath.value.root;
          };
          var PVp = PathVisitor.prototype;
          PVp.visit = function (path) {
            if (this instanceof this.Context) {
              return this.visitor.visit(path);
            }
            assert.ok(path instanceof NodePath);
            var value = path.value;
            var methodName =
              Node.check(value) && this._methodNameTable[value.type];
            if (methodName) {
              var context = this.acquireContext(path);
              try {
                context.invokeVisitorMethod(methodName);
              } finally {
                this.releaseContext(context);
              }
            } else {
              visitChildren(path, this);
            }
          };
          function visitChildren(path, visitor) {
            assert.ok(path instanceof NodePath);
            assert.ok(visitor instanceof PathVisitor);
            var value = path.value;
            if (isArray.check(value)) {
              path.each(visitor.visit, visitor);
            } else if (!isObject.check(value)) {
            } else {
              var childNames = types.getFieldNames(value);
              var childCount = childNames.length;
              var childPaths = [];
              for (var i = 0; i < childCount; ++i) {
                var childName = childNames[i];
                if (!hasOwn.call(value, childName)) {
                  value[childName] = types.getFieldValue(value, childName);
                }
                childPaths.push(path.get(childName));
              }
              for (var i = 0; i < childCount; ++i) {
                visitor.visit(childPaths[i]);
              }
            }
          }
          PVp.acquireContext = function (path) {
            if (this._reusableContextStack.length === 0) {
              return new this.Context(path);
            }
            return this._reusableContextStack.pop().reset(path);
          };
          PVp.releaseContext = function (context) {
            assert.ok(context instanceof this.Context);
            this._reusableContextStack.push(context);
            context.currentPath = null;
          };
          function makeContextConstructor(visitor) {
            function Context(path) {
              assert.ok(this instanceof Context);
              assert.ok(this instanceof PathVisitor);
              assert.ok(path instanceof NodePath);
              Object.defineProperty(this, "visitor", {
                value: visitor,
                writable: false,
                enumerable: true,
                configurable: false,
              });
              this.currentPath = path;
              this.needToCallTraverse = true;
              Object.seal(this);
            }
            assert.ok(visitor instanceof PathVisitor);
            var Cp = (Context.prototype = Object.create(visitor));
            Cp.constructor = Context;
            extend(Cp, sharedContextProtoMethods);
            return Context;
          }
          var sharedContextProtoMethods = Object.create(null);
          sharedContextProtoMethods.reset = function reset(path) {
            assert.ok(this instanceof this.Context);
            assert.ok(path instanceof NodePath);
            this.currentPath = path;
            this.needToCallTraverse = true;
            return this;
          };
          sharedContextProtoMethods.invokeVisitorMethod =
            function invokeVisitorMethod(methodName) {
              assert.ok(this instanceof this.Context);
              assert.ok(this.currentPath instanceof NodePath);
              var result = this.visitor[methodName].call(
                this,
                this.currentPath
              );
              if (result === false) {
                this.needToCallTraverse = false;
              } else if (result !== undefined) {
                this.currentPath = this.currentPath.replace(result)[0];
                if (this.needToCallTraverse) {
                  this.traverse(this.currentPath);
                }
              }
              assert.strictEqual(
                this.needToCallTraverse,
                false,
                "Must either call this.traverse or return false in " +
                  methodName
              );
            };
          sharedContextProtoMethods.traverse = function traverse(
            path,
            newVisitor
          ) {
            assert.ok(this instanceof this.Context);
            assert.ok(path instanceof NodePath);
            assert.ok(this.currentPath instanceof NodePath);
            this.needToCallTraverse = false;
            visitChildren(
              path,
              PathVisitor.fromMethodsObject(newVisitor || this.visitor)
            );
          };
          module.exports = PathVisitor;
        },
        { "./node-path": 69, "./types": 74, assert: 77 },
      ],
      71: [
        function (require, module, exports) {
          var assert = require("assert");
          var Op = Object.prototype;
          var hasOwn = Op.hasOwnProperty;
          var types = require("./types");
          var isArray = types.builtInTypes.array;
          var isNumber = types.builtInTypes.number;
          var Ap = Array.prototype;
          var slice = Ap.slice;
          var map = Ap.map;
          function Path(value, parentPath, name) {
            assert.ok(this instanceof Path);
            if (parentPath) {
              assert.ok(parentPath instanceof Path);
            } else {
              parentPath = null;
              name = null;
            }
            this.value = value;
            this.parentPath = parentPath;
            this.name = name;
            this.__childCache = null;
          }
          var Pp = Path.prototype;
          function getChildCache(path) {
            return (
              path.__childCache || (path.__childCache = Object.create(null))
            );
          }
          function getChildPath(path, name) {
            var cache = getChildCache(path);
            var actualChildValue = path.getValueProperty(name);
            var childPath = cache[name];
            if (
              !hasOwn.call(cache, name) ||
              childPath.value !== actualChildValue
            ) {
              childPath = cache[name] = new path.constructor(
                actualChildValue,
                path,
                name
              );
            }
            return childPath;
          }
          Pp.getValueProperty = function getValueProperty(name) {
            return this.value[name];
          };
          Pp.get = function get(name) {
            var path = this;
            var names = arguments;
            var count = names.length;
            for (var i = 0; i < count; ++i) {
              path = getChildPath(path, names[i]);
            }
            return path;
          };
          Pp.each = function each(callback, context) {
            var childPaths = [];
            var len = this.value.length;
            var i = 0;
            for (var i = 0; i < len; ++i) {
              if (hasOwn.call(this.value, i)) {
                childPaths[i] = this.get(i);
              }
            }
            context = context || this;
            for (i = 0; i < len; ++i) {
              if (hasOwn.call(childPaths, i)) {
                callback.call(context, childPaths[i]);
              }
            }
          };
          Pp.map = function map(callback, context) {
            var result = [];
            this.each(function (childPath) {
              result.push(callback.call(this, childPath));
            }, context);
            return result;
          };
          Pp.filter = function filter(callback, context) {
            var result = [];
            this.each(function (childPath) {
              if (callback.call(this, childPath)) {
                result.push(childPath);
              }
            }, context);
            return result;
          };
          function emptyMoves() {}
          function getMoves(path, offset, start, end) {
            isArray.assert(path.value);
            if (offset === 0) {
              return emptyMoves;
            }
            var length = path.value.length;
            if (length < 1) {
              return emptyMoves;
            }
            var argc = arguments.length;
            if (argc === 2) {
              start = 0;
              end = length;
            } else if (argc === 3) {
              start = Math.max(start, 0);
              end = length;
            } else {
              start = Math.max(start, 0);
              end = Math.min(end, length);
            }
            isNumber.assert(start);
            isNumber.assert(end);
            var moves = Object.create(null);
            var cache = getChildCache(path);
            for (var i = start; i < end; ++i) {
              if (hasOwn.call(path.value, i)) {
                var childPath = path.get(i);
                assert.strictEqual(childPath.name, i);
                var newIndex = i + offset;
                childPath.name = newIndex;
                moves[newIndex] = childPath;
                delete cache[i];
              }
            }
            delete cache.length;
            return function () {
              for (var newIndex in moves) {
                var childPath = moves[newIndex];
                assert.strictEqual(childPath.name, +newIndex);
                cache[newIndex] = childPath;
                path.value[newIndex] = childPath.value;
              }
            };
          }
          Pp.shift = function shift() {
            var move = getMoves(this, -1);
            var result = this.value.shift();
            move();
            return result;
          };
          Pp.unshift = function unshift(node) {
            var move = getMoves(this, arguments.length);
            var result = this.value.unshift.apply(this.value, arguments);
            move();
            return result;
          };
          Pp.push = function push(node) {
            isArray.assert(this.value);
            delete getChildCache(this).length;
            return this.value.push.apply(this.value, arguments);
          };
          Pp.pop = function pop() {
            isArray.assert(this.value);
            var cache = getChildCache(this);
            delete cache[this.value.length - 1];
            delete cache.length;
            return this.value.pop();
          };
          Pp.insertAt = function insertAt(index, node) {
            var argc = arguments.length;
            var move = getMoves(this, argc - 1, index);
            if (move === emptyMoves) {
              return this;
            }
            index = Math.max(index, 0);
            for (var i = 1; i < argc; ++i) {
              this.value[index + i - 1] = arguments[i];
            }
            move();
            return this;
          };
          Pp.insertBefore = function insertBefore(node) {
            var pp = this.parentPath;
            var argc = arguments.length;
            var insertAtArgs = [this.name];
            for (var i = 0; i < argc; ++i) {
              insertAtArgs.push(arguments[i]);
            }
            return pp.insertAt.apply(pp, insertAtArgs);
          };
          Pp.insertAfter = function insertAfter(node) {
            var pp = this.parentPath;
            var argc = arguments.length;
            var insertAtArgs = [this.name + 1];
            for (var i = 0; i < argc; ++i) {
              insertAtArgs.push(arguments[i]);
            }
            return pp.insertAt.apply(pp, insertAtArgs);
          };
          function repairRelationshipWithParent(path) {
            assert.ok(path instanceof Path);
            var pp = path.parentPath;
            if (!pp) {
              return path;
            }
            var parentValue = pp.value;
            var parentCache = getChildCache(pp);
            if (parentValue[path.name] === path.value) {
              parentCache[path.name] = path;
            } else if (isArray.check(parentValue)) {
              var i = parentValue.indexOf(path.value);
              if (i >= 0) {
                parentCache[(path.name = i)] = path;
              }
            } else {
              parentValue[path.name] = path.value;
              parentCache[path.name] = path;
            }
            assert.strictEqual(parentValue[path.name], path.value);
            assert.strictEqual(path.parentPath.get(path.name), path);
            return path;
          }
          Pp.replace = function replace(replacement) {
            var results = [];
            var parentValue = this.parentPath.value;
            var parentCache = getChildCache(this.parentPath);
            var count = arguments.length;
            repairRelationshipWithParent(this);
            if (isArray.check(parentValue)) {
              var originalLength = parentValue.length;
              var move = getMoves(this.parentPath, count - 1, this.name + 1);
              var spliceArgs = [this.name, 1];
              for (var i = 0; i < count; ++i) {
                spliceArgs.push(arguments[i]);
              }
              var splicedOut = parentValue.splice.apply(
                parentValue,
                spliceArgs
              );
              assert.strictEqual(splicedOut[0], this.value);
              assert.strictEqual(
                parentValue.length,
                originalLength - 1 + count
              );
              move();
              if (count === 0) {
                delete this.value;
                delete parentCache[this.name];
                this.__childCache = null;
              } else {
                assert.strictEqual(parentValue[this.name], replacement);
                if (this.value !== replacement) {
                  this.value = replacement;
                  this.__childCache = null;
                }
                for (i = 0; i < count; ++i) {
                  results.push(this.parentPath.get(this.name + i));
                }
                assert.strictEqual(results[0], this);
              }
            } else if (count === 1) {
              if (this.value !== replacement) {
                this.__childCache = null;
              }
              this.value = parentValue[this.name] = replacement;
              results.push(this);
            } else if (count === 0) {
              delete parentValue[this.name];
              delete this.value;
              this.__childCache = null;
            } else {
              assert.ok(false, "Could not replace path");
            }
            return results;
          };
          module.exports = Path;
        },
        { "./types": 74, assert: 77 },
      ],
      72: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("./types");
          var Type = types.Type;
          var namedTypes = types.namedTypes;
          var Node = namedTypes.Node;
          var isArray = types.builtInTypes.array;
          var hasOwn = Object.prototype.hasOwnProperty;
          var b = types.builders;
          function Scope(path, parentScope) {
            assert.ok(this instanceof Scope);
            assert.ok(path instanceof require("./node-path"));
            ScopeType.assert(path.value);
            var depth;
            if (parentScope) {
              assert.ok(parentScope instanceof Scope);
              depth = parentScope.depth + 1;
            } else {
              parentScope = null;
              depth = 0;
            }
            Object.defineProperties(this, {
              path: { value: path },
              node: { value: path.value },
              isGlobal: { value: !parentScope, enumerable: true },
              depth: { value: depth },
              parent: { value: parentScope },
              bindings: { value: {} },
            });
          }
          var scopeTypes = [
            namedTypes.Program,
            namedTypes.Function,
            namedTypes.CatchClause,
          ];
          var ScopeType = Type.or.apply(Type, scopeTypes);
          Scope.isEstablishedBy = function (node) {
            return ScopeType.check(node);
          };
          var Sp = Scope.prototype;
          Sp.didScan = false;
          Sp.declares = function (name) {
            this.scan();
            return hasOwn.call(this.bindings, name);
          };
          Sp.declareTemporary = function (prefix) {
            if (prefix) {
              assert.ok(/^[a-z$_]/i.test(prefix), prefix);
            } else {
              prefix = "t$";
            }
            prefix += this.depth.toString(36) + "$";
            this.scan();
            var index = 0;
            while (this.declares(prefix + index)) {
              ++index;
            }
            var name = prefix + index;
            return (this.bindings[name] = types.builders.identifier(name));
          };
          Sp.injectTemporary = function (identifier, init) {
            identifier || (identifier = this.declareTemporary());
            var bodyPath = this.path.get("body");
            if (namedTypes.BlockStatement.check(bodyPath.value)) {
              bodyPath = bodyPath.get("body");
            }
            bodyPath.unshift(
              b.variableDeclaration("var", [
                b.variableDeclarator(identifier, init || null),
              ])
            );
            return identifier;
          };
          Sp.scan = function (force) {
            if (force || !this.didScan) {
              for (var name in this.bindings) {
                delete this.bindings[name];
              }
              scanScope(this.path, this.bindings);
              this.didScan = true;
            }
          };
          Sp.getBindings = function () {
            this.scan();
            return this.bindings;
          };
          function scanScope(path, bindings) {
            var node = path.value;
            ScopeType.assert(node);
            if (namedTypes.CatchClause.check(node)) {
              addPattern(path.get("param"), bindings);
            } else {
              recursiveScanScope(path, bindings);
            }
          }
          function recursiveScanScope(path, bindings) {
            var node = path.value;
            if (
              path.parent &&
              namedTypes.FunctionExpression.check(path.parent.node) &&
              path.parent.node.id
            ) {
              addPattern(path.parent.get("id"), bindings);
            }
            if (!node) {
            } else if (isArray.check(node)) {
              path.each(function (childPath) {
                recursiveScanChild(childPath, bindings);
              });
            } else if (namedTypes.Function.check(node)) {
              path.get("params").each(function (paramPath) {
                addPattern(paramPath, bindings);
              });
              recursiveScanChild(path.get("body"), bindings);
            } else if (namedTypes.VariableDeclarator.check(node)) {
              addPattern(path.get("id"), bindings);
              recursiveScanChild(path.get("init"), bindings);
            } else if (
              node.type === "ImportSpecifier" ||
              node.type === "ImportNamespaceSpecifier" ||
              node.type === "ImportDefaultSpecifier"
            ) {
              addPattern(
                node.name ? path.get("name") : path.get("id"),
                bindings
              );
            } else if (Node.check(node)) {
              types.eachField(node, function (name, child) {
                var childPath = path.get(name);
                assert.strictEqual(childPath.value, child);
                recursiveScanChild(childPath, bindings);
              });
            }
          }
          function recursiveScanChild(path, bindings) {
            var node = path.value;
            if (!node) {
            } else if (namedTypes.FunctionDeclaration.check(node)) {
              addPattern(path.get("id"), bindings);
            } else if (
              namedTypes.ClassDeclaration &&
              namedTypes.ClassDeclaration.check(node)
            ) {
              addPattern(path.get("id"), bindings);
            } else if (Scope.isEstablishedBy(node)) {
              if (namedTypes.CatchClause.check(node)) {
                var catchParamName = node.param.name;
                var hadBinding = hasOwn.call(bindings, catchParamName);
                recursiveScanScope(path.get("body"), bindings);
                if (!hadBinding) {
                  delete bindings[catchParamName];
                }
              }
            } else {
              recursiveScanScope(path, bindings);
            }
          }
          function addPattern(patternPath, bindings) {
            var pattern = patternPath.value;
            namedTypes.Pattern.assert(pattern);
            if (namedTypes.Identifier.check(pattern)) {
              if (hasOwn.call(bindings, pattern.name)) {
                bindings[pattern.name].push(patternPath);
              } else {
                bindings[pattern.name] = [patternPath];
              }
            } else if (
              namedTypes.SpreadElement &&
              namedTypes.SpreadElement.check(pattern)
            ) {
              addPattern(patternPath.get("argument"), bindings);
            }
          }
          Sp.lookup = function (name) {
            for (var scope = this; scope; scope = scope.parent)
              if (scope.declares(name)) break;
            return scope;
          };
          Sp.getGlobalScope = function () {
            var scope = this;
            while (!scope.isGlobal) scope = scope.parent;
            return scope;
          };
          module.exports = Scope;
        },
        { "./node-path": 69, "./types": 74, assert: 77 },
      ],
      73: [
        function (require, module, exports) {
          var types = require("../lib/types");
          var Type = types.Type;
          var builtin = types.builtInTypes;
          var isNumber = builtin.number;
          exports.geq = function (than) {
            return new Type(function (value) {
              return isNumber.check(value) && value >= than;
            }, isNumber + " >= " + than);
          };
          exports.defaults = {
            null: function () {
              return null;
            },
            emptyArray: function () {
              return [];
            },
            false: function () {
              return false;
            },
            true: function () {
              return true;
            },
            undefined: function () {},
          };
          var naiveIsPrimitive = Type.or(
            builtin.string,
            builtin.number,
            builtin.boolean,
            builtin.null,
            builtin.undefined
          );
          exports.isPrimitive = new Type(function (value) {
            if (value === null) return true;
            var type = typeof value;
            return !(type === "object" || type === "function");
          }, naiveIsPrimitive.toString());
        },
        { "../lib/types": 74 },
      ],
      74: [
        function (require, module, exports) {
          var assert = require("assert");
          var Ap = Array.prototype;
          var slice = Ap.slice;
          var map = Ap.map;
          var each = Ap.forEach;
          var Op = Object.prototype;
          var objToStr = Op.toString;
          var funObjStr = objToStr.call(function () {});
          var strObjStr = objToStr.call("");
          var hasOwn = Op.hasOwnProperty;
          function Type(check, name) {
            var self = this;
            assert.ok(self instanceof Type, self);
            assert.strictEqual(
              objToStr.call(check),
              funObjStr,
              check + " is not a function"
            );
            var nameObjStr = objToStr.call(name);
            assert.ok(
              nameObjStr === funObjStr || nameObjStr === strObjStr,
              name + " is neither a function nor a string"
            );
            Object.defineProperties(self, {
              name: { value: name },
              check: {
                value: function (value, deep) {
                  var result = check.call(self, value, deep);
                  if (!result && deep && objToStr.call(deep) === funObjStr)
                    deep(self, value);
                  return result;
                },
              },
            });
          }
          var Tp = Type.prototype;
          exports.Type = Type;
          Tp.assert = function (value, deep) {
            if (!this.check(value, deep)) {
              var str = shallowStringify(value);
              assert.ok(false, str + " does not match type " + this);
              return false;
            }
            return true;
          };
          function shallowStringify(value) {
            if (isObject.check(value))
              return (
                "{" +
                Object.keys(value)
                  .map(function (key) {
                    return key + ": " + value[key];
                  })
                  .join(", ") +
                "}"
              );
            if (isArray.check(value))
              return "[" + value.map(shallowStringify).join(", ") + "]";
            return JSON.stringify(value);
          }
          Tp.toString = function () {
            var name = this.name;
            if (isString.check(name)) return name;
            if (isFunction.check(name)) return name.call(this) + "";
            return name + " type";
          };
          var builtInTypes = {};
          exports.builtInTypes = builtInTypes;
          function defBuiltInType(example, name) {
            var objStr = objToStr.call(example);
            Object.defineProperty(builtInTypes, name, {
              enumerable: true,
              value: new Type(function (value) {
                return objToStr.call(value) === objStr;
              }, name),
            });
            return builtInTypes[name];
          }
          var isString = defBuiltInType("", "string");
          var isFunction = defBuiltInType(function () {}, "function");
          var isArray = defBuiltInType([], "array");
          var isObject = defBuiltInType({}, "object");
          var isRegExp = defBuiltInType(/./, "RegExp");
          var isDate = defBuiltInType(new Date(), "Date");
          var isNumber = defBuiltInType(3, "number");
          var isBoolean = defBuiltInType(true, "boolean");
          var isNull = defBuiltInType(null, "null");
          var isUndefined = defBuiltInType(void 0, "undefined");
          function toType(from, name) {
            if (from instanceof Type) return from;
            if (from instanceof Def) return from.type;
            if (isArray.check(from)) return Type.fromArray(from);
            if (isObject.check(from)) return Type.fromObject(from);
            if (isFunction.check(from)) return new Type(from, name);
            return new Type(
              function (value) {
                return value === from;
              },
              isUndefined.check(name)
                ? function () {
                    return from + "";
                  }
                : name
            );
          }
          Type.or = function () {
            var types = [];
            var len = arguments.length;
            for (var i = 0; i < len; ++i) types.push(toType(arguments[i]));
            return new Type(
              function (value, deep) {
                for (var i = 0; i < len; ++i)
                  if (types[i].check(value, deep)) return true;
                return false;
              },
              function () {
                return types.join(" | ");
              }
            );
          };
          Type.fromArray = function (arr) {
            assert.ok(isArray.check(arr));
            assert.strictEqual(
              arr.length,
              1,
              "only one element type is permitted for typed arrays"
            );
            return toType(arr[0]).arrayOf();
          };
          Tp.arrayOf = function () {
            var elemType = this;
            return new Type(
              function (value, deep) {
                return (
                  isArray.check(value) &&
                  value.every(function (elem) {
                    return elemType.check(elem, deep);
                  })
                );
              },
              function () {
                return "[" + elemType + "]";
              }
            );
          };
          Type.fromObject = function (obj) {
            var fields = Object.keys(obj).map(function (name) {
              return new Field(name, obj[name]);
            });
            return new Type(
              function (value, deep) {
                return (
                  isObject.check(value) &&
                  fields.every(function (field) {
                    return field.type.check(value[field.name], deep);
                  })
                );
              },
              function () {
                return "{ " + fields.join(", ") + " }";
              }
            );
          };
          function Field(name, type, defaultFn, hidden) {
            var self = this;
            assert.ok(self instanceof Field);
            isString.assert(name);
            type = toType(type);
            var properties = {
              name: { value: name },
              type: { value: type },
              hidden: { value: !!hidden },
            };
            if (isFunction.check(defaultFn)) {
              properties.defaultFn = { value: defaultFn };
            }
            Object.defineProperties(self, properties);
          }
          var Fp = Field.prototype;
          Fp.toString = function () {
            return JSON.stringify(this.name) + ": " + this.type;
          };
          Fp.getValue = function (obj) {
            var value = obj[this.name];
            if (!isUndefined.check(value)) return value;
            if (this.defaultFn) value = this.defaultFn.call(obj);
            return value;
          };
          Type.def = function (typeName) {
            isString.assert(typeName);
            return hasOwn.call(defCache, typeName)
              ? defCache[typeName]
              : (defCache[typeName] = new Def(typeName));
          };
          var defCache = Object.create(null);
          function Def(typeName) {
            var self = this;
            assert.ok(self instanceof Def);
            Object.defineProperties(self, {
              typeName: { value: typeName },
              baseNames: { value: [] },
              ownFields: { value: Object.create(null) },
              allSupertypes: { value: Object.create(null) },
              supertypeList: { value: [] },
              allFields: { value: Object.create(null) },
              fieldNames: { value: [] },
              type: {
                value: new Type(function (value, deep) {
                  return self.check(value, deep);
                }, typeName),
              },
            });
          }
          Def.fromValue = function (value) {
            if (value && typeof value === "object") {
              var type = value.type;
              if (typeof type === "string" && hasOwn.call(defCache, type)) {
                var d = defCache[type];
                if (d.finalized) {
                  return d;
                }
              }
            }
            return null;
          };
          var Dp = Def.prototype;
          Dp.isSupertypeOf = function (that) {
            if (that instanceof Def) {
              assert.strictEqual(this.finalized, true);
              assert.strictEqual(that.finalized, true);
              return hasOwn.call(that.allSupertypes, this.typeName);
            } else {
              assert.ok(false, that + " is not a Def");
            }
          };
          exports.getSupertypeNames = function (typeName) {
            assert.ok(hasOwn.call(defCache, typeName));
            var d = defCache[typeName];
            assert.strictEqual(d.finalized, true);
            return d.supertypeList.slice(1);
          };
          exports.computeSupertypeLookupTable = function (candidates) {
            var table = {};
            for (var typeName in defCache) {
              if (hasOwn.call(defCache, typeName)) {
                var d = defCache[typeName];
                assert.strictEqual(d.finalized, true);
                for (var i = 0; i < d.supertypeList.length; ++i) {
                  var superTypeName = d.supertypeList[i];
                  if (hasOwn.call(candidates, superTypeName)) {
                    table[typeName] = superTypeName;
                    break;
                  }
                }
              }
            }
            return table;
          };
          Dp.checkAllFields = function (value, deep) {
            var allFields = this.allFields;
            assert.strictEqual(this.finalized, true);
            function checkFieldByName(name) {
              var field = allFields[name];
              var type = field.type;
              var child = field.getValue(value);
              return type.check(child, deep);
            }
            return (
              isObject.check(value) &&
              Object.keys(allFields).every(checkFieldByName)
            );
          };
          Dp.check = function (value, deep) {
            assert.strictEqual(
              this.finalized,
              true,
              "prematurely checking unfinalized type " + this.typeName
            );
            if (!isObject.check(value)) return false;
            var vDef = Def.fromValue(value);
            if (!vDef) {
              if (
                this.typeName === "SourceLocation" ||
                this.typeName === "Position"
              ) {
                return this.checkAllFields(value, deep);
              }
              return false;
            }
            if (deep && vDef === this) return this.checkAllFields(value, deep);
            if (!this.isSupertypeOf(vDef)) return false;
            if (!deep) return true;
            return (
              vDef.checkAllFields(value, deep) &&
              this.checkAllFields(value, false)
            );
          };
          Dp.bases = function () {
            var bases = this.baseNames;
            assert.strictEqual(this.finalized, false);
            each.call(arguments, function (baseName) {
              isString.assert(baseName);
              if (bases.indexOf(baseName) < 0) bases.push(baseName);
            });
            return this;
          };
          Object.defineProperty(Dp, "buildable", { value: false });
          var builders = {};
          exports.builders = builders;
          var nodePrototype = {};
          exports.defineMethod = function (name, func) {
            var old = nodePrototype[name];
            if (isUndefined.check(func)) {
              delete nodePrototype[name];
            } else {
              isFunction.assert(func);
              Object.defineProperty(nodePrototype, name, {
                enumerable: true,
                configurable: true,
                value: func,
              });
            }
            return old;
          };
          Dp.build = function () {
            var self = this;
            Object.defineProperty(self, "buildParams", {
              value: slice.call(arguments),
              writable: false,
              enumerable: false,
              configurable: true,
            });
            assert.strictEqual(self.finalized, false);
            isString.arrayOf().assert(self.buildParams);
            if (self.buildable) {
              return self;
            }
            self.field("type", self.typeName, function () {
              return self.typeName;
            });
            Object.defineProperty(self, "buildable", { value: true });
            Object.defineProperty(builders, getBuilderName(self.typeName), {
              enumerable: true,
              value: function () {
                var args = arguments;
                var argc = args.length;
                var built = Object.create(nodePrototype);
                assert.ok(
                  self.finalized,
                  "attempting to instantiate unfinalized type " + self.typeName
                );
                function add(param, i) {
                  if (hasOwn.call(built, param)) return;
                  var all = self.allFields;
                  assert.ok(hasOwn.call(all, param), param);
                  var field = all[param];
                  var type = field.type;
                  var value;
                  if (isNumber.check(i) && i < argc) {
                    value = args[i];
                  } else if (field.defaultFn) {
                    value = field.defaultFn.call(built);
                  } else {
                    var message =
                      "no value or default function given for field " +
                      JSON.stringify(param) +
                      " of " +
                      self.typeName +
                      "(" +
                      self.buildParams
                        .map(function (name) {
                          return all[name];
                        })
                        .join(", ") +
                      ")";
                    assert.ok(false, message);
                  }
                  assert.ok(
                    type.check(value),
                    shallowStringify(value) +
                      " does not match field " +
                      field +
                      " of type " +
                      self.typeName
                  );
                  built[param] = value;
                }
                self.buildParams.forEach(function (param, i) {
                  add(param, i);
                });
                Object.keys(self.allFields).forEach(function (param) {
                  add(param);
                });
                assert.strictEqual(built.type, self.typeName);
                return built;
              },
            });
            return self;
          };
          function getBuilderName(typeName) {
            return typeName.replace(/^[A-Z]+/, function (upperCasePrefix) {
              var len = upperCasePrefix.length;
              switch (len) {
                case 0:
                  return "";
                case 1:
                  return upperCasePrefix.toLowerCase();
                default:
                  return (
                    upperCasePrefix.slice(0, len - 1).toLowerCase() +
                    upperCasePrefix.charAt(len - 1)
                  );
              }
            });
          }
          Dp.field = function (name, type, defaultFn, hidden) {
            assert.strictEqual(this.finalized, false);
            this.ownFields[name] = new Field(name, type, defaultFn, hidden);
            return this;
          };
          var namedTypes = {};
          exports.namedTypes = namedTypes;
          function getFieldNames(object) {
            var d = Def.fromValue(object);
            if (d) {
              return d.fieldNames.slice(0);
            }
            assert.strictEqual(
              "type" in object,
              false,
              "did not recognize object of type " + JSON.stringify(object.type)
            );
            return Object.keys(object);
          }
          exports.getFieldNames = getFieldNames;
          function getFieldValue(object, fieldName) {
            var d = Def.fromValue(object);
            if (d) {
              var field = d.allFields[fieldName];
              if (field) {
                return field.getValue(object);
              }
            }
            return object[fieldName];
          }
          exports.getFieldValue = getFieldValue;
          exports.eachField = function (object, callback, context) {
            getFieldNames(object).forEach(function (name) {
              callback.call(this, name, getFieldValue(object, name));
            }, context);
          };
          exports.someField = function (object, callback, context) {
            return getFieldNames(object).some(function (name) {
              return callback.call(this, name, getFieldValue(object, name));
            }, context);
          };
          Object.defineProperty(Dp, "finalized", { value: false });
          Dp.finalize = function () {
            if (!this.finalized) {
              var allFields = this.allFields;
              var allSupertypes = this.allSupertypes;
              this.baseNames.forEach(function (name) {
                var def = defCache[name];
                def.finalize();
                extend(allFields, def.allFields);
                extend(allSupertypes, def.allSupertypes);
              });
              extend(allFields, this.ownFields);
              allSupertypes[this.typeName] = this;
              this.fieldNames.length = 0;
              for (var fieldName in allFields) {
                if (
                  hasOwn.call(allFields, fieldName) &&
                  !allFields[fieldName].hidden
                ) {
                  this.fieldNames.push(fieldName);
                }
              }
              Object.defineProperty(namedTypes, this.typeName, {
                enumerable: true,
                value: this.type,
              });
              Object.defineProperty(this, "finalized", { value: true });
              populateSupertypeList(this.typeName, this.supertypeList);
            }
          };
          function populateSupertypeList(typeName, list) {
            list.length = 0;
            list.push(typeName);
            var lastSeen = Object.create(null);
            for (var pos = 0; pos < list.length; ++pos) {
              typeName = list[pos];
              var d = defCache[typeName];
              assert.strictEqual(d.finalized, true);
              if (hasOwn.call(lastSeen, typeName)) {
                delete list[lastSeen[typeName]];
              }
              lastSeen[typeName] = pos;
              list.push.apply(list, d.baseNames);
            }
            for (var to = 0, from = to, len = list.length; from < len; ++from) {
              if (hasOwn.call(list, from)) {
                list[to++] = list[from];
              }
            }
            list.length = to;
          }
          function extend(into, from) {
            Object.keys(from).forEach(function (name) {
              into[name] = from[name];
            });
            return into;
          }
          exports.finalize = function () {
            Object.keys(defCache).forEach(function (name) {
              defCache[name].finalize();
            });
          };
        },
        { assert: 77 },
      ],
      75: [
        function (require, module, exports) {
          var types = require("./lib/types");
          require("./def/core");
          require("./def/es6");
          require("./def/es7");
          require("./def/mozilla");
          require("./def/e4x");
          require("./def/fb-harmony");
          types.finalize();
          exports.Type = types.Type;
          exports.builtInTypes = types.builtInTypes;
          exports.namedTypes = types.namedTypes;
          exports.builders = types.builders;
          exports.defineMethod = types.defineMethod;
          exports.getFieldNames = types.getFieldNames;
          exports.getFieldValue = types.getFieldValue;
          exports.eachField = types.eachField;
          exports.someField = types.someField;
          exports.getSupertypeNames = types.getSupertypeNames;
          exports.astNodesAreEquivalent = require("./lib/equiv");
          exports.finalize = types.finalize;
          exports.NodePath = require("./lib/node-path");
          exports.PathVisitor = require("./lib/path-visitor");
          exports.visit = exports.PathVisitor.visit;
        },
        {
          "./def/core": 62,
          "./def/e4x": 63,
          "./def/es6": 64,
          "./def/es7": 65,
          "./def/fb-harmony": 66,
          "./def/mozilla": 67,
          "./lib/equiv": 68,
          "./lib/node-path": 69,
          "./lib/path-visitor": 70,
          "./lib/types": 74,
        },
      ],
      76: [function (require, module, exports) {}, {}],
      77: [
        function (require, module, exports) {
          var util = require("util/");
          var pSlice = Array.prototype.slice;
          var hasOwn = Object.prototype.hasOwnProperty;
          var assert = (module.exports = ok);
          assert.AssertionError = function AssertionError(options) {
            this.name = "AssertionError";
            this.actual = options.actual;
            this.expected = options.expected;
            this.operator = options.operator;
            if (options.message) {
              this.message = options.message;
              this.generatedMessage = false;
            } else {
              this.message = getMessage(this);
              this.generatedMessage = true;
            }
            var stackStartFunction = options.stackStartFunction || fail;
            if (Error.captureStackTrace) {
              Error.captureStackTrace(this, stackStartFunction);
            } else {
              var err = new Error();
              if (err.stack) {
                var out = err.stack;
                var fn_name = stackStartFunction.name;
                var idx = out.indexOf("\n" + fn_name);
                if (idx >= 0) {
                  var next_line = out.indexOf("\n", idx + 1);
                  out = out.substring(next_line + 1);
                }
                this.stack = out;
              }
            }
          };
          util.inherits(assert.AssertionError, Error);
          function replacer(key, value) {
            if (util.isUndefined(value)) {
              return "" + value;
            }
            if (util.isNumber(value) && (isNaN(value) || !isFinite(value))) {
              return value.toString();
            }
            if (util.isFunction(value) || util.isRegExp(value)) {
              return value.toString();
            }
            return value;
          }
          function truncate(s, n) {
            if (util.isString(s)) {
              return s.length < n ? s : s.slice(0, n);
            } else {
              return s;
            }
          }
          function getMessage(self) {
            return (
              truncate(JSON.stringify(self.actual, replacer), 128) +
              " " +
              self.operator +
              " " +
              truncate(JSON.stringify(self.expected, replacer), 128)
            );
          }
          function fail(
            actual,
            expected,
            message,
            operator,
            stackStartFunction
          ) {
            throw new assert.AssertionError({
              message: message,
              actual: actual,
              expected: expected,
              operator: operator,
              stackStartFunction: stackStartFunction,
            });
          }
          assert.fail = fail;
          function ok(value, message) {
            if (!value) fail(value, true, message, "==", assert.ok);
          }
          assert.ok = ok;
          assert.equal = function equal(actual, expected, message) {
            if (actual != expected)
              fail(actual, expected, message, "==", assert.equal);
          };
          assert.notEqual = function notEqual(actual, expected, message) {
            if (actual == expected) {
              fail(actual, expected, message, "!=", assert.notEqual);
            }
          };
          assert.deepEqual = function deepEqual(actual, expected, message) {
            if (!_deepEqual(actual, expected)) {
              fail(actual, expected, message, "deepEqual", assert.deepEqual);
            }
          };
          function _deepEqual(actual, expected) {
            if (actual === expected) {
              return true;
            } else if (util.isBuffer(actual) && util.isBuffer(expected)) {
              if (actual.length != expected.length) return false;
              for (var i = 0; i < actual.length; i++) {
                if (actual[i] !== expected[i]) return false;
              }
              return true;
            } else if (util.isDate(actual) && util.isDate(expected)) {
              return actual.getTime() === expected.getTime();
            } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
              return (
                actual.source === expected.source &&
                actual.global === expected.global &&
                actual.multiline === expected.multiline &&
                actual.lastIndex === expected.lastIndex &&
                actual.ignoreCase === expected.ignoreCase
              );
            } else if (!util.isObject(actual) && !util.isObject(expected)) {
              return actual == expected;
            } else {
              return objEquiv(actual, expected);
            }
          }
          function isArguments(object) {
            return (
              Object.prototype.toString.call(object) == "[object Arguments]"
            );
          }
          function objEquiv(a, b) {
            if (util.isNullOrUndefined(a) || util.isNullOrUndefined(b))
              return false;
            if (a.prototype !== b.prototype) return false;
            if (isArguments(a)) {
              if (!isArguments(b)) {
                return false;
              }
              a = pSlice.call(a);
              b = pSlice.call(b);
              return _deepEqual(a, b);
            }
            try {
              var ka = objectKeys(a),
                kb = objectKeys(b),
                key,
                i;
            } catch (e) {
              return false;
            }
            if (ka.length != kb.length) return false;
            ka.sort();
            kb.sort();
            for (i = ka.length - 1; i >= 0; i--) {
              if (ka[i] != kb[i]) return false;
            }
            for (i = ka.length - 1; i >= 0; i--) {
              key = ka[i];
              if (!_deepEqual(a[key], b[key])) return false;
            }
            return true;
          }
          assert.notDeepEqual = function notDeepEqual(
            actual,
            expected,
            message
          ) {
            if (_deepEqual(actual, expected)) {
              fail(
                actual,
                expected,
                message,
                "notDeepEqual",
                assert.notDeepEqual
              );
            }
          };
          assert.strictEqual = function strictEqual(actual, expected, message) {
            if (actual !== expected) {
              fail(actual, expected, message, "===", assert.strictEqual);
            }
          };
          assert.notStrictEqual = function notStrictEqual(
            actual,
            expected,
            message
          ) {
            if (actual === expected) {
              fail(actual, expected, message, "!==", assert.notStrictEqual);
            }
          };
          function expectedException(actual, expected) {
            if (!actual || !expected) {
              return false;
            }
            if (Object.prototype.toString.call(expected) == "[object RegExp]") {
              return expected.test(actual);
            } else if (actual instanceof expected) {
              return true;
            } else if (expected.call({}, actual) === true) {
              return true;
            }
            return false;
          }
          function _throws(shouldThrow, block, expected, message) {
            var actual;
            if (util.isString(expected)) {
              message = expected;
              expected = null;
            }
            try {
              block();
            } catch (e) {
              actual = e;
            }
            message =
              (expected && expected.name ? " (" + expected.name + ")." : ".") +
              (message ? " " + message : ".");
            if (shouldThrow && !actual) {
              fail(actual, expected, "Missing expected exception" + message);
            }
            if (!shouldThrow && expectedException(actual, expected)) {
              fail(actual, expected, "Got unwanted exception" + message);
            }
            if (
              (shouldThrow &&
                actual &&
                expected &&
                !expectedException(actual, expected)) ||
              (!shouldThrow && actual)
            ) {
              throw actual;
            }
          }
          assert.throws = function (block, error, message) {
            _throws.apply(this, [true].concat(pSlice.call(arguments)));
          };
          assert.doesNotThrow = function (block, message) {
            _throws.apply(this, [false].concat(pSlice.call(arguments)));
          };
          assert.ifError = function (err) {
            if (err) {
              throw err;
            }
          };
          var objectKeys =
            Object.keys ||
            function (obj) {
              var keys = [];
              for (var key in obj) {
                if (hasOwn.call(obj, key)) keys.push(key);
              }
              return keys;
            };
        },
        { "util/": 86 },
      ],
      78: [
        function (require, module, exports) {
          var base64 = require("base64-js");
          var ieee754 = require("ieee754");
          var isArray = require("is-array");
          exports.Buffer = Buffer;
          exports.SlowBuffer = Buffer;
          exports.INSPECT_MAX_BYTES = 50;
          Buffer.poolSize = 8192;
          var kMaxLength = 1073741823;
          Buffer.TYPED_ARRAY_SUPPORT = (function () {
            try {
              var buf = new ArrayBuffer(0);
              var arr = new Uint8Array(buf);
              arr.foo = function () {
                return 42;
              };
              return (
                42 === arr.foo() &&
                typeof arr.subarray === "function" &&
                new Uint8Array(1).subarray(1, 1).byteLength === 0
              );
            } catch (e) {
              return false;
            }
          })();
          function Buffer(subject, encoding, noZero) {
            if (!(this instanceof Buffer))
              return new Buffer(subject, encoding, noZero);
            var type = typeof subject;
            var length;
            if (type === "number") length = subject > 0 ? subject >>> 0 : 0;
            else if (type === "string") {
              if (encoding === "base64") subject = base64clean(subject);
              length = Buffer.byteLength(subject, encoding);
            } else if (type === "object" && subject !== null) {
              if (subject.type === "Buffer" && isArray(subject.data))
                subject = subject.data;
              length = +subject.length > 0 ? Math.floor(+subject.length) : 0;
            } else
              throw new TypeError(
                "must start with number, buffer, array or string"
              );
            if (this.length > kMaxLength)
              throw new RangeError(
                "Attempt to allocate Buffer larger than maximum " +
                  "size: 0x" +
                  kMaxLength.toString(16) +
                  " bytes"
              );
            var buf;
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              buf = Buffer._augment(new Uint8Array(length));
            } else {
              buf = this;
              buf.length = length;
              buf._isBuffer = true;
            }
            var i;
            if (
              Buffer.TYPED_ARRAY_SUPPORT &&
              typeof subject.byteLength === "number"
            ) {
              buf._set(subject);
            } else if (isArrayish(subject)) {
              if (Buffer.isBuffer(subject)) {
                for (i = 0; i < length; i++) buf[i] = subject.readUInt8(i);
              } else {
                for (i = 0; i < length; i++)
                  buf[i] = ((subject[i] % 256) + 256) % 256;
              }
            } else if (type === "string") {
              buf.write(subject, 0, encoding);
            } else if (
              type === "number" &&
              !Buffer.TYPED_ARRAY_SUPPORT &&
              !noZero
            ) {
              for (i = 0; i < length; i++) {
                buf[i] = 0;
              }
            }
            return buf;
          }
          Buffer.isBuffer = function (b) {
            return !!(b != null && b._isBuffer);
          };
          Buffer.compare = function (a, b) {
            if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b))
              throw new TypeError("Arguments must be Buffers");
            var x = a.length;
            var y = b.length;
            for (
              var i = 0, len = Math.min(x, y);
              i < len && a[i] === b[i];
              i++
            ) {}
            if (i !== len) {
              x = a[i];
              y = b[i];
            }
            if (x < y) return -1;
            if (y < x) return 1;
            return 0;
          };
          Buffer.isEncoding = function (encoding) {
            switch (String(encoding).toLowerCase()) {
              case "hex":
              case "utf8":
              case "utf-8":
              case "ascii":
              case "binary":
              case "base64":
              case "raw":
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                return true;
              default:
                return false;
            }
          };
          Buffer.concat = function (list, totalLength) {
            if (!isArray(list))
              throw new TypeError("Usage: Buffer.concat(list[, length])");
            if (list.length === 0) {
              return new Buffer(0);
            } else if (list.length === 1) {
              return list[0];
            }
            var i;
            if (totalLength === undefined) {
              totalLength = 0;
              for (i = 0; i < list.length; i++) {
                totalLength += list[i].length;
              }
            }
            var buf = new Buffer(totalLength);
            var pos = 0;
            for (i = 0; i < list.length; i++) {
              var item = list[i];
              item.copy(buf, pos);
              pos += item.length;
            }
            return buf;
          };
          Buffer.byteLength = function (str, encoding) {
            var ret;
            str = str + "";
            switch (encoding || "utf8") {
              case "ascii":
              case "binary":
              case "raw":
                ret = str.length;
                break;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                ret = str.length * 2;
                break;
              case "hex":
                ret = str.length >>> 1;
                break;
              case "utf8":
              case "utf-8":
                ret = utf8ToBytes(str).length;
                break;
              case "base64":
                ret = base64ToBytes(str).length;
                break;
              default:
                ret = str.length;
            }
            return ret;
          };
          Buffer.prototype.length = undefined;
          Buffer.prototype.parent = undefined;
          Buffer.prototype.toString = function (encoding, start, end) {
            var loweredCase = false;
            start = start >>> 0;
            end =
              end === undefined || end === Infinity ? this.length : end >>> 0;
            if (!encoding) encoding = "utf8";
            if (start < 0) start = 0;
            if (end > this.length) end = this.length;
            if (end <= start) return "";
            while (true) {
              switch (encoding) {
                case "hex":
                  return hexSlice(this, start, end);
                case "utf8":
                case "utf-8":
                  return utf8Slice(this, start, end);
                case "ascii":
                  return asciiSlice(this, start, end);
                case "binary":
                  return binarySlice(this, start, end);
                case "base64":
                  return base64Slice(this, start, end);
                case "ucs2":
                case "ucs-2":
                case "utf16le":
                case "utf-16le":
                  return utf16leSlice(this, start, end);
                default:
                  if (loweredCase)
                    throw new TypeError("Unknown encoding: " + encoding);
                  encoding = (encoding + "").toLowerCase();
                  loweredCase = true;
              }
            }
          };
          Buffer.prototype.equals = function (b) {
            if (!Buffer.isBuffer(b))
              throw new TypeError("Argument must be a Buffer");
            return Buffer.compare(this, b) === 0;
          };
          Buffer.prototype.inspect = function () {
            var str = "";
            var max = exports.INSPECT_MAX_BYTES;
            if (this.length > 0) {
              str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
              if (this.length > max) str += " ... ";
            }
            return "<Buffer " + str + ">";
          };
          Buffer.prototype.compare = function (b) {
            if (!Buffer.isBuffer(b))
              throw new TypeError("Argument must be a Buffer");
            return Buffer.compare(this, b);
          };
          Buffer.prototype.get = function (offset) {
            console.log(
              ".get() is deprecated. Access using array indexes instead."
            );
            return this.readUInt8(offset);
          };
          Buffer.prototype.set = function (v, offset) {
            console.log(
              ".set() is deprecated. Access using array indexes instead."
            );
            return this.writeUInt8(v, offset);
          };
          function hexWrite(buf, string, offset, length) {
            offset = Number(offset) || 0;
            var remaining = buf.length - offset;
            if (!length) {
              length = remaining;
            } else {
              length = Number(length);
              if (length > remaining) {
                length = remaining;
              }
            }
            var strLen = string.length;
            if (strLen % 2 !== 0) throw new Error("Invalid hex string");
            if (length > strLen / 2) {
              length = strLen / 2;
            }
            for (var i = 0; i < length; i++) {
              var byte = parseInt(string.substr(i * 2, 2), 16);
              if (isNaN(byte)) throw new Error("Invalid hex string");
              buf[offset + i] = byte;
            }
            return i;
          }
          function utf8Write(buf, string, offset, length) {
            var charsWritten = blitBuffer(
              utf8ToBytes(string),
              buf,
              offset,
              length
            );
            return charsWritten;
          }
          function asciiWrite(buf, string, offset, length) {
            var charsWritten = blitBuffer(
              asciiToBytes(string),
              buf,
              offset,
              length
            );
            return charsWritten;
          }
          function binaryWrite(buf, string, offset, length) {
            return asciiWrite(buf, string, offset, length);
          }
          function base64Write(buf, string, offset, length) {
            var charsWritten = blitBuffer(
              base64ToBytes(string),
              buf,
              offset,
              length
            );
            return charsWritten;
          }
          function utf16leWrite(buf, string, offset, length) {
            var charsWritten = blitBuffer(
              utf16leToBytes(string),
              buf,
              offset,
              length
            );
            return charsWritten;
          }
          Buffer.prototype.write = function (string, offset, length, encoding) {
            if (isFinite(offset)) {
              if (!isFinite(length)) {
                encoding = length;
                length = undefined;
              }
            } else {
              var swap = encoding;
              encoding = offset;
              offset = length;
              length = swap;
            }
            offset = Number(offset) || 0;
            var remaining = this.length - offset;
            if (!length) {
              length = remaining;
            } else {
              length = Number(length);
              if (length > remaining) {
                length = remaining;
              }
            }
            encoding = String(encoding || "utf8").toLowerCase();
            var ret;
            switch (encoding) {
              case "hex":
                ret = hexWrite(this, string, offset, length);
                break;
              case "utf8":
              case "utf-8":
                ret = utf8Write(this, string, offset, length);
                break;
              case "ascii":
                ret = asciiWrite(this, string, offset, length);
                break;
              case "binary":
                ret = binaryWrite(this, string, offset, length);
                break;
              case "base64":
                ret = base64Write(this, string, offset, length);
                break;
              case "ucs2":
              case "ucs-2":
              case "utf16le":
              case "utf-16le":
                ret = utf16leWrite(this, string, offset, length);
                break;
              default:
                throw new TypeError("Unknown encoding: " + encoding);
            }
            return ret;
          };
          Buffer.prototype.toJSON = function () {
            return {
              type: "Buffer",
              data: Array.prototype.slice.call(this._arr || this, 0),
            };
          };
          function base64Slice(buf, start, end) {
            if (start === 0 && end === buf.length) {
              return base64.fromByteArray(buf);
            } else {
              return base64.fromByteArray(buf.slice(start, end));
            }
          }
          function utf8Slice(buf, start, end) {
            var res = "";
            var tmp = "";
            end = Math.min(buf.length, end);
            for (var i = start; i < end; i++) {
              if (buf[i] <= 127) {
                res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i]);
                tmp = "";
              } else {
                tmp += "%" + buf[i].toString(16);
              }
            }
            return res + decodeUtf8Char(tmp);
          }
          function asciiSlice(buf, start, end) {
            var ret = "";
            end = Math.min(buf.length, end);
            for (var i = start; i < end; i++) {
              ret += String.fromCharCode(buf[i]);
            }
            return ret;
          }
          function binarySlice(buf, start, end) {
            return asciiSlice(buf, start, end);
          }
          function hexSlice(buf, start, end) {
            var len = buf.length;
            if (!start || start < 0) start = 0;
            if (!end || end < 0 || end > len) end = len;
            var out = "";
            for (var i = start; i < end; i++) {
              out += toHex(buf[i]);
            }
            return out;
          }
          function utf16leSlice(buf, start, end) {
            var bytes = buf.slice(start, end);
            var res = "";
            for (var i = 0; i < bytes.length; i += 2) {
              res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
            }
            return res;
          }
          Buffer.prototype.slice = function (start, end) {
            var len = this.length;
            start = ~~start;
            end = end === undefined ? len : ~~end;
            if (start < 0) {
              start += len;
              if (start < 0) start = 0;
            } else if (start > len) {
              start = len;
            }
            if (end < 0) {
              end += len;
              if (end < 0) end = 0;
            } else if (end > len) {
              end = len;
            }
            if (end < start) end = start;
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              return Buffer._augment(this.subarray(start, end));
            } else {
              var sliceLen = end - start;
              var newBuf = new Buffer(sliceLen, undefined, true);
              for (var i = 0; i < sliceLen; i++) {
                newBuf[i] = this[i + start];
              }
              return newBuf;
            }
          };
          function checkOffset(offset, ext, length) {
            if (offset % 1 !== 0 || offset < 0)
              throw new RangeError("offset is not uint");
            if (offset + ext > length)
              throw new RangeError("Trying to access beyond buffer length");
          }
          Buffer.prototype.readUInt8 = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 1, this.length);
            return this[offset];
          };
          Buffer.prototype.readUInt16LE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 2, this.length);
            return this[offset] | (this[offset + 1] << 8);
          };
          Buffer.prototype.readUInt16BE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 2, this.length);
            return (this[offset] << 8) | this[offset + 1];
          };
          Buffer.prototype.readUInt32LE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              (this[offset] |
                (this[offset + 1] << 8) |
                (this[offset + 2] << 16)) +
              this[offset + 3] * 16777216
            );
          };
          Buffer.prototype.readUInt32BE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              this[offset] * 16777216 +
              ((this[offset + 1] << 16) |
                (this[offset + 2] << 8) |
                this[offset + 3])
            );
          };
          Buffer.prototype.readInt8 = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 1, this.length);
            if (!(this[offset] & 128)) return this[offset];
            return (255 - this[offset] + 1) * -1;
          };
          Buffer.prototype.readInt16LE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset] | (this[offset + 1] << 8);
            return val & 32768 ? val | 4294901760 : val;
          };
          Buffer.prototype.readInt16BE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 2, this.length);
            var val = this[offset + 1] | (this[offset] << 8);
            return val & 32768 ? val | 4294901760 : val;
          };
          Buffer.prototype.readInt32LE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              this[offset] |
              (this[offset + 1] << 8) |
              (this[offset + 2] << 16) |
              (this[offset + 3] << 24)
            );
          };
          Buffer.prototype.readInt32BE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return (
              (this[offset] << 24) |
              (this[offset + 1] << 16) |
              (this[offset + 2] << 8) |
              this[offset + 3]
            );
          };
          Buffer.prototype.readFloatLE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, true, 23, 4);
          };
          Buffer.prototype.readFloatBE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 4, this.length);
            return ieee754.read(this, offset, false, 23, 4);
          };
          Buffer.prototype.readDoubleLE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, true, 52, 8);
          };
          Buffer.prototype.readDoubleBE = function (offset, noAssert) {
            if (!noAssert) checkOffset(offset, 8, this.length);
            return ieee754.read(this, offset, false, 52, 8);
          };
          function checkInt(buf, value, offset, ext, max, min) {
            if (!Buffer.isBuffer(buf))
              throw new TypeError("buffer must be a Buffer instance");
            if (value > max || value < min)
              throw new TypeError("value is out of bounds");
            if (offset + ext > buf.length)
              throw new TypeError("index out of range");
          }
          Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
            if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
            this[offset] = value;
            return offset + 1;
          };
          function objectWriteUInt16(buf, value, offset, littleEndian) {
            if (value < 0) value = 65535 + value + 1;
            for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
              buf[offset + i] =
                (value & (255 << (8 * (littleEndian ? i : 1 - i)))) >>>
                ((littleEndian ? i : 1 - i) * 8);
            }
          }
          Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value;
              this[offset + 1] = value >>> 8;
            } else objectWriteUInt16(this, value, offset, true);
            return offset + 2;
          };
          Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value >>> 8;
              this[offset + 1] = value;
            } else objectWriteUInt16(this, value, offset, false);
            return offset + 2;
          };
          function objectWriteUInt32(buf, value, offset, littleEndian) {
            if (value < 0) value = 4294967295 + value + 1;
            for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
              buf[offset + i] =
                (value >>> ((littleEndian ? i : 3 - i) * 8)) & 255;
            }
          }
          Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset + 3] = value >>> 24;
              this[offset + 2] = value >>> 16;
              this[offset + 1] = value >>> 8;
              this[offset] = value;
            } else objectWriteUInt32(this, value, offset, true);
            return offset + 4;
          };
          Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value >>> 24;
              this[offset + 1] = value >>> 16;
              this[offset + 2] = value >>> 8;
              this[offset + 3] = value;
            } else objectWriteUInt32(this, value, offset, false);
            return offset + 4;
          };
          Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
            if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
            if (value < 0) value = 255 + value + 1;
            this[offset] = value;
            return offset + 1;
          };
          Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value;
              this[offset + 1] = value >>> 8;
            } else objectWriteUInt16(this, value, offset, true);
            return offset + 2;
          };
          Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value >>> 8;
              this[offset + 1] = value;
            } else objectWriteUInt16(this, value, offset, false);
            return offset + 2;
          };
          Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert)
              checkInt(this, value, offset, 4, 2147483647, -2147483648);
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value;
              this[offset + 1] = value >>> 8;
              this[offset + 2] = value >>> 16;
              this[offset + 3] = value >>> 24;
            } else objectWriteUInt32(this, value, offset, true);
            return offset + 4;
          };
          Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
            value = +value;
            offset = offset >>> 0;
            if (!noAssert)
              checkInt(this, value, offset, 4, 2147483647, -2147483648);
            if (value < 0) value = 4294967295 + value + 1;
            if (Buffer.TYPED_ARRAY_SUPPORT) {
              this[offset] = value >>> 24;
              this[offset + 1] = value >>> 16;
              this[offset + 2] = value >>> 8;
              this[offset + 3] = value;
            } else objectWriteUInt32(this, value, offset, false);
            return offset + 4;
          };
          function checkIEEE754(buf, value, offset, ext, max, min) {
            if (value > max || value < min)
              throw new TypeError("value is out of bounds");
            if (offset + ext > buf.length)
              throw new TypeError("index out of range");
          }
          function writeFloat(buf, value, offset, littleEndian, noAssert) {
            if (!noAssert)
              checkIEEE754(
                buf,
                value,
                offset,
                4,
                3.4028234663852886e38,
                -3.4028234663852886e38
              );
            ieee754.write(buf, value, offset, littleEndian, 23, 4);
            return offset + 4;
          }
          Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
            return writeFloat(this, value, offset, true, noAssert);
          };
          Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
            return writeFloat(this, value, offset, false, noAssert);
          };
          function writeDouble(buf, value, offset, littleEndian, noAssert) {
            if (!noAssert)
              checkIEEE754(
                buf,
                value,
                offset,
                8,
                1.7976931348623157e308,
                -1.7976931348623157e308
              );
            ieee754.write(buf, value, offset, littleEndian, 52, 8);
            return offset + 8;
          }
          Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
            return writeDouble(this, value, offset, true, noAssert);
          };
          Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
            return writeDouble(this, value, offset, false, noAssert);
          };
          Buffer.prototype.copy = function (target, target_start, start, end) {
            var source = this;
            if (!start) start = 0;
            if (!end && end !== 0) end = this.length;
            if (!target_start) target_start = 0;
            if (end === start) return;
            if (target.length === 0 || source.length === 0) return;
            if (end < start) throw new TypeError("sourceEnd < sourceStart");
            if (target_start < 0 || target_start >= target.length)
              throw new TypeError("targetStart out of bounds");
            if (start < 0 || start >= source.length)
              throw new TypeError("sourceStart out of bounds");
            if (end < 0 || end > source.length)
              throw new TypeError("sourceEnd out of bounds");
            if (end > this.length) end = this.length;
            if (target.length - target_start < end - start)
              end = target.length - target_start + start;
            var len = end - start;
            if (len < 1e3 || !Buffer.TYPED_ARRAY_SUPPORT) {
              for (var i = 0; i < len; i++) {
                target[i + target_start] = this[i + start];
              }
            } else {
              target._set(this.subarray(start, start + len), target_start);
            }
          };
          Buffer.prototype.fill = function (value, start, end) {
            if (!value) value = 0;
            if (!start) start = 0;
            if (!end) end = this.length;
            if (end < start) throw new TypeError("end < start");
            if (end === start) return;
            if (this.length === 0) return;
            if (start < 0 || start >= this.length)
              throw new TypeError("start out of bounds");
            if (end < 0 || end > this.length)
              throw new TypeError("end out of bounds");
            var i;
            if (typeof value === "number") {
              for (i = start; i < end; i++) {
                this[i] = value;
              }
            } else {
              var bytes = utf8ToBytes(value.toString());
              var len = bytes.length;
              for (i = start; i < end; i++) {
                this[i] = bytes[i % len];
              }
            }
            return this;
          };
          Buffer.prototype.toArrayBuffer = function () {
            if (typeof Uint8Array !== "undefined") {
              if (Buffer.TYPED_ARRAY_SUPPORT) {
                return new Buffer(this).buffer;
              } else {
                var buf = new Uint8Array(this.length);
                for (var i = 0, len = buf.length; i < len; i += 1) {
                  buf[i] = this[i];
                }
                return buf.buffer;
              }
            } else {
              throw new TypeError(
                "Buffer.toArrayBuffer not supported in this browser"
              );
            }
          };
          var BP = Buffer.prototype;
          Buffer._augment = function (arr) {
            arr.constructor = Buffer;
            arr._isBuffer = true;
            arr._get = arr.get;
            arr._set = arr.set;
            arr.get = BP.get;
            arr.set = BP.set;
            arr.write = BP.write;
            arr.toString = BP.toString;
            arr.toLocaleString = BP.toString;
            arr.toJSON = BP.toJSON;
            arr.equals = BP.equals;
            arr.compare = BP.compare;
            arr.copy = BP.copy;
            arr.slice = BP.slice;
            arr.readUInt8 = BP.readUInt8;
            arr.readUInt16LE = BP.readUInt16LE;
            arr.readUInt16BE = BP.readUInt16BE;
            arr.readUInt32LE = BP.readUInt32LE;
            arr.readUInt32BE = BP.readUInt32BE;
            arr.readInt8 = BP.readInt8;
            arr.readInt16LE = BP.readInt16LE;
            arr.readInt16BE = BP.readInt16BE;
            arr.readInt32LE = BP.readInt32LE;
            arr.readInt32BE = BP.readInt32BE;
            arr.readFloatLE = BP.readFloatLE;
            arr.readFloatBE = BP.readFloatBE;
            arr.readDoubleLE = BP.readDoubleLE;
            arr.readDoubleBE = BP.readDoubleBE;
            arr.writeUInt8 = BP.writeUInt8;
            arr.writeUInt16LE = BP.writeUInt16LE;
            arr.writeUInt16BE = BP.writeUInt16BE;
            arr.writeUInt32LE = BP.writeUInt32LE;
            arr.writeUInt32BE = BP.writeUInt32BE;
            arr.writeInt8 = BP.writeInt8;
            arr.writeInt16LE = BP.writeInt16LE;
            arr.writeInt16BE = BP.writeInt16BE;
            arr.writeInt32LE = BP.writeInt32LE;
            arr.writeInt32BE = BP.writeInt32BE;
            arr.writeFloatLE = BP.writeFloatLE;
            arr.writeFloatBE = BP.writeFloatBE;
            arr.writeDoubleLE = BP.writeDoubleLE;
            arr.writeDoubleBE = BP.writeDoubleBE;
            arr.fill = BP.fill;
            arr.inspect = BP.inspect;
            arr.toArrayBuffer = BP.toArrayBuffer;
            return arr;
          };
          var INVALID_BASE64_RE = /[^+\/0-9A-z]/g;
          function base64clean(str) {
            str = stringtrim(str).replace(INVALID_BASE64_RE, "");
            while (str.length % 4 !== 0) {
              str = str + "=";
            }
            return str;
          }
          function stringtrim(str) {
            if (str.trim) return str.trim();
            return str.replace(/^\s+|\s+$/g, "");
          }
          function isArrayish(subject) {
            return (
              isArray(subject) ||
              Buffer.isBuffer(subject) ||
              (subject &&
                typeof subject === "object" &&
                typeof subject.length === "number")
            );
          }
          function toHex(n) {
            if (n < 16) return "0" + n.toString(16);
            return n.toString(16);
          }
          function utf8ToBytes(str) {
            var byteArray = [];
            for (var i = 0; i < str.length; i++) {
              var b = str.charCodeAt(i);
              if (b <= 127) {
                byteArray.push(b);
              } else {
                var start = i;
                if (b >= 55296 && b <= 57343) i++;
                var h = encodeURIComponent(str.slice(start, i + 1))
                  .substr(1)
                  .split("%");
                for (var j = 0; j < h.length; j++) {
                  byteArray.push(parseInt(h[j], 16));
                }
              }
            }
            return byteArray;
          }
          function asciiToBytes(str) {
            var byteArray = [];
            for (var i = 0; i < str.length; i++) {
              byteArray.push(str.charCodeAt(i) & 255);
            }
            return byteArray;
          }
          function utf16leToBytes(str) {
            var c, hi, lo;
            var byteArray = [];
            for (var i = 0; i < str.length; i++) {
              c = str.charCodeAt(i);
              hi = c >> 8;
              lo = c % 256;
              byteArray.push(lo);
              byteArray.push(hi);
            }
            return byteArray;
          }
          function base64ToBytes(str) {
            return base64.toByteArray(str);
          }
          function blitBuffer(src, dst, offset, length) {
            for (var i = 0; i < length; i++) {
              if (i + offset >= dst.length || i >= src.length) break;
              dst[i + offset] = src[i];
            }
            return i;
          }
          function decodeUtf8Char(str) {
            try {
              return decodeURIComponent(str);
            } catch (err) {
              return String.fromCharCode(65533);
            }
          }
        },
        { "base64-js": 79, ieee754: 80, "is-array": 81 },
      ],
      79: [
        function (require, module, exports) {
          var lookup =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
          (function (exports) {
            "use strict";
            var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
            var PLUS = "+".charCodeAt(0);
            var SLASH = "/".charCodeAt(0);
            var NUMBER = "0".charCodeAt(0);
            var LOWER = "a".charCodeAt(0);
            var UPPER = "A".charCodeAt(0);
            function decode(elt) {
              var code = elt.charCodeAt(0);
              if (code === PLUS) return 62;
              if (code === SLASH) return 63;
              if (code < NUMBER) return -1;
              if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
              if (code < UPPER + 26) return code - UPPER;
              if (code < LOWER + 26) return code - LOWER + 26;
            }
            function b64ToByteArray(b64) {
              var i, j, l, tmp, placeHolders, arr;
              if (b64.length % 4 > 0) {
                throw new Error(
                  "Invalid string. Length must be a multiple of 4"
                );
              }
              var len = b64.length;
              placeHolders =
                "=" === b64.charAt(len - 2)
                  ? 2
                  : "=" === b64.charAt(len - 1)
                  ? 1
                  : 0;
              arr = new Arr((b64.length * 3) / 4 - placeHolders);
              l = placeHolders > 0 ? b64.length - 4 : b64.length;
              var L = 0;
              function push(v) {
                arr[L++] = v;
              }
              for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp =
                  (decode(b64.charAt(i)) << 18) |
                  (decode(b64.charAt(i + 1)) << 12) |
                  (decode(b64.charAt(i + 2)) << 6) |
                  decode(b64.charAt(i + 3));
                push((tmp & 16711680) >> 16);
                push((tmp & 65280) >> 8);
                push(tmp & 255);
              }
              if (placeHolders === 2) {
                tmp =
                  (decode(b64.charAt(i)) << 2) |
                  (decode(b64.charAt(i + 1)) >> 4);
                push(tmp & 255);
              } else if (placeHolders === 1) {
                tmp =
                  (decode(b64.charAt(i)) << 10) |
                  (decode(b64.charAt(i + 1)) << 4) |
                  (decode(b64.charAt(i + 2)) >> 2);
                push((tmp >> 8) & 255);
                push(tmp & 255);
              }
              return arr;
            }
            function uint8ToBase64(uint8) {
              var i,
                extraBytes = uint8.length % 3,
                output = "",
                temp,
                length;
              function encode(num) {
                return lookup.charAt(num);
              }
              function tripletToBase64(num) {
                return (
                  encode((num >> 18) & 63) +
                  encode((num >> 12) & 63) +
                  encode((num >> 6) & 63) +
                  encode(num & 63)
                );
              }
              for (
                i = 0, length = uint8.length - extraBytes;
                i < length;
                i += 3
              ) {
                temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
                output += tripletToBase64(temp);
              }
              switch (extraBytes) {
                case 1:
                  temp = uint8[uint8.length - 1];
                  output += encode(temp >> 2);
                  output += encode((temp << 4) & 63);
                  output += "==";
                  break;
                case 2:
                  temp =
                    (uint8[uint8.length - 2] << 8) + uint8[uint8.length - 1];
                  output += encode(temp >> 10);
                  output += encode((temp >> 4) & 63);
                  output += encode((temp << 2) & 63);
                  output += "=";
                  break;
              }
              return output;
            }
            exports.toByteArray = b64ToByteArray;
            exports.fromByteArray = uint8ToBase64;
          })(typeof exports === "undefined" ? (this.base64js = {}) : exports);
        },
        {},
      ],
      80: [
        function (require, module, exports) {
          exports.read = function (buffer, offset, isLE, mLen, nBytes) {
            var e,
              m,
              eLen = nBytes * 8 - mLen - 1,
              eMax = (1 << eLen) - 1,
              eBias = eMax >> 1,
              nBits = -7,
              i = isLE ? nBytes - 1 : 0,
              d = isLE ? -1 : 1,
              s = buffer[offset + i];
            i += d;
            e = s & ((1 << -nBits) - 1);
            s >>= -nBits;
            nBits += eLen;
            for (
              ;
              nBits > 0;
              e = e * 256 + buffer[offset + i], i += d, nBits -= 8
            );
            m = e & ((1 << -nBits) - 1);
            e >>= -nBits;
            nBits += mLen;
            for (
              ;
              nBits > 0;
              m = m * 256 + buffer[offset + i], i += d, nBits -= 8
            );
            if (e === 0) {
              e = 1 - eBias;
            } else if (e === eMax) {
              return m ? NaN : (s ? -1 : 1) * Infinity;
            } else {
              m = m + Math.pow(2, mLen);
              e = e - eBias;
            }
            return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
          };
          exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
            var e,
              m,
              c,
              eLen = nBytes * 8 - mLen - 1,
              eMax = (1 << eLen) - 1,
              eBias = eMax >> 1,
              rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
              i = isLE ? 0 : nBytes - 1,
              d = isLE ? 1 : -1,
              s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
            value = Math.abs(value);
            if (isNaN(value) || value === Infinity) {
              m = isNaN(value) ? 1 : 0;
              e = eMax;
            } else {
              e = Math.floor(Math.log(value) / Math.LN2);
              if (value * (c = Math.pow(2, -e)) < 1) {
                e--;
                c *= 2;
              }
              if (e + eBias >= 1) {
                value += rt / c;
              } else {
                value += rt * Math.pow(2, 1 - eBias);
              }
              if (value * c >= 2) {
                e++;
                c /= 2;
              }
              if (e + eBias >= eMax) {
                m = 0;
                e = eMax;
              } else if (e + eBias >= 1) {
                m = (value * c - 1) * Math.pow(2, mLen);
                e = e + eBias;
              } else {
                m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
                e = 0;
              }
            }
            for (
              ;
              mLen >= 8;
              buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8
            );
            e = (e << mLen) | m;
            eLen += mLen;
            for (
              ;
              eLen > 0;
              buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8
            );
            buffer[offset + i - d] |= s * 128;
          };
        },
        {},
      ],
      81: [
        function (require, module, exports) {
          var isArray = Array.isArray;
          var str = Object.prototype.toString;
          module.exports =
            isArray ||
            function (val) {
              return !!val && "[object Array]" == str.call(val);
            };
        },
        {},
      ],
      82: [
        function (require, module, exports) {
          if (typeof Object.create === "function") {
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              ctor.prototype = Object.create(superCtor.prototype, {
                constructor: {
                  value: ctor,
                  enumerable: false,
                  writable: true,
                  configurable: true,
                },
              });
            };
          } else {
            module.exports = function inherits(ctor, superCtor) {
              ctor.super_ = superCtor;
              var TempCtor = function () {};
              TempCtor.prototype = superCtor.prototype;
              ctor.prototype = new TempCtor();
              ctor.prototype.constructor = ctor;
            };
          }
        },
        {},
      ],
      83: [
        function (require, module, exports) {
          (function (process) {
            function normalizeArray(parts, allowAboveRoot) {
              var up = 0;
              for (var i = parts.length - 1; i >= 0; i--) {
                var last = parts[i];
                if (last === ".") {
                  parts.splice(i, 1);
                } else if (last === "..") {
                  parts.splice(i, 1);
                  up++;
                } else if (up) {
                  parts.splice(i, 1);
                  up--;
                }
              }
              if (allowAboveRoot) {
                for (; up--; up) {
                  parts.unshift("..");
                }
              }
              return parts;
            }
            var splitPathRe =
              /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
            var splitPath = function (filename) {
              return splitPathRe.exec(filename).slice(1);
            };
            exports.resolve = function () {
              var resolvedPath = "",
                resolvedAbsolute = false;
              for (
                var i = arguments.length - 1;
                i >= -1 && !resolvedAbsolute;
                i--
              ) {
                var path = i >= 0 ? arguments[i] : process.cwd();
                if (typeof path !== "string") {
                  throw new TypeError(
                    "Arguments to path.resolve must be strings"
                  );
                } else if (!path) {
                  continue;
                }
                resolvedPath = path + "/" + resolvedPath;
                resolvedAbsolute = path.charAt(0) === "/";
              }
              resolvedPath = normalizeArray(
                filter(resolvedPath.split("/"), function (p) {
                  return !!p;
                }),
                !resolvedAbsolute
              ).join("/");
              return (resolvedAbsolute ? "/" : "") + resolvedPath || ".";
            };
            exports.normalize = function (path) {
              var isAbsolute = exports.isAbsolute(path),
                trailingSlash = substr(path, -1) === "/";
              path = normalizeArray(
                filter(path.split("/"), function (p) {
                  return !!p;
                }),
                !isAbsolute
              ).join("/");
              if (!path && !isAbsolute) {
                path = ".";
              }
              if (path && trailingSlash) {
                path += "/";
              }
              return (isAbsolute ? "/" : "") + path;
            };
            exports.isAbsolute = function (path) {
              return path.charAt(0) === "/";
            };
            exports.join = function () {
              var paths = Array.prototype.slice.call(arguments, 0);
              return exports.normalize(
                filter(paths, function (p, index) {
                  if (typeof p !== "string") {
                    throw new TypeError(
                      "Arguments to path.join must be strings"
                    );
                  }
                  return p;
                }).join("/")
              );
            };
            exports.relative = function (from, to) {
              from = exports.resolve(from).substr(1);
              to = exports.resolve(to).substr(1);
              function trim(arr) {
                var start = 0;
                for (; start < arr.length; start++) {
                  if (arr[start] !== "") break;
                }
                var end = arr.length - 1;
                for (; end >= 0; end--) {
                  if (arr[end] !== "") break;
                }
                if (start > end) return [];
                return arr.slice(start, end - start + 1);
              }
              var fromParts = trim(from.split("/"));
              var toParts = trim(to.split("/"));
              var length = Math.min(fromParts.length, toParts.length);
              var samePartsLength = length;
              for (var i = 0; i < length; i++) {
                if (fromParts[i] !== toParts[i]) {
                  samePartsLength = i;
                  break;
                }
              }
              var outputParts = [];
              for (var i = samePartsLength; i < fromParts.length; i++) {
                outputParts.push("..");
              }
              outputParts = outputParts.concat(toParts.slice(samePartsLength));
              return outputParts.join("/");
            };
            exports.sep = "/";
            exports.delimiter = ":";
            exports.dirname = function (path) {
              var result = splitPath(path),
                root = result[0],
                dir = result[1];
              if (!root && !dir) {
                return ".";
              }
              if (dir) {
                dir = dir.substr(0, dir.length - 1);
              }
              return root + dir;
            };
            exports.basename = function (path, ext) {
              var f = splitPath(path)[2];
              if (ext && f.substr(-1 * ext.length) === ext) {
                f = f.substr(0, f.length - ext.length);
              }
              return f;
            };
            exports.extname = function (path) {
              return splitPath(path)[3];
            };
            function filter(xs, f) {
              if (xs.filter) return xs.filter(f);
              var res = [];
              for (var i = 0; i < xs.length; i++) {
                if (f(xs[i], i, xs)) res.push(xs[i]);
              }
              return res;
            }
            var substr =
              "ab".substr(-1) === "b"
                ? function (str, start, len) {
                    return str.substr(start, len);
                  }
                : function (str, start, len) {
                    if (start < 0) start = str.length + start;
                    return str.substr(start, len);
                  };
          }.call(this, require("_process")));
        },
        { _process: 84 },
      ],
      84: [
        function (require, module, exports) {
          var process = (module.exports = {});
          process.nextTick = (function () {
            var canSetImmediate =
              typeof window !== "undefined" && window.setImmediate;
            var canMutationObserver =
              typeof window !== "undefined" && window.MutationObserver;
            var canPost =
              typeof window !== "undefined" &&
              window.postMessage &&
              window.addEventListener;
            if (canSetImmediate) {
              return function (f) {
                return window.setImmediate(f);
              };
            }
            var queue = [];
            if (canMutationObserver) {
              var hiddenDiv = document.createElement("div");
              var observer = new MutationObserver(function () {
                var queueList = queue.slice();
                queue.length = 0;
                queueList.forEach(function (fn) {
                  fn();
                });
              });
              observer.observe(hiddenDiv, { attributes: true });
              return function nextTick(fn) {
                if (!queue.length) {
                  hiddenDiv.setAttribute("yes", "no");
                }
                queue.push(fn);
              };
            }
            if (canPost) {
              window.addEventListener(
                "message",
                function (ev) {
                  var source = ev.source;
                  if (
                    (source === window || source === null) &&
                    ev.data === "process-tick"
                  ) {
                    ev.stopPropagation();
                    if (queue.length > 0) {
                      var fn = queue.shift();
                      fn();
                    }
                  }
                },
                true
              );
              return function nextTick(fn) {
                queue.push(fn);
                window.postMessage("process-tick", "*");
              };
            }
            return function nextTick(fn) {
              setTimeout(fn, 0);
            };
          })();
          process.title = "browser";
          process.browser = true;
          process.env = {};
          process.argv = [];
          function noop() {}
          process.on = noop;
          process.addListener = noop;
          process.once = noop;
          process.off = noop;
          process.removeListener = noop;
          process.removeAllListeners = noop;
          process.emit = noop;
          process.binding = function (name) {
            throw new Error("process.binding is not supported");
          };
          process.cwd = function () {
            return "/";
          };
          process.chdir = function (dir) {
            throw new Error("process.chdir is not supported");
          };
        },
        {},
      ],
      85: [
        function (require, module, exports) {
          module.exports = function isBuffer(arg) {
            return (
              arg &&
              typeof arg === "object" &&
              typeof arg.copy === "function" &&
              typeof arg.fill === "function" &&
              typeof arg.readUInt8 === "function"
            );
          };
        },
        {},
      ],
      86: [
        function (require, module, exports) {
          (function (process, global) {
            var formatRegExp = /%[sdj%]/g;
            exports.format = function (f) {
              if (!isString(f)) {
                var objects = [];
                for (var i = 0; i < arguments.length; i++) {
                  objects.push(inspect(arguments[i]));
                }
                return objects.join(" ");
              }
              var i = 1;
              var args = arguments;
              var len = args.length;
              var str = String(f).replace(formatRegExp, function (x) {
                if (x === "%%") return "%";
                if (i >= len) return x;
                switch (x) {
                  case "%s":
                    return String(args[i++]);
                  case "%d":
                    return Number(args[i++]);
                  case "%j":
                    try {
                      return JSON.stringify(args[i++]);
                    } catch (_) {
                      return "[Circular]";
                    }
                  default:
                    return x;
                }
              });
              for (var x = args[i]; i < len; x = args[++i]) {
                if (isNull(x) || !isObject(x)) {
                  str += " " + x;
                } else {
                  str += " " + inspect(x);
                }
              }
              return str;
            };
            exports.deprecate = function (fn, msg) {
              if (isUndefined(global.process)) {
                return function () {
                  return exports.deprecate(fn, msg).apply(this, arguments);
                };
              }
              if (process.noDeprecation === true) {
                return fn;
              }
              var warned = false;
              function deprecated() {
                if (!warned) {
                  if (process.throwDeprecation) {
                    throw new Error(msg);
                  } else if (process.traceDeprecation) {
                    console.trace(msg);
                  } else {
                    console.error(msg);
                  }
                  warned = true;
                }
                return fn.apply(this, arguments);
              }
              return deprecated;
            };
            var debugs = {};
            var debugEnviron;
            exports.debuglog = function (set) {
              if (isUndefined(debugEnviron))
                debugEnviron = process.env.NODE_DEBUG || "";
              set = set.toUpperCase();
              if (!debugs[set]) {
                if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
                  var pid = process.pid;
                  debugs[set] = function () {
                    var msg = exports.format.apply(exports, arguments);
                    console.error("%s %d: %s", set, pid, msg);
                  };
                } else {
                  debugs[set] = function () {};
                }
              }
              return debugs[set];
            };
            function inspect(obj, opts) {
              var ctx = { seen: [], stylize: stylizeNoColor };
              if (arguments.length >= 3) ctx.depth = arguments[2];
              if (arguments.length >= 4) ctx.colors = arguments[3];
              if (isBoolean(opts)) {
                ctx.showHidden = opts;
              } else if (opts) {
                exports._extend(ctx, opts);
              }
              if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
              if (isUndefined(ctx.depth)) ctx.depth = 2;
              if (isUndefined(ctx.colors)) ctx.colors = false;
              if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
              if (ctx.colors) ctx.stylize = stylizeWithColor;
              return formatValue(ctx, obj, ctx.depth);
            }
            exports.inspect = inspect;
            inspect.colors = {
              bold: [1, 22],
              italic: [3, 23],
              underline: [4, 24],
              inverse: [7, 27],
              white: [37, 39],
              grey: [90, 39],
              black: [30, 39],
              blue: [34, 39],
              cyan: [36, 39],
              green: [32, 39],
              magenta: [35, 39],
              red: [31, 39],
              yellow: [33, 39],
            };
            inspect.styles = {
              special: "cyan",
              number: "yellow",
              boolean: "yellow",
              undefined: "grey",
              null: "bold",
              string: "green",
              date: "magenta",
              regexp: "red",
            };
            function stylizeWithColor(str, styleType) {
              var style = inspect.styles[styleType];
              if (style) {
                return (
                  "[" +
                  inspect.colors[style][0] +
                  "m" +
                  str +
                  "[" +
                  inspect.colors[style][1] +
                  "m"
                );
              } else {
                return str;
              }
            }
            function stylizeNoColor(str, styleType) {
              return str;
            }
            function arrayToHash(array) {
              var hash = {};
              array.forEach(function (val, idx) {
                hash[val] = true;
              });
              return hash;
            }
            function formatValue(ctx, value, recurseTimes) {
              if (
                ctx.customInspect &&
                value &&
                isFunction(value.inspect) &&
                value.inspect !== exports.inspect &&
                !(value.constructor && value.constructor.prototype === value)
              ) {
                var ret = value.inspect(recurseTimes, ctx);
                if (!isString(ret)) {
                  ret = formatValue(ctx, ret, recurseTimes);
                }
                return ret;
              }
              var primitive = formatPrimitive(ctx, value);
              if (primitive) {
                return primitive;
              }
              var keys = Object.keys(value);
              var visibleKeys = arrayToHash(keys);
              if (ctx.showHidden) {
                keys = Object.getOwnPropertyNames(value);
              }
              if (
                isError(value) &&
                (keys.indexOf("message") >= 0 ||
                  keys.indexOf("description") >= 0)
              ) {
                return formatError(value);
              }
              if (keys.length === 0) {
                if (isFunction(value)) {
                  var name = value.name ? ": " + value.name : "";
                  return ctx.stylize("[Function" + name + "]", "special");
                }
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    "regexp"
                  );
                }
                if (isDate(value)) {
                  return ctx.stylize(
                    Date.prototype.toString.call(value),
                    "date"
                  );
                }
                if (isError(value)) {
                  return formatError(value);
                }
              }
              var base = "",
                array = false,
                braces = ["{", "}"];
              if (isArray(value)) {
                array = true;
                braces = ["[", "]"];
              }
              if (isFunction(value)) {
                var n = value.name ? ": " + value.name : "";
                base = " [Function" + n + "]";
              }
              if (isRegExp(value)) {
                base = " " + RegExp.prototype.toString.call(value);
              }
              if (isDate(value)) {
                base = " " + Date.prototype.toUTCString.call(value);
              }
              if (isError(value)) {
                base = " " + formatError(value);
              }
              if (keys.length === 0 && (!array || value.length == 0)) {
                return braces[0] + base + braces[1];
              }
              if (recurseTimes < 0) {
                if (isRegExp(value)) {
                  return ctx.stylize(
                    RegExp.prototype.toString.call(value),
                    "regexp"
                  );
                } else {
                  return ctx.stylize("[Object]", "special");
                }
              }
              ctx.seen.push(value);
              var output;
              if (array) {
                output = formatArray(
                  ctx,
                  value,
                  recurseTimes,
                  visibleKeys,
                  keys
                );
              } else {
                output = keys.map(function (key) {
                  return formatProperty(
                    ctx,
                    value,
                    recurseTimes,
                    visibleKeys,
                    key,
                    array
                  );
                });
              }
              ctx.seen.pop();
              return reduceToSingleString(output, base, braces);
            }
            function formatPrimitive(ctx, value) {
              if (isUndefined(value))
                return ctx.stylize("undefined", "undefined");
              if (isString(value)) {
                var simple =
                  "'" +
                  JSON.stringify(value)
                    .replace(/^"|"$/g, "")
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"') +
                  "'";
                return ctx.stylize(simple, "string");
              }
              if (isNumber(value)) return ctx.stylize("" + value, "number");
              if (isBoolean(value)) return ctx.stylize("" + value, "boolean");
              if (isNull(value)) return ctx.stylize("null", "null");
            }
            function formatError(value) {
              return "[" + Error.prototype.toString.call(value) + "]";
            }
            function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
              var output = [];
              for (var i = 0, l = value.length; i < l; ++i) {
                if (hasOwnProperty(value, String(i))) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      String(i),
                      true
                    )
                  );
                } else {
                  output.push("");
                }
              }
              keys.forEach(function (key) {
                if (!key.match(/^\d+$/)) {
                  output.push(
                    formatProperty(
                      ctx,
                      value,
                      recurseTimes,
                      visibleKeys,
                      key,
                      true
                    )
                  );
                }
              });
              return output;
            }
            function formatProperty(
              ctx,
              value,
              recurseTimes,
              visibleKeys,
              key,
              array
            ) {
              var name, str, desc;
              desc = Object.getOwnPropertyDescriptor(value, key) || {
                value: value[key],
              };
              if (desc.get) {
                if (desc.set) {
                  str = ctx.stylize("[Getter/Setter]", "special");
                } else {
                  str = ctx.stylize("[Getter]", "special");
                }
              } else {
                if (desc.set) {
                  str = ctx.stylize("[Setter]", "special");
                }
              }
              if (!hasOwnProperty(visibleKeys, key)) {
                name = "[" + key + "]";
              }
              if (!str) {
                if (ctx.seen.indexOf(desc.value) < 0) {
                  if (isNull(recurseTimes)) {
                    str = formatValue(ctx, desc.value, null);
                  } else {
                    str = formatValue(ctx, desc.value, recurseTimes - 1);
                  }
                  if (str.indexOf("\n") > -1) {
                    if (array) {
                      str = str
                        .split("\n")
                        .map(function (line) {
                          return "  " + line;
                        })
                        .join("\n")
                        .substr(2);
                    } else {
                      str =
                        "\n" +
                        str
                          .split("\n")
                          .map(function (line) {
                            return "   " + line;
                          })
                          .join("\n");
                    }
                  }
                } else {
                  str = ctx.stylize("[Circular]", "special");
                }
              }
              if (isUndefined(name)) {
                if (array && key.match(/^\d+$/)) {
                  return str;
                }
                name = JSON.stringify("" + key);
                if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
                  name = name.substr(1, name.length - 2);
                  name = ctx.stylize(name, "name");
                } else {
                  name = name
                    .replace(/'/g, "\\'")
                    .replace(/\\"/g, '"')
                    .replace(/(^"|"$)/g, "'");
                  name = ctx.stylize(name, "string");
                }
              }
              return name + ": " + str;
            }
            function reduceToSingleString(output, base, braces) {
              var numLinesEst = 0;
              var length = output.reduce(function (prev, cur) {
                numLinesEst++;
                if (cur.indexOf("\n") >= 0) numLinesEst++;
                return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
              }, 0);
              if (length > 60) {
                return (
                  braces[0] +
                  (base === "" ? "" : base + "\n ") +
                  " " +
                  output.join(",\n  ") +
                  " " +
                  braces[1]
                );
              }
              return (
                braces[0] + base + " " + output.join(", ") + " " + braces[1]
              );
            }
            function isArray(ar) {
              return Array.isArray(ar);
            }
            exports.isArray = isArray;
            function isBoolean(arg) {
              return typeof arg === "boolean";
            }
            exports.isBoolean = isBoolean;
            function isNull(arg) {
              return arg === null;
            }
            exports.isNull = isNull;
            function isNullOrUndefined(arg) {
              return arg == null;
            }
            exports.isNullOrUndefined = isNullOrUndefined;
            function isNumber(arg) {
              return typeof arg === "number";
            }
            exports.isNumber = isNumber;
            function isString(arg) {
              return typeof arg === "string";
            }
            exports.isString = isString;
            function isSymbol(arg) {
              return typeof arg === "symbol";
            }
            exports.isSymbol = isSymbol;
            function isUndefined(arg) {
              return arg === void 0;
            }
            exports.isUndefined = isUndefined;
            function isRegExp(re) {
              return isObject(re) && objectToString(re) === "[object RegExp]";
            }
            exports.isRegExp = isRegExp;
            function isObject(arg) {
              return typeof arg === "object" && arg !== null;
            }
            exports.isObject = isObject;
            function isDate(d) {
              return isObject(d) && objectToString(d) === "[object Date]";
            }
            exports.isDate = isDate;
            function isError(e) {
              return (
                isObject(e) &&
                (objectToString(e) === "[object Error]" || e instanceof Error)
              );
            }
            exports.isError = isError;
            function isFunction(arg) {
              return typeof arg === "function";
            }
            exports.isFunction = isFunction;
            function isPrimitive(arg) {
              return (
                arg === null ||
                typeof arg === "boolean" ||
                typeof arg === "number" ||
                typeof arg === "string" ||
                typeof arg === "symbol" ||
                typeof arg === "undefined"
              );
            }
            exports.isPrimitive = isPrimitive;
            exports.isBuffer = require("./support/isBuffer");
            function objectToString(o) {
              return Object.prototype.toString.call(o);
            }
            function pad(n) {
              return n < 10 ? "0" + n.toString(10) : n.toString(10);
            }
            var months = [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ];
            function timestamp() {
              var d = new Date();
              var time = [
                pad(d.getHours()),
                pad(d.getMinutes()),
                pad(d.getSeconds()),
              ].join(":");
              return [d.getDate(), months[d.getMonth()], time].join(" ");
            }
            exports.log = function () {
              console.log(
                "%s - %s",
                timestamp(),
                exports.format.apply(exports, arguments)
              );
            };
            exports.inherits = require("inherits");
            exports._extend = function (origin, add) {
              if (!add || !isObject(add)) return origin;
              var keys = Object.keys(add);
              var i = keys.length;
              while (i--) {
                origin[keys[i]] = add[keys[i]];
              }
              return origin;
            };
            function hasOwnProperty(obj, prop) {
              return Object.prototype.hasOwnProperty.call(obj, prop);
            }
          }.call(
            this,
            require("_process"),
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        { "./support/isBuffer": 85, _process: 84, inherits: 82 },
      ],
      87: [
        function (require, module, exports) {
          (function (root, factory) {
            "use strict";
            if (typeof define === "function" && define.amd) {
              define(["exports"], factory);
            } else if (typeof exports !== "undefined") {
              factory(exports);
            } else {
              factory((root.estraverse = {}));
            }
          })(this, function (exports) {
            "use strict";
            var Syntax,
              isArray,
              VisitorOption,
              VisitorKeys,
              objectCreate,
              objectKeys,
              BREAK,
              SKIP,
              REMOVE;
            function ignoreJSHintError() {}
            isArray = Array.isArray;
            if (!isArray) {
              isArray = function isArray(array) {
                return (
                  Object.prototype.toString.call(array) === "[object Array]"
                );
              };
            }
            function deepCopy(obj) {
              var ret = {},
                key,
                val;
              for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                  val = obj[key];
                  if (typeof val === "object" && val !== null) {
                    ret[key] = deepCopy(val);
                  } else {
                    ret[key] = val;
                  }
                }
              }
              return ret;
            }
            function shallowCopy(obj) {
              var ret = {},
                key;
              for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                  ret[key] = obj[key];
                }
              }
              return ret;
            }
            ignoreJSHintError(shallowCopy);
            function upperBound(array, func) {
              var diff, len, i, current;
              len = array.length;
              i = 0;
              while (len) {
                diff = len >>> 1;
                current = i + diff;
                if (func(array[current])) {
                  len = diff;
                } else {
                  i = current + 1;
                  len -= diff + 1;
                }
              }
              return i;
            }
            function lowerBound(array, func) {
              var diff, len, i, current;
              len = array.length;
              i = 0;
              while (len) {
                diff = len >>> 1;
                current = i + diff;
                if (func(array[current])) {
                  i = current + 1;
                  len -= diff + 1;
                } else {
                  len = diff;
                }
              }
              return i;
            }
            ignoreJSHintError(lowerBound);
            objectCreate =
              Object.create ||
              (function () {
                function F() {}
                return function (o) {
                  F.prototype = o;
                  return new F();
                };
              })();
            objectKeys =
              Object.keys ||
              function (o) {
                var keys = [],
                  key;
                for (key in o) {
                  keys.push(key);
                }
                return keys;
              };
            function extend(to, from) {
              objectKeys(from).forEach(function (key) {
                to[key] = from[key];
              });
              return to;
            }
            Syntax = {
              AssignmentExpression: "AssignmentExpression",
              ArrayExpression: "ArrayExpression",
              ArrayPattern: "ArrayPattern",
              ArrowFunctionExpression: "ArrowFunctionExpression",
              BlockStatement: "BlockStatement",
              BinaryExpression: "BinaryExpression",
              BreakStatement: "BreakStatement",
              CallExpression: "CallExpression",
              CatchClause: "CatchClause",
              ClassBody: "ClassBody",
              ClassDeclaration: "ClassDeclaration",
              ClassExpression: "ClassExpression",
              ComprehensionBlock: "ComprehensionBlock",
              ComprehensionExpression: "ComprehensionExpression",
              ConditionalExpression: "ConditionalExpression",
              ContinueStatement: "ContinueStatement",
              DebuggerStatement: "DebuggerStatement",
              DirectiveStatement: "DirectiveStatement",
              DoWhileStatement: "DoWhileStatement",
              EmptyStatement: "EmptyStatement",
              ExportBatchSpecifier: "ExportBatchSpecifier",
              ExportDeclaration: "ExportDeclaration",
              ExportSpecifier: "ExportSpecifier",
              ExpressionStatement: "ExpressionStatement",
              ForStatement: "ForStatement",
              ForInStatement: "ForInStatement",
              ForOfStatement: "ForOfStatement",
              FunctionDeclaration: "FunctionDeclaration",
              FunctionExpression: "FunctionExpression",
              GeneratorExpression: "GeneratorExpression",
              Identifier: "Identifier",
              IfStatement: "IfStatement",
              ImportDeclaration: "ImportDeclaration",
              ImportDefaultSpecifier: "ImportDefaultSpecifier",
              ImportNamespaceSpecifier: "ImportNamespaceSpecifier",
              ImportSpecifier: "ImportSpecifier",
              Literal: "Literal",
              LabeledStatement: "LabeledStatement",
              LogicalExpression: "LogicalExpression",
              MemberExpression: "MemberExpression",
              MethodDefinition: "MethodDefinition",
              ModuleSpecifier: "ModuleSpecifier",
              NewExpression: "NewExpression",
              ObjectExpression: "ObjectExpression",
              ObjectPattern: "ObjectPattern",
              Program: "Program",
              Property: "Property",
              ReturnStatement: "ReturnStatement",
              SequenceExpression: "SequenceExpression",
              SpreadElement: "SpreadElement",
              SwitchStatement: "SwitchStatement",
              SwitchCase: "SwitchCase",
              TaggedTemplateExpression: "TaggedTemplateExpression",
              TemplateElement: "TemplateElement",
              TemplateLiteral: "TemplateLiteral",
              ThisExpression: "ThisExpression",
              ThrowStatement: "ThrowStatement",
              TryStatement: "TryStatement",
              UnaryExpression: "UnaryExpression",
              UpdateExpression: "UpdateExpression",
              VariableDeclaration: "VariableDeclaration",
              VariableDeclarator: "VariableDeclarator",
              WhileStatement: "WhileStatement",
              WithStatement: "WithStatement",
              YieldExpression: "YieldExpression",
            };
            VisitorKeys = {
              AssignmentExpression: ["left", "right"],
              ArrayExpression: ["elements"],
              ArrayPattern: ["elements"],
              ArrowFunctionExpression: ["params", "defaults", "rest", "body"],
              BlockStatement: ["body"],
              BinaryExpression: ["left", "right"],
              BreakStatement: ["label"],
              CallExpression: ["callee", "arguments"],
              CatchClause: ["param", "body"],
              ClassBody: ["body"],
              ClassDeclaration: ["id", "body", "superClass"],
              ClassExpression: ["id", "body", "superClass"],
              ComprehensionBlock: ["left", "right"],
              ComprehensionExpression: ["blocks", "filter", "body"],
              ConditionalExpression: ["test", "consequent", "alternate"],
              ContinueStatement: ["label"],
              DebuggerStatement: [],
              DirectiveStatement: [],
              DoWhileStatement: ["body", "test"],
              EmptyStatement: [],
              ExportBatchSpecifier: [],
              ExportDeclaration: ["declaration", "specifiers", "source"],
              ExportSpecifier: ["id", "name"],
              ExpressionStatement: ["expression"],
              ForStatement: ["init", "test", "update", "body"],
              ForInStatement: ["left", "right", "body"],
              ForOfStatement: ["left", "right", "body"],
              FunctionDeclaration: ["id", "params", "defaults", "rest", "body"],
              FunctionExpression: ["id", "params", "defaults", "rest", "body"],
              GeneratorExpression: ["blocks", "filter", "body"],
              Identifier: [],
              IfStatement: ["test", "consequent", "alternate"],
              ImportDeclaration: ["specifiers", "source"],
              ImportDefaultSpecifier: ["id"],
              ImportNamespaceSpecifier: ["id"],
              ImportSpecifier: ["id", "name"],
              Literal: [],
              LabeledStatement: ["label", "body"],
              LogicalExpression: ["left", "right"],
              MemberExpression: ["object", "property"],
              MethodDefinition: ["key", "value"],
              ModuleSpecifier: [],
              NewExpression: ["callee", "arguments"],
              ObjectExpression: ["properties"],
              ObjectPattern: ["properties"],
              Program: ["body"],
              Property: ["key", "value"],
              ReturnStatement: ["argument"],
              SequenceExpression: ["expressions"],
              SpreadElement: ["argument"],
              SwitchStatement: ["discriminant", "cases"],
              SwitchCase: ["test", "consequent"],
              TaggedTemplateExpression: ["tag", "quasi"],
              TemplateElement: [],
              TemplateLiteral: ["quasis", "expressions"],
              ThisExpression: [],
              ThrowStatement: ["argument"],
              TryStatement: [
                "block",
                "handlers",
                "handler",
                "guardedHandlers",
                "finalizer",
              ],
              UnaryExpression: ["argument"],
              UpdateExpression: ["argument"],
              VariableDeclaration: ["declarations"],
              VariableDeclarator: ["id", "init"],
              WhileStatement: ["test", "body"],
              WithStatement: ["object", "body"],
              YieldExpression: ["argument"],
            };
            BREAK = {};
            SKIP = {};
            REMOVE = {};
            VisitorOption = { Break: BREAK, Skip: SKIP, Remove: REMOVE };
            function Reference(parent, key) {
              this.parent = parent;
              this.key = key;
            }
            Reference.prototype.replace = function replace(node) {
              this.parent[this.key] = node;
            };
            Reference.prototype.remove = function remove() {
              if (isArray(this.parent)) {
                this.parent.splice(this.key, 1);
                return true;
              } else {
                this.replace(null);
                return false;
              }
            };
            function Element(node, path, wrap, ref) {
              this.node = node;
              this.path = path;
              this.wrap = wrap;
              this.ref = ref;
            }
            function Controller() {}
            Controller.prototype.path = function path() {
              var i, iz, j, jz, result, element;
              function addToPath(result, path) {
                if (isArray(path)) {
                  for (j = 0, jz = path.length; j < jz; ++j) {
                    result.push(path[j]);
                  }
                } else {
                  result.push(path);
                }
              }
              if (!this.__current.path) {
                return null;
              }
              result = [];
              for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
                element = this.__leavelist[i];
                addToPath(result, element.path);
              }
              addToPath(result, this.__current.path);
              return result;
            };
            Controller.prototype.parents = function parents() {
              var i, iz, result;
              result = [];
              for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
                result.push(this.__leavelist[i].node);
              }
              return result;
            };
            Controller.prototype.current = function current() {
              return this.__current.node;
            };
            Controller.prototype.__execute = function __execute(
              callback,
              element
            ) {
              var previous, result;
              result = undefined;
              previous = this.__current;
              this.__current = element;
              this.__state = null;
              if (callback) {
                result = callback.call(
                  this,
                  element.node,
                  this.__leavelist[this.__leavelist.length - 1].node
                );
              }
              this.__current = previous;
              return result;
            };
            Controller.prototype.notify = function notify(flag) {
              this.__state = flag;
            };
            Controller.prototype.skip = function () {
              this.notify(SKIP);
            };
            Controller.prototype["break"] = function () {
              this.notify(BREAK);
            };
            Controller.prototype.remove = function () {
              this.notify(REMOVE);
            };
            Controller.prototype.__initialize = function (root, visitor) {
              this.visitor = visitor;
              this.root = root;
              this.__worklist = [];
              this.__leavelist = [];
              this.__current = null;
              this.__state = null;
              this.__fallback = visitor.fallback === "iteration";
              this.__keys = VisitorKeys;
              if (visitor.keys) {
                this.__keys = extend(objectCreate(this.__keys), visitor.keys);
              }
            };
            function isNode(node) {
              if (node == null) {
                return false;
              }
              return typeof node === "object" && typeof node.type === "string";
            }
            function isProperty(nodeType, key) {
              return (
                (nodeType === Syntax.ObjectExpression ||
                  nodeType === Syntax.ObjectPattern) &&
                "properties" === key
              );
            }
            Controller.prototype.traverse = function traverse(root, visitor) {
              var worklist,
                leavelist,
                element,
                node,
                nodeType,
                ret,
                key,
                current,
                current2,
                candidates,
                candidate,
                sentinel;
              this.__initialize(root, visitor);
              sentinel = {};
              worklist = this.__worklist;
              leavelist = this.__leavelist;
              worklist.push(new Element(root, null, null, null));
              leavelist.push(new Element(null, null, null, null));
              while (worklist.length) {
                element = worklist.pop();
                if (element === sentinel) {
                  element = leavelist.pop();
                  ret = this.__execute(visitor.leave, element);
                  if (this.__state === BREAK || ret === BREAK) {
                    return;
                  }
                  continue;
                }
                if (element.node) {
                  ret = this.__execute(visitor.enter, element);
                  if (this.__state === BREAK || ret === BREAK) {
                    return;
                  }
                  worklist.push(sentinel);
                  leavelist.push(element);
                  if (this.__state === SKIP || ret === SKIP) {
                    continue;
                  }
                  node = element.node;
                  nodeType = element.wrap || node.type;
                  candidates = this.__keys[nodeType];
                  if (!candidates) {
                    if (this.__fallback) {
                      candidates = objectKeys(node);
                    } else {
                      throw new Error("Unknown node type " + nodeType + ".");
                    }
                  }
                  current = candidates.length;
                  while ((current -= 1) >= 0) {
                    key = candidates[current];
                    candidate = node[key];
                    if (!candidate) {
                      continue;
                    }
                    if (isArray(candidate)) {
                      current2 = candidate.length;
                      while ((current2 -= 1) >= 0) {
                        if (!candidate[current2]) {
                          continue;
                        }
                        if (isProperty(nodeType, candidates[current])) {
                          element = new Element(
                            candidate[current2],
                            [key, current2],
                            "Property",
                            null
                          );
                        } else if (isNode(candidate[current2])) {
                          element = new Element(
                            candidate[current2],
                            [key, current2],
                            null,
                            null
                          );
                        } else {
                          continue;
                        }
                        worklist.push(element);
                      }
                    } else if (isNode(candidate)) {
                      worklist.push(new Element(candidate, key, null, null));
                    }
                  }
                }
              }
            };
            Controller.prototype.replace = function replace(root, visitor) {
              function removeElem() {
                var i, nextElem, parent;
                if (element.ref.remove()) {
                  parent = element.ref.parent;
                  for (i = 1; i < worklist.length; i++) {
                    nextElem = worklist[i];
                    if (
                      nextElem === sentinel ||
                      nextElem.ref.parent !== parent
                    ) {
                      break;
                    }
                    nextElem.path[nextElem.path.length - 1] = --nextElem.ref
                      .key;
                  }
                }
              }
              var worklist,
                leavelist,
                node,
                nodeType,
                target,
                element,
                current,
                current2,
                candidates,
                candidate,
                sentinel,
                outer,
                key;
              this.__initialize(root, visitor);
              sentinel = {};
              worklist = this.__worklist;
              leavelist = this.__leavelist;
              outer = { root: root };
              element = new Element(
                root,
                null,
                null,
                new Reference(outer, "root")
              );
              worklist.push(element);
              leavelist.push(element);
              while (worklist.length) {
                element = worklist.pop();
                if (element === sentinel) {
                  element = leavelist.pop();
                  target = this.__execute(visitor.leave, element);
                  if (
                    target !== undefined &&
                    target !== BREAK &&
                    target !== SKIP &&
                    target !== REMOVE
                  ) {
                    element.ref.replace(target);
                  }
                  if (this.__state === REMOVE || target === REMOVE) {
                    removeElem();
                  }
                  if (this.__state === BREAK || target === BREAK) {
                    return outer.root;
                  }
                  continue;
                }
                target = this.__execute(visitor.enter, element);
                if (
                  target !== undefined &&
                  target !== BREAK &&
                  target !== SKIP &&
                  target !== REMOVE
                ) {
                  element.ref.replace(target);
                  element.node = target;
                }
                if (this.__state === REMOVE || target === REMOVE) {
                  removeElem();
                  element.node = null;
                }
                if (this.__state === BREAK || target === BREAK) {
                  return outer.root;
                }
                node = element.node;
                if (!node) {
                  continue;
                }
                worklist.push(sentinel);
                leavelist.push(element);
                if (this.__state === SKIP || target === SKIP) {
                  continue;
                }
                nodeType = element.wrap || node.type;
                candidates = this.__keys[nodeType];
                if (!candidates) {
                  if (this.__fallback) {
                    candidates = objectKeys(node);
                  } else {
                    throw new Error("Unknown node type " + nodeType + ".");
                  }
                }
                current = candidates.length;
                while ((current -= 1) >= 0) {
                  key = candidates[current];
                  candidate = node[key];
                  if (!candidate) {
                    continue;
                  }
                  if (isArray(candidate)) {
                    current2 = candidate.length;
                    while ((current2 -= 1) >= 0) {
                      if (!candidate[current2]) {
                        continue;
                      }
                      if (isProperty(nodeType, candidates[current])) {
                        element = new Element(
                          candidate[current2],
                          [key, current2],
                          "Property",
                          new Reference(candidate, current2)
                        );
                      } else if (isNode(candidate[current2])) {
                        element = new Element(
                          candidate[current2],
                          [key, current2],
                          null,
                          new Reference(candidate, current2)
                        );
                      } else {
                        continue;
                      }
                      worklist.push(element);
                    }
                  } else if (isNode(candidate)) {
                    worklist.push(
                      new Element(
                        candidate,
                        key,
                        null,
                        new Reference(node, key)
                      )
                    );
                  }
                }
              }
              return outer.root;
            };
            function traverse(root, visitor) {
              var controller = new Controller();
              return controller.traverse(root, visitor);
            }
            function replace(root, visitor) {
              var controller = new Controller();
              return controller.replace(root, visitor);
            }
            function extendCommentRange(comment, tokens) {
              var target;
              target = upperBound(tokens, function search(token) {
                return token.range[0] > comment.range[0];
              });
              comment.extendedRange = [comment.range[0], comment.range[1]];
              if (target !== tokens.length) {
                comment.extendedRange[1] = tokens[target].range[0];
              }
              target -= 1;
              if (target >= 0) {
                comment.extendedRange[0] = tokens[target].range[1];
              }
              return comment;
            }
            function attachComments(tree, providedComments, tokens) {
              var comments = [],
                comment,
                len,
                i,
                cursor;
              if (!tree.range) {
                throw new Error("attachComments needs range information");
              }
              if (!tokens.length) {
                if (providedComments.length) {
                  for (i = 0, len = providedComments.length; i < len; i += 1) {
                    comment = deepCopy(providedComments[i]);
                    comment.extendedRange = [0, tree.range[0]];
                    comments.push(comment);
                  }
                  tree.leadingComments = comments;
                }
                return tree;
              }
              for (i = 0, len = providedComments.length; i < len; i += 1) {
                comments.push(
                  extendCommentRange(deepCopy(providedComments[i]), tokens)
                );
              }
              cursor = 0;
              traverse(tree, {
                enter: function (node) {
                  var comment;
                  while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (comment.extendedRange[1] > node.range[0]) {
                      break;
                    }
                    if (comment.extendedRange[1] === node.range[0]) {
                      if (!node.leadingComments) {
                        node.leadingComments = [];
                      }
                      node.leadingComments.push(comment);
                      comments.splice(cursor, 1);
                    } else {
                      cursor += 1;
                    }
                  }
                  if (cursor === comments.length) {
                    return VisitorOption.Break;
                  }
                  if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                  }
                },
              });
              cursor = 0;
              traverse(tree, {
                leave: function (node) {
                  var comment;
                  while (cursor < comments.length) {
                    comment = comments[cursor];
                    if (node.range[1] < comment.extendedRange[0]) {
                      break;
                    }
                    if (node.range[1] === comment.extendedRange[0]) {
                      if (!node.trailingComments) {
                        node.trailingComments = [];
                      }
                      node.trailingComments.push(comment);
                      comments.splice(cursor, 1);
                    } else {
                      cursor += 1;
                    }
                  }
                  if (cursor === comments.length) {
                    return VisitorOption.Break;
                  }
                  if (comments[cursor].extendedRange[0] > node.range[1]) {
                    return VisitorOption.Skip;
                  }
                },
              });
              return tree;
            }
            exports.version = "1.5.1-dev";
            exports.Syntax = Syntax;
            exports.traverse = traverse;
            exports.replace = replace;
            exports.attachComments = attachComments;
            exports.VisitorKeys = VisitorKeys;
            exports.VisitorOption = VisitorOption;
            exports.Controller = Controller;
          });
        },
        {},
      ],
      88: [
        function (require, module, exports) {
          (function () {
            "use strict";
            function isExpression(node) {
              if (node == null) {
                return false;
              }
              switch (node.type) {
                case "ArrayExpression":
                case "AssignmentExpression":
                case "BinaryExpression":
                case "CallExpression":
                case "ConditionalExpression":
                case "FunctionExpression":
                case "Identifier":
                case "Literal":
                case "LogicalExpression":
                case "MemberExpression":
                case "NewExpression":
                case "ObjectExpression":
                case "SequenceExpression":
                case "ThisExpression":
                case "UnaryExpression":
                case "UpdateExpression":
                  return true;
              }
              return false;
            }
            function isIterationStatement(node) {
              if (node == null) {
                return false;
              }
              switch (node.type) {
                case "DoWhileStatement":
                case "ForInStatement":
                case "ForStatement":
                case "WhileStatement":
                  return true;
              }
              return false;
            }
            function isStatement(node) {
              if (node == null) {
                return false;
              }
              switch (node.type) {
                case "BlockStatement":
                case "BreakStatement":
                case "ContinueStatement":
                case "DebuggerStatement":
                case "DoWhileStatement":
                case "EmptyStatement":
                case "ExpressionStatement":
                case "ForInStatement":
                case "ForStatement":
                case "IfStatement":
                case "LabeledStatement":
                case "ReturnStatement":
                case "SwitchStatement":
                case "ThrowStatement":
                case "TryStatement":
                case "VariableDeclaration":
                case "WhileStatement":
                case "WithStatement":
                  return true;
              }
              return false;
            }
            function isSourceElement(node) {
              return (
                isStatement(node) ||
                (node != null && node.type === "FunctionDeclaration")
              );
            }
            function trailingStatement(node) {
              switch (node.type) {
                case "IfStatement":
                  if (node.alternate != null) {
                    return node.alternate;
                  }
                  return node.consequent;
                case "LabeledStatement":
                case "ForStatement":
                case "ForInStatement":
                case "WhileStatement":
                case "WithStatement":
                  return node.body;
              }
              return null;
            }
            function isProblematicIfStatement(node) {
              var current;
              if (node.type !== "IfStatement") {
                return false;
              }
              if (node.alternate == null) {
                return false;
              }
              current = node.consequent;
              do {
                if (current.type === "IfStatement") {
                  if (current.alternate == null) {
                    return true;
                  }
                }
                current = trailingStatement(current);
              } while (current);
              return false;
            }
            module.exports = {
              isExpression: isExpression,
              isStatement: isStatement,
              isIterationStatement: isIterationStatement,
              isSourceElement: isSourceElement,
              isProblematicIfStatement: isProblematicIfStatement,
              trailingStatement: trailingStatement,
            };
          })();
        },
        {},
      ],
      89: [
        function (require, module, exports) {
          (function () {
            "use strict";
            var Regex;
            Regex = {
              NonAsciiIdentifierStart: new RegExp(
                "[????????-????-????-????-????-????????-????????-??????-??????-????-????-????-????-??????-????-????-????-????????-??????????????-????????-????-??????-???????????-???????????????-?????????-??????-????????????-??????-??????-??????-????????????-??????-?????????-??????????????????-????????????-????????????-??????-????????????????????????-?????????-??????-??????-??????-??????-????????????-??????????????????-????????????-??????-????????????-???????????????-????????????-??????-??????-???????????????????????????-??????-?????????-??????-??????-??????-??????-?????????????????????-??????-??????-??????-??????-????????????????????????-??????-??????-??????????????????-??????-??????-??????-?????????-??????-????????????-???????????????????????????-??????-??????-??????????????????-???????????????-?????????-?????????-??????-??????-??????-?????????-??????-???????????????-??????-?????????-????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-???????????????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-????????????-????????????-?????????-???????????????-??????-??????-??????-?????????-??????-??????-??????-??????-????????????-????????????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-?????????-??????-??????-??????-?????????-???????????????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-?????????????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-???]"
              ),
              NonAsciiIdentifierPart: new RegExp(
                "[????????-????-????-????-????-????????-????????-??????-??????-????-????-????-????-????-??????-????-????????????????-????-????-????-????-????-????-????-??????-????-????-???????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-?????????-??????-????????????-???????????????-??????-??????-??????-????????????-??????-???????????????????????????-????????????-?????????-?????????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-?????????-??????-??????-??????-????????????-??????-????????????-??????-????????????-??????????????????-??????-???????????????-??????-??????-???????????????????????????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????????????????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-???????????????-??????-??????????????????-??????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-?????????-?????????-?????????-????????????-??????-??????-???????????????????????????-??????-??????-??????????????????-??????-??????-?????????-??????-??????-???????????????-???????????????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-???????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-???????????????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-???????????????????????????-??????-?????????-????????????-?????????-???????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-????????????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????????????????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-???]"
              ),
            };
            function isDecimalDigit(ch) {
              return ch >= 48 && ch <= 57;
            }
            function isHexDigit(ch) {
              return (
                isDecimalDigit(ch) ||
                (97 <= ch && ch <= 102) ||
                (65 <= ch && ch <= 70)
              );
            }
            function isOctalDigit(ch) {
              return ch >= 48 && ch <= 55;
            }
            function isWhiteSpace(ch) {
              return (
                ch === 32 ||
                ch === 9 ||
                ch === 11 ||
                ch === 12 ||
                ch === 160 ||
                (ch >= 5760 &&
                  [
                    5760, 6158, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8199,
                    8200, 8201, 8202, 8239, 8287, 12288, 65279,
                  ].indexOf(ch) >= 0)
              );
            }
            function isLineTerminator(ch) {
              return ch === 10 || ch === 13 || ch === 8232 || ch === 8233;
            }
            function isIdentifierStart(ch) {
              return (
                ch === 36 ||
                ch === 95 ||
                (ch >= 65 && ch <= 90) ||
                (ch >= 97 && ch <= 122) ||
                ch === 92 ||
                (ch >= 128 &&
                  Regex.NonAsciiIdentifierStart.test(String.fromCharCode(ch)))
              );
            }
            function isIdentifierPart(ch) {
              return (
                ch === 36 ||
                ch === 95 ||
                (ch >= 65 && ch <= 90) ||
                (ch >= 97 && ch <= 122) ||
                (ch >= 48 && ch <= 57) ||
                ch === 92 ||
                (ch >= 128 &&
                  Regex.NonAsciiIdentifierPart.test(String.fromCharCode(ch)))
              );
            }
            module.exports = {
              isDecimalDigit: isDecimalDigit,
              isHexDigit: isHexDigit,
              isOctalDigit: isOctalDigit,
              isWhiteSpace: isWhiteSpace,
              isLineTerminator: isLineTerminator,
              isIdentifierStart: isIdentifierStart,
              isIdentifierPart: isIdentifierPart,
            };
          })();
        },
        {},
      ],
      90: [
        function (require, module, exports) {
          (function () {
            "use strict";
            var code = require("./code");
            function isStrictModeReservedWordES6(id) {
              switch (id) {
                case "implements":
                case "interface":
                case "package":
                case "private":
                case "protected":
                case "public":
                case "static":
                case "let":
                  return true;
                default:
                  return false;
              }
            }
            function isKeywordES5(id, strict) {
              if (!strict && id === "yield") {
                return false;
              }
              return isKeywordES6(id, strict);
            }
            function isKeywordES6(id, strict) {
              if (strict && isStrictModeReservedWordES6(id)) {
                return true;
              }
              switch (id.length) {
                case 2:
                  return id === "if" || id === "in" || id === "do";
                case 3:
                  return (
                    id === "var" || id === "for" || id === "new" || id === "try"
                  );
                case 4:
                  return (
                    id === "this" ||
                    id === "else" ||
                    id === "case" ||
                    id === "void" ||
                    id === "with" ||
                    id === "enum"
                  );
                case 5:
                  return (
                    id === "while" ||
                    id === "break" ||
                    id === "catch" ||
                    id === "throw" ||
                    id === "const" ||
                    id === "yield" ||
                    id === "class" ||
                    id === "super"
                  );
                case 6:
                  return (
                    id === "return" ||
                    id === "typeof" ||
                    id === "delete" ||
                    id === "switch" ||
                    id === "export" ||
                    id === "import"
                  );
                case 7:
                  return (
                    id === "default" || id === "finally" || id === "extends"
                  );
                case 8:
                  return (
                    id === "function" || id === "continue" || id === "debugger"
                  );
                case 10:
                  return id === "instanceof";
                default:
                  return false;
              }
            }
            function isReservedWordES5(id, strict) {
              return (
                id === "null" ||
                id === "true" ||
                id === "false" ||
                isKeywordES5(id, strict)
              );
            }
            function isReservedWordES6(id, strict) {
              return (
                id === "null" ||
                id === "true" ||
                id === "false" ||
                isKeywordES6(id, strict)
              );
            }
            function isRestrictedWord(id) {
              return id === "eval" || id === "arguments";
            }
            function isIdentifierName(id) {
              var i, iz, ch;
              if (id.length === 0) {
                return false;
              }
              ch = id.charCodeAt(0);
              if (!code.isIdentifierStart(ch) || ch === 92) {
                return false;
              }
              for (i = 1, iz = id.length; i < iz; ++i) {
                ch = id.charCodeAt(i);
                if (!code.isIdentifierPart(ch) || ch === 92) {
                  return false;
                }
              }
              return true;
            }
            function isIdentifierES5(id, strict) {
              return isIdentifierName(id) && !isReservedWordES5(id, strict);
            }
            function isIdentifierES6(id, strict) {
              return isIdentifierName(id) && !isReservedWordES6(id, strict);
            }
            module.exports = {
              isKeywordES5: isKeywordES5,
              isKeywordES6: isKeywordES6,
              isReservedWordES5: isReservedWordES5,
              isReservedWordES6: isReservedWordES6,
              isRestrictedWord: isRestrictedWord,
              isIdentifierName: isIdentifierName,
              isIdentifierES5: isIdentifierES5,
              isIdentifierES6: isIdentifierES6,
            };
          })();
        },
        { "./code": 89 },
      ],
      91: [
        function (require, module, exports) {
          (function () {
            "use strict";
            exports.ast = require("./ast");
            exports.code = require("./code");
            exports.keyword = require("./keyword");
          })();
        },
        { "./ast": 88, "./code": 89, "./keyword": 90 },
      ],
      92: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              var undefined;
              var arrayPool = [],
                objectPool = [];
              var idCounter = 0;
              var keyPrefix = +new Date() + "";
              var largeArraySize = 75;
              var maxPoolSize = 40;
              var whitespace =
                " 	\f?????" + "\n\r\u2028\u2029" + "????????????????????????????????????????????????";
              var reEmptyStringLeading = /\b__p \+= '';/g,
                reEmptyStringMiddle = /\b(__p \+=) '' \+/g,
                reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
              var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
              var reFlags = /\w*$/;
              var reFuncName = /^\s*function[ \n\r\t]+\w/;
              var reInterpolate = /<%=([\s\S]+?)%>/g;
              var reLeadingSpacesAndZeros = RegExp(
                "^[" + whitespace + "]*0+(?=.$)"
              );
              var reNoMatch = /($^)/;
              var reThis = /\bthis\b/;
              var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;
              var contextProps = [
                "Array",
                "Boolean",
                "Date",
                "Function",
                "Math",
                "Number",
                "Object",
                "RegExp",
                "String",
                "_",
                "attachEvent",
                "clearTimeout",
                "isFinite",
                "isNaN",
                "parseInt",
                "setTimeout",
              ];
              var templateCounter = 0;
              var argsClass = "[object Arguments]",
                arrayClass = "[object Array]",
                boolClass = "[object Boolean]",
                dateClass = "[object Date]",
                funcClass = "[object Function]",
                numberClass = "[object Number]",
                objectClass = "[object Object]",
                regexpClass = "[object RegExp]",
                stringClass = "[object String]";
              var cloneableClasses = {};
              cloneableClasses[funcClass] = false;
              cloneableClasses[argsClass] =
                cloneableClasses[arrayClass] =
                cloneableClasses[boolClass] =
                cloneableClasses[dateClass] =
                cloneableClasses[numberClass] =
                cloneableClasses[objectClass] =
                cloneableClasses[regexpClass] =
                cloneableClasses[stringClass] =
                  true;
              var debounceOptions = {
                leading: false,
                maxWait: 0,
                trailing: false,
              };
              var descriptor = {
                configurable: false,
                enumerable: false,
                value: null,
                writable: false,
              };
              var objectTypes = {
                boolean: false,
                function: true,
                object: true,
                number: false,
                string: false,
                undefined: false,
              };
              var stringEscapes = {
                "\\": "\\",
                "'": "'",
                "\n": "n",
                "\r": "r",
                "	": "t",
                "\u2028": "u2028",
                "\u2029": "u2029",
              };
              var root = (objectTypes[typeof window] && window) || this;
              var freeExports =
                objectTypes[typeof exports] &&
                exports &&
                !exports.nodeType &&
                exports;
              var freeModule =
                objectTypes[typeof module] &&
                module &&
                !module.nodeType &&
                module;
              var moduleExports =
                freeModule && freeModule.exports === freeExports && freeExports;
              var freeGlobal = objectTypes[typeof global] && global;
              if (
                freeGlobal &&
                (freeGlobal.global === freeGlobal ||
                  freeGlobal.window === freeGlobal)
              ) {
                root = freeGlobal;
              }
              function baseIndexOf(array, value, fromIndex) {
                var index = (fromIndex || 0) - 1,
                  length = array ? array.length : 0;
                while (++index < length) {
                  if (array[index] === value) {
                    return index;
                  }
                }
                return -1;
              }
              function cacheIndexOf(cache, value) {
                var type = typeof value;
                cache = cache.cache;
                if (type == "boolean" || value == null) {
                  return cache[value] ? 0 : -1;
                }
                if (type != "number" && type != "string") {
                  type = "object";
                }
                var key = type == "number" ? value : keyPrefix + value;
                cache = (cache = cache[type]) && cache[key];
                return type == "object"
                  ? cache && baseIndexOf(cache, value) > -1
                    ? 0
                    : -1
                  : cache
                  ? 0
                  : -1;
              }
              function cachePush(value) {
                var cache = this.cache,
                  type = typeof value;
                if (type == "boolean" || value == null) {
                  cache[value] = true;
                } else {
                  if (type != "number" && type != "string") {
                    type = "object";
                  }
                  var key = type == "number" ? value : keyPrefix + value,
                    typeCache = cache[type] || (cache[type] = {});
                  if (type == "object") {
                    (typeCache[key] || (typeCache[key] = [])).push(value);
                  } else {
                    typeCache[key] = true;
                  }
                }
              }
              function charAtCallback(value) {
                return value.charCodeAt(0);
              }
              function compareAscending(a, b) {
                var ac = a.criteria,
                  bc = b.criteria,
                  index = -1,
                  length = ac.length;
                while (++index < length) {
                  var value = ac[index],
                    other = bc[index];
                  if (value !== other) {
                    if (value > other || typeof value == "undefined") {
                      return 1;
                    }
                    if (value < other || typeof other == "undefined") {
                      return -1;
                    }
                  }
                }
                return a.index - b.index;
              }
              function createCache(array) {
                var index = -1,
                  length = array.length,
                  first = array[0],
                  mid = array[(length / 2) | 0],
                  last = array[length - 1];
                if (
                  first &&
                  typeof first == "object" &&
                  mid &&
                  typeof mid == "object" &&
                  last &&
                  typeof last == "object"
                ) {
                  return false;
                }
                var cache = getObject();
                cache["false"] =
                  cache["null"] =
                  cache["true"] =
                  cache["undefined"] =
                    false;
                var result = getObject();
                result.array = array;
                result.cache = cache;
                result.push = cachePush;
                while (++index < length) {
                  result.push(array[index]);
                }
                return result;
              }
              function escapeStringChar(match) {
                return "\\" + stringEscapes[match];
              }
              function getArray() {
                return arrayPool.pop() || [];
              }
              function getObject() {
                return (
                  objectPool.pop() || {
                    array: null,
                    cache: null,
                    criteria: null,
                    false: false,
                    index: 0,
                    null: false,
                    number: null,
                    object: null,
                    push: null,
                    string: null,
                    true: false,
                    undefined: false,
                    value: null,
                  }
                );
              }
              function releaseArray(array) {
                array.length = 0;
                if (arrayPool.length < maxPoolSize) {
                  arrayPool.push(array);
                }
              }
              function releaseObject(object) {
                var cache = object.cache;
                if (cache) {
                  releaseObject(cache);
                }
                object.array =
                  object.cache =
                  object.criteria =
                  object.object =
                  object.number =
                  object.string =
                  object.value =
                    null;
                if (objectPool.length < maxPoolSize) {
                  objectPool.push(object);
                }
              }
              function slice(array, start, end) {
                start || (start = 0);
                if (typeof end == "undefined") {
                  end = array ? array.length : 0;
                }
                var index = -1,
                  length = end - start || 0,
                  result = Array(length < 0 ? 0 : length);
                while (++index < length) {
                  result[index] = array[start + index];
                }
                return result;
              }
              function runInContext(context) {
                context = context
                  ? _.defaults(
                      root.Object(),
                      context,
                      _.pick(root, contextProps)
                    )
                  : root;
                var Array = context.Array,
                  Boolean = context.Boolean,
                  Date = context.Date,
                  Function = context.Function,
                  Math = context.Math,
                  Number = context.Number,
                  Object = context.Object,
                  RegExp = context.RegExp,
                  String = context.String,
                  TypeError = context.TypeError;
                var arrayRef = [];
                var objectProto = Object.prototype;
                var oldDash = context._;
                var toString = objectProto.toString;
                var reNative = RegExp(
                  "^" +
                    String(toString)
                      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                      .replace(/toString| for [^\]]+/g, ".*?") +
                    "$"
                );
                var ceil = Math.ceil,
                  clearTimeout = context.clearTimeout,
                  floor = Math.floor,
                  fnToString = Function.prototype.toString,
                  getPrototypeOf =
                    isNative((getPrototypeOf = Object.getPrototypeOf)) &&
                    getPrototypeOf,
                  hasOwnProperty = objectProto.hasOwnProperty,
                  push = arrayRef.push,
                  setTimeout = context.setTimeout,
                  splice = arrayRef.splice,
                  unshift = arrayRef.unshift;
                var defineProperty = (function () {
                  try {
                    var o = {},
                      func = isNative((func = Object.defineProperty)) && func,
                      result = func(o, o, o) && func;
                  } catch (e) {}
                  return result;
                })();
                var nativeCreate =
                    isNative((nativeCreate = Object.create)) && nativeCreate,
                  nativeIsArray =
                    isNative((nativeIsArray = Array.isArray)) && nativeIsArray,
                  nativeIsFinite = context.isFinite,
                  nativeIsNaN = context.isNaN,
                  nativeKeys =
                    isNative((nativeKeys = Object.keys)) && nativeKeys,
                  nativeMax = Math.max,
                  nativeMin = Math.min,
                  nativeParseInt = context.parseInt,
                  nativeRandom = Math.random;
                var ctorByClass = {};
                ctorByClass[arrayClass] = Array;
                ctorByClass[boolClass] = Boolean;
                ctorByClass[dateClass] = Date;
                ctorByClass[funcClass] = Function;
                ctorByClass[objectClass] = Object;
                ctorByClass[numberClass] = Number;
                ctorByClass[regexpClass] = RegExp;
                ctorByClass[stringClass] = String;
                function lodash(value) {
                  return value &&
                    typeof value == "object" &&
                    !isArray(value) &&
                    hasOwnProperty.call(value, "__wrapped__")
                    ? value
                    : new lodashWrapper(value);
                }
                function lodashWrapper(value, chainAll) {
                  this.__chain__ = !!chainAll;
                  this.__wrapped__ = value;
                }
                lodashWrapper.prototype = lodash.prototype;
                var support = (lodash.support = {});
                support.funcDecomp =
                  !isNative(context.WinRTError) && reThis.test(runInContext);
                support.funcNames = typeof Function.name == "string";
                lodash.templateSettings = {
                  escape: /<%-([\s\S]+?)%>/g,
                  evaluate: /<%([\s\S]+?)%>/g,
                  interpolate: reInterpolate,
                  variable: "",
                  imports: { _: lodash },
                };
                function baseBind(bindData) {
                  var func = bindData[0],
                    partialArgs = bindData[2],
                    thisArg = bindData[4];
                  function bound() {
                    if (partialArgs) {
                      var args = slice(partialArgs);
                      push.apply(args, arguments);
                    }
                    if (this instanceof bound) {
                      var thisBinding = baseCreate(func.prototype),
                        result = func.apply(thisBinding, args || arguments);
                      return isObject(result) ? result : thisBinding;
                    }
                    return func.apply(thisArg, args || arguments);
                  }
                  setBindData(bound, bindData);
                  return bound;
                }
                function baseClone(value, isDeep, callback, stackA, stackB) {
                  if (callback) {
                    var result = callback(value);
                    if (typeof result != "undefined") {
                      return result;
                    }
                  }
                  var isObj = isObject(value);
                  if (isObj) {
                    var className = toString.call(value);
                    if (!cloneableClasses[className]) {
                      return value;
                    }
                    var ctor = ctorByClass[className];
                    switch (className) {
                      case boolClass:
                      case dateClass:
                        return new ctor(+value);
                      case numberClass:
                      case stringClass:
                        return new ctor(value);
                      case regexpClass:
                        result = ctor(value.source, reFlags.exec(value));
                        result.lastIndex = value.lastIndex;
                        return result;
                    }
                  } else {
                    return value;
                  }
                  var isArr = isArray(value);
                  if (isDeep) {
                    var initedStack = !stackA;
                    stackA || (stackA = getArray());
                    stackB || (stackB = getArray());
                    var length = stackA.length;
                    while (length--) {
                      if (stackA[length] == value) {
                        return stackB[length];
                      }
                    }
                    result = isArr ? ctor(value.length) : {};
                  } else {
                    result = isArr ? slice(value) : assign({}, value);
                  }
                  if (isArr) {
                    if (hasOwnProperty.call(value, "index")) {
                      result.index = value.index;
                    }
                    if (hasOwnProperty.call(value, "input")) {
                      result.input = value.input;
                    }
                  }
                  if (!isDeep) {
                    return result;
                  }
                  stackA.push(value);
                  stackB.push(result);
                  (isArr ? forEach : forOwn)(value, function (objValue, key) {
                    result[key] = baseClone(
                      objValue,
                      isDeep,
                      callback,
                      stackA,
                      stackB
                    );
                  });
                  if (initedStack) {
                    releaseArray(stackA);
                    releaseArray(stackB);
                  }
                  return result;
                }
                function baseCreate(prototype, properties) {
                  return isObject(prototype) ? nativeCreate(prototype) : {};
                }
                if (!nativeCreate) {
                  baseCreate = (function () {
                    function Object() {}
                    return function (prototype) {
                      if (isObject(prototype)) {
                        Object.prototype = prototype;
                        var result = new Object();
                        Object.prototype = null;
                      }
                      return result || context.Object();
                    };
                  })();
                }
                function baseCreateCallback(func, thisArg, argCount) {
                  if (typeof func != "function") {
                    return identity;
                  }
                  if (typeof thisArg == "undefined" || !("prototype" in func)) {
                    return func;
                  }
                  var bindData = func.__bindData__;
                  if (typeof bindData == "undefined") {
                    if (support.funcNames) {
                      bindData = !func.name;
                    }
                    bindData = bindData || !support.funcDecomp;
                    if (!bindData) {
                      var source = fnToString.call(func);
                      if (!support.funcNames) {
                        bindData = !reFuncName.test(source);
                      }
                      if (!bindData) {
                        bindData = reThis.test(source);
                        setBindData(func, bindData);
                      }
                    }
                  }
                  if (
                    bindData === false ||
                    (bindData !== true && bindData[1] & 1)
                  ) {
                    return func;
                  }
                  switch (argCount) {
                    case 1:
                      return function (value) {
                        return func.call(thisArg, value);
                      };
                    case 2:
                      return function (a, b) {
                        return func.call(thisArg, a, b);
                      };
                    case 3:
                      return function (value, index, collection) {
                        return func.call(thisArg, value, index, collection);
                      };
                    case 4:
                      return function (accumulator, value, index, collection) {
                        return func.call(
                          thisArg,
                          accumulator,
                          value,
                          index,
                          collection
                        );
                      };
                  }
                  return bind(func, thisArg);
                }
                function baseCreateWrapper(bindData) {
                  var func = bindData[0],
                    bitmask = bindData[1],
                    partialArgs = bindData[2],
                    partialRightArgs = bindData[3],
                    thisArg = bindData[4],
                    arity = bindData[5];
                  var isBind = bitmask & 1,
                    isBindKey = bitmask & 2,
                    isCurry = bitmask & 4,
                    isCurryBound = bitmask & 8,
                    key = func;
                  function bound() {
                    var thisBinding = isBind ? thisArg : this;
                    if (partialArgs) {
                      var args = slice(partialArgs);
                      push.apply(args, arguments);
                    }
                    if (partialRightArgs || isCurry) {
                      args || (args = slice(arguments));
                      if (partialRightArgs) {
                        push.apply(args, partialRightArgs);
                      }
                      if (isCurry && args.length < arity) {
                        bitmask |= 16 & ~32;
                        return baseCreateWrapper([
                          func,
                          isCurryBound ? bitmask : bitmask & ~3,
                          args,
                          null,
                          thisArg,
                          arity,
                        ]);
                      }
                    }
                    args || (args = arguments);
                    if (isBindKey) {
                      func = thisBinding[key];
                    }
                    if (this instanceof bound) {
                      thisBinding = baseCreate(func.prototype);
                      var result = func.apply(thisBinding, args);
                      return isObject(result) ? result : thisBinding;
                    }
                    return func.apply(thisBinding, args);
                  }
                  setBindData(bound, bindData);
                  return bound;
                }
                function baseDifference(array, values) {
                  var index = -1,
                    indexOf = getIndexOf(),
                    length = array ? array.length : 0,
                    isLarge =
                      length >= largeArraySize && indexOf === baseIndexOf,
                    result = [];
                  if (isLarge) {
                    var cache = createCache(values);
                    if (cache) {
                      indexOf = cacheIndexOf;
                      values = cache;
                    } else {
                      isLarge = false;
                    }
                  }
                  while (++index < length) {
                    var value = array[index];
                    if (indexOf(values, value) < 0) {
                      result.push(value);
                    }
                  }
                  if (isLarge) {
                    releaseObject(values);
                  }
                  return result;
                }
                function baseFlatten(array, isShallow, isStrict, fromIndex) {
                  var index = (fromIndex || 0) - 1,
                    length = array ? array.length : 0,
                    result = [];
                  while (++index < length) {
                    var value = array[index];
                    if (
                      value &&
                      typeof value == "object" &&
                      typeof value.length == "number" &&
                      (isArray(value) || isArguments(value))
                    ) {
                      if (!isShallow) {
                        value = baseFlatten(value, isShallow, isStrict);
                      }
                      var valIndex = -1,
                        valLength = value.length,
                        resIndex = result.length;
                      result.length += valLength;
                      while (++valIndex < valLength) {
                        result[resIndex++] = value[valIndex];
                      }
                    } else if (!isStrict) {
                      result.push(value);
                    }
                  }
                  return result;
                }
                function baseIsEqual(a, b, callback, isWhere, stackA, stackB) {
                  if (callback) {
                    var result = callback(a, b);
                    if (typeof result != "undefined") {
                      return !!result;
                    }
                  }
                  if (a === b) {
                    return a !== 0 || 1 / a == 1 / b;
                  }
                  var type = typeof a,
                    otherType = typeof b;
                  if (
                    a === a &&
                    !(a && objectTypes[type]) &&
                    !(b && objectTypes[otherType])
                  ) {
                    return false;
                  }
                  if (a == null || b == null) {
                    return a === b;
                  }
                  var className = toString.call(a),
                    otherClass = toString.call(b);
                  if (className == argsClass) {
                    className = objectClass;
                  }
                  if (otherClass == argsClass) {
                    otherClass = objectClass;
                  }
                  if (className != otherClass) {
                    return false;
                  }
                  switch (className) {
                    case boolClass:
                    case dateClass:
                      return +a == +b;
                    case numberClass:
                      return a != +a
                        ? b != +b
                        : a == 0
                        ? 1 / a == 1 / b
                        : a == +b;
                    case regexpClass:
                    case stringClass:
                      return a == String(b);
                  }
                  var isArr = className == arrayClass;
                  if (!isArr) {
                    var aWrapped = hasOwnProperty.call(a, "__wrapped__"),
                      bWrapped = hasOwnProperty.call(b, "__wrapped__");
                    if (aWrapped || bWrapped) {
                      return baseIsEqual(
                        aWrapped ? a.__wrapped__ : a,
                        bWrapped ? b.__wrapped__ : b,
                        callback,
                        isWhere,
                        stackA,
                        stackB
                      );
                    }
                    if (className != objectClass) {
                      return false;
                    }
                    var ctorA = a.constructor,
                      ctorB = b.constructor;
                    if (
                      ctorA != ctorB &&
                      !(
                        isFunction(ctorA) &&
                        ctorA instanceof ctorA &&
                        isFunction(ctorB) &&
                        ctorB instanceof ctorB
                      ) &&
                      "constructor" in a &&
                      "constructor" in b
                    ) {
                      return false;
                    }
                  }
                  var initedStack = !stackA;
                  stackA || (stackA = getArray());
                  stackB || (stackB = getArray());
                  var length = stackA.length;
                  while (length--) {
                    if (stackA[length] == a) {
                      return stackB[length] == b;
                    }
                  }
                  var size = 0;
                  result = true;
                  stackA.push(a);
                  stackB.push(b);
                  if (isArr) {
                    length = a.length;
                    size = b.length;
                    result = size == length;
                    if (result || isWhere) {
                      while (size--) {
                        var index = length,
                          value = b[size];
                        if (isWhere) {
                          while (index--) {
                            if (
                              (result = baseIsEqual(
                                a[index],
                                value,
                                callback,
                                isWhere,
                                stackA,
                                stackB
                              ))
                            ) {
                              break;
                            }
                          }
                        } else if (
                          !(result = baseIsEqual(
                            a[size],
                            value,
                            callback,
                            isWhere,
                            stackA,
                            stackB
                          ))
                        ) {
                          break;
                        }
                      }
                    }
                  } else {
                    forIn(b, function (value, key, b) {
                      if (hasOwnProperty.call(b, key)) {
                        size++;
                        return (result =
                          hasOwnProperty.call(a, key) &&
                          baseIsEqual(
                            a[key],
                            value,
                            callback,
                            isWhere,
                            stackA,
                            stackB
                          ));
                      }
                    });
                    if (result && !isWhere) {
                      forIn(a, function (value, key, a) {
                        if (hasOwnProperty.call(a, key)) {
                          return (result = --size > -1);
                        }
                      });
                    }
                  }
                  stackA.pop();
                  stackB.pop();
                  if (initedStack) {
                    releaseArray(stackA);
                    releaseArray(stackB);
                  }
                  return result;
                }
                function baseMerge(object, source, callback, stackA, stackB) {
                  (isArray(source) ? forEach : forOwn)(
                    source,
                    function (source, key) {
                      var found,
                        isArr,
                        result = source,
                        value = object[key];
                      if (
                        source &&
                        ((isArr = isArray(source)) || isPlainObject(source))
                      ) {
                        var stackLength = stackA.length;
                        while (stackLength--) {
                          if ((found = stackA[stackLength] == source)) {
                            value = stackB[stackLength];
                            break;
                          }
                        }
                        if (!found) {
                          var isShallow;
                          if (callback) {
                            result = callback(value, source);
                            if ((isShallow = typeof result != "undefined")) {
                              value = result;
                            }
                          }
                          if (!isShallow) {
                            value = isArr
                              ? isArray(value)
                                ? value
                                : []
                              : isPlainObject(value)
                              ? value
                              : {};
                          }
                          stackA.push(source);
                          stackB.push(value);
                          if (!isShallow) {
                            baseMerge(value, source, callback, stackA, stackB);
                          }
                        }
                      } else {
                        if (callback) {
                          result = callback(value, source);
                          if (typeof result == "undefined") {
                            result = source;
                          }
                        }
                        if (typeof result != "undefined") {
                          value = result;
                        }
                      }
                      object[key] = value;
                    }
                  );
                }
                function baseRandom(min, max) {
                  return min + floor(nativeRandom() * (max - min + 1));
                }
                function baseUniq(array, isSorted, callback) {
                  var index = -1,
                    indexOf = getIndexOf(),
                    length = array ? array.length : 0,
                    result = [];
                  var isLarge =
                      !isSorted &&
                      length >= largeArraySize &&
                      indexOf === baseIndexOf,
                    seen = callback || isLarge ? getArray() : result;
                  if (isLarge) {
                    var cache = createCache(seen);
                    indexOf = cacheIndexOf;
                    seen = cache;
                  }
                  while (++index < length) {
                    var value = array[index],
                      computed = callback
                        ? callback(value, index, array)
                        : value;
                    if (
                      isSorted
                        ? !index || seen[seen.length - 1] !== computed
                        : indexOf(seen, computed) < 0
                    ) {
                      if (callback || isLarge) {
                        seen.push(computed);
                      }
                      result.push(value);
                    }
                  }
                  if (isLarge) {
                    releaseArray(seen.array);
                    releaseObject(seen);
                  } else if (callback) {
                    releaseArray(seen);
                  }
                  return result;
                }
                function createAggregator(setter) {
                  return function (collection, callback, thisArg) {
                    var result = {};
                    callback = lodash.createCallback(callback, thisArg, 3);
                    var index = -1,
                      length = collection ? collection.length : 0;
                    if (typeof length == "number") {
                      while (++index < length) {
                        var value = collection[index];
                        setter(
                          result,
                          value,
                          callback(value, index, collection),
                          collection
                        );
                      }
                    } else {
                      forOwn(collection, function (value, key, collection) {
                        setter(
                          result,
                          value,
                          callback(value, key, collection),
                          collection
                        );
                      });
                    }
                    return result;
                  };
                }
                function createWrapper(
                  func,
                  bitmask,
                  partialArgs,
                  partialRightArgs,
                  thisArg,
                  arity
                ) {
                  var isBind = bitmask & 1,
                    isBindKey = bitmask & 2,
                    isCurry = bitmask & 4,
                    isCurryBound = bitmask & 8,
                    isPartial = bitmask & 16,
                    isPartialRight = bitmask & 32;
                  if (!isBindKey && !isFunction(func)) {
                    throw new TypeError();
                  }
                  if (isPartial && !partialArgs.length) {
                    bitmask &= ~16;
                    isPartial = partialArgs = false;
                  }
                  if (isPartialRight && !partialRightArgs.length) {
                    bitmask &= ~32;
                    isPartialRight = partialRightArgs = false;
                  }
                  var bindData = func && func.__bindData__;
                  if (bindData && bindData !== true) {
                    bindData = slice(bindData);
                    if (bindData[2]) {
                      bindData[2] = slice(bindData[2]);
                    }
                    if (bindData[3]) {
                      bindData[3] = slice(bindData[3]);
                    }
                    if (isBind && !(bindData[1] & 1)) {
                      bindData[4] = thisArg;
                    }
                    if (!isBind && bindData[1] & 1) {
                      bitmask |= 8;
                    }
                    if (isCurry && !(bindData[1] & 4)) {
                      bindData[5] = arity;
                    }
                    if (isPartial) {
                      push.apply(
                        bindData[2] || (bindData[2] = []),
                        partialArgs
                      );
                    }
                    if (isPartialRight) {
                      unshift.apply(
                        bindData[3] || (bindData[3] = []),
                        partialRightArgs
                      );
                    }
                    bindData[1] |= bitmask;
                    return createWrapper.apply(null, bindData);
                  }
                  var creater =
                    bitmask == 1 || bitmask === 17
                      ? baseBind
                      : baseCreateWrapper;
                  return creater([
                    func,
                    bitmask,
                    partialArgs,
                    partialRightArgs,
                    thisArg,
                    arity,
                  ]);
                }
                function escapeHtmlChar(match) {
                  return htmlEscapes[match];
                }
                function getIndexOf() {
                  var result =
                    (result = lodash.indexOf) === indexOf
                      ? baseIndexOf
                      : result;
                  return result;
                }
                function isNative(value) {
                  return typeof value == "function" && reNative.test(value);
                }
                var setBindData = !defineProperty
                  ? noop
                  : function (func, value) {
                      descriptor.value = value;
                      defineProperty(func, "__bindData__", descriptor);
                    };
                function shimIsPlainObject(value) {
                  var ctor, result;
                  if (
                    !(value && toString.call(value) == objectClass) ||
                    ((ctor = value.constructor),
                    isFunction(ctor) && !(ctor instanceof ctor))
                  ) {
                    return false;
                  }
                  forIn(value, function (value, key) {
                    result = key;
                  });
                  return (
                    typeof result == "undefined" ||
                    hasOwnProperty.call(value, result)
                  );
                }
                function unescapeHtmlChar(match) {
                  return htmlUnescapes[match];
                }
                function isArguments(value) {
                  return (
                    (value &&
                      typeof value == "object" &&
                      typeof value.length == "number" &&
                      toString.call(value) == argsClass) ||
                    false
                  );
                }
                var isArray =
                  nativeIsArray ||
                  function (value) {
                    return (
                      (value &&
                        typeof value == "object" &&
                        typeof value.length == "number" &&
                        toString.call(value) == arrayClass) ||
                      false
                    );
                  };
                var shimKeys = function (object) {
                  var index,
                    iterable = object,
                    result = [];
                  if (!iterable) return result;
                  if (!objectTypes[typeof object]) return result;
                  for (index in iterable) {
                    if (hasOwnProperty.call(iterable, index)) {
                      result.push(index);
                    }
                  }
                  return result;
                };
                var keys = !nativeKeys
                  ? shimKeys
                  : function (object) {
                      if (!isObject(object)) {
                        return [];
                      }
                      return nativeKeys(object);
                    };
                var htmlEscapes = {
                  "&": "&amp;",
                  "<": "&lt;",
                  ">": "&gt;",
                  '"': "&quot;",
                  "'": "&#39;",
                };
                var htmlUnescapes = invert(htmlEscapes);
                var reEscapedHtml = RegExp(
                    "(" + keys(htmlUnescapes).join("|") + ")",
                    "g"
                  ),
                  reUnescapedHtml = RegExp(
                    "[" + keys(htmlEscapes).join("") + "]",
                    "g"
                  );
                var assign = function (object, source, guard) {
                  var index,
                    iterable = object,
                    result = iterable;
                  if (!iterable) return result;
                  var args = arguments,
                    argsIndex = 0,
                    argsLength = typeof guard == "number" ? 2 : args.length;
                  if (
                    argsLength > 3 &&
                    typeof args[argsLength - 2] == "function"
                  ) {
                    var callback = baseCreateCallback(
                      args[--argsLength - 1],
                      args[argsLength--],
                      2
                    );
                  } else if (
                    argsLength > 2 &&
                    typeof args[argsLength - 1] == "function"
                  ) {
                    callback = args[--argsLength];
                  }
                  while (++argsIndex < argsLength) {
                    iterable = args[argsIndex];
                    if (iterable && objectTypes[typeof iterable]) {
                      var ownIndex = -1,
                        ownProps =
                          objectTypes[typeof iterable] && keys(iterable),
                        length = ownProps ? ownProps.length : 0;
                      while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        result[index] = callback
                          ? callback(result[index], iterable[index])
                          : iterable[index];
                      }
                    }
                  }
                  return result;
                };
                function clone(value, isDeep, callback, thisArg) {
                  if (typeof isDeep != "boolean" && isDeep != null) {
                    thisArg = callback;
                    callback = isDeep;
                    isDeep = false;
                  }
                  return baseClone(
                    value,
                    isDeep,
                    typeof callback == "function" &&
                      baseCreateCallback(callback, thisArg, 1)
                  );
                }
                function cloneDeep(value, callback, thisArg) {
                  return baseClone(
                    value,
                    true,
                    typeof callback == "function" &&
                      baseCreateCallback(callback, thisArg, 1)
                  );
                }
                function create(prototype, properties) {
                  var result = baseCreate(prototype);
                  return properties ? assign(result, properties) : result;
                }
                var defaults = function (object, source, guard) {
                  var index,
                    iterable = object,
                    result = iterable;
                  if (!iterable) return result;
                  var args = arguments,
                    argsIndex = 0,
                    argsLength = typeof guard == "number" ? 2 : args.length;
                  while (++argsIndex < argsLength) {
                    iterable = args[argsIndex];
                    if (iterable && objectTypes[typeof iterable]) {
                      var ownIndex = -1,
                        ownProps =
                          objectTypes[typeof iterable] && keys(iterable),
                        length = ownProps ? ownProps.length : 0;
                      while (++ownIndex < length) {
                        index = ownProps[ownIndex];
                        if (typeof result[index] == "undefined")
                          result[index] = iterable[index];
                      }
                    }
                  }
                  return result;
                };
                function findKey(object, callback, thisArg) {
                  var result;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  forOwn(object, function (value, key, object) {
                    if (callback(value, key, object)) {
                      result = key;
                      return false;
                    }
                  });
                  return result;
                }
                function findLastKey(object, callback, thisArg) {
                  var result;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  forOwnRight(object, function (value, key, object) {
                    if (callback(value, key, object)) {
                      result = key;
                      return false;
                    }
                  });
                  return result;
                }
                var forIn = function (collection, callback, thisArg) {
                  var index,
                    iterable = collection,
                    result = iterable;
                  if (!iterable) return result;
                  if (!objectTypes[typeof iterable]) return result;
                  callback =
                    callback && typeof thisArg == "undefined"
                      ? callback
                      : baseCreateCallback(callback, thisArg, 3);
                  for (index in iterable) {
                    if (callback(iterable[index], index, collection) === false)
                      return result;
                  }
                  return result;
                };
                function forInRight(object, callback, thisArg) {
                  var pairs = [];
                  forIn(object, function (value, key) {
                    pairs.push(key, value);
                  });
                  var length = pairs.length;
                  callback = baseCreateCallback(callback, thisArg, 3);
                  while (length--) {
                    if (
                      callback(pairs[length--], pairs[length], object) === false
                    ) {
                      break;
                    }
                  }
                  return object;
                }
                var forOwn = function (collection, callback, thisArg) {
                  var index,
                    iterable = collection,
                    result = iterable;
                  if (!iterable) return result;
                  if (!objectTypes[typeof iterable]) return result;
                  callback =
                    callback && typeof thisArg == "undefined"
                      ? callback
                      : baseCreateCallback(callback, thisArg, 3);
                  var ownIndex = -1,
                    ownProps = objectTypes[typeof iterable] && keys(iterable),
                    length = ownProps ? ownProps.length : 0;
                  while (++ownIndex < length) {
                    index = ownProps[ownIndex];
                    if (callback(iterable[index], index, collection) === false)
                      return result;
                  }
                  return result;
                };
                function forOwnRight(object, callback, thisArg) {
                  var props = keys(object),
                    length = props.length;
                  callback = baseCreateCallback(callback, thisArg, 3);
                  while (length--) {
                    var key = props[length];
                    if (callback(object[key], key, object) === false) {
                      break;
                    }
                  }
                  return object;
                }
                function functions(object) {
                  var result = [];
                  forIn(object, function (value, key) {
                    if (isFunction(value)) {
                      result.push(key);
                    }
                  });
                  return result.sort();
                }
                function has(object, key) {
                  return object ? hasOwnProperty.call(object, key) : false;
                }
                function invert(object) {
                  var index = -1,
                    props = keys(object),
                    length = props.length,
                    result = {};
                  while (++index < length) {
                    var key = props[index];
                    result[object[key]] = key;
                  }
                  return result;
                }
                function isBoolean(value) {
                  return (
                    value === true ||
                    value === false ||
                    (value &&
                      typeof value == "object" &&
                      toString.call(value) == boolClass) ||
                    false
                  );
                }
                function isDate(value) {
                  return (
                    (value &&
                      typeof value == "object" &&
                      toString.call(value) == dateClass) ||
                    false
                  );
                }
                function isElement(value) {
                  return (value && value.nodeType === 1) || false;
                }
                function isEmpty(value) {
                  var result = true;
                  if (!value) {
                    return result;
                  }
                  var className = toString.call(value),
                    length = value.length;
                  if (
                    className == arrayClass ||
                    className == stringClass ||
                    className == argsClass ||
                    (className == objectClass &&
                      typeof length == "number" &&
                      isFunction(value.splice))
                  ) {
                    return !length;
                  }
                  forOwn(value, function () {
                    return (result = false);
                  });
                  return result;
                }
                function isEqual(a, b, callback, thisArg) {
                  return baseIsEqual(
                    a,
                    b,
                    typeof callback == "function" &&
                      baseCreateCallback(callback, thisArg, 2)
                  );
                }
                function isFinite(value) {
                  return (
                    nativeIsFinite(value) && !nativeIsNaN(parseFloat(value))
                  );
                }
                function isFunction(value) {
                  return typeof value == "function";
                }
                function isObject(value) {
                  return !!(value && objectTypes[typeof value]);
                }
                function isNaN(value) {
                  return isNumber(value) && value != +value;
                }
                function isNull(value) {
                  return value === null;
                }
                function isNumber(value) {
                  return (
                    typeof value == "number" ||
                    (value &&
                      typeof value == "object" &&
                      toString.call(value) == numberClass) ||
                    false
                  );
                }
                var isPlainObject = !getPrototypeOf
                  ? shimIsPlainObject
                  : function (value) {
                      if (!(value && toString.call(value) == objectClass)) {
                        return false;
                      }
                      var valueOf = value.valueOf,
                        objProto =
                          isNative(valueOf) &&
                          (objProto = getPrototypeOf(valueOf)) &&
                          getPrototypeOf(objProto);
                      return objProto
                        ? value == objProto || getPrototypeOf(value) == objProto
                        : shimIsPlainObject(value);
                    };
                function isRegExp(value) {
                  return (
                    (value &&
                      typeof value == "object" &&
                      toString.call(value) == regexpClass) ||
                    false
                  );
                }
                function isString(value) {
                  return (
                    typeof value == "string" ||
                    (value &&
                      typeof value == "object" &&
                      toString.call(value) == stringClass) ||
                    false
                  );
                }
                function isUndefined(value) {
                  return typeof value == "undefined";
                }
                function mapValues(object, callback, thisArg) {
                  var result = {};
                  callback = lodash.createCallback(callback, thisArg, 3);
                  forOwn(object, function (value, key, object) {
                    result[key] = callback(value, key, object);
                  });
                  return result;
                }
                function merge(object) {
                  var args = arguments,
                    length = 2;
                  if (!isObject(object)) {
                    return object;
                  }
                  if (typeof args[2] != "number") {
                    length = args.length;
                  }
                  if (length > 3 && typeof args[length - 2] == "function") {
                    var callback = baseCreateCallback(
                      args[--length - 1],
                      args[length--],
                      2
                    );
                  } else if (
                    length > 2 &&
                    typeof args[length - 1] == "function"
                  ) {
                    callback = args[--length];
                  }
                  var sources = slice(arguments, 1, length),
                    index = -1,
                    stackA = getArray(),
                    stackB = getArray();
                  while (++index < length) {
                    baseMerge(object, sources[index], callback, stackA, stackB);
                  }
                  releaseArray(stackA);
                  releaseArray(stackB);
                  return object;
                }
                function omit(object, callback, thisArg) {
                  var result = {};
                  if (typeof callback != "function") {
                    var props = [];
                    forIn(object, function (value, key) {
                      props.push(key);
                    });
                    props = baseDifference(
                      props,
                      baseFlatten(arguments, true, false, 1)
                    );
                    var index = -1,
                      length = props.length;
                    while (++index < length) {
                      var key = props[index];
                      result[key] = object[key];
                    }
                  } else {
                    callback = lodash.createCallback(callback, thisArg, 3);
                    forIn(object, function (value, key, object) {
                      if (!callback(value, key, object)) {
                        result[key] = value;
                      }
                    });
                  }
                  return result;
                }
                function pairs(object) {
                  var index = -1,
                    props = keys(object),
                    length = props.length,
                    result = Array(length);
                  while (++index < length) {
                    var key = props[index];
                    result[index] = [key, object[key]];
                  }
                  return result;
                }
                function pick(object, callback, thisArg) {
                  var result = {};
                  if (typeof callback != "function") {
                    var index = -1,
                      props = baseFlatten(arguments, true, false, 1),
                      length = isObject(object) ? props.length : 0;
                    while (++index < length) {
                      var key = props[index];
                      if (key in object) {
                        result[key] = object[key];
                      }
                    }
                  } else {
                    callback = lodash.createCallback(callback, thisArg, 3);
                    forIn(object, function (value, key, object) {
                      if (callback(value, key, object)) {
                        result[key] = value;
                      }
                    });
                  }
                  return result;
                }
                function transform(object, callback, accumulator, thisArg) {
                  var isArr = isArray(object);
                  if (accumulator == null) {
                    if (isArr) {
                      accumulator = [];
                    } else {
                      var ctor = object && object.constructor,
                        proto = ctor && ctor.prototype;
                      accumulator = baseCreate(proto);
                    }
                  }
                  if (callback) {
                    callback = lodash.createCallback(callback, thisArg, 4);
                    (isArr ? forEach : forOwn)(
                      object,
                      function (value, index, object) {
                        return callback(accumulator, value, index, object);
                      }
                    );
                  }
                  return accumulator;
                }
                function values(object) {
                  var index = -1,
                    props = keys(object),
                    length = props.length,
                    result = Array(length);
                  while (++index < length) {
                    result[index] = object[props[index]];
                  }
                  return result;
                }
                function at(collection) {
                  var args = arguments,
                    index = -1,
                    props = baseFlatten(args, true, false, 1),
                    length =
                      args[2] && args[2][args[1]] === collection
                        ? 1
                        : props.length,
                    result = Array(length);
                  while (++index < length) {
                    result[index] = collection[props[index]];
                  }
                  return result;
                }
                function contains(collection, target, fromIndex) {
                  var index = -1,
                    indexOf = getIndexOf(),
                    length = collection ? collection.length : 0,
                    result = false;
                  fromIndex =
                    (fromIndex < 0
                      ? nativeMax(0, length + fromIndex)
                      : fromIndex) || 0;
                  if (isArray(collection)) {
                    result = indexOf(collection, target, fromIndex) > -1;
                  } else if (typeof length == "number") {
                    result =
                      (isString(collection)
                        ? collection.indexOf(target, fromIndex)
                        : indexOf(collection, target, fromIndex)) > -1;
                  } else {
                    forOwn(collection, function (value) {
                      if (++index >= fromIndex) {
                        return !(result = value === target);
                      }
                    });
                  }
                  return result;
                }
                var countBy = createAggregator(function (result, value, key) {
                  hasOwnProperty.call(result, key)
                    ? result[key]++
                    : (result[key] = 1);
                });
                function every(collection, callback, thisArg) {
                  var result = true;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  var index = -1,
                    length = collection ? collection.length : 0;
                  if (typeof length == "number") {
                    while (++index < length) {
                      if (
                        !(result = !!callback(
                          collection[index],
                          index,
                          collection
                        ))
                      ) {
                        break;
                      }
                    }
                  } else {
                    forOwn(collection, function (value, index, collection) {
                      return (result = !!callback(value, index, collection));
                    });
                  }
                  return result;
                }
                function filter(collection, callback, thisArg) {
                  var result = [];
                  callback = lodash.createCallback(callback, thisArg, 3);
                  var index = -1,
                    length = collection ? collection.length : 0;
                  if (typeof length == "number") {
                    while (++index < length) {
                      var value = collection[index];
                      if (callback(value, index, collection)) {
                        result.push(value);
                      }
                    }
                  } else {
                    forOwn(collection, function (value, index, collection) {
                      if (callback(value, index, collection)) {
                        result.push(value);
                      }
                    });
                  }
                  return result;
                }
                function find(collection, callback, thisArg) {
                  callback = lodash.createCallback(callback, thisArg, 3);
                  var index = -1,
                    length = collection ? collection.length : 0;
                  if (typeof length == "number") {
                    while (++index < length) {
                      var value = collection[index];
                      if (callback(value, index, collection)) {
                        return value;
                      }
                    }
                  } else {
                    var result;
                    forOwn(collection, function (value, index, collection) {
                      if (callback(value, index, collection)) {
                        result = value;
                        return false;
                      }
                    });
                    return result;
                  }
                }
                function findLast(collection, callback, thisArg) {
                  var result;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  forEachRight(collection, function (value, index, collection) {
                    if (callback(value, index, collection)) {
                      result = value;
                      return false;
                    }
                  });
                  return result;
                }
                function forEach(collection, callback, thisArg) {
                  var index = -1,
                    length = collection ? collection.length : 0;
                  callback =
                    callback && typeof thisArg == "undefined"
                      ? callback
                      : baseCreateCallback(callback, thisArg, 3);
                  if (typeof length == "number") {
                    while (++index < length) {
                      if (
                        callback(collection[index], index, collection) === false
                      ) {
                        break;
                      }
                    }
                  } else {
                    forOwn(collection, callback);
                  }
                  return collection;
                }
                function forEachRight(collection, callback, thisArg) {
                  var length = collection ? collection.length : 0;
                  callback =
                    callback && typeof thisArg == "undefined"
                      ? callback
                      : baseCreateCallback(callback, thisArg, 3);
                  if (typeof length == "number") {
                    while (length--) {
                      if (
                        callback(collection[length], length, collection) ===
                        false
                      ) {
                        break;
                      }
                    }
                  } else {
                    var props = keys(collection);
                    length = props.length;
                    forOwn(collection, function (value, key, collection) {
                      key = props ? props[--length] : --length;
                      return callback(collection[key], key, collection);
                    });
                  }
                  return collection;
                }
                var groupBy = createAggregator(function (result, value, key) {
                  (hasOwnProperty.call(result, key)
                    ? result[key]
                    : (result[key] = [])
                  ).push(value);
                });
                var indexBy = createAggregator(function (result, value, key) {
                  result[key] = value;
                });
                function invoke(collection, methodName) {
                  var args = slice(arguments, 2),
                    index = -1,
                    isFunc = typeof methodName == "function",
                    length = collection ? collection.length : 0,
                    result = Array(typeof length == "number" ? length : 0);
                  forEach(collection, function (value) {
                    result[++index] = (
                      isFunc ? methodName : value[methodName]
                    ).apply(value, args);
                  });
                  return result;
                }
                function map(collection, callback, thisArg) {
                  var index = -1,
                    length = collection ? collection.length : 0;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  if (typeof length == "number") {
                    var result = Array(length);
                    while (++index < length) {
                      result[index] = callback(
                        collection[index],
                        index,
                        collection
                      );
                    }
                  } else {
                    result = [];
                    forOwn(collection, function (value, key, collection) {
                      result[++index] = callback(value, key, collection);
                    });
                  }
                  return result;
                }
                function max(collection, callback, thisArg) {
                  var computed = -Infinity,
                    result = computed;
                  if (
                    typeof callback != "function" &&
                    thisArg &&
                    thisArg[callback] === collection
                  ) {
                    callback = null;
                  }
                  if (callback == null && isArray(collection)) {
                    var index = -1,
                      length = collection.length;
                    while (++index < length) {
                      var value = collection[index];
                      if (value > result) {
                        result = value;
                      }
                    }
                  } else {
                    callback =
                      callback == null && isString(collection)
                        ? charAtCallback
                        : lodash.createCallback(callback, thisArg, 3);
                    forEach(collection, function (value, index, collection) {
                      var current = callback(value, index, collection);
                      if (current > computed) {
                        computed = current;
                        result = value;
                      }
                    });
                  }
                  return result;
                }
                function min(collection, callback, thisArg) {
                  var computed = Infinity,
                    result = computed;
                  if (
                    typeof callback != "function" &&
                    thisArg &&
                    thisArg[callback] === collection
                  ) {
                    callback = null;
                  }
                  if (callback == null && isArray(collection)) {
                    var index = -1,
                      length = collection.length;
                    while (++index < length) {
                      var value = collection[index];
                      if (value < result) {
                        result = value;
                      }
                    }
                  } else {
                    callback =
                      callback == null && isString(collection)
                        ? charAtCallback
                        : lodash.createCallback(callback, thisArg, 3);
                    forEach(collection, function (value, index, collection) {
                      var current = callback(value, index, collection);
                      if (current < computed) {
                        computed = current;
                        result = value;
                      }
                    });
                  }
                  return result;
                }
                var pluck = map;
                function reduce(collection, callback, accumulator, thisArg) {
                  if (!collection) return accumulator;
                  var noaccum = arguments.length < 3;
                  callback = lodash.createCallback(callback, thisArg, 4);
                  var index = -1,
                    length = collection.length;
                  if (typeof length == "number") {
                    if (noaccum) {
                      accumulator = collection[++index];
                    }
                    while (++index < length) {
                      accumulator = callback(
                        accumulator,
                        collection[index],
                        index,
                        collection
                      );
                    }
                  } else {
                    forOwn(collection, function (value, index, collection) {
                      accumulator = noaccum
                        ? ((noaccum = false), value)
                        : callback(accumulator, value, index, collection);
                    });
                  }
                  return accumulator;
                }
                function reduceRight(
                  collection,
                  callback,
                  accumulator,
                  thisArg
                ) {
                  var noaccum = arguments.length < 3;
                  callback = lodash.createCallback(callback, thisArg, 4);
                  forEachRight(collection, function (value, index, collection) {
                    accumulator = noaccum
                      ? ((noaccum = false), value)
                      : callback(accumulator, value, index, collection);
                  });
                  return accumulator;
                }
                function reject(collection, callback, thisArg) {
                  callback = lodash.createCallback(callback, thisArg, 3);
                  return filter(
                    collection,
                    function (value, index, collection) {
                      return !callback(value, index, collection);
                    }
                  );
                }
                function sample(collection, n, guard) {
                  if (collection && typeof collection.length != "number") {
                    collection = values(collection);
                  }
                  if (n == null || guard) {
                    return collection
                      ? collection[baseRandom(0, collection.length - 1)]
                      : undefined;
                  }
                  var result = shuffle(collection);
                  result.length = nativeMin(nativeMax(0, n), result.length);
                  return result;
                }
                function shuffle(collection) {
                  var index = -1,
                    length = collection ? collection.length : 0,
                    result = Array(typeof length == "number" ? length : 0);
                  forEach(collection, function (value) {
                    var rand = baseRandom(0, ++index);
                    result[index] = result[rand];
                    result[rand] = value;
                  });
                  return result;
                }
                function size(collection) {
                  var length = collection ? collection.length : 0;
                  return typeof length == "number"
                    ? length
                    : keys(collection).length;
                }
                function some(collection, callback, thisArg) {
                  var result;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  var index = -1,
                    length = collection ? collection.length : 0;
                  if (typeof length == "number") {
                    while (++index < length) {
                      if (
                        (result = callback(
                          collection[index],
                          index,
                          collection
                        ))
                      ) {
                        break;
                      }
                    }
                  } else {
                    forOwn(collection, function (value, index, collection) {
                      return !(result = callback(value, index, collection));
                    });
                  }
                  return !!result;
                }
                function sortBy(collection, callback, thisArg) {
                  var index = -1,
                    isArr = isArray(callback),
                    length = collection ? collection.length : 0,
                    result = Array(typeof length == "number" ? length : 0);
                  if (!isArr) {
                    callback = lodash.createCallback(callback, thisArg, 3);
                  }
                  forEach(collection, function (value, key, collection) {
                    var object = (result[++index] = getObject());
                    if (isArr) {
                      object.criteria = map(callback, function (key) {
                        return value[key];
                      });
                    } else {
                      (object.criteria = getArray())[0] = callback(
                        value,
                        key,
                        collection
                      );
                    }
                    object.index = index;
                    object.value = value;
                  });
                  length = result.length;
                  result.sort(compareAscending);
                  while (length--) {
                    var object = result[length];
                    result[length] = object.value;
                    if (!isArr) {
                      releaseArray(object.criteria);
                    }
                    releaseObject(object);
                  }
                  return result;
                }
                function toArray(collection) {
                  if (collection && typeof collection.length == "number") {
                    return slice(collection);
                  }
                  return values(collection);
                }
                var where = filter;
                function compact(array) {
                  var index = -1,
                    length = array ? array.length : 0,
                    result = [];
                  while (++index < length) {
                    var value = array[index];
                    if (value) {
                      result.push(value);
                    }
                  }
                  return result;
                }
                function difference(array) {
                  return baseDifference(
                    array,
                    baseFlatten(arguments, true, true, 1)
                  );
                }
                function findIndex(array, callback, thisArg) {
                  var index = -1,
                    length = array ? array.length : 0;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  while (++index < length) {
                    if (callback(array[index], index, array)) {
                      return index;
                    }
                  }
                  return -1;
                }
                function findLastIndex(array, callback, thisArg) {
                  var length = array ? array.length : 0;
                  callback = lodash.createCallback(callback, thisArg, 3);
                  while (length--) {
                    if (callback(array[length], length, array)) {
                      return length;
                    }
                  }
                  return -1;
                }
                function first(array, callback, thisArg) {
                  var n = 0,
                    length = array ? array.length : 0;
                  if (typeof callback != "number" && callback != null) {
                    var index = -1;
                    callback = lodash.createCallback(callback, thisArg, 3);
                    while (
                      ++index < length &&
                      callback(array[index], index, array)
                    ) {
                      n++;
                    }
                  } else {
                    n = callback;
                    if (n == null || thisArg) {
                      return array ? array[0] : undefined;
                    }
                  }
                  return slice(array, 0, nativeMin(nativeMax(0, n), length));
                }
                function flatten(array, isShallow, callback, thisArg) {
                  if (typeof isShallow != "boolean" && isShallow != null) {
                    thisArg = callback;
                    callback =
                      typeof isShallow != "function" &&
                      thisArg &&
                      thisArg[isShallow] === array
                        ? null
                        : isShallow;
                    isShallow = false;
                  }
                  if (callback != null) {
                    array = map(array, callback, thisArg);
                  }
                  return baseFlatten(array, isShallow);
                }
                function indexOf(array, value, fromIndex) {
                  if (typeof fromIndex == "number") {
                    var length = array ? array.length : 0;
                    fromIndex =
                      fromIndex < 0
                        ? nativeMax(0, length + fromIndex)
                        : fromIndex || 0;
                  } else if (fromIndex) {
                    var index = sortedIndex(array, value);
                    return array[index] === value ? index : -1;
                  }
                  return baseIndexOf(array, value, fromIndex);
                }
                function initial(array, callback, thisArg) {
                  var n = 0,
                    length = array ? array.length : 0;
                  if (typeof callback != "number" && callback != null) {
                    var index = length;
                    callback = lodash.createCallback(callback, thisArg, 3);
                    while (index-- && callback(array[index], index, array)) {
                      n++;
                    }
                  } else {
                    n = callback == null || thisArg ? 1 : callback || n;
                  }
                  return slice(
                    array,
                    0,
                    nativeMin(nativeMax(0, length - n), length)
                  );
                }
                function intersection() {
                  var args = [],
                    argsIndex = -1,
                    argsLength = arguments.length,
                    caches = getArray(),
                    indexOf = getIndexOf(),
                    trustIndexOf = indexOf === baseIndexOf,
                    seen = getArray();
                  while (++argsIndex < argsLength) {
                    var value = arguments[argsIndex];
                    if (isArray(value) || isArguments(value)) {
                      args.push(value);
                      caches.push(
                        trustIndexOf &&
                          value.length >= largeArraySize &&
                          createCache(argsIndex ? args[argsIndex] : seen)
                      );
                    }
                  }
                  var array = args[0],
                    index = -1,
                    length = array ? array.length : 0,
                    result = [];
                  outer: while (++index < length) {
                    var cache = caches[0];
                    value = array[index];
                    if (
                      (cache
                        ? cacheIndexOf(cache, value)
                        : indexOf(seen, value)) < 0
                    ) {
                      argsIndex = argsLength;
                      (cache || seen).push(value);
                      while (--argsIndex) {
                        cache = caches[argsIndex];
                        if (
                          (cache
                            ? cacheIndexOf(cache, value)
                            : indexOf(args[argsIndex], value)) < 0
                        ) {
                          continue outer;
                        }
                      }
                      result.push(value);
                    }
                  }
                  while (argsLength--) {
                    cache = caches[argsLength];
                    if (cache) {
                      releaseObject(cache);
                    }
                  }
                  releaseArray(caches);
                  releaseArray(seen);
                  return result;
                }
                function last(array, callback, thisArg) {
                  var n = 0,
                    length = array ? array.length : 0;
                  if (typeof callback != "number" && callback != null) {
                    var index = length;
                    callback = lodash.createCallback(callback, thisArg, 3);
                    while (index-- && callback(array[index], index, array)) {
                      n++;
                    }
                  } else {
                    n = callback;
                    if (n == null || thisArg) {
                      return array ? array[length - 1] : undefined;
                    }
                  }
                  return slice(array, nativeMax(0, length - n));
                }
                function lastIndexOf(array, value, fromIndex) {
                  var index = array ? array.length : 0;
                  if (typeof fromIndex == "number") {
                    index =
                      (fromIndex < 0
                        ? nativeMax(0, index + fromIndex)
                        : nativeMin(fromIndex, index - 1)) + 1;
                  }
                  while (index--) {
                    if (array[index] === value) {
                      return index;
                    }
                  }
                  return -1;
                }
                function pull(array) {
                  var args = arguments,
                    argsIndex = 0,
                    argsLength = args.length,
                    length = array ? array.length : 0;
                  while (++argsIndex < argsLength) {
                    var index = -1,
                      value = args[argsIndex];
                    while (++index < length) {
                      if (array[index] === value) {
                        splice.call(array, index--, 1);
                        length--;
                      }
                    }
                  }
                  return array;
                }
                function range(start, end, step) {
                  start = +start || 0;
                  step = typeof step == "number" ? step : +step || 1;
                  if (end == null) {
                    end = start;
                    start = 0;
                  }
                  var index = -1,
                    length = nativeMax(0, ceil((end - start) / (step || 1))),
                    result = Array(length);
                  while (++index < length) {
                    result[index] = start;
                    start += step;
                  }
                  return result;
                }
                function remove(array, callback, thisArg) {
                  var index = -1,
                    length = array ? array.length : 0,
                    result = [];
                  callback = lodash.createCallback(callback, thisArg, 3);
                  while (++index < length) {
                    var value = array[index];
                    if (callback(value, index, array)) {
                      result.push(value);
                      splice.call(array, index--, 1);
                      length--;
                    }
                  }
                  return result;
                }
                function rest(array, callback, thisArg) {
                  if (typeof callback != "number" && callback != null) {
                    var n = 0,
                      index = -1,
                      length = array ? array.length : 0;
                    callback = lodash.createCallback(callback, thisArg, 3);
                    while (
                      ++index < length &&
                      callback(array[index], index, array)
                    ) {
                      n++;
                    }
                  } else {
                    n =
                      callback == null || thisArg ? 1 : nativeMax(0, callback);
                  }
                  return slice(array, n);
                }
                function sortedIndex(array, value, callback, thisArg) {
                  var low = 0,
                    high = array ? array.length : low;
                  callback = callback
                    ? lodash.createCallback(callback, thisArg, 1)
                    : identity;
                  value = callback(value);
                  while (low < high) {
                    var mid = (low + high) >>> 1;
                    callback(array[mid]) < value
                      ? (low = mid + 1)
                      : (high = mid);
                  }
                  return low;
                }
                function union() {
                  return baseUniq(baseFlatten(arguments, true, true));
                }
                function uniq(array, isSorted, callback, thisArg) {
                  if (typeof isSorted != "boolean" && isSorted != null) {
                    thisArg = callback;
                    callback =
                      typeof isSorted != "function" &&
                      thisArg &&
                      thisArg[isSorted] === array
                        ? null
                        : isSorted;
                    isSorted = false;
                  }
                  if (callback != null) {
                    callback = lodash.createCallback(callback, thisArg, 3);
                  }
                  return baseUniq(array, isSorted, callback);
                }
                function without(array) {
                  return baseDifference(array, slice(arguments, 1));
                }
                function xor() {
                  var index = -1,
                    length = arguments.length;
                  while (++index < length) {
                    var array = arguments[index];
                    if (isArray(array) || isArguments(array)) {
                      var result = result
                        ? baseUniq(
                            baseDifference(result, array).concat(
                              baseDifference(array, result)
                            )
                          )
                        : array;
                    }
                  }
                  return result || [];
                }
                function zip() {
                  var array = arguments.length > 1 ? arguments : arguments[0],
                    index = -1,
                    length = array ? max(pluck(array, "length")) : 0,
                    result = Array(length < 0 ? 0 : length);
                  while (++index < length) {
                    result[index] = pluck(array, index);
                  }
                  return result;
                }
                function zipObject(keys, values) {
                  var index = -1,
                    length = keys ? keys.length : 0,
                    result = {};
                  if (!values && length && !isArray(keys[0])) {
                    values = [];
                  }
                  while (++index < length) {
                    var key = keys[index];
                    if (values) {
                      result[key] = values[index];
                    } else if (key) {
                      result[key[0]] = key[1];
                    }
                  }
                  return result;
                }
                function after(n, func) {
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  return function () {
                    if (--n < 1) {
                      return func.apply(this, arguments);
                    }
                  };
                }
                function bind(func, thisArg) {
                  return arguments.length > 2
                    ? createWrapper(
                        func,
                        17,
                        slice(arguments, 2),
                        null,
                        thisArg
                      )
                    : createWrapper(func, 1, null, null, thisArg);
                }
                function bindAll(object) {
                  var funcs =
                      arguments.length > 1
                        ? baseFlatten(arguments, true, false, 1)
                        : functions(object),
                    index = -1,
                    length = funcs.length;
                  while (++index < length) {
                    var key = funcs[index];
                    object[key] = createWrapper(
                      object[key],
                      1,
                      null,
                      null,
                      object
                    );
                  }
                  return object;
                }
                function bindKey(object, key) {
                  return arguments.length > 2
                    ? createWrapper(key, 19, slice(arguments, 2), null, object)
                    : createWrapper(key, 3, null, null, object);
                }
                function compose() {
                  var funcs = arguments,
                    length = funcs.length;
                  while (length--) {
                    if (!isFunction(funcs[length])) {
                      throw new TypeError();
                    }
                  }
                  return function () {
                    var args = arguments,
                      length = funcs.length;
                    while (length--) {
                      args = [funcs[length].apply(this, args)];
                    }
                    return args[0];
                  };
                }
                function curry(func, arity) {
                  arity =
                    typeof arity == "number" ? arity : +arity || func.length;
                  return createWrapper(func, 4, null, null, null, arity);
                }
                function debounce(func, wait, options) {
                  var args,
                    maxTimeoutId,
                    result,
                    stamp,
                    thisArg,
                    timeoutId,
                    trailingCall,
                    lastCalled = 0,
                    maxWait = false,
                    trailing = true;
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  wait = nativeMax(0, wait) || 0;
                  if (options === true) {
                    var leading = true;
                    trailing = false;
                  } else if (isObject(options)) {
                    leading = options.leading;
                    maxWait =
                      "maxWait" in options &&
                      (nativeMax(wait, options.maxWait) || 0);
                    trailing =
                      "trailing" in options ? options.trailing : trailing;
                  }
                  var delayed = function () {
                    var remaining = wait - (now() - stamp);
                    if (remaining <= 0) {
                      if (maxTimeoutId) {
                        clearTimeout(maxTimeoutId);
                      }
                      var isCalled = trailingCall;
                      maxTimeoutId = timeoutId = trailingCall = undefined;
                      if (isCalled) {
                        lastCalled = now();
                        result = func.apply(thisArg, args);
                        if (!timeoutId && !maxTimeoutId) {
                          args = thisArg = null;
                        }
                      }
                    } else {
                      timeoutId = setTimeout(delayed, remaining);
                    }
                  };
                  var maxDelayed = function () {
                    if (timeoutId) {
                      clearTimeout(timeoutId);
                    }
                    maxTimeoutId = timeoutId = trailingCall = undefined;
                    if (trailing || maxWait !== wait) {
                      lastCalled = now();
                      result = func.apply(thisArg, args);
                      if (!timeoutId && !maxTimeoutId) {
                        args = thisArg = null;
                      }
                    }
                  };
                  return function () {
                    args = arguments;
                    stamp = now();
                    thisArg = this;
                    trailingCall = trailing && (timeoutId || !leading);
                    if (maxWait === false) {
                      var leadingCall = leading && !timeoutId;
                    } else {
                      if (!maxTimeoutId && !leading) {
                        lastCalled = stamp;
                      }
                      var remaining = maxWait - (stamp - lastCalled),
                        isCalled = remaining <= 0;
                      if (isCalled) {
                        if (maxTimeoutId) {
                          maxTimeoutId = clearTimeout(maxTimeoutId);
                        }
                        lastCalled = stamp;
                        result = func.apply(thisArg, args);
                      } else if (!maxTimeoutId) {
                        maxTimeoutId = setTimeout(maxDelayed, remaining);
                      }
                    }
                    if (isCalled && timeoutId) {
                      timeoutId = clearTimeout(timeoutId);
                    } else if (!timeoutId && wait !== maxWait) {
                      timeoutId = setTimeout(delayed, wait);
                    }
                    if (leadingCall) {
                      isCalled = true;
                      result = func.apply(thisArg, args);
                    }
                    if (isCalled && !timeoutId && !maxTimeoutId) {
                      args = thisArg = null;
                    }
                    return result;
                  };
                }
                function defer(func) {
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  var args = slice(arguments, 1);
                  return setTimeout(function () {
                    func.apply(undefined, args);
                  }, 1);
                }
                function delay(func, wait) {
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  var args = slice(arguments, 2);
                  return setTimeout(function () {
                    func.apply(undefined, args);
                  }, wait);
                }
                function memoize(func, resolver) {
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  var memoized = function () {
                    var cache = memoized.cache,
                      key = resolver
                        ? resolver.apply(this, arguments)
                        : keyPrefix + arguments[0];
                    return hasOwnProperty.call(cache, key)
                      ? cache[key]
                      : (cache[key] = func.apply(this, arguments));
                  };
                  memoized.cache = {};
                  return memoized;
                }
                function once(func) {
                  var ran, result;
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  return function () {
                    if (ran) {
                      return result;
                    }
                    ran = true;
                    result = func.apply(this, arguments);
                    func = null;
                    return result;
                  };
                }
                function partial(func) {
                  return createWrapper(func, 16, slice(arguments, 1));
                }
                function partialRight(func) {
                  return createWrapper(func, 32, null, slice(arguments, 1));
                }
                function throttle(func, wait, options) {
                  var leading = true,
                    trailing = true;
                  if (!isFunction(func)) {
                    throw new TypeError();
                  }
                  if (options === false) {
                    leading = false;
                  } else if (isObject(options)) {
                    leading = "leading" in options ? options.leading : leading;
                    trailing =
                      "trailing" in options ? options.trailing : trailing;
                  }
                  debounceOptions.leading = leading;
                  debounceOptions.maxWait = wait;
                  debounceOptions.trailing = trailing;
                  return debounce(func, wait, debounceOptions);
                }
                function wrap(value, wrapper) {
                  return createWrapper(wrapper, 16, [value]);
                }
                function constant(value) {
                  return function () {
                    return value;
                  };
                }
                function createCallback(func, thisArg, argCount) {
                  var type = typeof func;
                  if (func == null || type == "function") {
                    return baseCreateCallback(func, thisArg, argCount);
                  }
                  if (type != "object") {
                    return property(func);
                  }
                  var props = keys(func),
                    key = props[0],
                    a = func[key];
                  if (props.length == 1 && a === a && !isObject(a)) {
                    return function (object) {
                      var b = object[key];
                      return a === b && (a !== 0 || 1 / a == 1 / b);
                    };
                  }
                  return function (object) {
                    var length = props.length,
                      result = false;
                    while (length--) {
                      if (
                        !(result = baseIsEqual(
                          object[props[length]],
                          func[props[length]],
                          null,
                          true
                        ))
                      ) {
                        break;
                      }
                    }
                    return result;
                  };
                }
                function escape(string) {
                  return string == null
                    ? ""
                    : String(string).replace(reUnescapedHtml, escapeHtmlChar);
                }
                function identity(value) {
                  return value;
                }
                function mixin(object, source, options) {
                  var chain = true,
                    methodNames = source && functions(source);
                  if (!source || (!options && !methodNames.length)) {
                    if (options == null) {
                      options = source;
                    }
                    ctor = lodashWrapper;
                    source = object;
                    object = lodash;
                    methodNames = functions(source);
                  }
                  if (options === false) {
                    chain = false;
                  } else if (isObject(options) && "chain" in options) {
                    chain = options.chain;
                  }
                  var ctor = object,
                    isFunc = isFunction(ctor);
                  forEach(methodNames, function (methodName) {
                    var func = (object[methodName] = source[methodName]);
                    if (isFunc) {
                      ctor.prototype[methodName] = function () {
                        var chainAll = this.__chain__,
                          value = this.__wrapped__,
                          args = [value];
                        push.apply(args, arguments);
                        var result = func.apply(object, args);
                        if (chain || chainAll) {
                          if (value === result && isObject(result)) {
                            return this;
                          }
                          result = new ctor(result);
                          result.__chain__ = chainAll;
                        }
                        return result;
                      };
                    }
                  });
                }
                function noConflict() {
                  context._ = oldDash;
                  return this;
                }
                function noop() {}
                var now =
                  (isNative((now = Date.now)) && now) ||
                  function () {
                    return new Date().getTime();
                  };
                var parseInt =
                  nativeParseInt(whitespace + "08") == 8
                    ? nativeParseInt
                    : function (value, radix) {
                        return nativeParseInt(
                          isString(value)
                            ? value.replace(reLeadingSpacesAndZeros, "")
                            : value,
                          radix || 0
                        );
                      };
                function property(key) {
                  return function (object) {
                    return object[key];
                  };
                }
                function random(min, max, floating) {
                  var noMin = min == null,
                    noMax = max == null;
                  if (floating == null) {
                    if (typeof min == "boolean" && noMax) {
                      floating = min;
                      min = 1;
                    } else if (!noMax && typeof max == "boolean") {
                      floating = max;
                      noMax = true;
                    }
                  }
                  if (noMin && noMax) {
                    max = 1;
                  }
                  min = +min || 0;
                  if (noMax) {
                    max = min;
                    min = 0;
                  } else {
                    max = +max || 0;
                  }
                  if (floating || min % 1 || max % 1) {
                    var rand = nativeRandom();
                    return nativeMin(
                      min +
                        rand *
                          (max -
                            min +
                            parseFloat("1e-" + ((rand + "").length - 1))),
                      max
                    );
                  }
                  return baseRandom(min, max);
                }
                function result(object, key) {
                  if (object) {
                    var value = object[key];
                    return isFunction(value) ? object[key]() : value;
                  }
                }
                function template(text, data, options) {
                  var settings = lodash.templateSettings;
                  text = String(text || "");
                  options = defaults({}, options, settings);
                  var imports = defaults({}, options.imports, settings.imports),
                    importsKeys = keys(imports),
                    importsValues = values(imports);
                  var isEvaluating,
                    index = 0,
                    interpolate = options.interpolate || reNoMatch,
                    source = "__p += '";
                  var reDelimiters = RegExp(
                    (options.escape || reNoMatch).source +
                      "|" +
                      interpolate.source +
                      "|" +
                      (interpolate === reInterpolate ? reEsTemplate : reNoMatch)
                        .source +
                      "|" +
                      (options.evaluate || reNoMatch).source +
                      "|$",
                    "g"
                  );
                  text.replace(
                    reDelimiters,
                    function (
                      match,
                      escapeValue,
                      interpolateValue,
                      esTemplateValue,
                      evaluateValue,
                      offset
                    ) {
                      interpolateValue || (interpolateValue = esTemplateValue);
                      source += text
                        .slice(index, offset)
                        .replace(reUnescapedString, escapeStringChar);
                      if (escapeValue) {
                        source += "' +\n__e(" + escapeValue + ") +\n'";
                      }
                      if (evaluateValue) {
                        isEvaluating = true;
                        source += "';\n" + evaluateValue + ";\n__p += '";
                      }
                      if (interpolateValue) {
                        source +=
                          "' +\n((__t = (" +
                          interpolateValue +
                          ")) == null ? '' : __t) +\n'";
                      }
                      index = offset + match.length;
                      return match;
                    }
                  );
                  source += "';\n";
                  var variable = options.variable,
                    hasVariable = variable;
                  if (!hasVariable) {
                    variable = "obj";
                    source = "with (" + variable + ") {\n" + source + "\n}\n";
                  }
                  source = (
                    isEvaluating
                      ? source.replace(reEmptyStringLeading, "")
                      : source
                  )
                    .replace(reEmptyStringMiddle, "$1")
                    .replace(reEmptyStringTrailing, "$1;");
                  source =
                    "function(" +
                    variable +
                    ") {\n" +
                    (hasVariable
                      ? ""
                      : variable + " || (" + variable + " = {});\n") +
                    "var __t, __p = '', __e = _.escape" +
                    (isEvaluating
                      ? ", __j = Array.prototype.join;\n" +
                        "function print() { __p += __j.call(arguments, '') }\n"
                      : ";\n") +
                    source +
                    "return __p\n}";
                  var sourceURL =
                    "\n/*\n//# sourceURL=" +
                    (options.sourceURL ||
                      "/lodash/template/source[" + templateCounter++ + "]") +
                    "\n*/";
                  try {
                    var result = Function(
                      importsKeys,
                      "return " + source + sourceURL
                    ).apply(undefined, importsValues);
                  } catch (e) {
                    e.source = source;
                    throw e;
                  }
                  if (data) {
                    return result(data);
                  }
                  result.source = source;
                  return result;
                }
                function times(n, callback, thisArg) {
                  n = (n = +n) > -1 ? n : 0;
                  var index = -1,
                    result = Array(n);
                  callback = baseCreateCallback(callback, thisArg, 1);
                  while (++index < n) {
                    result[index] = callback(index);
                  }
                  return result;
                }
                function unescape(string) {
                  return string == null
                    ? ""
                    : String(string).replace(reEscapedHtml, unescapeHtmlChar);
                }
                function uniqueId(prefix) {
                  var id = ++idCounter;
                  return String(prefix == null ? "" : prefix) + id;
                }
                function chain(value) {
                  value = new lodashWrapper(value);
                  value.__chain__ = true;
                  return value;
                }
                function tap(value, interceptor) {
                  interceptor(value);
                  return value;
                }
                function wrapperChain() {
                  this.__chain__ = true;
                  return this;
                }
                function wrapperToString() {
                  return String(this.__wrapped__);
                }
                function wrapperValueOf() {
                  return this.__wrapped__;
                }
                lodash.after = after;
                lodash.assign = assign;
                lodash.at = at;
                lodash.bind = bind;
                lodash.bindAll = bindAll;
                lodash.bindKey = bindKey;
                lodash.chain = chain;
                lodash.compact = compact;
                lodash.compose = compose;
                lodash.constant = constant;
                lodash.countBy = countBy;
                lodash.create = create;
                lodash.createCallback = createCallback;
                lodash.curry = curry;
                lodash.debounce = debounce;
                lodash.defaults = defaults;
                lodash.defer = defer;
                lodash.delay = delay;
                lodash.difference = difference;
                lodash.filter = filter;
                lodash.flatten = flatten;
                lodash.forEach = forEach;
                lodash.forEachRight = forEachRight;
                lodash.forIn = forIn;
                lodash.forInRight = forInRight;
                lodash.forOwn = forOwn;
                lodash.forOwnRight = forOwnRight;
                lodash.functions = functions;
                lodash.groupBy = groupBy;
                lodash.indexBy = indexBy;
                lodash.initial = initial;
                lodash.intersection = intersection;
                lodash.invert = invert;
                lodash.invoke = invoke;
                lodash.keys = keys;
                lodash.map = map;
                lodash.mapValues = mapValues;
                lodash.max = max;
                lodash.memoize = memoize;
                lodash.merge = merge;
                lodash.min = min;
                lodash.omit = omit;
                lodash.once = once;
                lodash.pairs = pairs;
                lodash.partial = partial;
                lodash.partialRight = partialRight;
                lodash.pick = pick;
                lodash.pluck = pluck;
                lodash.property = property;
                lodash.pull = pull;
                lodash.range = range;
                lodash.reject = reject;
                lodash.remove = remove;
                lodash.rest = rest;
                lodash.shuffle = shuffle;
                lodash.sortBy = sortBy;
                lodash.tap = tap;
                lodash.throttle = throttle;
                lodash.times = times;
                lodash.toArray = toArray;
                lodash.transform = transform;
                lodash.union = union;
                lodash.uniq = uniq;
                lodash.values = values;
                lodash.where = where;
                lodash.without = without;
                lodash.wrap = wrap;
                lodash.xor = xor;
                lodash.zip = zip;
                lodash.zipObject = zipObject;
                lodash.collect = map;
                lodash.drop = rest;
                lodash.each = forEach;
                lodash.eachRight = forEachRight;
                lodash.extend = assign;
                lodash.methods = functions;
                lodash.object = zipObject;
                lodash.select = filter;
                lodash.tail = rest;
                lodash.unique = uniq;
                lodash.unzip = zip;
                mixin(lodash);
                lodash.clone = clone;
                lodash.cloneDeep = cloneDeep;
                lodash.contains = contains;
                lodash.escape = escape;
                lodash.every = every;
                lodash.find = find;
                lodash.findIndex = findIndex;
                lodash.findKey = findKey;
                lodash.findLast = findLast;
                lodash.findLastIndex = findLastIndex;
                lodash.findLastKey = findLastKey;
                lodash.has = has;
                lodash.identity = identity;
                lodash.indexOf = indexOf;
                lodash.isArguments = isArguments;
                lodash.isArray = isArray;
                lodash.isBoolean = isBoolean;
                lodash.isDate = isDate;
                lodash.isElement = isElement;
                lodash.isEmpty = isEmpty;
                lodash.isEqual = isEqual;
                lodash.isFinite = isFinite;
                lodash.isFunction = isFunction;
                lodash.isNaN = isNaN;
                lodash.isNull = isNull;
                lodash.isNumber = isNumber;
                lodash.isObject = isObject;
                lodash.isPlainObject = isPlainObject;
                lodash.isRegExp = isRegExp;
                lodash.isString = isString;
                lodash.isUndefined = isUndefined;
                lodash.lastIndexOf = lastIndexOf;
                lodash.mixin = mixin;
                lodash.noConflict = noConflict;
                lodash.noop = noop;
                lodash.now = now;
                lodash.parseInt = parseInt;
                lodash.random = random;
                lodash.reduce = reduce;
                lodash.reduceRight = reduceRight;
                lodash.result = result;
                lodash.runInContext = runInContext;
                lodash.size = size;
                lodash.some = some;
                lodash.sortedIndex = sortedIndex;
                lodash.template = template;
                lodash.unescape = unescape;
                lodash.uniqueId = uniqueId;
                lodash.all = every;
                lodash.any = some;
                lodash.detect = find;
                lodash.findWhere = find;
                lodash.foldl = reduce;
                lodash.foldr = reduceRight;
                lodash.include = contains;
                lodash.inject = reduce;
                mixin(
                  (function () {
                    var source = {};
                    forOwn(lodash, function (func, methodName) {
                      if (!lodash.prototype[methodName]) {
                        source[methodName] = func;
                      }
                    });
                    return source;
                  })(),
                  false
                );
                lodash.first = first;
                lodash.last = last;
                lodash.sample = sample;
                lodash.take = first;
                lodash.head = first;
                forOwn(lodash, function (func, methodName) {
                  var callbackable = methodName !== "sample";
                  if (!lodash.prototype[methodName]) {
                    lodash.prototype[methodName] = function (n, guard) {
                      var chainAll = this.__chain__,
                        result = func(this.__wrapped__, n, guard);
                      return !chainAll &&
                        (n == null ||
                          (guard && !(callbackable && typeof n == "function")))
                        ? result
                        : new lodashWrapper(result, chainAll);
                    };
                  }
                });
                lodash.VERSION = "2.4.1";
                lodash.prototype.chain = wrapperChain;
                lodash.prototype.toString = wrapperToString;
                lodash.prototype.value = wrapperValueOf;
                lodash.prototype.valueOf = wrapperValueOf;
                forEach(["join", "pop", "shift"], function (methodName) {
                  var func = arrayRef[methodName];
                  lodash.prototype[methodName] = function () {
                    var chainAll = this.__chain__,
                      result = func.apply(this.__wrapped__, arguments);
                    return chainAll
                      ? new lodashWrapper(result, chainAll)
                      : result;
                  };
                });
                forEach(
                  ["push", "reverse", "sort", "unshift"],
                  function (methodName) {
                    var func = arrayRef[methodName];
                    lodash.prototype[methodName] = function () {
                      func.apply(this.__wrapped__, arguments);
                      return this;
                    };
                  }
                );
                forEach(["concat", "slice", "splice"], function (methodName) {
                  var func = arrayRef[methodName];
                  lodash.prototype[methodName] = function () {
                    return new lodashWrapper(
                      func.apply(this.__wrapped__, arguments),
                      this.__chain__
                    );
                  };
                });
                return lodash;
              }
              var _ = runInContext();
              if (
                typeof define == "function" &&
                typeof define.amd == "object" &&
                define.amd
              ) {
                root._ = _;
                define(function () {
                  return _;
                });
              } else if (freeExports && freeModule) {
                if (moduleExports) {
                  (freeModule.exports = _)._ = _;
                } else {
                  freeExports._ = _;
                }
              } else {
                root._ = _;
              }
            }.call(this));
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      93: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("ast-types");
          var isArray = types.builtInTypes.array;
          var b = types.builders;
          var n = types.namedTypes;
          var leap = require("./leap");
          var meta = require("./meta");
          var runtimeProperty = require("./util").runtimeProperty;
          var runtimeKeysMethod = runtimeProperty("keys");
          var hasOwn = Object.prototype.hasOwnProperty;
          function Emitter(contextId) {
            assert.ok(this instanceof Emitter);
            n.Identifier.assert(contextId);
            Object.defineProperties(this, {
              contextId: { value: contextId },
              listing: { value: [] },
              marked: { value: [true] },
              finalLoc: { value: loc() },
              tryEntries: { value: [] },
            });
            Object.defineProperties(this, {
              leapManager: { value: new leap.LeapManager(this) },
            });
          }
          var Ep = Emitter.prototype;
          exports.Emitter = Emitter;
          function loc() {
            return b.literal(-1);
          }
          Ep.mark = function (loc) {
            n.Literal.assert(loc);
            var index = this.listing.length;
            if (loc.value === -1) {
              loc.value = index;
            } else {
              assert.strictEqual(loc.value, index);
            }
            this.marked[index] = true;
            return loc;
          };
          Ep.emit = function (node) {
            if (n.Expression.check(node)) node = b.expressionStatement(node);
            n.Statement.assert(node);
            this.listing.push(node);
          };
          Ep.emitAssign = function (lhs, rhs) {
            this.emit(this.assign(lhs, rhs));
            return lhs;
          };
          Ep.assign = function (lhs, rhs) {
            return b.expressionStatement(b.assignmentExpression("=", lhs, rhs));
          };
          Ep.contextProperty = function (name) {
            return b.memberExpression(
              this.contextId,
              b.identifier(name),
              false
            );
          };
          var volatileContextPropertyNames = {
            prev: true,
            next: true,
            sent: true,
            rval: true,
          };
          Ep.isVolatileContextProperty = function (expr) {
            if (n.MemberExpression.check(expr)) {
              if (expr.computed) {
                return true;
              }
              if (
                n.Identifier.check(expr.object) &&
                n.Identifier.check(expr.property) &&
                expr.object.name === this.contextId.name &&
                hasOwn.call(volatileContextPropertyNames, expr.property.name)
              ) {
                return true;
              }
            }
            return false;
          };
          Ep.stop = function (rval) {
            if (rval) {
              this.setReturnValue(rval);
            }
            this.jump(this.finalLoc);
          };
          Ep.setReturnValue = function (valuePath) {
            n.Expression.assert(valuePath.value);
            this.emitAssign(
              this.contextProperty("rval"),
              this.explodeExpression(valuePath)
            );
          };
          Ep.clearPendingException = function (tryLoc, assignee) {
            n.Literal.assert(tryLoc);
            var catchCall = b.callExpression(this.contextProperty("catch"), [
              tryLoc,
            ]);
            if (assignee) {
              this.emitAssign(assignee, catchCall);
            } else {
              this.emit(catchCall);
            }
          };
          Ep.jump = function (toLoc) {
            this.emitAssign(this.contextProperty("next"), toLoc);
            this.emit(b.breakStatement());
          };
          Ep.jumpIf = function (test, toLoc) {
            n.Expression.assert(test);
            n.Literal.assert(toLoc);
            this.emit(
              b.ifStatement(
                test,
                b.blockStatement([
                  this.assign(this.contextProperty("next"), toLoc),
                  b.breakStatement(),
                ])
              )
            );
          };
          Ep.jumpIfNot = function (test, toLoc) {
            n.Expression.assert(test);
            n.Literal.assert(toLoc);
            var negatedTest;
            if (n.UnaryExpression.check(test) && test.operator === "!") {
              negatedTest = test.argument;
            } else {
              negatedTest = b.unaryExpression("!", test);
            }
            this.emit(
              b.ifStatement(
                negatedTest,
                b.blockStatement([
                  this.assign(this.contextProperty("next"), toLoc),
                  b.breakStatement(),
                ])
              )
            );
          };
          var nextTempId = 0;
          Ep.makeTempVar = function () {
            return this.contextProperty("t" + nextTempId++);
          };
          Ep.getContextFunction = function (id) {
            return b.functionExpression(
              id || null,
              [this.contextId],
              b.blockStatement([this.getDispatchLoop()]),
              false,
              false
            );
          };
          Ep.getDispatchLoop = function () {
            var self = this;
            var cases = [];
            var current;
            var alreadyEnded = false;
            self.listing.forEach(function (stmt, i) {
              if (self.marked.hasOwnProperty(i)) {
                cases.push(b.switchCase(b.literal(i), (current = [])));
                alreadyEnded = false;
              }
              if (!alreadyEnded) {
                current.push(stmt);
                if (isSwitchCaseEnder(stmt)) alreadyEnded = true;
              }
            });
            this.finalLoc.value = this.listing.length;
            cases.push(
              b.switchCase(this.finalLoc, []),
              b.switchCase(b.literal("end"), [
                b.returnStatement(
                  b.callExpression(this.contextProperty("stop"), [])
                ),
              ])
            );
            return b.whileStatement(
              b.literal(1),
              b.switchStatement(
                b.assignmentExpression(
                  "=",
                  this.contextProperty("prev"),
                  this.contextProperty("next")
                ),
                cases
              )
            );
          };
          function isSwitchCaseEnder(stmt) {
            return (
              n.BreakStatement.check(stmt) ||
              n.ContinueStatement.check(stmt) ||
              n.ReturnStatement.check(stmt) ||
              n.ThrowStatement.check(stmt)
            );
          }
          Ep.getTryEntryList = function () {
            if (this.tryEntries.length === 0) {
              return null;
            }
            var lastLocValue = 0;
            return b.arrayExpression(
              this.tryEntries.map(function (tryEntry) {
                var thisLocValue = tryEntry.firstLoc.value;
                assert.ok(
                  thisLocValue >= lastLocValue,
                  "try entries out of order"
                );
                lastLocValue = thisLocValue;
                var ce = tryEntry.catchEntry;
                var fe = tryEntry.finallyEntry;
                var triple = [tryEntry.firstLoc, ce ? ce.firstLoc : null];
                if (fe) {
                  triple[2] = fe.firstLoc;
                }
                return b.arrayExpression(triple);
              })
            );
          };
          Ep.explode = function (path, ignoreResult) {
            assert.ok(path instanceof types.NodePath);
            var node = path.value;
            var self = this;
            n.Node.assert(node);
            if (n.Statement.check(node)) return self.explodeStatement(path);
            if (n.Expression.check(node))
              return self.explodeExpression(path, ignoreResult);
            if (n.Declaration.check(node)) throw getDeclError(node);
            switch (node.type) {
              case "Program":
                return path.get("body").map(self.explodeStatement, self);
              case "VariableDeclarator":
                throw getDeclError(node);
              case "Property":
              case "SwitchCase":
              case "CatchClause":
                throw new Error(
                  node.type + " nodes should be handled by their parents"
                );
              default:
                throw new Error(
                  "unknown Node of type " + JSON.stringify(node.type)
                );
            }
          };
          function getDeclError(node) {
            return new Error(
              "all declarations should have been transformed into " +
                "assignments before the Exploder began its work: " +
                JSON.stringify(node)
            );
          }
          Ep.explodeStatement = function (path, labelId) {
            assert.ok(path instanceof types.NodePath);
            var stmt = path.value;
            var self = this;
            n.Statement.assert(stmt);
            if (labelId) {
              n.Identifier.assert(labelId);
            } else {
              labelId = null;
            }
            if (n.BlockStatement.check(stmt)) {
              return path.get("body").each(self.explodeStatement, self);
            }
            if (!meta.containsLeap(stmt)) {
              self.emit(stmt);
              return;
            }
            switch (stmt.type) {
              case "ExpressionStatement":
                self.explodeExpression(path.get("expression"), true);
                break;
              case "LabeledStatement":
                self.explodeStatement(path.get("body"), stmt.label);
                break;
              case "WhileStatement":
                var before = loc();
                var after = loc();
                self.mark(before);
                self.jumpIfNot(self.explodeExpression(path.get("test")), after);
                self.leapManager.withEntry(
                  new leap.LoopEntry(after, before, labelId),
                  function () {
                    self.explodeStatement(path.get("body"));
                  }
                );
                self.jump(before);
                self.mark(after);
                break;
              case "DoWhileStatement":
                var first = loc();
                var test = loc();
                var after = loc();
                self.mark(first);
                self.leapManager.withEntry(
                  new leap.LoopEntry(after, test, labelId),
                  function () {
                    self.explode(path.get("body"));
                  }
                );
                self.mark(test);
                self.jumpIf(self.explodeExpression(path.get("test")), first);
                self.mark(after);
                break;
              case "ForStatement":
                var head = loc();
                var update = loc();
                var after = loc();
                if (stmt.init) {
                  self.explode(path.get("init"), true);
                }
                self.mark(head);
                if (stmt.test) {
                  self.jumpIfNot(
                    self.explodeExpression(path.get("test")),
                    after
                  );
                } else {
                }
                self.leapManager.withEntry(
                  new leap.LoopEntry(after, update, labelId),
                  function () {
                    self.explodeStatement(path.get("body"));
                  }
                );
                self.mark(update);
                if (stmt.update) {
                  self.explode(path.get("update"), true);
                }
                self.jump(head);
                self.mark(after);
                break;
              case "ForInStatement":
                n.Identifier.assert(stmt.left);
                var head = loc();
                var after = loc();
                var keyIterNextFn = self.makeTempVar();
                self.emitAssign(
                  keyIterNextFn,
                  b.callExpression(runtimeKeysMethod, [
                    self.explodeExpression(path.get("right")),
                  ])
                );
                self.mark(head);
                var keyInfoTmpVar = self.makeTempVar();
                self.jumpIf(
                  b.memberExpression(
                    b.assignmentExpression(
                      "=",
                      keyInfoTmpVar,
                      b.callExpression(keyIterNextFn, [])
                    ),
                    b.identifier("done"),
                    false
                  ),
                  after
                );
                self.emitAssign(
                  stmt.left,
                  b.memberExpression(
                    keyInfoTmpVar,
                    b.identifier("value"),
                    false
                  )
                );
                self.leapManager.withEntry(
                  new leap.LoopEntry(after, head, labelId),
                  function () {
                    self.explodeStatement(path.get("body"));
                  }
                );
                self.jump(head);
                self.mark(after);
                break;
              case "BreakStatement":
                self.emitAbruptCompletion({
                  type: "break",
                  target: self.leapManager.getBreakLoc(stmt.label),
                });
                break;
              case "ContinueStatement":
                self.emitAbruptCompletion({
                  type: "continue",
                  target: self.leapManager.getContinueLoc(stmt.label),
                });
                break;
              case "SwitchStatement":
                var disc = self.emitAssign(
                  self.makeTempVar(),
                  self.explodeExpression(path.get("discriminant"))
                );
                var after = loc();
                var defaultLoc = loc();
                var condition = defaultLoc;
                var caseLocs = [];
                var cases = stmt.cases || [];
                for (var i = cases.length - 1; i >= 0; --i) {
                  var c = cases[i];
                  n.SwitchCase.assert(c);
                  if (c.test) {
                    condition = b.conditionalExpression(
                      b.binaryExpression("===", disc, c.test),
                      (caseLocs[i] = loc()),
                      condition
                    );
                  } else {
                    caseLocs[i] = defaultLoc;
                  }
                }
                self.jump(
                  self.explodeExpression(
                    new types.NodePath(condition, path, "discriminant")
                  )
                );
                self.leapManager.withEntry(
                  new leap.SwitchEntry(after),
                  function () {
                    path.get("cases").each(function (casePath) {
                      var c = casePath.value;
                      var i = casePath.name;
                      self.mark(caseLocs[i]);
                      casePath
                        .get("consequent")
                        .each(self.explodeStatement, self);
                    });
                  }
                );
                self.mark(after);
                if (defaultLoc.value === -1) {
                  self.mark(defaultLoc);
                  assert.strictEqual(after.value, defaultLoc.value);
                }
                break;
              case "IfStatement":
                var elseLoc = stmt.alternate && loc();
                var after = loc();
                self.jumpIfNot(
                  self.explodeExpression(path.get("test")),
                  elseLoc || after
                );
                self.explodeStatement(path.get("consequent"));
                if (elseLoc) {
                  self.jump(after);
                  self.mark(elseLoc);
                  self.explodeStatement(path.get("alternate"));
                }
                self.mark(after);
                break;
              case "ReturnStatement":
                self.emitAbruptCompletion({
                  type: "return",
                  value: self.explodeExpression(path.get("argument")),
                });
                break;
              case "WithStatement":
                throw new Error(
                  node.type + " not supported in generator functions."
                );
              case "TryStatement":
                var after = loc();
                var handler = stmt.handler;
                if (!handler && stmt.handlers) {
                  handler = stmt.handlers[0] || null;
                }
                var catchLoc = handler && loc();
                var catchEntry =
                  catchLoc && new leap.CatchEntry(catchLoc, handler.param);
                var finallyLoc = stmt.finalizer && loc();
                var finallyEntry =
                  finallyLoc && new leap.FinallyEntry(finallyLoc);
                var tryEntry = new leap.TryEntry(
                  self.getUnmarkedCurrentLoc(),
                  catchEntry,
                  finallyEntry
                );
                self.tryEntries.push(tryEntry);
                self.updateContextPrevLoc(tryEntry.firstLoc);
                self.leapManager.withEntry(tryEntry, function () {
                  self.explodeStatement(path.get("block"));
                  if (catchLoc) {
                    if (finallyLoc) {
                      self.jump(finallyLoc);
                    } else {
                      self.jump(after);
                    }
                    self.updateContextPrevLoc(self.mark(catchLoc));
                    var bodyPath = path.get("handler", "body");
                    var safeParam = self.makeTempVar();
                    self.clearPendingException(tryEntry.firstLoc, safeParam);
                    var catchScope = bodyPath.scope;
                    var catchParamName = handler.param.name;
                    n.CatchClause.assert(catchScope.node);
                    assert.strictEqual(
                      catchScope.lookup(catchParamName),
                      catchScope
                    );
                    types.visit(bodyPath, {
                      visitIdentifier: function (path) {
                        if (
                          path.value.name === catchParamName &&
                          path.scope.lookup(catchParamName) === catchScope
                        ) {
                          return safeParam;
                        }
                        this.traverse(path);
                      },
                    });
                    self.leapManager.withEntry(catchEntry, function () {
                      self.explodeStatement(bodyPath);
                    });
                  }
                  if (finallyLoc) {
                    self.updateContextPrevLoc(self.mark(finallyLoc));
                    self.leapManager.withEntry(finallyEntry, function () {
                      self.explodeStatement(path.get("finalizer"));
                    });
                    self.emit(
                      b.callExpression(self.contextProperty("finish"), [
                        finallyEntry.firstLoc,
                      ])
                    );
                  }
                });
                self.mark(after);
                break;
              case "ThrowStatement":
                self.emit(
                  b.throwStatement(self.explodeExpression(path.get("argument")))
                );
                break;
              default:
                throw new Error(
                  "unknown Statement of type " + JSON.stringify(stmt.type)
                );
            }
          };
          Ep.emitAbruptCompletion = function (record) {
            try {
              assert.ok(isValidCompletion(record));
            } catch (err) {
              err.message =
                "invalid completion record: " + JSON.stringify(record);
              throw err;
            }
            assert.notStrictEqual(
              record.type,
              "normal",
              "normal completions are not abrupt"
            );
            var abruptArgs = [b.literal(record.type)];
            if (record.type === "break" || record.type === "continue") {
              n.Literal.assert(record.target);
              abruptArgs[1] = record.target;
            } else if (record.type === "return" || record.type === "throw") {
              if (record.value) {
                n.Expression.assert(record.value);
                abruptArgs[1] = record.value;
              }
            }
            this.emit(
              b.returnStatement(
                b.callExpression(this.contextProperty("abrupt"), abruptArgs)
              )
            );
          };
          function isValidCompletion(record) {
            var type = record.type;
            if (type === "normal") {
              return !hasOwn.call(record, "target");
            }
            if (type === "break" || type === "continue") {
              return (
                !hasOwn.call(record, "value") && n.Literal.check(record.target)
              );
            }
            if (type === "return" || type === "throw") {
              return (
                hasOwn.call(record, "value") && !hasOwn.call(record, "target")
              );
            }
            return false;
          }
          Ep.getUnmarkedCurrentLoc = function () {
            return b.literal(this.listing.length);
          };
          Ep.updateContextPrevLoc = function (loc) {
            if (loc) {
              n.Literal.assert(loc);
              if (loc.value === -1) {
                loc.value = this.listing.length;
              } else {
                assert.strictEqual(loc.value, this.listing.length);
              }
            } else {
              loc = this.getUnmarkedCurrentLoc();
            }
            this.emitAssign(this.contextProperty("prev"), loc);
          };
          Ep.explodeExpression = function (path, ignoreResult) {
            assert.ok(path instanceof types.NodePath);
            var expr = path.value;
            if (expr) {
              n.Expression.assert(expr);
            } else {
              return expr;
            }
            var self = this;
            var result;
            function finish(expr) {
              n.Expression.assert(expr);
              if (ignoreResult) {
                self.emit(expr);
              } else {
                return expr;
              }
            }
            if (!meta.containsLeap(expr)) {
              return finish(expr);
            }
            var hasLeapingChildren = meta.containsLeap.onlyChildren(expr);
            function explodeViaTempVar(tempVar, childPath, ignoreChildResult) {
              assert.ok(childPath instanceof types.NodePath);
              assert.ok(
                !ignoreChildResult || !tempVar,
                "Ignoring the result of a child expression but forcing it to " +
                  "be assigned to a temporary variable?"
              );
              var result = self.explodeExpression(childPath, ignoreChildResult);
              if (ignoreChildResult) {
              } else if (
                tempVar ||
                (hasLeapingChildren &&
                  (self.isVolatileContextProperty(result) ||
                    meta.hasSideEffects(result)))
              ) {
                result = self.emitAssign(tempVar || self.makeTempVar(), result);
              }
              return result;
            }
            switch (expr.type) {
              case "ParenthesizedExpression":
                return finish(
                  b.parenthesizedExpression(
                    self.explodeExpression(path.get("expression"))
                  )
                );
              case "MemberExpression":
                return finish(
                  b.memberExpression(
                    self.explodeExpression(path.get("object")),
                    expr.computed
                      ? explodeViaTempVar(null, path.get("property"))
                      : expr.property,
                    expr.computed
                  )
                );
              case "CallExpression":
                var oldCalleePath = path.get("callee");
                var newCallee = self.explodeExpression(oldCalleePath);
                if (
                  !n.MemberExpression.check(oldCalleePath.node) &&
                  n.MemberExpression.check(newCallee)
                ) {
                  newCallee = b.sequenceExpression([b.literal(0), newCallee]);
                }
                return finish(
                  b.callExpression(
                    newCallee,
                    path.get("arguments").map(function (argPath) {
                      return explodeViaTempVar(null, argPath);
                    })
                  )
                );
              case "NewExpression":
                return finish(
                  b.newExpression(
                    explodeViaTempVar(null, path.get("callee")),
                    path.get("arguments").map(function (argPath) {
                      return explodeViaTempVar(null, argPath);
                    })
                  )
                );
              case "ObjectExpression":
                return finish(
                  b.objectExpression(
                    path.get("properties").map(function (propPath) {
                      return b.property(
                        propPath.value.kind,
                        propPath.value.key,
                        explodeViaTempVar(null, propPath.get("value"))
                      );
                    })
                  )
                );
              case "ArrayExpression":
                return finish(
                  b.arrayExpression(
                    path.get("elements").map(function (elemPath) {
                      return explodeViaTempVar(null, elemPath);
                    })
                  )
                );
              case "SequenceExpression":
                var lastIndex = expr.expressions.length - 1;
                path.get("expressions").each(function (exprPath) {
                  if (exprPath.name === lastIndex) {
                    result = self.explodeExpression(exprPath, ignoreResult);
                  } else {
                    self.explodeExpression(exprPath, true);
                  }
                });
                return result;
              case "LogicalExpression":
                var after = loc();
                if (!ignoreResult) {
                  result = self.makeTempVar();
                }
                var left = explodeViaTempVar(result, path.get("left"));
                if (expr.operator === "&&") {
                  self.jumpIfNot(left, after);
                } else {
                  assert.strictEqual(expr.operator, "||");
                  self.jumpIf(left, after);
                }
                explodeViaTempVar(result, path.get("right"), ignoreResult);
                self.mark(after);
                return result;
              case "ConditionalExpression":
                var elseLoc = loc();
                var after = loc();
                var test = self.explodeExpression(path.get("test"));
                self.jumpIfNot(test, elseLoc);
                if (!ignoreResult) {
                  result = self.makeTempVar();
                }
                explodeViaTempVar(result, path.get("consequent"), ignoreResult);
                self.jump(after);
                self.mark(elseLoc);
                explodeViaTempVar(result, path.get("alternate"), ignoreResult);
                self.mark(after);
                return result;
              case "UnaryExpression":
                return finish(
                  b.unaryExpression(
                    expr.operator,
                    self.explodeExpression(path.get("argument")),
                    !!expr.prefix
                  )
                );
              case "BinaryExpression":
                return finish(
                  b.binaryExpression(
                    expr.operator,
                    explodeViaTempVar(null, path.get("left")),
                    explodeViaTempVar(null, path.get("right"))
                  )
                );
              case "AssignmentExpression":
                return finish(
                  b.assignmentExpression(
                    expr.operator,
                    self.explodeExpression(path.get("left")),
                    self.explodeExpression(path.get("right"))
                  )
                );
              case "UpdateExpression":
                return finish(
                  b.updateExpression(
                    expr.operator,
                    self.explodeExpression(path.get("argument")),
                    expr.prefix
                  )
                );
              case "YieldExpression":
                var after = loc();
                var arg =
                  expr.argument && self.explodeExpression(path.get("argument"));
                if (arg && expr.delegate) {
                  var result = self.makeTempVar();
                  self.emit(
                    b.returnStatement(
                      b.callExpression(self.contextProperty("delegateYield"), [
                        arg,
                        b.literal(result.property.name),
                        after,
                      ])
                    )
                  );
                  self.mark(after);
                  return result;
                }
                self.emitAssign(self.contextProperty("next"), after);
                self.emit(b.returnStatement(arg || null));
                self.mark(after);
                return self.contextProperty("sent");
              default:
                throw new Error(
                  "unknown Expression of type " + JSON.stringify(expr.type)
                );
            }
          };
        },
        {
          "./leap": 95,
          "./meta": 96,
          "./util": 97,
          assert: 77,
          "ast-types": 75,
        },
      ],
      94: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("ast-types");
          var n = types.namedTypes;
          var b = types.builders;
          var hasOwn = Object.prototype.hasOwnProperty;
          exports.hoist = function (funPath) {
            assert.ok(funPath instanceof types.NodePath);
            n.Function.assert(funPath.value);
            var vars = {};
            function varDeclToExpr(vdec, includeIdentifiers) {
              n.VariableDeclaration.assert(vdec);
              var exprs = [];
              vdec.declarations.forEach(function (dec) {
                vars[dec.id.name] = dec.id;
                if (dec.init) {
                  exprs.push(b.assignmentExpression("=", dec.id, dec.init));
                } else if (includeIdentifiers) {
                  exprs.push(dec.id);
                }
              });
              if (exprs.length === 0) return null;
              if (exprs.length === 1) return exprs[0];
              return b.sequenceExpression(exprs);
            }
            types.visit(funPath.get("body"), {
              visitVariableDeclaration: function (path) {
                var expr = varDeclToExpr(path.value, false);
                if (expr === null) {
                  path.replace();
                } else {
                  return b.expressionStatement(expr);
                }
                return false;
              },
              visitForStatement: function (path) {
                var init = path.value.init;
                if (n.VariableDeclaration.check(init)) {
                  path.get("init").replace(varDeclToExpr(init, false));
                }
                this.traverse(path);
              },
              visitForInStatement: function (path) {
                var left = path.value.left;
                if (n.VariableDeclaration.check(left)) {
                  path.get("left").replace(varDeclToExpr(left, true));
                }
                this.traverse(path);
              },
              visitFunctionDeclaration: function (path) {
                var node = path.value;
                vars[node.id.name] = node.id;
                var parentNode = path.parent.node;
                var assignment = b.expressionStatement(
                  b.assignmentExpression(
                    "=",
                    node.id,
                    b.functionExpression(
                      node.id,
                      node.params,
                      node.body,
                      node.generator,
                      node.expression
                    )
                  )
                );
                if (n.BlockStatement.check(path.parent.node)) {
                  path.parent.get("body").unshift(assignment);
                  path.replace();
                } else {
                  path.replace(assignment);
                }
                return false;
              },
              visitFunctionExpression: function (path) {
                return false;
              },
            });
            var paramNames = {};
            funPath.get("params").each(function (paramPath) {
              var param = paramPath.value;
              if (n.Identifier.check(param)) {
                paramNames[param.name] = param;
              } else {
              }
            });
            var declarations = [];
            Object.keys(vars).forEach(function (name) {
              if (!hasOwn.call(paramNames, name)) {
                declarations.push(b.variableDeclarator(vars[name], null));
              }
            });
            if (declarations.length === 0) {
              return null;
            }
            return b.variableDeclaration("var", declarations);
          };
        },
        { assert: 77, "ast-types": 75 },
      ],
      95: [
        function (require, module, exports) {
          var assert = require("assert");
          var types = require("ast-types");
          var n = types.namedTypes;
          var b = types.builders;
          var inherits = require("util").inherits;
          var hasOwn = Object.prototype.hasOwnProperty;
          function Entry() {
            assert.ok(this instanceof Entry);
          }
          function FunctionEntry(returnLoc) {
            Entry.call(this);
            n.Literal.assert(returnLoc);
            Object.defineProperties(this, { returnLoc: { value: returnLoc } });
          }
          inherits(FunctionEntry, Entry);
          exports.FunctionEntry = FunctionEntry;
          function LoopEntry(breakLoc, continueLoc, label) {
            Entry.call(this);
            n.Literal.assert(breakLoc);
            n.Literal.assert(continueLoc);
            if (label) {
              n.Identifier.assert(label);
            } else {
              label = null;
            }
            Object.defineProperties(this, {
              breakLoc: { value: breakLoc },
              continueLoc: { value: continueLoc },
              label: { value: label },
            });
          }
          inherits(LoopEntry, Entry);
          exports.LoopEntry = LoopEntry;
          function SwitchEntry(breakLoc) {
            Entry.call(this);
            n.Literal.assert(breakLoc);
            Object.defineProperties(this, { breakLoc: { value: breakLoc } });
          }
          inherits(SwitchEntry, Entry);
          exports.SwitchEntry = SwitchEntry;
          function TryEntry(firstLoc, catchEntry, finallyEntry) {
            Entry.call(this);
            n.Literal.assert(firstLoc);
            if (catchEntry) {
              assert.ok(catchEntry instanceof CatchEntry);
            } else {
              catchEntry = null;
            }
            if (finallyEntry) {
              assert.ok(finallyEntry instanceof FinallyEntry);
            } else {
              finallyEntry = null;
            }
            assert.ok(catchEntry || finallyEntry);
            Object.defineProperties(this, {
              firstLoc: { value: firstLoc },
              catchEntry: { value: catchEntry },
              finallyEntry: { value: finallyEntry },
            });
          }
          inherits(TryEntry, Entry);
          exports.TryEntry = TryEntry;
          function CatchEntry(firstLoc, paramId) {
            Entry.call(this);
            n.Literal.assert(firstLoc);
            n.Identifier.assert(paramId);
            Object.defineProperties(this, {
              firstLoc: { value: firstLoc },
              paramId: { value: paramId },
            });
          }
          inherits(CatchEntry, Entry);
          exports.CatchEntry = CatchEntry;
          function FinallyEntry(firstLoc) {
            Entry.call(this);
            n.Literal.assert(firstLoc);
            Object.defineProperties(this, { firstLoc: { value: firstLoc } });
          }
          inherits(FinallyEntry, Entry);
          exports.FinallyEntry = FinallyEntry;
          function LeapManager(emitter) {
            assert.ok(this instanceof LeapManager);
            var Emitter = require("./emit").Emitter;
            assert.ok(emitter instanceof Emitter);
            Object.defineProperties(this, {
              emitter: { value: emitter },
              entryStack: { value: [new FunctionEntry(emitter.finalLoc)] },
            });
          }
          var LMp = LeapManager.prototype;
          exports.LeapManager = LeapManager;
          LMp.withEntry = function (entry, callback) {
            assert.ok(entry instanceof Entry);
            this.entryStack.push(entry);
            try {
              callback.call(this.emitter);
            } finally {
              var popped = this.entryStack.pop();
              assert.strictEqual(popped, entry);
            }
          };
          LMp._findLeapLocation = function (property, label) {
            for (var i = this.entryStack.length - 1; i >= 0; --i) {
              var entry = this.entryStack[i];
              var loc = entry[property];
              if (loc) {
                if (label) {
                  if (entry.label && entry.label.name === label.name) {
                    return loc;
                  }
                } else {
                  return loc;
                }
              }
            }
            return null;
          };
          LMp.getBreakLoc = function (label) {
            return this._findLeapLocation("breakLoc", label);
          };
          LMp.getContinueLoc = function (label) {
            return this._findLeapLocation("continueLoc", label);
          };
        },
        { "./emit": 93, assert: 77, "ast-types": 75, util: 86 },
      ],
      96: [
        function (require, module, exports) {
          var assert = require("assert");
          var m = require("private").makeAccessor();
          var types = require("ast-types");
          var isArray = types.builtInTypes.array;
          var n = types.namedTypes;
          var hasOwn = Object.prototype.hasOwnProperty;
          function makePredicate(propertyName, knownTypes) {
            function onlyChildren(node) {
              n.Node.assert(node);
              var result = false;
              function check(child) {
                if (result) {
                } else if (isArray.check(child)) {
                  child.some(check);
                } else if (n.Node.check(child)) {
                  assert.strictEqual(result, false);
                  result = predicate(child);
                }
                return result;
              }
              types.eachField(node, function (name, child) {
                check(child);
              });
              return result;
            }
            function predicate(node) {
              n.Node.assert(node);
              var meta = m(node);
              if (hasOwn.call(meta, propertyName)) return meta[propertyName];
              if (hasOwn.call(opaqueTypes, node.type))
                return (meta[propertyName] = false);
              if (hasOwn.call(knownTypes, node.type))
                return (meta[propertyName] = true);
              return (meta[propertyName] = onlyChildren(node));
            }
            predicate.onlyChildren = onlyChildren;
            return predicate;
          }
          var opaqueTypes = { FunctionExpression: true };
          var sideEffectTypes = {
            CallExpression: true,
            ForInStatement: true,
            UnaryExpression: true,
            BinaryExpression: true,
            AssignmentExpression: true,
            UpdateExpression: true,
            NewExpression: true,
          };
          var leapTypes = {
            YieldExpression: true,
            BreakStatement: true,
            ContinueStatement: true,
            ReturnStatement: true,
            ThrowStatement: true,
          };
          for (var type in leapTypes) {
            if (hasOwn.call(leapTypes, type)) {
              sideEffectTypes[type] = leapTypes[type];
            }
          }
          exports.hasSideEffects = makePredicate(
            "hasSideEffects",
            sideEffectTypes
          );
          exports.containsLeap = makePredicate("containsLeap", leapTypes);
        },
        { assert: 77, "ast-types": 75, private: 100 },
      ],
      97: [
        function (require, module, exports) {
          var b = require("ast-types").builders;
          var hasOwn = Object.prototype.hasOwnProperty;
          exports.defaults = function (obj) {
            var len = arguments.length;
            var extension;
            for (var i = 1; i < len; ++i) {
              if ((extension = arguments[i])) {
                for (var key in extension) {
                  if (hasOwn.call(extension, key) && !hasOwn.call(obj, key)) {
                    obj[key] = extension[key];
                  }
                }
              }
            }
            return obj;
          };
          exports.runtimeProperty = function (name) {
            return b.memberExpression(
              b.identifier("regeneratorRuntime"),
              b.identifier(name),
              false
            );
          };
        },
        { "ast-types": 75 },
      ],
      98: [
        function (require, module, exports) {
          var assert = require("assert");
          var fs = require("fs");
          var types = require("ast-types");
          var n = types.namedTypes;
          var b = types.builders;
          var isArray = types.builtInTypes.array;
          var isObject = types.builtInTypes.object;
          var NodePath = types.NodePath;
          var hoist = require("./hoist").hoist;
          var Emitter = require("./emit").Emitter;
          var runtimeProperty = require("./util").runtimeProperty;
          var runtimeWrapMethod = runtimeProperty("wrap");
          var runtimeMarkMethod = runtimeProperty("mark");
          var runtimeValuesMethod = runtimeProperty("values");
          var runtimeAsyncMethod = runtimeProperty("async");
          exports.transform = function transform(node, options) {
            return types.visit(node, visitor);
          };
          var visitor = types.PathVisitor.fromMethodsObject({
            visitFunction: function (path) {
              this.traverse(path);
              var node = path.value;
              if (!node.generator && !node.async) {
                return;
              }
              node.generator = false;
              if (node.expression) {
                node.expression = false;
                node.body = b.blockStatement([b.returnStatement(node.body)]);
              }
              if (node.async) {
                awaitVisitor.visit(path.get("body"));
              }
              var outerFnId =
                node.id ||
                (node.id = path.scope.parent.declareTemporary("callee$"));
              var innerFnId = b.identifier(node.id.name + "$");
              var contextId = path.scope.declareTemporary("context$");
              var argsId = path.scope.declareTemporary("args$");
              var shouldAliasArguments = renameArguments(path, argsId);
              var vars = hoist(path);
              if (shouldAliasArguments) {
                vars = vars || b.variableDeclaration("var", []);
                vars.declarations.push(
                  b.variableDeclarator(argsId, b.identifier("arguments"))
                );
              }
              var emitter = new Emitter(contextId);
              emitter.explode(path.get("body"));
              var outerBody = [];
              if (vars && vars.declarations.length > 0) {
                outerBody.push(vars);
              }
              var wrapArgs = [
                emitter.getContextFunction(innerFnId),
                node.async ? b.literal(null) : outerFnId,
                b.thisExpression(),
              ];
              var tryEntryList = emitter.getTryEntryList();
              if (tryEntryList) {
                wrapArgs.push(tryEntryList);
              }
              var wrapCall = b.callExpression(
                node.async ? runtimeAsyncMethod : runtimeWrapMethod,
                wrapArgs
              );
              outerBody.push(b.returnStatement(wrapCall));
              node.body = b.blockStatement(outerBody);
              if (node.async) {
                node.async = false;
                return;
              }
              if (n.FunctionDeclaration.check(node)) {
                var pp = path.parent;
                while (
                  pp &&
                  !(
                    n.BlockStatement.check(pp.value) ||
                    n.Program.check(pp.value)
                  )
                ) {
                  pp = pp.parent;
                }
                if (!pp) {
                  return;
                }
                path.replace();
                node.type = "FunctionExpression";
                var varDecl = b.variableDeclaration("var", [
                  b.variableDeclarator(
                    node.id,
                    b.callExpression(runtimeMarkMethod, [node])
                  ),
                ]);
                if (node.comments) {
                  varDecl.comments = node.comments;
                  node.comments = null;
                }
                var bodyPath = pp.get("body");
                var bodyLen = bodyPath.value.length;
                for (var i = 0; i < bodyLen; ++i) {
                  var firstStmtPath = bodyPath.get(i);
                  if (!shouldNotHoistAbove(firstStmtPath)) {
                    firstStmtPath.insertBefore(varDecl);
                    return;
                  }
                }
                bodyPath.push(varDecl);
              } else {
                n.FunctionExpression.assert(node);
                return b.callExpression(runtimeMarkMethod, [node]);
              }
            },
          });
          function shouldNotHoistAbove(stmtPath) {
            var value = stmtPath.value;
            n.Statement.assert(value);
            if (
              n.ExpressionStatement.check(value) &&
              n.Literal.check(value.expression) &&
              value.expression.value === "use strict"
            ) {
              return true;
            }
            if (n.VariableDeclaration.check(value)) {
              for (var i = 0; i < value.declarations.length; ++i) {
                var decl = value.declarations[i];
                if (
                  n.CallExpression.check(decl.init) &&
                  types.astNodesAreEquivalent(
                    decl.init.callee,
                    runtimeMarkMethod
                  )
                ) {
                  return true;
                }
              }
            }
            return false;
          }
          function renameArguments(funcPath, argsId) {
            assert.ok(funcPath instanceof types.NodePath);
            var func = funcPath.value;
            var didReplaceArguments = false;
            var hasImplicitArguments = false;
            types.visit(funcPath, {
              visitFunction: function (path) {
                if (path.value === func) {
                  hasImplicitArguments = !path.scope.lookup("arguments");
                  this.traverse(path);
                } else {
                  return false;
                }
              },
              visitIdentifier: function (path) {
                if (path.value.name === "arguments") {
                  var isMemberProperty =
                    n.MemberExpression.check(path.parent.node) &&
                    path.name === "property" &&
                    !path.parent.node.computed;
                  if (!isMemberProperty) {
                    path.replace(argsId);
                    didReplaceArguments = true;
                    return false;
                  }
                }
                this.traverse(path);
              },
            });
            return didReplaceArguments && hasImplicitArguments;
          }
          var awaitVisitor = types.PathVisitor.fromMethodsObject({
            visitFunction: function (path) {
              return false;
            },
            visitAwaitExpression: function (path) {
              return b.yieldExpression(path.value.argument, false);
            },
          });
        },
        {
          "./emit": 93,
          "./hoist": 94,
          "./util": 97,
          assert: 77,
          "ast-types": 75,
          fs: 76,
        },
      ],
      99: [
        function (require, module, exports) {
          (function (__dirname) {
            var assert = require("assert");
            var path = require("path");
            var fs = require("fs");
            var transform = require("./lib/visit").transform;
            var utils = require("./lib/util");
            var types = require("ast-types");
            var genOrAsyncFunExp = /\bfunction\s*\*|\basync\b/;
            var blockBindingExp = /\b(let|const)\s+/;
            function runtime() {
              require("./runtime");
            }
            exports.runtime = runtime;
            runtime.path = path.join(__dirname, "runtime.js");
            exports.transform = transform;
          }.call(this, "/node_modules/regenerator-6to5"));
        },
        {
          "./lib/util": 97,
          "./lib/visit": 98,
          "./runtime": 107,
          assert: 77,
          "ast-types": 75,
          fs: 76,
          path: 83,
        },
      ],
      100: [
        function (require, module, exports) {
          "use strict";
          var originalObject = Object;
          var originalDefProp = Object.defineProperty;
          var originalCreate = Object.create;
          function defProp(obj, name, value) {
            if (originalDefProp)
              try {
                originalDefProp.call(originalObject, obj, name, {
                  value: value,
                });
              } catch (definePropertyIsBrokenInIE8) {
                obj[name] = value;
              }
            else {
              obj[name] = value;
            }
          }
          function makeSafeToCall(fun) {
            if (fun) {
              defProp(fun, "call", fun.call);
              defProp(fun, "apply", fun.apply);
            }
            return fun;
          }
          makeSafeToCall(originalDefProp);
          makeSafeToCall(originalCreate);
          var hasOwn = makeSafeToCall(Object.prototype.hasOwnProperty);
          var numToStr = makeSafeToCall(Number.prototype.toString);
          var strSlice = makeSafeToCall(String.prototype.slice);
          var cloner = function () {};
          function create(prototype) {
            if (originalCreate) {
              return originalCreate.call(originalObject, prototype);
            }
            cloner.prototype = prototype || null;
            return new cloner();
          }
          var rand = Math.random;
          var uniqueKeys = create(null);
          function makeUniqueKey() {
            do var uniqueKey = strSlice.call(numToStr.call(rand(), 36), 2);
            while (hasOwn.call(uniqueKeys, uniqueKey));
            return (uniqueKeys[uniqueKey] = uniqueKey);
          }
          defProp(exports, "makeUniqueKey", makeUniqueKey);
          var originalGetOPNs = Object.getOwnPropertyNames;
          Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
            for (
              var names = originalGetOPNs(object),
                src = 0,
                dst = 0,
                len = names.length;
              src < len;
              ++src
            ) {
              if (!hasOwn.call(uniqueKeys, names[src])) {
                if (src > dst) {
                  names[dst] = names[src];
                }
                ++dst;
              }
            }
            names.length = dst;
            return names;
          };
          function defaultCreatorFn(object) {
            return create(null);
          }
          function makeAccessor(secretCreatorFn) {
            var brand = makeUniqueKey();
            var passkey = create(null);
            secretCreatorFn = secretCreatorFn || defaultCreatorFn;
            function register(object) {
              var secret;
              function vault(key, forget) {
                if (key === passkey) {
                  return forget
                    ? (secret = null)
                    : secret || (secret = secretCreatorFn(object));
                }
              }
              defProp(object, brand, vault);
            }
            function accessor(object) {
              if (!hasOwn.call(object, brand)) register(object);
              return object[brand](passkey);
            }
            accessor.forget = function (object) {
              if (hasOwn.call(object, brand)) object[brand](passkey, true);
            };
            return accessor;
          }
          defProp(exports, "makeAccessor", makeAccessor);
        },
        {},
      ],
      101: [
        function (require, module, exports) {
          "use strict";
          module.exports = require("./lib/core.js");
          require("./lib/done.js");
          require("./lib/es6-extensions.js");
          require("./lib/node-extensions.js");
        },
        {
          "./lib/core.js": 102,
          "./lib/done.js": 103,
          "./lib/es6-extensions.js": 104,
          "./lib/node-extensions.js": 105,
        },
      ],
      102: [
        function (require, module, exports) {
          "use strict";
          var asap = require("asap");
          module.exports = Promise;
          function Promise(fn) {
            if (typeof this !== "object")
              throw new TypeError("Promises must be constructed via new");
            if (typeof fn !== "function") throw new TypeError("not a function");
            var state = null;
            var value = null;
            var deferreds = [];
            var self = this;
            this.then = function (onFulfilled, onRejected) {
              return new self.constructor(function (resolve, reject) {
                handle(new Handler(onFulfilled, onRejected, resolve, reject));
              });
            };
            function handle(deferred) {
              if (state === null) {
                deferreds.push(deferred);
                return;
              }
              asap(function () {
                var cb = state ? deferred.onFulfilled : deferred.onRejected;
                if (cb === null) {
                  (state ? deferred.resolve : deferred.reject)(value);
                  return;
                }
                var ret;
                try {
                  ret = cb(value);
                } catch (e) {
                  deferred.reject(e);
                  return;
                }
                deferred.resolve(ret);
              });
            }
            function resolve(newValue) {
              try {
                if (newValue === self)
                  throw new TypeError(
                    "A promise cannot be resolved with itself."
                  );
                if (
                  newValue &&
                  (typeof newValue === "object" ||
                    typeof newValue === "function")
                ) {
                  var then = newValue.then;
                  if (typeof then === "function") {
                    doResolve(then.bind(newValue), resolve, reject);
                    return;
                  }
                }
                state = true;
                value = newValue;
                finale();
              } catch (e) {
                reject(e);
              }
            }
            function reject(newValue) {
              state = false;
              value = newValue;
              finale();
            }
            function finale() {
              for (var i = 0, len = deferreds.length; i < len; i++)
                handle(deferreds[i]);
              deferreds = null;
            }
            doResolve(fn, resolve, reject);
          }
          function Handler(onFulfilled, onRejected, resolve, reject) {
            this.onFulfilled =
              typeof onFulfilled === "function" ? onFulfilled : null;
            this.onRejected =
              typeof onRejected === "function" ? onRejected : null;
            this.resolve = resolve;
            this.reject = reject;
          }
          function doResolve(fn, onFulfilled, onRejected) {
            var done = false;
            try {
              fn(
                function (value) {
                  if (done) return;
                  done = true;
                  onFulfilled(value);
                },
                function (reason) {
                  if (done) return;
                  done = true;
                  onRejected(reason);
                }
              );
            } catch (ex) {
              if (done) return;
              done = true;
              onRejected(ex);
            }
          }
        },
        { asap: 106 },
      ],
      103: [
        function (require, module, exports) {
          "use strict";
          var Promise = require("./core.js");
          var asap = require("asap");
          module.exports = Promise;
          Promise.prototype.done = function (onFulfilled, onRejected) {
            var self = arguments.length
              ? this.then.apply(this, arguments)
              : this;
            self.then(null, function (err) {
              asap(function () {
                throw err;
              });
            });
          };
        },
        { "./core.js": 102, asap: 106 },
      ],
      104: [
        function (require, module, exports) {
          "use strict";
          var Promise = require("./core.js");
          var asap = require("asap");
          module.exports = Promise;
          function ValuePromise(value) {
            this.then = function (onFulfilled) {
              if (typeof onFulfilled !== "function") return this;
              return new Promise(function (resolve, reject) {
                asap(function () {
                  try {
                    resolve(onFulfilled(value));
                  } catch (ex) {
                    reject(ex);
                  }
                });
              });
            };
          }
          ValuePromise.prototype = Promise.prototype;
          var TRUE = new ValuePromise(true);
          var FALSE = new ValuePromise(false);
          var NULL = new ValuePromise(null);
          var UNDEFINED = new ValuePromise(undefined);
          var ZERO = new ValuePromise(0);
          var EMPTYSTRING = new ValuePromise("");
          Promise.resolve = function (value) {
            if (value instanceof Promise) return value;
            if (value === null) return NULL;
            if (value === undefined) return UNDEFINED;
            if (value === true) return TRUE;
            if (value === false) return FALSE;
            if (value === 0) return ZERO;
            if (value === "") return EMPTYSTRING;
            if (typeof value === "object" || typeof value === "function") {
              try {
                var then = value.then;
                if (typeof then === "function") {
                  return new Promise(then.bind(value));
                }
              } catch (ex) {
                return new Promise(function (resolve, reject) {
                  reject(ex);
                });
              }
            }
            return new ValuePromise(value);
          };
          Promise.all = function (arr) {
            var args = Array.prototype.slice.call(arr);
            return new Promise(function (resolve, reject) {
              if (args.length === 0) return resolve([]);
              var remaining = args.length;
              function res(i, val) {
                try {
                  if (
                    val &&
                    (typeof val === "object" || typeof val === "function")
                  ) {
                    var then = val.then;
                    if (typeof then === "function") {
                      then.call(
                        val,
                        function (val) {
                          res(i, val);
                        },
                        reject
                      );
                      return;
                    }
                  }
                  args[i] = val;
                  if (--remaining === 0) {
                    resolve(args);
                  }
                } catch (ex) {
                  reject(ex);
                }
              }
              for (var i = 0; i < args.length; i++) {
                res(i, args[i]);
              }
            });
          };
          Promise.reject = function (value) {
            return new Promise(function (resolve, reject) {
              reject(value);
            });
          };
          Promise.race = function (values) {
            return new Promise(function (resolve, reject) {
              values.forEach(function (value) {
                Promise.resolve(value).then(resolve, reject);
              });
            });
          };
          Promise.prototype["catch"] = function (onRejected) {
            return this.then(null, onRejected);
          };
        },
        { "./core.js": 102, asap: 106 },
      ],
      105: [
        function (require, module, exports) {
          "use strict";
          var Promise = require("./core.js");
          var asap = require("asap");
          module.exports = Promise;
          Promise.denodeify = function (fn, argumentCount) {
            argumentCount = argumentCount || Infinity;
            return function () {
              var self = this;
              var args = Array.prototype.slice.call(arguments);
              return new Promise(function (resolve, reject) {
                while (args.length && args.length > argumentCount) {
                  args.pop();
                }
                args.push(function (err, res) {
                  if (err) reject(err);
                  else resolve(res);
                });
                fn.apply(self, args);
              });
            };
          };
          Promise.nodeify = function (fn) {
            return function () {
              var args = Array.prototype.slice.call(arguments);
              var callback =
                typeof args[args.length - 1] === "function" ? args.pop() : null;
              var ctx = this;
              try {
                return fn.apply(this, arguments).nodeify(callback, ctx);
              } catch (ex) {
                if (callback === null || typeof callback == "undefined") {
                  return new Promise(function (resolve, reject) {
                    reject(ex);
                  });
                } else {
                  asap(function () {
                    callback.call(ctx, ex);
                  });
                }
              }
            };
          };
          Promise.prototype.nodeify = function (callback, ctx) {
            if (typeof callback != "function") return this;
            this.then(
              function (value) {
                asap(function () {
                  callback.call(ctx, null, value);
                });
              },
              function (err) {
                asap(function () {
                  callback.call(ctx, err);
                });
              }
            );
          };
        },
        { "./core.js": 102, asap: 106 },
      ],
      106: [
        function (require, module, exports) {
          (function (process) {
            var head = { task: void 0, next: null };
            var tail = head;
            var flushing = false;
            var requestFlush = void 0;
            var isNodeJS = false;
            function flush() {
              while (head.next) {
                head = head.next;
                var task = head.task;
                head.task = void 0;
                var domain = head.domain;
                if (domain) {
                  head.domain = void 0;
                  domain.enter();
                }
                try {
                  task();
                } catch (e) {
                  if (isNodeJS) {
                    if (domain) {
                      domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                      domain.enter();
                    }
                    throw e;
                  } else {
                    setTimeout(function () {
                      throw e;
                    }, 0);
                  }
                }
                if (domain) {
                  domain.exit();
                }
              }
              flushing = false;
            }
            if (typeof process !== "undefined" && process.nextTick) {
              isNodeJS = true;
              requestFlush = function () {
                process.nextTick(flush);
              };
            } else if (typeof setImmediate === "function") {
              if (typeof window !== "undefined") {
                requestFlush = setImmediate.bind(window, flush);
              } else {
                requestFlush = function () {
                  setImmediate(flush);
                };
              }
            } else if (typeof MessageChannel !== "undefined") {
              var channel = new MessageChannel();
              channel.port1.onmessage = flush;
              requestFlush = function () {
                channel.port2.postMessage(0);
              };
            } else {
              requestFlush = function () {
                setTimeout(flush, 0);
              };
            }
            function asap(task) {
              tail = tail.next = {
                task: task,
                domain: isNodeJS && process.domain,
                next: null,
              };
              if (!flushing) {
                flushing = true;
                requestFlush();
              }
            }
            module.exports = asap;
          }.call(this, require("_process")));
        },
        { _process: 84 },
      ],
      107: [
        function (require, module, exports) {
          !(function () {
            var hasOwn = Object.prototype.hasOwnProperty;
            var undefined;
            var iteratorSymbol =
              (typeof Symbol === "function" && Symbol.iterator) || "@@iterator";
            if (typeof Promise === "undefined")
              try {
                Promise = require("promise");
              } catch (ignored) {}
            if (typeof regeneratorRuntime === "object") {
              return;
            }
            var runtime = (regeneratorRuntime =
              typeof exports === "undefined" ? {} : exports);
            function wrap(innerFn, outerFn, self, tryList) {
              return new Generator(
                innerFn,
                outerFn,
                self || null,
                tryList || []
              );
            }
            runtime.wrap = wrap;
            var GenStateSuspendedStart = "suspendedStart";
            var GenStateSuspendedYield = "suspendedYield";
            var GenStateExecuting = "executing";
            var GenStateCompleted = "completed";
            var ContinueSentinel = {};
            function GeneratorFunction() {}
            var Gp = Generator.prototype;
            var GFp = (GeneratorFunction.prototype = Object.create(
              Function.prototype
            ));
            GFp.constructor = GeneratorFunction;
            GFp.prototype = Gp;
            Gp.constructor = GFp;
            if (GeneratorFunction.name !== "GeneratorFunction") {
              GeneratorFunction.name = "GeneratorFunction";
            }
            if (GeneratorFunction.name !== "GeneratorFunction") {
              throw new Error("GeneratorFunction renamed?");
            }
            runtime.isGeneratorFunction = function (genFun) {
              var ctor = genFun && genFun.constructor;
              return ctor ? GeneratorFunction.name === ctor.name : false;
            };
            runtime.mark = function (genFun) {
              genFun.__proto__ = GFp;
              genFun.prototype = Object.create(Gp);
              return genFun;
            };
            runtime.async = function (innerFn, outerFn, self, tryList) {
              return new Promise(function (resolve, reject) {
                var generator = wrap(innerFn, outerFn, self, tryList);
                var callNext = step.bind(generator.next);
                var callThrow = step.bind(generator.throw);
                function step(arg) {
                  try {
                    var info = this(arg);
                    var value = info.value;
                  } catch (error) {
                    return reject(error);
                  }
                  if (info.done) {
                    resolve(value);
                  } else {
                    Promise.resolve(value).then(callNext, callThrow);
                  }
                }
                callNext();
              });
            };
            function Generator(innerFn, outerFn, self, tryList) {
              var generator = outerFn ? Object.create(outerFn.prototype) : this;
              var context = new Context(tryList);
              var state = GenStateSuspendedStart;
              function invoke(method, arg) {
                if (state === GenStateExecuting) {
                  throw new Error("Generator is already running");
                }
                if (state === GenStateCompleted) {
                  throw new Error("Generator has already finished");
                }
                while (true) {
                  var delegate = context.delegate;
                  if (delegate) {
                    try {
                      var info = delegate.iterator[method](arg);
                      method = "next";
                      arg = undefined;
                    } catch (uncaught) {
                      context.delegate = null;
                      method = "throw";
                      arg = uncaught;
                      continue;
                    }
                    if (info.done) {
                      context[delegate.resultName] = info.value;
                      context.next = delegate.nextLoc;
                    } else {
                      state = GenStateSuspendedYield;
                      return info;
                    }
                    context.delegate = null;
                  }
                  if (method === "next") {
                    if (
                      state === GenStateSuspendedStart &&
                      typeof arg !== "undefined"
                    ) {
                      throw new TypeError(
                        "attempt to send " +
                          JSON.stringify(arg) +
                          " to newborn generator"
                      );
                    }
                    if (state === GenStateSuspendedYield) {
                      context.sent = arg;
                    } else {
                      delete context.sent;
                    }
                  } else if (method === "throw") {
                    if (state === GenStateSuspendedStart) {
                      state = GenStateCompleted;
                      throw arg;
                    }
                    if (context.dispatchException(arg)) {
                      method = "next";
                      arg = undefined;
                    }
                  } else if (method === "return") {
                    context.abrupt("return", arg);
                  }
                  state = GenStateExecuting;
                  try {
                    var value = innerFn.call(self, context);
                    state = context.done
                      ? GenStateCompleted
                      : GenStateSuspendedYield;
                    var info = { value: value, done: context.done };
                    if (value === ContinueSentinel) {
                      if (context.delegate && method === "next") {
                        arg = undefined;
                      }
                    } else {
                      return info;
                    }
                  } catch (thrown) {
                    state = GenStateCompleted;
                    if (method === "next") {
                      context.dispatchException(thrown);
                    } else {
                      arg = thrown;
                    }
                  }
                }
              }
              generator.next = invoke.bind(generator, "next");
              generator.throw = invoke.bind(generator, "throw");
              generator.return = invoke.bind(generator, "return");
              return generator;
            }
            Gp[iteratorSymbol] = function () {
              return this;
            };
            Gp.toString = function () {
              return "[object Generator]";
            };
            function pushTryEntry(triple) {
              var entry = { tryLoc: triple[0] };
              if (1 in triple) {
                entry.catchLoc = triple[1];
              }
              if (2 in triple) {
                entry.finallyLoc = triple[2];
              }
              this.tryEntries.push(entry);
            }
            function resetTryEntry(entry, i) {
              var record = entry.completion || {};
              record.type = i === 0 ? "normal" : "return";
              delete record.arg;
              entry.completion = record;
            }
            function Context(tryList) {
              this.tryEntries = [{ tryLoc: "root" }];
              tryList.forEach(pushTryEntry, this);
              this.reset();
            }
            runtime.keys = function (object) {
              var keys = [];
              for (var key in object) {
                keys.push(key);
              }
              keys.reverse();
              return function next() {
                while (keys.length) {
                  var key = keys.pop();
                  if (key in object) {
                    next.value = key;
                    next.done = false;
                    return next;
                  }
                }
                next.done = true;
                return next;
              };
            };
            function values(iterable) {
              var iterator = iterable;
              if (iteratorSymbol in iterable) {
                iterator = iterable[iteratorSymbol]();
              } else if (!isNaN(iterable.length)) {
                var i = -1;
                iterator = function next() {
                  while (++i < iterable.length) {
                    if (i in iterable) {
                      next.value = iterable[i];
                      next.done = false;
                      return next;
                    }
                  }
                  next.done = true;
                  return next;
                };
                iterator.next = iterator;
              }
              return iterator;
            }
            runtime.values = values;
            Context.prototype = {
              constructor: Context,
              reset: function () {
                this.prev = 0;
                this.next = 0;
                this.sent = undefined;
                this.done = false;
                this.delegate = null;
                this.tryEntries.forEach(resetTryEntry);
                for (
                  var tempIndex = 0, tempName;
                  hasOwn.call(this, (tempName = "t" + tempIndex)) ||
                  tempIndex < 20;
                  ++tempIndex
                ) {
                  this[tempName] = null;
                }
              },
              stop: function () {
                this.done = true;
                var rootEntry = this.tryEntries[0];
                var rootRecord = rootEntry.completion;
                if (rootRecord.type === "throw") {
                  throw rootRecord.arg;
                }
                return this.rval;
              },
              dispatchException: function (exception) {
                if (this.done) {
                  throw exception;
                }
                var context = this;
                function handle(loc, caught) {
                  record.type = "throw";
                  record.arg = exception;
                  context.next = loc;
                  return !!caught;
                }
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  var record = entry.completion;
                  if (entry.tryLoc === "root") {
                    return handle("end");
                  }
                  if (entry.tryLoc <= this.prev) {
                    var hasCatch = hasOwn.call(entry, "catchLoc");
                    var hasFinally = hasOwn.call(entry, "finallyLoc");
                    if (hasCatch && hasFinally) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      } else if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else if (hasCatch) {
                      if (this.prev < entry.catchLoc) {
                        return handle(entry.catchLoc, true);
                      }
                    } else if (hasFinally) {
                      if (this.prev < entry.finallyLoc) {
                        return handle(entry.finallyLoc);
                      }
                    } else {
                      throw new Error("try statement without catch or finally");
                    }
                  }
                }
              },
              _findFinallyEntry: function (finallyLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  if (
                    entry.tryLoc <= this.prev &&
                    hasOwn.call(entry, "finallyLoc") &&
                    (entry.finallyLoc === finallyLoc ||
                      this.prev < entry.finallyLoc)
                  ) {
                    return entry;
                  }
                }
              },
              abrupt: function (type, arg) {
                var entry = this._findFinallyEntry();
                var record = entry ? entry.completion : {};
                record.type = type;
                record.arg = arg;
                if (entry) {
                  this.next = entry.finallyLoc;
                } else {
                  this.complete(record);
                }
                return ContinueSentinel;
              },
              complete: function (record) {
                if (record.type === "throw") {
                  throw record.arg;
                }
                if (record.type === "break" || record.type === "continue") {
                  this.next = record.arg;
                } else if (record.type === "return") {
                  this.rval = record.arg;
                  this.next = "end";
                }
                return ContinueSentinel;
              },
              finish: function (finallyLoc) {
                var entry = this._findFinallyEntry(finallyLoc);
                return this.complete(entry.completion);
              },
              catch: function (tryLoc) {
                for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                  var entry = this.tryEntries[i];
                  if (entry.tryLoc === tryLoc) {
                    var record = entry.completion;
                    if (record.type === "throw") {
                      var thrown = record.arg;
                      resetTryEntry(entry, i);
                    }
                    return thrown;
                  }
                }
                throw new Error("illegal catch attempt");
              },
              delegateYield: function (iterable, resultName, nextLoc) {
                this.delegate = {
                  iterator: values(iterable),
                  resultName: resultName,
                  nextLoc: nextLoc,
                };
                return ContinueSentinel;
              },
            };
          })();
        },
        { promise: 101 },
      ],
      108: [
        function (require, module, exports) {
          var regenerate = require("regenerate");
          exports.REGULAR = {
            d: regenerate().addRange(48, 57),
            D: regenerate().addRange(0, 47).addRange(58, 65535),
            s: regenerate(32, 160, 5760, 6158, 8239, 8287, 12288, 65279)
              .addRange(9, 13)
              .addRange(8192, 8202)
              .addRange(8232, 8233),
            S: regenerate()
              .addRange(0, 8)
              .addRange(14, 31)
              .addRange(33, 159)
              .addRange(161, 5759)
              .addRange(5761, 6157)
              .addRange(6159, 8191)
              .addRange(8203, 8231)
              .addRange(8234, 8238)
              .addRange(8240, 8286)
              .addRange(8288, 12287)
              .addRange(12289, 65278)
              .addRange(65280, 65535),
            w: regenerate(95)
              .addRange(48, 57)
              .addRange(65, 90)
              .addRange(97, 122),
            W: regenerate(96)
              .addRange(0, 47)
              .addRange(58, 64)
              .addRange(91, 94)
              .addRange(123, 65535),
          };
          exports.UNICODE = {
            d: regenerate().addRange(48, 57),
            D: regenerate().addRange(0, 47).addRange(58, 1114111),
            s: regenerate(32, 160, 5760, 6158, 8239, 8287, 12288, 65279)
              .addRange(9, 13)
              .addRange(8192, 8202)
              .addRange(8232, 8233),
            S: regenerate()
              .addRange(0, 8)
              .addRange(14, 31)
              .addRange(33, 159)
              .addRange(161, 5759)
              .addRange(5761, 6157)
              .addRange(6159, 8191)
              .addRange(8203, 8231)
              .addRange(8234, 8238)
              .addRange(8240, 8286)
              .addRange(8288, 12287)
              .addRange(12289, 65278)
              .addRange(65280, 1114111),
            w: regenerate(95)
              .addRange(48, 57)
              .addRange(65, 90)
              .addRange(97, 122),
            W: regenerate(96)
              .addRange(0, 47)
              .addRange(58, 64)
              .addRange(91, 94)
              .addRange(123, 1114111),
          };
          exports.UNICODE_IGNORE_CASE = {
            d: regenerate().addRange(48, 57),
            D: regenerate().addRange(0, 47).addRange(58, 1114111),
            s: regenerate(32, 160, 5760, 6158, 8239, 8287, 12288, 65279)
              .addRange(9, 13)
              .addRange(8192, 8202)
              .addRange(8232, 8233),
            S: regenerate()
              .addRange(0, 8)
              .addRange(14, 31)
              .addRange(33, 159)
              .addRange(161, 5759)
              .addRange(5761, 6157)
              .addRange(6159, 8191)
              .addRange(8203, 8231)
              .addRange(8234, 8238)
              .addRange(8240, 8286)
              .addRange(8288, 12287)
              .addRange(12289, 65278)
              .addRange(65280, 1114111),
            w: regenerate(95, 383, 8490)
              .addRange(48, 57)
              .addRange(65, 90)
              .addRange(97, 122),
            W: regenerate(75, 83, 96)
              .addRange(0, 47)
              .addRange(58, 64)
              .addRange(91, 94)
              .addRange(123, 1114111),
          };
        },
        { regenerate: 110 },
      ],
      109: [
        function (require, module, exports) {
          module.exports = {
            75: 8490,
            83: 383,
            107: 8490,
            115: 383,
            181: 924,
            197: 8491,
            383: 83,
            452: 453,
            453: 452,
            455: 456,
            456: 455,
            458: 459,
            459: 458,
            497: 498,
            498: 497,
            837: 8126,
            914: 976,
            917: 1013,
            920: 1012,
            921: 8126,
            922: 1008,
            924: 181,
            928: 982,
            929: 1009,
            931: 962,
            934: 981,
            937: 8486,
            962: 931,
            976: 914,
            977: 1012,
            981: 934,
            982: 928,
            1008: 922,
            1009: 929,
            1012: [920, 977],
            1013: 917,
            7776: 7835,
            7835: 7776,
            8126: [837, 921],
            8486: 937,
            8490: 75,
            8491: 197,
            66560: 66600,
            66561: 66601,
            66562: 66602,
            66563: 66603,
            66564: 66604,
            66565: 66605,
            66566: 66606,
            66567: 66607,
            66568: 66608,
            66569: 66609,
            66570: 66610,
            66571: 66611,
            66572: 66612,
            66573: 66613,
            66574: 66614,
            66575: 66615,
            66576: 66616,
            66577: 66617,
            66578: 66618,
            66579: 66619,
            66580: 66620,
            66581: 66621,
            66582: 66622,
            66583: 66623,
            66584: 66624,
            66585: 66625,
            66586: 66626,
            66587: 66627,
            66588: 66628,
            66589: 66629,
            66590: 66630,
            66591: 66631,
            66592: 66632,
            66593: 66633,
            66594: 66634,
            66595: 66635,
            66596: 66636,
            66597: 66637,
            66598: 66638,
            66599: 66639,
            66600: 66560,
            66601: 66561,
            66602: 66562,
            66603: 66563,
            66604: 66564,
            66605: 66565,
            66606: 66566,
            66607: 66567,
            66608: 66568,
            66609: 66569,
            66610: 66570,
            66611: 66571,
            66612: 66572,
            66613: 66573,
            66614: 66574,
            66615: 66575,
            66616: 66576,
            66617: 66577,
            66618: 66578,
            66619: 66579,
            66620: 66580,
            66621: 66581,
            66622: 66582,
            66623: 66583,
            66624: 66584,
            66625: 66585,
            66626: 66586,
            66627: 66587,
            66628: 66588,
            66629: 66589,
            66630: 66590,
            66631: 66591,
            66632: 66592,
            66633: 66593,
            66634: 66594,
            66635: 66595,
            66636: 66596,
            66637: 66597,
            66638: 66598,
            66639: 66599,
            71840: 71872,
            71841: 71873,
            71842: 71874,
            71843: 71875,
            71844: 71876,
            71845: 71877,
            71846: 71878,
            71847: 71879,
            71848: 71880,
            71849: 71881,
            71850: 71882,
            71851: 71883,
            71852: 71884,
            71853: 71885,
            71854: 71886,
            71855: 71887,
            71856: 71888,
            71857: 71889,
            71858: 71890,
            71859: 71891,
            71860: 71892,
            71861: 71893,
            71862: 71894,
            71863: 71895,
            71864: 71896,
            71865: 71897,
            71866: 71898,
            71867: 71899,
            71868: 71900,
            71869: 71901,
            71870: 71902,
            71871: 71903,
            71872: 71840,
            71873: 71841,
            71874: 71842,
            71875: 71843,
            71876: 71844,
            71877: 71845,
            71878: 71846,
            71879: 71847,
            71880: 71848,
            71881: 71849,
            71882: 71850,
            71883: 71851,
            71884: 71852,
            71885: 71853,
            71886: 71854,
            71887: 71855,
            71888: 71856,
            71889: 71857,
            71890: 71858,
            71891: 71859,
            71892: 71860,
            71893: 71861,
            71894: 71862,
            71895: 71863,
            71896: 71864,
            71897: 71865,
            71898: 71866,
            71899: 71867,
            71900: 71868,
            71901: 71869,
            71902: 71870,
            71903: 71871,
          };
        },
        {},
      ],
      110: [
        function (require, module, exports) {
          (function (global) {
            (function (root) {
              var freeExports = typeof exports == "object" && exports;
              var freeModule =
                typeof module == "object" &&
                module &&
                module.exports == freeExports &&
                module;
              var freeGlobal = typeof global == "object" && global;
              if (
                freeGlobal.global === freeGlobal ||
                freeGlobal.window === freeGlobal
              ) {
                root = freeGlobal;
              }
              var ERRORS = {
                rangeOrder:
                  "A range???s `stop` value must be greater than or equal " +
                  "to the `start` value.",
                codePointRange:
                  "Invalid code point value. Code points range from " +
                  "U+000000 to U+10FFFF.",
              };
              var HIGH_SURROGATE_MIN = 55296;
              var HIGH_SURROGATE_MAX = 56319;
              var LOW_SURROGATE_MIN = 56320;
              var LOW_SURROGATE_MAX = 57343;
              var regexNull = /\\x00([^0123456789]|$)/g;
              var object = {};
              var hasOwnProperty = object.hasOwnProperty;
              var extend = function (destination, source) {
                var key;
                for (key in source) {
                  if (hasOwnProperty.call(source, key)) {
                    destination[key] = source[key];
                  }
                }
                return destination;
              };
              var forEach = function (array, callback) {
                var index = -1;
                var length = array.length;
                while (++index < length) {
                  callback(array[index], index);
                }
              };
              var toString = object.toString;
              var isArray = function (value) {
                return toString.call(value) == "[object Array]";
              };
              var isNumber = function (value) {
                return (
                  typeof value == "number" ||
                  toString.call(value) == "[object Number]"
                );
              };
              var zeroes = "0000";
              var pad = function (number, totalCharacters) {
                var string = String(number);
                return string.length < totalCharacters
                  ? (zeroes + string).slice(-totalCharacters)
                  : string;
              };
              var hex = function (number) {
                return Number(number).toString(16).toUpperCase();
              };
              var slice = [].slice;
              var dataFromCodePoints = function (codePoints) {
                var index = -1;
                var length = codePoints.length;
                var max = length - 1;
                var result = [];
                var isStart = true;
                var tmp;
                var previous = 0;
                while (++index < length) {
                  tmp = codePoints[index];
                  if (isStart) {
                    result.push(tmp);
                    previous = tmp;
                    isStart = false;
                  } else {
                    if (tmp == previous + 1) {
                      if (index != max) {
                        previous = tmp;
                        continue;
                      } else {
                        isStart = true;
                        result.push(tmp + 1);
                      }
                    } else {
                      result.push(previous + 1, tmp);
                      previous = tmp;
                    }
                  }
                }
                if (!isStart) {
                  result.push(tmp + 1);
                }
                return result;
              };
              var dataRemove = function (data, codePoint) {
                var index = 0;
                var start;
                var end;
                var length = data.length;
                while (index < length) {
                  start = data[index];
                  end = data[index + 1];
                  if (codePoint >= start && codePoint < end) {
                    if (codePoint == start) {
                      if (end == start + 1) {
                        data.splice(index, 2);
                        return data;
                      } else {
                        data[index] = codePoint + 1;
                        return data;
                      }
                    } else if (codePoint == end - 1) {
                      data[index + 1] = codePoint;
                      return data;
                    } else {
                      data.splice(
                        index,
                        2,
                        start,
                        codePoint,
                        codePoint + 1,
                        end
                      );
                      return data;
                    }
                  }
                  index += 2;
                }
                return data;
              };
              var dataRemoveRange = function (data, rangeStart, rangeEnd) {
                if (rangeEnd < rangeStart) {
                  throw Error(ERRORS.rangeOrder);
                }
                var index = 0;
                var start;
                var end;
                while (index < data.length) {
                  start = data[index];
                  end = data[index + 1] - 1;
                  if (start > rangeEnd) {
                    return data;
                  }
                  if (rangeStart <= start && rangeEnd >= end) {
                    data.splice(index, 2);
                    continue;
                  }
                  if (rangeStart >= start && rangeEnd < end) {
                    if (rangeStart == start) {
                      data[index] = rangeEnd + 1;
                      data[index + 1] = end + 1;
                      return data;
                    }
                    data.splice(
                      index,
                      2,
                      start,
                      rangeStart,
                      rangeEnd + 1,
                      end + 1
                    );
                    return data;
                  }
                  if (rangeStart >= start && rangeStart <= end) {
                    data[index + 1] = rangeStart;
                  } else if (rangeEnd >= start && rangeEnd <= end) {
                    data[index] = rangeEnd + 1;
                    return data;
                  }
                  index += 2;
                }
                return data;
              };
              var dataAdd = function (data, codePoint) {
                var index = 0;
                var start;
                var end;
                var lastIndex = null;
                var length = data.length;
                if (codePoint < 0 || codePoint > 1114111) {
                  throw RangeError(ERRORS.codePointRange);
                }
                while (index < length) {
                  start = data[index];
                  end = data[index + 1];
                  if (codePoint >= start && codePoint < end) {
                    return data;
                  }
                  if (codePoint == start - 1) {
                    data[index] = codePoint;
                    return data;
                  }
                  if (start > codePoint) {
                    data.splice(
                      lastIndex != null ? lastIndex + 2 : 0,
                      0,
                      codePoint,
                      codePoint + 1
                    );
                    return data;
                  }
                  if (codePoint == end) {
                    if (codePoint + 1 == data[index + 2]) {
                      data.splice(index, 4, start, data[index + 3]);
                      return data;
                    }
                    data[index + 1] = codePoint + 1;
                    return data;
                  }
                  lastIndex = index;
                  index += 2;
                }
                data.push(codePoint, codePoint + 1);
                return data;
              };
              var dataAddData = function (dataA, dataB) {
                var index = 0;
                var start;
                var end;
                var data = dataA.slice();
                var length = dataB.length;
                while (index < length) {
                  start = dataB[index];
                  end = dataB[index + 1] - 1;
                  if (start == end) {
                    data = dataAdd(data, start);
                  } else {
                    data = dataAddRange(data, start, end);
                  }
                  index += 2;
                }
                return data;
              };
              var dataRemoveData = function (dataA, dataB) {
                var index = 0;
                var start;
                var end;
                var data = dataA.slice();
                var length = dataB.length;
                while (index < length) {
                  start = dataB[index];
                  end = dataB[index + 1] - 1;
                  if (start == end) {
                    data = dataRemove(data, start);
                  } else {
                    data = dataRemoveRange(data, start, end);
                  }
                  index += 2;
                }
                return data;
              };
              var dataAddRange = function (data, rangeStart, rangeEnd) {
                if (rangeEnd < rangeStart) {
                  throw Error(ERRORS.rangeOrder);
                }
                if (
                  rangeStart < 0 ||
                  rangeStart > 1114111 ||
                  rangeEnd < 0 ||
                  rangeEnd > 1114111
                ) {
                  throw RangeError(ERRORS.codePointRange);
                }
                var index = 0;
                var start;
                var end;
                var added = false;
                var length = data.length;
                while (index < length) {
                  start = data[index];
                  end = data[index + 1];
                  if (added) {
                    if (start == rangeEnd + 1) {
                      data.splice(index - 1, 2);
                      return data;
                    }
                    if (start > rangeEnd) {
                      return data;
                    }
                    if (start >= rangeStart && start <= rangeEnd) {
                      if (end > rangeStart && end - 1 <= rangeEnd) {
                        data.splice(index, 2);
                        index -= 2;
                      } else {
                        data.splice(index - 1, 2);
                        index -= 2;
                      }
                    }
                  } else if (start == rangeEnd + 1) {
                    data[index] = rangeStart;
                    return data;
                  } else if (start > rangeEnd) {
                    data.splice(index, 0, rangeStart, rangeEnd + 1);
                    return data;
                  } else if (
                    rangeStart >= start &&
                    rangeStart < end &&
                    rangeEnd + 1 <= end
                  ) {
                    return data;
                  } else if (
                    (rangeStart >= start && rangeStart < end) ||
                    end == rangeStart
                  ) {
                    data[index + 1] = rangeEnd + 1;
                    added = true;
                  } else if (rangeStart <= start && rangeEnd + 1 >= end) {
                    data[index] = rangeStart;
                    data[index + 1] = rangeEnd + 1;
                    added = true;
                  }
                  index += 2;
                }
                if (!added) {
                  data.push(rangeStart, rangeEnd + 1);
                }
                return data;
              };
              var dataContains = function (data, codePoint) {
                var index = 0;
                var start;
                var end;
                var length = data.length;
                while (index < length) {
                  start = data[index];
                  end = data[index + 1];
                  if (codePoint >= start && codePoint < end) {
                    return true;
                  }
                  index += 2;
                }
                return false;
              };
              var dataIntersection = function (data, codePoints) {
                var index = 0;
                var length = codePoints.length;
                var codePoint;
                var result = [];
                while (index < length) {
                  codePoint = codePoints[index];
                  if (dataContains(data, codePoint)) {
                    result.push(codePoint);
                  }
                  ++index;
                }
                return dataFromCodePoints(result);
              };
              var dataIsEmpty = function (data) {
                return !data.length;
              };
              var dataIsSingleton = function (data) {
                return data.length == 2 && data[0] + 1 == data[1];
              };
              var dataToArray = function (data) {
                var index = 0;
                var start;
                var end;
                var result = [];
                var length = data.length;
                while (index < length) {
                  start = data[index];
                  end = data[index + 1];
                  while (start < end) {
                    result.push(start);
                    ++start;
                  }
                  index += 2;
                }
                return result;
              };
              var floor = Math.floor;
              var highSurrogate = function (codePoint) {
                return parseInt(
                  floor((codePoint - 65536) / 1024) + HIGH_SURROGATE_MIN,
                  10
                );
              };
              var lowSurrogate = function (codePoint) {
                return parseInt(
                  ((codePoint - 65536) % 1024) + LOW_SURROGATE_MIN,
                  10
                );
              };
              var stringFromCharCode = String.fromCharCode;
              var codePointToString = function (codePoint) {
                var string;
                if (codePoint == 9) {
                  string = "\\t";
                } else if (codePoint == 10) {
                  string = "\\n";
                } else if (codePoint == 12) {
                  string = "\\f";
                } else if (codePoint == 13) {
                  string = "\\r";
                } else if (codePoint == 92) {
                  string = "\\\\";
                } else if (
                  codePoint == 36 ||
                  (codePoint >= 40 && codePoint <= 43) ||
                  codePoint == 45 ||
                  codePoint == 46 ||
                  codePoint == 63 ||
                  (codePoint >= 91 && codePoint <= 94) ||
                  (codePoint >= 123 && codePoint <= 125)
                ) {
                  string = "\\" + stringFromCharCode(codePoint);
                } else if (codePoint >= 32 && codePoint <= 126) {
                  string = stringFromCharCode(codePoint);
                } else if (codePoint <= 255) {
                  string = "\\x" + pad(hex(codePoint), 2);
                } else {
                  string = "\\u" + pad(hex(codePoint), 4);
                }
                return string;
              };
              var symbolToCodePoint = function (symbol) {
                var length = symbol.length;
                var first = symbol.charCodeAt(0);
                var second;
                if (
                  first >= HIGH_SURROGATE_MIN &&
                  first <= HIGH_SURROGATE_MAX &&
                  length > 1
                ) {
                  second = symbol.charCodeAt(1);
                  return (
                    (first - HIGH_SURROGATE_MIN) * 1024 +
                    second -
                    LOW_SURROGATE_MIN +
                    65536
                  );
                }
                return first;
              };
              var createBMPCharacterClasses = function (data) {
                var result = "";
                var index = 0;
                var start;
                var end;
                var length = data.length;
                if (dataIsSingleton(data)) {
                  return codePointToString(data[0]);
                }
                while (index < length) {
                  start = data[index];
                  end = data[index + 1] - 1;
                  if (start == end) {
                    result += codePointToString(start);
                  } else if (start + 1 == end) {
                    result += codePointToString(start) + codePointToString(end);
                  } else {
                    result +=
                      codePointToString(start) + "-" + codePointToString(end);
                  }
                  index += 2;
                }
                return "[" + result + "]";
              };
              var splitAtBMP = function (data) {
                var loneHighSurrogates = [];
                var bmp = [];
                var astral = [];
                var index = 0;
                var start;
                var end;
                var length = data.length;
                while (index < length) {
                  start = data[index];
                  end = data[index + 1] - 1;
                  if (start <= 65535 && end <= 65535) {
                    if (
                      start >= HIGH_SURROGATE_MIN &&
                      start <= HIGH_SURROGATE_MAX
                    ) {
                      if (end <= HIGH_SURROGATE_MAX) {
                        loneHighSurrogates.push(start, end + 1);
                      } else {
                        loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
                        bmp.push(HIGH_SURROGATE_MAX + 1, end + 1);
                      }
                    } else if (
                      end >= HIGH_SURROGATE_MIN &&
                      end <= HIGH_SURROGATE_MAX
                    ) {
                      bmp.push(start, HIGH_SURROGATE_MIN);
                      loneHighSurrogates.push(HIGH_SURROGATE_MIN, end + 1);
                    } else if (
                      start < HIGH_SURROGATE_MIN &&
                      end > HIGH_SURROGATE_MAX
                    ) {
                      bmp.push(
                        start,
                        HIGH_SURROGATE_MIN,
                        HIGH_SURROGATE_MAX + 1,
                        end + 1
                      );
                      loneHighSurrogates.push(
                        HIGH_SURROGATE_MIN,
                        HIGH_SURROGATE_MAX + 1
                      );
                    } else {
                      bmp.push(start, end + 1);
                    }
                  } else if (start <= 65535 && end > 65535) {
                    if (
                      start >= HIGH_SURROGATE_MIN &&
                      start <= HIGH_SURROGATE_MAX
                    ) {
                      loneHighSurrogates.push(start, HIGH_SURROGATE_MAX + 1);
                      bmp.push(HIGH_SURROGATE_MAX + 1, 65535 + 1);
                    } else if (start < HIGH_SURROGATE_MIN) {
                      bmp.push(
                        start,
                        HIGH_SURROGATE_MIN,
                        HIGH_SURROGATE_MAX + 1,
                        65535 + 1
                      );
                      loneHighSurrogates.push(
                        HIGH_SURROGATE_MIN,
                        HIGH_SURROGATE_MAX + 1
                      );
                    } else {
                      bmp.push(start, 65535 + 1);
                    }
                    astral.push(65535 + 1, end + 1);
                  } else {
                    astral.push(start, end + 1);
                  }
                  index += 2;
                }
                return {
                  loneHighSurrogates: loneHighSurrogates,
                  bmp: bmp,
                  astral: astral,
                };
              };
              var optimizeSurrogateMappings = function (surrogateMappings) {
                var result = [];
                var tmpLow = [];
                var addLow = false;
                var mapping;
                var nextMapping;
                var highSurrogates;
                var lowSurrogates;
                var nextHighSurrogates;
                var nextLowSurrogates;
                var index = -1;
                var length = surrogateMappings.length;
                while (++index < length) {
                  mapping = surrogateMappings[index];
                  nextMapping = surrogateMappings[index + 1];
                  if (!nextMapping) {
                    result.push(mapping);
                    continue;
                  }
                  highSurrogates = mapping[0];
                  lowSurrogates = mapping[1];
                  nextHighSurrogates = nextMapping[0];
                  nextLowSurrogates = nextMapping[1];
                  tmpLow = lowSurrogates;
                  while (
                    nextHighSurrogates &&
                    highSurrogates[0] == nextHighSurrogates[0] &&
                    highSurrogates[1] == nextHighSurrogates[1]
                  ) {
                    if (dataIsSingleton(nextLowSurrogates)) {
                      tmpLow = dataAdd(tmpLow, nextLowSurrogates[0]);
                    } else {
                      tmpLow = dataAddRange(
                        tmpLow,
                        nextLowSurrogates[0],
                        nextLowSurrogates[1] - 1
                      );
                    }
                    ++index;
                    mapping = surrogateMappings[index];
                    highSurrogates = mapping[0];
                    lowSurrogates = mapping[1];
                    nextMapping = surrogateMappings[index + 1];
                    nextHighSurrogates = nextMapping && nextMapping[0];
                    nextLowSurrogates = nextMapping && nextMapping[1];
                    addLow = true;
                  }
                  result.push([
                    highSurrogates,
                    addLow ? tmpLow : lowSurrogates,
                  ]);
                  addLow = false;
                }
                return optimizeByLowSurrogates(result);
              };
              var optimizeByLowSurrogates = function (surrogateMappings) {
                if (surrogateMappings.length == 1) {
                  return surrogateMappings;
                }
                var index = -1;
                var innerIndex = -1;
                while (++index < surrogateMappings.length) {
                  var mapping = surrogateMappings[index];
                  var lowSurrogates = mapping[1];
                  var lowSurrogateStart = lowSurrogates[0];
                  var lowSurrogateEnd = lowSurrogates[1];
                  innerIndex = index;
                  while (++innerIndex < surrogateMappings.length) {
                    var otherMapping = surrogateMappings[innerIndex];
                    var otherLowSurrogates = otherMapping[1];
                    var otherLowSurrogateStart = otherLowSurrogates[0];
                    var otherLowSurrogateEnd = otherLowSurrogates[1];
                    if (
                      lowSurrogateStart == otherLowSurrogateStart &&
                      lowSurrogateEnd == otherLowSurrogateEnd
                    ) {
                      if (dataIsSingleton(otherMapping[0])) {
                        mapping[0] = dataAdd(mapping[0], otherMapping[0][0]);
                      } else {
                        mapping[0] = dataAddRange(
                          mapping[0],
                          otherMapping[0][0],
                          otherMapping[0][1] - 1
                        );
                      }
                      surrogateMappings.splice(innerIndex, 1);
                      --innerIndex;
                    }
                  }
                }
                return surrogateMappings;
              };
              var surrogateSet = function (data) {
                if (!data.length) {
                  return [];
                }
                var index = 0;
                var start;
                var end;
                var startHigh;
                var startLow;
                var prevStartHigh = 0;
                var prevEndHigh = 0;
                var tmpLow = [];
                var endHigh;
                var endLow;
                var surrogateMappings = [];
                var length = data.length;
                var dataHigh = [];
                while (index < length) {
                  start = data[index];
                  end = data[index + 1] - 1;
                  startHigh = highSurrogate(start);
                  startLow = lowSurrogate(start);
                  endHigh = highSurrogate(end);
                  endLow = lowSurrogate(end);
                  var startsWithLowestLowSurrogate =
                    startLow == LOW_SURROGATE_MIN;
                  var endsWithHighestLowSurrogate = endLow == LOW_SURROGATE_MAX;
                  var complete = false;
                  if (
                    startHigh == endHigh ||
                    (startsWithLowestLowSurrogate &&
                      endsWithHighestLowSurrogate)
                  ) {
                    surrogateMappings.push([
                      [startHigh, endHigh + 1],
                      [startLow, endLow + 1],
                    ]);
                    complete = true;
                  } else {
                    surrogateMappings.push([
                      [startHigh, startHigh + 1],
                      [startLow, LOW_SURROGATE_MAX + 1],
                    ]);
                  }
                  if (!complete && startHigh + 1 < endHigh) {
                    if (endsWithHighestLowSurrogate) {
                      surrogateMappings.push([
                        [startHigh + 1, endHigh + 1],
                        [LOW_SURROGATE_MIN, endLow + 1],
                      ]);
                      complete = true;
                    } else {
                      surrogateMappings.push([
                        [startHigh + 1, endHigh],
                        [LOW_SURROGATE_MIN, LOW_SURROGATE_MAX + 1],
                      ]);
                    }
                  }
                  if (!complete) {
                    surrogateMappings.push([
                      [endHigh, endHigh + 1],
                      [LOW_SURROGATE_MIN, endLow + 1],
                    ]);
                  }
                  prevStartHigh = startHigh;
                  prevEndHigh = endHigh;
                  index += 2;
                }
                return optimizeSurrogateMappings(surrogateMappings);
              };
              var createSurrogateCharacterClasses = function (
                surrogateMappings
              ) {
                var result = [];
                forEach(surrogateMappings, function (surrogateMapping) {
                  var highSurrogates = surrogateMapping[0];
                  var lowSurrogates = surrogateMapping[1];
                  result.push(
                    createBMPCharacterClasses(highSurrogates) +
                      createBMPCharacterClasses(lowSurrogates)
                  );
                });
                return result.join("|");
              };
              var createCharacterClassesFromData = function (data) {
                var result = [];
                var parts = splitAtBMP(data);
                var loneHighSurrogates = parts.loneHighSurrogates;
                var bmp = parts.bmp;
                var astral = parts.astral;
                var hasAstral = !dataIsEmpty(parts.astral);
                var hasLoneSurrogates = !dataIsEmpty(loneHighSurrogates);
                var surrogateMappings = surrogateSet(astral);
                if (!hasAstral && hasLoneSurrogates) {
                  bmp = dataAddData(bmp, loneHighSurrogates);
                }
                if (!dataIsEmpty(bmp)) {
                  result.push(createBMPCharacterClasses(bmp));
                }
                if (surrogateMappings.length) {
                  result.push(
                    createSurrogateCharacterClasses(surrogateMappings)
                  );
                }
                if (hasAstral && hasLoneSurrogates) {
                  result.push(createBMPCharacterClasses(loneHighSurrogates));
                }
                return result.join("|");
              };
              var regenerate = function (value) {
                if (arguments.length > 1) {
                  value = slice.call(arguments);
                }
                if (this instanceof regenerate) {
                  this.data = [];
                  return value ? this.add(value) : this;
                }
                return new regenerate().add(value);
              };
              regenerate.version = "1.0.1";
              var proto = regenerate.prototype;
              extend(proto, {
                add: function (value) {
                  var $this = this;
                  if (value == null) {
                    return $this;
                  }
                  if (value instanceof regenerate) {
                    $this.data = dataAddData($this.data, value.data);
                    return $this;
                  }
                  if (arguments.length > 1) {
                    value = slice.call(arguments);
                  }
                  if (isArray(value)) {
                    forEach(value, function (item) {
                      $this.add(item);
                    });
                    return $this;
                  }
                  $this.data = dataAdd(
                    $this.data,
                    isNumber(value) ? value : symbolToCodePoint(value)
                  );
                  return $this;
                },
                remove: function (value) {
                  var $this = this;
                  if (value == null) {
                    return $this;
                  }
                  if (value instanceof regenerate) {
                    $this.data = dataRemoveData($this.data, value.data);
                    return $this;
                  }
                  if (arguments.length > 1) {
                    value = slice.call(arguments);
                  }
                  if (isArray(value)) {
                    forEach(value, function (item) {
                      $this.remove(item);
                    });
                    return $this;
                  }
                  $this.data = dataRemove(
                    $this.data,
                    isNumber(value) ? value : symbolToCodePoint(value)
                  );
                  return $this;
                },
                addRange: function (start, end) {
                  var $this = this;
                  $this.data = dataAddRange(
                    $this.data,
                    isNumber(start) ? start : symbolToCodePoint(start),
                    isNumber(end) ? end : symbolToCodePoint(end)
                  );
                  return $this;
                },
                removeRange: function (start, end) {
                  var $this = this;
                  var startCodePoint = isNumber(start)
                    ? start
                    : symbolToCodePoint(start);
                  var endCodePoint = isNumber(end)
                    ? end
                    : symbolToCodePoint(end);
                  $this.data = dataRemoveRange(
                    $this.data,
                    startCodePoint,
                    endCodePoint
                  );
                  return $this;
                },
                intersection: function (argument) {
                  var $this = this;
                  var array =
                    argument instanceof regenerate
                      ? dataToArray(argument.data)
                      : argument;
                  $this.data = dataIntersection($this.data, array);
                  return $this;
                },
                contains: function (codePoint) {
                  return dataContains(
                    this.data,
                    isNumber(codePoint)
                      ? codePoint
                      : symbolToCodePoint(codePoint)
                  );
                },
                clone: function () {
                  var set = new regenerate();
                  set.data = this.data.slice(0);
                  return set;
                },
                toString: function () {
                  var result = createCharacterClassesFromData(this.data);
                  return result.replace(regexNull, "\\0$1");
                },
                toRegExp: function (flags) {
                  return RegExp(this.toString(), flags || "");
                },
                valueOf: function () {
                  return dataToArray(this.data);
                },
              });
              proto.toArray = proto.valueOf;
              if (
                typeof define == "function" &&
                typeof define.amd == "object" &&
                define.amd
              ) {
                define(function () {
                  return regenerate;
                });
              } else if (freeExports && !freeExports.nodeType) {
                if (freeModule) {
                  freeModule.exports = regenerate;
                } else {
                  freeExports.regenerate = regenerate;
                }
              } else {
                root.regenerate = regenerate;
              }
            })(this);
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      111: [
        function (require, module, exports) {
          (function (global) {
            (function () {
              "use strict";
              var objectTypes = { function: true, object: true };
              var root = (objectTypes[typeof window] && window) || this;
              var oldRoot = root;
              var freeExports = objectTypes[typeof exports] && exports;
              var freeModule =
                objectTypes[typeof module] &&
                module &&
                !module.nodeType &&
                module;
              var freeGlobal =
                freeExports &&
                freeModule &&
                typeof global == "object" &&
                global;
              if (
                freeGlobal &&
                (freeGlobal.global === freeGlobal ||
                  freeGlobal.window === freeGlobal ||
                  freeGlobal.self === freeGlobal)
              ) {
                root = freeGlobal;
              }
              var stringFromCharCode = String.fromCharCode;
              var floor = Math.floor;
              function fromCodePoint() {
                var MAX_SIZE = 16384;
                var codeUnits = [];
                var highSurrogate;
                var lowSurrogate;
                var index = -1;
                var length = arguments.length;
                if (!length) {
                  return "";
                }
                var result = "";
                while (++index < length) {
                  var codePoint = Number(arguments[index]);
                  if (
                    !isFinite(codePoint) ||
                    codePoint < 0 ||
                    codePoint > 1114111 ||
                    floor(codePoint) != codePoint
                  ) {
                    throw RangeError("Invalid code point: " + codePoint);
                  }
                  if (codePoint <= 65535) {
                    codeUnits.push(codePoint);
                  } else {
                    codePoint -= 65536;
                    highSurrogate = (codePoint >> 10) + 55296;
                    lowSurrogate = (codePoint % 1024) + 56320;
                    codeUnits.push(highSurrogate, lowSurrogate);
                  }
                  if (index + 1 == length || codeUnits.length > MAX_SIZE) {
                    result += stringFromCharCode.apply(null, codeUnits);
                    codeUnits.length = 0;
                  }
                }
                return result;
              }
              function assertType(type, expected) {
                if (expected.indexOf("|") == -1) {
                  if (type == expected) {
                    return;
                  }
                  throw Error("Invalid node type: " + type);
                }
                expected = assertType.hasOwnProperty(expected)
                  ? assertType[expected]
                  : (assertType[expected] = RegExp("^(?:" + expected + ")$"));
                if (expected.test(type)) {
                  return;
                }
                throw Error("Invalid node type: " + type);
              }
              function generate(node) {
                var type = node.type;
                if (
                  generate.hasOwnProperty(type) &&
                  typeof generate[type] == "function"
                ) {
                  return generate[type](node);
                }
                throw Error("Invalid node type: " + type);
              }
              function generateAlternative(node) {
                assertType(node.type, "alternative");
                var terms = node.body,
                  length = terms ? terms.length : 0;
                if (length == 1) {
                  return generateTerm(terms[0]);
                } else {
                  var i = -1,
                    result = "";
                  while (++i < length) {
                    result += generateTerm(terms[i]);
                  }
                  return result;
                }
              }
              function generateAnchor(node) {
                assertType(node.type, "anchor");
                switch (node.kind) {
                  case "start":
                    return "^";
                  case "end":
                    return "$";
                  case "boundary":
                    return "\\b";
                  case "not-boundary":
                    return "\\B";
                  default:
                    throw Error("Invalid assertion");
                }
              }
              function generateAtom(node) {
                assertType(
                  node.type,
                  "anchor|characterClass|characterClassEscape|dot|group|reference|value"
                );
                return generate(node);
              }
              function generateCharacterClass(node) {
                assertType(node.type, "characterClass");
                var classRanges = node.body,
                  length = classRanges ? classRanges.length : 0;
                var i = -1,
                  result = "[";
                if (node.negative) {
                  result += "^";
                }
                while (++i < length) {
                  result += generateClassAtom(classRanges[i]);
                }
                result += "]";
                return result;
              }
              function generateCharacterClassEscape(node) {
                assertType(node.type, "characterClassEscape");
                return "\\" + node.value;
              }
              function generateCharacterClassRange(node) {
                assertType(node.type, "characterClassRange");
                var min = node.min,
                  max = node.max;
                if (
                  min.type == "characterClassRange" ||
                  max.type == "characterClassRange"
                ) {
                  throw Error("Invalid character class range");
                }
                return generateClassAtom(min) + "-" + generateClassAtom(max);
              }
              function generateClassAtom(node) {
                assertType(
                  node.type,
                  "anchor|characterClassEscape|characterClassRange|dot|value"
                );
                return generate(node);
              }
              function generateDisjunction(node) {
                assertType(node.type, "disjunction");
                var body = node.body,
                  length = body ? body.length : 0;
                if (length == 0) {
                  throw Error("No body");
                } else if (length == 1) {
                  return generate(body[0]);
                } else {
                  var i = -1,
                    result = "";
                  while (++i < length) {
                    if (i != 0) {
                      result += "|";
                    }
                    result += generate(body[i]);
                  }
                  return result;
                }
              }
              function generateDot(node) {
                assertType(node.type, "dot");
                return ".";
              }
              function generateGroup(node) {
                assertType(node.type, "group");
                var result = "(";
                switch (node.behavior) {
                  case "normal":
                    break;
                  case "ignore":
                    result += "?:";
                    break;
                  case "lookahead":
                    result += "?=";
                    break;
                  case "negativeLookahead":
                    result += "?!";
                    break;
                  default:
                    throw Error("Invalid behaviour: " + node.behaviour);
                }
                var body = node.body,
                  length = body ? body.length : 0;
                if (length == 1) {
                  result += generate(body[0]);
                } else {
                  var i = -1;
                  while (++i < length) {
                    result += generate(body[i]);
                  }
                }
                result += ")";
                return result;
              }
              function generateQuantifier(node) {
                assertType(node.type, "quantifier");
                var quantifier = "",
                  min = node.min,
                  max = node.max;
                switch (max) {
                  case undefined:
                  case null:
                    switch (min) {
                      case 0:
                        quantifier = "*";
                        break;
                      case 1:
                        quantifier = "+";
                        break;
                      default:
                        quantifier = "{" + min + ",}";
                        break;
                    }
                    break;
                  default:
                    if (min == max) {
                      quantifier = "{" + min + "}";
                    } else if (min == 0 && max == 1) {
                      quantifier = "?";
                    } else {
                      quantifier = "{" + min + "," + max + "}";
                    }
                    break;
                }
                if (!node.greedy) {
                  quantifier += "?";
                }
                return generateAtom(node.body[0]) + quantifier;
              }
              function generateReference(node) {
                assertType(node.type, "reference");
                return "\\" + node.matchIndex;
              }
              function generateTerm(node) {
                assertType(
                  node.type,
                  "anchor|characterClass|characterClassEscape|empty|group|quantifier|reference|value"
                );
                return generate(node);
              }
              function generateValue(node) {
                assertType(node.type, "value");
                var kind = node.kind,
                  codePoint = node.codePoint;
                switch (kind) {
                  case "controlLetter":
                    return "\\c" + fromCodePoint(codePoint + 64);
                  case "hexadecimalEscape":
                    return (
                      "\\x" +
                      ("00" + codePoint.toString(16).toUpperCase()).slice(-2)
                    );
                  case "identifier":
                    return "\\" + fromCodePoint(codePoint);
                  case "null":
                    return "\\" + codePoint;
                  case "octal":
                    return "\\" + codePoint.toString(8);
                  case "singleEscape":
                    switch (codePoint) {
                      case 8:
                        return "\\b";
                      case 9:
                        return "\\t";
                      case 10:
                        return "\\n";
                      case 11:
                        return "\\v";
                      case 12:
                        return "\\f";
                      case 13:
                        return "\\r";
                      default:
                        throw Error("Invalid codepoint: " + codePoint);
                    }
                  case "symbol":
                    return fromCodePoint(codePoint);
                  case "unicodeEscape":
                    return (
                      "\\u" +
                      ("0000" + codePoint.toString(16).toUpperCase()).slice(-4)
                    );
                  case "unicodeCodePointEscape":
                    return "\\u{" + codePoint.toString(16).toUpperCase() + "}";
                  default:
                    throw Error("Unsupported node kind: " + kind);
                }
              }
              generate.alternative = generateAlternative;
              generate.anchor = generateAnchor;
              generate.characterClass = generateCharacterClass;
              generate.characterClassEscape = generateCharacterClassEscape;
              generate.characterClassRange = generateCharacterClassRange;
              generate.disjunction = generateDisjunction;
              generate.dot = generateDot;
              generate.group = generateGroup;
              generate.quantifier = generateQuantifier;
              generate.reference = generateReference;
              generate.value = generateValue;
              if (
                typeof define == "function" &&
                typeof define.amd == "object" &&
                define.amd
              ) {
                define(function () {
                  return { generate: generate };
                });
              } else if (freeExports && freeModule) {
                freeExports.generate = generate;
              } else {
                root.regjsgen = { generate: generate };
              }
            }.call(this));
          }.call(
            this,
            typeof global !== "undefined"
              ? global
              : typeof self !== "undefined"
              ? self
              : typeof window !== "undefined"
              ? window
              : {}
          ));
        },
        {},
      ],
      112: [
        function (require, module, exports) {
          (function () {
            function parse(str, flags) {
              var hasUnicodeFlag = (flags || "").indexOf("u") !== -1;
              var pos = 0;
              var closedCaptureCounter = 0;
              function addRaw(node) {
                node.raw = str.substring(node.range[0], node.range[1]);
                return node;
              }
              function updateRawStart(node, start) {
                node.range[0] = start;
                return addRaw(node);
              }
              function createAnchor(kind, rawLength) {
                return addRaw({
                  type: "anchor",
                  kind: kind,
                  range: [pos - rawLength, pos],
                });
              }
              function createValue(kind, codePoint, from, to) {
                return addRaw({
                  type: "value",
                  kind: kind,
                  codePoint: codePoint,
                  range: [from, to],
                });
              }
              function createEscaped(kind, codePoint, value, fromOffset) {
                fromOffset = fromOffset || 0;
                return createValue(
                  kind,
                  codePoint,
                  pos - (value.length + fromOffset),
                  pos
                );
              }
              function createCharacter(matches) {
                var _char = matches[0];
                var first = _char.charCodeAt(0);
                if (hasUnicodeFlag) {
                  var second;
                  if (_char.length === 1 && first >= 55296 && first <= 56319) {
                    second = lookahead().charCodeAt(0);
                    if (second >= 56320 && second <= 57343) {
                      pos++;
                      return createValue(
                        "symbol",
                        (first - 55296) * 1024 + second - 56320 + 65536,
                        pos - 2,
                        pos
                      );
                    }
                  }
                }
                return createValue("symbol", first, pos - 1, pos);
              }
              function createDisjunction(alternatives, from, to) {
                return addRaw({
                  type: "disjunction",
                  body: alternatives,
                  range: [from, to],
                });
              }
              function createDot() {
                return addRaw({ type: "dot", range: [pos - 1, pos] });
              }
              function createCharacterClassEscape(value) {
                return addRaw({
                  type: "characterClassEscape",
                  value: value,
                  range: [pos - 2, pos],
                });
              }
              function createReference(matchIndex) {
                return addRaw({
                  type: "reference",
                  matchIndex: parseInt(matchIndex, 10),
                  range: [pos - 1 - matchIndex.length, pos],
                });
              }
              function createGroup(behavior, disjunction, from, to) {
                return addRaw({
                  type: "group",
                  behavior: behavior,
                  body: disjunction,
                  range: [from, to],
                });
              }
              function createQuantifier(min, max, from, to) {
                if (to == null) {
                  from = pos - 1;
                  to = pos;
                }
                return addRaw({
                  type: "quantifier",
                  min: min,
                  max: max,
                  greedy: true,
                  body: null,
                  range: [from, to],
                });
              }
              function createAlternative(terms, from, to) {
                return addRaw({
                  type: "alternative",
                  body: terms,
                  range: [from, to],
                });
              }
              function createCharacterClass(classRanges, negative, from, to) {
                return addRaw({
                  type: "characterClass",
                  body: classRanges,
                  negative: negative,
                  range: [from, to],
                });
              }
              function createClassRange(min, max, from, to) {
                if (min.codePoint > max.codePoint) {
                  throw SyntaxError("invalid range in character class");
                }
                return addRaw({
                  type: "characterClassRange",
                  min: min,
                  max: max,
                  range: [from, to],
                });
              }
              function flattenBody(body) {
                if (body.type === "alternative") {
                  return body.body;
                } else {
                  return [body];
                }
              }
              function isEmpty(obj) {
                return obj.type === "empty";
              }
              function incr(amount) {
                amount = amount || 1;
                var res = str.substring(pos, pos + amount);
                pos += amount || 1;
                return res;
              }
              function skip(value) {
                if (!match(value)) {
                  throw SyntaxError("character: " + value);
                }
              }
              function match(value) {
                if (str.indexOf(value, pos) === pos) {
                  return incr(value.length);
                }
              }
              function lookahead() {
                return str[pos];
              }
              function current(value) {
                return str.indexOf(value, pos) === pos;
              }
              function next(value) {
                return str[pos + 1] === value;
              }
              function matchReg(regExp) {
                var subStr = str.substring(pos);
                var res = subStr.match(regExp);
                if (res) {
                  res.range = [];
                  res.range[0] = pos;
                  incr(res[0].length);
                  res.range[1] = pos;
                }
                return res;
              }
              function parseDisjunction() {
                var res = [],
                  from = pos;
                res.push(parseAlternative());
                while (match("|")) {
                  res.push(parseAlternative());
                }
                if (res.length === 1) {
                  return res[0];
                }
                return createDisjunction(res, from, pos);
              }
              function parseAlternative() {
                var res = [],
                  from = pos;
                var term;
                while ((term = parseTerm())) {
                  res.push(term);
                }
                if (res.length === 1) {
                  return res[0];
                }
                return createAlternative(res, from, pos);
              }
              function parseTerm() {
                if (pos >= str.length || current("|") || current(")")) {
                  return null;
                }
                var anchor = parseAnchor();
                if (anchor) {
                  return anchor;
                }
                var atom = parseAtom();
                if (!atom) {
                  throw SyntaxError("Expected atom");
                }
                var quantifier = parseQuantifier() || false;
                if (quantifier) {
                  quantifier.body = flattenBody(atom);
                  updateRawStart(quantifier, atom.range[0]);
                  return quantifier;
                }
                return atom;
              }
              function parseGroup(matchA, typeA, matchB, typeB) {
                var type = null,
                  from = pos;
                if (match(matchA)) {
                  type = typeA;
                } else if (match(matchB)) {
                  type = typeB;
                } else {
                  return false;
                }
                var body = parseDisjunction();
                if (!body) {
                  throw SyntaxError("Expected disjunction");
                }
                skip(")");
                var group = createGroup(type, flattenBody(body), from, pos);
                if (type == "normal") {
                  closedCaptureCounter++;
                }
                return group;
              }
              function parseAnchor() {
                var res,
                  from = pos;
                if (match("^")) {
                  return createAnchor("start", 1);
                } else if (match("$")) {
                  return createAnchor("end", 1);
                } else if (match("\\b")) {
                  return createAnchor("boundary", 2);
                } else if (match("\\B")) {
                  return createAnchor("not-boundary", 2);
                } else {
                  return parseGroup(
                    "(?=",
                    "lookahead",
                    "(?!",
                    "negativeLookahead"
                  );
                }
              }
              function parseQuantifier() {
                var res;
                var quantifier;
                var min, max;
                if (match("*")) {
                  quantifier = createQuantifier(0);
                } else if (match("+")) {
                  quantifier = createQuantifier(1);
                } else if (match("?")) {
                  quantifier = createQuantifier(0, 1);
                } else if ((res = matchReg(/^\{([0-9]+)\}/))) {
                  min = parseInt(res[1], 10);
                  quantifier = createQuantifier(
                    min,
                    min,
                    res.range[0],
                    res.range[1]
                  );
                } else if ((res = matchReg(/^\{([0-9]+),\}/))) {
                  min = parseInt(res[1], 10);
                  quantifier = createQuantifier(
                    min,
                    undefined,
                    res.range[0],
                    res.range[1]
                  );
                } else if ((res = matchReg(/^\{([0-9]+),([0-9]+)\}/))) {
                  min = parseInt(res[1], 10);
                  max = parseInt(res[2], 10);
                  if (min > max) {
                    throw SyntaxError("numbers out of order in {} quantifier");
                  }
                  quantifier = createQuantifier(
                    min,
                    max,
                    res.range[0],
                    res.range[1]
                  );
                }
                if (quantifier) {
                  if (match("?")) {
                    quantifier.greedy = false;
                    quantifier.range[1] += 1;
                  }
                }
                return quantifier;
              }
              function parseAtom() {
                var res;
                if ((res = matchReg(/^[^^$\\.*+?(){[|]/))) {
                  return createCharacter(res);
                } else if (match(".")) {
                  return createDot();
                } else if (match("\\")) {
                  res = parseAtomEscape();
                  if (!res) {
                    throw SyntaxError("atomEscape");
                  }
                  return res;
                } else if ((res = parseCharacterClass())) {
                  return res;
                } else {
                  return parseGroup("(?:", "ignore", "(", "normal");
                }
              }
              function parseUnicodeSurrogatePairEscape(firstEscape) {
                if (hasUnicodeFlag) {
                  var first, second;
                  if (
                    firstEscape.kind == "unicodeEscape" &&
                    (first = firstEscape.codePoint) >= 55296 &&
                    first <= 56319 &&
                    current("\\") &&
                    next("u")
                  ) {
                    var prevPos = pos;
                    pos++;
                    var secondEscape = parseClassEscape();
                    if (
                      secondEscape.kind == "unicodeEscape" &&
                      (second = secondEscape.codePoint) >= 56320 &&
                      second <= 57343
                    ) {
                      firstEscape.range[1] = secondEscape.range[1];
                      firstEscape.codePoint =
                        (first - 55296) * 1024 + second - 56320 + 65536;
                      firstEscape.type = "value";
                      firstEscape.kind = "unicodeCodePointEscape";
                      addRaw(firstEscape);
                    } else {
                      pos = prevPos;
                    }
                  }
                }
                return firstEscape;
              }
              function parseClassEscape() {
                return parseAtomEscape(true);
              }
              function parseAtomEscape(insideCharacterClass) {
                var res;
                res = parseDecimalEscape();
                if (res) {
                  return res;
                }
                if (insideCharacterClass) {
                  if (match("b")) {
                    return createEscaped("singleEscape", 8, "\\b");
                  } else if (match("B")) {
                    throw SyntaxError(
                      "\\B not possible inside of CharacterClass"
                    );
                  }
                }
                res = parseCharacterEscape();
                return res;
              }
              function parseDecimalEscape() {
                var res, match;
                if ((res = matchReg(/^(?!0)\d+/))) {
                  match = res[0];
                  var refIdx = parseInt(res[0], 10);
                  if (refIdx <= closedCaptureCounter) {
                    return createReference(res[0]);
                  } else {
                    incr(-res[0].length);
                    if ((res = matchReg(/^[0-7]{1,3}/))) {
                      return createEscaped(
                        "octal",
                        parseInt(res[0], 8),
                        res[0],
                        1
                      );
                    } else {
                      res = createCharacter(matchReg(/^[89]/));
                      return updateRawStart(res, res.range[0] - 1);
                    }
                  }
                } else if ((res = matchReg(/^[0-7]{1,3}/))) {
                  match = res[0];
                  if (/^0{1,3}$/.test(match)) {
                    return createEscaped("null", 0, "0", match.length + 1);
                  } else {
                    return createEscaped("octal", parseInt(match, 8), match, 1);
                  }
                } else if ((res = matchReg(/^[dDsSwW]/))) {
                  return createCharacterClassEscape(res[0]);
                }
                return false;
              }
              function parseCharacterEscape() {
                var res;
                if ((res = matchReg(/^[fnrtv]/))) {
                  var codePoint = 0;
                  switch (res[0]) {
                    case "t":
                      codePoint = 9;
                      break;
                    case "n":
                      codePoint = 10;
                      break;
                    case "v":
                      codePoint = 11;
                      break;
                    case "f":
                      codePoint = 12;
                      break;
                    case "r":
                      codePoint = 13;
                      break;
                  }
                  return createEscaped(
                    "singleEscape",
                    codePoint,
                    "\\" + res[0]
                  );
                } else if ((res = matchReg(/^c([a-zA-Z])/))) {
                  return createEscaped(
                    "controlLetter",
                    res[1].charCodeAt(0) % 32,
                    res[1],
                    2
                  );
                } else if ((res = matchReg(/^x([0-9a-fA-F]{2})/))) {
                  return createEscaped(
                    "hexadecimalEscape",
                    parseInt(res[1], 16),
                    res[1],
                    2
                  );
                } else if ((res = matchReg(/^u([0-9a-fA-F]{4})/))) {
                  return parseUnicodeSurrogatePairEscape(
                    createEscaped(
                      "unicodeEscape",
                      parseInt(res[1], 16),
                      res[1],
                      2
                    )
                  );
                } else if (
                  hasUnicodeFlag &&
                  (res = matchReg(/^u\{([0-9a-fA-F]{1,6})\}/))
                ) {
                  return createEscaped(
                    "unicodeCodePointEscape",
                    parseInt(res[1], 16),
                    res[1],
                    4
                  );
                } else {
                  return parseIdentityEscape();
                }
              }
              function isIdentifierPart(ch) {
                var NonAsciiIdentifierPart = new RegExp(
                  "[????????-????-????-????-????-????????-????????-????????-??????-????-????-????-????-????-??????-????-????????????????-????-????-????-????-????-????-????-??????-????-????-???????-??????-??????-??????-??????-??????-??????-????????????-??????-?????????-??????-????????????-???????????????-??????-??????-??????-????????????-??????-???????????????????????????-????????????-?????????-?????????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-?????????-??????-??????-??????-????????????-??????-????????????-??????-????????????-??????????????????-??????-???????????????-??????-??????-???????????????????????????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-???????????????-??????-????????????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-?????????-?????????-?????????-??????-????????????-??????-??????-???????????????????????????-??????-??????-??????????????????-??????-??????-?????????-??????-??????-???????????????-???????????????-??????-??????-??????-??????-?????????-??????-??????-????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-???????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-???????????????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-???????????????????????????-??????-?????????-????????????-?????????-???????????????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-????????????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-????????????-????????????-??????-??????-??????-??????-??????-??????-??????-??????-??????-??????-?????????????????????-??????-??????-??????-??????-??????-??????-????????????-??????-??????-??????-??????-?????????-??????-??????-??????-??????-??????-???]"
                );
                return (
                  ch === 36 ||
                  ch === 95 ||
                  (ch >= 65 && ch <= 90) ||
                  (ch >= 97 && ch <= 122) ||
                  (ch >= 48 && ch <= 57) ||
                  ch === 92 ||
                  (ch >= 128 &&
                    NonAsciiIdentifierPart.test(String.fromCharCode(ch)))
                );
              }
              function parseIdentityEscape() {
                var ZWJ = "???";
                var ZWNJ = "???";
                var res;
                var tmp;
                if (!isIdentifierPart(lookahead())) {
                  tmp = incr();
                  return createEscaped("identifier", tmp.charCodeAt(0), tmp, 1);
                }
                if (match(ZWJ)) {
                  return createEscaped("identifier", 8204, ZWJ);
                } else if (match(ZWNJ)) {
                  return createEscaped("identifier", 8205, ZWNJ);
                }
                return null;
              }
              function parseCharacterClass() {
                var res,
                  from = pos;
                if ((res = matchReg(/^\[\^/))) {
                  res = parseClassRanges();
                  skip("]");
                  return createCharacterClass(res, true, from, pos);
                } else if (match("[")) {
                  res = parseClassRanges();
                  skip("]");
                  return createCharacterClass(res, false, from, pos);
                }
                return null;
              }
              function parseClassRanges() {
                var res;
                if (current("]")) {
                  return [];
                } else {
                  res = parseNonemptyClassRanges();
                  if (!res) {
                    throw SyntaxError("nonEmptyClassRanges");
                  }
                  return res;
                }
              }
              function parseHelperClassRanges(atom) {
                var from, to, res;
                if (current("-") && !next("]")) {
                  skip("-");
                  res = parseClassAtom();
                  if (!res) {
                    throw SyntaxError("classAtom");
                  }
                  to = pos;
                  var classRanges = parseClassRanges();
                  if (!classRanges) {
                    throw SyntaxError("classRanges");
                  }
                  from = atom.range[0];
                  if (classRanges.type === "empty") {
                    return [createClassRange(atom, res, from, to)];
                  }
                  return [createClassRange(atom, res, from, to)].concat(
                    classRanges
                  );
                }
                res = parseNonemptyClassRangesNoDash();
                if (!res) {
                  throw SyntaxError("nonEmptyClassRangesNoDash");
                }
                return [atom].concat(res);
              }
              function parseNonemptyClassRanges() {
                var atom = parseClassAtom();
                if (!atom) {
                  throw SyntaxError("classAtom");
                }
                if (current("]")) {
                  return [atom];
                }
                return parseHelperClassRanges(atom);
              }
              function parseNonemptyClassRangesNoDash() {
                var res = parseClassAtom();
                if (!res) {
                  throw SyntaxError("classAtom");
                }
                if (current("]")) {
                  return res;
                }
                return parseHelperClassRanges(res);
              }
              function parseClassAtom() {
                if (match("-")) {
                  return createCharacter("-");
                } else {
                  return parseClassAtomNoDash();
                }
              }
              function parseClassAtomNoDash() {
                var res;
                if ((res = matchReg(/^[^\\\]-]/))) {
                  return createCharacter(res[0]);
                } else if (match("\\")) {
                  res = parseClassEscape();
                  if (!res) {
                    throw SyntaxError("classEscape");
                  }
                  return parseUnicodeSurrogatePairEscape(res);
                }
              }
              str = String(str);
              if (str === "") {
                str = "(?:)";
              }
              var result = parseDisjunction();
              if (result.range[1] !== str.length) {
                throw SyntaxError(
                  "Could not parse entire input - got stuck: " + str
                );
              }
              return result;
            }
            var regjsparser = { parse: parse };
            if (typeof module !== "undefined" && module.exports) {
              module.exports = regjsparser;
            } else {
              window.regjsparser = regjsparser;
            }
          })();
        },
        {},
      ],
      113: [
        function (require, module, exports) {
          var generate = require("regjsgen").generate;
          var parse = require("regjsparser").parse;
          var regenerate = require("regenerate");
          var iuMappings = require("./data/iu-mappings.json");
          var ESCAPE_SETS = require("./data/character-class-escape-sets.js");
          function getCharacterClassEscapeSet(character) {
            if (unicode) {
              if (ignoreCase) {
                return ESCAPE_SETS.UNICODE_IGNORE_CASE[character];
              }
              return ESCAPE_SETS.UNICODE[character];
            }
            return ESCAPE_SETS.REGULAR[character];
          }
          var object = {};
          var hasOwnProperty = object.hasOwnProperty;
          function has(object, property) {
            return hasOwnProperty.call(object, property);
          }
          var UNICODE_SET = regenerate().addRange(0, 1114111);
          var BMP_SET = regenerate().addRange(0, 65535);
          var DOT_SET_UNICODE = UNICODE_SET.clone().remove(10, 13, 8232, 8233);
          var DOT_SET = DOT_SET_UNICODE.clone().intersection(BMP_SET);
          regenerate.prototype.iuAddRange = function (min, max) {
            var $this = this;
            do {
              var folded = caseFold(min);
              if (folded) {
                $this.add(folded);
              }
            } while (++min <= max);
            return $this;
          };
          function assign(target, source) {
            for (var key in source) {
              target[key] = source[key];
            }
          }
          function update(item, pattern) {
            var tree = parse(pattern, "");
            switch (tree.type) {
              case "characterClass":
              case "group":
              case "value":
                break;
              default:
                tree = wrap(tree, pattern);
            }
            assign(item, tree);
          }
          function wrap(tree, pattern) {
            return {
              type: "group",
              behavior: "ignore",
              body: [tree],
              raw: "(?:" + pattern + ")",
            };
          }
          function caseFold(codePoint) {
            return has(iuMappings, codePoint) ? iuMappings[codePoint] : false;
          }
          var ignoreCase = false;
          var unicode = false;
          function processCharacterClass(characterClassItem) {
            var set = regenerate();
            var body = characterClassItem.body.forEach(function (item) {
              switch (item.type) {
                case "value":
                  set.add(item.codePoint);
                  if (ignoreCase && unicode) {
                    var folded = caseFold(item.codePoint);
                    if (folded) {
                      set.add(folded);
                    }
                  }
                  break;
                case "characterClassRange":
                  var min = item.min.codePoint;
                  var max = item.max.codePoint;
                  set.addRange(min, max);
                  if (ignoreCase && unicode) {
                    set.iuAddRange(min, max);
                  }
                  break;
                case "characterClassEscape":
                  set.add(getCharacterClassEscapeSet(item.value));
                  break;
                default:
                  throw Error("Unknown term type: " + item.type);
              }
            });
            if (characterClassItem.negative) {
              set = (unicode ? UNICODE_SET : BMP_SET).clone().remove(set);
            }
            update(characterClassItem, set.toString());
            return characterClassItem;
          }
          function processTerm(item) {
            switch (item.type) {
              case "dot":
                update(item, (unicode ? DOT_SET_UNICODE : DOT_SET).toString());
                break;
              case "characterClass":
                item = processCharacterClass(item);
                break;
              case "characterClassEscape":
                update(item, getCharacterClassEscapeSet(item.value).toString());
                break;
              case "alternative":
              case "disjunction":
              case "group":
              case "quantifier":
                item.body = item.body.map(processTerm);
                break;
              case "value":
                var codePoint = item.codePoint;
                var set = regenerate(codePoint);
                if (ignoreCase && unicode) {
                  var folded = caseFold(codePoint);
                  if (folded) {
                    set.add(folded);
                  }
                }
                update(item, set.toString());
                break;
              case "anchor":
              case "empty":
              case "group":
              case "reference":
                break;
              default:
                throw Error("Unknown term type: " + item.type);
            }
            return item;
          }
          module.exports = function (pattern, flags) {
            var tree = parse(pattern, flags);
            ignoreCase = flags ? flags.indexOf("i") > -1 : false;
            unicode = flags ? flags.indexOf("u") > -1 : false;
            assign(tree, processTerm(tree));
            return generate(tree);
          };
        },
        {
          "./data/character-class-escape-sets.js": 108,
          "./data/iu-mappings.json": 109,
          regenerate: 110,
          regjsgen: 111,
          regjsparser: 112,
        },
      ],
      114: [
        function (require, module, exports) {
          exports.SourceMapGenerator =
            require("./source-map/source-map-generator").SourceMapGenerator;
          exports.SourceMapConsumer =
            require("./source-map/source-map-consumer").SourceMapConsumer;
          exports.SourceNode = require("./source-map/source-node").SourceNode;
        },
        {
          "./source-map/source-map-consumer": 119,
          "./source-map/source-map-generator": 120,
          "./source-map/source-node": 121,
        },
      ],
      115: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var util = require("./util");
            function ArraySet() {
              this._array = [];
              this._set = {};
            }
            ArraySet.fromArray = function ArraySet_fromArray(
              aArray,
              aAllowDuplicates
            ) {
              var set = new ArraySet();
              for (var i = 0, len = aArray.length; i < len; i++) {
                set.add(aArray[i], aAllowDuplicates);
              }
              return set;
            };
            ArraySet.prototype.add = function ArraySet_add(
              aStr,
              aAllowDuplicates
            ) {
              var isDuplicate = this.has(aStr);
              var idx = this._array.length;
              if (!isDuplicate || aAllowDuplicates) {
                this._array.push(aStr);
              }
              if (!isDuplicate) {
                this._set[util.toSetString(aStr)] = idx;
              }
            };
            ArraySet.prototype.has = function ArraySet_has(aStr) {
              return Object.prototype.hasOwnProperty.call(
                this._set,
                util.toSetString(aStr)
              );
            };
            ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
              if (this.has(aStr)) {
                return this._set[util.toSetString(aStr)];
              }
              throw new Error('"' + aStr + '" is not in the set.');
            };
            ArraySet.prototype.at = function ArraySet_at(aIdx) {
              if (aIdx >= 0 && aIdx < this._array.length) {
                return this._array[aIdx];
              }
              throw new Error("No element indexed by " + aIdx);
            };
            ArraySet.prototype.toArray = function ArraySet_toArray() {
              return this._array.slice();
            };
            exports.ArraySet = ArraySet;
          });
        },
        { "./util": 122, amdefine: 123 },
      ],
      116: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var base64 = require("./base64");
            var VLQ_BASE_SHIFT = 5;
            var VLQ_BASE = 1 << VLQ_BASE_SHIFT;
            var VLQ_BASE_MASK = VLQ_BASE - 1;
            var VLQ_CONTINUATION_BIT = VLQ_BASE;
            function toVLQSigned(aValue) {
              return aValue < 0 ? (-aValue << 1) + 1 : (aValue << 1) + 0;
            }
            function fromVLQSigned(aValue) {
              var isNegative = (aValue & 1) === 1;
              var shifted = aValue >> 1;
              return isNegative ? -shifted : shifted;
            }
            exports.encode = function base64VLQ_encode(aValue) {
              var encoded = "";
              var digit;
              var vlq = toVLQSigned(aValue);
              do {
                digit = vlq & VLQ_BASE_MASK;
                vlq >>>= VLQ_BASE_SHIFT;
                if (vlq > 0) {
                  digit |= VLQ_CONTINUATION_BIT;
                }
                encoded += base64.encode(digit);
              } while (vlq > 0);
              return encoded;
            };
            exports.decode = function base64VLQ_decode(aStr, aOutParam) {
              var i = 0;
              var strLen = aStr.length;
              var result = 0;
              var shift = 0;
              var continuation, digit;
              do {
                if (i >= strLen) {
                  throw new Error("Expected more digits in base 64 VLQ value.");
                }
                digit = base64.decode(aStr.charAt(i++));
                continuation = !!(digit & VLQ_CONTINUATION_BIT);
                digit &= VLQ_BASE_MASK;
                result = result + (digit << shift);
                shift += VLQ_BASE_SHIFT;
              } while (continuation);
              aOutParam.value = fromVLQSigned(result);
              aOutParam.rest = aStr.slice(i);
            };
          });
        },
        { "./base64": 117, amdefine: 123 },
      ],
      117: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var charToIntMap = {};
            var intToCharMap = {};
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
              .split("")
              .forEach(function (ch, index) {
                charToIntMap[ch] = index;
                intToCharMap[index] = ch;
              });
            exports.encode = function base64_encode(aNumber) {
              if (aNumber in intToCharMap) {
                return intToCharMap[aNumber];
              }
              throw new TypeError("Must be between 0 and 63: " + aNumber);
            };
            exports.decode = function base64_decode(aChar) {
              if (aChar in charToIntMap) {
                return charToIntMap[aChar];
              }
              throw new TypeError("Not a valid base 64 digit: " + aChar);
            };
          });
        },
        { amdefine: 123 },
      ],
      118: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            function recursiveSearch(
              aLow,
              aHigh,
              aNeedle,
              aHaystack,
              aCompare
            ) {
              var mid = Math.floor((aHigh - aLow) / 2) + aLow;
              var cmp = aCompare(aNeedle, aHaystack[mid], true);
              if (cmp === 0) {
                return aHaystack[mid];
              } else if (cmp > 0) {
                if (aHigh - mid > 1) {
                  return recursiveSearch(
                    mid,
                    aHigh,
                    aNeedle,
                    aHaystack,
                    aCompare
                  );
                }
                return aHaystack[mid];
              } else {
                if (mid - aLow > 1) {
                  return recursiveSearch(
                    aLow,
                    mid,
                    aNeedle,
                    aHaystack,
                    aCompare
                  );
                }
                return aLow < 0 ? null : aHaystack[aLow];
              }
            }
            exports.search = function search(aNeedle, aHaystack, aCompare) {
              return aHaystack.length > 0
                ? recursiveSearch(
                    -1,
                    aHaystack.length,
                    aNeedle,
                    aHaystack,
                    aCompare
                  )
                : null;
            };
          });
        },
        { amdefine: 123 },
      ],
      119: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var util = require("./util");
            var binarySearch = require("./binary-search");
            var ArraySet = require("./array-set").ArraySet;
            var base64VLQ = require("./base64-vlq");
            function SourceMapConsumer(aSourceMap) {
              var sourceMap = aSourceMap;
              if (typeof aSourceMap === "string") {
                sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ""));
              }
              var version = util.getArg(sourceMap, "version");
              var sources = util.getArg(sourceMap, "sources");
              var names = util.getArg(sourceMap, "names", []);
              var sourceRoot = util.getArg(sourceMap, "sourceRoot", null);
              var sourcesContent = util.getArg(
                sourceMap,
                "sourcesContent",
                null
              );
              var mappings = util.getArg(sourceMap, "mappings");
              var file = util.getArg(sourceMap, "file", null);
              if (version != this._version) {
                throw new Error("Unsupported version: " + version);
              }
              this._names = ArraySet.fromArray(names, true);
              this._sources = ArraySet.fromArray(sources, true);
              this.sourceRoot = sourceRoot;
              this.sourcesContent = sourcesContent;
              this._mappings = mappings;
              this.file = file;
            }
            SourceMapConsumer.fromSourceMap =
              function SourceMapConsumer_fromSourceMap(aSourceMap) {
                var smc = Object.create(SourceMapConsumer.prototype);
                smc._names = ArraySet.fromArray(
                  aSourceMap._names.toArray(),
                  true
                );
                smc._sources = ArraySet.fromArray(
                  aSourceMap._sources.toArray(),
                  true
                );
                smc.sourceRoot = aSourceMap._sourceRoot;
                smc.sourcesContent = aSourceMap._generateSourcesContent(
                  smc._sources.toArray(),
                  smc.sourceRoot
                );
                smc.file = aSourceMap._file;
                smc.__generatedMappings = aSourceMap._mappings
                  .slice()
                  .sort(util.compareByGeneratedPositions);
                smc.__originalMappings = aSourceMap._mappings
                  .slice()
                  .sort(util.compareByOriginalPositions);
                return smc;
              };
            SourceMapConsumer.prototype._version = 3;
            Object.defineProperty(SourceMapConsumer.prototype, "sources", {
              get: function () {
                return this._sources.toArray().map(function (s) {
                  return this.sourceRoot != null
                    ? util.join(this.sourceRoot, s)
                    : s;
                }, this);
              },
            });
            SourceMapConsumer.prototype.__generatedMappings = null;
            Object.defineProperty(
              SourceMapConsumer.prototype,
              "_generatedMappings",
              {
                get: function () {
                  if (!this.__generatedMappings) {
                    this.__generatedMappings = [];
                    this.__originalMappings = [];
                    this._parseMappings(this._mappings, this.sourceRoot);
                  }
                  return this.__generatedMappings;
                },
              }
            );
            SourceMapConsumer.prototype.__originalMappings = null;
            Object.defineProperty(
              SourceMapConsumer.prototype,
              "_originalMappings",
              {
                get: function () {
                  if (!this.__originalMappings) {
                    this.__generatedMappings = [];
                    this.__originalMappings = [];
                    this._parseMappings(this._mappings, this.sourceRoot);
                  }
                  return this.__originalMappings;
                },
              }
            );
            SourceMapConsumer.prototype._nextCharIsMappingSeparator =
              function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
                var c = aStr.charAt(0);
                return c === ";" || c === ",";
              };
            SourceMapConsumer.prototype._parseMappings =
              function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
                var generatedLine = 1;
                var previousGeneratedColumn = 0;
                var previousOriginalLine = 0;
                var previousOriginalColumn = 0;
                var previousSource = 0;
                var previousName = 0;
                var str = aStr;
                var temp = {};
                var mapping;
                while (str.length > 0) {
                  if (str.charAt(0) === ";") {
                    generatedLine++;
                    str = str.slice(1);
                    previousGeneratedColumn = 0;
                  } else if (str.charAt(0) === ",") {
                    str = str.slice(1);
                  } else {
                    mapping = {};
                    mapping.generatedLine = generatedLine;
                    base64VLQ.decode(str, temp);
                    mapping.generatedColumn =
                      previousGeneratedColumn + temp.value;
                    previousGeneratedColumn = mapping.generatedColumn;
                    str = temp.rest;
                    if (
                      str.length > 0 &&
                      !this._nextCharIsMappingSeparator(str)
                    ) {
                      base64VLQ.decode(str, temp);
                      mapping.source = this._sources.at(
                        previousSource + temp.value
                      );
                      previousSource += temp.value;
                      str = temp.rest;
                      if (
                        str.length === 0 ||
                        this._nextCharIsMappingSeparator(str)
                      ) {
                        throw new Error(
                          "Found a source, but no line and column"
                        );
                      }
                      base64VLQ.decode(str, temp);
                      mapping.originalLine = previousOriginalLine + temp.value;
                      previousOriginalLine = mapping.originalLine;
                      mapping.originalLine += 1;
                      str = temp.rest;
                      if (
                        str.length === 0 ||
                        this._nextCharIsMappingSeparator(str)
                      ) {
                        throw new Error(
                          "Found a source and line, but no column"
                        );
                      }
                      base64VLQ.decode(str, temp);
                      mapping.originalColumn =
                        previousOriginalColumn + temp.value;
                      previousOriginalColumn = mapping.originalColumn;
                      str = temp.rest;
                      if (
                        str.length > 0 &&
                        !this._nextCharIsMappingSeparator(str)
                      ) {
                        base64VLQ.decode(str, temp);
                        mapping.name = this._names.at(
                          previousName + temp.value
                        );
                        previousName += temp.value;
                        str = temp.rest;
                      }
                    }
                    this.__generatedMappings.push(mapping);
                    if (typeof mapping.originalLine === "number") {
                      this.__originalMappings.push(mapping);
                    }
                  }
                }
                this.__generatedMappings.sort(util.compareByGeneratedPositions);
                this.__originalMappings.sort(util.compareByOriginalPositions);
              };
            SourceMapConsumer.prototype._findMapping =
              function SourceMapConsumer_findMapping(
                aNeedle,
                aMappings,
                aLineName,
                aColumnName,
                aComparator
              ) {
                if (aNeedle[aLineName] <= 0) {
                  throw new TypeError(
                    "Line must be greater than or equal to 1, got " +
                      aNeedle[aLineName]
                  );
                }
                if (aNeedle[aColumnName] < 0) {
                  throw new TypeError(
                    "Column must be greater than or equal to 0, got " +
                      aNeedle[aColumnName]
                  );
                }
                return binarySearch.search(aNeedle, aMappings, aComparator);
              };
            SourceMapConsumer.prototype.originalPositionFor =
              function SourceMapConsumer_originalPositionFor(aArgs) {
                var needle = {
                  generatedLine: util.getArg(aArgs, "line"),
                  generatedColumn: util.getArg(aArgs, "column"),
                };
                var mapping = this._findMapping(
                  needle,
                  this._generatedMappings,
                  "generatedLine",
                  "generatedColumn",
                  util.compareByGeneratedPositions
                );
                if (mapping && mapping.generatedLine === needle.generatedLine) {
                  var source = util.getArg(mapping, "source", null);
                  if (source != null && this.sourceRoot != null) {
                    source = util.join(this.sourceRoot, source);
                  }
                  return {
                    source: source,
                    line: util.getArg(mapping, "originalLine", null),
                    column: util.getArg(mapping, "originalColumn", null),
                    name: util.getArg(mapping, "name", null),
                  };
                }
                return { source: null, line: null, column: null, name: null };
              };
            SourceMapConsumer.prototype.sourceContentFor =
              function SourceMapConsumer_sourceContentFor(aSource) {
                if (!this.sourcesContent) {
                  return null;
                }
                if (this.sourceRoot != null) {
                  aSource = util.relative(this.sourceRoot, aSource);
                }
                if (this._sources.has(aSource)) {
                  return this.sourcesContent[this._sources.indexOf(aSource)];
                }
                var url;
                if (
                  this.sourceRoot != null &&
                  (url = util.urlParse(this.sourceRoot))
                ) {
                  var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
                  if (
                    url.scheme == "file" &&
                    this._sources.has(fileUriAbsPath)
                  ) {
                    return this.sourcesContent[
                      this._sources.indexOf(fileUriAbsPath)
                    ];
                  }
                  if (
                    (!url.path || url.path == "/") &&
                    this._sources.has("/" + aSource)
                  ) {
                    return this.sourcesContent[
                      this._sources.indexOf("/" + aSource)
                    ];
                  }
                }
                throw new Error('"' + aSource + '" is not in the SourceMap.');
              };
            SourceMapConsumer.prototype.generatedPositionFor =
              function SourceMapConsumer_generatedPositionFor(aArgs) {
                var needle = {
                  source: util.getArg(aArgs, "source"),
                  originalLine: util.getArg(aArgs, "line"),
                  originalColumn: util.getArg(aArgs, "column"),
                };
                if (this.sourceRoot != null) {
                  needle.source = util.relative(this.sourceRoot, needle.source);
                }
                var mapping = this._findMapping(
                  needle,
                  this._originalMappings,
                  "originalLine",
                  "originalColumn",
                  util.compareByOriginalPositions
                );
                if (mapping) {
                  return {
                    line: util.getArg(mapping, "generatedLine", null),
                    column: util.getArg(mapping, "generatedColumn", null),
                  };
                }
                return { line: null, column: null };
              };
            SourceMapConsumer.GENERATED_ORDER = 1;
            SourceMapConsumer.ORIGINAL_ORDER = 2;
            SourceMapConsumer.prototype.eachMapping =
              function SourceMapConsumer_eachMapping(
                aCallback,
                aContext,
                aOrder
              ) {
                var context = aContext || null;
                var order = aOrder || SourceMapConsumer.GENERATED_ORDER;
                var mappings;
                switch (order) {
                  case SourceMapConsumer.GENERATED_ORDER:
                    mappings = this._generatedMappings;
                    break;
                  case SourceMapConsumer.ORIGINAL_ORDER:
                    mappings = this._originalMappings;
                    break;
                  default:
                    throw new Error("Unknown order of iteration.");
                }
                var sourceRoot = this.sourceRoot;
                mappings
                  .map(function (mapping) {
                    var source = mapping.source;
                    if (source != null && sourceRoot != null) {
                      source = util.join(sourceRoot, source);
                    }
                    return {
                      source: source,
                      generatedLine: mapping.generatedLine,
                      generatedColumn: mapping.generatedColumn,
                      originalLine: mapping.originalLine,
                      originalColumn: mapping.originalColumn,
                      name: mapping.name,
                    };
                  })
                  .forEach(aCallback, context);
              };
            exports.SourceMapConsumer = SourceMapConsumer;
          });
        },
        {
          "./array-set": 115,
          "./base64-vlq": 116,
          "./binary-search": 118,
          "./util": 122,
          amdefine: 123,
        },
      ],
      120: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var base64VLQ = require("./base64-vlq");
            var util = require("./util");
            var ArraySet = require("./array-set").ArraySet;
            function SourceMapGenerator(aArgs) {
              if (!aArgs) {
                aArgs = {};
              }
              this._file = util.getArg(aArgs, "file", null);
              this._sourceRoot = util.getArg(aArgs, "sourceRoot", null);
              this._sources = new ArraySet();
              this._names = new ArraySet();
              this._mappings = [];
              this._sourcesContents = null;
            }
            SourceMapGenerator.prototype._version = 3;
            SourceMapGenerator.fromSourceMap =
              function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
                var sourceRoot = aSourceMapConsumer.sourceRoot;
                var generator = new SourceMapGenerator({
                  file: aSourceMapConsumer.file,
                  sourceRoot: sourceRoot,
                });
                aSourceMapConsumer.eachMapping(function (mapping) {
                  var newMapping = {
                    generated: {
                      line: mapping.generatedLine,
                      column: mapping.generatedColumn,
                    },
                  };
                  if (mapping.source != null) {
                    newMapping.source = mapping.source;
                    if (sourceRoot != null) {
                      newMapping.source = util.relative(
                        sourceRoot,
                        newMapping.source
                      );
                    }
                    newMapping.original = {
                      line: mapping.originalLine,
                      column: mapping.originalColumn,
                    };
                    if (mapping.name != null) {
                      newMapping.name = mapping.name;
                    }
                  }
                  generator.addMapping(newMapping);
                });
                aSourceMapConsumer.sources.forEach(function (sourceFile) {
                  var content = aSourceMapConsumer.sourceContentFor(sourceFile);
                  if (content != null) {
                    generator.setSourceContent(sourceFile, content);
                  }
                });
                return generator;
              };
            SourceMapGenerator.prototype.addMapping =
              function SourceMapGenerator_addMapping(aArgs) {
                var generated = util.getArg(aArgs, "generated");
                var original = util.getArg(aArgs, "original", null);
                var source = util.getArg(aArgs, "source", null);
                var name = util.getArg(aArgs, "name", null);
                this._validateMapping(generated, original, source, name);
                if (source != null && !this._sources.has(source)) {
                  this._sources.add(source);
                }
                if (name != null && !this._names.has(name)) {
                  this._names.add(name);
                }
                this._mappings.push({
                  generatedLine: generated.line,
                  generatedColumn: generated.column,
                  originalLine: original != null && original.line,
                  originalColumn: original != null && original.column,
                  source: source,
                  name: name,
                });
              };
            SourceMapGenerator.prototype.setSourceContent =
              function SourceMapGenerator_setSourceContent(
                aSourceFile,
                aSourceContent
              ) {
                var source = aSourceFile;
                if (this._sourceRoot != null) {
                  source = util.relative(this._sourceRoot, source);
                }
                if (aSourceContent != null) {
                  if (!this._sourcesContents) {
                    this._sourcesContents = {};
                  }
                  this._sourcesContents[util.toSetString(source)] =
                    aSourceContent;
                } else if (this._sourcesContents) {
                  delete this._sourcesContents[util.toSetString(source)];
                  if (Object.keys(this._sourcesContents).length === 0) {
                    this._sourcesContents = null;
                  }
                }
              };
            SourceMapGenerator.prototype.applySourceMap =
              function SourceMapGenerator_applySourceMap(
                aSourceMapConsumer,
                aSourceFile,
                aSourceMapPath
              ) {
                var sourceFile = aSourceFile;
                if (aSourceFile == null) {
                  if (aSourceMapConsumer.file == null) {
                    throw new Error(
                      "SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, " +
                        'or the source map\'s "file" property. Both were omitted.'
                    );
                  }
                  sourceFile = aSourceMapConsumer.file;
                }
                var sourceRoot = this._sourceRoot;
                if (sourceRoot != null) {
                  sourceFile = util.relative(sourceRoot, sourceFile);
                }
                var newSources = new ArraySet();
                var newNames = new ArraySet();
                this._mappings.forEach(function (mapping) {
                  if (
                    mapping.source === sourceFile &&
                    mapping.originalLine != null
                  ) {
                    var original = aSourceMapConsumer.originalPositionFor({
                      line: mapping.originalLine,
                      column: mapping.originalColumn,
                    });
                    if (original.source != null) {
                      mapping.source = original.source;
                      if (aSourceMapPath != null) {
                        mapping.source = util.join(
                          aSourceMapPath,
                          mapping.source
                        );
                      }
                      if (sourceRoot != null) {
                        mapping.source = util.relative(
                          sourceRoot,
                          mapping.source
                        );
                      }
                      mapping.originalLine = original.line;
                      mapping.originalColumn = original.column;
                      if (original.name != null) {
                        mapping.name = original.name;
                      }
                    }
                  }
                  var source = mapping.source;
                  if (source != null && !newSources.has(source)) {
                    newSources.add(source);
                  }
                  var name = mapping.name;
                  if (name != null && !newNames.has(name)) {
                    newNames.add(name);
                  }
                }, this);
                this._sources = newSources;
                this._names = newNames;
                aSourceMapConsumer.sources.forEach(function (sourceFile) {
                  var content = aSourceMapConsumer.sourceContentFor(sourceFile);
                  if (content != null) {
                    if (aSourceMapPath != null) {
                      sourceFile = util.join(aSourceMapPath, sourceFile);
                    }
                    if (sourceRoot != null) {
                      sourceFile = util.relative(sourceRoot, sourceFile);
                    }
                    this.setSourceContent(sourceFile, content);
                  }
                }, this);
              };
            SourceMapGenerator.prototype._validateMapping =
              function SourceMapGenerator_validateMapping(
                aGenerated,
                aOriginal,
                aSource,
                aName
              ) {
                if (
                  aGenerated &&
                  "line" in aGenerated &&
                  "column" in aGenerated &&
                  aGenerated.line > 0 &&
                  aGenerated.column >= 0 &&
                  !aOriginal &&
                  !aSource &&
                  !aName
                ) {
                  return;
                } else if (
                  aGenerated &&
                  "line" in aGenerated &&
                  "column" in aGenerated &&
                  aOriginal &&
                  "line" in aOriginal &&
                  "column" in aOriginal &&
                  aGenerated.line > 0 &&
                  aGenerated.column >= 0 &&
                  aOriginal.line > 0 &&
                  aOriginal.column >= 0 &&
                  aSource
                ) {
                  return;
                } else {
                  throw new Error(
                    "Invalid mapping: " +
                      JSON.stringify({
                        generated: aGenerated,
                        source: aSource,
                        original: aOriginal,
                        name: aName,
                      })
                  );
                }
              };
            SourceMapGenerator.prototype._serializeMappings =
              function SourceMapGenerator_serializeMappings() {
                var previousGeneratedColumn = 0;
                var previousGeneratedLine = 1;
                var previousOriginalColumn = 0;
                var previousOriginalLine = 0;
                var previousName = 0;
                var previousSource = 0;
                var result = "";
                var mapping;
                this._mappings.sort(util.compareByGeneratedPositions);
                for (var i = 0, len = this._mappings.length; i < len; i++) {
                  mapping = this._mappings[i];
                  if (mapping.generatedLine !== previousGeneratedLine) {
                    previousGeneratedColumn = 0;
                    while (mapping.generatedLine !== previousGeneratedLine) {
                      result += ";";
                      previousGeneratedLine++;
                    }
                  } else {
                    if (i > 0) {
                      if (
                        !util.compareByGeneratedPositions(
                          mapping,
                          this._mappings[i - 1]
                        )
                      ) {
                        continue;
                      }
                      result += ",";
                    }
                  }
                  result += base64VLQ.encode(
                    mapping.generatedColumn - previousGeneratedColumn
                  );
                  previousGeneratedColumn = mapping.generatedColumn;
                  if (mapping.source != null) {
                    result += base64VLQ.encode(
                      this._sources.indexOf(mapping.source) - previousSource
                    );
                    previousSource = this._sources.indexOf(mapping.source);
                    result += base64VLQ.encode(
                      mapping.originalLine - 1 - previousOriginalLine
                    );
                    previousOriginalLine = mapping.originalLine - 1;
                    result += base64VLQ.encode(
                      mapping.originalColumn - previousOriginalColumn
                    );
                    previousOriginalColumn = mapping.originalColumn;
                    if (mapping.name != null) {
                      result += base64VLQ.encode(
                        this._names.indexOf(mapping.name) - previousName
                      );
                      previousName = this._names.indexOf(mapping.name);
                    }
                  }
                }
                return result;
              };
            SourceMapGenerator.prototype._generateSourcesContent =
              function SourceMapGenerator_generateSourcesContent(
                aSources,
                aSourceRoot
              ) {
                return aSources.map(function (source) {
                  if (!this._sourcesContents) {
                    return null;
                  }
                  if (aSourceRoot != null) {
                    source = util.relative(aSourceRoot, source);
                  }
                  var key = util.toSetString(source);
                  return Object.prototype.hasOwnProperty.call(
                    this._sourcesContents,
                    key
                  )
                    ? this._sourcesContents[key]
                    : null;
                }, this);
              };
            SourceMapGenerator.prototype.toJSON =
              function SourceMapGenerator_toJSON() {
                var map = {
                  version: this._version,
                  sources: this._sources.toArray(),
                  names: this._names.toArray(),
                  mappings: this._serializeMappings(),
                };
                if (this._file != null) {
                  map.file = this._file;
                }
                if (this._sourceRoot != null) {
                  map.sourceRoot = this._sourceRoot;
                }
                if (this._sourcesContents) {
                  map.sourcesContent = this._generateSourcesContent(
                    map.sources,
                    map.sourceRoot
                  );
                }
                return map;
              };
            SourceMapGenerator.prototype.toString =
              function SourceMapGenerator_toString() {
                return JSON.stringify(this);
              };
            exports.SourceMapGenerator = SourceMapGenerator;
          });
        },
        {
          "./array-set": 115,
          "./base64-vlq": 116,
          "./util": 122,
          amdefine: 123,
        },
      ],
      121: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            var SourceMapGenerator =
              require("./source-map-generator").SourceMapGenerator;
            var util = require("./util");
            var REGEX_NEWLINE = /(\r?\n)/;
            var REGEX_CHARACTER = /\r\n|[\s\S]/g;
            function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
              this.children = [];
              this.sourceContents = {};
              this.line = aLine == null ? null : aLine;
              this.column = aColumn == null ? null : aColumn;
              this.source = aSource == null ? null : aSource;
              this.name = aName == null ? null : aName;
              if (aChunks != null) this.add(aChunks);
            }
            SourceNode.fromStringWithSourceMap =
              function SourceNode_fromStringWithSourceMap(
                aGeneratedCode,
                aSourceMapConsumer,
                aRelativePath
              ) {
                var node = new SourceNode();
                var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
                var shiftNextLine = function () {
                  var lineContents = remainingLines.shift();
                  var newLine = remainingLines.shift() || "";
                  return lineContents + newLine;
                };
                var lastGeneratedLine = 1,
                  lastGeneratedColumn = 0;
                var lastMapping = null;
                aSourceMapConsumer.eachMapping(function (mapping) {
                  if (lastMapping !== null) {
                    if (lastGeneratedLine < mapping.generatedLine) {
                      var code = "";
                      addMappingWithCode(lastMapping, shiftNextLine());
                      lastGeneratedLine++;
                      lastGeneratedColumn = 0;
                    } else {
                      var nextLine = remainingLines[0];
                      var code = nextLine.substr(
                        0,
                        mapping.generatedColumn - lastGeneratedColumn
                      );
                      remainingLines[0] = nextLine.substr(
                        mapping.generatedColumn - lastGeneratedColumn
                      );
                      lastGeneratedColumn = mapping.generatedColumn;
                      addMappingWithCode(lastMapping, code);
                      lastMapping = mapping;
                      return;
                    }
                  }
                  while (lastGeneratedLine < mapping.generatedLine) {
                    node.add(shiftNextLine());
                    lastGeneratedLine++;
                  }
                  if (lastGeneratedColumn < mapping.generatedColumn) {
                    var nextLine = remainingLines[0];
                    node.add(nextLine.substr(0, mapping.generatedColumn));
                    remainingLines[0] = nextLine.substr(
                      mapping.generatedColumn
                    );
                    lastGeneratedColumn = mapping.generatedColumn;
                  }
                  lastMapping = mapping;
                }, this);
                if (remainingLines.length > 0) {
                  if (lastMapping) {
                    addMappingWithCode(lastMapping, shiftNextLine());
                  }
                  node.add(remainingLines.join(""));
                }
                aSourceMapConsumer.sources.forEach(function (sourceFile) {
                  var content = aSourceMapConsumer.sourceContentFor(sourceFile);
                  if (content != null) {
                    if (aRelativePath != null) {
                      sourceFile = util.join(aRelativePath, sourceFile);
                    }
                    node.setSourceContent(sourceFile, content);
                  }
                });
                return node;
                function addMappingWithCode(mapping, code) {
                  if (mapping === null || mapping.source === undefined) {
                    node.add(code);
                  } else {
                    var source = aRelativePath
                      ? util.join(aRelativePath, mapping.source)
                      : mapping.source;
                    node.add(
                      new SourceNode(
                        mapping.originalLine,
                        mapping.originalColumn,
                        source,
                        code,
                        mapping.name
                      )
                    );
                  }
                }
              };
            SourceNode.prototype.add = function SourceNode_add(aChunk) {
              if (Array.isArray(aChunk)) {
                aChunk.forEach(function (chunk) {
                  this.add(chunk);
                }, this);
              } else if (
                aChunk instanceof SourceNode ||
                typeof aChunk === "string"
              ) {
                if (aChunk) {
                  this.children.push(aChunk);
                }
              } else {
                throw new TypeError(
                  "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
                    aChunk
                );
              }
              return this;
            };
            SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
              if (Array.isArray(aChunk)) {
                for (var i = aChunk.length - 1; i >= 0; i--) {
                  this.prepend(aChunk[i]);
                }
              } else if (
                aChunk instanceof SourceNode ||
                typeof aChunk === "string"
              ) {
                this.children.unshift(aChunk);
              } else {
                throw new TypeError(
                  "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " +
                    aChunk
                );
              }
              return this;
            };
            SourceNode.prototype.walk = function SourceNode_walk(aFn) {
              var chunk;
              for (var i = 0, len = this.children.length; i < len; i++) {
                chunk = this.children[i];
                if (chunk instanceof SourceNode) {
                  chunk.walk(aFn);
                } else {
                  if (chunk !== "") {
                    aFn(chunk, {
                      source: this.source,
                      line: this.line,
                      column: this.column,
                      name: this.name,
                    });
                  }
                }
              }
            };
            SourceNode.prototype.join = function SourceNode_join(aSep) {
              var newChildren;
              var i;
              var len = this.children.length;
              if (len > 0) {
                newChildren = [];
                for (i = 0; i < len - 1; i++) {
                  newChildren.push(this.children[i]);
                  newChildren.push(aSep);
                }
                newChildren.push(this.children[i]);
                this.children = newChildren;
              }
              return this;
            };
            SourceNode.prototype.replaceRight =
              function SourceNode_replaceRight(aPattern, aReplacement) {
                var lastChild = this.children[this.children.length - 1];
                if (lastChild instanceof SourceNode) {
                  lastChild.replaceRight(aPattern, aReplacement);
                } else if (typeof lastChild === "string") {
                  this.children[this.children.length - 1] = lastChild.replace(
                    aPattern,
                    aReplacement
                  );
                } else {
                  this.children.push("".replace(aPattern, aReplacement));
                }
                return this;
              };
            SourceNode.prototype.setSourceContent =
              function SourceNode_setSourceContent(
                aSourceFile,
                aSourceContent
              ) {
                this.sourceContents[util.toSetString(aSourceFile)] =
                  aSourceContent;
              };
            SourceNode.prototype.walkSourceContents =
              function SourceNode_walkSourceContents(aFn) {
                for (var i = 0, len = this.children.length; i < len; i++) {
                  if (this.children[i] instanceof SourceNode) {
                    this.children[i].walkSourceContents(aFn);
                  }
                }
                var sources = Object.keys(this.sourceContents);
                for (var i = 0, len = sources.length; i < len; i++) {
                  aFn(
                    util.fromSetString(sources[i]),
                    this.sourceContents[sources[i]]
                  );
                }
              };
            SourceNode.prototype.toString = function SourceNode_toString() {
              var str = "";
              this.walk(function (chunk) {
                str += chunk;
              });
              return str;
            };
            SourceNode.prototype.toStringWithSourceMap =
              function SourceNode_toStringWithSourceMap(aArgs) {
                var generated = { code: "", line: 1, column: 0 };
                var map = new SourceMapGenerator(aArgs);
                var sourceMappingActive = false;
                var lastOriginalSource = null;
                var lastOriginalLine = null;
                var lastOriginalColumn = null;
                var lastOriginalName = null;
                this.walk(function (chunk, original) {
                  generated.code += chunk;
                  if (
                    original.source !== null &&
                    original.line !== null &&
                    original.column !== null
                  ) {
                    if (
                      lastOriginalSource !== original.source ||
                      lastOriginalLine !== original.line ||
                      lastOriginalColumn !== original.column ||
                      lastOriginalName !== original.name
                    ) {
                      map.addMapping({
                        source: original.source,
                        original: {
                          line: original.line,
                          column: original.column,
                        },
                        generated: {
                          line: generated.line,
                          column: generated.column,
                        },
                        name: original.name,
                      });
                    }
                    lastOriginalSource = original.source;
                    lastOriginalLine = original.line;
                    lastOriginalColumn = original.column;
                    lastOriginalName = original.name;
                    sourceMappingActive = true;
                  } else if (sourceMappingActive) {
                    map.addMapping({
                      generated: {
                        line: generated.line,
                        column: generated.column,
                      },
                    });
                    lastOriginalSource = null;
                    sourceMappingActive = false;
                  }
                  chunk
                    .match(REGEX_CHARACTER)
                    .forEach(function (ch, idx, array) {
                      if (REGEX_NEWLINE.test(ch)) {
                        generated.line++;
                        generated.column = 0;
                        if (idx + 1 === array.length) {
                          lastOriginalSource = null;
                          sourceMappingActive = false;
                        } else if (sourceMappingActive) {
                          map.addMapping({
                            source: original.source,
                            original: {
                              line: original.line,
                              column: original.column,
                            },
                            generated: {
                              line: generated.line,
                              column: generated.column,
                            },
                            name: original.name,
                          });
                        }
                      } else {
                        generated.column += ch.length;
                      }
                    });
                });
                this.walkSourceContents(function (sourceFile, sourceContent) {
                  map.setSourceContent(sourceFile, sourceContent);
                });
                return { code: generated.code, map: map };
              };
            exports.SourceNode = SourceNode;
          });
        },
        { "./source-map-generator": 120, "./util": 122, amdefine: 123 },
      ],
      122: [
        function (require, module, exports) {
          if (typeof define !== "function") {
            var define = require("amdefine")(module, require);
          }
          define(function (require, exports, module) {
            function getArg(aArgs, aName, aDefaultValue) {
              if (aName in aArgs) {
                return aArgs[aName];
              } else if (arguments.length === 3) {
                return aDefaultValue;
              } else {
                throw new Error('"' + aName + '" is a required argument.');
              }
            }
            exports.getArg = getArg;
            var urlRegexp =
              /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
            var dataUrlRegexp = /^data:.+\,.+$/;
            function urlParse(aUrl) {
              var match = aUrl.match(urlRegexp);
              if (!match) {
                return null;
              }
              return {
                scheme: match[1],
                auth: match[2],
                host: match[3],
                port: match[4],
                path: match[5],
              };
            }
            exports.urlParse = urlParse;
            function urlGenerate(aParsedUrl) {
              var url = "";
              if (aParsedUrl.scheme) {
                url += aParsedUrl.scheme + ":";
              }
              url += "//";
              if (aParsedUrl.auth) {
                url += aParsedUrl.auth + "@";
              }
              if (aParsedUrl.host) {
                url += aParsedUrl.host;
              }
              if (aParsedUrl.port) {
                url += ":" + aParsedUrl.port;
              }
              if (aParsedUrl.path) {
                url += aParsedUrl.path;
              }
              return url;
            }
            exports.urlGenerate = urlGenerate;
            function normalize(aPath) {
              var path = aPath;
              var url = urlParse(aPath);
              if (url) {
                if (!url.path) {
                  return aPath;
                }
                path = url.path;
              }
              var isAbsolute = path.charAt(0) === "/";
              var parts = path.split(/\/+/);
              for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
                part = parts[i];
                if (part === ".") {
                  parts.splice(i, 1);
                } else if (part === "..") {
                  up++;
                } else if (up > 0) {
                  if (part === "") {
                    parts.splice(i + 1, up);
                    up = 0;
                  } else {
                    parts.splice(i, 2);
                    up--;
                  }
                }
              }
              path = parts.join("/");
              if (path === "") {
                path = isAbsolute ? "/" : ".";
              }
              if (url) {
                url.path = path;
                return urlGenerate(url);
              }
              return path;
            }
            exports.normalize = normalize;
            function join(aRoot, aPath) {
              if (aRoot === "") {
                aRoot = ".";
              }
              if (aPath === "") {
                aPath = ".";
              }
              var aPathUrl = urlParse(aPath);
              var aRootUrl = urlParse(aRoot);
              if (aRootUrl) {
                aRoot = aRootUrl.path || "/";
              }
              if (aPathUrl && !aPathUrl.scheme) {
                if (aRootUrl) {
                  aPathUrl.scheme = aRootUrl.scheme;
                }
                return urlGenerate(aPathUrl);
              }
              if (aPathUrl || aPath.match(dataUrlRegexp)) {
                return aPath;
              }
              if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
                aRootUrl.host = aPath;
                return urlGenerate(aRootUrl);
              }
              var joined =
                aPath.charAt(0) === "/"
                  ? aPath
                  : normalize(aRoot.replace(/\/+$/, "") + "/" + aPath);
              if (aRootUrl) {
                aRootUrl.path = joined;
                return urlGenerate(aRootUrl);
              }
              return joined;
            }
            exports.join = join;
            function relative(aRoot, aPath) {
              if (aRoot === "") {
                aRoot = ".";
              }
              aRoot = aRoot.replace(/\/$/, "");
              var url = urlParse(aRoot);
              if (aPath.charAt(0) == "/" && url && url.path == "/") {
                return aPath.slice(1);
              }
              return aPath.indexOf(aRoot + "/") === 0
                ? aPath.substr(aRoot.length + 1)
                : aPath;
            }
            exports.relative = relative;
            function toSetString(aStr) {
              return "$" + aStr;
            }
            exports.toSetString = toSetString;
            function fromSetString(aStr) {
              return aStr.substr(1);
            }
            exports.fromSetString = fromSetString;
            function strcmp(aStr1, aStr2) {
              var s1 = aStr1 || "";
              var s2 = aStr2 || "";
              return (s1 > s2) - (s1 < s2);
            }
            function compareByOriginalPositions(
              mappingA,
              mappingB,
              onlyCompareOriginal
            ) {
              var cmp;
              cmp = strcmp(mappingA.source, mappingB.source);
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.originalLine - mappingB.originalLine;
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.originalColumn - mappingB.originalColumn;
              if (cmp || onlyCompareOriginal) {
                return cmp;
              }
              cmp = strcmp(mappingA.name, mappingB.name);
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.generatedLine - mappingB.generatedLine;
              if (cmp) {
                return cmp;
              }
              return mappingA.generatedColumn - mappingB.generatedColumn;
            }
            exports.compareByOriginalPositions = compareByOriginalPositions;
            function compareByGeneratedPositions(
              mappingA,
              mappingB,
              onlyCompareGenerated
            ) {
              var cmp;
              cmp = mappingA.generatedLine - mappingB.generatedLine;
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.generatedColumn - mappingB.generatedColumn;
              if (cmp || onlyCompareGenerated) {
                return cmp;
              }
              cmp = strcmp(mappingA.source, mappingB.source);
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.originalLine - mappingB.originalLine;
              if (cmp) {
                return cmp;
              }
              cmp = mappingA.originalColumn - mappingB.originalColumn;
              if (cmp) {
                return cmp;
              }
              return strcmp(mappingA.name, mappingB.name);
            }
            exports.compareByGeneratedPositions = compareByGeneratedPositions;
          });
        },
        { amdefine: 123 },
      ],
      123: [
        function (require, module, exports) {
          (function (process, __filename) {
            "use strict";
            function amdefine(module, requireFn) {
              "use strict";
              var defineCache = {},
                loaderCache = {},
                alreadyCalled = false,
                path = require("path"),
                makeRequire,
                stringRequire;
              function trimDots(ary) {
                var i, part;
                for (i = 0; ary[i]; i += 1) {
                  part = ary[i];
                  if (part === ".") {
                    ary.splice(i, 1);
                    i -= 1;
                  } else if (part === "..") {
                    if (i === 1 && (ary[2] === ".." || ary[0] === "..")) {
                      break;
                    } else if (i > 0) {
                      ary.splice(i - 1, 2);
                      i -= 2;
                    }
                  }
                }
              }
              function normalize(name, baseName) {
                var baseParts;
                if (name && name.charAt(0) === ".") {
                  if (baseName) {
                    baseParts = baseName.split("/");
                    baseParts = baseParts.slice(0, baseParts.length - 1);
                    baseParts = baseParts.concat(name.split("/"));
                    trimDots(baseParts);
                    name = baseParts.join("/");
                  }
                }
                return name;
              }
              function makeNormalize(relName) {
                return function (name) {
                  return normalize(name, relName);
                };
              }
              function makeLoad(id) {
                function load(value) {
                  loaderCache[id] = value;
                }
                load.fromText = function (id, text) {
                  throw new Error("amdefine does not implement load.fromText");
                };
                return load;
              }
              makeRequire = function (systemRequire, exports, module, relId) {
                function amdRequire(deps, callback) {
                  if (typeof deps === "string") {
                    return stringRequire(
                      systemRequire,
                      exports,
                      module,
                      deps,
                      relId
                    );
                  } else {
                    deps = deps.map(function (depName) {
                      return stringRequire(
                        systemRequire,
                        exports,
                        module,
                        depName,
                        relId
                      );
                    });
                    process.nextTick(function () {
                      callback.apply(null, deps);
                    });
                  }
                }
                amdRequire.toUrl = function (filePath) {
                  if (filePath.indexOf(".") === 0) {
                    return normalize(filePath, path.dirname(module.filename));
                  } else {
                    return filePath;
                  }
                };
                return amdRequire;
              };
              requireFn =
                requireFn ||
                function req() {
                  return module.require.apply(module, arguments);
                };
              function runFactory(id, deps, factory) {
                var r, e, m, result;
                if (id) {
                  e = loaderCache[id] = {};
                  m = { id: id, uri: __filename, exports: e };
                  r = makeRequire(requireFn, e, m, id);
                } else {
                  if (alreadyCalled) {
                    throw new Error(
                      "amdefine with no module ID cannot be called more than once per file."
                    );
                  }
                  alreadyCalled = true;
                  e = module.exports;
                  m = module;
                  r = makeRequire(requireFn, e, m, module.id);
                }
                if (deps) {
                  deps = deps.map(function (depName) {
                    return r(depName);
                  });
                }
                if (typeof factory === "function") {
                  result = factory.apply(m.exports, deps);
                } else {
                  result = factory;
                }
                if (result !== undefined) {
                  m.exports = result;
                  if (id) {
                    loaderCache[id] = m.exports;
                  }
                }
              }
              stringRequire = function (
                systemRequire,
                exports,
                module,
                id,
                relId
              ) {
                var index = id.indexOf("!"),
                  originalId = id,
                  prefix,
                  plugin;
                if (index === -1) {
                  id = normalize(id, relId);
                  if (id === "require") {
                    return makeRequire(systemRequire, exports, module, relId);
                  } else if (id === "exports") {
                    return exports;
                  } else if (id === "module") {
                    return module;
                  } else if (loaderCache.hasOwnProperty(id)) {
                    return loaderCache[id];
                  } else if (defineCache[id]) {
                    runFactory.apply(null, defineCache[id]);
                    return loaderCache[id];
                  } else {
                    if (systemRequire) {
                      return systemRequire(originalId);
                    } else {
                      throw new Error("No module with ID: " + id);
                    }
                  }
                } else {
                  prefix = id.substring(0, index);
                  id = id.substring(index + 1, id.length);
                  plugin = stringRequire(
                    systemRequire,
                    exports,
                    module,
                    prefix,
                    relId
                  );
                  if (plugin.normalize) {
                    id = plugin.normalize(id, makeNormalize(relId));
                  } else {
                    id = normalize(id, relId);
                  }
                  if (loaderCache[id]) {
                    return loaderCache[id];
                  } else {
                    plugin.load(
                      id,
                      makeRequire(systemRequire, exports, module, relId),
                      makeLoad(id),
                      {}
                    );
                    return loaderCache[id];
                  }
                }
              };
              function define(id, deps, factory) {
                if (Array.isArray(id)) {
                  factory = deps;
                  deps = id;
                  id = undefined;
                } else if (typeof id !== "string") {
                  factory = id;
                  id = deps = undefined;
                }
                if (deps && !Array.isArray(deps)) {
                  factory = deps;
                  deps = undefined;
                }
                if (!deps) {
                  deps = ["require", "exports", "module"];
                }
                if (id) {
                  defineCache[id] = [id, deps, factory];
                } else {
                  runFactory(id, deps, factory);
                }
              }
              define.require = function (id) {
                if (loaderCache[id]) {
                  return loaderCache[id];
                }
                if (defineCache[id]) {
                  runFactory.apply(null, defineCache[id]);
                  return loaderCache[id];
                }
              };
              define.amd = {};
              return define;
            }
            module.exports = amdefine;
          }.call(
            this,
            require("_process"),
            "/node_modules/source-map/node_modules/amdefine/amdefine.js"
          ));
        },
        { _process: 84, path: 83 },
      ],
      124: [
        function (require, module, exports) {
          module.exports = {
            "apply-constructor": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ParenthesizedExpression",
                    expression: {
                      type: "FunctionExpression",
                      id: null,
                      params: [
                        { type: "Identifier", name: "Constructor" },
                        { type: "Identifier", name: "args" },
                      ],
                      defaults: [],
                      rest: null,
                      generator: false,
                      async: false,
                      body: {
                        type: "BlockStatement",
                        body: [
                          {
                            type: "VariableDeclaration",
                            declarations: [
                              {
                                type: "VariableDeclarator",
                                id: { type: "Identifier", name: "bindArgs" },
                                init: {
                                  type: "CallExpression",
                                  callee: {
                                    type: "MemberExpression",
                                    object: {
                                      type: "ArrayExpression",
                                      elements: [
                                        { type: "Literal", value: null },
                                      ],
                                    },
                                    property: {
                                      type: "Identifier",
                                      name: "concat",
                                    },
                                    computed: false,
                                  },
                                  arguments: [
                                    { type: "Identifier", name: "args" },
                                  ],
                                },
                              },
                            ],
                            kind: "var",
                          },
                          {
                            type: "VariableDeclaration",
                            declarations: [
                              {
                                type: "VariableDeclarator",
                                id: { type: "Identifier", name: "Factory" },
                                init: {
                                  type: "CallExpression",
                                  callee: {
                                    type: "MemberExpression",
                                    object: {
                                      type: "MemberExpression",
                                      object: {
                                        type: "Identifier",
                                        name: "Constructor",
                                      },
                                      property: {
                                        type: "Identifier",
                                        name: "bind",
                                      },
                                      computed: false,
                                    },
                                    property: {
                                      type: "Identifier",
                                      name: "apply",
                                    },
                                    computed: false,
                                  },
                                  arguments: [
                                    { type: "Identifier", name: "Constructor" },
                                    { type: "Identifier", name: "bindArgs" },
                                  ],
                                },
                              },
                            ],
                            kind: "var",
                          },
                          {
                            type: "ReturnStatement",
                            argument: {
                              type: "NewExpression",
                              callee: { type: "Identifier", name: "Factory" },
                              arguments: [],
                            },
                          },
                        ],
                      },
                      expression: false,
                    },
                  },
                },
              ],
            },
            "arguments-slice-assign-arg": {
              type: "Program",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "VARIABLE_NAME" },
                      init: {
                        type: "CallExpression",
                        callee: {
                          type: "MemberExpression",
                          object: { type: "Identifier", name: "SLICE_KEY" },
                          property: { type: "Identifier", name: "call" },
                          computed: false,
                        },
                        arguments: [
                          { type: "Identifier", name: "arguments" },
                          { type: "Identifier", name: "SLICE_ARG" },
                        ],
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
            "arguments-slice-assign": {
              type: "Program",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "VARIABLE_NAME" },
                      init: {
                        type: "CallExpression",
                        callee: {
                          type: "MemberExpression",
                          object: { type: "Identifier", name: "SLICE_KEY" },
                          property: { type: "Identifier", name: "call" },
                          computed: false,
                        },
                        arguments: [{ type: "Identifier", name: "arguments" }],
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
            "arguments-slice": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "SLICE_KEY" },
                      property: { type: "Identifier", name: "call" },
                      computed: false,
                    },
                    arguments: [{ type: "Identifier", name: "arguments" }],
                  },
                },
              ],
            },
            "array-comprehension-container": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "ParenthesizedExpression",
                      expression: {
                        type: "FunctionExpression",
                        id: null,
                        params: [],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "VariableDeclaration",
                              declarations: [
                                {
                                  type: "VariableDeclarator",
                                  id: { type: "Identifier", name: "KEY" },
                                  init: {
                                    type: "ArrayExpression",
                                    elements: [],
                                  },
                                },
                              ],
                              kind: "var",
                            },
                            {
                              type: "ReturnStatement",
                              argument: { type: "Identifier", name: "KEY" },
                            },
                          ],
                        },
                        expression: false,
                      },
                    },
                    arguments: [],
                  },
                },
              ],
            },
            "array-comprehension-for-each": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "ARRAY" },
                      property: { type: "Identifier", name: "forEach" },
                      computed: false,
                    },
                    arguments: [
                      {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "KEY" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: { type: "BlockStatement", body: [] },
                        expression: false,
                      },
                    ],
                  },
                },
              ],
            },
            "array-expression-comprehension-filter": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: {
                        type: "CallExpression",
                        callee: {
                          type: "MemberExpression",
                          object: { type: "Identifier", name: "ARRAY" },
                          property: { type: "Identifier", name: "filter" },
                          computed: false,
                        },
                        arguments: [
                          {
                            type: "FunctionExpression",
                            id: null,
                            params: [{ type: "Identifier", name: "KEY" }],
                            defaults: [],
                            rest: null,
                            generator: false,
                            async: false,
                            body: {
                              type: "BlockStatement",
                              body: [
                                {
                                  type: "ReturnStatement",
                                  argument: {
                                    type: "Identifier",
                                    name: "FILTER",
                                  },
                                },
                              ],
                            },
                            expression: false,
                          },
                        ],
                      },
                      property: { type: "Identifier", name: "map" },
                      computed: false,
                    },
                    arguments: [
                      {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "KEY" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "ReturnStatement",
                              argument: {
                                type: "Identifier",
                                name: "STATEMENT",
                              },
                            },
                          ],
                        },
                        expression: false,
                      },
                    ],
                  },
                },
              ],
            },
            "array-expression-comprehension-map": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "ARRAY" },
                      property: { type: "Identifier", name: "map" },
                      computed: false,
                    },
                    arguments: [
                      {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "KEY" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "ReturnStatement",
                              argument: {
                                type: "Identifier",
                                name: "STATEMENT",
                              },
                            },
                          ],
                        },
                        expression: false,
                      },
                    ],
                  },
                },
              ],
            },
            "array-push": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "KEY" },
                      property: { type: "Identifier", name: "push" },
                      computed: false,
                    },
                    arguments: [{ type: "Identifier", name: "STATEMENT" }],
                  },
                },
              ],
            },
            call: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "OBJECT" },
                      property: { type: "Identifier", name: "call" },
                      computed: false,
                    },
                    arguments: [{ type: "Identifier", name: "CONTEXT" }],
                  },
                },
              ],
            },
            "class-props": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ParenthesizedExpression",
                    expression: {
                      type: "FunctionExpression",
                      id: null,
                      params: [
                        { type: "Identifier", name: "child" },
                        { type: "Identifier", name: "staticProps" },
                        { type: "Identifier", name: "instanceProps" },
                      ],
                      defaults: [],
                      rest: null,
                      generator: false,
                      async: false,
                      body: {
                        type: "BlockStatement",
                        body: [
                          {
                            type: "IfStatement",
                            test: { type: "Identifier", name: "staticProps" },
                            consequent: {
                              type: "ExpressionStatement",
                              expression: {
                                type: "CallExpression",
                                callee: {
                                  type: "MemberExpression",
                                  object: {
                                    type: "Identifier",
                                    name: "Object",
                                  },
                                  property: {
                                    type: "Identifier",
                                    name: "defineProperties",
                                  },
                                  computed: false,
                                },
                                arguments: [
                                  { type: "Identifier", name: "child" },
                                  { type: "Identifier", name: "staticProps" },
                                ],
                              },
                            },
                            alternate: null,
                          },
                          {
                            type: "IfStatement",
                            test: { type: "Identifier", name: "instanceProps" },
                            consequent: {
                              type: "ExpressionStatement",
                              expression: {
                                type: "CallExpression",
                                callee: {
                                  type: "MemberExpression",
                                  object: {
                                    type: "Identifier",
                                    name: "Object",
                                  },
                                  property: {
                                    type: "Identifier",
                                    name: "defineProperties",
                                  },
                                  computed: false,
                                },
                                arguments: [
                                  {
                                    type: "MemberExpression",
                                    object: {
                                      type: "Identifier",
                                      name: "child",
                                    },
                                    property: {
                                      type: "Identifier",
                                      name: "prototype",
                                    },
                                    computed: false,
                                  },
                                  { type: "Identifier", name: "instanceProps" },
                                ],
                              },
                            },
                            alternate: null,
                          },
                        ],
                      },
                      expression: false,
                    },
                  },
                },
              ],
            },
            "class-super-constructor-call": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "SUPER_NAME" },
                      property: { type: "Identifier", name: "apply" },
                      computed: false,
                    },
                    arguments: [
                      { type: "ThisExpression" },
                      { type: "Identifier", name: "arguments" },
                    ],
                  },
                },
              ],
            },
            class: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "ParenthesizedExpression",
                      expression: {
                        type: "FunctionExpression",
                        id: null,
                        params: [],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "VariableDeclaration",
                              declarations: [
                                {
                                  type: "VariableDeclarator",
                                  id: {
                                    type: "Identifier",
                                    name: "CLASS_NAME",
                                  },
                                  init: {
                                    type: "FunctionExpression",
                                    id: null,
                                    params: [],
                                    defaults: [],
                                    rest: null,
                                    generator: false,
                                    async: false,
                                    body: { type: "BlockStatement", body: [] },
                                    expression: false,
                                  },
                                },
                              ],
                              kind: "var",
                            },
                            {
                              type: "ReturnStatement",
                              argument: {
                                type: "Identifier",
                                name: "CLASS_NAME",
                              },
                            },
                          ],
                        },
                        expression: false,
                      },
                    },
                    arguments: [],
                  },
                },
              ],
            },
            "exports-assign-key": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "exports" },
                      property: { type: "Identifier", name: "VARIABLE_NAME" },
                      computed: false,
                    },
                    right: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "OBJECT" },
                      property: { type: "Identifier", name: "KEY" },
                      computed: false,
                    },
                  },
                },
              ],
            },
            "exports-assign": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "exports" },
                      property: { type: "Identifier", name: "KEY" },
                      computed: false,
                    },
                    right: { type: "Identifier", name: "VALUE" },
                  },
                },
              ],
            },
            "exports-default": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "AssignmentExpression",
                    operator: "=",
                    left: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "exports" },
                      property: { type: "Identifier", name: "default" },
                      computed: false,
                    },
                    right: { type: "Identifier", name: "VALUE" },
                  },
                },
              ],
            },
            "exports-wildcard": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "ParenthesizedExpression",
                      expression: {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "obj" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "ForInStatement",
                              left: {
                                type: "VariableDeclaration",
                                declarations: [
                                  {
                                    type: "VariableDeclarator",
                                    id: { type: "Identifier", name: "i" },
                                    init: null,
                                  },
                                ],
                                kind: "var",
                              },
                              right: { type: "Identifier", name: "obj" },
                              body: {
                                type: "BlockStatement",
                                body: [
                                  {
                                    type: "ExpressionStatement",
                                    expression: {
                                      type: "AssignmentExpression",
                                      operator: "=",
                                      left: {
                                        type: "MemberExpression",
                                        object: {
                                          type: "Identifier",
                                          name: "exports",
                                        },
                                        property: {
                                          type: "Identifier",
                                          name: "i",
                                        },
                                        computed: true,
                                      },
                                      right: {
                                        type: "MemberExpression",
                                        object: {
                                          type: "Identifier",
                                          name: "obj",
                                        },
                                        property: {
                                          type: "Identifier",
                                          name: "i",
                                        },
                                        computed: true,
                                      },
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                        expression: false,
                      },
                    },
                    arguments: [{ type: "Identifier", name: "OBJECT" }],
                  },
                },
              ],
            },
            extends: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ParenthesizedExpression",
                    expression: {
                      type: "FunctionExpression",
                      id: null,
                      params: [
                        { type: "Identifier", name: "child" },
                        { type: "Identifier", name: "parent" },
                      ],
                      defaults: [],
                      rest: null,
                      generator: false,
                      async: false,
                      body: {
                        type: "BlockStatement",
                        body: [
                          {
                            type: "ExpressionStatement",
                            expression: {
                              type: "AssignmentExpression",
                              operator: "=",
                              left: {
                                type: "MemberExpression",
                                object: { type: "Identifier", name: "child" },
                                property: {
                                  type: "Identifier",
                                  name: "prototype",
                                },
                                computed: false,
                              },
                              right: {
                                type: "CallExpression",
                                callee: {
                                  type: "MemberExpression",
                                  object: {
                                    type: "Identifier",
                                    name: "Object",
                                  },
                                  property: {
                                    type: "Identifier",
                                    name: "create",
                                  },
                                  computed: false,
                                },
                                arguments: [
                                  {
                                    type: "MemberExpression",
                                    object: {
                                      type: "Identifier",
                                      name: "parent",
                                    },
                                    property: {
                                      type: "Identifier",
                                      name: "prototype",
                                    },
                                    computed: false,
                                  },
                                  {
                                    type: "ObjectExpression",
                                    properties: [
                                      {
                                        type: "Property",
                                        method: false,
                                        shorthand: false,
                                        computed: false,
                                        key: {
                                          type: "Identifier",
                                          name: "constructor",
                                        },
                                        value: {
                                          type: "ObjectExpression",
                                          properties: [
                                            {
                                              type: "Property",
                                              method: false,
                                              shorthand: false,
                                              computed: false,
                                              key: {
                                                type: "Identifier",
                                                name: "value",
                                              },
                                              value: {
                                                type: "Identifier",
                                                name: "child",
                                              },
                                              kind: "init",
                                            },
                                            {
                                              type: "Property",
                                              method: false,
                                              shorthand: false,
                                              computed: false,
                                              key: {
                                                type: "Identifier",
                                                name: "enumerable",
                                              },
                                              value: {
                                                type: "Literal",
                                                value: false,
                                              },
                                              kind: "init",
                                            },
                                            {
                                              type: "Property",
                                              method: false,
                                              shorthand: false,
                                              computed: false,
                                              key: {
                                                type: "Identifier",
                                                name: "writable",
                                              },
                                              value: {
                                                type: "Literal",
                                                value: true,
                                              },
                                              kind: "init",
                                            },
                                            {
                                              type: "Property",
                                              method: false,
                                              shorthand: false,
                                              computed: false,
                                              key: {
                                                type: "Identifier",
                                                name: "configurable",
                                              },
                                              value: {
                                                type: "Literal",
                                                value: true,
                                              },
                                              kind: "init",
                                            },
                                          ],
                                        },
                                        kind: "init",
                                      },
                                    ],
                                  },
                                ],
                              },
                            },
                          },
                          {
                            type: "ExpressionStatement",
                            expression: {
                              type: "AssignmentExpression",
                              operator: "=",
                              left: {
                                type: "MemberExpression",
                                object: { type: "Identifier", name: "child" },
                                property: {
                                  type: "Identifier",
                                  name: "__proto__",
                                },
                                computed: false,
                              },
                              right: { type: "Identifier", name: "parent" },
                            },
                          },
                        ],
                      },
                      expression: false,
                    },
                  },
                },
              ],
            },
            "for-of": {
              type: "Program",
              body: [
                {
                  type: "ForStatement",
                  init: {
                    type: "VariableDeclaration",
                    declarations: [
                      {
                        type: "VariableDeclarator",
                        id: { type: "Identifier", name: "ITERATOR_KEY" },
                        init: {
                          type: "CallExpression",
                          callee: {
                            type: "MemberExpression",
                            object: { type: "Identifier", name: "OBJECT" },
                            property: {
                              type: "MemberExpression",
                              object: { type: "Identifier", name: "Symbol" },
                              property: {
                                type: "Identifier",
                                name: "iterator",
                              },
                              computed: false,
                            },
                            computed: true,
                          },
                          arguments: [],
                        },
                      },
                      {
                        type: "VariableDeclarator",
                        id: { type: "Identifier", name: "STEP_KEY" },
                        init: null,
                      },
                    ],
                    kind: "var",
                  },
                  test: {
                    type: "UnaryExpression",
                    operator: "!",
                    prefix: true,
                    argument: {
                      type: "MemberExpression",
                      object: {
                        type: "ParenthesizedExpression",
                        expression: {
                          type: "AssignmentExpression",
                          operator: "=",
                          left: { type: "Identifier", name: "STEP_KEY" },
                          right: {
                            type: "CallExpression",
                            callee: {
                              type: "MemberExpression",
                              object: {
                                type: "Identifier",
                                name: "ITERATOR_KEY",
                              },
                              property: { type: "Identifier", name: "next" },
                              computed: false,
                            },
                            arguments: [],
                          },
                        },
                      },
                      property: { type: "Identifier", name: "done" },
                      computed: false,
                    },
                  },
                  update: null,
                  body: { type: "BlockStatement", body: [] },
                },
              ],
            },
            "function-return-obj": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "ParenthesizedExpression",
                      expression: {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "KEY" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "ReturnStatement",
                              argument: { type: "Identifier", name: "KEY" },
                            },
                          ],
                        },
                        expression: false,
                      },
                    },
                    arguments: [{ type: "Identifier", name: "OBJECT" }],
                  },
                },
              ],
            },
            "if-undefined-set-to": {
              type: "Program",
              body: [
                {
                  type: "IfStatement",
                  test: {
                    type: "BinaryExpression",
                    left: { type: "Identifier", name: "VARIABLE" },
                    operator: "===",
                    right: { type: "Identifier", name: "undefined" },
                  },
                  consequent: {
                    type: "ExpressionStatement",
                    expression: {
                      type: "AssignmentExpression",
                      operator: "=",
                      left: { type: "Identifier", name: "VARIABLE" },
                      right: { type: "Identifier", name: "DEFAULT" },
                    },
                  },
                  alternate: null,
                },
              ],
            },
            "let-scoping-return": {
              type: "Program",
              body: [
                {
                  type: "IfStatement",
                  test: {
                    type: "BinaryExpression",
                    left: {
                      type: "UnaryExpression",
                      operator: "typeof",
                      prefix: true,
                      argument: { type: "Identifier", name: "RETURN" },
                    },
                    operator: "===",
                    right: { type: "Literal", value: "object" },
                  },
                  consequent: {
                    type: "ReturnStatement",
                    argument: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "RETURN" },
                      property: { type: "Identifier", name: "v" },
                      computed: false,
                    },
                  },
                  alternate: null,
                },
              ],
            },
            "object-define-properties-closure": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "ParenthesizedExpression",
                      expression: {
                        type: "FunctionExpression",
                        id: null,
                        params: [{ type: "Identifier", name: "KEY" }],
                        defaults: [],
                        rest: null,
                        generator: false,
                        async: false,
                        body: {
                          type: "BlockStatement",
                          body: [
                            {
                              type: "ExpressionStatement",
                              expression: {
                                type: "Identifier",
                                name: "CONTENT",
                              },
                            },
                            {
                              type: "ReturnStatement",
                              argument: { type: "Identifier", name: "KEY" },
                            },
                          ],
                        },
                        expression: false,
                      },
                    },
                    arguments: [{ type: "Identifier", name: "OBJECT" }],
                  },
                },
              ],
            },
            "object-define-properties": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "Object" },
                      property: {
                        type: "Identifier",
                        name: "defineProperties",
                      },
                      computed: false,
                    },
                    arguments: [
                      { type: "Identifier", name: "OBJECT" },
                      { type: "Identifier", name: "PROPS" },
                    ],
                  },
                },
              ],
            },
            "prototype-identifier": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "MemberExpression",
                    object: { type: "Identifier", name: "CLASS_NAME" },
                    property: { type: "Identifier", name: "prototype" },
                    computed: false,
                  },
                },
              ],
            },
            "require-assign-key": {
              type: "Program",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "VARIABLE_NAME" },
                      init: {
                        type: "MemberExpression",
                        object: {
                          type: "CallExpression",
                          callee: { type: "Identifier", name: "require" },
                          arguments: [
                            { type: "Identifier", name: "MODULE_NAME" },
                          ],
                        },
                        property: { type: "Identifier", name: "KEY" },
                        computed: false,
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
            "require-assign": {
              type: "Program",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "VARIABLE_NAME" },
                      init: {
                        type: "CallExpression",
                        callee: { type: "Identifier", name: "require" },
                        arguments: [
                          { type: "Identifier", name: "MODULE_NAME" },
                        ],
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
            require: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "CallExpression",
                    callee: { type: "Identifier", name: "require" },
                    arguments: [{ type: "Identifier", name: "MODULE_NAME" }],
                  },
                },
              ],
            },
            "self-global": {
              type: "Program",
              body: [
                {
                  type: "VariableDeclaration",
                  declarations: [
                    {
                      type: "VariableDeclarator",
                      id: { type: "Identifier", name: "self" },
                      init: {
                        type: "ConditionalExpression",
                        test: {
                          type: "BinaryExpression",
                          left: {
                            type: "UnaryExpression",
                            operator: "typeof",
                            prefix: true,
                            argument: { type: "Identifier", name: "global" },
                          },
                          operator: "===",
                          right: { type: "Literal", value: "undefined" },
                        },
                        consequent: { type: "Identifier", name: "window" },
                        alternate: { type: "Identifier", name: "global" },
                      },
                    },
                  ],
                  kind: "var",
                },
              ],
            },
            slice: {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "MemberExpression",
                    object: {
                      type: "MemberExpression",
                      object: { type: "Identifier", name: "Array" },
                      property: { type: "Identifier", name: "prototype" },
                      computed: false,
                    },
                    property: { type: "Identifier", name: "slice" },
                    computed: false,
                  },
                },
              ],
            },
            "tagged-template-literal": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ParenthesizedExpression",
                    expression: {
                      type: "FunctionExpression",
                      id: null,
                      params: [
                        { type: "Identifier", name: "strings" },
                        { type: "Identifier", name: "raw" },
                      ],
                      defaults: [],
                      rest: null,
                      generator: false,
                      async: false,
                      body: {
                        type: "BlockStatement",
                        body: [
                          {
                            type: "ReturnStatement",
                            argument: {
                              type: "CallExpression",
                              callee: {
                                type: "MemberExpression",
                                object: { type: "Identifier", name: "Object" },
                                property: {
                                  type: "Identifier",
                                  name: "defineProperties",
                                },
                                computed: false,
                              },
                              arguments: [
                                { type: "Identifier", name: "strings" },
                                {
                                  type: "ObjectExpression",
                                  properties: [
                                    {
                                      type: "Property",
                                      method: false,
                                      shorthand: false,
                                      computed: false,
                                      key: { type: "Identifier", name: "raw" },
                                      value: {
                                        type: "ObjectExpression",
                                        properties: [
                                          {
                                            type: "Property",
                                            method: false,
                                            shorthand: false,
                                            computed: false,
                                            key: {
                                              type: "Identifier",
                                              name: "value",
                                            },
                                            value: {
                                              type: "Identifier",
                                              name: "raw",
                                            },
                                            kind: "init",
                                          },
                                        ],
                                      },
                                      kind: "init",
                                    },
                                  ],
                                },
                              ],
                            },
                          },
                        ],
                      },
                      expression: false,
                    },
                  },
                },
              ],
            },
            "umd-runner-body": {
              type: "Program",
              body: [
                {
                  type: "ExpressionStatement",
                  expression: {
                    type: "ParenthesizedExpression",
                    expression: {
                      type: "FunctionExpression",
                      id: null,
                      params: [{ type: "Identifier", name: "factory" }],
                      defaults: [],
                      rest: null,
                      generator: false,
                      async: false,
                      body: {
                        type: "BlockStatement",
                        body: [
                          {
                            type: "IfStatement",
                            test: {
                              type: "LogicalExpression",
                              left: {
                                type: "BinaryExpression",
                                left: {
                                  type: "UnaryExpression",
                                  operator: "typeof",
                                  prefix: true,
                                  argument: {
                                    type: "Identifier",
                                    name: "define",
                                  },
                                },
                                operator: "===",
                                right: { type: "Literal", value: "function" },
                              },
                              operator: "&&",
                              right: {
                                type: "MemberExpression",
                                object: { type: "Identifier", name: "define" },
                                property: { type: "Identifier", name: "amd" },
                                computed: false,
                              },
                            },
                            consequent: {
                              type: "BlockStatement",
                              body: [
                                {
                                  type: "ExpressionStatement",
                                  expression: {
                                    type: "CallExpression",
                                    callee: {
                                      type: "Identifier",
                                      name: "define",
                                    },
                                    arguments: [
                                      {
                                        type: "Identifier",
                                        name: "AMD_ARGUMENTS",
                                      },
                                      { type: "Identifier", name: "factory" },
                                    ],
                                  },
                                },
                              ],
                            },
                            alternate: {
                              type: "IfStatement",
                              test: {
                                type: "BinaryExpression",
                                left: {
                                  type: "UnaryExpression",
                                  operator: "typeof",
                                  prefix: true,
                                  argument: {
                                    type: "Identifier",
                                    name: "exports",
                                  },
                                },
                                operator: "!==",
                                right: { type: "Literal", value: "undefined" },
                              },
                              consequent: {
                                type: "BlockStatement",
                                body: [
                                  {
                                    type: "ExpressionStatement",
                                    expression: {
                                      type: "CallExpression",
                                      callee: {
                                        type: "Identifier",
                                        name: "factory",
                                      },
                                      arguments: [
                                        { type: "Identifier", name: "exports" },
                                        {
                                          type: "Identifier",
                                          name: "COMMON_ARGUMENTS",
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                              alternate: null,
                            },
                          },
                        ],
                      },
                      expression: false,
                    },
                  },
                },
              ],
            },
          };
        },
        {},
      ],
    },
    {},
    [2]
  )(2);
});
