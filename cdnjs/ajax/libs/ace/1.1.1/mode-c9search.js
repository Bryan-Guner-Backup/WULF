define(
  "ace/mode/c9search",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/c9search_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/folding/c9search",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./c9search_highlight_rules").C9SearchHighlightRules,
      u = e("./matching_brace_outdent").MatchingBraceOutdent,
      a = e("./folding/c9search").FoldMode,
      f = function () {
        (this.$tokenizer = new s(new o().getRules())),
          (this.$outdent = new u()),
          (this.foldingRules = new a());
      };
    r.inherits(f, i),
      function () {
        (this.getNextLineIndent = function (e, t, n) {
          var r = this.$getIndent(t);
          return r;
        }),
          (this.checkOutdent = function (e, t, n) {
            return this.$outdent.checkOutdent(t, n);
          }),
          (this.autoOutdent = function (e, t, n) {
            this.$outdent.autoOutdent(t, n);
          });
      }.call(f.prototype),
      (t.Mode = f);
  }
),
  define(
    "ace/mode/c9search_highlight_rules",
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
          this.$rules = {
            start: [
              {
                token: [
                  "c9searchresults.constant.numeric",
                  "c9searchresults.text",
                  "c9searchresults.text",
                ],
                regex: "(^\\s+[0-9]+)(:\\s*)(.+)",
              },
              { token: ["string", "text"], regex: "(.+)(:$)" },
            ],
          };
        };
      r.inherits(s, i), (t.C9SearchHighlightRules = s);
    }
  ),
  define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (e, t, n) {
      var r = e("../range").Range,
        i = function () {};
      (function () {
        (this.checkOutdent = function (e, t) {
          return /^\s+$/.test(e) ? /^\s*\}/.test(t) : !1;
        }),
          (this.autoOutdent = function (e, t) {
            var n = e.getLine(t),
              i = n.match(/^(\s*\})/);
            if (!i) return 0;
            var s = i[1].length,
              o = e.findMatchingBracket({ row: t, column: s });
            if (!o || o.row == t) return 0;
            var u = this.$getIndent(e.getLine(o.row));
            e.replace(new r(t, 0, t, s - 1), u);
          }),
          (this.$getIndent = function (e) {
            return e.match(/^\s*/)[0];
          });
      }.call(i.prototype),
        (t.MatchingBraceOutdent = i));
    }
  ),
  define(
    "ace/mode/folding/c9search",
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
          (this.foldingStartMarker = /^(\S.*\:|Searching for.*)$/),
            (this.foldingStopMarker = /^(\s+|Found.*)$/),
            (this.getFoldWidgetRange = function (e, t, n) {
              var r = e.doc.getAllLines(n),
                s = r[n],
                o = /^(Found.*|Searching for.*)$/,
                u = /^(\S.*\:|\s*)$/,
                a = o.test(s) ? o : u;
              if (this.foldingStartMarker.test(s)) {
                for (var f = n + 1, l = e.getLength(); f < l; f++)
                  if (a.test(r[f])) break;
                return new i(n, s.length, f, 0);
              }
              if (this.foldingStopMarker.test(s)) {
                for (var f = n - 1; f >= 0; f--) {
                  s = r[f];
                  if (a.test(s)) break;
                }
                return new i(f, s.length, n, 0);
              }
            });
        }.call(o.prototype);
    }
  );
