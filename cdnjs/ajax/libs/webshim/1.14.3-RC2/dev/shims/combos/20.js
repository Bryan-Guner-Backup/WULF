// Copyright 2009-2012 by contributors, MIT License
// vim: ts=4 sts=4 sw=4 expandtab

(function () {
setTimeout(function(){
	webshims.isReady('es5', true);
});
	/**
	 * Brings an environment as close to ECMAScript 5 compliance
	 * as is possible with the facilities of erstwhile engines.
	 *
	 * Annotated ES5: http://es5.github.com/ (specific links below)
	 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
	 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
	 */

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
	var call = Function.prototype.call;
	var prototypeOfArray = Array.prototype;
	var prototypeOfObject = Object.prototype;
	var _Array_slice_ = prototypeOfArray.slice;
	var array_splice = Array.prototype.splice;
	var array_push = Array.prototype.push;
	var array_unshift = Array.prototype.unshift;

// Having a toString local variable name breaks in Opera so use _toString.
	var _toString = prototypeOfObject.toString;

	var isFunction = function (val) {
		return prototypeOfObject.toString.call(val) === '[object Function]';
	};
	var isRegex = function (val) {
		return prototypeOfObject.toString.call(val) === '[object RegExp]';
	};
	var isArray = function isArray(obj) {
		return _toString.call(obj) === "[object Array]";
	};
	var isArguments = function isArguments(value) {
		var str = _toString.call(value);
		var isArgs = str === '[object Arguments]';
		if (!isArgs) {
			isArgs = !isArray(str)
				&& value !== null
				&& typeof value === 'object'
				&& typeof value.length === 'number'
				&& value.length >= 0
				&& isFunction(value.callee);
		}
		return isArgs;
	};

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

	function Empty() {}

	if (!Function.prototype.bind) {
		Function.prototype.bind = function bind(that) { // .length is 1
			// 1. Let Target be the this value.
			var target = this;
			// 2. If IsCallable(Target) is false, throw a TypeError exception.
			if (!isFunction(target)) {
				throw new TypeError("Function.prototype.bind called on incompatible " + target);
			}
			// 3. Let A be a new (possibly empty) internal list of all of the
			// argument values provided after thisArg (arg1, arg2 etc), in order.
			// XXX slicedArgs will stand in for "A" if used
			var args = _Array_slice_.call(arguments, 1); // for normal call
			// 4. Let F be a new native ECMAScript object.
			// 11. Set the [[Prototype]] internal property of F to the standard
			// built-in Function prototype object as specified in 15.3.3.1.
			// 12. Set the [[Call]] internal property of F as described in
			// 15.3.4.5.1.
			// 13. Set the [[Construct]] internal property of F as described in
			// 15.3.4.5.2.
			// 14. Set the [[HasInstance]] internal property of F as described in
			// 15.3.4.5.3.
			var binder = function () {

				if (this instanceof bound) {
					// 15.3.4.5.2 [[Construct]]
					// When the [[Construct]] internal method of a function object,
					// F that was created using the bind function is called with a
					// list of arguments ExtraArgs, the following steps are taken:
					// 1. Let target be the value of F's [[TargetFunction]]
					// internal property.
					// 2. If target has no [[Construct]] internal method, a
					// TypeError exception is thrown.
					// 3. Let boundArgs be the value of F's [[BoundArgs]] internal
					// property.
					// 4. Let args be a new list containing the same values as the
					// list boundArgs in the same order followed by the same
					// values as the list ExtraArgs in the same order.
					// 5. Return the result of calling the [[Construct]] internal
					// method of target providing args as the arguments.

					var result = target.apply(
						this,
						args.concat(_Array_slice_.call(arguments))
					);
					if (Object(result) === result) {
						return result;
					}
					return this;

				} else {
					// 15.3.4.5.1 [[Call]]
					// When the [[Call]] internal method of a function object, F,
					// which was created using the bind function is called with a
					// this value and a list of arguments ExtraArgs, the following
					// steps are taken:
					// 1. Let boundArgs be the value of F's [[BoundArgs]] internal
					// property.
					// 2. Let boundThis be the value of F's [[BoundThis]] internal
					// property.
					// 3. Let target be the value of F's [[TargetFunction]] internal
					// property.
					// 4. Let args be a new list containing the same values as the
					// list boundArgs in the same order followed by the same
					// values as the list ExtraArgs in the same order.
					// 5. Return the result of calling the [[Call]] internal method
					// of target providing boundThis as the this value and
					// providing args as the arguments.

					// equiv: target.call(this, ...boundArgs, ...args)
					return target.apply(
						that,
						args.concat(_Array_slice_.call(arguments))
					);

				}

			};

			// 15. If the [[Class]] internal property of Target is "Function", then
			// a. Let L be the length property of Target minus the length of A.
			// b. Set the length own property of F to either 0 or L, whichever is
			// larger.
			// 16. Else set the length own property of F to 0.

			var boundLength = Math.max(0, target.length - args.length);

			// 17. Set the attributes of the length own property of F to the values
			// specified in 15.3.5.1.
			var boundArgs = [];
			for (var i = 0; i < boundLength; i++) {
				boundArgs.push("$" + i);
			}

			// XXX Build a dynamic function with desired amount of arguments is the only
			// way to set the length property of a function.
			// In environments where Content Security Policies enabled (Chrome extensions,
			// for ex.) all use of eval or Function costructor throws an exception.
			// However in all of these environments Function.prototype.bind exists
			// and so this code will never be executed.
			var bound = Function("binder", "return function (" + boundArgs.join(",") + "){return binder.apply(this,arguments)}")(binder);

			if (target.prototype) {
				Empty.prototype = target.prototype;
				bound.prototype = new Empty();
				// Clean up dangling references.
				Empty.prototype = null;
			}

			// TODO
			// 18. Set the [[Extensible]] internal property of F to true.

			// TODO
			// 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
			// 20. Call the [[DefineOwnProperty]] internal method of F with
			// arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
			// thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
			// false.
			// 21. Call the [[DefineOwnProperty]] internal method of F with
			// arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
			// [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
			// and false.

			// TODO
			// NOTE Function objects created using Function.prototype.bind do not
			// have a prototype property or the [[Code]], [[FormalParameters]], and
			// [[Scope]] internal properties.
			// XXX can't delete prototype in pure-js.

			// 22. Return F.
			return bound;
		};
	}

// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
	var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
	var defineGetter;
	var defineSetter;
	var lookupGetter;
	var lookupSetter;
	var supportsAccessors;
	if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
		defineGetter = call.bind(prototypeOfObject.__defineGetter__);
		defineSetter = call.bind(prototypeOfObject.__defineSetter__);
		lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
		lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
	}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
	var spliceWorksWithEmptyObject = (function () {
		var obj = {};
		Array.prototype.splice.call(obj, 0, 0, 1);
		return obj.length === 1;
	}());
	var omittingSecondSpliceArgIsNoop = [1].splice(0).length === 0;
	var spliceNoopReturnsEmptyArray = (function () {
		var a = [1, 2];
		var result = a.splice();
		return a.length === 2 && isArray(result) && result.length === 0;
	}());
	if (spliceNoopReturnsEmptyArray) {
		// Safari 5.0 bug where .split() returns undefined
		Array.prototype.splice = function splice(start, deleteCount) {
			if (arguments.length === 0) { return []; }
			else { return array_splice.apply(this, arguments); }
		};
	}
	if (!omittingSecondSpliceArgIsNoop || !spliceWorksWithEmptyObject) {
		Array.prototype.splice = function splice(start, deleteCount) {
			if (arguments.length === 0) { return []; }
			var args = arguments;
			this.length = Math.max(toInteger(this.length), 0);
			if (arguments.length > 0 && typeof deleteCount !== 'number') {
				args = _Array_slice_.call(arguments);
				if (args.length < 2) { args.push(toInteger(deleteCount)); }
				else { args[1] = toInteger(deleteCount); }
			}
			return array_splice.apply(this, args);
		};
	}

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.13
// Return len+argCount.
// [bugfix, ielt8]
// IE < 8 bug: [].unshift(0) === undefined but should be "1"
	if ([].unshift(0) !== 1) {
		Array.prototype.unshift = function () {
			array_unshift.apply(this, arguments);
			return this.length;
		};
	}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
	if (!Array.isArray) {
		Array.isArray = isArray;
	}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function". Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
	var boxedString = Object("a");
	var splitString = boxedString[0] !== "a" || !(0 in boxedString);

	var properlyBoxesContext = function properlyBoxed(method) {
		// Check node 0.6.21 bug where third parameter is not boxed
		var properlyBoxesNonStrict = true;
		var properlyBoxesStrict = true;
		if (method) {
			method.call('foo', function (_, __, context) {
				if (typeof context !== 'object') { properlyBoxesNonStrict = false; }
			});

			method.call([1], function () {
				'use strict';
				properlyBoxesStrict = typeof this === 'string';
			}, 'x');
		}
		return !!method && properlyBoxesNonStrict && properlyBoxesStrict;
	};

	if (!Array.prototype.forEach || !properlyBoxesContext(Array.prototype.forEach)) {
		Array.prototype.forEach = function forEach(fun /*, thisp*/) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				thisp = arguments[1],
				i = -1,
				length = self.length >>> 0;

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(); // TODO message
			}

			while (++i < length) {
				if (i in self) {
					// Invoke the callback function with call, passing arguments:
					// context, property value, property key, thisArg object
					// context
					fun.call(thisp, self[i], i, object);
				}
			}
		};
	}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
	if (!Array.prototype.map || !properlyBoxesContext(Array.prototype.map)) {
		Array.prototype.map = function map(fun /*, thisp*/) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0,
				result = Array(length),
				thisp = arguments[1];

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			for (var i = 0; i < length; i++) {
				if (i in self) {
					result[i] = fun.call(thisp, self[i], i, object);
				}
			}
			return result;
		};
	}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
	if (!Array.prototype.filter || !properlyBoxesContext(Array.prototype.filter)) {
		Array.prototype.filter = function filter(fun /*, thisp */) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0,
				result = [],
				value,
				thisp = arguments[1];

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			for (var i = 0; i < length; i++) {
				if (i in self) {
					value = self[i];
					if (fun.call(thisp, value, i, object)) {
						result.push(value);
					}
				}
			}
			return result;
		};
	}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
	if (!Array.prototype.every || !properlyBoxesContext(Array.prototype.every)) {
		Array.prototype.every = function every(fun /*, thisp */) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0,
				thisp = arguments[1];

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			for (var i = 0; i < length; i++) {
				if (i in self && !fun.call(thisp, self[i], i, object)) {
					return false;
				}
			}
			return true;
		};
	}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
	if (!Array.prototype.some || !properlyBoxesContext(Array.prototype.some)) {
		Array.prototype.some = function some(fun /*, thisp */) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0,
				thisp = arguments[1];

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			for (var i = 0; i < length; i++) {
				if (i in self && fun.call(thisp, self[i], i, object)) {
					return true;
				}
			}
			return false;
		};
	}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
	var reduceCoercesToObject = false;
	if (Array.prototype.reduce) {
		reduceCoercesToObject = typeof Array.prototype.reduce.call('es5', function (_, __, ___, list) { return list; }) === 'object';
	}
	if (!Array.prototype.reduce || !reduceCoercesToObject) {
		Array.prototype.reduce = function reduce(fun /*, initial*/) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0;

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			// no value to return if no initial value and an empty array
			if (!length && arguments.length === 1) {
				throw new TypeError("reduce of empty array with no initial value");
			}

			var i = 0;
			var result;
			if (arguments.length >= 2) {
				result = arguments[1];
			} else {
				do {
					if (i in self) {
						result = self[i++];
						break;
					}

					// if array contains no values, no initial value to return
					if (++i >= length) {
						throw new TypeError("reduce of empty array with no initial value");
					}
				} while (true);
			}

			for (; i < length; i++) {
				if (i in self) {
					result = fun.call(void 0, result, self[i], i, object);
				}
			}

			return result;
		};
	}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
	var reduceRightCoercesToObject = false;
	if (Array.prototype.reduceRight) {
		reduceRightCoercesToObject = typeof Array.prototype.reduceRight.call('es5', function (_, __, ___, list) { return list; }) === 'object';
	}
	if (!Array.prototype.reduceRight || !reduceRightCoercesToObject) {
		Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
			var object = toObject(this),
				self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					object,
				length = self.length >>> 0;

			// If no callback function or if callback is not a callable function
			if (!isFunction(fun)) {
				throw new TypeError(fun + " is not a function");
			}

			// no value to return if no initial value, empty array
			if (!length && arguments.length === 1) {
				throw new TypeError("reduceRight of empty array with no initial value");
			}

			var result, i = length - 1;
			if (arguments.length >= 2) {
				result = arguments[1];
			} else {
				do {
					if (i in self) {
						result = self[i--];
						break;
					}

					// if array contains no values, no initial value to return
					if (--i < 0) {
						throw new TypeError("reduceRight of empty array with no initial value");
					}
				} while (true);
			}

			if (i < 0) {
				return result;
			}

			do {
				if (i in self) {
					result = fun.call(void 0, result, self[i], i, object);
				}
			} while (i--);

			return result;
		};
	}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
	if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) !== -1)) {
		Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
			var self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					toObject(this),
				length = self.length >>> 0;

			if (!length) {
				return -1;
			}

			var i = 0;
			if (arguments.length > 1) {
				i = toInteger(arguments[1]);
			}

			// handle negative indices
			i = i >= 0 ? i : Math.max(0, length + i);
			for (; i < length; i++) {
				if (i in self && self[i] === sought) {
					return i;
				}
			}
			return -1;
		};
	}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
	if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) !== -1)) {
		Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
			var self = splitString && _toString.call(this) === "[object String]" ?
					this.split("") :
					toObject(this),
				length = self.length >>> 0;

			if (!length) {
				return -1;
			}
			var i = length - 1;
			if (arguments.length > 1) {
				i = Math.min(i, toInteger(arguments[1]));
			}
			// handle negative indices
			i = i >= 0 ? i : length - Math.abs(i);
			for (; i >= 0; i--) {
				if (i in self && sought === self[i]) {
					return i;
				}
			}
			return -1;
		};
	}

//
// Object
// ======
//

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
	var keysWorksWithArguments = Object.keys && (function () {
		return Object.keys(arguments).length === 2;
	}(1, 2));
	if (!Object.keys) {
		// http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
		var hasDontEnumBug = !({'toString': null}).propertyIsEnumerable('toString'),
			hasProtoEnumBug = (function () {}).propertyIsEnumerable('prototype'),
			dontEnums = [
				"toString",
				"toLocaleString",
				"valueOf",
				"hasOwnProperty",
				"isPrototypeOf",
				"propertyIsEnumerable",
				"constructor"
			],
			dontEnumsLength = dontEnums.length;

		Object.keys = function keys(object) {
			var isFn = isFunction(object),
				isArgs = isArguments(object),
				isObject = object !== null && typeof object === 'object',
				isString = isObject && _toString.call(object) === '[object String]';

			if (!isObject && !isFn && !isArgs) {
				throw new TypeError("Object.keys called on a non-object");
			}

			var theKeys = [];
			var skipProto = hasProtoEnumBug && isFn;
			if (isString || isArgs) {
				for (var i = 0; i < object.length; ++i) {
					theKeys.push(String(i));
				}
			} else {
				for (var name in object) {
					if (!(skipProto && name === 'prototype') && owns(object, name)) {
						theKeys.push(String(name));
					}
				}
			}

			if (hasDontEnumBug) {
				var ctor = object.constructor,
					skipConstructor = ctor && ctor.prototype === object;
				for (var j = 0; j < dontEnumsLength; j++) {
					var dontEnum = dontEnums[j];
					if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
						theKeys.push(dontEnum);
					}
				}
			}
			return theKeys;
		};
	} else if (!keysWorksWithArguments) {
		// Safari 5.0 bug
		var originalKeys = Object.keys;
		Object.keys = function keys(object) {
			if (isArguments(object)) {
				return originalKeys(Array.prototype.slice.call(object));
			} else {
				return originalKeys(object);
			}
		};
	}

//
// Date
// ====
//

// ES5 15.9.5.43
// http://es5.github.com/#x15.9.5.43
// This function returns a String value represent the instance in time
// represented by this Date object. The format of the String is the Date Time
// string format defined in 15.9.1.15. All fields are present in the String.
// The time zone is always UTC, denoted by the suffix Z. If the time value of
// this object is not a finite Number a RangeError exception is thrown.
	var negativeDate = -62198755200000,
		negativeYearString = "-000001";
	if (
		!Date.prototype.toISOString ||
			(new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1)
		) {
		Date.prototype.toISOString = function toISOString() {
			var result, length, value, year, month;
			if (!isFinite(this)) {
				throw new RangeError("Date.prototype.toISOString called on non-finite value.");
			}

			year = this.getUTCFullYear();

			month = this.getUTCMonth();
			// see https://github.com/es-shims/es5-shim/issues/111
			year += Math.floor(month / 12);
			month = (month % 12 + 12) % 12;

			// the date time string format is specified in 15.9.1.15.
			result = [month + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds()];
			year = (
				(year < 0 ? "-" : (year > 9999 ? "+" : "")) +
					("00000" + Math.abs(year)).slice(0 <= year && year <= 9999 ? -4 : -6)
				);

			length = result.length;
			while (length--) {
				value = result[length];
				// pad months, days, hours, minutes, and seconds to have two
				// digits.
				if (value < 10) {
					result[length] = "0" + value;
				}
			}
			// pad milliseconds to have three digits.
			return (
				year + "-" + result.slice(0, 2).join("-") +
					"T" + result.slice(2).join(":") + "." +
					("000" + this.getUTCMilliseconds()).slice(-3) + "Z"
				);
		};
	}


// ES5 15.9.5.44
// http://es5.github.com/#x15.9.5.44
// This function provides a String representation of a Date object for use by
// JSON.stringify (15.12.3).
	var dateToJSONIsSupported = false;
	try {
		dateToJSONIsSupported = (
			Date.prototype.toJSON &&
				new Date(NaN).toJSON() === null &&
				new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
				Date.prototype.toJSON.call({ // generic
					toISOString: function () {
						return true;
					}
				})
			);
	} catch (e) {
	}
	if (!dateToJSONIsSupported) {
		Date.prototype.toJSON = function toJSON(key) {
			// When the toJSON method is called with argument key, the following
			// steps are taken:

			// 1. Let O be the result of calling ToObject, giving it the this
			// value as its argument.
			// 2. Let tv be toPrimitive(O, hint Number).
			var o = Object(this),
				tv = toPrimitive(o),
				toISO;
			// 3. If tv is a Number and is not finite, return null.
			if (typeof tv === "number" && !isFinite(tv)) {
				return null;
			}
			// 4. Let toISO be the result of calling the [[Get]] internal method of
			// O with argument "toISOString".
			toISO = o.toISOString;
			// 5. If IsCallable(toISO) is false, throw a TypeError exception.
			if (typeof toISO !== "function") {
				throw new TypeError("toISOString property is not callable");
			}
			// 6. Return the result of calling the [[Call]] internal method of
			// toISO with O as the this value and an empty argument list.
			return toISO.call(o);

			// NOTE 1 The argument is ignored.

			// NOTE 2 The toJSON function is intentionally generic; it does not
			// require that its this value be a Date object. Therefore, it can be
			// transferred to other kinds of objects for use as a method. However,
			// it does require that any such object have a toISOString method. An
			// object is free to use the argument key to filter its
			// stringification.
		};
	}

// ES5 15.9.4.2
// http://es5.github.com/#x15.9.4.2
// based on work shared by Daniel Friesen (dantman)
// http://gist.github.com/303249
	var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
	var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z'));
	var doesNotParseY2KNewYear = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
	if (!Date.parse || doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
		// XXX global assignment won't work in embeddings that use
		// an alternate object for the context.
		Date = (function (NativeDate) {

			// Date.length === 7
			function Date(Y, M, D, h, m, s, ms) {
				var length = arguments.length;
				if (this instanceof NativeDate) {
					var date = length === 1 && String(Y) === Y ? // isString(Y)
						// We explicitly pass it through parse:
						new NativeDate(Date.parse(Y)) :
						// We have to manually make calls depending on argument
						// length here
						length >= 7 ? new NativeDate(Y, M, D, h, m, s, ms) :
							length >= 6 ? new NativeDate(Y, M, D, h, m, s) :
								length >= 5 ? new NativeDate(Y, M, D, h, m) :
									length >= 4 ? new NativeDate(Y, M, D, h) :
										length >= 3 ? new NativeDate(Y, M, D) :
											length >= 2 ? new NativeDate(Y, M) :
												length >= 1 ? new NativeDate(Y) :
													new NativeDate();
					// Prevent mixups with unfixed Date object
					date.constructor = Date;
					return date;
				}
				return NativeDate.apply(this, arguments);
			}

			// 15.9.1.15 Date Time String Format.
			var isoDateExpression = new RegExp("^" +
				"(\\d{4}|[\+\-]\\d{6})" + // four-digit year capture or sign +
				// 6-digit extended year
				"(?:-(\\d{2})" + // optional month capture
				"(?:-(\\d{2})" + // optional day capture
				"(?:" + // capture hours:minutes:seconds.milliseconds
				"T(\\d{2})" + // hours capture
				":(\\d{2})" + // minutes capture
				"(?:" + // optional :seconds.milliseconds
				":(\\d{2})" + // seconds capture
				"(?:(\\.\\d{1,}))?" + // milliseconds capture
				")?" +
				"(" + // capture UTC offset component
				"Z|" + // UTC capture
				"(?:" + // offset specifier +/-hours:minutes
				"([-+])" + // sign capture
				"(\\d{2})" + // hours offset capture
				":(\\d{2})" + // minutes offset capture
				")" +
				")?)?)?)?" +
				"$");

			var months = [
				0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365
			];

			function dayFromMonth(year, month) {
				var t = month > 1 ? 1 : 0;
				return (
					months[month] +
						Math.floor((year - 1969 + t) / 4) -
						Math.floor((year - 1901 + t) / 100) +
						Math.floor((year - 1601 + t) / 400) +
						365 * (year - 1970)
					);
			}

			function toUTC(t) {
				return Number(new NativeDate(1970, 0, 1, 0, 0, 0, t));
			}

			// Copy any custom methods a 3rd party library may have added
			for (var key in NativeDate) {
				Date[key] = NativeDate[key];
			}

			// Copy "native" methods explicitly; they may be non-enumerable
			Date.now = NativeDate.now;
			Date.UTC = NativeDate.UTC;
			Date.prototype = NativeDate.prototype;
			Date.prototype.constructor = Date;

			// Upgrade Date.parse to handle simplified ISO 8601 strings
			Date.parse = function parse(string) {
				var match = isoDateExpression.exec(string);
				if (match) {
					// parse months, days, hours, minutes, seconds, and milliseconds
					// provide default values if necessary
					// parse the UTC offset component
					var year = Number(match[1]),
						month = Number(match[2] || 1) - 1,
						day = Number(match[3] || 1) - 1,
						hour = Number(match[4] || 0),
						minute = Number(match[5] || 0),
						second = Number(match[6] || 0),
						millisecond = Math.floor(Number(match[7] || 0) * 1000),
					// When time zone is missed, local offset should be used
					// (ES 5.1 bug)
					// see https://bugs.ecmascript.org/show_bug.cgi?id=112
						isLocalTime = Boolean(match[4] && !match[8]),
						signOffset = match[9] === "-" ? 1 : -1,
						hourOffset = Number(match[10] || 0),
						minuteOffset = Number(match[11] || 0),
						result;
					if (
						hour < (
							minute > 0 || second > 0 || millisecond > 0 ?
								24 : 25
							) &&
							minute < 60 && second < 60 && millisecond < 1000 &&
							month > -1 && month < 12 && hourOffset < 24 &&
							minuteOffset < 60 && // detect invalid offsets
							day > -1 &&
							day < (
								dayFromMonth(year, month + 1) -
									dayFromMonth(year, month)
								)
						) {
						result = (
							(dayFromMonth(year, month) + day) * 24 +
								hour +
								hourOffset * signOffset
							) * 60;
						result = (
							(result + minute + minuteOffset * signOffset) * 60 +
								second
							) * 1000 + millisecond;
						if (isLocalTime) {
							result = toUTC(result);
						}
						if (-8.64e15 <= result && result <= 8.64e15) {
							return result;
						}
					}
					return NaN;
				}
				return NativeDate.parse.apply(this, arguments);
			};

			return Date;
		})(Date);
	}

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
	if (!Date.now) {
		Date.now = function now() {
			return new Date().getTime();
		};
	}


//
// Number
// ======
//

// ES5.1 15.7.4.5
// http://es5.github.com/#x15.7.4.5
	if (!Number.prototype.toFixed || (0.00008).toFixed(3) !== '0.000' || (0.9).toFixed(0) === '0' || (1.255).toFixed(2) !== '1.25' || (1000000000000000128).toFixed(0) !== "1000000000000000128") {
		// Hide these variables and functions
		(function () {
			var base, size, data, i;

			base = 1e7;
			size = 6;
			data = [0, 0, 0, 0, 0, 0];

			function multiply(n, c) {
				var i = -1;
				while (++i < size) {
					c += n * data[i];
					data[i] = c % base;
					c = Math.floor(c / base);
				}
			}

			function divide(n) {
				var i = size, c = 0;
				while (--i >= 0) {
					c += data[i];
					data[i] = Math.floor(c / n);
					c = (c % n) * base;
				}
			}

			function numToString() {
				var i = size;
				var s = '';
				while (--i >= 0) {
					if (s !== '' || i === 0 || data[i] !== 0) {
						var t = String(data[i]);
						if (s === '') {
							s = t;
						} else {
							s += '0000000'.slice(0, 7 - t.length) + t;
						}
					}
				}
				return s;
			}

			function pow(x, n, acc) {
				return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
			}

			function log(x) {
				var n = 0;
				while (x >= 4096) {
					n += 12;
					x /= 4096;
				}
				while (x >= 2) {
					n += 1;
					x /= 2;
				}
				return n;
			}

			Number.prototype.toFixed = function toFixed(fractionDigits) {
				var f, x, s, m, e, z, j, k;

				// Test for NaN and round fractionDigits down
				f = Number(fractionDigits);
				f = f !== f ? 0 : Math.floor(f);

				if (f < 0 || f > 20) {
					throw new RangeError("Number.toFixed called with invalid number of decimals");
				}

				x = Number(this);

				// Test for NaN
				if (x !== x) {
					return "NaN";
				}

				// If it is too big or small, return the string value of the number
				if (x <= -1e21 || x >= 1e21) {
					return String(x);
				}

				s = "";

				if (x < 0) {
					s = "-";
					x = -x;
				}

				m = "0";

				if (x > 1e-21) {
					// 1e-21 < x < 1e21
					// -70 < log2(x) < 70
					e = log(x * pow(2, 69, 1)) - 69;
					z = (e < 0 ? x * pow(2, -e, 1) : x / pow(2, e, 1));
					z *= 0x10000000000000; // Math.pow(2, 52);
					e = 52 - e;

					// -18 < e < 122
					// x = z / 2 ^ e
					if (e > 0) {
						multiply(0, z);
						j = f;

						while (j >= 7) {
							multiply(1e7, 0);
							j -= 7;
						}

						multiply(pow(10, j, 1), 0);
						j = e - 1;

						while (j >= 23) {
							divide(1 << 23);
							j -= 23;
						}

						divide(1 << j);
						multiply(1, 1);
						divide(2);
						m = numToString();
					} else {
						multiply(0, z);
						multiply(1 << (-e), 0);
						m = numToString() + '0.00000000000000000000'.slice(2, 2 + f);
					}
				}

				if (f > 0) {
					k = m.length;

					if (k <= f) {
						m = s + '0.0000000000000000000'.slice(0, f - k + 2) + m;
					} else {
						m = s + m.slice(0, k - f) + '.' + m.slice(k - f);
					}
				} else {
					m = s + m;
				}

				return m;
			};
		}());
	}


//
// String
// ======
//

// ES5 15.5.4.14
// http://es5.github.com/#x15.5.4.14

// [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
// Many browsers do not split properly with regular expressions or they
// do not perform the split correctly under obscure conditions.
// See http://blog.stevenlevithan.com/archives/cross-browser-split
// I've tested in many browsers and this seems to cover the deviant ones:
// 'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
// '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
// 'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
// [undefined, "t", undefined, "e", ...]
// ''.split(/.?/) should be [], not [""]
// '.'.split(/()()/) should be ["."], not ["", "", "."]

	var string_split = String.prototype.split;
	if (
		'ab'.split(/(?:ab)*/).length !== 2 ||
			'.'.split(/(.?)(.?)/).length !== 4 ||
			'tesst'.split(/(s)*/)[1] === "t" ||
			'test'.split(/(?:)/, -1).length !== 4 ||
			''.split(/.?/).length ||
			'.'.split(/()()/).length > 1
		) {
		(function () {
			var compliantExecNpcg = /()??/.exec("")[1] === void 0; // NPCG: nonparticipating capturing group

			String.prototype.split = function (separator, limit) {
				var string = this;
				if (separator === void 0 && limit === 0) {
					return [];
				}

				// If `separator` is not a regex, use native split
				if (_toString.call(separator) !== "[object RegExp]") {
					return string_split.call(this, separator, limit);
				}

				var output = [],
					flags = (separator.ignoreCase ? "i" : "") +
						(separator.multiline ? "m" : "") +
						(separator.extended ? "x" : "") + // Proposed for ES6
						(separator.sticky ? "y" : ""), // Firefox 3+
					lastLastIndex = 0,
				// Make `global` and avoid `lastIndex` issues by working with a copy
					separator2, match, lastIndex, lastLength;
				separator = new RegExp(separator.source, flags + "g");
				string += ""; // Type-convert
				if (!compliantExecNpcg) {
					// Doesn't need flags gy, but they don't hurt
					separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
				}
				/* Values for `limit`, per the spec:
				 * If undefined: 4294967295 // Math.pow(2, 32) - 1
				 * If 0, Infinity, or NaN: 0
				 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
				 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
				 * If other: Type-convert, then use the above rules
				 */
				limit = limit === void 0 ?
					-1 >>> 0 : // Math.pow(2, 32) - 1
					ToUint32(limit);
				while (match = separator.exec(string)) {
					// `separator.lastIndex` is not reliable cross-browser
					lastIndex = match.index + match[0].length;
					if (lastIndex > lastLastIndex) {
						output.push(string.slice(lastLastIndex, match.index));
						// Fix browsers whose `exec` methods don't consistently return `undefined` for
						// nonparticipating capturing groups
						if (!compliantExecNpcg && match.length > 1) {
							match[0].replace(separator2, function () {
								for (var i = 1; i < arguments.length - 2; i++) {
									if (arguments[i] === void 0) {
										match[i] = void 0;
									}
								}
							});
						}
						if (match.length > 1 && match.index < string.length) {
							Array.prototype.push.apply(output, match.slice(1));
						}
						lastLength = match[0].length;
						lastLastIndex = lastIndex;
						if (output.length >= limit) {
							break;
						}
					}
					if (separator.lastIndex === match.index) {
						separator.lastIndex++; // Avoid an infinite loop
					}
				}
				if (lastLastIndex === string.length) {
					if (lastLength || !separator.test("")) {
						output.push("");
					}
				} else {
					output.push(string.slice(lastLastIndex));
				}
				return output.length > limit ? output.slice(0, limit) : output;
			};
		}());

// [bugfix, chrome]
// If separator is undefined, then the result array contains just one String,
// which is the this value (converted to a String). If limit is not undefined,
// then the output array is truncated so that it contains no more than limit
// elements.
// "0".split(undefined, 0) -> []
	} else if ("0".split(void 0, 0).length) {
		String.prototype.split = function split(separator, limit) {
			if (separator === void 0 && limit === 0) { return []; }
			return string_split.call(this, separator, limit);
		};
	}

	var str_replace = String.prototype.replace;
	var replaceReportsGroupsCorrectly = (function () {
		var groups = [];
		'x'.replace(/x(.)?/g, function (match, group) {
			groups.push(group);
		});
		return groups.length === 1 && typeof groups[0] === 'undefined';
	}());

	if (!replaceReportsGroupsCorrectly) {
		String.prototype.replace = function replace(searchValue, replaceValue) {
			var isFn = isFunction(replaceValue);
			var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
			if (!isFn || !hasCapturingGroups) {
				return str_replace.call(this, searchValue, replaceValue);
			} else {
				var wrappedReplaceValue = function (match) {
					var length = arguments.length;
					var originalLastIndex = searchValue.lastIndex;
					searchValue.lastIndex = 0;
					var args = searchValue.exec(match);
					searchValue.lastIndex = originalLastIndex;
					args.push(arguments[length - 2], arguments[length - 1]);
					return replaceValue.apply(this, args);
				};
				return str_replace.call(this, searchValue, wrappedReplaceValue);
			}
		};
	}

// ECMA-262, 3rd B.2.3
// Not an ECMAScript standard, although ECMAScript 3rd Edition has a
// non-normative section suggesting uniform semantics and it should be
// normalized across all browsers
// [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
	if ("".substr && "0b".substr(-1) !== "b") {
		var string_substr = String.prototype.substr;
		/**
		 * Get the substring of a string
		 * @param {integer} start where to start the substring
		 * @param {integer} length how many characters to return
		 * @return {string}
		 */
		String.prototype.substr = function substr(start, length) {
			return string_substr.call(
				this,
				start < 0 ? ((start = this.length + start) < 0 ? 0 : start) : start,
				length
			);
		};
	}

// ES5 15.5.4.20
// whitespace from: http://es5.github.io/#x15.5.4.20
	var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
		"\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
		"\u2029\uFEFF";
	var zeroWidth = '\u200b';
	if (!String.prototype.trim || ws.trim() || !zeroWidth.trim()) {
		// http://blog.stevenlevithan.com/archives/faster-trim-javascript
		// http://perfectionkills.com/whitespace-deviations/
		ws = "[" + ws + "]";
		var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
			trimEndRegexp = new RegExp(ws + ws + "*$");
		String.prototype.trim = function trim() {
			if (this === void 0 || this === null) {
				throw new TypeError("can't convert " + this + " to object");
			}
			return String(this)
				.replace(trimBeginRegexp, "")
				.replace(trimEndRegexp, "");
		};
	}

// ES-5 15.1.2.2
	if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
		parseInt = (function (origParseInt) {
			var hexRegex = /^0[xX]/;
			return function parseIntES5(str, radix) {
				str = String(str).trim();
				if (!Number(radix)) {
					radix = hexRegex.test(str) ? 16 : 10;
				}
				return origParseInt(str, radix);
			};
		}(parseInt));
	}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

	function toInteger(n) {
		n = +n;
		if (n !== n) { // isNaN
			n = 0;
		} else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
			n = (n > 0 || -1) * Math.floor(Math.abs(n));
		}
		return n;
	}

	function isPrimitive(input) {
		var type = typeof input;
		return (
			input === null ||
				type === "undefined" ||
				type === "boolean" ||
				type === "number" ||
				type === "string"
			);
	}

	function toPrimitive(input) {
		var val, valueOf, toStr;
		if (isPrimitive(input)) {
			return input;
		}
		valueOf = input.valueOf;
		if (isFunction(valueOf)) {
			val = valueOf.call(input);
			if (isPrimitive(val)) {
				return val;
			}
		}
		toStr = input.toString;
		if (isFunction(toStr)) {
			val = toStr.call(input);
			if (isPrimitive(val)) {
				return val;
			}
		}
		throw new TypeError();
	}

// ES5 9.9
// http://es5.github.com/#x9.9
	var toObject = function (o) {
		if (o == null) { // this matches both null and undefined
			throw new TypeError("can't convert " + o + " to object");
		}
		return Object(o);
	};

	var ToUint32 = function ToUint32(x) {
		return x >>> 0;
	};

})();




(function($, shims){
	var defineProperty = 'defineProperty';
	var advancedObjectProperties = !!(Object.create && Object.defineProperties && Object.getOwnPropertyDescriptor);
	//safari5 has defineProperty-interface, but it can't be used on dom-object
	//only do this test in non-IE browsers, because this hurts dhtml-behavior in some IE8 versions
	if (advancedObjectProperties && Object[defineProperty] && Object.prototype.__defineGetter__) {
		(function(){
			try {
				var foo = document.createElement('foo');
				Object[defineProperty](foo, 'bar', {
					get: function(){
						return true;
					}
				});
				advancedObjectProperties = !!foo.bar;
			} 
			catch (e) {
				advancedObjectProperties = false;
			}
			foo = null;
		})();
	}
	
	Modernizr.objectAccessor = !!((advancedObjectProperties || (Object.prototype.__defineGetter__ && Object.prototype.__lookupSetter__)));
	Modernizr.advancedObjectProperties = advancedObjectProperties;
	
if((!advancedObjectProperties || !Object.create || !Object.defineProperties || !Object.getOwnPropertyDescriptor  || !Object.defineProperty)){
	var call = Function.prototype.call;
	var prototypeOfObject = Object.prototype;
	var owns = call.bind(prototypeOfObject.hasOwnProperty);
	
	shims.objectCreate = function(proto, props, opts, no__proto__){
		var o;
		var f = function(){};
		
		f.prototype = proto;
		o = new f();
		
		if(!no__proto__ && !('__proto__' in o) && !Modernizr.objectAccessor){
			o.__proto__ = proto;
		}
		
		if(props){
			shims.defineProperties(o, props);
		}
		
		if(opts){
			o.options = $.extend(true, {}, o.options || {}, opts);
			opts = o.options;
		}
		
		if(o._create && $.isFunction(o._create)){
			o._create(opts);
		}
		return o;
	};
	
	shims.defineProperties = function(object, props){
		for (var name in props) {
			if (owns(props, name)) {
				shims.defineProperty(object, name, props[name]);
			}
		}
		return object;
	};
	
	var descProps = ['configurable', 'enumerable', 'writable'];
	shims.defineProperty = function(proto, property, descriptor){
		if(typeof descriptor != "object" || descriptor === null){return proto;}
		
		if(owns(descriptor, "value")){
			proto[property] = descriptor.value;
			return proto;
		}
		
		if(proto.__defineGetter__){
            if (typeof descriptor.get == "function") {
				proto.__defineGetter__(property, descriptor.get);
			}
            if (typeof descriptor.set == "function"){
                proto.__defineSetter__(property, descriptor.set);
			}
        }
		return proto;
	};
	
	shims.getPrototypeOf = function (object) {
        return Object.getPrototypeOf && Object.getPrototypeOf(object) || object.__proto__ || object.constructor && object.constructor.prototype;
    };
	
	//based on http://www.refactory.org/s/object_getownpropertydescriptor/view/latest 
	shims.getOwnPropertyDescriptor = function(obj, prop){
		if (typeof obj !== "object" && typeof obj !== "function" || obj === null){
            throw new TypeError("Object.getOwnPropertyDescriptor called on a non-object");
		}
		var descriptor;
		if(Object.defineProperty && Object.getOwnPropertyDescriptor){
			try{
				descriptor = Object.getOwnPropertyDescriptor(obj, prop);
				return descriptor;
			} catch(e){}
		}
        descriptor = {
            configurable: true,
            enumerable: true,
            writable: true,
            value: undefined
        };
		var getter = obj.__lookupGetter__ && obj.__lookupGetter__(prop), 
			setter = obj.__lookupSetter__ && obj.__lookupSetter__(prop)
		;
        
        if (!getter && !setter) { // not an accessor so return prop
        	if(!owns(obj, prop)){
				return;
			}
            descriptor.value = obj[prop];
            return descriptor;
        }
        
        // there is an accessor, remove descriptor.writable; populate descriptor.get and descriptor.set
        delete descriptor.writable;
        delete descriptor.value;
        descriptor.get = descriptor.set = undefined;
        
        if(getter){
			descriptor.get = getter;
		}
        
        if(setter){
            descriptor.set = setter;
		}
        
        return descriptor;
    };

}
webshims.isReady('es5', true);
})(webshims.$, webshims);


;
//this might was already extended by ES5 shim feature
(function($){
	"use strict";
	var webshims = window.webshims;
	if(webshims.defineProperties){return;}
	var defineProperty = 'defineProperty';
	var has = Object.prototype.hasOwnProperty;
	var descProps = ['configurable', 'enumerable', 'writable'];
	var extendUndefined = function(prop){
		for(var i = 0; i < 3; i++){
			if(prop[descProps[i]] === undefined && (descProps[i] !== 'writable' || prop.value !== undefined)){
				prop[descProps[i]] = true;
			}
		}
	};

	var extendProps = function(props){
		if(props){
			for(var i in props){
				if(has.call(props, i)){
					extendUndefined(props[i]);
				}
			}
		}
	};

	if(Object.create){
		webshims.objectCreate = function(proto, props, opts){
			extendProps(props);
			var o = Object.create(proto, props);
			if(opts){
				o.options = $.extend(true, {}, o.options  || {}, opts);
				opts = o.options;
			}
			if(o._create && $.isFunction(o._create)){
				o._create(opts);
			}
			return o;
		};
	}

	if(Object[defineProperty]){
		webshims[defineProperty] = function(obj, prop, desc){
			extendUndefined(desc);
			return Object[defineProperty](obj, prop, desc);
		};
	}
	if(Object.defineProperties){
		webshims.defineProperties = function(obj, props){
			extendProps(props);
			return Object.defineProperties(obj, props);
		};
	}
	webshims.getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	webshims.getPrototypeOf = Object.getPrototypeOf;
})(window.webshims.$);
//DOM-Extension helper
webshims.register('dom-extend', function($, webshims, window, document, undefined){
	"use strict";
	var supportHrefNormalized = !('hrefNormalized' in $.support) || $.support.hrefNormalized;
	var supportGetSetAttribute = !('getSetAttribute' in $.support) || $.support.getSetAttribute;
	var has = Object.prototype.hasOwnProperty;
	webshims.assumeARIA = supportGetSetAttribute || Modernizr.canvas || Modernizr.video || Modernizr.boxsizing;
	
	if($('<input type="email" />').attr('type') == 'text' || $('<form />').attr('novalidate') === "" || ('required' in $('<input />')[0].attributes)){
		webshims.error("IE browser modes are busted in IE10+. Please test your HTML/CSS/JS with a real IE version or at least IETester or similiar tools");
	}
	
	if('debug' in webshims){
		webshims.error('Use webshims.setOptions("debug", true||false||"noCombo"); to debug flag');
	}
	
	if (!webshims.cfg.no$Switch) {
		var switch$ = function(){
			if (window.jQuery && (!window.$ || window.jQuery == window.$) && !window.jQuery.webshims) {
				webshims.error("jQuery was included more than once. Make sure to include it only once or try the $.noConflict(extreme) feature! Webshims and other Plugins might not work properly. Or set webshims.cfg.no$Switch to 'true'.");
				if (window.$) {
					window.$ = webshims.$;
				}
				window.jQuery = webshims.$;
			}
			if(webshims.M != Modernizr){
				webshims.error("Modernizr was included more than once. Make sure to include it only once! Webshims and other scripts might not work properly.");
				for(var i in Modernizr){
					if(!(i in webshims.M)){
						webshims.M[i] = Modernizr[i];
					}
				}
				Modernizr = webshims.M;
			}
		};
		switch$();
		setTimeout(switch$, 90);
		webshims.ready('DOM', switch$);
		$(switch$);
		webshims.ready('WINDOWLOAD', switch$);
		
	}

	//shortcus
	var modules = webshims.modules;
	var listReg = /\s*,\s*/;
		
	//proxying attribute
	var olds = {};
	var havePolyfill = {};
	var hasPolyfillMethod = {};
	var extendedProps = {};
	var extendQ = {};
	var modifyProps = {};
	
	var oldVal = $.fn.val;
	var singleVal = function(elem, name, val, pass, _argless){
		return (_argless) ? oldVal.call($(elem)) : oldVal.call($(elem), val);
	};
	
	//jquery mobile and jquery ui
	if(!$.widget){
		(function(){
			var _cleanData = $.cleanData;
			$.cleanData = function( elems ) {
				if(!$.widget){
					for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
						try {
							$( elem ).triggerHandler( "remove" );
						// http://bugs.jquery.com/ticket/8235
						} catch( e ) {}
					}
				}
				_cleanData( elems );
			};
		})();
	}
	

	$.fn.val = function(val){
		var elem = this[0];
		if(arguments.length && val == null){
			val = '';
		}
		if(!arguments.length){
			if(!elem || elem.nodeType !== 1){return oldVal.call(this);}
			return $.prop(elem, 'value', val, 'val', true);
		}
		if($.isArray(val)){
			return oldVal.apply(this, arguments);
		}
		var isFunction = $.isFunction(val);
		return this.each(function(i){
			elem = this;
			if(elem.nodeType === 1){
				if(isFunction){
					var genVal = val.call( elem, i, $.prop(elem, 'value', undefined, 'val', true));
					if(genVal == null){
						genVal = '';
					}
					$.prop(elem, 'value', genVal, 'val') ;
				} else {
					$.prop(elem, 'value', val, 'val');
				}
			}
		});
	};
	$.fn.onTrigger = function(evt, fn){
		return this.on(evt, fn).each(fn);
	};
	
	$.fn.onWSOff = function(evt, fn, trigger, evtDel){
		if(!evtDel){
			evtDel = document;
		}
		$(evtDel)[trigger ? 'onTrigger' : 'on'](evt, fn);
		this.on('remove', function(e){
			if(!e.originalEvent){
				$(evtDel).off(evt, fn);
			}
		});
		return this;
	};
	var idCount = 0;
	var dataID = '_webshims'+ (Math.round(Math.random() * 1000));
	var elementData = function(elem, key, val){
		elem = elem.jquery ? elem[0] : elem;
		if(!elem){return val || {};}
		var data = $.data(elem, dataID);
		if(val !== undefined){
			if(!data){
				data = $.data(elem, dataID, {});
			}
			if(key){
				data[key] = val;
			}
		}
		
		return key ? data && data[key] : data;
	};


	[{name: 'getNativeElement', prop: 'nativeElement'}, {name: 'getShadowElement', prop: 'shadowElement'}, {name: 'getShadowFocusElement', prop: 'shadowFocusElement'}].forEach(function(data){
		$.fn[data.name] = function(){
			var elems = [];
			this.each(function(){
				var shadowData = elementData(this, 'shadowData');
				var elem = shadowData && shadowData[data.prop] || this;
				if($.inArray(elem, elems) == -1){
					elems.push(elem);
				}
			});
			return this.pushStack(elems);
		};
	});

	function clone(elem, dataAndEvents, uniqueIds){
		var cloned = $.clone( elem, dataAndEvents, false );
		$(cloned.querySelectorAll('.'+webshims.shadowClass)).detach();
		if(uniqueIds){
			idCount++;
			$(cloned.querySelectorAll('[id]')).prop('id', function(i, id){
				return id +idCount;
			});
		} else {
			$(cloned.querySelectorAll('audio[id^="ID-"], video[id^="ID-"], label[id^="ID-"]')).removeAttr('id');
		}
		return cloned;
	}

	$.fn.clonePolyfill = function(dataAndEvents, uniqueIds){
		dataAndEvents = dataAndEvents || false;
		return this
			.map(function() {
				var cloned = clone( this, dataAndEvents, uniqueIds );
				setTimeout(function(){
					if($.contains(document.body, cloned)){
						$(cloned).updatePolyfill();
					}
				});
				return cloned;
			})
		;
	};
	
	//add support for $('video').trigger('play') in case extendNative is set to false
	if(!webshims.cfg.extendNative && !webshims.cfg.noTriggerOverride){
		(function(oldTrigger){
			$.event.trigger = function(event, data, elem, onlyHandlers){
				
				if(!hasPolyfillMethod[event] || onlyHandlers || !elem || elem.nodeType !== 1){
					return oldTrigger.apply(this, arguments);
				}
				var ret, isOrig, origName;
				var origFn = elem[event];
				var polyfilledFn = $.prop(elem, event);
				var changeFn = polyfilledFn && origFn != polyfilledFn;
				if(changeFn){
					origName = '__ws'+event;
					isOrig = (event in elem) && has.call(elem, event);
					elem[event] = polyfilledFn;
					elem[origName] = origFn;
				}
				
				ret = oldTrigger.apply(this, arguments);
				if (changeFn) {
					if(isOrig){
						elem[event] = origFn;
					} else {
						delete elem[event];
					}
					delete elem[origName];
				}
				
				return ret;
			};
		})($.event.trigger);
	}
	
	['removeAttr', 'prop', 'attr'].forEach(function(type){
		olds[type] = $[type];
		$[type] = function(elem, name, value, pass, _argless){
			var isVal = (pass == 'val');
			var oldMethod = !isVal ? olds[type] : singleVal;
			if( !elem || !havePolyfill[name] || elem.nodeType !== 1 || (!isVal && pass && type == 'attr' && $.attrFn[name]) ){
				return oldMethod(elem, name, value, pass, _argless);
			}
			
			var nodeName = (elem.nodeName || '').toLowerCase();
			var desc = extendedProps[nodeName];
			var curType = (type == 'attr' && (value === false || value === null)) ? 'removeAttr' : type;
			var propMethod;
			var oldValMethod;
			var ret;
			
			
			if(!desc){
				desc = extendedProps['*'];
			}
			if(desc){
				desc = desc[name];
			}
			
			if(desc){
				propMethod = desc[curType];
			}
			
			if(propMethod){
				if(name == 'value'){
					oldValMethod = propMethod.isVal;
					propMethod.isVal = isVal;
				}
				if(curType === 'removeAttr'){
					return propMethod.value.call(elem);	
				} else if(value === undefined){
					return (propMethod.get) ? 
						propMethod.get.call(elem) : 
						propMethod.value
					;
				} else if(propMethod.set) {
					if(type == 'attr' && value === true){
						value = name;
					}
					
					ret = propMethod.set.call(elem, value);
				}
				if(name == 'value'){
					propMethod.isVal = oldValMethod;
				}
			} else {
				ret = oldMethod(elem, name, value, pass, _argless);
			}
			if((value !== undefined || curType === 'removeAttr') && modifyProps[nodeName] && modifyProps[nodeName][name]){
				
				var boolValue;
				if(curType == 'removeAttr'){
					boolValue = false;
				} else if(curType == 'prop'){
					boolValue = !!(value);
				} else {
					boolValue = true;
				}
				
				modifyProps[nodeName][name].forEach(function(fn){
					if(!fn.only || (fn.only = 'prop' && type == 'prop') || (fn.only == 'attr' && type != 'prop')){
						fn.call(elem, value, boolValue, (isVal) ? 'val' : curType, type);
					}
				});
			}
			return ret;
		};
		
		extendQ[type] = function(nodeName, prop, desc){
			
			if(!extendedProps[nodeName]){
				extendedProps[nodeName] = {};
			}
			if(!extendedProps[nodeName][prop]){
				extendedProps[nodeName][prop] = {};
			}
			var oldDesc = extendedProps[nodeName][prop][type];
			var getSup = function(propType, descriptor, oDesc){
				var origProp;
				if(descriptor && descriptor[propType]){
					return descriptor[propType];
				}
				if(oDesc && oDesc[propType]){
					return oDesc[propType];
				}
				if(type == 'prop' && prop == 'value'){
					return function(value){
						var elem = this;
						return (desc.isVal) ? 
							singleVal(elem, prop, value, false, (arguments.length === 0)) : 
							olds[type](elem, prop, value)
						;
					};
				}
				if(type == 'prop' && propType == 'value' && desc.value.apply){
					origProp = '__ws'+prop;
					hasPolyfillMethod[prop] = true;
					return  function(value){
						var sup = this[origProp] || olds[type](this, prop);
						if(sup && sup.apply){
							sup = sup.apply(this, arguments);
						} 
						return sup;
					};
				}
				return function(value){
					return olds[type](this, prop, value);
				};
			};
			extendedProps[nodeName][prop][type] = desc;
			if(desc.value === undefined){
				if(!desc.set){
					desc.set = desc.writeable ? 
						getSup('set', desc, oldDesc) : 
						(webshims.cfg.useStrict && prop == 'prop') ? 
							function(){throw(prop +' is readonly on '+ nodeName);} : 
							function(){webshims.info(prop +' is readonly on '+ nodeName);}
					;
				}
				if(!desc.get){
					desc.get = getSup('get', desc, oldDesc);
				}
				
			}
			
			['value', 'get', 'set'].forEach(function(descProp){
				if(desc[descProp]){
					desc['_sup'+descProp] = getSup(descProp, oldDesc);
				}
			});
		};
		
	});
	
	var extendNativeValue = (function(){
		var UNKNOWN = webshims.getPrototypeOf(document.createElement('foobar'));
		
		//see also: https://github.com/lojjic/PIE/issues/40 | https://prototype.lighthouseapp.com/projects/8886/tickets/1107-ie8-fatal-crash-when-prototypejs-is-loaded-with-rounded-cornershtc
		var isExtendNativeSave = Modernizr.advancedObjectProperties && Modernizr.objectAccessor;
		return function(nodeName, prop, desc){
			var elem , elemProto;
			 if( isExtendNativeSave && (elem = document.createElement(nodeName)) && (elemProto = webshims.getPrototypeOf(elem)) && UNKNOWN !== elemProto && ( !elem[prop] || !has.call(elem, prop) ) ){
				var sup = elem[prop];
				desc._supvalue = function(){
					if(sup && sup.apply){
						return sup.apply(this, arguments);
					}
					return sup;
				};
				elemProto[prop] = desc.value;
			} else {
				desc._supvalue = function(){
					var data = elementData(this, 'propValue');
					if(data && data[prop] && data[prop].apply){
						return data[prop].apply(this, arguments);
					}
					return data && data[prop];
				};
				initProp.extendValue(nodeName, prop, desc.value);
			}
			desc.value._supvalue = desc._supvalue;
		};
	})();
		
	var initProp = (function(){
		
		var initProps = {};
		
		webshims.addReady(function(context, contextElem){
			var nodeNameCache = {};
			var getElementsByName = function(name){
				if(!nodeNameCache[name]){
					nodeNameCache[name] = $(context.getElementsByTagName(name));
					if(contextElem[0] && $.nodeName(contextElem[0], name)){
						nodeNameCache[name] = nodeNameCache[name].add(contextElem);
					}
				}
			};
			
			
			$.each(initProps, function(name, fns){
				getElementsByName(name);
				if(!fns || !fns.forEach){
					webshims.warn('Error: with '+ name +'-property. methods: '+ fns);
					return;
				}
				fns.forEach(function(fn){
					nodeNameCache[name].each(fn);
				});
			});
			nodeNameCache = null;
		});
		
		var tempCache;
		var emptyQ = $([]);
		var createNodeNameInit = function(nodeName, fn){
			if(!initProps[nodeName]){
				initProps[nodeName] = [fn];
			} else {
				initProps[nodeName].push(fn);
			}
			if($.isDOMReady){
				(tempCache || $( document.getElementsByTagName(nodeName) )).each(fn);
			}
		};
		
		var elementExtends = {};
		return {
			createTmpCache: function(nodeName){
				if($.isDOMReady){
					tempCache = tempCache || $( document.getElementsByTagName(nodeName) );
				}
				return tempCache || emptyQ;
			},
			flushTmpCache: function(){
				tempCache = null;
			},
			content: function(nodeName, prop){
				createNodeNameInit(nodeName, function(){
					var val =  $.attr(this, prop);
					if(val != null){
						$.attr(this, prop, val);
					}
				});
			},
			createElement: function(nodeName, fn){
				createNodeNameInit(nodeName, fn);
			},
			extendValue: function(nodeName, prop, value){
				createNodeNameInit(nodeName, function(){
					$(this).each(function(){
						var data = elementData(this, 'propValue', {});
						data[prop] = this[prop];
						this[prop] = value;
					});
				});
			}
		};
	})();
		
	var createPropDefault = function(descs, removeType){
		if(descs.defaultValue === undefined){
			descs.defaultValue = '';
		}
		if(!descs.removeAttr){
			descs.removeAttr = {
				value: function(){
					descs[removeType || 'prop'].set.call(this, descs.defaultValue);
					descs.removeAttr._supvalue.call(this);
				}
			};
		}
		if(!descs.attr){
			descs.attr = {};
		}
	};
	
	$.extend(webshims, {
		getID: (function(){
			var ID = new Date().getTime();
			return function(elem){
				elem = $(elem);
				var id = elem.prop('id');
				if(!id){
					ID++;
					id = 'ID-'+ ID;
					elem.eq(0).prop('id', id);
				}
				return id;
			};
		})(),
		shadowClass: 'wsshadow-'+(Date.now()),
		implement: function(elem, type){
			var data = elementData(elem, 'implemented') || elementData(elem, 'implemented', {});
			if(data[type]){
				webshims.warn(type +' already implemented for element #'+elem.id);
				return false;
			}
			data[type] = true;
			return true;
		},
		extendUNDEFProp: function(obj, props){
			$.each(props, function(name, prop){
				if( !(name in obj) ){
					obj[name] = prop;
				}
			});
		},
		getOptions: (function(){
			var normalName = /\-([a-z])/g;
			var regs = {};
			var nameRegs = {};
			var regFn = function(f, upper){
				return upper.toLowerCase();
			};
			var nameFn = function(f, dashed){
				return dashed.toUpperCase();
			};
			return function(elem, name, bases, stringAllowed){
				if(nameRegs[name]){
					name = nameRegs[name];
				} else {
					nameRegs[name] = name.replace(normalName, nameFn);
					name = nameRegs[name];
				}
				var data = elementData(elem, 'cfg'+name);
				var dataName;
				var cfg = {};
				
				if(data){
					return data;
				}
				data = $(elem).data();
				if(data && typeof data[name] == 'string'){
					if(stringAllowed){
						return elementData(elem, 'cfg'+name, data[name]);
					}
					webshims.error('data-'+ name +' attribute has to be a valid JSON, was: '+ data[name]);
				}
				if(!bases){
					bases = [true, {}];
				} else if(!Array.isArray(bases)){
					bases = [true, {}, bases];
				} else {
					bases.unshift(true, {});
				}
				
				if(data && typeof data[name] == 'object'){
					bases.push(data[name]);
				}
				
				if(!regs[name]){
					regs[name] = new RegExp('^'+ name +'([A-Z])');
				}
				
				for(dataName in data){
					if(regs[name].test(dataName)){
						cfg[dataName.replace(regs[name], regFn)] = data[dataName];
					}
				}
				bases.push(cfg);
				return elementData(elem, 'cfg'+name, $.extend.apply($, bases));
			};
		})(),
		//http://www.w3.org/TR/html5/common-dom-interfaces.html#reflect
		createPropDefault: createPropDefault,
		data: elementData,
		moveToFirstEvent: function(elem, eventType, bindType){
			var events = ($._data(elem, 'events') || {})[eventType];
			var fn;
			
			if(events && events.length > 1){
				fn = events.pop();
				if(!bindType){
					bindType = 'bind';
				}
				if(bindType == 'bind' && events.delegateCount){
					events.splice( events.delegateCount, 0, fn);
				} else {
					events.unshift( fn );
				}
				
				
			}
			elem = null;
		},
		addShadowDom: (function(){
			var resizeTimer;
			var lastHeight;
			var lastWidth;
			var $window = $(window);
			var docObserve = {
				init: false,
				runs: 0,
				test: function(){
					var height = docObserve.getHeight();
					var width = docObserve.getWidth();
					
					if(height != docObserve.height || width != docObserve.width){
						docObserve.height = height;
						docObserve.width = width;
						docObserve.handler({type: 'docresize'});
						docObserve.runs++;
						if(docObserve.runs < 9){
							setTimeout(docObserve.test, 90);
						}
					} else {
						docObserve.runs = 0;
					}
				},
				handler: (function(){
					var trigger = function(){
						$(document).triggerHandler('updateshadowdom');
					};
					return function(e){
						clearTimeout(resizeTimer);
						resizeTimer = setTimeout(function(){
							if(e.type == 'resize'){
								var width = $window.width();
								var height = $window.width();

								if(height == lastHeight && width == lastWidth){
									return;
								}
								lastHeight = height;
								lastWidth = width;
								
								docObserve.height = docObserve.getHeight();
								docObserve.width = docObserve.getWidth();
							}

							if(window.requestAnimationFrame){
								requestAnimationFrame(trigger);
							} else {
								setTimeout(trigger, 0);
							}
							
						}, (e.type == 'resize' && !window.requestAnimationFrame) ? 50 : 9);
					};
				})(),
				_create: function(){
					$.each({ Height: "getHeight", Width: "getWidth" }, function(name, type){
						var body = document.body;
						var doc = document.documentElement;
						docObserve[type] = function (){
							return Math.max(
								body[ "scroll" + name ], doc[ "scroll" + name ],
								body[ "offset" + name ], doc[ "offset" + name ],
								doc[ "client" + name ]
							);
						};
					});
				},
				start: function(){
					if(!this.init && document.body){
						this.init = true;
						this._create();
						this.height = docObserve.getHeight();
						this.width = docObserve.getWidth();
						setInterval(this.test, 999);
						$(this.test);
						if($.support.boxSizing == null){
							$(function(){
								if($.support.boxSizing){
									docObserve.handler({type: 'boxsizing'});
								}
							});
						}
						webshims.ready('WINDOWLOAD', this.test);
						$(document).on('updatelayout.webshim pageinit popupafteropen panelbeforeopen tabsactivate collapsibleexpand shown.bs.modal shown.bs.collapse slid.bs.carousel', this.handler);
						$(window).on('resize', this.handler);
					}
				}
			};
			
			
			webshims.docObserve = function(){
				webshims.ready('DOM', function(){
					docObserve.start();

				});
			};
			return function(nativeElem, shadowElem, opts){
				if(nativeElem && shadowElem){
					opts = opts || {};
					if(nativeElem.jquery){
						nativeElem = nativeElem[0];
					}
					if(shadowElem.jquery){
						shadowElem = shadowElem[0];
					}
					var nativeData = $.data(nativeElem, dataID) || $.data(nativeElem, dataID, {});
					var shadowData = $.data(shadowElem, dataID) || $.data(shadowElem, dataID, {});
					var shadowFocusElementData = {};
					if(!opts.shadowFocusElement){
						opts.shadowFocusElement = shadowElem;
					} else if(opts.shadowFocusElement){
						if(opts.shadowFocusElement.jquery){
							opts.shadowFocusElement = opts.shadowFocusElement[0];
						}
						shadowFocusElementData = $.data(opts.shadowFocusElement, dataID) || $.data(opts.shadowFocusElement, dataID, shadowFocusElementData);
					}
					
					$(nativeElem).on('remove', function(e){
						if (!e.originalEvent) {
							setTimeout(function(){
								$(shadowElem).remove();
							}, 4);
						}
					});
					
					nativeData.hasShadow = shadowElem;
					shadowFocusElementData.nativeElement = shadowData.nativeElement = nativeElem;
					shadowFocusElementData.shadowData = shadowData.shadowData = nativeData.shadowData = {
						nativeElement: nativeElem,
						shadowElement: shadowElem,
						shadowFocusElement: opts.shadowFocusElement
					};
					if(opts.shadowChilds){
						opts.shadowChilds.each(function(){
							elementData(this, 'shadowData', shadowData.shadowData);
						});
					}
					
					if(opts.data){
						shadowFocusElementData.shadowData.data = shadowData.shadowData.data = nativeData.shadowData.data = opts.data;
					}
					opts = null;
				}
				webshims.docObserve();
			};
		})(),
		propTypes: {
			standard: function(descs, name){
				createPropDefault(descs);
				if(descs.prop){return;}
				descs.prop = {
					set: function(val){
						descs.attr.set.call(this, ''+val);
					},
					get: function(){
						return descs.attr.get.call(this) || descs.defaultValue;
					}
				};
				
			},
			"boolean": function(descs, name){
				
				createPropDefault(descs);
				if(descs.prop){return;}
				descs.prop = {
					set: function(val){
						if(val){
							descs.attr.set.call(this, "");
						} else {
							descs.removeAttr.value.call(this);
						}
					},
					get: function(){
						return descs.attr.get.call(this) != null;
					}
				};
			},
			"src": (function(){
				var anchor = document.createElement('a');
				anchor.style.display = "none";
				return function(descs, name){
					
					createPropDefault(descs);
					if(descs.prop){return;}
					descs.prop = {
						set: function(val){
							descs.attr.set.call(this, val);
						},
						get: function(){
							var href = this.getAttribute(name);
							var ret;
							if(href == null){return '';}
							
							anchor.setAttribute('href', href+'' );
							
							if(!supportHrefNormalized){
								try {
									$(anchor).insertAfter(this);
									ret = anchor.getAttribute('href', 4);
								} catch(er){
									ret = anchor.getAttribute('href', 4);
								}
								$(anchor).detach();
							}
							return ret || anchor.href;
						}
					};
				};
			})(),
			enumarated: function(descs, name){
					
					createPropDefault(descs);
					if(descs.prop){return;}
					descs.prop = {
						set: function(val){
							descs.attr.set.call(this, val);
						},
						get: function(){
							var val = (descs.attr.get.call(this) || '').toLowerCase();
							if(!val || descs.limitedTo.indexOf(val) == -1){
								val = descs.defaultValue;
							}
							return val;
						}
					};
				}
			
//			,unsignedLong: $.noop
//			,"doubble": $.noop
//			,"long": $.noop
//			,tokenlist: $.noop
//			,settableTokenlist: $.noop
		},
		reflectProperties: function(nodeNames, props){
			if(typeof props == 'string'){
				props = props.split(listReg);
			}
			props.forEach(function(prop){
				webshims.defineNodeNamesProperty(nodeNames, prop, {
					prop: {
						set: function(val){
							$.attr(this, prop, val);
						},
						get: function(){
							return $.attr(this, prop) || '';
						}
					}
				});
			});
		},
		defineNodeNameProperty: function(nodeName, prop, descs){
			havePolyfill[prop] = true;
						
			if(descs.reflect){
				if(descs.propType && !webshims.propTypes[descs.propType]){
					webshims.error('could not finde propType '+ descs.propType);
				} else {
					webshims.propTypes[descs.propType || 'standard'](descs, prop);
				}
				
			}
			
			['prop', 'attr', 'removeAttr'].forEach(function(type){
				var desc = descs[type];
				if(desc){
					if(type === 'prop'){
						desc = $.extend({writeable: true}, desc);
					} else {
						desc = $.extend({}, desc, {writeable: true});
					}
						
					extendQ[type](nodeName, prop, desc);
					if(nodeName != '*' && webshims.cfg.extendNative && type == 'prop' && desc.value && $.isFunction(desc.value)){
						extendNativeValue(nodeName, prop, desc);
					}
					descs[type] = desc;
				}
			});
			if(descs.initAttr){
				initProp.content(nodeName, prop);
			}
			return descs;
		},
		
		defineNodeNameProperties: function(name, descs, propType, _noTmpCache){
			var olddesc;
			for(var prop in descs){
				if(!_noTmpCache && descs[prop].initAttr){
					initProp.createTmpCache(name);
				}
				if(propType){
					if(descs[prop][propType]){
						//webshims.log('override: '+ name +'['+prop +'] for '+ propType);
					} else {
						descs[prop][propType] = {};
						['value', 'set', 'get'].forEach(function(copyProp){
							if(copyProp in descs[prop]){
								descs[prop][propType][copyProp] = descs[prop][copyProp];
								delete descs[prop][copyProp];
							}
						});
					}
				}
				descs[prop] = webshims.defineNodeNameProperty(name, prop, descs[prop]);
			}
			if(!_noTmpCache){
				initProp.flushTmpCache();
			}
			return descs;
		},
		
		createElement: function(nodeName, create, descs){
			var ret;
			if($.isFunction(create)){
				create = {
					after: create
				};
			}
			initProp.createTmpCache(nodeName);
			if(create.before){
				initProp.createElement(nodeName, create.before);
			}
			if(descs){
				ret = webshims.defineNodeNameProperties(nodeName, descs, false, true);
			}
			if(create.after){
				initProp.createElement(nodeName, create.after);
			}
			initProp.flushTmpCache();
			return ret;
		},
		onNodeNamesPropertyModify: function(nodeNames, props, desc, only){
			if(typeof nodeNames == 'string'){
				nodeNames = nodeNames.split(listReg);
			}
			if($.isFunction(desc)){
				desc = {set: desc};
			}
			
			nodeNames.forEach(function(name){
				if(!modifyProps[name]){
					modifyProps[name] = {};
				}
				if(typeof props == 'string'){
					props = props.split(listReg);
				}
				if(desc.initAttr){
					initProp.createTmpCache(name);
				}
				props.forEach(function(prop){
					if(!modifyProps[name][prop]){
						modifyProps[name][prop] = [];
						havePolyfill[prop] = true;
					}
					if(desc.set){
						if(only){
							desc.set.only =  only;
						}
						modifyProps[name][prop].push(desc.set);
					}
					
					if(desc.initAttr){
						initProp.content(name, prop);
					}
				});
				initProp.flushTmpCache();
				
			});
		},
		defineNodeNamesBooleanProperty: function(elementNames, prop, descs){
			if(!descs){
				descs = {};
			}
			if($.isFunction(descs)){
				descs.set = descs;
			}
			webshims.defineNodeNamesProperty(elementNames, prop, {
				attr: {
					set: function(val){
						if(descs.useContentAttribute){
							webshims.contentAttr(this, prop, val);
						} else {
							this.setAttribute(prop, val);
						}
						if(descs.set){
							descs.set.call(this, true);
						}
					},
					get: function(){
						var ret = (descs.useContentAttribute) ? webshims.contentAttr(this, prop) : this.getAttribute(prop);
						return (ret == null) ? undefined : prop;
					}
				},
				removeAttr: {
					value: function(){
						this.removeAttribute(prop);
						if(descs.set){
							descs.set.call(this, false);
						}
					}
				},
				reflect: true,
				propType: 'boolean',
				initAttr: descs.initAttr || false
			});
		},
		contentAttr: function(elem, name, val){
			if(!elem.nodeName){return;}
			var attr;
			if(val === undefined){
				attr = (elem.attributes[name] || {});
				val = attr.specified ? attr.value : null;
				return (val == null) ? undefined : val;
			}
			
			if(typeof val == 'boolean'){
				if(!val){
					elem.removeAttribute(name);
				} else {
					elem.setAttribute(name, name);
				}
			} else {
				elem.setAttribute(name, val);
			}
		},
		
		activeLang: (function(){
			var curLang = [];
			var langDatas = [];
			var loading = {};
			var load = function(src, obj, loadingLang){
				obj._isLoading = true;
				if(loading[src]){
					loading[src].push(obj);
				} else {
					loading[src] = [obj];
					webshims.loader.loadScript(src, function(){
						if(loadingLang == curLang.join()){
							$.each(loading[src], function(i, obj){
								select(obj);
							});
						}
						delete loading[src];
					});
				}
			};
			
			var select = function(obj){
				var oldLang = obj.__active;
				var selectLang = function(i, lang){
					obj._isLoading = false;
					if(obj[lang] || obj.availableLangs.indexOf(lang) != -1){
						if(obj[lang]){
							obj.__active = obj[lang];
							obj.__activeName = lang;
						} else {
							load(obj.langSrc+lang, obj, curLang.join());
						}
						return false;
					}
				};
				$.each(curLang, selectLang);
				if(!obj.__active){
					obj.__active = obj[''];
					obj.__activeName = '';
				}
				if(oldLang != obj.__active){
					$(obj).trigger('change');
				}
			};
			return function(lang){
				var shortLang;
				if(typeof lang == 'string'){
					if(curLang[0] != lang){
						curLang = [lang];
						shortLang = curLang[0].split('-')[0];
						if(shortLang && shortLang != lang){
							curLang.push(shortLang);
						}
						langDatas.forEach(select);
					}
				} else if(typeof lang == 'object'){
					if(!lang.__active){
						langDatas.push(lang);
						select(lang);
					}
					return lang.__active;
				}
				return curLang[0];
			};
		})()
	});
	
	$.each({
		defineNodeNamesProperty: 'defineNodeNameProperty',
		defineNodeNamesProperties: 'defineNodeNameProperties',
		createElements: 'createElement'
	}, function(name, baseMethod){
		webshims[name] = function(names, a, b, c){
			if(typeof names == 'string'){
				names = names.split(listReg);
			}
			var retDesc = {};
			names.forEach(function(nodeName){
				retDesc[nodeName] = webshims[baseMethod](nodeName, a, b, c);
			});
			return retDesc;
		};
	});
	
	webshims.isReady('webshimLocalization', true);

//html5a11y + hidden attribute
(function(){
	if(('content' in document.createElement('template'))){return;}
	
	$(function(){
		var main = $('main').attr({role: 'main'});
		if(main.length > 1){
			webshims.error('only one main element allowed in document');
		} else if(main.is('article *, section *')) {
			webshims.error('main not allowed inside of article/section elements');
		}
	});
	
	if(('hidden' in document.createElement('a'))){
		return;
	}
	
	webshims.defineNodeNamesBooleanProperty(['*'], 'hidden');
	
	var elemMappings = {
		article: "article",
		aside: "complementary",
		section: "region",
		nav: "navigation",
		address: "contentinfo"
	};
	var addRole = function(elem, role){
		var hasRole = elem.getAttribute('role');
		if (!hasRole) {
			elem.setAttribute('role', role);
		}
	};
	
	
	$.webshims.addReady(function(context, contextElem){
		$.each(elemMappings, function(name, role){
			var elems = $(name, context).add(contextElem.filter(name));
			for (var i = 0, len = elems.length; i < len; i++) {
				addRole(elems[i], role);
			}
		});
		if (context === document) {
			var header = document.getElementsByTagName('header')[0];
			var footers = document.getElementsByTagName('footer');
			var footerLen = footers.length;
			
			if (header && !$(header).closest('section, article')[0]) {
				addRole(header, 'banner');
			}
			if (!footerLen) {
				return;
			}
			var footer = footers[footerLen - 1];
			if (!$(footer).closest('section, article')[0]) {
				addRole(footer, 'contentinfo');
			}
		}
	});
	
})();
});
;(function(Modernizr, webshims){
	"use strict";
	var hasNative = Modernizr.audio && Modernizr.video;
	var supportsLoop = false;
	var bugs = webshims.bugs;
	var swfType = 'mediaelement-jaris';
	var loadSwf = function(){
		webshims.ready(swfType, function(){
			if(!webshims.mediaelement.createSWF){
				webshims.mediaelement.loadSwf = true;
				webshims.reTest([swfType], hasNative);
			}
		});
	};

	var wsCfg = webshims.cfg;
	var options = wsCfg.mediaelement;
	var isIE = navigator.userAgent.indexOf('MSIE') != -1;
	if(!options){
		webshims.error("mediaelement wasn't implemented but loaded");
		return;
	}

	if(hasNative){
		var videoElem = document.createElement('video');
		Modernizr.videoBuffered = ('buffered' in videoElem);
		Modernizr.mediaDefaultMuted = ('defaultMuted' in videoElem);
		supportsLoop = ('loop' in videoElem);
		Modernizr.mediaLoop = supportsLoop;

		webshims.capturingEvents(['play', 'playing', 'waiting', 'paused', 'ended', 'durationchange', 'loadedmetadata', 'canplay', 'volumechange']);
		
		if( !Modernizr.videoBuffered || !supportsLoop || (!Modernizr.mediaDefaultMuted && isIE && 'ActiveXObject' in window) ){
			webshims.addPolyfill('mediaelement-native-fix', {
				d: ['dom-support']
			});
			webshims.loader.loadList(['mediaelement-native-fix']);
		}
	}
	
	if(Modernizr.track && !bugs.track){
		(function(){
			if(!bugs.track){

				if(window.VTTCue && !window.TextTrackCue){
					window.TextTrackCue = window.VTTCue;
				} else if(!window.VTTCue){
					window.VTTCue = window.TextTrackCue;
				}

				try {
					new VTTCue(2, 3, '');
				} catch(e){
					bugs.track = true;
				}
			}
		})();
	}

webshims.register('mediaelement-core', function($, webshims, window, document, undefined, options){
	var hasSwf = swfmini.hasFlashPlayerVersion('10.0.3');
	var mediaelement = webshims.mediaelement;
	
	mediaelement.parseRtmp = function(data){
		var src = data.src.split('://');
		var paths = src[1].split('/');
		var i, len, found;
		data.server = src[0]+'://'+paths[0]+'/';
		data.streamId = [];
		for(i = 1, len = paths.length; i < len; i++){
			if(!found && paths[i].indexOf(':') !== -1){
				paths[i] = paths[i].split(':')[1];
				found = true;
			}
			if(!found){
				data.server += paths[i]+'/';
			} else {
				data.streamId.push(paths[i]);
			}
		}
		if(!data.streamId.length){
			webshims.error('Could not parse rtmp url');
		}
		data.streamId = data.streamId.join('/');
	};

	var getSrcObj = function(elem, nodeName){
		elem = $(elem);
		var src = {src: elem.attr('src') || '', elem: elem, srcProp: elem.prop('src')};
		var tmp;
		
		if(!src.src){return src;}
		
		tmp = elem.attr('data-server');
		if(tmp != null){
			src.server = tmp;
		}
		
		tmp = elem.attr('type') || elem.attr('data-type');
		if(tmp){
			src.type = tmp;
			src.container = $.trim(tmp.split(';')[0]);
		} else {
			if(!nodeName){
				nodeName = elem[0].nodeName.toLowerCase();
				if(nodeName == 'source'){
					nodeName = (elem.closest('video, audio')[0] || {nodeName: 'video'}).nodeName.toLowerCase();
				}
			}
			if(src.server){
				src.type = nodeName+'/rtmp';
				src.container = nodeName+'/rtmp';
			} else {
				
				tmp = mediaelement.getTypeForSrc( src.src, nodeName, src );
				
				if(tmp){
					src.type = tmp;
					src.container = tmp;
				}
			}
		}

		tmp = elem.attr('media');
		if(tmp){
			src.media = tmp;
		}
		if(src.type == 'audio/rtmp' || src.type == 'video/rtmp'){
			if(src.server){
				src.streamId = src.src;
			} else {
				mediaelement.parseRtmp(src);
			}
		}
		return src;
	};
	
	
	
	var hasYt = !hasSwf && ('postMessage' in window) && hasNative;
	
	var loadTrackUi = function(){
		if(loadTrackUi.loaded){return;}
		loadTrackUi.loaded = true;
		if(!options.noAutoTrack){
			webshims.ready('WINDOWLOAD', function(){
				loadThird();
				webshims.loader.loadList(['track-ui']);
			});
		}
	};

	var loadYt = (function(){
		var loaded;
		return function(){
			if(loaded || !hasYt){return;}
			loaded = true;
			webshims.loader.loadScript("https://www.youtube.com/player_api");
			$(function(){
				webshims._polyfill(["mediaelement-yt"]);
			});
		};
	})();
	var loadThird = function(){
		if(hasSwf){
			loadSwf();
		} else {
			loadYt();
		}
	};
	
	webshims.addPolyfill('mediaelement-yt', {
		test: !hasYt,
		d: ['dom-support']
	});
	

	
	mediaelement.mimeTypes = {
		audio: {
				//ogm shouldn??t be used!
				'audio/ogg': ['ogg','oga', 'ogm'],
				'audio/ogg;codecs="opus"': 'opus',
				'audio/mpeg': ['mp2','mp3','mpga','mpega'],
				'audio/mp4': ['mp4','mpg4', 'm4r', 'm4a', 'm4p', 'm4b', 'aac'],
				'audio/wav': ['wav'],
				'audio/3gpp': ['3gp','3gpp'],
				'audio/webm': ['webm'],
				'audio/fla': ['flv', 'f4a', 'fla'],
				'application/x-mpegURL': ['m3u8', 'm3u']
			},
			video: {
				//ogm shouldn??t be used!
				'video/ogg': ['ogg','ogv', 'ogm'],
				'video/mpeg': ['mpg','mpeg','mpe'],
				'video/mp4': ['mp4','mpg4', 'm4v'],
				'video/quicktime': ['mov','qt'],
				'video/x-msvideo': ['avi'],
				'video/x-ms-asf': ['asf', 'asx'],
				'video/flv': ['flv', 'f4v'],
				'video/3gpp': ['3gp','3gpp'],
				'video/webm': ['webm'],
				'application/x-mpegURL': ['m3u8', 'm3u'],
				'video/MP2T': ['ts']
			}
		}
	;
	
	mediaelement.mimeTypes.source =  $.extend({}, mediaelement.mimeTypes.audio, mediaelement.mimeTypes.video);
	
	mediaelement.getTypeForSrc = function(src, nodeName){
		if(src.indexOf('youtube.com/watch?') != -1 || src.indexOf('youtube.com/v/') != -1){
			return 'video/youtube';
		}
		if(src.indexOf('rtmp') === 0){
			return nodeName+'/rtmp';
		}
		src = src.split('?')[0].split('#')[0].split('.');
		src = src[src.length - 1];
		var mt;
		
		$.each(mediaelement.mimeTypes[nodeName], function(mimeType, exts){
			if(exts.indexOf(src) !== -1){
				mt = mimeType;
				return false;
			}
		});
		return mt;
	};
	
	
	mediaelement.srces = function(mediaElem, srces){
		mediaElem = $(mediaElem);
		if(!srces){
			srces = [];
			var nodeName = mediaElem[0].nodeName.toLowerCase();
			var src = getSrcObj(mediaElem, nodeName);
			
			if(!src.src){
				$('source', mediaElem).each(function(){
					src = getSrcObj(this, nodeName);
					if(src.src){srces.push(src);}
				});
			} else {
				srces.push(src);
			}
			return srces;
		} else {
			webshims.error('setting sources was removed.');
		}
	};
	
	mediaelement.swfMimeTypes = ['video/3gpp', 'video/x-msvideo', 'video/quicktime', 'video/x-m4v', 'video/mp4', 'video/m4p', 'video/x-flv', 'video/flv', 'audio/mpeg', 'audio/aac', 'audio/mp4', 'audio/x-m4a', 'audio/m4a', 'audio/mp3', 'audio/x-fla', 'audio/fla', 'youtube/flv', 'video/jarisplayer', 'jarisplayer/jarisplayer', 'video/youtube', 'video/rtmp', 'audio/rtmp'];
	
	mediaelement.canThirdPlaySrces = function(mediaElem, srces){
		var ret = '';
		if(hasSwf || hasYt){
			mediaElem = $(mediaElem);
			srces = srces || mediaelement.srces(mediaElem);
			$.each(srces, function(i, src){
				if(src.container && src.src && ((hasSwf && mediaelement.swfMimeTypes.indexOf(src.container) != -1) || (hasYt && src.container == 'video/youtube'))){
					ret = src;
					return false;
				}
			});
			
		}
		
		return ret;
	};
	
	var nativeCanPlayType = {};
	mediaelement.canNativePlaySrces = function(mediaElem, srces){
		var ret = '';
		if(hasNative){
			mediaElem = $(mediaElem);
			var nodeName = (mediaElem[0].nodeName || '').toLowerCase();
			var nativeCanPlay = (nativeCanPlayType[nodeName] || {prop: {_supvalue: false}}).prop._supvalue || mediaElem[0].canPlayType;
			if(!nativeCanPlay){return ret;}
			srces = srces || mediaelement.srces(mediaElem);
			
			$.each(srces, function(i, src){
				if(src.type && nativeCanPlay.call(mediaElem[0], src.type) ){
					ret = src;
					return false;
				}
			});
		}
		return ret;
	};
	var emptyType = (/^\s*application\/octet\-stream\s*$/i);
	var getRemoveEmptyType = function(){
		var ret = emptyType.test($.attr(this, 'type') || '');
		if(ret){
			$(this).removeAttr('type');
		}
		return ret;
	};
	mediaelement.setError = function(elem, message){
		if($('source', elem).filter(getRemoveEmptyType).length){
			webshims.error('"application/octet-stream" is a useless mimetype for audio/video. Please change this attribute.');
			try {
				$(elem).mediaLoad();
			} catch(er){}
		} else {
			if(!message){
				message = "can't play sources";
			}
			$(elem).pause().data('mediaerror', message);
			webshims.error('mediaelementError: '+ message +'. Run the following line in your console to get more info: webshim.mediaelement.loadDebugger();');
			setTimeout(function(){
				if($(elem).data('mediaerror')){
					$(elem).addClass('media-error').trigger('mediaerror');
				}
			}, 1);
		}
		
		
	};
	
	var handleThird = (function(){
		var requested;
		var readyType = hasSwf ? swfType : 'mediaelement-yt';
		return function( mediaElem, ret, data ){
			//readd to ready

			webshims.ready(readyType, function(){
				if(mediaelement.createSWF && $(mediaElem).parent()[0]){
					mediaelement.createSWF( mediaElem, ret, data );
				} else if(!requested) {
					requested = true;
					loadThird();
					
					handleThird( mediaElem, ret, data );
				}
			});
			if(!requested && hasYt && !mediaelement.createSWF){
				loadYt();
			}
		};
	})();

	var activate = {
		native: function(elem, src, data){
			if(data && data.isActive == 'third') {
				mediaelement.setActive(elem, 'html5', data);
			}
		},
		third: handleThird
	};

	var stepSources = function(elem, data, srces){
		var i, src;
		var testOrder = [{test: 'canNativePlaySrces', activate: 'native'}, {test: 'canThirdPlaySrces', activate: 'third'}];
		if(options.preferFlash || (data && data.isActive == 'third') ){
			testOrder.reverse();
		}
		for(i = 0; i < 2; i++){
			src = mediaelement[testOrder[i].test](elem, srces);
			if(src){
				activate[testOrder[i].activate](elem, src, data);
				break;
			}
		}

		if(!src){
			mediaelement.setError(elem, false);
			if(data && data.isActive == 'third') {
				mediaelement.setActive(elem, 'html5', data);
			}
		}
	};
	var allowedPreload = {'metadata': 1, 'auto': 1, '': 1};
	var fixPreload = function(elem){
		var preload, img;
		if(elem.getAttribute('preload') == 'none'){
			if(allowedPreload[(preload = $.attr(elem, 'data-preload'))]){
				$.attr(elem, 'preload', preload);
			} else if(hasNative && (preload = elem.getAttribute('poster'))){
				img = document.createElement('img');
				img.src = preload;
			}
		}
	};
	var stopParent = /^(?:embed|object|datalist)$/i;
	var selectSource = function(elem, data){
		var baseData = webshims.data(elem, 'mediaelementBase') || webshims.data(elem, 'mediaelementBase', {});
		var _srces = mediaelement.srces(elem);
		var parent = elem.parentNode;
		
		clearTimeout(baseData.loadTimer);
		$(elem).removeClass('media-error');
		$.data(elem, 'mediaerror', false);
		
		if(!_srces.length || !parent || parent.nodeType != 1 || stopParent.test(parent.nodeName || '')){return;}
		data = data || webshims.data(elem, 'mediaelement');
		if(mediaelement.sortMedia){
			_srces.sort(mediaelement.sortMedia);
		}
		fixPreload(elem);
		stepSources(elem, data, _srces);

	};
	mediaelement.selectSource = selectSource;
	
	
	$(document).on('ended', function(e){
		var data = webshims.data(e.target, 'mediaelement');
		if( supportsLoop && (!data || data.isActive == 'html5') && !$.prop(e.target, 'loop')){return;}
		setTimeout(function(){
			if( $.prop(e.target, 'paused') || !$.prop(e.target, 'loop') ){return;}
			$(e.target).prop('currentTime', 0).play();
		});
		
	});
	
	var handleMedia = false;

	var initMediaElements = function(){
		var testFixMedia = function(){

			if(webshims.implement(this, 'mediaelement')){
				selectSource(this);
				if(!Modernizr.mediaDefaultMuted && $.attr(this, 'muted') != null){
					$.prop(this, 'muted', true);
				}

			}
		};
		
		webshims.ready('dom-support', function(){
			handleMedia = true;
			
			if(!supportsLoop){
				webshims.defineNodeNamesBooleanProperty(['audio', 'video'], 'loop');
			}
			
			['audio', 'video'].forEach(function(nodeName){
				var supLoad;
				supLoad = webshims.defineNodeNameProperty(nodeName, 'load',  {
					prop: {
						value: function(){
							var data = webshims.data(this, 'mediaelement');

							selectSource(this, data);
							if(hasNative && (!data || data.isActive == 'html5') && supLoad.prop._supvalue){
								supLoad.prop._supvalue.apply(this, arguments);
							}
							if(!loadTrackUi.loaded && $('track', this).length){
								loadTrackUi();
							}
							$(this).triggerHandler('wsmediareload');
						}
					}
				});

				nativeCanPlayType[nodeName] = webshims.defineNodeNameProperty(nodeName, 'canPlayType',  {
					prop: {
						value: function(type){
							var ret = '';
							if(hasNative && nativeCanPlayType[nodeName].prop._supvalue){
								ret = nativeCanPlayType[nodeName].prop._supvalue.call(this, type);
								if(ret == 'no'){
									ret = '';
								}
							}
							if(!ret && hasSwf){
								type = $.trim((type || '').split(';')[0]);
								if(mediaelement.swfMimeTypes.indexOf(type) != -1){
									ret = 'maybe';
								}
							}
							if(!ret && hasYt && type == 'video/youtube'){
								ret = 'maybe';
							}
							return ret;
						}
					}
				});
			});

			
			webshims.onNodeNamesPropertyModify(['audio', 'video'], ['src', 'poster'], {
				set: function(){
					var elem = this;
					var baseData = webshims.data(elem, 'mediaelementBase') || webshims.data(elem, 'mediaelementBase', {});
					clearTimeout(baseData.loadTimer);
					baseData.loadTimer = setTimeout(function(){
						selectSource(elem);
						elem = null;
					}, 9);
				}
			});
			
			
			webshims.addReady(function(context, insertedElement){
				var media = $('video, audio', context)
					.add(insertedElement.filter('video, audio'))
					.each(testFixMedia)
				;
				if(!loadTrackUi.loaded && $('track', media).length){
					loadTrackUi();
				}
				media = null;
			});
		});
		
		if(hasNative && !handleMedia){
			webshims.addReady(function(context, insertedElement){
				if(!handleMedia){
					$('video, audio', context)
						.add(insertedElement.filter('video, audio'))
						.each(function(){
							if(!mediaelement.canNativePlaySrces(this)){
								loadThird();
								handleMedia = true;
								return false;
							}
						})
					;
				}
			});
		}
	};

	mediaelement.loadDebugger = function(){
		webshims.ready('dom-support', function(){
			webshims.loader.loadScript('mediaelement-debug');
		});
	};

	if(webshims.cfg.debug){
		$(document).on('mediaerror', function(e){
			mediaelement.loadDebugger();
		});
	}
	//set native implementation ready, before swf api is retested
	if(hasNative){
		webshims.isReady('mediaelement-core', true);
		initMediaElements();
		webshims.ready('WINDOWLOAD mediaelement', loadThird);
	} else {
		webshims.ready(swfType, initMediaElements);
	}
	webshims.ready('track', loadTrackUi);
});

})(Modernizr, webshims);
;webshims.register('mediaelement-jaris', function($, webshims, window, document, undefined, options){
	"use strict";
	
	var mediaelement = webshims.mediaelement;
	var swfmini = window.swfmini;
	var hasNative = Modernizr.audio && Modernizr.video;
	var hasFlash = swfmini.hasFlashPlayerVersion('9.0.115');
	var loadedSwf = 0;
	var needsLoadPreload = 'ActiveXObject' in window && hasNative;
	var getProps = {
		paused: true,
		ended: false,
		currentSrc: '',
		duration: window.NaN,
		readyState: 0,
		networkState: 0,
		videoHeight: 0,
		videoWidth: 0,
		seeking: false,
		error: null,
		buffered: {
			start: function(index){
				if(index){
					webshims.error('buffered index size error');
					return;
				}
				return 0;
			},
			end: function(index){
				if(index){
					webshims.error('buffered index size error');
					return;
				}
				return 0;
			},
			length: 0
		}
	};
	var getPropKeys = Object.keys(getProps);
	
	var getSetProps = {
		currentTime: 0,
		volume: 1,
		muted: false
	};
	var getSetPropKeys = Object.keys(getSetProps);
	
	var playerStateObj = $.extend({
		isActive: 'html5',
		activating: 'html5',	
		wasSwfReady: false,
		_bufferedEnd: 0,
		_bufferedStart: 0,
		currentTime: 0,
		_ppFlag: undefined,
		_calledMeta: false,
		lastDuration: 0
	}, getProps, getSetProps);
	
	
	var getSwfDataFromElem = function(elem){
		try {
			(elem.nodeName);
		} catch(er){
			return null;
		}
		var data = webshims.data(elem, 'mediaelement');
		return (data && data.isActive== 'third') ? data : null;
	};
	
	var trigger = function(elem, evt){
		evt = $.Event(evt);
		evt.preventDefault();
		$.event.trigger(evt, undefined, elem);
	};
	
	var playerSwfPath = options.playerPath || webshims.cfg.basePath + "swf/" + (options.playerName || 'JarisFLVPlayer.swf');
	
	webshims.extendUNDEFProp(options.params, {
		allowscriptaccess: 'always',
		allowfullscreen: 'true',
		wmode: 'transparent',
		allowNetworking: 'all'
	});
	webshims.extendUNDEFProp(options.vars, {
		controltype: '1',
		jsapi: '1'
	});
	webshims.extendUNDEFProp(options.attrs, {
		bgcolor: '#000000'
	});
	
	var setReadyState = function(readyState, data){
		if(readyState < 3){
			clearTimeout(data._canplaythroughTimer);
		}
		if(readyState >= 3 && data.readyState < 3){
			data.readyState = readyState;
			trigger(data._elem, 'canplay');
			if(!data.paused){
				trigger(data._elem, 'playing');
			}
			clearTimeout(data._canplaythroughTimer);
			data._canplaythroughTimer = setTimeout(function(){
				setReadyState(4, data);
			}, 4000);
		}
		if(readyState >= 4 && data.readyState < 4){
			data.readyState = readyState;
			trigger(data._elem, 'canplaythrough');
		}
		data.readyState = readyState;
	};
	var callSeeked = function(data){
		if(data.seeking && Math.abs(data.currentTime - data._lastSeektime) < 2){
			data.seeking = false;
			$(data._elem).triggerHandler('seeked');
		}
	};
	
	
	mediaelement.jarisEvent = {};
	var localConnectionTimer;
	var onEvent = {
		onPlayPause: function(jaris, data, override){
			var playing, type;
			if(override == null){
				try {
					playing = data.api.api_get("isPlaying");
				} catch(e){}
			} else {
				playing = override;
			}
			if(playing == data.paused){
				
				data.paused = !playing;
				type = data.paused ? 'pause' : 'play';
				data._ppFlag = true;
				trigger(data._elem, type);
				if(data.readyState < 3){
					setReadyState(3, data);
				}
				if(!data.paused){
					trigger(data._elem, 'playing');
				}
			}
		},
		onSeek: function(jaris, data){
			data._lastSeektime = jaris.seekTime;
			
			data.seeking = true;
			$(data._elem).triggerHandler('seeking');
			clearTimeout(data._seekedTimer);
			data._seekedTimer = setTimeout(function(){
				callSeeked(data);
				data.seeking = false;
			}, 300);
		},
		onConnectionFailed: function(jaris, data){
			mediaelement.setError(data._elem, 'flash connection error');
		},
		onNotBuffering: function(jaris, data){
			setReadyState(3, data);
		},
		onDataInitialized: function(jaris, data){
			
			var oldDur = data.duration;
			var durDelta;
			data.duration = jaris.duration;
			if(oldDur == data.duration || isNaN(data.duration)){return;}
			
			if(data._calledMeta && ((durDelta = Math.abs(data.lastDuration - data.duration)) < 2)){return;}
			
			
			
			data.videoHeight = jaris.height;
			data.videoWidth = jaris.width;
			
			if(!data.networkState){
				data.networkState = 2;
			}
			if(data.readyState < 1){
				setReadyState(1, data);
			}
			clearTimeout(data._durationChangeTimer);
			if(data._calledMeta && data.duration){
				data._durationChangeTimer = setTimeout(function(){
					data.lastDuration = data.duration;
					trigger(data._elem, 'durationchange');
				}, durDelta > 50 ? 0 : durDelta > 9 ? 9 : 99);
			} else {
				data.lastDuration = data.duration;
				if(data.duration){
					trigger(data._elem, 'durationchange');
				}
				if(!data._calledMeta){
					trigger(data._elem, 'loadedmetadata');
				}
			}
			data._calledMeta = true;
		},
		onBuffering: function(jaris, data){
			if(data.ended){
				data.ended = false;
			}
			setReadyState(1, data);
			trigger(data._elem, 'waiting');
		},
		onTimeUpdate: function(jaris, data){
			if(data.ended){
				data.ended = false;
			}
			if(data.readyState < 3){
				setReadyState(3, data);
				trigger(data._elem, 'playing');
			}
			if(data.seeking){
				callSeeked(data);
			}
			trigger(data._elem, 'timeupdate');
		},
		onProgress: function(jaris, data){
			if(data.ended){
				data.ended = false;
			}
			if(!data.duration || isNaN(data.duration)){
				return;
			}
			var percentage = jaris.loaded / jaris.total;
			if(percentage > 0.02 && percentage < 0.2){
				setReadyState(3, data);
			} else if(percentage > 0.2){
				if(percentage > 0.99){
					data.networkState = 1;
				}
				setReadyState(4, data);
			}
			if(data._bufferedEnd && (data._bufferedEnd > percentage)){
				data._bufferedStart = data.currentTime || 0;
			}
			
			data._bufferedEnd = percentage;
			data.buffered.length = 1;
			
			$.event.trigger('progress', undefined, data._elem, true);
		},
		onPlaybackFinished: function(jaris, data){
			if(data.readyState < 4){
				setReadyState(4, data);
			}
			data.ended = true;
			trigger(data._elem, 'ended');
		},
		onVolumeChange: function(jaris, data){
			if(data.volume != jaris.volume || data.muted != jaris.mute){
				data.volume = jaris.volume;
				data.muted = jaris.mute;
				trigger(data._elem, 'volumechange');
			}
		},
		ready: (function(){
			var testAPI = function(data){
				var passed = true;
				
				try {
					data.api.api_get('volume');
				} catch(er){
					passed = false;
				}
				return passed;
			};
			
			return function(jaris, data){
				var i = 0;
				
				var doneFn = function(){
					if(i > 9){
						data.tryedReframeing = 0;
						return;
					}
					i++;
					
					data.tryedReframeing++;
					if(testAPI(data)){
						data.wasSwfReady = true;
						data.tryedReframeing = 0;
						startAutoPlay(data);
						workActionQueue(data);
					} else if(data.tryedReframeing < 6) {
						if(data.tryedReframeing < 3){
							data.reframeTimer = setTimeout(doneFn, 9);
							data.shadowElem.css({overflow: 'visible'});
							setTimeout(function(){
								data.shadowElem.css({overflow: 'hidden'});
							}, 1);
						} else {
							data.shadowElem.css({overflow: 'hidden'});
							$(data._elem).mediaLoad();
						}
					} else {
						clearTimeout(data.reframeTimer);
						webshims.error("reframing error");
					}
				};
				if(!data || !data.api){return;}
				if(!data.tryedReframeing){
					data.tryedReframeing = 0;
				}
				clearTimeout(localConnectionTimer);
				clearTimeout(data.reframeTimer);
				data.shadowElem.removeClass('flashblocker-assumed');
				
				if(!i){
					doneFn();
				} else {
					data.reframeTimer = setTimeout(doneFn, 9);
				}
				
			};
		})()
	};
	
	onEvent.onMute = onEvent.onVolumeChange;
	
	
	var workActionQueue = function(data){
		var actionLen = data.actionQueue.length;
		var i = 0;
		var operation;
		
		if(actionLen && data.isActive == 'third'){
			while(data.actionQueue.length && actionLen > i){
				i++;
				operation = data.actionQueue.shift();
				try{
					data.api[operation.fn].apply(data.api, operation.args);
				} catch(er){
					webshims.warn(er);
				}
			}
		}
		if(data.actionQueue.length){
			data.actionQueue = [];
		}
	};
	var startAutoPlay = function(data){
		if(!data){return;}
		if( (data._ppFlag === undefined && ($.prop(data._elem, 'autoplay')) || !data.paused)){
			setTimeout(function(){
				if(data.isActive == 'third' && (data._ppFlag === undefined || !data.paused)){
					
					try {
						$(data._elem).play();
						data._ppFlag = true;
					} catch(er){}
				}
			}, 1);
		}
		
		if(data.muted){
			$.prop(data._elem, 'muted', true);
		}
		if(data.volume != 1){
			$.prop(data._elem, 'volume', data.volume);
		}
	};
	
	
	var addMediaToStopEvents = $.noop;
	if(hasNative){
		var stopEvents = {
			play: 1,
			playing: 1
		};
		var hideEvtArray = ['play', 'pause', 'playing', 'canplay', 'progress', 'waiting', 'ended', 'loadedmetadata', 'durationchange', 'emptied'];
		var hidevents = hideEvtArray.map(function(evt){
			return evt +'.webshimspolyfill';
		}).join(' ');
		
		var hidePlayerEvents = function(event){
			var data = webshims.data(event.target, 'mediaelement');
			if(!data){return;}
			var isNativeHTML5 = ( event.originalEvent && event.originalEvent.type === event.type );
			if( isNativeHTML5 == (data.activating == 'third') ){
				event.stopImmediatePropagation();
				
				if(stopEvents[event.type]){
					if(data.isActive != data.activating){
						$(event.target).pause();
					} else if(isNativeHTML5){
						($.prop(event.target, 'pause')._supvalue || $.noop).apply(event.target);
					}
				}
			}
		};
		
		addMediaToStopEvents = function(elem){
			$(elem)
				.off(hidevents)
				.on(hidevents, hidePlayerEvents)
			;
			hideEvtArray.forEach(function(evt){
				webshims.moveToFirstEvent(elem, evt);
			});
		};
		addMediaToStopEvents(document);
	}
	
	
	mediaelement.setActive = function(elem, type, data){
		if(!data){
			data = webshims.data(elem, 'mediaelement');
		}
		if(!data || data.isActive == type){return;}
		if(type != 'html5' && type != 'third'){
			webshims.warn('wrong type for mediaelement activating: '+ type);
		}
		var shadowData = webshims.data(elem, 'shadowData');
		data.activating = type;
		$(elem).pause();
		data.isActive = type;
		if(type == 'third'){
			shadowData.shadowElement = shadowData.shadowFocusElement = data.shadowElem[0];
			$(elem).addClass('swf-api-active nonnative-api-active').hide().getShadowElement().show();
		} else {
			$(elem).removeClass('swf-api-active nonnative-api-active').show().getShadowElement().hide();
			shadowData.shadowElement = shadowData.shadowFocusElement = false;
		}
		$(elem).trigger('mediaelementapichange');
	};
	
	
	
	var resetSwfProps = (function(){
		var resetProtoProps = ['_calledMeta', 'lastDuration', '_bufferedEnd', '_bufferedStart', '_ppFlag', 'currentSrc', 'currentTime', 'duration', 'ended', 'networkState', 'paused', 'seeking', 'videoHeight', 'videoWidth'];
		var len = resetProtoProps.length;
		return function(data){
			
			if(!data){return;}
			clearTimeout(data._seekedTimer);
			var lenI = len;
			var networkState = data.networkState;
			setReadyState(0, data);
			clearTimeout(data._durationChangeTimer);
			while(--lenI > -1){
				delete data[resetProtoProps[lenI]];
			}
			data.actionQueue = [];
			data.buffered.length = 0;
			if(networkState){
				trigger(data._elem, 'emptied');
			}
		};
	})();
	
	
	var getComputedDimension = (function(){
		var dimCache = {};
		var getVideoDims = function(data){
			var ret, poster, img;
			if(dimCache[data.currentSrc]){
				ret = dimCache[data.currentSrc];
			} else if(data.videoHeight && data.videoWidth){
				dimCache[data.currentSrc] = {
					width: data.videoWidth,
					height: data.videoHeight
				};
				ret = dimCache[data.currentSrc];
			} else if((poster = $.attr(data._elem, 'poster'))){
				ret = dimCache[poster];
				if(!ret){
					img = document.createElement('img');
					img.onload = function(){
						dimCache[poster] = {
							width: this.width,
							height: this.height
						};
						
						if(dimCache[poster].height && dimCache[poster].width){
							setElementDimension(data, $.prop(data._elem, 'controls'));
						} else {
							delete dimCache[poster];
						}
						img.onload = null;
					};
					img.src = poster;
					if(img.complete && img.onload){
						img.onload();
					}
				}
			}
			return ret || {width: 300, height: data._elemNodeName == 'video' ? 150 : 50};
		};
		
		var getCssStyle = function(elem, style){
			return elem.style[style] || (elem.currentStyle && elem.currentStyle[style]) || (window.getComputedStyle && (window.getComputedStyle( elem, null ) || {} )[style]) || '';
		};
		var minMaxProps = ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'];
		
		var addMinMax = function(elem, ret){
			var i, prop;
			var hasMinMax = false;
			for (i = 0; i < 4; i++) {
				prop = getCssStyle(elem, minMaxProps[i]);
				if(parseFloat(prop, 10)){
					hasMinMax = true;
					ret[minMaxProps[i]] = prop;
				}
			}
			return hasMinMax;
		};
		var retFn = function(data){
			var videoDims, ratio, hasMinMax;
			var elem = data._elem;
			var autos = {
				width: getCssStyle(elem, 'width') == 'auto',
				height: getCssStyle(elem, 'height') == 'auto'
			};
			var ret  = {
				width: !autos.width && $(elem).width(),
				height: !autos.height && $(elem).height()
			};
			
			if(autos.width || autos.height){
				videoDims = getVideoDims(data);
				ratio = videoDims.width / videoDims.height;
				
				if(autos.width && autos.height){
					ret.width = videoDims.width;
					ret.height = videoDims.height;
				} else if(autos.width){
					ret.width = ret.height * ratio;
				} else if(autos.height){
					ret.height = ret.width / ratio;
				}
				
				if(addMinMax(elem, ret)){
					data.shadowElem.css(ret);
					if(autos.width){
						ret.width = data.shadowElem.height() * ratio;
					} 
					if(autos.height){
						ret.height = ((autos.width) ? ret.width :  data.shadowElem.width()) / ratio;
					}
					if(autos.width && autos.height){
						data.shadowElem.css(ret);
						ret.height = data.shadowElem.width() / ratio;
						ret.width = ret.height * ratio;
						
						data.shadowElem.css(ret);
						ret.width = data.shadowElem.height() * ratio;
						ret.height = ret.width / ratio;
						
					}
					if(!Modernizr.video){
						ret.width = data.shadowElem.width();
						ret.height = data.shadowElem.height();
					}
				}
			}
			return ret;
		};
		
		return retFn;
	})();
	
	var setElementDimension = function(data, hasControls){
		var dims;
		
		var box = data.shadowElem;
		$(data._elem)[hasControls ? 'addClass' : 'removeClass']('webshims-controls');

		if(data.isActive == 'third' || data.activating == 'third'){
			if(data._elemNodeName == 'audio' && !hasControls){
				box.css({width: 0, height: 0});
			} else {
				data._elem.style.display = '';
				dims = getComputedDimension(data);
				data._elem.style.display = 'none';
				box.css(dims);
			}
		}
	};
	
	var bufferSrc = (function(){
		var preloads = {
			'': 1,
			'auto': 1
		};
		return function(elem){
			var preload = $.attr(elem, 'preload');
			if(preload == null || preload == 'none' || $.prop(elem, 'autoplay')){
				return false;
			}
			preload =  $.prop(elem, 'preload');
			return !!(preloads[preload] || (preload == 'metadata' && $(elem).is('.preload-in-doubt, video:not([poster])')));
		};
	})();
	
	var regs = {
		A: /&amp;/g,
		a: /&/g,
		e: /\=/g,
		q: /\?/g
	},
	replaceVar = function(val){
		return (val.replace) ? val.replace(regs.A, '%26').replace(regs.a, '%26').replace(regs.e, '%3D').replace(regs.q, '%3F') : val;
	};
	
	if('matchMedia' in window){
		var allowMediaSorting = false;
		try {
			allowMediaSorting = window.matchMedia('only all').matches;
		} catch(er){}
		if(allowMediaSorting){
			mediaelement.sortMedia = function(src1, src2){
				try {
					src1 = !src1.media || matchMedia( src1.media ).matches;
					src2 = !src2.media || matchMedia( src2.media ).matches;
				} catch(er){
					return 0;
				}
				return src1 == src2 ? 
					0 :
					src1 ? -1
					: 1;
			};
		}
	}

	mediaelement.createSWF = function( elem, canPlaySrc, data ){
		if(!hasFlash){
			setTimeout(function(){
				$(elem).mediaLoad(); //<- this should produce a mediaerror
			}, 1);
			return;
		}
		
		var attrStyle = {};

		if(loadedSwf < 1){
			loadedSwf = 1;
		} else {
			loadedSwf++;
		}
		if(!data){
			data = webshims.data(elem, 'mediaelement');
		}
		
		if((attrStyle.height = $.attr(elem, 'height') || '') || (attrStyle.width = $.attr(elem, 'width') || '')){
			$(elem).css(attrStyle);
			webshims.warn("width or height content attributes used. Webshims prefers the usage of CSS (computed styles or inline styles) to detect size of a video/audio. It's really more powerfull.");
		}
		
		var isRtmp = canPlaySrc.type == 'audio/rtmp' || canPlaySrc.type == 'video/rtmp';
		var vars = $.extend({}, options.vars, {
				poster: replaceVar($.attr(elem, 'poster') && $.prop(elem, 'poster') || ''),
				source: replaceVar(canPlaySrc.streamId || canPlaySrc.srcProp),
				server: replaceVar(canPlaySrc.server || '')
		});
		var elemVars = $(elem).data('vars') || {};
		
		
		
		var hasControls = $.prop(elem, 'controls');
		var elemId = 'jarisplayer-'+ webshims.getID(elem);
		
		var params = $.extend(
			{},
			options.params,
			$(elem).data('params')
		);
		var elemNodeName = elem.nodeName.toLowerCase();
		var attrs = $.extend(
			{},
			options.attrs,
			{
				name: elemId,
				id: elemId
			},
			$(elem).data('attrs')
		);
		var setDimension = function(){
			if(data.isActive == 'third'){
				setElementDimension(data, $.prop(elem, 'controls'));
			}
		};
		
		var box;
		
		if(data && data.swfCreated){
			mediaelement.setActive(elem, 'third', data);
			
			data.currentSrc = canPlaySrc.srcProp;
			
			data.shadowElem.html('<div id="'+ elemId +'">');
			
			data.api = false;
			data.actionQueue = [];
			box = data.shadowElem;
			resetSwfProps(data);
		} else {
			$(document.getElementById('wrapper-'+ elemId )).remove();
			box = $('<div class="polyfill-'+ (elemNodeName) +' polyfill-mediaelement '+ webshims.shadowClass +'" id="wrapper-'+ elemId +'"><div id="'+ elemId +'"></div>')
				.css({
					position: 'relative',
					overflow: 'hidden'
				})
			;
			data = webshims.data(elem, 'mediaelement', webshims.objectCreate(playerStateObj, {
				actionQueue: {
					value: []
				},
				shadowElem: {
					value: box
				},
				_elemNodeName: {
					value: elemNodeName
				},
				_elem: {
					value: elem
				},
				currentSrc: {
					value: canPlaySrc.srcProp
				},
				swfCreated: {
					value: true
				},
				id: {
					value: elemId.replace(/-/g, '')
				},
				buffered: {
					value: {
						start: function(index){
							if(index >= data.buffered.length){
								webshims.error('buffered index size error');
								return;
							}
							return 0;
						},
						end: function(index){
							if(index >= data.buffered.length){
								webshims.error('buffered index size error');
								return;
							}
							return ( (data.duration - data._bufferedStart) * data._bufferedEnd) + data._bufferedStart;
						},
						length: 0
					}
				}
			}));
			
			
		
			box.insertBefore(elem);
			
			if(hasNative){
				$.extend(data, {volume: $.prop(elem, 'volume'), muted: $.prop(elem, 'muted'), paused: $.prop(elem, 'paused')});
			}
			
			webshims.addShadowDom(elem, box);
			if(!webshims.data(elem, 'mediaelement')){
				webshims.data(elem, 'mediaelement', data);
			}
			addMediaToStopEvents(elem);
			
			mediaelement.setActive(elem, 'third', data);
			
			setElementDimension(data, hasControls);
			
			$(elem)
				.on({
					'updatemediaelementdimensions loadedmetadata emptied': setDimension,
					'remove': function(e){
						if(!e.originalEvent && mediaelement.jarisEvent[data.id] && mediaelement.jarisEvent[data.id].elem == elem){
							delete mediaelement.jarisEvent[data.id];
							clearTimeout(localConnectionTimer);
							clearTimeout(data.flashBlock);
						}
					}
				})
				.onWSOff('updateshadowdom', setDimension)
			;
		}
		
		if(mediaelement.jarisEvent[data.id] && mediaelement.jarisEvent[data.id].elem != elem){
			webshims.error('something went wrong');
			return;
		} else if(!mediaelement.jarisEvent[data.id]){
			
			mediaelement.jarisEvent[data.id] = function(jaris){
				
				if(jaris.type == 'ready'){
					var onReady = function(){
						if(data.api){
							if(!data.paused){
								data.api.api_play();
							}
							if(bufferSrc(elem)){
								data.api.api_preload();
							}
							onEvent.ready(jaris, data);
						}
					};
					if(data.api){
						onReady();
					} else {
						setTimeout(onReady, 9);
					}
				} else {
					data.currentTime = jaris.position;
					
					if(data.api){
						if(!data._calledMeta && isNaN(jaris.duration) && data.duration != jaris.duration && isNaN(data.duration)){
							onEvent.onDataInitialized(jaris, data);
						}
						
						if(!data._ppFlag && jaris.type != 'onPlayPause'){
							onEvent.onPlayPause(jaris, data);
						}
						
						if(onEvent[jaris.type]){
							onEvent[jaris.type](jaris, data);
						}
					}
					data.duration = jaris.duration;
				}
			};
			mediaelement.jarisEvent[data.id].elem = elem;
		}
		
		$.extend(vars, 
			{
				id: elemId,
				evtId: data.id,
				controls: ''+hasControls,
				autostart: 'false',
				nodename: elemNodeName
			},
			elemVars
		);
		
		if(isRtmp){
			vars.streamtype = 'rtmp';
		} else if(canPlaySrc.type == 'audio/mpeg' || canPlaySrc.type == 'audio/mp3'){
			vars.type = 'audio';
			vars.streamtype = 'file';
		} else if(canPlaySrc.type == 'video/youtube'){
			vars.streamtype = 'youtube';
		}
		options.changeSWF(vars, elem, canPlaySrc, data, 'embed');
		clearTimeout(data.flashBlock);
		
		swfmini.embedSWF(playerSwfPath, elemId, "100%", "100%", "9.0.115", false, vars, params, attrs, function(swfData){
			if(swfData.success){
				var fBlocker = function(){
					if((!swfData.ref.parentNode && box[0].parentNode) || swfData.ref.style.display == "none"){
						box.addClass('flashblocker-assumed');
						$(elem).trigger('flashblocker');
						webshims.warn("flashblocker assumed");
					}
					$(swfData.ref).css({'minHeight': '2px', 'minWidth': '2px', display: 'block'});
				};
				data.api = swfData.ref;
				
				if(!hasControls){
					$(swfData.ref).attr('tabindex', '-1').css('outline', 'none');
				}
				
				data.flashBlock = setTimeout(fBlocker, 99);
				
				if(!localConnectionTimer){
					clearTimeout(localConnectionTimer);
					localConnectionTimer = setTimeout(function(){
						fBlocker();
						var flash = $(swfData.ref);
						if(flash[0].offsetWidth > 1 && flash[0].offsetHeight > 1 && location.protocol.indexOf('file:') === 0){
							webshims.error("Add your local development-directory to the local-trusted security sandbox:  http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html");
						} else if(flash[0].offsetWidth < 2 || flash[0].offsetHeight < 2) {
							webshims.warn("JS-SWF connection can't be established on hidden or unconnected flash objects");
						}
						flash = null;
					}, 8000);
				}
			}
		});
		
	};
	
	
	var queueSwfMethod = function(elem, fn, args, data){
		data = data || getSwfDataFromElem(elem);
		
		if(data){
			if(data.api && data.api[fn]){
				data.api[fn].apply(data.api, args || []);
			} else {
				//todo add to queue
				data.actionQueue.push({fn: fn, args: args});
				
				if(data.actionQueue.length > 10){
					setTimeout(function(){
						if(data.actionQueue.length > 5){
							data.actionQueue.shift();
						}
					}, 99);
				}
			}
			return data;
		}
		return false;
	};
	
	['audio', 'video'].forEach(function(nodeName){
		var descs = {};
		var mediaSup;
		var createGetProp = function(key){
			if(nodeName == 'audio' && (key == 'videoHeight' || key == 'videoWidth')){return;}
			
			descs[key] = {
				get: function(){
					var data = getSwfDataFromElem(this);
					if(data){
						return data[key];
					} else if(hasNative && mediaSup[key].prop._supget) {
						return mediaSup[key].prop._supget.apply(this);
					} else {
						return playerStateObj[key];
					}
				},
				writeable: false
			};
		};
		var createGetSetProp = function(key, setFn){
			createGetProp(key);
			delete descs[key].writeable;
			descs[key].set = setFn;
		};
		
		createGetSetProp('seeking');
		
		createGetSetProp('volume', function(v){
			var data = getSwfDataFromElem(this);
			if(data){
				v *= 1;
				if(!isNaN(v)){
					
					if(v < 0 || v > 1){
						webshims.error('volume greater or less than allowed '+ (v / 100));
					}
					
					queueSwfMethod(this, 'api_volume', [v], data);
					
					
					if(data.volume != v){
						data.volume = v;
						trigger(data._elem, 'volumechange');
					}
					data = null;
				} 
			} else if(mediaSup.volume.prop._supset) {
				return mediaSup.volume.prop._supset.apply(this, arguments);
			}
		});
		
		createGetSetProp('muted', function(m){
			var data = getSwfDataFromElem(this);
			if(data){
				m = !!m;
				queueSwfMethod(this, 'api_muted', [m], data);
				if(data.muted != m){
					data.muted = m;
					trigger(data._elem, 'volumechange');
				}
				data = null;
			} else if(mediaSup.muted.prop._supset) {
				return mediaSup.muted.prop._supset.apply(this, arguments);
			}
		});
		
		
		createGetSetProp('currentTime', function(t){
			var data = getSwfDataFromElem(this);
			if(data){
				t *= 1;
				if (!isNaN(t)) {
					queueSwfMethod(this, 'api_seek', [t], data);
				}
				 
			} else if(mediaSup.currentTime.prop._supset) {
				return mediaSup.currentTime.prop._supset.apply(this, arguments);
			}
		});
		
		['play', 'pause'].forEach(function(fn){
			descs[fn] = {
				value: function(){
					var data = getSwfDataFromElem(this);
					
					if(data){
						if(data.stopPlayPause){
							clearTimeout(data.stopPlayPause);
						}
						queueSwfMethod(this, fn == 'play' ? 'api_play' : 'api_pause', [], data);
						
						data._ppFlag = true;
						if(data.paused != (fn != 'play')){
							data.paused = fn != 'play';
							trigger(data._elem, fn);
						}
					} else if(mediaSup[fn].prop._supvalue) {
						return mediaSup[fn].prop._supvalue.apply(this, arguments);
					}
				}
			};
		});
		
		getPropKeys.forEach(createGetProp);
		
		webshims.onNodeNamesPropertyModify(nodeName, 'controls', function(val, boolProp){
			var data = getSwfDataFromElem(this);
			
			$(this)[boolProp ? 'addClass' : 'removeClass']('webshims-controls');
			
			if(data){
				if(nodeName == 'audio'){
					setElementDimension(data, boolProp);
				}
				queueSwfMethod(this, 'api_controls', [boolProp], data);
			}
		});
		
		
		webshims.onNodeNamesPropertyModify(nodeName, 'preload', function(val){
			var data, baseData, elem;
			
			
			if(bufferSrc(this)){
				data = getSwfDataFromElem(this);
				if(data){
					queueSwfMethod(this, 'api_preload', [], data);
				} else if(needsLoadPreload && this.paused && !this.error && !$.data(this, 'mediaerror') && !this.readyState && !this.networkState && !this.autoplay && $(this).is(':not(.nonnative-api-active)')){
					elem = this;
					baseData = webshims.data(elem, 'mediaelementBase') || webshims.data(elem, 'mediaelementBase', {});
					clearTimeout(baseData.loadTimer);
					baseData.loadTimer = setTimeout(function(){
						$(elem).mediaLoad();
					}, 9);
				}
			}
		});
		
		mediaSup = webshims.defineNodeNameProperties(nodeName, descs, 'prop');
		
		if(!Modernizr.mediaDefaultMuted){
			webshims.defineNodeNameProperties(nodeName, {
				defaultMuted: {
					get: function(){
						return $.attr(this, 'muted') != null;
					},
					set: function(val){
						if(val){
							$.attr(this, 'muted', '');
						} else {
							$(this).removeAttr('muted');
						}
					}
				}
			}, 'prop');
		}
	});
	
	
	if(hasFlash && $.cleanData){
		var oldClean = $.cleanData;
		var flashNames = {
			object: 1,
			OBJECT: 1
		};
		
		$.cleanData = function(elems){
			var i, len, prop;
			if(elems && (len = elems.length) && loadedSwf){
				
				for(i = 0; i < len; i++){
					if(flashNames[elems[i].nodeName] && 'api_pause' in elems[i]){
						loadedSwf--;
						try {
							elems[i].api_pause();
							if(elems[i].readyState == 4){
								for (prop in elems[i]) {
									if (typeof elems[i][prop] == "function") {
										elems[i][prop] = null;
									}
								}
							}
						} catch(er){}
					}
				}
				
			}
			return oldClean.apply(this, arguments);
		};
	}

	if(!hasNative){
		
		['poster', 'src'].forEach(function(prop){
			webshims.defineNodeNamesProperty(prop == 'src' ? ['audio', 'video', 'source'] : ['video'], prop, {
				//attr: {},
				reflect: true,
				propType: 'src'
			});
		});
		
		webshims.defineNodeNamesProperty(['audio', 'video'], 'preload', {
			reflect: true,
			propType: 'enumarated',
			defaultValue: '',
			limitedTo: ['', 'auto', 'metadata', 'none']
		});
		
		webshims.reflectProperties('source', ['type', 'media']);
		
		
		['autoplay', 'controls'].forEach(function(name){
			webshims.defineNodeNamesBooleanProperty(['audio', 'video'], name);
		});
			
		webshims.defineNodeNamesProperties(['audio', 'video'], {
			HAVE_CURRENT_DATA: {
				value: 2
			},
			HAVE_ENOUGH_DATA: {
				value: 4
			},
			HAVE_FUTURE_DATA: {
				value: 3
			},
			HAVE_METADATA: {
				value: 1
			},
			HAVE_NOTHING: {
				value: 0
			},
			NETWORK_EMPTY: {
				value: 0
			},
			NETWORK_IDLE: {
				value: 1
			},
			NETWORK_LOADING: {
				value: 2
			},
			NETWORK_NO_SOURCE: {
				value: 3
			}
					
		}, 'prop');


		if(hasFlash){
			webshims.ready('WINDOWLOAD', function(){
				setTimeout(function(){
					if(!loadedSwf){
						document.createElement('img').src = playerSwfPath;
					}
				}, 9);
			});
		}
	} else if(!('media' in document.createElement('source'))){
		webshims.reflectProperties('source', ['media']);
	}

	if(hasNative && hasFlash && !options.preferFlash){
		var switchErrors = {
			3: 1,
			4: 1
		};
		var switchOptions = function(e){
			var media, error, parent;
			if(
				($(e.target).is('audio, video') || ((parent = e.target.parentNode) && $('source', parent).last()[0] == e.target)) &&
				(media = $(e.target).closest('audio, video')) && !media.is('.nonnative-api-active')
				){
				error = media.prop('error');
				setTimeout(function(){
					if(!media.is('.nonnative-api-active')){
						if(error && switchErrors[error.code]){
							options.preferFlash = true;
							document.removeEventListener('error', switchOptions, true);
							$('audio, video').each(function(){
								webshims.mediaelement.selectSource(this);
							});
							webshims.error("switching mediaelements option to 'preferFlash', due to an error with native player: "+e.target.src+" Mediaerror: "+ media.prop('error')+ 'first error: '+ error);
						}
						webshims.warn('There was a mediaelement error. Run the following line in your console to get more info: webshim.mediaelement.loadDebugger();')
					}
				});


			}
		};

		document.addEventListener('error', switchOptions, true);
		setTimeout(function(){
			$('audio, video').each(function(){
				var error = $.prop(this, 'error');
				if(error && switchErrors[error]){
					switchOptions({target: this});
				}
			});
		});
	}

});
