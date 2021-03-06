define(
  "ace/mode/css",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/css_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/worker/worker_client",
    "ace/mode/folding/cstyle",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./css_highlight_rules").CssHighlightRules,
      h = a("./matching_brace_outdent").MatchingBraceOutdent,
      i = a("../worker/worker_client").WorkerClient,
      j = a("./folding/cstyle").FoldMode,
      k = function () {
        (this.$tokenizer = new f(new g().getRules(), "i")),
          (this.$outdent = new h()),
          (this.foldingRules = new j());
      };
    d.inherits(k, e),
      function () {
        (this.foldingRules = "cStyle"),
          (this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
              e = this.$tokenizer.getLineTokens(b, a).tokens;
            if (e.length && e[e.length - 1].type == "comment") return d;
            var f = b.match(/^.*\{\s*$/);
            return f && (d += c), d;
          }),
          (this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c);
          }),
          (this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c);
          }),
          (this.createWorker = function (a) {
            var b = new i(["ace"], "ace/mode/css_worker", "Worker");
            return (
              b.attachToDocument(a.getDocument()),
              b.on("csslint", function (b) {
                var c = [];
                b.data.forEach(function (a) {
                  c.push({
                    row: a.line - 1,
                    column: a.col - 1,
                    text: a.message,
                    type: a.type,
                    lint: a,
                  });
                }),
                  a.setAnnotations(c);
              }),
              b
            );
          });
      }.call(k.prototype),
      (b.Mode = k);
  }
),
  define(
    "ace/mode/css_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("../lib/lang"),
        f = a("./text_highlight_rules").TextHighlightRules,
        g = function () {
          var a = this.createKeywordMapper(
              {
                "support.type":
                  "animation-fill-mode|alignment-adjust|alignment-baseline|animation-delay|animation-direction|animation-duration|animation-iteration-count|animation-name|animation-play-state|animation-timing-function|animation|appearance|azimuth|backface-visibility|background-attachment|background-break|background-clip|background-color|background-image|background-origin|background-position|background-repeat|background-size|background|baseline-shift|binding|bleed|bookmark-label|bookmark-level|bookmark-state|bookmark-target|border-bottom|border-bottom-color|border-bottom-left-radius|border-bottom-right-radius|border-bottom-style|border-bottom-width|border-collapse|border-color|border-image|border-image-outset|border-image-repeat|border-image-slice|border-image-source|border-image-width|border-left|border-left-color|border-left-style|border-left-width|border-radius|border-right|border-right-color|border-right-style|border-right-width|border-spacing|border-style|border-top|border-top-color|border-top-left-radius|border-top-right-radius|border-top-style|border-top-width|border-width|border|bottom|box-align|box-decoration-break|box-direction|box-flex-group|box-flex|box-lines|box-ordinal-group|box-orient|box-pack|box-shadow|box-sizing|break-after|break-before|break-inside|caption-side|clear|clip|color-profile|color|column-count|column-fill|column-gap|column-rule|column-rule-color|column-rule-style|column-rule-width|column-span|column-width|columns|content|counter-increment|counter-reset|crop|cue-after|cue-before|cue|cursor|direction|display|dominant-baseline|drop-initial-after-adjust|drop-initial-after-align|drop-initial-before-adjust|drop-initial-before-align|drop-initial-size|drop-initial-value|elevation|empty-cells|fit|fit-position|float-offset|float|font-family|font-size|font-size-adjust|font-stretch|font-style|font-variant|font-weight|font|grid-columns|grid-rows|hanging-punctuation|height|hyphenate-after|hyphenate-before|hyphenate-character|hyphenate-lines|hyphenate-resource|hyphens|icon|image-orientation|image-rendering|image-resolution|inline-box-align|left|letter-spacing|line-height|line-stacking-ruby|line-stacking-shift|line-stacking-strategy|line-stacking|list-style-image|list-style-position|list-style-type|list-style|margin-bottom|margin-left|margin-right|margin-top|margin|mark-after|mark-before|mark|marks|marquee-direction|marquee-play-count|marquee-speed|marquee-style|max-height|max-width|min-height|min-width|move-to|nav-down|nav-index|nav-left|nav-right|nav-up|opacity|orphans|outline-color|outline-offset|outline-style|outline-width|outline|overflow-style|overflow-x|overflow-y|overflow|padding-bottom|padding-left|padding-right|padding-top|padding|page-break-after|page-break-before|page-break-inside|page-policy|page|pause-after|pause-before|pause|perspective-origin|perspective|phonemes|pitch-range|pitch|play-during|position|presentation-level|punctuation-trim|quotes|rendering-intent|resize|rest-after|rest-before|rest|richness|right|rotation-point|rotation|ruby-align|ruby-overhang|ruby-position|ruby-span|size|speak-header|speak-numeral|speak-punctuation|speak|speech-rate|stress|string-set|table-layout|target-name|target-new|target-position|target|text-align-last|text-align|text-decoration|text-emphasis|text-height|text-indent|text-justify|text-outline|text-shadow|text-transform|text-wrap|top|transform-origin|transform-style|transform|transition-delay|transition-duration|transition-property|transition-timing-function|transition|unicode-bidi|vertical-align|visibility|voice-balance|voice-duration|voice-family|voice-pitch-range|voice-pitch|voice-rate|voice-stress|voice-volume|volume|white-space-collapse|white-space|widows|width|word-break|word-spacing|word-wrap|z-index",
                "support.function": "rgb|rgba|url|attr|counter|counters",
                "support.constant":
                  "absolute|after-edge|after|all-scroll|all|alphabetic|always|antialiased|armenian|auto|avoid-column|avoid-page|avoid|balance|baseline|before-edge|before|below|bidi-override|block-line-height|block|bold|bolder|border-box|both|bottom|box|break-all|break-word|capitalize|caps-height|caption|center|central|char|circle|cjk-ideographic|clone|close-quote|col-resize|collapse|column|consider-shifts|contain|content-box|cover|crosshair|cubic-bezier|dashed|decimal-leading-zero|decimal|default|disabled|disc|disregard-shifts|distribute-all-lines|distribute-letter|distribute-space|distribute|dotted|double|e-resize|ease-in|ease-in-out|ease-out|ease|ellipsis|end|exclude-ruby|fill|fixed|georgian|glyphs|grid-height|groove|hand|hanging|hebrew|help|hidden|hiragana-iroha|hiragana|horizontal|icon|ideograph-alpha|ideograph-numeric|ideograph-parenthesis|ideograph-space|ideographic|inactive|include-ruby|inherit|initial|inline-block|inline-box|inline-line-height|inline-table|inline|inset|inside|inter-ideograph|inter-word|invert|italic|justify|katakana-iroha|katakana|keep-all|last|left|lighter|line-edge|line-through|line|linear|list-item|local|loose|lower-alpha|lower-greek|lower-latin|lower-roman|lowercase|lr-tb|ltr|mathematical|max-height|max-size|medium|menu|message-box|middle|move|n-resize|ne-resize|newspaper|no-change|no-close-quote|no-drop|no-open-quote|no-repeat|none|normal|not-allowed|nowrap|nw-resize|oblique|open-quote|outset|outside|overline|padding-box|page|pointer|pre-line|pre-wrap|pre|preserve-3d|progress|relative|repeat-x|repeat-y|repeat|replaced|reset-size|ridge|right|round|row-resize|rtl|s-resize|scroll|se-resize|separate|slice|small-caps|small-caption|solid|space|square|start|static|status-bar|step-end|step-start|steps|stretch|strict|sub|super|sw-resize|table-caption|table-cell|table-column-group|table-column|table-footer-group|table-header-group|table-row-group|table-row|table|tb-rl|text-after-edge|text-before-edge|text-bottom|text-size|text-top|text|thick|thin|transparent|underline|upper-alpha|upper-latin|upper-roman|uppercase|use-script|vertical-ideographic|vertical-text|visible|w-resize|wait|whitespace|z-index|zero",
                "support.constant.color":
                  "aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow",
                "support.constant.fonts":
                  "arial|century|comic|courier|garamond|georgia|helvetica|impact|lucida|symbol|system|tahoma|times|trebuchet|utopia|verdana|webdings|sans-serif|serif|monospace",
              },
              "text",
              !0
            ),
            b = "\\-?(?:(?:[0-9]+)|(?:[0-9]*\\.[0-9]+))",
            c =
              "(\\:+)\\b(after|before|first-letter|first-line|moz-selection|selection)\\b",
            d =
              "(:)\\b(active|checked|disabled|empty|enabled|first-child|first-of-type|focus|hover|indeterminate|invalid|last-child|last-of-type|link|not|nth-child|nth-last-child|nth-last-of-type|nth-of-type|only-child|only-of-type|required|root|target|valid|visited)\\b",
            f = [
              {
                token: "comment",
                merge: !0,
                regex: "\\/\\*",
                next: "ruleset_comment",
              },
              { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
              { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
              {
                token: ["constant.numeric", "keyword"],
                regex:
                  "(" +
                  b +
                  ")(ch|cm|deg|em|ex|fr|gd|grad|Hz|in|kHz|mm|ms|pc|pt|px|rad|rem|s|turn|vh|vm|vw|%)",
              },
              { token: ["constant.numeric"], regex: "([0-9]+)" },
              { token: "constant.numeric", regex: "#[a-f0-9]{6}" },
              { token: "constant.numeric", regex: "#[a-f0-9]{3}" },
              {
                token: [
                  "punctuation",
                  "entity.other.attribute-name.pseudo-element.css",
                ],
                regex: c,
              },
              {
                token: [
                  "punctuation",
                  "entity.other.attribute-name.pseudo-class.css",
                ],
                regex: d,
              },
              { token: a, regex: "\\-?[a-zA-Z_][a-zA-Z0-9_\\-]*" },
            ],
            g = e.copyArray(f);
          g.unshift({ token: "paren.rparen", regex: "\\}", next: "start" });
          var h = e.copyArray(f);
          h.unshift({ token: "paren.rparen", regex: "\\}", next: "media" });
          var i = [{ token: "comment", merge: !0, regex: ".+" }],
            j = e.copyArray(i);
          j.unshift({ token: "comment", regex: ".*?\\*\\/", next: "start" });
          var k = e.copyArray(i);
          k.unshift({ token: "comment", regex: ".*?\\*\\/", next: "media" });
          var l = e.copyArray(i);
          l.unshift({ token: "comment", regex: ".*?\\*\\/", next: "ruleset" }),
            (this.$rules = {
              start: [
                {
                  token: "comment",
                  merge: !0,
                  regex: "\\/\\*",
                  next: "comment",
                },
                { token: "paren.lparen", regex: "\\{", next: "ruleset" },
                { token: "string", regex: "@.*?{", next: "media" },
                { token: "keyword", regex: "#[a-z0-9-_]+" },
                { token: "variable", regex: "\\.[a-z0-9-_]+" },
                { token: "string", regex: ":[a-z0-9-_]+" },
                { token: "constant", regex: "[a-z0-9-_]+" },
              ],
              media: [
                {
                  token: "comment",
                  merge: !0,
                  regex: "\\/\\*",
                  next: "media_comment",
                },
                { token: "paren.lparen", regex: "\\{", next: "media_ruleset" },
                { token: "string", regex: "\\}", next: "start" },
                { token: "keyword", regex: "#[a-z0-9-_]+" },
                { token: "variable", regex: "\\.[a-z0-9-_]+" },
                { token: "string", regex: ":[a-z0-9-_]+" },
                { token: "constant", regex: "[a-z0-9-_]+" },
              ],
              comment: j,
              ruleset: g,
              ruleset_comment: l,
              media_ruleset: h,
              media_comment: k,
            });
        };
      d.inherits(g, f), (b.CssHighlightRules = g);
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
  );
