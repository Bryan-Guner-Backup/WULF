ace.define(
  "ace/mode/rdoc",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/text_highlight_rules",
    "ace/mode/rdoc_highlight_rules",
    "ace/mode/matching_brace_outdent",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./text_highlight_rules").TextHighlightRules,
      u = e("./rdoc_highlight_rules").RDocHighlightRules,
      a = e("./matching_brace_outdent").MatchingBraceOutdent,
      f = function (e) {
        (this.$tokenizer = new s(new u().getRules())),
          (this.$outdent = new a());
      };
    r.inherits(f, i),
      function () {
        this.getNextLineIndent = function (e, t, n) {
          return this.$getIndent(t);
        };
      }.call(f.prototype),
      (t.Mode = f);
  }
),
  ace.define(
    "ace/mode/rdoc_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
      "ace/mode/latex_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./text_highlight_rules").TextHighlightRules,
        o = e("./latex_highlight_rules"),
        u = function () {
          this.$rules = {
            start: [
              { token: "comment", regex: "%.*$" },
              { token: "text", regex: "\\\\[$&%#\\{\\}]" },
              {
                token: "keyword",
                regex:
                  "\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b",
                next: "nospell",
              },
              { token: "keyword", regex: "\\\\(?:[a-zA-z0-9]+|[^a-zA-z0-9])" },
              { token: "paren.keyword.operator", regex: "[[({]" },
              { token: "paren.keyword.operator", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            nospell: [
              { token: "comment", regex: "%.*$", next: "start" },
              { token: "nospell.text", regex: "\\\\[$&%#\\{\\}]" },
              {
                token: "keyword",
                regex:
                  "\\\\(?:name|alias|method|S3method|S4method|item|code|preformatted|kbd|pkg|var|env|option|command|author|email|url|source|cite|acronym|href|code|preformatted|link|eqn|deqn|keyword|usage|examples|dontrun|dontshow|figure|if|ifelse|Sexpr|RdOpts|inputencoding|usepackage)\\b",
              },
              {
                token: "keyword",
                regex: "\\\\(?:[a-zA-z0-9]+|[^a-zA-z0-9])",
                next: "start",
              },
              { token: "paren.keyword.operator", regex: "[[({]" },
              { token: "paren.keyword.operator", regex: "[\\])]" },
              { token: "paren.keyword.operator", regex: "}", next: "start" },
              { token: "nospell.text", regex: "\\s+" },
              { token: "nospell.text", regex: "\\w+" },
            ],
          };
        };
      r.inherits(u, s), (t.RDocHighlightRules = u);
    }
  ),
  ace.define(
    "ace/mode/latex_highlight_rules",
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
              { token: "keyword", regex: "\\\\(?:[^a-zA-Z]|[a-zA-Z]+)" },
              { token: "lparen", regex: "[[({]" },
              { token: "rparen", regex: "[\\])}]" },
              {
                token: "string",
                regex: "\\$(?:(?:\\\\.)|(?:[^\\$\\\\]))*?\\$",
              },
              { token: "comment", regex: "%.*$" },
            ],
          };
        };
      r.inherits(s, i), (t.LatexHighlightRules = s);
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
