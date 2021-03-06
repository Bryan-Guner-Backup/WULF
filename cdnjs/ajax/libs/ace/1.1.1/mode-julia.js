define(
  "ace/mode/julia",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/julia_highlight_rules",
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./julia_highlight_rules").JuliaHighlightRules,
      u = e("./folding/cstyle").FoldMode,
      a = function () {
        var e = new o();
        (this.foldingRules = new u()), (this.$tokenizer = new s(e.getRules()));
      };
    r.inherits(a, i),
      function () {
        (this.lineCommentStart = "#"), (this.blockComment = "");
      }.call(a.prototype),
      (t.Mode = a);
  }
),
  define(
    "ace/mode/julia_highlight_rules",
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
              { include: "#function_decl" },
              { include: "#function_call" },
              { include: "#type_decl" },
              { include: "#keyword" },
              { include: "#operator" },
              { include: "#number" },
              { include: "#string" },
              { include: "#comment" },
            ],
            "#bracket": [
              {
                token: "keyword.bracket.julia",
                regex: "\\(|\\)|\\[|\\]|\\{|\\}|,",
              },
            ],
            "#comment": [
              {
                token: [
                  "punctuation.definition.comment.julia",
                  "comment.line.number-sign.julia",
                ],
                regex: "(#)(?!\\{)(.*$)",
              },
            ],
            "#function_call": [
              {
                token: ["support.function.julia", "text"],
                regex: "([a-zA-Z0-9_]+!?)(\\w*\\()",
              },
            ],
            "#function_decl": [
              {
                token: [
                  "keyword.other.julia",
                  "meta.function.julia",
                  "entity.name.function.julia",
                  "meta.function.julia",
                  "text",
                ],
                regex:
                  "(function|macro)(\\s*)([a-zA-Z0-9_\\{]+!?)(\\w*)([(\\\\{])",
              },
            ],
            "#keyword": [
              {
                token: "keyword.other.julia",
                regex:
                  "\\b(?:function|type|immutable|macro|quote|abstract|bitstype|typealias|module|baremodule|new)\\b",
              },
              {
                token: "keyword.control.julia",
                regex:
                  "\\b(?:if|else|elseif|while|for|in|begin|let|end|do|try|catch|finally|return|break|continue)\\b",
              },
              {
                token: "storage.modifier.variable.julia",
                regex:
                  "\\b(?:global|local|const|export|import|importall|using)\\b",
              },
              { token: "variable.macro.julia", regex: "@\\w+\\b" },
            ],
            "#number": [
              {
                token: "constant.numeric.julia",
                regex:
                  "\\b0(?:x|X)[0-9a-fA-F]*|(?:\\b[0-9]+\\.?[0-9]*|\\.[0-9]+)(?:(?:e|E)(?:\\+|-)?[0-9]*)?(?:im)?|\\bInf(?:32)?\\b|\\bNaN(?:32)?\\b|\\btrue\\b|\\bfalse\\b",
              },
            ],
            "#operator": [
              {
                token: "keyword.operator.update.julia",
                regex:
                  "=|:=|\\+=|-=|\\*=|/=|//=|\\.//=|\\.\\*=|\\\\=|\\.\\\\=|^=|\\.^=|%=|\\|=|&=|\\$=|<<=|>>=",
              },
              { token: "keyword.operator.ternary.julia", regex: "\\?|:" },
              { token: "keyword.operator.boolean.julia", regex: "\\|\\||&&|!" },
              { token: "keyword.operator.arrow.julia", regex: "->|<-|-->" },
              {
                token: "keyword.operator.relation.julia",
                regex:
                  ">|<|>=|<=|==|!=|\\.>|\\.<|\\.>=|\\.>=|\\.==|\\.!=|\\.=|\\.!|<:|:>",
              },
              { token: "keyword.operator.range.julia", regex: ":" },
              { token: "keyword.operator.shift.julia", regex: "<<|>>" },
              { token: "keyword.operator.bitwise.julia", regex: "\\||\\&|~" },
              {
                token: "keyword.operator.arithmetic.julia",
                regex:
                  "\\+|-|\\*|\\.\\*|/|\\./|//|\\.//|%|\\.%|\\\\|\\.\\\\|\\^|\\.\\^",
              },
              { token: "keyword.operator.isa.julia", regex: "::" },
              {
                token: "keyword.operator.dots.julia",
                regex: "\\.(?=[a-zA-Z])|\\.\\.+",
              },
              {
                token: "keyword.operator.interpolation.julia",
                regex: "\\$#?(?=.)",
              },
              {
                token: [
                  "variable",
                  "keyword.operator.transposed-variable.julia",
                ],
                regex: "(\\w+)((?:'|\\.')*\\.?')",
              },
              { token: "text", regex: "\\[|\\(" },
              {
                token: ["text", "keyword.operator.transposed-matrix.julia"],
                regex: "([\\]\\)])((?:'|\\.')*\\.?')",
              },
            ],
            "#string": [
              {
                token: "punctuation.definition.string.begin.julia",
                regex: "'",
                push: [
                  {
                    token: "punctuation.definition.string.end.julia",
                    regex: "'",
                    next: "pop",
                  },
                  { include: "#string_escaped_char" },
                  { defaultToken: "string.quoted.single.julia" },
                ],
              },
              {
                token: "punctuation.definition.string.begin.julia",
                regex: '"',
                push: [
                  {
                    token: "punctuation.definition.string.end.julia",
                    regex: '"',
                    next: "pop",
                  },
                  { include: "#string_escaped_char" },
                  { defaultToken: "string.quoted.double.julia" },
                ],
              },
              {
                token: "punctuation.definition.string.begin.julia",
                regex: '\\b\\w+"',
                push: [
                  {
                    token: "punctuation.definition.string.end.julia",
                    regex: '"\\w*',
                    next: "pop",
                  },
                  { include: "#string_custom_escaped_char" },
                  { defaultToken: "string.quoted.custom-double.julia" },
                ],
              },
              {
                token: "punctuation.definition.string.begin.julia",
                regex: "`",
                push: [
                  {
                    token: "punctuation.definition.string.end.julia",
                    regex: "`",
                    next: "pop",
                  },
                  { include: "#string_escaped_char" },
                  { defaultToken: "string.quoted.backtick.julia" },
                ],
              },
            ],
            "#string_custom_escaped_char": [
              { token: "constant.character.escape.julia", regex: '\\\\"' },
            ],
            "#string_escaped_char": [
              {
                token: "constant.character.escape.julia",
                regex:
                  "\\\\(?:\\\\|[0-3]\\d{,2}|[4-7]\\d?|x[a-fA-F0-9]{,2}|u[a-fA-F0-9]{,4}|U[a-fA-F0-9]{,8}|.)",
              },
            ],
            "#type_decl": [
              {
                token: [
                  "keyword.control.type.julia",
                  "meta.type.julia",
                  "entity.name.type.julia",
                  "entity.other.inherited-class.julia",
                  "punctuation.separator.inheritance.julia",
                  "entity.other.inherited-class.julia",
                ],
                regex:
                  "(type|immutable)(\\s+)([a-zA-Z0-9_]+)(?:(\\s*)(<:)(\\s*[.a-zA-Z0-9_:]+))?",
              },
              {
                token: ["other.typed-variable.julia", "support.type.julia"],
                regex: "([a-zA-Z0-9_]+)(::[a-zA-Z0-9_{}]+)",
              },
            ],
          }),
            this.normalizeRules();
        };
      (s.metaData = {
        fileTypes: ["jl"],
        firstLineMatch: "^#!.*\\bjulia\\s*$",
        foldingStartMarker:
          "^\\s*(?:if|while|for|begin|function|macro|module|baremodule|type|immutable|let)\\b(?!.*\\bend\\b).*$",
        foldingStopMarker: "^\\s*(?:end)\\b.*$",
        name: "Julia",
        scopeName: "source.julia",
      }),
        r.inherits(s, i),
        (t.JuliaHighlightRules = s);
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
