define(
  "ace/ext/themelist",
  ["require", "exports", "module", "ace/ext/themelist_utils/themes"],
  function (e, t, n) {
    (n.exports.themes = e("ace/ext/themelist_utils/themes").themes),
      (n.exports.ThemeDescription = function (e) {
        (this.name = e),
          (this.desc = e
            .split("_")
            .map(function (e) {
              return e[0].toUpperCase() + e.slice(1);
            })
            .join(" ")),
          (this.theme = "ace/theme/" + e);
      }),
      (n.exports.themesByName = {}),
      (n.exports.themes = n.exports.themes.map(function (e) {
        return (
          (n.exports.themesByName[e] = new n.exports.ThemeDescription(e)),
          n.exports.themesByName[e]
        );
      }));
  }
),
  define(
    "ace/ext/themelist_utils/themes",
    ["require", "exports", "module"],
    function (e, t, n) {
      n.exports.themes = [
        "ambiance",
        "chaos",
        "chrome",
        "clouds",
        "clouds_midnight",
        "cobalt",
        "crimson_editor",
        "dawn",
        "dreamweaver",
        "eclipse",
        "github",
        "idle_fingers",
        "kr_theme",
        "merbivore",
        "merbivore_soft",
        "monokai",
        "mono_industrial",
        "pastel_on_dark",
        "solarized_dark",
        "solarized_light",
        "terminal",
        "textmate",
        "tomorrow",
        "tomorrow_night",
        "tomorrow_night_blue",
        "tomorrow_night_bright",
        "tomorrow_night_eighties",
        "twilight",
        "vibrant_ink",
        "xcode",
      ];
    }
  );
