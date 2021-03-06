ace.define(
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
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./sh_highlight_rules").ShHighlightRules,
      u = e("../range").Range,
      a = e("./folding/cstyle").FoldMode,
      f = function () {
        (this.HighlightRules = o), (this.foldingRules = new a());
      };
    r.inherits(f, i),
      function () {
        (this.lineCommentStart = "#"),
          (this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t),
              i = this.getTokenizer().getLineTokens(t, e),
              s = i.tokens;
            if (s.length && s[s.length - 1].type == "comment") return r;
            if (e == "start") {
              var o = t.match(/^.*[\{\(\[\:]\s*$/);
              o && (r += n);
            }
            return r;
          });
        var e = { pass: 1, return: 1, raise: 1, break: 1, continue: 1 };
        (this.checkOutdent = function (t, n, r) {
          if (r !== "\r\n" && r !== "\r" && r !== "\n") return !1;
          var i = this.getTokenizer().getLineTokens(n.trim(), t).tokens;
          if (!i) return !1;
          do var s = i.pop();
          while (
            s &&
            (s.type == "comment" ||
              (s.type == "text" && s.value.match(/^\s+$/)))
          );
          return s ? s.type == "keyword" && e[s.value] : !1;
        }),
          (this.autoOutdent = function (e, t, n) {
            n += 1;
            var r = this.$getIndent(t.getLine(n)),
              i = t.getTabString();
            r.slice(-i.length) == i &&
              t.remove(new u(n, r.length - i.length, n, r.length));
          }),
          (this.$id = "ace/mode/sh");
      }.call(f.prototype),
      (t.Mode = f);
  }
),
  ace.define(
    "ace/mode/sh_highlight_rules",
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
        s = (t.reservedKeywords =
          "!|{|}|case|do|done|elif|else|esac|fi|for|if|in|then|until|while|&|;|export|local|read|typeset|unset|elif|select|set"),
        o = (t.languageConstructs =
          "[|]|alias|bg|bind|break|builtin|cd|command|compgen|complete|continue|dirs|disown|echo|enable|eval|exec|exit|fc|fg|getopts|hash|help|history|jobs|kill|let|logout|popd|printf|pushd|pwd|return|set|shift|shopt|source|suspend|test|times|trap|type|ulimit|umask|unalias|wait"),
        u = function () {
          var e = this.createKeywordMapper(
              {
                keyword: s,
                "support.function.builtin": o,
                "invalid.deprecated": "debugger",
              },
              "identifier"
            ),
            t = "(?:(?:[1-9]\\d*)|(?:0))",
            n = "(?:\\.\\d+)",
            r = "(?:\\d+)",
            i = "(?:(?:" + r + "?" + n + ")|(?:" + r + "\\.))",
            u = "(?:(?:" + i + "|" + r + ")" + ")",
            a = "(?:" + u + "|" + i + ")",
            f = "(?:&" + r + ")",
            l = "[a-zA-Z][a-zA-Z0-9_]*",
            c = "(?:(?:\\$" + l + ")|(?:" + l + "=))",
            h = "(?:\\$(?:SHLVL|\\$|\\!|\\?))",
            p = "(?:" + l + "\\s*\\(\\))";
          (this.$rules = {
            start: [
              { token: "constant", regex: /\\./ },
              { token: ["text", "comment"], regex: /(^|\s)(#.*)$/ },
              {
                token: "string",
                regex: '"',
                push: [
                  {
                    token: "constant.language.escape",
                    regex:
                      /\\(?:[$abeEfnrtv\\'"]|x[a-fA-F\d]{1,2}|u[a-fA-F\d]{4}([a-fA-F\d]{4})?|c.|\d{1,3})/,
                  },
                  { token: "constant", regex: /\$\w+/ },
                  { token: "string", regex: '"', next: "pop" },
                  { defaultToken: "string" },
                ],
              },
              { token: "variable.language", regex: h },
              { token: "variable", regex: c },
              { token: "support.function", regex: p },
              { token: "support.function", regex: f },
              { token: "string", start: "'", end: "'" },
              { token: "constant.numeric", regex: a },
              { token: "constant.numeric", regex: t + "\\b" },
              { token: e, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex: "\\+|\\-|\\*|\\*\\*|\\/|\\/\\/|~|<|>|<=|=>|=|!=",
              },
              { token: "paren.lparen", regex: "[\\[\\(\\{]" },
              { token: "paren.rparen", regex: "[\\]\\)\\}]" },
            ],
          }),
            this.normalizeRules();
        };
      r.inherits(u, i), (t.ShHighlightRules = u);
    }
  ),
  ace.define(
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
            (this.getFoldWidgetRange = function (e, t, n, r) {
              var i = e.getLine(n),
                s = i.match(this.foldingStartMarker);
              if (s) {
                var o = s.index;
                if (s[1]) return this.openingBracketBlock(e, s[1], n, o);
                var u = e.getCommentFoldRange(n, o + s[0].length, 1);
                return (
                  u &&
                    !u.isMultiLine() &&
                    (r
                      ? (u = this.getSectionRange(e, n))
                      : t != "all" && (u = null)),
                  u
                );
              }
              if (t === "markbegin") return;
              var s = i.match(this.foldingStopMarker);
              if (s) {
                var o = s.index + s[0].length;
                return s[1]
                  ? this.closingBracketBlock(e, s[1], n, o)
                  : e.getCommentFoldRange(n, o, -1);
              }
            }),
            (this.getSectionRange = function (e, t) {
              var n = e.getLine(t),
                r = n.search(/\S/),
                s = t,
                o = n.length;
              t += 1;
              var u = t,
                a = e.getLength();
              while (++t < a) {
                n = e.getLine(t);
                var f = n.search(/\S/);
                if (f === -1) continue;
                if (r > f) break;
                var l = this.getFoldWidgetRange(e, "all", t);
                if (l) {
                  if (l.start.row <= s) break;
                  if (l.isMultiLine()) t = l.end.row;
                  else if (r == f) break;
                }
                u = t;
              }
              return new i(s, o, u, e.getLine(u).length);
            });
        }.call(o.prototype);
    }
  );
