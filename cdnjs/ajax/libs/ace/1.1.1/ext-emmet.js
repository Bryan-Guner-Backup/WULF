define("ace/ext/emmet", [
  "require",
  "exports",
  "module",
  "ace/keyboard/hash_handler",
  "ace/editor",
  "ace/config",
], function (e, t, n) {
  function o() {}
  var r = e("ace/keyboard/hash_handler").HashHandler,
    i = e("ace/editor").Editor,
    s;
  (i.prototype.indexToPosition = function (e) {
    return this.session.doc.indexToPosition(e);
  }),
    (i.prototype.positionToIndex = function (e) {
      return this.session.doc.positionToIndex(e);
    }),
    (o.prototype = {
      setupContext: function (e) {
        (this.ace = e),
          (this.indentation = e.session.getTabString()),
          s || (s = window.emmet),
          s.require("resources").setVariable("indentation", this.indentation),
          (this.$syntax = null),
          (this.$syntax = this.getSyntax());
      },
      getSelectionRange: function () {
        var e = this.ace.getSelectionRange();
        return {
          start: this.ace.positionToIndex(e.start),
          end: this.ace.positionToIndex(e.end),
        };
      },
      createSelection: function (e, t) {
        this.ace.selection.setRange({
          start: this.ace.indexToPosition(e),
          end: this.ace.indexToPosition(t),
        });
      },
      getCurrentLineRange: function () {
        var e = this.ace.getCursorPosition().row,
          t = this.ace.session.getLine(e).length,
          n = this.ace.positionToIndex({ row: e, column: 0 });
        return { start: n, end: n + t };
      },
      getCaretPos: function () {
        var e = this.ace.getCursorPosition();
        return this.ace.positionToIndex(e);
      },
      setCaretPos: function (e) {
        var t = this.ace.indexToPosition(e);
        this.ace.clearSelection(), this.ace.selection.moveCursorToPosition(t);
      },
      getCurrentLine: function () {
        var e = this.ace.getCursorPosition().row;
        return this.ace.session.getLine(e);
      },
      replaceContent: function (e, t, n, r) {
        n == null && (n = t == null ? this.getContent().length : t),
          t == null && (t = 0);
        var i = s.require("utils");
        r ||
          (e = i.padString(
            e,
            i.getLinePaddingFromPosition(this.getContent(), t)
          ));
        var o = s.require("tabStops").extract(e, {
          escape: function (e) {
            return e;
          },
        });
        e = o.text;
        var u = o.tabstops[0];
        u
          ? ((u.start += t), (u.end += t))
          : (u = { start: e.length + t, end: e.length + t });
        var a = this.ace.getSelectionRange();
        (a.start = this.ace.indexToPosition(t)),
          (a.end = this.ace.indexToPosition(n)),
          this.ace.session.replace(a, e),
          (a.start = this.ace.indexToPosition(u.start)),
          (a.end = this.ace.indexToPosition(u.end)),
          this.ace.selection.setRange(a);
      },
      getContent: function () {
        return this.ace.getValue();
      },
      getSyntax: function () {
        if (this.$syntax) return this.$syntax;
        var e = this.ace.session.$modeId.split("/").pop();
        if (e == "html" || e == "php") {
          var t = this.ace.getCursorPosition(),
            n = this.ace.session.getState(t.row);
          typeof n != "string" && (n = n[0]),
            n &&
              ((n = n.split("-")),
              n.length > 1 ? (e = n[0]) : e == "php" && (e = "html"));
        }
        return e;
      },
      getProfileName: function () {
        switch (this.getSyntax()) {
          case "css":
            return "css";
          case "xml":
          case "xsl":
            return "xml";
          case "html":
            var e = s.require("resources").getVariable("profile");
            return (
              e ||
                (e =
                  this.ace.session
                    .getLines(0, 2)
                    .join("")
                    .search(/<!DOCTYPE[^>]+XHTML/i) != -1
                    ? "xhtml"
                    : "html"),
              e
            );
        }
        return "xhtml";
      },
      prompt: function (e) {
        return prompt(e);
      },
      getSelection: function () {
        return this.ace.session.getTextRange();
      },
      getFilePath: function () {
        return "";
      },
    });
  var u = {
      expand_abbreviation: { mac: "ctrl+alt+e", win: "alt+e" },
      match_pair_outward: { mac: "ctrl+d", win: "ctrl+," },
      match_pair_inward: { mac: "ctrl+j", win: "ctrl+shift+0" },
      matching_pair: { mac: "ctrl+alt+j", win: "alt+j" },
      next_edit_point: "alt+right",
      prev_edit_point: "alt+left",
      toggle_comment: { mac: "command+/", win: "ctrl+/" },
      split_join_tag: { mac: "shift+command+'", win: "shift+ctrl+`" },
      remove_tag: { mac: "command+'", win: "shift+ctrl+;" },
      evaluate_math_expression: { mac: "shift+command+y", win: "shift+ctrl+y" },
      increment_number_by_1: "ctrl+up",
      decrement_number_by_1: "ctrl+down",
      increment_number_by_01: "alt+up",
      decrement_number_by_01: "alt+down",
      increment_number_by_10: { mac: "alt+command+up", win: "shift+alt+up" },
      decrement_number_by_10: {
        mac: "alt+command+down",
        win: "shift+alt+down",
      },
      select_next_item: { mac: "shift+command+.", win: "shift+ctrl+." },
      select_previous_item: { mac: "shift+command+,", win: "shift+ctrl+," },
      reflect_css_value: { mac: "shift+command+r", win: "shift+ctrl+r" },
      encode_decode_data_url: { mac: "shift+ctrl+d", win: "ctrl+'" },
      expand_abbreviation_with_tab: "Tab",
      wrap_with_abbreviation: { mac: "shift+ctrl+a", win: "shift+ctrl+a" },
    },
    a = new o();
  (t.commands = new r()),
    (t.runEmmetCommand = function (e) {
      a.setupContext(e);
      if (a.getSyntax() == "php") return !1;
      var t = s.require("actions");
      if (
        this.action == "expand_abbreviation_with_tab" &&
        !e.selection.isEmpty()
      )
        return !1;
      if (this.action == "wrap_with_abbreviation")
        return setTimeout(function () {
          t.run("wrap_with_abbreviation", a);
        }, 0);
      try {
        var n = t.run(this.action, a);
      } catch (r) {
        e._signal("changeStatus", typeof r == "string" ? r : r.message),
          console.log(r);
      }
      return n;
    });
  for (var f in u)
    t.commands.addCommand({
      name: "emmet:" + f,
      action: f,
      bindKey: u[f],
      exec: t.runEmmetCommand,
      multiSelectAction: "forEach",
    });
  var l = function (e, n) {
    var r = n;
    if (!r) return;
    var i = r.session.$modeId,
      s = i && /css|less|sass|html|php/.test(i);
    e.enableEmmet === !1 && (s = !1),
      s
        ? r.keyBinding.addKeyboardHandler(t.commands)
        : r.keyBinding.removeKeyboardHandler(t.commands);
  };
  (t.AceEmmetEditor = o),
    e("ace/config").defineOptions(i.prototype, "editor", {
      enableEmmet: {
        set: function (e) {
          this[e ? "on" : "removeListener"]("changeMode", l),
            l({ enableEmmet: !!e }, this);
        },
        value: !0,
      },
    }),
    (t.setCore = function (e) {
      s = e;
    });
});
