define(
  "ace/mode/coffee",
  [
    "require",
    "exports",
    "module",
    "ace/tokenizer",
    "ace/mode/coffee_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/folding/coffee",
    "ace/range",
    "ace/mode/text",
    "ace/worker/worker_client",
    "ace/lib/oop",
  ],
  function (a, b, c) {
    function l() {
      (this.$tokenizer = new d(new e().getRules())),
        (this.$outdent = new f()),
        (this.foldingRules = new g());
    }
    var d = a("../tokenizer").Tokenizer,
      e = a("./coffee_highlight_rules").CoffeeHighlightRules,
      f = a("./matching_brace_outdent").MatchingBraceOutdent,
      g = a("./folding/coffee").FoldMode,
      h = a("../range").Range,
      i = a("./text").Mode,
      j = a("../worker/worker_client").WorkerClient,
      k = a("../lib/oop");
    k.inherits(l, i),
      function () {
        var a =
            /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/,
          b = /^(\s*)#/,
          c = /^\s*###(?!#)/,
          d = /^\s*/;
        (this.getNextLineIndent = function (b, c, d) {
          var e = this.$getIndent(c),
            f = this.$tokenizer.getLineTokens(c, b).tokens;
          return (
            (!f.length || f[f.length - 1].type !== "comment") &&
              b === "start" &&
              a.test(c) &&
              (e += d),
            e
          );
        }),
          (this.toggleCommentLines = function (a, e, f, g) {
            console.log("toggle");
            var i = new h(0, 0, 0, 0);
            for (var j = f; j <= g; ++j) {
              var k = e.getLine(j);
              if (c.test(k)) continue;
              b.test(k) ? (k = k.replace(b, "$1")) : (k = k.replace(d, "$&#")),
                (i.end.row = i.start.row = j),
                (i.end.column = k.length + 1),
                e.replace(i, k);
            }
          }),
          (this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c);
          }),
          (this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c);
          }),
          (this.createWorker = function (a) {
            var b = new j(["ace"], "ace/mode/coffee_worker", "Worker");
            return (
              b.attachToDocument(a.getDocument()),
              b.on("error", function (b) {
                a.setAnnotations([b.data]);
              }),
              b.on("ok", function (b) {
                a.clearAnnotations();
              }),
              b
            );
          });
      }.call(l.prototype),
      (b.Mode = l);
  }
),
  define(
    "ace/mode/coffee_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      function f() {
        var a = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",
          b = { token: "string", merge: !0, regex: ".+" },
          c =
            "this|throw|then|try|typeof|super|switch|return|break|by)|continue|catch|class|in|instanceof|is|isnt|if|else|extends|for|forown|finally|function|while|when|new|no|not|delete|debugger|do|loop|of|off|or|on|unless|until|and|yes",
          d = "true|false|null|undefined",
          e =
            "case|const|default|function|var|void|with|enum|export|implements|interface|let|package|private|protected|public|static|yield|__hasProp|extends|slice|bind|indexOf",
          f =
            "Array|Boolean|Date|Function|Number|Object|RegExp|ReferenceError|String|RangeError|SyntaxError|Error|EvalError|TypeError|URIError",
          g =
            "Math|JSON|isNaN|isFinite|parseInt|parseFloat|encodeURI|encodeURIComponent|decodeURI|decodeURIComponent|String|",
          h = this.createKeywordMapper(
            {
              keyword: c,
              "constant.language": d,
              "invalid.illegal": e,
              "language.support.class": f,
              "language.support.function": g,
            },
            "identifier"
          );
        this.$rules = {
          start: [
            { token: "identifier", regex: "(?:(?:\\.|::)\\s*)" + a },
            { token: "variable", regex: "@(?:" + a + ")?" },
            { token: h, regex: a },
            {
              token: "constant.numeric",
              regex:
                "(?:0x[\\da-fA-F]+|(?:\\d+(?:\\.\\d+)?|\\.\\d+)(?:[eE][+-]?\\d+)?)",
            },
            { token: "string", merge: !0, regex: "'''", next: "qdoc" },
            { token: "string", merge: !0, regex: '"""', next: "qqdoc" },
            { token: "string", merge: !0, regex: "'", next: "qstring" },
            { token: "string", merge: !0, regex: '"', next: "qqstring" },
            { token: "string", merge: !0, regex: "`", next: "js" },
            { token: "string.regex", merge: !0, regex: "///", next: "heregex" },
            {
              token: "string.regex",
              regex:
                "/(?!\\s)[^[/\\n\\\\]*(?: (?:\\\\.|\\[[^\\]\\n\\\\]*(?:\\\\.[^\\]\\n\\\\]*)*\\])[^[/\\n\\\\]*)*/[imgy]{0,4}(?!\\w)",
            },
            { token: "comment", merge: !0, regex: "###(?!#)", next: "comment" },
            { token: "comment", regex: "#.*" },
            { token: "punctuation.operator", regex: "\\?|\\:|\\,|\\." },
            {
              token: "keyword.operator",
              regex:
                "(?:[\\-=]>|[-+*/%<>&|^!?=]=|>>>=?|\\-\\-|\\+\\+|::|&&=|\\|\\|=|<<=|>>=|\\?\\.|\\.{2,3}|[!*+-=><])",
            },
            { token: "paren.lparen", regex: "[({[]" },
            { token: "paren.rparen", regex: "[\\]})]" },
            { token: "text", regex: "\\s+" },
          ],
          qdoc: [{ token: "string", regex: ".*?'''", next: "start" }, b],
          qqdoc: [{ token: "string", regex: '.*?"""', next: "start" }, b],
          qstring: [
            {
              token: "string",
              regex: "[^\\\\']*(?:\\\\.[^\\\\']*)*'",
              merge: !0,
              next: "start",
            },
            b,
          ],
          qqstring: [
            {
              token: "string",
              regex: '[^\\\\"]*(?:\\\\.[^\\\\"]*)*"',
              merge: !0,
              next: "start",
            },
            b,
          ],
          js: [
            {
              token: "string",
              merge: !0,
              regex: "[^\\\\`]*(?:\\\\.[^\\\\`]*)*`",
              next: "start",
            },
            b,
          ],
          heregex: [
            {
              token: "string.regex",
              regex: ".*?///[imgy]{0,4}",
              next: "start",
            },
            { token: "comment.regex", regex: "\\s+(?:#.*)?" },
            { token: "string.regex", merge: !0, regex: "\\S+" },
          ],
          comment: [
            { token: "comment", regex: ".*?###", next: "start" },
            { token: "comment", merge: !0, regex: ".+" },
          ],
        };
      }
      var d = a("../lib/oop"),
        e = a("./text_highlight_rules").TextHighlightRules;
      d.inherits(f, e), (b.CoffeeHighlightRules = f);
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
    "ace/mode/folding/coffee",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
      "ace/range",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("./fold_mode").FoldMode,
        f = a("../../range").Range,
        g = (b.FoldMode = function () {});
      d.inherits(g, e),
        function () {
          (this.getFoldWidgetRange = function (a, b, c) {
            var d = this.indentationBlock(a, c);
            if (d) return d;
            var e = /\S/,
              g = a.getLine(c),
              h = g.search(e);
            if (h == -1 || g[h] != "#") return;
            var i = g.length,
              j = a.getLength(),
              k = c,
              l = c;
            while (++c < j) {
              g = a.getLine(c);
              var m = g.search(e);
              if (m == -1) continue;
              if (g[m] != "#") break;
              l = c;
            }
            if (l > k) {
              var n = a.getLine(l).length;
              return new f(k, i, l, n);
            }
          }),
            (this.getFoldWidget = function (a, b, c) {
              var d = a.getLine(c),
                e = d.search(/\S/),
                f = a.getLine(c + 1),
                g = a.getLine(c - 1),
                h = g.search(/\S/),
                i = f.search(/\S/);
              if (e == -1)
                return (
                  (a.foldWidgets[c - 1] = h != -1 && h < i ? "start" : ""), ""
                );
              if (h == -1) {
                if (e == i && d[e] == "#" && f[e] == "#")
                  return (
                    (a.foldWidgets[c - 1] = ""),
                    (a.foldWidgets[c + 1] = ""),
                    "start"
                  );
              } else if (
                h == e &&
                d[e] == "#" &&
                g[e] == "#" &&
                a.getLine(c - 2).search(/\S/) == -1
              )
                return (
                  (a.foldWidgets[c - 1] = "start"),
                  (a.foldWidgets[c + 1] = ""),
                  ""
                );
              return (
                h != -1 && h < e
                  ? (a.foldWidgets[c - 1] = "start")
                  : (a.foldWidgets[c - 1] = ""),
                e < i ? "start" : ""
              );
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
  );
