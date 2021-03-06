define("ace/keyboard/emacs", [
  "require",
  "exports",
  "module",
  "ace/lib/dom",
  "ace/keyboard/hash_handler",
  "ace/lib/keys",
], function (a, b, c) {
  var d = a("../lib/dom"),
    e = function (a, b) {
      var c = this.scroller.getBoundingClientRect(),
        e = Math.floor(
          (a +
            this.scrollLeft -
            c.left -
            this.$padding -
            d.getPageScrollLeft()) /
            this.characterWidth
        ),
        f = Math.floor(
          (b + this.scrollTop - c.top - d.getPageScrollTop()) / this.lineHeight
        );
      return this.session.screenToDocumentPosition(f, e);
    },
    f = a("./hash_handler").HashHandler;
  b.handler = new f();
  var g = !1;
  (b.handler.attach = function (a) {
    g ||
      ((g = !0),
      d.importCssString(
        "            .emacs-mode .ace_cursor{                border: 2px rgba(50,250,50,0.8) solid!important;                -moz-box-sizing: border-box!important;                box-sizing: border-box!important;                background-color: rgba(0,250,0,0.9);                opacity: 0.5;            }            .emacs-mode .ace_cursor.ace_hidden{                opacity: 1;                background-color: transparent;            }            .emacs-mode .ace_cursor.ace_overwrite {                opacity: 1;                background-color: transparent;                border-width: 0 0 2px 2px !important;            }            .emacs-mode .ace_text-layer {                z-index: 4            }            .emacs-mode .ace_cursor-layer {                z-index: 2            }",
        "emacsMode"
      )),
      (a.renderer.screenToTextCoordinates = e),
      a.setStyle("emacs-mode");
  }),
    (b.handler.detach = function (a) {
      delete a.renderer.screenToTextCoordinates, a.unsetStyle("emacs-mode");
    });
  var h = a("../lib/keys").KEY_MODS,
    i = { C: "ctrl", S: "shift", M: "alt" };
  ["S-C-M", "S-C", "S-M", "C-M", "S", "C", "M"].forEach(function (a) {
    var b = 0;
    a.split("-").forEach(function (a) {
      b |= h[i[a]];
    }),
      (i[b] = a.toLowerCase() + "-");
  }),
    (b.handler.bindKey = function (a, b) {
      if (!a) return;
      var c = this.commmandKeyBinding;
      a.split("|").forEach(function (a) {
        (a = a.toLowerCase()),
          (c[a] = b),
          (a = a.split(" ")[0]),
          c[a] || (c[a] = "null");
      }, this);
    }),
    (b.handler.handleKeyboard = function (a, b, c, d) {
      if (b == -1 && a.count) {
        var e = Array(a.count + 1).join(c);
        return (a.count = null), { command: "insertstring", args: e };
      }
      if (c == "\0") return;
      var f = i[b];
      if (f == "c-" || a.universalArgument) {
        var g = parseInt(c[c.length - 1]);
        if (g) return (a.count = g), { command: "null" };
      }
      (a.universalArgument = !1),
        f && (c = f + c),
        a.keyChain && (c = a.keyChain += " " + c);
      var h = this.commmandKeyBinding[c];
      a.keyChain = h == "null" ? c : "";
      if (!h) return;
      if (h == "null") return { command: "null" };
      if (h == "universalArgument")
        return (a.universalArgument = !0), { command: "null" };
      if (typeof h != "string") {
        var j = h.args;
        h = h.command;
      }
      typeof h == "string" &&
        (h = this.commands[h] || a.editor.commands.commands[h]),
        !h.readonly && !h.isYank && (a.lastCommand = null);
      if (a.count) {
        var g = a.count;
        return (
          (a.count = 0),
          {
            args: j,
            command: {
              exec: function (a, b) {
                for (var c = 0; c < g; c++) h.exec(a, b);
              },
            },
          }
        );
      }
      return { command: h, args: j };
    }),
    (b.emacsKeys = {
      "Up|C-p": "golineup",
      "Down|C-n": "golinedown",
      "Left|C-b": "gotoleft",
      "Right|C-f": "gotoright",
      "C-Left|M-b": "gotowordleft",
      "C-Right|M-f": "gotowordright",
      "Home|C-a": "gotolinestart",
      "End|C-e": "gotolineend",
      "C-Home|S-M-,": "gotostart",
      "C-End|S-M-.": "gotoend",
      "S-Up|S-C-p": "selectup",
      "S-Down|S-C-n": "selectdown",
      "S-Left|S-C-b": "selectleft",
      "S-Right|S-C-f": "selectright",
      "S-C-Left|S-M-b": "selectwordleft",
      "S-C-Right|S-M-f": "selectwordright",
      "S-Home|S-C-a": "selecttolinestart",
      "S-End|S-C-e": "selecttolineend",
      "S-C-Home": "selecttostart",
      "S-C-End": "selecttoend",
      "C-l": "recenterTopBottom",
      "M-s": "centerselection",
      "M-g": "gotoline",
      "C-x C-p": "selectall",
      "C-Down": "gotopagedown",
      "C-Up": "gotopageup",
      "PageDown|C-v": "gotopagedown",
      "PageUp|M-v": "gotopageup",
      "S-C-Down": "selectpagedown",
      "S-C-Up": "selectpageup",
      "C-s": "findnext",
      "C-r": "findprevious",
      "M-C-s": "findnext",
      "M-C-r": "findprevious",
      "S-M-5": "replace",
      Backspace: "backspace",
      "Delete|C-d": "del",
      "Return|C-m": { command: "insertstring", args: "\n" },
      "C-o": "splitline",
      "M-d|C-Delete": { command: "killWord", args: "right" },
      "C-Backspace|M-Backspace|M-Delete": { command: "killWord", args: "left" },
      "C-k": "killLine",
      "C-y|S-Delete": "yank",
      "M-y": "yankRotate",
      "C-g": "keyboardQuit",
      "C-w": "killRegion",
      "M-w": "killRingSave",
      "C-Space": "setMark",
      "C-x C-x": "exchangePointAndMark",
      "C-t": "transposeletters",
      "M-u": "touppercase",
      "M-l": "tolowercase",
      "M-/": "autocomplete",
      "C-u": "universalArgument",
      "M-;": "togglecomment",
      "C-/|C-x u|S-C--|C-z": "undo",
      "S-C-/|S-C-x u|C--|S-C-z": "redo",
      "C-x r": "selectRectangularRegion",
    }),
    b.handler.bindKeys(b.emacsKeys),
    b.handler.addCommands({
      recenterTopBottom: function (a) {
        var b = a.renderer,
          c = b.$cursorLayer.getPixelPosition(),
          d = b.$size.scrollerHeight - b.lineHeight,
          e = b.scrollTop;
        Math.abs(c.top - e) < 2
          ? (e = c.top - d)
          : Math.abs(c.top - e - d * 0.5) < 2
          ? (e = c.top)
          : (e = c.top - d * 0.5),
          a.session.setScrollTop(e);
      },
      selectRectangularRegion: function (a) {
        a.multiSelect.toggleBlockSelection();
      },
      setMark: function () {},
      exchangePointAndMark: {
        exec: function (a) {
          var b = a.selection.getRange();
          a.selection.setSelectionRange(b, !a.selection.isBackwards());
        },
        readonly: !0,
        multiselectAction: "forEach",
      },
      killWord: {
        exec: function (a, c) {
          a.clearSelection(),
            c == "left"
              ? a.selection.selectWordLeft()
              : a.selection.selectWordRight();
          var d = a.getSelectionRange(),
            e = a.session.getTextRange(d);
          b.killRing.add(e), a.session.remove(d), a.clearSelection();
        },
        multiselectAction: "forEach",
      },
      killLine: function (a) {
        a.selection.selectLine();
        var c = a.getSelectionRange(),
          d = a.session.getTextRange(c);
        b.killRing.add(d), a.session.remove(c), a.clearSelection();
      },
      yank: function (a) {
        a.onPaste(b.killRing.get()), (a.keyBinding.$data.lastCommand = "yank");
      },
      yankRotate: function (a) {
        if (a.keyBinding.$data.lastCommand != "yank") return;
        a.undo(),
          a.onPaste(b.killRing.rotate()),
          (a.keyBinding.$data.lastCommand = "yank");
      },
      killRegion: function (a) {
        b.killRing.add(a.getCopyText()), a.commands.byName.cut.exec(a);
      },
      killRingSave: function (a) {
        b.killRing.add(a.getCopyText());
      },
    });
  var j = b.handler.commands;
  (j.yank.isYank = !0),
    (j.yankRotate.isYank = !0),
    (b.killRing = {
      $data: [],
      add: function (a) {
        a && this.$data.push(a), this.$data.length > 30 && this.$data.shift();
      },
      get: function () {
        return this.$data[this.$data.length - 1] || "";
      },
      pop: function () {
        return this.$data.length > 1 && this.$data.pop(), this.get();
      },
      rotate: function () {
        return this.$data.unshift(this.$data.pop()), this.get();
      },
    });
});
