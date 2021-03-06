ace.define(
  "ace/mode/logiql",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/logiql_highlight_rules",
    "ace/mode/folding/coffee",
    "ace/token_iterator",
    "ace/range",
    "ace/mode/behaviour/cstyle",
    "ace/mode/matching_brace_outdent",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./logiql_highlight_rules").LogiQLHighlightRules,
      u = e("./folding/coffee").FoldMode,
      a = e("../token_iterator").TokenIterator,
      f = e("../range").Range,
      l = e("./behaviour/cstyle").CstyleBehaviour,
      c = e("./matching_brace_outdent").MatchingBraceOutdent,
      h = function () {
        (this.HighlightRules = o),
          (this.foldingRules = new u()),
          (this.$outdent = new c()),
          (this.$behaviour = new l());
      };
    r.inherits(h, i),
      function () {
        (this.lineCommentStart = "//"),
          (this.blockComment = { start: "/*", end: "*/" }),
          (this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t),
              i = this.getTokenizer().getLineTokens(t, e),
              s = i.tokens,
              o = i.state;
            if (/comment|string/.test(o)) return r;
            if (s.length && s[s.length - 1].type == "comment.single") return r;
            var u = t.match();
            return /(-->|<--|<-|->|{)\s*$/.test(t) && (r += n), r;
          }),
          (this.checkOutdent = function (e, t, n) {
            return this.$outdent.checkOutdent(t, n)
              ? !0
              : n !== "\n" && n !== "\r\n"
              ? !1
              : /^\s+/.test(t)
              ? !0
              : !1;
          }),
          (this.autoOutdent = function (e, t, n) {
            if (this.$outdent.autoOutdent(t, n)) return;
            var r = t.getLine(n),
              i = r.match(/^\s+/),
              s = r.lastIndexOf(".") + 1;
            if (!i || !n || !s) return 0;
            var o = t.getLine(n + 1),
              u = this.getMatching(t, { row: n, column: s });
            if (!u || u.start.row == n) return 0;
            s = i[0].length;
            var a = this.$getIndent(t.getLine(u.start.row));
            t.replace(new f(n + 1, 0, n + 1, s), a);
          }),
          (this.getMatching = function (e, t, n) {
            t == undefined && (t = e.selection.lead),
              typeof t == "object" && ((n = t.column), (t = t.row));
            var r = e.getTokenAt(t, n),
              i = "keyword.start",
              s = "keyword.end",
              o;
            if (!r) return;
            if (r.type == i) {
              var u = new a(e, t, n);
              u.step = u.stepForward;
            } else {
              if (r.type != s) return;
              var u = new a(e, t, n);
              u.step = u.stepBackward;
            }
            while ((o = u.step())) if (o.type == i || o.type == s) break;
            if (!o || o.type == r.type) return;
            var l = u.getCurrentTokenColumn(),
              t = u.getCurrentTokenRow();
            return new f(t, l, t, l + o.value.length);
          });
      }.call(h.prototype),
      (t.Mode = h);
  }
),
  ace.define(
    "ace/mode/logiql_highlight_rules",
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
          (this.$rules = {
            start: [
              {
                token: "comment.block",
                regex: "/\\*",
                push: [
                  { token: "comment.block", regex: "\\*/", next: "pop" },
                  { defaultToken: "comment.block" },
                ],
              },
              { token: "comment.single", regex: "//.*" },
              {
                token: "constant.numeric",
                regex: "\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?[fd]?",
              },
              {
                token: "string",
                regex: '"',
                push: [
                  { token: "string", regex: '"', next: "pop" },
                  { defaultToken: "string" },
                ],
              },
              { token: "constant.language", regex: "\\b(true|false)\\b" },
              {
                token: "entity.name.type.logicblox",
                regex: "`[a-zA-Z_:]+(\\d|\\a)*\\b",
              },
              { token: "keyword.start", regex: "->", comment: "Constraint" },
              {
                token: "keyword.start",
                regex: "-->",
                comment: "Level 1 Constraint",
              },
              { token: "keyword.start", regex: "<-", comment: "Rule" },
              { token: "keyword.start", regex: "<--", comment: "Level 1 Rule" },
              { token: "keyword.end", regex: "\\.", comment: "Terminator" },
              { token: "keyword.other", regex: "!", comment: "Negation" },
              { token: "keyword.other", regex: ",", comment: "Conjunction" },
              { token: "keyword.other", regex: ";", comment: "Disjunction" },
              {
                token: "keyword.operator",
                regex: "<=|>=|!=|<|>",
                comment: "Equality",
              },
              { token: "keyword.other", regex: "@", comment: "Equality" },
              {
                token: "keyword.operator",
                regex: "\\+|-|\\*|/",
                comment: "Arithmetic operations",
              },
              { token: "keyword", regex: "::", comment: "Colon colon" },
              {
                token: "support.function",
                regex: "\\b(agg\\s*<<)",
                push: [
                  { include: "$self" },
                  { token: "support.function", regex: ">>", next: "pop" },
                ],
              },
              { token: "storage.modifier", regex: "\\b(lang:[\\w:]*)" },
              {
                token: ["storage.type", "text"],
                regex: "(export|sealed|clauses|block|alias)(\\s*\\()(?=`)",
              },
              {
                token: "entity.name",
                regex:
                  "[a-zA-Z_][a-zA-Z_0-9:]*(@prev|@init|@final)?(?=(\\(|\\[))",
              },
              {
                token: "variable.parameter",
                regex:
                  "([a-zA-Z][a-zA-Z_0-9]*|_)\\s*(?=(,|\\.|<-|->|\\)|\\]|=))",
              },
            ],
          }),
            this.normalizeRules();
        };
      r.inherits(s, i), (t.LogiQLHighlightRules = s);
    }
  ),
  ace.define(
    "ace/mode/folding/coffee",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (e, t, n) {
      var r = e("../../lib/oop"),
        i = e("./fold_mode").FoldMode,
        s = e("../../range").Range,
        o = (t.FoldMode = function () {});
      r.inherits(o, i),
        function () {
          (this.getFoldWidgetRange = function (e, t, n) {
            var r = this.indentationBlock(e, n);
            if (r) return r;
            var i = /\S/,
              o = e.getLine(n),
              u = o.search(i);
            if (u == -1 || o[u] != "#") return;
            var a = o.length,
              f = e.getLength(),
              l = n,
              c = n;
            while (++n < f) {
              o = e.getLine(n);
              var h = o.search(i);
              if (h == -1) continue;
              if (o[h] != "#") break;
              c = n;
            }
            if (c > l) {
              var p = e.getLine(c).length;
              return new s(l, a, c, p);
            }
          }),
            (this.getFoldWidget = function (e, t, n) {
              var r = e.getLine(n),
                i = r.search(/\S/),
                s = e.getLine(n + 1),
                o = e.getLine(n - 1),
                u = o.search(/\S/),
                a = s.search(/\S/);
              if (i == -1)
                return (
                  (e.foldWidgets[n - 1] = u != -1 && u < a ? "start" : ""), ""
                );
              if (u == -1) {
                if (i == a && r[i] == "#" && s[i] == "#")
                  return (
                    (e.foldWidgets[n - 1] = ""),
                    (e.foldWidgets[n + 1] = ""),
                    "start"
                  );
              } else if (
                u == i &&
                r[i] == "#" &&
                o[i] == "#" &&
                e.getLine(n - 2).search(/\S/) == -1
              )
                return (
                  (e.foldWidgets[n - 1] = "start"),
                  (e.foldWidgets[n + 1] = ""),
                  ""
                );
              return (
                u != -1 && u < i
                  ? (e.foldWidgets[n - 1] = "start")
                  : (e.foldWidgets[n - 1] = ""),
                i < a ? "start" : ""
              );
            });
        }.call(o.prototype);
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
  );
