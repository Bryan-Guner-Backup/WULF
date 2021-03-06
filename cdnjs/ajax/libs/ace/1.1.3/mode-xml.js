ace.define(
  "ace/mode/xml",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/xml_highlight_rules",
    "ace/mode/behaviour/xml",
    "ace/mode/folding/xml",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./xml_highlight_rules").XmlHighlightRules,
      u = e("./behaviour/xml").XmlBehaviour,
      a = e("./folding/xml").FoldMode,
      f = function () {
        (this.HighlightRules = o),
          (this.$behaviour = new u()),
          (this.foldingRules = new a());
      };
    r.inherits(f, i),
      function () {
        (this.blockComment = { start: "<!--", end: "-->" }),
          (this.$id = "ace/mode/xml");
      }.call(f.prototype),
      (t.Mode = f);
  }
),
  ace.define(
    "ace/mode/xml_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/xml_util",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("./xml_util"),
        s = e("./text_highlight_rules").TextHighlightRules,
        o = function (e) {
          (this.$rules = {
            start: [
              {
                token: "punctuation.string.begin",
                regex: "<\\!\\[CDATA\\[",
                next: "cdata",
              },
              {
                token: ["punctuation.instruction.begin", "keyword.instruction"],
                regex: "(<\\?)(xml)(?=[\\s])",
                next: "xml_declaration",
              },
              {
                token: ["punctuation.instruction.begin", "keyword.instruction"],
                regex: "(<\\?)([-_a-zA-Z0-9]+)",
                next: "instruction",
              },
              { token: "comment", regex: "<\\!--", next: "comment" },
              {
                token: ["punctuation.doctype.begin", "meta.tag.doctype"],
                regex: "(<\\!)(DOCTYPE)(?=[\\s])",
                next: "doctype",
              },
              { include: "tag" },
              { include: "reference" },
            ],
            xml_declaration: [
              { include: "attributes" },
              { include: "instruction" },
            ],
            instruction: [
              {
                token: "punctuation.instruction.end",
                regex: "\\?>",
                next: "start",
              },
            ],
            doctype: [
              { include: "space" },
              { include: "string" },
              { token: "punctuation.doctype.end", regex: ">", next: "start" },
              { token: "xml-pe", regex: "[-_a-zA-Z0-9:]+" },
              {
                token: "punctuation.begin",
                regex: "\\[",
                push: "declarations",
              },
            ],
            declarations: [
              { token: "text", regex: "\\s+" },
              { token: "punctuation.end", regex: "]", next: "pop" },
              {
                token: ["punctuation.begin", "keyword"],
                regex: "(<\\!)([-_a-zA-Z0-9]+)",
                push: [
                  { token: "text", regex: "\\s+" },
                  { token: "punctuation.end", regex: ">", next: "pop" },
                  { include: "string" },
                ],
              },
            ],
            cdata: [
              { token: "string.end", regex: "\\]\\]>", next: "start" },
              { token: "text", regex: "\\s+" },
              { token: "text", regex: "(?:[^\\]]|\\](?!\\]>))+" },
            ],
            comment: [
              { token: "comment", regex: "-->", next: "start" },
              { defaultToken: "comment" },
            ],
            tag: [
              {
                token: ["meta.tag.punctuation.begin", "meta.tag.name"],
                regex: "(<)((?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+)",
                next: [
                  { include: "attributes" },
                  {
                    token: "meta.tag.punctuation.end",
                    regex: "/?>",
                    next: "start",
                  },
                ],
              },
              {
                token: ["meta.tag.punctuation.begin", "meta.tag.name"],
                regex: "(</)((?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+)",
                next: [
                  { include: "space" },
                  {
                    token: "meta.tag.punctuation.end",
                    regex: ">",
                    next: "start",
                  },
                ],
              },
            ],
            space: [{ token: "text", regex: "\\s+" }],
            reference: [
              {
                token: "constant.language.escape",
                regex:
                  "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
              },
              { token: "text", regex: "&" },
            ],
            string: [
              { token: "string", regex: "'", push: "qstring_inner" },
              { token: "string", regex: '"', push: "qqstring_inner" },
            ],
            qstring_inner: [
              { token: "string", regex: "'", next: "pop" },
              { include: "reference" },
              { defaultToken: "string" },
            ],
            qqstring_inner: [
              { token: "string", regex: '"', next: "pop" },
              { include: "reference" },
              { defaultToken: "string" },
            ],
            attributes: [
              {
                token: "entity.other.attribute-name",
                regex: "(?:[-_a-zA-Z0-9]+:)?[-_a-zA-Z0-9]+",
              },
              { token: "keyword.operator.separator", regex: "=" },
              { include: "space" },
              { include: "string" },
            ],
          }),
            this.constructor === o && this.normalizeRules();
        };
      (function () {
        this.embedTagRules = function (e, t, n) {
          this.$rules.tag.unshift({
            token: ["meta.tag.punctuation.begin", "meta.tag.name." + n],
            regex: "(<)(" + n + ")",
            next: [
              { include: "space" },
              { include: "attributes" },
              {
                token: "meta.tag.punctuation.end",
                regex: "/?>",
                next: t + "start",
              },
            ],
          }),
            (this.$rules[n + "-end"] = [
              { include: "space" },
              {
                token: "meta.tag.punctuation.end",
                regex: ">",
                next: "start",
                onMatch: function (e, t, n) {
                  return n.splice(0), this.token;
                },
              },
            ]),
            this.embedRules(e, t, [
              {
                token: ["meta.tag.punctuation.begin", "meta.tag.name." + n],
                regex: "(</)(" + n + ")",
                next: n + "-end",
              },
              { token: "string.begin", regex: "<\\!\\[CDATA\\[" },
              { token: "string.end", regex: "\\]\\]>" },
            ]);
        };
      }.call(s.prototype),
        r.inherits(o, s),
        (t.XmlHighlightRules = o));
    }
  ),
  ace.define(
    "ace/mode/xml_util",
    ["require", "exports", "module"],
    function (e, t, n) {
      function r(e) {
        return [
          { token: "string", regex: '"', next: e + "_qqstring" },
          { token: "string", regex: "'", next: e + "_qstring" },
        ];
      }
      function i(e, t) {
        return [
          { token: "string", regex: e, next: t },
          {
            token: "constant.language.escape",
            regex:
              "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
          },
          { defaultToken: "string" },
        ];
      }
      t.tag = function (e, t, n, s) {
        (e[t] = [
          { token: "text", regex: "\\s+" },
          {
            token: s
              ? function (e) {
                  return s[e]
                    ? "meta.tag.tag-name." + s[e]
                    : "meta.tag.tag-name";
                }
              : "meta.tag.tag-name",
            regex: "[-_a-zA-Z0-9:]+",
            next: t + "_embed_attribute_list",
          },
          { token: "empty", regex: "", next: t + "_embed_attribute_list" },
        ]),
          (e[t + "_qstring"] = i("'", t + "_embed_attribute_list")),
          (e[t + "_qqstring"] = i('"', t + "_embed_attribute_list")),
          (e[t + "_embed_attribute_list"] = [
            { token: "meta.tag.r", regex: "/?>", next: n },
            { token: "keyword.operator", regex: "=" },
            { token: "entity.other.attribute-name", regex: "[-_a-zA-Z0-9:]+" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: "text", regex: "\\s+" },
          ].concat(r(t)));
      };
    }
  ),
  ace.define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/mode/behaviour/cstyle",
      "ace/token_iterator",
    ],
    function (e, t, n) {
      function u(e, t) {
        var n = e.type.split(".");
        return t.split(".").every(function (e) {
          return n.indexOf(e) !== -1;
        });
      }
      var r = e("../../lib/oop"),
        i = e("../behaviour").Behaviour,
        s = e("./cstyle").CstyleBehaviour,
        o = e("../../token_iterator").TokenIterator,
        a = function () {
          this.inherit(s, ["string_dquotes"]),
            this.add("autoclosing", "insertion", function (e, t, n, r, i) {
              if (i == ">") {
                var s = n.getCursorPosition(),
                  a = new o(r, s.row, s.column),
                  f = a.getCurrentToken();
                if (
                  f &&
                  u(f, "string") &&
                  a.getCurrentTokenColumn() + f.value.length > s.column
                )
                  return;
                var l = !1;
                if (
                  !f ||
                  (!u(f, "meta.tag") && (!u(f, "text") || !f.value.match("/")))
                ) {
                  do f = a.stepBackward();
                  while (
                    f &&
                    (u(f, "string") ||
                      u(f, "keyword.operator") ||
                      u(f, "entity.attribute-name") ||
                      u(f, "text"))
                  );
                } else l = !0;
                if (
                  !f ||
                  !u(f, "meta.tag.name") ||
                  a.stepBackward().value.match("/")
                )
                  return;
                var c = f.value;
                if (l) var c = c.substring(0, s.column - f.start);
                return { text: "></" + c + ">", selection: [1, 1] };
              }
            }),
            this.add("autoindent", "insertion", function (e, t, n, r, i) {
              if (i == "\n") {
                var s = n.getCursorPosition(),
                  o = r.getLine(s.row),
                  u = o.substring(s.column, s.column + 2);
                if (u == "</") {
                  var a = this.$getIndent(o),
                    f = a + r.getTabString();
                  return {
                    text: "\n" + f + "\n" + a,
                    selection: [1, f.length, 1, f.length],
                  };
                }
              }
            });
        };
      r.inherits(a, i), (t.XmlBehaviour = a);
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
        f,
        l = {},
        c = function (e) {
          var t = -1;
          e.multiSelect &&
            ((t = e.selection.id),
            l.rangeCount != e.multiSelect.rangeCount &&
              (l = { rangeCount: e.multiSelect.rangeCount }));
          if (l[t]) return (f = l[t]);
          f = l[t] = {
            autoInsertedBrackets: 0,
            autoInsertedRow: -1,
            autoInsertedLineEnd: "",
            maybeInsertedBrackets: 0,
            maybeInsertedRow: -1,
            maybeInsertedLineStart: "",
            maybeInsertedLineEnd: "",
          };
        },
        h = function () {
          this.add("braces", "insertion", function (e, t, n, r, i) {
            var s = n.getCursorPosition(),
              u = r.doc.getLine(s.row);
            if (i == "{") {
              c(n);
              var a = n.getSelectionRange(),
                l = r.doc.getTextRange(a);
              if (l !== "" && l !== "{" && n.getWrapBehavioursEnabled())
                return { text: "{" + l + "}", selection: !1 };
              if (h.isSaneInsertion(n, r))
                return /[\]\}\)]/.test(u[s.column]) || n.inMultiSelectMode
                  ? (h.recordAutoInsert(n, r, "}"),
                    { text: "{}", selection: [1, 1] })
                  : (h.recordMaybeInsert(n, r, "{"),
                    { text: "{", selection: [1, 1] });
            } else if (i == "}") {
              c(n);
              var p = u.substring(s.column, s.column + 1);
              if (p == "}") {
                var d = r.$findOpeningBracket("}", {
                  column: s.column + 1,
                  row: s.row,
                });
                if (d !== null && h.isAutoInsertedClosing(s, u, i))
                  return (
                    h.popAutoInsertedClosing(), { text: "", selection: [1, 1] }
                  );
              }
            } else {
              if (i == "\n" || i == "\r\n") {
                c(n);
                var v = "";
                h.isMaybeInsertedClosing(s, u) &&
                  ((v = o.stringRepeat("}", f.maybeInsertedBrackets)),
                  h.clearMaybeInsertedClosing());
                var p = u.substring(s.column, s.column + 1);
                if (p === "}") {
                  var m = r.findMatchingBracket(
                    { row: s.row, column: s.column + 1 },
                    "}"
                  );
                  if (!m) return null;
                  var g = this.$getIndent(r.getLine(m.row));
                } else {
                  if (!v) {
                    h.clearMaybeInsertedClosing();
                    return;
                  }
                  var g = this.$getIndent(u);
                }
                var y = g + r.getTabString();
                return {
                  text: "\n" + y + "\n" + g + v,
                  selection: [1, y.length, 1, y.length],
                };
              }
              h.clearMaybeInsertedClosing();
            }
          }),
            this.add("braces", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "{") {
                c(n);
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.end.column, i.end.column + 1);
                if (u == "}") return i.end.column++, i;
                f.maybeInsertedBrackets--;
              }
            }),
            this.add("parens", "insertion", function (e, t, n, r, i) {
              if (i == "(") {
                c(n);
                var s = n.getSelectionRange(),
                  o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())
                  return { text: "(" + o + ")", selection: !1 };
                if (h.isSaneInsertion(n, r))
                  return (
                    h.recordAutoInsert(n, r, ")"),
                    { text: "()", selection: [1, 1] }
                  );
              } else if (i == ")") {
                c(n);
                var u = n.getCursorPosition(),
                  a = r.doc.getLine(u.row),
                  f = a.substring(u.column, u.column + 1);
                if (f == ")") {
                  var l = r.$findOpeningBracket(")", {
                    column: u.column + 1,
                    row: u.row,
                  });
                  if (l !== null && h.isAutoInsertedClosing(u, a, i))
                    return (
                      h.popAutoInsertedClosing(),
                      { text: "", selection: [1, 1] }
                    );
                }
              }
            }),
            this.add("parens", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "(") {
                c(n);
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == ")") return i.end.column++, i;
              }
            }),
            this.add("brackets", "insertion", function (e, t, n, r, i) {
              if (i == "[") {
                c(n);
                var s = n.getSelectionRange(),
                  o = r.doc.getTextRange(s);
                if (o !== "" && n.getWrapBehavioursEnabled())
                  return { text: "[" + o + "]", selection: !1 };
                if (h.isSaneInsertion(n, r))
                  return (
                    h.recordAutoInsert(n, r, "]"),
                    { text: "[]", selection: [1, 1] }
                  );
              } else if (i == "]") {
                c(n);
                var u = n.getCursorPosition(),
                  a = r.doc.getLine(u.row),
                  f = a.substring(u.column, u.column + 1);
                if (f == "]") {
                  var l = r.$findOpeningBracket("]", {
                    column: u.column + 1,
                    row: u.row,
                  });
                  if (l !== null && h.isAutoInsertedClosing(u, a, i))
                    return (
                      h.popAutoInsertedClosing(),
                      { text: "", selection: [1, 1] }
                    );
                }
              }
            }),
            this.add("brackets", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && s == "[") {
                c(n);
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == "]") return i.end.column++, i;
              }
            }),
            this.add("string_dquotes", "insertion", function (e, t, n, r, i) {
              if (i == '"' || i == "'") {
                c(n);
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
                var p = r.getTokens(o.start.row),
                  d = 0,
                  v,
                  m = -1;
                for (var g = 0; g < p.length; g++) {
                  (v = p[g]),
                    v.type == "string"
                      ? (m = -1)
                      : m < 0 && (m = v.value.indexOf(s));
                  if (v.value.length + d > o.start.column) break;
                  d += p[g].value.length;
                }
                if (
                  !v ||
                  (m < 0 &&
                    v.type !== "comment" &&
                    (v.type !== "string" ||
                      (o.start.column !== v.value.length + d - 1 &&
                        v.value.lastIndexOf(s) === v.value.length - 1)))
                ) {
                  if (!h.isSaneInsertion(n, r)) return;
                  return { text: s + s, selection: [1, 1] };
                }
                if (v && v.type === "string") {
                  var y = f.substring(a.column, a.column + 1);
                  if (y == s) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("string_dquotes", "deletion", function (e, t, n, r, i) {
              var s = r.doc.getTextRange(i);
              if (!i.isMultiLine() && (s == '"' || s == "'")) {
                c(n);
                var o = r.doc.getLine(i.start.row),
                  u = o.substring(i.start.column + 1, i.start.column + 2);
                if (u == s) return i.end.column++, i;
              }
            });
        };
      (h.isSaneInsertion = function (e, t) {
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
        (h.$matchTokenType = function (e, t) {
          return t.indexOf(e.type || e) > -1;
        }),
        (h.recordAutoInsert = function (e, t, n) {
          var r = e.getCursorPosition(),
            i = t.doc.getLine(r.row);
          this.isAutoInsertedClosing(r, i, f.autoInsertedLineEnd[0]) ||
            (f.autoInsertedBrackets = 0),
            (f.autoInsertedRow = r.row),
            (f.autoInsertedLineEnd = n + i.substr(r.column)),
            f.autoInsertedBrackets++;
        }),
        (h.recordMaybeInsert = function (e, t, n) {
          var r = e.getCursorPosition(),
            i = t.doc.getLine(r.row);
          this.isMaybeInsertedClosing(r, i) || (f.maybeInsertedBrackets = 0),
            (f.maybeInsertedRow = r.row),
            (f.maybeInsertedLineStart = i.substr(0, r.column) + n),
            (f.maybeInsertedLineEnd = i.substr(r.column)),
            f.maybeInsertedBrackets++;
        }),
        (h.isAutoInsertedClosing = function (e, t, n) {
          return (
            f.autoInsertedBrackets > 0 &&
            e.row === f.autoInsertedRow &&
            n === f.autoInsertedLineEnd[0] &&
            t.substr(e.column) === f.autoInsertedLineEnd
          );
        }),
        (h.isMaybeInsertedClosing = function (e, t) {
          return (
            f.maybeInsertedBrackets > 0 &&
            e.row === f.maybeInsertedRow &&
            t.substr(e.column) === f.maybeInsertedLineEnd &&
            t.substr(0, e.column) == f.maybeInsertedLineStart
          );
        }),
        (h.popAutoInsertedClosing = function () {
          (f.autoInsertedLineEnd = f.autoInsertedLineEnd.substr(1)),
            f.autoInsertedBrackets--;
        }),
        (h.clearMaybeInsertedClosing = function () {
          f && ((f.maybeInsertedBrackets = 0), (f.maybeInsertedRow = -1));
        }),
        r.inherits(h, i),
        (t.CstyleBehaviour = h);
    }
  ),
  ace.define(
    "ace/mode/folding/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/range",
      "ace/mode/folding/fold_mode",
      "ace/token_iterator",
    ],
    function (e, t, n) {
      var r = e("../../lib/oop"),
        i = e("../../lib/lang"),
        s = e("../../range").Range,
        o = e("./fold_mode").FoldMode,
        u = e("../../token_iterator").TokenIterator,
        a = (t.FoldMode = function (e) {
          o.call(this), (this.voidElements = e || {});
        });
      r.inherits(a, o),
        function () {
          (this.getFoldWidget = function (e, t, n) {
            var r = this._getFirstTagInLine(e, n);
            return r.closing
              ? t == "markbeginend"
                ? "end"
                : ""
              : !r.tagName || this.voidElements[r.tagName.toLowerCase()]
              ? ""
              : r.selfClosing
              ? ""
              : r.value.indexOf("/" + r.tagName) !== -1
              ? ""
              : "start";
          }),
            (this._getFirstTagInLine = function (e, t) {
              var n = e.getTokens(t),
                r = "";
              for (var s = 0; s < n.length; s++) {
                var o = n[s];
                o.type.lastIndexOf("meta.tag", 0) === 0
                  ? (r += o.value)
                  : (r += i.stringRepeat(" ", o.value.length));
              }
              return this._parseTag(r);
            }),
            (this.tagRe = /^(\s*)(<?(\/?)([-_a-zA-Z0-9:!]*)\s*(\/?)>?)/),
            (this._parseTag = function (e) {
              var t = e.match(this.tagRe),
                n = 0;
              return {
                value: e,
                match: t ? t[2] : "",
                closing: t ? !!t[3] : !1,
                selfClosing: t ? !!t[5] || t[2] == "/>" : !1,
                tagName: t ? t[4] : "",
                column: t[1] ? n + t[1].length : n,
              };
            }),
            (this._readTagForward = function (e) {
              var t = e.getCurrentToken();
              if (!t) return null;
              var n = "",
                r;
              do
                if (t.type.lastIndexOf("meta.tag", 0) === 0) {
                  if (!r)
                    var r = {
                      row: e.getCurrentTokenRow(),
                      column: e.getCurrentTokenColumn(),
                    };
                  n += t.value;
                  if (n.indexOf(">") !== -1) {
                    var i = this._parseTag(n);
                    return (
                      (i.start = r),
                      (i.end = {
                        row: e.getCurrentTokenRow(),
                        column: e.getCurrentTokenColumn() + t.value.length,
                      }),
                      e.stepForward(),
                      i
                    );
                  }
                }
              while ((t = e.stepForward()));
              return null;
            }),
            (this._readTagBackward = function (e) {
              var t = e.getCurrentToken();
              if (!t) return null;
              var n = "",
                r;
              do
                if (t.type.lastIndexOf("meta.tag", 0) === 0) {
                  r ||
                    (r = {
                      row: e.getCurrentTokenRow(),
                      column: e.getCurrentTokenColumn() + t.value.length,
                    }),
                    (n = t.value + n);
                  if (n.indexOf("<") !== -1) {
                    var i = this._parseTag(n);
                    return (
                      (i.end = r),
                      (i.start = {
                        row: e.getCurrentTokenRow(),
                        column: e.getCurrentTokenColumn(),
                      }),
                      e.stepBackward(),
                      i
                    );
                  }
                }
              while ((t = e.stepBackward()));
              return null;
            }),
            (this._pop = function (e, t) {
              while (e.length) {
                var n = e[e.length - 1];
                if (!t || n.tagName == t.tagName) return e.pop();
                if (this.voidElements[t.tagName]) return;
                if (this.voidElements[n.tagName]) {
                  e.pop();
                  continue;
                }
                return null;
              }
            }),
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = this._getFirstTagInLine(e, n);
              if (!r.match) return null;
              var i = r.closing || r.selfClosing,
                o = [],
                a;
              if (!i) {
                var f = new u(e, n, r.column),
                  l = { row: n, column: r.column + r.tagName.length + 2 };
                while ((a = this._readTagForward(f))) {
                  if (a.selfClosing) {
                    if (!o.length)
                      return (
                        (a.start.column += a.tagName.length + 2),
                        (a.end.column -= 2),
                        s.fromPoints(a.start, a.end)
                      );
                    continue;
                  }
                  if (a.closing) {
                    this._pop(o, a);
                    if (o.length == 0) return s.fromPoints(l, a.start);
                  } else o.push(a);
                }
              } else {
                var f = new u(e, n, r.column + r.match.length),
                  c = { row: n, column: r.column };
                while ((a = this._readTagBackward(f))) {
                  if (a.selfClosing) {
                    if (!o.length)
                      return (
                        (a.start.column += a.tagName.length + 2),
                        (a.end.column -= 2),
                        s.fromPoints(a.start, a.end)
                      );
                    continue;
                  }
                  if (!a.closing) {
                    this._pop(o, a);
                    if (o.length == 0)
                      return (
                        (a.start.column += a.tagName.length + 2),
                        s.fromPoints(a.start, c)
                      );
                  } else o.push(a);
                }
              }
            });
        }.call(a.prototype);
    }
  );
