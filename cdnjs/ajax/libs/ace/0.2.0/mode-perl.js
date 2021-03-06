define(
  "ace/mode/perl",
  [
    "require",
    "exports",
    "module",
    "pilot/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/perl_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/range",
  ],
  function (a, b, c) {
    var d = a("pilot/oop"),
      e = a("ace/mode/text").Mode,
      f = a("ace/tokenizer").Tokenizer,
      g = a("ace/mode/perl_highlight_rules").PerlHighlightRules,
      h = a("ace/mode/matching_brace_outdent").MatchingBraceOutdent,
      i = a("ace/range").Range,
      j = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h());
      };
    d.inherits(j, e),
      function () {
        (this.toggleCommentLines = function (a, b, c, d) {
          var e = !0,
            f = [],
            g = /^(\s*)#/;
          for (var h = c; h <= d; h++)
            if (!g.test(b.getLine(h))) {
              e = !1;
              break;
            }
          if (e) {
            var j = new i(0, 0, 0, 0);
            for (var h = c; h <= d; h++) {
              var k = b.getLine(h),
                l = k.match(g);
              (j.start.row = h),
                (j.end.row = h),
                (j.end.column = l[0].length),
                b.replace(j, l[1]);
            }
          } else b.indentRows(c, d, "#");
        }),
          (this.getNextLineIndent = function (a, b, c) {
            var d = this.$getIndent(b),
              e = this.$tokenizer.getLineTokens(b, a),
              f = e.tokens,
              g = e.state;
            if (f.length && f[f.length - 1].type == "comment") return d;
            if (a == "start") {
              var h = b.match(/^.*[\{\(\[\:]\s*$/);
              h && (d += c);
            }
            return d;
          }),
          (this.checkOutdent = function (a, b, c) {
            return this.$outdent.checkOutdent(b, c);
          }),
          (this.autoOutdent = function (a, b, c) {
            this.$outdent.autoOutdent(b, c);
          });
      }.call(j.prototype),
      (b.Mode = j);
  }
),
  define(
    "ace/mode/perl_highlight_rules",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "pilot/lang",
      "ace/mode/text_highlight_rules",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("pilot/lang"),
        f = a("ace/mode/text_highlight_rules").TextHighlightRules,
        g = function () {
          var a = e.arrayToMap(
              "base|constant|continue|else|elsif|for|foreach|format|goto|if|last|local|my|next|no|package|parent|redo|require|scalar|sub|unless|until|while|use|vars".split(
                "|"
              )
            ),
            b = e.arrayToMap("ARGV|ENV|INC|SIG".split("|")),
            c = e.arrayToMap(
              "getprotobynumber|getprotobyname|getservbyname|gethostbyaddr|gethostbyname|getservbyport|getnetbyaddr|getnetbyname|getsockname|getpeername|setpriority|getprotoent|setprotoent|getpriority|endprotoent|getservent|setservent|endservent|sethostent|socketpair|getsockopt|gethostent|endhostent|setsockopt|setnetent|quotemeta|localtime|prototype|getnetent|endnetent|rewinddir|wantarray|getpwuid|closedir|getlogin|readlink|endgrent|getgrgid|getgrnam|shmwrite|shutdown|readline|endpwent|setgrent|readpipe|formline|truncate|dbmclose|syswrite|setpwent|getpwnam|getgrent|getpwent|ucfirst|sysread|setpgrp|shmread|sysseek|sysopen|telldir|defined|opendir|connect|lcfirst|getppid|binmode|syscall|sprintf|getpgrp|readdir|seekdir|waitpid|reverse|unshift|symlink|dbmopen|semget|msgrcv|rename|listen|chroot|msgsnd|shmctl|accept|unpack|exists|fileno|shmget|system|unlink|printf|gmtime|msgctl|semctl|values|rindex|substr|splice|length|msgget|select|socket|return|caller|delete|alarm|ioctl|index|undef|lstat|times|srand|chown|fcntl|close|write|umask|rmdir|study|sleep|chomp|untie|print|utime|mkdir|atan2|split|crypt|flock|chmod|BEGIN|bless|chdir|semop|shift|reset|link|stat|chop|grep|fork|dump|join|open|tell|pipe|exit|glob|warn|each|bind|sort|pack|eval|push|keys|getc|kill|seek|sqrt|send|wait|rand|tied|read|time|exec|recv|eof|chr|int|ord|exp|pos|pop|sin|log|abs|oct|hex|tie|cos|vec|END|ref|map|die|uc|lc|do".split(
                "|"
              )
            );
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*$" },
              {
                token: "string.regexp",
                regex:
                  "[/](?:(?:\\[(?:\\\\]|[^\\]])+\\])|(?:\\\\/|[^\\]/]))*[/]\\w*\\s*(?=[).,;]|$)",
              },
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
              { token: "constant.numeric", regex: "0x[0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: function (d) {
                  return a.hasOwnProperty(d)
                    ? "keyword"
                    : b.hasOwnProperty(d)
                    ? "constant.language"
                    : c.hasOwnProperty(d)
                    ? "support.function"
                    : "identifier";
                },
                regex: "[a-zA-Z_$][a-zA-Z0-9_$]*\\b",
              },
              {
                token: "keyword.operator",
                regex:
                  "\\.\\.\\.|\\|\\|=|>>=|<<=|<=>|&&=|=>|!~|\\^=|&=|\\|=|\\.=|x=|%=|\\/=|\\*=|\\-=|\\+=|=~|\\*\\*|\\-\\-|\\.\\.|\\|\\||&&|\\+\\+|\\->|!=|==|>=|<=|>>|<<|,|=|\\?\\:|\\^|\\||x|%|\\/|\\*|<|&|\\\\|~|!|>|\\.|\\-|\\+|\\-C|\\-b|\\-S|\\-u|\\-t|\\-p|\\-l|\\-d|\\-f|\\-g|\\-s|\\-z|\\-k|\\-e|\\-O|\\-T|\\-B|\\-M|\\-A|\\-X|\\-W|\\-c|\\-R|\\-o|\\-x|\\-w|\\-r|\\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)",
              },
              { token: "lparen", regex: "[[({]" },
              { token: "rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
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
          };
        };
      d.inherits(g, f), (b.PerlHighlightRules = g);
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
  );
