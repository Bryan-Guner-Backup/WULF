define(
  "ace/mode/html",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/mode/javascript",
    "ace/mode/css",
    "ace/tokenizer",
    "ace/mode/html_highlight_rules",
    "ace/mode/behaviour/html",
    "ace/mode/folding/html",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("./javascript").Mode,
      g = a("./css").Mode,
      h = a("../tokenizer").Tokenizer,
      i = a("./html_highlight_rules").HtmlHighlightRules,
      j = a("./behaviour/html").HtmlBehaviour,
      k = a("./folding/html").FoldMode,
      l = function () {
        var a = new i();
        (this.$tokenizer = new h(a.getRules())),
          (this.$behaviour = new j()),
          (this.$embeds = a.getEmbeds()),
          this.createModeDelegates({ "js-": f, "css-": g }),
          (this.foldingRules = new k());
      };
    d.inherits(l, e),
      function () {
        (this.toggleCommentLines = function (a, b, c, d) {
          return 0;
        }),
          (this.getNextLineIndent = function (a, b, c) {
            return this.$getIndent(b);
          }),
          (this.checkOutdent = function (a, b, c) {
            return !1;
          });
      }.call(l.prototype),
      (b.Mode = l);
  }
),
  define(
    "ace/mode/javascript",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/text",
      "ace/tokenizer",
      "ace/mode/javascript_highlight_rules",
      "ace/mode/matching_brace_outdent",
      "ace/range",
      "ace/worker/worker_client",
      "ace/mode/behaviour/cstyle",
      "ace/mode/folding/cstyle",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("./text").Mode,
        f = a("../tokenizer").Tokenizer,
        g = a("./javascript_highlight_rules").JavaScriptHighlightRules,
        h = a("./matching_brace_outdent").MatchingBraceOutdent,
        i = a("../range").Range,
        j = a("../worker/worker_client").WorkerClient,
        k = a("./behaviour/cstyle").CstyleBehaviour,
        l = a("./folding/cstyle").FoldMode,
        m = function () {
          (this.$tokenizer = new f(new g().getRules())),
            (this.$outdent = new h()),
            (this.$behaviour = new k()),
            (this.foldingRules = new l());
        };
      d.inherits(m, e),
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
              if (a == "start" || a == "regex_allowed") {
                var h = b.match(/^.*(?:\bcase\b.*\:|[\{\(\[])\s*$/);
                h && (d += c);
              } else if (a == "doc-start") {
                if (g == "start" || a == "regex_allowed") return "";
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
            }),
            (this.createWorker = function (a) {
              var b = new j(
                ["ace"],
                "ace/mode/javascript_worker",
                "JavaScriptWorker"
              );
              return (
                b.attachToDocument(a.getDocument()),
                b.on("jslint", function (b) {
                  var c = [];
                  for (var d = 0; d < b.data.length; d++) {
                    var e = b.data[d];
                    e &&
                      c.push({
                        row: e.line - 1,
                        column: e.character - 1,
                        text: e.reason,
                        type: "warning",
                        lint: e,
                      });
                  }
                  a.setAnnotations(c);
                }),
                b.on("narcissus", function (b) {
                  a.setAnnotations([b.data]);
                }),
                b.on("terminate", function () {
                  a.clearAnnotations();
                }),
                b
              );
            });
        }.call(m.prototype),
        (b.Mode = m);
    }
  ),
  define(
    "ace/mode/javascript_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/unicode",
      "ace/mode/doc_comment_highlight_rules",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("../unicode"),
        f = a("./doc_comment_highlight_rules").DocCommentHighlightRules,
        g = a("./text_highlight_rules").TextHighlightRules,
        h = function () {
          var a = this.createKeywordMapper(
              {
                "variable.language":
                  "Array|Boolean|Date|Function|Iterator|Number|Object|RegExp|String|Proxy|Namespace|QName|XML|XMLList|ArrayBuffer|Float32Array|Float64Array|Int16Array|Int32Array|Int8Array|Uint16Array|Uint32Array|Uint8Array|Uint8ClampedArray|Error|EvalError|InternalError|RangeError|ReferenceError|StopIteration|SyntaxError|TypeError|URIError|decodeURI|decodeURIComponent|encodeURI|encodeURIComponent|eval|isFinite|isNaN|parseFloat|parseInt|JSON|Math|this|arguments|prototype|window|document",
                "invalid.deprecated":
                  "__parent__|__count__|escape|unescape|with|__proto__|debugger",
                keyword:
                  "const|yield|import|get|setbreak|case|catch|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|return|switch|throw|try|typeof|let|var|while|with|",
                "storage.type": "const|let|var|function",
                "invalid.illegal":
                  "class|enum|extends|super|export|implements|private|public|interface|package|protected|static",
                "constant.language": "null|Infinity|NaN|undefined",
              },
              "identifier"
            ),
            b =
              "case|do|else|finally|in|instanceof|return|throw|try|typeof|yield",
            c = "[a-zA-Z\\$_??-???][a-zA-Z\\d\\$_??-???]*\\b",
            d =
              "\\\\(?:x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|[0-2][0-7]{0,2}|3[0-6][0-7]?|37[0-7]?|[4-7][0-7]?|.)";
          (this.$rules = {
            start: [
              { token: "comment", regex: /\/\/.*$/ },
              f.getStartRule("doc-start"),
              { token: "comment", merge: !0, regex: /\/\*/, next: "comment" },
              { token: "string", regex: "'(?=.)", next: "qstring" },
              { token: "string", regex: '"(?=.)', next: "qqstring" },
              { token: "constant.numeric", regex: /0[xX][0-9a-fA-F]+\b/ },
              {
                token: "constant.numeric",
                regex: /[+-]?\d+(?:(?:\.\d*)?(?:[eE][+-]?\d+)?)?\b/,
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "support.function",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                ],
                regex: "(" + c + ")(\\.)(prototype)(\\.)(" + c + ")(\\s*)(=)",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex:
                  "(" +
                  c +
                  ")(\\.)(" +
                  c +
                  ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex: "(" + c + ")(\\s*)(=)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "entity.name.function",
                  "text",
                  "keyword.operator",
                  "text",
                  "storage.type",
                  "text",
                  "entity.name.function",
                  "text",
                  "paren.lparen",
                ],
                regex:
                  "(" +
                  c +
                  ")(\\.)(" +
                  c +
                  ")(\\s*)(=)(\\s*)(function)(\\s+)(\\w+)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "storage.type",
                  "text",
                  "entity.name.function",
                  "text",
                  "paren.lparen",
                ],
                regex: "(function)(\\s+)(" + c + ")(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: [
                  "entity.name.function",
                  "text",
                  "punctuation.operator",
                  "text",
                  "storage.type",
                  "text",
                  "paren.lparen",
                ],
                regex: "(" + c + ")(\\s*)(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments",
              },
              {
                token: ["text", "text", "storage.type", "text", "paren.lparen"],
                regex: "(:)(\\s*)(function)(\\s*)(\\()",
                next: "function_arguments",
              },
              { token: "constant.language.boolean", regex: /(?:true|false)\b/ },
              {
                token: "keyword",
                regex: "(?:" + b + ")\\b",
                next: "regex_allowed",
              },
              {
                token: ["punctuation.operator", "support.function"],
                regex:
                  /(\.)(s(?:h(?:ift|ow(?:Mod(?:elessDialog|alDialog)|Help))|croll(?:X|By(?:Pages|Lines)?|Y|To)?|t(?:opzzzz|rike)|i(?:n|zeToContent|debar|gnText)|ort|u(?:p|b(?:str(?:ing)?)?)|pli(?:ce|t)|e(?:nd|t(?:Re(?:sizable|questHeader)|M(?:i(?:nutes|lliseconds)|onth)|Seconds|Ho(?:tKeys|urs)|Year|Cursor|Time(?:out)?|Interval|ZOptions|Date|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Date|FullYear)|FullYear|Active)|arch)|qrt|lice|avePreferences|mall)|h(?:ome|andleEvent)|navigate|c(?:har(?:CodeAt|At)|o(?:s|n(?:cat|textual|firm)|mpile)|eil|lear(?:Timeout|Interval)?|a(?:ptureEvents|ll)|reate(?:StyleSheet|Popup|EventObject))|t(?:o(?:GMTString|S(?:tring|ource)|U(?:TCString|pperCase)|Lo(?:caleString|werCase))|est|a(?:n|int(?:Enabled)?))|i(?:s(?:NaN|Finite)|ndexOf|talics)|d(?:isableExternalCapture|ump|etachEvent)|u(?:n(?:shift|taint|escape|watch)|pdateCommands)|j(?:oin|avaEnabled)|p(?:o(?:p|w)|ush|lugins.refresh|a(?:ddings|rse(?:Int|Float)?)|r(?:int|ompt|eference))|e(?:scape|nableExternalCapture|val|lementFromPoint|x(?:p|ec(?:Script|Command)?))|valueOf|UTC|queryCommand(?:State|Indeterm|Enabled|Value)|f(?:i(?:nd|le(?:ModifiedDate|Size|CreatedDate|UpdatedDate)|xed)|o(?:nt(?:size|color)|rward)|loor|romCharCode)|watch|l(?:ink|o(?:ad|g)|astIndexOf)|a(?:sin|nchor|cos|t(?:tachEvent|ob|an(?:2)?)|pply|lert|b(?:s|ort))|r(?:ou(?:nd|teEvents)|e(?:size(?:By|To)|calc|turnValue|place|verse|l(?:oad|ease(?:Capture|Events)))|andom)|g(?:o|et(?:ResponseHeader|M(?:i(?:nutes|lliseconds)|onth)|Se(?:conds|lection)|Hours|Year|Time(?:zoneOffset)?|Da(?:y|te)|UTC(?:M(?:i(?:nutes|lliseconds)|onth)|Seconds|Hours|Da(?:y|te)|FullYear)|FullYear|A(?:ttention|llResponseHeaders)))|m(?:in|ove(?:B(?:y|elow)|To(?:Absolute)?|Above)|ergeAttributes|a(?:tch|rgins|x))|b(?:toa|ig|o(?:ld|rderWidths)|link|ack))\b(?=\()/,
              },
              {
                token: ["punctuation.operator", "support.function.dom"],
                regex:
                  /(\.)(s(?:ub(?:stringData|mit)|plitText|e(?:t(?:NamedItem|Attribute(?:Node)?)|lect))|has(?:ChildNodes|Feature)|namedItem|c(?:l(?:ick|o(?:se|neNode))|reate(?:C(?:omment|DATASection|aption)|T(?:Head|extNode|Foot)|DocumentFragment|ProcessingInstruction|E(?:ntityReference|lement)|Attribute))|tabIndex|i(?:nsert(?:Row|Before|Cell|Data)|tem)|open|delete(?:Row|C(?:ell|aption)|T(?:Head|Foot)|Data)|focus|write(?:ln)?|a(?:dd|ppend(?:Child|Data))|re(?:set|place(?:Child|Data)|move(?:NamedItem|Child|Attribute(?:Node)?)?)|get(?:NamedItem|Element(?:sBy(?:Name|TagName)|ById)|Attribute(?:Node)?)|blur)\b(?=\()/,
              },
              {
                token: ["punctuation.operator", "support.constant"],
                regex:
                  /(\.)(s(?:ystemLanguage|cr(?:ipts|ollbars|een(?:X|Y|Top|Left))|t(?:yle(?:Sheets)?|atus(?:Text|bar)?)|ibling(?:Below|Above)|ource|uffixes|e(?:curity(?:Policy)?|l(?:ection|f)))|h(?:istory|ost(?:name)?|as(?:h|Focus))|y|X(?:MLDocument|SLDocument)|n(?:ext|ame(?:space(?:s|URI)|Prop))|M(?:IN_VALUE|AX_VALUE)|c(?:haracterSet|o(?:n(?:structor|trollers)|okieEnabled|lorDepth|mp(?:onents|lete))|urrent|puClass|l(?:i(?:p(?:boardData)?|entInformation)|osed|asses)|alle(?:e|r)|rypto)|t(?:o(?:olbar|p)|ext(?:Transform|Indent|Decoration|Align)|ags)|SQRT(?:1_2|2)|i(?:n(?:ner(?:Height|Width)|put)|ds|gnoreCase)|zIndex|o(?:scpu|n(?:readystatechange|Line)|uter(?:Height|Width)|p(?:sProfile|ener)|ffscreenBuffering)|NEGATIVE_INFINITY|d(?:i(?:splay|alog(?:Height|Top|Width|Left|Arguments)|rectories)|e(?:scription|fault(?:Status|Ch(?:ecked|arset)|View)))|u(?:ser(?:Profile|Language|Agent)|n(?:iqueID|defined)|pdateInterval)|_content|p(?:ixelDepth|ort|ersonalbar|kcs11|l(?:ugins|atform)|a(?:thname|dding(?:Right|Bottom|Top|Left)|rent(?:Window|Layer)?|ge(?:X(?:Offset)?|Y(?:Offset)?))|r(?:o(?:to(?:col|type)|duct(?:Sub)?|mpter)|e(?:vious|fix)))|e(?:n(?:coding|abledPlugin)|x(?:ternal|pando)|mbeds)|v(?:isibility|endor(?:Sub)?|Linkcolor)|URLUnencoded|P(?:I|OSITIVE_INFINITY)|f(?:ilename|o(?:nt(?:Size|Family|Weight)|rmName)|rame(?:s|Element)|gColor)|E|whiteSpace|l(?:i(?:stStyleType|n(?:eHeight|kColor))|o(?:ca(?:tion(?:bar)?|lName)|wsrc)|e(?:ngth|ft(?:Context)?)|a(?:st(?:M(?:odified|atch)|Index|Paren)|yer(?:s|X)|nguage))|a(?:pp(?:MinorVersion|Name|Co(?:deName|re)|Version)|vail(?:Height|Top|Width|Left)|ll|r(?:ity|guments)|Linkcolor|bove)|r(?:ight(?:Context)?|e(?:sponse(?:XML|Text)|adyState))|global|x|m(?:imeTypes|ultiline|enubar|argin(?:Right|Bottom|Top|Left))|L(?:N(?:10|2)|OG(?:10E|2E))|b(?:o(?:ttom|rder(?:Width|RightWidth|BottomWidth|Style|Color|TopWidth|LeftWidth))|ufferDepth|elow|ackground(?:Color|Image)))\b/,
              },
              {
                token: [
                  "storage.type",
                  "punctuation.operator",
                  "support.function.firebug",
                ],
                regex:
                  /(console)(\.)(warn|info|log|error|time|timeEnd|assert)\b/,
              },
              { token: a, regex: c },
              {
                token: "keyword.operator",
                regex:
                  /!|\$|%|&|\*|\-\-|\-|\+\+|\+|~|===|==|=|!=|!==|<=|>=|<<=|>>=|>>>=|<>|<|>|!|&&|\|\||\?\:|\*=|%=|\+=|\-=|&=|\^=|\b(?:in|instanceof|new|delete|typeof|void)/,
                next: "regex_allowed",
              },
              {
                token: "punctuation.operator",
                regex: /\?|\:|\,|\;|\./,
                next: "regex_allowed",
              },
              { token: "paren.lparen", regex: /[\[({]/, next: "regex_allowed" },
              { token: "paren.rparen", regex: /[\])}]/ },
              {
                token: "keyword.operator",
                regex: /\/=?/,
                next: "regex_allowed",
              },
              { token: "comment", regex: /^#!.*$/ },
              { token: "text", regex: /\s+/ },
            ],
            regex_allowed: [
              f.getStartRule("doc-start"),
              {
                token: "comment",
                merge: !0,
                regex: "\\/\\*",
                next: "comment_regex_allowed",
              },
              { token: "comment", regex: "\\/\\/.*$" },
              {
                token: "string.regexp",
                regex: "\\/",
                next: "regex",
                merge: !0,
              },
              { token: "text", regex: "\\s+" },
              { token: "empty", regex: "", next: "start" },
            ],
            regex: [
              {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
              },
              {
                token: "string.regexp",
                regex: "/\\w*",
                next: "start",
                merge: !0,
              },
              {
                token: "invalid",
                regex: /\{\d+,?(?:\d+)?}[+*]|[+*^$?][+*]|\?\?/,
              },
              {
                token: "constant.language.escape",
                regex: /\(\?[:=!]|\)|\{\d+,?(?:\d+)?}|[+*]\?|[(|)$^+*?]/,
              },
              {
                token: "string.regexp",
                regex: /{|[^\[\\{()$^+*?\/]+/,
                merge: !0,
              },
              {
                token: "constant.language.escape",
                regex: /\[\^?/,
                next: "regex_character_class",
                merge: !0,
              },
              { token: "empty", regex: "", next: "start" },
            ],
            regex_character_class: [
              {
                token: "regexp.keyword.operator",
                regex: "\\\\(?:u[\\da-fA-F]{4}|x[\\da-fA-F]{2}|.)",
              },
              {
                token: "constant.language.escape",
                regex: "]",
                next: "regex",
                merge: !0,
              },
              { token: "constant.language.escape", regex: "-" },
              {
                token: "string.regexp.charachterclass",
                regex: /[^\]\-\\]+/,
                merge: !0,
              },
              { token: "empty", regex: "", next: "start" },
            ],
            function_arguments: [
              { token: "variable.parameter", regex: c },
              { token: "punctuation.operator", regex: "[, ]+", merge: !0 },
              { token: "punctuation.operator", regex: "$", merge: !0 },
              { token: "empty", regex: "", next: "start" },
            ],
            comment_regex_allowed: [
              {
                token: "comment",
                regex: ".*?\\*\\/",
                merge: !0,
                next: "regex_allowed",
              },
              { token: "comment", merge: !0, regex: ".+" },
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
              { token: "constant.language.escape", regex: d },
              { token: "string", regex: '[^"\\\\]+', merge: !0 },
              { token: "string", regex: "\\\\$", next: "qqstring", merge: !0 },
              { token: "string", regex: '"|$', next: "start", merge: !0 },
            ],
            qstring: [
              { token: "constant.language.escape", regex: d },
              { token: "string", regex: "[^'\\\\]+", merge: !0 },
              { token: "string", regex: "\\\\$", next: "qstring", merge: !0 },
              { token: "string", regex: "'|$", next: "start", merge: !0 },
            ],
          }),
            this.embedRules(f, "doc-", [f.getEndRule("start")]);
        };
      d.inherits(h, g), (b.JavaScriptHighlightRules = h);
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
    "ace/mode/html_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/mode/css_highlight_rules",
      "ace/mode/javascript_highlight_rules",
      "ace/mode/xml_util",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("../lib/lang"),
        f = a("./css_highlight_rules").CssHighlightRules,
        g = a("./javascript_highlight_rules").JavaScriptHighlightRules,
        h = a("./xml_util"),
        i = a("./text_highlight_rules").TextHighlightRules,
        j = e.createMap({
          a: "anchor",
          button: "form",
          form: "form",
          img: "image",
          input: "form",
          label: "form",
          script: "script",
          select: "form",
          textarea: "form",
          style: "style",
          table: "table",
          tbody: "table",
          td: "table",
          tfoot: "table",
          th: "table",
          tr: "table",
        }),
        k = function () {
          (this.$rules = {
            start: [
              {
                token: "text",
                merge: !0,
                regex: "<\\!\\[CDATA\\[",
                next: "cdata",
              },
              { token: "xml_pe", regex: "<\\?.*?\\?>" },
              { token: "comment", merge: !0, regex: "<\\!--", next: "comment" },
              { token: "xml_pe", regex: "<\\!.*?>" },
              { token: "meta.tag", regex: "<(?=s*script\\b)", next: "script" },
              { token: "meta.tag", regex: "<(?=s*style\\b)", next: "style" },
              { token: "meta.tag", regex: "<\\/?", next: "tag" },
              { token: "text", regex: "\\s+" },
              {
                token: "constant.character.entity",
                regex:
                  "(?:&#[0-9]+;)|(?:&#x[0-9a-fA-F]+;)|(?:&[a-zA-Z0-9_:\\.-]+;)",
              },
              { token: "text", regex: "[^<]+" },
            ],
            cdata: [
              { token: "text", regex: "\\]\\]>", next: "start" },
              { token: "text", merge: !0, regex: "\\s+" },
              { token: "text", merge: !0, regex: ".+" },
            ],
            comment: [
              { token: "comment", regex: ".*?-->", next: "start" },
              { token: "comment", merge: !0, regex: ".+" },
            ],
          }),
            h.tag(this.$rules, "tag", "start", j),
            h.tag(this.$rules, "style", "css-start", j),
            h.tag(this.$rules, "script", "js-start", j),
            this.embedRules(g, "js-", [
              {
                token: "comment",
                regex: "\\/\\/.*(?=<\\/script>)",
                next: "tag",
              },
              { token: "meta.tag", regex: "<\\/(?=script)", next: "tag" },
            ]),
            this.embedRules(f, "css-", [
              { token: "meta.tag", regex: "<\\/(?=style)", next: "tag" },
            ]);
        };
      d.inherits(k, i), (b.HtmlHighlightRules = k);
    }
  ),
  define(
    "ace/mode/xml_util",
    ["require", "exports", "module"],
    function (a, b, c) {
      function d(a) {
        return [
          { token: "string", regex: '".*?"' },
          { token: "string", merge: !0, regex: '["].*', next: a + "_qqstring" },
          { token: "string", regex: "'.*?'" },
          { token: "string", merge: !0, regex: "['].*", next: a + "_qstring" },
        ];
      }
      function e(a, b) {
        return [
          { token: "string", merge: !0, regex: ".*?" + a, next: b },
          { token: "string", merge: !0, regex: ".+" },
        ];
      }
      b.tag = function (a, b, c, f) {
        (a[b] = [
          { token: "text", regex: "\\s+" },
          {
            token: f
              ? function (a) {
                  return f[a]
                    ? "meta.tag.tag-name." + f[a]
                    : "meta.tag.tag-name";
                }
              : "meta.tag.tag-name",
            merge: !0,
            regex: "[-_a-zA-Z0-9:]+",
            next: b + "_embed_attribute_list",
          },
          { token: "empty", regex: "", next: b + "_embed_attribute_list" },
        ]),
          (a[b + "_qstring"] = e("'", b + "_embed_attribute_list")),
          (a[b + "_qqstring"] = e('"', b + "_embed_attribute_list")),
          (a[b + "_embed_attribute_list"] = [
            { token: "meta.tag", merge: !0, regex: "/?>", next: c },
            { token: "keyword.operator", regex: "=" },
            { token: "entity.other.attribute-name", regex: "[-_a-zA-Z0-9:]+" },
            {
              token: "constant.numeric",
              regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
            },
            { token: "text", regex: "\\s+" },
          ].concat(d(b)));
      };
    }
  ),
  define(
    "ace/mode/behaviour/html",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour/xml",
      "ace/mode/behaviour/cstyle",
      "ace/token_iterator",
    ],
    function (a, b, c) {
      function i(a, b) {
        var c = !0,
          d = a.type.split("."),
          e = b.split(".");
        return (
          e.forEach(function (a) {
            if (d.indexOf(a) == -1) return (c = !1), !1;
          }),
          c
        );
      }
      var d = a("../../lib/oop"),
        e = a("../behaviour/xml").XmlBehaviour,
        f = a("./cstyle").CstyleBehaviour,
        g = a("../../token_iterator").TokenIterator,
        h = [
          "area",
          "base",
          "br",
          "col",
          "command",
          "embed",
          "hr",
          "img",
          "input",
          "keygen",
          "link",
          "meta",
          "param",
          "source",
          "track",
          "wbr",
        ],
        j = function () {
          this.inherit(e),
            this.add("autoclosing", "insertion", function (a, b, c, d, e) {
              if (e == ">") {
                var f = c.getCursorPosition(),
                  j = new g(d, f.row, f.column),
                  k = j.getCurrentToken(),
                  l = !1;
                if (
                  !k ||
                  (!i(k, "meta.tag") && (!i(k, "text") || !k.value.match("/")))
                ) {
                  do k = j.stepBackward();
                  while (
                    k &&
                    (i(k, "string") ||
                      i(k, "keyword.operator") ||
                      i(k, "entity.attribute-name") ||
                      i(k, "text"))
                  );
                } else l = !0;
                if (
                  !k ||
                  !i(k, "meta.tag-name") ||
                  j.stepBackward().value.match("/")
                )
                  return;
                var m = k.value;
                if (l) var m = m.substring(0, f.column - k.start);
                if (h.indexOf(m) !== -1) return;
                return { text: "></" + m + ">", selection: [1, 1] };
              }
            });
        };
      d.inherits(j, e), (b.HtmlBehaviour = j);
    }
  ),
  define(
    "ace/mode/behaviour/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/behaviour",
      "ace/mode/behaviour/cstyle",
      "ace/token_iterator",
    ],
    function (a, b, c) {
      function h(a, b) {
        var c = !0,
          d = a.type.split("."),
          e = b.split(".");
        return (
          e.forEach(function (a) {
            if (d.indexOf(a) == -1) return (c = !1), !1;
          }),
          c
        );
      }
      var d = a("../../lib/oop"),
        e = a("../behaviour").Behaviour,
        f = a("./cstyle").CstyleBehaviour,
        g = a("../../token_iterator").TokenIterator,
        i = function () {
          this.inherit(f, ["string_dquotes"]),
            this.add("autoclosing", "insertion", function (a, b, c, d, e) {
              if (e == ">") {
                var f = c.getCursorPosition(),
                  i = new g(d, f.row, f.column),
                  j = i.getCurrentToken(),
                  k = !1;
                if (
                  !j ||
                  (!h(j, "meta.tag") && (!h(j, "text") || !j.value.match("/")))
                ) {
                  do j = i.stepBackward();
                  while (
                    j &&
                    (h(j, "string") ||
                      h(j, "keyword.operator") ||
                      h(j, "entity.attribute-name") ||
                      h(j, "text"))
                  );
                } else k = !0;
                if (
                  !j ||
                  !h(j, "meta.tag-name") ||
                  i.stepBackward().value.match("/")
                )
                  return;
                var l = j.value;
                if (k) var l = l.substring(0, f.column - j.start);
                return { text: "></" + l + ">", selection: [1, 1] };
              }
            }),
            this.add("autoindent", "insertion", function (a, b, c, d, e) {
              if (e == "\n") {
                var f = c.getCursorPosition(),
                  g = d.doc.getLine(f.row),
                  h = g.substring(f.column, f.column + 2);
                if (h == "</") {
                  var i =
                      this.$getIndent(d.doc.getLine(f.row)) + d.getTabString(),
                    j = this.$getIndent(d.doc.getLine(f.row));
                  return {
                    text: "\n" + i + "\n" + j,
                    selection: [1, i.length, 1, i.length],
                  };
                }
              }
            });
        };
      d.inherits(i, e), (b.XmlBehaviour = i);
    }
  ),
  define(
    "ace/mode/folding/html",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/mixed",
      "ace/mode/folding/xml",
      "ace/mode/folding/cstyle",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("./mixed").FoldMode,
        f = a("./xml").FoldMode,
        g = a("./cstyle").FoldMode,
        h = (b.FoldMode = function () {
          e.call(
            this,
            new f({
              area: 1,
              base: 1,
              br: 1,
              col: 1,
              command: 1,
              embed: 1,
              hr: 1,
              img: 1,
              input: 1,
              keygen: 1,
              link: 1,
              meta: 1,
              param: 1,
              source: 1,
              track: 1,
              wbr: 1,
              li: 1,
              dt: 1,
              dd: 1,
              p: 1,
              rt: 1,
              rp: 1,
              optgroup: 1,
              option: 1,
              colgroup: 1,
              td: 1,
              th: 1,
            }),
            { "js-": new g(), "css-": new g() }
          );
        });
      d.inherits(h, e);
    }
  ),
  define(
    "ace/mode/folding/mixed",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/mode/folding/fold_mode",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("./fold_mode").FoldMode,
        f = (b.FoldMode = function (a, b) {
          (this.defaultMode = a), (this.subModes = b);
        });
      d.inherits(f, e),
        function () {
          (this.$getMode = function (a) {
            for (var b in this.subModes)
              if (a.indexOf(b) === 0) return this.subModes[b];
            return null;
          }),
            (this.$tryMode = function (a, b, c, d) {
              var e = this.$getMode(a);
              return e ? e.getFoldWidget(b, c, d) : "";
            }),
            (this.getFoldWidget = function (a, b, c) {
              return (
                this.$tryMode(a.getState(c - 1), a, b, c) ||
                this.$tryMode(a.getState(c), a, b, c) ||
                this.defaultMode.getFoldWidget(a, b, c)
              );
            }),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = this.$getMode(a.getState(c - 1));
              if (!d || !d.getFoldWidget(a, b, c))
                d = this.$getMode(a.getState(c));
              if (!d || !d.getFoldWidget(a, b, c)) d = this.defaultMode;
              return d.getFoldWidgetRange(a, b, c);
            });
        }.call(f.prototype);
    }
  ),
  define(
    "ace/mode/folding/xml",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/lib/lang",
      "ace/range",
      "ace/mode/folding/fold_mode",
      "ace/token_iterator",
    ],
    function (a, b, c) {
      var d = a("../../lib/oop"),
        e = a("../../lib/lang"),
        f = a("../../range").Range,
        g = a("./fold_mode").FoldMode,
        h = a("../../token_iterator").TokenIterator,
        i = (b.FoldMode = function (a) {
          g.call(this), (this.voidElements = a || {});
        });
      d.inherits(i, g),
        function () {
          (this.getFoldWidget = function (a, b, c) {
            var d = this._getFirstTagInLine(a, c);
            return d.closing
              ? b == "markbeginend"
                ? "end"
                : ""
              : !d.tagName || this.voidElements[d.tagName.toLowerCase()]
              ? ""
              : d.selfClosing
              ? ""
              : d.value.indexOf("/" + d.tagName) !== -1
              ? ""
              : "start";
          }),
            (this._getFirstTagInLine = function (a, b) {
              var c = a.getTokens(b),
                d = "";
              for (var f = 0; f < c.length; f++) {
                var g = c[f];
                g.type.indexOf("meta.tag") === 0
                  ? (d += g.value)
                  : (d += e.stringRepeat(" ", g.value.length));
              }
              return this._parseTag(d);
            }),
            (this.tagRe = /^(\s*)(<?(\/?)([-_a-zA-Z0-9:!]*)\s*(\/?)>?)/),
            (this._parseTag = function (a) {
              var b = this.tagRe.exec(a),
                c = this.tagRe.lastIndex || 0;
              return (
                (this.tagRe.lastIndex = 0),
                {
                  value: a,
                  match: b ? b[2] : "",
                  closing: b ? !!b[3] : !1,
                  selfClosing: b ? !!b[5] || b[2] == "/>" : !1,
                  tagName: b ? b[4] : "",
                  column: b[1] ? c + b[1].length : c,
                }
              );
            }),
            (this._readTagForward = function (a) {
              var b = a.getCurrentToken();
              if (!b) return null;
              var c = "",
                d;
              do
                if (b.type.indexOf("meta.tag") === 0) {
                  if (!d)
                    var d = {
                      row: a.getCurrentTokenRow(),
                      column: a.getCurrentTokenColumn(),
                    };
                  c += b.value;
                  if (c.indexOf(">") !== -1) {
                    var e = this._parseTag(c);
                    return (
                      (e.start = d),
                      (e.end = {
                        row: a.getCurrentTokenRow(),
                        column: a.getCurrentTokenColumn() + b.value.length,
                      }),
                      a.stepForward(),
                      e
                    );
                  }
                }
              while ((b = a.stepForward()));
              return null;
            }),
            (this._readTagBackward = function (a) {
              var b = a.getCurrentToken();
              if (!b) return null;
              var c = "",
                d;
              do
                if (b.type.indexOf("meta.tag") === 0) {
                  d ||
                    (d = {
                      row: a.getCurrentTokenRow(),
                      column: a.getCurrentTokenColumn() + b.value.length,
                    }),
                    (c = b.value + c);
                  if (c.indexOf("<") !== -1) {
                    var e = this._parseTag(c);
                    return (
                      (e.end = d),
                      (e.start = {
                        row: a.getCurrentTokenRow(),
                        column: a.getCurrentTokenColumn(),
                      }),
                      a.stepBackward(),
                      e
                    );
                  }
                }
              while ((b = a.stepBackward()));
              return null;
            }),
            (this._pop = function (a, b) {
              while (a.length) {
                var c = a[a.length - 1];
                if (!b || c.tagName == b.tagName) return a.pop();
                if (this.voidElements[b.tagName]) return;
                if (this.voidElements[c.tagName]) {
                  a.pop();
                  continue;
                }
                return null;
              }
            }),
            (this.getFoldWidgetRange = function (a, b, c) {
              var d = this._getFirstTagInLine(a, c);
              if (!d.match) return null;
              var e = d.closing || d.selfClosing,
                g = [],
                i;
              if (!e) {
                var j = new h(a, c, d.column),
                  k = { row: c, column: d.column + d.tagName.length + 2 };
                while ((i = this._readTagForward(j))) {
                  if (i.selfClosing) {
                    if (!g.length)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        (i.end.column -= 2),
                        f.fromPoints(i.start, i.end)
                      );
                    continue;
                  }
                  if (i.closing) {
                    this._pop(g, i);
                    if (g.length == 0) return f.fromPoints(k, i.start);
                  } else g.push(i);
                }
              } else {
                var j = new h(a, c, d.column + d.match.length),
                  l = { row: c, column: d.column };
                while ((i = this._readTagBackward(j))) {
                  if (i.selfClosing) {
                    if (!g.length)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        (i.end.column -= 2),
                        f.fromPoints(i.start, i.end)
                      );
                    continue;
                  }
                  if (!i.closing) {
                    this._pop(g, i);
                    if (g.length == 0)
                      return (
                        (i.start.column += i.tagName.length + 2),
                        f.fromPoints(i.start, l)
                      );
                  } else g.push(i);
                }
              }
            });
        }.call(i.prototype);
    }
  );
