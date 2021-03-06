"no use strict";
(function (e) {
  if (typeof e.window != "undefined" && e.document) return;
  (e.console = {
    log: function () {
      var e = Array.prototype.slice.call(arguments, 0);
      postMessage({ type: "log", data: e });
    },
    error: function () {
      var e = Array.prototype.slice.call(arguments, 0);
      postMessage({ type: "log", data: e });
    },
  }),
    (e.window = e),
    (e.ace = e),
    (e.normalizeModule = function (e, t) {
      if (t.indexOf("!") !== -1) {
        var n = t.split("!");
        return normalizeModule(e, n[0]) + "!" + normalizeModule(e, n[1]);
      }
      if (t.charAt(0) == ".") {
        var r = e.split("/").slice(0, -1).join("/");
        t = r + "/" + t;
        while (t.indexOf(".") !== -1 && i != t) {
          var i = t;
          t = t.replace(/\/\.\//, "/").replace(/[^\/]+\/\.\.\//, "");
        }
      }
      return t;
    }),
    (e.require = function (e, t) {
      t || ((t = e), (e = null));
      if (!t.charAt)
        throw new Error(
          "worker.js require() accepts only (parentId, id) as arguments"
        );
      t = normalizeModule(e, t);
      var n = require.modules[t];
      if (n)
        return (
          n.initialized ||
            ((n.initialized = !0), (n.exports = n.factory().exports)),
          n.exports
        );
      var r = t.split("/");
      r[0] = require.tlns[r[0]] || r[0];
      var i = r.join("/") + ".js";
      return (require.id = t), importScripts(i), require(e, t);
    }),
    (require.modules = {}),
    (require.tlns = {}),
    (e.define = function (e, t, n) {
      arguments.length == 2
        ? ((n = t), typeof e != "string" && ((t = e), (e = require.id)))
        : arguments.length == 1 && ((n = e), (e = require.id));
      if (e.indexOf("text!") === 0) return;
      var r = function (t, n) {
        return require(e, t, n);
      };
      require.modules[e] = {
        factory: function () {
          var e = { exports: {} },
            t = n(r, e.exports, e);
          return t && (e.exports = t), e;
        },
      };
    }),
    (e.initBaseUrls = function (e) {
      require.tlns = e;
    }),
    (e.initSender = function () {
      var e = require("ace/lib/event_emitter").EventEmitter,
        t = require("ace/lib/oop"),
        n = function () {};
      return (
        function () {
          t.implement(this, e),
            (this.callback = function (e, t) {
              postMessage({ type: "call", id: t, data: e });
            }),
            (this.emit = function (e, t) {
              postMessage({ type: "event", name: e, data: t });
            });
        }.call(n.prototype),
        new n()
      );
    }),
    (e.main = null),
    (e.sender = null),
    (e.onmessage = function (e) {
      var t = e.data;
      if (t.command) {
        if (!main[t.command]) throw new Error("Unknown command:" + t.command);
        main[t.command].apply(main, t.args);
      } else if (t.init) {
        initBaseUrls(t.tlns),
          require("ace/lib/es5-shim"),
          (sender = initSender());
        var n = require(t.module)[t.classname];
        main = new n(sender);
      } else t.event && sender && sender._emit(t.event, t.data);
    });
})(this),
  define(
    "ace/lib/event_emitter",
    ["require", "exports", "module"],
    function (e, t, n) {
      var r = {},
        i = function () {
          this.propagationStopped = !0;
        },
        s = function () {
          this.defaultPrevented = !0;
        };
      (r._emit = r._dispatchEvent =
        function (e, t) {
          this._eventRegistry || (this._eventRegistry = {}),
            this._defaultHandlers || (this._defaultHandlers = {});
          var n = this._eventRegistry[e] || [],
            r = this._defaultHandlers[e];
          if (!n.length && !r) return;
          if (typeof t != "object" || !t) t = {};
          t.type || (t.type = e),
            t.stopPropagation || (t.stopPropagation = i),
            t.preventDefault || (t.preventDefault = s);
          for (var o = 0; o < n.length; o++) {
            n[o](t, this);
            if (t.propagationStopped) break;
          }
          if (r && !t.defaultPrevented) return r(t, this);
        }),
        (r._signal = function (e, t) {
          var n = (this._eventRegistry || {})[e];
          if (!n) return;
          for (var r = 0; r < n.length; r++) n[r](t, this);
        }),
        (r.once = function (e, t) {
          var n = this;
          t &&
            this.addEventListener(e, function r() {
              n.removeEventListener(e, r), t.apply(null, arguments);
            });
        }),
        (r.setDefaultHandler = function (e, t) {
          var n = this._defaultHandlers;
          n || (n = this._defaultHandlers = { _disabled_: {} });
          if (n[e]) {
            var r = n[e],
              i = n._disabled_[e];
            i || (n._disabled_[e] = i = []), i.push(r);
            var s = i.indexOf(t);
            s != -1 && i.splice(s, 1);
          }
          n[e] = t;
        }),
        (r.removeDefaultHandler = function (e, t) {
          var n = this._defaultHandlers;
          if (!n) return;
          var r = n._disabled_[e];
          if (n[e] == t) {
            var i = n[e];
            r && this.setDefaultHandler(e, r.pop());
          } else if (r) {
            var s = r.indexOf(t);
            s != -1 && r.splice(s, 1);
          }
        }),
        (r.on = r.addEventListener =
          function (e, t, n) {
            this._eventRegistry = this._eventRegistry || {};
            var r = this._eventRegistry[e];
            return (
              r || (r = this._eventRegistry[e] = []),
              r.indexOf(t) == -1 && r[n ? "unshift" : "push"](t),
              t
            );
          }),
        (r.off =
          r.removeListener =
          r.removeEventListener =
            function (e, t) {
              this._eventRegistry = this._eventRegistry || {};
              var n = this._eventRegistry[e];
              if (!n) return;
              var r = n.indexOf(t);
              r !== -1 && n.splice(r, 1);
            }),
        (r.removeAllListeners = function (e) {
          this._eventRegistry && (this._eventRegistry[e] = []);
        }),
        (t.EventEmitter = r);
    }
  ),
  define("ace/lib/oop", ["require", "exports", "module"], function (e, t, n) {
    (t.inherits = (function () {
      var e = function () {};
      return function (t, n) {
        (e.prototype = n.prototype),
          (t.super_ = n.prototype),
          (t.prototype = new e()),
          (t.prototype.constructor = t);
      };
    })()),
      (t.mixin = function (e, t) {
        for (var n in t) e[n] = t[n];
        return e;
      }),
      (t.implement = function (e, n) {
        t.mixin(e, n);
      });
  }),
  define(
    "ace/lib/es5-shim",
    ["require", "exports", "module"],
    function (e, t, n) {
      function r() {}
      function i(e) {
        try {
          return Object.defineProperty(e, "sentinel", {}), "sentinel" in e;
        } catch (t) {}
      }
      function s(e) {
        return (
          (e = +e),
          e !== e
            ? (e = 0)
            : e !== 0 &&
              e !== 1 / 0 &&
              e !== -1 / 0 &&
              (e = (e > 0 || -1) * Math.floor(Math.abs(e))),
          e
        );
      }
      function o(e) {
        var t = typeof e;
        return (
          e === null ||
          t === "undefined" ||
          t === "boolean" ||
          t === "number" ||
          t === "string"
        );
      }
      function u(e) {
        var t, n, r;
        if (o(e)) return e;
        n = e.valueOf;
        if (typeof n == "function") {
          t = n.call(e);
          if (o(t)) return t;
        }
        r = e.toString;
        if (typeof r == "function") {
          t = r.call(e);
          if (o(t)) return t;
        }
        throw new TypeError();
      }
      Function.prototype.bind ||
        (Function.prototype.bind = function (e) {
          var t = this;
          if (typeof t != "function")
            throw new TypeError(
              "Function.prototype.bind called on incompatible " + t
            );
          var n = c.call(arguments, 1),
            i = function () {
              if (this instanceof i) {
                var r = t.apply(this, n.concat(c.call(arguments)));
                return Object(r) === r ? r : this;
              }
              return t.apply(e, n.concat(c.call(arguments)));
            };
          return (
            t.prototype &&
              ((r.prototype = t.prototype),
              (i.prototype = new r()),
              (r.prototype = null)),
            i
          );
        });
      var a = Function.prototype.call,
        f = Array.prototype,
        l = Object.prototype,
        c = f.slice,
        h = a.bind(l.toString),
        p = a.bind(l.hasOwnProperty),
        d,
        v,
        m,
        g,
        y;
      if ((y = p(l, "__defineGetter__")))
        (d = a.bind(l.__defineGetter__)),
          (v = a.bind(l.__defineSetter__)),
          (m = a.bind(l.__lookupGetter__)),
          (g = a.bind(l.__lookupSetter__));
      if ([1, 2].splice(0).length != 2)
        if (
          !(function () {
            function e(e) {
              var t = new Array(e + 2);
              return (t[0] = t[1] = 0), t;
            }
            var t = [],
              n;
            t.splice.apply(t, e(20)),
              t.splice.apply(t, e(26)),
              (n = t.length),
              t.splice(5, 0, "XXX"),
              n + 1 == t.length;
            if (n + 1 == t.length) return !0;
          })()
        )
          Array.prototype.splice = function (e, t) {
            var n = this.length;
            e > 0
              ? e > n && (e = n)
              : e == void 0
              ? (e = 0)
              : e < 0 && (e = Math.max(n + e, 0)),
              e + t < n || (t = n - e);
            var r = this.slice(e, e + t),
              i = c.call(arguments, 2),
              s = i.length;
            if (e === n) s && this.push.apply(this, i);
            else {
              var o = Math.min(t, n - e),
                u = e + o,
                a = u + s - o,
                f = n - u,
                l = n - o;
              if (a < u) for (var h = 0; h < f; ++h) this[a + h] = this[u + h];
              else if (a > u) for (h = f; h--; ) this[a + h] = this[u + h];
              if (s && e === l) (this.length = l), this.push.apply(this, i);
              else {
                this.length = l + s;
                for (h = 0; h < s; ++h) this[e + h] = i[h];
              }
            }
            return r;
          };
        else {
          var b = Array.prototype.splice;
          Array.prototype.splice = function (e, t) {
            return arguments.length
              ? b.apply(
                  this,
                  [
                    e === void 0 ? 0 : e,
                    t === void 0 ? this.length - e : t,
                  ].concat(c.call(arguments, 2))
                )
              : [];
          };
        }
      Array.isArray ||
        (Array.isArray = function (e) {
          return h(e) == "[object Array]";
        });
      var w = Object("a"),
        E = w[0] != "a" || !(0 in w);
      Array.prototype.forEach ||
        (Array.prototype.forEach = function (e) {
          var t = F(this),
            n = E && h(this) == "[object String]" ? this.split("") : t,
            r = arguments[1],
            i = -1,
            s = n.length >>> 0;
          if (h(e) != "[object Function]") throw new TypeError();
          while (++i < s) i in n && e.call(r, n[i], i, t);
        }),
        Array.prototype.map ||
          (Array.prototype.map = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0,
              i = Array(r),
              s = arguments[1];
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            for (var o = 0; o < r; o++)
              o in n && (i[o] = e.call(s, n[o], o, t));
            return i;
          }),
        Array.prototype.filter ||
          (Array.prototype.filter = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0,
              i = [],
              s,
              o = arguments[1];
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            for (var u = 0; u < r; u++)
              u in n && ((s = n[u]), e.call(o, s, u, t) && i.push(s));
            return i;
          }),
        Array.prototype.every ||
          (Array.prototype.every = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0,
              i = arguments[1];
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            for (var s = 0; s < r; s++)
              if (s in n && !e.call(i, n[s], s, t)) return !1;
            return !0;
          }),
        Array.prototype.some ||
          (Array.prototype.some = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0,
              i = arguments[1];
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            for (var s = 0; s < r; s++)
              if (s in n && e.call(i, n[s], s, t)) return !0;
            return !1;
          }),
        Array.prototype.reduce ||
          (Array.prototype.reduce = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0;
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            if (!r && arguments.length == 1)
              throw new TypeError(
                "reduce of empty array with no initial value"
              );
            var i = 0,
              s;
            if (arguments.length >= 2) s = arguments[1];
            else
              do {
                if (i in n) {
                  s = n[i++];
                  break;
                }
                if (++i >= r)
                  throw new TypeError(
                    "reduce of empty array with no initial value"
                  );
              } while (!0);
            for (; i < r; i++) i in n && (s = e.call(void 0, s, n[i], i, t));
            return s;
          }),
        Array.prototype.reduceRight ||
          (Array.prototype.reduceRight = function (e) {
            var t = F(this),
              n = E && h(this) == "[object String]" ? this.split("") : t,
              r = n.length >>> 0;
            if (h(e) != "[object Function]")
              throw new TypeError(e + " is not a function");
            if (!r && arguments.length == 1)
              throw new TypeError(
                "reduceRight of empty array with no initial value"
              );
            var i,
              s = r - 1;
            if (arguments.length >= 2) i = arguments[1];
            else
              do {
                if (s in n) {
                  i = n[s--];
                  break;
                }
                if (--s < 0)
                  throw new TypeError(
                    "reduceRight of empty array with no initial value"
                  );
              } while (!0);
            do s in this && (i = e.call(void 0, i, n[s], s, t));
            while (s--);
            return i;
          });
      if (!Array.prototype.indexOf || [0, 1].indexOf(1, 2) != -1)
        Array.prototype.indexOf = function (e) {
          var t = E && h(this) == "[object String]" ? this.split("") : F(this),
            n = t.length >>> 0;
          if (!n) return -1;
          var r = 0;
          arguments.length > 1 && (r = s(arguments[1])),
            (r = r >= 0 ? r : Math.max(0, n + r));
          for (; r < n; r++) if (r in t && t[r] === e) return r;
          return -1;
        };
      if (!Array.prototype.lastIndexOf || [0, 1].lastIndexOf(0, -3) != -1)
        Array.prototype.lastIndexOf = function (e) {
          var t = E && h(this) == "[object String]" ? this.split("") : F(this),
            n = t.length >>> 0;
          if (!n) return -1;
          var r = n - 1;
          arguments.length > 1 && (r = Math.min(r, s(arguments[1]))),
            (r = r >= 0 ? r : n - Math.abs(r));
          for (; r >= 0; r--) if (r in t && e === t[r]) return r;
          return -1;
        };
      Object.getPrototypeOf ||
        (Object.getPrototypeOf = function (e) {
          return e.__proto__ || (e.constructor ? e.constructor.prototype : l);
        });
      if (!Object.getOwnPropertyDescriptor) {
        var S = "Object.getOwnPropertyDescriptor called on a non-object: ";
        Object.getOwnPropertyDescriptor = function (e, t) {
          if ((typeof e != "object" && typeof e != "function") || e === null)
            throw new TypeError(S + e);
          if (!p(e, t)) return;
          var n, r, i;
          n = { enumerable: !0, configurable: !0 };
          if (y) {
            var s = e.__proto__;
            e.__proto__ = l;
            var r = m(e, t),
              i = g(e, t);
            e.__proto__ = s;
            if (r || i) return r && (n.get = r), i && (n.set = i), n;
          }
          return (n.value = e[t]), n;
        };
      }
      Object.getOwnPropertyNames ||
        (Object.getOwnPropertyNames = function (e) {
          return Object.keys(e);
        });
      if (!Object.create) {
        var x;
        Object.prototype.__proto__ === null
          ? (x = function () {
              return { __proto__: null };
            })
          : (x = function () {
              var e = {};
              for (var t in e) e[t] = null;
              return (
                (e.constructor =
                  e.hasOwnProperty =
                  e.propertyIsEnumerable =
                  e.isPrototypeOf =
                  e.toLocaleString =
                  e.toString =
                  e.valueOf =
                  e.__proto__ =
                    null),
                e
              );
            }),
          (Object.create = function (e, t) {
            var n;
            if (e === null) n = x();
            else {
              if (typeof e != "object")
                throw new TypeError(
                  "typeof prototype[" + typeof e + "] != 'object'"
                );
              var r = function () {};
              (r.prototype = e), (n = new r()), (n.__proto__ = e);
            }
            return t !== void 0 && Object.defineProperties(n, t), n;
          });
      }
      if (Object.defineProperty) {
        var T = i({}),
          N =
            typeof document == "undefined" || i(document.createElement("div"));
        if (!T || !N) var C = Object.defineProperty;
      }
      if (!Object.defineProperty || C) {
        var k = "Property description must be an object: ",
          L = "Object.defineProperty called on non-object: ",
          A = "getters & setters can not be defined on this javascript engine";
        Object.defineProperty = function (e, t, n) {
          if ((typeof e != "object" && typeof e != "function") || e === null)
            throw new TypeError(L + e);
          if ((typeof n != "object" && typeof n != "function") || n === null)
            throw new TypeError(k + n);
          if (C)
            try {
              return C.call(Object, e, t, n);
            } catch (r) {}
          if (p(n, "value"))
            if (y && (m(e, t) || g(e, t))) {
              var i = e.__proto__;
              (e.__proto__ = l),
                delete e[t],
                (e[t] = n.value),
                (e.__proto__ = i);
            } else e[t] = n.value;
          else {
            if (!y) throw new TypeError(A);
            p(n, "get") && d(e, t, n.get), p(n, "set") && v(e, t, n.set);
          }
          return e;
        };
      }
      Object.defineProperties ||
        (Object.defineProperties = function (e, t) {
          for (var n in t) p(t, n) && Object.defineProperty(e, n, t[n]);
          return e;
        }),
        Object.seal ||
          (Object.seal = function (e) {
            return e;
          }),
        Object.freeze ||
          (Object.freeze = function (e) {
            return e;
          });
      try {
        Object.freeze(function () {});
      } catch (O) {
        Object.freeze = (function (e) {
          return function (t) {
            return typeof t == "function" ? t : e(t);
          };
        })(Object.freeze);
      }
      Object.preventExtensions ||
        (Object.preventExtensions = function (e) {
          return e;
        }),
        Object.isSealed ||
          (Object.isSealed = function (e) {
            return !1;
          }),
        Object.isFrozen ||
          (Object.isFrozen = function (e) {
            return !1;
          }),
        Object.isExtensible ||
          (Object.isExtensible = function (e) {
            if (Object(e) === e) throw new TypeError();
            var t = "";
            while (p(e, t)) t += "?";
            e[t] = !0;
            var n = p(e, t);
            return delete e[t], n;
          });
      if (!Object.keys) {
        var M = !0,
          _ = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor",
          ],
          D = _.length;
        for (var P in { toString: null }) M = !1;
        Object.keys = function I(e) {
          if ((typeof e != "object" && typeof e != "function") || e === null)
            throw new TypeError("Object.keys called on a non-object");
          var I = [];
          for (var t in e) p(e, t) && I.push(t);
          if (M)
            for (var n = 0, r = D; n < r; n++) {
              var i = _[n];
              p(e, i) && I.push(i);
            }
          return I;
        };
      }
      Date.now ||
        (Date.now = function () {
          return new Date().getTime();
        });
      var H = "	\n\f\r ??????????????????????????????????????????????????\u2028\u2029???";
      if (!String.prototype.trim || H.trim()) {
        H = "[" + H + "]";
        var B = new RegExp("^" + H + H + "*"),
          j = new RegExp(H + H + "*$");
        String.prototype.trim = function () {
          return String(this).replace(B, "").replace(j, "");
        };
      }
      var F = function (e) {
        if (e == null) throw new TypeError("can't convert " + e + " to object");
        return Object(e);
      };
    }
  ),
  define(
    "ace/mode/lua_worker",
    [
      "require",
      "exports",
      "module",
      "ace/lib/oop",
      "ace/worker/mirror",
      "ace/mode/lua/luaparse",
    ],
    function (e, t, n) {
      var r = e("../lib/oop"),
        i = e("../worker/mirror").Mirror,
        s = e("../mode/lua/luaparse"),
        o = (t.Worker = function (e) {
          i.call(this, e), this.setTimeout(500);
        });
      r.inherits(o, i),
        function () {
          this.onUpdate = function () {
            var e = this.doc.getValue();
            try {
              s.parse(e);
            } catch (t) {
              t instanceof SyntaxError &&
                this.sender.emit("error", {
                  row: t.line - 1,
                  column: t.column,
                  text: t.message,
                  type: "error",
                });
              return;
            }
            this.sender.emit("ok");
          };
        }.call(o.prototype);
    }
  ),
  define(
    "ace/worker/mirror",
    ["require", "exports", "module", "ace/document", "ace/lib/lang"],
    function (e, t, n) {
      var r = e("../document").Document,
        i = e("../lib/lang"),
        s = (t.Mirror = function (e) {
          this.sender = e;
          var t = (this.doc = new r("")),
            n = (this.deferredUpdate = i.delayedCall(this.onUpdate.bind(this))),
            s = this;
          e.on("change", function (e) {
            t.applyDeltas(e.data), n.schedule(s.$timeout);
          });
        });
      (function () {
        (this.$timeout = 500),
          (this.setTimeout = function (e) {
            this.$timeout = e;
          }),
          (this.setValue = function (e) {
            this.doc.setValue(e), this.deferredUpdate.schedule(this.$timeout);
          }),
          (this.getValue = function (e) {
            this.sender.callback(this.doc.getValue(), e);
          }),
          (this.onUpdate = function () {});
      }.call(s.prototype));
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
    function (e, t, n) {
      var r = e("./lib/oop"),
        i = e("./lib/event_emitter").EventEmitter,
        s = e("./range").Range,
        o = e("./anchor").Anchor,
        u = function (e) {
          (this.$lines = []),
            e.length == 0
              ? (this.$lines = [""])
              : Array.isArray(e)
              ? this._insertLines(0, e)
              : this.insert({ row: 0, column: 0 }, e);
        };
      (function () {
        r.implement(this, i),
          (this.setValue = function (e) {
            var t = this.getLength();
            this.remove(new s(0, 0, t, this.getLine(t - 1).length)),
              this.insert({ row: 0, column: 0 }, e);
          }),
          (this.getValue = function () {
            return this.getAllLines().join(this.getNewLineCharacter());
          }),
          (this.createAnchor = function (e, t) {
            return new o(this, e, t);
          }),
          "aaa".split(/a/).length == 0
            ? (this.$split = function (e) {
                return e.replace(/\r\n|\r/g, "\n").split("\n");
              })
            : (this.$split = function (e) {
                return e.split(/\r\n|\r|\n/);
              }),
          (this.$detectNewLine = function (e) {
            var t = e.match(/^.*?(\r\n|\r|\n)/m);
            this.$autoNewLine = t ? t[1] : "\n";
          }),
          (this.getNewLineCharacter = function () {
            switch (this.$newLineMode) {
              case "windows":
                return "\r\n";
              case "unix":
                return "\n";
              default:
                return this.$autoNewLine;
            }
          }),
          (this.$autoNewLine = "\n"),
          (this.$newLineMode = "auto"),
          (this.setNewLineMode = function (e) {
            if (this.$newLineMode === e) return;
            this.$newLineMode = e;
          }),
          (this.getNewLineMode = function () {
            return this.$newLineMode;
          }),
          (this.isNewLine = function (e) {
            return e == "\r\n" || e == "\r" || e == "\n";
          }),
          (this.getLine = function (e) {
            return this.$lines[e] || "";
          }),
          (this.getLines = function (e, t) {
            return this.$lines.slice(e, t + 1);
          }),
          (this.getAllLines = function () {
            return this.getLines(0, this.getLength());
          }),
          (this.getLength = function () {
            return this.$lines.length;
          }),
          (this.getTextRange = function (e) {
            if (e.start.row == e.end.row)
              return this.$lines[e.start.row].substring(
                e.start.column,
                e.end.column
              );
            var t = this.getLines(e.start.row, e.end.row);
            t[0] = (t[0] || "").substring(e.start.column);
            var n = t.length - 1;
            return (
              e.end.row - e.start.row == n &&
                (t[n] = t[n].substring(0, e.end.column)),
              t.join(this.getNewLineCharacter())
            );
          }),
          (this.$clipPosition = function (e) {
            var t = this.getLength();
            return (
              e.row >= t
                ? ((e.row = Math.max(0, t - 1)),
                  (e.column = this.getLine(t - 1).length))
                : e.row < 0 && (e.row = 0),
              e
            );
          }),
          (this.insert = function (e, t) {
            if (!t || t.length === 0) return e;
            (e = this.$clipPosition(e)),
              this.getLength() <= 1 && this.$detectNewLine(t);
            var n = this.$split(t),
              r = n.splice(0, 1)[0],
              i = n.length == 0 ? null : n.splice(n.length - 1, 1)[0];
            return (
              (e = this.insertInLine(e, r)),
              i !== null &&
                ((e = this.insertNewLine(e)),
                (e = this._insertLines(e.row, n)),
                (e = this.insertInLine(e, i || ""))),
              e
            );
          }),
          (this.insertLines = function (e, t) {
            return e >= this.getLength()
              ? this.insert({ row: e, column: 0 }, "\n" + t.join("\n"))
              : this._insertLines(Math.max(e, 0), t);
          }),
          (this._insertLines = function (e, t) {
            if (t.length == 0) return { row: e, column: 0 };
            if (t.length > 65535) {
              var n = this._insertLines(e, t.slice(65535));
              t = t.slice(0, 65535);
            }
            var r = [e, 0];
            r.push.apply(r, t), this.$lines.splice.apply(this.$lines, r);
            var i = new s(e, 0, e + t.length, 0),
              o = { action: "insertLines", range: i, lines: t };
            return this._emit("change", { data: o }), n || i.end;
          }),
          (this.insertNewLine = function (e) {
            e = this.$clipPosition(e);
            var t = this.$lines[e.row] || "";
            (this.$lines[e.row] = t.substring(0, e.column)),
              this.$lines.splice(e.row + 1, 0, t.substring(e.column, t.length));
            var n = { row: e.row + 1, column: 0 },
              r = {
                action: "insertText",
                range: s.fromPoints(e, n),
                text: this.getNewLineCharacter(),
              };
            return this._emit("change", { data: r }), n;
          }),
          (this.insertInLine = function (e, t) {
            if (t.length == 0) return e;
            var n = this.$lines[e.row] || "";
            this.$lines[e.row] =
              n.substring(0, e.column) + t + n.substring(e.column);
            var r = { row: e.row, column: e.column + t.length },
              i = { action: "insertText", range: s.fromPoints(e, r), text: t };
            return this._emit("change", { data: i }), r;
          }),
          (this.remove = function (e) {
            (e.start = this.$clipPosition(e.start)),
              (e.end = this.$clipPosition(e.end));
            if (e.isEmpty()) return e.start;
            var t = e.start.row,
              n = e.end.row;
            if (e.isMultiLine()) {
              var r = e.start.column == 0 ? t : t + 1,
                i = n - 1;
              e.end.column > 0 && this.removeInLine(n, 0, e.end.column),
                i >= r && this._removeLines(r, i),
                r != t &&
                  (this.removeInLine(t, e.start.column, this.getLine(t).length),
                  this.removeNewLine(e.start.row));
            } else this.removeInLine(t, e.start.column, e.end.column);
            return e.start;
          }),
          (this.removeInLine = function (e, t, n) {
            if (t == n) return;
            var r = new s(e, t, e, n),
              i = this.getLine(e),
              o = i.substring(t, n),
              u = i.substring(0, t) + i.substring(n, i.length);
            this.$lines.splice(e, 1, u);
            var a = { action: "removeText", range: r, text: o };
            return this._emit("change", { data: a }), r.start;
          }),
          (this.removeLines = function (e, t) {
            return e < 0 || t >= this.getLength()
              ? this.remove(new s(e, 0, t + 1, 0))
              : this._removeLines(e, t);
          }),
          (this._removeLines = function (e, t) {
            var n = new s(e, 0, t + 1, 0),
              r = this.$lines.splice(e, t - e + 1),
              i = {
                action: "removeLines",
                range: n,
                nl: this.getNewLineCharacter(),
                lines: r,
              };
            return this._emit("change", { data: i }), r;
          }),
          (this.removeNewLine = function (e) {
            var t = this.getLine(e),
              n = this.getLine(e + 1),
              r = new s(e, t.length, e + 1, 0),
              i = t + n;
            this.$lines.splice(e, 2, i);
            var o = {
              action: "removeText",
              range: r,
              text: this.getNewLineCharacter(),
            };
            this._emit("change", { data: o });
          }),
          (this.replace = function (e, t) {
            if (t.length == 0 && e.isEmpty()) return e.start;
            if (t == this.getTextRange(e)) return e.end;
            this.remove(e);
            if (t) var n = this.insert(e.start, t);
            else n = e.start;
            return n;
          }),
          (this.applyDeltas = function (e) {
            for (var t = 0; t < e.length; t++) {
              var n = e[t],
                r = s.fromPoints(n.range.start, n.range.end);
              n.action == "insertLines"
                ? this.insertLines(r.start.row, n.lines)
                : n.action == "insertText"
                ? this.insert(r.start, n.text)
                : n.action == "removeLines"
                ? this._removeLines(r.start.row, r.end.row - 1)
                : n.action == "removeText" && this.remove(r);
            }
          }),
          (this.revertDeltas = function (e) {
            for (var t = e.length - 1; t >= 0; t--) {
              var n = e[t],
                r = s.fromPoints(n.range.start, n.range.end);
              n.action == "insertLines"
                ? this._removeLines(r.start.row, r.end.row - 1)
                : n.action == "insertText"
                ? this.remove(r)
                : n.action == "removeLines"
                ? this._insertLines(r.start.row, n.lines)
                : n.action == "removeText" && this.insert(r.start, n.text);
            }
          }),
          (this.indexToPosition = function (e, t) {
            var n = this.$lines || this.getAllLines(),
              r = this.getNewLineCharacter().length;
            for (var i = t || 0, s = n.length; i < s; i++) {
              e -= n[i].length + r;
              if (e < 0) return { row: i, column: e + n[i].length + r };
            }
            return { row: s - 1, column: n[s - 1].length };
          }),
          (this.positionToIndex = function (e, t) {
            var n = this.$lines || this.getAllLines(),
              r = this.getNewLineCharacter().length,
              i = 0,
              s = Math.min(e.row, n.length);
            for (var o = t || 0; o < s; ++o) i += n[o].length + r;
            return i + e.column;
          });
      }.call(u.prototype),
        (t.Document = u));
    }
  ),
  define("ace/range", ["require", "exports", "module"], function (e, t, n) {
    var r = function (e, t) {
        return e.row - t.row || e.column - t.column;
      },
      i = function (e, t, n, r) {
        (this.start = { row: e, column: t }),
          (this.end = { row: n, column: r });
      };
    (function () {
      (this.isEqual = function (e) {
        return (
          this.start.row === e.start.row &&
          this.end.row === e.end.row &&
          this.start.column === e.start.column &&
          this.end.column === e.end.column
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
        (this.contains = function (e, t) {
          return this.compare(e, t) == 0;
        }),
        (this.compareRange = function (e) {
          var t,
            n = e.end,
            r = e.start;
          return (
            (t = this.compare(n.row, n.column)),
            t == 1
              ? ((t = this.compare(r.row, r.column)),
                t == 1 ? 2 : t == 0 ? 1 : 0)
              : t == -1
              ? -2
              : ((t = this.compare(r.row, r.column)),
                t == -1 ? -1 : t == 1 ? 42 : 0)
          );
        }),
        (this.comparePoint = function (e) {
          return this.compare(e.row, e.column);
        }),
        (this.containsRange = function (e) {
          return (
            this.comparePoint(e.start) == 0 && this.comparePoint(e.end) == 0
          );
        }),
        (this.intersects = function (e) {
          var t = this.compareRange(e);
          return t == -1 || t == 0 || t == 1;
        }),
        (this.isEnd = function (e, t) {
          return this.end.row == e && this.end.column == t;
        }),
        (this.isStart = function (e, t) {
          return this.start.row == e && this.start.column == t;
        }),
        (this.setStart = function (e, t) {
          typeof e == "object"
            ? ((this.start.column = e.column), (this.start.row = e.row))
            : ((this.start.row = e), (this.start.column = t));
        }),
        (this.setEnd = function (e, t) {
          typeof e == "object"
            ? ((this.end.column = e.column), (this.end.row = e.row))
            : ((this.end.row = e), (this.end.column = t));
        }),
        (this.inside = function (e, t) {
          return this.compare(e, t) == 0
            ? this.isEnd(e, t) || this.isStart(e, t)
              ? !1
              : !0
            : !1;
        }),
        (this.insideStart = function (e, t) {
          return this.compare(e, t) == 0 ? (this.isEnd(e, t) ? !1 : !0) : !1;
        }),
        (this.insideEnd = function (e, t) {
          return this.compare(e, t) == 0 ? (this.isStart(e, t) ? !1 : !0) : !1;
        }),
        (this.compare = function (e, t) {
          return !this.isMultiLine() && e === this.start.row
            ? t < this.start.column
              ? -1
              : t > this.end.column
              ? 1
              : 0
            : e < this.start.row
            ? -1
            : e > this.end.row
            ? 1
            : this.start.row === e
            ? t >= this.start.column
              ? 0
              : -1
            : this.end.row === e
            ? t <= this.end.column
              ? 0
              : 1
            : 0;
        }),
        (this.compareStart = function (e, t) {
          return this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (this.compareEnd = function (e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.compare(e, t);
        }),
        (this.compareInside = function (e, t) {
          return this.end.row == e && this.end.column == t
            ? 1
            : this.start.row == e && this.start.column == t
            ? -1
            : this.compare(e, t);
        }),
        (this.clipRows = function (e, t) {
          if (this.end.row > t) var n = { row: t + 1, column: 0 };
          else if (this.end.row < e) var n = { row: e, column: 0 };
          if (this.start.row > t) var r = { row: t + 1, column: 0 };
          else if (this.start.row < e) var r = { row: e, column: 0 };
          return i.fromPoints(r || this.start, n || this.end);
        }),
        (this.extend = function (e, t) {
          var n = this.compare(e, t);
          if (n == 0) return this;
          if (n == -1) var r = { row: e, column: t };
          else var s = { row: e, column: t };
          return i.fromPoints(r || this.start, s || this.end);
        }),
        (this.isEmpty = function () {
          return (
            this.start.row === this.end.row &&
            this.start.column === this.end.column
          );
        }),
        (this.isMultiLine = function () {
          return this.start.row !== this.end.row;
        }),
        (this.clone = function () {
          return i.fromPoints(this.start, this.end);
        }),
        (this.collapseRows = function () {
          return this.end.column == 0
            ? new i(
                this.start.row,
                0,
                Math.max(this.start.row, this.end.row - 1),
                0
              )
            : new i(this.start.row, 0, this.end.row, 0);
        }),
        (this.toScreenRange = function (e) {
          var t = e.documentToScreenPosition(this.start),
            n = e.documentToScreenPosition(this.end);
          return new i(t.row, t.column, n.row, n.column);
        }),
        (this.moveBy = function (e, t) {
          (this.start.row += e),
            (this.start.column += t),
            (this.end.row += e),
            (this.end.column += t);
        });
    }.call(i.prototype),
      (i.fromPoints = function (e, t) {
        return new i(e.row, e.column, t.row, t.column);
      }),
      (i.comparePoints = r),
      (i.comparePoints = function (e, t) {
        return e.row - t.row || e.column - t.column;
      }),
      (t.Range = i));
  }),
  define(
    "ace/anchor",
    ["require", "exports", "module", "ace/lib/oop", "ace/lib/event_emitter"],
    function (e, t, n) {
      var r = e("./lib/oop"),
        i = e("./lib/event_emitter").EventEmitter,
        s = (t.Anchor = function (e, t, n) {
          (this.document = e),
            typeof n == "undefined"
              ? this.setPosition(t.row, t.column)
              : this.setPosition(t, n),
            (this.$onChange = this.onChange.bind(this)),
            e.on("change", this.$onChange);
        });
      (function () {
        r.implement(this, i),
          (this.getPosition = function () {
            return this.$clipPositionToDocument(this.row, this.column);
          }),
          (this.getDocument = function () {
            return this.document;
          }),
          (this.onChange = function (e) {
            var t = e.data,
              n = t.range;
            if (n.start.row == n.end.row && n.start.row != this.row) return;
            if (n.start.row > this.row) return;
            if (n.start.row == this.row && n.start.column > this.column) return;
            var r = this.row,
              i = this.column,
              s = n.start,
              o = n.end;
            t.action === "insertText"
              ? s.row === r && s.column <= i
                ? s.row === o.row
                  ? (i += o.column - s.column)
                  : ((i -= s.column), (r += o.row - s.row))
                : s.row !== o.row && s.row < r && (r += o.row - s.row)
              : t.action === "insertLines"
              ? s.row <= r && (r += o.row - s.row)
              : t.action === "removeText"
              ? s.row === r && s.column < i
                ? o.column >= i
                  ? (i = s.column)
                  : (i = Math.max(0, i - (o.column - s.column)))
                : s.row !== o.row && s.row < r
                ? (o.row === r && (i = Math.max(0, i - o.column) + s.column),
                  (r -= o.row - s.row))
                : o.row === r &&
                  ((r -= o.row - s.row),
                  (i = Math.max(0, i - o.column) + s.column))
              : t.action == "removeLines" &&
                s.row <= r &&
                (o.row <= r ? (r -= o.row - s.row) : ((r = s.row), (i = 0))),
              this.setPosition(r, i, !0);
          }),
          (this.setPosition = function (e, t, n) {
            var r;
            n
              ? (r = { row: e, column: t })
              : (r = this.$clipPositionToDocument(e, t));
            if (this.row == r.row && this.column == r.column) return;
            var i = { row: this.row, column: this.column };
            (this.row = r.row),
              (this.column = r.column),
              this._emit("change", { old: i, value: r });
          }),
          (this.detach = function () {
            this.document.removeEventListener("change", this.$onChange);
          }),
          (this.$clipPositionToDocument = function (e, t) {
            var n = {};
            return (
              e >= this.document.getLength()
                ? ((n.row = Math.max(0, this.document.getLength() - 1)),
                  (n.column = this.document.getLine(n.row).length))
                : e < 0
                ? ((n.row = 0), (n.column = 0))
                : ((n.row = e),
                  (n.column = Math.min(
                    this.document.getLine(n.row).length,
                    Math.max(0, t)
                  ))),
              t < 0 && (n.column = 0),
              n
            );
          });
      }.call(s.prototype));
    }
  ),
  define("ace/lib/lang", ["require", "exports", "module"], function (e, t, n) {
    (t.stringReverse = function (e) {
      return e.split("").reverse().join("");
    }),
      (t.stringRepeat = function (e, t) {
        var n = "";
        while (t > 0) {
          t & 1 && (n += e);
          if ((t >>= 1)) e += e;
        }
        return n;
      });
    var r = /^\s\s*/,
      i = /\s\s*$/;
    (t.stringTrimLeft = function (e) {
      return e.replace(r, "");
    }),
      (t.stringTrimRight = function (e) {
        return e.replace(i, "");
      }),
      (t.copyObject = function (e) {
        var t = {};
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.copyArray = function (e) {
        var t = [];
        for (var n = 0, r = e.length; n < r; n++)
          e[n] && typeof e[n] == "object"
            ? (t[n] = this.copyObject(e[n]))
            : (t[n] = e[n]);
        return t;
      }),
      (t.deepCopy = function (e) {
        if (typeof e != "object") return e;
        var t = e.constructor();
        for (var n in e)
          typeof e[n] == "object"
            ? (t[n] = this.deepCopy(e[n]))
            : (t[n] = e[n]);
        return t;
      }),
      (t.arrayToMap = function (e) {
        var t = {};
        for (var n = 0; n < e.length; n++) t[e[n]] = 1;
        return t;
      }),
      (t.createMap = function (e) {
        var t = Object.create(null);
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (t.arrayRemove = function (e, t) {
        for (var n = 0; n <= e.length; n++) t === e[n] && e.splice(n, 1);
      }),
      (t.escapeRegExp = function (e) {
        return e.replace(/([.*+?^${}()|[\]\/\\])/g, "\\$1");
      }),
      (t.escapeHTML = function (e) {
        return e
          .replace(/&/g, "&#38;")
          .replace(/"/g, "&#34;")
          .replace(/'/g, "&#39;")
          .replace(/</g, "&#60;");
      }),
      (t.getMatchOffsets = function (e, t) {
        var n = [];
        return (
          e.replace(t, function (e) {
            n.push({
              offset: arguments[arguments.length - 2],
              length: e.length,
            });
          }),
          n
        );
      }),
      (t.deferredCall = function (e) {
        var t = null,
          n = function () {
            (t = null), e();
          },
          r = function (e) {
            return r.cancel(), (t = setTimeout(n, e || 0)), r;
          };
        return (
          (r.schedule = r),
          (r.call = function () {
            return this.cancel(), e(), r;
          }),
          (r.cancel = function () {
            return clearTimeout(t), (t = null), r;
          }),
          r
        );
      }),
      (t.delayedCall = function (e, t) {
        var n = null,
          r = function () {
            (n = null), e();
          },
          i = function (e) {
            n && clearTimeout(n), (n = setTimeout(r, e || t));
          };
        return (
          (i.delay = i),
          (i.schedule = function (e) {
            n == null && (n = setTimeout(r, e || 0));
          }),
          (i.call = function () {
            this.cancel(), e();
          }),
          (i.cancel = function () {
            n && clearTimeout(n), (n = null);
          }),
          (i.isPending = function () {
            return n;
          }),
          i
        );
      });
  }),
  define(
    "ace/mode/lua/luaparse",
    ["require", "exports", "module", "exports"],
    function (e, t, n) {
      (function (e, n, r) {
        typeof t != "undefined"
          ? r(t)
          : typeof define == "function" && define.amd
          ? define(["exports"], r)
          : r((e[n] = {}));
      })(this, "luaparse", function (e) {
        function t(e) {
          var t = kt.call(arguments, 1);
          return (
            (e = e.replace(/%(\d)/g, function (e, n) {
              return "" + t[n - 1] || "";
            })),
            e
          );
        }
        function n() {
          var e = kt.call(arguments),
            t = {},
            n,
            r;
          for (var i = 0, s = e.length; i < s; i++) {
            n = e[i];
            for (r in n) n.hasOwnProperty(r) && (t[r] = n[r]);
          }
          return t;
        }
        function r(e) {
          var n = t.apply(null, kt.call(arguments, 1)),
            r,
            i;
          throw (
            ("undefined" != typeof e.line
              ? ((i = e.range[0] - e.lineStart),
                (r = new SyntaxError(t("[%1:%2] %3", e.line, i, n))),
                (r.line = e.line),
                (r.index = e.range[0]),
                (r.column = i))
              : ((i = Ot - Bt + 1),
                (r = new SyntaxError(t("[%1:%2] %3", Ht, i, n))),
                (r.index = Ot),
                (r.line = Ht),
                (r.column = i)),
            r)
          );
        }
        function i(e, t) {
          r(t, Nt.expectedToken, e, t.value);
        }
        function s(e, t) {
          "undefined" == typeof t && (t = _t.value);
          if ("undefined" != typeof e.type) {
            var n;
            switch (e.type) {
              case gt:
                n = "string";
                break;
              case yt:
                n = "keyword";
                break;
              case bt:
                n = "identifier";
                break;
              case wt:
                n = "number";
                break;
              case Et:
                n = "symbol";
                break;
              case St:
                n = "boolean";
                break;
              case xt:
                return r(e, Nt.unexpected, "symbol", "nil", t);
            }
            return r(e, Nt.unexpected, n, e.value, t);
          }
          return r(e, Nt.unexpected, "symbol", e, t);
        }
        function o() {
          u();
          while (45 === ht.charCodeAt(Ot) && 45 === ht.charCodeAt(Ot + 1))
            g(), u();
          if (Ot >= dt)
            return {
              type: mt,
              value: "<eof>",
              line: Ht,
              lineStart: Bt,
              range: [Ot, Ot],
            };
          var e = ht.charCodeAt(Ot),
            t = ht.charCodeAt(Ot + 1);
          Pt = Ot;
          if (C(e)) return a();
          switch (e) {
            case 39:
            case 34:
              return c();
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
              return p();
            case 46:
              if (T(t)) return p();
              if (46 === t) return 46 === ht.charCodeAt(Ot + 2) ? l() : f("..");
              return f(".");
            case 61:
              if (61 === t) return f("==");
              return f("=");
            case 62:
              if (61 === t) return f(">=");
              return f(">");
            case 60:
              if (61 === t) return f("<=");
              return f("<");
            case 126:
              if (61 === t) return f("~=");
              return r({}, Nt.expected, "=", "~");
            case 58:
              if (58 === t) return f("::");
              return f(":");
            case 91:
              if (91 === t || 61 === t) return h();
              return f("[");
            case 42:
            case 47:
            case 94:
            case 37:
            case 44:
            case 123:
            case 125:
            case 93:
            case 40:
            case 41:
            case 59:
            case 35:
            case 45:
            case 43:
              return f(ht.charAt(Ot));
          }
          return s(ht.charAt(Ot));
        }
        function u() {
          while (Ot < dt) {
            var e = ht.charCodeAt(Ot);
            if (S(e)) Ot++;
            else {
              if (!x(e)) break;
              Ht++, (Bt = ++Ot);
            }
          }
        }
        function a() {
          var e, t;
          while (k(ht.charCodeAt(++Ot)));
          return (
            (e = ht.slice(Pt, Ot)),
            L(e)
              ? (t = yt)
              : "true" === e || "false" === e
              ? ((t = St), (e = "true" === e))
              : "nil" === e
              ? ((t = xt), (e = null))
              : (t = bt),
            { type: t, value: e, line: Ht, lineStart: Bt, range: [Pt, Ot] }
          );
        }
        function f(e) {
          return (
            (Ot += e.length),
            { type: Et, value: e, line: Ht, lineStart: Bt, range: [Pt, Ot] }
          );
        }
        function l() {
          return (
            (Ot += 3),
            { type: Tt, value: "...", line: Ht, lineStart: Bt, range: [Pt, Ot] }
          );
        }
        function c() {
          var e = ht.charCodeAt(Ot++),
            t = Ot,
            n = "",
            i;
          while (Ot < dt) {
            i = ht.charCodeAt(Ot++);
            if (e === i) break;
            if (92 === i) (n += ht.slice(t, Ot - 1) + m()), (t = Ot);
            else if (Ot >= dt || x(i))
              (n += ht.slice(t, Ot - 1)),
                r({}, Nt.unfinishedString, n + String.fromCharCode(i));
          }
          return (
            (n += ht.slice(t, Ot - 1)),
            { type: gt, value: n, line: Ht, lineStart: Bt, range: [Pt, Ot] }
          );
        }
        function h() {
          var e = y();
          return (
            !1 === e && r(Mt, Nt.expected, "[", Mt.value),
            { type: gt, value: e, line: Ht, lineStart: Bt, range: [Pt, Ot] }
          );
        }
        function p() {
          var e = ht.charAt(Ot),
            t = ht.charAt(Ot + 1),
            n = "0" === e && "xX".indexOf(t || null) >= 0 ? d() : v();
          return {
            type: wt,
            value: n,
            line: Ht,
            lineStart: Bt,
            range: [Pt, Ot],
          };
        }
        function d() {
          var e = 0,
            t = 1,
            n = 1,
            i,
            s,
            o,
            u;
          (u = Ot += 2),
            N(ht.charCodeAt(Ot)) || r({}, Nt.malformedNumber, ht.slice(Pt, Ot));
          while (N(ht.charCodeAt(Ot))) Ot++;
          i = parseInt(ht.slice(u, Ot), 16);
          if ("." === ht.charAt(Ot)) {
            s = ++Ot;
            while (N(ht.charCodeAt(Ot))) Ot++;
            (e = ht.slice(s, Ot)),
              (e = s === Ot ? 0 : parseInt(e, 16) / Math.pow(16, Ot - s));
          }
          if ("pP".indexOf(ht.charAt(Ot) || null) >= 0) {
            Ot++,
              "+-".indexOf(ht.charAt(Ot) || null) >= 0 &&
                (n = "+" === ht.charAt(Ot++) ? 1 : -1),
              (o = Ot),
              T(ht.charCodeAt(Ot)) ||
                r({}, Nt.malformedNumber, ht.slice(Pt, Ot));
            while (T(ht.charCodeAt(Ot))) Ot++;
            (t = ht.slice(o, Ot)), (t = Math.pow(2, t * n));
          }
          return (i + e) * t;
        }
        function v() {
          while (T(ht.charCodeAt(Ot))) Ot++;
          if ("." === ht.charAt(Ot)) {
            Ot++;
            while (T(ht.charCodeAt(Ot))) Ot++;
          }
          if ("eE".indexOf(ht.charAt(Ot) || null) >= 0) {
            Ot++,
              "+-".indexOf(ht.charAt(Ot) || null) >= 0 && Ot++,
              T(ht.charCodeAt(Ot)) ||
                r({}, Nt.malformedNumber, ht.slice(Pt, Ot));
            while (T(ht.charCodeAt(Ot))) Ot++;
          }
          return parseFloat(ht.slice(Pt, Ot));
        }
        function m() {
          var e = Ot;
          switch (ht.charAt(Ot)) {
            case "n":
              return Ot++, "\n";
            case "r":
              return Ot++, "\r";
            case "t":
              return Ot++, "	";
            case "v":
              return Ot++, "";
            case "b":
              return Ot++, "\b";
            case "f":
              return Ot++, "\f";
            case "z":
              return Ot++, u(), "";
            case "x":
              if (N(ht.charCodeAt(Ot + 1)) && N(ht.charCodeAt(Ot + 2)))
                return (Ot += 3), "\\" + ht.slice(e, Ot);
              return "\\" + ht.charAt(Ot++);
            default:
              if (T(ht.charCodeAt(Ot))) {
                while (T(ht.charCodeAt(++Ot)));
                return "\\" + ht.slice(e, Ot);
              }
              return ht.charAt(Ot++);
          }
        }
        function g() {
          (Pt = Ot), (Ot += 2);
          var e = ht.charAt(Ot),
            t = "",
            n = !1,
            r = Ot;
          "[" === e && ((t = y()), !1 === t ? (t = e) : (n = !0));
          if (!n) {
            while (Ot < dt) {
              if (x(ht.charCodeAt(Ot))) break;
              Ot++;
            }
            t = ht.slice(r, Ot);
          }
          pt.comments &&
            Dt.push({ type: "Comment", value: t, raw: ht.slice(Pt, Ot) });
        }
        function y() {
          var e = 0,
            t = "",
            n = !1,
            r,
            i;
          Ot++;
          while ("=" === ht.charAt(Ot + e)) e++;
          if ("[" !== ht.charAt(Ot + e)) return !1;
          (Ot += e + 1), x(ht.charCodeAt(Ot)) && (Ht++, (Bt = Ot++)), (i = Ot);
          while (Ot < dt) {
            (r = ht.charAt(Ot++)), x(r.charCodeAt(0)) && (Ht++, (Bt = Ot));
            if ("]" === r) {
              n = !0;
              for (var s = 0; s < e; s++) "=" !== ht.charAt(Ot + s) && (n = !1);
              "]" !== ht.charAt(Ot + e) && (n = !1);
            }
            if (n) break;
          }
          return (t += ht.slice(i, Ot - 1)), (Ot += e + 1), t;
        }
        function b() {
          (Mt = _t), (_t = o());
        }
        function w(e) {
          return e === Mt.value ? (b(), !0) : !1;
        }
        function E(e) {
          e === Mt.value ? b() : r(Mt, Nt.expected, e, Mt.value);
        }
        function S(e) {
          return 9 === e || 32 === e || 11 === e || 12 === e;
        }
        function x(e) {
          return 10 === e || 13 === e;
        }
        function T(e) {
          return e >= 48 && e <= 57;
        }
        function N(e) {
          return (
            (e >= 48 && e <= 57) ||
            (e >= 97 && e <= 102) ||
            (e >= 65 && e <= 70)
          );
        }
        function C(e) {
          return (e >= 65 && e <= 90) || (e >= 97 && e <= 122) || 95 === e;
        }
        function k(e) {
          return (
            (e >= 65 && e <= 90) ||
            (e >= 97 && e <= 122) ||
            95 === e ||
            (e >= 48 && e <= 57)
          );
        }
        function L(e) {
          switch (e.length) {
            case 2:
              return "do" === e || "if" === e || "in" === e || "or" === e;
            case 3:
              return "and" === e || "end" === e || "for" === e || "not" === e;
            case 4:
              return "else" === e || "goto" === e || "then" === e;
            case 5:
              return (
                "break" === e || "local" === e || "until" === e || "while" === e
              );
            case 6:
              return "elseif" === e || "repeat" === e || "return" === e;
            case 8:
              return "function" === e;
          }
          return !1;
        }
        function A(e) {
          return Et === e.type
            ? "#-".indexOf(e.value) >= 0
            : yt === e.type
            ? "not" === e.value
            : !1;
        }
        function O(e) {
          switch (e.type) {
            case "CallExpression":
            case "TableCallExpression":
            case "StringCallExpression":
              return !0;
          }
          return !1;
        }
        function M(e) {
          if (mt === e.type) return !0;
          if (yt !== e.type) return !1;
          switch (e.value) {
            case "else":
            case "elseif":
            case "end":
            case "until":
              return !0;
            default:
              return !1;
          }
        }
        function _() {
          jt.push(Array.apply(null, jt[Ft++]));
        }
        function D() {
          jt.pop(), Ft--;
        }
        function P(e) {
          if (-1 !== At.call(jt[Ft], e)) return;
          jt[Ft].push(e);
        }
        function H(e) {
          P(e.name), B(e, !0);
        }
        function B(e, t) {
          !t && -1 === At.call(qt, e.name) && (qt.push(e.name), It.push(e)),
            (e.isLocal = t);
        }
        function j(e) {
          return -1 !== At.call(jt[Ft], e);
        }
        function F() {
          b();
          var e = I();
          return mt !== Mt.type && s(Mt), Ct.chunk(e);
        }
        function I(e) {
          var t = [],
            n;
          pt.scope && _();
          while (!M(Mt)) {
            if ("return" === Mt.value) {
              t.push(q());
              break;
            }
            (n = q()), n && t.push(n);
          }
          return pt.scope && D(), t;
        }
        function q() {
          if (yt === Mt.type)
            switch (Mt.value) {
              case "local":
                return b(), Q();
              case "if":
                return b(), J();
              case "return":
                return b(), $();
              case "function":
                b();
                var e = et();
                return Z(e);
              case "while":
                return b(), X();
              case "for":
                return b(), K();
              case "repeat":
                return b(), V();
              case "break":
                return b(), U();
              case "do":
                return b(), W();
              case "goto":
                return b(), z();
            }
          if (Et === Mt.type && w("::")) return R();
          if (w(";")) return;
          return G();
        }
        function R() {
          var e = Mt.value,
            t = Y();
          return (
            pt.scope && (P("::" + e + "::"), B(t, !0)),
            E("::"),
            Ct.labelStatement(t)
          );
        }
        function U() {
          return Ct.breakStatement();
        }
        function z() {
          var e = Mt.value,
            t = Y();
          return (
            pt.scope && (t.isLabel = j("::" + e + "::")), Ct.gotoStatement(t)
          );
        }
        function W() {
          var e = I();
          return E("end"), Ct.doStatement(e);
        }
        function X() {
          var e = rt();
          E("do");
          var t = I();
          return E("end"), Ct.whileStatement(e, t);
        }
        function V() {
          var e = I();
          E("until");
          var t = rt();
          return Ct.repeatStatement(t, e);
        }
        function $() {
          var e = [];
          if ("end" !== Mt.value) {
            var t = nt();
            null != t && e.push(t);
            while (w(",")) (t = rt()), e.push(t);
            w(";");
          }
          return Ct.returnStatement(e);
        }
        function J() {
          var e = [],
            t,
            n;
          (t = rt()), E("then"), (n = I()), e.push(Ct.ifClause(t, n));
          while (w("elseif"))
            (t = rt()), E("then"), (n = I()), e.push(Ct.elseifClause(t, n));
          return (
            w("else") && ((n = I()), e.push(Ct.elseClause(n))),
            E("end"),
            Ct.ifStatement(e)
          );
        }
        function K() {
          var e = Y(),
            t;
          pt.scope && H(e);
          if (w("=")) {
            var n = rt();
            E(",");
            var r = rt(),
              i = w(",") ? rt() : null;
            return (
              E("do"),
              (t = I()),
              E("end"),
              Ct.forNumericStatement(e, n, r, i, t)
            );
          }
          var s = [e];
          while (w(",")) (e = Y()), pt.scope && H(e), s.push(e);
          E("in");
          var o = [];
          do {
            var u = rt();
            o.push(u);
          } while (w(","));
          return E("do"), (t = I()), E("end"), Ct.forGenericStatement(s, o, t);
        }
        function Q() {
          var e;
          if (bt === Mt.type) {
            var t = [],
              n = [];
            do (e = Y()), t.push(e);
            while (w(","));
            if (w("="))
              do {
                var r = rt();
                n.push(r);
              } while (w(","));
            if (pt.scope) for (var s = 0, o = t.length; s < o; s++) H(t[s]);
            return Ct.localStatement(t, n);
          }
          if (w("function")) return (e = Y()), pt.scope && H(e), Z(e, !0);
          i("<name>", Mt);
        }
        function G() {
          var e = Mt,
            t = ot();
          if (null == t) return s(Mt);
          if (",=".indexOf(Mt.value) >= 0) {
            var n = [t],
              r = [],
              o;
            while (w(","))
              (o = ot()), null == o && i("<expression>", Mt), n.push(o);
            E("=");
            do (o = rt()), r.push(o);
            while (w(","));
            return Ct.assignmentStatement(n, r);
          }
          return O(t) ? Ct.callStatement(t) : s(e);
        }
        function Y() {
          var e = Mt.value;
          return bt !== Mt.type && i("<name>", Mt), b(), Ct.identifier(e);
        }
        function Z(e, t) {
          var n = [];
          E("(");
          if (!w(")"))
            for (;;)
              if (bt === Mt.type) {
                var r = Y();
                pt.scope && H(r), n.push(r);
                if (w(",")) continue;
                if (w(")")) break;
              } else {
                if (Tt === Mt.type) {
                  n.push(at()), E(")");
                  break;
                }
                i("<name> or '...'", Mt);
              }
          var s = I();
          return E("end"), (t = t || !1), Ct.functionStatement(e, n, t, s);
        }
        function et() {
          var e = Y(),
            t;
          pt.scope && B(e, !1);
          while (w("."))
            (t = Y()),
              pt.scope && B(t, !1),
              (e = Ct.memberExpression(e, ".", t));
          return (
            w(":") &&
              ((t = Y()),
              pt.scope && B(t, !1),
              (e = Ct.memberExpression(e, ":", t))),
            e
          );
        }
        function tt() {
          var e = [],
            t,
            n;
          for (;;) {
            if (Et === Mt.type && w("["))
              (t = rt()), E("]"), E("="), (n = rt()), e.push(Ct.tableKey(t, n));
            else if (bt === Mt.type)
              (t = rt()),
                w("=")
                  ? ((n = rt()), e.push(Ct.tableKeyString(t, n)))
                  : e.push(Ct.tableValue(t));
            else {
              if (null == (n = nt())) break;
              e.push(Ct.tableValue(n));
            }
            if (",;".indexOf(Mt.value) >= 0) {
              b();
              continue;
            }
            if ("}" === Mt.value) break;
          }
          return E("}"), Ct.tableConstructorExpression(e);
        }
        function nt() {
          var e = st(0);
          return e;
        }
        function rt() {
          var e = nt();
          if (null != e) return e;
          i("<expression>", Mt);
        }
        function it(e) {
          var t = e.charCodeAt(0),
            n = e.length;
          if (1 === n)
            switch (t) {
              case 94:
                return 10;
              case 42:
              case 47:
              case 37:
                return 7;
              case 43:
              case 45:
                return 6;
              case 60:
              case 62:
                return 3;
            }
          else if (2 === n)
            switch (t) {
              case 46:
                return 5;
              case 60:
              case 62:
              case 61:
              case 126:
                return 3;
              case 111:
                return 1;
            }
          else if (97 === t && "and" === e) return 2;
          return 0;
        }
        function st(e) {
          var t = Mt.value,
            n;
          if (A(Mt)) {
            b();
            var r = st(8);
            r == null && i("<expression>", Mt), (n = Ct.unaryExpression(t, r));
          }
          null == n && ((n = at()), null == n && (n = ot()));
          if (null == n) return null;
          var s;
          for (;;) {
            (t = Mt.value), (s = Et === Mt.type || yt === Mt.type ? it(t) : 0);
            if (s === 0 || s <= e) break;
            ("^" === t || ".." === t) && s--, b();
            var o = st(s);
            null == o && i("<expression>", Mt),
              (n = Ct.binaryExpression(t, n, o));
          }
          return n;
        }
        function ot() {
          var e, t, n;
          if (bt === Mt.type)
            (t = Mt.value), (e = Y()), pt.scope && B(e, (n = j(t)));
          else {
            if (!w("(")) return null;
            (e = rt()), E(")"), pt.scope && (n = e.isLocal);
          }
          var r, i;
          for (;;)
            if (Et === Mt.type)
              switch (Mt.value) {
                case "[":
                  b(), (r = rt()), (e = Ct.indexExpression(e, r)), E("]");
                  break;
                case ".":
                  b(),
                    (i = Y()),
                    pt.scope && B(i, n),
                    (e = Ct.memberExpression(e, ".", i));
                  break;
                case ":":
                  b(),
                    (i = Y()),
                    pt.scope && B(i, n),
                    (e = Ct.memberExpression(e, ":", i)),
                    (e = ut(e));
                  break;
                case "(":
                case "{":
                  e = ut(e);
                  break;
                default:
                  return e;
              }
            else {
              if (gt !== Mt.type) break;
              e = ut(e);
            }
          return e;
        }
        function ut(e) {
          if (Et === Mt.type)
            switch (Mt.value) {
              case "(":
                b();
                var t = [],
                  n = nt();
                null != n && t.push(n);
                while (w(",")) (n = rt()), t.push(n);
                return E(")"), Ct.callExpression(e, t);
              case "{":
                b();
                var r = tt();
                return Ct.tableCallExpression(e, r);
            }
          else if (gt === Mt.type) return Ct.stringCallExpression(e, at());
          i("function arguments", Mt);
        }
        function at() {
          var e = gt | wt | St | xt | Tt,
            t = Mt.value,
            n = Mt.type;
          if (n & e) {
            var r = ht.slice(Mt.range[0], Mt.range[1]);
            return b(), Ct.literal(n, t, r);
          }
          if (yt === n && "function" === t) return b(), Z(null);
          if (w("{")) return tt();
        }
        function ft(t, r) {
          return (
            "undefined" == typeof r &&
              "object" == typeof t &&
              ((r = t), (t = undefined)),
            r || (r = {}),
            (ht = t || ""),
            (pt = n(vt, r)),
            (Ot = 0),
            (Ht = 1),
            (Bt = 0),
            (dt = ht.length),
            (jt = [[]]),
            (Ft = 0),
            (It = []),
            (qt = []),
            pt.comments && (Dt = []),
            pt.wait ? e : ct()
          );
        }
        function lt(t) {
          return (ht += String(t)), (dt = ht.length), e;
        }
        function ct(e) {
          "undefined" != typeof e && lt(e), (dt = ht.length), (_t = o());
          var t = F();
          return (
            pt.comments && (t.comments = Dt), pt.scope && (t.globals = It), t
          );
        }
        e.version = "0.0.11";
        var ht,
          pt,
          dt,
          vt = (e.defaultOptions = { wait: !1, comments: !0, scope: !1 }),
          mt = 1,
          gt = 2,
          yt = 4,
          bt = 8,
          wt = 16,
          Et = 32,
          St = 64,
          xt = 128,
          Tt = 256,
          Nt = (e.errors = {
            unexpected: "Unexpected %1 '%2' near '%3'",
            expected: "'%1' expected near '%2'",
            expectedToken: "%1 expected near '%2'",
            unfinishedString: "unfinished string near '%1'",
            malformedNumber: "malformed number near '%1'",
          }),
          Ct = (e.ast = {
            labelStatement: function (e) {
              return { type: "LabelStatement", label: e };
            },
            breakStatement: function () {
              return { type: "BreakStatement" };
            },
            gotoStatement: function (e) {
              return { type: "GotoStatement", label: e };
            },
            returnStatement: function (e) {
              return { type: "ReturnStatement", arguments: e };
            },
            ifStatement: function (e) {
              return { type: "IfStatement", clauses: e };
            },
            ifClause: function (e, t) {
              return { type: "IfClause", condition: e, body: t };
            },
            elseifClause: function (e, t) {
              return { type: "ElseifClause", condition: e, body: t };
            },
            elseClause: function (e) {
              return { type: "ElseClause", body: e };
            },
            whileStatement: function (e, t) {
              return { type: "WhileStatement", condition: e, body: t };
            },
            doStatement: function (e) {
              return { type: "DoStatement", body: e };
            },
            repeatStatement: function (e, t) {
              return { type: "RepeatStatement", condition: e, body: t };
            },
            localStatement: function (e, t) {
              return { type: "LocalStatement", variables: e, init: t };
            },
            assignmentStatement: function (e, t) {
              return { type: "AssignmentStatement", variables: e, init: t };
            },
            callStatement: function (e) {
              return { type: "CallStatement", expression: e };
            },
            functionStatement: function (e, t, n, r) {
              return {
                type: "FunctionDeclaration",
                identifier: e,
                isLocal: n,
                parameters: t,
                body: r,
              };
            },
            forNumericStatement: function (e, t, n, r, i) {
              return {
                type: "ForNumericStatement",
                variable: e,
                start: t,
                end: n,
                step: r,
                body: i,
              };
            },
            forGenericStatement: function (e, t, n) {
              return {
                type: "ForGenericStatement",
                variables: e,
                iterators: t,
                body: n,
              };
            },
            chunk: function (e) {
              return { type: "Chunk", body: e };
            },
            identifier: function (e) {
              return { type: "Identifier", name: e };
            },
            literal: function (e, t, n) {
              return (
                (e =
                  e === gt
                    ? "StringLiteral"
                    : e === wt
                    ? "NumericLiteral"
                    : e === St
                    ? "BooleanLiteral"
                    : e === xt
                    ? "NilLiteral"
                    : "VarargLiteral"),
                { type: e, value: t, raw: n }
              );
            },
            tableKey: function (e, t) {
              return { type: "TableKey", key: e, value: t };
            },
            tableKeyString: function (e, t) {
              return { type: "TableKeyString", key: e, value: t };
            },
            tableValue: function (e) {
              return { type: "TableValue", value: e };
            },
            tableConstructorExpression: function (e) {
              return { type: "TableConstructorExpression", fields: e };
            },
            binaryExpression: function (e, t, n) {
              var r =
                "and" === e || "or" === e
                  ? "LogicalExpression"
                  : "BinaryExpression";
              return { type: r, operator: e, left: t, right: n };
            },
            unaryExpression: function (e, t) {
              return { type: "UnaryExpression", operator: e, argument: t };
            },
            memberExpression: function (e, t, n) {
              return {
                type: "MemberExpression",
                indexer: t,
                identifier: n,
                base: e,
              };
            },
            indexExpression: function (e, t) {
              return { type: "IndexExpression", base: e, index: t };
            },
            callExpression: function (e, t) {
              return { type: "CallExpression", base: e, arguments: t };
            },
            tableCallExpression: function (e, t) {
              return { type: "TableCallExpression", base: e, arguments: t };
            },
            stringCallExpression: function (e, t) {
              return { type: "StringCallExpression", base: e, argument: t };
            },
          }),
          kt = Array.prototype.slice,
          Lt = Object.prototype.toString,
          At =
            Array.prototype.indexOf ||
            function (e) {
              for (var t = 0, n = this.length; t < n; t++)
                if (this[t] === e) return t;
              return -1;
            },
          Ot,
          Mt,
          _t,
          Dt,
          Pt,
          Ht,
          Bt,
          jt,
          Ft,
          It,
          qt;
        (e.parse = ft), (e.write = lt), (e.end = ct), (e.lex = o);
      });
    }
  );
