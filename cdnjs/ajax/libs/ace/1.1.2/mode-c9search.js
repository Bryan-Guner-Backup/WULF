ace.define(
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
        (this.HighlightRules = o),
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
  ace.define(
    "ace/mode/c9search_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (e, t, n) {
      function o(e, t) {
        try {
          return new RegExp(e, t);
        } catch (n) {}
      }
      var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./text_highlight_rules").TextHighlightRules,
        u = function () {
          this.$rules = {
            start: [
              {
                tokenNames: [
                  "c9searchresults.constant.numeric",
                  "c9searchresults.text",
                  "c9searchresults.text",
                  "c9searchresults.keyword",
                ],
                regex: "(^\\s+[0-9]+)(:\\s)(.+)",
                onMatch: function (e, t, n) {
                  var r = this.splitRegex.exec(e),
                    i = this.tokenNames,
                    s = [
                      { type: i[0], value: r[1] },
                      { type: i[1], value: r[2] },
                    ],
                    o = n[1],
                    u = r[3];
                  o && u ? (r = u.split(o)) : (r = [u]);
                  for (var a = 0, f = r.length; a < f; a += 2)
                    r[a] && s.push({ type: i[2], value: r[a] }),
                      r[a + 1] && s.push({ type: i[3], value: r[a + 1] });
                  return s;
                },
              },
              { token: ["string", "text"], regex: "(\\S.*)(:$)" },
              {
                regex: "Searching for .*$",
                onMatch: function (e, t, n) {
                  var r = e.split(""),
                    s = r[1];
                  if (r.length < 3) return "text";
                  var u = r[2] == " in" ? r[5] : r[6];
                  /regex/.test(u) || (s = i.escapeRegExp(s)),
                    /whole/.test(u) && (s = "\\b" + s + "\\b");
                  var a = o("(" + s + ")", / sensitive/.test(u) ? "" : "i");
                  a && ((n[0] = t), (n[1] = a));
                  var f = 0,
                    l = [
                      { value: r[f++] + "'", type: "text" },
                      { value: r[f++], type: "text" },
                      { value: "'" + r[f++], type: "text" },
                    ];
                  r[2] !== " in" &&
                    l.push(
                      { value: "'" + r[f++] + "'", type: "text" },
                      { value: r[f++], type: "text" }
                    ),
                    l.push({ value: " " + r[f++] + " ", type: "text" }),
                    r[f + 1]
                      ? (l.push({ value: "(" + r[f + 1] + ")", type: "text" }),
                        (f += 1))
                      : (f -= 1);
                  while (f++ < r.length)
                    r[f] && l.push({ value: r[f], type: "text" });
                  return l;
                },
              },
              { regex: "\\d+", token: "constant.numeric" },
            ],
          };
        };
      r.inherits(u, s), (t.C9SearchHighlightRules = u);
    }
  ),
  ace.define(
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
  ace.define(
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
