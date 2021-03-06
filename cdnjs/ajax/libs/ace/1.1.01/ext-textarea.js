ace.define(
  "ace/ext/textarea",
  [
    "require",
    "exports",
    "module",
    "ace/lib/event",
    "ace/lib/useragent",
    "ace/lib/net",
    "ace/ace",
    "ace/theme/textmate",
    "ace/mode/text",
  ],
  function (e, t, n) {
    function a(e, t) {
      for (var n in t) e.style[n] = t[n];
    }
    function f(e, t) {
      if (e.type != "textarea") throw "Textarea required!";
      var n = e.parentNode,
        i = document.createElement("div"),
        s = function () {
          var t = "position:relative;";
          [
            "margin-top",
            "margin-left",
            "margin-right",
            "margin-bottom",
          ].forEach(function (n) {
            t += n + ":" + u(e, i, n) + ";";
          });
          var n = u(e, i, "width") || e.clientWidth + "px",
            r = u(e, i, "height") || e.clientHeight + "px";
          (t += "height:" + r + ";width:" + n + ";"),
            (t += "display:inline-block;"),
            i.setAttribute("style", t);
        };
      r.addListener(window, "resize", s), s(), n.insertBefore(i, e.nextSibling);
      while (n !== document) {
        if (n.tagName.toUpperCase() === "FORM") {
          var o = n.onsubmit;
          n.onsubmit = function (n) {
            (e.value = t()), o && o.call(this, n);
          };
          break;
        }
        n = n.parentNode;
      }
      return i;
    }
    function l(t, n, r) {
      s.loadScript(t, function () {
        e([n], r);
      });
    }
    function c(n, r, i, s, o, u) {
      function c(e) {
        return e === "true" || e == 1;
      }
      var a = n.getSession(),
        f = n.renderer;
      (u = u || l),
        (n.setDisplaySettings = function (e) {
          e == null && (e = i.style.display == "none"),
            e
              ? ((i.style.display = "block"),
                i.hideButton.focus(),
                n.on("focus", function t() {
                  n.removeListener("focus", t), (i.style.display = "none");
                }))
              : n.focus();
        }),
        (n.setOption = function (t, i) {
          if (o[t] == i) return;
          switch (t) {
            case "gutter":
              f.setShowGutter(c(i));
              break;
            case "mode":
              i != "text"
                ? u("mode-" + i + ".js", "ace/mode/" + i, function () {
                    var t = e("../mode/" + i).Mode;
                    a.setMode(new t());
                  })
                : a.setMode(new (e("../mode/text").Mode)());
              break;
            case "theme":
              i != "textmate"
                ? u("theme-" + i + ".js", "ace/theme/" + i, function () {
                    n.setTheme("ace/theme/" + i);
                  })
                : n.setTheme("ace/theme/textmate");
              break;
            case "fontSize":
              r.style.fontSize = i;
              break;
            case "keybindings":
              switch (i) {
                case "vim":
                  n.setKeyboardHandler("ace/keyboard/vim");
                  break;
                case "emacs":
                  n.setKeyboardHandler("ace/keyboard/emacs");
                  break;
                default:
                  n.setKeyboardHandler(null);
              }
              break;
            case "softWrap":
              switch (i) {
                case "off":
                  a.setUseWrapMode(!1), f.setPrintMarginColumn(80);
                  break;
                case "40":
                  a.setUseWrapMode(!0),
                    a.setWrapLimitRange(40, 40),
                    f.setPrintMarginColumn(40);
                  break;
                case "80":
                  a.setUseWrapMode(!0),
                    a.setWrapLimitRange(80, 80),
                    f.setPrintMarginColumn(80);
                  break;
                case "free":
                  a.setUseWrapMode(!0),
                    a.setWrapLimitRange(null, null),
                    f.setPrintMarginColumn(80);
              }
              break;
            case "useSoftTabs":
              a.setUseSoftTabs(c(i));
              break;
            case "showPrintMargin":
              f.setShowPrintMargin(c(i));
              break;
            case "showInvisibles":
              n.setShowInvisibles(c(i));
          }
          o[t] = i;
        }),
        (n.getOption = function (e) {
          return o[e];
        }),
        (n.getOptions = function () {
          return o;
        });
      for (var h in t.options) n.setOption(h, t.options[h]);
      return n;
    }
    function h(e, t, n, i) {
      function f(e, t, n, r) {
        if (!n) {
          e.push(
            "<input type='checkbox' title='",
            t,
            "' ",
            r == "true" ? "checked='true'" : "",
            "'></input>"
          );
          return;
        }
        e.push("<select title='" + t + "'>");
        for (var i in n)
          e.push("<option value='" + i + "' "),
            r == i && e.push(" selected "),
            e.push(">", n[i], "</option>");
        e.push("</select>");
      }
      var s = null,
        o = {
          mode: "Mode:",
          gutter: "Display Gutter:",
          theme: "Theme:",
          fontSize: "Font Size:",
          softWrap: "Soft Wrap:",
          keybindings: "Keyboard",
          showPrintMargin: "Show Print Margin:",
          useSoftTabs: "Use Soft Tabs:",
          showInvisibles: "Show Invisibles",
        },
        u = {
          mode: {
            text: "Plain",
            javascript: "JavaScript",
            xml: "XML",
            html: "HTML",
            css: "CSS",
            scss: "SCSS",
            python: "Python",
            php: "PHP",
            java: "Java",
            ruby: "Ruby",
            c_cpp: "C/C++",
            coffee: "CoffeeScript",
            json: "json",
            perl: "Perl",
            clojure: "Clojure",
            ocaml: "OCaml",
            csharp: "C#",
            haxe: "haXe",
            svg: "SVG",
            textile: "Textile",
            groovy: "Groovy",
            liquid: "Liquid",
            Scala: "Scala",
          },
          theme: {
            clouds: "Clouds",
            clouds_midnight: "Clouds Midnight",
            cobalt: "Cobalt",
            crimson_editor: "Crimson Editor",
            dawn: "Dawn",
            eclipse: "Eclipse",
            idle_fingers: "Idle Fingers",
            kr_theme: "Kr Theme",
            merbivore: "Merbivore",
            merbivore_soft: "Merbivore Soft",
            mono_industrial: "Mono Industrial",
            monokai: "Monokai",
            pastel_on_dark: "Pastel On Dark",
            solarized_dark: "Solarized Dark",
            solarized_light: "Solarized Light",
            textmate: "Textmate",
            twilight: "Twilight",
            vibrant_ink: "Vibrant Ink",
          },
          gutter: s,
          fontSize: {
            "10px": "10px",
            "11px": "11px",
            "12px": "12px",
            "14px": "14px",
            "16px": "16px",
          },
          softWrap: { off: "Off", 40: "40", 80: "80", free: "Free" },
          keybindings: { ace: "ace", vim: "vim", emacs: "emacs" },
          showPrintMargin: s,
          useSoftTabs: s,
          showInvisibles: s,
        },
        a = [];
      a.push("<table><tr><th>Setting</th><th>Value</th></tr>");
      for (var l in i)
        a.push("<tr><td>", o[l], "</td>"),
          a.push("<td>"),
          f(a, l, u[l], i[l]),
          a.push("</td></tr>");
      a.push("</table>"), (e.innerHTML = a.join(""));
      var c = function (e) {
          var t = e.currentTarget;
          n.setOption(t.title, t.value);
        },
        h = function (e) {
          var t = e.currentTarget;
          n.setOption(t.title, t.checked);
        },
        p = e.getElementsByTagName("select");
      for (var d = 0; d < p.length; d++) p[d].onchange = c;
      var v = e.getElementsByTagName("input");
      for (var d = 0; d < v.length; d++) v[d].onclick = h;
      var m = document.createElement("input");
      (m.type = "button"),
        (m.value = "Hide"),
        r.addListener(m, "click", function () {
          n.setDisplaySettings(!1);
        }),
        e.appendChild(m),
        (e.hideButton = m);
    }
    var r = e("../lib/event"),
      i = e("../lib/useragent"),
      s = e("../lib/net"),
      o = e("../ace");
    e("../theme/textmate"), (n.exports = t = o);
    var u = function (e, t, n) {
      var r = e.style[n];
      r ||
        (window.getComputedStyle
          ? (r = window.getComputedStyle(e, "").getPropertyValue(n))
          : (r = e.currentStyle[n]));
      if (!r || r == "auto" || r == "intrinsic") r = t.style[n];
      return r;
    };
    (t.transformTextarea = function (e, t) {
      var n,
        s = f(e, function () {
          return n.getValue();
        });
      (e.style.display = "none"), (s.style.background = "white");
      var u = document.createElement("div");
      a(u, {
        top: "0px",
        left: "0px",
        right: "0px",
        bottom: "0px",
        border: "1px solid gray",
        position: "absolute",
      }),
        s.appendChild(u);
      var l = document.createElement("div");
      a(l, {
        position: "absolute",
        right: "0px",
        bottom: "0px",
        background: "red",
        cursor: "nw-resize",
        borderStyle: "solid",
        borderWidth: "9px 8px 10px 9px",
        width: "2px",
        borderColor: "lightblue gray gray lightblue",
        zIndex: 101,
      });
      var p = document.createElement("div"),
        d = {
          top: "0px",
          left: "20%",
          right: "0px",
          bottom: "0px",
          position: "absolute",
          padding: "5px",
          zIndex: 100,
          color: "white",
          display: "none",
          overflow: "auto",
          fontSize: "14px",
          boxShadow: "-5px 2px 3px gray",
        };
      i.isOldIE
        ? (d.backgroundColor = "#333")
        : (d.backgroundColor = "rgba(0, 0, 0, 0.6)"),
        a(p, d),
        s.appendChild(p);
      var v = {},
        m = o.edit(u);
      (n = m.getSession()),
        n.setValue(e.value || e.innerHTML),
        m.focus(),
        s.appendChild(l),
        c(m, u, p, o, v, t),
        h(p, l, m, v);
      var g = "";
      return (
        r.addListener(l, "mousemove", function (e) {
          var t = this.getBoundingClientRect(),
            n = e.clientX - t.left,
            r = e.clientY - t.top;
          n + r < (t.width + t.height) / 2
            ? ((this.style.cursor = "pointer"), (g = "toggle"))
            : ((g = "resize"), (this.style.cursor = "nw-resize"));
        }),
        r.addListener(l, "mousedown", function (e) {
          if (g == "toggle") {
            m.setDisplaySettings();
            return;
          }
          s.style.zIndex = 1e5;
          var t = s.getBoundingClientRect(),
            n = t.width + t.left - e.clientX,
            i = t.height + t.top - e.clientY;
          r.capture(
            l,
            function (e) {
              (s.style.width = e.clientX - t.left + n + "px"),
                (s.style.height = e.clientY - t.top + i + "px"),
                m.resize();
            },
            function () {}
          );
        }),
        m
      );
    }),
      (t.options = {
        mode: "text",
        theme: "textmate",
        gutter: "false",
        fontSize: "12px",
        softWrap: "off",
        keybindings: "ace",
        showPrintMargin: "false",
        useSoftTabs: "true",
        showInvisibles: "false",
      });
  }
);
