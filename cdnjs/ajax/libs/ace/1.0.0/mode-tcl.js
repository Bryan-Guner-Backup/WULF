define(
  "ace/mode/tcl",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/folding/cstyle",
    "ace/mode/tcl_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./folding/cstyle").FoldMode,
      h = a("./tcl_highlight_rules").TclHighlightRules,
      i = a("./matching_brace_outdent").MatchingBraceOutdent,
      j = a("../range").Range,
      k = function () {
        (this.$tokenizer = new f(new h().getRules())),
          (this.$outdent = new i()),
          (this.foldingRules = new g());
      };
    d.inherits(k, e),
      function () {
        (this.toggleCommentLines = function (a, b, c, d) {
          var e = !0,
            f = /^(\s*)#/;
          for (var g = c; g <= d; g++)
            if (!f.test(b.getLine(g))) {
              e = !1;
              break;
            }
          if (e) {
            var h = new j(0, 0, 0, 0);
            for (var g = c; g <= d; g++) {
              var i = b.getLine(g),
                k = i.match(f);
              (h.start.row = g),
                (h.end.row = g),
                (h.end.column = k[0].length),
                b.replace(h, k[1]);
            }
          } else b.indentRows(c, d, "#");
        }),
          (this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
              e = this.$tokenizer.getLineTokens(b, a),
              f = e.tokens;
            if (f.length && f[f.length - 1].type == "comment") return d;
            if (a == "start") {
              var g = b.match(/^.*[\{\(\[]\s*$/);
              g && (d += c);
            }
            return d;
          }),
          (this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c);
          }),
          (this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c);
          });
      }.call(k.prototype),
      (b.Mode = k);
  }
),
  define(
    "ace/mode/folding/cstyle",
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
          (this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = a.getLine(c),
                f = d.match(this.foldingStartMarker);
              if (f) {
                var g = f.index;
                if (f[1]) return this.openingBracketBlock(a, f[1], c, g);
                var h = a.getCommentFoldRange(c, g + f[0].length);
                return (h.end.column -= 2), h;
              }
              if (b !== "markbeginend") return;
              var f = d.match(this.foldingStopMarker);
              if (f) {
                var g = f.index + f[0].length;
                if (f[2]) {
                  var h = a.getCommentFoldRange(c, g);
                  return (h.end.column -= 2), h;
                }
                var i = { row: c, column: g },
                  j = a.$findOpeningBracket(f[1], i);
                if (!j) return;
                return j.column++, i.column--, e.fromPoints(j, i);
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
  ),
  define(
    "ace/mode/tcl_highlight_rules",
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
                token: "comment",
                merge: !0,
                regex: "#.*\\\\$",
                next: "commentfollow",
              },
              { token: "comment", regex: "#.*$" },
              {
                token: "support.function",
                regex: "[\\\\]$",
                next: "splitlineStart",
              },
              { token: "text", regex: '[\\\\](?:["]|[{]|[}]|[[]|[]]|[$]|[])' },
              {
                token: "text",
                regex: "^|[^{][;][^}]|[/\r/]",
                next: "commandItem",
              },
              {
                token: "string",
                regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
              },
              {
                token: "string",
                merge: !0,
                regex: '[ ]*["]',
                next: "qqstring",
              },
              {
                token: "variable.instancce",
                merge: !0,
                regex: "[$]",
                next: "variable",
              },
              {
                token: "support.function",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::",
              },
              { token: "identifier", regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              { token: "paren.lparen", regex: "[[{]", next: "commandItem" },
              { token: "paren.lparen", regex: "[(]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            commandItem: [
              {
                token: "comment",
                merge: !0,
                regex: "#.*\\\\$",
                next: "commentfollow",
              },
              { token: "comment", regex: "#.*$", next: "start" },
              {
                token: "string",
                regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
              },
              {
                token: "variable.instancce",
                merge: !0,
                regex: "[$]",
                next: "variable",
              },
              {
                token: "support.function",
                regex: "(?:[:][:])[a-zA-Z0-9_/]+(?:[:][:])",
                next: "commandItem",
              },
              {
                token: "support.function",
                regex: "[a-zA-Z0-9_/]+(?:[:][:])",
                next: "commandItem",
              },
              {
                token: "support.function",
                regex: "(?:[:][:])",
                next: "commandItem",
              },
              {
                token: "support.function",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::",
              },
              { token: "keyword", regex: "[a-zA-Z0-9_/]+", next: "start" },
            ],
            commentfollow: [
              { token: "comment", regex: ".*\\\\$", next: "commentfollow" },
              { token: "comment", merge: !0, regex: ".+", next: "start" },
            ],
            splitlineStart: [{ token: "text", regex: "^.", next: "start" }],
            variable: [
              {
                token: "variable.instancce",
                regex:
                  "(?:[:][:])?(?:[a-zA-Z_]|d)+(?:(?:[:][:])?(?:[a-zA-Z_]|d)+)?(?:[(](?:[a-zA-Z_]|d)+[)])?",
                next: "start",
              },
              {
                token: "variable.instancce",
                regex: "(?:[a-zA-Z_]|d)+(?:[(](?:[a-zA-Z_]|d)+[)])?",
                next: "start",
              },
              {
                token: "variable.instancce",
                regex: "{?(?:[a-zA-Z_]|d)+}?",
                next: "start",
              },
            ],
            qqstring: [
              {
                token: "string",
                regex: '(?:[^\\\\]|\\\\.)*?["]',
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
          };
        };
      d.inherits(f, e), (b.TclHighlightRules = f);
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
  );
