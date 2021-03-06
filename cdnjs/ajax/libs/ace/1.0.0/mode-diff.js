define(
  "ace/mode/diff",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/diff_highlight_rules",
    "ace/mode/folding/diff",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./diff_highlight_rules").DiffHighlightRules,
      h = a("./folding/diff").FoldMode,
      i = function () {
        (this.$tokenizer = new f(new g().getRules(), "i")),
          (this.foldingRules = new h(
            ["diff", "index", "\\+{3}", "@@|\\*{5}"],
            "i"
          ));
      };
    d.inherits(i, e), function () {}.call(i.prototype), (b.Mode = i);
  }
),
  define(
    "ace/mode/diff_highlight_rules",
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
                regex: "^(?:\\*{15}|={67}|-{3}|\\+{3})$",
                token: "punctuation.definition.separator.diff",
                name: "keyword",
              },
              {
                regex: "^(@@)(\\s*.+?\\s*)(@@)(.*)$",
                token: [
                  "constant",
                  "constant.numeric",
                  "constant",
                  "comment.doc.tag",
                ],
              },
              {
                regex: "^(\\d+)([,\\d]+)(a|d|c)(\\d+)([,\\d]+)(.*)$",
                token: [
                  "constant.numeric",
                  "punctuation.definition.range.diff",
                  "constant.function",
                  "constant.numeric",
                  "punctuation.definition.range.diff",
                  "invalid",
                ],
                name: "meta.",
              },
              {
                regex: "^(?:(\\-{3}|\\+{3}|\\*{3})( .+))$",
                token: ["constant.numeric", "meta.tag"],
              },
              {
                regex: "^([!+>])(.*?)(\\s*)$",
                token: ["support.constant", "text", "invalid"],
              },
              {
                regex: "^([<\\-])(.*?)(\\s*)$",
                token: ["support.function", "string", "invalid"],
              },
              {
                regex: "^(diff)(\\s+--\\w+)?(.+?)( .+)?$",
                token: ["variable", "variable", "keyword", "variable"],
              },
              { regex: "^Index.+$", token: "variable" },
              { regex: "^(.*?)(\\s*)$", token: ["invisible", "invalid"] },
            ],
          };
        };
      d.inherits(f, e), (b.DiffHighlightRules = f);
    }
  ),
  define(
    "ace/mode/folding/diff",
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
        g = (b.FoldMode = function (a, b) {
          (this.regExpList = a),
            (this.flag = b),
            (this.foldingStartMarker = RegExp(
              "^(" + a.join("|") + ")",
              this.flag
            ));
        });
      d.inherits(g, e),
        function () {
          this.getFoldWidgetRange = function (a, b, c) {
            var d = a.getLine(c),
              e = { row: c, column: d.length },
              g = this.regExpList;
            for (var h = 1; h <= g.length; h++) {
              var i = RegExp("^(" + g.slice(0, h).join("|") + ")", this.flag);
              if (i.test(d)) break;
            }
            for (var j = a.getLength(); ++c < j; ) {
              d = a.getLine(c);
              if (i.test(d)) break;
            }
            if (c == e.row + 1) return;
            return f.fromPoints(e, { row: c - 1, column: d.length });
          };
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
