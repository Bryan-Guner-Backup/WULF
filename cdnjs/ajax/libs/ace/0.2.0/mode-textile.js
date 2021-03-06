define(
  "ace/mode/textile",
  [
    "require",
    "exports",
    "module",
    "pilot/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/textile_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("pilot/oop"),
      e = a("ace/mode/text").Mode,
      f = a("ace/tokenizer").Tokenizer,
      g = a("ace/mode/textile_highlight_rules").TextileHighlightRules,
      h = a("ace/mode/matching_brace_outdent").MatchingBraceOutdent,
      i = a("ace/range").Range,
      j = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h());
      };
    d.inherits(j, e),
      function () {
        (this.getNextLineIndent = function (a, b, c) {
          return a == "intag" ? c : "";
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
    "ace/mode/textile_highlight_rules",
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
              {
                token: "keyword",
                regex: "h1|h2|h3|h4|h5|h6|bq|p|bc|pre",
                next: "blocktag",
              },
              { token: "keyword", regex: "[\\*]+|[#]+" },
              { token: "text", regex: ".+" },
            ],
            blocktag: [
              { token: "keyword", regex: "\\. ", next: "start" },
              { token: "keyword", regex: "\\(", next: "blocktagproperties" },
            ],
            blocktagproperties: [
              { token: "keyword", regex: "\\)", next: "blocktag" },
              { token: "string", regex: "[a-zA-Z0-9\\-_]+" },
              { token: "keyword", regex: "#" },
            ],
          };
        };
      d.inherits(f, e), (b.TextileHighlightRules = f);
    }
  ),
  define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("ace/range").Range,
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
