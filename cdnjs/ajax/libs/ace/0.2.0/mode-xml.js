define(
  "ace/mode/xml",
  [
    "require",
    "exports",
    "module",
    "pilot/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/xml_highlight_rules",
    "ace/mode/behaviour/xml",
  ],
  function (a, b, c) {
    var d = a("pilot/oop"),
      e = a("ace/mode/text").Mode,
      f = a("ace/tokenizer").Tokenizer,
      g = a("ace/mode/xml_highlight_rules").XmlHighlightRules,
      h = a("ace/mode/behaviour/xml").XmlBehaviour,
      i = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$behaviour = new h());
      };
    d.inherits(i, e),
      function () {
        this.getNextLineIndent = function (a, b, c) {
          return this.$getIndent(b);
        };
      }.call(i.prototype),
      (b.Mode = i);
  }
),
  define(
    "ace/mode/xml_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("ace/mode/text_highlight_rules").TextHighlightRules,
        f = function () {
          this.$rules = {
            start: [
              { token: "text", regex: "<\\!\\[CDATA\\[", next: "cdata" },
              { token: "xml_pe", regex: "<\\?.*?\\?>" },
              { token: "comment", merge: !0, regex: "<\\!--", next: "comment" },
              { token: "text", regex: "<\\/?", next: "tag" },
              { token: "text", regex: "\\s+" },
              { token: "text", regex: "[^<]+" },
            ],
            tag: [
              { token: "text", regex: ">", next: "start" },
              { token: "keyword", regex: "[-_a-zA-Z0-9:]+" },
              { token: "text", regex: "\\s+" },
              { token: "string", regex: '".*?"' },
              { token: "string", merge: !0, regex: '["].*$', next: "qqstring" },
              { token: "string", regex: "'.*?'" },
              { token: "string", merge: !0, regex: "['].*$", next: "qstring" },
            ],
            qstring: [
              { token: "string", regex: ".*'", next: "tag" },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qqstring: [
              { token: "string", regex: '.*"', next: "tag" },
              { token: "string", merge: !0, regex: ".+" },
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
          };
        };
      d.inherits(f, e), (b.XmlHighlightRules = f);
    }
  ),
  define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "ace/mode/behaviour",
      "ace/mode/behaviour/cstyle",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("ace/mode/behaviour").Behaviour,
        f = a("ace/mode/behaviour/cstyle").CstyleBehaviour,
        g = function () {
          this.inherit(f, ["string_dquotes"]),
            this.add("brackets", "insertion", function (a, b, c, d, e) {
              if (e == "<") {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                return g !== "" ? !1 : { text: "<>", selection: [1, 1] };
              }
              if (e == ">") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column, h.column + 1);
                if (j == ">") return { text: "", selection: [1, 1] };
              } else if (e == "\n") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  k = i.substring(h.column, h.column + 2);
                if (k == "</") {
                  var l =
                      this.$getIndent(d.doc.getLine(h.row)) + d.getTabString(),
                    m = this.$getIndent(d.doc.getLine(h.row));
                  return {
                    text: "\n" + l + "\n" + m,
                    selection: [1, l.length, 1, l.length],
                  };
                }
              }
              return !1;
            });
        };
      d.inherits(g, e), (b.XmlBehaviour = g);
    }
  ),
  define(
    "ace/mode/behaviour/cstyle",
    ["require", "exports", "module", "pilot/oop", "ace/mode/behaviour"],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("ace/mode/behaviour").Behaviour,
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
                if (!l) return !1;
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
            return !1;
          }),
            this.add("braces", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "{") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.end.column, e.end.column + 1);
                if (h == "}") {
                  e.end.column++;
                  return e;
                }
              }
              return !1;
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
              return !1;
            }),
            this.add("parens", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "(") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == ")") {
                  e.end.column++;
                  return e;
                }
              }
              return !1;
            }),
            this.add("string_dquotes", "insertion", function (a, b, c, d, e) {
              if (e == '"') {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                if (g !== "") return { text: '"' + g + '"', selection: !1 };
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column - 1, h.column);
                if (j == "\\") return !1;
                var k = d.getTokens(f.start.row, f.start.row)[0].tokens,
                  l = 0,
                  m,
                  n = -1;
                for (var o = 0; o < k.length; o++) {
                  (m = k[o]),
                    m.type == "string"
                      ? (n = -1)
                      : n < 0 && (n = m.value.indexOf('"'));
                  if (m.value.length + l > f.start.column) break;
                  l += k[o].value.length;
                }
                if (
                  !m ||
                  (n < 0 &&
                    m.type !== "comment" &&
                    (m.type !== "string" ||
                      (f.start.column !== m.value.length + l - 1 &&
                        m.value.lastIndexOf('"') === m.value.length - 1)))
                )
                  return { text: '""', selection: [1, 1] };
                if (m && m.type === "string") {
                  var p = i.substring(h.column, h.column + 1);
                  if (p == '"') return { text: "", selection: [1, 1] };
                }
              }
              return !1;
            }),
            this.add("string_dquotes", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == '"') {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == '"') {
                  e.end.column++;
                  return e;
                }
              }
              return !1;
            });
        };
      d.inherits(f, e), (b.CstyleBehaviour = f);
    }
  );
