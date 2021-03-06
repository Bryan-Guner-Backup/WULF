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
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./toml_highlight_rules").TomlHighlightRules,
      u = e("./folding/cstyle").FoldMode,
      a = function () {
        var e = new o();
        (this.foldingRules = new u()), (this.$tokenizer = new s(e.getRules()));
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
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = e.getLine(n),
                i = r.match(this.foldingStartMarker);
              if (i) {
                var s = i.index;
                return i[1]
                  ? this.openingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s + i[0].length, 1);
              }
              if (t !== "markbeginend") return;
              var i = r.match(this.foldingStopMarker);
              if (i) {
                var s = i.index + i[0].length;
                return i[1]
                  ? this.closingBracketBlock(e, i[1], n, s)
                  : e.getCommentFoldRange(n, s, -1);
              }
            });
        }.call(o.prototype);
    }
  );
