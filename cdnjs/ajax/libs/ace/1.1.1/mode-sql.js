define(
  "ace/mode/sql",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/sql_highlight_rules",
    "ace/range",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./sql_highlight_rules").SqlHighlightRules,
      u = e("../range").Range,
      a = function () {
        this.$tokenizer = new s(new o().getRules());
      };
    r.inherits(a, i),
      function () {
        this.lineCommentStart = "--";
      }.call(a.prototype),
      (t.Mode = a);
  }
),
  define(
    "ace/mode/sql_highlight_rules",
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
          var e =
              "select|insert|update|delete|from|where|and|or|group|by|order|limit|offset|having|as|case|when|else|end|type|left|right|join|on|outer|desc|asc",
            t = "true|false|null",
            n = "count|min|max|avg|sum|rank|now|coalesce",
            r = this.createKeywordMapper(
              { "support.function": n, keyword: e, "constant.language": t },
              "identifier",
              !0
            );
          this.$rules = {
            start: [
              { token: "comment", regex: "--.*$" },
              { token: "string", regex: '".*?"' },
              { token: "string", regex: "'.*?'" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              { token: r, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex:
                  "\\+|\\-|\\/|\\/\\/|%|<@>|@>|<@|&|\\^|~|<|>|<=|=>|==|!=|<>|=",
              },
              { token: "paren.lparen", regex: "[\\(]" },
              { token: "paren.rparen", regex: "[\\)]" },
              { token: "text", regex: "\\s+" },
            ],
          };
        };
      r.inherits(s, i), (t.SqlHighlightRules = s);
    }
  );
