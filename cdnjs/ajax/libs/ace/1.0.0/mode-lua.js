define(
  "ace/mode/lua",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/lua_highlight_rules",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./lua_highlight_rules").LuaHighlightRules,
      h = a("../range").Range,
      i = function () {
        this.$tokenizer = new f(new g().getRules());
      };
    d.inherits(i, e),
      function () {
        function c(b) {
          var c = 0;
          for (var d in b) {
            var e = b[d];
            e.type == "keyword"
              ? e.value in a && (c += a[e.value])
              : e.type == "paren.lparen"
              ? c++
              : e.type == "paren.rparen" && c--;
          }
          return c < 0 ? -1 : c > 0 ? 1 : 0;
        }
        var a = {
            function: 1,
            then: 1,
            do: 1,
            else: 1,
            elseif: 1,
            repeat: 1,
            end: -1,
            until: -1,
          },
          b = ["else", "elseif", "end", "until"];
        (this.getNextLineIndent = function (a, b, d) {
          var e = this.$getIndent(b),
            f = 0,
            g = this.$tokenizer.getLineTokens(b, a),
            h = g.tokens;
          return (
            a == "start" && (f = c(h)),
            f > 0
              ? e + d
              : f < 0 &&
                e.substr(e.length - d.length) == d &&
                !this.checkOutdent(a, b, "\n")
              ? e.substr(0, e.length - d.length)
              : e
          );
        }),
          (this.checkOutdent = function (a, c, d) {
            if (d != "\n" && d != "\r" && d != "\r\n") return !1;
            if (c.match(/^\s*[\)\}\]]$/)) return !0;
            var e = this.$tokenizer.getLineTokens(c.trim(), a).tokens;
            return !e || !e.length
              ? !1
              : e[0].type == "keyword" && b.indexOf(e[0].value) != -1;
          }),
          (this.autoOutdent = function (a, b, d) {
            var e = b.getLine(d - 1),
              f = this.$getIndent(e).length,
              g = this.$tokenizer.getLineTokens(e, "start").tokens,
              i = b.getTabString().length,
              j = f + i * c(g),
              k = this.$getIndent(b.getLine(d)).length;
            if (k < j) return;
            b.outdentRows(new h(d, 0, d + 2, 0));
          });
      }.call(i.prototype),
      (b.Mode = i);
  }
),
  define(
    "ace/mode/lua_highlight_rules",
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
          var a =
              "break|do|else|elseif|end|for|function|if|in|local|repeat|return|then|until|while|or|and|not",
            b = "true|false|nil|_G|_VERSION",
            c =
              "string|xpcall|package|tostring|print|os|unpack|require|getfenv|setmetatable|next|assert|tonumber|io|rawequal|collectgarbage|getmetatable|module|rawset|math|debug|pcall|table|newproxy|type|coroutine|_G|select|gcinfo|pairs|rawget|loadstring|ipairs|_VERSION|dofile|setfenv|load|error|loadfile|sub|upper|len|gfind|rep|find|match|char|dump|gmatch|reverse|byte|format|gsub|lower|preload|loadlib|loaded|loaders|cpath|config|path|seeall|exit|setlocale|date|getenv|difftime|remove|time|clock|tmpname|rename|execute|lines|write|close|flush|open|output|type|read|stderr|stdin|input|stdout|popen|tmpfile|log|max|acos|huge|ldexp|pi|cos|tanh|pow|deg|tan|cosh|sinh|random|randomseed|frexp|ceil|floor|rad|abs|sqrt|modf|asin|min|mod|fmod|log10|atan2|exp|sin|atan|getupvalue|debug|sethook|getmetatable|gethook|setmetatable|setlocal|traceback|setfenv|getinfo|setupvalue|getlocal|getregistry|getfenv|setn|insert|getn|foreachi|maxn|foreach|concat|sort|remove|resume|yield|status|wrap|create|running|__add|__sub|__mod|__unm|__concat|__lt|__index|__call|__gc|__metatable|__mul|__div|__pow|__len|__eq|__le|__newindex|__tostring|__mode|__tonumber",
            d = "string|package|os|io|math|debug|table|coroutine",
            e = "",
            f = "setn|foreach|foreachi|gcinfo|log10|maxn",
            g = this.createKeywordMapper(
              {
                keyword: a,
                "support.function": c,
                "invalid.deprecated": f,
                "constant.library": d,
                "constant.language": b,
                "invalid.illegal": e,
                "variable.language": "this",
              },
              "identifier"
            ),
            h = "",
            i = "(?:(?:[1-9]\\d*)|(?:0))",
            j = "(?:0[xX][\\dA-Fa-f]+)",
            k = "(?:" + i + "|" + j + ")",
            l = "(?:\\.\\d+)",
            m = "(?:\\d+)",
            n = "(?:(?:" + m + "?" + l + ")|(?:" + m + "\\.))",
            o = "(?:" + n + ")",
            p = [];
          this.$rules = {
            start: [
              { token: "comment", regex: h + "\\-\\-\\[\\[.*\\]\\]" },
              { token: "comment", regex: h + "\\-\\-\\[\\=\\[.*\\]\\=\\]" },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={2}\\[.*\\]\\={2}\\]",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={3}\\[.*\\]\\={3}\\]",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={4}\\[.*\\]\\={4}\\]",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={5}\\=*\\[.*\\]\\={5}\\=*\\]",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\[.*$",
                merge: !0,
                next: "qcomment",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\=\\[.*$",
                merge: !0,
                next: "qcomment1",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={2}\\[.*$",
                merge: !0,
                next: "qcomment2",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={3}\\[.*$",
                merge: !0,
                next: "qcomment3",
              },
              {
                token: "comment",
                regex: h + "\\-\\-\\[\\={4}\\[.*$",
                merge: !0,
                next: "qcomment4",
              },
              {
                token: function (a) {
                  var b = /\-\-\[(\=+)\[/,
                    c;
                  return (
                    (c = b.exec(a)) != null &&
                      (c = c[1]) != undefined &&
                      p.push(c.length),
                    "comment"
                  );
                },
                regex: h + "\\-\\-\\[\\={5}\\=*\\[.*$",
                merge: !0,
                next: "qcomment5",
              },
              { token: "comment", regex: "\\-\\-.*$" },
              { token: "string", regex: h + "\\[\\[.*\\]\\]" },
              { token: "string", regex: h + "\\[\\=\\[.*\\]\\=\\]" },
              { token: "string", regex: h + "\\[\\={2}\\[.*\\]\\={2}\\]" },
              { token: "string", regex: h + "\\[\\={3}\\[.*\\]\\={3}\\]" },
              { token: "string", regex: h + "\\[\\={4}\\[.*\\]\\={4}\\]" },
              {
                token: "string",
                regex: h + "\\[\\={5}\\=*\\[.*\\]\\={5}\\=*\\]",
              },
              {
                token: "string",
                regex: h + "\\[\\[.*$",
                merge: !0,
                next: "qstring",
              },
              {
                token: "string",
                regex: h + "\\[\\=\\[.*$",
                merge: !0,
                next: "qstring1",
              },
              {
                token: "string",
                regex: h + "\\[\\={2}\\[.*$",
                merge: !0,
                next: "qstring2",
              },
              {
                token: "string",
                regex: h + "\\[\\={3}\\[.*$",
                merge: !0,
                next: "qstring3",
              },
              {
                token: "string",
                regex: h + "\\[\\={4}\\[.*$",
                merge: !0,
                next: "qstring4",
              },
              {
                token: function (a) {
                  var b = /\[(\=+)\[/,
                    c;
                  return (
                    (c = b.exec(a)) != null &&
                      (c = c[1]) != undefined &&
                      p.push(c.length),
                    "string"
                  );
                },
                regex: h + "\\[\\={5}\\=*\\[.*$",
                merge: !0,
                next: "qstring5",
              },
              { token: "string", regex: h + '"(?:[^\\\\]|\\\\.)*?"' },
              { token: "string", regex: h + "'(?:[^\\\\]|\\\\.)*?'" },
              { token: "constant.numeric", regex: o },
              { token: "constant.numeric", regex: k + "\\b" },
              { token: g, regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b" },
              {
                token: "keyword.operator",
                regex:
                  "\\+|\\-|\\*|\\/|%|\\#|\\^|~|<|>|<=|=>|==|~=|=|\\:|\\.\\.\\.|\\.\\.",
              },
              { token: "paren.lparen", regex: "[\\[\\(\\{]" },
              { token: "paren.rparen", regex: "[\\]\\)\\}]" },
              { token: "text", regex: "\\s+" },
            ],
            qcomment: [
              {
                token: "comment",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qcomment1: [
              {
                token: "comment",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\=\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qcomment2: [
              {
                token: "comment",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={2}\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qcomment3: [
              {
                token: "comment",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={3}\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qcomment4: [
              {
                token: "comment",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={4}\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qcomment5: [
              {
                token: function (a) {
                  var b = /\](\=+)\]/,
                    c = this.rules.qcomment5[0],
                    d;
                  c.next = "start";
                  if ((d = b.exec(a)) != null && (d = d[1]) != undefined) {
                    var e = d.length,
                      f;
                    (f = p.pop()) != e && (p.push(f), (c.next = "qcomment5"));
                  }
                  return "comment";
                },
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={5}\\=*\\]",
                next: "start",
              },
              { token: "comment", merge: !0, regex: ".+" },
            ],
            qstring: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring1: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\=\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring2: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={2}\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring3: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={3}\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring4: [
              {
                token: "string",
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={4}\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
            qstring5: [
              {
                token: function (a) {
                  var b = /\](\=+)\]/,
                    c = this.rules.qstring5[0],
                    d;
                  c.next = "start";
                  if ((d = b.exec(a)) != null && (d = d[1]) != undefined) {
                    var e = d.length,
                      f;
                    (f = p.pop()) != e && (p.push(f), (c.next = "qstring5"));
                  }
                  return "string";
                },
                regex: "(?:[^\\\\]|\\\\.)*?\\]\\={5}\\=*\\]",
                next: "start",
              },
              { token: "string", merge: !0, regex: ".+" },
            ],
          };
        };
      d.inherits(f, e), (b.LuaHighlightRules = f);
    }
  );
