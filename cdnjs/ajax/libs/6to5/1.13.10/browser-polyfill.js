(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw ((f.code = "MODULE_NOT_FOUND"), f);
      }
      var l = (n[o] = { exports: {} });
      t[o][0].call(
        l.exports,
        function (e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        },
        l,
        l.exports,
        e,
        t,
        n,
        r
      );
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})(
  {
    1: [
      function (require, module, exports) {
        (function (global) {
          var ensureSymbol = function (key) {
            Symbol[key] = Symbol[key] || Symbol();
          };
          var ensureProto = function (Constructor, key, val) {
            var proto = Constructor.prototype;
            proto[key] = proto[key] || val;
          };
          if (typeof Symbol === "undefined") {
            require("es6-symbol/implement");
          }
          require("es6-shim");
          require("./transformation/transformers/es6-generators/runtime");
          ensureSymbol("referenceGet");
          ensureSymbol("referenceSet");
          ensureSymbol("referenceDelete");
          ensureProto(Function, Symbol.referenceGet, function () {
            return this;
          });
          ensureProto(Map, Symbol.referenceGet, Map.prototype.get);
          ensureProto(Map, Symbol.referenceSet, Map.prototype.set);
          ensureProto(Map, Symbol.referenceDelete, Map.prototype.delete);
          if (global.WeakMap) {
            ensureProto(WeakMap, Symbol.referenceGet, WeakMap.prototype.get);
            ensureProto(WeakMap, Symbol.referenceSet, WeakMap.prototype.set);
            ensureProto(
              WeakMap,
              Symbol.referenceDelete,
              WeakMap.prototype.delete
            );
          }
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {
        "./transformation/transformers/es6-generators/runtime": 2,
        "es6-shim": 4,
        "es6-symbol/implement": 5,
      },
    ],
    2: [
      function (require, module, exports) {
        (function (global) {
          var iteratorSymbol =
            (typeof Symbol === "function" && Symbol.iterator) || "@@iterator";
          var runtime = (global.regeneratorRuntime = exports);
          var hasOwn = Object.prototype.hasOwnProperty;
          var wrap = (runtime.wrap = function wrap(
            innerFn,
            outerFn,
            self,
            tryList
          ) {
            return new Generator(innerFn, outerFn, self || null, tryList || []);
          });
          var GenStateSuspendedStart = "suspendedStart";
          var GenStateSuspendedYield = "suspendedYield";
          var GenStateExecuting = "executing";
          var GenStateCompleted = "completed";
          var ContinueSentinel = {};
          var GF = function GeneratorFunction() {};
          var GFp = function GeneratorFunctionPrototype() {};
          var Gp = (GFp.prototype = Generator.prototype);
          (GFp.constructor = GF).prototype = Gp.constructor = GFp;
          var GFName = "GeneratorFunction";
          if (GF.name !== GFName) GF.name = GFName;
          if (GF.name !== GFName) throw new Error(GFName + " renamed?");
          runtime.isGeneratorFunction = function (genFun) {
            var ctor = genFun && genFun.constructor;
            return ctor ? GF.name === ctor.name : false;
          };
          runtime.mark = function (genFun) {
            genFun.__proto__ = GFp;
            genFun.prototype = Object.create(Gp);
            return genFun;
          };
          runtime.async = function (innerFn, outerFn, self, tryList) {
            return new Promise(function (resolve, reject) {
              var generator = wrap(innerFn, outerFn, self, tryList);
              var callNext = step.bind(generator.next);
              var callThrow = step.bind(generator["throw"]);
              function step(arg) {
                var info;
                var value;
                try {
                  info = this(arg);
                  value = info.value;
                } catch (error) {
                  return reject(error);
                }
                if (info.done) {
                  resolve(value);
                } else {
                  Promise.resolve(value).then(callNext, callThrow);
                }
              }
              callNext();
            });
          };
          function Generator(innerFn, outerFn, self, tryList) {
            var generator = outerFn ? Object.create(outerFn.prototype) : this;
            var context = new Context(tryList);
            var state = GenStateSuspendedStart;
            function invoke(method, arg) {
              if (state === GenStateExecuting) {
                throw new Error("Generator is already running");
              }
              if (state === GenStateCompleted) {
                throw new Error("Generator has already finished");
              }
              while (true) {
                var delegate = context.delegate;
                var info;
                if (delegate) {
                  try {
                    info = delegate.iterator[method](arg);
                    method = "next";
                    arg = undefined;
                  } catch (uncaught) {
                    context.delegate = null;
                    method = "throw";
                    arg = uncaught;
                    continue;
                  }
                  if (info.done) {
                    context[delegate.resultName] = info.value;
                    context.next = delegate.nextLoc;
                  } else {
                    state = GenStateSuspendedYield;
                    return info;
                  }
                  context.delegate = null;
                }
                if (method === "next") {
                  if (
                    state === GenStateSuspendedStart &&
                    typeof arg !== "undefined"
                  ) {
                    throw new TypeError(
                      "attempt to send " +
                        JSON.stringify(arg) +
                        " to newborn generator"
                    );
                  }
                  if (state === GenStateSuspendedYield) {
                    context.sent = arg;
                  } else {
                    delete context.sent;
                  }
                } else if (method === "throw") {
                  if (state === GenStateSuspendedStart) {
                    state = GenStateCompleted;
                    throw arg;
                  }
                  if (context.dispatchException(arg)) {
                    method = "next";
                    arg = undefined;
                  }
                } else if (method === "return") {
                  context.abrupt("return", arg);
                }
                state = GenStateExecuting;
                try {
                  var value = innerFn.call(self, context);
                  state = context.done
                    ? GenStateCompleted
                    : GenStateSuspendedYield;
                  info = { value: value, done: context.done };
                  if (value === ContinueSentinel) {
                    if (context.delegate && method === "next") {
                      arg = undefined;
                    }
                  } else {
                    return info;
                  }
                } catch (thrown) {
                  state = GenStateCompleted;
                  if (method === "next") {
                    context.dispatchException(thrown);
                  } else {
                    arg = thrown;
                  }
                }
              }
            }
            generator.next = invoke.bind(generator, "next");
            generator["throw"] = invoke.bind(generator, "throw");
            generator["return"] = invoke.bind(generator, "return");
            return generator;
          }
          Gp[iteratorSymbol] = function () {
            return this;
          };
          Gp.toString = function () {
            return "[object Generator]";
          };
          function pushTryEntry(triple) {
            var entry = { tryLoc: triple[0] };
            if (1 in triple) {
              entry.catchLoc = triple[1];
            }
            if (2 in triple) {
              entry.finallyLoc = triple[2];
            }
            this.tryEntries.push(entry);
          }
          function resetTryEntry(entry, i) {
            var record = entry.completion || {};
            record.type = i === 0 ? "normal" : "return";
            delete record.arg;
            entry.completion = record;
          }
          function Context(tryList) {
            this.tryEntries = [{ tryLoc: "root" }];
            tryList.forEach(pushTryEntry, this);
            this.reset();
          }
          runtime.keys = function (object) {
            var keys = [];
            for (var key in object) {
              keys.push(key);
            }
            keys.reverse();
            return function next() {
              while (keys.length) {
                var key = keys.pop();
                if (key in object) {
                  next.value = key;
                  next.done = false;
                  return next;
                }
              }
              next.done = true;
              return next;
            };
          };
          function values(iterable) {
            var iterator = iterable;
            if (iteratorSymbol in iterable) {
              iterator = iterable[iteratorSymbol]();
            } else if (!isNaN(iterable.length)) {
              var i = -1;
              iterator = function next() {
                while (++i < iterable.length) {
                  if (i in iterable) {
                    next.value = iterable[i];
                    next.done = false;
                    return next;
                  }
                }
                next.done = true;
                return next;
              };
              iterator.next = iterator;
            }
            return iterator;
          }
          runtime.values = values;
          Context.prototype = {
            constructor: Context,
            reset: function () {
              this.prev = 0;
              this.next = 0;
              this.sent = undefined;
              this.done = false;
              this.delegate = null;
              this.tryEntries.forEach(resetTryEntry);
              for (
                var tempIndex = 0, tempName;
                hasOwn.call(this, (tempName = "t" + tempIndex)) ||
                tempIndex < 20;
                ++tempIndex
              ) {
                this[tempName] = null;
              }
            },
            stop: function () {
              this.done = true;
              var rootEntry = this.tryEntries[0];
              var rootRecord = rootEntry.completion;
              if (rootRecord.type === "throw") {
                throw rootRecord.arg;
              }
              return this.rval;
            },
            dispatchException: function (exception) {
              if (this.done) {
                throw exception;
              }
              var context = this;
              function handle(loc, caught) {
                record.type = "throw";
                record.arg = exception;
                context.next = loc;
                return !!caught;
              }
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                var record = entry.completion;
                if (entry.tryLoc === "root") {
                  return handle("end");
                }
                if (entry.tryLoc <= this.prev) {
                  var hasCatch = hasOwn.call(entry, "catchLoc");
                  var hasFinally = hasOwn.call(entry, "finallyLoc");
                  if (hasCatch && hasFinally) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    } else if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else if (hasCatch) {
                    if (this.prev < entry.catchLoc) {
                      return handle(entry.catchLoc, true);
                    }
                  } else if (hasFinally) {
                    if (this.prev < entry.finallyLoc) {
                      return handle(entry.finallyLoc);
                    }
                  } else {
                    throw new Error("try statement without catch or finally");
                  }
                }
              }
            },
            _findFinallyEntry: function (finallyLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (
                  entry.tryLoc <= this.prev &&
                  hasOwn.call(entry, "finallyLoc") &&
                  (entry.finallyLoc === finallyLoc ||
                    this.prev < entry.finallyLoc)
                ) {
                  return entry;
                }
              }
            },
            abrupt: function (type, arg) {
              var entry = this._findFinallyEntry();
              var record = entry ? entry.completion : {};
              record.type = type;
              record.arg = arg;
              if (entry) {
                this.next = entry.finallyLoc;
              } else {
                this.complete(record);
              }
              return ContinueSentinel;
            },
            complete: function (record) {
              if (record.type === "throw") {
                throw record.arg;
              }
              if (record.type === "break" || record.type === "continue") {
                this.next = record.arg;
              } else if (record.type === "return") {
                this.rval = record.arg;
                this.next = "end";
              }
              return ContinueSentinel;
            },
            finish: function (finallyLoc) {
              var entry = this._findFinallyEntry(finallyLoc);
              return this.complete(entry.completion);
            },
            catch: function (tryLoc) {
              for (var i = this.tryEntries.length - 1; i >= 0; --i) {
                var entry = this.tryEntries[i];
                if (entry.tryLoc === tryLoc) {
                  var record = entry.completion;
                  var thrown;
                  if (record.type === "throw") {
                    thrown = record.arg;
                    resetTryEntry(entry, i);
                  }
                  return thrown;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function (iterable, resultName, nextLoc) {
              this.delegate = {
                iterator: values(iterable),
                resultName: resultName,
                nextLoc: nextLoc,
              };
              return ContinueSentinel;
            },
          };
        }.call(
          this,
          typeof global !== "undefined"
            ? global
            : typeof self !== "undefined"
            ? self
            : typeof window !== "undefined"
            ? window
            : {}
        ));
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        var process = (module.exports = {});
        process.nextTick = (function () {
          var canSetImmediate =
            typeof window !== "undefined" && window.setImmediate;
          var canMutationObserver =
            typeof window !== "undefined" && window.MutationObserver;
          var canPost =
            typeof window !== "undefined" &&
            window.postMessage &&
            window.addEventListener;
          if (canSetImmediate) {
            return function (f) {
              return window.setImmediate(f);
            };
          }
          var queue = [];
          if (canMutationObserver) {
            var hiddenDiv = document.createElement("div");
            var observer = new MutationObserver(function () {
              var queueList = queue.slice();
              queue.length = 0;
              queueList.forEach(function (fn) {
                fn();
              });
            });
            observer.observe(hiddenDiv, { attributes: true });
            return function nextTick(fn) {
              if (!queue.length) {
                hiddenDiv.setAttribute("yes", "no");
              }
              queue.push(fn);
            };
          }
          if (canPost) {
            window.addEventListener(
              "message",
              function (ev) {
                var source = ev.source;
                if (
                  (source === window || source === null) &&
                  ev.data === "process-tick"
                ) {
                  ev.stopPropagation();
                  if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                  }
                }
              },
              true
            );
            return function nextTick(fn) {
              queue.push(fn);
              window.postMessage("process-tick", "*");
            };
          }
          return function nextTick(fn) {
            setTimeout(fn, 0);
          };
        })();
        process.title = "browser";
        process.browser = true;
        process.env = {};
        process.argv = [];
        function noop() {}
        process.on = noop;
        process.addListener = noop;
        process.once = noop;
        process.off = noop;
        process.removeListener = noop;
        process.removeAllListeners = noop;
        process.emit = noop;
        process.binding = function (name) {
          throw new Error("process.binding is not supported");
        };
        process.cwd = function () {
          return "/";
        };
        process.chdir = function (dir) {
          throw new Error("process.chdir is not supported");
        };
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        (function (process) {
          (function (root, factory) {
            if (typeof define === "function" && define.amd) {
              define(factory);
            } else if (typeof exports === "object") {
              module.exports = factory();
            } else {
              root.returnExports = factory();
            }
          })(this, function () {
            "use strict";
            var isCallableWithoutNew = function (func) {
              try {
                func();
              } catch (e) {
                return false;
              }
              return true;
            };
            var supportsSubclassing = function (C, f) {
              try {
                var Sub = function () {
                  C.apply(this, arguments);
                };
                if (!Sub.__proto__) {
                  return false;
                }
                Object.setPrototypeOf(Sub, C);
                Sub.prototype = Object.create(C.prototype, {
                  constructor: { value: C },
                });
                return f(Sub);
              } catch (e) {
                return false;
              }
            };
            var arePropertyDescriptorsSupported = function () {
              try {
                Object.defineProperty({}, "x", {});
                return true;
              } catch (e) {
                return false;
              }
            };
            var startsWithRejectsRegex = function () {
              var rejectsRegex = false;
              if (String.prototype.startsWith) {
                try {
                  "/a/".startsWith(/a/);
                } catch (e) {
                  rejectsRegex = true;
                }
              }
              return rejectsRegex;
            };
            var getGlobal = new Function("return this;");
            var globals = getGlobal();
            var global_isFinite = globals.isFinite;
            var supportsDescriptors =
              !!Object.defineProperty && arePropertyDescriptorsSupported();
            var startsWithIsCompliant = startsWithRejectsRegex();
            var _slice = Array.prototype.slice;
            var _indexOf = String.prototype.indexOf;
            var _toString = Object.prototype.toString;
            var _hasOwnProperty = Object.prototype.hasOwnProperty;
            var ArrayIterator;
            var defineProperty = function (object, name, value, force) {
              if (!force && name in object) {
                return;
              }
              if (supportsDescriptors) {
                Object.defineProperty(object, name, {
                  configurable: true,
                  enumerable: false,
                  writable: true,
                  value: value,
                });
              } else {
                object[name] = value;
              }
            };
            var defineProperties = function (object, map) {
              Object.keys(map).forEach(function (name) {
                var method = map[name];
                defineProperty(object, name, method, false);
              });
            };
            var create =
              Object.create ||
              function (prototype, properties) {
                function Type() {}
                Type.prototype = prototype;
                var object = new Type();
                if (typeof properties !== "undefined") {
                  defineProperties(object, properties);
                }
                return object;
              };
            var $iterator$ =
              (typeof Symbol === "function" && Symbol.iterator) ||
              "_es6shim_iterator_";
            if (
              globals.Set &&
              typeof new globals.Set()["@@iterator"] === "function"
            ) {
              $iterator$ = "@@iterator";
            }
            var addIterator = function (prototype, impl) {
              if (!impl) {
                impl = function iterator() {
                  return this;
                };
              }
              var o = {};
              o[$iterator$] = impl;
              defineProperties(prototype, o);
              if (!prototype[$iterator$] && typeof $iterator$ === "symbol") {
                prototype[$iterator$] = impl;
              }
            };
            var isArguments = function isArguments(value) {
              var str = _toString.call(value);
              var result = str === "[object Arguments]";
              if (!result) {
                result =
                  str !== "[object Array]" &&
                  value !== null &&
                  typeof value === "object" &&
                  typeof value.length === "number" &&
                  value.length >= 0 &&
                  _toString.call(value.callee) === "[object Function]";
              }
              return result;
            };
            var emulateES6construct = function (o) {
              if (!ES.TypeIsObject(o)) {
                throw new TypeError("bad object");
              }
              if (!o._es6construct) {
                if (o.constructor && ES.IsCallable(o.constructor["@@create"])) {
                  o = o.constructor["@@create"](o);
                }
                defineProperties(o, { _es6construct: true });
              }
              return o;
            };
            var ES = {
              CheckObjectCoercible: function (x, optMessage) {
                if (x == null) {
                  throw new TypeError(
                    optMessage || "Cannot call method on " + x
                  );
                }
                return x;
              },
              TypeIsObject: function (x) {
                return x != null && Object(x) === x;
              },
              ToObject: function (o, optMessage) {
                return Object(ES.CheckObjectCoercible(o, optMessage));
              },
              IsCallable: function (x) {
                return (
                  typeof x === "function" &&
                  _toString.call(x) === "[object Function]"
                );
              },
              ToInt32: function (x) {
                return x >> 0;
              },
              ToUint32: function (x) {
                return x >>> 0;
              },
              ToInteger: function (value) {
                var number = +value;
                if (Number.isNaN(number)) {
                  return 0;
                }
                if (number === 0 || !Number.isFinite(number)) {
                  return number;
                }
                return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
              },
              ToLength: function (value) {
                var len = ES.ToInteger(value);
                if (len <= 0) {
                  return 0;
                }
                if (len > Number.MAX_SAFE_INTEGER) {
                  return Number.MAX_SAFE_INTEGER;
                }
                return len;
              },
              SameValue: function (a, b) {
                if (a === b) {
                  if (a === 0) {
                    return 1 / a === 1 / b;
                  }
                  return true;
                }
                return Number.isNaN(a) && Number.isNaN(b);
              },
              SameValueZero: function (a, b) {
                return a === b || (Number.isNaN(a) && Number.isNaN(b));
              },
              IsIterable: function (o) {
                return (
                  ES.TypeIsObject(o) &&
                  (typeof o[$iterator$] !== "undefined" || isArguments(o))
                );
              },
              GetIterator: function (o) {
                if (isArguments(o)) {
                  return new ArrayIterator(o, "value");
                }
                var itFn = o[$iterator$];
                if (!ES.IsCallable(itFn)) {
                  throw new TypeError("value is not an iterable");
                }
                var it = itFn.call(o);
                if (!ES.TypeIsObject(it)) {
                  throw new TypeError("bad iterator");
                }
                return it;
              },
              IteratorNext: function (it) {
                var result =
                  arguments.length > 1 ? it.next(arguments[1]) : it.next();
                if (!ES.TypeIsObject(result)) {
                  throw new TypeError("bad iterator");
                }
                return result;
              },
              Construct: function (C, args) {
                var obj;
                if (ES.IsCallable(C["@@create"])) {
                  obj = C["@@create"]();
                } else {
                  obj = create(C.prototype || null);
                }
                defineProperties(obj, { _es6construct: true });
                var result = C.apply(obj, args);
                return ES.TypeIsObject(result) ? result : obj;
              },
            };
            var numberConversion = (function () {
              function roundToEven(n) {
                var w = Math.floor(n),
                  f = n - w;
                if (f < 0.5) {
                  return w;
                }
                if (f > 0.5) {
                  return w + 1;
                }
                return w % 2 ? w + 1 : w;
              }
              function packIEEE754(v, ebits, fbits) {
                var bias = (1 << (ebits - 1)) - 1,
                  s,
                  e,
                  f,
                  i,
                  bits,
                  str,
                  bytes;
                if (v !== v) {
                  e = (1 << ebits) - 1;
                  f = Math.pow(2, fbits - 1);
                  s = 0;
                } else if (v === Infinity || v === -Infinity) {
                  e = (1 << ebits) - 1;
                  f = 0;
                  s = v < 0 ? 1 : 0;
                } else if (v === 0) {
                  e = 0;
                  f = 0;
                  s = 1 / v === -Infinity ? 1 : 0;
                } else {
                  s = v < 0;
                  v = Math.abs(v);
                  if (v >= Math.pow(2, 1 - bias)) {
                    e = Math.min(Math.floor(Math.log(v) / Math.LN2), 1023);
                    f = roundToEven((v / Math.pow(2, e)) * Math.pow(2, fbits));
                    if (f / Math.pow(2, fbits) >= 2) {
                      e = e + 1;
                      f = 1;
                    }
                    if (e > bias) {
                      e = (1 << ebits) - 1;
                      f = 0;
                    } else {
                      e = e + bias;
                      f = f - Math.pow(2, fbits);
                    }
                  } else {
                    e = 0;
                    f = roundToEven(v / Math.pow(2, 1 - bias - fbits));
                  }
                }
                bits = [];
                for (i = fbits; i; i -= 1) {
                  bits.push(f % 2 ? 1 : 0);
                  f = Math.floor(f / 2);
                }
                for (i = ebits; i; i -= 1) {
                  bits.push(e % 2 ? 1 : 0);
                  e = Math.floor(e / 2);
                }
                bits.push(s ? 1 : 0);
                bits.reverse();
                str = bits.join("");
                bytes = [];
                while (str.length) {
                  bytes.push(parseInt(str.slice(0, 8), 2));
                  str = str.slice(8);
                }
                return bytes;
              }
              function unpackIEEE754(bytes, ebits, fbits) {
                var bits = [],
                  i,
                  j,
                  b,
                  str,
                  bias,
                  s,
                  e,
                  f;
                for (i = bytes.length; i; i -= 1) {
                  b = bytes[i - 1];
                  for (j = 8; j; j -= 1) {
                    bits.push(b % 2 ? 1 : 0);
                    b = b >> 1;
                  }
                }
                bits.reverse();
                str = bits.join("");
                bias = (1 << (ebits - 1)) - 1;
                s = parseInt(str.slice(0, 1), 2) ? -1 : 1;
                e = parseInt(str.slice(1, 1 + ebits), 2);
                f = parseInt(str.slice(1 + ebits), 2);
                if (e === (1 << ebits) - 1) {
                  return f !== 0 ? NaN : s * Infinity;
                } else if (e > 0) {
                  return (
                    s * Math.pow(2, e - bias) * (1 + f / Math.pow(2, fbits))
                  );
                } else if (f !== 0) {
                  return (
                    s * Math.pow(2, -(bias - 1)) * (f / Math.pow(2, fbits))
                  );
                } else {
                  return s < 0 ? -0 : 0;
                }
              }
              function unpackFloat64(b) {
                return unpackIEEE754(b, 11, 52);
              }
              function packFloat64(v) {
                return packIEEE754(v, 11, 52);
              }
              function unpackFloat32(b) {
                return unpackIEEE754(b, 8, 23);
              }
              function packFloat32(v) {
                return packIEEE754(v, 8, 23);
              }
              var conversions = {
                toFloat32: function (num) {
                  return unpackFloat32(packFloat32(num));
                },
              };
              if (typeof Float32Array !== "undefined") {
                var float32array = new Float32Array(1);
                conversions.toFloat32 = function (num) {
                  float32array[0] = num;
                  return float32array[0];
                };
              }
              return conversions;
            })();
            defineProperties(String, {
              fromCodePoint: function (_) {
                var points = _slice.call(arguments, 0, arguments.length);
                var result = [];
                var next;
                for (var i = 0, length = points.length; i < length; i++) {
                  next = Number(points[i]);
                  if (
                    !ES.SameValue(next, ES.ToInteger(next)) ||
                    next < 0 ||
                    next > 1114111
                  ) {
                    throw new RangeError("Invalid code point " + next);
                  }
                  if (next < 65536) {
                    result.push(String.fromCharCode(next));
                  } else {
                    next -= 65536;
                    result.push(String.fromCharCode((next >> 10) + 55296));
                    result.push(String.fromCharCode((next % 1024) + 56320));
                  }
                }
                return result.join("");
              },
              raw: function (callSite) {
                var substitutions = _slice.call(arguments, 1, arguments.length);
                var cooked = ES.ToObject(callSite, "bad callSite");
                var rawValue = cooked.raw;
                var raw = ES.ToObject(rawValue, "bad raw value");
                var len = Object.keys(raw).length;
                var literalsegments = ES.ToLength(len);
                if (literalsegments === 0) {
                  return "";
                }
                var stringElements = [];
                var nextIndex = 0;
                var nextKey, next, nextSeg, nextSub;
                while (nextIndex < literalsegments) {
                  nextKey = String(nextIndex);
                  next = raw[nextKey];
                  nextSeg = String(next);
                  stringElements.push(nextSeg);
                  if (nextIndex + 1 >= literalsegments) {
                    break;
                  }
                  next = substitutions[nextKey];
                  if (typeof next === "undefined") {
                    break;
                  }
                  nextSub = String(next);
                  stringElements.push(nextSub);
                  nextIndex++;
                }
                return stringElements.join("");
              },
            });
            if (String.fromCodePoint.length !== 1) {
              var originalFromCodePoint = String.fromCodePoint;
              defineProperty(
                String,
                "fromCodePoint",
                function (_) {
                  return originalFromCodePoint.apply(this, arguments);
                },
                true
              );
            }
            var StringShims = {
              repeat: (function () {
                var repeat = function (s, times) {
                  if (times < 1) {
                    return "";
                  }
                  if (times % 2) {
                    return repeat(s, times - 1) + s;
                  }
                  var half = repeat(s, times / 2);
                  return half + half;
                };
                return function (times) {
                  var thisStr = String(ES.CheckObjectCoercible(this));
                  times = ES.ToInteger(times);
                  if (times < 0 || times === Infinity) {
                    throw new RangeError("Invalid String#repeat value");
                  }
                  return repeat(thisStr, times);
                };
              })(),
              startsWith: function (searchStr) {
                var thisStr = String(ES.CheckObjectCoercible(this));
                if (_toString.call(searchStr) === "[object RegExp]") {
                  throw new TypeError(
                    'Cannot call method "startsWith" with a regex'
                  );
                }
                searchStr = String(searchStr);
                var startArg = arguments.length > 1 ? arguments[1] : void 0;
                var start = Math.max(ES.ToInteger(startArg), 0);
                return (
                  thisStr.slice(start, start + searchStr.length) === searchStr
                );
              },
              endsWith: function (searchStr) {
                var thisStr = String(ES.CheckObjectCoercible(this));
                if (_toString.call(searchStr) === "[object RegExp]") {
                  throw new TypeError(
                    'Cannot call method "endsWith" with a regex'
                  );
                }
                searchStr = String(searchStr);
                var thisLen = thisStr.length;
                var posArg = arguments.length > 1 ? arguments[1] : void 0;
                var pos =
                  typeof posArg === "undefined"
                    ? thisLen
                    : ES.ToInteger(posArg);
                var end = Math.min(Math.max(pos, 0), thisLen);
                return thisStr.slice(end - searchStr.length, end) === searchStr;
              },
              contains: function (searchString) {
                var position = arguments.length > 1 ? arguments[1] : void 0;
                return _indexOf.call(this, searchString, position) !== -1;
              },
              codePointAt: function (pos) {
                var thisStr = String(ES.CheckObjectCoercible(this));
                var position = ES.ToInteger(pos);
                var length = thisStr.length;
                if (position < 0 || position >= length) {
                  return;
                }
                var first = thisStr.charCodeAt(position);
                var isEnd = position + 1 === length;
                if (first < 55296 || first > 56319 || isEnd) {
                  return first;
                }
                var second = thisStr.charCodeAt(position + 1);
                if (second < 56320 || second > 57343) {
                  return first;
                }
                return (first - 55296) * 1024 + (second - 56320) + 65536;
              },
            };
            defineProperties(String.prototype, StringShims);
            var hasStringTrimBug = "??".trim().length !== 1;
            if (hasStringTrimBug) {
              var originalStringTrim = String.prototype.trim;
              delete String.prototype.trim;
              var ws = ["	\n\f\r ????????????????????", "??????????????????????????????\u2028", "\u2029???"].join(
                ""
              );
              var trimRegexp = new RegExp(
                "(^[" + ws + "]+)|([" + ws + "]+$)",
                "g"
              );
              defineProperties(String.prototype, {
                trim: function () {
                  if (typeof this === "undefined" || this === null) {
                    throw new TypeError("can't convert " + this + " to object");
                  }
                  return String(this).replace(trimRegexp, "");
                },
              });
            }
            var StringIterator = function (s) {
              this._s = String(ES.CheckObjectCoercible(s));
              this._i = 0;
            };
            StringIterator.prototype.next = function () {
              var s = this._s,
                i = this._i;
              if (typeof s === "undefined" || i >= s.length) {
                this._s = void 0;
                return { value: void 0, done: true };
              }
              var first = s.charCodeAt(i),
                second,
                len;
              if (first < 55296 || first > 56319 || i + 1 == s.length) {
                len = 1;
              } else {
                second = s.charCodeAt(i + 1);
                len = second < 56320 || second > 57343 ? 1 : 2;
              }
              this._i = i + len;
              return { value: s.substr(i, len), done: false };
            };
            addIterator(StringIterator.prototype);
            addIterator(String.prototype, function () {
              return new StringIterator(this);
            });
            if (!startsWithIsCompliant) {
              String.prototype.startsWith = StringShims.startsWith;
              String.prototype.endsWith = StringShims.endsWith;
            }
            var ArrayShims = {
              from: function (iterable) {
                var mapFn = arguments.length > 1 ? arguments[1] : void 0;
                var list = ES.ToObject(iterable, "bad iterable");
                if (typeof mapFn !== "undefined" && !ES.IsCallable(mapFn)) {
                  throw new TypeError(
                    "Array.from: when provided, the second argument must be a function"
                  );
                }
                var hasThisArg = arguments.length > 2;
                var thisArg = hasThisArg ? arguments[2] : void 0;
                var usingIterator = ES.IsIterable(list);
                var length;
                var result, i, value;
                if (usingIterator) {
                  i = 0;
                  result = ES.IsCallable(this) ? Object(new this()) : [];
                  var it = usingIterator ? ES.GetIterator(list) : null;
                  var iterationValue;
                  do {
                    iterationValue = ES.IteratorNext(it);
                    if (!iterationValue.done) {
                      value = iterationValue.value;
                      if (mapFn) {
                        result[i] = hasThisArg
                          ? mapFn.call(thisArg, value, i)
                          : mapFn(value, i);
                      } else {
                        result[i] = value;
                      }
                      i += 1;
                    }
                  } while (!iterationValue.done);
                  length = i;
                } else {
                  length = ES.ToLength(list.length);
                  result = ES.IsCallable(this)
                    ? Object(new this(length))
                    : new Array(length);
                  for (i = 0; i < length; ++i) {
                    value = list[i];
                    if (mapFn) {
                      result[i] = hasThisArg
                        ? mapFn.call(thisArg, value, i)
                        : mapFn(value, i);
                    } else {
                      result[i] = value;
                    }
                  }
                }
                result.length = length;
                return result;
              },
              of: function () {
                return Array.from(arguments);
              },
            };
            defineProperties(Array, ArrayShims);
            var arrayFromSwallowsNegativeLengths = function () {
              try {
                return Array.from({ length: -1 }).length === 0;
              } catch (e) {
                return false;
              }
            };
            if (!arrayFromSwallowsNegativeLengths()) {
              defineProperty(Array, "from", ArrayShims.from, true);
            }
            ArrayIterator = function (array, kind) {
              this.i = 0;
              this.array = array;
              this.kind = kind;
            };
            defineProperties(ArrayIterator.prototype, {
              next: function () {
                var i = this.i,
                  array = this.array;
                if (!(this instanceof ArrayIterator)) {
                  throw new TypeError("Not an ArrayIterator");
                }
                if (typeof array !== "undefined") {
                  var len = ES.ToLength(array.length);
                  for (; i < len; i++) {
                    var kind = this.kind;
                    var retval;
                    if (kind === "key") {
                      retval = i;
                    } else if (kind === "value") {
                      retval = array[i];
                    } else if (kind === "entry") {
                      retval = [i, array[i]];
                    }
                    this.i = i + 1;
                    return { value: retval, done: false };
                  }
                }
                this.array = void 0;
                return { value: void 0, done: true };
              },
            });
            addIterator(ArrayIterator.prototype);
            var ArrayPrototypeShims = {
              copyWithin: function (target, start) {
                var end = arguments[2];
                var o = ES.ToObject(this);
                var len = ES.ToLength(o.length);
                target = ES.ToInteger(target);
                start = ES.ToInteger(start);
                var to =
                  target < 0
                    ? Math.max(len + target, 0)
                    : Math.min(target, len);
                var from =
                  start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
                end = typeof end === "undefined" ? len : ES.ToInteger(end);
                var fin = end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
                var count = Math.min(fin - from, len - to);
                var direction = 1;
                if (from < to && to < from + count) {
                  direction = -1;
                  from += count - 1;
                  to += count - 1;
                }
                while (count > 0) {
                  if (_hasOwnProperty.call(o, from)) {
                    o[to] = o[from];
                  } else {
                    delete o[from];
                  }
                  from += direction;
                  to += direction;
                  count -= 1;
                }
                return o;
              },
              fill: function (value) {
                var start = arguments.length > 1 ? arguments[1] : void 0;
                var end = arguments.length > 2 ? arguments[2] : void 0;
                var O = ES.ToObject(this);
                var len = ES.ToLength(O.length);
                start = ES.ToInteger(typeof start === "undefined" ? 0 : start);
                end = ES.ToInteger(typeof end === "undefined" ? len : end);
                var relativeStart =
                  start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
                var relativeEnd = end < 0 ? len + end : end;
                for (var i = relativeStart; i < len && i < relativeEnd; ++i) {
                  O[i] = value;
                }
                return O;
              },
              find: function find(predicate) {
                var list = ES.ToObject(this);
                var length = ES.ToLength(list.length);
                if (!ES.IsCallable(predicate)) {
                  throw new TypeError(
                    "Array#find: predicate must be a function"
                  );
                }
                var thisArg = arguments[1];
                for (var i = 0, value; i < length; i++) {
                  value = list[i];
                  if (predicate.call(thisArg, value, i, list)) {
                    return value;
                  }
                }
                return;
              },
              findIndex: function findIndex(predicate) {
                var list = ES.ToObject(this);
                var length = ES.ToLength(list.length);
                if (!ES.IsCallable(predicate)) {
                  throw new TypeError(
                    "Array#findIndex: predicate must be a function"
                  );
                }
                var thisArg = arguments[1];
                for (var i = 0; i < length; i++) {
                  if (predicate.call(thisArg, list[i], i, list)) {
                    return i;
                  }
                }
                return -1;
              },
              keys: function () {
                return new ArrayIterator(this, "key");
              },
              values: function () {
                return new ArrayIterator(this, "value");
              },
              entries: function () {
                return new ArrayIterator(this, "entry");
              },
            };
            if (Array.prototype.keys && !ES.IsCallable([1].keys().next)) {
              delete Array.prototype.keys;
            }
            if (Array.prototype.entries && !ES.IsCallable([1].entries().next)) {
              delete Array.prototype.entries;
            }
            if (
              Array.prototype.keys &&
              Array.prototype.entries &&
              !Array.prototype.values &&
              Array.prototype[$iterator$]
            ) {
              defineProperties(Array.prototype, {
                values: Array.prototype[$iterator$],
              });
            }
            defineProperties(Array.prototype, ArrayPrototypeShims);
            addIterator(Array.prototype, function () {
              return this.values();
            });
            if (Object.getPrototypeOf) {
              addIterator(Object.getPrototypeOf([].values()));
            }
            var maxSafeInteger = Math.pow(2, 53) - 1;
            defineProperties(Number, {
              MAX_SAFE_INTEGER: maxSafeInteger,
              MIN_SAFE_INTEGER: -maxSafeInteger,
              EPSILON: 2.220446049250313e-16,
              parseInt: globals.parseInt,
              parseFloat: globals.parseFloat,
              isFinite: function (value) {
                return typeof value === "number" && global_isFinite(value);
              },
              isInteger: function (value) {
                return Number.isFinite(value) && ES.ToInteger(value) === value;
              },
              isSafeInteger: function (value) {
                return (
                  Number.isInteger(value) &&
                  Math.abs(value) <= Number.MAX_SAFE_INTEGER
                );
              },
              isNaN: function (value) {
                return value !== value;
              },
            });
            if (
              ![, 1].find(function (item, idx) {
                return idx === 0;
              })
            ) {
              defineProperty(
                Array.prototype,
                "find",
                ArrayPrototypeShims.find,
                true
              );
            }
            if (
              [, 1].findIndex(function (item, idx) {
                return idx === 0;
              }) !== 0
            ) {
              defineProperty(
                Array.prototype,
                "findIndex",
                ArrayPrototypeShims.findIndex,
                true
              );
            }
            if (supportsDescriptors) {
              defineProperties(Object, {
                getPropertyDescriptor: function (subject, name) {
                  var pd = Object.getOwnPropertyDescriptor(subject, name);
                  var proto = Object.getPrototypeOf(subject);
                  while (typeof pd === "undefined" && proto !== null) {
                    pd = Object.getOwnPropertyDescriptor(proto, name);
                    proto = Object.getPrototypeOf(proto);
                  }
                  return pd;
                },
                getPropertyNames: function (subject) {
                  var result = Object.getOwnPropertyNames(subject);
                  var proto = Object.getPrototypeOf(subject);
                  var addProperty = function (property) {
                    if (result.indexOf(property) === -1) {
                      result.push(property);
                    }
                  };
                  while (proto !== null) {
                    Object.getOwnPropertyNames(proto).forEach(addProperty);
                    proto = Object.getPrototypeOf(proto);
                  }
                  return result;
                },
              });
              defineProperties(Object, {
                assign: function (target, source) {
                  if (!ES.TypeIsObject(target)) {
                    throw new TypeError("target must be an object");
                  }
                  return Array.prototype.reduce.call(
                    arguments,
                    function (target, source) {
                      return Object.keys(Object(source)).reduce(function (
                        target,
                        key
                      ) {
                        target[key] = source[key];
                        return target;
                      },
                      target);
                    }
                  );
                },
                is: function (a, b) {
                  return ES.SameValue(a, b);
                },
                setPrototypeOf: (function (Object, magic) {
                  var set;
                  var checkArgs = function (O, proto) {
                    if (!ES.TypeIsObject(O)) {
                      throw new TypeError(
                        "cannot set prototype on a non-object"
                      );
                    }
                    if (!(proto === null || ES.TypeIsObject(proto))) {
                      throw new TypeError(
                        "can only set prototype to an object or null" + proto
                      );
                    }
                  };
                  var setPrototypeOf = function (O, proto) {
                    checkArgs(O, proto);
                    set.call(O, proto);
                    return O;
                  };
                  try {
                    set = Object.getOwnPropertyDescriptor(
                      Object.prototype,
                      magic
                    ).set;
                    set.call({}, null);
                  } catch (e) {
                    if (Object.prototype !== {}[magic]) {
                      return;
                    }
                    set = function (proto) {
                      this[magic] = proto;
                    };
                    setPrototypeOf.polyfill =
                      setPrototypeOf(
                        setPrototypeOf({}, null),
                        Object.prototype
                      ) instanceof Object;
                  }
                  return setPrototypeOf;
                })(Object, "__proto__"),
              });
            }
            if (
              Object.setPrototypeOf &&
              Object.getPrototypeOf &&
              Object.getPrototypeOf(Object.setPrototypeOf({}, null)) !== null &&
              Object.getPrototypeOf(Object.create(null)) === null
            ) {
              (function () {
                var FAKENULL = Object.create(null);
                var gpo = Object.getPrototypeOf,
                  spo = Object.setPrototypeOf;
                Object.getPrototypeOf = function (o) {
                  var result = gpo(o);
                  return result === FAKENULL ? null : result;
                };
                Object.setPrototypeOf = function (o, p) {
                  if (p === null) {
                    p = FAKENULL;
                  }
                  return spo(o, p);
                };
                Object.setPrototypeOf.polyfill = false;
              })();
            }
            try {
              Object.keys("foo");
            } catch (e) {
              var originalObjectKeys = Object.keys;
              Object.keys = function (obj) {
                return originalObjectKeys(ES.ToObject(obj));
              };
            }
            var MathShims = {
              acosh: function (value) {
                value = Number(value);
                if (Number.isNaN(value) || value < 1) {
                  return NaN;
                }
                if (value === 1) {
                  return 0;
                }
                if (value === Infinity) {
                  return value;
                }
                return Math.log(value + Math.sqrt(value * value - 1));
              },
              asinh: function (value) {
                value = Number(value);
                if (value === 0 || !global_isFinite(value)) {
                  return value;
                }
                return value < 0
                  ? -Math.asinh(-value)
                  : Math.log(value + Math.sqrt(value * value + 1));
              },
              atanh: function (value) {
                value = Number(value);
                if (Number.isNaN(value) || value < -1 || value > 1) {
                  return NaN;
                }
                if (value === -1) {
                  return -Infinity;
                }
                if (value === 1) {
                  return Infinity;
                }
                if (value === 0) {
                  return value;
                }
                return 0.5 * Math.log((1 + value) / (1 - value));
              },
              cbrt: function (value) {
                value = Number(value);
                if (value === 0) {
                  return value;
                }
                var negate = value < 0,
                  result;
                if (negate) {
                  value = -value;
                }
                result = Math.pow(value, 1 / 3);
                return negate ? -result : result;
              },
              clz32: function (value) {
                value = Number(value);
                var number = ES.ToUint32(value);
                if (number === 0) {
                  return 32;
                }
                return 32 - number.toString(2).length;
              },
              cosh: function (value) {
                value = Number(value);
                if (value === 0) {
                  return 1;
                }
                if (Number.isNaN(value)) {
                  return NaN;
                }
                if (!global_isFinite(value)) {
                  return Infinity;
                }
                if (value < 0) {
                  value = -value;
                }
                if (value > 21) {
                  return Math.exp(value) / 2;
                }
                return (Math.exp(value) + Math.exp(-value)) / 2;
              },
              expm1: function (value) {
                value = Number(value);
                if (value === -Infinity) {
                  return -1;
                }
                if (!global_isFinite(value) || value === 0) {
                  return value;
                }
                return Math.exp(value) - 1;
              },
              hypot: function (x, y) {
                var anyNaN = false;
                var allZero = true;
                var anyInfinity = false;
                var numbers = [];
                Array.prototype.every.call(arguments, function (arg) {
                  var num = Number(arg);
                  if (Number.isNaN(num)) {
                    anyNaN = true;
                  } else if (num === Infinity || num === -Infinity) {
                    anyInfinity = true;
                  } else if (num !== 0) {
                    allZero = false;
                  }
                  if (anyInfinity) {
                    return false;
                  } else if (!anyNaN) {
                    numbers.push(Math.abs(num));
                  }
                  return true;
                });
                if (anyInfinity) {
                  return Infinity;
                }
                if (anyNaN) {
                  return NaN;
                }
                if (allZero) {
                  return 0;
                }
                numbers.sort(function (a, b) {
                  return b - a;
                });
                var largest = numbers[0];
                var divided = numbers.map(function (number) {
                  return number / largest;
                });
                var sum = divided.reduce(function (sum, number) {
                  return (sum += number * number);
                }, 0);
                return largest * Math.sqrt(sum);
              },
              log2: function (value) {
                return Math.log(value) * Math.LOG2E;
              },
              log10: function (value) {
                return Math.log(value) * Math.LOG10E;
              },
              log1p: function (value) {
                value = Number(value);
                if (value < -1 || Number.isNaN(value)) {
                  return NaN;
                }
                if (value === 0 || value === Infinity) {
                  return value;
                }
                if (value === -1) {
                  return -Infinity;
                }
                var result = 0;
                var n = 50;
                if (value < 0 || value > 1) {
                  return Math.log(1 + value);
                }
                for (var i = 1; i < n; i++) {
                  if (i % 2 === 0) {
                    result -= Math.pow(value, i) / i;
                  } else {
                    result += Math.pow(value, i) / i;
                  }
                }
                return result;
              },
              sign: function (value) {
                var number = +value;
                if (number === 0) {
                  return number;
                }
                if (Number.isNaN(number)) {
                  return number;
                }
                return number < 0 ? -1 : 1;
              },
              sinh: function (value) {
                value = Number(value);
                if (!global_isFinite(value) || value === 0) {
                  return value;
                }
                return (Math.exp(value) - Math.exp(-value)) / 2;
              },
              tanh: function (value) {
                value = Number(value);
                if (Number.isNaN(value) || value === 0) {
                  return value;
                }
                if (value === Infinity) {
                  return 1;
                }
                if (value === -Infinity) {
                  return -1;
                }
                return (
                  (Math.exp(value) - Math.exp(-value)) /
                  (Math.exp(value) + Math.exp(-value))
                );
              },
              trunc: function (value) {
                var number = Number(value);
                return number < 0 ? -Math.floor(-number) : Math.floor(number);
              },
              imul: function (x, y) {
                x = ES.ToUint32(x);
                y = ES.ToUint32(y);
                var ah = (x >>> 16) & 65535;
                var al = x & 65535;
                var bh = (y >>> 16) & 65535;
                var bl = y & 65535;
                return (al * bl + (((ah * bl + al * bh) << 16) >>> 0)) | 0;
              },
              fround: function (x) {
                if (
                  x === 0 ||
                  x === Infinity ||
                  x === -Infinity ||
                  Number.isNaN(x)
                ) {
                  return x;
                }
                var num = Number(x);
                return numberConversion.toFloat32(num);
              },
            };
            defineProperties(Math, MathShims);
            if (Math.imul(4294967295, 5) !== -5) {
              Math.imul = MathShims.imul;
            }
            var PromiseShim = (function () {
              var Promise, Promise$prototype;
              ES.IsPromise = function (promise) {
                if (!ES.TypeIsObject(promise)) {
                  return false;
                }
                if (!promise._promiseConstructor) {
                  return false;
                }
                if (typeof promise._status === "undefined") {
                  return false;
                }
                return true;
              };
              var PromiseCapability = function (C) {
                if (!ES.IsCallable(C)) {
                  throw new TypeError("bad promise constructor");
                }
                var capability = this;
                var resolver = function (resolve, reject) {
                  capability.resolve = resolve;
                  capability.reject = reject;
                };
                capability.promise = ES.Construct(C, [resolver]);
                if (!capability.promise._es6construct) {
                  throw new TypeError("bad promise constructor");
                }
                if (
                  !(
                    ES.IsCallable(capability.resolve) &&
                    ES.IsCallable(capability.reject)
                  )
                ) {
                  throw new TypeError("bad promise constructor");
                }
              };
              var setTimeout = globals.setTimeout;
              var makeZeroTimeout;
              if (
                typeof window !== "undefined" &&
                ES.IsCallable(window.postMessage)
              ) {
                makeZeroTimeout = function () {
                  var timeouts = [];
                  var messageName = "zero-timeout-message";
                  var setZeroTimeout = function (fn) {
                    timeouts.push(fn);
                    window.postMessage(messageName, "*");
                  };
                  var handleMessage = function (event) {
                    if (event.source == window && event.data == messageName) {
                      event.stopPropagation();
                      if (timeouts.length === 0) {
                        return;
                      }
                      var fn = timeouts.shift();
                      fn();
                    }
                  };
                  window.addEventListener("message", handleMessage, true);
                  return setZeroTimeout;
                };
              }
              var makePromiseAsap = function () {
                var P = globals.Promise;
                return (
                  P &&
                  P.resolve &&
                  function (task) {
                    return P.resolve().then(task);
                  }
                );
              };
              var enqueue = ES.IsCallable(globals.setImmediate)
                ? globals.setImmediate.bind(globals)
                : typeof process === "object" && process.nextTick
                ? process.nextTick
                : makePromiseAsap() ||
                  (ES.IsCallable(makeZeroTimeout)
                    ? makeZeroTimeout()
                    : function (task) {
                        setTimeout(task, 0);
                      });
              var triggerPromiseReactions = function (reactions, x) {
                reactions.forEach(function (reaction) {
                  enqueue(function () {
                    var handler = reaction.handler;
                    var capability = reaction.capability;
                    var resolve = capability.resolve;
                    var reject = capability.reject;
                    try {
                      var result = handler(x);
                      if (result === capability.promise) {
                        throw new TypeError("self resolution");
                      }
                      var updateResult = updatePromiseFromPotentialThenable(
                        result,
                        capability
                      );
                      if (!updateResult) {
                        resolve(result);
                      }
                    } catch (e) {
                      reject(e);
                    }
                  });
                });
              };
              var updatePromiseFromPotentialThenable = function (
                x,
                capability
              ) {
                if (!ES.TypeIsObject(x)) {
                  return false;
                }
                var resolve = capability.resolve;
                var reject = capability.reject;
                try {
                  var then = x.then;
                  if (!ES.IsCallable(then)) {
                    return false;
                  }
                  then.call(x, resolve, reject);
                } catch (e) {
                  reject(e);
                }
                return true;
              };
              var promiseResolutionHandler = function (
                promise,
                onFulfilled,
                onRejected
              ) {
                return function (x) {
                  if (x === promise) {
                    return onRejected(new TypeError("self resolution"));
                  }
                  var C = promise._promiseConstructor;
                  var capability = new PromiseCapability(C);
                  var updateResult = updatePromiseFromPotentialThenable(
                    x,
                    capability
                  );
                  if (updateResult) {
                    return capability.promise.then(onFulfilled, onRejected);
                  } else {
                    return onFulfilled(x);
                  }
                };
              };
              Promise = function (resolver) {
                var promise = this;
                promise = emulateES6construct(promise);
                if (!promise._promiseConstructor) {
                  throw new TypeError("bad promise");
                }
                if (typeof promise._status !== "undefined") {
                  throw new TypeError("promise already initialized");
                }
                if (!ES.IsCallable(resolver)) {
                  throw new TypeError("not a valid resolver");
                }
                promise._status = "unresolved";
                promise._resolveReactions = [];
                promise._rejectReactions = [];
                var resolve = function (resolution) {
                  if (promise._status !== "unresolved") {
                    return;
                  }
                  var reactions = promise._resolveReactions;
                  promise._result = resolution;
                  promise._resolveReactions = void 0;
                  promise._rejectReactions = void 0;
                  promise._status = "has-resolution";
                  triggerPromiseReactions(reactions, resolution);
                };
                var reject = function (reason) {
                  if (promise._status !== "unresolved") {
                    return;
                  }
                  var reactions = promise._rejectReactions;
                  promise._result = reason;
                  promise._resolveReactions = void 0;
                  promise._rejectReactions = void 0;
                  promise._status = "has-rejection";
                  triggerPromiseReactions(reactions, reason);
                };
                try {
                  resolver(resolve, reject);
                } catch (e) {
                  reject(e);
                }
                return promise;
              };
              Promise$prototype = Promise.prototype;
              defineProperties(Promise, {
                "@@create": function (obj) {
                  var constructor = this;
                  var prototype = constructor.prototype || Promise$prototype;
                  obj = obj || create(prototype);
                  defineProperties(obj, {
                    _status: void 0,
                    _result: void 0,
                    _resolveReactions: void 0,
                    _rejectReactions: void 0,
                    _promiseConstructor: void 0,
                  });
                  obj._promiseConstructor = constructor;
                  return obj;
                },
              });
              var _promiseAllResolver = function (
                index,
                values,
                capability,
                remaining
              ) {
                var done = false;
                return function (x) {
                  if (done) {
                    return;
                  }
                  done = true;
                  values[index] = x;
                  if (--remaining.count === 0) {
                    var resolve = capability.resolve;
                    resolve(values);
                  }
                };
              };
              Promise.all = function (iterable) {
                var C = this;
                var capability = new PromiseCapability(C);
                var resolve = capability.resolve;
                var reject = capability.reject;
                try {
                  if (!ES.IsIterable(iterable)) {
                    throw new TypeError("bad iterable");
                  }
                  var it = ES.GetIterator(iterable);
                  var values = [],
                    remaining = { count: 1 };
                  for (var index = 0; ; index++) {
                    var next = ES.IteratorNext(it);
                    if (next.done) {
                      break;
                    }
                    var nextPromise = C.resolve(next.value);
                    var resolveElement = _promiseAllResolver(
                      index,
                      values,
                      capability,
                      remaining
                    );
                    remaining.count++;
                    nextPromise.then(resolveElement, capability.reject);
                  }
                  if (--remaining.count === 0) {
                    resolve(values);
                  }
                } catch (e) {
                  reject(e);
                }
                return capability.promise;
              };
              Promise.race = function (iterable) {
                var C = this;
                var capability = new PromiseCapability(C);
                var resolve = capability.resolve;
                var reject = capability.reject;
                try {
                  if (!ES.IsIterable(iterable)) {
                    throw new TypeError("bad iterable");
                  }
                  var it = ES.GetIterator(iterable);
                  while (true) {
                    var next = ES.IteratorNext(it);
                    if (next.done) {
                      break;
                    }
                    var nextPromise = C.resolve(next.value);
                    nextPromise.then(resolve, reject);
                  }
                } catch (e) {
                  reject(e);
                }
                return capability.promise;
              };
              Promise.reject = function (reason) {
                var C = this;
                var capability = new PromiseCapability(C);
                var reject = capability.reject;
                reject(reason);
                return capability.promise;
              };
              Promise.resolve = function (v) {
                var C = this;
                if (ES.IsPromise(v)) {
                  var constructor = v._promiseConstructor;
                  if (constructor === C) {
                    return v;
                  }
                }
                var capability = new PromiseCapability(C);
                var resolve = capability.resolve;
                resolve(v);
                return capability.promise;
              };
              Promise.prototype["catch"] = function (onRejected) {
                return this.then(void 0, onRejected);
              };
              Promise.prototype.then = function (onFulfilled, onRejected) {
                var promise = this;
                if (!ES.IsPromise(promise)) {
                  throw new TypeError("not a promise");
                }
                var C = this.constructor;
                var capability = new PromiseCapability(C);
                if (!ES.IsCallable(onRejected)) {
                  onRejected = function (e) {
                    throw e;
                  };
                }
                if (!ES.IsCallable(onFulfilled)) {
                  onFulfilled = function (x) {
                    return x;
                  };
                }
                var resolutionHandler = promiseResolutionHandler(
                  promise,
                  onFulfilled,
                  onRejected
                );
                var resolveReaction = {
                  capability: capability,
                  handler: resolutionHandler,
                };
                var rejectReaction = {
                  capability: capability,
                  handler: onRejected,
                };
                switch (promise._status) {
                  case "unresolved":
                    promise._resolveReactions.push(resolveReaction);
                    promise._rejectReactions.push(rejectReaction);
                    break;
                  case "has-resolution":
                    triggerPromiseReactions([resolveReaction], promise._result);
                    break;
                  case "has-rejection":
                    triggerPromiseReactions([rejectReaction], promise._result);
                    break;
                  default:
                    throw new TypeError("unexpected");
                }
                return capability.promise;
              };
              return Promise;
            })();
            defineProperties(globals, { Promise: PromiseShim });
            var promiseSupportsSubclassing = supportsSubclassing(
              globals.Promise,
              function (S) {
                return S.resolve(42) instanceof S;
              }
            );
            var promiseIgnoresNonFunctionThenCallbacks = (function () {
              try {
                globals.Promise.reject(42)
                  .then(null, 5)
                  .then(null, function () {});
                return true;
              } catch (ex) {
                return false;
              }
            })();
            var promiseRequiresObjectContext = (function () {
              try {
                Promise.call(3, function () {});
              } catch (e) {
                return true;
              }
              return false;
            })();
            if (
              !promiseSupportsSubclassing ||
              !promiseIgnoresNonFunctionThenCallbacks ||
              !promiseRequiresObjectContext
            ) {
              globals.Promise = PromiseShim;
            }
            var testOrder = function (a) {
              var b = Object.keys(
                a.reduce(function (o, k) {
                  o[k] = true;
                  return o;
                }, {})
              );
              return a.join(":") === b.join(":");
            };
            var preservesInsertionOrder = testOrder(["z", "a", "bb"]);
            var preservesNumericInsertionOrder = testOrder([
              "z",
              1,
              "a",
              "3",
              2,
            ]);
            if (supportsDescriptors) {
              var fastkey = function fastkey(key) {
                if (!preservesInsertionOrder) {
                  return null;
                }
                var type = typeof key;
                if (type === "string") {
                  return "$" + key;
                } else if (type === "number") {
                  if (!preservesNumericInsertionOrder) {
                    return "n" + key;
                  }
                  return key;
                }
                return null;
              };
              var emptyObject = function emptyObject() {
                return Object.create ? Object.create(null) : {};
              };
              var collectionShims = {
                Map: (function () {
                  var empty = {};
                  function MapEntry(key, value) {
                    this.key = key;
                    this.value = value;
                    this.next = null;
                    this.prev = null;
                  }
                  MapEntry.prototype.isRemoved = function () {
                    return this.key === empty;
                  };
                  function MapIterator(map, kind) {
                    this.head = map._head;
                    this.i = this.head;
                    this.kind = kind;
                  }
                  MapIterator.prototype = {
                    next: function () {
                      var i = this.i,
                        kind = this.kind,
                        head = this.head,
                        result;
                      if (typeof this.i === "undefined") {
                        return { value: void 0, done: true };
                      }
                      while (i.isRemoved() && i !== head) {
                        i = i.prev;
                      }
                      while (i.next !== head) {
                        i = i.next;
                        if (!i.isRemoved()) {
                          if (kind === "key") {
                            result = i.key;
                          } else if (kind === "value") {
                            result = i.value;
                          } else {
                            result = [i.key, i.value];
                          }
                          this.i = i;
                          return { value: result, done: false };
                        }
                      }
                      this.i = void 0;
                      return { value: void 0, done: true };
                    },
                  };
                  addIterator(MapIterator.prototype);
                  function Map(iterable) {
                    var map = this;
                    if (!ES.TypeIsObject(map)) {
                      throw new TypeError(
                        "Map does not accept arguments when called as a function"
                      );
                    }
                    map = emulateES6construct(map);
                    if (!map._es6map) {
                      throw new TypeError("bad map");
                    }
                    var head = new MapEntry(null, null);
                    head.next = head.prev = head;
                    defineProperties(map, {
                      _head: head,
                      _storage: emptyObject(),
                      _size: 0,
                    });
                    if (typeof iterable !== "undefined" && iterable !== null) {
                      var it = ES.GetIterator(iterable);
                      var adder = map.set;
                      if (!ES.IsCallable(adder)) {
                        throw new TypeError("bad map");
                      }
                      while (true) {
                        var next = ES.IteratorNext(it);
                        if (next.done) {
                          break;
                        }
                        var nextItem = next.value;
                        if (!ES.TypeIsObject(nextItem)) {
                          throw new TypeError("expected iterable of pairs");
                        }
                        adder.call(map, nextItem[0], nextItem[1]);
                      }
                    }
                    return map;
                  }
                  var Map$prototype = Map.prototype;
                  defineProperties(Map, {
                    "@@create": function (obj) {
                      var constructor = this;
                      var prototype = constructor.prototype || Map$prototype;
                      obj = obj || create(prototype);
                      defineProperties(obj, { _es6map: true });
                      return obj;
                    },
                  });
                  Object.defineProperty(Map.prototype, "size", {
                    configurable: true,
                    enumerable: false,
                    get: function () {
                      if (typeof this._size === "undefined") {
                        throw new TypeError(
                          "size method called on incompatible Map"
                        );
                      }
                      return this._size;
                    },
                  });
                  defineProperties(Map.prototype, {
                    get: function (key) {
                      var fkey = fastkey(key);
                      if (fkey !== null) {
                        var entry = this._storage[fkey];
                        if (entry) {
                          return entry.value;
                        } else {
                          return;
                        }
                      }
                      var head = this._head,
                        i = head;
                      while ((i = i.next) !== head) {
                        if (ES.SameValueZero(i.key, key)) {
                          return i.value;
                        }
                      }
                      return;
                    },
                    has: function (key) {
                      var fkey = fastkey(key);
                      if (fkey !== null) {
                        return typeof this._storage[fkey] !== "undefined";
                      }
                      var head = this._head,
                        i = head;
                      while ((i = i.next) !== head) {
                        if (ES.SameValueZero(i.key, key)) {
                          return true;
                        }
                      }
                      return false;
                    },
                    set: function (key, value) {
                      var head = this._head,
                        i = head,
                        entry;
                      var fkey = fastkey(key);
                      if (fkey !== null) {
                        if (typeof this._storage[fkey] !== "undefined") {
                          this._storage[fkey].value = value;
                          return this;
                        } else {
                          entry = this._storage[fkey] = new MapEntry(
                            key,
                            value
                          );
                          i = head.prev;
                        }
                      }
                      while ((i = i.next) !== head) {
                        if (ES.SameValueZero(i.key, key)) {
                          i.value = value;
                          return this;
                        }
                      }
                      entry = entry || new MapEntry(key, value);
                      if (ES.SameValue(-0, key)) {
                        entry.key = +0;
                      }
                      entry.next = this._head;
                      entry.prev = this._head.prev;
                      entry.prev.next = entry;
                      entry.next.prev = entry;
                      this._size += 1;
                      return this;
                    },
                    delete: function (key) {
                      var head = this._head,
                        i = head;
                      var fkey = fastkey(key);
                      if (fkey !== null) {
                        if (typeof this._storage[fkey] === "undefined") {
                          return false;
                        }
                        i = this._storage[fkey].prev;
                        delete this._storage[fkey];
                      }
                      while ((i = i.next) !== head) {
                        if (ES.SameValueZero(i.key, key)) {
                          i.key = i.value = empty;
                          i.prev.next = i.next;
                          i.next.prev = i.prev;
                          this._size -= 1;
                          return true;
                        }
                      }
                      return false;
                    },
                    clear: function () {
                      this._size = 0;
                      this._storage = emptyObject();
                      var head = this._head,
                        i = head,
                        p = i.next;
                      while ((i = p) !== head) {
                        i.key = i.value = empty;
                        p = i.next;
                        i.next = i.prev = head;
                      }
                      head.next = head.prev = head;
                    },
                    keys: function () {
                      return new MapIterator(this, "key");
                    },
                    values: function () {
                      return new MapIterator(this, "value");
                    },
                    entries: function () {
                      return new MapIterator(this, "key+value");
                    },
                    forEach: function (callback) {
                      var context = arguments.length > 1 ? arguments[1] : null;
                      var it = this.entries();
                      for (
                        var entry = it.next();
                        !entry.done;
                        entry = it.next()
                      ) {
                        callback.call(
                          context,
                          entry.value[1],
                          entry.value[0],
                          this
                        );
                      }
                    },
                  });
                  addIterator(Map.prototype, function () {
                    return this.entries();
                  });
                  return Map;
                })(),
                Set: (function () {
                  var SetShim = function Set(iterable) {
                    var set = this;
                    if (!ES.TypeIsObject(set)) {
                      throw new TypeError(
                        "Set does not accept arguments when called as a function"
                      );
                    }
                    set = emulateES6construct(set);
                    if (!set._es6set) {
                      throw new TypeError("bad set");
                    }
                    defineProperties(set, {
                      "[[SetData]]": null,
                      _storage: emptyObject(),
                    });
                    if (typeof iterable !== "undefined" && iterable !== null) {
                      var it = ES.GetIterator(iterable);
                      var adder = set.add;
                      if (!ES.IsCallable(adder)) {
                        throw new TypeError("bad set");
                      }
                      while (true) {
                        var next = ES.IteratorNext(it);
                        if (next.done) {
                          break;
                        }
                        var nextItem = next.value;
                        adder.call(set, nextItem);
                      }
                    }
                    return set;
                  };
                  var Set$prototype = SetShim.prototype;
                  defineProperties(SetShim, {
                    "@@create": function (obj) {
                      var constructor = this;
                      var prototype = constructor.prototype || Set$prototype;
                      obj = obj || create(prototype);
                      defineProperties(obj, { _es6set: true });
                      return obj;
                    },
                  });
                  var ensureMap = function ensureMap(set) {
                    if (!set["[[SetData]]"]) {
                      var m = (set["[[SetData]]"] = new collectionShims.Map());
                      Object.keys(set._storage).forEach(function (k) {
                        if (k.charCodeAt(0) === 36) {
                          k = k.slice(1);
                        } else if (k.charAt(0) === "n") {
                          k = +k.slice(1);
                        } else {
                          k = +k;
                        }
                        m.set(k, k);
                      });
                      set._storage = null;
                    }
                  };
                  Object.defineProperty(SetShim.prototype, "size", {
                    configurable: true,
                    enumerable: false,
                    get: function () {
                      if (typeof this._storage === "undefined") {
                        throw new TypeError(
                          "size method called on incompatible Set"
                        );
                      }
                      ensureMap(this);
                      return this["[[SetData]]"].size;
                    },
                  });
                  defineProperties(SetShim.prototype, {
                    has: function (key) {
                      var fkey;
                      if (this._storage && (fkey = fastkey(key)) !== null) {
                        return !!this._storage[fkey];
                      }
                      ensureMap(this);
                      return this["[[SetData]]"].has(key);
                    },
                    add: function (key) {
                      var fkey;
                      if (this._storage && (fkey = fastkey(key)) !== null) {
                        this._storage[fkey] = true;
                        return this;
                      }
                      ensureMap(this);
                      this["[[SetData]]"].set(key, key);
                      return this;
                    },
                    delete: function (key) {
                      var fkey;
                      if (this._storage && (fkey = fastkey(key)) !== null) {
                        var hasFKey = _hasOwnProperty.call(this._storage, fkey);
                        return delete this._storage[fkey] && hasFKey;
                      }
                      ensureMap(this);
                      return this["[[SetData]]"]["delete"](key);
                    },
                    clear: function () {
                      if (this._storage) {
                        this._storage = emptyObject();
                        return;
                      }
                      return this["[[SetData]]"].clear();
                    },
                    keys: function () {
                      ensureMap(this);
                      return this["[[SetData]]"].keys();
                    },
                    values: function () {
                      ensureMap(this);
                      return this["[[SetData]]"].values();
                    },
                    entries: function () {
                      ensureMap(this);
                      return this["[[SetData]]"].entries();
                    },
                    forEach: function (callback) {
                      var context = arguments.length > 1 ? arguments[1] : null;
                      var entireSet = this;
                      ensureMap(this);
                      this["[[SetData]]"].forEach(function (value, key) {
                        callback.call(context, key, key, entireSet);
                      });
                    },
                  });
                  addIterator(SetShim.prototype, function () {
                    return this.values();
                  });
                  return SetShim;
                })(),
              };
              defineProperties(globals, collectionShims);
              if (globals.Map || globals.Set) {
                if (
                  typeof globals.Map.prototype.clear !== "function" ||
                  new globals.Set().size !== 0 ||
                  new globals.Map().size !== 0 ||
                  typeof globals.Map.prototype.keys !== "function" ||
                  typeof globals.Set.prototype.keys !== "function" ||
                  typeof globals.Map.prototype.forEach !== "function" ||
                  typeof globals.Set.prototype.forEach !== "function" ||
                  isCallableWithoutNew(globals.Map) ||
                  isCallableWithoutNew(globals.Set) ||
                  !supportsSubclassing(globals.Map, function (M) {
                    var m = new M([]);
                    m.set(42, 42);
                    return m instanceof M;
                  })
                ) {
                  globals.Map = collectionShims.Map;
                  globals.Set = collectionShims.Set;
                }
              }
              addIterator(Object.getPrototypeOf(new globals.Map().keys()));
              addIterator(Object.getPrototypeOf(new globals.Set().keys()));
            }
            return globals;
          });
        }.call(this, require("_process")));
      },
      { _process: 3 },
    ],
    5: [
      function (require, module, exports) {
        "use strict";
        if (!require("./is-implemented")()) {
          Object.defineProperty(require("es5-ext/global"), "Symbol", {
            value: require("./polyfill"),
            configurable: true,
            enumerable: false,
            writable: true,
          });
        }
      },
      { "./is-implemented": 6, "./polyfill": 21, "es5-ext/global": 8 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";
        module.exports = function () {
          var symbol;
          if (typeof Symbol !== "function") return false;
          symbol = Symbol("test symbol");
          try {
            String(symbol);
          } catch (e) {
            return false;
          }
          if (typeof Symbol.iterator === "symbol") return true;
          if (typeof Symbol.isConcatSpreadable !== "object") return false;
          if (typeof Symbol.isRegExp !== "object") return false;
          if (typeof Symbol.iterator !== "object") return false;
          if (typeof Symbol.toPrimitive !== "object") return false;
          if (typeof Symbol.toStringTag !== "object") return false;
          if (typeof Symbol.unscopables !== "object") return false;
          return true;
        };
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        "use strict";
        var assign = require("es5-ext/object/assign"),
          normalizeOpts = require("es5-ext/object/normalize-options"),
          isCallable = require("es5-ext/object/is-callable"),
          contains = require("es5-ext/string/#/contains"),
          d;
        d = module.exports = function (dscr, value) {
          var c, e, w, options, desc;
          if (arguments.length < 2 || typeof dscr !== "string") {
            options = value;
            value = dscr;
            dscr = null;
          } else {
            options = arguments[2];
          }
          if (dscr == null) {
            c = w = true;
            e = false;
          } else {
            c = contains.call(dscr, "c");
            e = contains.call(dscr, "e");
            w = contains.call(dscr, "w");
          }
          desc = { value: value, configurable: c, enumerable: e, writable: w };
          return !options ? desc : assign(normalizeOpts(options), desc);
        };
        d.gs = function (dscr, get, set) {
          var c, e, options, desc;
          if (typeof dscr !== "string") {
            options = set;
            set = get;
            get = dscr;
            dscr = null;
          } else {
            options = arguments[3];
          }
          if (get == null) {
            get = undefined;
          } else if (!isCallable(get)) {
            options = get;
            get = set = undefined;
          } else if (set == null) {
            set = undefined;
          } else if (!isCallable(set)) {
            options = set;
            set = undefined;
          }
          if (dscr == null) {
            c = true;
            e = false;
          } else {
            c = contains.call(dscr, "c");
            e = contains.call(dscr, "e");
          }
          desc = { get: get, set: set, configurable: c, enumerable: e };
          return !options ? desc : assign(normalizeOpts(options), desc);
        };
      },
      {
        "es5-ext/object/assign": 9,
        "es5-ext/object/is-callable": 12,
        "es5-ext/object/normalize-options": 16,
        "es5-ext/string/#/contains": 18,
      },
    ],
    8: [
      function (require, module, exports) {
        "use strict";
        module.exports = new Function("return this")();
      },
      {},
    ],
    9: [
      function (require, module, exports) {
        "use strict";
        module.exports = require("./is-implemented")()
          ? Object.assign
          : require("./shim");
      },
      { "./is-implemented": 10, "./shim": 11 },
    ],
    10: [
      function (require, module, exports) {
        "use strict";
        module.exports = function () {
          var assign = Object.assign,
            obj;
          if (typeof assign !== "function") return false;
          obj = { foo: "raz" };
          assign(obj, { bar: "dwa" }, { trzy: "trzy" });
          return obj.foo + obj.bar + obj.trzy === "razdwatrzy";
        };
      },
      {},
    ],
    11: [
      function (require, module, exports) {
        "use strict";
        var keys = require("../keys"),
          value = require("../valid-value"),
          max = Math.max;
        module.exports = function (dest, src) {
          var error,
            i,
            l = max(arguments.length, 2),
            assign;
          dest = Object(value(dest));
          assign = function (key) {
            try {
              dest[key] = src[key];
            } catch (e) {
              if (!error) error = e;
            }
          };
          for (i = 1; i < l; ++i) {
            src = arguments[i];
            keys(src).forEach(assign);
          }
          if (error !== undefined) throw error;
          return dest;
        };
      },
      { "../keys": 13, "../valid-value": 17 },
    ],
    12: [
      function (require, module, exports) {
        "use strict";
        module.exports = function (obj) {
          return typeof obj === "function";
        };
      },
      {},
    ],
    13: [
      function (require, module, exports) {
        "use strict";
        module.exports = require("./is-implemented")()
          ? Object.keys
          : require("./shim");
      },
      { "./is-implemented": 14, "./shim": 15 },
    ],
    14: [
      function (require, module, exports) {
        "use strict";
        module.exports = function () {
          try {
            Object.keys("primitive");
            return true;
          } catch (e) {
            return false;
          }
        };
      },
      {},
    ],
    15: [
      function (require, module, exports) {
        "use strict";
        var keys = Object.keys;
        module.exports = function (object) {
          return keys(object == null ? object : Object(object));
        };
      },
      {},
    ],
    16: [
      function (require, module, exports) {
        "use strict";
        var assign = require("./assign"),
          forEach = Array.prototype.forEach,
          create = Object.create,
          getPrototypeOf = Object.getPrototypeOf,
          process;
        process = function (src, obj) {
          var proto = getPrototypeOf(src);
          return assign(proto ? process(proto, obj) : obj, src);
        };
        module.exports = function (options) {
          var result = create(null);
          forEach.call(arguments, function (options) {
            if (options == null) return;
            process(Object(options), result);
          });
          return result;
        };
      },
      { "./assign": 9 },
    ],
    17: [
      function (require, module, exports) {
        "use strict";
        module.exports = function (value) {
          if (value == null)
            throw new TypeError("Cannot use null or undefined");
          return value;
        };
      },
      {},
    ],
    18: [
      function (require, module, exports) {
        "use strict";
        module.exports = require("./is-implemented")()
          ? String.prototype.contains
          : require("./shim");
      },
      { "./is-implemented": 19, "./shim": 20 },
    ],
    19: [
      function (require, module, exports) {
        "use strict";
        var str = "razdwatrzy";
        module.exports = function () {
          if (typeof str.contains !== "function") return false;
          return str.contains("dwa") === true && str.contains("foo") === false;
        };
      },
      {},
    ],
    20: [
      function (require, module, exports) {
        "use strict";
        var indexOf = String.prototype.indexOf;
        module.exports = function (searchString) {
          return indexOf.call(this, searchString, arguments[1]) > -1;
        };
      },
      {},
    ],
    21: [
      function (require, module, exports) {
        "use strict";
        var d = require("d"),
          create = Object.create,
          defineProperties = Object.defineProperties,
          generateName,
          Symbol;
        generateName = (function () {
          var created = create(null);
          return function (desc) {
            var postfix = 0;
            while (created[desc + (postfix || "")]) ++postfix;
            desc += postfix || "";
            created[desc] = true;
            return "@@" + desc;
          };
        })();
        module.exports = Symbol = function (description) {
          var symbol;
          if (this instanceof Symbol) {
            throw new TypeError("TypeError: Symbol is not a constructor");
          }
          symbol = create(Symbol.prototype);
          description = description === undefined ? "" : String(description);
          return defineProperties(symbol, {
            __description__: d("", description),
            __name__: d("", generateName(description)),
          });
        };
        Object.defineProperties(Symbol, {
          create: d("", Symbol("create")),
          hasInstance: d("", Symbol("hasInstance")),
          isConcatSpreadable: d("", Symbol("isConcatSpreadable")),
          isRegExp: d("", Symbol("isRegExp")),
          iterator: d("", Symbol("iterator")),
          toPrimitive: d("", Symbol("toPrimitive")),
          toStringTag: d("", Symbol("toStringTag")),
          unscopables: d("", Symbol("unscopables")),
        });
        defineProperties(Symbol.prototype, {
          properToString: d(function () {
            return "Symbol (" + this.__description__ + ")";
          }),
          toString: d("", function () {
            return this.__name__;
          }),
        });
        Object.defineProperty(
          Symbol.prototype,
          Symbol.toPrimitive,
          d("", function (hint) {
            throw new TypeError("Conversion of symbol objects is not allowed");
          })
        );
        Object.defineProperty(
          Symbol.prototype,
          Symbol.toStringTag,
          d("c", "Symbol")
        );
      },
      { d: 7 },
    ],
  },
  {},
  [1]
);
