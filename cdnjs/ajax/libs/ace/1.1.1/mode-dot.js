define(
  "ace/mode/dot",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/matching_brace_outdent",
    "ace/mode/dot_highlight_rules",
    "ace/mode/folding/cstyle",
  ],
  function (e, t, n) {
    var r = e("../lib/oop"),
      i = e("./text").Mode,
      s = e("../tokenizer").Tokenizer,
      o = e("./matching_brace_outdent").MatchingBraceOutdent,
      u = e("./dot_highlight_rules").DotHighlightRules,
      a = e("./folding/cstyle").FoldMode,
      f = function () {
        var e = new u();
        (this.$outdent = new o()),
          (this.foldingRules = new a()),
          (this.$tokenizer = new s(e.getRules()));
      };
    r.inherits(f, i),
      function () {
        (this.lineCommentStart = ["//", "#"]),
          (this.blockComment = { start: "/*", end: "*/" }),
          (this.getNextLineIndent = function (e, t, n) {
            var r = this.$getIndent(t),
              i = this.$tokenizer.getLineTokens(t, e),
              s = i.tokens,
              o = i.state;
            if (s.length && s[s.length - 1].type == "comment") return r;
            if (e == "start") {
              var u = t.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
              u && (r += n);
            }
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
    "ace/mode/dot_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
      "ace/mode/doc_comment_highlight_rules",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("../lib/lang"),
        s = e("./text_highlight_rules").TextHighlightRules,
        o = e("./doc_comment_highlight_rules").DocCommentHighlightRules,
        u = function () {
          var e = i.arrayToMap(
              "strict|node|edge|graph|digraph|subgraph".split("|")
            ),
            t = i.arrayToMap(
              "damping|k|url|area|arrowhead|arrowsize|arrowtail|aspect|bb|bgcolor|center|charset|clusterrank|color|colorscheme|comment|compound|concentrate|constraint|decorate|defaultdist|dim|dimen|dir|diredgeconstraints|distortion|dpi|edgeurl|edgehref|edgetarget|edgetooltip|epsilon|esep|fillcolor|fixedsize|fontcolor|fontname|fontnames|fontpath|fontsize|forcelabels|gradientangle|group|headurl|head_lp|headclip|headhref|headlabel|headport|headtarget|headtooltip|height|href|id|image|imagepath|imagescale|label|labelurl|label_scheme|labelangle|labeldistance|labelfloat|labelfontcolor|labelfontname|labelfontsize|labelhref|labeljust|labelloc|labeltarget|labeltooltip|landscape|layer|layerlistsep|layers|layerselect|layersep|layout|len|levels|levelsgap|lhead|lheight|lp|ltail|lwidth|margin|maxiter|mclimit|mindist|minlen|mode|model|mosek|nodesep|nojustify|normalize|nslimit|nslimit1|ordering|orientation|outputorder|overlap|overlap_scaling|pack|packmode|pad|page|pagedir|pencolor|penwidth|peripheries|pin|pos|quadtree|quantum|rank|rankdir|ranksep|ratio|rects|regular|remincross|repulsiveforce|resolution|root|rotate|rotation|samehead|sametail|samplepoints|scale|searchsize|sep|shape|shapefile|showboxes|sides|size|skew|smoothing|sortv|splines|start|style|stylesheet|tailurl|tail_lp|tailclip|tailhref|taillabel|tailport|tailtarget|tailtooltip|target|tooltip|truecolor|vertices|viewport|voro_margin|weight|width|xlabel|xlp|z".split(
                "|"
              )
            );
          this.$rules = {
            start: [
              { token: "comment", regex: /\/\/.*$/ },
              { token: "comment", regex: /#.*$/ },
              { token: "comment", merge: !0, regex: /\/\*/, next: "comment" },
              { token: "string", regex: "'(?=.)", next: "qstring" },
              { token: "string", regex: '"(?=.)', next: "qqstring" },
              {
                token: "constant.numeric",
                regex: /[+\-]?\d+(?:(?:\.\d*)?(?:[eE][+\-]?\d+)?)?\b/,
              },
              { token: "keyword.operator", regex: /\+|=|\->/ },
              { token: "punctuation.operator", regex: /,|;/ },
              { token: "paren.lparen", regex: /[\[{]/ },
              { token: "paren.rparen", regex: /[\]}]/ },
              { token: "comment", regex: /^#!.*$/ },
              {
                token: function (n) {
                  return e.hasOwnProperty(n.toLowerCase())
                    ? "keyword"
                    : t.hasOwnProperty(n.toLowerCase())
                    ? "variable"
                    : "text";
                },
                regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*",
              },
            ],
            comment: [
              {
                token: "comment",
                regex: ".*?\\*\\/",
                merge: !0,
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qqstring: [
              { token: "string", regex: '[^"\\\\]+', merge: !0 },
              { token: "string", regex: "\\\\$", next: "qqstring", merge: !0 },
              { token: "string", regex: '"|$', next: "start", merge: !0 },
            ],
            qstring: [
              { token: "string", regex: "[^'\\\\]+", merge: !0 },
              { token: "string", regex: "\\\\$", next: "qstring", merge: !0 },
              { token: "string", regex: "'|$", next: "start", merge: !0 },
            ],
          };
        };
      r.inherits(u, s), (t.DotHighlightRules = u);
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
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("./text_highlight_rules").TextHighlightRules,
        s = function () {
          this.$rules = {
            start: [
              { token: "comment.doc.tag", regex: "@[\\w\\d_]+" },
              { token: "comment.doc.tag", regex: "\\bTODO\\b" },
              { defaultToken: "comment.doc" },
            ],
          };
        };
      r.inherits(s, i),
        (s.getStartRule = function (e) {
          return { token: "comment.doc", regex: "\\/\\*(?=\\*)", next: e };
        }),
        (s.getEndRule = function (e) {
          return { token: "comment.doc", regex: "\\*\\/", next: e };
        }),
        (t.DocCommentHighlightRules = s);
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
