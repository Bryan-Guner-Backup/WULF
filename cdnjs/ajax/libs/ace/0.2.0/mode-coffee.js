define(
  "ace/mode/coffee",
  [
    "require",
    "exports",
    "module",
    "ace/tokenizer",
    "ace/mode/coffee_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
    "ace/mode/text",
    "ace/worker/worker_client",
    "pilot/oop",
  ],
  function (a, b, c) {
    function k() {
      (this.$tokenizer = new d(new e().getRules())), (this.$outdent = new f());
    }
    var d = a("ace/tokenizer").Tokenizer,
      e = a("ace/mode/coffee_highlight_rules").CoffeeHighlightRules,
      f = a("ace/mode/matching_brace_outdent").MatchingBraceOutdent,
      g = a("ace/range").Range,
      h = a("ace/mode/text").Mode,
      i = a("ace/worker/worker_client").WorkerClient,
      j = a("pilot/oop");
    j.inherits(k, h),
      function () {
        var a =
            /(?:[({[=:]|[-=]>|\b(?:else|switch|try|catch(?:\s*[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?|finally))\s*$/,
          b = /^(\s*)#/,
          c = /^\s*###(?!#)/,
          d = /^\s*/;
        (this.getNextLineIndent = function (b, c, d) {
          var e = this.$getIndent(c),
            f = this.$tokenizer.getLineTokens(c, b).tokens;
          (!f.length || f[f.length - 1].type !== "comment") &&
            b === "start" &&
            a.test(c) &&
            (e += d);
          return e;
        }),
          (this.toggleCommentLines = function (a, e, f, h) {
            console.log("toggle");
            var i = new g(0, 0, 0, 0);
            for (var j = f; j <= h; ++j) {
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
            var b = a.getDocument(),
              c = new i(
                ["ace", "pilot"],
                "worker-coffee.js",
                "ace/mode/coffee_worker",
                "Worker"
              );
            c.call("setValue", [b.getValue()]),
              b.on("change", function (a) {
                (a.range = {
                  start: a.data.range.start,
                  end: a.data.range.end,
                }),
                  c.emit("change", a);
              }),
              c.on("error", function (b) {
                a.setAnnotations([b.data]);
              }),
              c.on("ok", function (b) {
                a.clearAnnotations();
              });
          });
      }.call(k.prototype),
      (b.Mode = k);
  }
),
  define(
    "ace/mode/coffee_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      function d() {
        var a = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*",
          b = "(?![$\\w]|\\s*:)",
          c = { token: "string", merge: !0, regex: ".+" };
        this.$rules = {
          start: [
            { token: "identifier", regex: "(?:@|(?:\\.|::)\\s*)" + a },
            {
              token: "keyword",
              regex:
                "(?:t(?:h(?:is|row|en)|ry|ypeof)|s(?:uper|witch)|return|b(?:reak|y)|c(?:ontinue|atch|lass)|i(?:n(?:stanceof)?|s(?:nt)?|f)|e(?:lse|xtends)|f(?:or (?:own)?|inally|unction)|wh(?:ile|en)|n(?:ew|ot?)|d(?:e(?:lete|bugger)|o)|loop|o(?:ff?|[rn])|un(?:less|til)|and|yes)" +
                b,
            },
            {
              token: "constant.language",
              regex: "(?:true|false|null|undefined)" + b,
            },
            {
              token: "invalid.illegal",
              regex:
                "(?:c(?:ase|onst)|default|function|v(?:ar|oid)|with|e(?:num|xport)|i(?:mplements|nterface)|let|p(?:ackage|r(?:ivate|otected)|ublic)|static|yield|__(?:hasProp|extends|slice|bind|indexOf))" +
                b,
            },
            {
              token: "language.support.class",
              regex:
                "(?:Array|Boolean|Date|Function|Number|Object|R(?:e(?:gExp|ferenceError)|angeError)|S(?:tring|yntaxError)|E(?:rror|valError)|TypeError|URIError)" +
                b,
            },
            {
              token: "language.support.function",
              regex:
                "(?:Math|JSON|is(?:NaN|Finite)|parse(?:Int|Float)|encodeURI(?:Component)?|decodeURI(?:Component)?)" +
                b,
            },
            { token: "identifier", regex: a },
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
            { token: "lparen", regex: "[({[]" },
            { token: "rparen", regex: "[\\]})]" },
            { token: "keyword.operator", regex: "\\S+" },
            { token: "text", regex: "\\s+" },
          ],
          qdoc: [{ token: "string", regex: ".*?'''", next: "start" }, c],
          qqdoc: [{ token: "string", regex: '.*?"""', next: "start" }, c],
          qstring: [
            {
              token: "string",
              regex: "[^\\\\']*(?:\\\\.[^\\\\']*)*'",
              next: "start",
            },
            c,
          ],
          qqstring: [
            {
              token: "string",
              regex: '[^\\\\"]*(?:\\\\.[^\\\\"]*)*"',
              next: "start",
            },
            c,
          ],
          js: [
            {
              token: "string",
              merge: !0,
              regex: "[^\\\\`]*(?:\\\\.[^\\\\`]*)*`",
              next: "start",
            },
            c,
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
      a("pilot/oop").inherits(
        d,
        a("ace/mode/text_highlight_rules").TextHighlightRules
      ),
        (b.CoffeeHighlightRules = d);
    }
  ),
  define(
    "ace/mode/matching_brace_outdent",
    ["require", "exports", "module", "ace/range"],
    function (a, b, c) {
      var d = a("ace/range").Range,
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
    "ace/worker/worker_client",
    ["require", "exports", "module", "pilot/oop", "pilot/event_emitter"],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("pilot/event_emitter").EventEmitter,
        f = function (b, c, d, e) {
          this.callbacks = [];
          if (a.packaged)
            var f = this.$guessBasePath(),
              g = (this.$worker = new Worker(f + c));
          else {
            var h = this.$normalizePath(
                a.nameToUrl("ace/worker/worker", null, "_")
              ),
              g = (this.$worker = new Worker(h)),
              i = {};
            for (var j = 0; j < b.length; j++) {
              var k = b[j],
                l = this.$normalizePath(
                  a.nameToUrl(k, null, "_").replace(/.js$/, "")
                );
              i[k] = l;
            }
          }
          this.$worker.postMessage({
            init: !0,
            tlns: i,
            module: d,
            classname: e,
          }),
            (this.callbackId = 1),
            (this.callbacks = {});
          var m = this;
          (this.$worker.onerror = function (a) {
            window.console && console.log && console.log(a);
            throw a;
          }),
            (this.$worker.onmessage = function (a) {
              var b = a.data;
              switch (b.type) {
                case "log":
                  window.console && console.log && console.log(b.data);
                  break;
                case "event":
                  m._dispatchEvent(b.name, { data: b.data });
                  break;
                case "call":
                  var c = m.callbacks[b.id];
                  c && (c(b.data), delete m.callbacks[b.id]);
              }
            });
        };
      (function () {
        d.implement(this, e),
          (this.$normalizePath = function (a) {
            a.match(/^\w+:/) ||
              (a =
                location.protocol +
                "//" +
                location.host +
                location.pathname +
                "/" +
                a);
            return a;
          }),
          (this.$guessBasePath = function () {
            if (a.aceBaseUrl) return a.aceBaseUrl;
            var b = document.getElementsByTagName("script");
            for (var c = 0; c < b.length; c++) {
              var d = b[c],
                e = d.getAttribute("data-ace-base");
              if (e) return e.replace(/\/*$/, "/");
              var f = d.src || d.getAttribute("src");
              if (!f) continue;
              var g = f.match(
                /^(?:(.*\/)ace\.js|(.*\/)ace-uncompressed\.js)(?:\?|$)/
              );
              if (g) return g[1] || g[2];
            }
            return "";
          }),
          (this.terminate = function () {
            this._dispatchEvent("terminate", {}), this.$worker.terminate();
          }),
          (this.send = function (a, b) {
            this.$worker.postMessage({ command: a, args: b });
          }),
          (this.call = function (a, b, c) {
            if (c) {
              var d = this.callbackId++;
              (this.callbacks[d] = c), b.push(d);
            }
            this.send(a, b);
          }),
          (this.emit = function (a, b) {
            this.$worker.postMessage({ event: a, data: b });
          });
      }.call(f.prototype),
        (b.WorkerClient = f));
    }
  );
