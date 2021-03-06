ace.define(
  "ace/mode/batchfile",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/batchfile_highlight_rules",
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./batchfile_highlight_rules").BatchFileHighlightRules,
      u = e("./folding/cstyle").FoldMode,
      a = function () {
        var e = new o();
        (this.foldingRules = new u()), (this.$tokenizer = new s(e.getRules()));
      };
    r.inherits(a, i),
      function () {
        (this.lineCommentStart = "::"), (this.blockComment = "");
      }.call(a.prototype),
      (t.Mode = a);
  }
),
  ace.define(
    "ace/mode/batchfile_highlight_rules",
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
                token: "keyword.command.dosbatch",
                regex:
                  "\\b(?:append|assoc|at|attrib|break|cacls|cd|chcp|chdir|chkdsk|chkntfs|cls|cmd|color|comp|compact|convert|copy|date|del|dir|diskcomp|diskcopy|doskey|echo|endlocal|erase|fc|find|findstr|format|ftype|graftabl|help|keyb|label|md|mkdir|mode|more|move|path|pause|popd|print|prompt|pushd|rd|recover|ren|rename|replace|restore|rmdir|set|setlocal|shift|sort|start|subst|time|title|tree|type|ver|verify|vol|xcopy)\\b",
                caseInsensitive: !0,
              },
              {
                token: "keyword.control.statement.dosbatch",
                regex: "\\b(?:goto|call|exit)\\b",
                caseInsensitive: !0,
              },
              {
                token: "keyword.control.conditional.if.dosbatch",
                regex:
                  "\\bif\\s+not\\s+(?:exist|defined|errorlevel|cmdextversion)\\b",
                caseInsensitive: !0,
              },
              {
                token: "keyword.control.conditional.dosbatch",
                regex: "\\b(?:if|else)\\b",
                caseInsensitive: !0,
              },
              {
                token: "keyword.control.repeat.dosbatch",
                regex: "\\bfor\\b",
                caseInsensitive: !0,
              },
              {
                token: "keyword.operator.dosbatch",
                regex: "\\b(?:EQU|NEQ|LSS|LEQ|GTR|GEQ)\\b",
              },
              {
                token: ["doc.comment", "comment"],
                regex: "(?:^|\\b)(rem)($|\\s.*$)",
                caseInsensitive: !0,
              },
              { token: "comment.line.colons.dosbatch", regex: "::.*$" },
              { include: "variable" },
              {
                token: "punctuation.definition.string.begin.shell",
                regex: '"',
                push: [
                  {
                    token: "punctuation.definition.string.end.shell",
                    regex: '"',
                    next: "pop",
                  },
                  { include: "variable" },
                  { defaultToken: "string.quoted.double.dosbatch" },
                ],
              },
              { token: "keyword.operator.pipe.dosbatch", regex: "[|]" },
              {
                token: "keyword.operator.redirect.shell",
                regex: "&>|\\d*>&\\d*|\\d*(?:>>|>|<)|\\d*<&|\\d*<>",
              },
            ],
            variable: [
              { token: "constant.numeric", regex: "%%\\w+" },
              {
                token: ["markup.list", "constant.other", "markup.list"],
                regex: "(%)(\\w+)(%?)",
              },
            ],
          }),
            this.normalizeRules();
        };
      (s.metaData = {
        name: "Batch File",
        scopeName: "source.dosbatch",
        fileTypes: ["bat"],
      }),
        r.inherits(s, i),
        (t.BatchFileHighlightRules = s);
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
