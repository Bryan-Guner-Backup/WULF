define(
  "ace/mode/lucene",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/lucene_highlight_rules",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./lucene_highlight_rules").LuceneHighlightRules,
      u = function () {
        this.$tokenizer = new s(new o().getRules());
      };
    r.inherits(u, i), (t.Mode = u);
  }
),
  define(
    "ace/mode/lucene_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./text_highlight_rules").TextHighlightRules,
        o = function () {
          this.$rules = {
            start: [
              { token: "constant.character.negation", regex: "[\\-]" },
              { token: "constant.character.interro", regex: "[\\?]" },
              { token: "constant.character.asterisk", regex: "[\\*]" },
              { token: "constant.character.proximity", regex: "~[0-9]+\\b" },
              { token: "keyword.operator", regex: "(?:AND|OR|NOT)\\b" },
              { token: "paren.lparen", regex: "[\\(]" },
              { token: "paren.rparen", regex: "[\\)]" },
              { token: "keyword", regex: "[\\S]+:" },
              { token: "string", regex: '".*?"' },
              { token: "text", regex: "\\s+" },
            ],
          };
        };
      r.inherits(o, s), (t.LuceneHighlightRules = o);
    }
  );
