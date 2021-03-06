define("ace/ext/options", ["require", "exports", "module"], function (e, t, n) {
  function u(e, t) {
    var n = document.getElementById(e);
    localStorage &&
      localStorage.getItem(e) &&
      (n.checked = localStorage.getItem(e) == "1");
    var r = function () {
      t(!!n.checked), saveOption(n);
    };
    (n.onclick = r), r();
  }
  function a(e, t) {
    var n = document.getElementById(e);
    localStorage &&
      localStorage.getItem(e) &&
      (n.value = localStorage.getItem(e));
    var r = function () {
      t(n.value), saveOption(n);
    };
    (n.onchange = r), r();
  }
  function f(e, t) {
    e.forEach(function (e) {
      var n = document.createElement("option");
      n.setAttribute("value", e.name), (n.innerHTML = e.desc), t.appendChild(n);
    });
  }
  function l(e, t) {
    if (Array.isArray(e)) {
      f(e, t);
      return;
    }
    for (var n in e) {
      var r = document.createElement("optgroup");
      r.setAttribute("label", n), f(e[n], r), t.appendChild(r);
    }
  }
  function c(e) {
    if (e.values) {
      var t = dom.createElement("select");
      t.setAttribute("size", e.visibleSize || 1), l(e.values, t);
    } else var t = dom.createElement("checkbox");
    return t.setAttribute("name", "opt_" + e.name), t;
  }
  function h(e) {
    if (e.values) {
      var t = dom.createElement("select");
      t.setAttribute("size", e.visibleSize || 1), l(e.values, t);
    } else var t = dom.createElement("checkbox");
    return t.setAttribute("name", "opt_" + e.name), t;
  }
  var r = modelist.modesByName,
    i = [
      [
        "Document",
        function (e) {
          doclist.loadDoc(e, function (e) {
            if (!e) return;
            (e = env.split.setSession(e)),
              updateUIEditorOptions(),
              env.editor.focus();
          });
        },
        doclist.all,
      ],
      [
        "Mode",
        function (e) {
          env.editor.session.setMode(r[e].mode || r.text.mode),
            (env.editor.session.modeName = e);
        },
        function (e) {
          return env.editor.session.modeName || "text";
        },
        modelist.modes,
      ],
      [
        "Split",
        function (e) {
          var t = env.split;
          if (e == "none")
            t.getSplits() == 2 && (env.secondSession = t.getEditor(1).session),
              t.setSplits(1);
          else {
            var n = t.getSplits() == 1;
            e == "below"
              ? t.setOrientation(t.BELOW)
              : t.setOrientation(t.BESIDE),
              t.setSplits(2);
            if (n) {
              var r = env.secondSession || t.getEditor(0).session,
                i = t.setSession(r, 1);
              i.name = r.name;
            }
          }
        },
        ["None", "Beside", "Below"],
      ],
      [
        "Theme",
        function (e) {
          if (!e) return;
          env.editor.setTheme("ace/theme/" + e), (themeEl.selectedValue = e);
        },
        function () {
          return env.editor.getTheme();
        },
        {
          Bright: {
            chrome: "Chrome",
            clouds: "Clouds",
            crimson_editor: "Crimson Editor",
            dawn: "Dawn",
            dreamweaver: "Dreamweaver",
            eclipse: "Eclipse",
            github: "GitHub",
            solarized_light: "Solarized Light",
            textmate: "TextMate",
            tomorrow: "Tomorrow",
            xcode: "XCode",
          },
          Dark: {
            ambiance: "Ambiance",
            chaos: "Chaos",
            clouds_midnight: "Clouds Midnight",
            cobalt: "Cobalt",
            idle_fingers: "idleFingers",
            kr_theme: "krTheme",
            merbivore: "Merbivore",
            merbivore_soft: "Merbivore Soft",
            mono_industrial: "Mono Industrial",
            monokai: "Monokai",
            pastel_on_dark: "Pastel on dark",
            solarized_dark: "Solarized Dark",
            twilight: "Twilight",
            tomorrow_night: "Tomorrow Night",
            tomorrow_night_blue: "Tomorrow Night Blue",
            tomorrow_night_bright: "Tomorrow Night Bright",
            tomorrow_night_eighties: "Tomorrow Night 80s",
            vibrant_ink: "Vibrant Ink",
          },
        },
      ],
      [
        "Code Folding",
        function (e) {
          env.editor.getSession().setFoldStyle(e),
            env.editor.setShowFoldWidgets(e !== "manual");
        },
        ["manual", "mark begin", "mark begin and end"],
      ],
      [
        "Soft Wrap",
        function (e) {
          e = e.toLowerCase();
          var t = env.editor.getSession(),
            n = env.editor.renderer;
          t.setUseWrapMode(e == "off");
          var r = parseInt(e) || null;
          n.setPrintMarginColumn(r || 80), t.setWrapLimitRange(r, r);
        },
        ["Off", "40 Chars", "80 Chars", "Free"],
      ],
      [
        "Key Binding",
        function (e) {
          env.editor.setKeyboardHandler(keybindings[e]);
        },
        ["Ace", "Vim", "Emacs", "Custom"],
      ],
      [
        "Font Size",
        function (e) {
          env.split.setFontSize(e + "px");
        },
        [10, 11, 12, 14, 16, 20, 24],
      ],
      [
        "Full Line Selection",
        function (e) {
          env.editor.setSelectionStyle(e ? "line" : "text");
        },
      ],
      [
        "Highlight Active Line",
        function (e) {
          env.editor.setHighlightActiveLine(e);
        },
      ],
      [
        "Show Invisibles",
        function (e) {
          env.editor.setShowInvisibles(e);
        },
      ],
      [
        "Show Gutter",
        function (e) {
          env.editor.renderer.setShowGutter(e);
        },
      ],
      [
        "Show Indent Guides",
        function (e) {
          env.editor.renderer.setDisplayIndentGuides(e);
        },
      ],
      [
        "Show Print Margin",
        function (e) {
          env.editor.renderer.setShowPrintMargin(e);
        },
      ],
      [
        "Persistent HScroll",
        function (e) {
          env.editor.renderer.setHScrollBarAlwaysVisible(e);
        },
      ],
      [
        "Animate Scrolling",
        function (e) {
          env.editor.setAnimatedScroll(e);
        },
      ],
      [
        "Use Soft Tab",
        function (e) {
          env.editor.getSession().setUseSoftTabs(e);
        },
      ],
      [
        "Highlight Selected Word",
        function (e) {
          env.editor.setHighlightSelectedWord(e);
        },
      ],
      [
        "Enable Behaviours",
        function (e) {
          env.editor.setBehavioursEnabled(e);
        },
      ],
      [
        "Fade Fold Widgets",
        function (e) {
          env.editor.setFadeFoldWidgets(e);
        },
      ],
      [
        "Show Token info",
        function (e) {
          env.editor.setFadeFoldWidgets(e);
        },
      ],
    ],
    o = function (e) {
      var t = [],
        n = document.createElement("div");
      n.style.cssText = "position: absolute; overflow: hidden";
      var r = document.createElement("div");
      return (
        (r.style.cssText = "width: 120%;height:100%;overflow: scroll"),
        n.appendChild(r),
        t.push("<table><tbody>"),
        e.forEach(function (e) {}),
        t.push(
          "<tr>",
          "<td>",
          '<label for="',
          s,
          '"></label>',
          "</td><td>",
          '<input type="',
          s,
          '" name="',
          s,
          '" id="',
          s,
          '">',
          "</td>",
          "</tr>"
        ),
        t.push("</tbody></table>"),
        n
      );
    };
  o(i);
});
