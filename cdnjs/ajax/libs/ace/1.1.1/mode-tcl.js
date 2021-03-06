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
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./folding/cstyle").FoldMode,
      u = e("./tcl_highlight_rules").TclHighlightRules,
      a = e("./matching_brace_outdent").MatchingBraceOutdent,
      f = e("../range").Range,
      l = function () {
        (this.$tokenizer = new s(new u().getRules())),
          (this.$outdent = new a()),
          (this.foldingRules = new o());
      };
    r.inherits(l, i),
      function () {
        (this.lineCommentStart = "#"),
          (this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t),
              i = this.$tokenizer.getLineTokens(t, e),
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
          });
      }.call(l.prototype),
      (t.Mode = l);
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
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = e.getLine(n),
                i = r.match(this.foldingStartMarker);
              if (i) {
                var s = i.index;
                return i[1]
                  ? this.openingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s + i[0].length, 1);
              }
              if (t !== "markbeginend") return;
              var i = r.match(this.foldingStopMarker);
              if (i) {
                var s = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            });
        }.call(o.prototype);
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
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = function () {
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*\\\\$", next: "commentfollow" },
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
              { token: "string", regex: '[ ]*["]', next: "qqstring" },
              { token: "variable.instance", regex: "[$]", next: "variable" },
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
              { token: "comment", regex: "#.*\\\\$", next: "commentfollow" },
              { token: "comment", regex: "#.*$", next: "start" },
              {
                token: "string",
                regex: '[ ]*["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]',
              },
              { token: "variable.instance", regex: "[$]", next: "variable" },
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
              { token: "paren.rparen", regex: "[\\])}]" },
              {
                token: "support.function",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|{\\*}|;|::",
              },
              { token: "keyword", regex: "[a-zA-Z0-9_/]+", next: "start" },
            ],
            commentfollow: [
              { token: "comment", regex: ".*\\\\$", next: "commentfollow" },
              { token: "comment", regex: ".+", next: "start" },
            ],
            splitlineStart: [{ token: "text", regex: "^.", next: "start" }],
            variable: [
              {
                token: "variable.instance",
                regex: "[a-zA-Z_\\d]+(?:[(][a-zA-Z_\\d]+[)])?",
                next: "start",
              },
              {
                token: "variable.instance",
                regex: "{?[a-zA-Z_\\d]+}?",
                next: "start",
              },
            ],
            qqstring: [
              {
                token: "string",
                regex: '(?:[^\\\\]|\\\\.)*?["]',
                next: "start",
              },
              { token: "string", regex: ".+" },
            ],
          };
        };
      r.inherits(s, i), (t.TclHighlightRules = s);
    }
  ),
  define(
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
