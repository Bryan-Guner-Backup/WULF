ace.define(
  "ace/mode/toml",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/toml_highlight_rules",
    "ace/mode/folding/ini",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./toml_highlight_rules").TomlHighlightRules,
      u = e("./folding/ini").FoldMode,
      a = function () {
        (this.HighlightRules = o), (this.foldingRules = new u());
      };
    r.inherits(a, i),
      function () {
        this.lineCommentStart = "#";
      }.call(a.prototype),
      (t.Mode = a);
  }
),
  ace.define(
    "ace/mode/toml_highlight_rules",
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
          var e = this.createKeywordMapper(
              { "constant.language.boolean": "true|false" },
              "identifier"
            ),
            t = "[a-zA-Z\\$_¡-￿][a-zA-Z\\d\\$_¡-￿]*\\b";
          this.$rules = {
            start: [
              { token: "comment.toml", regex: /#.*$/ },
              { token: "string", regex: '"(?=.)', next: "qqstring" },
              {
                token: ["variable.keygroup.toml"],
                regex: "(?:^\\s*)(\\[([^\\]]+)\\])",
              },
              { token: e, regex: t },
              {
                token: "support.date.toml",
                regex: "\\d{4}-\\d{2}-\\d{2}(T)\\d{2}:\\d{2}:\\d{2}(Z)",
              },
              { token: "constant.numeric.toml", regex: "-?\\d+(\\.?\\d+)?" },
            ],
            qqstring: [
              { token: "string", regex: "\\\\$", next: "qqstring" },
              { token: "constant.language.escape", regex: '\\\\[0tnr"\\\\]' },
              { token: "string", regex: '"|$', next: "start" },
              { defaultToken: "string" },
            ],
          };
        };
      r.inherits(s, i), (t.TomlHighlightRules = s);
    }
  ),
  ace.define(
    "ace/mode/folding/ini",
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
        o = (t.FoldMode = function () {});
      r.inherits(o, s),
        function () {
          (this.foldingStartMarker = /^\s*\[([^\])]*)]\s*(?:$|[;#])/),
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = this.foldingStartMarker,
                s = e.getLine(n),
                o = s.match(r);
              if (!o) return;
              var u = o[1] + ".",
                a = s.length,
                f = e.getLength(),
                l = n,
                c = n;
              while (++n < f) {
                s = e.getLine(n);
                if (/^\s*$/.test(s)) continue;
                o = s.match(r);
                if (o && o[1].lastIndexOf(u, 0) !== 0) break;
                c = n;
              }
              if (c > l) {
                var h = e.getLine(c).length;
                return new i(l, a, c, h);
              }
            });
        }.call(o.prototype);
    }
  );
