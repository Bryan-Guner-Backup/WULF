define(
  "ace/mode/scheme",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/scheme_highlight_rules",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./scheme_highlight_rules").SchemeHighlightRules,
      u = function () {
        var e = new o();
        this.$tokenizer = new s(e.getRules());
      };
    r.inherits(u, i),
      function () {
        this.lineCommentStart = ";";
      }.call(u.prototype),
      (t.Mode = u);
  }
),
  define(
    "ace/mode/scheme_highlight_rules",
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
          var e = "case|do|let|loop|if|else|when",
            t = "eq?|eqv?|equal?|and|or|not|null?",
            n = "#t|#f",
            r =
              "cons|car|cdr|cond|lambda|lambda*|syntax-rules|format|set!|quote|eval|append|list|list?|member?|load",
            i = this.createKeywordMapper(
              {
                "keyword.control": e,
                "keyword.operator": t,
                "constant.language": n,
                "support.function": r,
              },
              "identifier",
              !0
            );
          this.$rules = {
            start: [
              { token: "comment", regex: ";.*$" },
              {
                token: [
                  "storage.type.function-type.scheme",
                  "text",
                  "entity.name.function.scheme",
                ],
                regex:
                  "(?:\\b(?:(define|define-syntax|define-macro))\\b)(\\s+)((?:\\w|\\-|\\!|\\?)*)",
              },
              {
                token: "punctuation.definition.constant.character.scheme",
                regex: "#:\\S+",
              },
              {
                token: [
                  "punctuation.definition.variable.scheme",
                  "variable.other.global.scheme",
                  "punctuation.definition.variable.scheme",
                ],
                regex: "(\\*)(\\S*)(\\*)",
              },
              { token: "constant.numeric", regex: "#[xXoObB][0-9a-fA-F]+" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?",
              },
              { token: i, regex: "[a-zA-Z_#][a-zA-Z0-9_\\-\\?\\!\\*]*" },
              { token: "string", regex: '"(?=.)', next: "qqstring" },
            ],
            qqstring: [
              { token: "constant.character.escape.scheme", regex: "\\\\." },
              { token: "string", regex: '[^"\\\\]+', merge: !0 },
              { token: "string", regex: "\\\\$", next: "qqstring", merge: !0 },
              { token: "string", regex: '"|$', next: "start", merge: !0 },
            ],
          };
        };
      r.inherits(s, i), (t.SchemeHighlightRules = s);
    }
  );
