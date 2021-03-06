define(
  "ace/mode/c9search",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/c9search_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/folding/c9search",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./c9search_highlight_rules").C9SearchHighlightRules,
      h = a("./matching_brace_outdent").MatchingBraceOutdent,
      i = a("./folding/c9search").FoldMode,
      j = function () {
        (this.$tokenizer = new f(new g().getRules(), "i")),
          (this.$outdent = new h()),
          (this.foldingRules = new i());
      };
    d.inherits(j, e),
      function () {
        (this.getNextLineIndent = function (a, b, c) {
          var d = this.$getIndent(b);
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
    "ace/mode/c9search_highlight_rules",
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
              {
                token: [
                  "c9searchresults.constant.numeric",
                  "c9searchresults.text",
                  "c9searchresults.text",
                ],
                regex: "(^\\s+[0-9]+)(:\\s*)(.+)",
              },
              { token: ["string", "text"], regex: "(.+)(:$)" },
            ],
          };
        };
      d.inherits(f, e), (b.C9SearchHighlightRules = f);
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
    "ace/mode/folding/c9search",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/range",
      "ace/mode/folding/fold_mode",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../../range").Range,
        f = a("./fold_mode").FoldMode,
        g = (b.FoldMode = function () {});
      d.inherits(g, f),
        function () {
          (this.foldingStartMarker = /^(\S.*\:|Searching for.*)$/),
            (this.foldingStopMarker = /^(\s+|Found.*)$/),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = a.doc.getAllLines(c),
                f = d[c],
                g = /^(Found.*|Searching for.*)$/,
                h = /^(\S.*\:|\s*)$/,
                i = g.test(f) ? g : h;
              if (this.foldingStartMarker.test(f)) {
                for (var j = c + 1, k = a.getLength(); j < k; j++)
                  if (i.test(d[j])) break;
                return new e(c, f.length, j, 0);
              }
              if (this.foldingStopMarker.test(f)) {
                for (var j = c - 1; j >= 0; j--) {
                  f = d[j];
                  if (i.test(f)) break;
                }
                return new e(j, f.length, c, 0);
              }
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
