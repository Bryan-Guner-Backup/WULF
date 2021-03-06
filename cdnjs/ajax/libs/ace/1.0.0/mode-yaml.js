define(
  "ace/mode/yaml",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/yaml_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/folding/coffee",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./yaml_highlight_rules").YamlHighlightRules,
      h = a("./matching_brace_outdent").MatchingBraceOutdent,
      i = a("./folding/coffee").FoldMode,
      j = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h()),
          (this.foldingRules = new i());
      };
    d.inherits(j, e),
      function () {
        (this.getNextLineIndent = function (a, b, c) {
          var d = this.$getIndent(b);
          if (a == "start") {
            var e = b.match(/^.*[\{\(\[]\s*$/);
            e && (d += c);
          }
          return d;
        }),
          (this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c);
          }),
          (this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c);
          });
      }.call(j.prototype),
      (b.Mode = j);
  }
),
  define(
    "ace/mode/yaml_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./text_highlight_rules").TextHighlightRules,
        f = function () {
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*$" },
              { token: "comment", regex: "^---" },
              { token: "variable", regex: "[&\\*][a-zA-Z0-9-_]+" },
              { token: ["identifier", "text"], regex: "(\\w+\\s*:)(\\w*)" },
              { token: "keyword.operator", regex: "<<\\w*:\\w*" },
              { token: "keyword.operator", regex: "-\\s*(?=[{])" },
              { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
              {
                token: "string",
                merge: !0,
                regex: "[\\|>]\\w*",
                next: "qqstring",
              },
              { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: "constant.language.boolean",
                regex: "(?:true|false|yes|no)\\b",
              },
              { token: "invalid.illegal", regex: "\\/\\/.*$" },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            qqstring: [
              {
                token: "string",
                regex: "(?=(?:(?:\\\\.)|(?:[^:]))*?:)",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
          };
        };
      d.inherits(f, e), (b.YamlHighlightRules = f);
    }
  ),
  define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("../range").Range,
        e = function () {};
      (function () {
        (this.checkOutdent = function (a, b) {
          return /^\s+$/.test(a) ? /^\s*\}/.test(b) : !1;
        }),
          (this.autoOutdent = function (a, b) {
            var c = a.getLine(b),
              e = c.match(/^(\s*\})/);
            if (!e) return 0;
            var f = e[1].length,
              g = a.findMatchingBracket({ row: b, column: f });
            if (!g || g.row == b) return 0;
            var h = this.$getIndent(a.getLine(g.row));
            a.replace(new d(b, 0, b, f - 1), h);
          }),
          (this.$getIndent = function (a) {
            var b = a.match(/^(\s+)/);
            return b ? b[1] : "";
          });
      }.call(e.prototype),
        (b.MatchingBraceOutdent = e));
    }
  ),
  define(
    "ace/mode/folding/coffee",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("./fold_mode").FoldMode,
        f = a("../../range").Range,
        g = (b.FoldMode = function () {});
      d.inherits(g, e),
        function () {
          (this.getFoldWidgetRange = function (a, b, c) {
            var d = this.indentationBlock(a, c);
            if (d) return d;
            var e = /\S/,
              g = a.getLine(c),
              h = g.search(e);
            if (h == -1 || g[h] != "#") return;
            var i = g.length,
              j = a.getLength(),
              k = c,
              l = c;
            while (++c < j) {
              g = a.getLine(c);
              var m = g.search(e);
              if (m == -1) continue;
              if (g[m] != "#") break;
              l = c;
            }
            if (l > k) {
              var n = a.getLine(l).length;
              return new f(k, i, l, n);
            }
          }),
            (this.getFoldWidget = function (a, b, c) {
              var d = a.getLine(c),
                e = d.search(/\S/),
                f = a.getLine(c + 1),
                g = a.getLine(c - 1),
                h = g.search(/\S/),
                i = f.search(/\S/);
              if (e == -1)
                return (
                  (a.foldWidgets[c - 1] = h != -1 && h < i ? "start" : ""), ""
                );
              if (h == -1) {
                if (e == i && d[e] == "#" && f[e] == "#")
                  return (
                    (a.foldWidgets[c - 1] = ""),
                    (a.foldWidgets[c + 1] = ""),
                    "start"
                  );
              } else if (
                h == e &&
                d[e] == "#" &&
                g[e] == "#" &&
                a.getLine(c - 2).search(/\S/) == -1
              )
                return (
                  (a.foldWidgets[c - 1] = "start"),
                  (a.foldWidgets[c + 1] = ""),
                  ""
                );
              return (
                h != -1 && h < e
                  ? (a.foldWidgets[c - 1] = "start")
                  : (a.foldWidgets[c - 1] = ""),
                e < i ? "start" : ""
              );
            });
        }.call(g.prototype);
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
