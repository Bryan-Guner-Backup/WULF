define(
  "ace/mode/python",
  [
    "require",
    "exports",
    "module",
    "pilot/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/python_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("pilot/oop"),
      e = a("ace/mode/text").Mode,
      f = a("ace/tokenizer").Tokenizer,
      g = a("ace/mode/python_highlight_rules").PythonHighlightRules,
      h = a("ace/mode/matching_brace_outdent").MatchingBraceOutdent,
      i = a("ace/range").Range,
      j = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h());
      };
    d.inherits(j, e),
      function () {
        (this.toggleCommentLines = function (a, b, c, d) {
          var e = !0,
            f = [],
            g = /^(\s*)#/;
          for (var h = c; h <= d; h++)
            if (!g.test(b.getLine(h))) {
              e = !1;
              break;
            }
          if (e) {
            var j = new i(0, 0, 0, 0);
            for (var h = c; h <= d; h++) {
              var k = b.getLine(h),
                l = k.match(g);
              (j.start.row = h),
                (j.end.row = h),
                (j.end.column = l[0].length),
                b.replace(j, l[1]);
            }
          } else b.indentRows(c, d, "#");
        }),
          (this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
              e = this.$tokenizer.getLineTokens(b, a),
              f = e.tokens,
              g = e.state;
            if (f.length && f[f.length - 1].type == "comment") return d;
            if (a == "start") {
              var h = b.match(/^.*[\{\(\[\:]\s*$/);
              h && (d += c);
            }
            return d;
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
    "ace/mode/python_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "pilot/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("pilot/lang"),
        f = a("ace/mode/text_highlight_rules").TextHighlightRules,
        g = function () {
          var a = e.arrayToMap(
              "and|as|assert|break|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|not|or|pass|print|raise|return|try|while|with|yield".split(
                "|"
              )
            ),
            b = e.arrayToMap(
              "True|False|None|NotImplemented|Ellipsis|__debug__".split("|")
            ),
            c = e.arrayToMap(
              "abs|divmod|input|open|staticmethod|all|enumerate|int|ord|str|any|eval|isinstance|pow|sum|basestring|execfile|issubclass|print|super|binfile|iter|property|tuple|bool|filter|len|range|type|bytearray|float|list|raw_input|unichr|callable|format|locals|reduce|unicode|chr|frozenset|long|reload|vars|classmethod|getattr|map|repr|xrange|cmp|globals|max|reversed|zip|compile|hasattr|memoryview|round|__import__|complex|hash|min|set|apply|delattr|help|next|setattr|buffer|dict|hex|object|slice|coerce|dir|id|oct|sorted|intern".split(
                "|"
              )
            ),
            d = e.arrayToMap("".split("|")),
            f = "(?:r|u|ur|R|U|UR|Ur|uR)?",
            g = "(?:(?:[1-9]\\d*)|(?:0))",
            h = "(?:0[oO]?[0-7]+)",
            i = "(?:0[xX][\\dA-Fa-f]+)",
            j = "(?:0[bB][01]+)",
            k = "(?:" + g + "|" + h + "|" + i + "|" + j + ")",
            l = "(?:[eE][+-]?\\d+)",
            m = "(?:\\.\\d+)",
            n = "(?:\\d+)",
            o = "(?:(?:" + n + "?" + m + ")|(?:" + n + "\\.))",
            p = "(?:(?:" + o + "|" + n + ")" + l + ")",
            q = "(?:" + p + "|" + o + ")";
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*$" },
              { token: "string", regex: f + '"{3}(?:[^\\\\]|\\\\.)*?"{3}' },
              {
                token: "string",
                merge: !0,
                regex: f + '"{3}.*$',
                next: "qqstring",
              },
              { token: "string", regex: f + '"(?:[^\\\\]|\\\\.)*?"' },
              { token: "string", regex: f + "'{3}(?:[^\\\\]|\\\\.)*?'{3}" },
              {
                token: "string",
                merge: !0,
                regex: f + "'{3}.*$",
                next: "qstring",
              },
              { token: "string", regex: f + "'(?:[^\\\\]|\\\\.)*?'" },
              { token: "constant.numeric", regex: "(?:" + q + "|\\d+)[jJ]\\b" },
              { token: "constant.numeric", regex: q },
              { token: "constant.numeric", regex: k + "[lL]\\b" },
              { token: "constant.numeric", regex: k + "\\b" },
              {
                token: function (e) {
                  return a.hasOwnProperty(e)
                    ? "keyword"
                    : b.hasOwnProperty(e)
                    ? "constant.language"
                    : d.hasOwnProperty(e)
                    ? "invalid.illegal"
                    : c.hasOwnProperty(e)
                    ? "support.function"
                    : e == "debugger"
                    ? "invalid.deprecated"
                    : "identifier";
                },
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
              },
              {
                token: "keyword.operator",
                regex:
                  "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|%|<<|>>|&|\\||\\^|~|<|>|<=|=>|==|!=|<>|=",
              },
              { token: "lparen", regex: "[\\[\\(\\{]" },
              { token: "rparen", regex: "[\\]\\)\\}]" },
              { token: "text", regex: "\\s+" },
            ],
            qqstring: [
              {
                token: "string",
                regex: '(?:[^\\\\]|\\\\.)*?"{3}',
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?'{3}",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
          };
        };
      d.inherits(g, f), (b.PythonHighlightRules = g);
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
