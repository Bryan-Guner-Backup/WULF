function initSender() {
  var a = require("pilot/event_emitter").EventEmitter,
    b = require("pilot/oop"),
    c = function () {};
  (function () {
    b.implement(this, a),
      (this.callback = function (a, b) {
        postMessage({ type: "call", id: b, data: a });
      }),
      (this.emit = function (a, b) {
        postMessage({ type: "event", name: a, data: b });
      });
  }.call(c.prototype));
  return new c();
}
function initBaseUrls(a) {
  require.tlns = a;
}
var console = {
    log: function (a) {
      postMessage({ type: "log", data: a });
    },
  },
  window = { console: console },
  require = function (a) {
    var b = require.modules[a];
    if (b) {
      b.initialized ||
        ((b.exports = b.factory().exports), (b.initialized = !0));
      return b.exports;
    }
    var c = a.split("/");
    (c[0] = require.tlns[c[0]] || c[0]),
      (path = c.join("/") + ".js"),
      (require.id = a),
      importScripts(path);
    return require(a);
  };
(require.modules = {}), (require.tlns = {});
var define = function (a, b, c) {
    arguments.length == 2
      ? (c = b)
      : arguments.length == 1 && ((c = a), (a = require.id));
    a.indexOf("text/") !== 0 &&
      (require.modules[a] = {
        factory: function () {
          var a = { exports: {} },
            b = c(require, a.exports, a);
          b && (a.exports = b);
          return a;
        },
      });
  },
  main,
  sender;
(onmessage = function (a) {
  var b = a.data;
  if (b.command) main[b.command].apply(main, b.args);
  else if (b.init) {
    initBaseUrls(b.tlns),
      require("pilot/fixoldbrowsers"),
      (sender = initSender());
    var c = require(b.module)[b.classname];
    main = new c(sender);
  } else b.event && sender && sender._dispatchEvent(b.event, b.data);
}),
  define(
    "pilot/fixoldbrowsers",
    ["require", "exports", "module"],
    function (a, b, c) {
      if (!Function.prototype.bind) {
        var d = Array.prototype.slice;
        Function.prototype.bind = function (a) {
          var b = this;
          if (typeof b.apply != "function" || typeof b.call != "function")
            return new TypeError();
          var c = d.call(arguments),
            e = function f() {
              if (this instanceof f) {
                var a = Object.create(b.prototype);
                b.apply(a, c.concat(d.call(arguments)));
                return a;
              }
              return b.call.apply(b, c.concat(d.call(arguments)));
            };
          e.length =
            typeof b == "function" ? Math.max(b.length - c.length, 0) : 0;
          return e;
        };
      }
      var e = Function.prototype.call,
        f = Array.prototype,
        g = Object.prototype,
        h = e.bind(g.hasOwnProperty),
        i,
        j,
        k,
        l,
        m;
      if ((m = h(g, "__defineGetter__")))
        (i = e.bind(g.__defineGetter__)),
          (j = e.bind(g.__defineSetter__)),
          (k = e.bind(g.__lookupGetter__)),
          (l = e.bind(g.__lookupSetter__));
      Array.isArray ||
        (Array.isArray = function (a) {
          return Object.prototype.toString.call(a) === "[object Array]";
        }),
        Array.prototype.forEach ||
          (Array.prototype.forEach = function (a, b) {
            var c = +this.length;
            for (var d = 0; d < c; d++)
              d in this && a.call(b, this[d], d, this);
          }),
        Array.prototype.map ||
          (Array.prototype.map = function (a) {
            var b = +this.length;
            if (typeof a != "function") throw new TypeError();
            var c = Array(b),
              d = arguments[1];
            for (var e = 0; e < b; e++)
              e in this && (c[e] = a.call(d, this[e], e, this));
            return c;
          }),
        Array.prototype.filter ||
          (Array.prototype.filter = function (a) {
            var b = [],
              c = arguments[1];
            for (var d = 0; d < this.length; d++)
              a.call(c, this[d]) && b.push(this[d]);
            return b;
          }),
        Array.prototype.every ||
          (Array.prototype.every = function (a) {
            var b = arguments[1];
            for (var c = 0; c < this.length; c++)
              if (!a.call(b, this[c])) return !1;
            return !0;
          }),
        Array.prototype.some ||
          (Array.prototype.some = function (a) {
            var b = arguments[1];
            for (var c = 0; c < this.length; c++)
              if (a.call(b, this[c])) return !0;
            return !1;
          }),
        Array.prototype.reduce ||
          (Array.prototype.reduce = function (a) {
            var b = +this.length;
            if (typeof a != "function") throw new TypeError();
            if (b === 0 && arguments.length === 1) throw new TypeError();
            var c = 0;
            if (arguments.length >= 2) var d = arguments[1];
            else
              do {
                if (c in this) {
                  d = this[c++];
                  break;
                }
                if (++c >= b) throw new TypeError();
              } while (!0);
            for (; c < b; c++)
              c in this && (d = a.call(null, d, this[c], c, this));
            return d;
          }),
        Array.prototype.reduceRight ||
          (Array.prototype.reduceRight = function (a) {
            var b = +this.length;
            if (typeof a != "function") throw new TypeError();
            if (b === 0 && arguments.length === 1) throw new TypeError();
            var c = b - 1;
            if (arguments.length >= 2) var d = arguments[1];
            else
              do {
                if (c in this) {
                  d = this[c--];
                  break;
                }
                if (--c < 0) throw new TypeError();
              } while (!0);
            for (; c >= 0; c--)
              c in this && (d = a.call(null, d, this[c], c, this));
            return d;
          }),
        Array.prototype.indexOf ||
          (Array.prototype.indexOf = function (a) {
            var b = this.length;
            if (!b) return -1;
            var c = arguments[1] || 0;
            if (c >= b) return -1;
            c < 0 && (c += b);
            for (; c < b; c++) {
              if (!h(this, c)) continue;
              if (a === this[c]) return c;
            }
            return -1;
          }),
        Array.prototype.lastIndexOf ||
          (Array.prototype.lastIndexOf = function (a) {
            var b = this.length;
            if (!b) return -1;
            var c = arguments[1] || b;
            c < 0 && (c += b), (c = Math.min(c, b - 1));
            for (; c >= 0; c--) {
              if (!h(this, c)) continue;
              if (a === this[c]) return c;
            }
            return -1;
          }),
        Object.getPrototypeOf ||
          (Object.getPrototypeOf = function (a) {
            return a.__proto__ || a.constructor.prototype;
          });
      if (!Object.getOwnPropertyDescriptor) {
        var n = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (a, b) {
          if ((typeof a != "object" && typeof a != "function") || a === null)
            throw new TypeError(n + a);
          if (!h(a, b)) return undefined;
          var c, d, e;
          c = { enumerable: !0, configurable: !0 };
          if (m) {
            var f = a.__proto__;
            a.__proto__ = g;
            var d = k(a, b),
              e = l(a, b);
            a.__proto__ = f;
            if (d || e) {
              d && (descriptor.get = d), e && (descriptor.set = e);
              return descriptor;
            }
          }
          descriptor.value = a[b];
          return descriptor;
        };
      }
      Object.getOwnPropertyNames ||
        (Object.getOwnPropertyNames = function (a) {
          return Object.keys(a);
        }),
        Object.create ||
          (Object.create = function (a, b) {
            var c;
            if (a === null) c = { __proto__: null };
            else {
              if (typeof a != "object")
                throw new TypeError(
                  "typeof prototype[" + typeof a + "] != 'object'"
                );
              var d = function () {};
              (d.prototype = a), (c = new d()), (c.__proto__ = a);
            }
            typeof b != "undefined" && Object.defineProperties(c, b);
            return c;
          });
      if (!Object.defineProperty) {
        var o = "Property description must be an object: ",
          p = "Object.defineProperty called on non-object: ",
          q = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (a, b, c) {
          if (typeof a != "object" && typeof a != "function")
            throw new TypeError(p + a);
          if (typeof a != "object" || a === null) throw new TypeError(o + c);
          if (h(c, "value"))
            if (m && (k(a, b) || l(a, b))) {
              var d = a.__proto__;
              (a.__proto__ = g), delete a[b], (a[b] = c.value), a.prototype;
            } else a[b] = c.value;
          else {
            if (!m) throw new TypeError(q);
            h(c, "get") && i(a, b, c.get), h(c, "set") && j(a, b, c.set);
          }
          return a;
        };
      }
      Object.defineProperties ||
        (Object.defineProperties = function (a, b) {
          for (var c in b) h(b, c) && Object.defineProperty(a, c, b[c]);
          return a;
        }),
        Object.seal ||
          (Object.seal = function (a) {
            return a;
          }),
        Object.freeze ||
          (Object.freeze = function (a) {
            return a;
          });
      try {
        Object.freeze(function () {});
      } catch (r) {
        Object.freeze = (function (a) {
          return function b(b) {
            return typeof b == "function" ? b : a(b);
          };
        })(Object.freeze);
      }
      Object.preventExtensions ||
        (Object.preventExtensions = function (a) {
          return a;
        }),
        Object.isSealed ||
          (Object.isSealed = function (a) {
            return !1;
          }),
        Object.isFrozen ||
          (Object.isFrozen = function (a) {
            return !1;
          }),
        Object.isExtensible ||
          (Object.isExtensible = function (a) {
            return !0;
          });
      if (!Object.keys) {
        var s = !0,
          t = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor",
          ],
          u = t.length;
        for (var v in { toString: null }) s = !1;
        Object.keys = function W(a) {
          if ((typeof a != "object" && typeof a != "function") || a === null)
            throw new TypeError("Object.keys called on a non-object");
          var W = [];
          for (var b in a) h(a, b) && W.push(b);
          if (s)
            for (var c = 0, d = u; c < d; c++) {
              var e = t[c];
              h(a, e) && W.push(e);
            }
          return W;
        };
      }
      Date.prototype.toISOString ||
        (Date.prototype.toISOString = function () {
          return (
            this.getUTCFullYear() +
            "-" +
            (this.getUTCMonth() + 1) +
            "-" +
            this.getUTCDate() +
            "T" +
            this.getUTCHours() +
            ":" +
            this.getUTCMinutes() +
            ":" +
            this.getUTCSeconds() +
            "Z"
          );
        }),
        Date.now ||
          (Date.now = function () {
            return new Date().getTime();
          }),
        Date.prototype.toJSON ||
          (Date.prototype.toJSON = function (a) {
            if (typeof this.toISOString != "function") throw new TypeError();
            return this.toISOString();
          }),
        isNaN(Date.parse("T00:00")) &&
          (Date = (function (a) {
            var b = function (c, d, e, f, g, h, i) {
                var j = arguments.length;
                if (this instanceof a) {
                  var k =
                    j === 1 && String(c) === c
                      ? new a(b.parse(c))
                      : j >= 7
                      ? new a(c, d, e, f, g, h, i)
                      : j >= 6
                      ? new a(c, d, e, f, g, h)
                      : j >= 5
                      ? new a(c, d, e, f, g)
                      : j >= 4
                      ? new a(c, d, e, f)
                      : j >= 3
                      ? new a(c, d, e)
                      : j >= 2
                      ? new a(c, d)
                      : j >= 1
                      ? new a(c)
                      : new a();
                  k.constructor = b;
                  return k;
                }
                return a.apply(this, arguments);
              },
              c = new RegExp(
                "^(?:((?:[+-]\\d\\d)?\\d\\d\\d\\d)(?:-(\\d\\d)(?:-(\\d\\d))?)?)?(?:T(\\d\\d):(\\d\\d)(?::(\\d\\d)(?:\\.(\\d\\d\\d))?)?)?(?:Z|([+-])(\\d\\d):(\\d\\d))?$"
              );
            for (var d in a) b[d] = a[d];
            (b.now = a.now),
              (b.UTC = a.UTC),
              (b.prototype = a.prototype),
              (b.prototype.constructor = b),
              (b.parse = function e(b) {
                var d = c.exec(b);
                if (d) {
                  d.shift();
                  var e = d[0] === undefined;
                  for (var f = 0; f < 10; f++) {
                    if (f === 7) continue;
                    (d[f] = +(d[f] || (f < 3 ? 1 : 0))), f === 1 && d[f]--;
                  }
                  if (e) return ((d[3] * 60 + d[4]) * 60 + d[5]) * 1e3 + d[6];
                  var g = (d[8] * 60 + d[9]) * 60 * 1e3;
                  d[6] === "-" && (g = -g);
                  return a.UTC.apply(this, d.slice(0, 7)) + g;
                }
                return a.parse.apply(this, arguments);
              });
            return b;
          })(Date));
      if (!String.prototype.trim) {
        var w = /^\s\s*/,
          x = /\s\s*$/;
        String.prototype.trim = function () {
          return String(this).replace(w, "").replace(x, "");
        };
      }
    }
  ),
  define(
    "pilot/event_emitter",
    ["require", "exports", "module"],
    function (a, b, c) {
      var d = {};
      (d._emit = d._dispatchEvent =
        function (a, b) {
          this._eventRegistry = this._eventRegistry || {};
          var c = this._eventRegistry[a];
          if (!!c && !!c.length) {
            var b = b || {};
            b.type = a;
            for (var d = 0; d < c.length; d++) c[d](b);
          }
        }),
        (d.on = d.addEventListener =
          function (a, b) {
            this._eventRegistry = this._eventRegistry || {};
            var c = this._eventRegistry[a];
            if (!c) var c = (this._eventRegistry[a] = []);
            c.indexOf(b) == -1 && c.push(b);
          }),
        (d.removeListener = d.removeEventListener =
          function (a, b) {
            this._eventRegistry = this._eventRegistry || {};
            var c = this._eventRegistry[a];
            if (!!c) {
              var d = c.indexOf(b);
              d !== -1 && c.splice(d, 1);
            }
          }),
        (d.removeAllListeners = function (a) {
          this._eventRegistry && (this._eventRegistry[a] = []);
        }),
        (b.EventEmitter = d);
    }
  ),
  define("pilot/oop", ["require", "exports", "module"], function (a, b, c) {
    (b.inherits = (function () {
      var a = function () {};
      return function (b, c) {
        (a.prototype = c.prototype),
          (b.super_ = c.prototype),
          (b.prototype = new a()),
          (b.prototype.constructor = b);
      };
    })()),
      (b.mixin = function (a, b) {
        for (var c in b) a[c] = b[c];
      }),
      (b.implement = function (a, c) {
        b.mixin(a, c);
      });
  }),
  define(
    "ace/mode/css_worker",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "ace/worker/mirror",
      "ace/mode/css/csslint",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("ace/worker/mirror").Mirror,
        f = a("ace/mode/css/csslint").CSSLint,
        g = (b.Worker = function (a) {
          e.call(this, a), this.setTimeout(200);
        });
      d.inherits(g, e),
        function () {
          this.onUpdate = function () {
            var a = this.doc.getValue();
            (result = f.verify(a)),
              this.sender.emit(
                "csslint",
                result.messages.map(function (a) {
                  delete a.rule;
                  return a;
                })
              );
          };
        }.call(g.prototype);
    }
  ),
  define(
    "ace/worker/mirror",
    ["require", "exports", "module", "ace/document", "pilot/lang"],
    function (a, b, c) {
      var d = a("ace/document").Document,
        e = a("pilot/lang"),
        f = (b.Mirror = function (a) {
          this.sender = a;
          var b = (this.doc = new d("")),
            c = (this.deferredUpdate = e.deferredCall(
              this.onUpdate.bind(this)
            )),
            f = this;
          a.on("change", function (a) {
            b.applyDeltas([a.data]), c.schedule(f.$timeout);
          });
        });
      (function () {
        (this.$timeout = 500),
          (this.setTimeout = function (a) {
            this.$timeout = a;
          }),
          (this.setValue = function (a) {
            this.doc.setValue(a), this.deferredUpdate.schedule(this.$timeout);
          }),
          (this.getValue = function (a) {
            this.sender.callback(this.doc.getValue(), a);
          }),
          (this.onUpdate = function () {});
      }.call(f.prototype));
    }
  ),
  define(
    "ace/document",
    [
      "require",
      "exports",
      "module",
      "pilot/oop",
      "pilot/event_emitter",
      "ace/range",
      "ace/anchor",
    ],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("pilot/event_emitter").EventEmitter,
        f = a("ace/range").Range,
        g = a("ace/anchor").Anchor,
        h = function (a) {
          (this.$lines = []),
            Array.isArray(a)
              ? this.insertLines(0, a)
              : a.length == 0
              ? (this.$lines = [""])
              : this.insert({ row: 0, column: 0 }, a);
        };
      (function () {
        d.implement(this, e),
          (this.setValue = function (a) {
            var b = this.getLength();
            this.remove(new f(0, 0, b, this.getLine(b - 1).length)),
              this.insert({ row: 0, column: 0 }, a);
          }),
          (this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
          }),
          (this.createAnchor = function (a, b) {
            return new g(this, a, b);
          }),
          "aaa".split(/a/).length == 0
            ? (this.$split = function (a) {
                return a.replace(/\r\n|\r/g, "\n").split("\n");
              })
            : (this.$split = function (a) {
                return a.split(/\r\n|\r|\n/);
              }),
          (this.$detectNewLine = function (a) {
            var b = a.match(/^.*?(\r?\n)/m);
            b ? (this.$autoNewLine = b[1]) : (this.$autoNewLine = "\n");
          }),
          (this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
              case "windows":
                return "\r\n";
              case "unix":
                return "\n";
              case "auto":
                return this.$autoNewLine;
            }
          }),
          (this.$autoNewLine = "\n"),
          (this.$newLineMode = "auto"),
          (this.setNewLineMode = function (a) {
            this.$newLineMode !== a && (this.$newLineMode = a);
          }),
          (this.getNewLineMode = function () {
            return this.$newLineMode;
          }),
          (this.isNewLine = function (a) {
            return a == "\r\n" || a == "\r" || a == "\n";
          }),
          (this.getLine = function (a) {
            return this.$lines[a] || "";
          }),
          (this.getLines = function (a, b) {
            return this.$lines.slice(a, b + 1);
          }),
          (this.getAllLines = function () {
            return this.getLines(0, this.getLength());
          }),
          (this.getLength = function () {
            return this.$lines.length;
          }),
          (this.getTextRange = function (a) {
            if (a.start.row == a.end.row)
              return this.$lines[a.start.row].substring(
                a.start.column,
                a.end.column
              );
            var b = [];
            b.push(this.$lines[a.start.row].substring(a.start.column)),
              b.push.apply(b, this.getLines(a.start.row + 1, a.end.row - 1)),
              b.push(this.$lines[a.end.row].substring(0, a.end.column));
            return b.join(this.getNewLineCharacter());
          }),
          (this.$clipPosition = function (a) {
            var b = this.getLength();
            a.row >= b &&
              ((a.row = Math.max(0, b - 1)),
              (a.column = this.getLine(b - 1).length));
            return a;
          }),
          (this.insert = function (a, b) {
            if (b.length == 0) return a;
            (a = this.$clipPosition(a)),
              this.getLength() <= 1 && this.$detectNewLine(b);
            var c = this.$split(b),
              d = c.splice(0, 1)[0],
              e = c.length == 0 ? null : c.splice(c.length - 1, 1)[0];
            (a = this.insertInLine(a, d)),
              e !== null &&
                ((a = this.insertNewLine(a)),
                (a = this.insertLines(a.row, c)),
                (a = this.insertInLine(a, e || "")));
            return a;
          }),
          (this.insertLines = function (a, b) {
            if (b.length == 0) return { row: a, column: 0 };
            var c = [a, 0];
            c.push.apply(c, b), this.$lines.splice.apply(this.$lines, c);
            var d = new f(a, 0, a + b.length, 0),
              e = { action: "insertLines", range: d, lines: b };
            this._dispatchEvent("change", { data: e });
            return d.end;
          }),
          (this.insertNewLine = function (a) {
            a = this.$clipPosition(a);
            var b = this.$lines[a.row] || "";
            (this.$lines[a.row] = b.substring(0, a.column)),
              this.$lines.splice(a.row + 1, 0, b.substring(a.column, b.length));
            var c = { row: a.row + 1, column: 0 },
              d = {
                action: "insertText",
                range: f.fromPoints(a, c),
                text: this.getNewLineCharacter(),
              };
            this._dispatchEvent("change", { data: d });
            return c;
          }),
          (this.insertInLine = function (a, b) {
            if (b.length == 0) return a;
            var c = this.$lines[a.row] || "";
            this.$lines[a.row] =
              c.substring(0, a.column) + b + c.substring(a.column);
            var d = { row: a.row, column: a.column + b.length },
              e = { action: "insertText", range: f.fromPoints(a, d), text: b };
            this._dispatchEvent("change", { data: e });
            return d;
          }),
          (this.remove = function (a) {
            (a.start = this.$clipPosition(a.start)),
              (a.end = this.$clipPosition(a.end));
            if (a.isEmpty()) return a.start;
            var b = a.start.row,
              c = a.end.row;
            if (a.isMultiLine()) {
              var d = a.start.column == 0 ? b : b + 1,
                e = c - 1;
              a.end.column > 0 && this.removeInLine(c, 0, a.end.column),
                e >= d && this.removeLines(d, e),
                d != b &&
                  (this.removeInLine(b, a.start.column, this.getLine(b).length),
                  this.removeNewLine(a.start.row));
            } else this.removeInLine(b, a.start.column, a.end.column);
            return a.start;
          }),
          (this.removeInLine = function (a, b, c) {
            if (b != c) {
              var d = new f(a, b, a, c),
                e = this.getLine(a),
                g = e.substring(b, c),
                h = e.substring(0, b) + e.substring(c, e.length);
              this.$lines.splice(a, 1, h);
              var i = { action: "removeText", range: d, text: g };
              this._dispatchEvent("change", { data: i });
              return d.start;
            }
          }),
          (this.removeLines = function (a, b) {
            var c = new f(a, 0, b + 1, 0),
              d = this.$lines.splice(a, b - a + 1),
              e = {
                action: "removeLines",
                range: c,
                nl: this.getNewLineCharacter(),
                lines: d,
              };
            this._dispatchEvent("change", { data: e });
            return d;
          }),
          (this.removeNewLine = function (a) {
            var b = this.getLine(a),
              c = this.getLine(a + 1),
              d = new f(a, b.length, a + 1, 0),
              e = b + c;
            this.$lines.splice(a, 2, e);
            var g = {
              action: "removeText",
              range: d,
              text: this.getNewLineCharacter(),
            };
            this._dispatchEvent("change", { data: g });
          }),
          (this.replace = function (a, b) {
            if (b.length == 0 && a.isEmpty()) return a.start;
            if (b == this.getTextRange(a)) return a.end;
            this.remove(a);
            if (b) var c = this.insert(a.start, b);
            else c = a.start;
            return c;
          }),
          (this.applyDeltas = function (a) {
            for (var b = 0; b < a.length; b++) {
              var c = a[b],
                d = f.fromPoints(c.range.start, c.range.end);
              c.action == "insertLines"
                ? this.insertLines(d.start.row, c.lines)
                : c.action == "insertText"
                ? this.insert(d.start, c.text)
                : c.action == "removeLines"
                ? this.removeLines(d.start.row, d.end.row - 1)
                : c.action == "removeText" && this.remove(d);
            }
          }),
          (this.revertDeltas = function (a) {
            for (var b = a.length - 1; b >= 0; b--) {
              var c = a[b],
                d = f.fromPoints(c.range.start, c.range.end);
              c.action == "insertLines"
                ? this.removeLines(d.start.row, d.end.row - 1)
                : c.action == "insertText"
                ? this.remove(d)
                : c.action == "removeLines"
                ? this.insertLines(d.start.row, c.lines)
                : c.action == "removeText" && this.insert(d.start, c.text);
            }
          });
      }.call(h.prototype),
        (b.Document = h));
    }
  ),
  define("ace/range", ["require", "exports", "module"], function (a, b, c) {
    var d = function (a, b, c, d) {
      (this.start = { row: a, column: b }), (this.end = { row: c, column: d });
    };
    (function () {
      (this.toString = function () {
        return (
          "Range: [" +
          this.start.row +
          "/" +
          this.start.column +
          "] -> [" +
          this.end.row +
          "/" +
          this.end.column +
          "]"
        );
      }),
        (this.contains = function (a, b) {
          return this.compare(a, b) == 0;
        }),
        (this.compareRange = function (a) {
          var b,
            c = a.end,
            d = a.start;
          b = this.compare(c.row, c.column);
          if (b == 1) {
            b = this.compare(d.row, d.column);
            return b == 1 ? 2 : b == 0 ? 1 : 0;
          }
          if (b == -1) return -2;
          b = this.compare(d.row, d.column);
          return b == -1 ? -1 : b == 1 ? 42 : 0;
        }),
        (this.containsRange = function (a) {
          var b = this.compareRange(a);
          return b == -1 || b == 0 || b == 1;
        }),
        (this.isEnd = function (a, b) {
          return this.end.row == a && this.end.column == b;
        }),
        (this.isStart = function (a, b) {
          return this.start.row == a && this.start.column == b;
        }),
        (this.setStart = function (a, b) {
          typeof a == "object"
            ? ((this.start.column = a.column), (this.start.row = a.row))
            : ((this.start.row = a), (this.start.column = b));
        }),
        (this.setEnd = function (a, b) {
          typeof a == "object"
            ? ((this.end.column = a.column), (this.end.row = a.row))
            : ((this.end.row = a), (this.end.column = b));
        }),
        (this.inside = function (a, b) {
          if (this.compare(a, b) == 0)
            return this.isEnd(a, b) || this.isStart(a, b) ? !1 : !0;
          return !1;
        }),
        (this.insideStart = function (a, b) {
          if (this.compare(a, b) == 0) return this.isEnd(a, b) ? !1 : !0;
          return !1;
        }),
        (this.insideEnd = function (a, b) {
          if (this.compare(a, b) == 0) return this.isStart(a, b) ? !1 : !0;
          return !1;
        }),
        (this.compare = function (a, b) {
          if (!this.isMultiLine() && a === this.start.row)
            return b < this.start.column ? -1 : b > this.end.column ? 1 : 0;
          return a < this.start.row
            ? -1
            : a > this.end.row
            ? 1
            : this.start.row === a
            ? b >= this.start.column
              ? 0
              : -1
            : this.end.row === a
            ? b <= this.end.column
              ? 0
              : 1
            : 0;
        }),
        (this.compareStart = function (a, b) {
          return this.start.row == a && this.start.column == b
            ? -1
            : this.compare(a, b);
        }),
        (this.compareEnd = function (a, b) {
          return this.end.row == a && this.end.column == b
            ? 1
            : this.compare(a, b);
        }),
        (this.compareInside = function (a, b) {
          return this.end.row == a && this.end.column == b
            ? 1
            : this.start.row == a && this.start.column == b
            ? -1
            : this.compare(a, b);
        }),
        (this.clipRows = function (a, b) {
          if (this.end.row > b) var c = { row: b + 1, column: 0 };
          if (this.start.row > b) var e = { row: b + 1, column: 0 };
          if (this.start.row < a) var e = { row: a, column: 0 };
          if (this.end.row < a) var c = { row: a, column: 0 };
          return d.fromPoints(e || this.start, c || this.end);
        }),
        (this.extend = function (a, b) {
          var c = this.compare(a, b);
          if (c == 0) return this;
          if (c == -1) var e = { row: a, column: b };
          else var f = { row: a, column: b };
          return d.fromPoints(e || this.start, f || this.end);
        }),
        (this.isEmpty = function () {
          return (
            this.start.row == this.end.row &&
            this.start.column == this.end.column
          );
        }),
        (this.isMultiLine = function () {
          return this.start.row !== this.end.row;
        }),
        (this.clone = function () {
          return d.fromPoints(this.start, this.end);
        }),
        (this.collapseRows = function () {
          return this.end.column == 0
            ? new d(
                this.start.row,
                0,
                Math.max(this.start.row, this.end.row - 1),
                0
              )
            : new d(this.start.row, 0, this.end.row, 0);
        }),
        (this.toScreenRange = function (a) {
          var b = a.documentToScreenPosition(this.start),
            c = a.documentToScreenPosition(this.end);
          return new d(b.row, b.column, c.row, c.column);
        });
    }.call(d.prototype),
      (d.fromPoints = function (a, b) {
        return new d(a.row, a.column, b.row, b.column);
      }),
      (b.Range = d));
  }),
  define(
    "ace/anchor",
    ["require", "exports", "module", "pilot/oop", "pilot/event_emitter"],
    function (a, b, c) {
      var d = a("pilot/oop"),
        e = a("pilot/event_emitter").EventEmitter,
        f = (b.Anchor = function (a, b, c) {
          (this.document = a),
            typeof c == "undefined"
              ? this.setPosition(b.row, b.column)
              : this.setPosition(b, c),
            (this.$onChange = this.onChange.bind(this)),
            a.on("change", this.$onChange);
        });
      (function () {
        d.implement(this, e),
          (this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column);
          }),
          (this.getDocument = function () {
            return this.document;
          }),
          (this.onChange = function (a) {
            var b = a.data,
              c = b.range;
            if (c.start.row != c.end.row || c.start.row == this.row) {
              if (c.start.row > this.row) return;
              if (c.start.row == this.row && c.start.column > this.column)
                return;
              var d = this.row,
                e = this.column;
              b.action === "insertText"
                ? c.start.row === d && c.start.column <= e
                  ? c.start.row === c.end.row
                    ? (e += c.end.column - c.start.column)
                    : ((e -= c.start.column), (d += c.end.row - c.start.row))
                  : c.start.row !== c.end.row &&
                    c.start.row < d &&
                    (d += c.end.row - c.start.row)
                : b.action === "insertLines"
                ? c.start.row <= d && (d += c.end.row - c.start.row)
                : b.action == "removeText"
                ? c.start.row == d && c.start.column < e
                  ? c.end.column >= e
                    ? (e = c.start.column)
                    : (e = Math.max(0, e - (c.end.column - c.start.column)))
                  : c.start.row !== c.end.row && c.start.row < d
                  ? (c.end.row == d &&
                      (e = Math.max(0, e - c.end.column) + c.start.column),
                    (d -= c.end.row - c.start.row))
                  : c.end.row == d &&
                    ((d -= c.end.row - c.start.row),
                    (e = Math.max(0, e - c.end.column) + c.start.column))
                : b.action == "removeLines" &&
                  c.start.row <= d &&
                  (c.end.row <= d
                    ? (d -= c.end.row - c.start.row)
                    : ((d = c.start.row), (e = 0))),
                this.setPosition(d, e, !0);
            }
          }),
          (this.setPosition = function (a, b, c) {
            var d;
            c
              ? (d = { row: a, column: b })
              : (d = this.$clipPositionToDocument(a, b));
            if (this.row != d.row || this.column != d.column) {
              var e = { row: this.row, column: this.column };
              (this.row = d.row),
                (this.column = d.column),
                this._dispatchEvent("change", { old: e, value: d });
            }
          }),
          (this.detach = function () {
            this.document.removeEventListener("change", this.$onChange);
          }),
          (this.$clipPositionToDocument = function (a, b) {
            var c = {};
            a >= this.document.getLength()
              ? ((c.row = Math.max(0, this.document.getLength() - 1)),
                (c.column = this.document.getLine(c.row).length))
              : a < 0
              ? ((c.row = 0), (c.column = 0))
              : ((c.row = a),
                (c.column = Math.min(
                  this.document.getLine(c.row).length,
                  Math.max(0, b)
                ))),
              b < 0 && (c.column = 0);
            return c;
          });
      }.call(f.prototype));
    }
  ),
  define("pilot/lang", ["require", "exports", "module"], function (a, b, c) {
    (b.stringReverse = function (a) {
      return a.split("").reverse().join("");
    }),
      (b.stringRepeat = function (a, b) {
        return Array(b + 1).join(a);
      });
    var d = /^\s\s*/,
      e = /\s\s*$/;
    (b.stringTrimLeft = function (a) {
      return a.replace(d, "");
    }),
      (b.stringTrimRight = function (a) {
        return a.replace(e, "");
      }),
      (b.copyObject = function (a) {
        var b = {};
        for (var c in a) b[c] = a[c];
        return b;
      }),
      (b.copyArray = function (a) {
        var b = [];
        for (i = 0, l = a.length; i < l; i++)
          a[i] && typeof a[i] == "object"
            ? (b[i] = this.copyObject(a[i]))
            : (b[i] = a[i]);
        return b;
      }),
      (b.deepCopy = function (a) {
        if (typeof a != "object") return a;
        var b = a.constructor();
        for (var c in a)
          typeof a[c] == "object"
            ? (b[c] = this.deepCopy(a[c]))
            : (b[c] = a[c]);
        return b;
      }),
      (b.arrayToMap = function (a) {
        var b = {};
        for (var c = 0; c < a.length; c++) b[a[c]] = 1;
        return b;
      }),
      (b.arrayRemove = function (a, b) {
        for (var c = 0; c <= a.length; c++) b === a[c] && a.splice(c, 1);
      }),
      (b.escapeRegExp = function (a) {
        return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      }),
      (b.deferredCall = function (a) {
        var b = null,
          c = function () {
            (b = null), a();
          },
          d = function (a) {
            b || (b = setTimeout(c, a || 0));
            return d;
          };
        (d.schedule = d),
          (d.call = function () {
            this.cancel(), a();
            return d;
          }),
          (d.cancel = function () {
            clearTimeout(b), (b = null);
            return d;
          });
        return d;
      });
  }),
  define(
    "ace/mode/css/csslint",
    ["require", "exports", "module"],
    function (require, exports, module) {
      function indexOf(a, b) {
        if (a.indexOf) return a.indexOf(b);
        for (var c = 0, d = a.length; c < d; c++) if (a[c] === b) return c;
        return -1;
      }
      function mix(a, b) {
        var c;
        for (c in b) b.hasOwnProperty(c) && (receiver[c] = b[c]);
        return c;
      }
      function Reporter(a) {
        (this.messages = []), (this.stats = []), (this.lines = a);
      }
      var parserlib = {};
      (function () {
        function e(a, c) {
          (this._reader = a ? new b(a.toString()) : null),
            (this._token = null),
            (this._tokenData = c),
            (this._lt = []),
            (this._ltIndex = 0),
            (this._ltIndexCache = []);
        }
        function d(a, b, c) {
          (this.col = c), (this.line = b), (this.text = a);
        }
        function c(a, b, c) {
          (this.col = c), (this.line = b), (this.message = a);
        }
        function b(a) {
          (this._input = a.replace(/\n\r?/g, "\n")),
            (this._line = 1),
            (this._col = 1),
            (this._cursor = 0);
        }
        function a() {
          this._listeners = {};
        }
        (a.prototype = {
          constructor: a,
          addListener: function (a, b) {
            this._listeners[a] || (this._listeners[a] = []),
              this._listeners[a].push(b);
          },
          fire: function (a) {
            typeof a == "string" && (a = { type: a }),
              a.target || (a.target = this);
            if (!a.type)
              throw new Error("Event object missing 'type' property.");
            if (this._listeners[a.type]) {
              var b = this._listeners[a.type].concat();
              for (var c = 0, d = b.length; c < d; c++) b[c].call(this, a);
            }
          },
          removeListener: function (a, b) {
            if (this._listeners[a]) {
              var c = this._listeners[a];
              for (var d = 0, e = c.length; d < e; d++)
                if (c[d] === b) {
                  c.splice(d, 1);
                  break;
                }
            }
          },
        }),
          (b.prototype = {
            constructor: b,
            getCol: function () {
              return this._col;
            },
            getLine: function () {
              return this._line;
            },
            eof: function () {
              return this._cursor == this._input.length;
            },
            peek: function (a) {
              var b = null;
              (a = typeof a == "undefined" ? 1 : a),
                this._cursor < this._input.length &&
                  (b = this._input.charAt(this._cursor + a - 1));
              return b;
            },
            read: function () {
              var a = null;
              this._cursor < this._input.length &&
                (this._input.charAt(this._cursor) == "\n"
                  ? (this._line++, (this._col = 1))
                  : this._col++,
                (a = this._input.charAt(this._cursor++)));
              return a;
            },
            mark: function () {
              this._bookmark = {
                cursor: this._cursor,
                line: this._line,
                col: this._col,
              };
            },
            reset: function () {
              this._bookmark &&
                ((this._cursor = this._bookmark.cursor),
                (this._line = this._bookmark.line),
                (this._col = this._bookmark.col),
                delete this._bookmark);
            },
            readTo: function (a) {
              var b = "",
                c;
              while (
                b.length < a.length ||
                b.lastIndexOf(a) != b.length - a.length
              ) {
                c = this.read();
                if (c) b += c;
                else
                  throw new Error(
                    'Expected "' +
                      a +
                      '" at line ' +
                      this._line +
                      ", col " +
                      this._col +
                      "."
                  );
              }
              return b;
            },
            readWhile: function (a) {
              var b = "",
                c = this.read();
              while (c !== null && a(c)) (b += c), (c = this.read());
              return b;
            },
            readMatch: function (a) {
              var b = this._input.substring(this._cursor),
                c = null;
              typeof a == "string"
                ? b.indexOf(a) === 0 && (c = this.readCount(a.length))
                : a instanceof RegExp &&
                  a.test(b) &&
                  (c = this.readCount(RegExp.lastMatch.length));
              return c;
            },
            readCount: function (a) {
              var b = "";
              while (a--) b += this.read();
              return b;
            },
          }),
          (c.prototype = new Error()),
          (d.fromToken = function (a) {
            return new d(a.value, a.startLine, a.startCol);
          }),
          (d.prototype = {
            constructor: d,
            valueOf: function () {
              return this.toString();
            },
            toString: function () {
              return this.text;
            },
          }),
          (e.createTokenData = function (a) {
            var b = [],
              c = {},
              d = a.concat([]),
              e = 0,
              f = d.length + 1;
            (d.UNKNOWN = -1), d.unshift({ name: "EOF" });
            for (; e < f; e++)
              b.push(d[e].name),
                (d[d[e].name] = e),
                d[e].text && (c[d[e].text] = e);
            (d.name = function (a) {
              return b[a];
            }),
              (d.type = function (a) {
                return c[a];
              });
            return d;
          }),
          (e.prototype = {
            constructor: e,
            match: function (a, b) {
              a instanceof Array || (a = [a]);
              var c = this.get(b),
                d = 0,
                e = a.length;
              while (d < e) if (c == a[d++]) return !0;
              this.unget();
              return !1;
            },
            mustMatch: function (a, b) {
              a instanceof Array || (a = [a]);
              if (!this.match.apply(this, arguments)) {
                token = this.LT(1);
                throw new c(
                  "Expected " +
                    this._tokenData[a[0]].name +
                    " at line " +
                    token.startLine +
                    ", col " +
                    token.startCol +
                    ".",
                  token.startLine,
                  token.startCol
                );
              }
            },
            advance: function (a, b) {
              while (this.LA(0) != 0 && !this.match(a, b)) this.get();
              return this.LA(0);
            },
            get: function (a) {
              var b = this._tokenData,
                c = this._reader,
                d,
                e = 0,
                f = b.length,
                g = !1,
                h,
                i;
              if (
                this._lt.length &&
                this._ltIndex >= 0 &&
                this._ltIndex < this._lt.length
              ) {
                e++,
                  (this._token = this._lt[this._ltIndex++]),
                  (i = b[this._token.type]);
                while (
                  i.channel !== undefined &&
                  a !== i.channel &&
                  this._ltIndex < this._lt.length
                )
                  (this._token = this._lt[this._ltIndex++]),
                    (i = b[this._token.type]),
                    e++;
                if (
                  (i.channel === undefined || a === i.channel) &&
                  this._ltIndex <= this._lt.length
                ) {
                  this._ltIndexCache.push(e);
                  return this._token.type;
                }
              }
              (h = this._getToken()),
                h.type > -1 &&
                  !b[h.type].hide &&
                  ((h.channel = b[h.type].channel),
                  (this._token = h),
                  this._lt.push(h),
                  this._ltIndexCache.push(this._lt.length - this._ltIndex + e),
                  this._lt.length > 5 && this._lt.shift(),
                  this._ltIndexCache.length > 5 && this._ltIndexCache.shift(),
                  (this._ltIndex = this._lt.length)),
                (i = b[h.type]);
              return i &&
                (i.hide || (i.channel !== undefined && a !== i.channel))
                ? this.get(a)
                : h.type;
            },
            LA: function (a) {
              var b = a,
                c;
              if (a > 0) {
                if (a > 5) throw new Error("Too much lookahead.");
                while (b) (c = this.get()), b--;
                while (b < a) this.unget(), b++;
              } else if (a < 0)
                if (this._lt[this._ltIndex + a])
                  c = this._lt[this._ltIndex + a].type;
                else throw new Error("Too much lookbehind.");
              else c = this._token.type;
              return c;
            },
            LT: function (a) {
              this.LA(a);
              return this._lt[this._ltIndex + a - 1];
            },
            peek: function () {
              return this.LA(1);
            },
            token: function () {
              return this._token;
            },
            tokenName: function (a) {
              return a < 0 || a > this._tokenData.length
                ? "UNKNOWN_TOKEN"
                : this._tokenData[a].name;
            },
            tokenType: function (a) {
              return this._tokenData[a] || -1;
            },
            unget: function () {
              if (this._ltIndexCache.length)
                (this._ltIndex -= this._ltIndexCache.pop()),
                  (this._token = this._lt[this._ltIndex - 1]);
              else throw new Error("Too much lookahead.");
            },
          }),
          (parserlib.util = {
            StringReader: b,
            SyntaxError: c,
            SyntaxUnit: d,
            EventTarget: a,
            TokenStreamBase: e,
          });
      })(),
        (function () {
          function TokenStream(a) {
            TokenStreamBase.call(this, a, Tokens);
          }
          function mix(a, b) {
            for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
            return a;
          }
          function isIdentStart(a) {
            return a != null && (isNameStart(a) || /\-\\/.test(a));
          }
          function isNameChar(a) {
            return a != null && (isNameStart(a) || /[0-9\-\\]/.test(a));
          }
          function isNameStart(a) {
            return a != null && /[a-z_\u0080-\uFFFF\\]/i.test(a);
          }
          function isNewLine(a) {
            return a != null && nl.test(a);
          }
          function isWhitespace(a) {
            return a != null && /\s/.test(a);
          }
          function isDigit(a) {
            return a != null && /\d/.test(a);
          }
          function isHexDigit(a) {
            return a != null && h.test(a);
          }
          function SelectorSubPart(a, b, c, d) {
            SyntaxUnit.call(this, a, c, d), (this.type = b), (this.args = []);
          }
          function SelectorPart(a, b, c, d, e) {
            SyntaxUnit.call(this, c, d, e),
              (this.elementName = a),
              (this.modifiers = b);
          }
          function Selector(a, b, c) {
            SyntaxUnit.call(this, a.join(" "), b, c), (this.parts = a);
          }
          function PropertyValuePart(text, line, col) {
            SyntaxUnit.apply(this, arguments), (this.type = "unknown");
            var temp;
            if (/^([+\-]?[\d\.]+)([a-z]+)$/i.test(text)) {
              (this.type = "dimension"),
                (this.value = +RegExp.$1),
                (this.units = RegExp.$2);
              switch (this.units.toLowerCase()) {
                case "em":
                case "rem":
                case "ex":
                case "px":
                case "cm":
                case "mm":
                case "in":
                case "pt":
                case "pc":
                  this.type = "length";
                  break;
                case "deg":
                case "rad":
                case "grad":
                  this.type = "angle";
                  break;
                case "ms":
                case "s":
                  this.type = "time";
                  break;
                case "hz":
                case "khz":
                  this.type = "frequency";
                  break;
                case "dpi":
                case "dpcm":
                  this.type = "resolution";
              }
            } else
              /^([+\-]?[\d\.]+)%$/i.test(text)
                ? ((this.type = "percentage"), (this.value = +RegExp.$1))
                : /^([+\-]?[\d\.]+)%$/i.test(text)
                ? ((this.type = "percentage"), (this.value = +RegExp.$1))
                : /^([+\-]?\d+)$/i.test(text)
                ? ((this.type = "integer"), (this.value = +RegExp.$1))
                : /^([+\-]?[\d\.]+)$/i.test(text)
                ? ((this.type = "number"), (this.value = +RegExp.$1))
                : /^#([a-f0-9]{3,6})/i.test(text)
                ? ((this.type = "color"),
                  (temp = RegExp.$1),
                  temp.length == 3
                    ? ((this.red = parseInt(
                        temp.charAt(0) + temp.charAt(0),
                        16
                      )),
                      (this.green = parseInt(
                        temp.charAt(1) + temp.charAt(1),
                        16
                      )),
                      (this.blue = parseInt(
                        temp.charAt(2) + temp.charAt(2),
                        16
                      )))
                    : ((this.red = parseInt(temp.substring(0, 2), 16)),
                      (this.green = parseInt(temp.substring(2, 4), 16)),
                      (this.blue = parseInt(temp.substring(4, 6), 16))))
                : /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i.test(text)
                ? ((this.type = "color"),
                  (this.red = +RegExp.$1),
                  (this.green = +RegExp.$2),
                  (this.blue = +RegExp.$3))
                : /^rgb\(\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/i.test(text)
                ? ((this.type = "color"),
                  (this.red = (+RegExp.$1 * 255) / 100),
                  (this.green = (+RegExp.$2 * 255) / 100),
                  (this.blue = (+RegExp.$3 * 255) / 100))
                : /^url\(["']?([^\)"']+)["']?\)/i.test(text)
                ? ((this.type = "uri"), (this.uri = RegExp.$1))
                : /^["'][^"']*["']/.test(text)
                ? ((this.type = "string"), (this.value = eval(text)))
                : Colors[text.toLowerCase()]
                ? ((this.type = "color"),
                  (temp = Colors[text.toLowerCase()].substring(1)),
                  (this.red = parseInt(temp.substring(0, 2), 16)),
                  (this.green = parseInt(temp.substring(2, 4), 16)),
                  (this.blue = parseInt(temp.substring(4, 6), 16)))
                : /^[\,\/]$/.test(text)
                ? ((this.type = "operator"), (this.value = text))
                : /^[a-z\-\u0080-\uFFFF][a-z0-9\-\u0080-\uFFFF]*$/i.test(
                    text
                  ) && ((this.type = "identifier"), (this.value = text));
          }
          function PropertyValue(a, b, c) {
            SyntaxUnit.call(this, a.join(" "), b, c), (this.parts = a);
          }
          function PropertyName(a, b, c, d) {
            SyntaxUnit.call(this, (b || "") + a, c, d), (this.hack = b);
          }
          function Parser(a) {
            EventTarget.call(this),
              (this.options = a || {}),
              (this._tokenStream = null);
          }
          function MediaQuery(a, b, c, d, e) {
            SyntaxUnit.call(
              this,
              (a ? a + " " : "") + (b ? b + " " : "") + c.join(" and "),
              d,
              e
            ),
              (this.modifier = a),
              (this.mediaType = b),
              (this.features = c);
          }
          function MediaFeature(a, b) {
            SyntaxUnit.call(
              this,
              "(" + a + (b !== null ? ":" + b : "") + ")",
              a.startLine,
              a.startCol
            ),
              (this.name = a),
              (this.value = b);
          }
          function Combinator(a, b, c) {
            SyntaxUnit.call(this, a, b, c),
              (this.type = "unknown"),
              /^\s+$/.test(a)
                ? (this.type = "descendant")
                : a == ">"
                ? (this.type = "child")
                : a == "+"
                ? (this.type = "adjacent-sibling")
                : a == "~" && (this.type = "sibling");
          }
          var EventTarget = parserlib.util.EventTarget,
            TokenStreamBase = parserlib.util.TokenStreamBase,
            StringReader = parserlib.util.StringReader,
            SyntaxError = parserlib.util.SyntaxError,
            SyntaxUnit = parserlib.util.SyntaxUnit,
            Colors = {
              aliceblue: "#f0f8ff",
              antiquewhite: "#faebd7",
              aqua: "#00ffff",
              aquamarine: "#7fffd4",
              azure: "#f0ffff",
              beige: "#f5f5dc",
              bisque: "#ffe4c4",
              black: "#000000",
              blanchedalmond: "#ffebcd",
              blue: "#0000ff",
              blueviolet: "#8a2be2",
              brown: "#a52a2a",
              burlywood: "#deb887",
              cadetblue: "#5f9ea0",
              chartreuse: "#7fff00",
              chocolate: "#d2691e",
              coral: "#ff7f50",
              cornflowerblue: "#6495ed",
              cornsilk: "#fff8dc",
              crimson: "#dc143c",
              cyan: "#00ffff",
              darkblue: "#00008b",
              darkcyan: "#008b8b",
              darkgoldenrod: "#b8860b",
              darkgray: "#a9a9a9",
              darkgreen: "#006400",
              darkkhaki: "#bdb76b",
              darkmagenta: "#8b008b",
              darkolivegreen: "#556b2f",
              darkorange: "#ff8c00",
              darkorchid: "#9932cc",
              darkred: "#8b0000",
              darksalmon: "#e9967a",
              darkseagreen: "#8fbc8f",
              darkslateblue: "#483d8b",
              darkslategray: "#2f4f4f",
              darkturquoise: "#00ced1",
              darkviolet: "#9400d3",
              deeppink: "#ff1493",
              deepskyblue: "#00bfff",
              dimgray: "#696969",
              dodgerblue: "#1e90ff",
              firebrick: "#b22222",
              floralwhite: "#fffaf0",
              forestgreen: "#228b22",
              fuchsia: "#ff00ff",
              gainsboro: "#dcdcdc",
              ghostwhite: "#f8f8ff",
              gold: "#ffd700",
              goldenrod: "#daa520",
              gray: "#808080",
              green: "#008000",
              greenyellow: "#adff2f",
              honeydew: "#f0fff0",
              hotpink: "#ff69b4",
              indianred: "#cd5c5c",
              indigo: "#4b0082",
              ivory: "#fffff0",
              khaki: "#f0e68c",
              lavender: "#e6e6fa",
              lavenderblush: "#fff0f5",
              lawngreen: "#7cfc00",
              lemonchiffon: "#fffacd",
              lightblue: "#add8e6",
              lightcoral: "#f08080",
              lightcyan: "#e0ffff",
              lightgoldenrodyellow: "#fafad2",
              lightgrey: "#d3d3d3",
              lightgreen: "#90ee90",
              lightpink: "#ffb6c1",
              lightsalmon: "#ffa07a",
              lightseagreen: "#20b2aa",
              lightskyblue: "#87cefa",
              lightslategray: "#778899",
              lightsteelblue: "#b0c4de",
              lightyellow: "#ffffe0",
              lime: "#00ff00",
              limegreen: "#32cd32",
              linen: "#faf0e6",
              magenta: "#ff00ff",
              maroon: "#800000",
              mediumaquamarine: "#66cdaa",
              mediumblue: "#0000cd",
              mediumorchid: "#ba55d3",
              mediumpurple: "#9370d8",
              mediumseagreen: "#3cb371",
              mediumslateblue: "#7b68ee",
              mediumspringgreen: "#00fa9a",
              mediumturquoise: "#48d1cc",
              mediumvioletred: "#c71585",
              midnightblue: "#191970",
              mintcream: "#f5fffa",
              mistyrose: "#ffe4e1",
              moccasin: "#ffe4b5",
              navajowhite: "#ffdead",
              navy: "#000080",
              oldlace: "#fdf5e6",
              olive: "#808000",
              olivedrab: "#6b8e23",
              orange: "#ffa500",
              orangered: "#ff4500",
              orchid: "#da70d6",
              palegoldenrod: "#eee8aa",
              palegreen: "#98fb98",
              paleturquoise: "#afeeee",
              palevioletred: "#d87093",
              papayawhip: "#ffefd5",
              peachpuff: "#ffdab9",
              peru: "#cd853f",
              pink: "#ffc0cb",
              plum: "#dda0dd",
              powderblue: "#b0e0e6",
              purple: "#800080",
              red: "#ff0000",
              rosybrown: "#bc8f8f",
              royalblue: "#4169e1",
              saddlebrown: "#8b4513",
              salmon: "#fa8072",
              sandybrown: "#f4a460",
              seagreen: "#2e8b57",
              seashell: "#fff5ee",
              sienna: "#a0522d",
              silver: "#c0c0c0",
              skyblue: "#87ceeb",
              slateblue: "#6a5acd",
              slategray: "#708090",
              snow: "#fffafa",
              springgreen: "#00ff7f",
              steelblue: "#4682b4",
              tan: "#d2b48c",
              teal: "#008080",
              thistle: "#d8bfd8",
              tomato: "#ff6347",
              turquoise: "#40e0d0",
              violet: "#ee82ee",
              wheat: "#f5deb3",
              white: "#ffffff",
              whitesmoke: "#f5f5f5",
              yellow: "#ffff00",
              yellowgreen: "#9acd32",
            };
          (Combinator.prototype = new SyntaxUnit()),
            (Combinator.prototype.constructor = Combinator);
          var Level1Properties = {
              background: 1,
              "background-attachment": 1,
              "background-color": 1,
              "background-image": 1,
              "background-position": 1,
              "background-repeat": 1,
              border: 1,
              "border-bottom": 1,
              "border-bottom-width": 1,
              "border-color": 1,
              "border-left": 1,
              "border-left-width": 1,
              "border-right": 1,
              "border-right-width": 1,
              "border-style": 1,
              "border-top": 1,
              "border-top-width": 1,
              "border-width": 1,
              clear: 1,
              color: 1,
              display: 1,
              float: 1,
              font: 1,
              "font-family": 1,
              "font-size": 1,
              "font-style": 1,
              "font-variant": 1,
              "font-weight": 1,
              height: 1,
              "letter-spacing": 1,
              "line-height": 1,
              "list-style": 1,
              "list-style-image": 1,
              "list-style-position": 1,
              "list-style-type": 1,
              margin: 1,
              "margin-bottom": 1,
              "margin-left": 1,
              "margin-right": 1,
              "margin-top": 1,
              padding: 1,
              "padding-bottom": 1,
              "padding-left": 1,
              "padding-right": 1,
              "padding-top": 1,
              "text-align": 1,
              "text-decoration": 1,
              "text-indent": 1,
              "text-transform": 1,
              "vertical-align": 1,
              "white-space": 1,
              width: 1,
              "word-spacing": 1,
            },
            Level2Properties = {
              azimuth: 1,
              "cue-after": 1,
              "cue-before": 1,
              cue: 1,
              elevation: 1,
              "pause-after": 1,
              "pause-before": 1,
              pause: 1,
              "pitch-range": 1,
              pitch: 1,
              "play-during": 1,
              richness: 1,
              "speak-header": 1,
              "speak-numeral": 1,
              "speak-punctuation": 1,
              speak: 1,
              "speech-rate": 1,
              stress: 1,
              "voice-family": 1,
              volume: 1,
              orphans: 1,
              "page-break-after": 1,
              "page-break-before": 1,
              "page-break-inside": 1,
              widows: 1,
              cursor: 1,
              "outline-color": 1,
              "outline-style": 1,
              "outline-width": 1,
              outline: 1,
              "background-attachment": 1,
              "background-color": 1,
              "background-image": 1,
              "background-position": 1,
              "background-repeat": 1,
              background: 1,
              "border-collapse": 1,
              "border-color": 1,
              "border-spacing": 1,
              "border-style": 1,
              "border-top": 1,
              "border-top-color": 1,
              "border-top-style": 1,
              "border-top-width": 1,
              "border-width": 1,
              border: 1,
              bottom: 1,
              "caption-side": 1,
              clear: 1,
              clip: 1,
              color: 1,
              content: 1,
              "counter-increment": 1,
              "counter-reset": 1,
              direction: 1,
              display: 1,
              "empty-cells": 1,
              float: 1,
              "font-family": 1,
              "font-size": 1,
              "font-style": 1,
              "font-variant": 1,
              "font-weight": 1,
              font: 1,
              height: 1,
              left: 1,
              "letter-spacing": 1,
              "line-height": 1,
              "list-style-image": 1,
              "list-style-position": 1,
              "list-style-type": 1,
              "list-style": 1,
              "margin-right": 1,
              "margin-top": 1,
              margin: 1,
              "max-height": 1,
              "max-width": 1,
              "min-height": 1,
              "min-width": 1,
              overflow: 1,
              "padding-top": 1,
              padding: 1,
              position: 1,
              quotes: 1,
              right: 1,
              "table-layout": 1,
              "text-align": 1,
              "text-decoration": 1,
              "text-indent": 1,
              "text-transform": 1,
              top: 1,
              "unicode-bidi": 1,
              "vertical-align": 1,
              visibility: 1,
              "white-space": 1,
              width: 1,
              "word-spacing": 1,
              "z-index": 1,
            };
          (MediaFeature.prototype = new SyntaxUnit()),
            (MediaFeature.prototype.constructor = MediaFeature),
            (MediaQuery.prototype = new SyntaxUnit()),
            (MediaQuery.prototype.constructor = MediaQuery),
            (Parser.prototype = (function () {
              var a = new EventTarget(),
                b,
                c = {
                  constructor: Parser,
                  _stylesheet: function () {
                    var a = this._tokenStream,
                      b = null,
                      c,
                      d;
                    this.fire("startstylesheet"),
                      this._charset(),
                      this._skipCruft();
                    while (a.peek() == Tokens.IMPORT_SYM)
                      this._import(), this._skipCruft();
                    while (a.peek() == Tokens.NAMESPACE_SYM)
                      this._namespace(), this._skipCruft();
                    d = a.peek();
                    while (d > Tokens.EOF) {
                      try {
                        switch (d) {
                          case Tokens.MEDIA_SYM:
                            this._media(), this._skipCruft();
                            break;
                          case Tokens.PAGE_SYM:
                            this._page(), this._skipCruft();
                            break;
                          case Tokens.FONT_FACE_SYM:
                            this._font_face(), this._skipCruft();
                            break;
                          case Tokens.KEYFRAMES_SYM:
                            this._keyframes(), this._skipCruft();
                            break;
                          case Tokens.S:
                            this._readWhitespace();
                            break;
                          default:
                            if (!this._ruleset())
                              switch (d) {
                                case Tokens.CHARSET_SYM:
                                  (c = a.LT(1)), this._charset(!1);
                                  throw new SyntaxError(
                                    "@charset not allowed here.",
                                    c.startLine,
                                    c.startCol
                                  );
                                case Tokens.IMPORT_SYM:
                                  (c = a.LT(1)), this._import(!1);
                                  throw new SyntaxError(
                                    "@import not allowed here.",
                                    c.startLine,
                                    c.startCol
                                  );
                                case Tokens.NAMESPACE_SYM:
                                  (c = a.LT(1)), this._namespace(!1);
                                  throw new SyntaxError(
                                    "@namespace not allowed here.",
                                    c.startLine,
                                    c.startCol
                                  );
                                default:
                                  a.get(), this._unexpectedToken(a.token());
                              }
                        }
                      } catch (e) {
                        if (e instanceof SyntaxError && !this.options.strict)
                          this.fire({
                            type: "error",
                            error: e,
                            message: e.message,
                            line: e.line,
                            col: e.col,
                          });
                        else throw e;
                      }
                      d = a.peek();
                    }
                    d != Tokens.EOF && this._unexpectedToken(a.token()),
                      this.fire("endstylesheet");
                  },
                  _charset: function (a) {
                    var b = this._tokenStream,
                      c,
                      d,
                      e,
                      f;
                    b.match(Tokens.CHARSET_SYM) &&
                      ((e = b.token().startLine),
                      (f = b.token().startCol),
                      this._readWhitespace(),
                      b.mustMatch(Tokens.STRING),
                      (d = b.token()),
                      (c = d.value),
                      this._readWhitespace(),
                      b.mustMatch(Tokens.SEMICOLON),
                      a !== !1 &&
                        this.fire({
                          type: "charset",
                          charset: c,
                          line: e,
                          col: f,
                        }));
                  },
                  _import: function (a) {
                    var b = this._tokenStream,
                      c,
                      d,
                      e,
                      f = [];
                    b.mustMatch(Tokens.IMPORT_SYM),
                      (e = b.token()),
                      this._readWhitespace(),
                      b.mustMatch([Tokens.STRING, Tokens.URI]),
                      (d = b
                        .token()
                        .value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1")),
                      this._readWhitespace(),
                      (f = this._media_query_list()),
                      b.mustMatch(Tokens.SEMICOLON),
                      this._readWhitespace(),
                      a !== !1 &&
                        this.fire({
                          type: "import",
                          uri: d,
                          media: f,
                          line: e.startLine,
                          col: e.startCol,
                        });
                  },
                  _namespace: function (a) {
                    var b = this._tokenStream,
                      c,
                      d,
                      e,
                      f;
                    b.mustMatch(Tokens.NAMESPACE_SYM),
                      (c = b.token().startLine),
                      (d = b.token().startCol),
                      this._readWhitespace(),
                      b.match(Tokens.IDENT) &&
                        ((e = b.token().value), this._readWhitespace()),
                      b.mustMatch([Tokens.STRING, Tokens.URI]),
                      (f = b
                        .token()
                        .value.replace(/(?:url\()?["']([^"']+)["']\)?/, "$1")),
                      this._readWhitespace(),
                      b.mustMatch(Tokens.SEMICOLON),
                      this._readWhitespace(),
                      a !== !1 &&
                        this.fire({
                          type: "namespace",
                          prefix: e,
                          uri: f,
                          line: c,
                          col: d,
                        });
                  },
                  _media: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d;
                    a.mustMatch(Tokens.MEDIA_SYM),
                      (b = a.token().startLine),
                      (c = a.token().startCol),
                      this._readWhitespace(),
                      (d = this._media_query_list()),
                      a.mustMatch(Tokens.LBRACE),
                      this._readWhitespace(),
                      this.fire({
                        type: "startmedia",
                        media: d,
                        line: b,
                        col: c,
                      });
                    for (;;)
                      if (a.peek() == Tokens.PAGE_SYM) this._page();
                      else if (!this._ruleset()) break;
                    a.mustMatch(Tokens.RBRACE),
                      this._readWhitespace(),
                      this.fire({
                        type: "endmedia",
                        media: d,
                        line: b,
                        col: c,
                      });
                  },
                  _media_query_list: function () {
                    var a = this._tokenStream,
                      b = [];
                    this._readWhitespace(),
                      (a.peek() == Tokens.IDENT || a.peek() == Tokens.LPAREN) &&
                        b.push(this._media_query());
                    while (a.match(Tokens.COMMA))
                      this._readWhitespace(), b.push(this._media_query());
                    return b;
                  },
                  _media_query: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null,
                      d = null,
                      e = [];
                    a.match(Tokens.IDENT) &&
                      ((c = a.token().value.toLowerCase()),
                      c != "only" && c != "not"
                        ? (a.unget(), (c = null))
                        : (d = a.token())),
                      this._readWhitespace(),
                      a.peek() == Tokens.IDENT
                        ? ((b = this._media_type()),
                          d === null && (d = a.token()))
                        : a.peek() == Tokens.LPAREN &&
                          (d === null && (d = a.LT(1)),
                          e.push(this._media_expression()));
                    if (b === null && e.length === 0) return null;
                    this._readWhitespace();
                    while (a.match(Tokens.IDENT))
                      a.token().value.toLowerCase() != "and" &&
                        this._unexpectedToken(a.token()),
                        this._readWhitespace(),
                        e.push(this._media_expression());
                    return new MediaQuery(c, b, e, d.startLine, d.startCol);
                  },
                  _media_type: function () {
                    return this._media_feature();
                  },
                  _media_expression: function () {
                    var a = this._tokenStream,
                      b = null,
                      c,
                      d = null;
                    a.mustMatch(Tokens.LPAREN),
                      (b = this._media_feature()),
                      this._readWhitespace(),
                      a.match(Tokens.COLON) &&
                        (this._readWhitespace(),
                        (c = a.LT(1)),
                        (d = this._expression())),
                      a.mustMatch(Tokens.RPAREN),
                      this._readWhitespace();
                    return new MediaFeature(
                      b,
                      d ? new SyntaxUnit(d, c.startLine, c.startCol) : null
                    );
                  },
                  _media_feature: function () {
                    var a = this._tokenStream;
                    a.mustMatch(Tokens.IDENT);
                    return SyntaxUnit.fromToken(a.token());
                  },
                  _page: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d = null,
                      e = null;
                    a.mustMatch(Tokens.PAGE_SYM),
                      (b = a.token().startLine),
                      (c = a.token().startCol),
                      this._readWhitespace(),
                      a.match(Tokens.IDENT) &&
                        ((d = a.token().value),
                        d.toLowerCase() === "auto" &&
                          this._unexpectedToken(a.token())),
                      a.peek() == Tokens.COLON && (e = this._pseudo_page()),
                      this._readWhitespace(),
                      this.fire({
                        type: "startpage",
                        id: d,
                        pseudo: e,
                        line: b,
                        col: c,
                      }),
                      this._readDeclarations(!0, !0),
                      this.fire({
                        type: "endpage",
                        id: d,
                        pseudo: e,
                        line: b,
                        col: c,
                      });
                  },
                  _margin: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d = this._margin_sym();
                    if (d) {
                      (b = a.token().startLine),
                        (c = a.token().startCol),
                        this.fire({
                          type: "startpagemargin",
                          margin: d,
                          line: b,
                          col: c,
                        }),
                        this._readDeclarations(!0),
                        this.fire({
                          type: "endpagemargin",
                          margin: d,
                          line: b,
                          col: c,
                        });
                      return !0;
                    }
                    return !1;
                  },
                  _margin_sym: function () {
                    var a = this._tokenStream;
                    return a.match([
                      Tokens.TOPLEFTCORNER_SYM,
                      Tokens.TOPLEFT_SYM,
                      Tokens.TOPCENTER_SYM,
                      Tokens.TOPRIGHT_SYM,
                      Tokens.TOPRIGHTCORNER_SYM,
                      Tokens.BOTTOMLEFTCORNER_SYM,
                      Tokens.BOTTOMLEFT_SYM,
                      Tokens.BOTTOMCENTER_SYM,
                      Tokens.BOTTOMRIGHT_SYM,
                      Tokens.BOTTOMRIGHTCORNER_SYM,
                      Tokens.LEFTTOP_SYM,
                      Tokens.LEFTMIDDLE_SYM,
                      Tokens.LEFTBOTTOM_SYM,
                      Tokens.RIGHTTOP_SYM,
                      Tokens.RIGHTMIDDLE_SYM,
                      Tokens.RIGHTBOTTOM_SYM,
                    ])
                      ? SyntaxUnit.fromToken(a.token())
                      : null;
                  },
                  _pseudo_page: function () {
                    var a = this._tokenStream;
                    a.mustMatch(Tokens.COLON), a.mustMatch(Tokens.IDENT);
                    return a.token().value;
                  },
                  _font_face: function () {
                    var a = this._tokenStream,
                      b,
                      c;
                    a.mustMatch(Tokens.FONT_FACE_SYM),
                      (b = a.token().startLine),
                      (c = a.token().startCol),
                      this._readWhitespace(),
                      this.fire({ type: "startfontface", line: b, col: c }),
                      this._readDeclarations(!0),
                      this.fire({ type: "endfontface", line: b, col: c });
                  },
                  _operator: function () {
                    var a = this._tokenStream,
                      b = null;
                    a.match([Tokens.SLASH, Tokens.COMMA]) &&
                      ((b = a.token()), this._readWhitespace());
                    return b ? PropertyValuePart.fromToken(b) : null;
                  },
                  _combinator: function () {
                    var a = this._tokenStream,
                      b = null,
                      c;
                    a.match([Tokens.PLUS, Tokens.GREATER, Tokens.TILDE]) &&
                      ((c = a.token()),
                      (b = new Combinator(c.value, c.startLine, c.startCol)),
                      this._readWhitespace());
                    return b;
                  },
                  _unary_operator: function () {
                    var a = this._tokenStream;
                    return a.match([Tokens.MINUS, Tokens.PLUS])
                      ? a.token().value
                      : null;
                  },
                  _property: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null,
                      d,
                      e,
                      f,
                      g;
                    a.peek() == Tokens.STAR &&
                      this.options.starHack &&
                      (a.get(),
                      (e = a.token()),
                      (c = e.value),
                      (f = e.startLine),
                      (g = e.startCol)),
                      a.match(Tokens.IDENT) &&
                        ((e = a.token()),
                        (d = e.value),
                        d.charAt(0) == "_" &&
                          this.options.underscoreHack &&
                          ((c = "_"), (d = d.substring(1))),
                        (b = new PropertyName(
                          d,
                          c,
                          f || e.startLine,
                          g || e.startCol
                        )),
                        this._readWhitespace());
                    return b;
                  },
                  _ruleset: function () {
                    var a = this._tokenStream,
                      b,
                      c;
                    try {
                      c = this._selectors_group();
                    } catch (d) {
                      if (!(d instanceof SyntaxError && !this.options.strict))
                        throw d;
                      this.fire({
                        type: "error",
                        error: d,
                        message: d.message,
                        line: d.line,
                        col: d.col,
                      }),
                        (b = a.advance([Tokens.RBRACE]));
                      if (b != Tokens.RBRACE) throw d;
                      return !0;
                    }
                    c &&
                      (this.fire({
                        type: "startrule",
                        selectors: c,
                        line: c[0].line,
                        col: c[0].col,
                      }),
                      this._readDeclarations(!0),
                      this.fire({
                        type: "endrule",
                        selectors: c,
                        line: c[0].line,
                        col: c[0].col,
                      }));
                    return c;
                  },
                  _selectors_group: function () {
                    var a = this._tokenStream,
                      b = [],
                      c;
                    c = this._selector();
                    if (c !== null) {
                      b.push(c);
                      while (a.match(Tokens.COMMA))
                        this._readWhitespace(),
                          (c = this._selector()),
                          c !== null
                            ? b.push(c)
                            : this._unexpectedToken(a.LT(1));
                    }
                    return b.length ? b : null;
                  },
                  _selector: function () {
                    var a = this._tokenStream,
                      b = [],
                      c = null,
                      d = null,
                      e = null;
                    c = this._simple_selector_sequence();
                    if (c === null) return null;
                    b.push(c);
                    do {
                      d = this._combinator();
                      if (d !== null)
                        b.push(d),
                          (c = this._simple_selector_sequence()),
                          c === null
                            ? this._unexpectedToken(this.LT(1))
                            : b.push(c);
                      else if (this._readWhitespace())
                        (e = new Combinator(
                          a.token().value,
                          a.token().startLine,
                          a.token().startCol
                        )),
                          (d = this._combinator()),
                          (c = this._simple_selector_sequence()),
                          c === null
                            ? d !== null && this._unexpectedToken(a.LT(1))
                            : (d !== null ? b.push(d) : b.push(e), b.push(c));
                      else break;
                    } while (!0);
                    return new Selector(b, b[0].line, b[0].col);
                  },
                  _simple_selector_sequence: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = [],
                      d = "",
                      e = [
                        function () {
                          return a.match(Tokens.HASH)
                            ? new SelectorSubPart(
                                a.token().value,
                                "id",
                                a.token().startLine,
                                a.token().startCol
                              )
                            : null;
                        },
                        this._class,
                        this._attrib,
                        this._pseudo,
                        this._negation,
                      ],
                      f = 0,
                      g = e.length,
                      h = null,
                      i = !1,
                      j,
                      k;
                    (j = a.LT(1).startLine),
                      (k = a.LT(1).startCol),
                      (b = this._type_selector()),
                      b || (b = this._universal()),
                      b !== null && (d += b);
                    for (;;) {
                      if (a.peek() === Tokens.S) break;
                      while (f < g && h === null) h = e[f++].call(this);
                      if (h === null) {
                        if (d === "") return null;
                        break;
                      }
                      (f = 0), c.push(h), (d += h.toString()), (h = null);
                    }
                    return d !== "" ? new SelectorPart(b, c, d, j, k) : null;
                  },
                  _type_selector: function () {
                    var a = this._tokenStream,
                      b = this._namespace_prefix(),
                      c = this._element_name();
                    if (!c) {
                      b && (a.unget(), b.length > 1 && a.unget());
                      return null;
                    }
                    b && ((c.text = b + c.text), (c.col -= b.length));
                    return c;
                  },
                  _class: function () {
                    var a = this._tokenStream,
                      b;
                    if (a.match(Tokens.DOT)) {
                      a.mustMatch(Tokens.IDENT), (b = a.token());
                      return new SelectorSubPart(
                        "." + b.value,
                        "class",
                        b.startLine,
                        b.startCol - 1
                      );
                    }
                    return null;
                  },
                  _element_name: function () {
                    var a = this._tokenStream,
                      b;
                    if (a.match(Tokens.IDENT)) {
                      b = a.token();
                      return new SelectorSubPart(
                        b.value,
                        "elementName",
                        b.startLine,
                        b.startCol
                      );
                    }
                    return null;
                  },
                  _namespace_prefix: function () {
                    var a = this._tokenStream,
                      b = "";
                    if (a.LA(1) === Tokens.PIPE || a.LA(2) === Tokens.PIPE)
                      a.match([Tokens.IDENT, Tokens.STAR]) &&
                        (b += a.token().value),
                        a.mustMatch(Tokens.PIPE),
                        (b += "|");
                    return b.length ? b : null;
                  },
                  _universal: function () {
                    var a = this._tokenStream,
                      b = "",
                      c;
                    (c = this._namespace_prefix()),
                      c && (b += c),
                      a.match(Tokens.STAR) && (b += "*");
                    return b.length ? b : null;
                  },
                  _attrib: function () {
                    var a = this._tokenStream,
                      b = null,
                      c,
                      d;
                    if (a.match(Tokens.LBRACKET)) {
                      (d = a.token()),
                        (b = d.value),
                        (b += this._readWhitespace()),
                        (c = this._namespace_prefix()),
                        c && (b += c),
                        a.mustMatch(Tokens.IDENT),
                        (b += a.token().value),
                        (b += this._readWhitespace()),
                        a.match([
                          Tokens.PREFIXMATCH,
                          Tokens.SUFFIXMATCH,
                          Tokens.SUBSTRINGMATCH,
                          Tokens.EQUALS,
                          Tokens.INCLUDES,
                          Tokens.DASHMATCH,
                        ]) &&
                          ((b += a.token().value),
                          (b += this._readWhitespace()),
                          a.mustMatch([Tokens.IDENT, Tokens.STRING]),
                          (b += a.token().value),
                          (b += this._readWhitespace())),
                        a.mustMatch(Tokens.RBRACKET);
                      return new SelectorSubPart(
                        b + "]",
                        "attribute",
                        d.startLine,
                        d.startCol
                      );
                    }
                    return null;
                  },
                  _pseudo: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = ":",
                      d,
                      e;
                    a.match(Tokens.COLON) &&
                      (a.match(Tokens.COLON) && (c += ":"),
                      a.match(Tokens.IDENT)
                        ? ((b = a.token().value),
                          (d = a.token().startLine),
                          (e = a.token().startCol - c.length))
                        : a.peek() == Tokens.FUNCTION &&
                          ((d = a.LT(1).startLine),
                          (e = a.LT(1).startCol - c.length),
                          (b = this._functional_pseudo())),
                      b && (b = new SelectorSubPart(c + b, "pseudo", d, e)));
                    return b;
                  },
                  _functional_pseudo: function () {
                    var a = this._tokenStream,
                      b = null;
                    a.match(Tokens.FUNCTION) &&
                      ((b = a.token().value),
                      (b += this._readWhitespace()),
                      (b += this._expression()),
                      a.mustMatch(Tokens.RPAREN),
                      (b += ")"));
                    return b;
                  },
                  _expression: function () {
                    var a = this._tokenStream,
                      b = "";
                    while (
                      a.match([
                        Tokens.PLUS,
                        Tokens.MINUS,
                        Tokens.DIMENSION,
                        Tokens.NUMBER,
                        Tokens.STRING,
                        Tokens.IDENT,
                        Tokens.LENGTH,
                        Tokens.FREQ,
                        Tokens.ANGLE,
                        Tokens.TIME,
                        Tokens.RESOLUTION,
                      ])
                    )
                      (b += a.token().value), (b += this._readWhitespace());
                    return b.length ? b : null;
                  },
                  _negation: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d = "",
                      e,
                      f = null;
                    a.match(Tokens.NOT) &&
                      ((d = a.token().value),
                      (b = a.token().startLine),
                      (c = a.token().startCol),
                      (d += this._readWhitespace()),
                      (e = this._negation_arg()),
                      (d += e),
                      (d += this._readWhitespace()),
                      a.match(Tokens.RPAREN),
                      (d += a.token().value),
                      (f = new SelectorSubPart(d, "not", b, c)),
                      f.args.push(e));
                    return f;
                  },
                  _negation_arg: function () {
                    var a = this._tokenStream,
                      b = [
                        this._type_selector,
                        this._universal,
                        function () {
                          return a.match(Tokens.HASH)
                            ? new SelectorSubPart(
                                a.token().value,
                                "id",
                                a.token().startLine,
                                a.token().startCol
                              )
                            : null;
                        },
                        this._class,
                        this._attrib,
                        this._pseudo,
                      ],
                      c = null,
                      d = 0,
                      e = b.length,
                      f,
                      g,
                      h,
                      i;
                    (g = a.LT(1).startLine), (h = a.LT(1).startCol);
                    while (d < e && c === null) (c = b[d].call(this)), d++;
                    c === null && this._unexpectedToken(a.LT(1)),
                      c.type == "elementName"
                        ? (i = new SelectorPart(c, [], c.toString(), g, h))
                        : (i = new SelectorPart(null, [c], c.toString(), g, h));
                    return i;
                  },
                  _declaration: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null,
                      d = null;
                    b = this._property();
                    if (b !== null) {
                      a.mustMatch(Tokens.COLON),
                        this._readWhitespace(),
                        (c = this._expr()),
                        (!c || c.length === 0) &&
                          this._unexpectedToken(a.LT(1)),
                        (d = this._prio()),
                        this.fire({
                          type: "property",
                          property: b,
                          value: c,
                          important: d,
                          line: b.line,
                          col: b.col,
                        });
                      return !0;
                    }
                    return !1;
                  },
                  _prio: function () {
                    var a = this._tokenStream,
                      b = a.match(Tokens.IMPORTANT_SYM);
                    this._readWhitespace();
                    return b;
                  },
                  _expr: function () {
                    var a = this._tokenStream,
                      b = [],
                      c = null,
                      d = null;
                    c = this._term();
                    if (c !== null) {
                      b.push(c);
                      do {
                        (d = this._operator()),
                          d && b.push(d),
                          (c = this._term());
                        if (c === null) break;
                        b.push(c);
                      } while (!0);
                    }
                    return b.length > 0
                      ? new PropertyValue(b, b[0].startLine, b[0].startCol)
                      : null;
                  },
                  _term: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null,
                      d,
                      e;
                    (b = this._unary_operator()),
                      b !== null &&
                        ((d = a.token().startLine), (e = a.token().startCol)),
                      a.peek() == Tokens.IE_FUNCTION && this.options.ieFilters
                        ? ((c = this._ie_function()),
                          b === null &&
                            ((d = a.token().startLine),
                            (e = a.token().startCol)))
                        : a.match([
                            Tokens.NUMBER,
                            Tokens.PERCENTAGE,
                            Tokens.LENGTH,
                            Tokens.ANGLE,
                            Tokens.TIME,
                            Tokens.FREQ,
                            Tokens.STRING,
                            Tokens.IDENT,
                            Tokens.URI,
                            Tokens.UNICODE_RANGE,
                          ])
                        ? ((c = a.token().value),
                          b === null &&
                            ((d = a.token().startLine),
                            (e = a.token().startCol)),
                          this._readWhitespace())
                        : ((c = this._hexcolor()),
                          c === null
                            ? (b === null &&
                                ((d = a.LT(1).startLine),
                                (e = a.LT(1).startCol)),
                              c === null &&
                                (a.LA(3) == Tokens.EQUALS &&
                                this.options.ieFilters
                                  ? (c = this._ie_function())
                                  : (c = this._function())))
                            : b === null &&
                              ((d = a.token().startLine),
                              (e = a.token().startCol)));
                    return c !== null
                      ? new PropertyValuePart(b !== null ? b + c : c, d, e)
                      : null;
                  },
                  _function: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null;
                    a.match(Tokens.FUNCTION) &&
                      ((b = a.token().value),
                      this._readWhitespace(),
                      (c = this._expr()),
                      a.match(Tokens.RPAREN),
                      (b += c + ")"),
                      this._readWhitespace());
                    return b;
                  },
                  _ie_function: function () {
                    var a = this._tokenStream,
                      b = null,
                      c = null,
                      d;
                    if (a.match([Tokens.IE_FUNCTION, Tokens.FUNCTION])) {
                      b = a.token().value;
                      do {
                        this._readWhitespace() && (b += a.token().value),
                          a.LA(0) == Tokens.COMMA && (b += a.token().value),
                          a.match(Tokens.IDENT),
                          (b += a.token().value),
                          a.match(Tokens.EQUALS),
                          (b += a.token().value),
                          (d = a.peek());
                        while (
                          d != Tokens.COMMA &&
                          d != Tokens.S &&
                          d != Tokens.RPAREN
                        )
                          a.get(), (b += a.token().value), (d = a.peek());
                      } while (a.match([Tokens.COMMA, Tokens.S]));
                      a.match(Tokens.RPAREN),
                        (b += ")"),
                        this._readWhitespace();
                    }
                    return b;
                  },
                  _hexcolor: function () {
                    var a = this._tokenStream,
                      b,
                      c = null;
                    if (a.match(Tokens.HASH)) {
                      (b = a.token()), (c = b.value);
                      if (!/#[a-f0-9]{3,6}/i.test(c))
                        throw new SyntaxError(
                          "Expected a hex color but found '" +
                            c +
                            "' at line " +
                            b.startLine +
                            ", col " +
                            b.startCol +
                            ".",
                          b.startLine,
                          b.startCol
                        );
                      this._readWhitespace();
                    }
                    return c;
                  },
                  _keyframes: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d;
                    a.mustMatch(Tokens.KEYFRAMES_SYM),
                      this._readWhitespace(),
                      (d = this._keyframe_name()),
                      this._readWhitespace(),
                      a.mustMatch(Tokens.LBRACE),
                      this.fire({
                        type: "startkeyframes",
                        name: d,
                        line: d.line,
                        col: d.col,
                      }),
                      this._readWhitespace(),
                      (c = a.peek());
                    while (c == Tokens.IDENT || c == Tokens.PERCENTAGE)
                      this._keyframe_rule(),
                        this._readWhitespace(),
                        (c = a.peek());
                    this.fire({
                      type: "endkeyframes",
                      name: d,
                      line: d.line,
                      col: d.col,
                    }),
                      this._readWhitespace(),
                      a.mustMatch(Tokens.RBRACE);
                  },
                  _keyframe_name: function () {
                    var a = this._tokenStream,
                      b;
                    a.mustMatch([Tokens.IDENT, Tokens.STRING]);
                    return SyntaxUnit.fromToken(a.token());
                  },
                  _keyframe_rule: function () {
                    var a = this._tokenStream,
                      b,
                      c = this._key_list();
                    this.fire({
                      type: "startkeyframerule",
                      keys: c,
                      line: c[0].line,
                      col: c[0].col,
                    }),
                      this._readDeclarations(!0),
                      this.fire({
                        type: "endkeyframerule",
                        keys: c,
                        line: c[0].line,
                        col: c[0].col,
                      });
                  },
                  _key_list: function () {
                    var a = this._tokenStream,
                      b,
                      c,
                      d = [];
                    d.push(this._key()), this._readWhitespace();
                    while (a.match(Tokens.COMMA))
                      this._readWhitespace(),
                        d.push(this._key()),
                        this._readWhitespace();
                    return d;
                  },
                  _key: function () {
                    var a = this._tokenStream,
                      b;
                    if (a.match(Tokens.PERCENTAGE))
                      return SyntaxUnit.fromToken(a.token());
                    if (a.match(Tokens.IDENT)) {
                      b = a.token();
                      if (/from|to/i.test(b.value))
                        return SyntaxUnit.fromToken(b);
                      a.unget();
                    }
                    this._unexpectedToken(a.LT(1));
                  },
                  _skipCruft: function () {
                    while (
                      this._tokenStream.match([
                        Tokens.S,
                        Tokens.CDO,
                        Tokens.CDC,
                      ])
                    );
                  },
                  _readDeclarations: function (a, b) {
                    var c = this._tokenStream,
                      d;
                    this._readWhitespace(),
                      a && c.mustMatch(Tokens.LBRACE),
                      this._readWhitespace();
                    try {
                      for (;;) {
                        if (!b || !this._margin()) {
                          if (!this._declaration()) break;
                          if (!c.match(Tokens.SEMICOLON)) break;
                        }
                        this._readWhitespace();
                      }
                      c.mustMatch(Tokens.RBRACE), this._readWhitespace();
                    } catch (e) {
                      if (!(e instanceof SyntaxError && !this.options.strict))
                        throw e;
                      this.fire({
                        type: "error",
                        error: e,
                        message: e.message,
                        line: e.line,
                        col: e.col,
                      }),
                        (d = c.advance([Tokens.SEMICOLON, Tokens.RBRACE]));
                      if (d == Tokens.SEMICOLON) this._readDeclarations(!1, b);
                      else if (d != Tokens.RBRACE) throw e;
                    }
                  },
                  _readWhitespace: function () {
                    var a = this._tokenStream,
                      b = "";
                    while (a.match(Tokens.S)) b += a.token().value;
                    return b;
                  },
                  _unexpectedToken: function (a) {
                    throw new SyntaxError(
                      "Unexpected token '" +
                        a.value +
                        "' at line " +
                        a.startLine +
                        ", col " +
                        a.startCol +
                        ".",
                      a.startLine,
                      a.startCol
                    );
                  },
                  _verifyEnd: function () {
                    this._tokenStream.LA(1) != Tokens.EOF &&
                      this._unexpectedToken(this._tokenStream.LT(1));
                  },
                  parse: function (a) {
                    (this._tokenStream = new TokenStream(a, Tokens)),
                      this._stylesheet();
                  },
                  parseStyleSheet: function (a) {
                    return this.parse(a);
                  },
                  parseMediaQuery: function (a) {
                    this._tokenStream = new TokenStream(a, Tokens);
                    var b = this._media_query();
                    this._verifyEnd();
                    return b;
                  },
                  parsePropertyValue: function (a) {
                    (this._tokenStream = new TokenStream(a, Tokens)),
                      this._readWhitespace();
                    var b = this._expr();
                    this._readWhitespace(), this._verifyEnd();
                    return b;
                  },
                  parseRule: function (a) {
                    (this._tokenStream = new TokenStream(a, Tokens)),
                      this._readWhitespace();
                    var b = this._ruleset();
                    this._readWhitespace(), this._verifyEnd();
                    return b;
                  },
                  parseSelector: function (a) {
                    (this._tokenStream = new TokenStream(a, Tokens)),
                      this._readWhitespace();
                    var b = this._selector();
                    this._readWhitespace(), this._verifyEnd();
                    return b;
                  },
                };
              for (b in c) a[b] = c[b];
              return a;
            })()),
            (PropertyName.prototype = new SyntaxUnit()),
            (PropertyName.prototype.constructor = PropertyName),
            (PropertyValue.prototype = new SyntaxUnit()),
            (PropertyValue.prototype.constructor = PropertyValue),
            (PropertyValuePart.prototype = new SyntaxUnit()),
            (PropertyValuePart.prototype.constructor = PropertyValue),
            (PropertyValuePart.fromToken = function (a) {
              return new PropertyValuePart(a.value, a.startLine, a.startCol);
            }),
            (Selector.prototype = new SyntaxUnit()),
            (Selector.prototype.constructor = Selector),
            (SelectorPart.prototype = new SyntaxUnit()),
            (SelectorPart.prototype.constructor = SelectorPart),
            (SelectorSubPart.prototype = new SyntaxUnit()),
            (SelectorSubPart.prototype.constructor = SelectorSubPart);
          var h = /^[0-9a-fA-F]$/,
            nonascii = /^[\u0080-\uFFFF]$/,
            nl = /\n|\r\n|\r|\f/;
          TokenStream.prototype = mix(new TokenStreamBase(), {
            _getToken: function (a) {
              var b,
                c = this._reader,
                d = null,
                e = c.getLine(),
                f = c.getCol();
              b = c.read();
              while (b) {
                switch (b) {
                  case "/":
                    c.peek() == "*"
                      ? (d = this.commentToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                    break;
                  case "|":
                  case "~":
                  case "^":
                  case "$":
                  case "*":
                    c.peek() == "="
                      ? (d = this.comparisonToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                    break;
                  case '"':
                  case "'":
                    d = this.stringToken(b, e, f);
                    break;
                  case "#":
                    isNameChar(c.peek())
                      ? (d = this.hashToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                    break;
                  case ".":
                    isDigit(c.peek())
                      ? (d = this.numberToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                    break;
                  case "-":
                    c.peek() == "-"
                      ? (d = this.htmlCommentEndToken(b, e, f))
                      : isNameStart(c.peek())
                      ? (d = this.identOrFunctionToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                    break;
                  case "!":
                    d = this.importantToken(b, e, f);
                    break;
                  case "@":
                    d = this.atRuleToken(b, e, f);
                    break;
                  case ":":
                    d = this.notToken(b, e, f);
                    break;
                  case "<":
                    d = this.htmlCommentStartToken(b, e, f);
                    break;
                  case "U":
                  case "u":
                    if (c.peek() == "+") {
                      d = this.unicodeRangeToken(b, e, f);
                      break;
                    }
                  default:
                    isDigit(b)
                      ? (d = this.numberToken(b, e, f))
                      : isWhitespace(b)
                      ? (d = this.whitespaceToken(b, e, f))
                      : isIdentStart(b)
                      ? (d = this.identOrFunctionToken(b, e, f))
                      : (d = this.charToken(b, e, f));
                }
                break;
              }
              !d && b == null && (d = this.createToken(Tokens.EOF, null, e, f));
              return d;
            },
            createToken: function (a, b, c, d, e) {
              var f = this._reader;
              e = e || {};
              return {
                value: b,
                type: a,
                channel: e.channel,
                hide: e.hide || !1,
                startLine: c,
                startCol: d,
                endLine: f.getLine(),
                endCol: f.getCol(),
              };
            },
            atRuleToken: function (a, b, c) {
              var d = a,
                e = this._reader,
                f = Tokens.CHAR,
                g = !1,
                h,
                i;
              e.mark(),
                (h = this.readName()),
                (d = a + h),
                (f = Tokens.type(d.toLowerCase()));
              if (f == Tokens.CHAR || f == Tokens.UNKNOWN)
                (f = Tokens.CHAR), (d = a), e.reset();
              return this.createToken(f, d, b, c);
            },
            charToken: function (a, b, c) {
              var d = Tokens.type(a);
              d == -1 && (d = Tokens.CHAR);
              return this.createToken(d, a, b, c);
            },
            commentToken: function (a, b, c) {
              var d = this._reader,
                e = this.readComment(a);
              return this.createToken(Tokens.COMMENT, e, b, c);
            },
            comparisonToken: function (a, b, c) {
              var d = this._reader,
                e = a + d.read(),
                f = Tokens.type(e) || Tokens.CHAR;
              return this.createToken(f, e, b, c);
            },
            hashToken: function (a, b, c) {
              var d = this._reader,
                e = this.readName(a);
              return this.createToken(Tokens.HASH, e, b, c);
            },
            htmlCommentStartToken: function (a, b, c) {
              var d = this._reader,
                e = a;
              d.mark(), (e += d.readCount(3));
              if (e == "<!--") return this.createToken(Tokens.CDO, e, b, c);
              d.reset();
              return this.charToken(a, b, c);
            },
            htmlCommentEndToken: function (a, b, c) {
              var d = this._reader,
                e = a;
              d.mark(), (e += d.readCount(2));
              if (e == "-->") return this.createToken(Tokens.CDC, e, b, c);
              d.reset();
              return this.charToken(a, b, c);
            },
            identOrFunctionToken: function (a, b, c) {
              var d = this._reader,
                e = this.readName(a),
                f = Tokens.IDENT;
              d.peek() == "("
                ? ((e += d.read()),
                  e.toLowerCase() == "url("
                    ? ((f = Tokens.URI),
                      (e = this.readURI(e)),
                      e.toLowerCase() == "url(" && (f = Tokens.FUNCTION))
                    : (f = Tokens.FUNCTION))
                : d.peek() == ":" &&
                  e.toLowerCase() == "progid" &&
                  ((e += d.readTo("(")), (f = Tokens.IE_FUNCTION));
              return this.createToken(f, e, b, c);
            },
            importantToken: function (a, b, c) {
              var d = this._reader,
                e = a,
                f = Tokens.CHAR,
                g,
                h;
              d.mark(), (h = d.read());
              while (h) {
                if (h == "/") {
                  if (d.peek() != "*") break;
                  g = this.readComment(h);
                  if (g == "") break;
                } else if (isWhitespace(h)) e += h + this.readWhitespace();
                else {
                  if (/i/i.test(h)) {
                    (g = d.readCount(8)),
                      /mportant/i.test(g) &&
                        ((e += h + g), (f = Tokens.IMPORTANT_SYM));
                    break;
                  }
                  break;
                }
                h = d.read();
              }
              if (f == Tokens.CHAR) {
                d.reset();
                return this.charToken(a, b, c);
              }
              return this.createToken(f, e, b, c);
            },
            notToken: function (a, b, c) {
              var d = this._reader,
                e = a;
              d.mark(), (e += d.readCount(4));
              if (e.toLowerCase() == ":not(")
                return this.createToken(Tokens.NOT, e, b, c);
              d.reset();
              return this.charToken(a, b, c);
            },
            numberToken: function (a, b, c) {
              var d = this._reader,
                e = this.readNumber(a),
                f,
                g = Tokens.NUMBER,
                h = d.peek();
              isIdentStart(h)
                ? ((f = this.readName(d.read())),
                  (e += f),
                  /^em$|^ex$|^px$|^gd$|^rem$|^vw$|^vh$|^vm$|^ch$|^cm$|^mm$|^in$|^pt$|^pc$/i.test(
                    f
                  )
                    ? (g = Tokens.LENGTH)
                    : /^deg|^rad$|^grad$/i.test(f)
                    ? (g = Tokens.ANGLE)
                    : /^ms$|^s$/i.test(f)
                    ? (g = Tokens.TIME)
                    : /^hz$|^khz$/i.test(f)
                    ? (g = Tokens.FREQ)
                    : /^dpi$|^dpcm$/i.test(f)
                    ? (g = Tokens.RESOLUTION)
                    : (g = Tokens.DIMENSION))
                : h == "%" && ((e += d.read()), (g = Tokens.PERCENTAGE));
              return this.createToken(g, e, b, c);
            },
            stringToken: function (a, b, c) {
              var d = a,
                e = a,
                f = this._reader,
                g = a,
                h = Tokens.STRING,
                i = f.read();
              while (i) {
                e += i;
                if (i == d && g != "\\") break;
                if (isNewLine(f.peek()) && i != "\\") {
                  h = Tokens.INVALID;
                  break;
                }
                (g = i), (i = f.read());
              }
              i == null && (h = Tokens.INVALID);
              return this.createToken(h, e, b, c);
            },
            unicodeRangeToken: function (a, b, c) {
              var d = this._reader,
                e = a,
                f,
                g = Tokens.CHAR;
              d.peek() == "+" &&
                (d.mark(),
                (e += d.read()),
                (e += this.readUnicodeRangePart(!0)),
                e.length == 2
                  ? d.reset()
                  : ((g = Tokens.UNICODE_RANGE),
                    e.indexOf("?") == -1 &&
                      d.peek() == "-" &&
                      (d.mark(),
                      (f = d.read()),
                      (f += this.readUnicodeRangePart(!1)),
                      f.length == 1 ? d.reset() : (e += f))));
              return this.createToken(g, e, b, c);
            },
            whitespaceToken: function (a, b, c) {
              var d = this._reader,
                e = a + this.readWhitespace();
              return this.createToken(Tokens.S, e, b, c);
            },
            readUnicodeRangePart: function (a) {
              var b = this._reader,
                c = "",
                d = b.peek();
              while (isHexDigit(d) && c.length < 6)
                b.read(), (c += d), (d = b.peek());
              if (a)
                while (d == "?" && c.length < 6)
                  b.read(), (c += d), (d = b.peek());
              return c;
            },
            readWhitespace: function () {
              var a = this._reader,
                b = "",
                c = a.peek();
              while (isWhitespace(c)) a.read(), (b += c), (c = a.peek());
              return b;
            },
            readNumber: function (a) {
              var b = this._reader,
                c = a,
                d = a == ".",
                e = b.peek();
              while (e) {
                if (isDigit(e)) c += b.read();
                else {
                  if (e != ".") break;
                  if (d) break;
                  (d = !0), (c += b.read());
                }
                e = b.peek();
              }
              return c;
            },
            readString: function () {
              var a = this._reader,
                b = a.read(),
                c = b,
                d = b,
                e = a.peek();
              while (e) {
                (e = a.read()), (c += e);
                if (e == b && d != "\\") break;
                if (isNewLine(a.peek()) && e != "\\") {
                  c = "";
                  break;
                }
                (d = e), (e = a.peek());
              }
              e == null && (c = "");
              return c;
            },
            readURI: function (a) {
              var b = this._reader,
                c = a,
                d = "",
                e = b.peek();
              b.mark();
              while (e && isWhitespace(e)) b.read(), (e = b.peek());
              e == "'" || e == '"'
                ? (d = this.readString())
                : (d = this.readURL()),
                (e = b.peek());
              while (e && isWhitespace(e)) b.read(), (e = b.peek());
              d == "" || e != ")" ? ((c = a), b.reset()) : (c += d + b.read());
              return c;
            },
            readURL: function () {
              var a = this._reader,
                b = "",
                c = a.peek();
              while (/^[!#$%&\\*-~]$/.test(c)) (b += a.read()), (c = a.peek());
              return b;
            },
            readName: function (a) {
              var b = this._reader,
                c = a || "",
                d = b.peek();
              for (;;)
                if (d == "\\") (c += this.readEscape(b.read())), (d = b.peek());
                else if (d && isNameChar(d)) (c += b.read()), (d = b.peek());
                else break;
              return c;
            },
            readEscape: function (a) {
              var b = this._reader,
                c = a || "",
                d = 0,
                e = b.peek();
              if (isHexDigit(e))
                do (c += b.read()), (e = b.peek());
                while (e && isHexDigit(e) && ++d < 6);
              (c.length == 3 && /\s/.test(e)) || c.length == 7 || c.length == 1
                ? b.read()
                : (e = "");
              return c + e;
            },
            readComment: function (a) {
              var b = this._reader,
                c = a || "",
                d = b.read();
              if (d == "*") {
                while (d) {
                  c += d;
                  if (d == "*" && b.peek() == "/") {
                    c += b.read();
                    break;
                  }
                  d = b.read();
                }
                return c;
              }
              return "";
            },
          });
          var Tokens = [
            { name: "CDO" },
            { name: "CDC" },
            { name: "S", whitespace: !0 },
            { name: "COMMENT", comment: !0, hide: !0, channel: "comment" },
            { name: "INCLUDES", text: "~=" },
            { name: "DASHMATCH", text: "|=" },
            { name: "PREFIXMATCH", text: "^=" },
            { name: "SUFFIXMATCH", text: "$=" },
            { name: "SUBSTRINGMATCH", text: "*=" },
            { name: "STRING" },
            { name: "IDENT" },
            { name: "HASH" },
            { name: "IMPORT_SYM", text: "@import" },
            { name: "PAGE_SYM", text: "@page" },
            { name: "MEDIA_SYM", text: "@media" },
            { name: "FONT_FACE_SYM", text: "@font-face" },
            { name: "CHARSET_SYM", text: "@charset" },
            { name: "NAMESPACE_SYM", text: "@namespace" },
            {
              name: "KEYFRAMES_SYM",
              text: ["@keyframes", "@-webkit-keyframes", "@-moz-keyframes"],
            },
            { name: "IMPORTANT_SYM" },
            { name: "LENGTH" },
            { name: "ANGLE" },
            { name: "TIME" },
            { name: "FREQ" },
            { name: "DIMENSION" },
            { name: "PERCENTAGE" },
            { name: "NUMBER" },
            { name: "URI" },
            { name: "FUNCTION" },
            { name: "UNICODE_RANGE" },
            { name: "INVALID" },
            { name: "PLUS", text: "+" },
            { name: "GREATER", text: ">" },
            { name: "COMMA", text: "," },
            { name: "TILDE", text: "~" },
            { name: "NOT" },
            { name: "TOPLEFTCORNER_SYM", text: "@top-left-corner" },
            { name: "TOPLEFT_SYM", text: "@top-left" },
            { name: "TOPCENTER_SYM", text: "@top-center" },
            { name: "TOPRIGHT_SYM", text: "@top-right" },
            { name: "TOPRIGHTCORNER_SYM", text: "@top-right-corner" },
            { name: "BOTTOMLEFTCORNER_SYM", text: "@bottom-left-corner" },
            { name: "BOTTOMLEFT_SYM", text: "@bottom-left" },
            { name: "BOTTOMCENTER_SYM", text: "@bottom-center" },
            { name: "BOTTOMRIGHT_SYM", text: "@bottom-right" },
            { name: "BOTTOMRIGHTCORNER_SYM", text: "@bottom-right-corner" },
            { name: "LEFTTOP_SYM", text: "@left-top" },
            { name: "LEFTMIDDLE_SYM", text: "@left-middle" },
            { name: "LEFTBOTTOM_SYM", text: "@left-bottom" },
            { name: "RIGHTTOP_SYM", text: "@right-top" },
            { name: "RIGHTMIDDLE_SYM", text: "@right-middle" },
            { name: "RIGHTBOTTOM_SYM", text: "@right-bottom" },
            { name: "RESOLUTION", state: "media" },
            { name: "IE_FUNCTION" },
            { name: "CHAR" },
            { name: "PIPE", text: "|" },
            { name: "SLASH", text: "/" },
            { name: "MINUS", text: "-" },
            { name: "STAR", text: "*" },
            { name: "LBRACE", text: "{" },
            { name: "RBRACE", text: "}" },
            { name: "LBRACKET", text: "[" },
            { name: "RBRACKET", text: "]" },
            { name: "EQUALS", text: "=" },
            { name: "COLON", text: ":" },
            { name: "SEMICOLON", text: ";" },
            { name: "LPAREN", text: "(" },
            { name: "RPAREN", text: ")" },
            { name: "DOT", text: "." },
          ];
          (function () {
            var a = [],
              b = {};
            (Tokens.UNKNOWN = -1), Tokens.unshift({ name: "EOF" });
            for (var c = 0, d = Tokens.length; c < d; c++) {
              a.push(Tokens[c].name), (Tokens[Tokens[c].name] = c);
              if (Tokens[c].text)
                if (Tokens[c].text instanceof Array)
                  for (var e = 0; e < Tokens[c].text.length; e++)
                    b[Tokens[c].text[e]] = c;
                else b[Tokens[c].text] = c;
            }
            (Tokens.name = function (b) {
              return a[b];
            }),
              (Tokens.type = function (a) {
                return b[a] || -1;
              });
          })(),
            (parserlib.css = {
              Colors: Colors,
              Combinator: Combinator,
              Parser: Parser,
              PropertyName: PropertyName,
              PropertyValue: PropertyValue,
              PropertyValuePart: PropertyValuePart,
              MediaFeature: MediaFeature,
              MediaQuery: MediaQuery,
              Selector: Selector,
              SelectorPart: SelectorPart,
              SelectorSubPart: SelectorSubPart,
              TokenStream: TokenStream,
              Tokens: Tokens,
            });
        })();
      var CSSLint = (function () {
        var a = [],
          b = [],
          c = new parserlib.util.EventTarget();
        (c.version = "@VERSION@"),
          (c.addRule = function (b) {
            a.push(b), (a[b.id] = b);
          }),
          (c.clearRules = function () {
            a = [];
          }),
          (c.addFormatter = function (a) {
            b[a.id] = a;
          }),
          (c.getFormatter = function (a) {
            return b[a];
          }),
          (c.format = function (a, b, c) {
            var d = this.getFormatter(c),
              e = null;
            d &&
              ((e = d.startFormat()),
              (e += d.formatResults(a, b)),
              (e += d.endFormat()));
            return e;
          }),
          (c.hasFormat = function (a) {
            return b.hasOwnProperty(a);
          }),
          (c.verify = function (b, c) {
            var d = 0,
              e = a.length,
              f,
              g,
              h = new parserlib.css.Parser({
                starHack: !0,
                ieFilters: !0,
                underscoreHack: !0,
                strict: !1,
              });
            (g = b.split(/\n\r?/g)), (f = new Reporter(g));
            if (!c) while (d < e) a[d++].init(h, f);
            else {
              c.errors = 1;
              for (d in c) c.hasOwnProperty(d) && a[d] && a[d].init(h, f);
            }
            try {
              h.parse(b);
            } catch (i) {
              f.error(
                "Fatal error, cannot continue: " + i.message,
                i.line,
                i.col
              );
            }
            return { messages: f.messages, stats: f.stats };
          });
        return c;
      })();
      (Reporter.prototype = {
        constructor: Reporter,
        error: function (a, b, c, d) {
          this.messages.push({
            type: "error",
            line: b,
            col: c,
            message: a,
            evidence: this.lines[b - 1],
            rule: d,
          });
        },
        warn: function (a, b, c, d) {
          this.messages.push({
            type: "warning",
            line: b,
            col: c,
            message: a,
            evidence: this.lines[b - 1],
            rule: d,
          });
        },
        info: function (a, b, c, d) {
          this.messages.push({
            type: "info",
            line: b,
            col: c,
            message: a,
            evidence: this.lines[b - 1],
            rule: d,
          });
        },
        rollupError: function (a, b) {
          this.messages.push({
            type: "error",
            rollup: !0,
            message: a,
            rule: b,
          });
        },
        rollupWarn: function (a, b) {
          this.messages.push({
            type: "warning",
            rollup: !0,
            message: a,
            rule: b,
          });
        },
        stat: function (a, b) {
          this.stats[a] = b;
        },
      }),
        CSSLint.addRule({
          id: "adjoining-classes",
          name: "Adjoining Classes",
          desc: "Don't use adjoining classes.",
          browsers: "IE6",
          init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
              var d = a.selectors,
                e,
                f,
                g,
                h,
                i,
                j,
                k;
              for (i = 0; i < d.length; i++) {
                e = d[i];
                for (j = 0; j < e.parts.length; j++) {
                  f = e.parts[j];
                  if (f instanceof parserlib.css.SelectorPart) {
                    h = 0;
                    for (k = 0; k < f.modifiers.length; k++)
                      (g = f.modifiers[k]),
                        g.type == "class" && h++,
                        h > 1 &&
                          b.warn(
                            "Don't use adjoining classes.",
                            f.line,
                            f.col,
                            c
                          );
                  }
                }
              }
            });
          },
        }),
        CSSLint.addRule({
          id: "box-model",
          name: "Box Model",
          desc: "Don't use width or height when using padding or border.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
              },
              e = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1,
              },
              f;
            a.addListener("startrule", function () {
              f = {};
            }),
              a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                if (e[b] || d[b])
                  !/^0\S*$/.test(a.value) &&
                    (b != "border" || a.value != "none") &&
                    (f[b] = {
                      line: a.property.line,
                      col: a.property.col,
                      value: a.value,
                    });
                else if (b == "width" || b == "height") f[b] = 1;
              }),
              a.addListener("endrule", function () {
                var a;
                if (f.height)
                  for (a in e)
                    e.hasOwnProperty(a) &&
                      f[a] &&
                      (a != "padding" ||
                        f[a].value.parts.length != 2 ||
                        f[a].value.parts[0].value != 0) &&
                      b.warn(
                        "Broken box model: using height with " + a + ".",
                        f[a].line,
                        f[a].col,
                        c
                      );
                if (f.width)
                  for (a in d)
                    d.hasOwnProperty(a) &&
                      f[a] &&
                      (a != "padding" ||
                        f[a].value.parts.length != 2 ||
                        f[a].value.parts[1].value != 0) &&
                      b.warn(
                        "Broken box model: using width with " + a + ".",
                        f[a].line,
                        f[a].col,
                        c
                      );
              });
          },
        }),
        CSSLint.addRule({
          id: "compatible-vendor-prefixes",
          name: "Compatible Vendor Prefixes",
          desc: "Include all compatible vendor prefixes to reach a wider range of users.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d,
              e,
              f,
              g,
              h,
              i,
              j,
              k = Array.prototype.push,
              l = [];
            d = {
              animation: "webkit moz",
              "animation-delay": "webkit moz",
              "animation-direction": "webkit moz",
              "animation-duration": "webkit moz",
              "animation-fill-mode": "webkit moz",
              "animation-iteration-count": "webkit moz",
              "animation-name": "webkit moz",
              "animation-play-state": "webkit moz",
              "animation-timing-function": "webkit moz",
              appearance: "webkit moz",
              "border-end": "webkit moz",
              "border-end-color": "webkit moz",
              "border-end-style": "webkit moz",
              "border-end-width": "webkit moz",
              "border-image": "webkit moz o",
              "border-radius": "webkit moz",
              "border-start": "webkit moz",
              "border-start-color": "webkit moz",
              "border-start-style": "webkit moz",
              "border-start-width": "webkit moz",
              "box-align": "webkit moz ms",
              "box-direction": "webkit moz ms",
              "box-flex": "webkit moz ms",
              "box-lines": "webkit ms",
              "box-ordinal-group": "webkit moz ms",
              "box-orient": "webkit moz ms",
              "box-pack": "webkit moz ms",
              "box-sizing": "webkit moz",
              "box-shadow": "webkit moz",
              "column-count": "webkit moz",
              "column-gap": "webkit moz",
              "column-rule": "webkit moz",
              "column-rule-color": "webkit moz",
              "column-rule-style": "webkit moz",
              "column-rule-width": "webkit moz",
              "column-width": "webkit moz",
              hyphens: "epub moz",
              "line-break": "webkit ms",
              "margin-end": "webkit moz",
              "margin-start": "webkit moz",
              "marquee-speed": "webkit wap",
              "marquee-style": "webkit wap",
              "padding-end": "webkit moz",
              "padding-start": "webkit moz",
              "tab-size": "moz o",
              "text-size-adjust": "webkit ms",
              transform: "webkit moz ms o",
              "transform-origin": "webkit moz ms o",
              transition: "webkit moz o",
              "transition-delay": "webkit moz o",
              "transition-duration": "webkit moz o",
              "transition-property": "webkit moz o",
              "transition-timing-function": "webkit moz o",
              "user-modify": "webkit moz",
              "user-select": "webkit moz",
              "word-break": "epub ms",
              "writing-mode": "epub ms",
            };
            for (f in d)
              if (d.hasOwnProperty(f)) {
                (g = []), (h = d[f].split(" "));
                for (i = 0, j = h.length; i < j; i++)
                  g.push("-" + h[i] + "-" + f);
                (d[f] = g), k.apply(l, g);
              }
            a.addListener("startrule", function () {
              e = [];
            }),
              a.addListener("property", function (a) {
                var b = a.property.text;
                l.indexOf(b) > -1 && e.push(b);
              }),
              a.addListener("endrule", function (a) {
                if (!!e.length) {
                  var f = {},
                    g,
                    h,
                    i,
                    j,
                    k,
                    l,
                    m,
                    n,
                    o,
                    p;
                  for (g = 0, h = e.length; g < h; g++) {
                    i = e[g];
                    for (j in d)
                      d.hasOwnProperty(j) &&
                        ((k = d[j]),
                        k.indexOf(i) > -1 &&
                          (f[j] === undefined &&
                            (f[j] = { full: k.slice(0), actual: [] }),
                          f[j].actual.indexOf(i) === -1 &&
                            f[j].actual.push(i)));
                  }
                  for (j in f)
                    if (f.hasOwnProperty(j)) {
                      (l = f[j]), (m = l.full), (n = l.actual);
                      if (m.length > n.length)
                        for (g = 0, h = m.length; g < h; g++)
                          (o = m[g]),
                            n.indexOf(o) === -1 &&
                              ((p =
                                n.length === 1
                                  ? n[0]
                                  : n.length == 2
                                  ? n.join(" and ")
                                  : n.join(", ")),
                              b.warn(
                                "The property " +
                                  o +
                                  " is compatible with " +
                                  p +
                                  " and should be included as well.",
                                a.selectors[0].line,
                                a.selectors[0].col,
                                c
                              ));
                    }
                }
              });
          },
        }),
        CSSLint.addRule({
          id: "display-property-grouping",
          name: "Display Property Grouping",
          desc: "Certain properties shouldn't be used with certain display property values.",
          browsers: "All",
          init: function (a, b) {
            function f(a, f, g) {
              e[a] &&
                (typeof d[a] != "string" || e[a].value.toLowerCase() != d[a]) &&
                b.warn(
                  g || a + " can't be used with display: " + f + ".",
                  e[a].line,
                  e[a].col,
                  c
                );
            }
            var c = this,
              d = {
                display: 1,
                float: "none",
                height: 1,
                width: 1,
                margin: 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-bottom": 1,
                "margin-top": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-bottom": 1,
                "padding-top": 1,
                "vertical-align": 1,
              },
              e;
            a.addListener("startrule", function () {
              e = {};
            }),
              a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                d[b] &&
                  (e[b] = {
                    value: a.value.text,
                    line: a.property.line,
                    col: a.property.col,
                  });
              }),
              a.addListener("endrule", function () {
                var a = e.display ? e.display.value : null;
                if (a)
                  switch (a) {
                    case "inline":
                      f("height", a),
                        f("width", a),
                        f("margin", a),
                        f("margin-top", a),
                        f("margin-bottom", a),
                        f(
                          "float",
                          a,
                          "display:inline has no effect on floated elements (but may be used to fix the IE6 double-margin bug)."
                        );
                      break;
                    case "block":
                      f("vertical-align", a);
                      break;
                    case "inline-block":
                      f("float", a);
                      break;
                    default:
                      a.indexOf("table-") == 0 &&
                        (f("margin", a),
                        f("margin-left", a),
                        f("margin-right", a),
                        f("margin-top", a),
                        f("margin-bottom", a),
                        f("float", a));
                  }
              });
          },
        }),
        CSSLint.addRule({
          id: "duplicate-properties",
          name: "Duplicate Properties",
          desc: "Duplicate properties must appear one after the other.",
          browsers: "All",
          init: function (a, b) {
            function f(a) {
              d = {};
            }
            var c = this,
              d,
              e;
            a.addListener("startrule", f),
              a.addListener("startfontface", f),
              a.addListener("startpage", f),
              a.addListener("property", function (a) {
                var f = a.property,
                  g = f.text.toLowerCase();
                d[g] &&
                  (e != g || d[g] == a.value.text) &&
                  b.warn(
                    "Duplicate property '" + a.property + "' found.",
                    a.line,
                    a.col,
                    c
                  ),
                  (d[g] = a.value.text),
                  (e = g);
              });
          },
        }),
        CSSLint.addRule({
          id: "empty-rules",
          name: "Empty Rules",
          desc: "Rules without any properties specified should be removed.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("startrule", function () {
              d = 0;
            }),
              a.addListener("property", function () {
                d++;
              }),
              a.addListener("endrule", function (a) {
                var e = a.selectors;
                d == 0 && b.warn("Rule is empty.", e[0].line, e[0].col, c);
              });
          },
        }),
        CSSLint.addRule({
          id: "errors",
          name: "Parsing Errors",
          desc: "This rule looks for recoverable syntax errors.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("error", function (a) {
              b.error(a.message, a.line, a.col, c);
            });
          },
        }),
        CSSLint.addRule({
          id: "floats",
          name: "Floats",
          desc: "This rule tests if the float property is used too many times",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("property", function (a) {
              a.property.text.toLowerCase() == "float" &&
                a.value.text.toLowerCase() != "none" &&
                d++;
            }),
              a.addListener("endstylesheet", function () {
                b.stat("floats", d),
                  d >= 10 &&
                    b.rollupWarn(
                      "Too many floats (" +
                        d +
                        "), you're probably using them for layout. Consider using a grid system instead.",
                      c
                    );
              });
          },
        }),
        CSSLint.addRule({
          id: "font-faces",
          name: "Font Faces",
          desc: "Too many different web fonts in the same stylesheet.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("startfontface", function () {
              d++;
            }),
              a.addListener("endstylesheet", function () {
                d > 5 &&
                  b.rollupWarn(
                    "Too many @font-face declarations (" + d + ").",
                    c
                  );
              });
          },
        }),
        CSSLint.addRule({
          id: "font-sizes",
          name: "Font Sizes",
          desc: "Checks the number of font-size declarations.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("property", function (a) {
              a.property == "font-size" && d++;
            }),
              a.addListener("endstylesheet", function () {
                b.stat("font-sizes", d),
                  d >= 10 &&
                    b.rollupWarn(
                      "Too many font-size declarations (" +
                        d +
                        "), abstraction needed.",
                      c
                    );
              });
          },
        }),
        CSSLint.addRule({
          id: "gradients",
          name: "Gradients",
          desc: "When using a vendor-prefixed gradient, make sure to use them all.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d;
            a.addListener("startrule", function () {
              d = { moz: 0, webkit: 0, ms: 0, o: 0 };
            }),
              a.addListener("property", function (a) {
                /\-(moz|ms|o|webkit)(?:\-(?:linear|radial))\-gradient/.test(
                  a.value
                ) && (d[RegExp.$1] = 1);
              }),
              a.addListener("endrule", function (a) {
                var e = [];
                d.moz || e.push("Firefox 3.6+"),
                  d.webkit || e.push("Webkit (Safari, Chrome)"),
                  d.ms || e.push("Internet Explorer 10+"),
                  d.o || e.push("Opera 11.1+"),
                  e.length &&
                    e.length < 4 &&
                    b.warn(
                      "Missing vendor-prefixed CSS gradients for " +
                        e.join(", ") +
                        ".",
                      a.selectors[0].line,
                      a.selectors[0].col,
                      c
                    );
              });
          },
        }),
        CSSLint.addRule({
          id: "ids",
          name: "IDs",
          desc: "Selectors should not contain IDs.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
              var d = a.selectors,
                e,
                f,
                g,
                h,
                i,
                j,
                k;
              for (i = 0; i < d.length; i++) {
                (e = d[i]), (h = 0);
                for (j = 0; j < e.parts.length; j++) {
                  f = e.parts[j];
                  if (f instanceof parserlib.css.SelectorPart)
                    for (k = 0; k < f.modifiers.length; k++)
                      (g = f.modifiers[k]), g.type == "id" && h++;
                }
                h == 1
                  ? b.warn("Don't use IDs in selectors.", e.line, e.col, c)
                  : h > 1 &&
                    b.warn(
                      h + " IDs in the selector, really?",
                      e.line,
                      e.col,
                      c
                    );
              }
            });
          },
        }),
        CSSLint.addRule({
          id: "import",
          name: "@import",
          desc: "Don't use @import, use <link> instead.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("import", function (a) {
              b.warn(
                "@import prevents parallel downloads, use <link> instead.",
                a.line,
                a.col,
                c
              );
            });
          },
        }),
        CSSLint.addRule({
          id: "important",
          name: "Important",
          desc: "Be careful when using !important declaration",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("property", function (a) {
              a.important === !0 &&
                (d++, b.warn("Use of !important", a.line, a.col, c));
            }),
              a.addListener("endstylesheet", function () {
                b.stat("important", d),
                  d >= 10 &&
                    b.rollupWarn(
                      "Too many !important declarations (" +
                        d +
                        "), try to use less than 10 to avoid specifity issues.",
                      c
                    );
              });
          },
        }),
        CSSLint.addRule({
          id: "known-properties",
          name: "Known Properties",
          desc: "Properties should be known (listed in CSS specification) or be a vendor-prefixed property.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = {
                "alignment-adjust": 1,
                "alignment-baseline": 1,
                animation: 1,
                "animation-delay": 1,
                "animation-direction": 1,
                "animation-duration": 1,
                "animation-iteration-count": 1,
                "animation-name": 1,
                "animation-play-state": 1,
                "animation-timing-function": 1,
                appearance: 1,
                azimuth: 1,
                "backface-visibility": 1,
                background: 1,
                "background-attachment": 1,
                "background-break": 1,
                "background-clip": 1,
                "background-color": 1,
                "background-image": 1,
                "background-origin": 1,
                "background-position": 1,
                "background-repeat": 1,
                "background-size": 1,
                "baseline-shift": 1,
                binding: 1,
                bleed: 1,
                "bookmark-label": 1,
                "bookmark-level": 1,
                "bookmark-state": 1,
                "bookmark-target": 1,
                border: 1,
                "border-bottom": 1,
                "border-bottom-color": 1,
                "border-bottom-left-radius": 1,
                "border-bottom-right-radius": 1,
                "border-bottom-style": 1,
                "border-bottom-width": 1,
                "border-collapse": 1,
                "border-color": 1,
                "border-image": 1,
                "border-image-outset": 1,
                "border-image-repeat": 1,
                "border-image-slice": 1,
                "border-image-source": 1,
                "border-image-width": 1,
                "border-left": 1,
                "border-left-color": 1,
                "border-left-style": 1,
                "border-left-width": 1,
                "border-radius": 1,
                "border-right": 1,
                "border-right-color": 1,
                "border-right-style": 1,
                "border-right-width": 1,
                "border-spacing": 1,
                "border-style": 1,
                "border-top": 1,
                "border-top-color": 1,
                "border-top-left-radius": 1,
                "border-top-right-radius": 1,
                "border-top-style": 1,
                "border-top-width": 1,
                "border-width": 1,
                bottom: 1,
                "box-align": 1,
                "box-decoration-break": 1,
                "box-direction": 1,
                "box-flex": 1,
                "box-flex-group": 1,
                "box-lines": 1,
                "box-ordinal-group": 1,
                "box-orient": 1,
                "box-pack": 1,
                "box-shadow": 1,
                "box-sizing": 1,
                "break-after": 1,
                "break-before": 1,
                "break-inside": 1,
                "caption-side": 1,
                clear: 1,
                clip: 1,
                color: 1,
                "color-profile": 1,
                "column-count": 1,
                "column-fill": 1,
                "column-gap": 1,
                "column-rule": 1,
                "column-rule-color": 1,
                "column-rule-style": 1,
                "column-rule-width": 1,
                "column-span": 1,
                "column-width": 1,
                columns: 1,
                content: 1,
                "counter-increment": 1,
                "counter-reset": 1,
                crop: 1,
                cue: 1,
                "cue-after": 1,
                "cue-before": 1,
                cursor: 1,
                direction: 1,
                display: 1,
                "dominant-baseline": 1,
                "drop-initial-after-adjust": 1,
                "drop-initial-after-align": 1,
                "drop-initial-before-adjust": 1,
                "drop-initial-before-align": 1,
                "drop-initial-size": 1,
                "drop-initial-value": 1,
                elevation: 1,
                "empty-cells": 1,
                fit: 1,
                "fit-position": 1,
                float: 1,
                "float-offset": 1,
                font: 1,
                "font-family": 1,
                "font-size": 1,
                "font-size-adjust": 1,
                "font-stretch": 1,
                "font-style": 1,
                "font-variant": 1,
                "font-weight": 1,
                "grid-columns": 1,
                "grid-rows": 1,
                "hanging-punctuation": 1,
                height: 1,
                "hyphenate-after": 1,
                "hyphenate-before": 1,
                "hyphenate-character": 1,
                "hyphenate-lines": 1,
                "hyphenate-resource": 1,
                hyphens: 1,
                icon: 1,
                "image-orientation": 1,
                "image-rendering": 1,
                "image-resolution": 1,
                "inline-box-align": 1,
                left: 1,
                "letter-spacing": 1,
                "line-height": 1,
                "line-stacking": 1,
                "line-stacking-ruby": 1,
                "line-stacking-shift": 1,
                "line-stacking-strategy": 1,
                "list-style": 1,
                "list-style-image": 1,
                "list-style-position": 1,
                "list-style-type": 1,
                margin: 1,
                "margin-bottom": 1,
                "margin-left": 1,
                "margin-right": 1,
                "margin-top": 1,
                mark: 1,
                "mark-after": 1,
                "mark-before": 1,
                marks: 1,
                "marquee-direction": 1,
                "marquee-play-count": 1,
                "marquee-speed": 1,
                "marquee-style": 1,
                "max-height": 1,
                "max-width": 1,
                "min-height": 1,
                "min-width": 1,
                "move-to": 1,
                "nav-down": 1,
                "nav-index": 1,
                "nav-left": 1,
                "nav-right": 1,
                "nav-up": 1,
                opacity: 1,
                orphans: 1,
                outline: 1,
                "outline-color": 1,
                "outline-offset": 1,
                "outline-style": 1,
                "outline-width": 1,
                overflow: 1,
                "overflow-style": 1,
                "overflow-x": 1,
                "overflow-y": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-left": 1,
                "padding-right": 1,
                "padding-top": 1,
                page: 1,
                "page-break-after": 1,
                "page-break-before": 1,
                "page-break-inside": 1,
                "page-policy": 1,
                pause: 1,
                "pause-after": 1,
                "pause-before": 1,
                perspective: 1,
                "perspective-origin": 1,
                phonemes: 1,
                pitch: 1,
                "pitch-range": 1,
                "play-during": 1,
                position: 1,
                "presentation-level": 1,
                "punctuation-trim": 1,
                quotes: 1,
                "rendering-intent": 1,
                resize: 1,
                rest: 1,
                "rest-after": 1,
                "rest-before": 1,
                richness: 1,
                right: 1,
                rotation: 1,
                "rotation-point": 1,
                "ruby-align": 1,
                "ruby-overhang": 1,
                "ruby-position": 1,
                "ruby-span": 1,
                size: 1,
                speak: 1,
                "speak-header": 1,
                "speak-numeral": 1,
                "speak-punctuation": 1,
                "speech-rate": 1,
                stress: 1,
                "string-set": 1,
                "table-layout": 1,
                target: 1,
                "target-name": 1,
                "target-new": 1,
                "target-position": 1,
                "text-align": 1,
                "text-align-last": 1,
                "text-decoration": 1,
                "text-emphasis": 1,
                "text-height": 1,
                "text-indent": 1,
                "text-justify": 1,
                "text-outline": 1,
                "text-shadow": 1,
                "text-transform": 1,
                "text-wrap": 1,
                top: 1,
                transform: 1,
                "transform-origin": 1,
                "transform-style": 1,
                transition: 1,
                "transition-delay": 1,
                "transition-duration": 1,
                "transition-property": 1,
                "transition-timing-function": 1,
                "unicode-bidi": 1,
                "vertical-align": 1,
                visibility: 1,
                "voice-balance": 1,
                "voice-duration": 1,
                "voice-family": 1,
                "voice-pitch": 1,
                "voice-pitch-range": 1,
                "voice-rate": 1,
                "voice-stress": 1,
                "voice-volume": 1,
                volume: 1,
                "white-space": 1,
                "white-space-collapse": 1,
                widows: 1,
                width: 1,
                "word-break": 1,
                "word-spacing": 1,
                "word-wrap": 1,
                "z-index": 1,
                filter: 1,
                zoom: 1,
              };
            a.addListener("property", function (a) {
              var e = a.property.text.toLowerCase();
              !d[e] &&
                e.charAt(0) != "-" &&
                b.error(
                  "Unknown property '" + a.property + "'.",
                  a.line,
                  a.col,
                  c
                );
            });
          },
        }),
        CSSLint.addRule({
          id: "overqualified-elements",
          name: "Overqualified Elements",
          desc: "Don't use classes or IDs with elements (a.foo or a#foo).",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = {};
            a.addListener("startrule", function (a) {
              var e = a.selectors,
                f,
                g,
                h,
                i,
                j,
                k;
              for (i = 0; i < e.length; i++) {
                f = e[i];
                for (j = 0; j < f.parts.length; j++) {
                  g = f.parts[j];
                  if (g instanceof parserlib.css.SelectorPart)
                    for (k = 0; k < g.modifiers.length; k++)
                      (h = g.modifiers[k]),
                        g.elementName && h.type == "id"
                          ? b.warn(
                              "Element (" +
                                g +
                                ") is overqualified, just use " +
                                h +
                                " without element name.",
                              g.line,
                              g.col,
                              c
                            )
                          : h.type == "class" &&
                            (d[h] || (d[h] = []),
                            d[h].push({ modifier: h, part: g }));
                }
              }
            }),
              a.addListener("endstylesheet", function () {
                var a;
                for (a in d)
                  d.hasOwnProperty(a) &&
                    d[a].length == 1 &&
                    d[a][0].part.elementName &&
                    b.warn(
                      "Element (" +
                        d[a][0].part +
                        ") is overqualified, just use " +
                        d[a][0].modifier +
                        " without element name.",
                      d[a][0].part.line,
                      d[a][0].part.col,
                      c
                    );
              });
          },
        }),
        CSSLint.addRule({
          id: "qualified-headings",
          name: "Qualified Headings",
          desc: "Headings should not be qualified (namespaced).",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
              var d = a.selectors,
                e,
                f,
                g,
                h;
              for (g = 0; g < d.length; g++) {
                e = d[g];
                for (h = 0; h < e.parts.length; h++)
                  (f = e.parts[h]),
                    f instanceof parserlib.css.SelectorPart &&
                      f.elementName &&
                      /h[1-6]/.test(f.elementName.toString()) &&
                      h > 0 &&
                      b.warn(
                        "Heading (" +
                          f.elementName +
                          ") should not be qualified.",
                        f.line,
                        f.col,
                        c
                      );
              }
            });
          },
        }),
        CSSLint.addRule({
          id: "regex-selectors",
          name: "Regex Selectors",
          desc: "Selectors that look like regular expressions are slow and should be avoided.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
              var d = a.selectors,
                e,
                f,
                g,
                h,
                i,
                j;
              for (h = 0; h < d.length; h++) {
                e = d[h];
                for (i = 0; i < e.parts.length; i++) {
                  f = e.parts[i];
                  if (f instanceof parserlib.css.SelectorPart)
                    for (j = 0; j < f.modifiers.length; j++)
                      (g = f.modifiers[j]),
                        g.type == "attribute" &&
                          /([\~\|\^\$\*]=)/.test(g) &&
                          b.warn(
                            "Attribute selectors with " +
                              RegExp.$1 +
                              " are slow!",
                            g.line,
                            g.col,
                            c
                          );
                }
              }
            });
          },
        }),
        CSSLint.addRule({
          id: "rules-count",
          name: "Rules Count",
          desc: "Track how many rules there are.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = 0;
            a.addListener("startrule", function () {
              d++;
            }),
              a.addListener("endstylesheet", function () {
                b.stat("rule-count", d);
              });
          },
        }),
        CSSLint.addRule({
          id: "text-indent",
          name: "Text Indent",
          desc: "Checks for text indent less than -99px",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("property", function (a) {
              var d = a.property,
                e = a.value.parts[0].value;
              d == "text-indent" &&
                e < -99 &&
                b.warn(
                  "Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set text-direction for that item to ltr.",
                  d.line,
                  d.col,
                  c
                );
            });
          },
        }),
        CSSLint.addRule({
          id: "unique-headings",
          name: "Unique Headings",
          desc: "Headings should be defined only once.",
          browsers: "All",
          init: function (a, b) {
            var c = this,
              d = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
            a.addListener("startrule", function (a) {
              var e = a.selectors,
                f,
                g,
                h;
              for (h = 0; h < e.length; h++)
                (f = e[h]),
                  (g = f.parts[f.parts.length - 1]),
                  g.elementName &&
                    /(h[1-6])/.test(g.elementName.toString()) &&
                    (d[RegExp.$1]++,
                    d[RegExp.$1] > 1 &&
                      b.warn(
                        "Heading (" +
                          g.elementName +
                          ") has already been defined.",
                        g.line,
                        g.col,
                        c
                      ));
            });
          },
        }),
        CSSLint.addRule({
          id: "universal-selector",
          name: "Universal Selector",
          desc: "The universal selector (*) is known to be slow.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("startrule", function (a) {
              var d = a.selectors,
                e,
                f,
                g,
                h,
                i,
                j;
              for (h = 0; h < d.length; h++)
                (e = d[h]),
                  (f = e.parts[e.parts.length - 1]),
                  f.elementName == "*" && b.warn(c.desc, f.line, f.col, c);
            });
          },
        }),
        CSSLint.addRule({
          id: "vendor-prefix",
          name: "Vendor Prefix",
          desc: "When using a vendor-prefixed property, make sure to include the standard one.",
          browsers: "All",
          init: function (a, b) {
            function h(a) {
              var e,
                g,
                h,
                i,
                j,
                k,
                l = [];
              for (e in d) f[e] && l.push({ actual: e, needed: f[e] });
              for (g = 0, h = l.length; g < h; g++)
                (j = l[g].needed),
                  (k = l[g].actual),
                  d[j]
                    ? d[j][0].pos < d[k][0].pos &&
                      b.warn(
                        "Standard property '" +
                          j +
                          "' should come after vendor-prefixed property '" +
                          k +
                          "'.",
                        a.line,
                        a.col,
                        c
                      )
                    : b.warn(
                        "Missing standard property '" +
                          j +
                          "' to go along with '" +
                          k +
                          "'.",
                        a.line,
                        a.col,
                        c
                      );
            }
            function g() {
              (d = {}), (e = 1);
            }
            var c = this,
              d,
              e,
              f = {
                "-moz-border-radius": "border-radius",
                "-webkit-border-radius": "border-radius",
                "-webkit-border-top-left-radius": "border-top-left-radius",
                "-webkit-border-top-right-radius": "border-top-right-radius",
                "-webkit-border-bottom-left-radius":
                  "border-bottom-left-radius",
                "-webkit-border-bottom-right-radius":
                  "border-bottom-right-radius",
                "-moz-border-radius-topleft": "border-top-left-radius",
                "-moz-border-radius-topright": "border-top-right-radius",
                "-moz-border-radius-bottomleft": "border-bottom-left-radius",
                "-moz-border-radius-bottomright": "border-bottom-right-radius",
                "-moz-box-shadow": "box-shadow",
                "-webkit-box-shadow": "box-shadow",
                "-moz-transform": "transform",
                "-webkit-transform": "transform",
                "-o-transform": "transform",
                "-ms-transform": "transform",
                "-moz-box-sizing": "box-sizing",
                "-webkit-box-sizing": "box-sizing",
                "-moz-user-select": "user-select",
                "-khtml-user-select": "user-select",
                "-webkit-user-select": "user-select",
              };
            a.addListener("startrule", g),
              a.addListener("startfontface", g),
              a.addListener("property", function (a) {
                var b = a.property.text.toLowerCase();
                d[b] || (d[b] = []),
                  d[b].push({ name: a.property, value: a.value, pos: e++ });
              }),
              a.addListener("endrule", h),
              a.addListener("endfontface", h);
          },
        }),
        CSSLint.addRule({
          id: "zero-units",
          name: "Zero Units",
          desc: "You don't need to specify units when a value is 0.",
          browsers: "All",
          init: function (a, b) {
            var c = this;
            a.addListener("property", function (a) {
              var d = a.value.parts,
                e = 0,
                f = d.length;
              while (e < f)
                (d[e].units || d[e].type == "percentage") &&
                  d[e].value === 0 &&
                  b.warn(
                    "Values of 0 shouldn't have units specified.",
                    d[e].line,
                    d[e].col,
                    c
                  ),
                  e++;
            });
          },
        }),
        (exports.CSSLint = CSSLint);
    }
  );
