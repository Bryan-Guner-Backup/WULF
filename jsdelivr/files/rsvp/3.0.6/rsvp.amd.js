/**
  @class RSVP
  @module RSVP
  */
define('rsvp/all', [
    './promise',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    /**
      This is a convenient alias for `RSVP.Promise.all`.

      @method all
      @static
      @for RSVP
      @param {Array} array Array of promises.
      @param {String} label An optional label. This is useful
      for tooling.
    */
    __exports__['default'] = function all(array, label) {
        return Promise.all(array, label);
    };
});
define('rsvp/all_settled', [
    './promise',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var isArray = __dependency2__.isArray;
    var isNonThenable = __dependency2__.isNonThenable;
    /**
      `RSVP.allSettled` is similar to `RSVP.all`, but instead of implementing
      a fail-fast method, it waits until all the promises have returned and
      shows you all the results. This is useful if you want to handle multiple
      promises' failure states together as a set.

      Returns a promise that is fulfilled when all the given promises have been
      settled. The return promise is fulfilled with an array of the states of
      the promises passed into the `promises` array argument.

      Each state object will either indicate fulfillment or rejection, and
      provide the corresponding value or reason. The states will take one of
      the following formats:

      ```javascript
      { state: 'fulfilled', value: value }
        or
      { state: 'rejected', reason: reason }
      ```

      Example:

      ```javascript
      var promise1 = RSVP.Promise.resolve(1);
      var promise2 = RSVP.Promise.reject(new Error('2'));
      var promise3 = RSVP.Promise.reject(new Error('3'));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.allSettled(promises).then(function(array){
        // array == [
        //   { state: 'fulfilled', value: 1 },
        //   { state: 'rejected', reason: Error },
        //   { state: 'rejected', reason: Error }
        // ]
        // Note that for the second item, reason.message will be "2", and for the
        // third item, reason.message will be "3".
      }, function(error) {
        // Not run. (This block would only be called if allSettled had failed,
        // for instance if passed an incorrect argument type.)
      });
      ```

      @method allSettled
      @static
      @for RSVP
      @param {Array} promises
      @param {String} label - optional string that describes the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled with an array of the settled
      states of the constituent promises.
    */
    __exports__['default'] = function allSettled(entries, label) {
        return new Promise(function (resolve, reject) {
            if (!isArray(entries)) {
                throw new TypeError('You must pass an array to allSettled.');
            }
            var remaining = entries.length;
            var entry;
            if (remaining === 0) {
                resolve([]);
                return;
            }
            var results = new Array(remaining);
            function fulfilledResolver(index) {
                return function (value) {
                    resolveAll(index, fulfilled(value));
                };
            }
            function rejectedResolver(index) {
                return function (reason) {
                    resolveAll(index, rejected(reason));
                };
            }
            function resolveAll(index, value) {
                results[index] = value;
                if (--remaining === 0) {
                    resolve(results);
                }
            }
            for (var index = 0; index < entries.length; index++) {
                entry = entries[index];
                if (isNonThenable(entry)) {
                    resolveAll(index, fulfilled(entry));
                } else {
                    Promise.resolve(entry).then(fulfilledResolver(index), rejectedResolver(index));
                }
            }
        }, label);
    };
    function fulfilled(value) {
        return {
            state: 'fulfilled',
            value: value
        };
    }
    function rejected(reason) {
        return {
            state: 'rejected',
            reason: reason
        };
    }
});
define('rsvp/asap', ['exports'], function (__exports__) {
    'use strict';
    __exports__['default'] = function asap(callback, arg) {
        var length = queue.push([
                callback,
                arg
            ]);
        if (length === 1) {
            // If length is 1, that means that we need to schedule an async flush.
            // If additional callbacks are queued before the queue is flushed, they
            // will be processed by this flush that we are scheduling.
            scheduleFlush();
        }
    };
    var browserGlobal = typeof window !== 'undefined' ? window : {};
    var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
    // node
    function useNextTick() {
        return function () {
            process.nextTick(flush);
        };
    }
    function useMutationObserver() {
        var iterations = 0;
        var observer = new BrowserMutationObserver(flush);
        var node = document.createTextNode('');
        observer.observe(node, { characterData: true });
        return function () {
            node.data = iterations = ++iterations % 2;
        };
    }
    function useSetTimeout() {
        return function () {
            setTimeout(flush, 1);
        };
    }
    var queue = [];
    function flush() {
        for (var i = 0; i < queue.length; i++) {
            var tuple = queue[i];
            var callback = tuple[0], arg = tuple[1];
            callback(arg);
        }
        queue = [];
    }
    var scheduleFlush;
    // Decide what async method to use to triggering processing of queued callbacks:
    if (typeof process !== 'undefined' && {}.toString.call(process) === '[object process]') {
        scheduleFlush = useNextTick();
    } else if (BrowserMutationObserver) {
        scheduleFlush = useMutationObserver();
    } else {
        scheduleFlush = useSetTimeout();
    }
});
define('rsvp/config', [
    './events',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var EventTarget = __dependency1__['default'];
    var config = { instrument: false };
    EventTarget.mixin(config);
    function configure(name, value) {
        if (name === 'onerror') {
            // handle for legacy users that expect the actual
            // error to be passed to their function added via
            // `RSVP.configure('onerror', someFunctionHere);`
            config.on('error', value);
            return;
        }
        if (arguments.length === 2) {
            config[name] = value;
        } else {
            return config[name];
        }
    }
    __exports__.config = config;
    __exports__.configure = configure;
});
define('rsvp/defer', [
    './promise',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    /**
      `RSVP.defer` returns an object similar to jQuery's `$.Deferred`.
      `RSVP.defer` should be used when porting over code reliant on `$.Deferred`'s
      interface. New code should use the `RSVP.Promise` constructor instead.

      The object returned from `RSVP.defer` is a plain object with three properties:

      * promise - an `RSVP.Promise`.
      * reject - a function that causes the `promise` property on this object to
        become rejected
      * resolve - a function that causes the `promise` property on this object to
        become fulfilled.

      Example:

       ```javascript
       var deferred = RSVP.defer();

       deferred.resolve("Success!");

       defered.promise.then(function(value){
         // value here is "Success!"
       });
       ```

      @method defer
      @static
      @for RSVP
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Object}
     */
    __exports__['default'] = function defer(label) {
        var deferred = {};
        deferred.promise = new Promise(function (resolve, reject) {
            deferred.resolve = resolve;
            deferred.reject = reject;
        }, label);
        return deferred;
    };
});
define('rsvp/events', ['exports'], function (__exports__) {
    'use strict';
    var indexOf = function (callbacks, callback) {
        for (var i = 0, l = callbacks.length; i < l; i++) {
            if (callbacks[i] === callback) {
                return i;
            }
        }
        return -1;
    };
    var callbacksFor = function (object) {
        var callbacks = object._promiseCallbacks;
        if (!callbacks) {
            callbacks = object._promiseCallbacks = {};
        }
        return callbacks;
    };
    /**
      @class RSVP.EventTarget
    */
    __exports__['default'] = {
        mixin: function (object) {
            object.on = this.on;
            object.off = this.off;
            object.trigger = this.trigger;
            object._promiseCallbacks = undefined;
            return object;
        },
        on: function (eventName, callback) {
            var allCallbacks = callbacksFor(this), callbacks;
            callbacks = allCallbacks[eventName];
            if (!callbacks) {
                callbacks = allCallbacks[eventName] = [];
            }
            if (indexOf(callbacks, callback) === -1) {
                callbacks.push(callback);
            }
        },
        off: function (eventName, callback) {
            var allCallbacks = callbacksFor(this), callbacks, index;
            if (!callback) {
                allCallbacks[eventName] = [];
                return;
            }
            callbacks = allCallbacks[eventName];
            index = indexOf(callbacks, callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        },
        trigger: function (eventName, options) {
            var allCallbacks = callbacksFor(this), callbacks, callbackTuple, callback, binding;
            if (callbacks = allCallbacks[eventName]) {
                // Don't cache the callbacks.length since it may grow
                for (var i = 0; i < callbacks.length; i++) {
                    callback = callbacks[i];
                    callback(options);
                }
            }
        }
    };
});
define('rsvp/filter', [
    './all',
    './map',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __dependency3__, __exports__) {
    'use strict';
    var all = __dependency1__['default'];
    var map = __dependency2__['default'];
    var isFunction = __dependency3__.isFunction;
    var isArray = __dependency3__.isArray;
    /**
     `RSVP.filter` is similar to JavaScript's native `filter` method, except that it
      waits for all promises to become fulfilled before running the `filterFn` on
      each item in given to `promises`. `RSVP.filter` returns a promise that will
      become fulfilled with the result of running `filterFn` on the values the
      promises become fulfilled with.

      For example:

      ```javascript

      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);

      var filterFn = function(item){
        return item > 1;
      };

      RSVP.filter(promises, filterFn).then(function(result){
        // result is [ 2, 3 ]
      });
      ```

      If any of the `promises` given to `RSVP.filter` are rejected, the first promise
      that is rejected will be given as an argument to the returned promise's
      rejection handler. For example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      var filterFn = function(item){
        return item > 1;
      };

      RSVP.filter(promises, filterFn).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(reason) {
        // reason.message === "2"
      });
      ```

      `RSVP.filter` will also wait for any promises returned from `filterFn`.
      For instance, you may want to fetch a list of users then return a subset
      of those users based on some asynchronous operation:

      ```javascript

      var alice = { name: 'alice' };
      var bob   = { name: 'bob' };
      var users = [ alice, bob ];

      var promises = users.map(function(user){
        return RSVP.resolve(user);
      });

      var filterFn = function(user){
        // Here, Alice has permissions to create a blog post, but Bob does not.
        return getPrivilegesForUser(user).then(function(privs){
          return privs.can_create_blog_post === true;
        });
      };
      RSVP.filter(promises, filterFn).then(function(users){
        // true, because the server told us only Alice can create a blog post.
        users.length === 1;
        // false, because Alice is the only user present in `users`
        users[0] === bob;
      });
      ```

      @method filter
      @static
      @for RSVP
      @param {Array} promises
      @param {Function} filterFn - function to be called on each resolved value to
      filter the final results.
      @param {String} label optional string describing the promise. Useful for
      tooling.
      @return {Promise}
    */
    function filter(promises, filterFn, label) {
        return all(promises, label).then(function (values) {
            if (!isArray(promises)) {
                throw new TypeError('You must pass an array to filter.');
            }
            if (!isFunction(filterFn)) {
                throw new TypeError('You must pass a function to filter\'s second argument.');
            }
            return map(promises, filterFn, label).then(function (filterResults) {
                var i, valuesLen = values.length, filtered = [];
                for (i = 0; i < valuesLen; i++) {
                    if (filterResults[i])
                        filtered.push(values[i]);
                }
                return filtered;
            });
        });
    }
    __exports__['default'] = filter;
});
define('rsvp/hash', [
    './promise',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var isNonThenable = __dependency2__.isNonThenable;
    var keysOf = __dependency2__.keysOf;
    /**
      `RSVP.hash` is similar to `RSVP.all`, but takes an object instead of an array
      for its `promises` argument.

      Returns a promise that is fulfilled when all the given promises have been
      fulfilled, or rejected if any of them become rejected. The returned promise
      is fulfilled with a hash that has the same key names as the `promises` object
      argument. If any of the values in the object are not promises, they will
      simply be copied over to the fulfilled object.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.resolve(1),
        yourPromise: RSVP.resolve(2),
        theirPromise: RSVP.resolve(3),
        notAPromise: 4
      };

      RSVP.hash(promises).then(function(hash){
        // hash here is an object that looks like:
        // {
        //   myPromise: 1,
        //   yourPromise: 2,
        //   theirPromise: 3,
        //   notAPromise: 4
        // }
      });
      ````

      If any of the `promises` given to `RSVP.hash` are rejected, the first promise
      that is rejected will be given as the reason to the rejection handler.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.resolve(1),
        rejectedPromise: RSVP.reject(new Error("rejectedPromise")),
        anotherRejectedPromise: RSVP.reject(new Error("anotherRejectedPromise")),
      };

      RSVP.hash(promises).then(function(hash){
        // Code here never runs because there are rejected promises!
      }, function(reason) {
        // reason.message === "rejectedPromise"
      });
      ```

      An important note: `RSVP.hash` is intended for plain JavaScript objects that
      are just a set of keys and values. `RSVP.hash` will NOT preserve prototype
      chains.

      Example:

      ```javascript
      function MyConstructor(){
        this.example = RSVP.resolve("Example");
      }

      MyConstructor.prototype = {
        protoProperty: RSVP.resolve("Proto Property")
      };

      var myObject = new MyConstructor();

      RSVP.hash(myObject).then(function(hash){
        // protoProperty will not be present, instead you will just have an
        // object that looks like:
        // {
        //   example: "Example"
        // }
        //
        // hash.hasOwnProperty('protoProperty'); // false
        // 'undefined' === typeof hash.protoProperty
      });
      ```

      @method hash
      @static
      @for RSVP
      @param {Object} promises
      @param {String} label optional string that describes the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all properties of `promises`
      have been fulfilled, or rejected if any of them become rejected.
    */
    __exports__['default'] = function hash(object, label) {
        return new Promise(function (resolve, reject) {
            var results = {};
            var keys = keysOf(object);
            var remaining = keys.length;
            var entry, property;
            if (remaining === 0) {
                resolve(results);
                return;
            }
            function fulfilledTo(property) {
                return function (value) {
                    results[property] = value;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                };
            }
            function onRejection(reason) {
                remaining = 0;
                reject(reason);
            }
            for (var i = 0; i < keys.length; i++) {
                property = keys[i];
                entry = object[property];
                if (isNonThenable(entry)) {
                    results[property] = entry;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                } else {
                    Promise.resolve(entry).then(fulfilledTo(property), onRejection);
                }
            }
        });
    };
});
define('rsvp/hash_settled', [
    './promise',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var isNonThenable = __dependency2__.isNonThenable;
    var keysOf = __dependency2__.keysOf;
    /**
      `RSVP.hashSettled` is similar to `RSVP.allSettled`, but takes an object
      instead of an array for its `promises` argument.

      Unlike `RSVP.all` or `RSVP.hash`, which implement a fail-fast method,
      but like `RSVP.allSettled`, `hashSettled` waits until all the
      constituent promises have returned and then shows you all the results
      with their states and values/reasons. This is useful if you want to
      handle multiple promises' failure states together as a set.

      Returns a promise that is fulfilled when all the given promises have been
      settled, or rejected if the passed parameters are invalid.

      The returned promise is fulfilled with a hash that has the same key names as
      the `promises` object argument. If any of the values in the object are not
      promises, they will be copied over to the fulfilled object and marked with state
      'fulfilled'.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.Promise.resolve(1),
        yourPromise: RSVP.Promise.resolve(2),
        theirPromise: RSVP.Promise.resolve(3),
        notAPromise: 4
      };

      RSVP.hashSettled(promises).then(function(hash){
        // hash here is an object that looks like:
        // {
        //   myPromise: { state: 'fulfilled', value: 1 },
        //   yourPromise: { state: 'fulfilled', value: 2 },
        //   theirPromise: { state: 'fulfilled', value: 3 },
        //   notAPromise: { state: 'fulfilled', value: 4 }
        // }
      });
      ```

      If any of the `promises` given to `RSVP.hash` are rejected, the state will
      be set to 'rejected' and the reason for rejection provided.

      Example:

      ```javascript
      var promises = {
        myPromise: RSVP.Promise.resolve(1),
        rejectedPromise: RSVP.Promise.reject(new Error('rejection')),
        anotherRejectedPromise: RSVP.Promise.reject(new Error('more rejection')),
      };

      RSVP.hashSettled(promises).then(function(hash){
        // hash here is an object that looks like:
        // {
        //   myPromise:              { state: 'fulfilled', value: 1 },
        //   rejectedPromise:        { state: 'rejected', reason: Error },
        //   anotherRejectedPromise: { state: 'rejected', reason: Error },
        // }
        // Note that for rejectedPromise, reason.message == 'rejection',
        // and for anotherRejectedPromise, reason.message == 'more rejection'.
      });
      ```

      An important note: `RSVP.hashSettled` is intended for plain JavaScript objects that
      are just a set of keys and values. `RSVP.hashSettled` will NOT preserve prototype
      chains.

      Example:

      ```javascript
      function MyConstructor(){
        this.example = RSVP.Promise.resolve('Example');
      }

      MyConstructor.prototype = {
        protoProperty: RSVP.Promise.resolve('Proto Property')
      };

      var myObject = new MyConstructor();

      RSVP.hashSettled(myObject).then(function(hash){
        // protoProperty will not be present, instead you will just have an
        // object that looks like:
        // {
        //   example: { state: 'fulfilled', value: 'Example' }
        // }
        //
        // hash.hasOwnProperty('protoProperty'); // false
        // 'undefined' === typeof hash.protoProperty
      });
      ```

      @method hashSettled
      @for RSVP
      @param {Object} promises
      @param {String} label optional string that describes the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when when all properties of `promises`
      have been settled.
      @static
    */
    __exports__['default'] = function hashSettled(object, label) {
        return new Promise(function (resolve, reject) {
            var results = {};
            var keys = keysOf(object);
            var remaining = keys.length;
            var entry, property;
            if (remaining === 0) {
                resolve(results);
                return;
            }
            function fulfilledResolver(property) {
                return function (value) {
                    resolveAll(property, fulfilled(value));
                };
            }
            function rejectedResolver(property) {
                return function (reason) {
                    resolveAll(property, rejected(reason));
                };
            }
            function resolveAll(property, value) {
                results[property] = value;
                if (--remaining === 0) {
                    resolve(results);
                }
            }
            for (var i = 0; i < keys.length; i++) {
                property = keys[i];
                entry = object[property];
                if (isNonThenable(entry)) {
                    resolveAll(property, fulfilled(entry));
                } else {
                    Promise.resolve(entry).then(fulfilledResolver(property), rejectedResolver(property));
                }
            }
        });
    };
    function fulfilled(value) {
        return {
            state: 'fulfilled',
            value: value
        };
    }
    function rejected(reason) {
        return {
            state: 'rejected',
            reason: reason
        };
    }
});
define('rsvp/instrument', [
    './config',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var config = __dependency1__.config;
    var now = __dependency2__.now;
    __exports__['default'] = function instrument(eventName, promise, child) {
        // instrumentation should not disrupt normal usage.
        try {
            config.trigger(eventName, {
                guid: promise._guidKey + promise._id,
                eventName: eventName,
                detail: promise._detail,
                childGuid: child && promise._guidKey + child._id,
                label: promise._label,
                timeStamp: now(),
                stack: new Error(promise._label).stack
            });
        } catch (error) {
            setTimeout(function () {
                throw error;
            }, 0);
        }
    };
});
define('rsvp/map', [
    './promise',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var isArray = __dependency2__.isArray;
    var isFunction = __dependency2__.isFunction;
    /**
     `RSVP.map` is similar to JavaScript's native `map` method, except that it
      waits for all promises to become fulfilled before running the `mapFn` on
      each item in given to `promises`. `RSVP.map` returns a promise that will
      become fulfilled with the result of running `mapFn` on the values the promises
      become fulfilled with.

      For example:

      ```javascript

      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      var mapFn = function(item){
        return item + 1;
      };

      RSVP.map(promises, mapFn).then(function(result){
        // result is [ 2, 3, 4 ]
      });
      ```

      If any of the `promises` given to `RSVP.map` are rejected, the first promise
      that is rejected will be given as an argument to the returned promise's
      rejection handler. For example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      var mapFn = function(item){
        return item + 1;
      };

      RSVP.map(promises, mapFn).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(reason) {
        // reason.message === "2"
      });
      ```

      `RSVP.map` will also wait if a promise is returned from `mapFn`. For example,
      say you want to get all comments from a set of blog posts, but you need
      the blog posts first becuase they contain a url to those comments.

      ```javscript

      var mapFn = function(blogPost){
        // getComments does some ajax and returns an RSVP.Promise that is fulfilled
        // with some comments data
        return getComments(blogPost.comments_url);
      };

      // getBlogPosts does some ajax and returns an RSVP.Promise that is fulfilled
      // with some blog post data
      RSVP.map(getBlogPosts(), mapFn).then(function(comments){
        // comments is the result of asking the server for the comments
        // of all blog posts returned from getBlogPosts()
      });
      ```

      @method map
      @static
      @for RSVP
      @param {Array} promises
      @param {Function} mapFn function to be called on each fulfilled promise.
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled with the result of calling
      `mapFn` on each fulfilled promise or value when they become fulfilled.
       The promise will be rejected if any of the given `promises` become rejected.
      @static
    */
    __exports__['default'] = function map(promises, mapFn, label) {
        return Promise.all(promises, label).then(function (results) {
            if (!isArray(promises)) {
                throw new TypeError('You must pass an array to map.');
            }
            if (!isFunction(mapFn)) {
                throw new TypeError('You must pass a function to map\'s second argument.');
            }
            var resultLen = results.length, mappedResults = [], i;
            for (i = 0; i < resultLen; i++) {
                mappedResults.push(mapFn(results[i]));
            }
            return Promise.all(mappedResults, label);
        });
    };
});
define('rsvp/node', [
    './promise',
    './utils',
    'exports'
], function (__dependency1__, __dependency2__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var isArray = __dependency2__.isArray;
    /**
      `RSVP.denodeify` takes a "node-style" function and returns a function that
      will return an `RSVP.Promise`. You can use `denodeify` in Node.js or the
      browser when you'd prefer to use promises over using callbacks. For example,
      `denodeify` transforms the following:

      ```javascript
      var fs = require('fs');

      fs.readFile('myfile.txt', function(err, data){
        if (err) return handleError(err);
        handleData(data);
      });
      ```

      into:

      ```javascript
      var fs = require('fs');
      var readFile = RSVP.denodeify(fs.readFile);

      readFile('myfile.txt').then(handleData, handleError);
      ```

      If the node function has multiple success parameters, then `denodeify`
      just returns the first one:

      ```javascript
      var request = RSVP.denodeify(require('request'));

      request('http://example.com').then(function(res) {
        // ...
      });
      ```

      However, if you need all success parameters, setting `denodeify`'s
      second parameter to `true` causes it to return all success parameters
      as an array:

      ```javascript
      var request = RSVP.denodeify(require('request'), true);

      request('http://example.com').then(function(result) {
        // result[0] -> res
        // result[1] -> body
      });
      ```

      Or if you pass it an array with names it returns the parameters as a hash:

      ```javascript
      var request = RSVP.denodeify(require('request'), ['res', 'body']);

      request('http://example.com').then(function(result) {
        // result.res
        // result.body
      });
      ```

      Sometimes you need to retain the `this`:

      ```javascript
      var app = require('express')();
      var render = RSVP.denodeify(app.render.bind(app));
      ```

      Using `denodeify` makes it easier to compose asynchronous operations instead
      of using callbacks. For example, instead of:

      ```javascript
      var fs = require('fs');

      fs.readFile('myfile.txt', function(err, data){
        if (err) { ... } // Handle error
        fs.writeFile('myfile2.txt', data, function(err){
          if (err) { ... } // Handle error
          console.log('done')
        });
      });
      ```

      you can chain the operations together using `then` from the returned promise:

      ```javascript
      var fs = require('fs');
      var readFile = RSVP.denodeify(fs.readFile);
      var writeFile = RSVP.denodeify(fs.writeFile);

      readFile('myfile.txt').then(function(data){
        return writeFile('myfile2.txt', data);
      }).then(function(){
        console.log('done')
      }).catch(function(error){
        // Handle error
      });
      ```

      @method denodeify
      @static
      @for RSVP
      @param {Function} nodeFunc a "node-style" function that takes a callback as
      its last argument. The callback expects an error to be passed as its first
      argument (if an error occurred, otherwise null), and the value from the
      operation as its second argument ("function(err, value){ }").
      @param {Boolean|Array} successArgumentNames An optional paramter that if set
      to `true` causes the promise to fulfill with the callback's success arguments
      as an array. This is useful if the node function has multiple success
      paramters. If you set this paramter to an array with names, the promise will
      fulfill with a hash with these names as keys and the success parameters as
      values.
      @return {Function} a function that wraps `nodeFunc` to return an
      `RSVP.Promise`
      @static
    */
    __exports__['default'] = function denodeify(nodeFunc, argumentNames) {
        return function () {
            /* global nodeArgs, $a_slice */
            var length = arguments.length;
            var nodeArgs = new Array(length);
            for (var i = 0; i < length; i++) {
                nodeArgs[i] = arguments[i];
            }
            ;
            var asArray = argumentNames === true;
            var asHash = isArray(argumentNames);
            var thisArg;
            if (!asArray && !asHash && argumentNames) {
                console.warn('Deprecation: RSVP.denodeify() doesn\'t allow setting the ' + '"this" binding anymore. Use yourFunction.bind(yourThis) instead.');
                thisArg = argumentNames;
            } else {
                thisArg = this;
            }
            return Promise.all(nodeArgs).then(function (nodeArgs$2) {
                return new Promise(resolver);
                // sweet.js has a bug, this resolver can't defined in the constructor
                // or the $a_slice macro doesn't work
                function resolver(resolve, reject) {
                    function callback() {
                        /* global args, $a_slice */
                        var length$2 = arguments.length;
                        var args = new Array(length$2);
                        for (var i$2 = 0; i$2 < length$2; i$2++) {
                            args[i$2] = arguments[i$2];
                        }
                        ;
                        var error = args[0];
                        var value = args[1];
                        if (error) {
                            reject(error);
                        } else if (asArray) {
                            resolve(args.slice(1));
                        } else if (asHash) {
                            var obj = {};
                            var successArguments = args.slice(1);
                            var name;
                            var i$3;
                            for (i$3 = 0; i$3 < argumentNames.length; i$3++) {
                                name = argumentNames[i$3];
                                obj[name] = successArguments[i$3];
                            }
                            resolve(obj);
                        } else {
                            resolve(value);
                        }
                    }
                    nodeArgs$2.push(callback);
                    nodeFunc.apply(thisArg, nodeArgs$2);
                }
            });
        };
    };
});
define('rsvp/promise', [
    './config',
    './events',
    './instrument',
    './utils',
    './promise/cast',
    './promise/all',
    './promise/race',
    './promise/resolve',
    './promise/reject',
    'exports'
], function (__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __exports__) {
    'use strict';
    var config = __dependency1__.config;
    var EventTarget = __dependency2__['default'];
    var instrument = __dependency3__['default'];
    var objectOrFunction = __dependency4__.objectOrFunction;
    var isFunction = __dependency4__.isFunction;
    var now = __dependency4__.now;
    var cast = __dependency5__['default'];
    var all = __dependency6__['default'];
    var race = __dependency7__['default'];
    var Resolve = __dependency8__['default'];
    var Reject = __dependency9__['default'];
    var guidKey = 'rsvp_' + now() + '-';
    var counter = 0;
    function noop() {
    }
    __exports__['default'] = Promise;
    /**
      Promise objects represent the eventual result of an asynchronous operation. The
      primary way of interacting with a promise is through its `then` method, which
      registers callbacks to receive either a promise???s eventual value or the reason
      why the promise cannot be fulfilled.

      Terminology
      -----------

      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
      - `thenable` is an object or function that defines a `then` method.
      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
      - `exception` is a value that is thrown using the throw statement.
      - `reason` is a value that indicates why a promise was rejected.
      - `settled` the final resting state of a promise, fulfilled or rejected.

      A promise can be in one of three states: pending, fulfilled, or rejected.

      Promises that are fulfilled have a fulfillment value and are in the fulfilled
      state.  Promises that are rejected have a rejection reason and are in the
      rejected state.  A fulfillment value is never a thenable.

      Promises can also be said to *resolve* a value.  If this value is also a
      promise, then the original promise's settled state will match the value's
      settled state.  So a promise that *resolves* a promise that rejects will
      itself reject, and a promise that *resolves* a promise that fulfills will
      itself fulfill.


      Basic Usage:
      ------------

      ```js
      var promise = new Promise(function(resolve, reject) {
        // on success
        resolve(value);

        // on failure
        reject(reason);
      });

      promise.then(function(value) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Advanced Usage:
      ---------------

      Promises shine when abstracting away asynchronous interactions such as
      `XMLHttpRequest`s.

      ```js
      function getJSON(url) {
        return new Promise(function(resolve, reject){
          var xhr = new XMLHttpRequest();

          xhr.open('GET', url);
          xhr.onreadystatechange = handler;
          xhr.responseType = 'json';
          xhr.setRequestHeader('Accept', 'application/json');
          xhr.send();

          function handler() {
            if (this.readyState === this.DONE) {
              if (this.status === 200) {
                resolve(this.response);
              } else {
                reject(new Error("getJSON: `" + url + "` failed with status: [" + this.status + "]");
              }
            }
          };
        });
      }

      getJSON('/posts.json').then(function(json) {
        // on fulfillment
      }, function(reason) {
        // on rejection
      });
      ```

      Unlike callbacks, promises are great composable primitives.

      ```js
      Promise.all([
        getJSON('/posts'),
        getJSON('/comments')
      ]).then(function(values){
        values[0] // => postsJSON
        values[1] // => commentsJSON

        return values;
      });
      ```

      @class RSVP.Promise
      @param {function}
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @constructor
    */
    function Promise(resolver, label) {
        if (!isFunction(resolver)) {
            throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
        }
        if (!(this instanceof Promise)) {
            throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
        }
        this._id = counter++;
        this._label = label;
        this._subscribers = [];
        if (config.instrument) {
            instrument('created', this);
        }
        if (noop !== resolver) {
            invokeResolver(resolver, this);
        }
    }
    function invokeResolver(resolver, promise) {
        function resolvePromise(value) {
            resolve(promise, value);
        }
        function rejectPromise(reason) {
            reject(promise, reason);
        }
        try {
            resolver(resolvePromise, rejectPromise);
        } catch (e) {
            rejectPromise(e);
        }
    }
    Promise.cast = cast;
    Promise.all = all;
    Promise.race = race;
    Promise.resolve = Resolve;
    Promise.reject = Reject;
    var PENDING = void 0;
    var SEALED = 0;
    var FULFILLED = 1;
    var REJECTED = 2;
    function subscribe(parent, child, onFulfillment, onRejection) {
        var subscribers = parent._subscribers;
        var length = subscribers.length;
        subscribers[length] = child;
        subscribers[length + FULFILLED] = onFulfillment;
        subscribers[length + REJECTED] = onRejection;
    }
    function publish(promise, settled) {
        var child, callback, subscribers = promise._subscribers, detail = promise._detail;
        if (config.instrument) {
            instrument(settled === FULFILLED ? 'fulfilled' : 'rejected', promise);
        }
        for (var i = 0; i < subscribers.length; i += 3) {
            child = subscribers[i];
            callback = subscribers[i + settled];
            invokeCallback(settled, child, callback, detail);
        }
        promise._subscribers = null;
    }
    Promise.prototype = {
        constructor: Promise,
        _id: undefined,
        _guidKey: guidKey,
        _label: undefined,
        _state: undefined,
        _detail: undefined,
        _subscribers: undefined,
        _onerror: function (reason) {
            config.trigger('error', reason);
        },
        then: function (onFulfillment, onRejection, label) {
            var promise = this;
            this._onerror = null;
            var thenPromise = new this.constructor(noop, label);
            if (this._state) {
                var callbacks = arguments;
                config.async(function invokePromiseCallback() {
                    invokeCallback(promise._state, thenPromise, callbacks[promise._state - 1], promise._detail);
                });
            } else {
                subscribe(this, thenPromise, onFulfillment, onRejection);
            }
            if (config.instrument) {
                instrument('chained', promise, thenPromise);
            }
            return thenPromise;
        },
        'catch': function (onRejection, label) {
            return this.then(null, onRejection, label);
        },
        'finally': function (callback, label) {
            var constructor = this.constructor;
            return this.then(function (value) {
                return constructor.cast(callback()).then(function () {
                    return value;
                });
            }, function (reason) {
                return constructor.cast(callback()).then(function () {
                    throw reason;
                });
            }, label);
        }
    };
    function invokeCallback(settled, promise, callback, detail) {
        var hasCallback = isFunction(callback), value, error, succeeded, failed;
        if (hasCallback) {
            try {
                value = callback(detail);
                succeeded = true;
            } catch (e) {
                failed = true;
                error = e;
            }
        } else {
            value = detail;
            succeeded = true;
        }
        if (handleThenable(promise, value)) {
            return;
        } else if (hasCallback && succeeded) {
            resolve(promise, value);
        } else if (failed) {
            reject(promise, error);
        } else if (settled === FULFILLED) {
            resolve(promise, value);
        } else if (settled === REJECTED) {
            reject(promise, value);
        }
    }
    function handleThenable(promise, value) {
        var then = null, resolved;
        try {
            if (promise === value) {
                throw new TypeError('A promises callback cannot return that same promise.');
            }
            if (objectOrFunction(value)) {
                then = value.then;
                if (isFunction(then)) {
                    then.call(value, function (val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        if (value !== val) {
                            resolve(promise, val);
                        } else {
                            fulfill(promise, val);
                        }
                    }, function (val) {
                        if (resolved) {
                            return true;
                        }
                        resolved = true;
                        reject(promise, val);
                    }, 'Settle: ' + (promise._label || ' unknown promise'));
                    return true;
                }
            }
        } catch (error) {
            if (resolved) {
                return true;
            }
            reject(promise, error);
            return true;
        }
        return false;
    }
    function resolve(promise, value) {
        if (promise === value) {
            fulfill(promise, value);
        } else if (!handleThenable(promise, value)) {
            fulfill(promise, value);
        }
    }
    function fulfill(promise, value) {
        if (promise._state !== PENDING) {
            return;
        }
        promise._state = SEALED;
        promise._detail = value;
        config.async(publishFulfillment, promise);
    }
    function reject(promise, reason) {
        if (promise._state !== PENDING) {
            return;
        }
        promise._state = SEALED;
        promise._detail = reason;
        config.async(publishRejection, promise);
    }
    function publishFulfillment(promise) {
        publish(promise, promise._state = FULFILLED);
    }
    function publishRejection(promise) {
        if (promise._onerror) {
            promise._onerror(promise._detail);
        }
        publish(promise, promise._state = REJECTED);
    }
});
define('rsvp/promise/all', [
    '../utils',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var isArray = __dependency1__.isArray;
    var isNonThenable = __dependency1__.isNonThenable;
    /**
      `RSVP.Promise.all` accepts an array of promises, and returns a new promise which
      is fulfilled with an array of fulfillment values for the passed promises, or
      rejected with the reason of the first passed promise to be rejected. It casts all
      elements of the passed iterable to promises as it runs this algorithm.

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.resolve(2);
      var promise3 = RSVP.resolve(3);
      var promises = [ promise1, promise2, promise3 ];

      RSVP.Promise.all(promises).then(function(array){
        // The array here would be [ 1, 2, 3 ];
      });
      ```

      If any of the `promises` given to `RSVP.all` are rejected, the first promise
      that is rejected will be given as an argument to the returned promises's
      rejection handler. For example:

      Example:

      ```javascript
      var promise1 = RSVP.resolve(1);
      var promise2 = RSVP.reject(new Error("2"));
      var promise3 = RSVP.reject(new Error("3"));
      var promises = [ promise1, promise2, promise3 ];

      RSVP.Promise.all(promises).then(function(array){
        // Code here never runs because there are rejected promises!
      }, function(error) {
        // error.message === "2"
      });
      ```

      @method all
      @static
      @param {Array} entries array of promises
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise that is fulfilled when all `promises` have been
      fulfilled, or rejected if any of them become rejected.
      @static
    */
    __exports__['default'] = function all(entries, label) {
        /*jshint validthis:true */
        var Constructor = this;
        return new Constructor(function (resolve, reject) {
            if (!isArray(entries)) {
                throw new TypeError('You must pass an array to all.');
            }
            var remaining = entries.length;
            var results = new Array(remaining);
            var entry, pending = true;
            if (remaining === 0) {
                resolve(results);
                return;
            }
            function fulfillmentAt(index) {
                return function (value) {
                    results[index] = value;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                };
            }
            function onRejection(reason) {
                remaining = 0;
                reject(reason);
            }
            for (var index = 0; index < entries.length; index++) {
                entry = entries[index];
                if (isNonThenable(entry)) {
                    results[index] = entry;
                    if (--remaining === 0) {
                        resolve(results);
                    }
                } else {
                    Constructor.resolve(entry).then(fulfillmentAt(index), onRejection);
                }
            }
        }, label);
    };
});
define('rsvp/promise/cast', ['exports'], function (__exports__) {
    'use strict';
    /**
      @deprecated

      `RSVP.Promise.cast` coerces its argument to a promise, or returns the
      argument if it is already a promise which shares a constructor with the caster.

      Example:

      ```javascript
      var promise = RSVP.Promise.resolve(1);
      var casted = RSVP.Promise.cast(promise);

      console.log(promise === casted); // true
      ```

      In the case of a promise whose constructor does not match, it is assimilated.
      The resulting promise will fulfill or reject based on the outcome of the
      promise being casted.

      Example:

      ```javascript
      var thennable = $.getJSON('/api/foo');
      var casted = RSVP.Promise.cast(thennable);

      console.log(thennable === casted); // false
      console.log(casted instanceof RSVP.Promise) // true

      casted.then(function(data) {
        // data is the value getJSON fulfills with
      });
      ```

      In the case of a non-promise, a promise which will fulfill with that value is
      returned.

      Example:

      ```javascript
      var value = 1; // could be a number, boolean, string, undefined...
      var casted = RSVP.Promise.cast(value);

      console.log(value === casted); // false
      console.log(casted instanceof RSVP.Promise) // true

      casted.then(function(val) {
        val === value // => true
      });
      ```

      `RSVP.Promise.cast` is similar to `RSVP.Promise.resolve`, but `RSVP.Promise.cast` differs in the
      following ways:

      * `RSVP.Promise.cast` serves as a memory-efficient way of getting a promise, when you
      have something that could either be a promise or a value. RSVP.resolve
      will have the same effect but will create a new promise wrapper if the
      argument is a promise.
      * `RSVP.Promise.cast` is a way of casting incoming thenables or promise subclasses to
      promises of the exact class specified, so that the resulting object's `then` is
      ensured to have the behavior of the constructor you are calling cast on (i.e., RSVP.Promise).

      @method cast
      @static
      @param {Object} object to be casted
      @param {String} label optional string for labeling the promise.
      Useful for tooling.
      @return {Promise} promise
    */
    __exports__['default'] = function cast(object, label) {
        /*jshint validthis:true */
        var Constructor = this;
        if (object && typeof object === 'object' && object.constructor === Constructor) {
            return object;
        }
        return new Constructor(function (resolve) {
            resolve(object);
        }, label);
    };
});
define('rsvp/promise/race', [
    '../utils',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    /* global toString */
    var isArray = __dependency1__.isArray;
    var isFunction = __dependency1__.isFunction;
    var isNonThenable = __dependency1__.isNonThenable;
    /**
      `RSVP.Promise.race` returns a new promise which is settled in the same way as the
      first passed promise to settle.

      Example:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 2");
        }, 100);
      });

      RSVP.Promise.race([promise1, promise2]).then(function(result){
        // result === "promise 2" because it was resolved before promise1
        // was resolved.
      });
      ```

      `RSVP.Promise.race` is deterministic in that only the state of the first
      settled promise matters. For example, even if other promises given to the
      `promises` array argument are resolved, but the first settled promise has
      become rejected before the other promises became fulfilled, the returned
      promise will become rejected:

      ```javascript
      var promise1 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          resolve("promise 1");
        }, 200);
      });

      var promise2 = new RSVP.Promise(function(resolve, reject){
        setTimeout(function(){
          reject(new Error("promise 2"));
        }, 100);
      });

      RSVP.Promise.race([promise1, promise2]).then(function(result){
        // Code here never runs
      }, function(reason){
        // reason.message === "promise2" because promise 2 became rejected before
        // promise 1 became fulfilled
      });
      ```

      An example real-world use case is implementing timeouts:

      ```javascript
      RSVP.Promise.race([ajax('foo.json'), timeout(5000)])
      ```

      @method race
      @static
      @param {Array} promises array of promises to observe
      @param {String} label optional string for describing the promise returned.
      Useful for tooling.
      @return {Promise} a promise which settles in the same way as the first passed
      promise to settle.
    */
    __exports__['default'] = function race(entries, label) {
        /*jshint validthis:true */
        var Constructor = this, entry;
        return new Constructor(function (resolve, reject) {
            if (!isArray(entries)) {
                throw new TypeError('You must pass an array to race.');
            }
            var pending = true;
            function onFulfillment(value) {
                if (pending) {
                    pending = false;
                    resolve(value);
                }
            }
            function onRejection(reason) {
                if (pending) {
                    pending = false;
                    reject(reason);
                }
            }
            for (var i = 0; i < entries.length; i++) {
                entry = entries[i];
                if (isNonThenable(entry)) {
                    pending = false;
                    resolve(entry);
                    return;
                } else {
                    Constructor.resolve(entry).then(onFulfillment, onRejection);
                }
            }
        }, label);
    };
});
define('rsvp/promise/reject', ['exports'], function (__exports__) {
    'use strict';
    /**
      `RSVP.Promise.reject` returns a promise rejected with the passed `reason`.
      It is shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        reject(new Error('WHOOPS'));
      });

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.Promise.reject(new Error('WHOOPS'));

      promise.then(function(value){
        // Code here doesn't run because the promise is rejected!
      }, function(reason){
        // reason.message === 'WHOOPS'
      });
      ```

      @method reject
      @static
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    __exports__['default'] = function reject(reason, label) {
        /*jshint validthis:true */
        var Constructor = this;
        return new Constructor(function (resolve, reject$2) {
            reject$2(reason);
        }, label);
    };
});
define('rsvp/promise/resolve', ['exports'], function (__exports__) {
    'use strict';
    /**
      `RSVP.Promise.resolve` returns a promise that will become resolved with the
      passed `value`. It is shorthand for the following:

      ```javascript
      var promise = new RSVP.Promise(function(resolve, reject){
        resolve(1);
      });

      promise.then(function(value){
        // value === 1
      });
      ```

      Instead of writing the above, your code now simply becomes the following:

      ```javascript
      var promise = RSVP.Promise.resolve(1);

      promise.then(function(value){
        // value === 1
      });
      ```

      @method resolve
      @static
      @param {Any} value value that the returned promise will be resolved with
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    __exports__['default'] = function resolve(object, label) {
        /*jshint validthis:true */
        var Constructor = this;
        if (object && typeof object === 'object' && object.constructor === Constructor) {
            return object;
        }
        return new Constructor(function (resolve$2) {
            resolve$2(object);
        }, label);
    };
});
define('rsvp/race', [
    './promise',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    /**
      This is a convenient alias for `RSVP.Promise.race`.

      @method race
      @static
      @for RSVP
      @param {Array} array Array of promises.
      @param {String} label An optional label. This is useful
      for tooling.
     */
    __exports__['default'] = function race(array, label) {
        return Promise.race(array, label);
    };
});
define('rsvp/reject', [
    './promise',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    /**
      This is a convenient alias for `RSVP.Promise.reject`.

      @method reject
      @static
      @for RSVP
      @param {Any} reason value that the returned promise will be rejected with.
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise rejected with the given `reason`.
    */
    __exports__['default'] = function reject(reason, label) {
        return Promise.reject(reason, label);
    };
});
define('rsvp/resolve', [
    './promise',
    'exports'
], function (__dependency1__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    /**
      This is a convenient alias for `RSVP.Promise.resolve`.

      @method resolve
      @static
      @for RSVP
      @param {Any} value value that the returned promise will be resolved with
      @param {String} label optional string for identifying the returned promise.
      Useful for tooling.
      @return {Promise} a promise that will become fulfilled with the given
      `value`
    */
    __exports__['default'] = function resolve(value, label) {
        return Promise.resolve(value, label);
    };
});
define('rsvp/rethrow', ['exports'], function (__exports__) {
    'use strict';
    /**
      `RSVP.rethrow` will rethrow an error on the next turn of the JavaScript event
      loop in order to aid debugging.

      Promises A+ specifies that any exceptions that occur with a promise must be
      caught by the promises implementation and bubbled to the last handler. For
      this reason, it is recommended that you always specify a second rejection
      handler function to `then`. However, `RSVP.rethrow` will throw the exception
      outside of the promise, so it bubbles up to your console if in the browser,
      or domain/cause uncaught exception in Node. `rethrow` will also throw the
      error again so the error can be handled by the promise per the spec.

      ```javascript
      function throws(){
        throw new Error('Whoops!');
      }

      var promise = new RSVP.Promise(function(resolve, reject){
        throws();
      });

      promise.catch(RSVP.rethrow).then(function(){
        // Code here doesn't run because the promise became rejected due to an
        // error!
      }, function (err){
        // handle the error here
      });
      ```

      The 'Whoops' error will be thrown on the next turn of the event loop
      and you can watch for it in your console. You can also handle it using a
      rejection handler given to `.then` or `.catch` on the returned promise.

      @method rethrow
      @static
      @for RSVP
      @param {Error} reason reason the promise became rejected.
      @throws Error
      @static
    */
    __exports__['default'] = function rethrow(reason) {
        setTimeout(function () {
            throw reason;
        });
        throw reason;
    };
});
define('rsvp/utils', ['exports'], function (__exports__) {
    'use strict';
    function objectOrFunction(x) {
        return typeof x === 'function' || typeof x === 'object' && x !== null;
    }
    __exports__.objectOrFunction = objectOrFunction;
    function isFunction(x) {
        return typeof x === 'function';
    }
    __exports__.isFunction = isFunction;
    function isNonThenable(x) {
        return !objectOrFunction(x);
    }
    __exports__.isNonThenable = isNonThenable;
    var _isArray;
    if (!Array.isArray) {
        _isArray = function (x) {
            return Object.prototype.toString.call(x) === '[object Array]';
        };
    } else {
        _isArray = Array.isArray;
    }
    var isArray = _isArray;
    __exports__.isArray = isArray;
    // Date.now is not available in browsers < IE9
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
    var now = Date.now || function () {
            return new Date().getTime();
        };
    __exports__.now = now;
    var keysOf = Object.keys || function (object) {
            var result = [];
            for (var prop in object) {
                result.push(prop);
            }
            return result;
        };
    __exports__.keysOf = keysOf;
});
define('rsvp', [
    './rsvp/promise',
    './rsvp/events',
    './rsvp/node',
    './rsvp/all',
    './rsvp/all_settled',
    './rsvp/race',
    './rsvp/hash',
    './rsvp/hash_settled',
    './rsvp/rethrow',
    './rsvp/defer',
    './rsvp/config',
    './rsvp/map',
    './rsvp/resolve',
    './rsvp/reject',
    './rsvp/filter',
    './rsvp/asap',
    'exports'
], function (__dependency1__, __dependency2__, __dependency3__, __dependency4__, __dependency5__, __dependency6__, __dependency7__, __dependency8__, __dependency9__, __dependency10__, __dependency11__, __dependency12__, __dependency13__, __dependency14__, __dependency15__, __dependency16__, __exports__) {
    'use strict';
    var Promise = __dependency1__['default'];
    var EventTarget = __dependency2__['default'];
    var denodeify = __dependency3__['default'];
    var all = __dependency4__['default'];
    var allSettled = __dependency5__['default'];
    var race = __dependency6__['default'];
    var hash = __dependency7__['default'];
    var hashSettled = __dependency8__['default'];
    var rethrow = __dependency9__['default'];
    var defer = __dependency10__['default'];
    var config = __dependency11__.config;
    var configure = __dependency11__.configure;
    var map = __dependency12__['default'];
    var resolve = __dependency13__['default'];
    var reject = __dependency14__['default'];
    var filter = __dependency15__['default'];
    var asap = __dependency16__['default'];
    config.async = asap;
    // default async is asap;
    function async(callback, arg) {
        config.async(callback, arg);
    }
    function on() {
        config.on.apply(config, arguments);
    }
    function off() {
        config.off.apply(config, arguments);
    }
    // Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
    if (typeof window !== 'undefined' && typeof window.__PROMISE_INSTRUMENTATION__ === 'object') {
        var callbacks = window.__PROMISE_INSTRUMENTATION__;
        configure('instrument', true);
        for (var eventName in callbacks) {
            if (callbacks.hasOwnProperty(eventName)) {
                on(eventName, callbacks[eventName]);
            }
        }
    }
    __exports__.Promise = Promise;
    __exports__.EventTarget = EventTarget;
    __exports__.all = all;
    __exports__.allSettled = allSettled;
    __exports__.race = race;
    __exports__.hash = hash;
    __exports__.hashSettled = hashSettled;
    __exports__.rethrow = rethrow;
    __exports__.defer = defer;
    __exports__.denodeify = denodeify;
    __exports__.configure = configure;
    __exports__.on = on;
    __exports__.off = off;
    __exports__.resolve = resolve;
    __exports__.reject = reject;
    __exports__.async = async;
    __exports__.map = map;
    __exports__.filter = filter;
});