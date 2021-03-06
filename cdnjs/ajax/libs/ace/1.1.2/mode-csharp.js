ace.define(
  "ace/mode/csharp",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/csharp_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/behaviour/cstyle",
    "ace/mode/folding/csharp",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./csharp_highlight_rules").CSharpHighlightRules,
      u = e("./matching_brace_outdent").MatchingBraceOutdent,
      a = e("./behaviour/cstyle").CstyleBehaviour,
      f = e("./folding/csharp").FoldMode,
      l = function () {
        (this.HighlightRules = o),
          (this.$outdent = new u()),
          (this.$behaviour = new a()),
          (this.foldingRules = new f());
      };
    r.inherits(l, i),
      function () {
        (this.lineCommentStart = "//"),
          (this.blockComment = { start: "/*", end: "*/" }),
          (this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t),
              i = this.getTokenizer().getLineTokens(t, e),
              s = i.tokens;
            if (s.length && s[s.length - 1].type == "comment") return r;
            if (e == "start") {
              var o = t.match(/^.*[\{\(\[]\s*$/);
              o && (r += n);
            }
            return r;
          }),
          (this.checkOutdent = function (e, t, n) {
            return this.$outdent.checkOutdent(t, n);
          }),
          (this.autoOutdent = function (e, t, n) {
            this.$outdent.autoOutdent(t, n);
          }),
          (this.createWorker = function (e) {
            return null;
          });
      }.call(l.prototype),
      (t.Mode = l);
  }
),
  ace.define(
    "ace/mode/csharp_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        s = e("./text_highlight_rules").TextHighlightRules,
        o = function () {
          var e = this.createKeywordMapper(
            {
              "variable.language": "this",
              keyword:
                "abstract|event|new|struct|as|explicit|null|switch|base|extern|object|this|bool|false|operator|throw|break|finally|out|true|byte|fixed|override|try|case|float|params|typeof|catch|for|private|uint|char|foreach|protected|ulong|checked|goto|public|unchecked|class|if|readonly|unsafe|const|implicit|ref|ushort|continue|in|return|using|decimal|int|sbyte|virtual|default|interface|sealed|volatile|delegate|internal|short|void|do|is|sizeof|while|double|lock|stackalloc|else|long|static|enum|namespace|string|var|dynamic",
              "constant.language": "null|true|false",
            },
            "identifier"
          );
          (this.$rules = {
            start: [
              { token: "comment", regex: "\\/\\/.*$" },
              i.getStartRule("doc-start"),
              { token: "comment", regex: "\\/\\*", next: "comment" },
              {
                token: "string.regexp",
                regex:
                  "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)",
              },
              {
                token: "string",
                regex: /'(?:.|\\(:?u[\da-fA-F]+|x[\da-fA-F]+|[tbrf'"n]))'/,
              },
              {
                token: "string",
                start: '"',
                end: '"|$',
                next: [
                  {
                    token: "constant.language.escape",
                    regex: /\\(:?u[\da-fA-F]+|x[\da-fA-F]+|[tbrf'"n])/,
                  },
                  { token: "invalid", regex: /\\./ },
                ],
              },
              {
                token: "string",
                start: '@"',
                end: '"',
                next: [{ token: "constant.language.escape", regex: '""' }],
              },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: "constant.language.boolean",
                regex: "(?:true|false)\\b",
              },
              { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|instanceof|new|delete|typeof|void)",
              },
              {
                token: "keyword",
                regex:
                  "^\\s*#(if|else|elif|endif|define|undef|warning|error|line|region|endregion|pragma)",
              },
              { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\." },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: ".*?\\*\\/", next: "start" },
              { token: "comment", regex: ".+" },
            ],
          }),
            this.embedRules(i, "doc-", [i.getEndRule("start")]),
            this.normalizeRules();
        };
      r.inherits(o, s), (t.CSharpHighlightRules = o);
    }
  ),
  ace.define(
    "ace/mode/doc_comment_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = function () {
          this.$rules = {
            start: [
              { token: "comment.doc.tag", regex: "@[\\w\\d_]+" },
              { token: "comment.doc.tag", regex: "\\bTODO\\b" },
              { defaultToken: "comment.doc" },
            ],
          };
        };
      r.inherits(s, i),
        (s.getStartRule = function (e) {
          return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
        }),
        (s.getEndRule = function (e) {
          return { token: "comment.doc", regex: "\\*\\/", next: e };
        }),
        (t.DocCommentHighlightRules = s);
    }
  ),
  ace.define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      var r = e("../range").Range,
        i = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1;
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t),
              i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length,
              o = e.findMatchingBracket({ row: t, column: s });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }.call(i.prototype),
        (t.MatchingBraceOutdent = i));
    }
  ),
  ace.define(
    "ace/mode/behaviour/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/token_iterator",
      "ace/lib/lang",
    ],
    function (e, t, n) {
      var r = e("../../lib/oop"),
        i = e("../behaviour").Behaviour,
        s = e("../../token_iterator").TokenIterator,
        o = e("../../lib/lang"),
        u = ["text", "paren.rparen", "punctuation.operator"],
        a = ["text", "paren.rparen", "punctuation.operator", "comment"],
        f = 0,
        l = -1,
        c = "",
        h = 0,
        p = -1,
        d = "",
        v = "",
        m = function () {
          (m.isSaneInsertion = function (e, t) {
            var n = e.getCursorPosition(),
              r = new s(t, n.row, n.column);
            if (!this.$matchTokenType(r.getCurrentToken() || "text", u)) {
              var i = new s(t, n.row, n.column + 1);
              if (!this.$matchTokenType(i.getCurrentToken() || "text", u))
                return !1;
            }
            return (
              r.stepForward(),
              r.getCurrentTokenRow() !== n.row ||
                this.$matchTokenType(r.getCurrentToken() || "text", a)
            );
          }),
            (m.$matchTokenType = function (e, t) {
              return t.indexOf(e.type || e) > -1;
            }),
            (m.recordAutoInsert = function (e, t, n) {
              var r = e.getCursorPosition(),
                i = t.doc.getLine(r.row);
              this.isAutoInsertedClosing(r, i, c[0]) || (f = 0),
                (l = r.row),
                (c = n + i.substr(r.column)),
                f++;
            }),
            (m.recordMaybeInsert = function (e, t, n) {
              var r = e.getCursorPosition(),
                i = t.doc.getLine(r.row);
              this.isMaybeInsertedClosing(r, i) || (h = 0),
                (p = r.row),
                (d = i.substr(0, r.column) + n),
                (v = i.substr(r.column)),
                h++;
            }),
            (m.isAutoInsertedClosing = function (e, t, n) {
              return (
                f > 0 && e.row === l && n === c[0] && t.substr(e.column) === c
              );
            }),
            (m.isMaybeInsertedClosing = function (e, t) {
              return (
                h > 0 &&
                e.row === p &&
                t.substr(e.column) === v &&
                t.substr(0, e.column) == d
              );
            }),
            (m.popAutoInsertedClosing = function () {
              (c = c.substr(1)), f--;
            }),
            (m.clearMaybeInsertedClosing = function () {
              (h = 0), (p = -1);
            }),
            this.add("braces", "insertion", function (e, t, n, r, i) {
              var s = n.getCursorPosition(),
                u = r.doc.getLine(s.row);
              if (i == "{") {
                var a = n.getSelectionRange(),
                  f = r.doc.getTextRange(a);
                if (f !== "" && f !== "{" && n.getWrapBehavioursEnabled())
                  return { text: "{" + f + "}", selection: !1 };
                if (m.isSaneInsertion(n, r))
                  return /[\]\}\)]/.test(u[s.column])
                    ? (m.recordAutoInsert(n, r, "}"),
                      { text: "{}", selection: [1, 1] })
                    : (m.recordMaybeInsert(n, r, "{"),
                      { text: "{", selection: [1, 1] });
              } else if (i == "}") {
                var l = u.substring(s.column, s.column + 1);
                if (l == "}") {
                  var c = r.$findOpeningBracket("}", {
                    column: s.column + 1,
                    row: s.row,
                  });
                  if (c !== null && m.isAutoInsertedClosing(s, u, i))
                    return (
                      m.popAutoInsertedClosing(),
                      { text: "", selection: [1, 1] }
                    );
                }
              } else if (i == "\n" || i == "\r\n") {
                var p = "";
                m.isMaybeInsertedClosing(s, u) &&
                  ((p = o.stringRepeat("}", h)), m.clearMaybeInsertedClosing());
                var l = u.substring(s.column, s.column + 1);
                if (l == "}" || p !== "") {
                  var d = r.findMatchingBracket(
                    { row: s.row, column: s.column + 1 },
                    "}"
                  );
                  if (!d) return null;
                  var v = this.getNextLineIndent(
                      e,
                      u.substring(0, s.column),
                      r.getTabString()
                    ),
                    g = this.$getIndent(u);
                  return {
                    text: "\n" + v + "\n" + g + p,
                    selection: [1, v.length, 1, v.length],
                  };
                }
              }
            }),
            this.add("braces", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "{") {
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.end.column, i.end.column + 1);
                if (u == "}") return i.end.column++, i;
                h--;
              }
            }),
            this.add("parens", "insertion", function (e, t, n, r, i) {
              if (i == "(") {
                var s = n.getSelectionRange(),
                  o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())
                  return { text: "(" + o + ")", selection: !1 };
                if (m.isSaneInsertion(n, r))
                  return (
                    m.recordAutoInsert(n, r, ")"),
                    { text: "()", selection: [1, 1] }
                  );
              } else if (i == ")") {
                var u = n.getCursorPosition(),
                  a = r.doc.getLine(u.row),
                  f = a.substring(u.column, u.column + 1);
                if (f == ")") {
                  var l = r.$findOpeningBracket(")", {
                    column: u.column + 1,
                    row: u.row,
                  });
                  if (l !== null && m.isAutoInsertedClosing(u, a, i))
                    return (
                      m.popAutoInsertedClosing(),
                      { text: "", selection: [1, 1] }
                    );
                }
              }
            }),
            this.add("parens", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "(") {
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == ")") return i.end.column++, i;
              }
            }),
            this.add("brackets", "insertion", function (e, t, n, r, i) {
              if (i == "[") {
                var s = n.getSelectionRange(),
                  o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())
                  return { text: "[" + o + "]", selection: !1 };
                if (m.isSaneInsertion(n, r))
                  return (
                    m.recordAutoInsert(n, r, "]"),
                    { text: "[]", selection: [1, 1] }
                  );
              } else if (i == "]") {
                var u = n.getCursorPosition(),
                  a = r.doc.getLine(u.row),
                  f = a.substring(u.column, u.column + 1);
                if (f == "]") {
                  var l = r.$findOpeningBracket("]", {
                    column: u.column + 1,
                    row: u.row,
                  });
                  if (l !== null && m.isAutoInsertedClosing(u, a, i))
                    return (
                      m.popAutoInsertedClosing(),
                      { text: "", selection: [1, 1] }
                    );
                }
              }
            }),
            this.add("brackets", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "[") {
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == "]") return i.end.column++, i;
              }
            }),
            this.add("string_dquotes", "insertion", function (e, t, n, r, i) {
              if (i == '"' || i == "'") {
                var s = i,
                  o = n.getSelectionRange(),
                  u = r.doc.getTextRange(o);
                if (
                  u !== "" &&
                  u !== "'" &&
                  u != '"' &&
                  n.getWrapBehavioursEnabled()
                )
                  return { text: s + u + s, selection: !1 };
                var a = n.getCursorPosition(),
                  f = r.doc.getLine(a.row),
                  l = f.substring(a.column - 1, a.column);
                if (l == "\\") return null;
                var c = r.getTokens(o.start.row),
                  h = 0,
                  p,
                  d = -1;
                for (var v = 0; v < c.length; v++) {
                  (p = c[v]),
                    p.type == "string"
                      ? (d = -1)
                      : d < 0 && (d = p.value.indexOf(s));
                  if (p.value.length + h > o.start.column) break;
                  h += c[v].value.length;
                }
                if (
                  !p ||
                  (d < 0 &&
                    p.type !== "comment" &&
                    (p.type !== "string" ||
                      (o.start.column !== p.value.length + h - 1 &&
                        p.value.lastIndexOf(s) === p.value.length - 1)))
                ) {
                  if (!m.isSaneInsertion(n, r)) return;
                  return { text: s + s, selection: [1, 1] };
                }
                if (p && p.type === "string") {
                  var g = f.substring(a.column, a.column + 1);
                  if (g == s) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("string_dquotes", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && (s == '"' || s == "'")) {
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == s) return i.end.column++, i;
              }
            });
        };
      r.inherits(m, i), (t.CstyleBehaviour = m);
    }
  ),
  ace.define(
    "ace/mode/folding/csharp",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/cstyle",
    ],
    function (e, t, n) {
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./cstyle").FoldMode,
        o = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(o, s),
        function () {
          (this.usingRe = /^\s*using \S/),
            (this.getFoldWidgetRangeBase = this.getFoldWidgetRange),
            (this.getFoldWidgetBase = this.getFoldWidget),
            (this.getFoldWidget = function (e, t, n) {
              var r = this.getFoldWidgetBase(e, t, n);
              if (!r) {
                var i = e.getLine(n);
                if (/^\s*#region\b/.test(i)) return "start";
                var s = this.usingRe;
                if (s.test(i)) {
                  var o = e.getLine(n - 1),
                    u = e.getLine(n + 1);
                  if (!s.test(o) && s.test(u)) return "start";
                }
              }
              return r;
            }),
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = this.getFoldWidgetRangeBase(e, t, n);
              if (r) return r;
              var i = e.getLine(n);
              if (this.usingRe.test(i))
                return this.getUsingStatementBlock(e, i, n);
              if (/^\s*#region\b/.test(i)) return this.getRegionBlock(e, i, n);
            }),
            (this.getUsingStatementBlock = function (e, t, n) {
              var r = t.match(this.usingRe)[0].length - 1,
                s = e.getLength(),
                o = n,
                u = n;
              while (++n < s) {
                t = e.getLine(n);
                if (/^\s*$/.test(t)) continue;
                if (!this.usingRe.test(t)) break;
                u = n;
              }
              if (u > o) {
                var a = e.getLine(u).length;
                return new i(o, r, u, a);
              }
            }),
            (this.getRegionBlock = function (e, t, n) {
              var r = t.search(/\s*$/),
                s = e.getLength(),
                o = n,
                u = /^\s*#(end)?region\b/,
                a = 1;
              while (++n < s) {
                t = e.getLine(n);
                var f = u.exec(t);
                if (!f) continue;
                f[1] ? a-- : a++;
                if (!a) break;
              }
              var l = n;
              if (l > o) {
                var c = t.search(/\S/);
                return new i(o, r, l, c);
              }
            });
        }.call(o.prototype);
    }
  ),
  ace.define(
    "ace/mode/folding/cstyle",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (e, t, n) {
      var r = e("../../lib/oop"),
        i = e("../../range").Range,
        s = e("./fold_mode").FoldMode,
        o = (t.FoldMode = function (e) {
          e &&
            ((this.foldingStartMarker = new RegExp(
              this.foldingStartMarker.source.replace(/\|[^|]*?$/, "|" + e.start)
            )),
            (this.foldingStopMarker = new RegExp(
              this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + e.end)
            )));
        });
      r.inherits(o, s),
        function () {
          (this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/),
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var i = e.getLine(n),
                s = i.match(this.foldingStartMarker);
              if (s) {
                var o = s.index;
                if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return (
                  u &&
                    !u.isMultiLine() &&
                    (r
                      ? (u = this.getSectionRange(e, n))
                      : t != "all" && (u = null)),
                  u
                );
              }
              if (t === "markbegin") return;
              var s = i.match(this.foldingStopMarker);
              if (s) {
                var o = s.index + s[0].length;
                return s[1]
                  ? this.closingBracketBlock(e, s[1], n, o)
                  : e.getCommentFoldRange(n, o, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              var n = e.getLine(t),
                r = n.search(/\S/),
                s = t,
                o = n.length;
              t += 1;
              var u = t,
                a = e.getLength();
              while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1) continue;
                if (r > f) break;
                var l = this.getFoldWidgetRange(e, "all", t);
                if (l) {
                  if (l.start.row <= s) break;
                  if (l.isMultiLine()) t = l.end.row;
                  else if (r == f) break;
                }
                u = t;
              }
              return new i(s, o, u, e.getLine(u).length);
            });
        }.call(o.prototype);
    }
  );
