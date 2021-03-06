/*! angular-vertxbus - v2.0.0-beta.6 - 2015-05-02
 * http://github.com/knalli/angular-vertxbus
 * Copyright (c) 2015 Jan Philipp; Licensed MIT */
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
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });
        var moduleName = "knalli.angular-vertxbus";

        exports.moduleName = moduleName;
      },
      {},
    ],
    2: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _moduleName = require("./config");

        require("./vertxbus-module");

        require("./vertxbus-wrapper");

        require("./vertxbus-service");

        exports["default"] = _moduleName.moduleName;
        module.exports = exports["default"];
      },
      {
        "./config": 1,
        "./vertxbus-module": 12,
        "./vertxbus-service": 13,
        "./vertxbus-wrapper": 14,
      },
    ],
    3: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        /*
 Simple queue implementation

 FIFO: #push() + #first()
 LIFO: #push() + #last()
 */

        var Queue = (function () {
          function Queue() {
            var maxSize = arguments[0] === undefined ? 10 : arguments[0];

            _classCallCheck(this, Queue);

            this.maxSize = maxSize;
            this.items = [];
          }

          _createClass(Queue, [
            {
              key: "push",
              value: function push(item) {
                this.items.push(item);
                return this.recalibrateBufferSize();
              },
            },
            {
              key: "recalibrateBufferSize",
              value: function recalibrateBufferSize() {
                while (this.items.length > this.maxSize) {
                  this.first();
                }
                return this;
              },
            },
            {
              key: "last",
              value: function last() {
                return this.items.pop();
              },
            },
            {
              key: "first",
              value: function first() {
                return this.items.shift(0);
              },
            },
            {
              key: "size",
              value: function size() {
                return this.items.length;
              },
            },
          ]);

          return Queue;
        })();

        exports["default"] = Queue;
        module.exports = exports["default"];
      },
      {},
    ],
    4: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        /*
 Simple Map implementation

 This implementation allows usage of non serializable keys for values.
 */

        var SimpleMap = (function () {
          function SimpleMap() {
            _classCallCheck(this, SimpleMap);

            this.clear();
          }

          _createClass(SimpleMap, [
            {
              key: "put",

              // Stores the value under the key.
              // Chainable
              value: function put(key, value) {
                var idx = this._indexForKey(key);
                if (idx > -1) {
                  this.values[idx] = value;
                } else {
                  this.keys.push(key);
                  this.values.push(value);
                }
                return this;
              },
            },
            {
              key: "get",

              // Returns value for key, otherwise undefined.
              value: function get(key) {
                var idx = this._indexForKey(key);
                if (idx > -1) {
                  return this.values[idx];
                }
              },
            },
            {
              key: "containsKey",

              // Returns true if the key exists.
              value: function containsKey(key) {
                var idx = this._indexForKey(key);
                return idx > -1;
              },
            },
            {
              key: "containsValue",

              // Returns true if the value exists.
              value: function containsValue(value) {
                var idx = this._indexForValue(value);
                return idx > -1;
              },
            },
            {
              key: "remove",

              // Removes the key and its value.
              value: function remove(key) {
                var idx = this._indexForKey(key);
                if (idx > -1) {
                  this.keys[idx] = undefined;
                  this.values[idx] = undefined;
                }
              },
            },
            {
              key: "clear",

              // Clears all keys and values.
              value: function clear() {
                this.keys = [];
                this.values = [];
                return this;
              },
            },
            {
              key: "_indexForKey",

              // Returns index of key, otherwise -1.
              value: function _indexForKey(key) {
                for (var i in this.keys) {
                  if (key === this.keys[i]) {
                    return i;
                  }
                }
                return -1;
              },
            },
            {
              key: "_indexForValue",
              value: function _indexForValue(value) {
                for (var i in this.values) {
                  if (value === this.values[i]) {
                    return i;
                  }
                }
                return -1;
              },
            },
          ]);

          return SimpleMap;
        })();

        exports["default"] = SimpleMap;
        module.exports = exports["default"];
      },
      {},
    ],
    5: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _moduleName = require("../../config.js");

        var InterfaceService = (function () {
          function InterfaceService(delegate, $log) {
            var _this = this;

            _classCallCheck(this, InterfaceService);

            this.delegate = delegate;
            this.$log = $log;
            this.handlers = [];
            this.delegate.observe({
              afterEventbusConnected: function afterEventbusConnected() {
                return _this.afterEventbusConnected();
              },
            });
          }

          _createClass(InterfaceService, [
            {
              key: "afterEventbusConnected",
              value: function afterEventbusConnected() {
                for (var address in this.handlers) {
                  var callbacks = this.handlers[address];
                  if (callbacks && callbacks.length) {
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                      for (
                        var _iterator = callbacks[Symbol.iterator](), _step;
                        !(_iteratorNormalCompletion = (_step = _iterator.next())
                          .done);
                        _iteratorNormalCompletion = true
                      ) {
                        var callback = _step.value;

                        this.delegate.registerHandler(address, callback);
                      }
                    } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                          _iterator["return"]();
                        }
                      } finally {
                        if (_didIteratorError) {
                          throw _iteratorError;
                        }
                      }
                    }
                  }
                }
              },
            },
            {
              key: "registerHandler",
              value: function registerHandler(address, callback) {
                var _this2 = this;

                if (!this.handlers[address]) {
                  this.handlers[address] = [];
                }
                this.handlers[address].push(callback);
                var unregisterFn = null;
                if (this.delegate.isConnectionOpen()) {
                  this.delegate.registerHandler(address, callback);
                  unregisterFn = function () {
                    return _this2.delegate.unregisterHandler(address, callback);
                  };
                }
                // and return the deregister callback
                var deconstructor = function deconstructor() {
                  if (unregisterFn) {
                    unregisterFn();
                    unregisterFn = undefined;
                  }
                  // Remove from internal map
                  if (_this2.handlers[address]) {
                    var index = _this2.handlers[address].indexOf(callback);
                    if (index > -1) {
                      _this2.handlers[address].splice(index, 1);
                    }
                    if (_this2.handlers[address].length < 1) {
                      _this2.handlers[address] = undefined;
                    }
                  }
                };
                deconstructor.displayName =
                  "" +
                  _moduleName.moduleName +
                  ".service.registerHandler.deconstructor";
                return deconstructor;
              },
            },
            {
              key: "on",
              value: function on(address, callback) {
                return this.registerHandler(address, callback);
              },
            },
            {
              key: "addListener",
              value: function addListener(address, callback) {
                return this.registerHandler(address, callback);
              },
            },
            {
              key: "unregisterHandler",
              value: function unregisterHandler(address, callback) {
                // Remove from internal map
                if (this.handlers[address]) {
                  var index = this.handlers[address].indexOf(callback);
                  if (index > -1) {
                    this.handlers[address].splice(index, 1);
                  }
                  if (this.handlers[address].length < 1) {
                    this.handlers[address] = undefined;
                  }
                }
                // Remove from real instance
                if (this.delegate.isConnectionOpen()) {
                  this.delegate.unregisterHandler(address, callback);
                }
              },
            },
            {
              key: "un",
              value: function un(address, callback) {
                return this.unregisterHandler(address, callback);
              },
            },
            {
              key: "removeListener",
              value: function removeListener(address, callback) {
                return this.unregisterHandler(address, callback);
              },
            },
            {
              key: "send",
              value: function send(address, message) {
                var options = arguments[2] === undefined ? {} : arguments[2];

                // FALLBACK: signature change since 2.0
                if (!angular.isObject(options)) {
                  this.$log.error(
                    "" +
                      _moduleName.moduleName +
                      ": Signature of vertxEventBusService.send() has been changed!"
                  );
                  return this.send(address, message, {
                    timeout: arguments[2] !== undefined ? arguments[2] : 10000,
                    expectReply:
                      arguments[3] !== undefined ? arguments[3] : true,
                  });
                }

                return this.delegate.send(
                  address,
                  message,
                  options.timeout,
                  options.expectReply
                );
              },
            },
            {
              key: "publish",
              value: function publish(address, message) {
                return this.delegate.publish(address, message);
              },
            },
            {
              key: "emit",
              value: function emit(address, message) {
                return this.publish(address, message);
              },
            },
            {
              key: "getConnectionState",
              value: function getConnectionState() {
                return this.delegate.getConnectionState();
              },
            },
            {
              key: "readyState",
              value: function readyState() {
                return this.getConnectionState();
              },
            },
            {
              key: "isEnabled",
              value: function isEnabled() {
                return this.delegate.isEnabled();
              },
            },
            {
              key: "isConnected",
              value: function isConnected() {
                return this.delegate.isConnected();
              },
            },
            {
              key: "login",
              value: function login(username, password, timeout) {
                return this.delegate.login(username, password, timeout);
              },
            },
          ]);

          return InterfaceService;
        })();

        exports["default"] = InterfaceService;
        module.exports = exports["default"];
      },
      { "../../config.js": 1 },
    ],
    6: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var BaseDelegate = (function () {
          function BaseDelegate() {
            _classCallCheck(this, BaseDelegate);
          }

          _createClass(BaseDelegate, [
            {
              key: "getConnectionState",
              value: function getConnectionState() {
                return 3; // CLOSED
              },
            },
            {
              key: "isConnectionOpen",
              value: function isConnectionOpen() {
                return false;
              },
            },
            {
              key: "isValidSession",
              value: function isValidSession() {
                return false;
              },
            },
            {
              key: "isEnabled",
              value: function isEnabled() {
                return false;
              },
            },
            {
              key: "isConnected",
              value: function isConnected() {
                return false;
              },
            },
            {
              key: "send",
              value: function send() {},
            },
            {
              key: "publish",
              value: function publish() {},
            },
          ]);

          return BaseDelegate;
        })();

        exports["default"] = BaseDelegate;
        module.exports = exports["default"];
      },
      {},
    ],
    7: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _get = function get(_x6, _x7, _x8) {
          var _again = true;
          _function: while (_again) {
            desc = parent = getter = undefined;
            _again = false;
            var object = _x6,
              property = _x7,
              receiver = _x8;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === undefined) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return undefined;
              } else {
                _x6 = parent;
                _x7 = property;
                _x8 = receiver;
                _again = true;
                continue _function;
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === undefined) {
                return undefined;
              }
              return getter.call(receiver);
            }
          }
        };

        var _inherits = function (subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass) subClass.__proto__ = superClass;
        };

        var _moduleName = require("../../../config.js");

        var _Queue = require("./../../helpers/Queue");

        var _Queue2 = _interopRequireDefault(_Queue);

        var _SimpleMap = require("./../../helpers/SimpleMap");

        var _SimpleMap2 = _interopRequireDefault(_SimpleMap);

        var _BaseDelegate2 = require("./Base");

        var _BaseDelegate3 = _interopRequireDefault(_BaseDelegate2);

        /**
         * @ngdoc event
         * @module knalli.angular-vertxbus
         * @eventOf knalli.angular-vertxbus.vertxEventBusService
         * @eventType broadcast on $rootScope
         * @name disconnected
         *
         * @description
         * After a connection was being terminated.
         *
         * Event name is `prefix + 'system.disconnected'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
         */

        /**
         * @ngdoc event
         * @module knalli.angular-vertxbus
         * @eventOf knalli.angular-vertxbus.vertxEventBusService
         * @eventType broadcast on $rootScope
         * @name connected
         *
         * @description
         * After a connection was being established
         *
         * Event name is `prefix + 'system.connected'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
         */

        /**
         * @ngdoc event
         * @module knalli.angular-vertxbus
         * @eventOf knalli.angular-vertxbus.vertxEventBusService
         * @eventType broadcast on $rootScope
         * @name login-succeeded
         *
         * @description
         * After a login has been validated successfully
         *
         * Event name is `prefix + 'system.login.succeeded'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
         *
         * @param {object} data data
         * @param {boolean} data.status must be `'ok'`
         */

        /**
         * @ngdoc event
         * @module knalli.angular-vertxbus
         * @eventOf knalli.angular-vertxbus.vertxEventBusService
         * @eventType broadcast on $rootScope
         * @name login-failed
         *
         * @description
         * After a login has been destroyed or was invalidated
         *
         * Event name is `prefix + 'system.login.failed'` (see {@link knalli.angular-vertxbus.vertxEventBusServiceProvider#methods_usePrefix prefix})
         *
         * @param {object} data data
         * @param {boolean} data.status must be not`'ok'`
         */

        var LiveDelegate = (function (_BaseDelegate) {
          function LiveDelegate(
            $rootScope,
            $interval,
            $log,
            $q,
            eventBus,
            _ref
          ) {
            var enabled = _ref.enabled;
            var debugEnabled = _ref.debugEnabled;
            var prefix = _ref.prefix;
            var sockjsStateInterval = _ref.sockjsStateInterval;
            var messageBuffer = _ref.messageBuffer;
            var loginRequired = _ref.loginRequired;

            _classCallCheck(this, LiveDelegate);

            _get(
              Object.getPrototypeOf(LiveDelegate.prototype),
              "constructor",
              this
            ).call(this);
            this.$rootScope = $rootScope;
            this.$interval = $interval;
            this.$log = $log;
            this.$q = $q;
            this.eventBus = eventBus;
            this.options = {
              enabled: enabled,
              debugEnabled: debugEnabled,
              prefix: prefix,
              sockjsStateInterval: sockjsStateInterval,
              messageBuffer: messageBuffer,
              loginRequired: loginRequired,
            };
            this.connectionState = this.eventBus.EventBus.CLOSED;
            this.states = {
              connected: false,
              validSession: false,
            };
            this.observers = [];
            // internal store of buffered messages
            this.messageQueue = new _Queue2["default"](
              this.options.messageBuffer
            );
            // internal map of callbacks
            this.callbackMap = new _SimpleMap2["default"]();
            // asap
            this.initialize();
          }

          _inherits(LiveDelegate, _BaseDelegate);

          _createClass(LiveDelegate, [
            {
              key: "initialize",

              // internal
              value: function initialize() {
                var _this2 = this;

                this.eventBus.onopen = function () {
                  return _this2.onEventbusOpen();
                };
                this.eventBus.onclose = function () {
                  return _this2.onEventbusClose();
                };

                // Update the current connection state periodically.
                var connectionIntervalCheck =
                  function connectionIntervalCheck() {
                    return _this2.getConnectionState(true);
                  };
                connectionIntervalCheck.displayName = "connectionIntervalCheck";
                this.$interval(function () {
                  return connectionIntervalCheck();
                }, this.options.sockjsStateInterval);
              },
            },
            {
              key: "onEventbusOpen",

              // internal
              value: function onEventbusOpen() {
                this.getConnectionState(true);
                if (!this.states.connected) {
                  this.states.connected = true;
                  this.$rootScope.$broadcast(
                    "" + this.options.prefix + "system.connected"
                  );
                }
                this.afterEventbusConnected();
                this.$rootScope.$digest();
                // consume message queue?
                if (this.options.messageBuffer && this.messageQueue.size()) {
                  while (this.messageQueue.size()) {
                    var fn = this.messageQueue.first();
                    if (angular.isFunction(fn)) {
                      fn();
                    }
                  }
                  this.$rootScope.$digest();
                }
              },
            },
            {
              key: "onEventbusClose",

              // internal
              value: function onEventbusClose() {
                this.getConnectionState(true);
                if (this.states.connected) {
                  this.states.connected = false;
                  this.$rootScope.$broadcast(
                    "" + this.options.prefix + "system.disconnected"
                  );
                }
              },
            },
            {
              key: "observe",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#observe
               *
               * @description
               * Adds an observer
               *
               * @param {object} observer observer
               * @param {function=} observer.afterEventbusConnected will be called after establishing a new connection
               */
              value: function observe(observer) {
                this.observers.push(observer);
              },
            },
            {
              key: "afterEventbusConnected",

              // internal
              value: function afterEventbusConnected() {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                  for (
                    var _iterator = this.observers[Symbol.iterator](), _step;
                    !(_iteratorNormalCompletion = (_step = _iterator.next())
                      .done);
                    _iteratorNormalCompletion = true
                  ) {
                    var observer = _step.value;

                    if (angular.isFunction(observer.afterEventbusConnected)) {
                      observer.afterEventbusConnected();
                    }
                  }
                } catch (err) {
                  _didIteratorError = true;
                  _iteratorError = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                      _iterator["return"]();
                    }
                  } finally {
                    if (_didIteratorError) {
                      throw _iteratorError;
                    }
                  }
                }
              },
            },
            {
              key: "registerHandler",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#registerHandler
               *
               * @description
               * Registers a callback handler for the specified address match.
               *
               * @param {string} address target address
               * @param {function} callback handler with params `(message, replyTo)`
               * @returns {function=} deconstructor
               */
              value: function registerHandler(address, callback) {
                var _this3 = this;

                if (!angular.isFunction(callback)) {
                  return;
                }
                if (this.options.debugEnabled) {
                  this.$log.debug(
                    "[Vert.x EB Service] Register handler for " + address
                  );
                }
                var callbackWrapper = function callbackWrapper(
                  message,
                  replyTo
                ) {
                  callback(message, replyTo);
                  _this3.$rootScope.$digest();
                };
                callbackWrapper.displayName =
                  "" +
                  _moduleName.moduleName +
                  ".service.delegate.live.registerHandler.callbackWrapper";
                this.callbackMap.put(callback, callbackWrapper);
                return this.eventBus.registerHandler(address, callbackWrapper);
              },
            },
            {
              key: "unregisterHandler",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#unregisterHandler
               *
               * @description
               * Removes a callback handler for the specified address match.
               *
               * @param {string} address target address
               * @param {function} callback handler with params `(message, replyTo)`
               */
              value: function unregisterHandler(address, callback) {
                if (!angular.isFunction(callback)) {
                  return;
                }
                if (this.options.debugEnabled) {
                  this.$log.debug(
                    "[Vert.x EB Service] Unregister handler for " + address
                  );
                }
                this.eventBus.unregisterHandler(
                  address,
                  this.callbackMap.get(callback)
                );
                this.callbackMap.remove(callback);
              },
            },
            {
              key: "send",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#send
               *
               * @description
               * Sends a message to the specified address (using {@link knalli.angular-vertxbus.vertxEventBus#methods_send vertxEventBus.send()}).
               *
               * @param {string} address target address
               * @param {object} message payload message
               * @param {number=} [timeout=10000] timeout (in ms) after which the promise will be rejected
               * @param {boolean=} [expectReply=true] if false, the promise will be resolved directly and
               *                                       no replyHandler will be created
               * @returns {object} promise
               */
              value: function send(address, message) {
                var _this4 = this;

                var timeout = arguments[2] === undefined ? 10000 : arguments[2];
                var expectReply =
                  arguments[3] === undefined ? true : arguments[3];

                var deferred = this.$q.defer();
                var next = function next() {
                  if (expectReply) {
                    (function () {
                      // Register timeout for promise rejecting
                      var timer = _this4.$interval(
                        function () {
                          if (_this4.options.debugEnabled) {
                            _this4.$log.debug(
                              "[Vert.x EB Service] send('" +
                                address +
                                "') timed out"
                            );
                          }
                          deferred.reject();
                        },
                        timeout,
                        1
                      );
                      // Send message
                      _this4.eventBus.send(address, message, function (reply) {
                        _this4.$interval.cancel(timer); // because it's resolved
                        deferred.resolve(reply);
                      });
                    })();
                  } else {
                    _this4.eventBus.send(address, message);
                    deferred.resolve(); // we don't care
                  }
                };
                next.displayName =
                  "" +
                  _moduleName.moduleName +
                  ".service.delegate.live.send.next";
                if (!this.ensureOpenAuthConnection(next)) {
                  deferred.reject();
                }
                return deferred.promise;
              },
            },
            {
              key: "publish",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#publish
               *
               * @description
               * Publishes a message to the specified address (using {@link knalli.angular-vertxbus.vertxEventBus#methods_publish vertxEventBus.publish()}).
               *
               * @param {string} address target address
               * @param {object} message payload message
               * @returns {boolean} false if cannot be send or queued
               */
              value: function publish(address, message) {
                var _this5 = this;

                return this.ensureOpenAuthConnection(function () {
                  return _this5.eventBus.publish(address, message);
                });
              },
            },
            {
              key: "login",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#login
               *
               * @description
               * Sends a login request
               *
               * See also
               * - {@link knalli.angular-vertxbus.vertxEventBus#methods_login vertxEventBus.login()}
               *
               * @param {string} username credential's username
               * @param {string} password credential's password
               * @param {number=} [timeout=5000] timeout
               * @returns {object} promise
               */
              value: function login() {
                var _this6 = this;

                var username =
                  arguments[0] === undefined
                    ? this.options.username
                    : arguments[0];
                var password =
                  arguments[1] === undefined
                    ? this.options.password
                    : arguments[1];
                var timeout = arguments[2] === undefined ? 5000 : arguments[2];

                var deferred = this.$q.defer();
                var next = function next(reply) {
                  if (reply && reply.status === "ok") {
                    _this6.states.validSession = true;
                    deferred.resolve(reply);
                    _this6.$rootScope.$broadcast(
                      "" + _this6.options.prefix + "system.login.succeeded",
                      { status: reply.status }
                    );
                  } else {
                    _this6.states.validSession = false;
                    deferred.reject(reply);
                    _this6.$rootScope.$broadcast(
                      "" + _this6.options.prefix + "system.login.failed",
                      { status: reply.status }
                    );
                  }
                };
                next.displayName =
                  "" +
                  _moduleName.moduleName +
                  ".service.delegate.live.login.next";
                this.eventBus.login(username, password, next);
                this.$interval(
                  function () {
                    return deferred.reject();
                  },
                  timeout,
                  1
                );
                return deferred.promise;
              },
            },
            {
              key: "ensureOpenConnection",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#ensureOpenConnection
               *
               * @description
               * Ensures the callback will be performed with an open connection.
               *
               * Unless an open connection was found, the callback will be queued in the message buffer (if available).
               *
               * @param {function} fn callback
               * @returns {boolean} false if the callback cannot be performed or queued
               */
              value: function ensureOpenConnection(fn) {
                if (this.isConnectionOpen()) {
                  fn();
                  return true;
                } else if (this.options.messageBuffer) {
                  this.messageQueue.push(fn);
                  return true;
                }
                return false;
              },
            },
            {
              key: "ensureOpenAuthConnection",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#ensureOpenAuthConnection
               *
               * @description
               * Ensures the callback will be performed with a valid session.
               *
               * Unless `loginRequired` is enabled, this will be simple forward.
               *
               * Unless a valid session exist (but required), the callback will be not invoked.
               *
               * @param {function} fn callback
               * @returns {boolean} false if the callback cannot be performed or queued
               */
              value: function ensureOpenAuthConnection(fn) {
                var _this7 = this;

                if (!this.options.loginRequired) {
                  // easy: no login required
                  return this.ensureOpenConnection(fn);
                } else {
                  var fnWrapper = function fnWrapper() {
                    if (_this7.states.validSession) {
                      fn();
                      return true;
                    } else {
                      // ignore this message
                      if (_this7.options.debugEnabled) {
                        _this7.$log.debug(
                          "[Vert.x EB Service] Message was not sent because login is required"
                        );
                      }
                      return false;
                    }
                  };
                  fnWrapper.displayName =
                    "" +
                    _moduleName.moduleName +
                    ".service.delegate.live.ensureOpenAuthConnection.fnWrapper";
                  return this.ensureOpenConnection(fnWrapper);
                }
              },
            },
            {
              key: "getConnectionState",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#getConnectionState
               *
               * @description
               * Returns the current connection state. The state is being cached internally.
               *
               * @param {boolean=} [immediate=false] if true, the connection state will be queried directly.
               * @returns {number} state type of vertx.EventBus
               */
              value: function getConnectionState(immediate) {
                if (this.options.enabled) {
                  if (immediate) {
                    this.connectionState = this.eventBus.readyState();
                  }
                } else {
                  this.connectionState = this.eventBus.EventBus.CLOSED;
                }
                return this.connectionState;
              },
            },
            {
              key: "isConnectionOpen",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#isConnectionOpen
               *
               * @description
               * Returns true if the current connection state ({@link knalli.angular-vertxbus.vertxEventBusService#methods_getConnectionState getConnectionState()}) is `OPEN`.
               *
               * @returns {boolean} connection open state
               */
              value: function isConnectionOpen() {
                return (
                  this.getConnectionState() === this.eventBus.EventBus.OPEN
                );
              },
            },
            {
              key: "isValidSession",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#isValidSession
               *
               * @description
               * Returns true if the session is valid
               *
               * @returns {boolean} state
               */
              value: function isValidSession() {
                return this.states.validSession;
              },
            },
            {
              key: "isConnected",

              // internal
              value: function isConnected() {
                return this.states.connected;
              },
            },
            {
              key: "isEnabled",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#isEnabled
               *
               * @description
               * Returns true if service is being enabled.
               *
               * @returns {boolean} state
               */
              value: function isEnabled() {
                return this.options.enabled;
              },
            },
            {
              key: "getMessageQueueLength",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBusService
               * @name .#isConnectionOpen
               *
               * @description
               * Returns the current amount of messages in the internal buffer.
               *
               * @returns {number} amount
               */
              value: function getMessageQueueLength() {
                return this.messageQueue.size();
              },
            },
          ]);

          return LiveDelegate;
        })(_BaseDelegate3["default"]);

        exports["default"] = LiveDelegate;
        module.exports = exports["default"];
      },
      {
        "../../../config.js": 1,
        "./../../helpers/Queue": 3,
        "./../../helpers/SimpleMap": 4,
        "./Base": 6,
      },
    ],
    8: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _inherits = function (subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass) subClass.__proto__ = superClass;
        };

        var _BaseDelegate2 = require("./Base");

        var _BaseDelegate3 = _interopRequireDefault(_BaseDelegate2);

        var NoopDelegate = (function (_BaseDelegate) {
          function NoopDelegate() {
            _classCallCheck(this, NoopDelegate);

            if (_BaseDelegate != null) {
              _BaseDelegate.apply(this, arguments);
            }
          }

          _inherits(NoopDelegate, _BaseDelegate);

          return NoopDelegate;
        })(_BaseDelegate3["default"]);

        exports["default"] = NoopDelegate;
        module.exports = exports["default"];
      },
      { "./Base": 6 },
    ],
    9: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var BaseWrapper = (function () {
          function BaseWrapper() {
            _classCallCheck(this, BaseWrapper);
          }

          _createClass(BaseWrapper, [
            {
              key: "connect",
              value: function connect() {},
            },
            {
              key: "reconnect",
              value: function reconnect() {},
            },
            {
              key: "close",
              value: function close() {},
            },
            {
              key: "login",
              value: function login(username, password, replyHandler) {},
            },
            {
              key: "send",
              value: function send(address, message, replyHandler) {},
            },
            {
              key: "publish",
              value: function publish(address, message) {},
            },
            {
              key: "registerHandler",
              value: function registerHandler(address, handler) {},
            },
            {
              key: "unregisterHandler",
              value: function unregisterHandler(address, handler) {},
            },
            {
              key: "readyState",
              value: function readyState() {},
            },
            {
              key: "getOptions",
              value: function getOptions() {
                return {};
              },
            },
            {
              key: "onopen",

              // empty: can be overriden by externals
              value: function onopen() {},
            },
            {
              key: "onclose",

              // empty: can be overriden by externals
              value: function onclose() {},
            },
          ]);

          return BaseWrapper;
        })();

        exports["default"] = BaseWrapper;
        module.exports = exports["default"];
      },
      {},
    ],
    10: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _createClass = (function () {
          function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
              var descriptor = props[i];
              descriptor.enumerable = descriptor.enumerable || false;
              descriptor.configurable = true;
              if ("value" in descriptor) descriptor.writable = true;
              Object.defineProperty(target, descriptor.key, descriptor);
            }
          }
          return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
          };
        })();

        var _get = function get(_x2, _x3, _x4) {
          var _again = true;
          _function: while (_again) {
            desc = parent = getter = undefined;
            _again = false;
            var object = _x2,
              property = _x3,
              receiver = _x4;
            var desc = Object.getOwnPropertyDescriptor(object, property);
            if (desc === undefined) {
              var parent = Object.getPrototypeOf(object);
              if (parent === null) {
                return undefined;
              } else {
                _x2 = parent;
                _x3 = property;
                _x4 = receiver;
                _again = true;
                continue _function;
              }
            } else if ("value" in desc) {
              return desc.value;
            } else {
              var getter = desc.get;
              if (getter === undefined) {
                return undefined;
              }
              return getter.call(receiver);
            }
          }
        };

        var _inherits = function (subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass) subClass.__proto__ = superClass;
        };

        var _moduleName = require("../../config.js");

        var _BaseWrapper2 = require("./Base");

        var _BaseWrapper3 = _interopRequireDefault(_BaseWrapper2);

        /**
         * @ngdoc service
         * @module vertx
         * @name vertx.EventBus
         *
         * @description
         * This is the interface of `vertx.EventBus`. It is not included.
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#close
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#login
         *
         * @param {string} username credential's username
         * @param {string} password credential's password
         * @param {function=} replyHandler optional callback
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#send
         *
         * @param {string} address target address
         * @param {object} message payload message
         * @param {function=} replyHandler optional callback
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#publish
         *
         * @param {string} address target address
         * @param {object} message payload message
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#registerHandler
         *
         * @param {string} address target address
         * @param {function} handler callback handler
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#unregisterHandler
         *
         * @param {string} address target address
         * @param {function} handler callback handler to be removed
         */

        /**
         * @ngdoc method
         * @module vertx
         * @methodOf vertx.EventBus
         * @name .#readyState
         *
         * @returns {number} value of vertxbus connection states
         */

        var EventbusWrapper = (function (_BaseWrapper) {
          function EventbusWrapper(EventBus, $timeout, $log, _ref) {
            var enabled = _ref.enabled;
            var debugEnabled = _ref.debugEnabled;
            var urlServer = _ref.urlServer;
            var urlPath = _ref.urlPath;
            var reconnectEnabled = _ref.reconnectEnabled;
            var sockjsReconnectInterval = _ref.sockjsReconnectInterval;
            var sockjsOptions = _ref.sockjsOptions;

            _classCallCheck(this, EventbusWrapper);

            _get(
              Object.getPrototypeOf(EventbusWrapper.prototype),
              "constructor",
              this
            ).call(this);
            // actual EventBus type
            this.EventBus = EventBus;
            this.$timeout = $timeout;
            this.$log = $log;
            this.options = {
              enabled: enabled,
              debugEnabled: debugEnabled,
              urlServer: urlServer,
              urlPath: urlPath,
              reconnectEnabled: reconnectEnabled,
              sockjsReconnectInterval: sockjsReconnectInterval,
              sockjsOptions: sockjsOptions,
            };
            this.disconnectTimeoutEnabled = true;
            // asap create connection
            this.connect();
          }

          _inherits(EventbusWrapper, _BaseWrapper);

          _createClass(EventbusWrapper, [
            {
              key: "connect",
              value: function connect() {
                var _this2 = this;

                var url =
                  "" + this.options.urlServer + "" + this.options.urlPath;
                if (this.options.debugEnabled) {
                  this.$log.debug(
                    "[Vert.x EB Stub] Enabled: connecting '" + url + "'"
                  );
                }
                // Because we have rebuild an EventBus object (because it have to rebuild a SockJS object)
                // we must wrap the object. Therefore, we have to mimic the behavior of onopen and onclose each time.
                this.instance = new this.EventBus(
                  url,
                  undefined,
                  this.options.sockjsOptions
                );
                this.instance.onopen = function () {
                  if (_this2.options.debugEnabled) {
                    _this2.$log.debug("[Vert.x EB Stub] Connected");
                  }
                  if (angular.isFunction(_this2.onopen)) {
                    _this2.onopen();
                  }
                };
                // instance onClose handler
                this.instance.onclose = function () {
                  if (_this2.options.debugEnabled) {
                    _this2.$log.debug(
                      "[Vert.x EB Stub] Reconnect in " +
                        _this2.options.sockjsReconnectInterval +
                        "ms"
                    );
                  }
                  if (angular.isFunction(_this2.onclose)) {
                    _this2.onclose();
                  }
                  _this2.instance = undefined;

                  if (!_this2.disconnectTimeoutEnabled) {
                    // reconnect required asap
                    if (_this2.options.debugEnabled) {
                      _this2.$log.debug(
                        "[Vert.x EB Stub] Reconnect immediately"
                      );
                    }
                    _this2.disconnectTimeoutEnabled = true;
                    _this2.connect();
                  } else if (_this2.options.reconnectEnabled) {
                    // automatical reconnect after timeout
                    if (_this2.options.debugEnabled) {
                      _this2.$log.debug(
                        "[Vert.x EB Stub] Reconnect in " +
                          _this2.options.sockjsReconnectInterval +
                          "ms"
                      );
                    }
                    _this2.$timeout(function () {
                      return _this2.connect();
                    }, _this2.options.sockjsReconnectInterval);
                  }
                };
              },
            },
            {
              key: "reconnect",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#reconnect
               *
               * @description
               * Reconnects the underlying connection.
               *
               * Unless a connection is open, it will connect using a new one.
               *
               * If a connection is already open, it will close this one and opens a new one. If `immediately` is `true`, the
               * default timeout for reconnect will be skipped.
               *
               * @param {boolean} [immediately=false] optionally enforce a reconnect asap instead of using the timeout
               */
              value: function reconnect() {
                var immediately =
                  arguments[0] === undefined ? false : arguments[0];

                if (
                  this.instance &&
                  this.instance.readyState() === this.EventBus.OPEN
                ) {
                  if (immediately) {
                    this.disconnectTimeoutEnabled = false;
                  }
                  this.instance.close();
                } else {
                  this.connect();
                }
              },
            },
            {
              key: "close",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#close
               *
               * @description
               * Closes the underlying connection.
               *
               * Note: If automatic reconnection is active, a new connection will be established after the {@link knalli.angular-vertxbus.vertxEventBusProvider#methods_useReconnect reconnect timeout}.
               *
               * See also:
               * - {@link vertx.EventBus#methods_close vertx.EventBus.close()}
               */
              value: function close() {
                if (this.instance) {
                  this.instance.close();
                }
              },
            },
            {
              key: "login",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#login
               *
               * @description
               * Sends a login request against the vertxbus
               *
               * See also:
               * - {@link vertx.EventBus#methods_login vertx.EventBus.login()}
               *
               * @param {string} username credential's username
               * @param {string} password credential's password
               * @param {function=} replyHandler optional callback
               */
              value: function login(username, password, replyHandler) {
                if (this.instance) {
                  this.instance.login(username, password, replyHandler);
                }
              },
            },
            {
              key: "send",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#send
               *
               * @description
               * Sends a message
               *
               * See also:
               * - {@link vertx.EventBus#methods_send vertx.EventBus.send()}
               *
               * @param {string} address target address
               * @param {object} message payload message
               * @param {function=} replyHandler optional callback
               */
              value: function send(address, message, replyHandler) {
                if (this.instance) {
                  this.instance.send(address, message, replyHandler);
                }
              },
            },
            {
              key: "publish",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#publish
               *
               * @description
               * Publishes a message
               *
               * See also:
               * - {@link vertx.EventBus#methods_publish vertx.EventBus.publish()}
               *
               * @param {string} address target address
               * @param {object} message payload message
               */
              value: function publish(address, message) {
                if (this.instance) {
                  this.instance.publish(address, message);
                }
              },
            },
            {
              key: "registerHandler",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#registerHandler
               *
               * @description
               * Registers a listener
               *
               * See also:
               * - {@link vertx.EventBus#methods_registerHandler vertx.EventBus.registerHandler()}
               *
               * @param {string} address target address
               * @param {function} handler callback handler
               */
              value: function registerHandler(address, handler) {
                var _this3 = this;

                if (this.instance) {
                  this.instance.registerHandler(address, handler);
                  // and return the deregister callback
                  var deconstructor = function deconstructor() {
                    _this3.unregisterHandler(address, handler);
                  };
                  deconstructor.displayName =
                    "" +
                    _moduleName.moduleName +
                    ".wrapper.eventbus.registerHandler.deconstructor";
                  return deconstructor;
                }
              },
            },
            {
              key: "unregisterHandler",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#unregisterHandler
               *
               * @description
               * Removes a registered a listener
               *
               * See also:
               * - {@link vertx.EventBus#methods_unregisterHandler vertx.EventBus.unregisterHandler()}
               *
               * @param {string} address target address
               * @param {function} handler callback handler to be removed
               */
              value: function unregisterHandler(address, handler) {
                if (
                  this.instance &&
                  this.instance.readyState() === this.EventBus.OPEN
                ) {
                  this.instance.unregisterHandler(address, handler);
                }
              },
            },
            {
              key: "readyState",

              /**
               * @ngdoc method
               * @module knalli.angular-vertxbus
               * @methodOf knalli.angular-vertxbus.vertxEventBus
               * @name .#readyState
               *
               * @description
               * Returns the current connection state
               *
               * See also:
               * - {@link vertx.EventBus#methods_readyState vertx.EventBus.readyState()}
               *
               * @returns {number} value of vertxbus connection states
               */
              value: function readyState() {
                if (this.instance) {
                  return this.instance.readyState();
                } else {
                  return this.EventBus.CLOSED;
                }
              },
            },
            {
              key: "getOptions",

              // private
              value: function getOptions() {
                // clone options
                return angular.extend({}, this.options);
              },
            },
          ]);

          return EventbusWrapper;
        })(_BaseWrapper3["default"]);

        exports["default"] = EventbusWrapper;
        module.exports = exports["default"];
      },
      { "../../config.js": 1, "./Base": 9 },
    ],
    11: [
      function (require, module, exports) {
        "use strict";

        Object.defineProperty(exports, "__esModule", {
          value: true,
        });

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _classCallCheck = function (instance, Constructor) {
          if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
          }
        };

        var _inherits = function (subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
            throw new TypeError(
              "Super expression must either be null or a function, not " +
                typeof superClass
            );
          }
          subClass.prototype = Object.create(
            superClass && superClass.prototype,
            {
              constructor: {
                value: subClass,
                enumerable: false,
                writable: true,
                configurable: true,
              },
            }
          );
          if (superClass) subClass.__proto__ = superClass;
        };

        var _BaseWrapper2 = require("./Base");

        var _BaseWrapper3 = _interopRequireDefault(_BaseWrapper2);

        var NoopWrapper = (function (_BaseWrapper) {
          function NoopWrapper() {
            _classCallCheck(this, NoopWrapper);

            if (_BaseWrapper != null) {
              _BaseWrapper.apply(this, arguments);
            }
          }

          _inherits(NoopWrapper, _BaseWrapper);

          return NoopWrapper;
        })(_BaseWrapper3["default"]);

        exports["default"] = NoopWrapper;
        module.exports = exports["default"];
      },
      { "./Base": 9 },
    ],
    12: [
      function (require, module, exports) {
        "use strict";

        var _moduleName = require("./config");

        /**
         * @ngdoc overview
         * @module knalli.angular-vertxbus
         * @name knalli.angular-vertxbus
         * @description
         *
         * Client side library using VertX Event Bus as an Angular Service module
         *
         * You have to define the module dependency, this module is named `knalli.angular-vertxbus`.
         *
         * <pre>
         *   angular.module('app', ['knalli.angular-vertxbus'])
         *     .controller('MyCtrl', function(vertxEventBus, vertxEventBusService) {
         *
         *       // using the EventBus directly
         *       vertxEventBus.send('my.address', {data: 123}, function (reply) {
         *         // your reply comes here
         *       });
         *
         *       // using the service
         *       vertxEventBusService.send('my.address', {data: 123}, {timeout: 500})
         *         .then(function (reply) {
         *           // your reply comes here
         *         })
         *         .catch(function (err) {
         *           // something went wrong, no connection, no login, timed out, or so
         *         });
         *     });
         * </pre>
         *
         * The module itself provides following components:
         * - {@link knalli.angular-vertxbus.vertxEventBus vertxEventBus}: a low level wrapper around `vertx.EventBus`
         * - {@link knalli.angular-vertxbus.vertxEventBusService vertxEventBusService}: a high level service around the wrapper
         *
         * While the wrapper only provides one single instance (even on reconnects), the service supports automatically
         * reconnect management, authorization and a clean promise based api.
         *
         * If you are looking for a low integration of `vertxbus.EventBus` as an AngularJS component, the wrapper will be your
         * choice. The only difference (and requirement for the wrapper actually) is how it will manage and replace the
         * underlying instance of the current `vertx.EventBus`.
         *
         * However, if you are looking for a simple, clean and promised based high api, the service is much better you.
         */
        angular.module(_moduleName.moduleName, ["ng"]);
      },
      { "./config": 1 },
    ],
    13: [
      function (require, module, exports) {
        "use strict";

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _moduleName = require("./config");

        var _LiveDelegate = require("./lib/service/delegate/Live");

        var _LiveDelegate2 = _interopRequireDefault(_LiveDelegate);

        var _NoopDelegate = require("./lib/service/delegate/Noop");

        var _NoopDelegate2 = _interopRequireDefault(_NoopDelegate);

        var _InterfaceService = require("./lib/service/InterfaceService");

        var _InterfaceService2 = _interopRequireDefault(_InterfaceService);

        /**
         * @ngdoc service
         * @module knalli.angular-vertxbus
         * @name knalli.angular-vertxbus.vertxEventBusServiceProvider
         * @description
         * This is the configuration provider for {@link knalli.angular-vertxbus.vertxEventBusService}.
         */

        var DEFAULTS = {
          enabled: true,
          debugEnabled: false,
          loginRequired: false,
          prefix: "vertx-eventbus.",
          sockjsStateInterval: 10000,
          messageBuffer: 10000,
        };

        angular
          .module(_moduleName.moduleName)
          .provider("vertxEventBusService", function () {
            var _this = this;

            // options (globally, application-wide)
            var options = angular.extend({}, DEFAULTS);

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#enable
             *
             * @description
             * Enables or disables the service. This setup is immutable.
             *
             * @param {boolean} [value=true] service is enabled on startup
             * @returns {object} this
             */
            this.enable = function () {
              var value =
                arguments[0] === undefined ? DEFAULTS.enabled : arguments[0];

              options.enabled = value === true;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#useDebug
             *
             * @description
             * Enables a verbose mode in which certain events will be logged to `$log`.
             *
             * @param {boolean} [value=false] verbose mode (using `$log`)
             * @returns {object} this
             */
            this.useDebug = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.debugEnabled
                  : arguments[0];

              options.debugEnabled = value === true;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#usePrefix
             *
             * @description
             * Overrides the default prefix which will be used for emitted events.
             *
             * @param {string} [value='vertx-eventbus.'] prefix used in event names
             * @returns {object} this
             */
            this.usePrefix = function () {
              var value =
                arguments[0] === undefined ? DEFAULTS.prefix : arguments[0];

              options.prefix = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#requireLogin
             *
             *
             * @description
             * Defines whether a login is being required or not.
             *
             * @param {boolean} [value=false] defines requirement of a valid session
             * @returns {object} this
             */
            this.requireLogin = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.loginRequired
                  : arguments[0];

              options.loginRequired = value === true;
              return _this;
            };

            /**
             * @ngdoc method
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#useSockJsStateInterval
             *
             *
             * @description
             * Overrides the interval of checking the connection is still valid (required for reconnecting automatically).
             *
             * @param {boolean} [value=10000] interval of checking the underlying connection's state (in ms)
             * @returns {object} this
             */
            this.useSockJsStateInterval = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.sockjsStateInterval
                  : arguments[0];

              options.sockjsStateInterval = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @methodOf knalli.angular-vertxbus.vertxEventBusServiceProvider
             * @name .#useMessageBuffer
             *
             * @description
             * Enables buffering of (sending) messages.
             *
             * The setting defines the total amount of buffered messages (`0` no buffering). A message will be buffered if
             * connection is still in progress, the connection is stale or a login is required/pending.
             *
             * @param {boolean} [value=0] allowed total amount of messages in the buffer
             * @returns {object} this
             */
            this.useMessageBuffer = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.messageBuffer
                  : arguments[0];

              options.messageBuffer = value;
              return _this;
            };

            /**
             * @ngdoc service
             * @module knalli.angular-vertxbus
             * @name knalli.angular-vertxbus.vertxEventBusService
             * @description
             * A service utilizing an underlaying Vert.x Event Bus
             *
             * The advanced features of this service are:
             *  - broadcasting the connection changes (vertx-eventbus.system.connected, vertx-eventbus.system.disconnected) on $rootScope
             *  - registering all handlers again when a reconnect had been required
             *  - supporting a promise when using send()
             *  - adding aliases on (registerHandler), un (unregisterHandler) and emit (publish)
             *
             * Basic usage:
             * <pre>
             * module.controller('MyController', function('vertxEventService') {
             *   vertxEventService.on('my.address', function(message) {
             *     console.log("JSON Message received: ", message)
             *   });
             *   vertxEventService.publish('my.other.address', {type: 'foo', data: 'bar'});
             * });
             * </pre>
             *
             * Note the additional {@link knalli.angular-vertxbus.vertxEventBusServiceProvider configuration} of the module itself.
             *
             * @requires knalli.angular-vertxbus.vertxEventBus
             * @requires $rootScope
             * @requires $q
             * @requires $interval
             * @requires $log
             */
            this.$get = [
              "$rootScope",
              "$q",
              "$interval",
              "vertxEventBus",
              "$log",
              function ($rootScope, $q, $interval, vertxEventBus, $log) {
                var instanceOptions = angular.extend(
                  {},
                  vertxEventBus.getOptions(),
                  options
                );
                if (instanceOptions.enabled) {
                  return new _InterfaceService2["default"](
                    new _LiveDelegate2["default"](
                      $rootScope,
                      $interval,
                      $log,
                      $q,
                      vertxEventBus,
                      instanceOptions
                    ),
                    $log
                  );
                } else {
                  return new _InterfaceService2["default"](
                    new _NoopDelegate2["default"]()
                  );
                }
              },
            ]; // $get
          });
      },
      {
        "./config": 1,
        "./lib/service/InterfaceService": 5,
        "./lib/service/delegate/Live": 7,
        "./lib/service/delegate/Noop": 8,
      },
    ],
    14: [
      function (require, module, exports) {
        "use strict";

        var _interopRequireDefault = function (obj) {
          return obj && obj.__esModule ? obj : { default: obj };
        };

        var _moduleName = require("./config");

        var _EventbusWrapper = require("./lib/wrapper/Eventbus");

        var _EventbusWrapper2 = _interopRequireDefault(_EventbusWrapper);

        var _NoopWrapper = require("./lib/wrapper/Noop");

        var _NoopWrapper2 = _interopRequireDefault(_NoopWrapper);

        /**
         * @ngdoc service
         * @module knalli.angular-vertxbus
         * @name knalli.angular-vertxbus.vertxEventBusProvider
         * @description
         * An AngularJS wrapper for projects using the VertX Event Bus
         */

        var DEFAULTS = {
          enabled: true,
          debugEnabled: false,
          urlServer:
            "" +
            location.protocol +
            "//" +
            location.hostname +
            ((function () {
              if (location.port) {
                return ":" + location.port;
              }
            })() || ""),
          urlPath: "/eventbus",
          reconnectEnabled: true,
          sockjsReconnectInterval: 10000,
          sockjsOptions: {},
        };

        angular
          .module(_moduleName.moduleName)
          .provider("vertxEventBus", function () {
            var _this = this;

            // options (globally, application-wide)
            var options = angular.extend({}, DEFAULTS);

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#enable
             *
             * @description
             * Enables or disables the service. This setup is immutable.
             *
             * @param {boolean} [value=true] service is enabled on startup
             * @returns {object} this
             */
            this.enable = function () {
              var value =
                arguments[0] === undefined ? DEFAULTS.enabled : arguments[0];

              options.enabled = value === true;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useDebug
             *
             * @description
             * Enables a verbose mode in which certain events will be logged to `$log`.
             *
             * @param {boolean} [value=false] verbose mode (using `$log`)
             * @returns {object} this
             */
            this.useDebug = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.debugEnabled
                  : arguments[0];

              options.debugEnabled = value === true;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useUrlServer
             *
             * @description
             * Overrides the url part "server" for connecting. The default is based on
             * - `location.protocol`
             * - `location.hostname`
             * - `location.port`
             *
             * i.e. `http://domain.tld` or `http://domain.tld:port`
             *
             * @param {boolean} [value=$computed] server to connect (default based on `location.protocol`, `location.hostname` and `location.port`)
             * @returns {object} this
             */
            this.useUrlServer = function () {
              var value =
                arguments[0] === undefined ? DEFAULTS.urlServer : arguments[0];

              options.urlServer = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useUrlPath
             *
             * @description
             * Overrides the url part "path" for connection.
             *
             * @param {boolean} [value='/eventbus'] path to connect
             * @returns {object} this
             */
            this.useUrlPath = function () {
              var value =
                arguments[0] === undefined ? DEFAULTS.urlPath : arguments[0];

              options.urlPath = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useReconnect
             *
             * @description
             * Enables or disables the automatic reconnect handling.
             *
             * @param {boolean} [value=true] if a disconnect was being noted, a reconnect will be enforced automatically
             * @returns {object} this
             */
            this.useReconnect = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.reconnectEnabled
                  : arguments[0];

              options.reconnectEnabled = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useSockJsReconnectInterval
             *
             * @description
             * Overrides the timeout for reconnecting after a disconnect was found.
             *
             * @param {boolean} [value=10000] time between a disconnect and the next try to reconnect (in ms)
             * @returns {object} this
             */
            this.useSockJsReconnectInterval = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.sockjsReconnectInterval
                  : arguments[0];

              options.sockjsReconnectInterval = value;
              return _this;
            };

            /**
             * @ngdoc method
             * @module knalli.angular-vertxbus
             * @methodOf knalli.angular-vertxbus.vertxEventBusProvider
             * @name .#useSockJsOptions
             *
             * @description
             * Sets additional params for the `SockJS` instance.
             *
             * Internally, it will be applied (as `options`) like `new SockJS(url, undefined, options)`.
             *
             * @param {boolean} [value={}]  optional params for raw SockJS options
             * @returns {object} this
             */
            this.useSockJsOptions = function () {
              var value =
                arguments[0] === undefined
                  ? DEFAULTS.sockjsOptions
                  : arguments[0];

              options.sockjsOptions = value;
              return _this;
            };

            /**
             * @ngdoc service
             * @module knalli.angular-vertxbus
             * @name knalli.angular-vertxbus.vertxEventBus
             * @description
             * A stub representing the Vert.x EventBus (core functionality)
             *
             * Because the Event Bus cannot handle a reconnect (because of the underlaying SockJS), a
             * new instance of the bus have to be created.
             * This stub ensures only one object holding the current active instance of the bus.
             *
             * The stub supports theses Vert.x Event Bus APIs:
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_close close()}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_login login(username, password, replyHandler)}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_send send(address, message, handler)}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_publish publish(address, message)}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_registerHandler registerHandler(adress, handler)}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_unregisterHandler unregisterHandler(address, handler)}
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_readyState readyState()}
             *
             * Furthermore, the stub supports theses extra APIs:
             *  - {@link knalli.angular-vertxbus.vertxEventBus#methods_reconnect reconnect()}
             *
             * @requires $timeout
             * @requires $log
             */
            this.$get = [
              "$timeout",
              "$log",
              function ($timeout, $log) {
                // Current options (merged defaults with application-wide settings)
                var instanceOptions = angular.extend({}, DEFAULTS, options);

                if (instanceOptions.enabled && vertx && vertx.EventBus) {
                  if (instanceOptions.debugEnabled) {
                    $log.debug("[Vert.x EB Stub] Enabled");
                  }
                  return new _EventbusWrapper2["default"](
                    vertx.EventBus,
                    $timeout,
                    $log,
                    instanceOptions
                  );
                } else {
                  if (instanceOptions.debugEnabled) {
                    $log.debug("[Vert.x EB Stub] Disabled");
                  }
                  return new _NoopWrapper2["default"]();
                }
              },
            ]; // $get
          });
      },
      { "./config": 1, "./lib/wrapper/Eventbus": 10, "./lib/wrapper/Noop": 11 },
    ],
  },
  {},
  [2]
);
