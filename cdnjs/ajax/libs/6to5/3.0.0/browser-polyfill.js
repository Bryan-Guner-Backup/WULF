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
          "use strict";
          if (global._6to5Polyfill) {
            throw new Error("only one instance of 6to5/polyfill is allowed");
          }
          global._6to5Polyfill = true;
          require("core-js/shim");
          require("regenerator-6to5/runtime");
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
      { "core-js/shim": 2, "regenerator-6to5/runtime": 3 },
    ],
    2: [
      function (require, module, exports) {
        !(function (global, framework, undefined) {
          "use strict";
          var OBJECT = "Object",
            FUNCTION = "Function",
            ARRAY = "Array",
            STRING = "String",
            NUMBER = "Number",
            REGEXP = "RegExp",
            DATE = "Date",
            MAP = "Map",
            SET = "Set",
            WEAKMAP = "WeakMap",
            WEAKSET = "WeakSet",
            SYMBOL = "Symbol",
            PROMISE = "Promise",
            MATH = "Math",
            ARGUMENTS = "Arguments",
            PROTOTYPE = "prototype",
            CONSTRUCTOR = "constructor",
            TO_STRING = "toString",
            TO_STRING_TAG = TO_STRING + "Tag",
            TO_LOCALE = "toLocaleString",
            HAS_OWN = "hasOwnProperty",
            FOR_EACH = "forEach",
            ITERATOR = "iterator",
            FF_ITERATOR = "@@" + ITERATOR,
            PROCESS = "process",
            CREATE_ELEMENT = "createElement",
            Function = global[FUNCTION],
            Object = global[OBJECT],
            Array = global[ARRAY],
            String = global[STRING],
            Number = global[NUMBER],
            RegExp = global[REGEXP],
            Date = global[DATE],
            Map = global[MAP],
            Set = global[SET],
            WeakMap = global[WEAKMAP],
            WeakSet = global[WEAKSET],
            Symbol = global[SYMBOL],
            Math = global[MATH],
            TypeError = global.TypeError,
            setTimeout = global.setTimeout,
            setImmediate = global.setImmediate,
            clearImmediate = global.clearImmediate,
            process = global[PROCESS],
            nextTick = process && process.nextTick,
            document = global.document,
            html = document && document.documentElement,
            navigator = global.navigator,
            define = global.define,
            ArrayProto = Array[PROTOTYPE],
            ObjectProto = Object[PROTOTYPE],
            FunctionProto = Function[PROTOTYPE],
            Infinity = 1 / 0,
            DOT = ".";
          function isObject(it) {
            return (
              it != null && (typeof it == "object" || typeof it == "function")
            );
          }
          function isFunction(it) {
            return typeof it == "function";
          }
          var isNative = ctx(/./.test, /\[native code\]\s*\}\s*$/, 1);
          var buildIn = {
              Undefined: 1,
              Null: 1,
              Array: 1,
              String: 1,
              Arguments: 1,
              Function: 1,
              Error: 1,
              Boolean: 1,
              Number: 1,
              Date: 1,
              RegExp: 1,
            },
            toString = ObjectProto[TO_STRING];
          function setToStringTag(it, tag, stat) {
            if (it && !has((it = stat ? it : it[PROTOTYPE]), SYMBOL_TAG))
              hidden(it, SYMBOL_TAG, tag);
          }
          function cof(it) {
            return it == undefined
              ? it === undefined
                ? "Undefined"
                : "Null"
              : toString.call(it).slice(8, -1);
          }
          function classof(it) {
            var klass = cof(it),
              tag;
            return klass == OBJECT && (tag = it[SYMBOL_TAG])
              ? has(buildIn, tag)
                ? "~" + tag
                : tag
              : klass;
          }
          var call = FunctionProto.call,
            apply = FunctionProto.apply,
            REFERENCE_GET;
          function part() {
            var fn = assertFunction(this),
              length = arguments.length,
              args = Array(length),
              i = 0,
              _ = path._,
              holder = false;
            while (length > i)
              if ((args[i] = arguments[i++]) === _) holder = true;
            return function () {
              var that = this,
                _length = arguments.length,
                i = 0,
                j = 0,
                _args;
              if (!holder && !_length) return invoke(fn, args, that);
              _args = args.slice();
              if (holder)
                for (; length > i; i++)
                  if (_args[i] === _) _args[i] = arguments[j++];
              while (_length > j) _args.push(arguments[j++]);
              return invoke(fn, _args, that);
            };
          }
          function ctx(fn, that, length) {
            assertFunction(fn);
            if (~length && that === undefined) return fn;
            switch (length) {
              case 1:
                return function (a) {
                  return fn.call(that, a);
                };
              case 2:
                return function (a, b) {
                  return fn.call(that, a, b);
                };
              case 3:
                return function (a, b, c) {
                  return fn.call(that, a, b, c);
                };
            }
            return function () {
              return fn.apply(that, arguments);
            };
          }
          function invoke(fn, args, that) {
            var un = that === undefined;
            switch (args.length | 0) {
              case 0:
                return un ? fn() : fn.call(that);
              case 1:
                return un ? fn(args[0]) : fn.call(that, args[0]);
              case 2:
                return un
                  ? fn(args[0], args[1])
                  : fn.call(that, args[0], args[1]);
              case 3:
                return un
                  ? fn(args[0], args[1], args[2])
                  : fn.call(that, args[0], args[1], args[2]);
              case 4:
                return un
                  ? fn(args[0], args[1], args[2], args[3])
                  : fn.call(that, args[0], args[1], args[2], args[3]);
              case 5:
                return un
                  ? fn(args[0], args[1], args[2], args[3], args[4])
                  : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
            }
            return fn.apply(that, args);
          }
          function construct(target, argumentsList) {
            var instance = create(
                (arguments.length < 3 ? target : assertFunction(arguments[2]))[
                  PROTOTYPE
                ]
              ),
              result = apply.call(target, instance, argumentsList);
            return isObject(result) ? result : instance;
          }
          var create = Object.create,
            getPrototypeOf = Object.getPrototypeOf,
            setPrototypeOf = Object.setPrototypeOf,
            defineProperty = Object.defineProperty,
            defineProperties = Object.defineProperties,
            getOwnDescriptor = Object.getOwnPropertyDescriptor,
            getKeys = Object.keys,
            getNames = Object.getOwnPropertyNames,
            getSymbols = Object.getOwnPropertySymbols,
            has = ctx(call, ObjectProto[HAS_OWN], 2),
            ES5Object = Object,
            Dict;
          function toObject(it) {
            return ES5Object(assertDefined(it));
          }
          function returnIt(it) {
            return it;
          }
          function returnThis() {
            return this;
          }
          function get(object, key) {
            if (has(object, key)) return object[key];
          }
          function ownKeys(it) {
            assertObject(it);
            return getSymbols
              ? getNames(it).concat(getSymbols(it))
              : getNames(it);
          }
          var assign =
            Object.assign ||
            function (target, source) {
              var T = Object(assertDefined(target)),
                l = arguments.length,
                i = 1;
              while (l > i) {
                var S = ES5Object(arguments[i++]),
                  keys = getKeys(S),
                  length = keys.length,
                  j = 0,
                  key;
                while (length > j) T[(key = keys[j++])] = S[key];
              }
              return T;
            };
          function keyOf(object, el) {
            var O = toObject(object),
              keys = getKeys(O),
              length = keys.length,
              index = 0,
              key;
            while (length > index)
              if (O[(key = keys[index++])] === el) return key;
          }
          function array(it) {
            return String(it).split(",");
          }
          var push = ArrayProto.push,
            unshift = ArrayProto.unshift,
            slice = ArrayProto.slice,
            splice = ArrayProto.splice,
            indexOf = ArrayProto.indexOf,
            forEach = ArrayProto[FOR_EACH];
          function createArrayMethod(type) {
            var isMap = type == 1,
              isFilter = type == 2,
              isSome = type == 3,
              isEvery = type == 4,
              isFindIndex = type == 6,
              noholes = type == 5 || isFindIndex;
            return function (callbackfn) {
              var O = Object(assertDefined(this)),
                that = arguments[1],
                self = ES5Object(O),
                f = ctx(callbackfn, that, 3),
                length = toLength(self.length),
                index = 0,
                result = isMap ? Array(length) : isFilter ? [] : undefined,
                val,
                res;
              for (; length > index; index++)
                if (noholes || index in self) {
                  val = self[index];
                  res = f(val, index, O);
                  if (type) {
                    if (isMap) result[index] = res;
                    else if (res)
                      switch (type) {
                        case 3:
                          return true;
                        case 5:
                          return val;
                        case 6:
                          return index;
                        case 2:
                          result.push(val);
                      }
                    else if (isEvery) return false;
                  }
                }
              return isFindIndex ? -1 : isSome || isEvery ? isEvery : result;
            };
          }
          function createArrayContains(isContains) {
            return function (el) {
              var O = toObject(this),
                length = toLength(O.length),
                index = toIndex(arguments[1], length);
              if (isContains && el != el) {
                for (; length > index; index++)
                  if (sameNaN(O[index])) return isContains || index;
              } else
                for (; length > index; index++)
                  if (isContains || index in O) {
                    if (O[index] === el) return isContains || index;
                  }
              return !isContains && -1;
            };
          }
          function generic(A, B) {
            return typeof A == "function" ? A : B;
          }
          var MAX_SAFE_INTEGER = 9007199254740991,
            ceil = Math.ceil,
            floor = Math.floor,
            max = Math.max,
            min = Math.min,
            random = Math.random,
            trunc =
              Math.trunc ||
              function (it) {
                return (it > 0 ? floor : ceil)(it);
              };
          function sameNaN(number) {
            return number != number;
          }
          function toInteger(it) {
            return isNaN(it) ? 0 : trunc(it);
          }
          function toLength(it) {
            return it > 0 ? min(toInteger(it), MAX_SAFE_INTEGER) : 0;
          }
          function toIndex(index, length) {
            var index = toInteger(index);
            return index < 0 ? max(index + length, 0) : min(index, length);
          }
          function createReplacer(regExp, replace, isStatic) {
            var replacer = isObject(replace)
              ? function (part) {
                  return replace[part];
                }
              : replace;
            return function (it) {
              return String(isStatic ? it : this).replace(regExp, replacer);
            };
          }
          function createPointAt(toString) {
            return function (pos) {
              var s = String(assertDefined(this)),
                i = toInteger(pos),
                l = s.length,
                a,
                b;
              if (i < 0 || i >= l) return toString ? "" : undefined;
              a = s.charCodeAt(i);
              return a < 55296 ||
                a > 56319 ||
                i + 1 === l ||
                (b = s.charCodeAt(i + 1)) < 56320 ||
                b > 57343
                ? toString
                  ? s.charAt(i)
                  : a
                : toString
                ? s.slice(i, i + 2)
                : ((a - 55296) << 10) + (b - 56320) + 65536;
            };
          }
          var REDUCE_ERROR = "Reduce of empty object with no initial value";
          function assert(condition, msg1, msg2) {
            if (!condition) throw TypeError(msg2 ? msg1 + msg2 : msg1);
          }
          function assertDefined(it) {
            if (it == undefined)
              throw TypeError("Function called on null or undefined");
            return it;
          }
          function assertFunction(it) {
            assert(isFunction(it), it, " is not a function!");
            return it;
          }
          function assertObject(it) {
            assert(isObject(it), it, " is not an object!");
            return it;
          }
          function assertInstance(it, Constructor, name) {
            assert(
              it instanceof Constructor,
              name,
              ": use the 'new' operator!"
            );
          }
          function descriptor(bitmap, value) {
            return {
              enumerable: !(bitmap & 1),
              configurable: !(bitmap & 2),
              writable: !(bitmap & 4),
              value: value,
            };
          }
          function simpleSet(object, key, value) {
            object[key] = value;
            return object;
          }
          function createDefiner(bitmap) {
            return DESC
              ? function (object, key, value) {
                  return defineProperty(object, key, descriptor(bitmap, value));
                }
              : simpleSet;
          }
          function uid(key) {
            return (
              SYMBOL + "(" + key + ")_" + (++sid + random())[TO_STRING](36)
            );
          }
          function getWellKnownSymbol(name, setter) {
            return (
              (Symbol && Symbol[name]) ||
              (setter ? Symbol : safeSymbol)(SYMBOL + DOT + name)
            );
          }
          var DESC = !!(function () {
              try {
                return defineProperty({}, DOT, ObjectProto);
              } catch (e) {}
            })(),
            sid = 0,
            hidden = createDefiner(1),
            set = Symbol ? simpleSet : hidden,
            safeSymbol = Symbol || uid;
          function assignHidden(target, src) {
            for (var key in src) hidden(target, key, src[key]);
            return target;
          }
          var SYMBOL_UNSCOPABLES = getWellKnownSymbol("unscopables"),
            ArrayUnscopables = ArrayProto[SYMBOL_UNSCOPABLES] || {},
            SYMBOL_SPECIES = getWellKnownSymbol("species");
          function setSpecies(C) {
            if (framework || !isNative(C))
              defineProperty(C, SYMBOL_SPECIES, {
                configurable: true,
                get: returnThis,
              });
          }
          var SYMBOL_ITERATOR = getWellKnownSymbol(ITERATOR),
            SYMBOL_TAG = getWellKnownSymbol(TO_STRING_TAG),
            SUPPORT_FF_ITER = FF_ITERATOR in ArrayProto,
            ITER = safeSymbol("iter"),
            KEY = 1,
            VALUE = 2,
            Iterators = {},
            IteratorPrototype = {},
            NATIVE_ITERATORS = SYMBOL_ITERATOR in ArrayProto,
            BUGGY_ITERATORS = "keys" in ArrayProto && !("next" in [].keys());
          setIterator(IteratorPrototype, returnThis);
          function setIterator(O, value) {
            hidden(O, SYMBOL_ITERATOR, value);
            SUPPORT_FF_ITER && hidden(O, FF_ITERATOR, value);
          }
          function createIterator(Constructor, NAME, next, proto) {
            Constructor[PROTOTYPE] = create(proto || IteratorPrototype, {
              next: descriptor(1, next),
            });
            setToStringTag(Constructor, NAME + " Iterator");
          }
          function defineIterator(Constructor, NAME, value, DEFAULT) {
            var proto = Constructor[PROTOTYPE],
              iter =
                get(proto, SYMBOL_ITERATOR) ||
                get(proto, FF_ITERATOR) ||
                (DEFAULT && get(proto, DEFAULT)) ||
                value;
            if (framework) {
              setIterator(proto, iter);
              if (iter !== value) {
                var iterProto = getPrototypeOf(iter.call(new Constructor()));
                setToStringTag(iterProto, NAME + " Iterator", true);
                has(proto, FF_ITERATOR) && setIterator(iterProto, returnThis);
              }
            }
            Iterators[NAME] = iter;
            Iterators[NAME + " Iterator"] = returnThis;
            return iter;
          }
          function defineStdIterators(
            Base,
            NAME,
            Constructor,
            next,
            DEFAULT,
            IS_SET
          ) {
            function createIter(kind) {
              return function () {
                return new Constructor(this, kind);
              };
            }
            createIterator(Constructor, NAME, next);
            var entries = createIter(KEY + VALUE),
              values = createIter(VALUE);
            if (DEFAULT == VALUE)
              values = defineIterator(Base, NAME, values, "values");
            else entries = defineIterator(Base, NAME, entries, "entries");
            if (DEFAULT) {
              $define(PROTO + FORCED * BUGGY_ITERATORS, NAME, {
                entries: entries,
                keys: IS_SET ? values : createIter(KEY),
                values: values,
              });
            }
          }
          function iterResult(done, value) {
            return { value: value, done: !!done };
          }
          function isIterable(it) {
            var O = Object(it),
              Symbol = global[SYMBOL],
              hasExt = ((Symbol && Symbol[ITERATOR]) || FF_ITERATOR) in O;
            return hasExt || SYMBOL_ITERATOR in O || has(Iterators, classof(O));
          }
          function getIterator(it) {
            var Symbol = global[SYMBOL],
              ext = it[(Symbol && Symbol[ITERATOR]) || FF_ITERATOR],
              getIter = ext || it[SYMBOL_ITERATOR] || Iterators[classof(it)];
            return assertObject(getIter.call(it));
          }
          function stepCall(fn, value, entries) {
            return entries ? invoke(fn, value) : fn(value);
          }
          function forOf(iterable, entries, fn, that) {
            var iterator = getIterator(iterable),
              f = ctx(fn, that, entries ? 2 : 1),
              step;
            while (!(step = iterator.next()).done)
              if (stepCall(f, step.value, entries) === false) return;
          }
          var NODE = cof(process) == PROCESS,
            core = {},
            path = framework ? global : core,
            old = global.core,
            exportGlobal,
            FORCED = 1,
            GLOBAL = 2,
            STATIC = 4,
            PROTO = 8,
            BIND = 16,
            WRAP = 32;
          function $define(type, name, source) {
            var key,
              own,
              out,
              exp,
              isGlobal = type & GLOBAL,
              target = isGlobal
                ? global
                : type & STATIC
                ? global[name]
                : (global[name] || ObjectProto)[PROTOTYPE],
              exports = isGlobal ? core : core[name] || (core[name] = {});
            if (isGlobal) source = name;
            for (key in source) {
              own =
                !(type & FORCED) &&
                target &&
                key in target &&
                (!isFunction(target[key]) || isNative(target[key]));
              out = (own ? target : source)[key];
              if (type & BIND && own) exp = ctx(out, global);
              else if (type & WRAP && !framework && target[key] == out) {
                exp = function (param) {
                  return this instanceof out ? new out(param) : out(param);
                };
                exp[PROTOTYPE] = out[PROTOTYPE];
              } else
                exp = type & PROTO && isFunction(out) ? ctx(call, out) : out;
              if (exports[key] != out) hidden(exports, key, exp);
              if (framework && target && !own) {
                if (isGlobal) target[key] = out;
                else delete target[key] && hidden(target, key, out);
              }
            }
          }
          if (typeof module != "undefined" && module.exports)
            module.exports = core;
          else if (isFunction(define) && define.amd)
            define(function () {
              return core;
            });
          else exportGlobal = true;
          if (exportGlobal || framework) {
            core.noConflict = function () {
              global.core = old;
              return core;
            };
            global.core = core;
          }
          $define(GLOBAL + FORCED, { global: global });
          !(function (TAG, SymbolRegistry, AllSymbols, setter) {
            if (!isNative(Symbol)) {
              Symbol = function (description) {
                assert(
                  !(this instanceof Symbol),
                  SYMBOL + " is not a " + CONSTRUCTOR
                );
                var tag = uid(description);
                AllSymbols[tag] = true;
                DESC &&
                  setter &&
                  defineProperty(ObjectProto, tag, {
                    configurable: true,
                    set: function (value) {
                      hidden(this, tag, value);
                    },
                  });
                return set(create(Symbol[PROTOTYPE]), TAG, tag);
              };
              hidden(Symbol[PROTOTYPE], TO_STRING, function () {
                return this[TAG];
              });
            }
            $define(GLOBAL + WRAP, { Symbol: Symbol });
            var symbolStatics = {
              for: function (key) {
                return has(SymbolRegistry, (key += ""))
                  ? SymbolRegistry[key]
                  : (SymbolRegistry[key] = Symbol(key));
              },
              iterator: SYMBOL_ITERATOR,
              keyFor: part.call(keyOf, SymbolRegistry),
              species: SYMBOL_SPECIES,
              toStringTag: (SYMBOL_TAG = getWellKnownSymbol(
                TO_STRING_TAG,
                true
              )),
              unscopables: SYMBOL_UNSCOPABLES,
              pure: safeSymbol,
              set: set,
              useSetter: function () {
                setter = true;
              },
              useSimple: function () {
                setter = false;
              },
            };
            forEach.call(
              array(
                "hasInstance,isConcatSpreadable,match,replace,search,split,toPrimitive"
              ),
              function (it) {
                symbolStatics[it] = getWellKnownSymbol(it);
              }
            );
            $define(STATIC, SYMBOL, symbolStatics);
            setToStringTag(Symbol, SYMBOL);
            $define(STATIC + FORCED * !isNative(Symbol), OBJECT, {
              getOwnPropertyNames: function (it) {
                var names = getNames(toObject(it)),
                  result = [],
                  key,
                  i = 0;
                while (names.length > i)
                  has(AllSymbols, (key = names[i++])) || result.push(key);
                return result;
              },
              getOwnPropertySymbols: function (it) {
                var names = getNames(toObject(it)),
                  result = [],
                  key,
                  i = 0;
                while (names.length > i)
                  has(AllSymbols, (key = names[i++])) && result.push(key);
                return result;
              },
            });
          })(safeSymbol("tag"), {}, {}, true);
          !(function (RegExpProto, isFinite, tmp, NAME) {
            var RangeError = global.RangeError,
              isInteger =
                Number.isInteger ||
                function (it) {
                  return !isObject(it) && isFinite(it) && floor(it) === it;
                },
              sign =
                Math.sign ||
                function sign(x) {
                  return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
                },
              E = Math.E,
              pow = Math.pow,
              abs = Math.abs,
              exp = Math.exp,
              log = Math.log,
              sqrt = Math.sqrt,
              fcc = String.fromCharCode,
              at = createPointAt(true);
            var objectStatic = {
              assign: assign,
              is: function (x, y) {
                return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
              },
            };
            "__proto__" in ObjectProto &&
              (function (buggy, set) {
                try {
                  set = ctx(
                    call,
                    getOwnDescriptor(ObjectProto, "__proto__").set,
                    2
                  );
                  set({}, ArrayProto);
                } catch (e) {
                  buggy = true;
                }
                objectStatic.setPrototypeOf = setPrototypeOf =
                  setPrototypeOf ||
                  function (O, proto) {
                    assertObject(O);
                    assert(
                      proto === null || isObject(proto),
                      proto,
                      ": can't set as prototype!"
                    );
                    if (buggy) O.__proto__ = proto;
                    else set(O, proto);
                    return O;
                  };
              })();
            $define(STATIC, OBJECT, objectStatic);
            function asinh(x) {
              return !isFinite((x = +x)) || x == 0
                ? x
                : x < 0
                ? -asinh(-x)
                : log(x + sqrt(x * x + 1));
            }
            function expm1(x) {
              return (x = +x) == 0
                ? x
                : x > -1e-6 && x < 1e-6
                ? x + (x * x) / 2
                : exp(x) - 1;
            }
            $define(STATIC, NUMBER, {
              EPSILON: pow(2, -52),
              isFinite: function (it) {
                return typeof it == "number" && isFinite(it);
              },
              isInteger: isInteger,
              isNaN: sameNaN,
              isSafeInteger: function (number) {
                return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
              },
              MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
              MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
              parseFloat: parseFloat,
              parseInt: parseInt,
            });
            $define(STATIC, MATH, {
              acosh: function (x) {
                return (x = +x) < 1
                  ? NaN
                  : isFinite(x)
                  ? log(x / E + (sqrt(x + 1) * sqrt(x - 1)) / E) + 1
                  : x;
              },
              asinh: asinh,
              atanh: function (x) {
                return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
              },
              cbrt: function (x) {
                return sign((x = +x)) * pow(abs(x), 1 / 3);
              },
              clz32: function (x) {
                return (x >>>= 0) ? 32 - x[TO_STRING](2).length : 32;
              },
              cosh: function (x) {
                return (exp((x = +x)) + exp(-x)) / 2;
              },
              expm1: expm1,
              fround: function (x) {
                return new Float32Array([x])[0];
              },
              hypot: function (value1, value2) {
                var sum = 0,
                  len1 = arguments.length,
                  len2 = len1,
                  args = Array(len1),
                  larg = -Infinity,
                  arg;
                while (len1--) {
                  arg = args[len1] = +arguments[len1];
                  if (arg == Infinity || arg == -Infinity) return Infinity;
                  if (arg > larg) larg = arg;
                }
                larg = arg || 1;
                while (len2--) sum += pow(args[len2] / larg, 2);
                return larg * sqrt(sum);
              },
              imul: function (x, y) {
                var UInt16 = 65535,
                  xn = +x,
                  yn = +y,
                  xl = UInt16 & xn,
                  yl = UInt16 & yn;
                return (
                  0 |
                  (xl * yl +
                    ((((UInt16 & (xn >>> 16)) * yl +
                      xl * (UInt16 & (yn >>> 16))) <<
                      16) >>>
                      0))
                );
              },
              log1p: function (x) {
                return (x = +x) > -1e-8 && x < 1e-8
                  ? x - (x * x) / 2
                  : log(1 + x);
              },
              log10: function (x) {
                return log(x) / Math.LN10;
              },
              log2: function (x) {
                return log(x) / Math.LN2;
              },
              sign: sign,
              sinh: function (x) {
                return abs((x = +x)) < 1
                  ? (expm1(x) - expm1(-x)) / 2
                  : (exp(x - 1) - exp(-x - 1)) * (E / 2);
              },
              tanh: function (x) {
                var a = expm1((x = +x)),
                  b = expm1(-x);
                return a == Infinity
                  ? 1
                  : b == Infinity
                  ? -1
                  : (a - b) / (exp(x) + exp(-x));
              },
              trunc: trunc,
            });
            setToStringTag(Math, MATH, true);
            function assertNotRegExp(it) {
              if (cof(it) == REGEXP) throw TypeError();
            }
            $define(STATIC, STRING, {
              fromCodePoint: function (x) {
                var res = [],
                  len = arguments.length,
                  i = 0,
                  code;
                while (len > i) {
                  code = +arguments[i++];
                  if (toIndex(code, 1114111) !== code)
                    throw RangeError(code + " is not a valid code point");
                  res.push(
                    code < 65536
                      ? fcc(code)
                      : fcc(
                          ((code -= 65536) >> 10) + 55296,
                          (code % 1024) + 56320
                        )
                  );
                }
                return res.join("");
              },
              raw: function (callSite) {
                var raw = toObject(callSite.raw),
                  len = toLength(raw.length),
                  sln = arguments.length,
                  res = [],
                  i = 0;
                while (len > i) {
                  res.push(String(raw[i++]));
                  if (i < sln) res.push(String(arguments[i]));
                }
                return res.join("");
              },
            });
            $define(PROTO, STRING, {
              codePointAt: createPointAt(false),
              endsWith: function (searchString) {
                assertNotRegExp(searchString);
                var that = String(assertDefined(this)),
                  endPosition = arguments[1],
                  len = toLength(that.length),
                  end =
                    endPosition === undefined
                      ? len
                      : min(toLength(endPosition), len);
                searchString += "";
                return (
                  that.slice(end - searchString.length, end) === searchString
                );
              },
              includes: function (searchString) {
                assertNotRegExp(searchString);
                return !!~String(assertDefined(this)).indexOf(
                  searchString,
                  arguments[1]
                );
              },
              repeat: function (count) {
                var str = String(assertDefined(this)),
                  res = "",
                  n = toInteger(count);
                if (0 > n || n == Infinity)
                  throw RangeError("Count can't be negative");
                for (; n > 0; (n >>>= 1) && (str += str)) if (n & 1) res += str;
                return res;
              },
              startsWith: function (searchString) {
                assertNotRegExp(searchString);
                var that = String(assertDefined(this)),
                  index = toLength(min(arguments[1], that.length));
                searchString += "";
                return (
                  that.slice(index, index + searchString.length) ===
                  searchString
                );
              },
            });
            defineStdIterators(
              String,
              STRING,
              function (iterated) {
                set(this, ITER, { o: String(iterated), i: 0 });
              },
              function () {
                var iter = this[ITER],
                  O = iter.o,
                  index = iter.i,
                  point;
                if (index >= O.length) return iterResult(1);
                point = at.call(O, index);
                iter.i += point.length;
                return iterResult(0, point);
              }
            );
            $define(STATIC, ARRAY, {
              from: function (arrayLike) {
                var O = Object(assertDefined(arrayLike)),
                  result = new (generic(this, Array))(),
                  mapfn = arguments[1],
                  that = arguments[2],
                  mapping = mapfn !== undefined,
                  f = mapping ? ctx(mapfn, that, 2) : undefined,
                  index = 0,
                  length;
                if (isIterable(O))
                  for (
                    var iter = getIterator(O), step;
                    !(step = iter.next()).done;
                    index++
                  ) {
                    result[index] = mapping ? f(step.value, index) : step.value;
                  }
                else
                  for (length = toLength(O.length); length > index; index++) {
                    result[index] = mapping ? f(O[index], index) : O[index];
                  }
                result.length = index;
                return result;
              },
              of: function () {
                var index = 0,
                  length = arguments.length,
                  result = new (generic(this, Array))(length);
                while (length > index) result[index] = arguments[index++];
                result.length = length;
                return result;
              },
            });
            $define(PROTO, ARRAY, {
              copyWithin: function (target, start) {
                var O = Object(assertDefined(this)),
                  len = toLength(O.length),
                  to = toIndex(target, len),
                  from = toIndex(start, len),
                  end = arguments[2],
                  fin = end === undefined ? len : toIndex(end, len),
                  count = min(fin - from, len - to),
                  inc = 1;
                if (from < to && to < from + count) {
                  inc = -1;
                  from = from + count - 1;
                  to = to + count - 1;
                }
                while (count-- > 0) {
                  if (from in O) O[to] = O[from];
                  else delete O[to];
                  to += inc;
                  from += inc;
                }
                return O;
              },
              fill: function (value) {
                var O = Object(assertDefined(this)),
                  length = toLength(O.length),
                  index = toIndex(arguments[1], length),
                  end = arguments[2],
                  endPos = end === undefined ? length : toIndex(end, length);
                while (endPos > index) O[index++] = value;
                return O;
              },
              find: createArrayMethod(5),
              findIndex: createArrayMethod(6),
            });
            defineStdIterators(
              Array,
              ARRAY,
              function (iterated, kind) {
                set(this, ITER, { o: toObject(iterated), i: 0, k: kind });
              },
              function () {
                var iter = this[ITER],
                  O = iter.o,
                  kind = iter.k,
                  index = iter.i++;
                if (!O || index >= O.length)
                  return (iter.o = undefined), iterResult(1);
                if (kind == KEY) return iterResult(0, index);
                if (kind == VALUE) return iterResult(0, O[index]);
                return iterResult(0, [index, O[index]]);
              },
              VALUE
            );
            Iterators[ARGUMENTS] = Iterators[ARRAY];
            setToStringTag(global.JSON, "JSON", true);
            function wrapObjectMethod(key, MODE) {
              var fn = Object[key],
                exp = core[OBJECT][key],
                f = 0,
                o = {};
              if (!exp || isNative(exp)) {
                o[key] =
                  MODE == 1
                    ? function (it) {
                        return isObject(it) ? fn(it) : it;
                      }
                    : MODE == 2
                    ? function (it) {
                        return isObject(it) ? fn(it) : true;
                      }
                    : MODE == 3
                    ? function (it) {
                        return isObject(it) ? fn(it) : false;
                      }
                    : MODE == 4
                    ? function (it, key) {
                        return fn(toObject(it), key);
                      }
                    : function (it) {
                        return fn(toObject(it));
                      };
                try {
                  fn(DOT);
                } catch (e) {
                  f = 1;
                }
                $define(STATIC + FORCED * f, OBJECT, o);
              }
            }
            wrapObjectMethod("freeze", 1);
            wrapObjectMethod("seal", 1);
            wrapObjectMethod("preventExtensions", 1);
            wrapObjectMethod("isFrozen", 2);
            wrapObjectMethod("isSealed", 2);
            wrapObjectMethod("isExtensible", 3);
            wrapObjectMethod("getOwnPropertyDescriptor", 4);
            wrapObjectMethod("getPrototypeOf");
            wrapObjectMethod("keys");
            wrapObjectMethod("getOwnPropertyNames");
            if (framework) {
              tmp[SYMBOL_TAG] = DOT;
              if (cof(tmp) != DOT)
                hidden(ObjectProto, TO_STRING, function () {
                  return "[object " + classof(this) + "]";
                });
              NAME in FunctionProto ||
                defineProperty(FunctionProto, NAME, {
                  configurable: true,
                  get: function () {
                    var match = String(this).match(/^\s*function ([^ (]*)/),
                      name = match ? match[1] : "";
                    has(this, NAME) ||
                      defineProperty(this, NAME, descriptor(5, name));
                    return name;
                  },
                  set: function (value) {
                    has(this, NAME) ||
                      defineProperty(this, NAME, descriptor(0, value));
                  },
                });
              if (
                DESC &&
                !(function () {
                  try {
                    return RegExp(/a/g, "i") == "/a/i";
                  } catch (e) {}
                })()
              ) {
                var _RegExp = RegExp;
                RegExp = function RegExp(pattern, flags) {
                  return new _RegExp(
                    cof(pattern) == REGEXP && flags !== undefined
                      ? pattern.source
                      : pattern,
                    flags
                  );
                };
                forEach.call(getNames(_RegExp), function (key) {
                  key in RegExp ||
                    defineProperty(RegExp, key, {
                      configurable: true,
                      get: function () {
                        return _RegExp[key];
                      },
                      set: function (it) {
                        _RegExp[key] = it;
                      },
                    });
                });
                RegExpProto[CONSTRUCTOR] = RegExp;
                RegExp[PROTOTYPE] = RegExpProto;
                hidden(global, REGEXP, RegExp);
              }
              if (/./g.flags != "g")
                defineProperty(RegExpProto, "flags", {
                  configurable: true,
                  get: createReplacer(/^.*\/(\w*)$/, "$1"),
                });
              forEach.call(
                array("find,findIndex,fill,copyWithin,entries,keys,values"),
                function (it) {
                  ArrayUnscopables[it] = true;
                }
              );
              SYMBOL_UNSCOPABLES in ArrayProto ||
                hidden(ArrayProto, SYMBOL_UNSCOPABLES, ArrayUnscopables);
            }
            setSpecies(RegExp);
            setSpecies(Array);
          })(RegExp[PROTOTYPE], isFinite, {}, "name");
          (isFunction(setImmediate) && isFunction(clearImmediate)) ||
            (function (ONREADYSTATECHANGE) {
              var postMessage = global.postMessage,
                addEventListener = global.addEventListener,
                MessageChannel = global.MessageChannel,
                counter = 0,
                queue = {},
                defer,
                channel,
                port;
              setImmediate = function (fn) {
                var args = [],
                  i = 1;
                while (arguments.length > i) args.push(arguments[i++]);
                queue[++counter] = function () {
                  invoke(isFunction(fn) ? fn : Function(fn), args);
                };
                defer(counter);
                return counter;
              };
              clearImmediate = function (id) {
                delete queue[id];
              };
              function run(id) {
                if (has(queue, id)) {
                  var fn = queue[id];
                  delete queue[id];
                  fn();
                }
              }
              function listner(event) {
                run(event.data);
              }
              if (NODE) {
                defer = function (id) {
                  nextTick(part.call(run, id));
                };
              } else if (
                addEventListener &&
                isFunction(postMessage) &&
                !global.importScripts
              ) {
                defer = function (id) {
                  postMessage(id, "*");
                };
                addEventListener("message", listner, false);
              } else if (isFunction(MessageChannel)) {
                channel = new MessageChannel();
                port = channel.port2;
                channel.port1.onmessage = listner;
                defer = ctx(port.postMessage, port, 1);
              } else if (
                document &&
                ONREADYSTATECHANGE in document[CREATE_ELEMENT]("script")
              ) {
                defer = function (id) {
                  html.appendChild(document[CREATE_ELEMENT]("script"))[
                    ONREADYSTATECHANGE
                  ] = function () {
                    html.removeChild(this);
                    run(id);
                  };
                };
              } else {
                defer = function (id) {
                  setTimeout(part.call(run, id), 0);
                };
              }
            })("onreadystatechange");
          $define(GLOBAL + BIND, {
            setImmediate: setImmediate,
            clearImmediate: clearImmediate,
          });
          !(function (Promise, test) {
            (isFunction(Promise) &&
              isFunction(Promise.resolve) &&
              Promise.resolve((test = new Promise(function () {}))) == test) ||
              (function (asap, DEF) {
                function isThenable(o) {
                  var then;
                  if (isObject(o)) then = o.then;
                  return isFunction(then) ? then : false;
                }
                function notify(def) {
                  var chain = def.chain;
                  chain.length &&
                    asap(function () {
                      var msg = def.msg,
                        ok = def.state == 1,
                        i = 0;
                      while (chain.length > i)
                        !(function (react) {
                          var cb = ok ? react.ok : react.fail,
                            ret,
                            then;
                          try {
                            if (cb) {
                              ret = cb === true ? msg : cb(msg);
                              if (ret === react.P) {
                                react.rej(TypeError(PROMISE + "-chain cycle"));
                              } else if ((then = isThenable(ret))) {
                                then.call(ret, react.res, react.rej);
                              } else react.res(ret);
                            } else react.rej(msg);
                          } catch (err) {
                            react.rej(err);
                          }
                        })(chain[i++]);
                      chain.length = 0;
                    });
                }
                function resolve(msg) {
                  var def = this,
                    then,
                    wrapper;
                  if (def.done) return;
                  def.done = true;
                  def = def.def || def;
                  try {
                    if ((then = isThenable(msg))) {
                      wrapper = { def: def, done: false };
                      then.call(
                        msg,
                        ctx(resolve, wrapper, 1),
                        ctx(reject, wrapper, 1)
                      );
                    } else {
                      def.msg = msg;
                      def.state = 1;
                      notify(def);
                    }
                  } catch (err) {
                    reject.call(wrapper || { def: def, done: false }, err);
                  }
                }
                function reject(msg) {
                  var def = this;
                  if (def.done) return;
                  def.done = true;
                  def = def.def || def;
                  def.msg = msg;
                  def.state = 2;
                  notify(def);
                }
                function getConstructor(C) {
                  var S = assertObject(C)[SYMBOL_SPECIES];
                  return S != undefined ? S : C;
                }
                Promise = function (executor) {
                  assertFunction(executor);
                  assertInstance(this, Promise, PROMISE);
                  var def = {
                    chain: [],
                    state: 0,
                    done: false,
                    msg: undefined,
                  };
                  hidden(this, DEF, def);
                  try {
                    executor(ctx(resolve, def, 1), ctx(reject, def, 1));
                  } catch (err) {
                    reject.call(def, err);
                  }
                };
                assignHidden(Promise[PROTOTYPE], {
                  then: function (onFulfilled, onRejected) {
                    var S = assertObject(assertObject(this)[CONSTRUCTOR])[
                      SYMBOL_SPECIES
                    ];
                    var react = {
                        ok: isFunction(onFulfilled) ? onFulfilled : true,
                        fail: isFunction(onRejected) ? onRejected : false,
                      },
                      P = (react.P = new (S != undefined ? S : Promise)(
                        function (resolve, reject) {
                          react.res = assertFunction(resolve);
                          react.rej = assertFunction(reject);
                        }
                      )),
                      def = this[DEF];
                    def.chain.push(react);
                    def.state && notify(def);
                    return P;
                  },
                  catch: function (onRejected) {
                    return this.then(undefined, onRejected);
                  },
                });
                assignHidden(Promise, {
                  all: function (iterable) {
                    var Promise = getConstructor(this),
                      values = [];
                    return new Promise(function (resolve, reject) {
                      forOf(iterable, false, push, values);
                      var remaining = values.length,
                        results = Array(remaining);
                      if (remaining)
                        forEach.call(values, function (promise, index) {
                          Promise.resolve(promise).then(function (value) {
                            results[index] = value;
                            --remaining || resolve(results);
                          }, reject);
                        });
                      else resolve(results);
                    });
                  },
                  race: function (iterable) {
                    var Promise = getConstructor(this);
                    return new Promise(function (resolve, reject) {
                      forOf(iterable, false, function (promise) {
                        Promise.resolve(promise).then(resolve, reject);
                      });
                    });
                  },
                  reject: function (r) {
                    return new (getConstructor(this))(function (
                      resolve,
                      reject
                    ) {
                      reject(r);
                    });
                  },
                  resolve: function (x) {
                    return isObject(x) &&
                      DEF in x &&
                      getPrototypeOf(x) === this[PROTOTYPE]
                      ? x
                      : new (getConstructor(this))(function (resolve, reject) {
                          resolve(x);
                        });
                  },
                });
              })(nextTick || setImmediate, safeSymbol("def"));
            setToStringTag(Promise, PROMISE);
            setSpecies(Promise);
            $define(GLOBAL + FORCED * !isNative(Promise), { Promise: Promise });
          })(global[PROMISE]);
          !(function () {
            var UID = safeSymbol("uid"),
              DATA = safeSymbol("data"),
              WEAK = safeSymbol("weak"),
              LAST = safeSymbol("last"),
              FIRST = safeSymbol("first"),
              SIZE = DESC ? safeSymbol("size") : "size",
              uid = 0;
            function getCollection(
              C,
              NAME,
              methods,
              commonMethods,
              isMap,
              isWeak
            ) {
              var ADDER = isMap ? "set" : "add",
                proto = C && C[PROTOTYPE],
                O = {};
              function initFromIterable(that, iterable) {
                if (iterable != undefined)
                  forOf(iterable, isMap, that[ADDER], that);
                return that;
              }
              function fixSVZ(key, chain) {
                var method = proto[key];
                framework &&
                  hidden(proto, key, function (a, b) {
                    var result = method.call(this, a === 0 ? 0 : a, b);
                    return chain ? this : result;
                  });
              }
              if (
                !isNative(C) ||
                !(isWeak || (!BUGGY_ITERATORS && has(proto, "entries")))
              ) {
                C = isWeak
                  ? function (iterable) {
                      assertInstance(this, C, NAME);
                      set(this, UID, uid++);
                      initFromIterable(this, iterable);
                    }
                  : function (iterable) {
                      var that = this;
                      assertInstance(that, C, NAME);
                      set(that, DATA, create(null));
                      set(that, SIZE, 0);
                      set(that, LAST, undefined);
                      set(that, FIRST, undefined);
                      initFromIterable(that, iterable);
                    };
                assignHidden(
                  assignHidden(C[PROTOTYPE], methods),
                  commonMethods
                );
                isWeak ||
                  defineProperty(C[PROTOTYPE], "size", {
                    get: function () {
                      return assertDefined(this[SIZE]);
                    },
                  });
              } else {
                var Native = C,
                  inst = new C(),
                  chain = inst[ADDER](isWeak ? {} : -0, 1),
                  buggyZero;
                if (!NATIVE_ITERATORS || !C.length) {
                  C = function (iterable) {
                    assertInstance(this, C, NAME);
                    return initFromIterable(new Native(), iterable);
                  };
                  C[PROTOTYPE] = proto;
                }
                isWeak ||
                  inst[FOR_EACH](function (val, key) {
                    buggyZero = 1 / key === -Infinity;
                  });
                if (buggyZero) {
                  fixSVZ("delete");
                  fixSVZ("has");
                  isMap && fixSVZ("get");
                }
                if (buggyZero || chain !== inst) fixSVZ(ADDER, true);
              }
              setToStringTag(C, NAME);
              setSpecies(C);
              O[NAME] = C;
              $define(GLOBAL + WRAP + FORCED * !isNative(C), O);
              isWeak ||
                defineStdIterators(
                  C,
                  NAME,
                  function (iterated, kind) {
                    set(this, ITER, { o: iterated, k: kind });
                  },
                  function () {
                    var iter = this[ITER],
                      O = iter.o,
                      kind = iter.k,
                      entry = iter.l;
                    while (entry && entry.r) entry = entry.p;
                    if (!O || !(iter.l = entry = entry ? entry.n : O[FIRST]))
                      return (iter.o = undefined), iterResult(1);
                    if (kind == KEY) return iterResult(0, entry.k);
                    if (kind == VALUE) return iterResult(0, entry.v);
                    return iterResult(0, [entry.k, entry.v]);
                  },
                  isMap ? KEY + VALUE : VALUE,
                  !isMap
                );
              return C;
            }
            function fastKey(it, create) {
              if (!isObject(it))
                return (typeof it == "string" ? "S" : "P") + it;
              if (!has(it, UID)) {
                if (create) hidden(it, UID, ++uid);
                else return "";
              }
              return "O" + it[UID];
            }
            function def(that, key, value) {
              var index = fastKey(key, true),
                data = that[DATA],
                last = that[LAST],
                entry;
              if (index in data) data[index].v = value;
              else {
                entry = data[index] = { k: key, v: value, p: last };
                if (!that[FIRST]) that[FIRST] = entry;
                if (last) last.n = entry;
                that[LAST] = entry;
                that[SIZE]++;
              }
              return that;
            }
            function del(that, index) {
              var data = that[DATA],
                entry = data[index],
                next = entry.n,
                prev = entry.p;
              delete data[index];
              entry.r = true;
              if (prev) prev.n = next;
              if (next) next.p = prev;
              if (that[FIRST] == entry) that[FIRST] = next;
              if (that[LAST] == entry) that[LAST] = prev;
              that[SIZE]--;
            }
            var collectionMethods = {
              clear: function () {
                for (var index in this[DATA]) del(this, index);
              },
              delete: function (key) {
                var index = fastKey(key),
                  contains = index in this[DATA];
                if (contains) del(this, index);
                return contains;
              },
              forEach: function (callbackfn) {
                var f = ctx(callbackfn, arguments[1], 3),
                  entry;
                while ((entry = entry ? entry.n : this[FIRST])) {
                  f(entry.v, entry.k, this);
                  while (entry && entry.r) entry = entry.p;
                }
              },
              has: function (key) {
                return fastKey(key) in this[DATA];
              },
            };
            Map = getCollection(
              Map,
              MAP,
              {
                get: function (key) {
                  var entry = this[DATA][fastKey(key)];
                  return entry && entry.v;
                },
                set: function (key, value) {
                  return def(this, key === 0 ? 0 : key, value);
                },
              },
              collectionMethods,
              true
            );
            Set = getCollection(
              Set,
              SET,
              {
                add: function (value) {
                  return def(this, (value = value === 0 ? 0 : value), value);
                },
              },
              collectionMethods
            );
            function setWeak(that, key, value) {
              has(assertObject(key), WEAK) || hidden(key, WEAK, {});
              key[WEAK][that[UID]] = value;
              return that;
            }
            function hasWeak(key) {
              return (
                isObject(key) && has(key, WEAK) && has(key[WEAK], this[UID])
              );
            }
            var weakMethods = {
              delete: function (key) {
                return hasWeak.call(this, key) && delete key[WEAK][this[UID]];
              },
              has: hasWeak,
            };
            WeakMap = getCollection(
              WeakMap,
              WEAKMAP,
              {
                get: function (key) {
                  if (isObject(key) && has(key, WEAK))
                    return key[WEAK][this[UID]];
                },
                set: function (key, value) {
                  return setWeak(this, key, value);
                },
              },
              weakMethods,
              true,
              true
            );
            WeakSet = getCollection(
              WeakSet,
              WEAKSET,
              {
                add: function (value) {
                  return setWeak(this, value, true);
                },
              },
              weakMethods,
              false,
              true
            );
          })();
          !(function () {
            function Enumerate(iterated) {
              var keys = [],
                key;
              for (key in iterated) keys.push(key);
              set(this, ITER, { o: iterated, a: keys, i: 0 });
            }
            createIterator(Enumerate, OBJECT, function () {
              var iter = this[ITER],
                keys = iter.a,
                key;
              do {
                if (iter.i >= keys.length) return iterResult(1);
              } while (!((key = keys[iter.i++]) in iter.o));
              return iterResult(0, key);
            });
            function wrap(fn) {
              return function (it) {
                assertObject(it);
                try {
                  return fn.apply(undefined, arguments), true;
                } catch (e) {
                  return false;
                }
              };
            }
            function reflectGet(target, propertyKey) {
              var receiver = arguments.length < 3 ? target : arguments[2],
                desc = getOwnDescriptor(assertObject(target), propertyKey),
                proto;
              if (desc) return desc.get ? desc.get.call(receiver) : desc.value;
              return isObject((proto = getPrototypeOf(target)))
                ? reflectGet(proto, propertyKey, receiver)
                : undefined;
            }
            function reflectSet(target, propertyKey, V) {
              var receiver = arguments.length < 4 ? target : arguments[3],
                desc = getOwnDescriptor(assertObject(target), propertyKey),
                proto;
              if (desc) {
                if (desc.writable === false) return false;
                if (desc.set) return desc.set.call(receiver, V), true;
              }
              if (isObject((proto = getPrototypeOf(target))))
                return reflectSet(proto, propertyKey, V, receiver);
              desc = getOwnDescriptor(receiver, propertyKey) || descriptor(0);
              desc.value = V;
              return defineProperty(receiver, propertyKey, desc), true;
            }
            var isExtensible = Object.isExtensible || returnIt;
            var reflect = {
              apply: ctx(call, apply, 3),
              construct: construct,
              defineProperty: wrap(defineProperty),
              deleteProperty: function (target, propertyKey) {
                var desc = getOwnDescriptor(assertObject(target), propertyKey);
                return desc && !desc.configurable
                  ? false
                  : delete target[propertyKey];
              },
              enumerate: function (target) {
                return new Enumerate(assertObject(target));
              },
              get: reflectGet,
              getOwnPropertyDescriptor: function (target, propertyKey) {
                return getOwnDescriptor(assertObject(target), propertyKey);
              },
              getPrototypeOf: function (target) {
                return getPrototypeOf(assertObject(target));
              },
              has: function (target, propertyKey) {
                return propertyKey in target;
              },
              isExtensible: function (target) {
                return !!isExtensible(assertObject(target));
              },
              ownKeys: ownKeys,
              preventExtensions: wrap(Object.preventExtensions || returnIt),
              set: reflectSet,
            };
            if (setPrototypeOf)
              reflect.setPrototypeOf = function (target, proto) {
                return setPrototypeOf(assertObject(target), proto), true;
              };
            $define(GLOBAL, { Reflect: {} });
            $define(STATIC, "Reflect", reflect);
          })();
          !(function () {
            $define(PROTO, ARRAY, { includes: createArrayContains(true) });
            $define(PROTO, STRING, { at: createPointAt(true) });
            function createObjectToArray(isEntries) {
              return function (object) {
                var O = toObject(object),
                  keys = getKeys(object),
                  length = keys.length,
                  i = 0,
                  result = Array(length),
                  key;
                if (isEntries)
                  while (length > i) result[i] = [(key = keys[i++]), O[key]];
                else while (length > i) result[i] = O[keys[i++]];
                return result;
              };
            }
            $define(STATIC, OBJECT, {
              values: createObjectToArray(false),
              entries: createObjectToArray(true),
            });
            $define(STATIC, REGEXP, {
              escape: createReplacer(/([\\\-[\]{}()*+?.,^$|])/g, "\\$1", true),
            });
          })();
          !(function (REFERENCE) {
            REFERENCE_GET = getWellKnownSymbol(REFERENCE + "Get", true);
            var REFERENCE_SET = getWellKnownSymbol(REFERENCE + SET, true),
              REFERENCE_DELETE = getWellKnownSymbol(REFERENCE + "Delete", true);
            $define(STATIC, SYMBOL, {
              referenceGet: REFERENCE_GET,
              referenceSet: REFERENCE_SET,
              referenceDelete: REFERENCE_DELETE,
            });
            hidden(FunctionProto, REFERENCE_GET, returnThis);
            function setMapMethods(Constructor) {
              if (Constructor) {
                var MapProto = Constructor[PROTOTYPE];
                hidden(MapProto, REFERENCE_GET, MapProto.get);
                hidden(MapProto, REFERENCE_SET, MapProto.set);
                hidden(MapProto, REFERENCE_DELETE, MapProto["delete"]);
              }
            }
            setMapMethods(Map);
            setMapMethods(WeakMap);
          })("reference");
          !(function (NodeList) {
            if (
              framework &&
              NodeList &&
              !(SYMBOL_ITERATOR in NodeList[PROTOTYPE])
            ) {
              hidden(NodeList[PROTOTYPE], SYMBOL_ITERATOR, Iterators[ARRAY]);
            }
            Iterators.NodeList = Iterators[ARRAY];
          })(global.NodeList);
          !(function (arrayStatics) {
            function setArrayStatics(keys, length) {
              forEach.call(array(keys), function (key) {
                if (key in ArrayProto)
                  arrayStatics[key] = ctx(call, ArrayProto[key], length);
              });
            }
            setArrayStatics("pop,reverse,shift,keys,values,entries", 1);
            setArrayStatics(
              "indexOf,every,some,forEach,map,filter,find,findIndex,includes",
              3
            );
            setArrayStatics(
              "join,slice,concat,push,splice,unshift,sort,lastIndexOf," +
                "reduce,reduceRight,copyWithin,fill,turn"
            );
            $define(STATIC, ARRAY, arrayStatics);
          })({});
        })(
          typeof self != "undefined" && self.Math === Math
            ? self
            : Function("return this")(),
          true
        );
      },
      {},
    ],
    3: [
      function (require, module, exports) {
        (function (global) {
          !(function (global) {
            "use strict";
            var hasOwn = Object.prototype.hasOwnProperty;
            var undefined;
            var iteratorSymbol =
              (typeof Symbol === "function" && Symbol.iterator) || "@@iterator";
            var inModule = typeof module === "object";
            var runtime = global.regeneratorRuntime;
            if (runtime) {
              if (inModule) {
                module.exports = runtime;
              }
              return;
            }
            runtime = global.regeneratorRuntime = inModule
              ? module.exports
              : {};
            function wrap(innerFn, outerFn, self, tryList) {
              return new Generator(
                innerFn,
                outerFn,
                self || null,
                tryList || []
              );
            }
            runtime.wrap = wrap;
            function tryCatch(fn, obj, arg) {
              try {
                return { type: "normal", arg: fn.call(obj, arg) };
              } catch (err) {
                return { type: "throw", arg: err };
              }
            }
            var GenStateSuspendedStart = "suspendedStart";
            var GenStateSuspendedYield = "suspendedYield";
            var GenStateExecuting = "executing";
            var GenStateCompleted = "completed";
            var ContinueSentinel = {};
            function GeneratorFunction() {}
            function GeneratorFunctionPrototype() {}
            var Gp = (GeneratorFunctionPrototype.prototype =
              Generator.prototype);
            GeneratorFunction.prototype = Gp.constructor =
              GeneratorFunctionPrototype;
            GeneratorFunctionPrototype.constructor = GeneratorFunction;
            GeneratorFunction.displayName = "GeneratorFunction";
            runtime.isGeneratorFunction = function (genFun) {
              var ctor = typeof genFun === "function" && genFun.constructor;
              return ctor
                ? ctor === GeneratorFunction ||
                    (ctor.displayName || ctor.name) === "GeneratorFunction"
                : false;
            };
            runtime.mark = function (genFun) {
              genFun.__proto__ = GeneratorFunctionPrototype;
              genFun.prototype = Object.create(Gp);
              return genFun;
            };
            runtime.async = function (innerFn, outerFn, self, tryList) {
              return new Promise(function (resolve, reject) {
                var generator = wrap(innerFn, outerFn, self, tryList);
                var callNext = step.bind(generator.next);
                var callThrow = step.bind(generator["throw"]);
                function step(arg) {
                  var record = tryCatch(this, null, arg);
                  if (record.type === "throw") {
                    reject(record.arg);
                    return;
                  }
                  var info = record.arg;
                  if (info.done) {
                    resolve(info.value);
                  } else {
                    Promise.resolve(info.value).then(callNext, callThrow);
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
                  return doneResult();
                }
                while (true) {
                  var delegate = context.delegate;
                  if (delegate) {
                    var record = tryCatch(
                      delegate.iterator[method],
                      delegate.iterator,
                      arg
                    );
                    if (record.type === "throw") {
                      context.delegate = null;
                      method = "throw";
                      arg = record.arg;
                      continue;
                    }
                    method = "next";
                    arg = undefined;
                    var info = record.arg;
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
                  var record = tryCatch(innerFn, self, context);
                  if (record.type === "normal") {
                    state = context.done
                      ? GenStateCompleted
                      : GenStateSuspendedYield;
                    var info = { value: record.arg, done: context.done };
                    if (record.arg === ContinueSentinel) {
                      if (context.delegate && method === "next") {
                        arg = undefined;
                      }
                    } else {
                      return info;
                    }
                  } else if (record.type === "throw") {
                    state = GenStateCompleted;
                    if (method === "next") {
                      context.dispatchException(record.arg);
                    } else {
                      arg = record.arg;
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
              if (iterable) {
                var iteratorMethod = iterable[iteratorSymbol];
                if (iteratorMethod) {
                  return iteratorMethod.call(iterable);
                }
                if (typeof iterable.next === "function") {
                  return iterable;
                }
                if (!isNaN(iterable.length)) {
                  var i = -1,
                    next = function next() {
                      while (++i < iterable.length) {
                        if (hasOwn.call(iterable, i)) {
                          next.value = iterable[i];
                          next.done = false;
                          return next;
                        }
                      }
                      next.value = undefined;
                      next.done = true;
                      return next;
                    };
                  return (next.next = next);
                }
              }
              return { next: doneResult };
            }
            runtime.values = values;
            function doneResult() {
              return { value: undefined, done: true };
            }
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
                    if (record.type === "throw") {
                      var thrown = record.arg;
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
          })(
            typeof global === "object"
              ? global
              : typeof window === "object"
              ? window
              : this
          );
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
  },
  {},
  [1]
);
