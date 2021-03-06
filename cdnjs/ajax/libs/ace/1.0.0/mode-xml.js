define(
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
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./xml_highlight_rules").XmlHighlightRules,
      h = a("./behaviour/xml").XmlBehaviour,
      i = a("./folding/xml").FoldMode,
      j = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$behaviour = new h()),
          (this.foldingRules = new i());
      };
    d.inherits(j, e),
      function () {
        this.getNextLineIndent = function (a, b, c) {
          return this.$getIndent(b);
        };
      }.call(j.prototype),
      (b.Mode = j);
  }
),
  define(
    "ace/mode/xml_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/xml_util",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./xml_util"),
        f = a("./text_highlight_rules").TextHighlightRules,
        g = function () {
          (this.$rules = {
            start: [
              { token: "text", regex: "<\\!\\[CDATA\\[", next: "cdata" },
              { token: "xml_pe", regex: "<\\?.*?\\?>" },
              { token: "comment", merge: !0, regex: "<\\!--", next: "comment" },
              { token: "xml_pe", regex: "<\\!.*?>" },
              { token: "meta.tag", regex: "<\\/?", next: "tag" },
              { token: "text", regex: "\\s+" },
              {
                token: "constant.character.entity",
                regex:
                  "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
              },
              { token: "text", regex: "[^<]+" },
            ],
            cdata: [
              { token: "text", regex: "\\]\\]>", next: "start" },
              { token: "text", regex: "\\s+" },
              { token: "text", regex: "(?:[^\\]]|\\](?!\\]>))+" },
            ],
            comment: [
              { token: "comment", regex: ".*?-->", next: "start" },
              { token: "comment", merge: !0, regex: ".+" },
            ],
          }),
            e.tag(this.$rules, "tag", "start");
        };
      d.inherits(g, f), (b.XmlHighlightRules = g);
    }
  ),
  define(
    "ace/mode/xml_util",
    ["require", "exports", "module"],
    function (a, b, c) {
      function d(a) {
        return [
          { token: "string", regex: '".*?"' },
          { token: "string", merge: !0, regex: '["].*', next: a + "_qqstring" },
          { token: "string", regex: "'.*?'" },
          { token: "string", merge: !0, regex: "['].*", next: a + "_qstring" },
        ];
      }
      function e(a, b) {
        return [
          { token: "string", merge: !0, regex: ".*?" + a, next: b },
          { token: "string", merge: !0, regex: ".+" },
        ];
      }
      b.tag = function (a, b, c, f) {
        (a[b] = [
          { token: "text", regex: "\\s+" },
          {
            token: f
              ? function (a) {
                  return f[a]
                    ? "meta.tag.tag-name." + f[a]
                    : "meta.tag.tag-name";
                }
              : "meta.tag.tag-name",
            merge: !0,
            regex: "[-_a-zA-Z0-9:]+",
            next: b + "_embed_attribute_list",
          },
          { token: "empty", regex: "", next: b + "_embed_attribute_list" },
        ]),
          (a[b + "_qstring"] = e("'", b + "_embed_attribute_list")),
          (a[b + "_qqstring"] = e('"', b + "_embed_attribute_list")),
          (a[b + "_embed_attribute_list"] = [
            { token: "meta.tag", merge: !0, regex: "/?>", next: c },
            { token: "keyword.operator", regex: "=" },
            { token: "entity.other.attribute-name", regex: "[-_a-zA-Z0-9:]+" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: "text", regex: "\\s+" },
          ].concat(d(b)));
      };
    }
  ),
  define(
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
    function (a, b, c) {
      function h(a, b) {
        var c = !0,
          d = a.type.split("."),
          e = b.split(".");
        return (
          e.forEach(function (a) {
            if (d.indexOf(a) == -1) return (c = !1), !1;
          }),
          c
        );
      }
      var d = a("../../lib/oop"),
        e = a("../behaviour").Behaviour,
        f = a("./cstyle").CstyleBehaviour,
        g = a("../../token_iterator").TokenIterator,
        i = function () {
          this.inherit(f, ["string_dquotes"]),
            this.add("autoclosing", "insertion", function (a, b, c, d, e) {
              if (e == ">") {
                var f = c.getCursorPosition(),
                  i = new g(d, f.row, f.column),
                  j = i.getCurrentToken(),
                  k = !1;
                if (
                  !j ||
                  (!h(j, "meta.tag") && (!h(j, "text") || !j.value.match("/")))
                ) {
                  do j = i.stepBackward();
                  while (
                    j &&
                    (h(j, "string") ||
                      h(j, "keyword.operator") ||
                      h(j, "entity.attribute-name") ||
                      h(j, "text"))
                  );
                } else k = !0;
                if (
                  !j ||
                  !h(j, "meta.tag-name") ||
                  i.stepBackward().value.match("/")
                )
                  return;
                var l = j.value;
                if (k) var l = l.substring(0, f.column - j.start);
                return { text: "></" + l + ">", selection: [1, 1] };
              }
            }),
            this.add("autoindent", "insertion", function (a, b, c, d, e) {
              if (e == "\n") {
                var f = c.getCursorPosition(),
                  g = d.doc.getLine(f.row),
                  h = g.substring(f.column, f.column + 2);
                if (h == "</") {
                  var i =
                      this.$getIndent(d.doc.getLine(f.row)) + d.getTabString(),
                    j = this.$getIndent(d.doc.getLine(f.row));
                  return {
                    text: "\n" + i + "\n" + j,
                    selection: [1, i.length, 1, i.length],
                  };
                }
              }
            });
        };
      d.inherits(i, e), (b.XmlBehaviour = i);
    }
  ),
  define(
    "ace/mode/behaviour/cstyle",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour"],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../behaviour").Behaviour,
        f = function () {
          this.add("braces", "insertion", function (a, b, c, d, e) {
            if (e == "{") {
              var f = c.getSelectionRange(),
                g = d.doc.getTextRange(f);
              return g !== ""
                ? { text: "{" + g + "}", selection: !1 }
                : { text: "{}", selection: [1, 1] };
            }
            if (e == "}") {
              var h = c.getCursorPosition(),
                i = d.doc.getLine(h.row),
                j = i.substring(h.column, h.column + 1);
              if (j == "}") {
                var k = d.$findOpeningBracket("}", {
                  column: h.column + 1,
                  row: h.row,
                });
                if (k !== null) return { text: "", selection: [1, 1] };
              }
            } else if (e == "\n") {
              var h = c.getCursorPosition(),
                i = d.doc.getLine(h.row),
                j = i.substring(h.column, h.column + 1);
              if (j == "}") {
                var l = d.findMatchingBracket({
                  row: h.row,
                  column: h.column + 1,
                });
                if (!l) return null;
                var m = this.getNextLineIndent(
                    a,
                    i.substring(0, i.length - 1),
                    d.getTabString()
                  ),
                  n = this.$getIndent(d.doc.getLine(l.row));
                return {
                  text: "\n" + m + "\n" + n,
                  selection: [1, m.length, 1, m.length],
                };
              }
            }
          }),
            this.add("braces", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "{") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.end.column, e.end.column + 1);
                if (h == "}") return e.end.column++, e;
              }
            }),
            this.add("parens", "insertion", function (a, b, c, d, e) {
              if (e == "(") {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                return g !== ""
                  ? { text: "(" + g + ")", selection: !1 }
                  : { text: "()", selection: [1, 1] };
              }
              if (e == ")") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column, h.column + 1);
                if (j == ")") {
                  var k = d.$findOpeningBracket(")", {
                    column: h.column + 1,
                    row: h.row,
                  });
                  if (k !== null) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("parens", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "(") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == ")") return e.end.column++, e;
              }
            }),
            this.add("brackets", "insertion", function (a, b, c, d, e) {
              if (e == "[") {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                return g !== ""
                  ? { text: "[" + g + "]", selection: !1 }
                  : { text: "[]", selection: [1, 1] };
              }
              if (e == "]") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column, h.column + 1);
                if (j == "]") {
                  var k = d.$findOpeningBracket("]", {
                    column: h.column + 1,
                    row: h.row,
                  });
                  if (k !== null) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("brackets", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "[") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == "]") return e.end.column++, e;
              }
            }),
            this.add("string_dquotes", "insertion", function (a, b, c, d, e) {
              if (e == '"' || e == "'") {
                var f = e,
                  g = c.getSelectionRange(),
                  h = d.doc.getTextRange(g);
                if (h !== "") return { text: f + h + f, selection: !1 };
                var i = c.getCursorPosition(),
                  j = d.doc.getLine(i.row),
                  k = j.substring(i.column - 1, i.column);
                if (k == "\\") return null;
                var l = d.getTokens(g.start.row),
                  m = 0,
                  n,
                  o = -1;
                for (var p = 0; p < l.length; p++) {
                  (n = l[p]),
                    n.type == "string"
                      ? (o = -1)
                      : o < 0 && (o = n.value.indexOf(f));
                  if (n.value.length + m > g.start.column) break;
                  m += l[p].value.length;
                }
                if (
                  !n ||
                  (o < 0 &&
                    n.type !== "comment" &&
                    (n.type !== "string" ||
                      (g.start.column !== n.value.length + m - 1 &&
                        n.value.lastIndexOf(f) === n.value.length - 1)))
                )
                  return { text: f + f, selection: [1, 1] };
                if (n && n.type === "string") {
                  var q = j.substring(i.column, i.column + 1);
                  if (q == f) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("string_dquotes", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && (f == '"' || f == "'")) {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == '"') return e.end.column++, e;
              }
            });
        };
      d.inherits(f, e), (b.CstyleBehaviour = f);
    }
  ),
  define(
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
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../../lib/lang"),
        f = a("../../range").Range,
        g = a("./fold_mode").FoldMode,
        h = a("../../token_iterator").TokenIterator,
        i = (b.FoldMode = function (a) {
          g.call(this), (this.voidElements = a || {});
        });
      d.inherits(i, g),
        function () {
          (this.getFoldWidget = function (a, b, c) {
            var d = this._getFirstTagInLine(a, c);
            return d.closing
              ? b == "markbeginend"
                ? "end"
                : ""
              : !d.tagName || this.voidElements[d.tagName.toLowerCase()]
              ? ""
              : d.selfClosing
              ? ""
              : d.value.indexOf("/" + d.tagName) !== -1
              ? ""
              : "start";
          }),
            (this._getFirstTagInLine = function (a, b) {
              var c = a.getTokens(b),
                d = "";
              for (var f = 0; f < c.length; f++) {
                var g = c[f];
                g.type.indexOf("meta.tag") === 0
                  ? (d += g.value)
                  : (d += e.stringRepeat(" ", g.value.length));
              }
              return this._parseTag(d);
            }),
            (this.tagRe = /^(\s*)(<?(\/?)([-_a-zA-Z0-9:!]*)\s*(\/?)>?)/),
            (this._parseTag = function (a) {
              var b = this.tagRe.exec(a),
                c = this.tagRe.lastIndex || 0;
              return (
                (this.tagRe.lastIndex = 0),
                {
                  value: a,
                  match: b ? b[2] : "",
                  closing: b ? !!b[3] : !1,
                  selfClosing: b ? !!b[5] || b[2] == "/>" : !1,
                  tagName: b ? b[4] : "",
                  column: b[1] ? c + b[1].length : c,
                }
              );
            }),
            (this._readTagForward = function (a) {
              var b = a.getCurrentToken();
              if (!b) return null;
              var c = "",
                d;
              do
                if (b.type.indexOf("meta.tag") === 0) {
                  if (!d)
                    var d = {
                      row: a.getCurrentTokenRow(),
                      column: a.getCurrentTokenColumn(),
                    };
                  c += b.value;
                  if (c.indexOf(">") !== -1) {
                    var e = this._parseTag(c);
                    return (
                      (e.start = d),
                      (e.end = {
                        row: a.getCurrentTokenRow(),
                        column: a.getCurrentTokenColumn() + b.value.length,
                      }),
                      a.stepForward(),
                      e
                    );
                  }
                }
              while ((b = a.stepForward()));
              return null;
            }),
            (this._readTagBackward = function (a) {
              var b = a.getCurrentToken();
              if (!b) return null;
              var c = "",
                d;
              do
                if (b.type.indexOf("meta.tag") === 0) {
                  d ||
                    (d = {
                      row: a.getCurrentTokenRow(),
                      column: a.getCurrentTokenColumn() + b.value.length,
                    }),
                    (c = b.value + c);
                  if (c.indexOf("<") !== -1) {
                    var e = this._parseTag(c);
                    return (
                      (e.end = d),
                      (e.start = {
                        row: a.getCurrentTokenRow(),
                        column: a.getCurrentTokenColumn(),
                      }),
                      a.stepBackward(),
                      e
                    );
                  }
                }
              while ((b = a.stepBackward()));
              return null;
            }),
            (this._pop = function (a, b) {
              while (a.length) {
                var c = a[a.length - 1];
                if (!b || c.tagName == b.tagName) return a.pop();
                if (this.voidElements[b.tagName]) return;
                if (this.voidElements[c.tagName]) {
                  a.pop();
                  continue;
                }
                return null;
              }
            }),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = this._getFirstTagInLine(a, c);
              if (!d.match) return null;
              var e = d.closing || d.selfClosing,
                g = [],
                i;
              if (!e) {
                var j = new h(a, c, d.column),
                  k = { row: c, column: d.column + d.tagName.length + 2 };
                while ((i = this._readTagForward(j))) {
                  if (i.selfClosing) {
                    if (!g.length)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        (i.end.column -= 2),
                        f.fromPoints(i.start, i.end)
                      );
                    continue;
                  }
                  if (i.closing) {
                    this._pop(g, i);
                    if (g.length == 0) return f.fromPoints(k, i.start);
                  } else g.push(i);
                }
              } else {
                var j = new h(a, c, d.column + d.match.length),
                  l = { row: c, column: d.column };
                while ((i = this._readTagBackward(j))) {
                  if (i.selfClosing) {
                    if (!g.length)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        (i.end.column -= 2),
                        f.fromPoints(i.start, i.end)
                      );
                    continue;
                  }
                  if (!i.closing) {
                    this._pop(g, i);
                    if (g.length == 0)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        f.fromPoints(i.start, l)
                      );
                  } else g.push(i);
                }
              }
            });
        }.call(i.prototype);
    }
  ),
  define(
    "ace/mode/folding/fold_mode",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("../../range").Range,
        e = (b.FoldMode = function () {});
      (function () {
        (this.foldingStartMarker = null),
          (this.foldingStopMarker = null),
          (this.getFoldWidget = function (a, b, c) {
            var d = a.getLine(c);
            return this.foldingStartMarker.test(d)
              ? "start"
              : b == "markbeginend" &&
                this.foldingStopMarker &&
                this.foldingStopMarker.test(d)
              ? "end"
              : "";
          }),
          (this.getFoldWidgetRange = function (a, b, c) {
            return null;
          }),
          (this.indentationBlock = function (a, b, c) {
            var e = /\S/,
              f = a.getLine(b),
              g = f.search(e);
            if (g == -1) return;
            var h = c || f.length,
              i = a.getLength(),
              j = b,
              k = b;
            while (++b < i) {
              var l = a.getLine(b).search(e);
              if (l == -1) continue;
              if (l <= g) break;
              k = b;
            }
            if (k > j) {
              var m = a.getLine(k).length;
              return new d(j, h, k, m);
            }
          }),
          (this.openingBracketBlock = function (a, b, c, e, f) {
            var g = { row: c, column: e + 1 },
              h = a.$findClosingBracket(b, g, f);
            if (!h) return;
            var i = a.foldWidgets[h.row];
            return (
              i == null && (i = this.getFoldWidget(a, h.row)),
              i == "start" &&
                h.row > g.row &&
                (h.row--, (h.column = a.getLine(h.row).length)),
              d.fromPoints(g, h)
            );
          });
      }.call(e.prototype));
    }
  );
