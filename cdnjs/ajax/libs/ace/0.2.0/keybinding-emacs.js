define(
  "ace/keyboard/keybinding/emacs",
  ["require", "exports", "module", "ace/keyboard/state_handler"],
  function (a, b, c) {
    var d = a("ace/keyboard/state_handler").StateHandler,
      e = a("ace/keyboard/state_handler").matchCharacterOnly,
      f = {
        start: [
          { key: "ctrl-x", then: "c-x" },
          {
            regex: ["(?:command-([0-9]*))*", "(down|ctrl-n)"],
            exec: "golinedown",
            params: [
              { name: "times", match: 1, type: "number", defaultValue: 1 },
            ],
          },
          {
            regex: ["(?:command-([0-9]*))*", "(right|ctrl-f)"],
            exec: "gotoright",
            params: [
              { name: "times", match: 1, type: "number", defaultValue: 1 },
            ],
          },
          {
            regex: ["(?:command-([0-9]*))*", "(up|ctrl-p)"],
            exec: "golineup",
            params: [
              { name: "times", match: 1, type: "number", defaultValue: 1 },
            ],
          },
          {
            regex: ["(?:command-([0-9]*))*", "(left|ctrl-b)"],
            exec: "gotoleft",
            params: [
              { name: "times", match: 1, type: "number", defaultValue: 1 },
            ],
          },
          {
            comment:
              "This binding matches all printable characters except numbers as long as they are no numbers and print them n times.",
            regex: ["(?:command-([0-9]*))", "([^0-9]+)*"],
            match: e,
            exec: "inserttext",
            params: [
              { name: "times", match: 1, type: "number", defaultValue: "1" },
              { name: "text", match: 2 },
            ],
          },
          {
            comment:
              "This binding matches numbers as long as there is no meta_number in the buffer.",
            regex: ["(command-[0-9]*)*", "([0-9]+)"],
            match: e,
            disallowMatches: [1],
            exec: "inserttext",
            params: [{ name: "text", match: 2, type: "text" }],
          },
          {
            regex: ["command-([0-9]*)", "(command-[0-9]|[0-9])"],
            comment:
              "Stops execution if the regex /meta_[0-9]+/ matches to avoid resetting the buffer.",
          },
        ],
        "c-x": [
          { key: "ctrl-g", then: "start" },
          { key: "ctrl-s", exec: "save", then: "start" },
        ],
      };
    b.Emacs = new d(f);
  }
),
  define(
    "ace/keyboard/state_handler",
    ["require", "exports", "module"],
    function (a, b, c) {
      function e(a) {
        this.keymapping = this.$buildKeymappingRegex(a);
      }
      var d = !1;
      (e.prototype = {
        $buildKeymappingRegex: function (a) {
          for (state in a) this.$buildBindingsRegex(a[state]);
          return a;
        },
        $buildBindingsRegex: function (a) {
          a.forEach(function (a) {
            a.key
              ? (a.key = new RegExp("^" + a.key + "$"))
              : Array.isArray(a.regex)
              ? ((a.key = new RegExp("^" + a.regex[1] + "$")),
                (a.regex = new RegExp(a.regex.join("") + "$")))
              : a.regex && (a.regex = new RegExp(a.regex + "$"));
          });
        },
        $composeBuffer: function (a, b, c) {
          if (a.state == null || a.buffer == null)
            (a.state = "start"), (a.buffer = "");
          var d = [];
          b & 1 && d.push("ctrl"),
            b & 8 && d.push("command"),
            b & 2 && d.push("option"),
            b & 4 && d.push("shift"),
            c && d.push(c);
          var e = d.join("-"),
            f = a.buffer + e;
          b != 2 && (a.buffer = f);
          return { bufferToUse: f, symbolicName: e };
        },
        $find: function (a, b, c, e, f) {
          var g = {};
          this.keymapping[a.state].some(function (h) {
            var i;
            if (h.key && !h.key.test(c)) return !1;
            if (h.regex && !(i = h.regex.exec(b))) return !1;
            if (h.match && !h.match(b, e, f, c)) return !1;
            if (h.disallowMatches)
              for (var j = 0; j < h.disallowMatches.length; j++)
                if (!!i[h.disallowMatches[j]]) return !1;
            if (h.exec) {
              g.command = h.exec;
              if (h.params) {
                var k;
                (g.args = {}),
                  h.params.forEach(function (a) {
                    a.match != null && i != null
                      ? (k = i[a.match] || a.defaultValue)
                      : (k = a.defaultValue),
                      a.type === "number" && (k = parseInt(k)),
                      (g.args[a.name] = k);
                  });
              }
              a.buffer = "";
            }
            h.then && ((a.state = h.then), (a.buffer = "")),
              g.command == null && (g.command = "null"),
              d && console.log("KeyboardStateMapper#find", h);
            return !0;
          });
          if (g.command) return g;
          a.buffer = "";
          return !1;
        },
        handleKeyboard: function (a, b, c) {
          if (b == 0 || (c != "" && c != String.fromCharCode(0))) {
            var e = this.$composeBuffer(a, b, c),
              f = e.bufferToUse,
              g = e.symbolicName;
            (e = this.$find(a, f, g, b, c)),
              d && console.log("KeyboardStateMapper#match", f, g, e);
            return e;
          }
          return null;
        },
      }),
        (b.matchCharacterOnly = function (a, b, c, d) {
          return b == 0 ? !0 : b == 4 && c.length == 1 ? !0 : !1;
        }),
        (b.StateHandler = e);
    }
  );
