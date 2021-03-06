define(
  "ace/mode/properties",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/properties_highlight_rules",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./properties_highlight_rules").PropertiesHighlightRules,
      u = function () {
        var e = new o();
        this.$tokenizer = new s(e.getRules());
      };
    r.inherits(u, i), (t.Mode = u);
  }
),
  define(
    "ace/mode/properties_highlight_rules",
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
          var e = /\\u[0-9a-fA-F]{4}|\\/;
          this.$rules = {
            start: [
              { token: "comment", regex: /[!#].*$/ },
              { token: "keyword", regex: /[=:]$/ },
              { token: "keyword", regex: /[=:]/, next: "value" },
              { token: "constant.language.escape", regex: e },
              { defaultToken: "variable" },
            ],
            value: [
              { regex: /\\$/, token: "string", next: "value" },
              { regex: /$/, token: "string", next: "start" },
              { token: "constant.language.escape", regex: e },
              { defaultToken: "string" },
            ],
          };
        };
      r.inherits(s, i), (t.PropertiesHighlightRules = s);
    }
  );
