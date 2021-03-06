define(
  "ace/mode/sh",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/sh_highlight_rules",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./sh_highlight_rules").ShHighlightRules,
      h = a("../range").Range,
      i = function () {
        this.$tokenizer = new f(new g().getRules());
      };
    d.inherits(i, e),
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
            var i = new h(0, 0, 0, 0);
            for (var g = c; g <= d; g++) {
              var j = b.getLine(g),
                k = j.match(f);
              (i.start.row = g),
                (i.end.row = g),
                (i.end.column = k[0].length),
                b.replace(i, k[1]);
            }
          } else b.indentRows(c, d, "#");
        }),
          (this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
              e = this.$tokenizer.getLineTokens(b, a),
              f = e.tokens;
            if (f.length && f[f.length - 1].type == "comment") return d;
            if (a == "start") {
              var g = b.match(/^.*[\{\(\[\:]\s*$/);
              g && (d += c);
            }
            return d;
          });
        var a = { pass: 1, return: 1, raise: 1, break: 1, continue: 1 };
        (this.checkOutdent = function (b, c, d) {
          if (d !== "\r\n" && d !== "\r" && d !== "\n") return !1;
          var e = this.$tokenizer.getLineTokens(c.trim(), b).tokens;
          if (!e) return !1;
          do var f = e.pop();
          while (
            f &&
            (f.type == "comment" ||
              (f.type == "text" && f.value.match(/^\s+$/)))
          );
          return f ? f.type == "keyword" && a[f.value] : !1;
        }),
          (this.autoOutdent = function (a, b, c) {
            c += 1;
            var d = this.$getIndent(b.getLine(c)),
              e = b.getTabString();
            d.slice(-e.length) == e &&
              b.remove(new h(c, d.length - e.length, c, d.length));
          });
      }.call(i.prototype),
      (b.Mode = i);
  }
),
  define(
    "ace/mode/sh_highlight_rules",
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
          var a =
              "!|{|}|case|do|done|elif|else|esac|fi|for|if|in|then|until|while|&|;|export|local|read|typeset|unset|elif|select|set",
            b =
              "[|]|alias|bg|bind|break|builtin|cd|command|compgen|complete|continue|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|return|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|wait",
            c = this.createKeywordMapper(
              {
                keyword: a,
                "constant.language": b,
                "invalid.deprecated": "debugger",
              },
              "identifier"
            ),
            d = "(?:(?:[1-9]\\d*)|(?:0))",
            e = "(?:\\.\\d+)",
            f = "(?:\\d+)",
            g = "(?:(?:" + f + "?" + e + ")|(?:" + f + "\\.))",
            h = "(?:(?:" + g + "|" + f + ")" + ")",
            i = "(?:" + h + "|" + g + ")",
            j = "(?:&" + f + ")",
            k = "[a-zA-Z][a-zA-Z0-9_]*",
            l = "(?:(?:\\$" + k + ")|(?:" + k + "=))",
            m = "(?:\\$(?:SHLVL|\\$|\\!|\\?))",
            n = "(?:" + k + "\\s*\\(\\))";
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*$" },
              { token: "string", regex: '"(?:[^\\\\]|\\\\.)*?"' },
              { token: "variable.language", regex: m },
              { token: "variable", regex: l },
              { token: "support.function", regex: n },
              { token: "support.function", regex: j },
              { token: "string", regex: "'(?:[^\\\\]|\\\\.)*?'" },
              { token: "constant.numeric", regex: i },
              { token: "constant.numeric", regex: d + "\\b" },
              { token: c, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!=",
              },
              { token: "paren.lparen", regex: "[\\[\\(\\{]" },
              { token: "paren.rparen", regex: "[\\]\\)\\}]" },
              { token: "text", regex: "\\s+" },
            ],
          };
        };
      d.inherits(f, e), (b.ShHighlightRules = f);
    }
  );
