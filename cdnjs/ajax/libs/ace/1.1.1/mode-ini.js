define(
  "ace/mode/ini",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/ini_highlight_rules",
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./ini_highlight_rules").IniHighlightRules,
      u = e("./folding/cstyle").FoldMode,
      a = function () {
        var e = new o();
        (this.foldingRules = new u()), (this.$tokenizer = new s(e.getRules()));
      };
    r.inherits(a, i),
      function () {
        (this.lineCommentStart = ";"),
          (this.blockComment = { start: "/*", end: "*/" });
      }.call(a.prototype),
      (t.Mode = a);
  }
),
  define(
    "ace/mode/ini_highlight_rules",
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
          (this.$rules = {
            start: [
              {
                token: "punctuation.definition.comment.ini",
                regex: "#.*",
                push_: [
                  {
                    token: "comment.line.number-sign.ini",
                    regex: "$",
                    next: "pop",
                  },
                  { defaultToken: "comment.line.number-sign.ini" },
                ],
              },
              {
                token: "punctuation.definition.comment.ini",
                regex: ";.*",
                push_: [
                  {
                    token: "comment.line.semicolon.ini",
                    regex: "$",
                    next: "pop",
                  },
                  { defaultToken: "comment.line.semicolon.ini" },
                ],
              },
              {
                token: [
                  "keyword.other.definition.ini",
                  "text",
                  "punctuation.separator.key-value.ini",
                ],
                regex: "\\b([a-zA-Z0-9_.-]+)\\b(\\s*)(=)",
              },
              {
                token: [
                  "punctuation.definition.entity.ini",
                  "constant.section.group-title.ini",
                  "punctuation.definition.entity.ini",
                ],
                regex: "^(\\[)(.*?)(\\])",
              },
              {
                token: "punctuation.definition.string.begin.ini",
                regex: "'",
                push: [
                  {
                    token: "punctuation.definition.string.end.ini",
                    regex: "'",
                    next: "pop",
                  },
                  { token: "constant.character.escape.ini", regex: "\\\\." },
                  { defaultToken: "string.quoted.single.ini" },
                ],
              },
              {
                token: "punctuation.definition.string.begin.ini",
                regex: '"',
                push: [
                  {
                    token: "punctuation.definition.string.end.ini",
                    regex: '"',
                    next: "pop",
                  },
                  { defaultToken: "string.quoted.double.ini" },
                ],
              },
            ],
          }),
            this.normalizeRules();
        };
      (s.metaData = {
        fileTypes: ["ini", "conf"],
        keyEquivalent: "^~I",
        name: "Ini",
        scopeName: "source.ini",
      }),
        r.inherits(s, i),
        (t.IniHighlightRules = s);
    }
  ),
  define(
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
