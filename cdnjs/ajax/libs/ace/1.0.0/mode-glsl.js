define(
  "ace/mode/glsl",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/c_cpp",
    "ace/tokenizer",
    "ace/mode/glsl_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
    "ace/mode/behaviour/cstyle",
    "ace/mode/folding/cstyle",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./c_cpp").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./glsl_highlight_rules").glslHighlightRules,
      h = a("./matching_brace_outdent").MatchingBraceOutdent,
      i = a("../range").Range,
      j = a("./behaviour/cstyle").CstyleBehaviour,
      k = a("./folding/cstyle").FoldMode,
      l = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h()),
          (this.$behaviour = new j()),
          (this.foldingRules = new k());
      };
    d.inherits(l, e), (b.Mode = l);
  }
),
  define(
    "ace/mode/c_cpp",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/tokenizer",
      "ace/mode/c_cpp_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/range",
      "ace/mode/behaviour/cstyle",
      "ace/mode/folding/cstyle",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./text").Mode,
        f = a("../tokenizer").Tokenizer,
        g = a("./c_cpp_highlight_rules").c_cppHighlightRules,
        h = a("./matching_brace_outdent").MatchingBraceOutdent,
        i = a("../range").Range,
        j = a("./behaviour/cstyle").CstyleBehaviour,
        k = a("./folding/cstyle").FoldMode,
        l = function () {
          (this.$tokenizer = new f(new g().getRules())),
            (this.$outdent = new h()),
            (this.$behaviour = new j()),
            (this.foldingRules = new k());
        };
      d.inherits(l, e),
        function () {
          (this.toggleCommentLines = function (a, b, c, d) {
            var e = !0,
              f = /^(\s*)\/\//;
            for (var g = c; g <= d; g++)
              if (!f.test(b.getLine(g))) {
                e = !1;
                break;
              }
            if (e) {
              var h = new i(0, 0, 0, 0);
              for (var g = c; g <= d; g++) {
                var j = b.getLine(g),
                  k = j.match(f);
                (h.start.row = g),
                  (h.end.row = g),
                  (h.end.column = k[0].length),
                  b.replace(h, k[1]);
              }
            } else b.indentRows(c, d, "//");
          }),
            (this.getNextLineIndent = function (a, b, c) {
              var d = this.$getIndent(b),
                e = this.$tokenizer.getLineTokens(b, a),
                f = e.tokens,
                g = e.state;
              if (f.length && f[f.length - 1].type == "comment") return d;
              if (a == "start") {
                var h = b.match(/^.*[\{\(\[]\s*$/);
                h && (d += c);
              } else if (a == "doc-start") {
                if (g == "start") return "";
                var h = b.match(/^\s*(\/?)\*/);
                h && (h[1] && (d += " "), (d += "* "));
              }
              return d;
            }),
            (this.checkOutdent = function (a, b, c) {
              return this.$outdent.checkOutdent(b, c);
            }),
            (this.autoOutdent = function (a, b, c) {
              this.$outdent.autoOutdent(b, c);
            });
        }.call(l.prototype),
        (b.Mode = l);
    }
  ),
  define(
    "ace/mode/c_cpp_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./doc_comment_highlight_rules").DocCommentHighlightRules,
        f = a("./text_highlight_rules").TextHighlightRules,
        g = (b.cFunctions =
          "\\s*\\bhypot(?:f|l)?|s(?:scanf|ystem|nprintf|ca(?:nf|lb(?:n(?:f|l)?|ln(?:f|l)?))|i(?:n(?:h(?:f|l)?|f|l)?|gn(?:al|bit))|tr(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?)|error|pbrk|ftime|len|rchr|xfrm)|printf|et(?:jmp|vbuf|locale|buf)|qrt(?:f|l)?|w(?:scanf|printf)|rand)|n(?:e(?:arbyint(?:f|l)?|xt(?:toward(?:f|l)?|after(?:f|l)?))|an(?:f|l)?)|c(?:s(?:in(?:h(?:f|l)?|f|l)?|qrt(?:f|l)?)|cos(?:h(?:f)?|f|l)?|imag(?:f|l)?|t(?:ime|an(?:h(?:f|l)?|f|l)?)|o(?:s(?:h(?:f|l)?|f|l)?|nj(?:f|l)?|pysign(?:f|l)?)|p(?:ow(?:f|l)?|roj(?:f|l)?)|e(?:il(?:f|l)?|xp(?:f|l)?)|l(?:o(?:ck|g(?:f|l)?)|earerr)|a(?:sin(?:h(?:f|l)?|f|l)?|cos(?:h(?:f|l)?|f|l)?|tan(?:h(?:f|l)?|f|l)?|lloc|rg(?:f|l)?|bs(?:f|l)?)|real(?:f|l)?|brt(?:f|l)?)|t(?:ime|o(?:upper|lower)|an(?:h(?:f|l)?|f|l)?|runc(?:f|l)?|gamma(?:f|l)?|mp(?:nam|file))|i(?:s(?:space|n(?:ormal|an)|cntrl|inf|digit|u(?:nordered|pper)|p(?:unct|rint)|finite|w(?:space|c(?:ntrl|type)|digit|upper|p(?:unct|rint)|lower|al(?:num|pha)|graph|xdigit|blank)|l(?:ower|ess(?:equal|greater)?)|al(?:num|pha)|gr(?:eater(?:equal)?|aph)|xdigit|blank)|logb(?:f|l)?|max(?:div|abs))|di(?:v|fftime)|_Exit|unget(?:c|wc)|p(?:ow(?:f|l)?|ut(?:s|c(?:har)?|wc(?:har)?)|error|rintf)|e(?:rf(?:c(?:f|l)?|f|l)?|x(?:it|p(?:2(?:f|l)?|f|l|m1(?:f|l)?)?))|v(?:s(?:scanf|nprintf|canf|printf|w(?:scanf|printf))|printf|f(?:scanf|printf|w(?:scanf|printf))|w(?:scanf|printf)|a_(?:start|copy|end|arg))|qsort|f(?:s(?:canf|e(?:tpos|ek))|close|tell|open|dim(?:f|l)?|p(?:classify|ut(?:s|c|w(?:s|c))|rintf)|e(?:holdexcept|set(?:e(?:nv|xceptflag)|round)|clearexcept|testexcept|of|updateenv|r(?:aiseexcept|ror)|get(?:e(?:nv|xceptflag)|round))|flush|w(?:scanf|ide|printf|rite)|loor(?:f|l)?|abs(?:f|l)?|get(?:s|c|pos|w(?:s|c))|re(?:open|e|ad|xp(?:f|l)?)|m(?:in(?:f|l)?|od(?:f|l)?|a(?:f|l|x(?:f|l)?)?))|l(?:d(?:iv|exp(?:f|l)?)|o(?:ngjmp|cal(?:time|econv)|g(?:1(?:p(?:f|l)?|0(?:f|l)?)|2(?:f|l)?|f|l|b(?:f|l)?)?)|abs|l(?:div|abs|r(?:int(?:f|l)?|ound(?:f|l)?))|r(?:int(?:f|l)?|ound(?:f|l)?)|gamma(?:f|l)?)|w(?:scanf|c(?:s(?:s(?:tr|pn)|nc(?:py|at|mp)|c(?:spn|hr|oll|py|at|mp)|to(?:imax|d|u(?:l(?:l)?|max)|k|f|l(?:d|l)?|mbs)|pbrk|ftime|len|r(?:chr|tombs)|xfrm)|to(?:b|mb)|rtomb)|printf|mem(?:set|c(?:hr|py|mp)|move))|a(?:s(?:sert|ctime|in(?:h(?:f|l)?|f|l)?)|cos(?:h(?:f|l)?|f|l)?|t(?:o(?:i|f|l(?:l)?)|exit|an(?:h(?:f|l)?|2(?:f|l)?|f|l)?)|b(?:s|ort))|g(?:et(?:s|c(?:har)?|env|wc(?:har)?)|mtime)|r(?:int(?:f|l)?|ound(?:f|l)?|e(?:name|alloc|wind|m(?:ove|quo(?:f|l)?|ainder(?:f|l)?))|a(?:nd|ise))|b(?:search|towc)|m(?:odf(?:f|l)?|em(?:set|c(?:hr|py|mp)|move)|ktime|alloc|b(?:s(?:init|towcs|rtowcs)|towc|len|r(?:towc|len)))\\b"),
        h = function () {
          var a =
              "break|case|continue|default|do|else|for|goto|if|_Pragma|return|switch|while|catch|operator|try|throw|using",
            b =
              "asm|__asm__|auto|bool|_Bool|char|_Complex|double|enum|float|_Imaginary|int|long|short|signed|struct|typedef|union|unsigned|voidclass|wchar_t|template",
            c =
              "const|extern|register|restrict|static|volatile|inline|private:|protected:|public:|friend|explicit|virtual|export|mutable|typename",
            d =
              "and|and_eq|bitand|bitor|compl|not|not_eq|or|or_eq|typeid|xor|xor_eqconst_cast|dynamic_cast|reinterpret_cast|static_cast|sizeof|namespace",
            f = "NULL|true|false|TRUE|FALSE",
            h = this.createKeywordMapper(
              {
                "keyword.control": a,
                "storage.type": b,
                "storage.modifier": c,
                "keyword.operator": d,
                "variable.language": "this",
                "constant.language": f,
              },
              "identifier"
            ),
            i = "[a-zA-Z\\$_??-???][a-zA-Zd\\$_??-???]*\\b";
          (this.$rules = {
            start: [
              { token: "comment", regex: "\\/\\/.*$" },
              e.getStartRule("doc-start"),
              { token: "comment", merge: !0, regex: "\\/\\*", next: "comment" },
              { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
              {
                token: "string",
                merge: !0,
                regex: '["].*\\\\$',
                next: "qqstring",
              },
              { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
              {
                token: "string",
                merge: !0,
                regex: "['].*\\\\$",
                next: "qstring",
              },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              { token: "constant", regex: "<[a-zA-Z0-9.]+>" },
              {
                token: "keyword",
                regex:
                  "(?:#include|#pragma|#line|#define|#undef|#ifdef|#else|#elif|#endif|#ifndef)",
              },
              { token: "support.function.C99.c", regex: g },
              {
                token: ["text", "entity.name.function", "text", "paren.lparen"],
                regex: "(\\s+)(" + i + ")(\\s*)(\\()",
              },
              { token: h, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex:
                  "!|\\$|%|&|\\*|\\-\\-|\\-|\\+\\+|\\+|~|==|=|!=|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\\|\\||\\?\\:|\\*=|%=|\\+=|\\-=|&=|\\^=|\\b(?:in|new|delete|typeof|void)",
              },
              { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\;|\\." },
              { token: "paren.lparen", regex: "[[({]" },
              { token: "paren.rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: ".*?\\*\\/", next: "start" },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qqstring: [
              {
                token: "string",
                regex: '(?:(?:\\\\.)|(?:[^"\\\\]))*?"',
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring: [
              {
                token: "string",
                regex: "(?:(?:\\\\.)|(?:[^'\\\\]))*?'",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
          }),
            this.embedRules(e, "doc-", [e.getEndRule("start")]);
        };
      d.inherits(h, f), (b.c_cppHighlightRules = h);
    }
  ),
  define(
    "ace/mode/doc_comment_highlight_rules",
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
          this.$rules = {
            start: [
              { token: "comment.doc.tag", regex: "@[\\w\\d_]+" },
              { token: "comment.doc", merge: !0, regex: "\\s+" },
              { token: "comment.doc", merge: !0, regex: "TODO" },
              { token: "comment.doc", merge: !0, regex: "[^@\\*]+" },
              { token: "comment.doc", merge: !0, regex: "." },
            ],
          };
        };
      d.inherits(f, e),
        (f.getStartRule = function (a) {
          return {
            token: "comment.doc",
            merge: !0,
            regex: "\\/\\*(?=\\*)",
            next: a,
          };
        }),
        (f.getEndRule = function (a) {
          return { token: "comment.doc", merge: !0, regex: "\\*\\/", next: a };
        }),
        (b.DocCommentHighlightRules = f);
    }
  ),
  define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("../range").Range,
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
  ),
  define(
    "ace/mode/behaviour/cstyle",
    ["require", "exports", "module", "ace/lib/oop", "ace/mode/behaviour"],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../behaviour").Behaviour,
        f = function () {
          this.add("braces", "insertion", function (a, b, c, d, e) {
            if (e == "{") {
              var f = c.getSelectionRange(),
                g = d.doc.getTextRange(f);
              return g !== ""
                ? { text: "{" + g + "}", selection: !1 }
                : { text: "{}", selection: [1, 1] };
            }
            if (e == "}") {
              var h = c.getCursorPosition(),
                i = d.doc.getLine(h.row),
                j = i.substring(h.column, h.column + 1);
              if (j == "}") {
                var k = d.$findOpeningBracket("}", {
                  column: h.column + 1,
                  row: h.row,
                });
                if (k !== null) return { text: "", selection: [1, 1] };
              }
            } else if (e == "\n") {
              var h = c.getCursorPosition(),
                i = d.doc.getLine(h.row),
                j = i.substring(h.column, h.column + 1);
              if (j == "}") {
                var l = d.findMatchingBracket({
                  row: h.row,
                  column: h.column + 1,
                });
                if (!l) return null;
                var m = this.getNextLineIndent(
                    a,
                    i.substring(0, i.length - 1),
                    d.getTabString()
                  ),
                  n = this.$getIndent(d.doc.getLine(l.row));
                return {
                  text: "\n" + m + "\n" + n,
                  selection: [1, m.length, 1, m.length],
                };
              }
            }
          }),
            this.add("braces", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "{") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.end.column, e.end.column + 1);
                if (h == "}") return e.end.column++, e;
              }
            }),
            this.add("parens", "insertion", function (a, b, c, d, e) {
              if (e == "(") {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                return g !== ""
                  ? { text: "(" + g + ")", selection: !1 }
                  : { text: "()", selection: [1, 1] };
              }
              if (e == ")") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column, h.column + 1);
                if (j == ")") {
                  var k = d.$findOpeningBracket(")", {
                    column: h.column + 1,
                    row: h.row,
                  });
                  if (k !== null) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("parens", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "(") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == ")") return e.end.column++, e;
              }
            }),
            this.add("brackets", "insertion", function (a, b, c, d, e) {
              if (e == "[") {
                var f = c.getSelectionRange(),
                  g = d.doc.getTextRange(f);
                return g !== ""
                  ? { text: "[" + g + "]", selection: !1 }
                  : { text: "[]", selection: [1, 1] };
              }
              if (e == "]") {
                var h = c.getCursorPosition(),
                  i = d.doc.getLine(h.row),
                  j = i.substring(h.column, h.column + 1);
                if (j == "]") {
                  var k = d.$findOpeningBracket("]", {
                    column: h.column + 1,
                    row: h.row,
                  });
                  if (k !== null) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("brackets", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && f == "[") {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == "]") return e.end.column++, e;
              }
            }),
            this.add("string_dquotes", "insertion", function (a, b, c, d, e) {
              if (e == '"' || e == "'") {
                var f = e,
                  g = c.getSelectionRange(),
                  h = d.doc.getTextRange(g);
                if (h !== "") return { text: f + h + f, selection: !1 };
                var i = c.getCursorPosition(),
                  j = d.doc.getLine(i.row),
                  k = j.substring(i.column - 1, i.column);
                if (k == "\\") return null;
                var l = d.getTokens(g.start.row),
                  m = 0,
                  n,
                  o = -1;
                for (var p = 0; p < l.length; p++) {
                  (n = l[p]),
                    n.type == "string"
                      ? (o = -1)
                      : o < 0 && (o = n.value.indexOf(f));
                  if (n.value.length + m > g.start.column) break;
                  m += l[p].value.length;
                }
                if (
                  !n ||
                  (o < 0 &&
                    n.type !== "comment" &&
                    (n.type !== "string" ||
                      (g.start.column !== n.value.length + m - 1 &&
                        n.value.lastIndexOf(f) === n.value.length - 1)))
                )
                  return { text: f + f, selection: [1, 1] };
                if (n && n.type === "string") {
                  var q = j.substring(i.column, i.column + 1);
                  if (q == f) return { text: "", selection: [1, 1] };
                }
              }
            }),
            this.add("string_dquotes", "deletion", function (a, b, c, d, e) {
              var f = d.doc.getTextRange(e);
              if (!e.isMultiLine() && (f == '"' || f == "'")) {
                var g = d.doc.getLine(e.start.row),
                  h = g.substring(e.start.column + 1, e.start.column + 2);
                if (h == '"') return e.end.column++, e;
              }
            });
        };
      d.inherits(f, e), (b.CstyleBehaviour = f);
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
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../../range").Range,
        f = a("./fold_mode").FoldMode,
        g = (b.FoldMode = function () {});
      d.inherits(g, f),
        function () {
          (this.foldingStartMarker = /(\{|\[)[^\}\]]*$|^\s*(\/\*)/),
            (this.foldingStopMarker = /^[^\[\{]*(\}|\])|^[\s\*]*(\*\/)/),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = a.getLine(c),
                f = d.match(this.foldingStartMarker);
              if (f) {
                var g = f.index;
                if (f[1]) return this.openingBracketBlock(a, f[1], c, g);
                var h = a.getCommentFoldRange(c, g + f[0].length);
                return (h.end.column -= 2), h;
              }
              if (b !== "markbeginend") return;
              var f = d.match(this.foldingStopMarker);
              if (f) {
                var g = f.index + f[0].length;
                if (f[2]) {
                  var h = a.getCommentFoldRange(c, g);
                  return (h.end.column -= 2), h;
                }
                var i = { row: c, column: g },
                  j = a.$findOpeningBracket(f[1], i);
                if (!j) return;
                return j.column++, i.column--, e.fromPoints(j, i);
              }
            });
        }.call(g.prototype);
    }
  ),
  define(
    "ace/mode/folding/fold_mode",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("../../range").Range,
        e = (b.FoldMode = function () {});
      (function () {
        (this.foldingStartMarker = null),
          (this.foldingStopMarker = null),
          (this.getFoldWidget = function (a, b, c) {
            var d = a.getLine(c);
            return this.foldingStartMarker.test(d)
              ? "start"
              : b == "markbeginend" &&
                this.foldingStopMarker &&
                this.foldingStopMarker.test(d)
              ? "end"
              : "";
          }),
          (this.getFoldWidgetRange = function (a, b, c) {
            return null;
          }),
          (this.indentationBlock = function (a, b, c) {
            var e = /\S/,
              f = a.getLine(b),
              g = f.search(e);
            if (g == -1) return;
            var h = c || f.length,
              i = a.getLength(),
              j = b,
              k = b;
            while (++b < i) {
              var l = a.getLine(b).search(e);
              if (l == -1) continue;
              if (l <= g) break;
              k = b;
            }
            if (k > j) {
              var m = a.getLine(k).length;
              return new d(j, h, k, m);
            }
          }),
          (this.openingBracketBlock = function (a, b, c, e, f) {
            var g = { row: c, column: e + 1 },
              h = a.$findClosingBracket(b, g, f);
            if (!h) return;
            var i = a.foldWidgets[h.row];
            return (
              i == null && (i = this.getFoldWidget(a, h.row)),
              i == "start" &&
                h.row > g.row &&
                (h.row--, (h.column = a.getLine(h.row).length)),
              d.fromPoints(g, h)
            );
          });
      }.call(e.prototype));
    }
  ),
  define(
    "ace/mode/glsl_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/c_cpp_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./c_cpp_highlight_rules").c_cppHighlightRules,
        f = function () {
          var a =
              "attribute|const|uniform|varying|break|continue|do|for|while|if|else|in|out|inout|float|int|void|bool|true|false|lowp|mediump|highp|precision|invariant|discard|return|mat2|mat3|mat4|vec2|vec3|vec4|ivec2|ivec3|ivec4|bvec2|bvec3|bvec4|sampler2D|samplerCube|struct",
            b =
              "radians|degrees|sin|cos|tan|asin|acos|atan|pow|exp|log|exp2|log2|sqrt|inversesqrt|abs|sign|floor|ceil|fract|mod|min|max|clamp|mix|step|smoothstep|length|distance|dot|cross|normalize|faceforward|reflect|refract|matrixCompMult|lessThan|lessThanEqual|greaterThan|greaterThanEqual|equal|notEqual|any|all|not|dFdx|dFdy|fwidth|texture2D|texture2DProj|texture2DLod|texture2DProjLod|textureCube|textureCubeLod|gl_MaxVertexAttribs|gl_MaxVertexUniformVectors|gl_MaxVaryingVectors|gl_MaxVertexTextureImageUnits|gl_MaxCombinedTextureImageUnits|gl_MaxTextureImageUnits|gl_MaxFragmentUniformVectors|gl_MaxDrawBuffers|gl_DepthRangeParameters|gl_DepthRange|gl_Position|gl_PointSize|gl_FragCoord|gl_FrontFacing|gl_PointCoord|gl_FragColor|gl_FragData",
            c = this.createKeywordMapper(
              {
                "variable.language": "this",
                keyword: a,
                "constant.language": b,
              },
              "identifier"
            );
          (this.$rules = new e().$rules),
            this.$rules.start.forEach(function (a) {
              typeof a.token == "function" && (a.token = c);
            });
        };
      d.inherits(f, e), (b.glslHighlightRules = f);
    }
  );
