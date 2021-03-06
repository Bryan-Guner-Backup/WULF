function initBaseUrls(a) {
  require.tlns = a;
}
function initSender() {
  var a = require(null, "ace/lib/event_emitter").EventEmitter,
    b = require(null, "ace/lib/oop"),
    c = function () {};
  return (
    function () {
      b.implement(this, a),
        (this.callback = function (a, b) {
          postMessage({ type: "call", id: b, data: a });
        }),
        (this.emit = function (a, b) {
          postMessage({ type: "event", name: a, data: b });
        });
    }.call(c.prototype),
    new c()
  );
}
("no use strict");
var console = {
    log: function (a) {
      postMessage({ type: "log", data: arguments.join(" ") });
    },
  },
  window = { console: console },
  normalizeModule = function (a, b) {
    if (b.indexOf("!") !== -1) {
      var c = b.split("!");
      return normalizeModule(a, c[0]) + "!" + normalizeModule(a, c[1]);
    }
    if (b.charAt(0) == ".") {
      var d = a.split("/").slice(0, -1).join("/"),
        b = d + "/" + b;
      while (b.indexOf(".") !== -1 && e != b)
        var e = b,
          b = b.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
    }
    return b;
  },
  require = function (a, b) {
    if (!b.charAt)
      throw new Error(
        "worker.js require() accepts only (parentId, id) as arguments"
      );
    var b = normalizeModule(a, b),
      c = require.modules[b];
    if (c)
      return (
        c.initialized ||
          ((c.initialized = !0), (c.exports = c.factory().exports)),
        c.exports
      );
    var d = b.split("/");
    d[0] = require.tlns[d[0]] || d[0];
    var e = d.join("/") + ".js";
    return (require.id = b), importScripts(e), require(a, b);
  };
(require.modules = {}), (require.tlns = {});
var define = function (a, b, c) {
    arguments.length == 2
      ? ((c = b), typeof a != "string" && ((b = a), (a = require.id)))
      : arguments.length == 1 && ((c = a), (a = require.id));
    if (a.indexOf("text!") === 0) return;
    var d = function (b, c) {
      return require(a, b, c);
    };
    require.modules[a] = {
      factory: function () {
        var a = { exports: {} },
          b = c(d, a.exports, a);
        return b && (a.exports = b), a;
      },
    };
  },
  main,
  sender;
(onmessage = function (a) {
  var b = a.data;
  if (b.command) main[b.command].apply(main, b.args);
  else if (b.init) {
    initBaseUrls(b.tlns),
      require(null, "ace/lib/fixoldbrowsers"),
      (sender = initSender());
    var c = require(null, b.module)[b.classname];
    main = new c(sender);
  } else b.event && sender && sender._emit(b.event, b.data);
}),
  define(
    "ace/lib/fixoldbrowsers",
    ["require", "exports", "module", "ace/lib/regexp", "ace/lib/es5-shim"],
    function (a, b, c) {
      a("./regexp"), a("./es5-shim");
    }
  ),
  define(
    "ace/lib/regexp",
    ["require", "exports", "module"],
    function (a, b, c) {
      function g(a) {
        return (
          (a.global ? "g" : "") +
          (a.ignoreCase ? "i" : "") +
          (a.multiline ? "m" : "") +
          (a.extended ? "x" : "") +
          (a.sticky ? "y" : "")
        );
      }
      function h(a, b, c) {
        if (Array.prototype.indexOf) return a.indexOf(b, c);
        for (var d = c || 0; d < a.length; d++) if (a[d] === b) return d;
        return -1;
      }
      var d = {
          exec: RegExp.prototype.exec,
          test: RegExp.prototype.test,
          match: String.prototype.match,
          replace: String.prototype.replace,
          split: String.prototype.split,
        },
        e = d.exec.call(/()??/, "")[1] === undefined,
        f = (function () {
          var a = /^/g;
          return d.test.call(a, ""), !a.lastIndex;
        })();
      if (f && e) return;
      (RegExp.prototype.exec = function (a) {
        var b = d.exec.apply(this, arguments),
          c,
          i;
        if (typeof a == "string" && b) {
          !e &&
            b.length > 1 &&
            h(b, "") > -1 &&
            ((i = RegExp(this.source, d.replace.call(g(this), "g", ""))),
            d.replace.call(a.slice(b.index), i, function () {
              for (var a = 1; a < arguments.length - 2; a++)
                arguments[a] === undefined && (b[a] = undefined);
            }));
          if (this._xregexp && this._xregexp.captureNames)
            for (var j = 1; j < b.length; j++)
              (c = this._xregexp.captureNames[j - 1]), c && (b[c] = b[j]);
          !f &&
            this.global &&
            !b[0].length &&
            this.lastIndex > b.index &&
            this.lastIndex--;
        }
        return b;
      }),
        f ||
          (RegExp.prototype.test = function (a) {
            var b = d.exec.call(this, a);
            return (
              b &&
                this.global &&
                !b[0].length &&
                this.lastIndex > b.index &&
                this.lastIndex--,
              !!b
            );
          });
    }
  ),
  define(
    "ace/lib/es5-shim",
    ["require", "exports", "module"],
    function (a, b, c) {
      function p(a) {
        try {
          return Object.defineProperty(a, "sentinel", {}), "sentinel" in a;
        } catch (b) {}
      }
      Function.prototype.bind ||
        (Function.prototype.bind = function (b) {
          var c = this;
          if (typeof c != "function") throw new TypeError();
          var d = g.call(arguments, 1),
            e = function () {
              if (this instanceof e) {
                var a = function () {};
                a.prototype = c.prototype;
                var f = new a(),
                  h = c.apply(f, d.concat(g.call(arguments)));
                return h !== null && Object(h) === h ? h : f;
              }
              return c.apply(b, d.concat(g.call(arguments)));
            };
          return e;
        });
      var d = Function.prototype.call,
        e = Array.prototype,
        f = Object.prototype,
        g = e.slice,
        h = d.bind(f.toString),
        i = d.bind(f.hasOwnProperty),
        j,
        k,
        l,
        m,
        n;
      if ((n = i(f, "__defineGetter__")))
        (j = d.bind(f.__defineGetter__)),
          (k = d.bind(f.__defineSetter__)),
          (l = d.bind(f.__lookupGetter__)),
          (m = d.bind(f.__lookupSetter__));
      Array.isArray ||
        (Array.isArray = function (b) {
          return h(b) == "[object Array]";
        }),
        Array.prototype.forEach ||
          (Array.prototype.forEach = function (b) {
            var c = G(this),
              d = arguments[1],
              e = 0,
              f = c.length >>> 0;
            if (h(b) != "[object Function]") throw new TypeError();
            while (e < f) e in c && b.call(d, c[e], e, c), e++;
          }),
        Array.prototype.map ||
          (Array.prototype.map = function (b) {
            var c = G(this),
              d = c.length >>> 0,
              e = Array(d),
              f = arguments[1];
            if (h(b) != "[object Function]") throw new TypeError();
            for (var g = 0; g < d; g++)
              g in c && (e[g] = b.call(f, c[g], g, c));
            return e;
          }),
        Array.prototype.filter ||
          (Array.prototype.filter = function (b) {
            var c = G(this),
              d = c.length >>> 0,
              e = [],
              f = arguments[1];
            if (h(b) != "[object Function]") throw new TypeError();
            for (var g = 0; g < d; g++)
              g in c && b.call(f, c[g], g, c) && e.push(c[g]);
            return e;
          }),
        Array.prototype.every ||
          (Array.prototype.every = function (b) {
            var c = G(this),
              d = c.length >>> 0,
              e = arguments[1];
            if (h(b) != "[object Function]") throw new TypeError();
            for (var f = 0; f < d; f++)
              if (f in c && !b.call(e, c[f], f, c)) return !1;
            return !0;
          }),
        Array.prototype.some ||
          (Array.prototype.some = function (b) {
            var c = G(this),
              d = c.length >>> 0,
              e = arguments[1];
            if (h(b) != "[object Function]") throw new TypeError();
            for (var f = 0; f < d; f++)
              if (f in c && b.call(e, c[f], f, c)) return !0;
            return !1;
          }),
        Array.prototype.reduce ||
          (Array.prototype.reduce = function (b) {
            var c = G(this),
              d = c.length >>> 0;
            if (h(b) != "[object Function]") throw new TypeError();
            if (!d && arguments.length == 1) throw new TypeError();
            var e = 0,
              f;
            if (arguments.length >= 2) f = arguments[1];
            else
              do {
                if (e in c) {
                  f = c[e++];
                  break;
                }
                if (++e >= d) throw new TypeError();
              } while (!0);
            for (; e < d; e++) e in c && (f = b.call(void 0, f, c[e], e, c));
            return f;
          }),
        Array.prototype.reduceRight ||
          (Array.prototype.reduceRight = function (b) {
            var c = G(this),
              d = c.length >>> 0;
            if (h(b) != "[object Function]") throw new TypeError();
            if (!d && arguments.length == 1) throw new TypeError();
            var e,
              f = d - 1;
            if (arguments.length >= 2) e = arguments[1];
            else
              do {
                if (f in c) {
                  e = c[f--];
                  break;
                }
                if (--f < 0) throw new TypeError();
              } while (!0);
            do f in this && (e = b.call(void 0, e, c[f], f, c));
            while (f--);
            return e;
          }),
        Array.prototype.indexOf ||
          (Array.prototype.indexOf = function (b) {
            var c = G(this),
              d = c.length >>> 0;
            if (!d) return -1;
            var e = 0;
            arguments.length > 1 && (e = E(arguments[1])),
              (e = e >= 0 ? e : Math.max(0, d + e));
            for (; e < d; e++) if (e in c && c[e] === b) return e;
            return -1;
          }),
        Array.prototype.lastIndexOf ||
          (Array.prototype.lastIndexOf = function (b) {
            var c = G(this),
              d = c.length >>> 0;
            if (!d) return -1;
            var e = d - 1;
            arguments.length > 1 && (e = Math.min(e, E(arguments[1]))),
              (e = e >= 0 ? e : d - Math.abs(e));
            for (; e >= 0; e--) if (e in c && b === c[e]) return e;
            return -1;
          }),
        Object.getPrototypeOf ||
          (Object.getPrototypeOf = function (b) {
            return b.__proto__ || (b.constructor ? b.constructor.prototype : f);
          });
      if (!Object.getOwnPropertyDescriptor) {
        var o = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (b, c) {
          if ((typeof b != "object" && typeof b != "function") || b === null)
            throw new TypeError(o + b);
          if (!i(b, c)) return;
          var d, e, g;
          d = { enumerable: !0, configurable: !0 };
          if (n) {
            var h = b.__proto__;
            b.__proto__ = f;
            var e = l(b, c),
              g = m(b, c);
            b.__proto__ = h;
            if (e || g) return e && (d.get = e), g && (d.set = g), d;
          }
          return (d.value = b[c]), d;
        };
      }
      Object.getOwnPropertyNames ||
        (Object.getOwnPropertyNames = function (b) {
          return Object.keys(b);
        }),
        Object.create ||
          (Object.create = function (b, c) {
            var d;
            if (b === null) d = { __proto__: null };
            else {
              if (typeof b != "object")
                throw new TypeError(
                  "typeof prototype[" + typeof b + "] != 'object'"
                );
              var e = function () {};
              (e.prototype = b), (d = new e()), (d.__proto__ = b);
            }
            return c !== void 0 && Object.defineProperties(d, c), d;
          });
      if (Object.defineProperty) {
        var q = p({}),
          r =
            typeof document == "undefined" || p(document.createElement("div"));
        if (!q || !r) var s = Object.defineProperty;
      }
      if (!Object.defineProperty || s) {
        var t = "Property description must be an object: ",
          u = "Object.defineProperty called on non-object: ",
          v = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (b, c, d) {
          if ((typeof b != "object" && typeof b != "function") || b === null)
            throw new TypeError(u + b);
          if ((typeof d != "object" && typeof d != "function") || d === null)
            throw new TypeError(t + d);
          if (s)
            try {
              return s.call(Object, b, c, d);
            } catch (e) {}
          if (i(d, "value"))
            if (n && (l(b, c) || m(b, c))) {
              var g = b.__proto__;
              (b.__proto__ = f),
                delete b[c],
                (b[c] = d.value),
                (b.__proto__ = g);
            } else b[c] = d.value;
          else {
            if (!n) throw new TypeError(v);
            i(d, "get") && j(b, c, d.get), i(d, "set") && k(b, c, d.set);
          }
          return b;
        };
      }
      Object.defineProperties ||
        (Object.defineProperties = function (b, c) {
          for (var d in c) i(c, d) && Object.defineProperty(b, d, c[d]);
          return b;
        }),
        Object.seal ||
          (Object.seal = function (b) {
            return b;
          }),
        Object.freeze ||
          (Object.freeze = function (b) {
            return b;
          });
      try {
        Object.freeze(function () {});
      } catch (w) {
        Object.freeze = (function (b) {
          return function (c) {
            return typeof c == "function" ? c : b(c);
          };
        })(Object.freeze);
      }
      Object.preventExtensions ||
        (Object.preventExtensions = function (b) {
          return b;
        }),
        Object.isSealed ||
          (Object.isSealed = function (b) {
            return !1;
          }),
        Object.isFrozen ||
          (Object.isFrozen = function (b) {
            return !1;
          }),
        Object.isExtensible ||
          (Object.isExtensible = function (b) {
            if (Object(b) === b) throw new TypeError();
            var c = "";
            while (i(b, c)) c += "?";
            b[c] = !0;
            var d = i(b, c);
            return delete b[c], d;
          });
      if (!Object.keys) {
        var x = !0,
          y = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor",
          ],
          z = y.length;
        for (var A in { toString: null }) x = !1;
        Object.keys = function H(a) {
          if ((typeof a != "object" && typeof a != "function") || a === null)
            throw new TypeError("Object.keys called on a non-object");
          var H = [];
          for (var b in a) i(a, b) && H.push(b);
          if (x)
            for (var c = 0, d = z; c < d; c++) {
              var e = y[c];
              i(a, e) && H.push(e);
            }
          return H;
        };
      }
      if (
        !Date.prototype.toISOString ||
        new Date(-621987552e5).toISOString().indexOf("-000001") === -1
      )
        Date.prototype.toISOString = function () {
          var b, c, d, e;
          if (!isFinite(this)) throw new RangeError();
          (b = [
            this.getUTCMonth() + 1,
            this.getUTCDate(),
            this.getUTCHours(),
            this.getUTCMinutes(),
            this.getUTCSeconds(),
          ]),
            (e = this.getUTCFullYear()),
            (e =
              (e < 0 ? "-" : e > 9999 ? "+" : "") +
              ("00000" + Math.abs(e)).slice(0 <= e && e <= 9999 ? -4 : -6)),
            (c = b.length);
          while (c--) (d = b[c]), d < 10 && (b[c] = "0" + d);
          return (
            e +
            "-" +
            b.slice(0, 2).join("-") +
            "T" +
            b.slice(2).join(":") +
            "." +
            ("000" + this.getUTCMilliseconds()).slice(-3) +
            "Z"
          );
        };
      Date.now ||
        (Date.now = function () {
          return new Date().getTime();
        }),
        Date.prototype.toJSON ||
          (Date.prototype.toJSON = function (b) {
            if (typeof this.toISOString != "function") throw new TypeError();
            return this.toISOString();
          }),
        Date.parse("+275760-09-13T00:00:00.000Z") !== 864e13 &&
          (Date = (function (a) {
            var b = function e(b, c, d, f, g, h, i) {
                var j = arguments.length;
                if (this instanceof a) {
                  var k =
                    j == 1 && String(b) === b
                      ? new a(e.parse(b))
                      : j >= 7
                      ? new a(b, c, d, f, g, h, i)
                      : j >= 6
                      ? new a(b, c, d, f, g, h)
                      : j >= 5
                      ? new a(b, c, d, f, g)
                      : j >= 4
                      ? new a(b, c, d, f)
                      : j >= 3
                      ? new a(b, c, d)
                      : j >= 2
                      ? new a(b, c)
                      : j >= 1
                      ? new a(b)
                      : new a();
                  return (k.constructor = e), k;
                }
                return a.apply(this, arguments);
              },
              c = new RegExp(
                "^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:\\.(\\d{3}))?)?(?:Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"
              );
            for (var d in a) b[d] = a[d];
            return (
              (b.now = a.now),
              (b.UTC = a.UTC),
              (b.prototype = a.prototype),
              (b.prototype.constructor = b),
              (b.parse = function (d) {
                var e = c.exec(d);
                if (e) {
                  e.shift();
                  for (var f = 1; f < 7; f++)
                    (e[f] = +(e[f] || (f < 3 ? 1 : 0))), f == 1 && e[f]--;
                  var g = +e.pop(),
                    h = +e.pop(),
                    i = e.pop(),
                    j = 0;
                  if (i) {
                    if (h > 23 || g > 59) return NaN;
                    j = (h * 60 + g) * 6e4 * (i == "+" ? -1 : 1);
                  }
                  var k = +e[0];
                  return 0 <= k && k <= 99
                    ? ((e[0] = k + 400), a.UTC.apply(this, e) + j - 126227808e5)
                    : a.UTC.apply(this, e) + j;
                }
                return a.parse.apply(this, arguments);
              }),
              b
            );
          })(Date));
      var B = "	\n\f\r ??????????????????????????????????????????????????\u2028\u2029???";
      if (!String.prototype.trim || B.trim()) {
        B = "[" + B + "]";
        var C = new RegExp("^" + B + B + "*"),
          D = new RegExp(B + B + "*$");
        String.prototype.trim = function () {
          return String(this).replace(C, "").replace(D, "");
        };
      }
      var E = function (a) {
          return (
            (a = +a),
            a !== a
              ? (a = 0)
              : a !== 0 &&
                a !== 1 / 0 &&
                a !== -Infinity &&
                (a = (a > 0 || -1) * Math.floor(Math.abs(a))),
            a
          );
        },
        F = "a"[0] != "a",
        G = function (a) {
          if (a == null) throw new TypeError();
          return F && typeof a == "string" && a ? a.split("") : Object(a);
        };
    }
  ),
  define(
    "ace/lib/event_emitter",
    ["require", "exports", "module"],
    function (a, b, c) {
      var d = {};
      (d._emit = d._dispatchEvent =
        function (a, b) {
          (this._eventRegistry = this._eventRegistry || {}),
            (this._defaultHandlers = this._defaultHandlers || {});
          var c = this._eventRegistry[a] || [],
            d = this._defaultHandlers[a];
          if (!c.length && !d) return;
          if (typeof b != "object" || !b) b = {};
          b.type || (b.type = a),
            b.stopPropagation ||
              (b.stopPropagation = function () {
                this.propagationStopped = !0;
              }),
            b.preventDefault ||
              (b.preventDefault = function () {
                this.defaultPrevented = !0;
              });
          for (var e = 0; e < c.length; e++) {
            c[e](b);
            if (b.propagationStopped) break;
          }
          if (d && !b.defaultPrevented) return d(b);
        }),
        (d.setDefaultHandler = function (a, b) {
          this._defaultHandlers = this._defaultHandlers || {};
          if (this._defaultHandlers[a])
            throw new Error(
              "The default handler for '" + a + "' is already set"
            );
          this._defaultHandlers[a] = b;
        }),
        (d.on = d.addEventListener =
          function (a, b) {
            this._eventRegistry = this._eventRegistry || {};
            var c = this._eventRegistry[a];
            c || (c = this._eventRegistry[a] = []),
              c.indexOf(b) == -1 && c.push(b);
          }),
        (d.removeListener = d.removeEventListener =
          function (a, b) {
            this._eventRegistry = this._eventRegistry || {};
            var c = this._eventRegistry[a];
            if (!c) return;
            var d = c.indexOf(b);
            d !== -1 && c.splice(d, 1);
          }),
        (d.removeAllListeners = function (a) {
          this._eventRegistry && (this._eventRegistry[a] = []);
        }),
        (b.EventEmitter = d);
    }
  ),
  define("ace/lib/oop", ["require", "exports", "module"], function (a, b, c) {
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
    "ace/mode/coffee_worker",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/worker/mirror",
      "ace/mode/coffee/coffee-script",
    ],
    function (a, b, c) {
      var d = a("../lib/oop"),
        e = a("../worker/mirror").Mirror,
        f = a("../mode/coffee/coffee-script");
      window.addEventListener = function () {};
      var g = (b.Worker = function (a) {
        e.call(this, a), this.setTimeout(200);
      });
      d.inherits(g, e),
        function () {
          this.onUpdate = function () {
            var a = this.doc.getValue();
            try {
              f.parse(a);
            } catch (b) {
              var c = b.message.match(/Parse error on line (\d+): (.*)/);
              if (c) {
                this.sender.emit("error", {
                  row: parseInt(c[1], 10) - 1,
                  column: null,
                  text: c[2],
                  type: "error",
                });
                return;
              }
              if (b instanceof SyntaxError) {
                var c = b.message.match(/ on line (\d+)/);
                c &&
                  this.sender.emit("error", {
                    row: parseInt(c[1], 10) - 1,
                    column: null,
                    text: b.message.replace(c[0], ""),
                    type: "error",
                  });
              }
              return;
            }
            this.sender.emit("ok");
          };
        }.call(g.prototype);
    }
  ),
  define(
    "ace/worker/mirror",
    ["require", "exports", "module", "ace/document", "ace/lib/lang"],
    function (a, b, c) {
      var d = a("../document").Document,
        e = a("../lib/lang"),
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
      "ace/lib/oop",
      "ace/lib/event_emitter",
      "ace/range",
      "ace/anchor",
    ],
    function (a, b, c) {
      var d = a("./lib/oop"),
        e = a("./lib/event_emitter").EventEmitter,
        f = a("./range").Range,
        g = a("./anchor").Anchor,
        h = function (a) {
          (this.$lines = []),
            a.length == 0
              ? (this.$lines = [""])
              : Array.isArray(a)
              ? this.insertLines(0, a)
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
            var b = a.match(/^.*?(\r\n|\r|\n)/m);
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
            if (this.$newLineMode === a) return;
            this.$newLineMode = a;
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
            var b = this.getLines(a.start.row + 1, a.end.row - 1);
            return (
              b.unshift(
                (this.$lines[a.start.row] || "").substring(a.start.column)
              ),
              b.push((this.$lines[a.end.row] || "").substring(0, a.end.column)),
              b.join(this.getNewLineCharacter())
            );
          }),
          (this.$clipPosition = function (a) {
            var b = this.getLength();
            return (
              a.row >= b &&
                ((a.row = Math.max(0, b - 1)),
                (a.column = this.getLine(b - 1).length)),
              a
            );
          }),
          (this.insert = function (a, b) {
            if (!b || b.length === 0) return a;
            (a = this.$clipPosition(a)),
              this.getLength() <= 1 && this.$detectNewLine(b);
            var c = this.$split(b),
              d = c.splice(0, 1)[0],
              e = c.length == 0 ? null : c.splice(c.length - 1, 1)[0];
            return (
              (a = this.insertInLine(a, d)),
              e !== null &&
                ((a = this.insertNewLine(a)),
                (a = this.insertLines(a.row, c)),
                (a = this.insertInLine(a, e || ""))),
              a
            );
          }),
          (this.insertLines = function (a, b) {
            if (b.length == 0) return { row: a, column: 0 };
            if (b.length > 65535) {
              var c = this.insertLines(a, b.slice(65535));
              b = b.slice(0, 65535);
            }
            var d = [a, 0];
            d.push.apply(d, b), this.$lines.splice.apply(this.$lines, d);
            var e = new f(a, 0, a + b.length, 0),
              g = { action: "insertLines", range: e, lines: b };
            return this._emit("change", { data: g }), c || e.end;
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
            return this._emit("change", { data: d }), c;
          }),
          (this.insertInLine = function (a, b) {
            if (b.length == 0) return a;
            var c = this.$lines[a.row] || "";
            this.$lines[a.row] =
              c.substring(0, a.column) + b + c.substring(a.column);
            var d = { row: a.row, column: a.column + b.length },
              e = { action: "insertText", range: f.fromPoints(a, d), text: b };
            return this._emit("change", { data: e }), d;
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
            if (b == c) return;
            var d = new f(a, b, a, c),
              e = this.getLine(a),
              g = e.substring(b, c),
              h = e.substring(0, b) + e.substring(c, e.length);
            this.$lines.splice(a, 1, h);
            var i = { action: "removeText", range: d, text: g };
            return this._emit("change", { data: i }), d.start;
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
            return this._emit("change", { data: e }), d;
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
            this._emit("change", { data: g });
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
      (this.isEqual = function (a) {
        return (
          this.start.row == a.start.row &&
          this.end.row == a.end.row &&
          this.start.column == a.start.column &&
          this.end.column == a.end.column
        );
      }),
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
          return (
            (b = this.compare(c.row, c.column)),
            b == 1
              ? ((b = this.compare(d.row, d.column)),
                b == 1 ? 2 : b == 0 ? 1 : 0)
              : b == -1
              ? -2
              : ((b = this.compare(d.row, d.column)),
                b == -1 ? -1 : b == 1 ? 42 : 0)
          );
        }),
        (this.comparePoint = function (a) {
          return this.compare(a.row, a.column);
        }),
        (this.containsRange = function (a) {
          return (
            this.comparePoint(a.start) == 0 && this.comparePoint(a.end) == 0
          );
        }),
        (this.intersects = function (a) {
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
          return this.compare(a, b) == 0
            ? this.isEnd(a, b) || this.isStart(a, b)
              ? !1
              : !0
            : !1;
        }),
        (this.insideStart = function (a, b) {
          return this.compare(a, b) == 0 ? (this.isEnd(a, b) ? !1 : !0) : !1;
        }),
        (this.insideEnd = function (a, b) {
          return this.compare(a, b) == 0 ? (this.isStart(a, b) ? !1 : !0) : !1;
        }),
        (this.compare = function (a, b) {
          return !this.isMultiLine() && a === this.start.row
            ? b < this.start.column
              ? -1
              : b > this.end.column
              ? 1
              : 0
            : a < this.start.row
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
    ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"],
    function (a, b, c) {
      var d = a("./lib/oop"),
        e = a("./lib/event_emitter").EventEmitter,
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
            if (c.start.row == c.end.row && c.start.row != this.row) return;
            if (c.start.row > this.row) return;
            if (c.start.row == this.row && c.start.column > this.column) return;
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
          }),
          (this.setPosition = function (a, b, c) {
            var d;
            c
              ? (d = { row: a, column: b })
              : (d = this.$clipPositionToDocument(a, b));
            if (this.row == d.row && this.column == d.column) return;
            var e = { row: this.row, column: this.column };
            (this.row = d.row),
              (this.column = d.column),
              this._emit("change", { old: e, value: d });
          }),
          (this.detach = function () {
            this.document.removeEventListener("change", this.$onChange);
          }),
          (this.$clipPositionToDocument = function (a, b) {
            var c = {};
            return (
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
              b < 0 && (c.column = 0),
              c
            );
          });
      }.call(f.prototype));
    }
  ),
  define("ace/lib/lang", ["require", "exports", "module"], function (a, b, c) {
    (b.stringReverse = function (a) {
      return a.split("").reverse().join("");
    }),
      (b.stringRepeat = function (a, b) {
        return new Array(b + 1).join(a);
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
        for (var c = 0, d = a.length; c < d; c++)
          a[c] && typeof a[c] == "object"
            ? (b[c] = this.copyObject(a[c]))
            : (b[c] = a[c]);
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
      (b.createMap = function (a) {
        var b = Object.create(null);
        for (var c in a) b[c] = a[c];
        return b;
      }),
      (b.arrayRemove = function (a, b) {
        for (var c = 0; c <= a.length; c++) b === a[c] && a.splice(c, 1);
      }),
      (b.escapeRegExp = function (a) {
        return a.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      }),
      (b.getMatchOffsets = function (a, b) {
        var c = [];
        return (
          a.replace(b, function (a) {
            c.push({
              offset: arguments[arguments.length - 2],
              length: a.length,
            });
          }),
          c
        );
      }),
      (b.deferredCall = function (a) {
        var b = null,
          c = function () {
            (b = null), a();
          },
          d = function (a) {
            return d.cancel(), (b = setTimeout(c, a || 0)), d;
          };
        return (
          (d.schedule = d),
          (d.call = function () {
            return this.cancel(), a(), d;
          }),
          (d.cancel = function () {
            return clearTimeout(b), (b = null), d;
          }),
          d
        );
      });
  }),
  define(
    "ace/mode/coffee/coffee-script",
    [
      "require",
      "exports",
      "module",
      "ace/mode/coffee/lexer",
      "ace/mode/coffee/parser",
      "ace/mode/coffee/nodes",
    ],
    function (a, b, c) {
      var d = a("./lexer").Lexer,
        e = a("./parser"),
        f = new d();
      (e.lexer = {
        lex: function () {
          var a, b;
          return (
            (b = this.tokens[this.pos++] || [""]),
            (a = b[0]),
            (this.yytext = b[1]),
            (this.yylineno = b[2]),
            a
          );
        },
        setInput: function (a) {
          return (this.tokens = a), (this.pos = 0);
        },
        upcomingInput: function () {
          return "";
        },
      }),
        (e.yy = a("./nodes")),
        (b.parse = function (a) {
          return e.parse(f.tokenize(a));
        });
    }
  ),
  define(
    "ace/mode/coffee/lexer",
    [
      "require",
      "exports",
      "module",
      "ace/mode/coffee/rewriter",
      "ace/mode/coffee/helpers",
    ],
    function (a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v,
        w,
        x,
        y,
        z,
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
        Z =
          [].indexOf ||
          function (a) {
            for (var b = 0, c = this.length; b < c; b++)
              if (b in this && this[b] === a) return b;
            return -1;
          };
      (X = a("./rewriter")),
        (L = X.Rewriter),
        (t = X.INVERSES),
        (Y = a("./helpers")),
        (T = Y.count),
        (W = Y.starts),
        (S = Y.compact),
        (V = Y.last),
        (b.Lexer = A =
          (function () {
            function a() {}
            return (
              (a.name = "Lexer"),
              (a.prototype.tokenize = function (a, b) {
                var c, d;
                b == null && (b = {}),
                  R.test(a) && (a = "\n" + a),
                  (a = a.replace(/\r/g, "").replace(P, "")),
                  (this.code = a),
                  (this.line = b.line || 0),
                  (this.indent = 0),
                  (this.indebt = 0),
                  (this.outdebt = 0),
                  (this.indents = []),
                  (this.ends = []),
                  (this.tokens = []),
                  (c = 0);
                while ((this.chunk = a.slice(c)))
                  c +=
                    this.identifierToken() ||
                    this.commentToken() ||
                    this.whitespaceToken() ||
                    this.lineToken() ||
                    this.heredocToken() ||
                    this.stringToken() ||
                    this.numberToken() ||
                    this.regexToken() ||
                    this.jsToken() ||
                    this.literalToken();
                return (
                  this.closeIndentation(),
                  (d = this.ends.pop()) && this.error("missing " + d),
                  b.rewrite === !1 ? this.tokens : new L().rewrite(this.tokens)
                );
              }),
              (a.prototype.identifierToken = function () {
                var a, b, c, d, e, f, j, k, l;
                return (e = r.exec(this.chunk))
                  ? ((d = e[0]),
                    (c = e[1]),
                    (a = e[2]),
                    c === "own" && this.tag() === "FOR"
                      ? (this.token("OWN", c), c.length)
                      : ((b =
                          a ||
                          ((f = V(this.tokens)) &&
                            ((k = f[0]) === "." ||
                              k === "?." ||
                              k === "::" ||
                              (!f.spaced && f[0] === "@")))),
                        (j = "IDENTIFIER"),
                        !b &&
                          (Z.call(w, c) >= 0 || Z.call(i, c) >= 0) &&
                          ((j = c.toUpperCase()),
                          j === "WHEN" && ((l = this.tag()), Z.call(x, l) >= 0)
                            ? (j = "LEADING_WHEN")
                            : j === "FOR"
                            ? (this.seenFor = !0)
                            : j === "UNLESS"
                            ? (j = "IF")
                            : Z.call(Q, j) >= 0
                            ? (j = "UNARY")
                            : Z.call(J, j) >= 0 &&
                              (j !== "INSTANCEOF" && this.seenFor
                                ? ((j = "FOR" + j), (this.seenFor = !1))
                                : ((j = "RELATION"),
                                  this.value() === "!" &&
                                    (this.tokens.pop(), (c = "!" + c))))),
                        Z.call(v, c) >= 0 &&
                          (b
                            ? ((j = "IDENTIFIER"),
                              (c = new String(c)),
                              (c.reserved = !0))
                            : Z.call(K, c) >= 0 &&
                              this.error('reserved word "' + c + '"')),
                        b ||
                          (Z.call(g, c) >= 0 && (c = h[c]),
                          (j = (function () {
                            switch (c) {
                              case "!":
                                return "UNARY";
                              case "==":
                              case "!=":
                                return "COMPARE";
                              case "&&":
                              case "||":
                                return "LOGIC";
                              case "true":
                              case "false":
                              case "null":
                              case "undefined":
                                return "BOOL";
                              case "break":
                              case "continue":
                                return "STATEMENT";
                              default:
                                return j;
                            }
                          })())),
                        this.token(j, c),
                        a && this.token(":", ":"),
                        d.length))
                  : 0;
              }),
              (a.prototype.numberToken = function () {
                var a, b, c, d, e;
                if (!(c = G.exec(this.chunk))) return 0;
                (d = c[0]),
                  /E/.test(d)
                    ? this.error(
                        "exponential notation '" +
                          d +
                          "' must be indicated with a lowercase 'e'"
                      )
                    : /[BOX]/.test(d)
                    ? this.error("radix prefix '" + d + "' must be lowercase")
                    : /^0[89]/.test(d)
                    ? this.error(
                        "decimal literal '" +
                          d +
                          "' must not be prefixed with '0'"
                      )
                    : /^0[0-7]/.test(d) &&
                      this.error(
                        "octal literal '" + d + "' must be prefixed with '0o'"
                      ),
                  (b = d.length);
                if ((e = /0o([0-7]+)/.exec(d)))
                  d = parseInt(e[1], 8).toString();
                if ((a = /0b([01]+)/.exec(d))) d = parseInt(a[1], 2).toString();
                return this.token("NUMBER", d), b;
              }),
              (a.prototype.stringToken = function () {
                var a, b, c;
                switch (this.chunk.charAt(0)) {
                  case "'":
                    if (!(a = N.exec(this.chunk))) return 0;
                    this.token("STRING", (c = a[0]).replace(C, "\\\n"));
                    break;
                  case '"':
                    if (!(c = this.balancedString(this.chunk, '"'))) return 0;
                    0 < c.indexOf("#{", 1)
                      ? this.interpolateString(c.slice(1, -1))
                      : this.token("STRING", this.escapeLines(c));
                    break;
                  default:
                    return 0;
                }
                return (
                  (b = /^(?:\\.|[^\\])*\\[0-7]/.test(c)) &&
                    this.error(
                      "octal escape sequences " + c + " are not allowed"
                    ),
                  (this.line += T(c, "\n")),
                  c.length
                );
              }),
              (a.prototype.heredocToken = function () {
                var a, b, c, d;
                return (c = m.exec(this.chunk))
                  ? ((b = c[0]),
                    (d = b.charAt(0)),
                    (a = this.sanitizeHeredoc(c[2], {
                      quote: d,
                      indent: null,
                    })),
                    d === '"' && 0 <= a.indexOf("#{")
                      ? this.interpolateString(a, { heredoc: !0 })
                      : this.token("STRING", this.makeString(a, d, !0)),
                    (this.line += T(b, "\n")),
                    b.length)
                  : 0;
              }),
              (a.prototype.commentToken = function () {
                var a, b, c;
                return (c = this.chunk.match(j))
                  ? ((a = c[0]),
                    (b = c[1]),
                    b &&
                      this.token(
                        "HERECOMMENT",
                        this.sanitizeHeredoc(b, {
                          herecomment: !0,
                          indent: Array(this.indent + 1).join(" "),
                        })
                      ),
                    (this.line += T(a, "\n")),
                    a.length)
                  : 0;
              }),
              (a.prototype.jsToken = function () {
                var a, b;
                return this.chunk.charAt(0) !== "`" || !(a = u.exec(this.chunk))
                  ? 0
                  : (this.token("JS", (b = a[0]).slice(1, -1)), b.length);
              }),
              (a.prototype.regexToken = function () {
                var a, b, c, d, e, f, g;
                return this.chunk.charAt(0) !== "/"
                  ? 0
                  : (c = p.exec(this.chunk))
                  ? ((b = this.heregexToken(c)),
                    (this.line += T(c[0], "\n")),
                    b)
                  : ((d = V(this.tokens)),
                    d && ((f = d[0]), Z.call(d.spaced ? E : F, f) >= 0)
                      ? 0
                      : (c = I.exec(this.chunk))
                      ? ((g = c),
                        (c = g[0]),
                        (e = g[1]),
                        (a = g[2]),
                        e.slice(0, 2) === "/*" &&
                          this.error(
                            "regular expressions cannot begin with `*`"
                          ),
                        e === "//" && (e = "/(?:)/"),
                        this.token("REGEX", "" + e + a),
                        c.length)
                      : 0);
              }),
              (a.prototype.heregexToken = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n;
                (d = a[0]), (b = a[1]), (c = a[2]);
                if (0 > b.indexOf("#{"))
                  return (
                    (e = b.replace(q, "").replace(/\//g, "\\/")),
                    e.match(/^\*/) &&
                      this.error("regular expressions cannot begin with `*`"),
                    this.token("REGEX", "/" + (e || "(?:)") + "/" + c),
                    d.length
                  );
                this.token("IDENTIFIER", "RegExp"),
                  this.tokens.push(["CALL_START", "("]),
                  (g = []),
                  (k = this.interpolateString(b, { regex: !0 }));
                for (i = 0, j = k.length; i < j; i++) {
                  (l = k[i]), (f = l[0]), (h = l[1]);
                  if (f === "TOKENS") g.push.apply(g, h);
                  else {
                    if (!(h = h.replace(q, ""))) continue;
                    (h = h.replace(/\\/g, "\\\\")),
                      g.push(["STRING", this.makeString(h, '"', !0)]);
                  }
                  g.push(["+", "+"]);
                }
                return (
                  g.pop(),
                  ((m = g[0]) != null ? m[0] : void 0) !== "STRING" &&
                    this.tokens.push(["STRING", '""'], ["+", "+"]),
                  (n = this.tokens).push.apply(n, g),
                  c && this.tokens.push([",", ","], ["STRING", '"' + c + '"']),
                  this.token(")", ")"),
                  d.length
                );
              }),
              (a.prototype.lineToken = function () {
                var a, b, c, d, e, f;
                if (!(c = D.exec(this.chunk))) return 0;
                (b = c[0]),
                  (this.line += T(b, "\n")),
                  (this.seenFor = !1),
                  (e = V(this.tokens, 1)),
                  (f = b.length - 1 - b.lastIndexOf("\n")),
                  (d = this.unfinished());
                if (f - this.indebt === this.indent)
                  return (
                    d ? this.suppressNewlines() : this.newlineToken(), b.length
                  );
                if (f > this.indent) {
                  if (d)
                    return (
                      (this.indebt = f - this.indent),
                      this.suppressNewlines(),
                      b.length
                    );
                  (a = f - this.indent + this.outdebt),
                    this.token("INDENT", a),
                    this.indents.push(a),
                    this.ends.push("OUTDENT"),
                    (this.outdebt = this.indebt = 0);
                } else (this.indebt = 0), this.outdentToken(this.indent - f, d);
                return (this.indent = f), b.length;
              }),
              (a.prototype.outdentToken = function (a, b) {
                var c, d;
                while (a > 0)
                  (d = this.indents.length - 1),
                    this.indents[d] === void 0
                      ? (a = 0)
                      : this.indents[d] === this.outdebt
                      ? ((a -= this.outdebt), (this.outdebt = 0))
                      : this.indents[d] < this.outdebt
                      ? ((this.outdebt -= this.indents[d]),
                        (a -= this.indents[d]))
                      : ((c = this.indents.pop() - this.outdebt),
                        (a -= c),
                        (this.outdebt = 0),
                        this.pair("OUTDENT"),
                        this.token("OUTDENT", c));
                c && (this.outdebt -= a);
                while (this.value() === ";") this.tokens.pop();
                return (
                  this.tag() !== "TERMINATOR" &&
                    !b &&
                    this.token("TERMINATOR", "\n"),
                  this
                );
              }),
              (a.prototype.whitespaceToken = function () {
                var a, b, c;
                return !(a = R.exec(this.chunk)) &&
                  !(b = this.chunk.charAt(0) === "\n")
                  ? 0
                  : ((c = V(this.tokens)),
                    c && (c[a ? "spaced" : "newLine"] = !0),
                    a ? a[0].length : 0);
              }),
              (a.prototype.newlineToken = function () {
                while (this.value() === ";") this.tokens.pop();
                return (
                  this.tag() !== "TERMINATOR" && this.token("TERMINATOR", "\n"),
                  this
                );
              }),
              (a.prototype.suppressNewlines = function () {
                return this.value() === "\\" && this.tokens.pop(), this;
              }),
              (a.prototype.literalToken = function () {
                var a, b, c, d, g, h, i, j;
                (a = H.exec(this.chunk))
                  ? ((d = a[0]), f.test(d) && this.tagParameters())
                  : (d = this.chunk.charAt(0)),
                  (c = d),
                  (b = V(this.tokens));
                if (d === "=" && b) {
                  !b[1].reserved &&
                    ((g = b[1]), Z.call(v, g) >= 0) &&
                    this.error(
                      'reserved word "' + this.value() + "\" can't be assigned"
                    );
                  if ((h = b[1]) === "||" || h === "&&")
                    return (b[0] = "COMPOUND_ASSIGN"), (b[1] += "="), d.length;
                }
                if (d === ";") (this.seenFor = !1), (c = "TERMINATOR");
                else if (Z.call(B, d) >= 0) c = "MATH";
                else if (Z.call(k, d) >= 0) c = "COMPARE";
                else if (Z.call(l, d) >= 0) c = "COMPOUND_ASSIGN";
                else if (Z.call(Q, d) >= 0) c = "UNARY";
                else if (Z.call(M, d) >= 0) c = "SHIFT";
                else if (
                  Z.call(z, d) >= 0 ||
                  (d === "?" && (b != null ? b.spaced : void 0))
                )
                  c = "LOGIC";
                else if (b && !b.spaced)
                  if (d === "(" && ((i = b[0]), Z.call(e, i) >= 0))
                    b[0] === "?" && (b[0] = "FUNC_EXIST"), (c = "CALL_START");
                  else if (d === "[" && ((j = b[0]), Z.call(s, j) >= 0)) {
                    c = "INDEX_START";
                    switch (b[0]) {
                      case "?":
                        b[0] = "INDEX_SOAK";
                    }
                  }
                switch (d) {
                  case "(":
                  case "{":
                  case "[":
                    this.ends.push(t[d]);
                    break;
                  case ")":
                  case "}":
                  case "]":
                    this.pair(d);
                }
                return this.token(c, d), d.length;
              }),
              (a.prototype.sanitizeHeredoc = function (a, b) {
                var c, d, e, f, g;
                (e = b.indent), (d = b.herecomment);
                if (d) {
                  n.test(a) &&
                    this.error('block comment cannot contain "*/", starting');
                  if (a.indexOf("\n") <= 0) return a;
                } else
                  while ((f = o.exec(a))) {
                    c = f[1];
                    if (e === null || (0 < (g = c.length) && g < e.length))
                      e = c;
                  }
                return (
                  e && (a = a.replace(RegExp("\\n" + e, "g"), "\n")),
                  d || (a = a.replace(/^\n/, "")),
                  a
                );
              }),
              (a.prototype.tagParameters = function () {
                var a, b, c, d;
                if (this.tag() !== ")") return this;
                (b = []),
                  (d = this.tokens),
                  (a = d.length),
                  (d[--a][0] = "PARAM_END");
                while ((c = d[--a]))
                  switch (c[0]) {
                    case ")":
                      b.push(c);
                      break;
                    case "(":
                    case "CALL_START":
                      if (!b.length)
                        return c[0] === "("
                          ? ((c[0] = "PARAM_START"), this)
                          : this;
                      b.pop();
                  }
                return this;
              }),
              (a.prototype.closeIndentation = function () {
                return this.outdentToken(this.indent);
              }),
              (a.prototype.balancedString = function (a, b) {
                var c, d, e, f, g, h, i, j;
                (c = 0), (h = [b]);
                for (
                  d = i = 1, j = a.length;
                  1 <= j ? i < j : i > j;
                  d = 1 <= j ? ++i : --i
                ) {
                  if (c) {
                    --c;
                    continue;
                  }
                  switch ((e = a.charAt(d))) {
                    case "\\":
                      ++c;
                      continue;
                    case b:
                      h.pop();
                      if (!h.length) return a.slice(0, d + 1 || 9e9);
                      b = h[h.length - 1];
                      continue;
                  }
                  b !== "}" || (e !== '"' && e !== "'")
                    ? b === "}" &&
                      e === "/" &&
                      (f = p.exec(a.slice(d)) || I.exec(a.slice(d)))
                      ? (c += f[0].length - 1)
                      : b === "}" && e === "{"
                      ? h.push((b = "}"))
                      : b === '"' && g === "#" && e === "{" && h.push((b = "}"))
                    : h.push((b = e)),
                    (g = e);
                }
                return this.error("missing " + h.pop() + ", starting");
              }),
              (a.prototype.interpolateString = function (b, c) {
                var d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u;
                c == null && (c = {}),
                  (e = c.heredoc),
                  (m = c.regex),
                  (o = []),
                  (l = 0),
                  (f = -1);
                while ((j = b.charAt((f += 1)))) {
                  if (j === "\\") {
                    f += 1;
                    continue;
                  }
                  if (
                    j !== "#" ||
                    b.charAt(f + 1) !== "{" ||
                    !(d = this.balancedString(b.slice(f + 1), "}"))
                  )
                    continue;
                  l < f && o.push(["NEOSTRING", b.slice(l, f)]),
                    (g = d.slice(1, -1));
                  if (g.length) {
                    (k = new a().tokenize(g, { line: this.line, rewrite: !1 })),
                      k.pop(),
                      ((s = k[0]) != null ? s[0] : void 0) === "TERMINATOR" &&
                        k.shift();
                    if ((i = k.length))
                      i > 1 &&
                        (k.unshift(["(", "(", this.line]),
                        k.push([")", ")", this.line])),
                        o.push(["TOKENS", k]);
                  }
                  (f += d.length), (l = f + 1);
                }
                f > l && l < b.length && o.push(["NEOSTRING", b.slice(l)]);
                if (m) return o;
                if (!o.length) return this.token("STRING", '""');
                o[0][0] !== "NEOSTRING" && o.unshift(["", ""]),
                  (h = o.length > 1) && this.token("(", "(");
                for (f = q = 0, r = o.length; q < r; f = ++q)
                  (t = o[f]),
                    (n = t[0]),
                    (p = t[1]),
                    f && this.token("+", "+"),
                    n === "TOKENS"
                      ? (u = this.tokens).push.apply(u, p)
                      : this.token("STRING", this.makeString(p, '"', e));
                return h && this.token(")", ")"), o;
              }),
              (a.prototype.pair = function (a) {
                var b, c;
                return a !== (c = V(this.ends))
                  ? ("OUTDENT" !== c && this.error("unmatched " + a),
                    (this.indent -= b = V(this.indents)),
                    this.outdentToken(b, !0),
                    this.pair(a))
                  : this.ends.pop();
              }),
              (a.prototype.token = function (a, b) {
                return this.tokens.push([a, b, this.line]);
              }),
              (a.prototype.tag = function (a, b) {
                var c;
                return (c = V(this.tokens, a)) && (b ? (c[0] = b) : c[0]);
              }),
              (a.prototype.value = function (a, b) {
                var c;
                return (c = V(this.tokens, a)) && (b ? (c[1] = b) : c[1]);
              }),
              (a.prototype.unfinished = function () {
                var a;
                return (
                  y.test(this.chunk) ||
                  (a = this.tag()) === "\\" ||
                  a === "." ||
                  a === "?." ||
                  a === "UNARY" ||
                  a === "MATH" ||
                  a === "+" ||
                  a === "-" ||
                  a === "SHIFT" ||
                  a === "RELATION" ||
                  a === "COMPARE" ||
                  a === "LOGIC" ||
                  a === "THROW" ||
                  a === "EXTENDS"
                );
              }),
              (a.prototype.escapeLines = function (a, b) {
                return a.replace(C, b ? "\\n" : "");
              }),
              (a.prototype.makeString = function (a, b, c) {
                return a
                  ? ((a = a.replace(/\\([\s\S])/g, function (a, c) {
                      return c === "\n" || c === b ? c : a;
                    })),
                    (a = a.replace(RegExp("" + b, "g"), "\\$&")),
                    b + this.escapeLines(a, c) + b)
                  : b + b;
              }),
              (a.prototype.error = function (a) {
                throw SyntaxError("" + a + " on line " + (this.line + 1));
              }),
              a
            );
          })()),
        (w = [
          "true",
          "false",
          "null",
          "this",
          "new",
          "delete",
          "typeof",
          "in",
          "instanceof",
          "return",
          "throw",
          "break",
          "continue",
          "debugger",
          "if",
          "else",
          "switch",
          "for",
          "while",
          "do",
          "try",
          "catch",
          "finally",
          "class",
          "extends",
          "super",
        ]),
        (i = [
          "undefined",
          "then",
          "unless",
          "until",
          "loop",
          "of",
          "by",
          "when",
        ]),
        (h = {
          and: "&&",
          or: "||",
          is: "==",
          isnt: "!=",
          not: "!",
          yes: "true",
          no: "false",
          on: "true",
          off: "false",
        }),
        (g = (function () {
          var a;
          a = [];
          for (U in h) a.push(U);
          return a;
        })()),
        (i = i.concat(g)),
        (K = [
          "case",
          "default",
          "function",
          "var",
          "void",
          "with",
          "const",
          "let",
          "enum",
          "export",
          "import",
          "native",
          "__hasProp",
          "__extends",
          "__slice",
          "__bind",
          "__indexOf",
          "implements",
          "interface",
          "let",
          "package",
          "private",
          "protected",
          "public",
          "static",
          "yield",
        ]),
        (O = ["arguments", "eval"]),
        (v = w.concat(K).concat(O)),
        (b.RESERVED = K.concat(w).concat(i).concat(O)),
        (b.STRICT_PROSCRIBED = O),
        (r = /^([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)([^\n\S]*:(?!:))?/),
        (G = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i),
        (m = /^("""|''')([\s\S]*?)(?:\n[^\n\S]*)?\1/),
        (H =
          /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3})/),
        (R = /^[^\n\S]+/),
        (j =
          /^###([^#][\s\S]*?)(?:###[^\n\S]*|(?:###)?$)|^(?:\s*#(?!##[^#]).*)+/),
        (f = /^[-=]>/),
        (D = /^(?:\n[^\n\S]*)+/),
        (N = /^'[^\\']*(?:\\.[^\\']*)*'/),
        (u = /^`[^\\`]*(?:\\.[^\\`]*)*`/),
        (I =
          /^(\/(?![\s=])[^[\/\n\\]*(?:(?:\\[\s\S]|\[[^\]\n\\]*(?:\\[\s\S][^\]\n\\]*)*])[^[\/\n\\]*)*\/)([imgy]{0,4})(?!\w)/),
        (p = /^\/{3}([\s\S]+?)\/{3}([imgy]{0,4})(?!\w)/),
        (q = /\s+(?:#.*)?/g),
        (C = /\n/g),
        (o = /\n+([^\n\S]*)/g),
        (n = /\*\//),
        (y = /^\s*(?:,|\??\.(?![.\d])|::)/),
        (P = /\s+$/),
        (l = [
          "-=",
          "+=",
          "/=",
          "*=",
          "%=",
          "||=",
          "&&=",
          "?=",
          "<<=",
          ">>=",
          ">>>=",
          "&=",
          "^=",
          "|=",
        ]),
        (Q = ["!", "~", "NEW", "TYPEOF", "DELETE", "DO"]),
        (z = ["&&", "||", "&", "|", "^"]),
        (M = ["<<", ">>", ">>>"]),
        (k = ["==", "!=", "<", ">", "<=", ">="]),
        (B = ["*", "/", "%"]),
        (J = ["IN", "OF", "INSTANCEOF"]),
        (d = ["TRUE", "FALSE", "NULL", "UNDEFINED"]),
        (E = ["NUMBER", "REGEX", "BOOL", "++", "--", "]"]),
        (F = E.concat(")", "}", "THIS", "IDENTIFIER", "STRING")),
        (e = [
          "IDENTIFIER",
          "STRING",
          "REGEX",
          ")",
          "]",
          "}",
          "?",
          "::",
          "@",
          "THIS",
          "SUPER",
        ]),
        (s = e.concat("NUMBER", "BOOL")),
        (x = ["INDENT", "OUTDENT", "TERMINATOR"]);
    }
  ),
  define(
    "ace/mode/coffee/rewriter",
    ["require", "exports", "module"],
    function (a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v =
          [].indexOf ||
          function (a) {
            for (var b = 0, c = this.length; b < c; b++)
              if (b in this && this[b] === a) return b;
            return -1;
          },
        w = [].slice;
      (b.Rewriter = (function () {
        function a() {}
        return (
          (a.name = "Rewriter"),
          (a.prototype.rewrite = function (a) {
            return (
              (this.tokens = a),
              this.removeLeadingNewlines(),
              this.removeMidExpressionNewlines(),
              this.closeOpenCalls(),
              this.closeOpenIndexes(),
              this.addImplicitIndentation(),
              this.tagPostfixConditionals(),
              this.addImplicitBraces(),
              this.addImplicitParentheses(),
              this.tokens
            );
          }),
          (a.prototype.scanTokens = function (a) {
            var b, c, d;
            (d = this.tokens), (b = 0);
            while ((c = d[b])) b += a.call(this, c, b, d);
            return !0;
          }),
          (a.prototype.detectEnd = function (a, b, c) {
            var d, e, h, i, j;
            (h = this.tokens), (d = 0);
            while ((e = h[a])) {
              if (d === 0 && b.call(this, e, a)) return c.call(this, e, a);
              if (!e || d < 0) return c.call(this, e, a - 1);
              if (((i = e[0]), v.call(g, i) >= 0)) d += 1;
              else if (((j = e[0]), v.call(f, j) >= 0)) d -= 1;
              a += 1;
            }
            return a - 1;
          }),
          (a.prototype.removeLeadingNewlines = function () {
            var a, b, c, d, e;
            e = this.tokens;
            for (a = c = 0, d = e.length; c < d; a = ++c) {
              b = e[a][0];
              if (b !== "TERMINATOR") break;
            }
            if (a) return this.tokens.splice(0, a);
          }),
          (a.prototype.removeMidExpressionNewlines = function () {
            return this.scanTokens(function (a, b, c) {
              var d;
              return a[0] === "TERMINATOR" &&
                ((d = this.tag(b + 1)), v.call(e, d) >= 0)
                ? (c.splice(b, 1), 0)
                : 1;
            });
          }),
          (a.prototype.closeOpenCalls = function () {
            var a, b;
            return (
              (b = function (a, b) {
                var c;
                return (
                  (c = a[0]) === ")" ||
                  c === "CALL_END" ||
                  (a[0] === "OUTDENT" && this.tag(b - 1) === ")")
                );
              }),
              (a = function (a, b) {
                return (this.tokens[a[0] === "OUTDENT" ? b - 1 : b][0] =
                  "CALL_END");
              }),
              this.scanTokens(function (c, d) {
                return c[0] === "CALL_START" && this.detectEnd(d + 1, b, a), 1;
              })
            );
          }),
          (a.prototype.closeOpenIndexes = function () {
            var a, b;
            return (
              (b = function (a, b) {
                var c;
                return (c = a[0]) === "]" || c === "INDEX_END";
              }),
              (a = function (a, b) {
                return (a[0] = "INDEX_END");
              }),
              this.scanTokens(function (c, d) {
                return c[0] === "INDEX_START" && this.detectEnd(d + 1, b, a), 1;
              })
            );
          }),
          (a.prototype.addImplicitBraces = function () {
            var a, b, c, d, e, h, i;
            return (
              (d = []),
              (e = null),
              (i = null),
              (c = !0),
              (h = 0),
              (b = function (a, b) {
                var d, e, f, g, h, k;
                return (
                  (h = this.tokens.slice(b + 1, b + 3 + 1 || 9e9)),
                  (d = h[0]),
                  (g = h[1]),
                  (f = h[2]),
                  "HERECOMMENT" === (d != null ? d[0] : void 0)
                    ? !1
                    : ((e = a[0]),
                      v.call(n, e) >= 0 && (c = !1),
                      ((e === "TERMINATOR" ||
                        e === "OUTDENT" ||
                        (v.call(j, e) >= 0 && c)) &&
                        ((!i && this.tag(b - 1) !== ",") ||
                          ((g != null ? g[0] : void 0) !== ":" &&
                            ((d != null ? d[0] : void 0) !== "@" ||
                              (f != null ? f[0] : void 0) !== ":")))) ||
                        (e === "," &&
                          d &&
                          (k = d[0]) !== "IDENTIFIER" &&
                          k !== "NUMBER" &&
                          k !== "STRING" &&
                          k !== "@" &&
                          k !== "TERMINATOR" &&
                          k !== "OUTDENT"))
                );
              }),
              (a = function (a, b) {
                var c;
                return (
                  (c = this.generate("}", "}", a[2])),
                  this.tokens.splice(b, 0, c)
                );
              }),
              this.scanTokens(function (h, j, k) {
                var l, m, o, p, q, r, s, t;
                if (((s = p = h[0]), v.call(g, s) >= 0))
                  return (
                    d.push([
                      p === "INDENT" && this.tag(j - 1) === "{" ? "{" : p,
                      j,
                    ]),
                    1
                  );
                if (v.call(f, p) >= 0) return (e = d.pop()), 1;
                if (
                  p !== ":" ||
                  ((l = this.tag(j - 2)) !== ":" &&
                    ((t = d[d.length - 1]) != null ? t[0] : void 0) === "{")
                )
                  return 1;
                (c = !0), d.push(["{"]), (m = l === "@" ? j - 2 : j - 1);
                while (this.tag(m - 2) === "HERECOMMENT") m -= 2;
                return (
                  (o = this.tag(m - 1)),
                  (i = !o || v.call(n, o) >= 0),
                  (r = new String("{")),
                  (r.generated = !0),
                  (q = this.generate("{", r, h[2])),
                  k.splice(m, 0, q),
                  this.detectEnd(j + 2, b, a),
                  2
                );
              })
            );
          }),
          (a.prototype.addImplicitParentheses = function () {
            var a, b, c, d, e;
            return (
              (c = e = d = !1),
              (b = function (a, b) {
                var c, f, g, i;
                f = a[0];
                if (!e && a.fromThen) return !0;
                if (
                  f === "IF" ||
                  f === "ELSE" ||
                  f === "CATCH" ||
                  f === "->" ||
                  f === "=>" ||
                  f === "CLASS"
                )
                  e = !0;
                if (
                  f === "IF" ||
                  f === "ELSE" ||
                  f === "SWITCH" ||
                  f === "TRY" ||
                  f === "="
                )
                  d = !0;
                return (f !== "." && f !== "?." && f !== "::") ||
                  this.tag(b - 1) !== "OUTDENT"
                  ? !a.generated &&
                      this.tag(b - 1) !== "," &&
                      (v.call(j, f) >= 0 || (f === "INDENT" && !d)) &&
                      (f !== "INDENT" ||
                        ((g = this.tag(b - 2)) !== "CLASS" &&
                          g !== "EXTENDS" &&
                          ((i = this.tag(b - 1)), v.call(h, i) < 0) &&
                          (!(c = this.tokens[b + 1]) ||
                            !c.generated ||
                            c[0] !== "{")))
                  : !0;
              }),
              (a = function (a, b) {
                return this.tokens.splice(
                  b,
                  0,
                  this.generate("CALL_END", ")", a[2])
                );
              }),
              this.scanTokens(function (f, g, h) {
                var j, m, o, p, q, r, s, t;
                q = f[0];
                if (q === "CLASS" || q === "IF" || q === "FOR" || q === "WHILE")
                  c = !0;
                return (
                  (r = h.slice(g - 1, g + 1 + 1 || 9e9)),
                  (p = r[0]),
                  (m = r[1]),
                  (o = r[2]),
                  (j =
                    !c &&
                    q === "INDENT" &&
                    o &&
                    o.generated &&
                    o[0] === "{" &&
                    p &&
                    ((s = p[0]), v.call(k, s) >= 0)),
                  (e = !1),
                  (d = !1),
                  v.call(n, q) >= 0 && (c = !1),
                  p && !p.spaced && q === "?" && (f.call = !0),
                  f.fromThen
                    ? 1
                    : j ||
                      ((p != null ? p.spaced : void 0) &&
                        (p.call || ((t = p[0]), v.call(k, t) >= 0)) &&
                        (v.call(i, q) >= 0 ||
                          (!f.spaced && !f.newLine && v.call(l, q) >= 0)))
                    ? (h.splice(g, 0, this.generate("CALL_START", "(", f[2])),
                      this.detectEnd(g + 1, b, a),
                      p[0] === "?" && (p[0] = "FUNC_EXIST"),
                      2)
                    : 1
                );
              })
            );
          }),
          (a.prototype.addImplicitIndentation = function () {
            var a, b, c, d, e;
            return (
              (e = c = d = null),
              (b = function (a, b) {
                var c;
                return (
                  a[1] !== ";" &&
                  ((c = a[0]), v.call(o, c) >= 0) &&
                  (a[0] !== "ELSE" || e === "IF" || e === "THEN")
                );
              }),
              (a = function (a, b) {
                return this.tokens.splice(
                  this.tag(b - 1) === "," ? b - 1 : b,
                  0,
                  d
                );
              }),
              this.scanTokens(function (f, g, h) {
                var i, j, k;
                return (
                  (i = f[0]),
                  i === "TERMINATOR" && this.tag(g + 1) === "THEN"
                    ? (h.splice(g, 1), 0)
                    : i === "ELSE" && this.tag(g - 1) !== "OUTDENT"
                    ? (h.splice.apply(
                        h,
                        [g, 0].concat(w.call(this.indentation(f)))
                      ),
                      2)
                    : i !== "CATCH" ||
                      ((j = this.tag(g + 2)) !== "OUTDENT" &&
                        j !== "TERMINATOR" &&
                        j !== "FINALLY")
                    ? v.call(p, i) >= 0 &&
                      this.tag(g + 1) !== "INDENT" &&
                      (i !== "ELSE" || this.tag(g + 1) !== "IF")
                      ? ((e = i),
                        (k = this.indentation(f, !0)),
                        (c = k[0]),
                        (d = k[1]),
                        e === "THEN" && (c.fromThen = !0),
                        h.splice(g + 1, 0, c),
                        this.detectEnd(g + 2, b, a),
                        i === "THEN" && h.splice(g, 1),
                        1)
                      : 1
                    : (h.splice.apply(
                        h,
                        [g + 2, 0].concat(w.call(this.indentation(f)))
                      ),
                      4)
                );
              })
            );
          }),
          (a.prototype.tagPostfixConditionals = function () {
            var a, b, c;
            return (
              (c = null),
              (b = function (a, b) {
                var c;
                return (c = a[0]) === "TERMINATOR" || c === "INDENT";
              }),
              (a = function (a, b) {
                if (a[0] !== "INDENT" || (a.generated && !a.fromThen))
                  return (c[0] = "POST_" + c[0]);
              }),
              this.scanTokens(function (d, e) {
                return d[0] !== "IF"
                  ? 1
                  : ((c = d), this.detectEnd(e + 1, b, a), 1);
              })
            );
          }),
          (a.prototype.indentation = function (a, b) {
            var c, d;
            return (
              b == null && (b = !1),
              (c = ["INDENT", 2, a[2]]),
              (d = ["OUTDENT", 2, a[2]]),
              b && (c.generated = d.generated = !0),
              [c, d]
            );
          }),
          (a.prototype.generate = function (a, b, c) {
            var d;
            return (d = [a, b, c]), (d.generated = !0), d;
          }),
          (a.prototype.tag = function (a) {
            var b;
            return (b = this.tokens[a]) != null ? b[0] : void 0;
          }),
          a
        );
      })()),
        (d = [
          ["(", ")"],
          ["[", "]"],
          ["{", "}"],
          ["INDENT", "OUTDENT"],
          ["CALL_START", "CALL_END"],
          ["PARAM_START", "PARAM_END"],
          ["INDEX_START", "INDEX_END"],
        ]),
        (b.INVERSES = m = {}),
        (g = []),
        (f = []);
      for (s = 0, t = d.length; s < t; s++)
        (u = d[s]),
          (q = u[0]),
          (r = u[1]),
          g.push((m[r] = q)),
          f.push((m[q] = r));
      (e = ["CATCH", "WHEN", "ELSE", "FINALLY"].concat(f)),
        (k = [
          "IDENTIFIER",
          "SUPER",
          ")",
          "CALL_END",
          "]",
          "INDEX_END",
          "@",
          "THIS",
        ]),
        (i = [
          "IDENTIFIER",
          "NUMBER",
          "STRING",
          "JS",
          "REGEX",
          "NEW",
          "PARAM_START",
          "CLASS",
          "IF",
          "TRY",
          "SWITCH",
          "THIS",
          "BOOL",
          "UNARY",
          "SUPER",
          "@",
          "->",
          "=>",
          "[",
          "(",
          "{",
          "--",
          "++",
        ]),
        (l = ["+", "-"]),
        (h = ["->", "=>", "{", "[", ","]),
        (j = [
          "POST_IF",
          "FOR",
          "WHILE",
          "UNTIL",
          "WHEN",
          "BY",
          "LOOP",
          "TERMINATOR",
        ]),
        (p = ["ELSE", "->", "=>", "TRY", "FINALLY", "THEN"]),
        (o = [
          "TERMINATOR",
          "CATCH",
          "FINALLY",
          "ELSE",
          "OUTDENT",
          "LEADING_WHEN",
        ]),
        (n = ["TERMINATOR", "INDENT", "OUTDENT"]);
    }
  ),
  define(
    "ace/mode/coffee/helpers",
    ["require", "exports", "module"],
    function (a, b, c) {
      var d, e;
      (b.starts = function (a, b, c) {
        return b === a.substr(c, b.length);
      }),
        (b.ends = function (a, b, c) {
          var d;
          return (d = b.length), b === a.substr(a.length - d - (c || 0), d);
        }),
        (b.compact = function (a) {
          var b, c, d, e;
          e = [];
          for (c = 0, d = a.length; c < d; c++) (b = a[c]), b && e.push(b);
          return e;
        }),
        (b.count = function (a, b) {
          var c, d;
          c = d = 0;
          if (!b.length) return 1 / 0;
          while ((d = 1 + a.indexOf(b, d))) c++;
          return c;
        }),
        (b.merge = function (a, b) {
          return d(d({}, a), b);
        }),
        (d = b.extend =
          function (a, b) {
            var c, d;
            for (c in b) (d = b[c]), (a[c] = d);
            return a;
          }),
        (b.flatten = e =
          function (a) {
            var b, c, d, f;
            c = [];
            for (d = 0, f = a.length; d < f; d++)
              (b = a[d]), b instanceof Array ? (c = c.concat(e(b))) : c.push(b);
            return c;
          }),
        (b.del = function (a, b) {
          var c;
          return (c = a[b]), delete a[b], c;
        }),
        (b.last = function (a, b) {
          return a[a.length - (b || 0) - 1];
        });
    }
  ),
  define(
    "ace/mode/coffee/parser",
    ["require", "exports", "module"],
    function (a, b, c) {
      undefined;
      var d = {
        trace: function () {},
        yy: {},
        symbols_: {
          error: 2,
          Root: 3,
          Body: 4,
          Block: 5,
          TERMINATOR: 6,
          Line: 7,
          Expression: 8,
          Statement: 9,
          Return: 10,
          Comment: 11,
          STATEMENT: 12,
          Value: 13,
          Invocation: 14,
          Code: 15,
          Operation: 16,
          Assign: 17,
          If: 18,
          Try: 19,
          While: 20,
          For: 21,
          Switch: 22,
          Class: 23,
          Throw: 24,
          INDENT: 25,
          OUTDENT: 26,
          Identifier: 27,
          IDENTIFIER: 28,
          AlphaNumeric: 29,
          NUMBER: 30,
          STRING: 31,
          Literal: 32,
          JS: 33,
          REGEX: 34,
          DEBUGGER: 35,
          BOOL: 36,
          Assignable: 37,
          "=": 38,
          AssignObj: 39,
          ObjAssignable: 40,
          ":": 41,
          ThisProperty: 42,
          RETURN: 43,
          HERECOMMENT: 44,
          PARAM_START: 45,
          ParamList: 46,
          PARAM_END: 47,
          FuncGlyph: 48,
          "->": 49,
          "=>": 50,
          OptComma: 51,
          ",": 52,
          Param: 53,
          ParamVar: 54,
          "...": 55,
          Array: 56,
          Object: 57,
          Splat: 58,
          SimpleAssignable: 59,
          Accessor: 60,
          Parenthetical: 61,
          Range: 62,
          This: 63,
          ".": 64,
          "?.": 65,
          "::": 66,
          Index: 67,
          INDEX_START: 68,
          IndexValue: 69,
          INDEX_END: 70,
          INDEX_SOAK: 71,
          Slice: 72,
          "{": 73,
          AssignList: 74,
          "}": 75,
          CLASS: 76,
          EXTENDS: 77,
          OptFuncExist: 78,
          Arguments: 79,
          SUPER: 80,
          FUNC_EXIST: 81,
          CALL_START: 82,
          CALL_END: 83,
          ArgList: 84,
          THIS: 85,
          "@": 86,
          "[": 87,
          "]": 88,
          RangeDots: 89,
          "..": 90,
          Arg: 91,
          SimpleArgs: 92,
          TRY: 93,
          Catch: 94,
          FINALLY: 95,
          CATCH: 96,
          THROW: 97,
          "(": 98,
          ")": 99,
          WhileSource: 100,
          WHILE: 101,
          WHEN: 102,
          UNTIL: 103,
          Loop: 104,
          LOOP: 105,
          ForBody: 106,
          FOR: 107,
          ForStart: 108,
          ForSource: 109,
          ForVariables: 110,
          OWN: 111,
          ForValue: 112,
          FORIN: 113,
          FOROF: 114,
          BY: 115,
          SWITCH: 116,
          Whens: 117,
          ELSE: 118,
          When: 119,
          LEADING_WHEN: 120,
          IfBlock: 121,
          IF: 122,
          POST_IF: 123,
          UNARY: 124,
          "-": 125,
          "+": 126,
          "--": 127,
          "++": 128,
          "?": 129,
          MATH: 130,
          SHIFT: 131,
          COMPARE: 132,
          LOGIC: 133,
          RELATION: 134,
          COMPOUND_ASSIGN: 135,
          $accept: 0,
          $end: 1,
        },
        terminals_: {
          2: "error",
          6: "TERMINATOR",
          12: "STATEMENT",
          25: "INDENT",
          26: "OUTDENT",
          28: "IDENTIFIER",
          30: "NUMBER",
          31: "STRING",
          33: "JS",
          34: "REGEX",
          35: "DEBUGGER",
          36: "BOOL",
          38: "=",
          41: ":",
          43: "RETURN",
          44: "HERECOMMENT",
          45: "PARAM_START",
          47: "PARAM_END",
          49: "->",
          50: "=>",
          52: ",",
          55: "...",
          64: ".",
          65: "?.",
          66: "::",
          68: "INDEX_START",
          70: "INDEX_END",
          71: "INDEX_SOAK",
          73: "{",
          75: "}",
          76: "CLASS",
          77: "EXTENDS",
          80: "SUPER",
          81: "FUNC_EXIST",
          82: "CALL_START",
          83: "CALL_END",
          85: "THIS",
          86: "@",
          87: "[",
          88: "]",
          90: "..",
          93: "TRY",
          95: "FINALLY",
          96: "CATCH",
          97: "THROW",
          98: "(",
          99: ")",
          101: "WHILE",
          102: "WHEN",
          103: "UNTIL",
          105: "LOOP",
          107: "FOR",
          111: "OWN",
          113: "FORIN",
          114: "FOROF",
          115: "BY",
          116: "SWITCH",
          118: "ELSE",
          120: "LEADING_WHEN",
          122: "IF",
          123: "POST_IF",
          124: "UNARY",
          125: "-",
          126: "+",
          127: "--",
          128: "++",
          129: "?",
          130: "MATH",
          131: "SHIFT",
          132: "COMPARE",
          133: "LOGIC",
          134: "RELATION",
          135: "COMPOUND_ASSIGN",
        },
        productions_: [
          0,
          [3, 0],
          [3, 1],
          [3, 2],
          [4, 1],
          [4, 3],
          [4, 2],
          [7, 1],
          [7, 1],
          [9, 1],
          [9, 1],
          [9, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [8, 1],
          [5, 2],
          [5, 3],
          [27, 1],
          [29, 1],
          [29, 1],
          [32, 1],
          [32, 1],
          [32, 1],
          [32, 1],
          [32, 1],
          [17, 3],
          [17, 4],
          [17, 5],
          [39, 1],
          [39, 3],
          [39, 5],
          [39, 1],
          [40, 1],
          [40, 1],
          [40, 1],
          [10, 2],
          [10, 1],
          [11, 1],
          [15, 5],
          [15, 2],
          [48, 1],
          [48, 1],
          [51, 0],
          [51, 1],
          [46, 0],
          [46, 1],
          [46, 3],
          [53, 1],
          [53, 2],
          [53, 3],
          [54, 1],
          [54, 1],
          [54, 1],
          [54, 1],
          [58, 2],
          [59, 1],
          [59, 2],
          [59, 2],
          [59, 1],
          [37, 1],
          [37, 1],
          [37, 1],
          [13, 1],
          [13, 1],
          [13, 1],
          [13, 1],
          [13, 1],
          [60, 2],
          [60, 2],
          [60, 2],
          [60, 1],
          [60, 1],
          [67, 3],
          [67, 2],
          [69, 1],
          [69, 1],
          [57, 4],
          [74, 0],
          [74, 1],
          [74, 3],
          [74, 4],
          [74, 6],
          [23, 1],
          [23, 2],
          [23, 3],
          [23, 4],
          [23, 2],
          [23, 3],
          [23, 4],
          [23, 5],
          [14, 3],
          [14, 3],
          [14, 1],
          [14, 2],
          [78, 0],
          [78, 1],
          [79, 2],
          [79, 4],
          [63, 1],
          [63, 1],
          [42, 2],
          [56, 2],
          [56, 4],
          [89, 1],
          [89, 1],
          [62, 5],
          [72, 3],
          [72, 2],
          [72, 2],
          [72, 1],
          [84, 1],
          [84, 3],
          [84, 4],
          [84, 4],
          [84, 6],
          [91, 1],
          [91, 1],
          [92, 1],
          [92, 3],
          [19, 2],
          [19, 3],
          [19, 4],
          [19, 5],
          [94, 3],
          [24, 2],
          [61, 3],
          [61, 5],
          [100, 2],
          [100, 4],
          [100, 2],
          [100, 4],
          [20, 2],
          [20, 2],
          [20, 2],
          [20, 1],
          [104, 2],
          [104, 2],
          [21, 2],
          [21, 2],
          [21, 2],
          [106, 2],
          [106, 2],
          [108, 2],
          [108, 3],
          [112, 1],
          [112, 1],
          [112, 1],
          [110, 1],
          [110, 3],
          [109, 2],
          [109, 2],
          [109, 4],
          [109, 4],
          [109, 4],
          [109, 6],
          [109, 6],
          [22, 5],
          [22, 7],
          [22, 4],
          [22, 6],
          [117, 1],
          [117, 2],
          [119, 3],
          [119, 4],
          [121, 3],
          [121, 5],
          [18, 1],
          [18, 3],
          [18, 3],
          [18, 3],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 2],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 3],
          [16, 5],
          [16, 3],
        ],
        performAction: function (b, c, d, e, f, g, h) {
          var i = g.length - 1;
          switch (f) {
            case 1:
              return (this.$ = new e.Block());
            case 2:
              return (this.$ = g[i]);
            case 3:
              return (this.$ = g[i - 1]);
            case 4:
              this.$ = e.Block.wrap([g[i]]);
              break;
            case 5:
              this.$ = g[i - 2].push(g[i]);
              break;
            case 6:
              this.$ = g[i - 1];
              break;
            case 7:
              this.$ = g[i];
              break;
            case 8:
              this.$ = g[i];
              break;
            case 9:
              this.$ = g[i];
              break;
            case 10:
              this.$ = g[i];
              break;
            case 11:
              this.$ = new e.Literal(g[i]);
              break;
            case 12:
              this.$ = g[i];
              break;
            case 13:
              this.$ = g[i];
              break;
            case 14:
              this.$ = g[i];
              break;
            case 15:
              this.$ = g[i];
              break;
            case 16:
              this.$ = g[i];
              break;
            case 17:
              this.$ = g[i];
              break;
            case 18:
              this.$ = g[i];
              break;
            case 19:
              this.$ = g[i];
              break;
            case 20:
              this.$ = g[i];
              break;
            case 21:
              this.$ = g[i];
              break;
            case 22:
              this.$ = g[i];
              break;
            case 23:
              this.$ = g[i];
              break;
            case 24:
              this.$ = new e.Block();
              break;
            case 25:
              this.$ = g[i - 1];
              break;
            case 26:
              this.$ = new e.Literal(g[i]);
              break;
            case 27:
              this.$ = new e.Literal(g[i]);
              break;
            case 28:
              this.$ = new e.Literal(g[i]);
              break;
            case 29:
              this.$ = g[i];
              break;
            case 30:
              this.$ = new e.Literal(g[i]);
              break;
            case 31:
              this.$ = new e.Literal(g[i]);
              break;
            case 32:
              this.$ = new e.Literal(g[i]);
              break;
            case 33:
              this.$ = (function () {
                var a;
                return (
                  (a = new e.Literal(g[i])),
                  g[i] === "undefined" && (a.isUndefined = !0),
                  a
                );
              })();
              break;
            case 34:
              this.$ = new e.Assign(g[i - 2], g[i]);
              break;
            case 35:
              this.$ = new e.Assign(g[i - 3], g[i]);
              break;
            case 36:
              this.$ = new e.Assign(g[i - 4], g[i - 1]);
              break;
            case 37:
              this.$ = new e.Value(g[i]);
              break;
            case 38:
              this.$ = new e.Assign(new e.Value(g[i - 2]), g[i], "object");
              break;
            case 39:
              this.$ = new e.Assign(new e.Value(g[i - 4]), g[i - 1], "object");
              break;
            case 40:
              this.$ = g[i];
              break;
            case 41:
              this.$ = g[i];
              break;
            case 42:
              this.$ = g[i];
              break;
            case 43:
              this.$ = g[i];
              break;
            case 44:
              this.$ = new e.Return(g[i]);
              break;
            case 45:
              this.$ = new e.Return();
              break;
            case 46:
              this.$ = new e.Comment(g[i]);
              break;
            case 47:
              this.$ = new e.Code(g[i - 3], g[i], g[i - 1]);
              break;
            case 48:
              this.$ = new e.Code([], g[i], g[i - 1]);
              break;
            case 49:
              this.$ = "func";
              break;
            case 50:
              this.$ = "boundfunc";
              break;
            case 51:
              this.$ = g[i];
              break;
            case 52:
              this.$ = g[i];
              break;
            case 53:
              this.$ = [];
              break;
            case 54:
              this.$ = [g[i]];
              break;
            case 55:
              this.$ = g[i - 2].concat(g[i]);
              break;
            case 56:
              this.$ = new e.Param(g[i]);
              break;
            case 57:
              this.$ = new e.Param(g[i - 1], null, !0);
              break;
            case 58:
              this.$ = new e.Param(g[i - 2], g[i]);
              break;
            case 59:
              this.$ = g[i];
              break;
            case 60:
              this.$ = g[i];
              break;
            case 61:
              this.$ = g[i];
              break;
            case 62:
              this.$ = g[i];
              break;
            case 63:
              this.$ = new e.Splat(g[i - 1]);
              break;
            case 64:
              this.$ = new e.Value(g[i]);
              break;
            case 65:
              this.$ = g[i - 1].add(g[i]);
              break;
            case 66:
              this.$ = new e.Value(g[i - 1], [].concat(g[i]));
              break;
            case 67:
              this.$ = g[i];
              break;
            case 68:
              this.$ = g[i];
              break;
            case 69:
              this.$ = new e.Value(g[i]);
              break;
            case 70:
              this.$ = new e.Value(g[i]);
              break;
            case 71:
              this.$ = g[i];
              break;
            case 72:
              this.$ = new e.Value(g[i]);
              break;
            case 73:
              this.$ = new e.Value(g[i]);
              break;
            case 74:
              this.$ = new e.Value(g[i]);
              break;
            case 75:
              this.$ = g[i];
              break;
            case 76:
              this.$ = new e.Access(g[i]);
              break;
            case 77:
              this.$ = new e.Access(g[i], "soak");
              break;
            case 78:
              this.$ = [
                new e.Access(new e.Literal("prototype")),
                new e.Access(g[i]),
              ];
              break;
            case 79:
              this.$ = new e.Access(new e.Literal("prototype"));
              break;
            case 80:
              this.$ = g[i];
              break;
            case 81:
              this.$ = g[i - 1];
              break;
            case 82:
              this.$ = e.extend(g[i], { soak: !0 });
              break;
            case 83:
              this.$ = new e.Index(g[i]);
              break;
            case 84:
              this.$ = new e.Slice(g[i]);
              break;
            case 85:
              this.$ = new e.Obj(g[i - 2], g[i - 3].generated);
              break;
            case 86:
              this.$ = [];
              break;
            case 87:
              this.$ = [g[i]];
              break;
            case 88:
              this.$ = g[i - 2].concat(g[i]);
              break;
            case 89:
              this.$ = g[i - 3].concat(g[i]);
              break;
            case 90:
              this.$ = g[i - 5].concat(g[i - 2]);
              break;
            case 91:
              this.$ = new e.Class();
              break;
            case 92:
              this.$ = new e.Class(null, null, g[i]);
              break;
            case 93:
              this.$ = new e.Class(null, g[i]);
              break;
            case 94:
              this.$ = new e.Class(null, g[i - 1], g[i]);
              break;
            case 95:
              this.$ = new e.Class(g[i]);
              break;
            case 96:
              this.$ = new e.Class(g[i - 1], null, g[i]);
              break;
            case 97:
              this.$ = new e.Class(g[i - 2], g[i]);
              break;
            case 98:
              this.$ = new e.Class(g[i - 3], g[i - 1], g[i]);
              break;
            case 99:
              this.$ = new e.Call(g[i - 2], g[i], g[i - 1]);
              break;
            case 100:
              this.$ = new e.Call(g[i - 2], g[i], g[i - 1]);
              break;
            case 101:
              this.$ = new e.Call("super", [
                new e.Splat(new e.Literal("arguments")),
              ]);
              break;
            case 102:
              this.$ = new e.Call("super", g[i]);
              break;
            case 103:
              this.$ = !1;
              break;
            case 104:
              this.$ = !0;
              break;
            case 105:
              this.$ = [];
              break;
            case 106:
              this.$ = g[i - 2];
              break;
            case 107:
              this.$ = new e.Value(new e.Literal("this"));
              break;
            case 108:
              this.$ = new e.Value(new e.Literal("this"));
              break;
            case 109:
              this.$ = new e.Value(
                new e.Literal("this"),
                [new e.Access(g[i])],
                "this"
              );
              break;
            case 110:
              this.$ = new e.Arr([]);
              break;
            case 111:
              this.$ = new e.Arr(g[i - 2]);
              break;
            case 112:
              this.$ = "inclusive";
              break;
            case 113:
              this.$ = "exclusive";
              break;
            case 114:
              this.$ = new e.Range(g[i - 3], g[i - 1], g[i - 2]);
              break;
            case 115:
              this.$ = new e.Range(g[i - 2], g[i], g[i - 1]);
              break;
            case 116:
              this.$ = new e.Range(g[i - 1], null, g[i]);
              break;
            case 117:
              this.$ = new e.Range(null, g[i], g[i - 1]);
              break;
            case 118:
              this.$ = new e.Range(null, null, g[i]);
              break;
            case 119:
              this.$ = [g[i]];
              break;
            case 120:
              this.$ = g[i - 2].concat(g[i]);
              break;
            case 121:
              this.$ = g[i - 3].concat(g[i]);
              break;
            case 122:
              this.$ = g[i - 2];
              break;
            case 123:
              this.$ = g[i - 5].concat(g[i - 2]);
              break;
            case 124:
              this.$ = g[i];
              break;
            case 125:
              this.$ = g[i];
              break;
            case 126:
              this.$ = g[i];
              break;
            case 127:
              this.$ = [].concat(g[i - 2], g[i]);
              break;
            case 128:
              this.$ = new e.Try(g[i]);
              break;
            case 129:
              this.$ = new e.Try(g[i - 1], g[i][0], g[i][1]);
              break;
            case 130:
              this.$ = new e.Try(g[i - 2], null, null, g[i]);
              break;
            case 131:
              this.$ = new e.Try(g[i - 3], g[i - 2][0], g[i - 2][1], g[i]);
              break;
            case 132:
              this.$ = [g[i - 1], g[i]];
              break;
            case 133:
              this.$ = new e.Throw(g[i]);
              break;
            case 134:
              this.$ = new e.Parens(g[i - 1]);
              break;
            case 135:
              this.$ = new e.Parens(g[i - 2]);
              break;
            case 136:
              this.$ = new e.While(g[i]);
              break;
            case 137:
              this.$ = new e.While(g[i - 2], { guard: g[i] });
              break;
            case 138:
              this.$ = new e.While(g[i], { invert: !0 });
              break;
            case 139:
              this.$ = new e.While(g[i - 2], { invert: !0, guard: g[i] });
              break;
            case 140:
              this.$ = g[i - 1].addBody(g[i]);
              break;
            case 141:
              this.$ = g[i].addBody(e.Block.wrap([g[i - 1]]));
              break;
            case 142:
              this.$ = g[i].addBody(e.Block.wrap([g[i - 1]]));
              break;
            case 143:
              this.$ = g[i];
              break;
            case 144:
              this.$ = new e.While(new e.Literal("true")).addBody(g[i]);
              break;
            case 145:
              this.$ = new e.While(new e.Literal("true")).addBody(
                e.Block.wrap([g[i]])
              );
              break;
            case 146:
              this.$ = new e.For(g[i - 1], g[i]);
              break;
            case 147:
              this.$ = new e.For(g[i - 1], g[i]);
              break;
            case 148:
              this.$ = new e.For(g[i], g[i - 1]);
              break;
            case 149:
              this.$ = { source: new e.Value(g[i]) };
              break;
            case 150:
              this.$ = (function () {
                return (
                  (g[i].own = g[i - 1].own),
                  (g[i].name = g[i - 1][0]),
                  (g[i].index = g[i - 1][1]),
                  g[i]
                );
              })();
              break;
            case 151:
              this.$ = g[i];
              break;
            case 152:
              this.$ = (function () {
                return (g[i].own = !0), g[i];
              })();
              break;
            case 153:
              this.$ = g[i];
              break;
            case 154:
              this.$ = new e.Value(g[i]);
              break;
            case 155:
              this.$ = new e.Value(g[i]);
              break;
            case 156:
              this.$ = [g[i]];
              break;
            case 157:
              this.$ = [g[i - 2], g[i]];
              break;
            case 158:
              this.$ = { source: g[i] };
              break;
            case 159:
              this.$ = { source: g[i], object: !0 };
              break;
            case 160:
              this.$ = { source: g[i - 2], guard: g[i] };
              break;
            case 161:
              this.$ = { source: g[i - 2], guard: g[i], object: !0 };
              break;
            case 162:
              this.$ = { source: g[i - 2], step: g[i] };
              break;
            case 163:
              this.$ = { source: g[i - 4], guard: g[i - 2], step: g[i] };
              break;
            case 164:
              this.$ = { source: g[i - 4], step: g[i - 2], guard: g[i] };
              break;
            case 165:
              this.$ = new e.Switch(g[i - 3], g[i - 1]);
              break;
            case 166:
              this.$ = new e.Switch(g[i - 5], g[i - 3], g[i - 1]);
              break;
            case 167:
              this.$ = new e.Switch(null, g[i - 1]);
              break;
            case 168:
              this.$ = new e.Switch(null, g[i - 3], g[i - 1]);
              break;
            case 169:
              this.$ = g[i];
              break;
            case 170:
              this.$ = g[i - 1].concat(g[i]);
              break;
            case 171:
              this.$ = [[g[i - 1], g[i]]];
              break;
            case 172:
              this.$ = [[g[i - 2], g[i - 1]]];
              break;
            case 173:
              this.$ = new e.If(g[i - 1], g[i], { type: g[i - 2] });
              break;
            case 174:
              this.$ = g[i - 4].addElse(
                new e.If(g[i - 1], g[i], { type: g[i - 2] })
              );
              break;
            case 175:
              this.$ = g[i];
              break;
            case 176:
              this.$ = g[i - 2].addElse(g[i]);
              break;
            case 177:
              this.$ = new e.If(g[i], e.Block.wrap([g[i - 2]]), {
                type: g[i - 1],
                statement: !0,
              });
              break;
            case 178:
              this.$ = new e.If(g[i], e.Block.wrap([g[i - 2]]), {
                type: g[i - 1],
                statement: !0,
              });
              break;
            case 179:
              this.$ = new e.Op(g[i - 1], g[i]);
              break;
            case 180:
              this.$ = new e.Op("-", g[i]);
              break;
            case 181:
              this.$ = new e.Op("+", g[i]);
              break;
            case 182:
              this.$ = new e.Op("--", g[i]);
              break;
            case 183:
              this.$ = new e.Op("++", g[i]);
              break;
            case 184:
              this.$ = new e.Op("--", g[i - 1], null, !0);
              break;
            case 185:
              this.$ = new e.Op("++", g[i - 1], null, !0);
              break;
            case 186:
              this.$ = new e.Existence(g[i - 1]);
              break;
            case 187:
              this.$ = new e.Op("+", g[i - 2], g[i]);
              break;
            case 188:
              this.$ = new e.Op("-", g[i - 2], g[i]);
              break;
            case 189:
              this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
              break;
            case 190:
              this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
              break;
            case 191:
              this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
              break;
            case 192:
              this.$ = new e.Op(g[i - 1], g[i - 2], g[i]);
              break;
            case 193:
              this.$ = (function () {
                return g[i - 1].charAt(0) === "!"
                  ? new e.Op(g[i - 1].slice(1), g[i - 2], g[i]).invert()
                  : new e.Op(g[i - 1], g[i - 2], g[i]);
              })();
              break;
            case 194:
              this.$ = new e.Assign(g[i - 2], g[i], g[i - 1]);
              break;
            case 195:
              this.$ = new e.Assign(g[i - 4], g[i - 1], g[i - 3]);
              break;
            case 196:
              this.$ = new e.Extends(g[i - 2], g[i]);
          }
        },
        table: [
          {
            1: [2, 1],
            3: 1,
            4: 2,
            5: 3,
            7: 4,
            8: 6,
            9: 7,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 5],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 1: [3] },
          { 1: [2, 2], 6: [1, 72] },
          { 6: [1, 73] },
          { 1: [2, 4], 6: [2, 4], 26: [2, 4], 99: [2, 4] },
          {
            4: 75,
            7: 4,
            8: 6,
            9: 7,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            26: [1, 74],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 7],
            6: [2, 7],
            26: [2, 7],
            99: [2, 7],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 8],
            6: [2, 8],
            26: [2, 8],
            99: [2, 8],
            100: 88,
            101: [1, 63],
            103: [1, 64],
            106: 89,
            107: [1, 66],
            108: 67,
            123: [1, 87],
          },
          {
            1: [2, 12],
            6: [2, 12],
            25: [2, 12],
            26: [2, 12],
            47: [2, 12],
            52: [2, 12],
            55: [2, 12],
            60: 91,
            64: [1, 93],
            65: [1, 94],
            66: [1, 95],
            67: 96,
            68: [1, 97],
            70: [2, 12],
            71: [1, 98],
            75: [2, 12],
            78: 90,
            81: [1, 92],
            82: [2, 103],
            83: [2, 12],
            88: [2, 12],
            90: [2, 12],
            99: [2, 12],
            101: [2, 12],
            102: [2, 12],
            103: [2, 12],
            107: [2, 12],
            115: [2, 12],
            123: [2, 12],
            125: [2, 12],
            126: [2, 12],
            129: [2, 12],
            130: [2, 12],
            131: [2, 12],
            132: [2, 12],
            133: [2, 12],
            134: [2, 12],
          },
          {
            1: [2, 13],
            6: [2, 13],
            25: [2, 13],
            26: [2, 13],
            47: [2, 13],
            52: [2, 13],
            55: [2, 13],
            60: 100,
            64: [1, 93],
            65: [1, 94],
            66: [1, 95],
            67: 96,
            68: [1, 97],
            70: [2, 13],
            71: [1, 98],
            75: [2, 13],
            78: 99,
            81: [1, 92],
            82: [2, 103],
            83: [2, 13],
            88: [2, 13],
            90: [2, 13],
            99: [2, 13],
            101: [2, 13],
            102: [2, 13],
            103: [2, 13],
            107: [2, 13],
            115: [2, 13],
            123: [2, 13],
            125: [2, 13],
            126: [2, 13],
            129: [2, 13],
            130: [2, 13],
            131: [2, 13],
            132: [2, 13],
            133: [2, 13],
            134: [2, 13],
          },
          {
            1: [2, 14],
            6: [2, 14],
            25: [2, 14],
            26: [2, 14],
            47: [2, 14],
            52: [2, 14],
            55: [2, 14],
            70: [2, 14],
            75: [2, 14],
            83: [2, 14],
            88: [2, 14],
            90: [2, 14],
            99: [2, 14],
            101: [2, 14],
            102: [2, 14],
            103: [2, 14],
            107: [2, 14],
            115: [2, 14],
            123: [2, 14],
            125: [2, 14],
            126: [2, 14],
            129: [2, 14],
            130: [2, 14],
            131: [2, 14],
            132: [2, 14],
            133: [2, 14],
            134: [2, 14],
          },
          {
            1: [2, 15],
            6: [2, 15],
            25: [2, 15],
            26: [2, 15],
            47: [2, 15],
            52: [2, 15],
            55: [2, 15],
            70: [2, 15],
            75: [2, 15],
            83: [2, 15],
            88: [2, 15],
            90: [2, 15],
            99: [2, 15],
            101: [2, 15],
            102: [2, 15],
            103: [2, 15],
            107: [2, 15],
            115: [2, 15],
            123: [2, 15],
            125: [2, 15],
            126: [2, 15],
            129: [2, 15],
            130: [2, 15],
            131: [2, 15],
            132: [2, 15],
            133: [2, 15],
            134: [2, 15],
          },
          {
            1: [2, 16],
            6: [2, 16],
            25: [2, 16],
            26: [2, 16],
            47: [2, 16],
            52: [2, 16],
            55: [2, 16],
            70: [2, 16],
            75: [2, 16],
            83: [2, 16],
            88: [2, 16],
            90: [2, 16],
            99: [2, 16],
            101: [2, 16],
            102: [2, 16],
            103: [2, 16],
            107: [2, 16],
            115: [2, 16],
            123: [2, 16],
            125: [2, 16],
            126: [2, 16],
            129: [2, 16],
            130: [2, 16],
            131: [2, 16],
            132: [2, 16],
            133: [2, 16],
            134: [2, 16],
          },
          {
            1: [2, 17],
            6: [2, 17],
            25: [2, 17],
            26: [2, 17],
            47: [2, 17],
            52: [2, 17],
            55: [2, 17],
            70: [2, 17],
            75: [2, 17],
            83: [2, 17],
            88: [2, 17],
            90: [2, 17],
            99: [2, 17],
            101: [2, 17],
            102: [2, 17],
            103: [2, 17],
            107: [2, 17],
            115: [2, 17],
            123: [2, 17],
            125: [2, 17],
            126: [2, 17],
            129: [2, 17],
            130: [2, 17],
            131: [2, 17],
            132: [2, 17],
            133: [2, 17],
            134: [2, 17],
          },
          {
            1: [2, 18],
            6: [2, 18],
            25: [2, 18],
            26: [2, 18],
            47: [2, 18],
            52: [2, 18],
            55: [2, 18],
            70: [2, 18],
            75: [2, 18],
            83: [2, 18],
            88: [2, 18],
            90: [2, 18],
            99: [2, 18],
            101: [2, 18],
            102: [2, 18],
            103: [2, 18],
            107: [2, 18],
            115: [2, 18],
            123: [2, 18],
            125: [2, 18],
            126: [2, 18],
            129: [2, 18],
            130: [2, 18],
            131: [2, 18],
            132: [2, 18],
            133: [2, 18],
            134: [2, 18],
          },
          {
            1: [2, 19],
            6: [2, 19],
            25: [2, 19],
            26: [2, 19],
            47: [2, 19],
            52: [2, 19],
            55: [2, 19],
            70: [2, 19],
            75: [2, 19],
            83: [2, 19],
            88: [2, 19],
            90: [2, 19],
            99: [2, 19],
            101: [2, 19],
            102: [2, 19],
            103: [2, 19],
            107: [2, 19],
            115: [2, 19],
            123: [2, 19],
            125: [2, 19],
            126: [2, 19],
            129: [2, 19],
            130: [2, 19],
            131: [2, 19],
            132: [2, 19],
            133: [2, 19],
            134: [2, 19],
          },
          {
            1: [2, 20],
            6: [2, 20],
            25: [2, 20],
            26: [2, 20],
            47: [2, 20],
            52: [2, 20],
            55: [2, 20],
            70: [2, 20],
            75: [2, 20],
            83: [2, 20],
            88: [2, 20],
            90: [2, 20],
            99: [2, 20],
            101: [2, 20],
            102: [2, 20],
            103: [2, 20],
            107: [2, 20],
            115: [2, 20],
            123: [2, 20],
            125: [2, 20],
            126: [2, 20],
            129: [2, 20],
            130: [2, 20],
            131: [2, 20],
            132: [2, 20],
            133: [2, 20],
            134: [2, 20],
          },
          {
            1: [2, 21],
            6: [2, 21],
            25: [2, 21],
            26: [2, 21],
            47: [2, 21],
            52: [2, 21],
            55: [2, 21],
            70: [2, 21],
            75: [2, 21],
            83: [2, 21],
            88: [2, 21],
            90: [2, 21],
            99: [2, 21],
            101: [2, 21],
            102: [2, 21],
            103: [2, 21],
            107: [2, 21],
            115: [2, 21],
            123: [2, 21],
            125: [2, 21],
            126: [2, 21],
            129: [2, 21],
            130: [2, 21],
            131: [2, 21],
            132: [2, 21],
            133: [2, 21],
            134: [2, 21],
          },
          {
            1: [2, 22],
            6: [2, 22],
            25: [2, 22],
            26: [2, 22],
            47: [2, 22],
            52: [2, 22],
            55: [2, 22],
            70: [2, 22],
            75: [2, 22],
            83: [2, 22],
            88: [2, 22],
            90: [2, 22],
            99: [2, 22],
            101: [2, 22],
            102: [2, 22],
            103: [2, 22],
            107: [2, 22],
            115: [2, 22],
            123: [2, 22],
            125: [2, 22],
            126: [2, 22],
            129: [2, 22],
            130: [2, 22],
            131: [2, 22],
            132: [2, 22],
            133: [2, 22],
            134: [2, 22],
          },
          {
            1: [2, 23],
            6: [2, 23],
            25: [2, 23],
            26: [2, 23],
            47: [2, 23],
            52: [2, 23],
            55: [2, 23],
            70: [2, 23],
            75: [2, 23],
            83: [2, 23],
            88: [2, 23],
            90: [2, 23],
            99: [2, 23],
            101: [2, 23],
            102: [2, 23],
            103: [2, 23],
            107: [2, 23],
            115: [2, 23],
            123: [2, 23],
            125: [2, 23],
            126: [2, 23],
            129: [2, 23],
            130: [2, 23],
            131: [2, 23],
            132: [2, 23],
            133: [2, 23],
            134: [2, 23],
          },
          {
            1: [2, 9],
            6: [2, 9],
            26: [2, 9],
            99: [2, 9],
            101: [2, 9],
            103: [2, 9],
            107: [2, 9],
            123: [2, 9],
          },
          {
            1: [2, 10],
            6: [2, 10],
            26: [2, 10],
            99: [2, 10],
            101: [2, 10],
            103: [2, 10],
            107: [2, 10],
            123: [2, 10],
          },
          {
            1: [2, 11],
            6: [2, 11],
            26: [2, 11],
            99: [2, 11],
            101: [2, 11],
            103: [2, 11],
            107: [2, 11],
            123: [2, 11],
          },
          {
            1: [2, 71],
            6: [2, 71],
            25: [2, 71],
            26: [2, 71],
            38: [1, 101],
            47: [2, 71],
            52: [2, 71],
            55: [2, 71],
            64: [2, 71],
            65: [2, 71],
            66: [2, 71],
            68: [2, 71],
            70: [2, 71],
            71: [2, 71],
            75: [2, 71],
            81: [2, 71],
            82: [2, 71],
            83: [2, 71],
            88: [2, 71],
            90: [2, 71],
            99: [2, 71],
            101: [2, 71],
            102: [2, 71],
            103: [2, 71],
            107: [2, 71],
            115: [2, 71],
            123: [2, 71],
            125: [2, 71],
            126: [2, 71],
            129: [2, 71],
            130: [2, 71],
            131: [2, 71],
            132: [2, 71],
            133: [2, 71],
            134: [2, 71],
          },
          {
            1: [2, 72],
            6: [2, 72],
            25: [2, 72],
            26: [2, 72],
            47: [2, 72],
            52: [2, 72],
            55: [2, 72],
            64: [2, 72],
            65: [2, 72],
            66: [2, 72],
            68: [2, 72],
            70: [2, 72],
            71: [2, 72],
            75: [2, 72],
            81: [2, 72],
            82: [2, 72],
            83: [2, 72],
            88: [2, 72],
            90: [2, 72],
            99: [2, 72],
            101: [2, 72],
            102: [2, 72],
            103: [2, 72],
            107: [2, 72],
            115: [2, 72],
            123: [2, 72],
            125: [2, 72],
            126: [2, 72],
            129: [2, 72],
            130: [2, 72],
            131: [2, 72],
            132: [2, 72],
            133: [2, 72],
            134: [2, 72],
          },
          {
            1: [2, 73],
            6: [2, 73],
            25: [2, 73],
            26: [2, 73],
            47: [2, 73],
            52: [2, 73],
            55: [2, 73],
            64: [2, 73],
            65: [2, 73],
            66: [2, 73],
            68: [2, 73],
            70: [2, 73],
            71: [2, 73],
            75: [2, 73],
            81: [2, 73],
            82: [2, 73],
            83: [2, 73],
            88: [2, 73],
            90: [2, 73],
            99: [2, 73],
            101: [2, 73],
            102: [2, 73],
            103: [2, 73],
            107: [2, 73],
            115: [2, 73],
            123: [2, 73],
            125: [2, 73],
            126: [2, 73],
            129: [2, 73],
            130: [2, 73],
            131: [2, 73],
            132: [2, 73],
            133: [2, 73],
            134: [2, 73],
          },
          {
            1: [2, 74],
            6: [2, 74],
            25: [2, 74],
            26: [2, 74],
            47: [2, 74],
            52: [2, 74],
            55: [2, 74],
            64: [2, 74],
            65: [2, 74],
            66: [2, 74],
            68: [2, 74],
            70: [2, 74],
            71: [2, 74],
            75: [2, 74],
            81: [2, 74],
            82: [2, 74],
            83: [2, 74],
            88: [2, 74],
            90: [2, 74],
            99: [2, 74],
            101: [2, 74],
            102: [2, 74],
            103: [2, 74],
            107: [2, 74],
            115: [2, 74],
            123: [2, 74],
            125: [2, 74],
            126: [2, 74],
            129: [2, 74],
            130: [2, 74],
            131: [2, 74],
            132: [2, 74],
            133: [2, 74],
            134: [2, 74],
          },
          {
            1: [2, 75],
            6: [2, 75],
            25: [2, 75],
            26: [2, 75],
            47: [2, 75],
            52: [2, 75],
            55: [2, 75],
            64: [2, 75],
            65: [2, 75],
            66: [2, 75],
            68: [2, 75],
            70: [2, 75],
            71: [2, 75],
            75: [2, 75],
            81: [2, 75],
            82: [2, 75],
            83: [2, 75],
            88: [2, 75],
            90: [2, 75],
            99: [2, 75],
            101: [2, 75],
            102: [2, 75],
            103: [2, 75],
            107: [2, 75],
            115: [2, 75],
            123: [2, 75],
            125: [2, 75],
            126: [2, 75],
            129: [2, 75],
            130: [2, 75],
            131: [2, 75],
            132: [2, 75],
            133: [2, 75],
            134: [2, 75],
          },
          {
            1: [2, 101],
            6: [2, 101],
            25: [2, 101],
            26: [2, 101],
            47: [2, 101],
            52: [2, 101],
            55: [2, 101],
            64: [2, 101],
            65: [2, 101],
            66: [2, 101],
            68: [2, 101],
            70: [2, 101],
            71: [2, 101],
            75: [2, 101],
            79: 102,
            81: [2, 101],
            82: [1, 103],
            83: [2, 101],
            88: [2, 101],
            90: [2, 101],
            99: [2, 101],
            101: [2, 101],
            102: [2, 101],
            103: [2, 101],
            107: [2, 101],
            115: [2, 101],
            123: [2, 101],
            125: [2, 101],
            126: [2, 101],
            129: [2, 101],
            130: [2, 101],
            131: [2, 101],
            132: [2, 101],
            133: [2, 101],
            134: [2, 101],
          },
          {
            27: 107,
            28: [1, 71],
            42: 108,
            46: 104,
            47: [2, 53],
            52: [2, 53],
            53: 105,
            54: 106,
            56: 109,
            57: 110,
            73: [1, 68],
            86: [1, 111],
            87: [1, 112],
          },
          { 5: 113, 25: [1, 5] },
          {
            8: 114,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 116,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 117,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            13: 119,
            14: 120,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 121,
            42: 61,
            56: 47,
            57: 48,
            59: 118,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            98: [1, 54],
          },
          {
            13: 119,
            14: 120,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 121,
            42: 61,
            56: 47,
            57: 48,
            59: 122,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            98: [1, 54],
          },
          {
            1: [2, 68],
            6: [2, 68],
            25: [2, 68],
            26: [2, 68],
            38: [2, 68],
            47: [2, 68],
            52: [2, 68],
            55: [2, 68],
            64: [2, 68],
            65: [2, 68],
            66: [2, 68],
            68: [2, 68],
            70: [2, 68],
            71: [2, 68],
            75: [2, 68],
            77: [1, 126],
            81: [2, 68],
            82: [2, 68],
            83: [2, 68],
            88: [2, 68],
            90: [2, 68],
            99: [2, 68],
            101: [2, 68],
            102: [2, 68],
            103: [2, 68],
            107: [2, 68],
            115: [2, 68],
            123: [2, 68],
            125: [2, 68],
            126: [2, 68],
            127: [1, 123],
            128: [1, 124],
            129: [2, 68],
            130: [2, 68],
            131: [2, 68],
            132: [2, 68],
            133: [2, 68],
            134: [2, 68],
            135: [1, 125],
          },
          {
            1: [2, 175],
            6: [2, 175],
            25: [2, 175],
            26: [2, 175],
            47: [2, 175],
            52: [2, 175],
            55: [2, 175],
            70: [2, 175],
            75: [2, 175],
            83: [2, 175],
            88: [2, 175],
            90: [2, 175],
            99: [2, 175],
            101: [2, 175],
            102: [2, 175],
            103: [2, 175],
            107: [2, 175],
            115: [2, 175],
            118: [1, 127],
            123: [2, 175],
            125: [2, 175],
            126: [2, 175],
            129: [2, 175],
            130: [2, 175],
            131: [2, 175],
            132: [2, 175],
            133: [2, 175],
            134: [2, 175],
          },
          { 5: 128, 25: [1, 5] },
          { 5: 129, 25: [1, 5] },
          {
            1: [2, 143],
            6: [2, 143],
            25: [2, 143],
            26: [2, 143],
            47: [2, 143],
            52: [2, 143],
            55: [2, 143],
            70: [2, 143],
            75: [2, 143],
            83: [2, 143],
            88: [2, 143],
            90: [2, 143],
            99: [2, 143],
            101: [2, 143],
            102: [2, 143],
            103: [2, 143],
            107: [2, 143],
            115: [2, 143],
            123: [2, 143],
            125: [2, 143],
            126: [2, 143],
            129: [2, 143],
            130: [2, 143],
            131: [2, 143],
            132: [2, 143],
            133: [2, 143],
            134: [2, 143],
          },
          { 5: 130, 25: [1, 5] },
          {
            8: 131,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 132],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 91],
            5: 133,
            6: [2, 91],
            13: 119,
            14: 120,
            25: [1, 5],
            26: [2, 91],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 121,
            42: 61,
            47: [2, 91],
            52: [2, 91],
            55: [2, 91],
            56: 47,
            57: 48,
            59: 135,
            61: 25,
            62: 26,
            63: 27,
            70: [2, 91],
            73: [1, 68],
            75: [2, 91],
            77: [1, 134],
            80: [1, 28],
            83: [2, 91],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            88: [2, 91],
            90: [2, 91],
            98: [1, 54],
            99: [2, 91],
            101: [2, 91],
            102: [2, 91],
            103: [2, 91],
            107: [2, 91],
            115: [2, 91],
            123: [2, 91],
            125: [2, 91],
            126: [2, 91],
            129: [2, 91],
            130: [2, 91],
            131: [2, 91],
            132: [2, 91],
            133: [2, 91],
            134: [2, 91],
          },
          {
            8: 136,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 45],
            6: [2, 45],
            8: 137,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            26: [2, 45],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            99: [2, 45],
            100: 39,
            101: [2, 45],
            103: [2, 45],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [2, 45],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            123: [2, 45],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 46],
            6: [2, 46],
            25: [2, 46],
            26: [2, 46],
            52: [2, 46],
            75: [2, 46],
            99: [2, 46],
            101: [2, 46],
            103: [2, 46],
            107: [2, 46],
            123: [2, 46],
          },
          {
            1: [2, 69],
            6: [2, 69],
            25: [2, 69],
            26: [2, 69],
            38: [2, 69],
            47: [2, 69],
            52: [2, 69],
            55: [2, 69],
            64: [2, 69],
            65: [2, 69],
            66: [2, 69],
            68: [2, 69],
            70: [2, 69],
            71: [2, 69],
            75: [2, 69],
            81: [2, 69],
            82: [2, 69],
            83: [2, 69],
            88: [2, 69],
            90: [2, 69],
            99: [2, 69],
            101: [2, 69],
            102: [2, 69],
            103: [2, 69],
            107: [2, 69],
            115: [2, 69],
            123: [2, 69],
            125: [2, 69],
            126: [2, 69],
            129: [2, 69],
            130: [2, 69],
            131: [2, 69],
            132: [2, 69],
            133: [2, 69],
            134: [2, 69],
          },
          {
            1: [2, 70],
            6: [2, 70],
            25: [2, 70],
            26: [2, 70],
            38: [2, 70],
            47: [2, 70],
            52: [2, 70],
            55: [2, 70],
            64: [2, 70],
            65: [2, 70],
            66: [2, 70],
            68: [2, 70],
            70: [2, 70],
            71: [2, 70],
            75: [2, 70],
            81: [2, 70],
            82: [2, 70],
            83: [2, 70],
            88: [2, 70],
            90: [2, 70],
            99: [2, 70],
            101: [2, 70],
            102: [2, 70],
            103: [2, 70],
            107: [2, 70],
            115: [2, 70],
            123: [2, 70],
            125: [2, 70],
            126: [2, 70],
            129: [2, 70],
            130: [2, 70],
            131: [2, 70],
            132: [2, 70],
            133: [2, 70],
            134: [2, 70],
          },
          {
            1: [2, 29],
            6: [2, 29],
            25: [2, 29],
            26: [2, 29],
            47: [2, 29],
            52: [2, 29],
            55: [2, 29],
            64: [2, 29],
            65: [2, 29],
            66: [2, 29],
            68: [2, 29],
            70: [2, 29],
            71: [2, 29],
            75: [2, 29],
            81: [2, 29],
            82: [2, 29],
            83: [2, 29],
            88: [2, 29],
            90: [2, 29],
            99: [2, 29],
            101: [2, 29],
            102: [2, 29],
            103: [2, 29],
            107: [2, 29],
            115: [2, 29],
            123: [2, 29],
            125: [2, 29],
            126: [2, 29],
            129: [2, 29],
            130: [2, 29],
            131: [2, 29],
            132: [2, 29],
            133: [2, 29],
            134: [2, 29],
          },
          {
            1: [2, 30],
            6: [2, 30],
            25: [2, 30],
            26: [2, 30],
            47: [2, 30],
            52: [2, 30],
            55: [2, 30],
            64: [2, 30],
            65: [2, 30],
            66: [2, 30],
            68: [2, 30],
            70: [2, 30],
            71: [2, 30],
            75: [2, 30],
            81: [2, 30],
            82: [2, 30],
            83: [2, 30],
            88: [2, 30],
            90: [2, 30],
            99: [2, 30],
            101: [2, 30],
            102: [2, 30],
            103: [2, 30],
            107: [2, 30],
            115: [2, 30],
            123: [2, 30],
            125: [2, 30],
            126: [2, 30],
            129: [2, 30],
            130: [2, 30],
            131: [2, 30],
            132: [2, 30],
            133: [2, 30],
            134: [2, 30],
          },
          {
            1: [2, 31],
            6: [2, 31],
            25: [2, 31],
            26: [2, 31],
            47: [2, 31],
            52: [2, 31],
            55: [2, 31],
            64: [2, 31],
            65: [2, 31],
            66: [2, 31],
            68: [2, 31],
            70: [2, 31],
            71: [2, 31],
            75: [2, 31],
            81: [2, 31],
            82: [2, 31],
            83: [2, 31],
            88: [2, 31],
            90: [2, 31],
            99: [2, 31],
            101: [2, 31],
            102: [2, 31],
            103: [2, 31],
            107: [2, 31],
            115: [2, 31],
            123: [2, 31],
            125: [2, 31],
            126: [2, 31],
            129: [2, 31],
            130: [2, 31],
            131: [2, 31],
            132: [2, 31],
            133: [2, 31],
            134: [2, 31],
          },
          {
            1: [2, 32],
            6: [2, 32],
            25: [2, 32],
            26: [2, 32],
            47: [2, 32],
            52: [2, 32],
            55: [2, 32],
            64: [2, 32],
            65: [2, 32],
            66: [2, 32],
            68: [2, 32],
            70: [2, 32],
            71: [2, 32],
            75: [2, 32],
            81: [2, 32],
            82: [2, 32],
            83: [2, 32],
            88: [2, 32],
            90: [2, 32],
            99: [2, 32],
            101: [2, 32],
            102: [2, 32],
            103: [2, 32],
            107: [2, 32],
            115: [2, 32],
            123: [2, 32],
            125: [2, 32],
            126: [2, 32],
            129: [2, 32],
            130: [2, 32],
            131: [2, 32],
            132: [2, 32],
            133: [2, 32],
            134: [2, 32],
          },
          {
            1: [2, 33],
            6: [2, 33],
            25: [2, 33],
            26: [2, 33],
            47: [2, 33],
            52: [2, 33],
            55: [2, 33],
            64: [2, 33],
            65: [2, 33],
            66: [2, 33],
            68: [2, 33],
            70: [2, 33],
            71: [2, 33],
            75: [2, 33],
            81: [2, 33],
            82: [2, 33],
            83: [2, 33],
            88: [2, 33],
            90: [2, 33],
            99: [2, 33],
            101: [2, 33],
            102: [2, 33],
            103: [2, 33],
            107: [2, 33],
            115: [2, 33],
            123: [2, 33],
            125: [2, 33],
            126: [2, 33],
            129: [2, 33],
            130: [2, 33],
            131: [2, 33],
            132: [2, 33],
            133: [2, 33],
            134: [2, 33],
          },
          {
            4: 138,
            7: 4,
            8: 6,
            9: 7,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 139],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 140,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 144],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            84: 142,
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            88: [1, 141],
            91: 143,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 107],
            6: [2, 107],
            25: [2, 107],
            26: [2, 107],
            47: [2, 107],
            52: [2, 107],
            55: [2, 107],
            64: [2, 107],
            65: [2, 107],
            66: [2, 107],
            68: [2, 107],
            70: [2, 107],
            71: [2, 107],
            75: [2, 107],
            81: [2, 107],
            82: [2, 107],
            83: [2, 107],
            88: [2, 107],
            90: [2, 107],
            99: [2, 107],
            101: [2, 107],
            102: [2, 107],
            103: [2, 107],
            107: [2, 107],
            115: [2, 107],
            123: [2, 107],
            125: [2, 107],
            126: [2, 107],
            129: [2, 107],
            130: [2, 107],
            131: [2, 107],
            132: [2, 107],
            133: [2, 107],
            134: [2, 107],
          },
          {
            1: [2, 108],
            6: [2, 108],
            25: [2, 108],
            26: [2, 108],
            27: 146,
            28: [1, 71],
            47: [2, 108],
            52: [2, 108],
            55: [2, 108],
            64: [2, 108],
            65: [2, 108],
            66: [2, 108],
            68: [2, 108],
            70: [2, 108],
            71: [2, 108],
            75: [2, 108],
            81: [2, 108],
            82: [2, 108],
            83: [2, 108],
            88: [2, 108],
            90: [2, 108],
            99: [2, 108],
            101: [2, 108],
            102: [2, 108],
            103: [2, 108],
            107: [2, 108],
            115: [2, 108],
            123: [2, 108],
            125: [2, 108],
            126: [2, 108],
            129: [2, 108],
            130: [2, 108],
            131: [2, 108],
            132: [2, 108],
            133: [2, 108],
            134: [2, 108],
          },
          { 25: [2, 49] },
          { 25: [2, 50] },
          {
            1: [2, 64],
            6: [2, 64],
            25: [2, 64],
            26: [2, 64],
            38: [2, 64],
            47: [2, 64],
            52: [2, 64],
            55: [2, 64],
            64: [2, 64],
            65: [2, 64],
            66: [2, 64],
            68: [2, 64],
            70: [2, 64],
            71: [2, 64],
            75: [2, 64],
            77: [2, 64],
            81: [2, 64],
            82: [2, 64],
            83: [2, 64],
            88: [2, 64],
            90: [2, 64],
            99: [2, 64],
            101: [2, 64],
            102: [2, 64],
            103: [2, 64],
            107: [2, 64],
            115: [2, 64],
            123: [2, 64],
            125: [2, 64],
            126: [2, 64],
            127: [2, 64],
            128: [2, 64],
            129: [2, 64],
            130: [2, 64],
            131: [2, 64],
            132: [2, 64],
            133: [2, 64],
            134: [2, 64],
            135: [2, 64],
          },
          {
            1: [2, 67],
            6: [2, 67],
            25: [2, 67],
            26: [2, 67],
            38: [2, 67],
            47: [2, 67],
            52: [2, 67],
            55: [2, 67],
            64: [2, 67],
            65: [2, 67],
            66: [2, 67],
            68: [2, 67],
            70: [2, 67],
            71: [2, 67],
            75: [2, 67],
            77: [2, 67],
            81: [2, 67],
            82: [2, 67],
            83: [2, 67],
            88: [2, 67],
            90: [2, 67],
            99: [2, 67],
            101: [2, 67],
            102: [2, 67],
            103: [2, 67],
            107: [2, 67],
            115: [2, 67],
            123: [2, 67],
            125: [2, 67],
            126: [2, 67],
            127: [2, 67],
            128: [2, 67],
            129: [2, 67],
            130: [2, 67],
            131: [2, 67],
            132: [2, 67],
            133: [2, 67],
            134: [2, 67],
            135: [2, 67],
          },
          {
            8: 147,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 148,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 149,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            5: 150,
            8: 151,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 5],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            27: 156,
            28: [1, 71],
            56: 157,
            57: 158,
            62: 152,
            73: [1, 68],
            87: [1, 55],
            110: 153,
            111: [1, 154],
            112: 155,
          },
          { 109: 159, 113: [1, 160], 114: [1, 161] },
          {
            6: [2, 86],
            11: 165,
            25: [2, 86],
            27: 166,
            28: [1, 71],
            29: 167,
            30: [1, 69],
            31: [1, 70],
            39: 163,
            40: 164,
            42: 168,
            44: [1, 46],
            52: [2, 86],
            74: 162,
            75: [2, 86],
            86: [1, 111],
          },
          {
            1: [2, 27],
            6: [2, 27],
            25: [2, 27],
            26: [2, 27],
            41: [2, 27],
            47: [2, 27],
            52: [2, 27],
            55: [2, 27],
            64: [2, 27],
            65: [2, 27],
            66: [2, 27],
            68: [2, 27],
            70: [2, 27],
            71: [2, 27],
            75: [2, 27],
            81: [2, 27],
            82: [2, 27],
            83: [2, 27],
            88: [2, 27],
            90: [2, 27],
            99: [2, 27],
            101: [2, 27],
            102: [2, 27],
            103: [2, 27],
            107: [2, 27],
            115: [2, 27],
            123: [2, 27],
            125: [2, 27],
            126: [2, 27],
            129: [2, 27],
            130: [2, 27],
            131: [2, 27],
            132: [2, 27],
            133: [2, 27],
            134: [2, 27],
          },
          {
            1: [2, 28],
            6: [2, 28],
            25: [2, 28],
            26: [2, 28],
            41: [2, 28],
            47: [2, 28],
            52: [2, 28],
            55: [2, 28],
            64: [2, 28],
            65: [2, 28],
            66: [2, 28],
            68: [2, 28],
            70: [2, 28],
            71: [2, 28],
            75: [2, 28],
            81: [2, 28],
            82: [2, 28],
            83: [2, 28],
            88: [2, 28],
            90: [2, 28],
            99: [2, 28],
            101: [2, 28],
            102: [2, 28],
            103: [2, 28],
            107: [2, 28],
            115: [2, 28],
            123: [2, 28],
            125: [2, 28],
            126: [2, 28],
            129: [2, 28],
            130: [2, 28],
            131: [2, 28],
            132: [2, 28],
            133: [2, 28],
            134: [2, 28],
          },
          {
            1: [2, 26],
            6: [2, 26],
            25: [2, 26],
            26: [2, 26],
            38: [2, 26],
            41: [2, 26],
            47: [2, 26],
            52: [2, 26],
            55: [2, 26],
            64: [2, 26],
            65: [2, 26],
            66: [2, 26],
            68: [2, 26],
            70: [2, 26],
            71: [2, 26],
            75: [2, 26],
            77: [2, 26],
            81: [2, 26],
            82: [2, 26],
            83: [2, 26],
            88: [2, 26],
            90: [2, 26],
            99: [2, 26],
            101: [2, 26],
            102: [2, 26],
            103: [2, 26],
            107: [2, 26],
            113: [2, 26],
            114: [2, 26],
            115: [2, 26],
            123: [2, 26],
            125: [2, 26],
            126: [2, 26],
            127: [2, 26],
            128: [2, 26],
            129: [2, 26],
            130: [2, 26],
            131: [2, 26],
            132: [2, 26],
            133: [2, 26],
            134: [2, 26],
            135: [2, 26],
          },
          {
            1: [2, 6],
            6: [2, 6],
            7: 169,
            8: 6,
            9: 7,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            26: [2, 6],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            99: [2, 6],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 1: [2, 3] },
          {
            1: [2, 24],
            6: [2, 24],
            25: [2, 24],
            26: [2, 24],
            47: [2, 24],
            52: [2, 24],
            55: [2, 24],
            70: [2, 24],
            75: [2, 24],
            83: [2, 24],
            88: [2, 24],
            90: [2, 24],
            95: [2, 24],
            96: [2, 24],
            99: [2, 24],
            101: [2, 24],
            102: [2, 24],
            103: [2, 24],
            107: [2, 24],
            115: [2, 24],
            118: [2, 24],
            120: [2, 24],
            123: [2, 24],
            125: [2, 24],
            126: [2, 24],
            129: [2, 24],
            130: [2, 24],
            131: [2, 24],
            132: [2, 24],
            133: [2, 24],
            134: [2, 24],
          },
          { 6: [1, 72], 26: [1, 170] },
          {
            1: [2, 186],
            6: [2, 186],
            25: [2, 186],
            26: [2, 186],
            47: [2, 186],
            52: [2, 186],
            55: [2, 186],
            70: [2, 186],
            75: [2, 186],
            83: [2, 186],
            88: [2, 186],
            90: [2, 186],
            99: [2, 186],
            101: [2, 186],
            102: [2, 186],
            103: [2, 186],
            107: [2, 186],
            115: [2, 186],
            123: [2, 186],
            125: [2, 186],
            126: [2, 186],
            129: [2, 186],
            130: [2, 186],
            131: [2, 186],
            132: [2, 186],
            133: [2, 186],
            134: [2, 186],
          },
          {
            8: 171,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 172,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 173,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 174,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 175,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 176,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 177,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 178,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 142],
            6: [2, 142],
            25: [2, 142],
            26: [2, 142],
            47: [2, 142],
            52: [2, 142],
            55: [2, 142],
            70: [2, 142],
            75: [2, 142],
            83: [2, 142],
            88: [2, 142],
            90: [2, 142],
            99: [2, 142],
            101: [2, 142],
            102: [2, 142],
            103: [2, 142],
            107: [2, 142],
            115: [2, 142],
            123: [2, 142],
            125: [2, 142],
            126: [2, 142],
            129: [2, 142],
            130: [2, 142],
            131: [2, 142],
            132: [2, 142],
            133: [2, 142],
            134: [2, 142],
          },
          {
            1: [2, 147],
            6: [2, 147],
            25: [2, 147],
            26: [2, 147],
            47: [2, 147],
            52: [2, 147],
            55: [2, 147],
            70: [2, 147],
            75: [2, 147],
            83: [2, 147],
            88: [2, 147],
            90: [2, 147],
            99: [2, 147],
            101: [2, 147],
            102: [2, 147],
            103: [2, 147],
            107: [2, 147],
            115: [2, 147],
            123: [2, 147],
            125: [2, 147],
            126: [2, 147],
            129: [2, 147],
            130: [2, 147],
            131: [2, 147],
            132: [2, 147],
            133: [2, 147],
            134: [2, 147],
          },
          {
            8: 179,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 141],
            6: [2, 141],
            25: [2, 141],
            26: [2, 141],
            47: [2, 141],
            52: [2, 141],
            55: [2, 141],
            70: [2, 141],
            75: [2, 141],
            83: [2, 141],
            88: [2, 141],
            90: [2, 141],
            99: [2, 141],
            101: [2, 141],
            102: [2, 141],
            103: [2, 141],
            107: [2, 141],
            115: [2, 141],
            123: [2, 141],
            125: [2, 141],
            126: [2, 141],
            129: [2, 141],
            130: [2, 141],
            131: [2, 141],
            132: [2, 141],
            133: [2, 141],
            134: [2, 141],
          },
          {
            1: [2, 146],
            6: [2, 146],
            25: [2, 146],
            26: [2, 146],
            47: [2, 146],
            52: [2, 146],
            55: [2, 146],
            70: [2, 146],
            75: [2, 146],
            83: [2, 146],
            88: [2, 146],
            90: [2, 146],
            99: [2, 146],
            101: [2, 146],
            102: [2, 146],
            103: [2, 146],
            107: [2, 146],
            115: [2, 146],
            123: [2, 146],
            125: [2, 146],
            126: [2, 146],
            129: [2, 146],
            130: [2, 146],
            131: [2, 146],
            132: [2, 146],
            133: [2, 146],
            134: [2, 146],
          },
          { 79: 180, 82: [1, 103] },
          {
            1: [2, 65],
            6: [2, 65],
            25: [2, 65],
            26: [2, 65],
            38: [2, 65],
            47: [2, 65],
            52: [2, 65],
            55: [2, 65],
            64: [2, 65],
            65: [2, 65],
            66: [2, 65],
            68: [2, 65],
            70: [2, 65],
            71: [2, 65],
            75: [2, 65],
            77: [2, 65],
            81: [2, 65],
            82: [2, 65],
            83: [2, 65],
            88: [2, 65],
            90: [2, 65],
            99: [2, 65],
            101: [2, 65],
            102: [2, 65],
            103: [2, 65],
            107: [2, 65],
            115: [2, 65],
            123: [2, 65],
            125: [2, 65],
            126: [2, 65],
            127: [2, 65],
            128: [2, 65],
            129: [2, 65],
            130: [2, 65],
            131: [2, 65],
            132: [2, 65],
            133: [2, 65],
            134: [2, 65],
            135: [2, 65],
          },
          { 82: [2, 104] },
          { 27: 181, 28: [1, 71] },
          { 27: 182, 28: [1, 71] },
          {
            1: [2, 79],
            6: [2, 79],
            25: [2, 79],
            26: [2, 79],
            27: 183,
            28: [1, 71],
            38: [2, 79],
            47: [2, 79],
            52: [2, 79],
            55: [2, 79],
            64: [2, 79],
            65: [2, 79],
            66: [2, 79],
            68: [2, 79],
            70: [2, 79],
            71: [2, 79],
            75: [2, 79],
            77: [2, 79],
            81: [2, 79],
            82: [2, 79],
            83: [2, 79],
            88: [2, 79],
            90: [2, 79],
            99: [2, 79],
            101: [2, 79],
            102: [2, 79],
            103: [2, 79],
            107: [2, 79],
            115: [2, 79],
            123: [2, 79],
            125: [2, 79],
            126: [2, 79],
            127: [2, 79],
            128: [2, 79],
            129: [2, 79],
            130: [2, 79],
            131: [2, 79],
            132: [2, 79],
            133: [2, 79],
            134: [2, 79],
            135: [2, 79],
          },
          {
            1: [2, 80],
            6: [2, 80],
            25: [2, 80],
            26: [2, 80],
            38: [2, 80],
            47: [2, 80],
            52: [2, 80],
            55: [2, 80],
            64: [2, 80],
            65: [2, 80],
            66: [2, 80],
            68: [2, 80],
            70: [2, 80],
            71: [2, 80],
            75: [2, 80],
            77: [2, 80],
            81: [2, 80],
            82: [2, 80],
            83: [2, 80],
            88: [2, 80],
            90: [2, 80],
            99: [2, 80],
            101: [2, 80],
            102: [2, 80],
            103: [2, 80],
            107: [2, 80],
            115: [2, 80],
            123: [2, 80],
            125: [2, 80],
            126: [2, 80],
            127: [2, 80],
            128: [2, 80],
            129: [2, 80],
            130: [2, 80],
            131: [2, 80],
            132: [2, 80],
            133: [2, 80],
            134: [2, 80],
            135: [2, 80],
          },
          {
            8: 185,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            55: [1, 189],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            69: 184,
            72: 186,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            89: 187,
            90: [1, 188],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 67: 190, 68: [1, 97], 71: [1, 98] },
          { 79: 191, 82: [1, 103] },
          {
            1: [2, 66],
            6: [2, 66],
            25: [2, 66],
            26: [2, 66],
            38: [2, 66],
            47: [2, 66],
            52: [2, 66],
            55: [2, 66],
            64: [2, 66],
            65: [2, 66],
            66: [2, 66],
            68: [2, 66],
            70: [2, 66],
            71: [2, 66],
            75: [2, 66],
            77: [2, 66],
            81: [2, 66],
            82: [2, 66],
            83: [2, 66],
            88: [2, 66],
            90: [2, 66],
            99: [2, 66],
            101: [2, 66],
            102: [2, 66],
            103: [2, 66],
            107: [2, 66],
            115: [2, 66],
            123: [2, 66],
            125: [2, 66],
            126: [2, 66],
            127: [2, 66],
            128: [2, 66],
            129: [2, 66],
            130: [2, 66],
            131: [2, 66],
            132: [2, 66],
            133: [2, 66],
            134: [2, 66],
            135: [2, 66],
          },
          {
            6: [1, 193],
            8: 192,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 194],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 102],
            6: [2, 102],
            25: [2, 102],
            26: [2, 102],
            47: [2, 102],
            52: [2, 102],
            55: [2, 102],
            64: [2, 102],
            65: [2, 102],
            66: [2, 102],
            68: [2, 102],
            70: [2, 102],
            71: [2, 102],
            75: [2, 102],
            81: [2, 102],
            82: [2, 102],
            83: [2, 102],
            88: [2, 102],
            90: [2, 102],
            99: [2, 102],
            101: [2, 102],
            102: [2, 102],
            103: [2, 102],
            107: [2, 102],
            115: [2, 102],
            123: [2, 102],
            125: [2, 102],
            126: [2, 102],
            129: [2, 102],
            130: [2, 102],
            131: [2, 102],
            132: [2, 102],
            133: [2, 102],
            134: [2, 102],
          },
          {
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 144],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            83: [1, 195],
            84: 196,
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            91: 143,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 47: [1, 198], 52: [1, 199] },
          { 47: [2, 54], 52: [2, 54] },
          { 38: [1, 201], 47: [2, 56], 52: [2, 56], 55: [1, 200] },
          { 38: [2, 59], 47: [2, 59], 52: [2, 59], 55: [2, 59] },
          { 38: [2, 60], 47: [2, 60], 52: [2, 60], 55: [2, 60] },
          { 38: [2, 61], 47: [2, 61], 52: [2, 61], 55: [2, 61] },
          { 38: [2, 62], 47: [2, 62], 52: [2, 62], 55: [2, 62] },
          { 27: 146, 28: [1, 71] },
          {
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 144],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            84: 142,
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            88: [1, 141],
            91: 143,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 48],
            6: [2, 48],
            25: [2, 48],
            26: [2, 48],
            47: [2, 48],
            52: [2, 48],
            55: [2, 48],
            70: [2, 48],
            75: [2, 48],
            83: [2, 48],
            88: [2, 48],
            90: [2, 48],
            99: [2, 48],
            101: [2, 48],
            102: [2, 48],
            103: [2, 48],
            107: [2, 48],
            115: [2, 48],
            123: [2, 48],
            125: [2, 48],
            126: [2, 48],
            129: [2, 48],
            130: [2, 48],
            131: [2, 48],
            132: [2, 48],
            133: [2, 48],
            134: [2, 48],
          },
          {
            1: [2, 179],
            6: [2, 179],
            25: [2, 179],
            26: [2, 179],
            47: [2, 179],
            52: [2, 179],
            55: [2, 179],
            70: [2, 179],
            75: [2, 179],
            83: [2, 179],
            88: [2, 179],
            90: [2, 179],
            99: [2, 179],
            100: 85,
            101: [2, 179],
            102: [2, 179],
            103: [2, 179],
            106: 86,
            107: [2, 179],
            108: 67,
            115: [2, 179],
            123: [2, 179],
            125: [2, 179],
            126: [2, 179],
            129: [1, 76],
            130: [2, 179],
            131: [2, 179],
            132: [2, 179],
            133: [2, 179],
            134: [2, 179],
          },
          {
            100: 88,
            101: [1, 63],
            103: [1, 64],
            106: 89,
            107: [1, 66],
            108: 67,
            123: [1, 87],
          },
          {
            1: [2, 180],
            6: [2, 180],
            25: [2, 180],
            26: [2, 180],
            47: [2, 180],
            52: [2, 180],
            55: [2, 180],
            70: [2, 180],
            75: [2, 180],
            83: [2, 180],
            88: [2, 180],
            90: [2, 180],
            99: [2, 180],
            100: 85,
            101: [2, 180],
            102: [2, 180],
            103: [2, 180],
            106: 86,
            107: [2, 180],
            108: 67,
            115: [2, 180],
            123: [2, 180],
            125: [2, 180],
            126: [2, 180],
            129: [1, 76],
            130: [2, 180],
            131: [2, 180],
            132: [2, 180],
            133: [2, 180],
            134: [2, 180],
          },
          {
            1: [2, 181],
            6: [2, 181],
            25: [2, 181],
            26: [2, 181],
            47: [2, 181],
            52: [2, 181],
            55: [2, 181],
            70: [2, 181],
            75: [2, 181],
            83: [2, 181],
            88: [2, 181],
            90: [2, 181],
            99: [2, 181],
            100: 85,
            101: [2, 181],
            102: [2, 181],
            103: [2, 181],
            106: 86,
            107: [2, 181],
            108: 67,
            115: [2, 181],
            123: [2, 181],
            125: [2, 181],
            126: [2, 181],
            129: [1, 76],
            130: [2, 181],
            131: [2, 181],
            132: [2, 181],
            133: [2, 181],
            134: [2, 181],
          },
          {
            1: [2, 182],
            6: [2, 182],
            25: [2, 182],
            26: [2, 182],
            47: [2, 182],
            52: [2, 182],
            55: [2, 182],
            64: [2, 68],
            65: [2, 68],
            66: [2, 68],
            68: [2, 68],
            70: [2, 182],
            71: [2, 68],
            75: [2, 182],
            81: [2, 68],
            82: [2, 68],
            83: [2, 182],
            88: [2, 182],
            90: [2, 182],
            99: [2, 182],
            101: [2, 182],
            102: [2, 182],
            103: [2, 182],
            107: [2, 182],
            115: [2, 182],
            123: [2, 182],
            125: [2, 182],
            126: [2, 182],
            129: [2, 182],
            130: [2, 182],
            131: [2, 182],
            132: [2, 182],
            133: [2, 182],
            134: [2, 182],
          },
          {
            60: 91,
            64: [1, 93],
            65: [1, 94],
            66: [1, 95],
            67: 96,
            68: [1, 97],
            71: [1, 98],
            78: 90,
            81: [1, 92],
            82: [2, 103],
          },
          {
            60: 100,
            64: [1, 93],
            65: [1, 94],
            66: [1, 95],
            67: 96,
            68: [1, 97],
            71: [1, 98],
            78: 99,
            81: [1, 92],
            82: [2, 103],
          },
          {
            64: [2, 71],
            65: [2, 71],
            66: [2, 71],
            68: [2, 71],
            71: [2, 71],
            81: [2, 71],
            82: [2, 71],
          },
          {
            1: [2, 183],
            6: [2, 183],
            25: [2, 183],
            26: [2, 183],
            47: [2, 183],
            52: [2, 183],
            55: [2, 183],
            64: [2, 68],
            65: [2, 68],
            66: [2, 68],
            68: [2, 68],
            70: [2, 183],
            71: [2, 68],
            75: [2, 183],
            81: [2, 68],
            82: [2, 68],
            83: [2, 183],
            88: [2, 183],
            90: [2, 183],
            99: [2, 183],
            101: [2, 183],
            102: [2, 183],
            103: [2, 183],
            107: [2, 183],
            115: [2, 183],
            123: [2, 183],
            125: [2, 183],
            126: [2, 183],
            129: [2, 183],
            130: [2, 183],
            131: [2, 183],
            132: [2, 183],
            133: [2, 183],
            134: [2, 183],
          },
          {
            1: [2, 184],
            6: [2, 184],
            25: [2, 184],
            26: [2, 184],
            47: [2, 184],
            52: [2, 184],
            55: [2, 184],
            70: [2, 184],
            75: [2, 184],
            83: [2, 184],
            88: [2, 184],
            90: [2, 184],
            99: [2, 184],
            101: [2, 184],
            102: [2, 184],
            103: [2, 184],
            107: [2, 184],
            115: [2, 184],
            123: [2, 184],
            125: [2, 184],
            126: [2, 184],
            129: [2, 184],
            130: [2, 184],
            131: [2, 184],
            132: [2, 184],
            133: [2, 184],
            134: [2, 184],
          },
          {
            1: [2, 185],
            6: [2, 185],
            25: [2, 185],
            26: [2, 185],
            47: [2, 185],
            52: [2, 185],
            55: [2, 185],
            70: [2, 185],
            75: [2, 185],
            83: [2, 185],
            88: [2, 185],
            90: [2, 185],
            99: [2, 185],
            101: [2, 185],
            102: [2, 185],
            103: [2, 185],
            107: [2, 185],
            115: [2, 185],
            123: [2, 185],
            125: [2, 185],
            126: [2, 185],
            129: [2, 185],
            130: [2, 185],
            131: [2, 185],
            132: [2, 185],
            133: [2, 185],
            134: [2, 185],
          },
          {
            8: 202,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 203],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 204,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 5: 205, 25: [1, 5], 122: [1, 206] },
          {
            1: [2, 128],
            6: [2, 128],
            25: [2, 128],
            26: [2, 128],
            47: [2, 128],
            52: [2, 128],
            55: [2, 128],
            70: [2, 128],
            75: [2, 128],
            83: [2, 128],
            88: [2, 128],
            90: [2, 128],
            94: 207,
            95: [1, 208],
            96: [1, 209],
            99: [2, 128],
            101: [2, 128],
            102: [2, 128],
            103: [2, 128],
            107: [2, 128],
            115: [2, 128],
            123: [2, 128],
            125: [2, 128],
            126: [2, 128],
            129: [2, 128],
            130: [2, 128],
            131: [2, 128],
            132: [2, 128],
            133: [2, 128],
            134: [2, 128],
          },
          {
            1: [2, 140],
            6: [2, 140],
            25: [2, 140],
            26: [2, 140],
            47: [2, 140],
            52: [2, 140],
            55: [2, 140],
            70: [2, 140],
            75: [2, 140],
            83: [2, 140],
            88: [2, 140],
            90: [2, 140],
            99: [2, 140],
            101: [2, 140],
            102: [2, 140],
            103: [2, 140],
            107: [2, 140],
            115: [2, 140],
            123: [2, 140],
            125: [2, 140],
            126: [2, 140],
            129: [2, 140],
            130: [2, 140],
            131: [2, 140],
            132: [2, 140],
            133: [2, 140],
            134: [2, 140],
          },
          {
            1: [2, 148],
            6: [2, 148],
            25: [2, 148],
            26: [2, 148],
            47: [2, 148],
            52: [2, 148],
            55: [2, 148],
            70: [2, 148],
            75: [2, 148],
            83: [2, 148],
            88: [2, 148],
            90: [2, 148],
            99: [2, 148],
            101: [2, 148],
            102: [2, 148],
            103: [2, 148],
            107: [2, 148],
            115: [2, 148],
            123: [2, 148],
            125: [2, 148],
            126: [2, 148],
            129: [2, 148],
            130: [2, 148],
            131: [2, 148],
            132: [2, 148],
            133: [2, 148],
            134: [2, 148],
          },
          {
            25: [1, 210],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 117: 211, 119: 212, 120: [1, 213] },
          {
            1: [2, 92],
            6: [2, 92],
            25: [2, 92],
            26: [2, 92],
            47: [2, 92],
            52: [2, 92],
            55: [2, 92],
            70: [2, 92],
            75: [2, 92],
            83: [2, 92],
            88: [2, 92],
            90: [2, 92],
            99: [2, 92],
            101: [2, 92],
            102: [2, 92],
            103: [2, 92],
            107: [2, 92],
            115: [2, 92],
            123: [2, 92],
            125: [2, 92],
            126: [2, 92],
            129: [2, 92],
            130: [2, 92],
            131: [2, 92],
            132: [2, 92],
            133: [2, 92],
            134: [2, 92],
          },
          {
            8: 214,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 95],
            5: 215,
            6: [2, 95],
            25: [1, 5],
            26: [2, 95],
            47: [2, 95],
            52: [2, 95],
            55: [2, 95],
            64: [2, 68],
            65: [2, 68],
            66: [2, 68],
            68: [2, 68],
            70: [2, 95],
            71: [2, 68],
            75: [2, 95],
            77: [1, 216],
            81: [2, 68],
            82: [2, 68],
            83: [2, 95],
            88: [2, 95],
            90: [2, 95],
            99: [2, 95],
            101: [2, 95],
            102: [2, 95],
            103: [2, 95],
            107: [2, 95],
            115: [2, 95],
            123: [2, 95],
            125: [2, 95],
            126: [2, 95],
            129: [2, 95],
            130: [2, 95],
            131: [2, 95],
            132: [2, 95],
            133: [2, 95],
            134: [2, 95],
          },
          {
            1: [2, 133],
            6: [2, 133],
            25: [2, 133],
            26: [2, 133],
            47: [2, 133],
            52: [2, 133],
            55: [2, 133],
            70: [2, 133],
            75: [2, 133],
            83: [2, 133],
            88: [2, 133],
            90: [2, 133],
            99: [2, 133],
            100: 85,
            101: [2, 133],
            102: [2, 133],
            103: [2, 133],
            106: 86,
            107: [2, 133],
            108: 67,
            115: [2, 133],
            123: [2, 133],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 44],
            6: [2, 44],
            26: [2, 44],
            99: [2, 44],
            100: 85,
            101: [2, 44],
            103: [2, 44],
            106: 86,
            107: [2, 44],
            108: 67,
            123: [2, 44],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [1, 72], 99: [1, 217] },
          {
            4: 218,
            7: 4,
            8: 6,
            9: 7,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            6: [2, 124],
            25: [2, 124],
            52: [2, 124],
            55: [1, 220],
            88: [2, 124],
            89: 219,
            90: [1, 188],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 110],
            6: [2, 110],
            25: [2, 110],
            26: [2, 110],
            38: [2, 110],
            47: [2, 110],
            52: [2, 110],
            55: [2, 110],
            64: [2, 110],
            65: [2, 110],
            66: [2, 110],
            68: [2, 110],
            70: [2, 110],
            71: [2, 110],
            75: [2, 110],
            81: [2, 110],
            82: [2, 110],
            83: [2, 110],
            88: [2, 110],
            90: [2, 110],
            99: [2, 110],
            101: [2, 110],
            102: [2, 110],
            103: [2, 110],
            107: [2, 110],
            113: [2, 110],
            114: [2, 110],
            115: [2, 110],
            123: [2, 110],
            125: [2, 110],
            126: [2, 110],
            129: [2, 110],
            130: [2, 110],
            131: [2, 110],
            132: [2, 110],
            133: [2, 110],
            134: [2, 110],
          },
          { 6: [2, 51], 25: [2, 51], 51: 221, 52: [1, 222], 88: [2, 51] },
          {
            6: [2, 119],
            25: [2, 119],
            26: [2, 119],
            52: [2, 119],
            83: [2, 119],
            88: [2, 119],
          },
          {
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 144],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            84: 223,
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            91: 143,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            6: [2, 125],
            25: [2, 125],
            26: [2, 125],
            52: [2, 125],
            83: [2, 125],
            88: [2, 125],
          },
          {
            1: [2, 109],
            6: [2, 109],
            25: [2, 109],
            26: [2, 109],
            38: [2, 109],
            41: [2, 109],
            47: [2, 109],
            52: [2, 109],
            55: [2, 109],
            64: [2, 109],
            65: [2, 109],
            66: [2, 109],
            68: [2, 109],
            70: [2, 109],
            71: [2, 109],
            75: [2, 109],
            77: [2, 109],
            81: [2, 109],
            82: [2, 109],
            83: [2, 109],
            88: [2, 109],
            90: [2, 109],
            99: [2, 109],
            101: [2, 109],
            102: [2, 109],
            103: [2, 109],
            107: [2, 109],
            115: [2, 109],
            123: [2, 109],
            125: [2, 109],
            126: [2, 109],
            127: [2, 109],
            128: [2, 109],
            129: [2, 109],
            130: [2, 109],
            131: [2, 109],
            132: [2, 109],
            133: [2, 109],
            134: [2, 109],
            135: [2, 109],
          },
          {
            5: 224,
            25: [1, 5],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 136],
            6: [2, 136],
            25: [2, 136],
            26: [2, 136],
            47: [2, 136],
            52: [2, 136],
            55: [2, 136],
            70: [2, 136],
            75: [2, 136],
            83: [2, 136],
            88: [2, 136],
            90: [2, 136],
            99: [2, 136],
            100: 85,
            101: [1, 63],
            102: [1, 225],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 136],
            123: [2, 136],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 138],
            6: [2, 138],
            25: [2, 138],
            26: [2, 138],
            47: [2, 138],
            52: [2, 138],
            55: [2, 138],
            70: [2, 138],
            75: [2, 138],
            83: [2, 138],
            88: [2, 138],
            90: [2, 138],
            99: [2, 138],
            100: 85,
            101: [1, 63],
            102: [1, 226],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 138],
            123: [2, 138],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 144],
            6: [2, 144],
            25: [2, 144],
            26: [2, 144],
            47: [2, 144],
            52: [2, 144],
            55: [2, 144],
            70: [2, 144],
            75: [2, 144],
            83: [2, 144],
            88: [2, 144],
            90: [2, 144],
            99: [2, 144],
            101: [2, 144],
            102: [2, 144],
            103: [2, 144],
            107: [2, 144],
            115: [2, 144],
            123: [2, 144],
            125: [2, 144],
            126: [2, 144],
            129: [2, 144],
            130: [2, 144],
            131: [2, 144],
            132: [2, 144],
            133: [2, 144],
            134: [2, 144],
          },
          {
            1: [2, 145],
            6: [2, 145],
            25: [2, 145],
            26: [2, 145],
            47: [2, 145],
            52: [2, 145],
            55: [2, 145],
            70: [2, 145],
            75: [2, 145],
            83: [2, 145],
            88: [2, 145],
            90: [2, 145],
            99: [2, 145],
            100: 85,
            101: [1, 63],
            102: [2, 145],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 145],
            123: [2, 145],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 149],
            6: [2, 149],
            25: [2, 149],
            26: [2, 149],
            47: [2, 149],
            52: [2, 149],
            55: [2, 149],
            70: [2, 149],
            75: [2, 149],
            83: [2, 149],
            88: [2, 149],
            90: [2, 149],
            99: [2, 149],
            101: [2, 149],
            102: [2, 149],
            103: [2, 149],
            107: [2, 149],
            115: [2, 149],
            123: [2, 149],
            125: [2, 149],
            126: [2, 149],
            129: [2, 149],
            130: [2, 149],
            131: [2, 149],
            132: [2, 149],
            133: [2, 149],
            134: [2, 149],
          },
          { 113: [2, 151], 114: [2, 151] },
          {
            27: 156,
            28: [1, 71],
            56: 157,
            57: 158,
            73: [1, 68],
            87: [1, 112],
            110: 227,
            112: 155,
          },
          { 52: [1, 228], 113: [2, 156], 114: [2, 156] },
          { 52: [2, 153], 113: [2, 153], 114: [2, 153] },
          { 52: [2, 154], 113: [2, 154], 114: [2, 154] },
          { 52: [2, 155], 113: [2, 155], 114: [2, 155] },
          {
            1: [2, 150],
            6: [2, 150],
            25: [2, 150],
            26: [2, 150],
            47: [2, 150],
            52: [2, 150],
            55: [2, 150],
            70: [2, 150],
            75: [2, 150],
            83: [2, 150],
            88: [2, 150],
            90: [2, 150],
            99: [2, 150],
            101: [2, 150],
            102: [2, 150],
            103: [2, 150],
            107: [2, 150],
            115: [2, 150],
            123: [2, 150],
            125: [2, 150],
            126: [2, 150],
            129: [2, 150],
            130: [2, 150],
            131: [2, 150],
            132: [2, 150],
            133: [2, 150],
            134: [2, 150],
          },
          {
            8: 229,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 230,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 6: [2, 51], 25: [2, 51], 51: 231, 52: [1, 232], 75: [2, 51] },
          { 6: [2, 87], 25: [2, 87], 26: [2, 87], 52: [2, 87], 75: [2, 87] },
          {
            6: [2, 37],
            25: [2, 37],
            26: [2, 37],
            41: [1, 233],
            52: [2, 37],
            75: [2, 37],
          },
          { 6: [2, 40], 25: [2, 40], 26: [2, 40], 52: [2, 40], 75: [2, 40] },
          {
            6: [2, 41],
            25: [2, 41],
            26: [2, 41],
            41: [2, 41],
            52: [2, 41],
            75: [2, 41],
          },
          {
            6: [2, 42],
            25: [2, 42],
            26: [2, 42],
            41: [2, 42],
            52: [2, 42],
            75: [2, 42],
          },
          {
            6: [2, 43],
            25: [2, 43],
            26: [2, 43],
            41: [2, 43],
            52: [2, 43],
            75: [2, 43],
          },
          { 1: [2, 5], 6: [2, 5], 26: [2, 5], 99: [2, 5] },
          {
            1: [2, 25],
            6: [2, 25],
            25: [2, 25],
            26: [2, 25],
            47: [2, 25],
            52: [2, 25],
            55: [2, 25],
            70: [2, 25],
            75: [2, 25],
            83: [2, 25],
            88: [2, 25],
            90: [2, 25],
            95: [2, 25],
            96: [2, 25],
            99: [2, 25],
            101: [2, 25],
            102: [2, 25],
            103: [2, 25],
            107: [2, 25],
            115: [2, 25],
            118: [2, 25],
            120: [2, 25],
            123: [2, 25],
            125: [2, 25],
            126: [2, 25],
            129: [2, 25],
            130: [2, 25],
            131: [2, 25],
            132: [2, 25],
            133: [2, 25],
            134: [2, 25],
          },
          {
            1: [2, 187],
            6: [2, 187],
            25: [2, 187],
            26: [2, 187],
            47: [2, 187],
            52: [2, 187],
            55: [2, 187],
            70: [2, 187],
            75: [2, 187],
            83: [2, 187],
            88: [2, 187],
            90: [2, 187],
            99: [2, 187],
            100: 85,
            101: [2, 187],
            102: [2, 187],
            103: [2, 187],
            106: 86,
            107: [2, 187],
            108: 67,
            115: [2, 187],
            123: [2, 187],
            125: [2, 187],
            126: [2, 187],
            129: [1, 76],
            130: [1, 79],
            131: [2, 187],
            132: [2, 187],
            133: [2, 187],
            134: [2, 187],
          },
          {
            1: [2, 188],
            6: [2, 188],
            25: [2, 188],
            26: [2, 188],
            47: [2, 188],
            52: [2, 188],
            55: [2, 188],
            70: [2, 188],
            75: [2, 188],
            83: [2, 188],
            88: [2, 188],
            90: [2, 188],
            99: [2, 188],
            100: 85,
            101: [2, 188],
            102: [2, 188],
            103: [2, 188],
            106: 86,
            107: [2, 188],
            108: 67,
            115: [2, 188],
            123: [2, 188],
            125: [2, 188],
            126: [2, 188],
            129: [1, 76],
            130: [1, 79],
            131: [2, 188],
            132: [2, 188],
            133: [2, 188],
            134: [2, 188],
          },
          {
            1: [2, 189],
            6: [2, 189],
            25: [2, 189],
            26: [2, 189],
            47: [2, 189],
            52: [2, 189],
            55: [2, 189],
            70: [2, 189],
            75: [2, 189],
            83: [2, 189],
            88: [2, 189],
            90: [2, 189],
            99: [2, 189],
            100: 85,
            101: [2, 189],
            102: [2, 189],
            103: [2, 189],
            106: 86,
            107: [2, 189],
            108: 67,
            115: [2, 189],
            123: [2, 189],
            125: [2, 189],
            126: [2, 189],
            129: [1, 76],
            130: [2, 189],
            131: [2, 189],
            132: [2, 189],
            133: [2, 189],
            134: [2, 189],
          },
          {
            1: [2, 190],
            6: [2, 190],
            25: [2, 190],
            26: [2, 190],
            47: [2, 190],
            52: [2, 190],
            55: [2, 190],
            70: [2, 190],
            75: [2, 190],
            83: [2, 190],
            88: [2, 190],
            90: [2, 190],
            99: [2, 190],
            100: 85,
            101: [2, 190],
            102: [2, 190],
            103: [2, 190],
            106: 86,
            107: [2, 190],
            108: 67,
            115: [2, 190],
            123: [2, 190],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [2, 190],
            132: [2, 190],
            133: [2, 190],
            134: [2, 190],
          },
          {
            1: [2, 191],
            6: [2, 191],
            25: [2, 191],
            26: [2, 191],
            47: [2, 191],
            52: [2, 191],
            55: [2, 191],
            70: [2, 191],
            75: [2, 191],
            83: [2, 191],
            88: [2, 191],
            90: [2, 191],
            99: [2, 191],
            100: 85,
            101: [2, 191],
            102: [2, 191],
            103: [2, 191],
            106: 86,
            107: [2, 191],
            108: 67,
            115: [2, 191],
            123: [2, 191],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [2, 191],
            133: [2, 191],
            134: [1, 83],
          },
          {
            1: [2, 192],
            6: [2, 192],
            25: [2, 192],
            26: [2, 192],
            47: [2, 192],
            52: [2, 192],
            55: [2, 192],
            70: [2, 192],
            75: [2, 192],
            83: [2, 192],
            88: [2, 192],
            90: [2, 192],
            99: [2, 192],
            100: 85,
            101: [2, 192],
            102: [2, 192],
            103: [2, 192],
            106: 86,
            107: [2, 192],
            108: 67,
            115: [2, 192],
            123: [2, 192],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [2, 192],
            134: [1, 83],
          },
          {
            1: [2, 193],
            6: [2, 193],
            25: [2, 193],
            26: [2, 193],
            47: [2, 193],
            52: [2, 193],
            55: [2, 193],
            70: [2, 193],
            75: [2, 193],
            83: [2, 193],
            88: [2, 193],
            90: [2, 193],
            99: [2, 193],
            100: 85,
            101: [2, 193],
            102: [2, 193],
            103: [2, 193],
            106: 86,
            107: [2, 193],
            108: 67,
            115: [2, 193],
            123: [2, 193],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [2, 193],
            133: [2, 193],
            134: [2, 193],
          },
          {
            1: [2, 178],
            6: [2, 178],
            25: [2, 178],
            26: [2, 178],
            47: [2, 178],
            52: [2, 178],
            55: [2, 178],
            70: [2, 178],
            75: [2, 178],
            83: [2, 178],
            88: [2, 178],
            90: [2, 178],
            99: [2, 178],
            100: 85,
            101: [1, 63],
            102: [2, 178],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 178],
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 177],
            6: [2, 177],
            25: [2, 177],
            26: [2, 177],
            47: [2, 177],
            52: [2, 177],
            55: [2, 177],
            70: [2, 177],
            75: [2, 177],
            83: [2, 177],
            88: [2, 177],
            90: [2, 177],
            99: [2, 177],
            100: 85,
            101: [1, 63],
            102: [2, 177],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 177],
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 99],
            6: [2, 99],
            25: [2, 99],
            26: [2, 99],
            47: [2, 99],
            52: [2, 99],
            55: [2, 99],
            64: [2, 99],
            65: [2, 99],
            66: [2, 99],
            68: [2, 99],
            70: [2, 99],
            71: [2, 99],
            75: [2, 99],
            81: [2, 99],
            82: [2, 99],
            83: [2, 99],
            88: [2, 99],
            90: [2, 99],
            99: [2, 99],
            101: [2, 99],
            102: [2, 99],
            103: [2, 99],
            107: [2, 99],
            115: [2, 99],
            123: [2, 99],
            125: [2, 99],
            126: [2, 99],
            129: [2, 99],
            130: [2, 99],
            131: [2, 99],
            132: [2, 99],
            133: [2, 99],
            134: [2, 99],
          },
          {
            1: [2, 76],
            6: [2, 76],
            25: [2, 76],
            26: [2, 76],
            38: [2, 76],
            47: [2, 76],
            52: [2, 76],
            55: [2, 76],
            64: [2, 76],
            65: [2, 76],
            66: [2, 76],
            68: [2, 76],
            70: [2, 76],
            71: [2, 76],
            75: [2, 76],
            77: [2, 76],
            81: [2, 76],
            82: [2, 76],
            83: [2, 76],
            88: [2, 76],
            90: [2, 76],
            99: [2, 76],
            101: [2, 76],
            102: [2, 76],
            103: [2, 76],
            107: [2, 76],
            115: [2, 76],
            123: [2, 76],
            125: [2, 76],
            126: [2, 76],
            127: [2, 76],
            128: [2, 76],
            129: [2, 76],
            130: [2, 76],
            131: [2, 76],
            132: [2, 76],
            133: [2, 76],
            134: [2, 76],
            135: [2, 76],
          },
          {
            1: [2, 77],
            6: [2, 77],
            25: [2, 77],
            26: [2, 77],
            38: [2, 77],
            47: [2, 77],
            52: [2, 77],
            55: [2, 77],
            64: [2, 77],
            65: [2, 77],
            66: [2, 77],
            68: [2, 77],
            70: [2, 77],
            71: [2, 77],
            75: [2, 77],
            77: [2, 77],
            81: [2, 77],
            82: [2, 77],
            83: [2, 77],
            88: [2, 77],
            90: [2, 77],
            99: [2, 77],
            101: [2, 77],
            102: [2, 77],
            103: [2, 77],
            107: [2, 77],
            115: [2, 77],
            123: [2, 77],
            125: [2, 77],
            126: [2, 77],
            127: [2, 77],
            128: [2, 77],
            129: [2, 77],
            130: [2, 77],
            131: [2, 77],
            132: [2, 77],
            133: [2, 77],
            134: [2, 77],
            135: [2, 77],
          },
          {
            1: [2, 78],
            6: [2, 78],
            25: [2, 78],
            26: [2, 78],
            38: [2, 78],
            47: [2, 78],
            52: [2, 78],
            55: [2, 78],
            64: [2, 78],
            65: [2, 78],
            66: [2, 78],
            68: [2, 78],
            70: [2, 78],
            71: [2, 78],
            75: [2, 78],
            77: [2, 78],
            81: [2, 78],
            82: [2, 78],
            83: [2, 78],
            88: [2, 78],
            90: [2, 78],
            99: [2, 78],
            101: [2, 78],
            102: [2, 78],
            103: [2, 78],
            107: [2, 78],
            115: [2, 78],
            123: [2, 78],
            125: [2, 78],
            126: [2, 78],
            127: [2, 78],
            128: [2, 78],
            129: [2, 78],
            130: [2, 78],
            131: [2, 78],
            132: [2, 78],
            133: [2, 78],
            134: [2, 78],
            135: [2, 78],
          },
          { 70: [1, 234] },
          {
            55: [1, 189],
            70: [2, 83],
            89: 235,
            90: [1, 188],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 70: [2, 84] },
          {
            8: 236,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            70: [2, 118],
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            12: [2, 112],
            28: [2, 112],
            30: [2, 112],
            31: [2, 112],
            33: [2, 112],
            34: [2, 112],
            35: [2, 112],
            36: [2, 112],
            43: [2, 112],
            44: [2, 112],
            45: [2, 112],
            49: [2, 112],
            50: [2, 112],
            70: [2, 112],
            73: [2, 112],
            76: [2, 112],
            80: [2, 112],
            85: [2, 112],
            86: [2, 112],
            87: [2, 112],
            93: [2, 112],
            97: [2, 112],
            98: [2, 112],
            101: [2, 112],
            103: [2, 112],
            105: [2, 112],
            107: [2, 112],
            116: [2, 112],
            122: [2, 112],
            124: [2, 112],
            125: [2, 112],
            126: [2, 112],
            127: [2, 112],
            128: [2, 112],
          },
          {
            12: [2, 113],
            28: [2, 113],
            30: [2, 113],
            31: [2, 113],
            33: [2, 113],
            34: [2, 113],
            35: [2, 113],
            36: [2, 113],
            43: [2, 113],
            44: [2, 113],
            45: [2, 113],
            49: [2, 113],
            50: [2, 113],
            70: [2, 113],
            73: [2, 113],
            76: [2, 113],
            80: [2, 113],
            85: [2, 113],
            86: [2, 113],
            87: [2, 113],
            93: [2, 113],
            97: [2, 113],
            98: [2, 113],
            101: [2, 113],
            103: [2, 113],
            105: [2, 113],
            107: [2, 113],
            116: [2, 113],
            122: [2, 113],
            124: [2, 113],
            125: [2, 113],
            126: [2, 113],
            127: [2, 113],
            128: [2, 113],
          },
          {
            1: [2, 82],
            6: [2, 82],
            25: [2, 82],
            26: [2, 82],
            38: [2, 82],
            47: [2, 82],
            52: [2, 82],
            55: [2, 82],
            64: [2, 82],
            65: [2, 82],
            66: [2, 82],
            68: [2, 82],
            70: [2, 82],
            71: [2, 82],
            75: [2, 82],
            77: [2, 82],
            81: [2, 82],
            82: [2, 82],
            83: [2, 82],
            88: [2, 82],
            90: [2, 82],
            99: [2, 82],
            101: [2, 82],
            102: [2, 82],
            103: [2, 82],
            107: [2, 82],
            115: [2, 82],
            123: [2, 82],
            125: [2, 82],
            126: [2, 82],
            127: [2, 82],
            128: [2, 82],
            129: [2, 82],
            130: [2, 82],
            131: [2, 82],
            132: [2, 82],
            133: [2, 82],
            134: [2, 82],
            135: [2, 82],
          },
          {
            1: [2, 100],
            6: [2, 100],
            25: [2, 100],
            26: [2, 100],
            47: [2, 100],
            52: [2, 100],
            55: [2, 100],
            64: [2, 100],
            65: [2, 100],
            66: [2, 100],
            68: [2, 100],
            70: [2, 100],
            71: [2, 100],
            75: [2, 100],
            81: [2, 100],
            82: [2, 100],
            83: [2, 100],
            88: [2, 100],
            90: [2, 100],
            99: [2, 100],
            101: [2, 100],
            102: [2, 100],
            103: [2, 100],
            107: [2, 100],
            115: [2, 100],
            123: [2, 100],
            125: [2, 100],
            126: [2, 100],
            129: [2, 100],
            130: [2, 100],
            131: [2, 100],
            132: [2, 100],
            133: [2, 100],
            134: [2, 100],
          },
          {
            1: [2, 34],
            6: [2, 34],
            25: [2, 34],
            26: [2, 34],
            47: [2, 34],
            52: [2, 34],
            55: [2, 34],
            70: [2, 34],
            75: [2, 34],
            83: [2, 34],
            88: [2, 34],
            90: [2, 34],
            99: [2, 34],
            100: 85,
            101: [2, 34],
            102: [2, 34],
            103: [2, 34],
            106: 86,
            107: [2, 34],
            108: 67,
            115: [2, 34],
            123: [2, 34],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            8: 237,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 238,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 105],
            6: [2, 105],
            25: [2, 105],
            26: [2, 105],
            47: [2, 105],
            52: [2, 105],
            55: [2, 105],
            64: [2, 105],
            65: [2, 105],
            66: [2, 105],
            68: [2, 105],
            70: [2, 105],
            71: [2, 105],
            75: [2, 105],
            81: [2, 105],
            82: [2, 105],
            83: [2, 105],
            88: [2, 105],
            90: [2, 105],
            99: [2, 105],
            101: [2, 105],
            102: [2, 105],
            103: [2, 105],
            107: [2, 105],
            115: [2, 105],
            123: [2, 105],
            125: [2, 105],
            126: [2, 105],
            129: [2, 105],
            130: [2, 105],
            131: [2, 105],
            132: [2, 105],
            133: [2, 105],
            134: [2, 105],
          },
          { 6: [2, 51], 25: [2, 51], 51: 239, 52: [1, 222], 83: [2, 51] },
          {
            6: [2, 124],
            25: [2, 124],
            26: [2, 124],
            52: [2, 124],
            55: [1, 240],
            83: [2, 124],
            88: [2, 124],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 48: 241, 49: [1, 58], 50: [1, 59] },
          {
            27: 107,
            28: [1, 71],
            42: 108,
            53: 242,
            54: 106,
            56: 109,
            57: 110,
            73: [1, 68],
            86: [1, 111],
            87: [1, 112],
          },
          { 47: [2, 57], 52: [2, 57] },
          {
            8: 243,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 194],
            6: [2, 194],
            25: [2, 194],
            26: [2, 194],
            47: [2, 194],
            52: [2, 194],
            55: [2, 194],
            70: [2, 194],
            75: [2, 194],
            83: [2, 194],
            88: [2, 194],
            90: [2, 194],
            99: [2, 194],
            100: 85,
            101: [2, 194],
            102: [2, 194],
            103: [2, 194],
            106: 86,
            107: [2, 194],
            108: 67,
            115: [2, 194],
            123: [2, 194],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            8: 244,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 196],
            6: [2, 196],
            25: [2, 196],
            26: [2, 196],
            47: [2, 196],
            52: [2, 196],
            55: [2, 196],
            70: [2, 196],
            75: [2, 196],
            83: [2, 196],
            88: [2, 196],
            90: [2, 196],
            99: [2, 196],
            100: 85,
            101: [2, 196],
            102: [2, 196],
            103: [2, 196],
            106: 86,
            107: [2, 196],
            108: 67,
            115: [2, 196],
            123: [2, 196],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 176],
            6: [2, 176],
            25: [2, 176],
            26: [2, 176],
            47: [2, 176],
            52: [2, 176],
            55: [2, 176],
            70: [2, 176],
            75: [2, 176],
            83: [2, 176],
            88: [2, 176],
            90: [2, 176],
            99: [2, 176],
            101: [2, 176],
            102: [2, 176],
            103: [2, 176],
            107: [2, 176],
            115: [2, 176],
            123: [2, 176],
            125: [2, 176],
            126: [2, 176],
            129: [2, 176],
            130: [2, 176],
            131: [2, 176],
            132: [2, 176],
            133: [2, 176],
            134: [2, 176],
          },
          {
            8: 245,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 129],
            6: [2, 129],
            25: [2, 129],
            26: [2, 129],
            47: [2, 129],
            52: [2, 129],
            55: [2, 129],
            70: [2, 129],
            75: [2, 129],
            83: [2, 129],
            88: [2, 129],
            90: [2, 129],
            95: [1, 246],
            99: [2, 129],
            101: [2, 129],
            102: [2, 129],
            103: [2, 129],
            107: [2, 129],
            115: [2, 129],
            123: [2, 129],
            125: [2, 129],
            126: [2, 129],
            129: [2, 129],
            130: [2, 129],
            131: [2, 129],
            132: [2, 129],
            133: [2, 129],
            134: [2, 129],
          },
          { 5: 247, 25: [1, 5] },
          { 27: 248, 28: [1, 71] },
          { 117: 249, 119: 212, 120: [1, 213] },
          { 26: [1, 250], 118: [1, 251], 119: 252, 120: [1, 213] },
          { 26: [2, 169], 118: [2, 169], 120: [2, 169] },
          {
            8: 254,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            92: 253,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 93],
            5: 255,
            6: [2, 93],
            25: [1, 5],
            26: [2, 93],
            47: [2, 93],
            52: [2, 93],
            55: [2, 93],
            70: [2, 93],
            75: [2, 93],
            83: [2, 93],
            88: [2, 93],
            90: [2, 93],
            99: [2, 93],
            100: 85,
            101: [1, 63],
            102: [2, 93],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 93],
            123: [2, 93],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 96],
            6: [2, 96],
            25: [2, 96],
            26: [2, 96],
            47: [2, 96],
            52: [2, 96],
            55: [2, 96],
            70: [2, 96],
            75: [2, 96],
            83: [2, 96],
            88: [2, 96],
            90: [2, 96],
            99: [2, 96],
            101: [2, 96],
            102: [2, 96],
            103: [2, 96],
            107: [2, 96],
            115: [2, 96],
            123: [2, 96],
            125: [2, 96],
            126: [2, 96],
            129: [2, 96],
            130: [2, 96],
            131: [2, 96],
            132: [2, 96],
            133: [2, 96],
            134: [2, 96],
          },
          {
            8: 256,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 134],
            6: [2, 134],
            25: [2, 134],
            26: [2, 134],
            47: [2, 134],
            52: [2, 134],
            55: [2, 134],
            64: [2, 134],
            65: [2, 134],
            66: [2, 134],
            68: [2, 134],
            70: [2, 134],
            71: [2, 134],
            75: [2, 134],
            81: [2, 134],
            82: [2, 134],
            83: [2, 134],
            88: [2, 134],
            90: [2, 134],
            99: [2, 134],
            101: [2, 134],
            102: [2, 134],
            103: [2, 134],
            107: [2, 134],
            115: [2, 134],
            123: [2, 134],
            125: [2, 134],
            126: [2, 134],
            129: [2, 134],
            130: [2, 134],
            131: [2, 134],
            132: [2, 134],
            133: [2, 134],
            134: [2, 134],
          },
          { 6: [1, 72], 26: [1, 257] },
          {
            8: 258,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            6: [2, 63],
            12: [2, 113],
            25: [2, 63],
            28: [2, 113],
            30: [2, 113],
            31: [2, 113],
            33: [2, 113],
            34: [2, 113],
            35: [2, 113],
            36: [2, 113],
            43: [2, 113],
            44: [2, 113],
            45: [2, 113],
            49: [2, 113],
            50: [2, 113],
            52: [2, 63],
            73: [2, 113],
            76: [2, 113],
            80: [2, 113],
            85: [2, 113],
            86: [2, 113],
            87: [2, 113],
            88: [2, 63],
            93: [2, 113],
            97: [2, 113],
            98: [2, 113],
            101: [2, 113],
            103: [2, 113],
            105: [2, 113],
            107: [2, 113],
            116: [2, 113],
            122: [2, 113],
            124: [2, 113],
            125: [2, 113],
            126: [2, 113],
            127: [2, 113],
            128: [2, 113],
          },
          { 6: [1, 260], 25: [1, 261], 88: [1, 259] },
          {
            6: [2, 52],
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [2, 52],
            26: [2, 52],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            83: [2, 52],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            88: [2, 52],
            91: 262,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 6: [2, 51], 25: [2, 51], 26: [2, 51], 51: 263, 52: [1, 222] },
          {
            1: [2, 173],
            6: [2, 173],
            25: [2, 173],
            26: [2, 173],
            47: [2, 173],
            52: [2, 173],
            55: [2, 173],
            70: [2, 173],
            75: [2, 173],
            83: [2, 173],
            88: [2, 173],
            90: [2, 173],
            99: [2, 173],
            101: [2, 173],
            102: [2, 173],
            103: [2, 173],
            107: [2, 173],
            115: [2, 173],
            118: [2, 173],
            123: [2, 173],
            125: [2, 173],
            126: [2, 173],
            129: [2, 173],
            130: [2, 173],
            131: [2, 173],
            132: [2, 173],
            133: [2, 173],
            134: [2, 173],
          },
          {
            8: 264,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 265,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 113: [2, 152], 114: [2, 152] },
          {
            27: 156,
            28: [1, 71],
            56: 157,
            57: 158,
            73: [1, 68],
            87: [1, 112],
            112: 266,
          },
          {
            1: [2, 158],
            6: [2, 158],
            25: [2, 158],
            26: [2, 158],
            47: [2, 158],
            52: [2, 158],
            55: [2, 158],
            70: [2, 158],
            75: [2, 158],
            83: [2, 158],
            88: [2, 158],
            90: [2, 158],
            99: [2, 158],
            100: 85,
            101: [2, 158],
            102: [1, 267],
            103: [2, 158],
            106: 86,
            107: [2, 158],
            108: 67,
            115: [1, 268],
            123: [2, 158],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 159],
            6: [2, 159],
            25: [2, 159],
            26: [2, 159],
            47: [2, 159],
            52: [2, 159],
            55: [2, 159],
            70: [2, 159],
            75: [2, 159],
            83: [2, 159],
            88: [2, 159],
            90: [2, 159],
            99: [2, 159],
            100: 85,
            101: [2, 159],
            102: [1, 269],
            103: [2, 159],
            106: 86,
            107: [2, 159],
            108: 67,
            115: [2, 159],
            123: [2, 159],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [1, 271], 25: [1, 272], 75: [1, 270] },
          {
            6: [2, 52],
            11: 165,
            25: [2, 52],
            26: [2, 52],
            27: 166,
            28: [1, 71],
            29: 167,
            30: [1, 69],
            31: [1, 70],
            39: 273,
            40: 164,
            42: 168,
            44: [1, 46],
            75: [2, 52],
            86: [1, 111],
          },
          {
            8: 274,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 275],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 81],
            6: [2, 81],
            25: [2, 81],
            26: [2, 81],
            38: [2, 81],
            47: [2, 81],
            52: [2, 81],
            55: [2, 81],
            64: [2, 81],
            65: [2, 81],
            66: [2, 81],
            68: [2, 81],
            70: [2, 81],
            71: [2, 81],
            75: [2, 81],
            77: [2, 81],
            81: [2, 81],
            82: [2, 81],
            83: [2, 81],
            88: [2, 81],
            90: [2, 81],
            99: [2, 81],
            101: [2, 81],
            102: [2, 81],
            103: [2, 81],
            107: [2, 81],
            115: [2, 81],
            123: [2, 81],
            125: [2, 81],
            126: [2, 81],
            127: [2, 81],
            128: [2, 81],
            129: [2, 81],
            130: [2, 81],
            131: [2, 81],
            132: [2, 81],
            133: [2, 81],
            134: [2, 81],
            135: [2, 81],
          },
          {
            8: 276,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            70: [2, 116],
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            70: [2, 117],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 35],
            6: [2, 35],
            25: [2, 35],
            26: [2, 35],
            47: [2, 35],
            52: [2, 35],
            55: [2, 35],
            70: [2, 35],
            75: [2, 35],
            83: [2, 35],
            88: [2, 35],
            90: [2, 35],
            99: [2, 35],
            100: 85,
            101: [2, 35],
            102: [2, 35],
            103: [2, 35],
            106: 86,
            107: [2, 35],
            108: 67,
            115: [2, 35],
            123: [2, 35],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            26: [1, 277],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [1, 260], 25: [1, 261], 83: [1, 278] },
          {
            6: [2, 63],
            25: [2, 63],
            26: [2, 63],
            52: [2, 63],
            83: [2, 63],
            88: [2, 63],
          },
          { 5: 279, 25: [1, 5] },
          { 47: [2, 55], 52: [2, 55] },
          {
            47: [2, 58],
            52: [2, 58],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            26: [1, 280],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            5: 281,
            25: [1, 5],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 5: 282, 25: [1, 5] },
          {
            1: [2, 130],
            6: [2, 130],
            25: [2, 130],
            26: [2, 130],
            47: [2, 130],
            52: [2, 130],
            55: [2, 130],
            70: [2, 130],
            75: [2, 130],
            83: [2, 130],
            88: [2, 130],
            90: [2, 130],
            99: [2, 130],
            101: [2, 130],
            102: [2, 130],
            103: [2, 130],
            107: [2, 130],
            115: [2, 130],
            123: [2, 130],
            125: [2, 130],
            126: [2, 130],
            129: [2, 130],
            130: [2, 130],
            131: [2, 130],
            132: [2, 130],
            133: [2, 130],
            134: [2, 130],
          },
          { 5: 283, 25: [1, 5] },
          { 26: [1, 284], 118: [1, 285], 119: 252, 120: [1, 213] },
          {
            1: [2, 167],
            6: [2, 167],
            25: [2, 167],
            26: [2, 167],
            47: [2, 167],
            52: [2, 167],
            55: [2, 167],
            70: [2, 167],
            75: [2, 167],
            83: [2, 167],
            88: [2, 167],
            90: [2, 167],
            99: [2, 167],
            101: [2, 167],
            102: [2, 167],
            103: [2, 167],
            107: [2, 167],
            115: [2, 167],
            123: [2, 167],
            125: [2, 167],
            126: [2, 167],
            129: [2, 167],
            130: [2, 167],
            131: [2, 167],
            132: [2, 167],
            133: [2, 167],
            134: [2, 167],
          },
          { 5: 286, 25: [1, 5] },
          { 26: [2, 170], 118: [2, 170], 120: [2, 170] },
          { 5: 287, 25: [1, 5], 52: [1, 288] },
          {
            25: [2, 126],
            52: [2, 126],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 94],
            6: [2, 94],
            25: [2, 94],
            26: [2, 94],
            47: [2, 94],
            52: [2, 94],
            55: [2, 94],
            70: [2, 94],
            75: [2, 94],
            83: [2, 94],
            88: [2, 94],
            90: [2, 94],
            99: [2, 94],
            101: [2, 94],
            102: [2, 94],
            103: [2, 94],
            107: [2, 94],
            115: [2, 94],
            123: [2, 94],
            125: [2, 94],
            126: [2, 94],
            129: [2, 94],
            130: [2, 94],
            131: [2, 94],
            132: [2, 94],
            133: [2, 94],
            134: [2, 94],
          },
          {
            1: [2, 97],
            5: 289,
            6: [2, 97],
            25: [1, 5],
            26: [2, 97],
            47: [2, 97],
            52: [2, 97],
            55: [2, 97],
            70: [2, 97],
            75: [2, 97],
            83: [2, 97],
            88: [2, 97],
            90: [2, 97],
            99: [2, 97],
            100: 85,
            101: [1, 63],
            102: [2, 97],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 97],
            123: [2, 97],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 99: [1, 290] },
          {
            88: [1, 291],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 111],
            6: [2, 111],
            25: [2, 111],
            26: [2, 111],
            38: [2, 111],
            47: [2, 111],
            52: [2, 111],
            55: [2, 111],
            64: [2, 111],
            65: [2, 111],
            66: [2, 111],
            68: [2, 111],
            70: [2, 111],
            71: [2, 111],
            75: [2, 111],
            81: [2, 111],
            82: [2, 111],
            83: [2, 111],
            88: [2, 111],
            90: [2, 111],
            99: [2, 111],
            101: [2, 111],
            102: [2, 111],
            103: [2, 111],
            107: [2, 111],
            113: [2, 111],
            114: [2, 111],
            115: [2, 111],
            123: [2, 111],
            125: [2, 111],
            126: [2, 111],
            129: [2, 111],
            130: [2, 111],
            131: [2, 111],
            132: [2, 111],
            133: [2, 111],
            134: [2, 111],
          },
          {
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            91: 292,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 197,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            25: [1, 144],
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            58: 145,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            84: 293,
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            91: 143,
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            6: [2, 120],
            25: [2, 120],
            26: [2, 120],
            52: [2, 120],
            83: [2, 120],
            88: [2, 120],
          },
          { 6: [1, 260], 25: [1, 261], 26: [1, 294] },
          {
            1: [2, 137],
            6: [2, 137],
            25: [2, 137],
            26: [2, 137],
            47: [2, 137],
            52: [2, 137],
            55: [2, 137],
            70: [2, 137],
            75: [2, 137],
            83: [2, 137],
            88: [2, 137],
            90: [2, 137],
            99: [2, 137],
            100: 85,
            101: [1, 63],
            102: [2, 137],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 137],
            123: [2, 137],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 139],
            6: [2, 139],
            25: [2, 139],
            26: [2, 139],
            47: [2, 139],
            52: [2, 139],
            55: [2, 139],
            70: [2, 139],
            75: [2, 139],
            83: [2, 139],
            88: [2, 139],
            90: [2, 139],
            99: [2, 139],
            100: 85,
            101: [1, 63],
            102: [2, 139],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            115: [2, 139],
            123: [2, 139],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 113: [2, 157], 114: [2, 157] },
          {
            8: 295,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 296,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 297,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 85],
            6: [2, 85],
            25: [2, 85],
            26: [2, 85],
            38: [2, 85],
            47: [2, 85],
            52: [2, 85],
            55: [2, 85],
            64: [2, 85],
            65: [2, 85],
            66: [2, 85],
            68: [2, 85],
            70: [2, 85],
            71: [2, 85],
            75: [2, 85],
            81: [2, 85],
            82: [2, 85],
            83: [2, 85],
            88: [2, 85],
            90: [2, 85],
            99: [2, 85],
            101: [2, 85],
            102: [2, 85],
            103: [2, 85],
            107: [2, 85],
            113: [2, 85],
            114: [2, 85],
            115: [2, 85],
            123: [2, 85],
            125: [2, 85],
            126: [2, 85],
            129: [2, 85],
            130: [2, 85],
            131: [2, 85],
            132: [2, 85],
            133: [2, 85],
            134: [2, 85],
          },
          {
            11: 165,
            27: 166,
            28: [1, 71],
            29: 167,
            30: [1, 69],
            31: [1, 70],
            39: 298,
            40: 164,
            42: 168,
            44: [1, 46],
            86: [1, 111],
          },
          {
            6: [2, 86],
            11: 165,
            25: [2, 86],
            26: [2, 86],
            27: 166,
            28: [1, 71],
            29: 167,
            30: [1, 69],
            31: [1, 70],
            39: 163,
            40: 164,
            42: 168,
            44: [1, 46],
            52: [2, 86],
            74: 299,
            86: [1, 111],
          },
          { 6: [2, 88], 25: [2, 88], 26: [2, 88], 52: [2, 88], 75: [2, 88] },
          {
            6: [2, 38],
            25: [2, 38],
            26: [2, 38],
            52: [2, 38],
            75: [2, 38],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            8: 300,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            70: [2, 115],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 36],
            6: [2, 36],
            25: [2, 36],
            26: [2, 36],
            47: [2, 36],
            52: [2, 36],
            55: [2, 36],
            70: [2, 36],
            75: [2, 36],
            83: [2, 36],
            88: [2, 36],
            90: [2, 36],
            99: [2, 36],
            101: [2, 36],
            102: [2, 36],
            103: [2, 36],
            107: [2, 36],
            115: [2, 36],
            123: [2, 36],
            125: [2, 36],
            126: [2, 36],
            129: [2, 36],
            130: [2, 36],
            131: [2, 36],
            132: [2, 36],
            133: [2, 36],
            134: [2, 36],
          },
          {
            1: [2, 106],
            6: [2, 106],
            25: [2, 106],
            26: [2, 106],
            47: [2, 106],
            52: [2, 106],
            55: [2, 106],
            64: [2, 106],
            65: [2, 106],
            66: [2, 106],
            68: [2, 106],
            70: [2, 106],
            71: [2, 106],
            75: [2, 106],
            81: [2, 106],
            82: [2, 106],
            83: [2, 106],
            88: [2, 106],
            90: [2, 106],
            99: [2, 106],
            101: [2, 106],
            102: [2, 106],
            103: [2, 106],
            107: [2, 106],
            115: [2, 106],
            123: [2, 106],
            125: [2, 106],
            126: [2, 106],
            129: [2, 106],
            130: [2, 106],
            131: [2, 106],
            132: [2, 106],
            133: [2, 106],
            134: [2, 106],
          },
          {
            1: [2, 47],
            6: [2, 47],
            25: [2, 47],
            26: [2, 47],
            47: [2, 47],
            52: [2, 47],
            55: [2, 47],
            70: [2, 47],
            75: [2, 47],
            83: [2, 47],
            88: [2, 47],
            90: [2, 47],
            99: [2, 47],
            101: [2, 47],
            102: [2, 47],
            103: [2, 47],
            107: [2, 47],
            115: [2, 47],
            123: [2, 47],
            125: [2, 47],
            126: [2, 47],
            129: [2, 47],
            130: [2, 47],
            131: [2, 47],
            132: [2, 47],
            133: [2, 47],
            134: [2, 47],
          },
          {
            1: [2, 195],
            6: [2, 195],
            25: [2, 195],
            26: [2, 195],
            47: [2, 195],
            52: [2, 195],
            55: [2, 195],
            70: [2, 195],
            75: [2, 195],
            83: [2, 195],
            88: [2, 195],
            90: [2, 195],
            99: [2, 195],
            101: [2, 195],
            102: [2, 195],
            103: [2, 195],
            107: [2, 195],
            115: [2, 195],
            123: [2, 195],
            125: [2, 195],
            126: [2, 195],
            129: [2, 195],
            130: [2, 195],
            131: [2, 195],
            132: [2, 195],
            133: [2, 195],
            134: [2, 195],
          },
          {
            1: [2, 174],
            6: [2, 174],
            25: [2, 174],
            26: [2, 174],
            47: [2, 174],
            52: [2, 174],
            55: [2, 174],
            70: [2, 174],
            75: [2, 174],
            83: [2, 174],
            88: [2, 174],
            90: [2, 174],
            99: [2, 174],
            101: [2, 174],
            102: [2, 174],
            103: [2, 174],
            107: [2, 174],
            115: [2, 174],
            118: [2, 174],
            123: [2, 174],
            125: [2, 174],
            126: [2, 174],
            129: [2, 174],
            130: [2, 174],
            131: [2, 174],
            132: [2, 174],
            133: [2, 174],
            134: [2, 174],
          },
          {
            1: [2, 131],
            6: [2, 131],
            25: [2, 131],
            26: [2, 131],
            47: [2, 131],
            52: [2, 131],
            55: [2, 131],
            70: [2, 131],
            75: [2, 131],
            83: [2, 131],
            88: [2, 131],
            90: [2, 131],
            99: [2, 131],
            101: [2, 131],
            102: [2, 131],
            103: [2, 131],
            107: [2, 131],
            115: [2, 131],
            123: [2, 131],
            125: [2, 131],
            126: [2, 131],
            129: [2, 131],
            130: [2, 131],
            131: [2, 131],
            132: [2, 131],
            133: [2, 131],
            134: [2, 131],
          },
          {
            1: [2, 132],
            6: [2, 132],
            25: [2, 132],
            26: [2, 132],
            47: [2, 132],
            52: [2, 132],
            55: [2, 132],
            70: [2, 132],
            75: [2, 132],
            83: [2, 132],
            88: [2, 132],
            90: [2, 132],
            95: [2, 132],
            99: [2, 132],
            101: [2, 132],
            102: [2, 132],
            103: [2, 132],
            107: [2, 132],
            115: [2, 132],
            123: [2, 132],
            125: [2, 132],
            126: [2, 132],
            129: [2, 132],
            130: [2, 132],
            131: [2, 132],
            132: [2, 132],
            133: [2, 132],
            134: [2, 132],
          },
          {
            1: [2, 165],
            6: [2, 165],
            25: [2, 165],
            26: [2, 165],
            47: [2, 165],
            52: [2, 165],
            55: [2, 165],
            70: [2, 165],
            75: [2, 165],
            83: [2, 165],
            88: [2, 165],
            90: [2, 165],
            99: [2, 165],
            101: [2, 165],
            102: [2, 165],
            103: [2, 165],
            107: [2, 165],
            115: [2, 165],
            123: [2, 165],
            125: [2, 165],
            126: [2, 165],
            129: [2, 165],
            130: [2, 165],
            131: [2, 165],
            132: [2, 165],
            133: [2, 165],
            134: [2, 165],
          },
          { 5: 301, 25: [1, 5] },
          { 26: [1, 302] },
          { 6: [1, 303], 26: [2, 171], 118: [2, 171], 120: [2, 171] },
          {
            8: 304,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            1: [2, 98],
            6: [2, 98],
            25: [2, 98],
            26: [2, 98],
            47: [2, 98],
            52: [2, 98],
            55: [2, 98],
            70: [2, 98],
            75: [2, 98],
            83: [2, 98],
            88: [2, 98],
            90: [2, 98],
            99: [2, 98],
            101: [2, 98],
            102: [2, 98],
            103: [2, 98],
            107: [2, 98],
            115: [2, 98],
            123: [2, 98],
            125: [2, 98],
            126: [2, 98],
            129: [2, 98],
            130: [2, 98],
            131: [2, 98],
            132: [2, 98],
            133: [2, 98],
            134: [2, 98],
          },
          {
            1: [2, 135],
            6: [2, 135],
            25: [2, 135],
            26: [2, 135],
            47: [2, 135],
            52: [2, 135],
            55: [2, 135],
            64: [2, 135],
            65: [2, 135],
            66: [2, 135],
            68: [2, 135],
            70: [2, 135],
            71: [2, 135],
            75: [2, 135],
            81: [2, 135],
            82: [2, 135],
            83: [2, 135],
            88: [2, 135],
            90: [2, 135],
            99: [2, 135],
            101: [2, 135],
            102: [2, 135],
            103: [2, 135],
            107: [2, 135],
            115: [2, 135],
            123: [2, 135],
            125: [2, 135],
            126: [2, 135],
            129: [2, 135],
            130: [2, 135],
            131: [2, 135],
            132: [2, 135],
            133: [2, 135],
            134: [2, 135],
          },
          {
            1: [2, 114],
            6: [2, 114],
            25: [2, 114],
            26: [2, 114],
            47: [2, 114],
            52: [2, 114],
            55: [2, 114],
            64: [2, 114],
            65: [2, 114],
            66: [2, 114],
            68: [2, 114],
            70: [2, 114],
            71: [2, 114],
            75: [2, 114],
            81: [2, 114],
            82: [2, 114],
            83: [2, 114],
            88: [2, 114],
            90: [2, 114],
            99: [2, 114],
            101: [2, 114],
            102: [2, 114],
            103: [2, 114],
            107: [2, 114],
            115: [2, 114],
            123: [2, 114],
            125: [2, 114],
            126: [2, 114],
            129: [2, 114],
            130: [2, 114],
            131: [2, 114],
            132: [2, 114],
            133: [2, 114],
            134: [2, 114],
          },
          {
            6: [2, 121],
            25: [2, 121],
            26: [2, 121],
            52: [2, 121],
            83: [2, 121],
            88: [2, 121],
          },
          { 6: [2, 51], 25: [2, 51], 26: [2, 51], 51: 305, 52: [1, 222] },
          {
            6: [2, 122],
            25: [2, 122],
            26: [2, 122],
            52: [2, 122],
            83: [2, 122],
            88: [2, 122],
          },
          {
            1: [2, 160],
            6: [2, 160],
            25: [2, 160],
            26: [2, 160],
            47: [2, 160],
            52: [2, 160],
            55: [2, 160],
            70: [2, 160],
            75: [2, 160],
            83: [2, 160],
            88: [2, 160],
            90: [2, 160],
            99: [2, 160],
            100: 85,
            101: [2, 160],
            102: [2, 160],
            103: [2, 160],
            106: 86,
            107: [2, 160],
            108: 67,
            115: [1, 306],
            123: [2, 160],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 162],
            6: [2, 162],
            25: [2, 162],
            26: [2, 162],
            47: [2, 162],
            52: [2, 162],
            55: [2, 162],
            70: [2, 162],
            75: [2, 162],
            83: [2, 162],
            88: [2, 162],
            90: [2, 162],
            99: [2, 162],
            100: 85,
            101: [2, 162],
            102: [1, 307],
            103: [2, 162],
            106: 86,
            107: [2, 162],
            108: 67,
            115: [2, 162],
            123: [2, 162],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 161],
            6: [2, 161],
            25: [2, 161],
            26: [2, 161],
            47: [2, 161],
            52: [2, 161],
            55: [2, 161],
            70: [2, 161],
            75: [2, 161],
            83: [2, 161],
            88: [2, 161],
            90: [2, 161],
            99: [2, 161],
            100: 85,
            101: [2, 161],
            102: [2, 161],
            103: [2, 161],
            106: 86,
            107: [2, 161],
            108: 67,
            115: [2, 161],
            123: [2, 161],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [2, 89], 25: [2, 89], 26: [2, 89], 52: [2, 89], 75: [2, 89] },
          { 6: [2, 51], 25: [2, 51], 26: [2, 51], 51: 308, 52: [1, 232] },
          {
            26: [1, 309],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 26: [1, 310] },
          {
            1: [2, 168],
            6: [2, 168],
            25: [2, 168],
            26: [2, 168],
            47: [2, 168],
            52: [2, 168],
            55: [2, 168],
            70: [2, 168],
            75: [2, 168],
            83: [2, 168],
            88: [2, 168],
            90: [2, 168],
            99: [2, 168],
            101: [2, 168],
            102: [2, 168],
            103: [2, 168],
            107: [2, 168],
            115: [2, 168],
            123: [2, 168],
            125: [2, 168],
            126: [2, 168],
            129: [2, 168],
            130: [2, 168],
            131: [2, 168],
            132: [2, 168],
            133: [2, 168],
            134: [2, 168],
          },
          { 26: [2, 172], 118: [2, 172], 120: [2, 172] },
          {
            25: [2, 127],
            52: [2, 127],
            100: 85,
            101: [1, 63],
            103: [1, 64],
            106: 86,
            107: [1, 66],
            108: 67,
            123: [1, 84],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [1, 260], 25: [1, 261], 26: [1, 311] },
          {
            8: 312,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          {
            8: 313,
            9: 115,
            10: 20,
            11: 21,
            12: [1, 22],
            13: 8,
            14: 9,
            15: 10,
            16: 11,
            17: 12,
            18: 13,
            19: 14,
            20: 15,
            21: 16,
            22: 17,
            23: 18,
            24: 19,
            27: 60,
            28: [1, 71],
            29: 49,
            30: [1, 69],
            31: [1, 70],
            32: 24,
            33: [1, 50],
            34: [1, 51],
            35: [1, 52],
            36: [1, 53],
            37: 23,
            42: 61,
            43: [1, 45],
            44: [1, 46],
            45: [1, 29],
            48: 30,
            49: [1, 58],
            50: [1, 59],
            56: 47,
            57: 48,
            59: 36,
            61: 25,
            62: 26,
            63: 27,
            73: [1, 68],
            76: [1, 43],
            80: [1, 28],
            85: [1, 56],
            86: [1, 57],
            87: [1, 55],
            93: [1, 38],
            97: [1, 44],
            98: [1, 54],
            100: 39,
            101: [1, 63],
            103: [1, 64],
            104: 40,
            105: [1, 65],
            106: 41,
            107: [1, 66],
            108: 67,
            116: [1, 42],
            121: 37,
            122: [1, 62],
            124: [1, 31],
            125: [1, 32],
            126: [1, 33],
            127: [1, 34],
            128: [1, 35],
          },
          { 6: [1, 271], 25: [1, 272], 26: [1, 314] },
          { 6: [2, 39], 25: [2, 39], 26: [2, 39], 52: [2, 39], 75: [2, 39] },
          {
            1: [2, 166],
            6: [2, 166],
            25: [2, 166],
            26: [2, 166],
            47: [2, 166],
            52: [2, 166],
            55: [2, 166],
            70: [2, 166],
            75: [2, 166],
            83: [2, 166],
            88: [2, 166],
            90: [2, 166],
            99: [2, 166],
            101: [2, 166],
            102: [2, 166],
            103: [2, 166],
            107: [2, 166],
            115: [2, 166],
            123: [2, 166],
            125: [2, 166],
            126: [2, 166],
            129: [2, 166],
            130: [2, 166],
            131: [2, 166],
            132: [2, 166],
            133: [2, 166],
            134: [2, 166],
          },
          {
            6: [2, 123],
            25: [2, 123],
            26: [2, 123],
            52: [2, 123],
            83: [2, 123],
            88: [2, 123],
          },
          {
            1: [2, 163],
            6: [2, 163],
            25: [2, 163],
            26: [2, 163],
            47: [2, 163],
            52: [2, 163],
            55: [2, 163],
            70: [2, 163],
            75: [2, 163],
            83: [2, 163],
            88: [2, 163],
            90: [2, 163],
            99: [2, 163],
            100: 85,
            101: [2, 163],
            102: [2, 163],
            103: [2, 163],
            106: 86,
            107: [2, 163],
            108: 67,
            115: [2, 163],
            123: [2, 163],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          {
            1: [2, 164],
            6: [2, 164],
            25: [2, 164],
            26: [2, 164],
            47: [2, 164],
            52: [2, 164],
            55: [2, 164],
            70: [2, 164],
            75: [2, 164],
            83: [2, 164],
            88: [2, 164],
            90: [2, 164],
            99: [2, 164],
            100: 85,
            101: [2, 164],
            102: [2, 164],
            103: [2, 164],
            106: 86,
            107: [2, 164],
            108: 67,
            115: [2, 164],
            123: [2, 164],
            125: [1, 78],
            126: [1, 77],
            129: [1, 76],
            130: [1, 79],
            131: [1, 80],
            132: [1, 81],
            133: [1, 82],
            134: [1, 83],
          },
          { 6: [2, 90], 25: [2, 90], 26: [2, 90], 52: [2, 90], 75: [2, 90] },
        ],
        defaultActions: {
          58: [2, 49],
          59: [2, 50],
          73: [2, 3],
          92: [2, 104],
          186: [2, 84],
        },
        parseError: function (b, c) {
          throw new Error(b);
        },
        parse: function (b) {
          function o(a) {
            (d.length = d.length - 2 * a),
              (e.length = e.length - a),
              (f.length = f.length - a);
          }
          function p() {
            var a;
            return (
              (a = c.lexer.lex() || 1),
              typeof a != "number" && (a = c.symbols_[a] || a),
              a
            );
          }
          var c = this,
            d = [0],
            e = [null],
            f = [],
            g = this.table,
            h = "",
            i = 0,
            j = 0,
            k = 0,
            l = 2,
            m = 1;
          this.lexer.setInput(b),
            (this.lexer.yy = this.yy),
            (this.yy.lexer = this.lexer),
            typeof this.lexer.yylloc == "undefined" && (this.lexer.yylloc = {});
          var n = this.lexer.yylloc;
          f.push(n),
            typeof this.yy.parseError == "function" &&
              (this.parseError = this.yy.parseError);
          var q,
            r,
            s,
            t,
            u,
            v,
            w = {},
            x,
            y,
            z,
            A;
          for (;;) {
            (s = d[d.length - 1]),
              this.defaultActions[s]
                ? (t = this.defaultActions[s])
                : (q == null && (q = p()), (t = g[s] && g[s][q]));
            if (typeof t == "undefined" || !t.length || !t[0])
              if (!k) {
                A = [];
                for (x in g[s])
                  this.terminals_[x] &&
                    x > 2 &&
                    A.push("'" + this.terminals_[x] + "'");
                var B = "";
                this.lexer.showPosition
                  ? (B =
                      "Parse error on line " +
                      (i + 1) +
                      ":\n" +
                      this.lexer.showPosition() +
                      "\nExpecting " +
                      A.join(", ") +
                      ", got '" +
                      this.terminals_[q] +
                      "'")
                  : (B =
                      "Parse error on line " +
                      (i + 1) +
                      ": Unexpected " +
                      (q == 1
                        ? "end of input"
                        : "'" + (this.terminals_[q] || q) + "'")),
                  this.parseError(B, {
                    text: this.lexer.match,
                    token: this.terminals_[q] || q,
                    line: this.lexer.yylineno,
                    loc: n,
                    expected: A,
                  });
              }
            if (t[0] instanceof Array && t.length > 1)
              throw new Error(
                "Parse Error: multiple actions possible at state: " +
                  s +
                  ", token: " +
                  q
              );
            switch (t[0]) {
              case 1:
                d.push(q),
                  e.push(this.lexer.yytext),
                  f.push(this.lexer.yylloc),
                  d.push(t[1]),
                  (q = null),
                  r
                    ? ((q = r), (r = null))
                    : ((j = this.lexer.yyleng),
                      (h = this.lexer.yytext),
                      (i = this.lexer.yylineno),
                      (n = this.lexer.yylloc),
                      k > 0 && k--);
                break;
              case 2:
                (y = this.productions_[t[1]][1]),
                  (w.$ = e[e.length - y]),
                  (w._$ = {
                    first_line: f[f.length - (y || 1)].first_line,
                    last_line: f[f.length - 1].last_line,
                    first_column: f[f.length - (y || 1)].first_column,
                    last_column: f[f.length - 1].last_column,
                  }),
                  (v = this.performAction.call(
                    w,
                    h,
                    j,
                    i,
                    this.yy,
                    t[1],
                    e,
                    f
                  ));
                if (typeof v != "undefined") return v;
                y &&
                  ((d = d.slice(0, -1 * y * 2)),
                  (e = e.slice(0, -1 * y)),
                  (f = f.slice(0, -1 * y))),
                  d.push(this.productions_[t[1]][0]),
                  e.push(w.$),
                  f.push(w._$),
                  (z = g[d[d.length - 2]][d[d.length - 1]]),
                  d.push(z);
                break;
              case 3:
                return !0;
            }
          }
          return !0;
        },
      };
      c.exports = d;
    }
  ),
  define(
    "ace/mode/coffee/nodes",
    [
      "require",
      "exports",
      "module",
      "ace/mode/coffee/scope",
      "ace/mode/coffee/lexer",
      "ace/mode/coffee/helpers",
    ],
    function (a, b, c) {
      var d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p,
        q,
        r,
        s,
        t,
        u,
        v,
        w,
        x,
        y,
        z,
        A,
        B,
        C,
        D,
        E,
        F,
        G,
        H,
        I,
        J,
        K,
        L,
        M,
        N,
        O,
        P,
        Q,
        R,
        S,
        T,
        U,
        V,
        W,
        X,
        Y,
        Z,
        $,
        _,
        ab,
        bb,
        cb,
        db,
        eb,
        fb,
        gb,
        hb,
        ib,
        jb,
        kb,
        lb,
        mb = {}.hasOwnProperty,
        nb = function (a, b) {
          function d() {
            this.constructor = a;
          }
          for (var c in b) mb.call(b, c) && (a[c] = b[c]);
          return (
            (d.prototype = b.prototype),
            (a.prototype = new d()),
            (a.__super__ = b.prototype),
            a
          );
        },
        ob =
          [].indexOf ||
          function (a) {
            for (var b = 0, c = this.length; b < c; b++)
              if (b in this && this[b] === a) return b;
            return -1;
          };
      (P = a("./scope").Scope),
        (kb = a("./lexer")),
        (K = kb.RESERVED),
        (O = kb.STRICT_PROSCRIBED),
        (lb = a("./helpers")),
        (_ = lb.compact),
        (db = lb.flatten),
        (cb = lb.extend),
        (fb = lb.merge),
        (ab = lb.del),
        (hb = lb.starts),
        (bb = lb.ends),
        (eb = lb.last),
        (b.extend = cb),
        ($ = function () {
          return !0;
        }),
        (F = function () {
          return !1;
        }),
        (U = function () {
          return this;
        }),
        (E = function () {
          return (this.negated = !this.negated), this;
        }),
        (b.Base = g =
          (function () {
            function a() {}
            return (
              (a.name = "Base"),
              (a.prototype.compile = function (a, b) {
                var c;
                return (
                  (a = cb({}, a)),
                  b && (a.level = b),
                  (c = this.unfoldSoak(a) || this),
                  (c.tab = a.indent),
                  a.level === B || !c.isStatement(a)
                    ? c.compileNode(a)
                    : c.compileClosure(a)
                );
              }),
              (a.prototype.compileClosure = function (a) {
                if (this.jumps())
                  throw SyntaxError(
                    "cannot use a pure statement in an expression."
                  );
                return (a.sharedScope = !0), k.wrap(this).compileNode(a);
              }),
              (a.prototype.cache = function (a, b, c) {
                var d, e;
                return this.isComplex()
                  ? ((d = new C(c || a.scope.freeVariable("ref"))),
                    (e = new f(d, this)),
                    b ? [e.compile(a, b), d.value] : [e, d])
                  : ((d = b ? this.compile(a, b) : this), [d, d]);
              }),
              (a.prototype.compileLoopReference = function (a, b) {
                var c, d;
                return (
                  (c = d = this.compile(a, y)),
                  (-Infinity < +c && +c < Infinity) ||
                    (q.test(c) && a.scope.check(c, !0)) ||
                    (c = "" + (d = a.scope.freeVariable(b)) + " = " + c),
                  [c, d]
                );
              }),
              (a.prototype.makeReturn = function (a) {
                var b;
                return (
                  (b = this.unwrapAll()),
                  a ? new i(new C("" + a + ".push"), [b]) : new M(b)
                );
              }),
              (a.prototype.contains = function (a) {
                var b;
                return (
                  (b = !1),
                  this.traverseChildren(!1, function (c) {
                    if (a(c)) return (b = !0), !1;
                  }),
                  b
                );
              }),
              (a.prototype.containsType = function (a) {
                return (
                  this instanceof a ||
                  this.contains(function (b) {
                    return b instanceof a;
                  })
                );
              }),
              (a.prototype.lastNonComment = function (a) {
                var b;
                b = a.length;
                while (b--) if (!(a[b] instanceof m)) return a[b];
                return null;
              }),
              (a.prototype.toString = function (a, b) {
                var c;
                return (
                  a == null && (a = ""),
                  b == null && (b = this.constructor.name),
                  (c = "\n" + a + b),
                  this.soak && (c += "?"),
                  this.eachChild(function (b) {
                    return (c += b.toString(a + T));
                  }),
                  c
                );
              }),
              (a.prototype.eachChild = function (a) {
                var b, c, d, e, f, g, h, i;
                if (!this.children) return this;
                h = this.children;
                for (d = 0, f = h.length; d < f; d++) {
                  b = h[d];
                  if (this[b]) {
                    i = db([this[b]]);
                    for (e = 0, g = i.length; e < g; e++) {
                      c = i[e];
                      if (a(c) === !1) return this;
                    }
                  }
                }
                return this;
              }),
              (a.prototype.traverseChildren = function (a, b) {
                return this.eachChild(function (c) {
                  return b(c) === !1 ? !1 : c.traverseChildren(a, b);
                });
              }),
              (a.prototype.invert = function () {
                return new H("!", this);
              }),
              (a.prototype.unwrapAll = function () {
                var a;
                a = this;
                while (a !== (a = a.unwrap())) continue;
                return a;
              }),
              (a.prototype.children = []),
              (a.prototype.isStatement = F),
              (a.prototype.jumps = F),
              (a.prototype.isComplex = $),
              (a.prototype.isChainable = F),
              (a.prototype.isAssignable = F),
              (a.prototype.unwrap = U),
              (a.prototype.unfoldSoak = F),
              (a.prototype.assigns = F),
              a
            );
          })()),
        (b.Block = h =
          (function (a) {
            function b(a) {
              this.expressions = _(db(a || []));
            }
            return (
              nb(b, a),
              (b.name = "Block"),
              (b.prototype.children = ["expressions"]),
              (b.prototype.push = function (a) {
                return this.expressions.push(a), this;
              }),
              (b.prototype.pop = function () {
                return this.expressions.pop();
              }),
              (b.prototype.unshift = function (a) {
                return this.expressions.unshift(a), this;
              }),
              (b.prototype.unwrap = function () {
                return this.expressions.length === 1
                  ? this.expressions[0]
                  : this;
              }),
              (b.prototype.isEmpty = function () {
                return !this.expressions.length;
              }),
              (b.prototype.isStatement = function (a) {
                var b, c, d, e;
                e = this.expressions;
                for (c = 0, d = e.length; c < d; c++) {
                  b = e[c];
                  if (b.isStatement(a)) return !0;
                }
                return !1;
              }),
              (b.prototype.jumps = function (a) {
                var b, c, d, e;
                e = this.expressions;
                for (c = 0, d = e.length; c < d; c++) {
                  b = e[c];
                  if (b.jumps(a)) return b;
                }
              }),
              (b.prototype.makeReturn = function (a) {
                var b, c;
                c = this.expressions.length;
                while (c--) {
                  b = this.expressions[c];
                  if (!(b instanceof m)) {
                    (this.expressions[c] = b.makeReturn(a)),
                      b instanceof M &&
                        !b.expression &&
                        this.expressions.splice(c, 1);
                    break;
                  }
                }
                return this;
              }),
              (b.prototype.compile = function (a, c) {
                return (
                  a == null && (a = {}),
                  a.scope
                    ? b.__super__.compile.call(this, a, c)
                    : this.compileRoot(a)
                );
              }),
              (b.prototype.compileNode = function (a) {
                var c, d, e, f, g, h, i;
                (this.tab = a.indent),
                  (f = a.level === B),
                  (d = []),
                  (i = this.expressions);
                for (g = 0, h = i.length; g < h; g++)
                  (e = i[g]),
                    (e = e.unwrapAll()),
                    (e = e.unfoldSoak(a) || e),
                    e instanceof b
                      ? d.push(e.compileNode(a))
                      : f
                      ? ((e.front = !0),
                        (c = e.compile(a)),
                        e.isStatement(a) ||
                          ((c = "" + this.tab + c + ";"),
                          e instanceof C && (c = "" + c + "\n")),
                        d.push(c))
                      : d.push(e.compile(a, y));
                return f
                  ? this.spaced
                    ? "\n" + d.join("\n\n") + "\n"
                    : d.join("\n")
                  : ((c = d.join(", ") || "void 0"),
                    d.length > 1 && a.level >= y ? "(" + c + ")" : c);
              }),
              (b.prototype.compileRoot = function (a) {
                var b, c, d, e, f, g;
                return (
                  (a.indent = a.bare ? "" : T),
                  (a.scope = new P(null, this, null)),
                  (a.level = B),
                  (this.spaced = !0),
                  (e = ""),
                  a.bare ||
                    ((f = function () {
                      var a, b, e, f;
                      (e = this.expressions), (f = []);
                      for (d = a = 0, b = e.length; a < b; d = ++a) {
                        c = e[d];
                        if (!(c.unwrap() instanceof m)) break;
                        f.push(c);
                      }
                      return f;
                    }.call(this)),
                    (g = this.expressions.slice(f.length)),
                    (this.expressions = f),
                    f.length &&
                      (e = "" + this.compileNode(fb(a, { indent: "" })) + "\n"),
                    (this.expressions = g)),
                  (b = this.compileWithDeclarations(a)),
                  a.bare
                    ? b
                    : "" + e + "(function() {\n" + b + "\n}).call(this);\n"
                );
              }),
              (b.prototype.compileWithDeclarations = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, n, o, p;
                (c = g = ""), (n = this.expressions);
                for (f = k = 0, l = n.length; k < l; f = ++k) {
                  (e = n[f]), (e = e.unwrap());
                  if (!(e instanceof m || e instanceof C)) break;
                }
                (a = fb(a, { level: B })),
                  f &&
                    ((h = this.expressions.splice(f, 9e9)),
                    (o = [this.spaced, !1]),
                    (j = o[0]),
                    (this.spaced = o[1]),
                    (p = [this.compileNode(a), j]),
                    (c = p[0]),
                    (this.spaced = p[1]),
                    (this.expressions = h)),
                  (g = this.compileNode(a)),
                  (i = a.scope);
                if (i.expressions === this) {
                  (d = a.scope.hasDeclarations()), (b = i.hasAssignments);
                  if (d || b)
                    f && (c += "\n"),
                      (c += "" + this.tab + "var "),
                      d && (c += i.declaredVariables().join(", ")),
                      b &&
                        (d && (c += ",\n" + (this.tab + T)),
                        (c += i
                          .assignedVariables()
                          .join(",\n" + (this.tab + T)))),
                      (c += ";\n");
                }
                return c + g;
              }),
              (b.wrap = function (a) {
                return a.length === 1 && a[0] instanceof b ? a[0] : new b(a);
              }),
              b
            );
          })(g)),
        (b.Literal = C =
          (function (a) {
            function b(a) {
              this.value = a;
            }
            return (
              nb(b, a),
              (b.name = "Literal"),
              (b.prototype.makeReturn = function () {
                return this.isStatement()
                  ? this
                  : b.__super__.makeReturn.apply(this, arguments);
              }),
              (b.prototype.isAssignable = function () {
                return q.test(this.value);
              }),
              (b.prototype.isStatement = function () {
                var a;
                return (
                  (a = this.value) === "break" ||
                  a === "continue" ||
                  a === "debugger"
                );
              }),
              (b.prototype.isComplex = F),
              (b.prototype.assigns = function (a) {
                return a === this.value;
              }),
              (b.prototype.jumps = function (a) {
                if (
                  this.value === "break" &&
                  !(
                    (a != null ? a.loop : void 0) ||
                    (a != null ? a.block : void 0)
                  )
                )
                  return this;
                if (
                  this.value === "continue" &&
                  (a != null ? !a.loop : !void 0)
                )
                  return this;
              }),
              (b.prototype.compileNode = function (a) {
                var b, c;
                return (
                  (b = this.isUndefined
                    ? a.level >= w
                      ? "(void 0)"
                      : "void 0"
                    : this.value === "this"
                    ? ((c = a.scope.method) != null ? c.bound : void 0)
                      ? a.scope.method.context
                      : this.value
                    : this.value.reserved
                    ? '"' + this.value + '"'
                    : this.value),
                  this.isStatement() ? "" + this.tab + b + ";" : b
                );
              }),
              (b.prototype.toString = function () {
                return ' "' + this.value + '"';
              }),
              b
            );
          })(g)),
        (b.Return = M =
          (function (a) {
            function b(a) {
              a && !a.unwrap().isUndefined && (this.expression = a);
            }
            return (
              nb(b, a),
              (b.name = "Return"),
              (b.prototype.children = ["expression"]),
              (b.prototype.isStatement = $),
              (b.prototype.makeReturn = U),
              (b.prototype.jumps = U),
              (b.prototype.compile = function (a, c) {
                var d, e;
                return (
                  (d = (e = this.expression) != null ? e.makeReturn() : void 0),
                  !d || d instanceof b
                    ? b.__super__.compile.call(this, a, c)
                    : d.compile(a, c)
                );
              }),
              (b.prototype.compileNode = function (a) {
                return (
                  this.tab +
                  ("return" +
                    [
                      this.expression
                        ? " " + this.expression.compile(a, A)
                        : void 0,
                    ] +
                    ";")
                );
              }),
              b
            );
          })(g)),
        (b.Value = Y =
          (function (a) {
            function b(a, c, d) {
              return !c && a instanceof b
                ? a
                : ((this.base = a),
                  (this.properties = c || []),
                  d && (this[d] = !0),
                  this);
            }
            return (
              nb(b, a),
              (b.name = "Value"),
              (b.prototype.children = ["base", "properties"]),
              (b.prototype.add = function (a) {
                return (this.properties = this.properties.concat(a)), this;
              }),
              (b.prototype.hasProperties = function () {
                return !!this.properties.length;
              }),
              (b.prototype.isArray = function () {
                return !this.properties.length && this.base instanceof e;
              }),
              (b.prototype.isComplex = function () {
                return this.hasProperties() || this.base.isComplex();
              }),
              (b.prototype.isAssignable = function () {
                return this.hasProperties() || this.base.isAssignable();
              }),
              (b.prototype.isSimpleNumber = function () {
                return this.base instanceof C && N.test(this.base.value);
              }),
              (b.prototype.isString = function () {
                return this.base instanceof C && s.test(this.base.value);
              }),
              (b.prototype.isAtomic = function () {
                var a, b, c, d;
                d = this.properties.concat(this.base);
                for (b = 0, c = d.length; b < c; b++) {
                  a = d[b];
                  if (a.soak || a instanceof i) return !1;
                }
                return !0;
              }),
              (b.prototype.isStatement = function (a) {
                return !this.properties.length && this.base.isStatement(a);
              }),
              (b.prototype.assigns = function (a) {
                return !this.properties.length && this.base.assigns(a);
              }),
              (b.prototype.jumps = function (a) {
                return !this.properties.length && this.base.jumps(a);
              }),
              (b.prototype.isObject = function (a) {
                return this.properties.length
                  ? !1
                  : this.base instanceof G && (!a || this.base.generated);
              }),
              (b.prototype.isSplice = function () {
                return eb(this.properties) instanceof Q;
              }),
              (b.prototype.unwrap = function () {
                return this.properties.length ? this : this.base;
              }),
              (b.prototype.cacheReference = function (a) {
                var c, d, e, g;
                return (
                  (e = eb(this.properties)),
                  this.properties.length < 2 &&
                  !this.base.isComplex() &&
                  (e != null ? !e.isComplex() : !void 0)
                    ? [this, this]
                    : ((c = new b(this.base, this.properties.slice(0, -1))),
                      c.isComplex() &&
                        ((d = new C(a.scope.freeVariable("base"))),
                        (c = new b(new J(new f(d, c))))),
                      e
                        ? (e.isComplex() &&
                            ((g = new C(a.scope.freeVariable("name"))),
                            (e = new v(new f(g, e.index))),
                            (g = new v(g))),
                          [c.add(e), new b(d || c.base, [g || e])])
                        : [c, d])
                );
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f;
                (this.base.front = this.front),
                  (d = this.properties),
                  (b = this.base.compile(a, d.length ? w : null)),
                  (this.base instanceof J || d.length) &&
                    N.test(b) &&
                    (b = "" + b + ".");
                for (e = 0, f = d.length; e < f; e++)
                  (c = d[e]), (b += c.compile(a));
                return b;
              }),
              (b.prototype.unfoldSoak = function (a) {
                var c,
                  d = this;
                return this.unfoldedSoak != null
                  ? this.unfoldedSoak
                  : ((c = (function () {
                      var c, e, g, h, i, j, k, l, m;
                      if ((g = d.base.unfoldSoak(a)))
                        return (
                          Array.prototype.push.apply(
                            g.body.properties,
                            d.properties
                          ),
                          g
                        );
                      m = d.properties;
                      for (e = k = 0, l = m.length; k < l; e = ++k) {
                        h = m[e];
                        if (!h.soak) continue;
                        return (
                          (h.soak = !1),
                          (c = new b(d.base, d.properties.slice(0, e))),
                          (j = new b(d.base, d.properties.slice(e))),
                          c.isComplex() &&
                            ((i = new C(a.scope.freeVariable("ref"))),
                            (c = new J(new f(i, c))),
                            (j.base = i)),
                          new t(new n(c), j, { soak: !0 })
                        );
                      }
                      return null;
                    })()),
                    (this.unfoldedSoak = c || !1));
              }),
              b
            );
          })(g)),
        (b.Comment = m =
          (function (a) {
            function b(a) {
              this.comment = a;
            }
            return (
              nb(b, a),
              (b.name = "Comment"),
              (b.prototype.isStatement = $),
              (b.prototype.makeReturn = U),
              (b.prototype.compileNode = function (a, b) {
                var c;
                return (
                  (c =
                    "/*" +
                    gb(this.comment, this.tab) +
                    ("\n" + this.tab + "*/\n")),
                  (b || a.level) === B && (c = a.indent + c),
                  c
                );
              }),
              b
            );
          })(g)),
        (b.Call = i =
          (function (a) {
            function b(a, b, c) {
              (this.args = b != null ? b : []),
                (this.soak = c),
                (this.isNew = !1),
                (this.isSuper = a === "super"),
                (this.variable = this.isSuper ? null : a);
            }
            return (
              nb(b, a),
              (b.name = "Call"),
              (b.prototype.children = ["variable", "args"]),
              (b.prototype.newInstance = function () {
                var a, c;
                return (
                  (a =
                    ((c = this.variable) != null ? c.base : void 0) ||
                    this.variable),
                  a instanceof b && !a.isNew
                    ? a.newInstance()
                    : (this.isNew = !0),
                  this
                );
              }),
              (b.prototype.superReference = function (a) {
                var b, c, e;
                c = a.scope.method;
                if (!c)
                  throw SyntaxError("cannot call super outside of a function.");
                e = c.name;
                if (e == null)
                  throw SyntaxError(
                    "cannot call super on an anonymous function."
                  );
                return c.klass
                  ? ((b = [new d(new C("__super__"))]),
                    c["static"] && b.push(new d(new C("constructor"))),
                    b.push(new d(new C(e))),
                    new Y(new C(c.klass), b).compile(a))
                  : "" + e + ".__super__.constructor";
              }),
              (b.prototype.unfoldSoak = function (a) {
                var c, d, e, f, g, h, i, j, k;
                if (this.soak) {
                  if (this.variable) {
                    if ((d = ib(a, this, "variable"))) return d;
                    (j = new Y(this.variable).cacheReference(a)),
                      (e = j[0]),
                      (g = j[1]);
                  } else (e = new C(this.superReference(a))), (g = new Y(e));
                  return (
                    (g = new b(g, this.args)),
                    (g.isNew = this.isNew),
                    (e = new C("typeof " + e.compile(a) + ' === "function"')),
                    new t(e, new Y(g), { soak: !0 })
                  );
                }
                (c = this), (f = []);
                for (;;) {
                  if (c.variable instanceof b) {
                    f.push(c), (c = c.variable);
                    continue;
                  }
                  if (!(c.variable instanceof Y)) break;
                  f.push(c);
                  if (!((c = c.variable.base) instanceof b)) break;
                }
                k = f.reverse();
                for (h = 0, i = k.length; h < i; h++)
                  (c = k[h]),
                    d &&
                      (c.variable instanceof b
                        ? (c.variable = d)
                        : (c.variable.base = d)),
                    (d = ib(a, c, "variable"));
                return d;
              }),
              (b.prototype.filterImplicitObjects = function (a) {
                var b, c, d, e, g, h, i, j, k, l;
                c = [];
                for (h = 0, j = a.length; h < j; h++) {
                  b = a[h];
                  if (
                    !(
                      (typeof b.isObject == "function"
                        ? b.isObject()
                        : void 0) && b.base.generated
                    )
                  ) {
                    c.push(b);
                    continue;
                  }
                  (d = null), (l = b.base.properties);
                  for (i = 0, k = l.length; i < k; i++)
                    (e = l[i]),
                      e instanceof f || e instanceof m
                        ? (d || c.push((d = new G((g = []), !0))), g.push(e))
                        : (c.push(e), (d = null));
                }
                return c;
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e;
                return (
                  (e = this.variable) != null && (e.front = this.front),
                  (d = R.compileSplattedArray(a, this.args, !0))
                    ? this.compileSplat(a, d)
                    : ((c = this.filterImplicitObjects(this.args)),
                      (c = (function () {
                        var d, e, f;
                        f = [];
                        for (d = 0, e = c.length; d < e; d++)
                          (b = c[d]), f.push(b.compile(a, y));
                        return f;
                      })().join(", ")),
                      this.isSuper
                        ? this.superReference(a) +
                          (".call(this" + (c && ", " + c) + ")")
                        : (this.isNew ? "new " : "") +
                          this.variable.compile(a, w) +
                          ("(" + c + ")"))
                );
              }),
              (b.prototype.compileSuper = function (a, b) {
                return (
                  "" +
                  this.superReference(b) +
                  ".call(this" +
                  (a.length ? ", " : "") +
                  a +
                  ")"
                );
              }),
              (b.prototype.compileSplat = function (a, b) {
                var c, d, e, f, g;
                return this.isSuper
                  ? "" + this.superReference(a) + ".apply(this, " + b + ")"
                  : this.isNew
                  ? ((e = this.tab + T),
                    "(function(func, args, ctor) {\n" +
                      e +
                      "ctor.prototype = func.prototype;\n" +
                      e +
                      "var child = new ctor, result = func.apply(child, args), t = typeof result;\n" +
                      e +
                      'return t == "object" || t == "function" ? result || child : child;\n' +
                      this.tab +
                      "})(" +
                      this.variable.compile(a, y) +
                      ", " +
                      b +
                      ", function(){})")
                  : ((c = new Y(this.variable)),
                    (f = c.properties.pop()) && c.isComplex()
                      ? ((g = a.scope.freeVariable("ref")),
                        (d =
                          "(" +
                          g +
                          " = " +
                          c.compile(a, y) +
                          ")" +
                          f.compile(a)))
                      : ((d = c.compile(a, w)),
                        N.test(d) && (d = "(" + d + ")"),
                        f ? ((g = d), (d += f.compile(a))) : (g = "null")),
                    "" + d + ".apply(" + g + ", " + b + ")");
              }),
              b
            );
          })(g)),
        (b.Extends = o =
          (function (a) {
            function b(a, b) {
              (this.child = a), (this.parent = b);
            }
            return (
              nb(b, a),
              (b.name = "Extends"),
              (b.prototype.children = ["child", "parent"]),
              (b.prototype.compile = function (a) {
                return new i(new Y(new C(jb("extends"))), [
                  this.child,
                  this.parent,
                ]).compile(a);
              }),
              b
            );
          })(g)),
        (b.Access = d =
          (function (a) {
            function b(a, b) {
              (this.name = a),
                (this.name.asKey = !0),
                (this.soak = b === "soak");
            }
            return (
              nb(b, a),
              (b.name = "Access"),
              (b.prototype.children = ["name"]),
              (b.prototype.compile = function (a) {
                var b;
                return (
                  (b = this.name.compile(a)),
                  q.test(b) ? "." + b : "[" + b + "]"
                );
              }),
              (b.prototype.isComplex = F),
              b
            );
          })(g)),
        (b.Index = v =
          (function (a) {
            function b(a) {
              this.index = a;
            }
            return (
              nb(b, a),
              (b.name = "Index"),
              (b.prototype.children = ["index"]),
              (b.prototype.compile = function (a) {
                return "[" + this.index.compile(a, A) + "]";
              }),
              (b.prototype.isComplex = function () {
                return this.index.isComplex();
              }),
              b
            );
          })(g)),
        (b.Range = L =
          (function (a) {
            function b(a, b, c) {
              (this.from = a),
                (this.to = b),
                (this.exclusive = c === "exclusive"),
                (this.equals = this.exclusive ? "" : "=");
            }
            return (
              nb(b, a),
              (b.name = "Range"),
              (b.prototype.children = ["from", "to"]),
              (b.prototype.compileVariables = function (a) {
                var b, c, d, e, f;
                (a = fb(a, { top: !0 })),
                  (c = this.from.cache(a, y)),
                  (this.fromC = c[0]),
                  (this.fromVar = c[1]),
                  (d = this.to.cache(a, y)),
                  (this.toC = d[0]),
                  (this.toVar = d[1]);
                if ((b = ab(a, "step")))
                  (e = b.cache(a, y)),
                    (this.step = e[0]),
                    (this.stepVar = e[1]);
                (f = [this.fromVar.match(N), this.toVar.match(N)]),
                  (this.fromNum = f[0]),
                  (this.toNum = f[1]);
                if (this.stepVar) return (this.stepNum = this.stepVar.match(N));
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o;
                return (
                  this.fromVar || this.compileVariables(a),
                  a.index
                    ? ((h = this.fromNum && this.toNum),
                      (f = ab(a, "index")),
                      (g = ab(a, "name")),
                      (j = g && g !== f),
                      (m = "" + f + " = " + this.fromC),
                      this.toC !== this.toVar && (m += ", " + this.toC),
                      this.step !== this.stepVar && (m += ", " + this.step),
                      (n = [
                        "" + f + " <" + this.equals,
                        "" + f + " >" + this.equals,
                      ]),
                      (i = n[0]),
                      (e = n[1]),
                      (c = this.stepNum
                        ? +this.stepNum > 0
                          ? "" + i + " " + this.toVar
                          : "" + e + " " + this.toVar
                        : h
                        ? ((o = [+this.fromNum, +this.toNum]),
                          (d = o[0]),
                          (l = o[1]),
                          o,
                          d <= l ? "" + i + " " + l : "" + e + " " + l)
                        : ((b = "" + this.fromVar + " <= " + this.toVar),
                          "" +
                            b +
                            " ? " +
                            i +
                            " " +
                            this.toVar +
                            " : " +
                            e +
                            " " +
                            this.toVar)),
                      (k = this.stepVar
                        ? "" + f + " += " + this.stepVar
                        : h
                        ? j
                          ? d <= l
                            ? "++" + f
                            : "--" + f
                          : d <= l
                          ? "" + f + "++"
                          : "" + f + "--"
                        : j
                        ? "" + b + " ? ++" + f + " : --" + f
                        : "" + b + " ? " + f + "++ : " + f + "--"),
                      j && (m = "" + g + " = " + m),
                      j && (k = "" + g + " = " + k),
                      "" + m + "; " + c + "; " + k)
                    : this.compileArray(a)
                );
              }),
              (b.prototype.compileArray = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p;
                if (
                  this.fromNum &&
                  this.toNum &&
                  Math.abs(this.fromNum - this.toNum) <= 20
                )
                  return (
                    (j = function () {
                      p = [];
                      for (
                        var a = (n = +this.fromNum), b = +this.toNum;
                        n <= b ? a <= b : a >= b;
                        n <= b ? a++ : a--
                      )
                        p.push(a);
                      return p;
                    }.apply(this)),
                    this.exclusive && j.pop(),
                    "[" + j.join(", ") + "]"
                  );
                (g = this.tab + T),
                  (f = a.scope.freeVariable("i")),
                  (k = a.scope.freeVariable("results")),
                  (i = "\n" + g + k + " = [];"),
                  this.fromNum && this.toNum
                    ? ((a.index = f), (c = this.compileNode(a)))
                    : ((l =
                        "" +
                        f +
                        " = " +
                        this.fromC +
                        (this.toC !== this.toVar ? ", " + this.toC : "")),
                      (d = "" + this.fromVar + " <= " + this.toVar),
                      (c =
                        "var " +
                        l +
                        "; " +
                        d +
                        " ? " +
                        f +
                        " <" +
                        this.equals +
                        " " +
                        this.toVar +
                        " : " +
                        f +
                        " >" +
                        this.equals +
                        " " +
                        this.toVar +
                        "; " +
                        d +
                        " ? " +
                        f +
                        "++ : " +
                        f +
                        "--")),
                  (h =
                    "{ " +
                    k +
                    ".push(" +
                    f +
                    "); }\n" +
                    g +
                    "return " +
                    k +
                    ";\n" +
                    a.indent),
                  (e = function (a) {
                    return a != null
                      ? a.contains(function (a) {
                          return (
                            a instanceof C &&
                            a.value === "arguments" &&
                            !a.asKey
                          );
                        })
                      : void 0;
                  });
                if (e(this.from) || e(this.to)) b = ", arguments";
                return (
                  "(function() {" +
                  i +
                  "\n" +
                  g +
                  "for (" +
                  c +
                  ")" +
                  h +
                  "}).apply(this" +
                  (b != null ? b : "") +
                  ")"
                );
              }),
              b
            );
          })(g)),
        (b.Slice = Q =
          (function (a) {
            function b(a) {
              (this.range = a), b.__super__.constructor.call(this);
            }
            return (
              nb(b, a),
              (b.name = "Slice"),
              (b.prototype.children = ["range"]),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f, g;
                return (
                  (g = this.range),
                  (e = g.to),
                  (c = g.from),
                  (d = (c && c.compile(a, A)) || "0"),
                  (b = e && e.compile(a, A)),
                  e &&
                    (!!this.range.exclusive || +b !== -1) &&
                    (f =
                      ", " +
                      (this.range.exclusive
                        ? b
                        : N.test(b)
                        ? "" + (+b + 1)
                        : ((b = e.compile(a, w)), "" + b + " + 1 || 9e9"))),
                  ".slice(" + d + (f || "") + ")"
                );
              }),
              b
            );
          })(g)),
        (b.Obj = G =
          (function (a) {
            function b(a, b) {
              (this.generated = b != null ? b : !1),
                (this.objects = this.properties = a || []);
            }
            return (
              nb(b, a),
              (b.name = "Obj"),
              (b.prototype.children = ["properties"]),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, g, h, i, j, k, l, n, o, p, q, r, s;
                (n = this.properties), (l = []), (s = this.properties);
                for (o = 0, q = s.length; o < q; o++) {
                  (j = s[o]), j.isComplex() && (j = j.variable);
                  if (j != null) {
                    k = j.unwrapAll().value.toString();
                    if (ob.call(l, k) >= 0)
                      throw SyntaxError(
                        'multiple object literal properties named "' + k + '"'
                      );
                    l.push(k);
                  }
                }
                if (!n.length) return this.front ? "({})" : "{}";
                if (this.generated)
                  for (p = 0, r = n.length; p < r; p++) {
                    h = n[p];
                    if (h instanceof Y)
                      throw new Error(
                        "cannot have an implicit value in an implicit object"
                      );
                  }
                return (
                  (c = a.indent += T),
                  (g = this.lastNonComment(this.properties)),
                  (n = (function () {
                    var h, i, k;
                    k = [];
                    for (b = h = 0, i = n.length; h < i; b = ++h)
                      (j = n[b]),
                        (e =
                          b === n.length - 1
                            ? ""
                            : j === g || j instanceof m
                            ? "\n"
                            : ",\n"),
                        (d = j instanceof m ? "" : c),
                        j instanceof Y &&
                          j["this"] &&
                          (j = new f(j.properties[0].name, j, "object")),
                        j instanceof m ||
                          (j instanceof f || (j = new f(j, j, "object")),
                          ((j.variable.base || j.variable).asKey = !0)),
                        k.push(d + j.compile(a, B) + e);
                    return k;
                  })()),
                  (n = n.join("")),
                  (i = "{" + (n && "\n" + n + "\n" + this.tab) + "}"),
                  this.front ? "(" + i + ")" : i
                );
              }),
              (b.prototype.assigns = function (a) {
                var b, c, d, e;
                e = this.properties;
                for (c = 0, d = e.length; c < d; c++) {
                  b = e[c];
                  if (b.assigns(a)) return !0;
                }
                return !1;
              }),
              b
            );
          })(g)),
        (b.Arr = e =
          (function (a) {
            function b(a) {
              this.objects = a || [];
            }
            return (
              nb(b, a),
              (b.name = "Arr"),
              (b.prototype.children = ["objects"]),
              (b.prototype.filterImplicitObjects =
                i.prototype.filterImplicitObjects),
              (b.prototype.compileNode = function (a) {
                var b, c, d;
                return this.objects.length
                  ? ((a.indent += T),
                    (d = this.filterImplicitObjects(this.objects)),
                    (b = R.compileSplattedArray(a, d))
                      ? b
                      : ((b = (function () {
                          var b, e, f;
                          f = [];
                          for (b = 0, e = d.length; b < e; b++)
                            (c = d[b]), f.push(c.compile(a, y));
                          return f;
                        })().join(", ")),
                        b.indexOf("\n") >= 0
                          ? "[\n" + a.indent + b + "\n" + this.tab + "]"
                          : "[" + b + "]"))
                  : "[]";
              }),
              (b.prototype.assigns = function (a) {
                var b, c, d, e;
                e = this.objects;
                for (c = 0, d = e.length; c < d; c++) {
                  b = e[c];
                  if (b.assigns(a)) return !0;
                }
                return !1;
              }),
              b
            );
          })(g)),
        (b.Class = j =
          (function (a) {
            function b(a, b, c) {
              (this.variable = a),
                (this.parent = b),
                (this.body = c != null ? c : new h()),
                (this.boundFuncs = []),
                (this.body.classBody = !0);
            }
            return (
              nb(b, a),
              (b.name = "Class"),
              (b.prototype.children = ["variable", "parent", "body"]),
              (b.prototype.determineName = function () {
                var a, b;
                if (!this.variable) return null;
                a = (b = eb(this.variable.properties))
                  ? b instanceof d && b.name.value
                  : this.variable.base.value;
                if (ob.call(O, a) >= 0)
                  throw SyntaxError("variable name may not be " + a);
                return a && (a = q.test(a) && a);
              }),
              (b.prototype.setContext = function (a) {
                return this.body.traverseChildren(!1, function (b) {
                  if (b.classBody) return !1;
                  if (b instanceof C && b.value === "this")
                    return (b.value = a);
                  if (b instanceof l) {
                    b.klass = a;
                    if (b.bound) return (b.context = a);
                  }
                });
              }),
              (b.prototype.addBoundFunctions = function (a) {
                var b, c, e, f, g, h;
                if (this.boundFuncs.length) {
                  (g = this.boundFuncs), (h = []);
                  for (e = 0, f = g.length; e < f; e++)
                    (b = g[e]),
                      (c = new Y(new C("this"), [new d(b)]).compile(a)),
                      h.push(
                        this.ctor.body.unshift(
                          new C(
                            "" + c + " = " + jb("bind") + "(" + c + ", this)"
                          )
                        )
                      );
                  return h;
                }
              }),
              (b.prototype.addProperties = function (a, b, c) {
                var e, g, h, i, j;
                return (
                  (j = a.base.properties.slice(0)),
                  (h = function () {
                    var a;
                    a = [];
                    while ((e = j.shift())) {
                      if (e instanceof f) {
                        (g = e.variable.base), delete e.context, (i = e.value);
                        if (g.value === "constructor") {
                          if (this.ctor)
                            throw new Error(
                              "cannot define more than one constructor in a class"
                            );
                          if (i.bound)
                            throw new Error(
                              "cannot define a constructor as a bound function"
                            );
                          i instanceof l
                            ? (e = this.ctor = i)
                            : ((this.externalCtor =
                                c.scope.freeVariable("class")),
                              (e = new f(new C(this.externalCtor), i)));
                        } else
                          e.variable["this"]
                            ? ((i["static"] = !0), i.bound && (i.context = b))
                            : ((e.variable = new Y(new C(b), [
                                new d(new C("prototype")),
                                new d(g),
                              ])),
                              i instanceof l &&
                                i.bound &&
                                (this.boundFuncs.push(g), (i.bound = !1)));
                      }
                      a.push(e);
                    }
                    return a;
                  }.call(this)),
                  _(h)
                );
              }),
              (b.prototype.walkBody = function (a, c) {
                var d = this;
                return this.traverseChildren(!1, function (e) {
                  var f, g, i, j, k, l;
                  if (e instanceof b) return !1;
                  if (e instanceof h) {
                    l = f = e.expressions;
                    for (g = j = 0, k = l.length; j < k; g = ++j)
                      (i = l[g]),
                        i instanceof Y &&
                          i.isObject(!0) &&
                          (f[g] = d.addProperties(i, a, c));
                    return (e.expressions = f = db(f));
                  }
                });
              }),
              (b.prototype.hoistDirectivePrologue = function () {
                var a, b, c;
                (b = 0), (a = this.body.expressions);
                while (
                  ((c = a[b]) && c instanceof m) ||
                  (c instanceof Y && c.isString())
                )
                  ++b;
                return (this.directives = a.splice(0, b));
              }),
              (b.prototype.ensureConstructor = function (a) {
                return (
                  this.ctor ||
                    ((this.ctor = new l()),
                    this.parent &&
                      this.ctor.body.push(
                        new C(
                          "" +
                            a +
                            ".__super__.constructor.apply(this, arguments)"
                        )
                      ),
                    this.externalCtor &&
                      this.ctor.body.push(
                        new C(
                          "" + this.externalCtor + ".apply(this, arguments)"
                        )
                      ),
                    this.ctor.body.makeReturn(),
                    this.body.expressions.unshift(this.ctor)),
                  (this.ctor.ctor = this.ctor.name = a),
                  (this.ctor.klass = null),
                  (this.ctor.noReturn = !0)
                );
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, e, g, h, i, j;
                return (
                  (c = this.determineName()),
                  (h = c || "_Class"),
                  h.reserved && (h = "_" + h),
                  (g = new C(h)),
                  this.hoistDirectivePrologue(),
                  this.setContext(h),
                  this.walkBody(h, a),
                  this.ensureConstructor(h),
                  (this.body.spaced = !0),
                  this.ctor instanceof l ||
                    this.body.expressions.unshift(this.ctor),
                  c &&
                    this.body.expressions.unshift(
                      new f(
                        new Y(new C(h), [new d(new C("name"))]),
                        new C("'" + h + "'")
                      )
                    ),
                  this.body.expressions.push(g),
                  (j = this.body.expressions).unshift.apply(j, this.directives),
                  this.addBoundFunctions(a),
                  (b = k.wrap(this.body)),
                  this.parent &&
                    ((this.superClass = new C(
                      a.scope.freeVariable("super", !1)
                    )),
                    this.body.expressions.unshift(new o(g, this.superClass)),
                    b.args.push(this.parent),
                    (i = b.variable.params || b.variable.base.params),
                    i.push(new I(this.superClass))),
                  (e = new J(b, !0)),
                  this.variable && (e = new f(this.variable, e)),
                  e.compile(a)
                );
              }),
              b
            );
          })(g)),
        (b.Assign = f =
          (function (a) {
            function b(a, b, c, d) {
              var e, f, g;
              (this.variable = a),
                (this.value = b),
                (this.context = c),
                (this.param = d && d.param),
                (this.subpattern = d && d.subpattern),
                (e =
                  ((g = f = this.variable.unwrapAll().value),
                  ob.call(O, g) >= 0));
              if (e && this.context !== "object")
                throw SyntaxError('variable name may not be "' + f + '"');
            }
            return (
              nb(b, a),
              (b.name = "Assign"),
              (b.prototype.children = ["variable", "value"]),
              (b.prototype.isStatement = function (a) {
                return (
                  (a != null ? a.level : void 0) === B &&
                  this.context != null &&
                  ob.call(this.context, "?") >= 0
                );
              }),
              (b.prototype.assigns = function (a) {
                return this[
                  this.context === "object" ? "value" : "variable"
                ].assigns(a);
              }),
              (b.prototype.unfoldSoak = function (a) {
                return ib(a, this, "variable");
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, j;
                if ((b = this.variable instanceof Y)) {
                  if (this.variable.isArray() || this.variable.isObject())
                    return this.compilePatternMatch(a);
                  if (this.variable.isSplice()) return this.compileSplice(a);
                  if ((g = this.context) === "||=" || g === "&&=" || g === "?=")
                    return this.compileConditional(a);
                }
                d = this.variable.compile(a, y);
                if (!this.context) {
                  if (!(f = this.variable.unwrapAll()).isAssignable())
                    throw SyntaxError(
                      '"' + this.variable.compile(a) + '" cannot be assigned.'
                    );
                  if (
                    typeof f.hasProperties == "function"
                      ? !f.hasProperties()
                      : !void 0
                  )
                    this.param ? a.scope.add(d, "var") : a.scope.find(d);
                }
                return (
                  this.value instanceof l &&
                    (c = D.exec(d)) &&
                    (c[1] && (this.value.klass = c[1]),
                    (this.value.name =
                      (h =
                        (i = (j = c[2]) != null ? j : c[3]) != null
                          ? i
                          : c[4]) != null
                        ? h
                        : c[5])),
                  (e = this.value.compile(a, y)),
                  this.context === "object"
                    ? "" + d + ": " + e
                    : ((e = d + (" " + (this.context || "=") + " ") + e),
                      a.level <= y ? e : "(" + e + ")")
                );
              }),
              (b.prototype.compilePatternMatch = function (a) {
                var c,
                  e,
                  f,
                  g,
                  h,
                  i,
                  j,
                  k,
                  l,
                  m,
                  n,
                  o,
                  p,
                  r,
                  s,
                  t,
                  u,
                  w,
                  x,
                  A,
                  D,
                  E,
                  F,
                  G,
                  H,
                  I,
                  L;
                (s = a.level === B),
                  (u = this.value),
                  (m = this.variable.base.objects);
                if (!(n = m.length))
                  return (f = u.compile(a)), a.level >= z ? "(" + f + ")" : f;
                i = this.variable.isObject();
                if (s && n === 1 && !((l = m[0]) instanceof R)) {
                  l instanceof b
                    ? ((D = l), (E = D.variable), (h = E.base), (l = D.value))
                    : l.base instanceof J
                    ? ((F = new Y(l.unwrapAll()).cacheReference(a)),
                      (l = F[0]),
                      (h = F[1]))
                    : (h = i
                        ? l["this"]
                          ? l.properties[0].name
                          : l
                        : new C(0)),
                    (c = q.test(h.unwrap().value || 0)),
                    (u = new Y(u)),
                    u.properties.push(new (c ? d : v)(h));
                  if (((G = l.unwrap().value), ob.call(K, G) >= 0))
                    throw new SyntaxError(
                      "assignment to a reserved word: " +
                        l.compile(a) +
                        " = " +
                        u.compile(a)
                    );
                  return new b(l, u, null, { param: this.param }).compile(a, B);
                }
                (w = u.compile(a, y)), (e = []), (r = !1);
                if (!q.test(w) || this.variable.assigns(w))
                  e.push("" + (o = a.scope.freeVariable("ref")) + " = " + w),
                    (w = o);
                for (g = x = 0, A = m.length; x < A; g = ++x) {
                  (l = m[g]),
                    (h = g),
                    i &&
                      (l instanceof b
                        ? ((H = l),
                          (I = H.variable),
                          (h = I.base),
                          (l = H.value))
                        : l.base instanceof J
                        ? ((L = new Y(l.unwrapAll()).cacheReference(a)),
                          (l = L[0]),
                          (h = L[1]))
                        : (h = l["this"] ? l.properties[0].name : l));
                  if (!r && l instanceof R)
                    (k = l.name.unwrap().value),
                      (l = l.unwrap()),
                      (t =
                        "" +
                        n +
                        " <= " +
                        w +
                        ".length ? " +
                        jb("slice") +
                        ".call(" +
                        w +
                        ", " +
                        g),
                      (p = n - g - 1)
                        ? ((j = a.scope.freeVariable("i")),
                          (t +=
                            ", " +
                            j +
                            " = " +
                            w +
                            ".length - " +
                            p +
                            ") : (" +
                            j +
                            " = " +
                            g +
                            ", [])"))
                        : (t += ") : []"),
                      (t = new C(t)),
                      (r = "" + j + "++");
                  else {
                    k = l.unwrap().value;
                    if (l instanceof R)
                      throw (
                        ((l = l.name.compile(a)),
                        new SyntaxError(
                          "multiple splats are disallowed in an assignment: " +
                            l +
                            "..."
                        ))
                      );
                    typeof h == "number"
                      ? ((h = new C(r || h)), (c = !1))
                      : (c = i && q.test(h.unwrap().value || 0)),
                      (t = new Y(new C(w), [new (c ? d : v)(h)]));
                  }
                  if (k != null && ob.call(K, k) >= 0)
                    throw new SyntaxError(
                      "assignment to a reserved word: " +
                        l.compile(a) +
                        " = " +
                        t.compile(a)
                    );
                  e.push(
                    new b(l, t, null, {
                      param: this.param,
                      subpattern: !0,
                    }).compile(a, y)
                  );
                }
                return (
                  !s && !this.subpattern && e.push(w),
                  (f = e.join(", ")),
                  a.level < y ? f : "(" + f + ")"
                );
              }),
              (b.prototype.compileConditional = function (a) {
                var c, d, e;
                (e = this.variable.cacheReference(a)), (c = e[0]), (d = e[1]);
                if (
                  c.base instanceof C &&
                  c.base.value !== "this" &&
                  !a.scope.check(c.base.value)
                )
                  throw new Error(
                    'the variable "' +
                      c.base.value +
                      "\" can't be assigned with " +
                      this.context +
                      " because it has not been defined."
                  );
                return (
                  ob.call(this.context, "?") >= 0 &&
                    (a.isExistentialEquals = !0),
                  new H(
                    this.context.slice(0, -1),
                    c,
                    new b(d, this.value, "=")
                  ).compile(a)
                );
              }),
              (b.prototype.compileSplice = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m;
                return (
                  (k = this.variable.properties.pop().range),
                  (d = k.from),
                  (h = k.to),
                  (c = k.exclusive),
                  (g = this.variable.compile(a)),
                  (l = (d != null ? d.cache(a, z) : void 0) || ["0", "0"]),
                  (e = l[0]),
                  (f = l[1]),
                  h
                    ? (d != null ? d.isSimpleNumber() : void 0) &&
                      h.isSimpleNumber()
                      ? ((h = +h.compile(a) - +f), c || (h += 1))
                      : ((h = h.compile(a, w) + " - " + f), c || (h += " + 1"))
                    : (h = "9e9"),
                  (m = this.value.cache(a, y)),
                  (i = m[0]),
                  (j = m[1]),
                  (b =
                    "[].splice.apply(" +
                    g +
                    ", [" +
                    e +
                    ", " +
                    h +
                    "].concat(" +
                    i +
                    ")), " +
                    j),
                  a.level > B ? "(" + b + ")" : b
                );
              }),
              b
            );
          })(g)),
        (b.Code = l =
          (function (a) {
            function b(a, b, c) {
              (this.params = a || []),
                (this.body = b || new h()),
                (this.bound = c === "boundfunc"),
                this.bound && (this.context = "_this");
            }
            return (
              nb(b, a),
              (b.name = "Code"),
              (b.prototype.children = ["params", "body"]),
              (b.prototype.isStatement = function () {
                return !!this.ctor;
              }),
              (b.prototype.jumps = F),
              (b.prototype.compileNode = function (a) {
                var b,
                  c,
                  d,
                  g,
                  h,
                  i,
                  j,
                  k,
                  l,
                  m,
                  n,
                  o,
                  p,
                  q,
                  r,
                  s,
                  u,
                  v,
                  x,
                  y,
                  z,
                  A,
                  B,
                  D,
                  E,
                  F,
                  G,
                  I,
                  J,
                  K,
                  L,
                  M,
                  N;
                (a.scope = new P(a.scope, this.body, this)),
                  (a.scope.shared = ab(a, "sharedScope")),
                  (a.indent += T),
                  delete a.bare,
                  delete a.isExistentialEquals,
                  (l = []),
                  (c = []),
                  (G = this.paramNames());
                for (r = 0, x = G.length; r < x; r++)
                  (i = G[r]), a.scope.check(i) || a.scope.parameter(i);
                I = this.params;
                for (s = 0, y = I.length; s < y; s++) {
                  k = I[s];
                  if (!k.splat) continue;
                  J = this.params;
                  for (u = 0, z = J.length; u < z; u++)
                    (j = J[u]),
                      j.name.value && a.scope.add(j.name.value, "var", !0);
                  n = new f(
                    new Y(
                      new e(
                        function () {
                          var b, c, d, e;
                          (d = this.params), (e = []);
                          for (b = 0, c = d.length; b < c; b++)
                            (j = d[b]), e.push(j.asReference(a));
                          return e;
                        }.call(this)
                      )
                    ),
                    new Y(new C("arguments"))
                  );
                  break;
                }
                K = this.params;
                for (v = 0, A = K.length; v < A; v++)
                  (k = K[v]),
                    k.isComplex()
                      ? ((p = m = k.asReference(a)),
                        k.value && (p = new H("?", m, k.value)),
                        c.push(new f(new Y(k.name), p, "=", { param: !0 })))
                      : ((m = k),
                        k.value &&
                          ((h = new C(m.name.value + " == null")),
                          (p = new f(new Y(k.name), k.value, "=")),
                          c.push(new t(h, p)))),
                    n || l.push(m);
                (q = this.body.isEmpty()),
                  n && c.unshift(n),
                  c.length && (L = this.body.expressions).unshift.apply(L, c);
                for (d = E = 0, B = l.length; E < B; d = ++E)
                  (j = l[d]), a.scope.parameter((l[d] = j.compile(a)));
                (o = []), (M = this.paramNames());
                for (F = 0, D = M.length; F < D; F++) {
                  i = M[F];
                  if (ob.call(o, i) >= 0)
                    throw SyntaxError("multiple parameters named '" + i + "'");
                  o.push(i);
                }
                return (
                  !q && !this.noReturn && this.body.makeReturn(),
                  this.bound &&
                    (((N = a.scope.parent.method) != null ? N.bound : void 0)
                      ? (this.bound = this.context =
                          a.scope.parent.method.context)
                      : this["static"] ||
                        a.scope.parent.assign("_this", "this")),
                  (g = a.indent),
                  (b = "function"),
                  this.ctor && (b += " " + this.name),
                  (b += "(" + l.join(", ") + ") {"),
                  this.body.isEmpty() ||
                    (b +=
                      "\n" +
                      this.body.compileWithDeclarations(a) +
                      "\n" +
                      this.tab),
                  (b += "}"),
                  this.ctor
                    ? this.tab + b
                    : this.front || a.level >= w
                    ? "(" + b + ")"
                    : b
                );
              }),
              (b.prototype.paramNames = function () {
                var a, b, c, d, e;
                (a = []), (e = this.params);
                for (c = 0, d = e.length; c < d; c++)
                  (b = e[c]), a.push.apply(a, b.names());
                return a;
              }),
              (b.prototype.traverseChildren = function (a, c) {
                if (a) return b.__super__.traverseChildren.call(this, a, c);
              }),
              b
            );
          })(g)),
        (b.Param = I =
          (function (a) {
            function b(a, b, c) {
              var d;
              (this.name = a), (this.value = b), (this.splat = c);
              if (((d = a = this.name.unwrapAll().value), ob.call(O, d) >= 0))
                throw SyntaxError('parameter name "' + a + '" is not allowed');
            }
            return (
              nb(b, a),
              (b.name = "Param"),
              (b.prototype.children = ["name", "value"]),
              (b.prototype.compile = function (a) {
                return this.name.compile(a, y);
              }),
              (b.prototype.asReference = function (a) {
                var b;
                return this.reference
                  ? this.reference
                  : ((b = this.name),
                    b["this"]
                      ? ((b = b.properties[0].name),
                        b.value.reserved &&
                          (b = new C(a.scope.freeVariable(b.value))))
                      : b.isComplex() &&
                        (b = new C(a.scope.freeVariable("arg"))),
                    (b = new Y(b)),
                    this.splat && (b = new R(b)),
                    (this.reference = b));
              }),
              (b.prototype.isComplex = function () {
                return this.name.isComplex();
              }),
              (b.prototype.names = function (a) {
                var b, c, d, e, g, h;
                a == null && (a = this.name),
                  (b = function (a) {
                    var b;
                    return (
                      (b = a.properties[0].name.value), b.reserved ? [] : [b]
                    );
                  });
                if (a instanceof C) return [a.value];
                if (a instanceof Y) return b(a);
                (c = []), (h = a.objects);
                for (e = 0, g = h.length; e < g; e++)
                  (d = h[e]),
                    d instanceof f
                      ? c.push(d.variable.base.value)
                      : d.isArray() || d.isObject()
                      ? c.push.apply(c, this.names(d.base))
                      : d["this"]
                      ? c.push.apply(c, b(d))
                      : c.push(d.base.value);
                return c;
              }),
              b
            );
          })(g)),
        (b.Splat = R =
          (function (a) {
            function b(a) {
              this.name = a.compile ? a : new C(a);
            }
            return (
              nb(b, a),
              (b.name = "Splat"),
              (b.prototype.children = ["name"]),
              (b.prototype.isAssignable = $),
              (b.prototype.assigns = function (a) {
                return this.name.assigns(a);
              }),
              (b.prototype.compile = function (a) {
                return this.index != null
                  ? this.compileParam(a)
                  : this.name.compile(a);
              }),
              (b.prototype.unwrap = function () {
                return this.name;
              }),
              (b.compileSplattedArray = function (a, c, d) {
                var e, f, g, h, i, j, k, l;
                i = -1;
                while ((j = c[++i]) && !(j instanceof b)) continue;
                if (i >= c.length) return "";
                if (c.length === 1)
                  return (
                    (g = c[0].compile(a, y)),
                    d ? g : "" + jb("slice") + ".call(" + g + ")"
                  );
                e = c.slice(i);
                for (h = k = 0, l = e.length; k < l; h = ++k)
                  (j = e[h]),
                    (g = j.compile(a, y)),
                    (e[h] =
                      j instanceof b
                        ? "" + jb("slice") + ".call(" + g + ")"
                        : "[" + g + "]");
                return i === 0
                  ? e[0] + (".concat(" + e.slice(1).join(", ") + ")")
                  : ((f = (function () {
                      var b, d, e, f;
                      (e = c.slice(0, i)), (f = []);
                      for (b = 0, d = e.length; b < d; b++)
                        (j = e[b]), f.push(j.compile(a, y));
                      return f;
                    })()),
                    "[" + f.join(", ") + "].concat(" + e.join(", ") + ")");
              }),
              b
            );
          })(g)),
        (b.While = Z =
          (function (a) {
            function b(a, b) {
              (this.condition = (b != null ? b.invert : void 0)
                ? a.invert()
                : a),
                (this.guard = b != null ? b.guard : void 0);
            }
            return (
              nb(b, a),
              (b.name = "While"),
              (b.prototype.children = ["condition", "guard", "body"]),
              (b.prototype.isStatement = $),
              (b.prototype.makeReturn = function (a) {
                return a
                  ? b.__super__.makeReturn.apply(this, arguments)
                  : ((this.returns = !this.jumps({ loop: !0 })), this);
              }),
              (b.prototype.addBody = function (a) {
                return (this.body = a), this;
              }),
              (b.prototype.jumps = function () {
                var a, b, c, d;
                a = this.body.expressions;
                if (!a.length) return !1;
                for (c = 0, d = a.length; c < d; c++) {
                  b = a[c];
                  if (b.jumps({ loop: !0 })) return b;
                }
                return !1;
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e;
                return (
                  (a.indent += T),
                  (e = ""),
                  (b = this.body),
                  b.isEmpty()
                    ? (b = "")
                    : (this.returns &&
                        (b.makeReturn((d = a.scope.freeVariable("results"))),
                        (e = "" + this.tab + d + " = [];\n")),
                      this.guard &&
                        (b.expressions.length > 1
                          ? b.expressions.unshift(
                              new t(
                                new J(this.guard).invert(),
                                new C("continue")
                              )
                            )
                          : this.guard && (b = h.wrap([new t(this.guard, b)]))),
                      (b = "\n" + b.compile(a, B) + "\n" + this.tab)),
                  (c =
                    e +
                    this.tab +
                    ("while (" +
                      this.condition.compile(a, A) +
                      ") {" +
                      b +
                      "}")),
                  this.returns && (c += "\n" + this.tab + "return " + d + ";"),
                  c
                );
              }),
              b
            );
          })(g)),
        (b.Op = H =
          (function (a) {
            function d(a, c, d, e) {
              if (a === "in") return new u(c, d);
              if (a === "do") return this.generateDo(c);
              if (a === "new") {
                if (c instanceof i && !c["do"] && !c.isNew)
                  return c.newInstance();
                if ((c instanceof l && c.bound) || c["do"]) c = new J(c);
              }
              return (
                (this.operator = b[a] || a),
                (this.first = c),
                (this.second = d),
                (this.flip = !!e),
                this
              );
            }
            var b, c;
            return (
              nb(d, a),
              (d.name = "Op"),
              (b = { "==": "===", "!=": "!==", of: "in" }),
              (c = { "!==": "===", "===": "!==" }),
              (d.prototype.children = ["first", "second"]),
              (d.prototype.isSimpleNumber = F),
              (d.prototype.isUnary = function () {
                return !this.second;
              }),
              (d.prototype.isComplex = function () {
                var a;
                return (
                  !this.isUnary() ||
                  ((a = this.operator) !== "+" && a !== "-") ||
                  this.first.isComplex()
                );
              }),
              (d.prototype.isChainable = function () {
                var a;
                return (
                  (a = this.operator) === "<" ||
                  a === ">" ||
                  a === ">=" ||
                  a === "<=" ||
                  a === "===" ||
                  a === "!=="
                );
              }),
              (d.prototype.invert = function () {
                var a, b, e, f, g;
                if (this.isChainable() && this.first.isChainable()) {
                  (a = !0), (b = this);
                  while (b && b.operator)
                    a && (a = b.operator in c), (b = b.first);
                  if (!a) return new J(this).invert();
                  b = this;
                  while (b && b.operator)
                    (b.invert = !b.invert),
                      (b.operator = c[b.operator]),
                      (b = b.first);
                  return this;
                }
                return (f = c[this.operator])
                  ? ((this.operator = f),
                    this.first.unwrap() instanceof d && this.first.invert(),
                    this)
                  : this.second
                  ? new J(this).invert()
                  : this.operator === "!" &&
                    (e = this.first.unwrap()) instanceof d &&
                    ((g = e.operator) === "!" ||
                      g === "in" ||
                      g === "instanceof")
                  ? e
                  : new d("!", this);
              }),
              (d.prototype.unfoldSoak = function (a) {
                var b;
                return (
                  ((b = this.operator) === "++" ||
                    b === "--" ||
                    b === "delete") &&
                  ib(a, this, "first")
                );
              }),
              (d.prototype.generateDo = function (a) {
                var b, c, d, e, g, h, j, k;
                (e = []),
                  (c =
                    a instanceof f && (g = a.value.unwrap()) instanceof l
                      ? g
                      : a),
                  (k = c.params || []);
                for (h = 0, j = k.length; h < j; h++)
                  (d = k[h]),
                    d.value ? (e.push(d.value), delete d.value) : e.push(d);
                return (b = new i(a, e)), (b["do"] = !0), b;
              }),
              (d.prototype.compileNode = function (a) {
                var b, c, d, e;
                (c = this.isChainable() && this.first.isChainable()),
                  c || (this.first.front = this.front);
                if (
                  this.operator === "delete" &&
                  a.scope.check(this.first.unwrapAll().value)
                )
                  throw SyntaxError(
                    "delete operand may not be argument or var"
                  );
                if (
                  ((d = this.operator) === "--" || d === "++") &&
                  ((e = this.first.unwrapAll().value), ob.call(O, e) >= 0)
                )
                  throw SyntaxError(
                    "prefix increment/decrement may not have eval or arguments operand"
                  );
                return this.isUnary()
                  ? this.compileUnary(a)
                  : c
                  ? this.compileChain(a)
                  : this.operator === "?"
                  ? this.compileExistence(a)
                  : ((b =
                      this.first.compile(a, z) +
                      " " +
                      this.operator +
                      " " +
                      this.second.compile(a, z)),
                    a.level <= z ? b : "(" + b + ")");
              }),
              (d.prototype.compileChain = function (a) {
                var b, c, d, e;
                return (
                  (e = this.first.second.cache(a)),
                  (this.first.second = e[0]),
                  (d = e[1]),
                  (c = this.first.compile(a, z)),
                  (b =
                    "" +
                    c +
                    " " +
                    (this.invert ? "&&" : "||") +
                    " " +
                    d.compile(a) +
                    " " +
                    this.operator +
                    " " +
                    this.second.compile(a, z)),
                  "(" + b + ")"
                );
              }),
              (d.prototype.compileExistence = function (a) {
                var b, c;
                return (
                  this.first.isComplex() && a.level > B
                    ? ((c = new C(a.scope.freeVariable("ref"))),
                      (b = new J(new f(c, this.first))))
                    : ((b = this.first), (c = b)),
                  new t(new n(b), c, { type: "if" })
                    .addElse(this.second)
                    .compile(a)
                );
              }),
              (d.prototype.compileUnary = function (a) {
                var b, c, e;
                if (a.level >= w) return new J(this).compile(a);
                (c = [(b = this.operator)]),
                  (e = b === "+" || b === "-"),
                  (b === "new" ||
                    b === "typeof" ||
                    b === "delete" ||
                    (e &&
                      this.first instanceof d &&
                      this.first.operator === b)) &&
                    c.push(" ");
                if (
                  (e && this.first instanceof d) ||
                  (b === "new" && this.first.isStatement(a))
                )
                  this.first = new J(this.first);
                return (
                  c.push(this.first.compile(a, z)),
                  this.flip && c.reverse(),
                  c.join("")
                );
              }),
              (d.prototype.toString = function (a) {
                return d.__super__.toString.call(
                  this,
                  a,
                  this.constructor.name + " " + this.operator
                );
              }),
              d
            );
          })(g)),
        (b.In = u =
          (function (a) {
            function b(a, b) {
              (this.object = a), (this.array = b);
            }
            return (
              nb(b, a),
              (b.name = "In"),
              (b.prototype.children = ["object", "array"]),
              (b.prototype.invert = E),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f;
                if (this.array instanceof Y && this.array.isArray()) {
                  f = this.array.base.objects;
                  for (d = 0, e = f.length; d < e; d++) {
                    c = f[d];
                    if (c instanceof R) {
                      b = !0;
                      break;
                    }
                    continue;
                  }
                  if (!b) return this.compileOrTest(a);
                }
                return this.compileLoopTest(a);
              }),
              (b.prototype.compileOrTest = function (a) {
                var b, c, d, e, f, g, h, i, j;
                return this.array.base.objects.length === 0
                  ? "" + !!this.negated
                  : ((i = this.object.cache(a, z)),
                    (g = i[0]),
                    (f = i[1]),
                    (j = this.negated ? [" !== ", " && "] : [" === ", " || "]),
                    (b = j[0]),
                    (c = j[1]),
                    (h = function () {
                      var c, h, i, j;
                      (i = this.array.base.objects), (j = []);
                      for (d = c = 0, h = i.length; c < h; d = ++c)
                        (e = i[d]), j.push((d ? f : g) + b + e.compile(a, w));
                      return j;
                    }.call(this)),
                    (h = h.join(c)),
                    a.level < z ? h : "(" + h + ")");
              }),
              (b.prototype.compileLoopTest = function (a) {
                var b, c, d, e;
                return (
                  (e = this.object.cache(a, y)),
                  (d = e[0]),
                  (c = e[1]),
                  (b =
                    jb("indexOf") +
                    (".call(" + this.array.compile(a, y) + ", " + c + ") ") +
                    (this.negated ? "< 0" : ">= 0")),
                  d === c
                    ? b
                    : ((b = d + ", " + b), a.level < y ? b : "(" + b + ")")
                );
              }),
              (b.prototype.toString = function (a) {
                return b.__super__.toString.call(
                  this,
                  a,
                  this.constructor.name + (this.negated ? "!" : "")
                );
              }),
              b
            );
          })(g)),
        (b.Try = W =
          (function (a) {
            function b(a, b, c, d) {
              (this.attempt = a),
                (this.error = b),
                (this.recovery = c),
                (this.ensure = d);
            }
            return (
              nb(b, a),
              (b.name = "Try"),
              (b.prototype.children = ["attempt", "recovery", "ensure"]),
              (b.prototype.isStatement = $),
              (b.prototype.jumps = function (a) {
                var b;
                return (
                  this.attempt.jumps(a) ||
                  ((b = this.recovery) != null ? b.jumps(a) : void 0)
                );
              }),
              (b.prototype.makeReturn = function (a) {
                return (
                  this.attempt && (this.attempt = this.attempt.makeReturn(a)),
                  this.recovery &&
                    (this.recovery = this.recovery.makeReturn(a)),
                  this
                );
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e;
                return (
                  (a.indent += T),
                  (d = this.error ? " (" + this.error.compile(a) + ") " : " "),
                  (e = this.attempt.compile(a, B)),
                  (b = function () {
                    var b;
                    if (this.recovery) {
                      if (((b = this.error.value), ob.call(O, b) >= 0))
                        throw SyntaxError(
                          'catch variable may not be "' + this.error.value + '"'
                        );
                      return (
                        a.scope.check(this.error.value) ||
                          a.scope.add(this.error.value, "param"),
                        " catch" +
                          d +
                          "{\n" +
                          this.recovery.compile(a, B) +
                          "\n" +
                          this.tab +
                          "}"
                      );
                    }
                    if (!this.ensure && !this.recovery)
                      return " catch (_error) {}";
                  }.call(this)),
                  (c = this.ensure
                    ? " finally {\n" +
                      this.ensure.compile(a, B) +
                      "\n" +
                      this.tab +
                      "}"
                    : ""),
                  "" +
                    this.tab +
                    "try {\n" +
                    e +
                    "\n" +
                    this.tab +
                    "}" +
                    (b || "") +
                    c
                );
              }),
              b
            );
          })(g)),
        (b.Throw = V =
          (function (a) {
            function b(a) {
              this.expression = a;
            }
            return (
              nb(b, a),
              (b.name = "Throw"),
              (b.prototype.children = ["expression"]),
              (b.prototype.isStatement = $),
              (b.prototype.jumps = F),
              (b.prototype.makeReturn = U),
              (b.prototype.compileNode = function (a) {
                return this.tab + ("throw " + this.expression.compile(a) + ";");
              }),
              b
            );
          })(g)),
        (b.Existence = n =
          (function (a) {
            function b(a) {
              this.expression = a;
            }
            return (
              nb(b, a),
              (b.name = "Existence"),
              (b.prototype.children = ["expression"]),
              (b.prototype.invert = E),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e;
                return (
                  (this.expression.front = this.front),
                  (d = this.expression.compile(a, z)),
                  q.test(d) && !a.scope.check(d)
                    ? ((e = this.negated ? ["===", "||"] : ["!==", "&&"]),
                      (b = e[0]),
                      (c = e[1]),
                      (d =
                        "typeof " +
                        d +
                        " " +
                        b +
                        ' "undefined" ' +
                        c +
                        " " +
                        d +
                        " " +
                        b +
                        " null"))
                    : (d =
                        "" + d + " " + (this.negated ? "==" : "!=") + " null"),
                  a.level <= x ? d : "(" + d + ")"
                );
              }),
              b
            );
          })(g)),
        (b.Parens = J =
          (function (a) {
            function b(a) {
              this.body = a;
            }
            return (
              nb(b, a),
              (b.name = "Parens"),
              (b.prototype.children = ["body"]),
              (b.prototype.unwrap = function () {
                return this.body;
              }),
              (b.prototype.isComplex = function () {
                return this.body.isComplex();
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d;
                return (
                  (d = this.body.unwrap()),
                  d instanceof Y && d.isAtomic()
                    ? ((d.front = this.front), d.compile(a))
                    : ((c = d.compile(a, A)),
                      (b =
                        a.level < z &&
                        (d instanceof H ||
                          d instanceof i ||
                          (d instanceof p && d.returns))),
                      b ? c : "(" + c + ")")
                );
              }),
              b
            );
          })(g)),
        (b.For = p =
          (function (a) {
            function b(a, b) {
              var c;
              (this.source = b.source),
                (this.guard = b.guard),
                (this.step = b.step),
                (this.name = b.name),
                (this.index = b.index),
                (this.body = h.wrap([a])),
                (this.own = !!b.own),
                (this.object = !!b.object),
                this.object &&
                  ((c = [this.index, this.name]),
                  (this.name = c[0]),
                  (this.index = c[1]));
              if (this.index instanceof Y)
                throw SyntaxError(
                  "index cannot be a pattern matching expression"
                );
              (this.range =
                this.source instanceof Y &&
                this.source.base instanceof L &&
                !this.source.properties.length),
                (this.pattern = this.name instanceof Y);
              if (this.range && this.index)
                throw SyntaxError("indexes do not apply to range loops");
              if (this.range && this.pattern)
                throw SyntaxError("cannot pattern match over range loops");
              this.returns = !1;
            }
            return (
              nb(b, a),
              (b.name = "For"),
              (b.prototype.children = ["body", "source", "guard", "step"]),
              (b.prototype.compileNode = function (a) {
                var b,
                  c,
                  d,
                  e,
                  g,
                  i,
                  j,
                  k,
                  l,
                  m,
                  n,
                  o,
                  p,
                  r,
                  s,
                  u,
                  v,
                  w,
                  x,
                  A,
                  D,
                  E,
                  F,
                  G,
                  H;
                return (
                  (b = h.wrap([this.body])),
                  (n = (H = eb(b.expressions)) != null ? H.jumps() : void 0),
                  n && n instanceof M && (this.returns = !1),
                  (A = this.range ? this.source.base : this.source),
                  (x = a.scope),
                  (p = this.name && this.name.compile(a, y)),
                  (j = this.index && this.index.compile(a, y)),
                  p && !this.pattern && x.find(p, { immediate: !0 }),
                  j && x.find(j, { immediate: !0 }),
                  this.returns && (w = x.freeVariable("results")),
                  (k = (this.object && j) || x.freeVariable("i")),
                  (l = (this.range && p) || j || k),
                  (m = l !== k ? "" + l + " = " : ""),
                  this.step && !this.range && (E = x.freeVariable("step")),
                  this.pattern && (p = k),
                  (G = ""),
                  (g = ""),
                  (c = ""),
                  (i = this.tab + T),
                  this.range
                    ? (d = A.compile(
                        fb(a, { index: k, name: p, step: this.step })
                      ))
                    : ((F = this.source.compile(a, y)),
                      (p || this.own) &&
                        !q.test(F) &&
                        ((c =
                          "" +
                          this.tab +
                          (s = x.freeVariable("ref")) +
                          " = " +
                          F +
                          ";\n"),
                        (F = s)),
                      p &&
                        !this.pattern &&
                        (r = "" + p + " = " + F + "[" + l + "]"),
                      this.object ||
                        ((o = x.freeVariable("len")),
                        (e = "" + m + k + " = 0, " + o + " = " + F + ".length"),
                        this.step &&
                          (e += ", " + E + " = " + this.step.compile(a, z)),
                        (D =
                          "" +
                          m +
                          (this.step
                            ? "" + k + " += " + E
                            : l !== k
                            ? "++" + k
                            : "" + k + "++")),
                        (d = "" + e + "; " + k + " < " + o + "; " + D))),
                  this.returns &&
                    ((u = "" + this.tab + w + " = [];\n"),
                    (v = "\n" + this.tab + "return " + w + ";"),
                    b.makeReturn(w)),
                  this.guard &&
                    (b.expressions.length > 1
                      ? b.expressions.unshift(
                          new t(new J(this.guard).invert(), new C("continue"))
                        )
                      : this.guard && (b = h.wrap([new t(this.guard, b)]))),
                  this.pattern &&
                    b.expressions.unshift(
                      new f(this.name, new C("" + F + "[" + l + "]"))
                    ),
                  (c += this.pluckDirectCall(a, b)),
                  r && (G = "\n" + i + r + ";"),
                  this.object &&
                    ((d = "" + l + " in " + F),
                    this.own &&
                      (g =
                        "\n" +
                        i +
                        "if (!" +
                        jb("hasProp") +
                        ".call(" +
                        F +
                        ", " +
                        l +
                        ")) continue;")),
                  (b = b.compile(fb(a, { indent: i }), B)),
                  b && (b = "\n" + b + "\n"),
                  "" +
                    c +
                    (u || "") +
                    this.tab +
                    "for (" +
                    d +
                    ") {" +
                    g +
                    G +
                    b +
                    this.tab +
                    "}" +
                    (v || "")
                );
              }),
              (b.prototype.pluckDirectCall = function (a, b) {
                var c, d, e, g, h, j, k, m, n, o, p, q, r, s, t;
                (d = ""), (o = b.expressions);
                for (h = m = 0, n = o.length; m < n; h = ++m) {
                  (e = o[h]), (e = e.unwrapAll());
                  if (!(e instanceof i)) continue;
                  k = e.variable.unwrapAll();
                  if (
                    !(
                      k instanceof l ||
                      (k instanceof Y &&
                        ((p = k.base) != null
                          ? p.unwrapAll()
                          : void 0) instanceof l &&
                        k.properties.length === 1 &&
                        ((q =
                          (r = k.properties[0].name) != null
                            ? r.value
                            : void 0) === "call" ||
                          q === "apply"))
                    )
                  )
                    continue;
                  (g = ((s = k.base) != null ? s.unwrapAll() : void 0) || k),
                    (j = new C(a.scope.freeVariable("fn"))),
                    (c = new Y(j)),
                    k.base && ((t = [c, k]), (k.base = t[0]), (c = t[1])),
                    (b.expressions[h] = new i(c, e.args)),
                    (d += this.tab + new f(j, g).compile(a, B) + ";\n");
                }
                return d;
              }),
              b
            );
          })(Z)),
        (b.Switch = S =
          (function (a) {
            function b(a, b, c) {
              (this.subject = a), (this.cases = b), (this.otherwise = c);
            }
            return (
              nb(b, a),
              (b.name = "Switch"),
              (b.prototype.children = ["subject", "cases", "otherwise"]),
              (b.prototype.isStatement = $),
              (b.prototype.jumps = function (a) {
                var b, c, d, e, f, g, h;
                a == null && (a = { block: !0 }), (f = this.cases);
                for (d = 0, e = f.length; d < e; d++) {
                  (g = f[d]), (c = g[0]), (b = g[1]);
                  if (b.jumps(a)) return b;
                }
                return (h = this.otherwise) != null ? h.jumps(a) : void 0;
              }),
              (b.prototype.makeReturn = function (a) {
                var b, c, d, e, f;
                e = this.cases;
                for (c = 0, d = e.length; c < d; c++)
                  (b = e[c]), b[1].makeReturn(a);
                return (
                  a &&
                    (this.otherwise ||
                      (this.otherwise = new h([new C("void 0")]))),
                  (f = this.otherwise) != null && f.makeReturn(a),
                  this
                );
              }),
              (b.prototype.compileNode = function (a) {
                var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r;
                (i = a.indent + T),
                  (j = a.indent = i + T),
                  (d =
                    this.tab +
                    ("switch (" +
                      (((o = this.subject) != null
                        ? o.compile(a, A)
                        : void 0) || !1) +
                      ") {\n")),
                  (p = this.cases);
                for (h = k = 0, m = p.length; k < m; h = ++k) {
                  (q = p[h]), (f = q[0]), (b = q[1]), (r = db([f]));
                  for (l = 0, n = r.length; l < n; l++)
                    (e = r[l]),
                      this.subject || (e = e.invert()),
                      (d += i + ("case " + e.compile(a, A) + ":\n"));
                  if ((c = b.compile(a, B))) d += c + "\n";
                  if (h === this.cases.length - 1 && !this.otherwise) break;
                  g = this.lastNonComment(b.expressions);
                  if (
                    g instanceof M ||
                    (g instanceof C && g.jumps() && g.value !== "debugger")
                  )
                    continue;
                  d += j + "break;\n";
                }
                return (
                  this.otherwise &&
                    this.otherwise.expressions.length &&
                    (d +=
                      i + ("default:\n" + this.otherwise.compile(a, B) + "\n")),
                  d + this.tab + "}"
                );
              }),
              b
            );
          })(g)),
        (b.If = t =
          (function (a) {
            function b(a, b, c) {
              (this.body = b),
                c == null && (c = {}),
                (this.condition = c.type === "unless" ? a.invert() : a),
                (this.elseBody = null),
                (this.isChain = !1),
                (this.soak = c.soak);
            }
            return (
              nb(b, a),
              (b.name = "If"),
              (b.prototype.children = ["condition", "body", "elseBody"]),
              (b.prototype.bodyNode = function () {
                var a;
                return (a = this.body) != null ? a.unwrap() : void 0;
              }),
              (b.prototype.elseBodyNode = function () {
                var a;
                return (a = this.elseBody) != null ? a.unwrap() : void 0;
              }),
              (b.prototype.addElse = function (a) {
                return (
                  this.isChain
                    ? this.elseBodyNode().addElse(a)
                    : ((this.isChain = a instanceof b),
                      (this.elseBody = this.ensureBlock(a))),
                  this
                );
              }),
              (b.prototype.isStatement = function (a) {
                var b;
                return (
                  (a != null ? a.level : void 0) === B ||
                  this.bodyNode().isStatement(a) ||
                  ((b = this.elseBodyNode()) != null
                    ? b.isStatement(a)
                    : void 0)
                );
              }),
              (b.prototype.jumps = function (a) {
                var b;
                return (
                  this.body.jumps(a) ||
                  ((b = this.elseBody) != null ? b.jumps(a) : void 0)
                );
              }),
              (b.prototype.compileNode = function (a) {
                return this.isStatement(a)
                  ? this.compileStatement(a)
                  : this.compileExpression(a);
              }),
              (b.prototype.makeReturn = function (a) {
                return (
                  a &&
                    (this.elseBody ||
                      (this.elseBody = new h([new C("void 0")]))),
                  this.body && (this.body = new h([this.body.makeReturn(a)])),
                  this.elseBody &&
                    (this.elseBody = new h([this.elseBody.makeReturn(a)])),
                  this
                );
              }),
              (b.prototype.ensureBlock = function (a) {
                return a instanceof h ? a : new h([a]);
              }),
              (b.prototype.compileStatement = function (a) {
                var c, d, e, f, g, h, i;
                return (
                  (e = ab(a, "chainChild")),
                  (g = ab(a, "isExistentialEquals")),
                  g
                    ? new b(this.condition.invert(), this.elseBodyNode(), {
                        type: "if",
                      }).compile(a)
                    : ((f = this.condition.compile(a, A)),
                      (a.indent += T),
                      (c = this.ensureBlock(this.body)),
                      (d = c.compile(a)),
                      1 === ((i = c.expressions) != null ? i.length : void 0) &&
                      !this.elseBody &&
                      !e &&
                      d &&
                      f &&
                      -1 === d.indexOf("\n") &&
                      80 > f.length + d.length
                        ? "" +
                          this.tab +
                          "if (" +
                          f +
                          ") " +
                          d.replace(/^\s+/, "")
                        : (d && (d = "\n" + d + "\n" + this.tab),
                          (h = "if (" + f + ") {" + d + "}"),
                          e || (h = this.tab + h),
                          this.elseBody
                            ? h +
                              " else " +
                              (this.isChain
                                ? ((a.indent = this.tab),
                                  (a.chainChild = !0),
                                  this.elseBody.unwrap().compile(a, B))
                                : "{\n" +
                                  this.elseBody.compile(a, B) +
                                  "\n" +
                                  this.tab +
                                  "}")
                            : h))
                );
              }),
              (b.prototype.compileExpression = function (a) {
                var b, c, d, e;
                return (
                  (e = this.condition.compile(a, x)),
                  (c = this.bodyNode().compile(a, y)),
                  (b = this.elseBodyNode()
                    ? this.elseBodyNode().compile(a, y)
                    : "void 0"),
                  (d = "" + e + " ? " + c + " : " + b),
                  a.level >= x ? "(" + d + ")" : d
                );
              }),
              (b.prototype.unfoldSoak = function () {
                return this.soak && this;
              }),
              b
            );
          })(g)),
        (k = {
          wrap: function (a, b, c) {
            var e, f, g, j, k;
            if (a.jumps()) return a;
            (g = new l([], h.wrap([a]))), (e = []);
            if (
              (j = a.contains(this.literalArgs)) ||
              a.contains(this.literalThis)
            )
              (k = new C(j ? "apply" : "call")),
                (e = [new C("this")]),
                j && e.push(new C("arguments")),
                (g = new Y(g, [new d(k)]));
            return (g.noReturn = c), (f = new i(g, e)), b ? h.wrap([f]) : f;
          },
          literalArgs: function (a) {
            return a instanceof C && a.value === "arguments" && !a.asKey;
          },
          literalThis: function (a) {
            return (
              (a instanceof C && a.value === "this" && !a.asKey) ||
              (a instanceof l && a.bound)
            );
          },
        }),
        (ib = function (a, b, c) {
          var d;
          if (!(d = b[c].unfoldSoak(a))) return;
          return (b[c] = d.body), (d.body = new Y(b)), d;
        }),
        (X = {
          extends: function () {
            return (
              "function(child, parent) { for (var key in parent) { if (" +
              jb("hasProp") +
              ".call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; }"
            );
          },
          bind: function () {
            return "function(fn, me){ return function(){ return fn.apply(me, arguments); }; }";
          },
          indexOf: function () {
            return "[].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; }";
          },
          hasProp: function () {
            return "{}.hasOwnProperty";
          },
          slice: function () {
            return "[].slice";
          },
        }),
        (B = 1),
        (A = 2),
        (y = 3),
        (x = 4),
        (z = 5),
        (w = 6),
        (T = "  "),
        (r = "[$A-Za-z_\\x7f-\\uffff][$\\w\\x7f-\\uffff]*"),
        (q = RegExp("^" + r + "$")),
        (N = /^[+-]?\d+$/),
        (D = RegExp(
          "^(?:(" +
            r +
            ")\\.prototype(?:\\.(" +
            r +
            ")|\\[(\"(?:[^\\\\\"\\r\\n]|\\\\.)*\"|'(?:[^\\\\'\\r\\n]|\\\\.)*')\\]|\\[(0x[\\da-fA-F]+|\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)\\]))|(" +
            r +
            ")$"
        )),
        (s = /^['"]/),
        (jb = function (a) {
          var b;
          return (b = "__" + a), P.root.assign(b, X[a]()), b;
        }),
        (gb = function (a, b) {
          return (a = a.replace(/\n/g, "$&" + b)), a.replace(/\s+$/, "");
        });
    }
  ),
  define(
    "ace/mode/coffee/scope",
    ["require", "exports", "module", "ace/mode/coffee/helpers"],
    function (a, b, c) {
      var d, e, f, g;
      (g = a("./helpers")),
        (e = g.extend),
        (f = g.last),
        (b.Scope = d =
          (function () {
            function a(b, c, d) {
              (this.parent = b),
                (this.expressions = c),
                (this.method = d),
                (this.variables = [{ name: "arguments", type: "arguments" }]),
                (this.positions = {}),
                this.parent || (a.root = this);
            }
            return (
              (a.name = "Scope"),
              (a.root = null),
              (a.prototype.add = function (a, b, c) {
                return this.shared && !c
                  ? this.parent.add(a, b, c)
                  : Object.prototype.hasOwnProperty.call(this.positions, a)
                  ? (this.variables[this.positions[a]].type = b)
                  : (this.positions[a] =
                      this.variables.push({ name: a, type: b }) - 1);
              }),
              (a.prototype.find = function (a, b) {
                return this.check(a, b) ? !0 : (this.add(a, "var"), !1);
              }),
              (a.prototype.parameter = function (a) {
                if (this.shared && this.parent.check(a, !0)) return;
                return this.add(a, "param");
              }),
              (a.prototype.check = function (a, b) {
                var c, d;
                return (
                  (c = !!this.type(a)),
                  c || b
                    ? c
                    : (d = this.parent) != null
                    ? !!d.check(a)
                    : !!void 0
                );
              }),
              (a.prototype.temporary = function (a, b) {
                return a.length > 1
                  ? "_" + a + (b > 1 ? b - 1 : "")
                  : "_" +
                      (b + parseInt(a, 36)).toString(36).replace(/\d/g, "a");
              }),
              (a.prototype.type = function (a) {
                var b, c, d, e;
                e = this.variables;
                for (c = 0, d = e.length; c < d; c++) {
                  b = e[c];
                  if (b.name === a) return b.type;
                }
                return null;
              }),
              (a.prototype.freeVariable = function (a, b) {
                var c, d;
                b == null && (b = !0), (c = 0);
                while (this.check((d = this.temporary(a, c)))) c++;
                return b && this.add(d, "var", !0), d;
              }),
              (a.prototype.assign = function (a, b) {
                return (
                  this.add(a, { value: b, assigned: !0 }, !0),
                  (this.hasAssignments = !0)
                );
              }),
              (a.prototype.hasDeclarations = function () {
                return !!this.declaredVariables().length;
              }),
              (a.prototype.declaredVariables = function () {
                var a, b, c, d, e, f;
                (a = []), (b = []), (f = this.variables);
                for (d = 0, e = f.length; d < e; d++)
                  (c = f[d]),
                    c.type === "var" &&
                      (c.name.charAt(0) === "_" ? b : a).push(c.name);
                return a.sort().concat(b.sort());
              }),
              (a.prototype.assignedVariables = function () {
                var a, b, c, d, e;
                (d = this.variables), (e = []);
                for (b = 0, c = d.length; b < c; b++)
                  (a = d[b]),
                    a.type.assigned &&
                      e.push("" + a.name + " = " + a.type.value);
                return e;
              }),
              a
            );
          })());
    }
  );
