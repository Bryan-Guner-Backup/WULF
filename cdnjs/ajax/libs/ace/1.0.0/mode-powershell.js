define(
  "ace/mode/powershell",
  [
    "require",
    "exports",
    "module",
    "ace/lib/oop",
    "ace/mode/text",
    "ace/tokenizer",
    "ace/mode/powershell_highlight_rules",
    "ace/mode/matching_brace_outdent",
    "ace/mode/behaviour/cstyle",
    "ace/mode/folding/cstyle",
  ],
  function (a, b, c) {
    var d = a("../lib/oop"),
      e = a("./text").Mode,
      f = a("../tokenizer").Tokenizer,
      g = a("./powershell_highlight_rules").PowershellHighlightRules,
      h = a("./matching_brace_outdent").MatchingBraceOutdent,
      i = a("./behaviour/cstyle").CstyleBehaviour,
      j = a("./folding/cstyle").FoldMode,
      k = function () {
        (this.$tokenizer = new f(new g().getRules())),
          (this.$outdent = new h()),
          (this.$behaviour = new i()),
          (this.foldingRules = new j());
      };
    d.inherits(k, e),
      function () {
        (this.getNextLineIndent = function (a, b, c) {
          var d = this.$getIndent(b),
            e = this.$tokenizer.getLineTokens(b, a),
            f = e.tokens;
          if (f.length && f[f.length - 1].type == "comment") return d;
          if (a == "start") {
            var g = b.match(/^.*[\{\(\[]\s*$/);
            g && (d += c);
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
            return null;
          });
      }.call(k.prototype),
      (b.Mode = k);
  }
),
  define(
    "ace/mode/powershell_highlight_rules",
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
              "function|if|else|elseif|switch|while|default|for|do|until|break|continue|foreach|return|filter|in|trap|throw|param|begin|process|end",
            b =
              "Get-Alias|Import-Alias|New-Alias|Set-Alias|Get-AuthenticodeSignature|Set-AuthenticodeSignature|Set-Location|Get-ChildItem|Clear-Item|Get-Command|Measure-Command|Trace-Command|Add-Computer|Checkpoint-Computer|Remove-Computer|Restart-Computer|Restore-Computer|Stop-Computer|Reset-ComputerMachinePassword|Test-ComputerSecureChannel|Add-Content|Get-Content|Set-Content|Clear-Content|Get-Command|Invoke-Command|Enable-ComputerRestore|Disable-ComputerRestore|Get-ComputerRestorePoint|Test-Connection|ConvertFrom-CSV|ConvertTo-CSV|ConvertTo-Html|ConvertTo-Xml|ConvertFrom-SecureString|ConvertTo-SecureString|Copy-Item|Export-Counter|Get-Counter|Import-Counter|Get-Credential|Get-Culture|Get-ChildItem|Get-Date|Set-Date|Remove-Item|Compare-Object|Get-Event|Get-WinEvent|New-Event|Remove-Event|Unregister-Event|Wait-Event|Clear-EventLog|Get-Eventlog|Limit-EventLog|New-Eventlog|Remove-EventLog|Show-EventLog|Write-EventLog|Get-EventSubscriber|Register-EngineEvent|Register-ObjectEvent|Register-WmiEvent|Get-ExecutionPolicy|Set-ExecutionPolicy|Export-Alias|Export-Clixml|Export-Console|Export-Csv|ForEach-Object|Format-Custom|Format-List|Format-Table|Format-Wide|Export-FormatData|Get-FormatData|Get-Item|Get-ChildItem|Get-Help|Add-History|Clear-History|Get-History|Invoke-History|Get-Host|Read-Host|Write-Host|Get-HotFix|Import-Clixml|Import-Csv|Invoke-Command|Invoke-Expression|Get-Item|Invoke-Item|New-Item|Remove-Item|Set-Item|Clear-ItemProperty|Copy-ItemProperty|Get-ItemProperty|Move-ItemProperty|New-ItemProperty|Remove-ItemProperty|Rename-ItemProperty|Set-ItemProperty|Get-Job|Receive-Job|Remove-Job|Start-Job|Stop-Job|Wait-Job|Stop-Process|Update-List|Get-Location|Pop-Location|Push-Location|Set-Location|Send-MailMessage|Add-Member|Get-Member|Move-Item|Compare-Object|Group-Object|Measure-Object|New-Object|Select-Object|Sort-Object|Where-Object|Out-Default|Out-File|Out-GridView|Out-Host|Out-Null|Out-Printer|Out-String|Convert-Path|Join-Path|Resolve-Path|Split-Path|Test-Path|Get-Pfxcertificate|Pop-Location|Push-Location|Get-Process|Start-Process|Stop-Process|Wait-Process|Enable-PSBreakpoint|Disable-PSBreakpoint|Get-PSBreakpoint|Set-PSBreakpoint|Remove-PSBreakpoint|Get-PSDrive|New-PSDrive|Remove-PSDrive|Get-PSProvider|Set-PSdebug|Enter-PSSession|Exit-PSSession|Export-PSSession|Get-PSSession|Import-PSSession|New-PSSession|Remove-PSSession|Disable-PSSessionConfiguration|Enable-PSSessionConfiguration|Get-PSSessionConfiguration|Register-PSSessionConfiguration|Set-PSSessionConfiguration|Unregister-PSSessionConfiguration|New-PSSessionOption|Add-PsSnapIn|Get-PsSnapin|Remove-PSSnapin|Get-Random|Read-Host|Remove-Item|Rename-Item|Rename-ItemProperty|Select-Object|Select-XML|Send-MailMessage|Get-Service|New-Service|Restart-Service|Resume-Service|Set-Service|Start-Service|Stop-Service|Suspend-Service|Sort-Object|Start-Sleep|ConvertFrom-StringData|Select-String|Tee-Object|New-Timespan|Trace-Command|Get-Tracesource|Set-Tracesource|Start-Transaction|Complete-Transaction|Get-Transaction|Use-Transaction|Undo-Transaction|Start-Transcript|Stop-Transcript|Add-Type|Update-TypeData|Get-Uiculture|Get-Unique|Update-Formatdata|Update-Typedata|Clear-Variable|Get-Variable|New-Variable|Remove-Variable|Set-Variable|New-WebServiceProxy|Where-Object|Write-Debug|Write-Error|Write-Host|Write-Output|Write-Progress|Write-Verbose|Write-Warning|Set-WmiInstance|Invoke-WmiMethod|Get-WmiObject|Remove-WmiObject|Connect-WSMan|Disconnect-WSMan|Test-WSMan|Invoke-WSManAction|Disable-WSManCredSSP|Enable-WSManCredSSP|Get-WSManCredSSP|New-WSManInstance|Get-WSManInstance|Set-WSManInstance|Remove-WSManInstance|Set-WSManQuickConfig|New-WSManSessionOption",
            c = this.createKeywordMapper(
              { "support.function": b, keyword: a },
              "identifier"
            ),
            d =
              "eq|ne|ge|gt|lt|le|like|notlike|match|notmatch|replace|contains|notcontains|ieq|ine|ige|igt|ile|ilt|ilike|inotlike|imatch|inotmatch|ireplace|icontains|inotcontains|is|isnot|as|and|or|band|bor|not";
          this.$rules = {
            start: [
              { token: "comment", regex: "#.*$" },
              { token: "string", regex: '["](?:(?:\\\\.)|(?:[^"\\\\]))*?["]' },
              { token: "string", regex: "['](?:(?:\\\\.)|(?:[^'\\\\]))*?[']" },
              { token: "constant.numeric", regex: "0[xX][0-9a-fA-F]+\\b" },
              {
                token: "constant.numeric",
                regex: "[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b",
              },
              {
                token: "constant.language.boolean",
                regex: "[$](?:[Tt]rue|[Ff]alse)\\b",
              },
              { token: "constant.language", regex: "[$][Nn]ull\\b" },
              {
                token: "variable.instance",
                regex: "[$][a-zA-Z][a-zA-Z0-9_]*\\b",
              },
              { token: c, regex: "[a-zA-Z_$][a-zA-Z0-9_$\\-]*\\b" },
              { token: "keyword.operator", regex: "\\-(?:" + d + ")" },
              {
                token: "keyword.operator",
                regex: "&|\\*|\\+|\\-|\\=|\\+=|\\-=",
              },
              { token: "lparen", regex: "[[({]" },
              { token: "rparen", regex: "[\\])}]" },
              { token: "text", regex: "\\s+" },
            ],
            comment: [
              { token: "comment", regex: ".*?\\*\\/", next: "start" },
              { token: "comment", merge: !0, regex: ".+" },
            ],
          };
        };
      d.inherits(f, e), (b.PowershellHighlightRules = f);
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
  );
