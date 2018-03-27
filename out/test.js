"use strict";
/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */
// vim: ts=4 sts=4 sw=4 expandtab
// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;
// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';
    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */
    // Shortcut to an often accessed properties, in order to avoid multiple
    // dereference that costs universally. This also holds a reference to known-good
    // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;
    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;
    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable; /* inlined from https://npmjs.com/is-callable */
    var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) { try {
        var fnStr = fnToStr.call(value);
        var singleStripped = fnStr.replace(/\/\/.*\n/g, '');
        var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, '');
        var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' ');
        return constructorRegex.test(spaceStripped);
    }
    catch (e) {
        return false; /* not a function */
    } }, tryFunctionObject = function tryFunctionObject(value) { try {
        if (isES6ClassFn(value)) {
            return false;
        }
        fnToStr.call(value);
        return true;
    }
    catch (e) {
        return false;
    } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) { if (!value) {
        return false;
    } if (typeof value !== 'function' && typeof value !== 'object') {
        return false;
    } if (hasToStringTag) {
        return tryFunctionObject(value);
    } if (isES6ClassFn(value)) {
        return false;
    } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };
    var isRegex; /* inlined from https://npmjs.com/is-regex */
    var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try {
        regexExec.call(value);
        return true;
    }
    catch (e) {
        return false;
    } }, regexClass = '[object RegExp]';
    isRegex = function isRegex(value) { if (typeof value !== 'object') {
        return false;
    } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
    var isString; /* inlined from https://npmjs.com/is-string */
    var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try {
        strValue.call(value);
        return true;
    }
    catch (e) {
        return false;
    } }, stringClass = '[object String]';
    isString = function isString(value) { if (typeof value === 'string') {
        return true;
    } if (typeof value !== 'object') {
        return false;
    } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
        try {
            var obj = {};
            $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                return false;
            }
            return obj.x === obj;
        }
        catch (e) { /* this is ES3 */
            return false;
        }
    }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        }
        else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));
    //
    // Util
    // ======
    //
    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };
    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
        return x !== x;
    };
    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            }
            else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },
        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };
    //
    // Function
    // ========
    //
    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5
    var Empty = function Empty() { };
    defineProperties(FunctionPrototype, {
        bind: function bind(that) {
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {
                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.
                    var result = apply.call(target, this, array_concat.call(args, array_slice.call(arguments)));
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;
                }
                else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.
                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(target, that, array_concat.call(args, array_slice.call(arguments)));
                }
            };
            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.
            var boundLength = max(0, target.length - args.length);
            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }
            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);
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
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.
            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.
            // 22. Return F.
            return bound;
        }
    });
    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    /* globals document */
    if (typeof document === 'object' && document && document.documentElement) {
        try {
            arraySlice(document.documentElement.childNodes);
        }
        catch (e) {
            var origArraySlice = arraySlice;
            var origArraySliceApply = arraySliceApply;
            arraySlice = function arraySliceIE(arr) {
                var r = [];
                var i = arr.length;
                while (i-- > 0) {
                    r[i] = arr[i];
                }
                return origArraySliceApply(r, origArraySlice(arguments, 1));
            };
            arraySliceApply = function arraySliceApplyIE(arr, args) {
                return origArraySliceApply(arraySlice(arr), args);
            };
        }
    }
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);
    //
    // Array
    // =====
    //
    var isArray = $Array.isArray || function isArray(obj) {
        return toStr(obj) === '[object Array]';
    };
    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);
    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, { isArray: isArray });
    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
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
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);
    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });
                method.call([1], function () {
                    'use strict';
                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            }
            catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };
    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn /*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }
            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    }
                    else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));
    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn /*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }
            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    }
                    else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));
    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn /*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }
            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));
    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn /*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }
            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));
    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn /*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }
            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));
    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn /*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }
            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }
            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            }
            else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }
                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }
            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }
            return result;
        }
    }, !reduceCoercesToObject);
    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn /*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }
            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }
            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            }
            else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }
                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }
            if (i < 0) {
                return result;
            }
            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);
            return result;
        }
    }, !reduceRightCoercesToObject);
    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement /*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);
            if (length === 0) {
                return -1;
            }
            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }
            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);
    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement /*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);
            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);
    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);
    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                }
                else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);
            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }
            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    }
                    else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            }
            else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    }
                    else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;
            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);
    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    }
    catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }
    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }
    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };
    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);
    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, { push: pushShim }, pushUndefinedIsWeird);
    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);
    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
        }
        catch (e) {
            try {
                [1, 2].sort({});
            }
            catch (e2) {
                return false;
            }
        }
        return true;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        }
        catch (e) { }
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        }
        catch (e) { }
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);
    //
    // Object
    // ======
    //
    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({ 'toString': null }, 'toString'); // jscs:ignore disallowQuotedKeysInObjects
    var hasProtoEnumBug = isEnum(function () { }, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var excludedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true,
        $width: true,
        $height: true,
        $top: true,
        $localStorage: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!excludedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            }
            catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        }
        catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;
    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null
            && typeof value === 'object'
            && typeof value.length === 'number'
            && value.length >= 0
            && !isArray(value)
            && isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;
    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);
            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }
            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }
            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }
            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });
    var keysWorksWithArguments = $Object.keys && (function () {
        // Safari 5.0 bug
        return $Object.keys(arguments).length === 2;
    }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
        var argKeys = $Object.keys(arguments);
        return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
    }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            }
            else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);
    //
    // Date
    // ====
    //
    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    }
    else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-+]\d\d\d\d(?: |$)/).test(String(aPositiveTestDate));
    }
    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };
    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);
    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', '
                + (date < 10 ? '0' + date : date) + ' '
                + monthName[month] + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);
    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);
    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' '
                + monthName[month] + ' '
                + (date < 10 ? '0' + date : date) + ' '
                + year + ' '
                + (hour < 10 ? '0' + hour : hour) + ':'
                + (minute < 10 ? '0' + minute : minute) + ':'
                + (second < 10 ? '0' + second : second) + ' GMT'
                + (timezoneOffset > 0 ? '-' : '+')
                + (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset)
                + (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }
    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1; // eslint-disable-line max-len
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';
    var getTime = call.bind(Date.prototype.getTime);
    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = ((month % 12) + 12) % 12;
            // the date time string format is specified in 15.9.1.15.
            var result = [
                month + 1,
                originalGetUTCDate(this),
                originalGetUTCHours(this),
                originalGetUTCMinutes(this),
                originalGetUTCSeconds(this)
            ];
            year = ((year < 0 ? '-' : (year > 9999 ? '+' : ''))
                + strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6));
            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (year + '-' + arraySlice(result, 0, 2).join('-')
                + 'T' + arraySlice(result, 2).join(':') + '.'
                + strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z');
        }
    }, hasNegativeDateBug || hasSafari51DateBug);
    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON
                && new Date(NaN).toJSON() === null
                && new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1
                && Date.prototype.toJSON.call({
                    toISOString: function () { return true; }
                });
        }
        catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:
            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);
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
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        // eslint-disable-next-line no-implicit-globals, no-global-assign
        Date = (function (NativeDate) {
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y // isString(Y)
                        // We explicitly pass it through parse:
                        ? new NativeDate(DateShim.parse(Y))
                        // We have to manually make calls depending on argument
                        // length here
                        : length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis)
                            : length >= 6 ? new NativeDate(Y, M, D, h, m, seconds)
                                : length >= 5 ? new NativeDate(Y, M, D, h, m)
                                    : length >= 4 ? new NativeDate(Y, M, D, h)
                                        : length >= 3 ? new NativeDate(Y, M, D)
                                            : length >= 2 ? new NativeDate(Y, M)
                                                : length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y)
                                                    : new NativeDate();
                }
                else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, { constructor: DateShim }, true);
                }
                return date;
            };
            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^'
                + '(\\d{4}|[+-]\\d{6})' // four-digit year capture or sign + 6-digit extended year
                + '(?:-(\\d{2})' // optional month capture
                + '(?:-(\\d{2})' // optional day capture
                + '(?:' // capture hours:minutes:seconds.milliseconds
                + 'T(\\d{2})' // hours capture
                + ':(\\d{2})' // minutes capture
                + '(?:' // optional :seconds.milliseconds
                + ':(\\d{2})' // seconds capture
                + '(?:(\\.\\d{1,}))?' // milliseconds capture
                + ')?'
                + '(' // capture UTC offset component
                + 'Z|' // UTC capture
                + '(?:' // offset specifier +/-hours:minutes
                + '([-+])' // sign capture
                + '(\\d{2})' // hours offset capture
                + ':(\\d{2})' // minutes offset capture
                + ')'
                + ')?)?)?)?'
                + '$');
            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (months[month]
                    + Math.floor((year - 1969 + t) / 4)
                    - Math.floor((year - 1901 + t) / 100)
                    + Math.floor((year - 1601 + t) / 400)
                    + (365 * (year - 1970)));
            };
            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };
            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }
            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, { constructor: DateShim }, true);
            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]), month = $Number(match[2] || 1) - 1, day = $Number(match[3] || 1) - 1, hour = $Number(match[4] || 0), minute = $Number(match[5] || 0), second = $Number(match[6] || 0), millisecond = Math.floor($Number(match[7] || 0) * 1000), 
                    // When time zone is missed, local offset should be used
                    // (ES 5.1 bug)
                    // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                    isLocalTime = Boolean(match[4] && !match[8]), signOffset = match[9] === '-' ? 1 : -1, hourOffset = $Number(match[10] || 0), minuteOffset = $Number(match[11] || 0), result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25)
                        && minute < 60 && second < 60 && millisecond < 1000
                        && month > -1 && month < 12 && hourOffset < 24
                        && minuteOffset < 60 // detect invalid offsets
                        && day > -1
                        && day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))) {
                        result = (((dayFromMonth(year, month) + day) * 24)
                            + hour
                            + (hourOffset * signOffset)) * 60;
                        result = ((((result + minute + (minuteOffset * signOffset)) * 60)
                            + second) * 1000) + millisecond;
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
            defineProperties(DateShim, { parse: parseShim });
            return DateShim;
        }(Date));
        /* global Date: false */
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
    var hasToFixedBugs = NumberPrototype.toFixed && ((0.00008).toFixed(3) !== '0.000'
        || (0.9).toFixed(0) !== '1'
        || (1.255).toFixed(2) !== '1.25'
        || (1000000000000000128).toFixed(0) !== '1000000000000000128');
    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    }
                    else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };
    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;
        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);
        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }
        x = $Number(this);
        if (isActualNaN(x)) {
            return 'NaN';
        }
        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }
        s = '';
        if (x < 0) {
            s = '-';
            x = -x;
        }
        m = '0';
        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;
            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;
                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }
                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;
                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }
                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            }
            else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }
        if (f > 0) {
            k = m.length;
            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            }
            else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        }
        else {
            m = s + m;
        }
        return m;
    };
    defineProperties(NumberPrototype, { toFixed: toFixedShim }, hasToFixedBugs);
    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        }
        catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);
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
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]
    if ('ab'.split(/(?:ab)*/).length !== 2
        || '.'.split(/(.?)(.?)/).length !== 4
        || 'tesst'.split(/(s)*/)[1] === 't'
        || 'test'.split(/(?:)/, -1).length !== 4
        || ''.split(/.?/).length
        || '.'.split(/()()/).length > 1) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;
            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }
                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }
                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '')
                    + (separator.multiline ? 'm' : '')
                    + (separator.unicode ? 'u' : '') // in ES6
                    + (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                lastLastIndex = 0, 
                // Make `global` and avoid `lastIndex` issues by working with a copy
                separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                }
                else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());
        // [bugfix, chrome]
        // If separator is undefined, then the result array contains just one String,
        // which is the this value (converted to a String). If limit is not undefined,
        // then the output array is truncated so that it contains no more than limit
        // elements.
        // "0".split(undefined, 0) -> []
    }
    else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }
    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());
    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            }
            else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
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
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);
    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003'
        + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028'
        + '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);
    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abcあい'.lastIndexOf('あい', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);
    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);
    // ES-5 15.1.2.2
    // eslint-disable-next-line radix
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[-+]?0[xX]/;
            return function parseInt(str, radix) {
                if (typeof str === 'symbol') {
                    // handle Symbols in node 8.3/8.4
                    // eslint-disable-next-line no-implicit-coercion, no-unused-expressions
                    '' + str; // jscs:ignore disallowImplicitTypeConversion
                }
                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }
    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }
    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            }
            else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            }
            else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }
    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }
    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));
(function () {
    var registeredObjects = [];
    var handlers = [];
    var trigger = function (objectIndex, eventName, params) {
        var obj = registeredObjects[objectIndex];
        handlers[objectIndex][eventName].forEach(function (x) {
            x.call(obj, params);
        });
    };
    ActiveXObject.on = function (obj, eventName, parameterNames, handler) {
        if (Object.prototype.toString.call(parameterNames) !== '[object Array]') {
            //parameterNames is an optional argument
            handler = parameterNames;
            parameterNames = [];
        }
        var objectIndex = registeredObjects.indexOf(obj);
        if (objectIndex == -1) {
            registeredObjects.push(obj);
            objectIndex = registeredObjects.length - 1;
            handlers[objectIndex] = {};
        }
        if (handlers[objectIndex][eventName] === undefined) { //explicit check against undefined, because it might be an empty array
            var def = "function obj::" + eventName + " (" + parameterNames.join(', ') + ") {" +
                "var params = { " +
                parameterNames.map(function (x) {
                    return x + ':' + x;
                }).join(',') +
                " };" +
                "trigger( " + objectIndex + ", '" + eventName + "', params);" +
                parameterNames.map(function (x) {
                    return "if ( " + x + " !== params." + x + " ) " + x + " = params." + x + ";";
                }).join('\n') +
                "};";
            eval(def);
            handlers[objectIndex][eventName] = [];
        }
        handlers[objectIndex][eventName].push(handler);
    };
    ActiveXObject.off = function (obj, eventName, handler) {
        if (!obj) {
            registeredObjects.forEach(function (x) {
                ActiveXObject.off(x);
            });
            registeredObjects = [];
            return;
        }
        var objectIndex = registeredObjects.indexOf(obj);
        var handlersObject = handlers[objectIndex];
        if (!eventName) {
            Object.keys(handlersObject).forEach(function (x) {
                ActiveXObject.off(obj, x);
            });
            registeredObjects[objectIndex] = undefined;
            return;
        }
        if (!handler) {
            handlersObject[eventName] = [];
            return;
        }
        var handlerIndex = handlersObject[eventName].indexOf(handler);
        while (handlerIndex > -1) {
            handlersObject[eventName][handlerIndex] = undefined;
            handlerIndex = handlersObject[eventName].indexOf(handler);
        }
    };
    ActiveXObject.hasRegisteredObjects = function () {
        return registeredObjects.length > 0;
    };
    ActiveXObject.set = function (obj, propertyName, parameters, newValue) {
        var parameterString = parameters.map(function (x, index) {
            return 'parameters[' + index + ']';
        }).join(', ');
        eval('obj.' + propertyName + '(' + parameterString + ') = newValue');
    };
})();
WScript.Echo('Hello, world');
WScript.Echo(ActiveXObject.on);
WScript.Echo([].forEach);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiJEOi9aZXYvUHJvamVjdHMvdHMtY3NjcmlwdC1kZWJ1Z2dlci8iLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9lczUtc2hpbS9lczUtc2hpbS5qcyIsIm5vZGVfbW9kdWxlcy9hY3RpdmV4LWhlbHBlcnMvYWN0aXZleC1qcy1oZWxwZXJzLmpzIiwidGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7R0FJRztBQUVILGlDQUFpQztBQUVqQyxvRkFBb0Y7QUFDcEYsQ0FBQztBQUVELG9DQUFvQztBQUNwQywwRUFBMEU7QUFDMUUsQ0FBQyxVQUFVLElBQUksRUFBRSxPQUFPO0lBQ3BCLFlBQVksQ0FBQztJQUViLG9DQUFvQztJQUNwQyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFO1FBQzVDLHdDQUF3QztRQUN4QyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbkI7U0FBTSxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsRUFBRTtRQUNwQyxnREFBZ0Q7UUFDaEQsOERBQThEO1FBQzlELGFBQWE7UUFDYixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sRUFBRSxDQUFDO0tBQzlCO1NBQU07UUFDSCxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxPQUFPLEVBQUUsQ0FBQztLQUNsQztBQUNMLENBQUMsQ0FBQyxJQUFJLEVBQUU7SUFDSjs7Ozs7OztPQU9HO0lBRUgsdUVBQXVFO0lBQ3ZFLGdGQUFnRjtJQUNoRixhQUFhO0lBQ2IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ25CLElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDdEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLElBQUksZUFBZSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDeEMsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDO0lBQ3pC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QUFLO1lBQ25ELE9BQU8sYUFBYSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxZQUFZLEdBQUcsR0FBRyxHQUFHLGVBQWUsR0FBRyxjQUFjLENBQUMsQ0FBQztJQUN6RSxDQUFDLENBQUM7QUFDTixDQUFDLENBQUMsRUFBRSxDQUFDO0FDbkZMLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbVxuICogQGxpY2Vuc2UgZXM1LXNoaW0gQ29weXJpZ2h0IDIwMDktMjAxNSBieSBjb250cmlidXRvcnMsIE1JVCBMaWNlbnNlXG4gKiBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG4vLyB2aW06IHRzPTQgc3RzPTQgc3c9NCBleHBhbmR0YWJcblxuLy8gQWRkIHNlbWljb2xvbiB0byBwcmV2ZW50IElJRkUgZnJvbSBiZWluZyBwYXNzZWQgYXMgYXJndW1lbnQgdG8gY29uY2F0ZW5hdGVkIGNvZGUuXG47XG5cbi8vIFVNRCAoVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uKVxuLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS91bWRqcy91bWQvYmxvYi9tYXN0ZXIvdGVtcGxhdGVzL3JldHVybkV4cG9ydHMuanNcbihmdW5jdGlvbiAocm9vdCwgZmFjdG9yeSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qIGdsb2JhbCBkZWZpbmUsIGV4cG9ydHMsIG1vZHVsZSAqL1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgLy8gQU1ELiBSZWdpc3RlciBhcyBhbiBhbm9ueW1vdXMgbW9kdWxlLlxuICAgICAgICBkZWZpbmUoZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgLy8gTm9kZS4gRG9lcyBub3Qgd29yayB3aXRoIHN0cmljdCBDb21tb25KUywgYnV0XG4gICAgICAgIC8vIG9ubHkgQ29tbW9uSlMtbGlrZSBlbnZpcm9tZW50cyB0aGF0IHN1cHBvcnQgbW9kdWxlLmV4cG9ydHMsXG4gICAgICAgIC8vIGxpa2UgTm9kZS5cbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQnJvd3NlciBnbG9iYWxzIChyb290IGlzIHdpbmRvdylcbiAgICAgICAgcm9vdC5yZXR1cm5FeHBvcnRzID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgIC8qKlxuICAgICAqIEJyaW5ncyBhbiBlbnZpcm9ubWVudCBhcyBjbG9zZSB0byBFQ01BU2NyaXB0IDUgY29tcGxpYW5jZVxuICAgICAqIGFzIGlzIHBvc3NpYmxlIHdpdGggdGhlIGZhY2lsaXRpZXMgb2YgZXJzdHdoaWxlIGVuZ2luZXMuXG4gICAgICpcbiAgICAgKiBBbm5vdGF0ZWQgRVM1OiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vIChzcGVjaWZpYyBsaW5rcyBiZWxvdylcbiAgICAgKiBFUzUgU3BlYzogaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL3B1YmxpY2F0aW9ucy9maWxlcy9FQ01BLVNUL0VjbWEtMjYyLnBkZlxuICAgICAqIFJlcXVpcmVkIHJlYWRpbmc6IGh0dHA6Ly9qYXZhc2NyaXB0d2VibG9nLndvcmRwcmVzcy5jb20vMjAxMS8xMi8wNS9leHRlbmRpbmctamF2YXNjcmlwdC1uYXRpdmVzL1xuICAgICAqL1xuXG4gICAgLy8gU2hvcnRjdXQgdG8gYW4gb2Z0ZW4gYWNjZXNzZWQgcHJvcGVydGllcywgaW4gb3JkZXIgdG8gYXZvaWQgbXVsdGlwbGVcbiAgICAvLyBkZXJlZmVyZW5jZSB0aGF0IGNvc3RzIHVuaXZlcnNhbGx5LiBUaGlzIGFsc28gaG9sZHMgYSByZWZlcmVuY2UgdG8ga25vd24tZ29vZFxuICAgIC8vIGZ1bmN0aW9ucy5cbiAgICB2YXIgJEFycmF5ID0gQXJyYXk7XG4gICAgdmFyIEFycmF5UHJvdG90eXBlID0gJEFycmF5LnByb3RvdHlwZTtcbiAgICB2YXIgJE9iamVjdCA9IE9iamVjdDtcbiAgICB2YXIgT2JqZWN0UHJvdG90eXBlID0gJE9iamVjdC5wcm90b3R5cGU7XG4gICAgdmFyICRGdW5jdGlvbiA9IEZ1bmN0aW9uO1xuICAgIHZhciBGdW5jdGlvblByb3RvdHlwZSA9ICRGdW5jdGlvbi5wcm90b3R5cGU7XG4gICAgdmFyICRTdHJpbmcgPSBTdHJpbmc7XG4gICAgdmFyIFN0cmluZ1Byb3RvdHlwZSA9ICRTdHJpbmcucHJvdG90eXBlO1xuICAgIHZhciAkTnVtYmVyID0gTnVtYmVyO1xuICAgIHZhciBOdW1iZXJQcm90b3R5cGUgPSAkTnVtYmVyLnByb3RvdHlwZTtcbiAgICB2YXIgYXJyYXlfc2xpY2UgPSBBcnJheVByb3RvdHlwZS5zbGljZTtcbiAgICB2YXIgYXJyYXlfc3BsaWNlID0gQXJyYXlQcm90b3R5cGUuc3BsaWNlO1xuICAgIHZhciBhcnJheV9wdXNoID0gQXJyYXlQcm90b3R5cGUucHVzaDtcbiAgICB2YXIgYXJyYXlfdW5zaGlmdCA9IEFycmF5UHJvdG90eXBlLnVuc2hpZnQ7XG4gICAgdmFyIGFycmF5X2NvbmNhdCA9IEFycmF5UHJvdG90eXBlLmNvbmNhdDtcbiAgICB2YXIgYXJyYXlfam9pbiA9IEFycmF5UHJvdG90eXBlLmpvaW47XG4gICAgdmFyIGNhbGwgPSBGdW5jdGlvblByb3RvdHlwZS5jYWxsO1xuICAgIHZhciBhcHBseSA9IEZ1bmN0aW9uUHJvdG90eXBlLmFwcGx5O1xuICAgIHZhciBtYXggPSBNYXRoLm1heDtcbiAgICB2YXIgbWluID0gTWF0aC5taW47XG5cbiAgICAvLyBIYXZpbmcgYSB0b1N0cmluZyBsb2NhbCB2YXJpYWJsZSBuYW1lIGJyZWFrcyBpbiBPcGVyYSBzbyB1c2UgdG9fc3RyaW5nLlxuICAgIHZhciB0b19zdHJpbmcgPSBPYmplY3RQcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgICAvKiBnbG9iYWwgU3ltYm9sICovXG4gICAgLyogZXNsaW50LWRpc2FibGUgb25lLXZhci1kZWNsYXJhdGlvbi1wZXItbGluZSwgbm8tcmVkZWNsYXJlLCBtYXgtc3RhdGVtZW50cy1wZXItbGluZSAqL1xuICAgIHZhciBoYXNUb1N0cmluZ1RhZyA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFN5bWJvbC50b1N0cmluZ1RhZyA9PT0gJ3N5bWJvbCc7XG4gICAgdmFyIGlzQ2FsbGFibGU7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1jYWxsYWJsZSAqLyB2YXIgZm5Ub1N0ciA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZywgY29uc3RydWN0b3JSZWdleCA9IC9eXFxzKmNsYXNzIC8sIGlzRVM2Q2xhc3NGbiA9IGZ1bmN0aW9uIGlzRVM2Q2xhc3NGbih2YWx1ZSkgeyB0cnkgeyB2YXIgZm5TdHIgPSBmblRvU3RyLmNhbGwodmFsdWUpOyB2YXIgc2luZ2xlU3RyaXBwZWQgPSBmblN0ci5yZXBsYWNlKC9cXC9cXC8uKlxcbi9nLCAnJyk7IHZhciBtdWx0aVN0cmlwcGVkID0gc2luZ2xlU3RyaXBwZWQucmVwbGFjZSgvXFwvXFwqWy5cXHNcXFNdKlxcKlxcLy9nLCAnJyk7IHZhciBzcGFjZVN0cmlwcGVkID0gbXVsdGlTdHJpcHBlZC5yZXBsYWNlKC9cXG4vbWcsICcgJykucmVwbGFjZSgvIHsyfS9nLCAnICcpOyByZXR1cm4gY29uc3RydWN0b3JSZWdleC50ZXN0KHNwYWNlU3RyaXBwZWQpOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgLyogbm90IGEgZnVuY3Rpb24gKi8gfSB9LCB0cnlGdW5jdGlvbk9iamVjdCA9IGZ1bmN0aW9uIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKSB7IHRyeSB7IGlmIChpc0VTNkNsYXNzRm4odmFsdWUpKSB7IHJldHVybiBmYWxzZTsgfSBmblRvU3RyLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgZm5DbGFzcyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsIGdlbkNsYXNzID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJywgaXNDYWxsYWJsZSA9IGZ1bmN0aW9uIGlzQ2FsbGFibGUodmFsdWUpIHsgaWYgKCF2YWx1ZSkgeyByZXR1cm4gZmFsc2U7IH0gaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfSBpZiAoaGFzVG9TdHJpbmdUYWcpIHsgcmV0dXJuIHRyeUZ1bmN0aW9uT2JqZWN0KHZhbHVlKTsgfSBpZiAoaXNFUzZDbGFzc0ZuKHZhbHVlKSkgeyByZXR1cm4gZmFsc2U7IH0gdmFyIHN0ckNsYXNzID0gdG9fc3RyaW5nLmNhbGwodmFsdWUpOyByZXR1cm4gc3RyQ2xhc3MgPT09IGZuQ2xhc3MgfHwgc3RyQ2xhc3MgPT09IGdlbkNsYXNzOyB9O1xuXG4gICAgdmFyIGlzUmVnZXg7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1yZWdleCAqLyB2YXIgcmVnZXhFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjLCB0cnlSZWdleEV4ZWMgPSBmdW5jdGlvbiB0cnlSZWdleEV4ZWModmFsdWUpIHsgdHJ5IHsgcmVnZXhFeGVjLmNhbGwodmFsdWUpOyByZXR1cm4gdHJ1ZTsgfSBjYXRjaCAoZSkgeyByZXR1cm4gZmFsc2U7IH0gfSwgcmVnZXhDbGFzcyA9ICdbb2JqZWN0IFJlZ0V4cF0nOyBpc1JlZ2V4ID0gZnVuY3Rpb24gaXNSZWdleCh2YWx1ZSkgeyBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgeyByZXR1cm4gZmFsc2U7IH0gcmV0dXJuIGhhc1RvU3RyaW5nVGFnID8gdHJ5UmVnZXhFeGVjKHZhbHVlKSA6IHRvX3N0cmluZy5jYWxsKHZhbHVlKSA9PT0gcmVnZXhDbGFzczsgfTtcbiAgICB2YXIgaXNTdHJpbmc7IC8qIGlubGluZWQgZnJvbSBodHRwczovL25wbWpzLmNvbS9pcy1zdHJpbmcgKi8gdmFyIHN0clZhbHVlID0gU3RyaW5nLnByb3RvdHlwZS52YWx1ZU9mLCB0cnlTdHJpbmdPYmplY3QgPSBmdW5jdGlvbiB0cnlTdHJpbmdPYmplY3QodmFsdWUpIHsgdHJ5IHsgc3RyVmFsdWUuY2FsbCh2YWx1ZSk7IHJldHVybiB0cnVlOyB9IGNhdGNoIChlKSB7IHJldHVybiBmYWxzZTsgfSB9LCBzdHJpbmdDbGFzcyA9ICdbb2JqZWN0IFN0cmluZ10nOyBpc1N0cmluZyA9IGZ1bmN0aW9uIGlzU3RyaW5nKHZhbHVlKSB7IGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7IHJldHVybiB0cnVlOyB9IGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7IHJldHVybiBmYWxzZTsgfSByZXR1cm4gaGFzVG9TdHJpbmdUYWcgPyB0cnlTdHJpbmdPYmplY3QodmFsdWUpIDogdG9fc3RyaW5nLmNhbGwodmFsdWUpID09PSBzdHJpbmdDbGFzczsgfTtcbiAgICAvKiBlc2xpbnQtZW5hYmxlIG9uZS12YXItZGVjbGFyYXRpb24tcGVyLWxpbmUsIG5vLXJlZGVjbGFyZSwgbWF4LXN0YXRlbWVudHMtcGVyLWxpbmUgKi9cblxuICAgIC8qIGlubGluZWQgZnJvbSBodHRwOi8vbnBtanMuY29tL2RlZmluZS1wcm9wZXJ0aWVzICovXG4gICAgdmFyIHN1cHBvcnRzRGVzY3JpcHRvcnMgPSAkT2JqZWN0LmRlZmluZVByb3BlcnR5ICYmIChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICB2YXIgb2JqID0ge307XG4gICAgICAgICAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgJ3gnLCB7IGVudW1lcmFibGU6IGZhbHNlLCB2YWx1ZTogb2JqIH0pO1xuICAgICAgICAgICAgZm9yICh2YXIgXyBpbiBvYmopIHsgLy8ganNjczppZ25vcmUgZGlzYWxsb3dVbnVzZWRWYXJpYWJsZXNcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb2JqLnggPT09IG9iajtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyAvKiB0aGlzIGlzIEVTMyAqL1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICB2YXIgZGVmaW5lUHJvcGVydGllcyA9IChmdW5jdGlvbiAoaGFzKSB7XG4gICAgICAgIC8vIERlZmluZSBjb25maWd1cmFibGUsIHdyaXRhYmxlLCBhbmQgbm9uLWVudW1lcmFibGUgcHJvcHNcbiAgICAgICAgLy8gaWYgdGhleSBkb24ndCBleGlzdC5cbiAgICAgICAgdmFyIGRlZmluZVByb3BlcnR5O1xuICAgICAgICBpZiAoc3VwcG9ydHNEZXNjcmlwdG9ycykge1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lLCBtZXRob2QsIGZvcmNlQXNzaWduKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFmb3JjZUFzc2lnbiAmJiAobmFtZSBpbiBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBtZXRob2RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWUsIG1ldGhvZCwgZm9yY2VBc3NpZ24pIHtcbiAgICAgICAgICAgICAgICBpZiAoIWZvcmNlQXNzaWduICYmIChuYW1lIGluIG9iamVjdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3RbbmFtZV0gPSBtZXRob2Q7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKG9iamVjdCwgbWFwLCBmb3JjZUFzc2lnbikge1xuICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBtYXApIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzLmNhbGwobWFwLCBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICBkZWZpbmVQcm9wZXJ0eShvYmplY3QsIG5hbWUsIG1hcFtuYW1lXSwgZm9yY2VBc3NpZ24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KE9iamVjdFByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSkpO1xuXG4gICAgLy9cbiAgICAvLyBVdGlsXG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCAvaGVscGVycy9pc1ByaW1pdGl2ZSAqL1xuICAgIHZhciBpc1ByaW1pdGl2ZSA9IGZ1bmN0aW9uIGlzUHJpbWl0aXZlKGlucHV0KSB7XG4gICAgICAgIHZhciB0eXBlID0gdHlwZW9mIGlucHV0O1xuICAgICAgICByZXR1cm4gaW5wdXQgPT09IG51bGwgfHwgKHR5cGUgIT09ICdvYmplY3QnICYmIHR5cGUgIT09ICdmdW5jdGlvbicpO1xuICAgIH07XG5cbiAgICB2YXIgaXNBY3R1YWxOYU4gPSAkTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIGlzQWN0dWFsTmFOKHgpIHtcbiAgICAgICAgcmV0dXJuIHggIT09IHg7XG4gICAgfTtcblxuICAgIHZhciBFUyA9IHtcbiAgICAgICAgLy8gRVM1IDkuNFxuICAgICAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjRcbiAgICAgICAgLy8gaHR0cDovL2pzcGVyZi5jb20vdG8taW50ZWdlclxuICAgICAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvSW50ZWdlciAqL1xuICAgICAgICBUb0ludGVnZXI6IGZ1bmN0aW9uIFRvSW50ZWdlcihudW0pIHtcbiAgICAgICAgICAgIHZhciBuID0gK251bTtcbiAgICAgICAgICAgIGlmIChpc0FjdHVhbE5hTihuKSkge1xuICAgICAgICAgICAgICAgIG4gPSAwO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuICE9PSAwICYmIG4gIT09ICgxIC8gMCkgJiYgbiAhPT0gLSgxIC8gMCkpIHtcbiAgICAgICAgICAgICAgICBuID0gKG4gPiAwIHx8IC0xKSAqIE1hdGguZmxvb3IoTWF0aC5hYnMobikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG47XG4gICAgICAgIH0sXG5cbiAgICAgICAgLyogcmVwbGFjZWFibGUgd2l0aCBodHRwczovL25wbWpzLmNvbS9wYWNrYWdlL2VzLWFic3RyYWN0IEVTNS5Ub1ByaW1pdGl2ZSAqL1xuICAgICAgICBUb1ByaW1pdGl2ZTogZnVuY3Rpb24gVG9QcmltaXRpdmUoaW5wdXQpIHtcbiAgICAgICAgICAgIHZhciB2YWwsIHZhbHVlT2YsIHRvU3RyO1xuICAgICAgICAgICAgaWYgKGlzUHJpbWl0aXZlKGlucHV0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnB1dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhbHVlT2YgPSBpbnB1dC52YWx1ZU9mO1xuICAgICAgICAgICAgaWYgKGlzQ2FsbGFibGUodmFsdWVPZikpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB2YWx1ZU9mLmNhbGwoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG9TdHIgPSBpbnB1dC50b1N0cmluZztcbiAgICAgICAgICAgIGlmIChpc0NhbGxhYmxlKHRvU3RyKSkge1xuICAgICAgICAgICAgICAgIHZhbCA9IHRvU3RyLmNhbGwoaW5wdXQpO1xuICAgICAgICAgICAgICAgIGlmIChpc1ByaW1pdGl2ZSh2YWwpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIEVTNSA5LjlcbiAgICAgICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4OS45XG4gICAgICAgIC8qIHJlcGxhY2VhYmxlIHdpdGggaHR0cHM6Ly9ucG1qcy5jb20vcGFja2FnZS9lcy1hYnN0cmFjdCBFUzUuVG9PYmplY3QgKi9cbiAgICAgICAgVG9PYmplY3Q6IGZ1bmN0aW9uIChvKSB7XG4gICAgICAgICAgICBpZiAobyA9PSBudWxsKSB7IC8vIHRoaXMgbWF0Y2hlcyBib3RoIG51bGwgYW5kIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgbyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gJE9iamVjdChvKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvKiByZXBsYWNlYWJsZSB3aXRoIGh0dHBzOi8vbnBtanMuY29tL3BhY2thZ2UvZXMtYWJzdHJhY3QgRVM1LlRvVWludDMyICovXG4gICAgICAgIFRvVWludDMyOiBmdW5jdGlvbiBUb1VpbnQzMih4KSB7XG4gICAgICAgICAgICByZXR1cm4geCA+Pj4gMDtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvL1xuICAgIC8vIEZ1bmN0aW9uXG4gICAgLy8gPT09PT09PT1cbiAgICAvL1xuXG4gICAgLy8gRVMtNSAxNS4zLjQuNVxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjMuNC41XG5cbiAgICB2YXIgRW1wdHkgPSBmdW5jdGlvbiBFbXB0eSgpIHt9O1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhGdW5jdGlvblByb3RvdHlwZSwge1xuICAgICAgICBiaW5kOiBmdW5jdGlvbiBiaW5kKHRoYXQpIHsgLy8gLmxlbmd0aCBpcyAxXG4gICAgICAgICAgICAvLyAxLiBMZXQgVGFyZ2V0IGJlIHRoZSB0aGlzIHZhbHVlLlxuICAgICAgICAgICAgdmFyIHRhcmdldCA9IHRoaXM7XG4gICAgICAgICAgICAvLyAyLiBJZiBJc0NhbGxhYmxlKFRhcmdldCkgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi5cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgY2FsbGVkIG9uIGluY29tcGF0aWJsZSAnICsgdGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDMuIExldCBBIGJlIGEgbmV3IChwb3NzaWJseSBlbXB0eSkgaW50ZXJuYWwgbGlzdCBvZiBhbGwgb2YgdGhlXG4gICAgICAgICAgICAvLyAgIGFyZ3VtZW50IHZhbHVlcyBwcm92aWRlZCBhZnRlciB0aGlzQXJnIChhcmcxLCBhcmcyIGV0YyksIGluIG9yZGVyLlxuICAgICAgICAgICAgLy8gWFhYIHNsaWNlZEFyZ3Mgd2lsbCBzdGFuZCBpbiBmb3IgXCJBXCIgaWYgdXNlZFxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7IC8vIGZvciBub3JtYWwgY2FsbFxuICAgICAgICAgICAgLy8gNC4gTGV0IEYgYmUgYSBuZXcgbmF0aXZlIEVDTUFTY3JpcHQgb2JqZWN0LlxuICAgICAgICAgICAgLy8gMTEuIFNldCB0aGUgW1tQcm90b3R5cGVdXSBpbnRlcm5hbCBwcm9wZXJ0eSBvZiBGIHRvIHRoZSBzdGFuZGFyZFxuICAgICAgICAgICAgLy8gICBidWlsdC1pbiBGdW5jdGlvbiBwcm90b3R5cGUgb2JqZWN0IGFzIHNwZWNpZmllZCBpbiAxNS4zLjMuMS5cbiAgICAgICAgICAgIC8vIDEyLiBTZXQgdGhlIFtbQ2FsbF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgICAvLyAgIDE1LjMuNC41LjEuXG4gICAgICAgICAgICAvLyAxMy4gU2V0IHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIHByb3BlcnR5IG9mIEYgYXMgZGVzY3JpYmVkIGluXG4gICAgICAgICAgICAvLyAgIDE1LjMuNC41LjIuXG4gICAgICAgICAgICAvLyAxNC4gU2V0IHRoZSBbW0hhc0luc3RhbmNlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiBhcyBkZXNjcmliZWQgaW5cbiAgICAgICAgICAgIC8vICAgMTUuMy40LjUuMy5cbiAgICAgICAgICAgIHZhciBib3VuZDtcbiAgICAgICAgICAgIHZhciBiaW5kZXIgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIGJvdW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIDE1LjMuNC41LjIgW1tDb25zdHJ1Y3RdXVxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsIG1ldGhvZCBvZiBhIGZ1bmN0aW9uIG9iamVjdCxcbiAgICAgICAgICAgICAgICAgICAgLy8gRiB0aGF0IHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gbGlzdCBvZiBhcmd1bWVudHMgRXh0cmFBcmdzLCB0aGUgZm9sbG93aW5nIHN0ZXBzIGFyZSB0YWtlbjpcbiAgICAgICAgICAgICAgICAgICAgLy8gMS4gTGV0IHRhcmdldCBiZSB0aGUgdmFsdWUgb2YgRidzIFtbVGFyZ2V0RnVuY3Rpb25dXVxuICAgICAgICAgICAgICAgICAgICAvLyAgIGludGVybmFsIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBJZiB0YXJnZXQgaGFzIG5vIFtbQ29uc3RydWN0XV0gaW50ZXJuYWwgbWV0aG9kLCBhXG4gICAgICAgICAgICAgICAgICAgIC8vICAgVHlwZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgICAgICAgICAgICAgICAgIC8vIDMuIExldCBib3VuZEFyZ3MgYmUgdGhlIHZhbHVlIG9mIEYncyBbW0JvdW5kQXJnc11dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NvbnN0cnVjdF1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbWV0aG9kIG9mIHRhcmdldCBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBhcHBseS5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCRPYmplY3QocmVzdWx0KSA9PT0gcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gMTUuMy40LjUuMSBbW0NhbGxdXVxuICAgICAgICAgICAgICAgICAgICAvLyBXaGVuIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2YgYSBmdW5jdGlvbiBvYmplY3QsIEYsXG4gICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdhcyBjcmVhdGVkIHVzaW5nIHRoZSBiaW5kIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhpcyB2YWx1ZSBhbmQgYSBsaXN0IG9mIGFyZ3VtZW50cyBFeHRyYUFyZ3MsIHRoZSBmb2xsb3dpbmdcbiAgICAgICAgICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuICAgICAgICAgICAgICAgICAgICAvLyAxLiBMZXQgYm91bmRBcmdzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZEFyZ3NdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAyLiBMZXQgYm91bmRUaGlzIGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tCb3VuZFRoaXNdXSBpbnRlcm5hbFxuICAgICAgICAgICAgICAgICAgICAvLyAgIHByb3BlcnR5LlxuICAgICAgICAgICAgICAgICAgICAvLyAzLiBMZXQgdGFyZ2V0IGJlIHRoZSB2YWx1ZSBvZiBGJ3MgW1tUYXJnZXRGdW5jdGlvbl1dIGludGVybmFsXG4gICAgICAgICAgICAgICAgICAgIC8vICAgcHJvcGVydHkuXG4gICAgICAgICAgICAgICAgICAgIC8vIDQuIExldCBhcmdzIGJlIGEgbmV3IGxpc3QgY29udGFpbmluZyB0aGUgc2FtZSB2YWx1ZXMgYXMgdGhlXG4gICAgICAgICAgICAgICAgICAgIC8vICAgbGlzdCBib3VuZEFyZ3MgaW4gdGhlIHNhbWUgb3JkZXIgZm9sbG93ZWQgYnkgdGhlIHNhbWVcbiAgICAgICAgICAgICAgICAgICAgLy8gICB2YWx1ZXMgYXMgdGhlIGxpc3QgRXh0cmFBcmdzIGluIHRoZSBzYW1lIG9yZGVyLlxuICAgICAgICAgICAgICAgICAgICAvLyA1LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgLy8gICBvZiB0YXJnZXQgcHJvdmlkaW5nIGJvdW5kVGhpcyBhcyB0aGUgdGhpcyB2YWx1ZSBhbmRcbiAgICAgICAgICAgICAgICAgICAgLy8gICBwcm92aWRpbmcgYXJncyBhcyB0aGUgYXJndW1lbnRzLlxuXG4gICAgICAgICAgICAgICAgICAgIC8vIGVxdWl2OiB0YXJnZXQuY2FsbCh0aGlzLCAuLi5ib3VuZEFyZ3MsIC4uLmFyZ3MpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBhcHBseS5jYWxsKFxuICAgICAgICAgICAgICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X2NvbmNhdC5jYWxsKGFyZ3MsIGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKSlcbiAgICAgICAgICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gMTUuIElmIHRoZSBbW0NsYXNzXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgVGFyZ2V0IGlzIFwiRnVuY3Rpb25cIiwgdGhlblxuICAgICAgICAgICAgLy8gICAgIGEuIExldCBMIGJlIHRoZSBsZW5ndGggcHJvcGVydHkgb2YgVGFyZ2V0IG1pbnVzIHRoZSBsZW5ndGggb2YgQS5cbiAgICAgICAgICAgIC8vICAgICBiLiBTZXQgdGhlIGxlbmd0aCBvd24gcHJvcGVydHkgb2YgRiB0byBlaXRoZXIgMCBvciBMLCB3aGljaGV2ZXIgaXNcbiAgICAgICAgICAgIC8vICAgICAgIGxhcmdlci5cbiAgICAgICAgICAgIC8vIDE2LiBFbHNlIHNldCB0aGUgbGVuZ3RoIG93biBwcm9wZXJ0eSBvZiBGIHRvIDAuXG5cbiAgICAgICAgICAgIHZhciBib3VuZExlbmd0aCA9IG1heCgwLCB0YXJnZXQubGVuZ3RoIC0gYXJncy5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyAxNy4gU2V0IHRoZSBhdHRyaWJ1dGVzIG9mIHRoZSBsZW5ndGggb3duIHByb3BlcnR5IG9mIEYgdG8gdGhlIHZhbHVlc1xuICAgICAgICAgICAgLy8gICBzcGVjaWZpZWQgaW4gMTUuMy41LjEuXG4gICAgICAgICAgICB2YXIgYm91bmRBcmdzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJvdW5kTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnJheV9wdXNoLmNhbGwoYm91bmRBcmdzLCAnJCcgKyBpKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gWFhYIEJ1aWxkIGEgZHluYW1pYyBmdW5jdGlvbiB3aXRoIGRlc2lyZWQgYW1vdW50IG9mIGFyZ3VtZW50cyBpcyB0aGUgb25seVxuICAgICAgICAgICAgLy8gd2F5IHRvIHNldCB0aGUgbGVuZ3RoIHByb3BlcnR5IG9mIGEgZnVuY3Rpb24uXG4gICAgICAgICAgICAvLyBJbiBlbnZpcm9ubWVudHMgd2hlcmUgQ29udGVudCBTZWN1cml0eSBQb2xpY2llcyBlbmFibGVkIChDaHJvbWUgZXh0ZW5zaW9ucyxcbiAgICAgICAgICAgIC8vIGZvciBleC4pIGFsbCB1c2Ugb2YgZXZhbCBvciBGdW5jdGlvbiBjb3N0cnVjdG9yIHRocm93cyBhbiBleGNlcHRpb24uXG4gICAgICAgICAgICAvLyBIb3dldmVyIGluIGFsbCBvZiB0aGVzZSBlbnZpcm9ubWVudHMgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgZXhpc3RzXG4gICAgICAgICAgICAvLyBhbmQgc28gdGhpcyBjb2RlIHdpbGwgbmV2ZXIgYmUgZXhlY3V0ZWQuXG4gICAgICAgICAgICBib3VuZCA9ICRGdW5jdGlvbignYmluZGVyJywgJ3JldHVybiBmdW5jdGlvbiAoJyArIGFycmF5X2pvaW4uY2FsbChib3VuZEFyZ3MsICcsJykgKyAnKXsgcmV0dXJuIGJpbmRlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9JykoYmluZGVyKTtcblxuICAgICAgICAgICAgaWYgKHRhcmdldC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgICAgICBFbXB0eS5wcm90b3R5cGUgPSB0YXJnZXQucHJvdG90eXBlO1xuICAgICAgICAgICAgICAgIGJvdW5kLnByb3RvdHlwZSA9IG5ldyBFbXB0eSgpO1xuICAgICAgICAgICAgICAgIC8vIENsZWFuIHVwIGRhbmdsaW5nIHJlZmVyZW5jZXMuXG4gICAgICAgICAgICAgICAgRW1wdHkucHJvdG90eXBlID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gVE9ET1xuICAgICAgICAgICAgLy8gMTguIFNldCB0aGUgW1tFeHRlbnNpYmxlXV0gaW50ZXJuYWwgcHJvcGVydHkgb2YgRiB0byB0cnVlLlxuXG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyAxOS4gTGV0IHRocm93ZXIgYmUgdGhlIFtbVGhyb3dUeXBlRXJyb3JdXSBmdW5jdGlvbiBPYmplY3QgKDEzLjIuMykuXG4gICAgICAgICAgICAvLyAyMC4gQ2FsbCB0aGUgW1tEZWZpbmVPd25Qcm9wZXJ0eV1dIGludGVybmFsIG1ldGhvZCBvZiBGIHdpdGhcbiAgICAgICAgICAgIC8vICAgYXJndW1lbnRzIFwiY2FsbGVyXCIsIFByb3BlcnR5RGVzY3JpcHRvciB7W1tHZXRdXTogdGhyb3dlciwgW1tTZXRdXTpcbiAgICAgICAgICAgIC8vICAgdGhyb3dlciwgW1tFbnVtZXJhYmxlXV06IGZhbHNlLCBbW0NvbmZpZ3VyYWJsZV1dOiBmYWxzZX0sIGFuZFxuICAgICAgICAgICAgLy8gICBmYWxzZS5cbiAgICAgICAgICAgIC8vIDIxLiBDYWxsIHRoZSBbW0RlZmluZU93blByb3BlcnR5XV0gaW50ZXJuYWwgbWV0aG9kIG9mIEYgd2l0aFxuICAgICAgICAgICAgLy8gICBhcmd1bWVudHMgXCJhcmd1bWVudHNcIiwgUHJvcGVydHlEZXNjcmlwdG9yIHtbW0dldF1dOiB0aHJvd2VyLFxuICAgICAgICAgICAgLy8gICBbW1NldF1dOiB0aHJvd2VyLCBbW0VudW1lcmFibGVdXTogZmFsc2UsIFtbQ29uZmlndXJhYmxlXV06IGZhbHNlfSxcbiAgICAgICAgICAgIC8vICAgYW5kIGZhbHNlLlxuXG4gICAgICAgICAgICAvLyBUT0RPXG4gICAgICAgICAgICAvLyBOT1RFIEZ1bmN0aW9uIG9iamVjdHMgY3JlYXRlZCB1c2luZyBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCBkbyBub3RcbiAgICAgICAgICAgIC8vIGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHkgb3IgdGhlIFtbQ29kZV1dLCBbW0Zvcm1hbFBhcmFtZXRlcnNdXSwgYW5kXG4gICAgICAgICAgICAvLyBbW1Njb3BlXV0gaW50ZXJuYWwgcHJvcGVydGllcy5cbiAgICAgICAgICAgIC8vIFhYWCBjYW4ndCBkZWxldGUgcHJvdG90eXBlIGluIHB1cmUtanMuXG5cbiAgICAgICAgICAgIC8vIDIyLiBSZXR1cm4gRi5cbiAgICAgICAgICAgIHJldHVybiBib3VuZDtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gX1BsZWFzZSBub3RlOiBTaG9ydGN1dHMgYXJlIGRlZmluZWQgYWZ0ZXIgYEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kYCBhcyB3ZVxuICAgIC8vIHVzZSBpdCBpbiBkZWZpbmluZyBzaG9ydGN1dHMuXG4gICAgdmFyIG93bnMgPSBjYWxsLmJpbmQoT2JqZWN0UHJvdG90eXBlLmhhc093blByb3BlcnR5KTtcbiAgICB2YXIgdG9TdHIgPSBjYWxsLmJpbmQoT2JqZWN0UHJvdG90eXBlLnRvU3RyaW5nKTtcbiAgICB2YXIgYXJyYXlTbGljZSA9IGNhbGwuYmluZChhcnJheV9zbGljZSk7XG4gICAgdmFyIGFycmF5U2xpY2VBcHBseSA9IGFwcGx5LmJpbmQoYXJyYXlfc2xpY2UpO1xuICAgIC8qIGdsb2JhbHMgZG9jdW1lbnQgKi9cbiAgICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSAnb2JqZWN0JyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGFycmF5U2xpY2UoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXMpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICB2YXIgb3JpZ0FycmF5U2xpY2UgPSBhcnJheVNsaWNlO1xuICAgICAgICAgICAgdmFyIG9yaWdBcnJheVNsaWNlQXBwbHkgPSBhcnJheVNsaWNlQXBwbHk7XG4gICAgICAgICAgICBhcnJheVNsaWNlID0gZnVuY3Rpb24gYXJyYXlTbGljZUlFKGFycikge1xuICAgICAgICAgICAgICAgIHZhciByID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGkgPSBhcnIubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHdoaWxlIChpLS0gPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJbaV0gPSBhcnJbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnQXJyYXlTbGljZUFwcGx5KHIsIG9yaWdBcnJheVNsaWNlKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGFycmF5U2xpY2VBcHBseSA9IGZ1bmN0aW9uIGFycmF5U2xpY2VBcHBseUlFKGFyciwgYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnQXJyYXlTbGljZUFwcGx5KGFycmF5U2xpY2UoYXJyKSwgYXJncyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgfVxuICAgIHZhciBzdHJTbGljZSA9IGNhbGwuYmluZChTdHJpbmdQcm90b3R5cGUuc2xpY2UpO1xuICAgIHZhciBzdHJTcGxpdCA9IGNhbGwuYmluZChTdHJpbmdQcm90b3R5cGUuc3BsaXQpO1xuICAgIHZhciBzdHJJbmRleE9mID0gY2FsbC5iaW5kKFN0cmluZ1Byb3RvdHlwZS5pbmRleE9mKTtcbiAgICB2YXIgcHVzaENhbGwgPSBjYWxsLmJpbmQoYXJyYXlfcHVzaCk7XG4gICAgdmFyIGlzRW51bSA9IGNhbGwuYmluZChPYmplY3RQcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUpO1xuICAgIHZhciBhcnJheVNvcnQgPSBjYWxsLmJpbmQoQXJyYXlQcm90b3R5cGUuc29ydCk7XG5cbiAgICAvL1xuICAgIC8vIEFycmF5XG4gICAgLy8gPT09PT1cbiAgICAvL1xuXG4gICAgdmFyIGlzQXJyYXkgPSAkQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KG9iaikge1xuICAgICAgICByZXR1cm4gdG9TdHIob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbiAgICB9O1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xM1xuICAgIC8vIFJldHVybiBsZW4rYXJnQ291bnQuXG4gICAgLy8gW2J1Z2ZpeCwgaWVsdDhdXG4gICAgLy8gSUUgPCA4IGJ1ZzogW10udW5zaGlmdCgwKSA9PT0gdW5kZWZpbmVkIGJ1dCBzaG91bGQgYmUgXCIxXCJcbiAgICB2YXIgaGFzVW5zaGlmdFJldHVyblZhbHVlQnVnID0gW10udW5zaGlmdCgwKSAhPT0gMTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHVuc2hpZnQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGFycmF5X3Vuc2hpZnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxlbmd0aDtcbiAgICAgICAgfVxuICAgIH0sIGhhc1Vuc2hpZnRSZXR1cm5WYWx1ZUJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNC4zLjJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjMuMlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L2lzQXJyYXlcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCRBcnJheSwgeyBpc0FycmF5OiBpc0FycmF5IH0pO1xuXG4gICAgLy8gVGhlIElzQ2FsbGFibGUoKSBjaGVjayBpbiB0aGUgQXJyYXkgZnVuY3Rpb25zXG4gICAgLy8gaGFzIGJlZW4gcmVwbGFjZWQgd2l0aCBhIHN0cmljdCBjaGVjayBvbiB0aGVcbiAgICAvLyBpbnRlcm5hbCBjbGFzcyBvZiB0aGUgb2JqZWN0IHRvIHRyYXAgY2FzZXMgd2hlcmVcbiAgICAvLyB0aGUgcHJvdmlkZWQgZnVuY3Rpb24gd2FzIGFjdHVhbGx5IGEgcmVndWxhclxuICAgIC8vIGV4cHJlc3Npb24gbGl0ZXJhbCwgd2hpY2ggaW4gVjggYW5kXG4gICAgLy8gSmF2YVNjcmlwdENvcmUgaXMgYSB0eXBlb2YgXCJmdW5jdGlvblwiLiAgT25seSBpblxuICAgIC8vIFY4IGFyZSByZWd1bGFyIGV4cHJlc3Npb24gbGl0ZXJhbHMgcGVybWl0dGVkIGFzXG4gICAgLy8gcmVkdWNlIHBhcmFtZXRlcnMsIHNvIGl0IGlzIGRlc2lyYWJsZSBpbiB0aGVcbiAgICAvLyBnZW5lcmFsIGNhc2UgZm9yIHRoZSBzaGltIHRvIG1hdGNoIHRoZSBtb3JlXG4gICAgLy8gc3RyaWN0IGFuZCBjb21tb24gYmVoYXZpb3Igb2YgcmVqZWN0aW5nIHJlZ3VsYXJcbiAgICAvLyBleHByZXNzaW9ucy5cblxuICAgIC8vIEVTNSAxNS40LjQuMThcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMThcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9hcnJheS9mb3JFYWNoXG5cbiAgICAvLyBDaGVjayBmYWlsdXJlIG9mIGJ5LWluZGV4IGFjY2VzcyBvZiBzdHJpbmcgY2hhcmFjdGVycyAoSUUgPCA5KVxuICAgIC8vIGFuZCBmYWlsdXJlIG9mIGAwIGluIGJveGVkU3RyaW5nYCAoUmhpbm8pXG4gICAgdmFyIGJveGVkU3RyaW5nID0gJE9iamVjdCgnYScpO1xuICAgIHZhciBzcGxpdFN0cmluZyA9IGJveGVkU3RyaW5nWzBdICE9PSAnYScgfHwgISgwIGluIGJveGVkU3RyaW5nKTtcblxuICAgIHZhciBwcm9wZXJseUJveGVzQ29udGV4dCA9IGZ1bmN0aW9uIHByb3Blcmx5Qm94ZWQobWV0aG9kKSB7XG4gICAgICAgIC8vIENoZWNrIG5vZGUgMC42LjIxIGJ1ZyB3aGVyZSB0aGlyZCBwYXJhbWV0ZXIgaXMgbm90IGJveGVkXG4gICAgICAgIHZhciBwcm9wZXJseUJveGVzTm9uU3RyaWN0ID0gdHJ1ZTtcbiAgICAgICAgdmFyIHByb3Blcmx5Qm94ZXNTdHJpY3QgPSB0cnVlO1xuICAgICAgICB2YXIgdGhyZXdFeGNlcHRpb24gPSBmYWxzZTtcbiAgICAgICAgaWYgKG1ldGhvZCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBtZXRob2QuY2FsbCgnZm9vJywgZnVuY3Rpb24gKF8sIF9fLCBjb250ZXh0KSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29udGV4dCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3Blcmx5Qm94ZXNOb25TdHJpY3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgbWV0aG9kLmNhbGwoWzFdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICd1c2Ugc3RyaWN0JztcblxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJseUJveGVzU3RyaWN0ID0gdHlwZW9mIHRoaXMgPT09ICdzdHJpbmcnO1xuICAgICAgICAgICAgICAgIH0sICd4Jyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgdGhyZXdFeGNlcHRpb24gPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAhIW1ldGhvZCAmJiAhdGhyZXdFeGNlcHRpb24gJiYgcHJvcGVybHlCb3hlc05vblN0cmljdCAmJiBwcm9wZXJseUJveGVzU3RyaWN0O1xuICAgIH07XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbi8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5mb3JFYWNoIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB3aGlsZSAoKytpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbnZva2UgdGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpdGggY2FsbCwgcGFzc2luZyBhcmd1bWVudHM6XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnRleHQsIHByb3BlcnR5IHZhbHVlLCBwcm9wZXJ0eSBrZXksIHRoaXNBcmcgb2JqZWN0XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZm4oc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrZm4uY2FsbChULCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLmZvckVhY2gpKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTlcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTlcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X1JlZmVyZW5jZS9PYmplY3RzL0FycmF5L21hcFxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbi8qLCB0aGlzQXJnKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICRBcnJheShsZW5ndGgpO1xuICAgICAgICAgICAgdmFyIFQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICBUID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLm1hcCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBUID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSwgIXByb3Blcmx5Qm94ZXNDb250ZXh0KEFycmF5UHJvdG90eXBlLm1hcCkpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4yMFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMFxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvZmlsdGVyXG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgICAgICB2YXIgVDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZmlsdGVyIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHNlbGZbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgVCA9PT0gJ3VuZGVmaW5lZCcgPyBjYWxsYmFja2ZuKHZhbHVlLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHZhbHVlLCBpLCBvYmplY3QpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChyZXN1bHQsIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9LCAhcHJvcGVybHlCb3hlc0NvbnRleHQoQXJyYXlQcm90b3R5cGUuZmlsdGVyKSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjE2XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE2XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZXZlcnlcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIGV2ZXJ5OiBmdW5jdGlvbiBldmVyeShjYWxsYmFja2ZuLyosIHRoaXNBcmcqLykge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IG9iamVjdDtcbiAgICAgICAgICAgIHZhciBsZW5ndGggPSBFUy5Ub1VpbnQzMihzZWxmLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgVDtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIFQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIG5vIGNhbGxiYWNrIGZ1bmN0aW9uIG9yIGlmIGNhbGxiYWNrIGlzIG5vdCBhIGNhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY2FsbGJhY2tmbikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcnJheS5wcm90b3R5cGUuZXZlcnkgY2FsbGJhY2sgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmICYmICEodHlwZW9mIFQgPT09ICd1bmRlZmluZWQnID8gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5ldmVyeSkpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4xN1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4xN1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0FycmF5L3NvbWVcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHNvbWU6IGZ1bmN0aW9uIHNvbWUoY2FsbGJhY2tmbi8qLCB0aGlzQXJnICovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciBUO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgVCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5zb21lIGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiAodHlwZW9mIFQgPT09ICd1bmRlZmluZWQnID8gY2FsbGJhY2tmbihzZWxmW2ldLCBpLCBvYmplY3QpIDogY2FsbGJhY2tmbi5jYWxsKFQsIHNlbGZbaV0sIGksIG9iamVjdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH0sICFwcm9wZXJseUJveGVzQ29udGV4dChBcnJheVByb3RvdHlwZS5zb21lKSk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjIxXG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjIxXG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9SZWZlcmVuY2UvT2JqZWN0cy9BcnJheS9yZWR1Y2VcbiAgICB2YXIgcmVkdWNlQ29lcmNlc1RvT2JqZWN0ID0gZmFsc2U7XG4gICAgaWYgKEFycmF5UHJvdG90eXBlLnJlZHVjZSkge1xuICAgICAgICByZWR1Y2VDb2VyY2VzVG9PYmplY3QgPSB0eXBlb2YgQXJyYXlQcm90b3R5cGUucmVkdWNlLmNhbGwoJ2VzNScsIGZ1bmN0aW9uIChfLCBfXywgX19fLCBsaXN0KSB7XG4gICAgICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgICAgfSkgPT09ICdvYmplY3QnO1xuICAgIH1cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4vKiwgaW5pdGlhbFZhbHVlKi8pIHtcbiAgICAgICAgICAgIHZhciBvYmplY3QgPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gc3BsaXRTdHJpbmcgJiYgaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiBvYmplY3Q7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBJZiBubyBjYWxsYmFjayBmdW5jdGlvbiBvciBpZiBjYWxsYmFjayBpcyBub3QgYSBjYWxsYWJsZSBmdW5jdGlvblxuICAgICAgICAgICAgaWYgKCFpc0NhbGxhYmxlKGNhbGxiYWNrZm4pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJyYXkucHJvdG90eXBlLnJlZHVjZSBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUgYW5kIGFuIGVtcHR5IGFycmF5XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHNlbGZbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgYXJyYXkgY29udGFpbnMgbm8gdmFsdWVzLCBubyBpbml0aWFsIHZhbHVlIHRvIHJldHVyblxuICAgICAgICAgICAgICAgICAgICBpZiAoKytpID49IGxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncmVkdWNlIG9mIGVtcHR5IGFycmF5IHdpdGggbm8gaW5pdGlhbCB2YWx1ZScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAodHJ1ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoaSBpbiBzZWxmKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IGNhbGxiYWNrZm4ocmVzdWx0LCBzZWxmW2ldLCBpLCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH0sICFyZWR1Y2VDb2VyY2VzVG9PYmplY3QpO1xuXG4gICAgLy8gRVM1IDE1LjQuNC4yMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjQuNC4yMlxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfUmVmZXJlbmNlL09iamVjdHMvQXJyYXkvcmVkdWNlUmlnaHRcbiAgICB2YXIgcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QgPSBmYWxzZTtcbiAgICBpZiAoQXJyYXlQcm90b3R5cGUucmVkdWNlUmlnaHQpIHtcbiAgICAgICAgcmVkdWNlUmlnaHRDb2VyY2VzVG9PYmplY3QgPSB0eXBlb2YgQXJyYXlQcm90b3R5cGUucmVkdWNlUmlnaHQuY2FsbCgnZXM1JywgZnVuY3Rpb24gKF8sIF9fLCBfX18sIGxpc3QpIHtcbiAgICAgICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgICB9KSA9PT0gJ29iamVjdCc7XG4gICAgfVxuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KGNhbGxiYWNrZm4vKiwgaW5pdGlhbCovKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogb2JqZWN0O1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcblxuICAgICAgICAgICAgLy8gSWYgbm8gY2FsbGJhY2sgZnVuY3Rpb24gb3IgaWYgY2FsbGJhY2sgaXMgbm90IGEgY2FsbGFibGUgZnVuY3Rpb25cbiAgICAgICAgICAgIGlmICghaXNDYWxsYWJsZShjYWxsYmFja2ZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodCBjYWxsYmFjayBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gbm8gdmFsdWUgdG8gcmV0dXJuIGlmIG5vIGluaXRpYWwgdmFsdWUsIGVtcHR5IGFycmF5XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwICYmIGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIHZhciBpID0gbGVuZ3RoIC0gMTtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gc2VsZltpLS1dO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBhcnJheSBjb250YWlucyBubyB2YWx1ZXMsIG5vIGluaXRpYWwgdmFsdWUgdG8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLWkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2VSaWdodCBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZikge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBjYWxsYmFja2ZuKHJlc3VsdCwgc2VsZltpXSwgaSwgb2JqZWN0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChpLS0pO1xuXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9XG4gICAgfSwgIXJlZHVjZVJpZ2h0Q29lcmNlc1RvT2JqZWN0KTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTRcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTRcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9BcnJheS9pbmRleE9mXG4gICAgdmFyIGhhc0ZpcmVmb3gySW5kZXhPZkJ1ZyA9IEFycmF5UHJvdG90eXBlLmluZGV4T2YgJiYgWzAsIDFdLmluZGV4T2YoMSwgMikgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50LyosIGZyb21JbmRleCAqLykge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSBzcGxpdFN0cmluZyAmJiBpc1N0cmluZyh0aGlzKSA/IHN0clNwbGl0KHRoaXMsICcnKSA6IEVTLlRvT2JqZWN0KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGxlbmd0aCA9IEVTLlRvVWludDMyKHNlbGYubGVuZ3RoKTtcblxuICAgICAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaSA9IEVTLlRvSW50ZWdlcihhcmd1bWVudHNbMV0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBtYXgoMCwgbGVuZ3RoICsgaSk7XG4gICAgICAgICAgICBmb3IgKDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGkgaW4gc2VsZiAmJiBzZWxmW2ldID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH0sIGhhc0ZpcmVmb3gySW5kZXhPZkJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNC40LjE1XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNC40LjE1XG4gICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvbGFzdEluZGV4T2ZcbiAgICB2YXIgaGFzRmlyZWZveDJMYXN0SW5kZXhPZkJ1ZyA9IEFycmF5UHJvdG90eXBlLmxhc3RJbmRleE9mICYmIFswLCAxXS5sYXN0SW5kZXhPZigwLCAtMykgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaEVsZW1lbnQvKiwgZnJvbUluZGV4ICovKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHNwbGl0U3RyaW5nICYmIGlzU3RyaW5nKHRoaXMpID8gc3RyU3BsaXQodGhpcywgJycpIDogRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgbGVuZ3RoID0gRVMuVG9VaW50MzIoc2VsZi5sZW5ndGgpO1xuXG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGkgPSBsZW5ndGggLSAxO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgaSA9IG1pbihpLCBFUy5Ub0ludGVnZXIoYXJndW1lbnRzWzFdKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBoYW5kbGUgbmVnYXRpdmUgaW5kaWNlc1xuICAgICAgICAgICAgaSA9IGkgPj0gMCA/IGkgOiBsZW5ndGggLSBNYXRoLmFicyhpKTtcbiAgICAgICAgICAgIGZvciAoOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgICAgIGlmIChpIGluIHNlbGYgJiYgc2VhcmNoRWxlbWVudCA9PT0gc2VsZltpXSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9LCBoYXNGaXJlZm94Mkxhc3RJbmRleE9mQnVnKTtcblxuICAgIC8vIEVTNSAxNS40LjQuMTJcbiAgICAvLyBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3gxNS40LjQuMTJcbiAgICB2YXIgc3BsaWNlTm9vcFJldHVybnNFbXB0eUFycmF5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGEgPSBbMSwgMl07XG4gICAgICAgIHZhciByZXN1bHQgPSBhLnNwbGljZSgpO1xuICAgICAgICByZXR1cm4gYS5sZW5ndGggPT09IDIgJiYgaXNBcnJheShyZXN1bHQpICYmIHJlc3VsdC5sZW5ndGggPT09IDA7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIC8vIFNhZmFyaSA1LjAgYnVnIHdoZXJlIC5zcGxpY2UoKSByZXR1cm5zIHVuZGVmaW5lZFxuICAgICAgICBzcGxpY2U6IGZ1bmN0aW9uIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXlfc3BsaWNlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LCAhc3BsaWNlTm9vcFJldHVybnNFbXB0eUFycmF5KTtcblxuICAgIHZhciBzcGxpY2VXb3Jrc1dpdGhFbXB0eU9iamVjdCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBvYmogPSB7fTtcbiAgICAgICAgQXJyYXlQcm90b3R5cGUuc3BsaWNlLmNhbGwob2JqLCAwLCAwLCAxKTtcbiAgICAgICAgcmV0dXJuIG9iai5sZW5ndGggPT09IDE7XG4gICAgfSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKHN0YXJ0LCBkZWxldGVDb3VudCkge1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gbWF4KEVTLlRvSW50ZWdlcih0aGlzLmxlbmd0aCksIDApO1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAwICYmIHR5cGVvZiBkZWxldGVDb3VudCAhPT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBhcmdzID0gYXJyYXlTbGljZShhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA8IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwoYXJncywgdGhpcy5sZW5ndGggLSBzdGFydCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXJnc1sxXSA9IEVTLlRvSW50ZWdlcihkZWxldGVDb3VudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5X3NwbGljZS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgIH0sICFzcGxpY2VXb3Jrc1dpdGhFbXB0eU9iamVjdCk7XG4gICAgdmFyIHNwbGljZVdvcmtzV2l0aExhcmdlU3BhcnNlQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gUGVyIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMjk1XG4gICAgICAgIC8vIFNhZmFyaSA3LzggYnJlYWtzIHdpdGggc3BhcnNlIGFycmF5cyBvZiBzaXplIDFlNSBvciBncmVhdGVyXG4gICAgICAgIHZhciBhcnIgPSBuZXcgJEFycmF5KDFlNSk7XG4gICAgICAgIC8vIG5vdGU6IHRoZSBpbmRleCBNVVNUIGJlIDggb3IgbGFyZ2VyIG9yIHRoZSB0ZXN0IHdpbGwgZmFsc2UgcGFzc1xuICAgICAgICBhcnJbOF0gPSAneCc7XG4gICAgICAgIGFyci5zcGxpY2UoMSwgMSk7XG4gICAgICAgIC8vIG5vdGU6IHRoaXMgdGVzdCBtdXN0IGJlIGRlZmluZWQgKmFmdGVyKiB0aGUgaW5kZXhPZiBzaGltXG4gICAgICAgIC8vIHBlciBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzMxM1xuICAgICAgICByZXR1cm4gYXJyLmluZGV4T2YoJ3gnKSA9PT0gNztcbiAgICB9KCkpO1xuICAgIHZhciBzcGxpY2VXb3Jrc1dpdGhTbWFsbFNwYXJzZUFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIFBlciBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzI5NVxuICAgICAgICAvLyBPcGVyYSAxMi4xNSBicmVha3Mgb24gdGhpcywgbm8gaWRlYSB3aHkuXG4gICAgICAgIHZhciBuID0gMjU2O1xuICAgICAgICB2YXIgYXJyID0gW107XG4gICAgICAgIGFycltuXSA9ICdhJztcbiAgICAgICAgYXJyLnNwbGljZShuICsgMSwgMCwgJ2InKTtcbiAgICAgICAgcmV0dXJuIGFycltuXSA9PT0gJ2EnO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBzcGxpY2U6IGZ1bmN0aW9uIHNwbGljZShzdGFydCwgZGVsZXRlQ291bnQpIHtcbiAgICAgICAgICAgIHZhciBPID0gRVMuVG9PYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgQSA9IFtdO1xuICAgICAgICAgICAgdmFyIGxlbiA9IEVTLlRvVWludDMyKE8ubGVuZ3RoKTtcbiAgICAgICAgICAgIHZhciByZWxhdGl2ZVN0YXJ0ID0gRVMuVG9JbnRlZ2VyKHN0YXJ0KTtcbiAgICAgICAgICAgIHZhciBhY3R1YWxTdGFydCA9IHJlbGF0aXZlU3RhcnQgPCAwID8gbWF4KChsZW4gKyByZWxhdGl2ZVN0YXJ0KSwgMCkgOiBtaW4ocmVsYXRpdmVTdGFydCwgbGVuKTtcbiAgICAgICAgICAgIHZhciBhY3R1YWxEZWxldGVDb3VudCA9IG1pbihtYXgoRVMuVG9JbnRlZ2VyKGRlbGV0ZUNvdW50KSwgMCksIGxlbiAtIGFjdHVhbFN0YXJ0KTtcblxuICAgICAgICAgICAgdmFyIGsgPSAwO1xuICAgICAgICAgICAgdmFyIGZyb207XG4gICAgICAgICAgICB3aGlsZSAoayA8IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgZnJvbSA9ICRTdHJpbmcoYWN0dWFsU3RhcnQgKyBrKTtcbiAgICAgICAgICAgICAgICBpZiAob3ducyhPLCBmcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICBBW2tdID0gT1tmcm9tXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgayArPSAxO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSBhcnJheVNsaWNlKGFyZ3VtZW50cywgMik7XG4gICAgICAgICAgICB2YXIgaXRlbUNvdW50ID0gaXRlbXMubGVuZ3RoO1xuICAgICAgICAgICAgdmFyIHRvO1xuICAgICAgICAgICAgaWYgKGl0ZW1Db3VudCA8IGFjdHVhbERlbGV0ZUNvdW50KSB7XG4gICAgICAgICAgICAgICAgayA9IGFjdHVhbFN0YXJ0O1xuICAgICAgICAgICAgICAgIHZhciBtYXhLID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGsgPCBtYXhLKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkU3RyaW5nKGsgKyBhY3R1YWxEZWxldGVDb3VudCk7XG4gICAgICAgICAgICAgICAgICAgIHRvID0gJFN0cmluZyhrICsgaXRlbUNvdW50KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG93bnMoTywgZnJvbSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBPW3RvXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBrICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGsgPSBsZW47XG4gICAgICAgICAgICAgICAgdmFyIG1pbksgPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudCArIGl0ZW1Db3VudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoayA+IG1pbkspIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIE9bayAtIDFdO1xuICAgICAgICAgICAgICAgICAgICBrIC09IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpdGVtQ291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgICAgICAgICAgIGsgPSBsZW4gLSBhY3R1YWxEZWxldGVDb3VudDtcbiAgICAgICAgICAgICAgICB3aGlsZSAoayA+IGFjdHVhbFN0YXJ0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb20gPSAkU3RyaW5nKGsgKyBhY3R1YWxEZWxldGVDb3VudCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICB0byA9ICRTdHJpbmcoayArIGl0ZW1Db3VudCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAob3ducyhPLCBmcm9tKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIE9bdG9dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGsgLT0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBrID0gYWN0dWFsU3RhcnQ7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgT1trXSA9IGl0ZW1zW2ldO1xuICAgICAgICAgICAgICAgIGsgKz0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIE8ubGVuZ3RoID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQgKyBpdGVtQ291bnQ7XG5cbiAgICAgICAgICAgIHJldHVybiBBO1xuICAgICAgICB9XG4gICAgfSwgIXNwbGljZVdvcmtzV2l0aExhcmdlU3BhcnNlQXJyYXlzIHx8ICFzcGxpY2VXb3Jrc1dpdGhTbWFsbFNwYXJzZUFycmF5cyk7XG5cbiAgICB2YXIgb3JpZ2luYWxKb2luID0gQXJyYXlQcm90b3R5cGUuam9pbjtcbiAgICB2YXIgaGFzU3RyaW5nSm9pbkJ1ZztcbiAgICB0cnkge1xuICAgICAgICBoYXNTdHJpbmdKb2luQnVnID0gQXJyYXkucHJvdG90eXBlLmpvaW4uY2FsbCgnMTIzJywgJywnKSAhPT0gJzEsMiwzJztcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGhhc1N0cmluZ0pvaW5CdWcgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoaGFzU3RyaW5nSm9pbkJ1Zykge1xuICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKEFycmF5UHJvdG90eXBlLCB7XG4gICAgICAgICAgICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgICAgICAgICAgICAgIHZhciBzZXAgPSB0eXBlb2Ygc2VwYXJhdG9yID09PSAndW5kZWZpbmVkJyA/ICcsJyA6IHNlcGFyYXRvcjtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxKb2luLmNhbGwoaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiB0aGlzLCBzZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBoYXNTdHJpbmdKb2luQnVnKTtcbiAgICB9XG5cbiAgICB2YXIgaGFzSm9pblVuZGVmaW5lZEJ1ZyA9IFsxLCAyXS5qb2luKHVuZGVmaW5lZCkgIT09ICcxLDInO1xuICAgIGlmIChoYXNKb2luVW5kZWZpbmVkQnVnKSB7XG4gICAgICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgICAgIGpvaW46IGZ1bmN0aW9uIGpvaW4oc2VwYXJhdG9yKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlcCA9IHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnID8gJywnIDogc2VwYXJhdG9yO1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEpvaW4uY2FsbCh0aGlzLCBzZXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBoYXNKb2luVW5kZWZpbmVkQnVnKTtcbiAgICB9XG5cbiAgICB2YXIgcHVzaFNoaW0gPSBmdW5jdGlvbiBwdXNoKGl0ZW0pIHtcbiAgICAgICAgdmFyIE8gPSBFUy5Ub09iamVjdCh0aGlzKTtcbiAgICAgICAgdmFyIG4gPSBFUy5Ub1VpbnQzMihPLmxlbmd0aCk7XG4gICAgICAgIHZhciBpID0gMDtcbiAgICAgICAgd2hpbGUgKGkgPCBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAgICAgICBPW24gKyBpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICBPLmxlbmd0aCA9IG4gKyBpO1xuICAgICAgICByZXR1cm4gbiArIGk7XG4gICAgfTtcblxuICAgIHZhciBwdXNoSXNOb3RHZW5lcmljID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG9iaiA9IHt9O1xuICAgICAgICB2YXIgcmVzdWx0ID0gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbChvYmosIHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDEgfHwgb2JqLmxlbmd0aCAhPT0gMSB8fCB0eXBlb2Ygb2JqWzBdICE9PSAndW5kZWZpbmVkJyB8fCAhb3ducyhvYmosIDApO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwge1xuICAgICAgICBwdXNoOiBmdW5jdGlvbiBwdXNoKGl0ZW0pIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KHRoaXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5X3B1c2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwdXNoU2hpbS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSwgcHVzaElzTm90R2VuZXJpYyk7XG5cbiAgICAvLyBUaGlzIGZpeGVzIGEgdmVyeSB3ZWlyZCBidWcgaW4gT3BlcmEgMTAuNiB3aGVuIHB1c2hpbmcgYHVuZGVmaW5lZFxuICAgIHZhciBwdXNoVW5kZWZpbmVkSXNXZWlyZCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnIgPSBbXTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGFyci5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDEgfHwgYXJyLmxlbmd0aCAhPT0gMSB8fCB0eXBlb2YgYXJyWzBdICE9PSAndW5kZWZpbmVkJyB8fCAhb3ducyhhcnIsIDApO1xuICAgIH0oKSk7XG4gICAgZGVmaW5lUHJvcGVydGllcyhBcnJheVByb3RvdHlwZSwgeyBwdXNoOiBwdXNoU2hpbSB9LCBwdXNoVW5kZWZpbmVkSXNXZWlyZCk7XG5cbiAgICAvLyBFUzUgMTUuMi4zLjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuaW8vI3gxNS40LjQuMTBcbiAgICAvLyBGaXggYm94ZWQgc3RyaW5nIGJ1Z1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc2xpY2U6IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gICAgICAgICAgICB2YXIgYXJyID0gaXNTdHJpbmcodGhpcykgPyBzdHJTcGxpdCh0aGlzLCAnJykgOiB0aGlzO1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5U2xpY2VBcHBseShhcnIsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICB9LCBzcGxpdFN0cmluZyk7XG5cbiAgICB2YXIgc29ydElnbm9yZXNOb25GdW5jdGlvbnMgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgWzEsIDJdLnNvcnQobnVsbCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgWzEsIDJdLnNvcnQoe30pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZTIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSgpKTtcbiAgICB2YXIgc29ydFRocm93c09uUmVnZXggPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB0aGlzIGlzIGEgcHJvYmxlbSBpbiBGaXJlZm94IDQsIGluIHdoaWNoIGB0eXBlb2YgL2EvID09PSAnZnVuY3Rpb24nYFxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgWzEsIDJdLnNvcnQoL2EvKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSgpKTtcbiAgICB2YXIgc29ydElnbm9yZXNVbmRlZmluZWQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyBhcHBsaWVzIGluIElFIDgsIGZvciBvbmUuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBbMSwgMl0uc29ydCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KCkpO1xuICAgIGRlZmluZVByb3BlcnRpZXMoQXJyYXlQcm90b3R5cGUsIHtcbiAgICAgICAgc29ydDogZnVuY3Rpb24gc29ydChjb21wYXJlRm4pIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgY29tcGFyZUZuID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBhcnJheVNvcnQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUoY29tcGFyZUZuKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FycmF5LnByb3RvdHlwZS5zb3J0IGNhbGxiYWNrIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFycmF5U29ydCh0aGlzLCBjb21wYXJlRm4pO1xuICAgICAgICB9XG4gICAgfSwgc29ydElnbm9yZXNOb25GdW5jdGlvbnMgfHwgIXNvcnRJZ25vcmVzVW5kZWZpbmVkIHx8ICFzb3J0VGhyb3dzT25SZWdleCk7XG5cbiAgICAvL1xuICAgIC8vIE9iamVjdFxuICAgIC8vID09PT09PVxuICAgIC8vXG5cbiAgICAvLyBFUzUgMTUuMi4zLjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuMi4zLjE0XG5cbiAgICAvLyBodHRwOi8vd2hhdHRoZWhlYWRzYWlkLmNvbS8yMDEwLzEwL2Etc2FmZXItb2JqZWN0LWtleXMtY29tcGF0aWJpbGl0eS1pbXBsZW1lbnRhdGlvblxuICAgIHZhciBoYXNEb250RW51bUJ1ZyA9ICFpc0VudW0oeyAndG9TdHJpbmcnOiBudWxsIH0sICd0b1N0cmluZycpOyAvLyBqc2NzOmlnbm9yZSBkaXNhbGxvd1F1b3RlZEtleXNJbk9iamVjdHNcbiAgICB2YXIgaGFzUHJvdG9FbnVtQnVnID0gaXNFbnVtKGZ1bmN0aW9uICgpIHt9LCAncHJvdG90eXBlJyk7XG4gICAgdmFyIGhhc1N0cmluZ0VudW1CdWcgPSAhb3ducygneCcsICcwJyk7XG4gICAgdmFyIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgICAgdmFyIGN0b3IgPSBvLmNvbnN0cnVjdG9yO1xuICAgICAgICByZXR1cm4gY3RvciAmJiBjdG9yLnByb3RvdHlwZSA9PT0gbztcbiAgICB9O1xuICAgIHZhciBleGNsdWRlZEtleXMgPSB7XG4gICAgICAgICR3aW5kb3c6IHRydWUsXG4gICAgICAgICRjb25zb2xlOiB0cnVlLFxuICAgICAgICAkcGFyZW50OiB0cnVlLFxuICAgICAgICAkc2VsZjogdHJ1ZSxcbiAgICAgICAgJGZyYW1lOiB0cnVlLFxuICAgICAgICAkZnJhbWVzOiB0cnVlLFxuICAgICAgICAkZnJhbWVFbGVtZW50OiB0cnVlLFxuICAgICAgICAkd2Via2l0SW5kZXhlZERCOiB0cnVlLFxuICAgICAgICAkd2Via2l0U3RvcmFnZUluZm86IHRydWUsXG4gICAgICAgICRleHRlcm5hbDogdHJ1ZSxcbiAgICAgICAgJHdpZHRoOiB0cnVlLFxuICAgICAgICAkaGVpZ2h0OiB0cnVlLFxuICAgICAgICAkdG9wOiB0cnVlLFxuICAgICAgICAkbG9jYWxTdG9yYWdlOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgaGFzQXV0b21hdGlvbkVxdWFsaXR5QnVnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLyogZ2xvYmFscyB3aW5kb3cgKi9cbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgayBpbiB3aW5kb3cpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKCFleGNsdWRlZEtleXNbJyQnICsga10gJiYgb3ducyh3aW5kb3csIGspICYmIHdpbmRvd1trXSAhPT0gbnVsbCAmJiB0eXBlb2Ygd2luZG93W2tdID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZSh3aW5kb3dba10pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSgpKTtcbiAgICB2YXIgZXF1YWxzQ29uc3RydWN0b3JQcm90b3R5cGVJZk5vdEJ1Z2d5ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcgfHwgIWhhc0F1dG9tYXRpb25FcXVhbGl0eUJ1Zykge1xuICAgICAgICAgICAgcmV0dXJuIGVxdWFsc0NvbnN0cnVjdG9yUHJvdG90eXBlKG9iamVjdCk7XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZShvYmplY3QpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkb250RW51bXMgPSBbXG4gICAgICAgICd0b1N0cmluZycsXG4gICAgICAgICd0b0xvY2FsZVN0cmluZycsXG4gICAgICAgICd2YWx1ZU9mJyxcbiAgICAgICAgJ2hhc093blByb3BlcnR5JyxcbiAgICAgICAgJ2lzUHJvdG90eXBlT2YnLFxuICAgICAgICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAgICAgICAnY29uc3RydWN0b3InXG4gICAgXTtcbiAgICB2YXIgZG9udEVudW1zTGVuZ3RoID0gZG9udEVudW1zLmxlbmd0aDtcblxuICAgIC8vIHRha2VuIGRpcmVjdGx5IGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9pcy1hcmd1bWVudHMvYmxvYi9tYXN0ZXIvaW5kZXguanNcbiAgICAvLyBjYW4gYmUgcmVwbGFjZWQgd2l0aCByZXF1aXJlKCdpcy1hcmd1bWVudHMnKSBpZiB3ZSBldmVyIHVzZSBhIGJ1aWxkIHByb2Nlc3MgaW5zdGVhZFxuICAgIHZhciBpc1N0YW5kYXJkQXJndW1lbnRzID0gZnVuY3Rpb24gaXNBcmd1bWVudHModmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHRvU3RyKHZhbHVlKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG4gICAgfTtcbiAgICB2YXIgaXNMZWdhY3lBcmd1bWVudHMgPSBmdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gdmFsdWUgIT09IG51bGxcbiAgICAgICAgICAgICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCdcbiAgICAgICAgICAgICYmIHR5cGVvZiB2YWx1ZS5sZW5ndGggPT09ICdudW1iZXInXG4gICAgICAgICAgICAmJiB2YWx1ZS5sZW5ndGggPj0gMFxuICAgICAgICAgICAgJiYgIWlzQXJyYXkodmFsdWUpXG4gICAgICAgICAgICAmJiBpc0NhbGxhYmxlKHZhbHVlLmNhbGxlZSk7XG4gICAgfTtcbiAgICB2YXIgaXNBcmd1bWVudHMgPSBpc1N0YW5kYXJkQXJndW1lbnRzKGFyZ3VtZW50cykgPyBpc1N0YW5kYXJkQXJndW1lbnRzIDogaXNMZWdhY3lBcmd1bWVudHM7XG5cbiAgICBkZWZpbmVQcm9wZXJ0aWVzKCRPYmplY3QsIHtcbiAgICAgICAga2V5czogZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgICAgICAgICAgIHZhciBpc0ZuID0gaXNDYWxsYWJsZShvYmplY3QpO1xuICAgICAgICAgICAgdmFyIGlzQXJncyA9IGlzQXJndW1lbnRzKG9iamVjdCk7XG4gICAgICAgICAgICB2YXIgaXNPYmplY3QgPSBvYmplY3QgIT09IG51bGwgJiYgdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCc7XG4gICAgICAgICAgICB2YXIgaXNTdHIgPSBpc09iamVjdCAmJiBpc1N0cmluZyhvYmplY3QpO1xuXG4gICAgICAgICAgICBpZiAoIWlzT2JqZWN0ICYmICFpc0ZuICYmICFpc0FyZ3MpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3Qua2V5cyBjYWxsZWQgb24gYSBub24tb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciB0aGVLZXlzID0gW107XG4gICAgICAgICAgICB2YXIgc2tpcFByb3RvID0gaGFzUHJvdG9FbnVtQnVnICYmIGlzRm47XG4gICAgICAgICAgICBpZiAoKGlzU3RyICYmIGhhc1N0cmluZ0VudW1CdWcpIHx8IGlzQXJncykge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKHRoZUtleXMsICRTdHJpbmcoaSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0FyZ3MpIHtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIG9iamVjdCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShza2lwUHJvdG8gJiYgbmFtZSA9PT0gJ3Byb3RvdHlwZScpICYmIG93bnMob2JqZWN0LCBuYW1lKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwodGhlS2V5cywgJFN0cmluZyhuYW1lKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChoYXNEb250RW51bUJ1Zykge1xuICAgICAgICAgICAgICAgIHZhciBza2lwQ29uc3RydWN0b3IgPSBlcXVhbHNDb25zdHJ1Y3RvclByb3RvdHlwZUlmTm90QnVnZ3kob2JqZWN0KTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRvbnRFbnVtc0xlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBkb250RW51bSA9IGRvbnRFbnVtc1tqXTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoc2tpcENvbnN0cnVjdG9yICYmIGRvbnRFbnVtID09PSAnY29uc3RydWN0b3InKSAmJiBvd25zKG9iamVjdCwgZG9udEVudW0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbCh0aGVLZXlzLCBkb250RW51bSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhlS2V5cztcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGtleXNXb3Jrc1dpdGhBcmd1bWVudHMgPSAkT2JqZWN0LmtleXMgJiYgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gU2FmYXJpIDUuMCBidWdcbiAgICAgICAgcmV0dXJuICRPYmplY3Qua2V5cyhhcmd1bWVudHMpLmxlbmd0aCA9PT0gMjtcbiAgICB9KDEsIDIpKTtcbiAgICB2YXIga2V5c0hhc0FyZ3VtZW50c0xlbmd0aEJ1ZyA9ICRPYmplY3Qua2V5cyAmJiAoZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJnS2V5cyA9ICRPYmplY3Qua2V5cyhhcmd1bWVudHMpO1xuICAgICAgICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCAhPT0gMSB8fCBhcmdLZXlzLmxlbmd0aCAhPT0gMSB8fCBhcmdLZXlzWzBdICE9PSAxO1xuICAgIH0oMSkpO1xuICAgIHZhciBvcmlnaW5hbEtleXMgPSAkT2JqZWN0LmtleXM7XG4gICAgZGVmaW5lUHJvcGVydGllcygkT2JqZWN0LCB7XG4gICAgICAgIGtleXM6IGZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcmd1bWVudHMob2JqZWN0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbEtleXMoYXJyYXlTbGljZShvYmplY3QpKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsS2V5cyhvYmplY3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSwgIWtleXNXb3Jrc1dpdGhBcmd1bWVudHMgfHwga2V5c0hhc0FyZ3VtZW50c0xlbmd0aEJ1Zyk7XG5cbiAgICAvL1xuICAgIC8vIERhdGVcbiAgICAvLyA9PT09XG4gICAgLy9cblxuICAgIHZhciBoYXNOZWdhdGl2ZU1vbnRoWWVhckJ1ZyA9IG5ldyBEYXRlKC0zNTA5ODI3MzI5NjAwMjkyKS5nZXRVVENNb250aCgpICE9PSAwO1xuICAgIHZhciBhTmVnYXRpdmVUZXN0RGF0ZSA9IG5ldyBEYXRlKC0xNTA5ODQyMjg5NjAwMjkyKTtcbiAgICB2YXIgYVBvc2l0aXZlVGVzdERhdGUgPSBuZXcgRGF0ZSgxNDQ5NjYyNDAwMDAwKTtcbiAgICB2YXIgaGFzVG9VVENTdHJpbmdGb3JtYXRCdWcgPSBhTmVnYXRpdmVUZXN0RGF0ZS50b1VUQ1N0cmluZygpICE9PSAnTW9uLCAwMSBKYW4gLTQ1ODc1IDExOjU5OjU5IEdNVCc7XG4gICAgdmFyIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZztcbiAgICB2YXIgaGFzVG9TdHJpbmdGb3JtYXRCdWc7XG4gICAgdmFyIHRpbWVab25lT2Zmc2V0ID0gYU5lZ2F0aXZlVGVzdERhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcbiAgICBpZiAodGltZVpvbmVPZmZzZXQgPCAtNzIwKSB7XG4gICAgICAgIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZyA9IGFOZWdhdGl2ZVRlc3REYXRlLnRvRGF0ZVN0cmluZygpICE9PSAnVHVlIEphbiAwMiAtNDU4NzUnO1xuICAgICAgICBoYXNUb1N0cmluZ0Zvcm1hdEJ1ZyA9ICEoL15UaHUgRGVjIDEwIDIwMTUgXFxkXFxkOlxcZFxcZDpcXGRcXGQgR01UWy0rXVxcZFxcZFxcZFxcZCg/OiB8JCkvKS50ZXN0KFN0cmluZyhhUG9zaXRpdmVUZXN0RGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1ZyA9IGFOZWdhdGl2ZVRlc3REYXRlLnRvRGF0ZVN0cmluZygpICE9PSAnTW9uIEphbiAwMSAtNDU4NzUnO1xuICAgICAgICBoYXNUb1N0cmluZ0Zvcm1hdEJ1ZyA9ICEoL15XZWQgRGVjIDA5IDIwMTUgXFxkXFxkOlxcZFxcZDpcXGRcXGQgR01UWy0rXVxcZFxcZFxcZFxcZCg/OiB8JCkvKS50ZXN0KFN0cmluZyhhUG9zaXRpdmVUZXN0RGF0ZSkpO1xuICAgIH1cblxuICAgIHZhciBvcmlnaW5hbEdldEZ1bGxZZWFyID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldEZ1bGxZZWFyKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRNb250aCA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRNb250aCk7XG4gICAgdmFyIG9yaWdpbmFsR2V0RGF0ZSA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXREYXRlKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENGdWxsWWVhciA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENGdWxsWWVhcik7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDTW9udGggPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTW9udGgpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ0RhdGUgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDRGF0ZSk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDRGF5ID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFVUQ0RheSk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDSG91cnMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDSG91cnMpO1xuICAgIHZhciBvcmlnaW5hbEdldFVUQ01pbnV0ZXMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTWludXRlcyk7XG4gICAgdmFyIG9yaWdpbmFsR2V0VVRDU2Vjb25kcyA9IGNhbGwuYmluZChEYXRlLnByb3RvdHlwZS5nZXRVVENTZWNvbmRzKTtcbiAgICB2YXIgb3JpZ2luYWxHZXRVVENNaWxsaXNlY29uZHMgPSBjYWxsLmJpbmQoRGF0ZS5wcm90b3R5cGUuZ2V0VVRDTWlsbGlzZWNvbmRzKTtcbiAgICB2YXIgZGF5TmFtZSA9IFsnU3VuJywgJ01vbicsICdUdWUnLCAnV2VkJywgJ1RodScsICdGcmknLCAnU2F0J107XG4gICAgdmFyIG1vbnRoTmFtZSA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLCAnT2N0JywgJ05vdicsICdEZWMnXTtcbiAgICB2YXIgZGF5c0luTW9udGggPSBmdW5jdGlvbiBkYXlzSW5Nb250aChtb250aCwgeWVhcikge1xuICAgICAgICByZXR1cm4gb3JpZ2luYWxHZXREYXRlKG5ldyBEYXRlKHllYXIsIG1vbnRoLCAwKSk7XG4gICAgfTtcblxuICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZS5wcm90b3R5cGUsIHtcbiAgICAgICAgZ2V0RnVsbFllYXI6IGZ1bmN0aW9uIGdldEZ1bGxZZWFyKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBvcmlnaW5hbEdldE1vbnRoKHRoaXMpID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWVhciArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4geWVhcjtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0TW9udGg6IGZ1bmN0aW9uIGdldE1vbnRoKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0TW9udGgodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgbW9udGggPiAxMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG1vbnRoO1xuICAgICAgICB9LFxuICAgICAgICBnZXREYXRlOiBmdW5jdGlvbiBnZXREYXRlKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciB5ZWFyID0gb3JpZ2luYWxHZXRGdWxsWWVhcih0aGlzKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IG9yaWdpbmFsR2V0TW9udGgodGhpcyk7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG9yaWdpbmFsR2V0RGF0ZSh0aGlzKTtcbiAgICAgICAgICAgIGlmICh5ZWFyIDwgMCAmJiBtb250aCA+IDExKSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSAxMikge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdmFyIGRheXMgPSBkYXlzSW5Nb250aCgwLCB5ZWFyICsgMSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIChkYXlzIC0gZGF0ZSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVUQ0Z1bGxZZWFyOiBmdW5jdGlvbiBnZXRVVENGdWxsWWVhcigpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgb3JpZ2luYWxHZXRVVENNb250aCh0aGlzKSA+IDExKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHllYXIgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHllYXI7XG4gICAgICAgIH0sXG4gICAgICAgIGdldFVUQ01vbnRoOiBmdW5jdGlvbiBnZXRVVENNb250aCgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgaWYgKHllYXIgPCAwICYmIG1vbnRoID4gMTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBtb250aDtcbiAgICAgICAgfSxcbiAgICAgICAgZ2V0VVRDRGF0ZTogZnVuY3Rpb24gZ2V0VVRDRGF0ZSgpIHtcbiAgICAgICAgICAgIGlmICghdGhpcyB8fCAhKHRoaXMgaW5zdGFuY2VvZiBEYXRlKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3RoaXMgaXMgbm90IGEgRGF0ZSBvYmplY3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgeWVhciA9IG9yaWdpbmFsR2V0VVRDRnVsbFllYXIodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyk7XG4gICAgICAgICAgICBpZiAoeWVhciA8IDAgJiYgbW9udGggPiAxMSkge1xuICAgICAgICAgICAgICAgIGlmIChtb250aCA9PT0gMTIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXlzID0gZGF5c0luTW9udGgoMCwgeWVhciArIDEpO1xuICAgICAgICAgICAgICAgIHJldHVybiAoZGF5cyAtIGRhdGUpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkYXRlO1xuICAgICAgICB9XG4gICAgfSwgaGFzTmVnYXRpdmVNb250aFllYXJCdWcpO1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgICAgICB0b1VUQ1N0cmluZzogZnVuY3Rpb24gdG9VVENTdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMgfHwgISh0aGlzIGluc3RhbmNlb2YgRGF0ZSkpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0aGlzIGlzIG5vdCBhIERhdGUgb2JqZWN0LicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGRheSA9IG9yaWdpbmFsR2V0VVRDRGF5KHRoaXMpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyk7XG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldFVUQ0Z1bGxZZWFyKHRoaXMpO1xuICAgICAgICAgICAgdmFyIGhvdXIgPSBvcmlnaW5hbEdldFVUQ0hvdXJzKHRoaXMpO1xuICAgICAgICAgICAgdmFyIG1pbnV0ZSA9IG9yaWdpbmFsR2V0VVRDTWludXRlcyh0aGlzKTtcbiAgICAgICAgICAgIHZhciBzZWNvbmQgPSBvcmlnaW5hbEdldFVUQ1NlY29uZHModGhpcyk7XG4gICAgICAgICAgICByZXR1cm4gZGF5TmFtZVtkYXldICsgJywgJ1xuICAgICAgICAgICAgICAgICsgKGRhdGUgPCAxMCA/ICcwJyArIGRhdGUgOiBkYXRlKSArICcgJ1xuICAgICAgICAgICAgICAgICsgbW9udGhOYW1lW21vbnRoXSArICcgJ1xuICAgICAgICAgICAgICAgICsgeWVhciArICcgJ1xuICAgICAgICAgICAgICAgICsgKGhvdXIgPCAxMCA/ICcwJyArIGhvdXIgOiBob3VyKSArICc6J1xuICAgICAgICAgICAgICAgICsgKG1pbnV0ZSA8IDEwID8gJzAnICsgbWludXRlIDogbWludXRlKSArICc6J1xuICAgICAgICAgICAgICAgICsgKHNlY29uZCA8IDEwID8gJzAnICsgc2Vjb25kIDogc2Vjb25kKSArICcgR01UJztcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnIHx8IGhhc1RvVVRDU3RyaW5nRm9ybWF0QnVnKTtcblxuICAgIC8vIE9wZXJhIDEyIGhhcyBgLGBcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGUucHJvdG90eXBlLCB7XG4gICAgICAgIHRvRGF0ZVN0cmluZzogZnVuY3Rpb24gdG9EYXRlU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgcmV0dXJuIGRheU5hbWVbZGF5XSArICcgJ1xuICAgICAgICAgICAgICAgICsgbW9udGhOYW1lW21vbnRoXSArICcgJ1xuICAgICAgICAgICAgICAgICsgKGRhdGUgPCAxMCA/ICcwJyArIGRhdGUgOiBkYXRlKSArICcgJ1xuICAgICAgICAgICAgICAgICsgeWVhcjtcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlTW9udGhZZWFyQnVnIHx8IGhhc1RvRGF0ZVN0cmluZ0Zvcm1hdEJ1Zyk7XG5cbiAgICAvLyBjYW4ndCB1c2UgZGVmaW5lUHJvcGVydGllcyBoZXJlIGJlY2F1c2Ugb2YgdG9TdHJpbmcgZW51bWVyYXRpb24gaXNzdWUgaW4gSUUgPD0gOFxuICAgIGlmIChoYXNOZWdhdGl2ZU1vbnRoWWVhckJ1ZyB8fCBoYXNUb1N0cmluZ0Zvcm1hdEJ1Zykge1xuICAgICAgICBEYXRlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzIHx8ICEodGhpcyBpbnN0YW5jZW9mIERhdGUpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndGhpcyBpcyBub3QgYSBEYXRlIG9iamVjdC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkYXkgPSB0aGlzLmdldERheSgpO1xuICAgICAgICAgICAgdmFyIGRhdGUgPSB0aGlzLmdldERhdGUoKTtcbiAgICAgICAgICAgIHZhciBtb250aCA9IHRoaXMuZ2V0TW9udGgoKTtcbiAgICAgICAgICAgIHZhciB5ZWFyID0gdGhpcy5nZXRGdWxsWWVhcigpO1xuICAgICAgICAgICAgdmFyIGhvdXIgPSB0aGlzLmdldEhvdXJzKCk7XG4gICAgICAgICAgICB2YXIgbWludXRlID0gdGhpcy5nZXRNaW51dGVzKCk7XG4gICAgICAgICAgICB2YXIgc2Vjb25kID0gdGhpcy5nZXRTZWNvbmRzKCk7XG4gICAgICAgICAgICB2YXIgdGltZXpvbmVPZmZzZXQgPSB0aGlzLmdldFRpbWV6b25lT2Zmc2V0KCk7XG4gICAgICAgICAgICB2YXIgaG91cnNPZmZzZXQgPSBNYXRoLmZsb29yKE1hdGguYWJzKHRpbWV6b25lT2Zmc2V0KSAvIDYwKTtcbiAgICAgICAgICAgIHZhciBtaW51dGVzT2Zmc2V0ID0gTWF0aC5mbG9vcihNYXRoLmFicyh0aW1lem9uZU9mZnNldCkgJSA2MCk7XG4gICAgICAgICAgICByZXR1cm4gZGF5TmFtZVtkYXldICsgJyAnXG4gICAgICAgICAgICAgICAgKyBtb250aE5hbWVbbW9udGhdICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoZGF0ZSA8IDEwID8gJzAnICsgZGF0ZSA6IGRhdGUpICsgJyAnXG4gICAgICAgICAgICAgICAgKyB5ZWFyICsgJyAnXG4gICAgICAgICAgICAgICAgKyAoaG91ciA8IDEwID8gJzAnICsgaG91ciA6IGhvdXIpICsgJzonXG4gICAgICAgICAgICAgICAgKyAobWludXRlIDwgMTAgPyAnMCcgKyBtaW51dGUgOiBtaW51dGUpICsgJzonXG4gICAgICAgICAgICAgICAgKyAoc2Vjb25kIDwgMTAgPyAnMCcgKyBzZWNvbmQgOiBzZWNvbmQpICsgJyBHTVQnXG4gICAgICAgICAgICAgICAgKyAodGltZXpvbmVPZmZzZXQgPiAwID8gJy0nIDogJysnKVxuICAgICAgICAgICAgICAgICsgKGhvdXJzT2Zmc2V0IDwgMTAgPyAnMCcgKyBob3Vyc09mZnNldCA6IGhvdXJzT2Zmc2V0KVxuICAgICAgICAgICAgICAgICsgKG1pbnV0ZXNPZmZzZXQgPCAxMCA/ICcwJyArIG1pbnV0ZXNPZmZzZXQgOiBtaW51dGVzT2Zmc2V0KTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHN1cHBvcnRzRGVzY3JpcHRvcnMpIHtcbiAgICAgICAgICAgICRPYmplY3QuZGVmaW5lUHJvcGVydHkoRGF0ZS5wcm90b3R5cGUsICd0b1N0cmluZycsIHtcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjkuNS40M1xuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40M1xuICAgIC8vIFRoaXMgZnVuY3Rpb24gcmV0dXJucyBhIFN0cmluZyB2YWx1ZSByZXByZXNlbnQgdGhlIGluc3RhbmNlIGluIHRpbWVcbiAgICAvLyByZXByZXNlbnRlZCBieSB0aGlzIERhdGUgb2JqZWN0LiBUaGUgZm9ybWF0IG9mIHRoZSBTdHJpbmcgaXMgdGhlIERhdGUgVGltZVxuICAgIC8vIHN0cmluZyBmb3JtYXQgZGVmaW5lZCBpbiAxNS45LjEuMTUuIEFsbCBmaWVsZHMgYXJlIHByZXNlbnQgaW4gdGhlIFN0cmluZy5cbiAgICAvLyBUaGUgdGltZSB6b25lIGlzIGFsd2F5cyBVVEMsIGRlbm90ZWQgYnkgdGhlIHN1ZmZpeCBaLiBJZiB0aGUgdGltZSB2YWx1ZSBvZlxuICAgIC8vIHRoaXMgb2JqZWN0IGlzIG5vdCBhIGZpbml0ZSBOdW1iZXIgYSBSYW5nZUVycm9yIGV4Y2VwdGlvbiBpcyB0aHJvd24uXG4gICAgdmFyIG5lZ2F0aXZlRGF0ZSA9IC02MjE5ODc1NTIwMDAwMDtcbiAgICB2YXIgbmVnYXRpdmVZZWFyU3RyaW5nID0gJy0wMDAwMDEnO1xuICAgIHZhciBoYXNOZWdhdGl2ZURhdGVCdWcgPSBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyAmJiBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSVNPU3RyaW5nKCkuaW5kZXhPZihuZWdhdGl2ZVllYXJTdHJpbmcpID09PSAtMTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBtYXgtbGVuXG4gICAgdmFyIGhhc1NhZmFyaTUxRGF0ZUJ1ZyA9IERhdGUucHJvdG90eXBlLnRvSVNPU3RyaW5nICYmIG5ldyBEYXRlKC0xKS50b0lTT1N0cmluZygpICE9PSAnMTk2OS0xMi0zMVQyMzo1OTo1OS45OTlaJztcblxuICAgIHZhciBnZXRUaW1lID0gY2FsbC5iaW5kKERhdGUucHJvdG90eXBlLmdldFRpbWUpO1xuXG4gICAgZGVmaW5lUHJvcGVydGllcyhEYXRlLnByb3RvdHlwZSwge1xuICAgICAgICB0b0lTT1N0cmluZzogZnVuY3Rpb24gdG9JU09TdHJpbmcoKSB7XG4gICAgICAgICAgICBpZiAoIWlzRmluaXRlKHRoaXMpIHx8ICFpc0Zpbml0ZShnZXRUaW1lKHRoaXMpKSkge1xuICAgICAgICAgICAgICAgIC8vIEFkb3BlIFBob3Rvc2hvcCByZXF1aXJlcyB0aGUgc2Vjb25kIGNoZWNrLlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZyBjYWxsZWQgb24gbm9uLWZpbml0ZSB2YWx1ZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHllYXIgPSBvcmlnaW5hbEdldFVUQ0Z1bGxZZWFyKHRoaXMpO1xuXG4gICAgICAgICAgICB2YXIgbW9udGggPSBvcmlnaW5hbEdldFVUQ01vbnRoKHRoaXMpO1xuICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9lcy1zaGltcy9lczUtc2hpbS9pc3N1ZXMvMTExXG4gICAgICAgICAgICB5ZWFyICs9IE1hdGguZmxvb3IobW9udGggLyAxMik7XG4gICAgICAgICAgICBtb250aCA9ICgobW9udGggJSAxMikgKyAxMikgJSAxMjtcblxuICAgICAgICAgICAgLy8gdGhlIGRhdGUgdGltZSBzdHJpbmcgZm9ybWF0IGlzIHNwZWNpZmllZCBpbiAxNS45LjEuMTUuXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW1xuICAgICAgICAgICAgICAgIG1vbnRoICsgMSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ0RhdGUodGhpcyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHZXRVVENIb3Vycyh0aGlzKSxcbiAgICAgICAgICAgICAgICBvcmlnaW5hbEdldFVUQ01pbnV0ZXModGhpcyksXG4gICAgICAgICAgICAgICAgb3JpZ2luYWxHZXRVVENTZWNvbmRzKHRoaXMpXG4gICAgICAgICAgICBdO1xuICAgICAgICAgICAgeWVhciA9IChcbiAgICAgICAgICAgICAgICAoeWVhciA8IDAgPyAnLScgOiAoeWVhciA+IDk5OTkgPyAnKycgOiAnJykpXG4gICAgICAgICAgICAgICAgKyBzdHJTbGljZSgnMDAwMDAnICsgTWF0aC5hYnMoeWVhciksICgwIDw9IHllYXIgJiYgeWVhciA8PSA5OTk5KSA/IC00IDogLTYpXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdC5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgIC8vIHBhZCBtb250aHMsIGRheXMsIGhvdXJzLCBtaW51dGVzLCBhbmQgc2Vjb25kcyB0byBoYXZlIHR3byBkaWdpdHMuXG4gICAgICAgICAgICAgICAgcmVzdWx0W2ldID0gc3RyU2xpY2UoJzAwJyArIHJlc3VsdFtpXSwgLTIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gcGFkIG1pbGxpc2Vjb25kcyB0byBoYXZlIHRocmVlIGRpZ2l0cy5cbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgeWVhciArICctJyArIGFycmF5U2xpY2UocmVzdWx0LCAwLCAyKS5qb2luKCctJylcbiAgICAgICAgICAgICAgICArICdUJyArIGFycmF5U2xpY2UocmVzdWx0LCAyKS5qb2luKCc6JykgKyAnLidcbiAgICAgICAgICAgICAgICArIHN0clNsaWNlKCcwMDAnICsgb3JpZ2luYWxHZXRVVENNaWxsaXNlY29uZHModGhpcyksIC0zKSArICdaJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc05lZ2F0aXZlRGF0ZUJ1ZyB8fCBoYXNTYWZhcmk1MURhdGVCdWcpO1xuXG4gICAgLy8gRVM1IDE1LjkuNS40NFxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNS40NFxuICAgIC8vIFRoaXMgZnVuY3Rpb24gcHJvdmlkZXMgYSBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgYSBEYXRlIG9iamVjdCBmb3IgdXNlIGJ5XG4gICAgLy8gSlNPTi5zdHJpbmdpZnkgKDE1LjEyLjMpLlxuICAgIHZhciBkYXRlVG9KU09OSXNTdXBwb3J0ZWQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIERhdGUucHJvdG90eXBlLnRvSlNPTlxuICAgICAgICAgICAgICAgICYmIG5ldyBEYXRlKE5hTikudG9KU09OKCkgPT09IG51bGxcbiAgICAgICAgICAgICAgICAmJiBuZXcgRGF0ZShuZWdhdGl2ZURhdGUpLnRvSlNPTigpLmluZGV4T2YobmVnYXRpdmVZZWFyU3RyaW5nKSAhPT0gLTFcbiAgICAgICAgICAgICAgICAmJiBEYXRlLnByb3RvdHlwZS50b0pTT04uY2FsbCh7IC8vIGdlbmVyaWNcbiAgICAgICAgICAgICAgICAgICAgdG9JU09TdHJpbmc6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfSgpKTtcbiAgICBpZiAoIWRhdGVUb0pTT05Jc1N1cHBvcnRlZCkge1xuICAgICAgICBEYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiB0b0pTT04oa2V5KSB7XG4gICAgICAgICAgICAvLyBXaGVuIHRoZSB0b0pTT04gbWV0aG9kIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50IGtleSwgdGhlIGZvbGxvd2luZ1xuICAgICAgICAgICAgLy8gc3RlcHMgYXJlIHRha2VuOlxuXG4gICAgICAgICAgICAvLyAxLiAgTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0LCBnaXZpbmcgaXQgdGhlIHRoaXNcbiAgICAgICAgICAgIC8vIHZhbHVlIGFzIGl0cyBhcmd1bWVudC5cbiAgICAgICAgICAgIC8vIDIuIExldCB0diBiZSBFUy5Ub1ByaW1pdGl2ZShPLCBoaW50IE51bWJlcikuXG4gICAgICAgICAgICB2YXIgTyA9ICRPYmplY3QodGhpcyk7XG4gICAgICAgICAgICB2YXIgdHYgPSBFUy5Ub1ByaW1pdGl2ZShPKTtcbiAgICAgICAgICAgIC8vIDMuIElmIHR2IGlzIGEgTnVtYmVyIGFuZCBpcyBub3QgZmluaXRlLCByZXR1cm4gbnVsbC5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdHYgPT09ICdudW1iZXInICYmICFpc0Zpbml0ZSh0dikpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIDQuIExldCB0b0lTTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIFtbR2V0XV0gaW50ZXJuYWwgbWV0aG9kIG9mXG4gICAgICAgICAgICAvLyBPIHdpdGggYXJndW1lbnQgXCJ0b0lTT1N0cmluZ1wiLlxuICAgICAgICAgICAgdmFyIHRvSVNPID0gTy50b0lTT1N0cmluZztcbiAgICAgICAgICAgIC8vIDUuIElmIElzQ2FsbGFibGUodG9JU08pIGlzIGZhbHNlLCB0aHJvdyBhIFR5cGVFcnJvciBleGNlcHRpb24uXG4gICAgICAgICAgICBpZiAoIWlzQ2FsbGFibGUodG9JU08pKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9JU09TdHJpbmcgcHJvcGVydHkgaXMgbm90IGNhbGxhYmxlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyA2LiBSZXR1cm4gdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBbW0NhbGxdXSBpbnRlcm5hbCBtZXRob2Qgb2ZcbiAgICAgICAgICAgIC8vICB0b0lTTyB3aXRoIE8gYXMgdGhlIHRoaXMgdmFsdWUgYW5kIGFuIGVtcHR5IGFyZ3VtZW50IGxpc3QuXG4gICAgICAgICAgICByZXR1cm4gdG9JU08uY2FsbChPKTtcblxuICAgICAgICAgICAgLy8gTk9URSAxIFRoZSBhcmd1bWVudCBpcyBpZ25vcmVkLlxuXG4gICAgICAgICAgICAvLyBOT1RFIDIgVGhlIHRvSlNPTiBmdW5jdGlvbiBpcyBpbnRlbnRpb25hbGx5IGdlbmVyaWM7IGl0IGRvZXMgbm90XG4gICAgICAgICAgICAvLyByZXF1aXJlIHRoYXQgaXRzIHRoaXMgdmFsdWUgYmUgYSBEYXRlIG9iamVjdC4gVGhlcmVmb3JlLCBpdCBjYW4gYmVcbiAgICAgICAgICAgIC8vIHRyYW5zZmVycmVkIHRvIG90aGVyIGtpbmRzIG9mIG9iamVjdHMgZm9yIHVzZSBhcyBhIG1ldGhvZC4gSG93ZXZlcixcbiAgICAgICAgICAgIC8vIGl0IGRvZXMgcmVxdWlyZSB0aGF0IGFueSBzdWNoIG9iamVjdCBoYXZlIGEgdG9JU09TdHJpbmcgbWV0aG9kLiBBblxuICAgICAgICAgICAgLy8gb2JqZWN0IGlzIGZyZWUgdG8gdXNlIHRoZSBhcmd1bWVudCBrZXkgdG8gZmlsdGVyIGl0c1xuICAgICAgICAgICAgLy8gc3RyaW5naWZpY2F0aW9uLlxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEVTNSAxNS45LjQuMlxuICAgIC8vIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDE1LjkuNC4yXG4gICAgLy8gYmFzZWQgb24gd29yayBzaGFyZWQgYnkgRGFuaWVsIEZyaWVzZW4gKGRhbnRtYW4pXG4gICAgLy8gaHR0cDovL2dpc3QuZ2l0aHViLmNvbS8zMDMyNDlcbiAgICB2YXIgc3VwcG9ydHNFeHRlbmRlZFllYXJzID0gRGF0ZS5wYXJzZSgnKzAzMzY1OC0wOS0yN1QwMTo0Njo0MC4wMDBaJykgPT09IDFlMTU7XG4gICAgdmFyIGFjY2VwdHNJbnZhbGlkRGF0ZXMgPSAhaXNOYU4oRGF0ZS5wYXJzZSgnMjAxMi0wNC0wNFQyNDowMDowMC41MDBaJykpIHx8ICFpc05hTihEYXRlLnBhcnNlKCcyMDEyLTExLTMxVDIzOjU5OjU5LjAwMFonKSkgfHwgIWlzTmFOKERhdGUucGFyc2UoJzIwMTItMTItMzFUMjM6NTk6NjAuMDAwWicpKTtcbiAgICB2YXIgZG9lc05vdFBhcnNlWTJLTmV3WWVhciA9IGlzTmFOKERhdGUucGFyc2UoJzIwMDAtMDEtMDFUMDA6MDA6MDAuMDAwWicpKTtcbiAgICBpZiAoZG9lc05vdFBhcnNlWTJLTmV3WWVhciB8fCBhY2NlcHRzSW52YWxpZERhdGVzIHx8ICFzdXBwb3J0c0V4dGVuZGVkWWVhcnMpIHtcbiAgICAgICAgLy8gWFhYIGdsb2JhbCBhc3NpZ25tZW50IHdvbid0IHdvcmsgaW4gZW1iZWRkaW5ncyB0aGF0IHVzZVxuICAgICAgICAvLyBhbiBhbHRlcm5hdGUgb2JqZWN0IGZvciB0aGUgY29udGV4dC5cbiAgICAgICAgLyogZ2xvYmFsIERhdGU6IHRydWUgKi9cbiAgICAgICAgdmFyIG1heFNhZmVVbnNpZ25lZDMyQml0ID0gTWF0aC5wb3coMiwgMzEpIC0gMTtcbiAgICAgICAgdmFyIGhhc1NhZmFyaVNpZ25lZEludEJ1ZyA9IGlzQWN0dWFsTmFOKG5ldyBEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIDAsIG1heFNhZmVVbnNpZ25lZDMyQml0ICsgMSkuZ2V0VGltZSgpKTtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWdsb2JhbHMsIG5vLWdsb2JhbC1hc3NpZ25cbiAgICAgICAgRGF0ZSA9IChmdW5jdGlvbiAoTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgLy8gRGF0ZS5sZW5ndGggPT09IDdcbiAgICAgICAgICAgIHZhciBEYXRlU2hpbSA9IGZ1bmN0aW9uIERhdGUoWSwgTSwgRCwgaCwgbSwgcywgbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZURhdGUpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlY29uZHMgPSBzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbWlsbGlzID0gbXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNTYWZhcmlTaWduZWRJbnRCdWcgJiYgbGVuZ3RoID49IDcgJiYgbXMgPiBtYXhTYWZlVW5zaWduZWQzMkJpdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gd29yayBhcm91bmQgYSBTYWZhcmkgOC85IGJ1ZyB3aGVyZSBpdCB0cmVhdHMgdGhlIHNlY29uZHMgYXMgc2lnbmVkXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbXNUb1NoaWZ0ID0gTWF0aC5mbG9vcihtcyAvIG1heFNhZmVVbnNpZ25lZDMyQml0KSAqIG1heFNhZmVVbnNpZ25lZDMyQml0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHNUb1NoaWZ0ID0gTWF0aC5mbG9vcihtc1RvU2hpZnQgLyAxZTMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Vjb25kcyArPSBzVG9TaGlmdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbGxpcyAtPSBzVG9TaGlmdCAqIDFlMztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkYXRlID0gbGVuZ3RoID09PSAxICYmICRTdHJpbmcoWSkgPT09IFkgLy8gaXNTdHJpbmcoWSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGV4cGxpY2l0bHkgcGFzcyBpdCB0aHJvdWdoIHBhcnNlOlxuICAgICAgICAgICAgICAgICAgICAgICAgPyBuZXcgTmF0aXZlRGF0ZShEYXRlU2hpbS5wYXJzZShZKSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGhhdmUgdG8gbWFudWFsbHkgbWFrZSBjYWxscyBkZXBlbmRpbmcgb24gYXJndW1lbnRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGxlbmd0aCBoZXJlXG4gICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSA3ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSwgc2Vjb25kcywgbWlsbGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDYgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoLCBtLCBzZWNvbmRzKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSA1ID8gbmV3IE5hdGl2ZURhdGUoWSwgTSwgRCwgaCwgbSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDQgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBELCBoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDMgPyBuZXcgTmF0aXZlRGF0ZShZLCBNLCBEKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IGxlbmd0aCA+PSAyID8gbmV3IE5hdGl2ZURhdGUoWSwgTSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbGVuZ3RoID49IDEgPyBuZXcgTmF0aXZlRGF0ZShZIGluc3RhbmNlb2YgTmF0aXZlRGF0ZSA/ICtZIDogWSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG5ldyBOYXRpdmVEYXRlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0ZSA9IE5hdGl2ZURhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFpc1ByaW1pdGl2ZShkYXRlKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQcmV2ZW50IG1peHVwcyB3aXRoIHVuZml4ZWQgRGF0ZSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhkYXRlLCB7IGNvbnN0cnVjdG9yOiBEYXRlU2hpbSB9LCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRhdGU7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyAxNS45LjEuMTUgRGF0ZSBUaW1lIFN0cmluZyBGb3JtYXQuXG4gICAgICAgICAgICB2YXIgaXNvRGF0ZUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKCdeJ1xuICAgICAgICAgICAgICAgICsgJyhcXFxcZHs0fXxbKy1dXFxcXGR7Nn0pJyAvLyBmb3VyLWRpZ2l0IHllYXIgY2FwdHVyZSBvciBzaWduICsgNi1kaWdpdCBleHRlbmRlZCB5ZWFyXG4gICAgICAgICAgICAgICAgKyAnKD86LShcXFxcZHsyfSknIC8vIG9wdGlvbmFsIG1vbnRoIGNhcHR1cmVcbiAgICAgICAgICAgICAgICArICcoPzotKFxcXFxkezJ9KScgLy8gb3B0aW9uYWwgZGF5IGNhcHR1cmVcbiAgICAgICAgICAgICAgICArICcoPzonIC8vIGNhcHR1cmUgaG91cnM6bWludXRlczpzZWNvbmRzLm1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICArICdUKFxcXFxkezJ9KScgLy8gaG91cnMgY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICArICc6KFxcXFxkezJ9KScgLy8gbWludXRlcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyg/OicgLy8gb3B0aW9uYWwgOnNlY29uZHMubWlsbGlzZWNvbmRzXG4gICAgICAgICAgICAgICAgICAgICAgICArICc6KFxcXFxkezJ9KScgLy8gc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICAgICArICcoPzooXFxcXC5cXFxcZHsxLH0pKT8nIC8vIG1pbGxpc2Vjb25kcyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyk/J1xuICAgICAgICAgICAgICAgICsgJygnIC8vIGNhcHR1cmUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgKyAnWnwnIC8vIFVUQyBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyg/OicgLy8gb2Zmc2V0IHNwZWNpZmllciArLy1ob3VyczptaW51dGVzXG4gICAgICAgICAgICAgICAgICAgICAgICArICcoWy0rXSknIC8vIHNpZ24gY2FwdHVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgKyAnKFxcXFxkezJ9KScgLy8gaG91cnMgb2Zmc2V0IGNhcHR1cmVcbiAgICAgICAgICAgICAgICAgICAgICAgICsgJzooXFxcXGR7Mn0pJyAvLyBtaW51dGVzIG9mZnNldCBjYXB0dXJlXG4gICAgICAgICAgICAgICAgICAgICsgJyknXG4gICAgICAgICAgICAgICAgKyAnKT8pPyk/KT8nXG4gICAgICAgICAgICArICckJyk7XG5cbiAgICAgICAgICAgIHZhciBtb250aHMgPSBbMCwgMzEsIDU5LCA5MCwgMTIwLCAxNTEsIDE4MSwgMjEyLCAyNDMsIDI3MywgMzA0LCAzMzQsIDM2NV07XG5cbiAgICAgICAgICAgIHZhciBkYXlGcm9tTW9udGggPSBmdW5jdGlvbiBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdCA9IG1vbnRoID4gMSA/IDEgOiAwO1xuICAgICAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgICAgICAgIG1vbnRoc1ttb250aF1cbiAgICAgICAgICAgICAgICAgICAgKyBNYXRoLmZsb29yKCh5ZWFyIC0gMTk2OSArIHQpIC8gNClcbiAgICAgICAgICAgICAgICAgICAgLSBNYXRoLmZsb29yKCh5ZWFyIC0gMTkwMSArIHQpIC8gMTAwKVxuICAgICAgICAgICAgICAgICAgICArIE1hdGguZmxvb3IoKHllYXIgLSAxNjAxICsgdCkgLyA0MDApXG4gICAgICAgICAgICAgICAgICAgICsgKDM2NSAqICh5ZWFyIC0gMTk3MCkpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHZhciB0b1VUQyA9IGZ1bmN0aW9uIHRvVVRDKHQpIHtcbiAgICAgICAgICAgICAgICB2YXIgcyA9IDA7XG4gICAgICAgICAgICAgICAgdmFyIG1zID0gdDtcbiAgICAgICAgICAgICAgICBpZiAoaGFzU2FmYXJpU2lnbmVkSW50QnVnICYmIG1zID4gbWF4U2FmZVVuc2lnbmVkMzJCaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gd29yayBhcm91bmQgYSBTYWZhcmkgOC85IGJ1ZyB3aGVyZSBpdCB0cmVhdHMgdGhlIHNlY29uZHMgYXMgc2lnbmVkXG4gICAgICAgICAgICAgICAgICAgIHZhciBtc1RvU2hpZnQgPSBNYXRoLmZsb29yKG1zIC8gbWF4U2FmZVVuc2lnbmVkMzJCaXQpICogbWF4U2FmZVVuc2lnbmVkMzJCaXQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzVG9TaGlmdCA9IE1hdGguZmxvb3IobXNUb1NoaWZ0IC8gMWUzKTtcbiAgICAgICAgICAgICAgICAgICAgcyArPSBzVG9TaGlmdDtcbiAgICAgICAgICAgICAgICAgICAgbXMgLT0gc1RvU2hpZnQgKiAxZTM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiAkTnVtYmVyKG5ldyBOYXRpdmVEYXRlKDE5NzAsIDAsIDEsIDAsIDAsIHMsIG1zKSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBDb3B5IGFueSBjdXN0b20gbWV0aG9kcyBhIDNyZCBwYXJ0eSBsaWJyYXJ5IG1heSBoYXZlIGFkZGVkXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gTmF0aXZlRGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmIChvd25zKE5hdGl2ZURhdGUsIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgRGF0ZVNoaW1ba2V5XSA9IE5hdGl2ZURhdGVba2V5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENvcHkgXCJuYXRpdmVcIiBtZXRob2RzIGV4cGxpY2l0bHk7IHRoZXkgbWF5IGJlIG5vbi1lbnVtZXJhYmxlXG4gICAgICAgICAgICBkZWZpbmVQcm9wZXJ0aWVzKERhdGVTaGltLCB7XG4gICAgICAgICAgICAgICAgbm93OiBOYXRpdmVEYXRlLm5vdyxcbiAgICAgICAgICAgICAgICBVVEM6IE5hdGl2ZURhdGUuVVRDXG4gICAgICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgICAgIERhdGVTaGltLnByb3RvdHlwZSA9IE5hdGl2ZURhdGUucHJvdG90eXBlO1xuICAgICAgICAgICAgZGVmaW5lUHJvcGVydGllcyhEYXRlU2hpbS5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IERhdGVTaGltIH0sIHRydWUpO1xuXG4gICAgICAgICAgICAvLyBVcGdyYWRlIERhdGUucGFyc2UgdG8gaGFuZGxlIHNpbXBsaWZpZWQgSVNPIDg2MDEgc3RyaW5nc1xuICAgICAgICAgICAgdmFyIHBhcnNlU2hpbSA9IGZ1bmN0aW9uIHBhcnNlKHN0cmluZykge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGlzb0RhdGVFeHByZXNzaW9uLmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcGFyc2UgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcywgYW5kIG1pbGxpc2Vjb25kc1xuICAgICAgICAgICAgICAgICAgICAvLyBwcm92aWRlIGRlZmF1bHQgdmFsdWVzIGlmIG5lY2Vzc2FyeVxuICAgICAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aGUgVVRDIG9mZnNldCBjb21wb25lbnRcbiAgICAgICAgICAgICAgICAgICAgdmFyIHllYXIgPSAkTnVtYmVyKG1hdGNoWzFdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vbnRoID0gJE51bWJlcihtYXRjaFsyXSB8fCAxKSAtIDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXkgPSAkTnVtYmVyKG1hdGNoWzNdIHx8IDEpIC0gMSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvdXIgPSAkTnVtYmVyKG1hdGNoWzRdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlID0gJE51bWJlcihtYXRjaFs1XSB8fCAwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlY29uZCA9ICROdW1iZXIobWF0Y2hbNl0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICBtaWxsaXNlY29uZCA9IE1hdGguZmxvb3IoJE51bWJlcihtYXRjaFs3XSB8fCAwKSAqIDEwMDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2hlbiB0aW1lIHpvbmUgaXMgbWlzc2VkLCBsb2NhbCBvZmZzZXQgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIChFUyA1LjEgYnVnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2VlIGh0dHBzOi8vYnVncy5lY21hc2NyaXB0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTEyXG4gICAgICAgICAgICAgICAgICAgICAgICBpc0xvY2FsVGltZSA9IEJvb2xlYW4obWF0Y2hbNF0gJiYgIW1hdGNoWzhdKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpZ25PZmZzZXQgPSBtYXRjaFs5XSA9PT0gJy0nID8gMSA6IC0xLFxuICAgICAgICAgICAgICAgICAgICAgICAgaG91ck9mZnNldCA9ICROdW1iZXIobWF0Y2hbMTBdIHx8IDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWludXRlT2Zmc2V0ID0gJE51bWJlcihtYXRjaFsxMV0gfHwgMCksXG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgIHZhciBoYXNNaW51dGVzT3JTZWNvbmRzT3JNaWxsaXNlY29uZHMgPSBtaW51dGUgPiAwIHx8IHNlY29uZCA+IDAgfHwgbWlsbGlzZWNvbmQgPiAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBob3VyIDwgKGhhc01pbnV0ZXNPclNlY29uZHNPck1pbGxpc2Vjb25kcyA/IDI0IDogMjUpXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBtaW51dGUgPCA2MCAmJiBzZWNvbmQgPCA2MCAmJiBtaWxsaXNlY29uZCA8IDEwMDBcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG1vbnRoID4gLTEgJiYgbW9udGggPCAxMiAmJiBob3VyT2Zmc2V0IDwgMjRcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIG1pbnV0ZU9mZnNldCA8IDYwIC8vIGRldGVjdCBpbnZhbGlkIG9mZnNldHNcbiAgICAgICAgICAgICAgICAgICAgICAgICYmIGRheSA+IC0xXG4gICAgICAgICAgICAgICAgICAgICAgICAmJiBkYXkgPCAoZGF5RnJvbU1vbnRoKHllYXIsIG1vbnRoICsgMSkgLSBkYXlGcm9tTW9udGgoeWVhciwgbW9udGgpKVxuICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKGRheUZyb21Nb250aCh5ZWFyLCBtb250aCkgKyBkYXkpICogMjQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyBob3VyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKyAoaG91ck9mZnNldCAqIHNpZ25PZmZzZXQpXG4gICAgICAgICAgICAgICAgICAgICAgICApICogNjA7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSAoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICgocmVzdWx0ICsgbWludXRlICsgKG1pbnV0ZU9mZnNldCAqIHNpZ25PZmZzZXQpKSAqIDYwKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgc2Vjb25kXG4gICAgICAgICAgICAgICAgICAgICAgICApICogMTAwMCkgKyBtaWxsaXNlY29uZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0xvY2FsVGltZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IHRvVVRDKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoLTguNjRlMTUgPD0gcmVzdWx0ICYmIHJlc3VsdCA8PSA4LjY0ZTE1KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gTmF0aXZlRGF0ZS5wYXJzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlZmluZVByb3BlcnRpZXMoRGF0ZVNoaW0sIHsgcGFyc2U6IHBhcnNlU2hpbSB9KTtcblxuICAgICAgICAgICAgcmV0dXJuIERhdGVTaGltO1xuICAgICAgICB9KERhdGUpKTtcbiAgICAgICAgLyogZ2xvYmFsIERhdGU6IGZhbHNlICovXG4gICAgfVxuXG4gICAgLy8gRVM1IDE1LjkuNC40XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuOS40LjRcbiAgICBpZiAoIURhdGUubm93KSB7XG4gICAgICAgIERhdGUubm93ID0gZnVuY3Rpb24gbm93KCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vXG4gICAgLy8gTnVtYmVyXG4gICAgLy8gPT09PT09XG4gICAgLy9cblxuICAgIC8vIEVTNS4xIDE1LjcuNC41XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNy40LjVcbiAgICB2YXIgaGFzVG9GaXhlZEJ1Z3MgPSBOdW1iZXJQcm90b3R5cGUudG9GaXhlZCAmJiAoXG4gICAgICAgICgwLjAwMDA4KS50b0ZpeGVkKDMpICE9PSAnMC4wMDAnXG4gICAgICAgIHx8ICgwLjkpLnRvRml4ZWQoMCkgIT09ICcxJ1xuICAgICAgICB8fCAoMS4yNTUpLnRvRml4ZWQoMikgIT09ICcxLjI1J1xuICAgICAgICB8fCAoMTAwMDAwMDAwMDAwMDAwMDEyOCkudG9GaXhlZCgwKSAhPT0gJzEwMDAwMDAwMDAwMDAwMDAxMjgnXG4gICAgKTtcblxuICAgIHZhciB0b0ZpeGVkSGVscGVycyA9IHtcbiAgICAgICAgYmFzZTogMWU3LFxuICAgICAgICBzaXplOiA2LFxuICAgICAgICBkYXRhOiBbMCwgMCwgMCwgMCwgMCwgMF0sXG4gICAgICAgIG11bHRpcGx5OiBmdW5jdGlvbiBtdWx0aXBseShuLCBjKSB7XG4gICAgICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICAgICAgdmFyIGMyID0gYztcbiAgICAgICAgICAgIHdoaWxlICgrK2kgPCB0b0ZpeGVkSGVscGVycy5zaXplKSB7XG4gICAgICAgICAgICAgICAgYzIgKz0gbiAqIHRvRml4ZWRIZWxwZXJzLmRhdGFbaV07XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGF0YVtpXSA9IGMyICUgdG9GaXhlZEhlbHBlcnMuYmFzZTtcbiAgICAgICAgICAgICAgICBjMiA9IE1hdGguZmxvb3IoYzIgLyB0b0ZpeGVkSGVscGVycy5iYXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZGl2aWRlOiBmdW5jdGlvbiBkaXZpZGUobikge1xuICAgICAgICAgICAgdmFyIGkgPSB0b0ZpeGVkSGVscGVycy5zaXplO1xuICAgICAgICAgICAgdmFyIGMgPSAwO1xuICAgICAgICAgICAgd2hpbGUgKC0taSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgYyArPSB0b0ZpeGVkSGVscGVycy5kYXRhW2ldO1xuICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLmRhdGFbaV0gPSBNYXRoLmZsb29yKGMgLyBuKTtcbiAgICAgICAgICAgICAgICBjID0gKGMgJSBuKSAqIHRvRml4ZWRIZWxwZXJzLmJhc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG51bVRvU3RyaW5nOiBmdW5jdGlvbiBudW1Ub1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBpID0gdG9GaXhlZEhlbHBlcnMuc2l6ZTtcbiAgICAgICAgICAgIHZhciBzID0gJyc7XG4gICAgICAgICAgICB3aGlsZSAoLS1pID49IDApIHtcbiAgICAgICAgICAgICAgICBpZiAocyAhPT0gJycgfHwgaSA9PT0gMCB8fCB0b0ZpeGVkSGVscGVycy5kYXRhW2ldICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ID0gJFN0cmluZyh0b0ZpeGVkSGVscGVycy5kYXRhW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHMgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzID0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHMgKz0gc3RyU2xpY2UoJzAwMDAwMDAnLCAwLCA3IC0gdC5sZW5ndGgpICsgdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzO1xuICAgICAgICB9LFxuICAgICAgICBwb3c6IGZ1bmN0aW9uIHBvdyh4LCBuLCBhY2MpIHtcbiAgICAgICAgICAgIHJldHVybiAobiA9PT0gMCA/IGFjYyA6IChuICUgMiA9PT0gMSA/IHBvdyh4LCBuIC0gMSwgYWNjICogeCkgOiBwb3coeCAqIHgsIG4gLyAyLCBhY2MpKSk7XG4gICAgICAgIH0sXG4gICAgICAgIGxvZzogZnVuY3Rpb24gbG9nKHgpIHtcbiAgICAgICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgICAgIHZhciB4MiA9IHg7XG4gICAgICAgICAgICB3aGlsZSAoeDIgPj0gNDA5Nikge1xuICAgICAgICAgICAgICAgIG4gKz0gMTI7XG4gICAgICAgICAgICAgICAgeDIgLz0gNDA5NjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHdoaWxlICh4MiA+PSAyKSB7XG4gICAgICAgICAgICAgICAgbiArPSAxO1xuICAgICAgICAgICAgICAgIHgyIC89IDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbjtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICB2YXIgdG9GaXhlZFNoaW0gPSBmdW5jdGlvbiB0b0ZpeGVkKGZyYWN0aW9uRGlnaXRzKSB7XG4gICAgICAgIHZhciBmLCB4LCBzLCBtLCBlLCB6LCBqLCBrO1xuXG4gICAgICAgIC8vIFRlc3QgZm9yIE5hTiBhbmQgcm91bmQgZnJhY3Rpb25EaWdpdHMgZG93blxuICAgICAgICBmID0gJE51bWJlcihmcmFjdGlvbkRpZ2l0cyk7XG4gICAgICAgIGYgPSBpc0FjdHVhbE5hTihmKSA/IDAgOiBNYXRoLmZsb29yKGYpO1xuXG4gICAgICAgIGlmIChmIDwgMCB8fCBmID4gMjApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdOdW1iZXIudG9GaXhlZCBjYWxsZWQgd2l0aCBpbnZhbGlkIG51bWJlciBvZiBkZWNpbWFscycpO1xuICAgICAgICB9XG5cbiAgICAgICAgeCA9ICROdW1iZXIodGhpcyk7XG5cbiAgICAgICAgaWYgKGlzQWN0dWFsTmFOKHgpKSB7XG4gICAgICAgICAgICByZXR1cm4gJ05hTic7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBpdCBpcyB0b28gYmlnIG9yIHNtYWxsLCByZXR1cm4gdGhlIHN0cmluZyB2YWx1ZSBvZiB0aGUgbnVtYmVyXG4gICAgICAgIGlmICh4IDw9IC0xZTIxIHx8IHggPj0gMWUyMSkge1xuICAgICAgICAgICAgcmV0dXJuICRTdHJpbmcoeCk7XG4gICAgICAgIH1cblxuICAgICAgICBzID0gJyc7XG5cbiAgICAgICAgaWYgKHggPCAwKSB7XG4gICAgICAgICAgICBzID0gJy0nO1xuICAgICAgICAgICAgeCA9IC14O1xuICAgICAgICB9XG5cbiAgICAgICAgbSA9ICcwJztcblxuICAgICAgICBpZiAoeCA+IDFlLTIxKSB7XG4gICAgICAgICAgICAvLyAxZS0yMSA8IHggPCAxZTIxXG4gICAgICAgICAgICAvLyAtNzAgPCBsb2cyKHgpIDwgNzBcbiAgICAgICAgICAgIGUgPSB0b0ZpeGVkSGVscGVycy5sb2coeCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCA2OSwgMSkpIC0gNjk7XG4gICAgICAgICAgICB6ID0gKGUgPCAwID8geCAqIHRvRml4ZWRIZWxwZXJzLnBvdygyLCAtZSwgMSkgOiB4IC8gdG9GaXhlZEhlbHBlcnMucG93KDIsIGUsIDEpKTtcbiAgICAgICAgICAgIHogKj0gMHgxMDAwMDAwMDAwMDAwMDsgLy8gTWF0aC5wb3coMiwgNTIpO1xuICAgICAgICAgICAgZSA9IDUyIC0gZTtcblxuICAgICAgICAgICAgLy8gLTE4IDwgZSA8IDEyMlxuICAgICAgICAgICAgLy8geCA9IHogLyAyIF4gZVxuICAgICAgICAgICAgaWYgKGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMCwgeik7XG4gICAgICAgICAgICAgICAgaiA9IGY7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHRvRml4ZWRIZWxwZXJzLm11bHRpcGx5KDFlNywgMCk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gNztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSh0b0ZpeGVkSGVscGVycy5wb3coMTAsIGosIDEpLCAwKTtcbiAgICAgICAgICAgICAgICBqID0gZSAtIDE7XG5cbiAgICAgICAgICAgICAgICB3aGlsZSAoaiA+PSAyMykge1xuICAgICAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5kaXZpZGUoMSA8PCAyMyk7XG4gICAgICAgICAgICAgICAgICAgIGogLT0gMjM7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDEgPDwgaik7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMubXVsdGlwbHkoMSwgMSk7XG4gICAgICAgICAgICAgICAgdG9GaXhlZEhlbHBlcnMuZGl2aWRlKDIpO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgwLCB6KTtcbiAgICAgICAgICAgICAgICB0b0ZpeGVkSGVscGVycy5tdWx0aXBseSgxIDw8ICgtZSksIDApO1xuICAgICAgICAgICAgICAgIG0gPSB0b0ZpeGVkSGVscGVycy5udW1Ub1N0cmluZygpICsgc3RyU2xpY2UoJzAuMDAwMDAwMDAwMDAwMDAwMDAwMDAnLCAyLCAyICsgZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZiA+IDApIHtcbiAgICAgICAgICAgIGsgPSBtLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKGsgPD0gZikge1xuICAgICAgICAgICAgICAgIG0gPSBzICsgc3RyU2xpY2UoJzAuMDAwMDAwMDAwMDAwMDAwMDAwMCcsIDAsIGYgLSBrICsgMikgKyBtO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtID0gcyArIHN0clNsaWNlKG0sIDAsIGsgLSBmKSArICcuJyArIHN0clNsaWNlKG0sIGsgLSBmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG0gPSBzICsgbTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtO1xuICAgIH07XG4gICAgZGVmaW5lUHJvcGVydGllcyhOdW1iZXJQcm90b3R5cGUsIHsgdG9GaXhlZDogdG9GaXhlZFNoaW0gfSwgaGFzVG9GaXhlZEJ1Z3MpO1xuXG4gICAgdmFyIGhhc1RvUHJlY2lzaW9uVW5kZWZpbmVkQnVnID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiAxLjAudG9QcmVjaXNpb24odW5kZWZpbmVkKSA9PT0gJzEnO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH0oKSk7XG4gICAgdmFyIG9yaWdpbmFsVG9QcmVjaXNpb24gPSBOdW1iZXJQcm90b3R5cGUudG9QcmVjaXNpb247XG4gICAgZGVmaW5lUHJvcGVydGllcyhOdW1iZXJQcm90b3R5cGUsIHtcbiAgICAgICAgdG9QcmVjaXNpb246IGZ1bmN0aW9uIHRvUHJlY2lzaW9uKHByZWNpc2lvbikge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwcmVjaXNpb24gPT09ICd1bmRlZmluZWQnID8gb3JpZ2luYWxUb1ByZWNpc2lvbi5jYWxsKHRoaXMpIDogb3JpZ2luYWxUb1ByZWNpc2lvbi5jYWxsKHRoaXMsIHByZWNpc2lvbik7XG4gICAgICAgIH1cbiAgICB9LCBoYXNUb1ByZWNpc2lvblVuZGVmaW5lZEJ1Zyk7XG5cbiAgICAvL1xuICAgIC8vIFN0cmluZ1xuICAgIC8vID09PT09PVxuICAgIC8vXG5cbiAgICAvLyBFUzUgMTUuNS40LjE0XG4gICAgLy8gaHR0cDovL2VzNS5naXRodWIuY29tLyN4MTUuNS40LjE0XG5cbiAgICAvLyBbYnVnZml4LCBJRSBsdCA5LCBmaXJlZm94IDQsIEtvbnF1ZXJvciwgT3BlcmEsIG9ic2N1cmUgYnJvd3NlcnNdXG4gICAgLy8gTWFueSBicm93c2VycyBkbyBub3Qgc3BsaXQgcHJvcGVybHkgd2l0aCByZWd1bGFyIGV4cHJlc3Npb25zIG9yIHRoZXlcbiAgICAvLyBkbyBub3QgcGVyZm9ybSB0aGUgc3BsaXQgY29ycmVjdGx5IHVuZGVyIG9ic2N1cmUgY29uZGl0aW9ucy5cbiAgICAvLyBTZWUgaHR0cDovL2Jsb2cuc3RldmVubGV2aXRoYW4uY29tL2FyY2hpdmVzL2Nyb3NzLWJyb3dzZXItc3BsaXRcbiAgICAvLyBJJ3ZlIHRlc3RlZCBpbiBtYW55IGJyb3dzZXJzIGFuZCB0aGlzIHNlZW1zIHRvIGNvdmVyIHRoZSBkZXZpYW50IG9uZXM6XG4gICAgLy8gICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pIHNob3VsZCBiZSBbXCJcIiwgXCJcIl0sIG5vdCBbXCJcIl1cbiAgICAvLyAgICAnLicuc3BsaXQoLyguPykoLj8pLykgc2hvdWxkIGJlIFtcIlwiLCBcIi5cIiwgXCJcIiwgXCJcIl0sIG5vdCBbXCJcIiwgXCJcIl1cbiAgICAvLyAgICAndGVzc3QnLnNwbGl0KC8ocykqLykgc2hvdWxkIGJlIFtcInRcIiwgdW5kZWZpbmVkLCBcImVcIiwgXCJzXCIsIFwidFwiXSwgbm90XG4gICAgLy8gICAgICAgW3VuZGVmaW5lZCwgXCJ0XCIsIHVuZGVmaW5lZCwgXCJlXCIsIC4uLl1cbiAgICAvLyAgICAnJy5zcGxpdCgvLj8vKSBzaG91bGQgYmUgW10sIG5vdCBbXCJcIl1cbiAgICAvLyAgICAnLicuc3BsaXQoLygpKCkvKSBzaG91bGQgYmUgW1wiLlwiXSwgbm90IFtcIlwiLCBcIlwiLCBcIi5cIl1cblxuICAgIGlmIChcbiAgICAgICAgJ2FiJy5zcGxpdCgvKD86YWIpKi8pLmxlbmd0aCAhPT0gMlxuICAgICAgICB8fCAnLicuc3BsaXQoLyguPykoLj8pLykubGVuZ3RoICE9PSA0XG4gICAgICAgIHx8ICd0ZXNzdCcuc3BsaXQoLyhzKSovKVsxXSA9PT0gJ3QnXG4gICAgICAgIHx8ICd0ZXN0Jy5zcGxpdCgvKD86KS8sIC0xKS5sZW5ndGggIT09IDRcbiAgICAgICAgfHwgJycuc3BsaXQoLy4/LykubGVuZ3RoXG4gICAgICAgIHx8ICcuJy5zcGxpdCgvKCkoKS8pLmxlbmd0aCA+IDFcbiAgICApIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjb21wbGlhbnRFeGVjTnBjZyA9IHR5cGVvZiAoLygpPz8vKS5leGVjKCcnKVsxXSA9PT0gJ3VuZGVmaW5lZCc7IC8vIE5QQ0c6IG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgICB2YXIgbWF4U2FmZTMyQml0SW50ID0gTWF0aC5wb3coMiwgMzIpIC0gMTtcblxuICAgICAgICAgICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gKHNlcGFyYXRvciwgbGltaXQpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RyaW5nID0gU3RyaW5nKHRoaXMpO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc2VwYXJhdG9yID09PSAndW5kZWZpbmVkJyAmJiBsaW1pdCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gSWYgYHNlcGFyYXRvcmAgaXMgbm90IGEgcmVnZXgsIHVzZSBuYXRpdmUgc3BsaXRcbiAgICAgICAgICAgICAgICBpZiAoIWlzUmVnZXgoc2VwYXJhdG9yKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyU3BsaXQodGhpcywgc2VwYXJhdG9yLCBsaW1pdCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIG91dHB1dCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBmbGFncyA9IChzZXBhcmF0b3IuaWdub3JlQ2FzZSA/ICdpJyA6ICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsgKHNlcGFyYXRvci5tdWx0aWxpbmUgPyAnbScgOiAnJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChzZXBhcmF0b3IudW5pY29kZSA/ICd1JyA6ICcnKSAvLyBpbiBFUzZcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICArIChzZXBhcmF0b3Iuc3RpY2t5ID8gJ3knIDogJycpLCAvLyBGaXJlZm94IDMrIGFuZCBFUzZcbiAgICAgICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IDAsXG4gICAgICAgICAgICAgICAgICAgIC8vIE1ha2UgYGdsb2JhbGAgYW5kIGF2b2lkIGBsYXN0SW5kZXhgIGlzc3VlcyBieSB3b3JraW5nIHdpdGggYSBjb3B5XG4gICAgICAgICAgICAgICAgICAgIHNlcGFyYXRvcjIsIG1hdGNoLCBsYXN0SW5kZXgsIGxhc3RMZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIHNlcGFyYXRvckNvcHkgPSBuZXcgUmVnRXhwKHNlcGFyYXRvci5zb3VyY2UsIGZsYWdzICsgJ2cnKTtcbiAgICAgICAgICAgICAgICBpZiAoIWNvbXBsaWFudEV4ZWNOcGNnKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERvZXNuJ3QgbmVlZCBmbGFncyBneSwgYnV0IHRoZXkgZG9uJ3QgaHVydFxuICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3IyID0gbmV3IFJlZ0V4cCgnXicgKyBzZXBhcmF0b3JDb3B5LnNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvKiBWYWx1ZXMgZm9yIGBsaW1pdGAsIHBlciB0aGUgc3BlYzpcbiAgICAgICAgICAgICAgICAgKiBJZiB1bmRlZmluZWQ6IDQyOTQ5NjcyOTUgLy8gbWF4U2FmZTMyQml0SW50XG4gICAgICAgICAgICAgICAgICogSWYgMCwgSW5maW5pdHksIG9yIE5hTjogMFxuICAgICAgICAgICAgICAgICAqIElmIHBvc2l0aXZlIG51bWJlcjogbGltaXQgPSBNYXRoLmZsb29yKGxpbWl0KTsgaWYgKGxpbWl0ID4gNDI5NDk2NzI5NSkgbGltaXQgLT0gNDI5NDk2NzI5NjtcbiAgICAgICAgICAgICAgICAgKiBJZiBuZWdhdGl2ZSBudW1iZXI6IDQyOTQ5NjcyOTYgLSBNYXRoLmZsb29yKE1hdGguYWJzKGxpbWl0KSlcbiAgICAgICAgICAgICAgICAgKiBJZiBvdGhlcjogVHlwZS1jb252ZXJ0LCB0aGVuIHVzZSB0aGUgYWJvdmUgcnVsZXNcbiAgICAgICAgICAgICAgICAgKi9cbiAgICAgICAgICAgICAgICB2YXIgc3BsaXRMaW1pdCA9IHR5cGVvZiBsaW1pdCA9PT0gJ3VuZGVmaW5lZCcgPyBtYXhTYWZlMzJCaXRJbnQgOiBFUy5Ub1VpbnQzMihsaW1pdCk7XG4gICAgICAgICAgICAgICAgbWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB3aGlsZSAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYHNlcGFyYXRvckNvcHkubGFzdEluZGV4YCBpcyBub3QgcmVsaWFibGUgY3Jvc3MtYnJvd3NlclxuICAgICAgICAgICAgICAgICAgICBsYXN0SW5kZXggPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RJbmRleCA+IGxhc3RMYXN0SW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKG91dHB1dCwgc3RyU2xpY2Uoc3RyaW5nLCBsYXN0TGFzdEluZGV4LCBtYXRjaC5pbmRleCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGAgZm9yXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cHNcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghY29tcGxpYW50RXhlY05wY2cgJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWxvb3AtZnVuYyAqL1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzBdLnJlcGxhY2Uoc2VwYXJhdG9yMiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXJndW1lbnRzW2ldID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoW2ldID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogZXNsaW50LWVuYWJsZSBuby1sb29wLWZ1bmMgKi9cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChtYXRjaC5sZW5ndGggPiAxICYmIG1hdGNoLmluZGV4IDwgc3RyaW5nLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5X3B1c2guYXBwbHkob3V0cHV0LCBhcnJheVNsaWNlKG1hdGNoLCAxKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsYXN0TGVuZ3RoID0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdExhc3RJbmRleCA9IGxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdXRwdXQubGVuZ3RoID49IHNwbGl0TGltaXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoc2VwYXJhdG9yQ29weS5sYXN0SW5kZXggPT09IG1hdGNoLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXBhcmF0b3JDb3B5Lmxhc3RJbmRleCsrOyAvLyBBdm9pZCBhbiBpbmZpbml0ZSBsb29wXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbWF0Y2ggPSBzZXBhcmF0b3JDb3B5LmV4ZWMoc3RyaW5nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RMYXN0SW5kZXggPT09IHN0cmluZy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxhc3RMZW5ndGggfHwgIXNlcGFyYXRvckNvcHkudGVzdCgnJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hDYWxsKG91dHB1dCwgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcHVzaENhbGwob3V0cHV0LCBzdHJTbGljZShzdHJpbmcsIGxhc3RMYXN0SW5kZXgpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIG91dHB1dC5sZW5ndGggPiBzcGxpdExpbWl0ID8gYXJyYXlTbGljZShvdXRwdXQsIDAsIHNwbGl0TGltaXQpIDogb3V0cHV0O1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSgpKTtcblxuICAgIC8vIFtidWdmaXgsIGNocm9tZV1cbiAgICAvLyBJZiBzZXBhcmF0b3IgaXMgdW5kZWZpbmVkLCB0aGVuIHRoZSByZXN1bHQgYXJyYXkgY29udGFpbnMganVzdCBvbmUgU3RyaW5nLFxuICAgIC8vIHdoaWNoIGlzIHRoZSB0aGlzIHZhbHVlIChjb252ZXJ0ZWQgdG8gYSBTdHJpbmcpLiBJZiBsaW1pdCBpcyBub3QgdW5kZWZpbmVkLFxuICAgIC8vIHRoZW4gdGhlIG91dHB1dCBhcnJheSBpcyB0cnVuY2F0ZWQgc28gdGhhdCBpdCBjb250YWlucyBubyBtb3JlIHRoYW4gbGltaXRcbiAgICAvLyBlbGVtZW50cy5cbiAgICAvLyBcIjBcIi5zcGxpdCh1bmRlZmluZWQsIDApIC0+IFtdXG4gICAgfSBlbHNlIGlmICgnMCcuc3BsaXQodm9pZCAwLCAwKS5sZW5ndGgpIHtcbiAgICAgICAgU3RyaW5nUHJvdG90eXBlLnNwbGl0ID0gZnVuY3Rpb24gc3BsaXQoc2VwYXJhdG9yLCBsaW1pdCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzZXBhcmF0b3IgPT09ICd1bmRlZmluZWQnICYmIGxpbWl0ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0clNwbGl0KHRoaXMsIHNlcGFyYXRvciwgbGltaXQpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHZhciBzdHJfcmVwbGFjZSA9IFN0cmluZ1Byb3RvdHlwZS5yZXBsYWNlO1xuICAgIHZhciByZXBsYWNlUmVwb3J0c0dyb3Vwc0NvcnJlY3RseSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBncm91cHMgPSBbXTtcbiAgICAgICAgJ3gnLnJlcGxhY2UoL3goLik/L2csIGZ1bmN0aW9uIChtYXRjaCwgZ3JvdXApIHtcbiAgICAgICAgICAgIHB1c2hDYWxsKGdyb3VwcywgZ3JvdXApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGdyb3Vwcy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGdyb3Vwc1swXSA9PT0gJ3VuZGVmaW5lZCc7XG4gICAgfSgpKTtcblxuICAgIGlmICghcmVwbGFjZVJlcG9ydHNHcm91cHNDb3JyZWN0bHkpIHtcbiAgICAgICAgU3RyaW5nUHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgICAgICAgIHZhciBpc0ZuID0gaXNDYWxsYWJsZShyZXBsYWNlVmFsdWUpO1xuICAgICAgICAgICAgdmFyIGhhc0NhcHR1cmluZ0dyb3VwcyA9IGlzUmVnZXgoc2VhcmNoVmFsdWUpICYmICgvXFwpWyo/XS8pLnRlc3Qoc2VhcmNoVmFsdWUuc291cmNlKTtcbiAgICAgICAgICAgIGlmICghaXNGbiB8fCAhaGFzQ2FwdHVyaW5nR3JvdXBzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0cl9yZXBsYWNlLmNhbGwodGhpcywgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciB3cmFwcGVkUmVwbGFjZVZhbHVlID0gZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JpZ2luYWxMYXN0SW5kZXggPSBzZWFyY2hWYWx1ZS5sYXN0SW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcmdzID0gc2VhcmNoVmFsdWUuZXhlYyhtYXRjaCkgfHwgW107XG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFZhbHVlLmxhc3RJbmRleCA9IG9yaWdpbmFsTGFzdEluZGV4O1xuICAgICAgICAgICAgICAgICAgICBwdXNoQ2FsbChhcmdzLCBhcmd1bWVudHNbbGVuZ3RoIC0gMl0sIGFyZ3VtZW50c1tsZW5ndGggLSAxXSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXBsYWNlVmFsdWUuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RyX3JlcGxhY2UuY2FsbCh0aGlzLCBzZWFyY2hWYWx1ZSwgd3JhcHBlZFJlcGxhY2VWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLy8gRUNNQS0yNjIsIDNyZCBCLjIuM1xuICAgIC8vIE5vdCBhbiBFQ01BU2NyaXB0IHN0YW5kYXJkLCBhbHRob3VnaCBFQ01BU2NyaXB0IDNyZCBFZGl0aW9uIGhhcyBhXG4gICAgLy8gbm9uLW5vcm1hdGl2ZSBzZWN0aW9uIHN1Z2dlc3RpbmcgdW5pZm9ybSBzZW1hbnRpY3MgYW5kIGl0IHNob3VsZCBiZVxuICAgIC8vIG5vcm1hbGl6ZWQgYWNyb3NzIGFsbCBicm93c2Vyc1xuICAgIC8vIFtidWdmaXgsIElFIGx0IDldIElFIDwgOSBzdWJzdHIoKSB3aXRoIG5lZ2F0aXZlIHZhbHVlIG5vdCB3b3JraW5nIGluIElFXG4gICAgdmFyIHN0cmluZ19zdWJzdHIgPSBTdHJpbmdQcm90b3R5cGUuc3Vic3RyO1xuICAgIHZhciBoYXNOZWdhdGl2ZVN1YnN0ckJ1ZyA9ICcnLnN1YnN0ciAmJiAnMGInLnN1YnN0cigtMSkgIT09ICdiJztcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZ1Byb3RvdHlwZSwge1xuICAgICAgICBzdWJzdHI6IGZ1bmN0aW9uIHN1YnN0cihzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbm9ybWFsaXplZFN0YXJ0ID0gc3RhcnQ7XG4gICAgICAgICAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsaXplZFN0YXJ0ID0gbWF4KHRoaXMubGVuZ3RoICsgc3RhcnQsIDApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHN0cmluZ19zdWJzdHIuY2FsbCh0aGlzLCBub3JtYWxpemVkU3RhcnQsIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICB9LCBoYXNOZWdhdGl2ZVN1YnN0ckJ1Zyk7XG5cbiAgICAvLyBFUzUgMTUuNS40LjIwXG4gICAgLy8gd2hpdGVzcGFjZSBmcm9tOiBodHRwOi8vZXM1LmdpdGh1Yi5pby8jeDE1LjUuNC4yMFxuICAgIHZhciB3cyA9ICdcXHgwOVxceDBBXFx4MEJcXHgwQ1xceDBEXFx4MjBcXHhBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwMydcbiAgICAgICAgKyAnXFx1MjAwNFxcdTIwMDVcXHUyMDA2XFx1MjAwN1xcdTIwMDhcXHUyMDA5XFx1MjAwQVxcdTIwMkZcXHUyMDVGXFx1MzAwMFxcdTIwMjgnXG4gICAgICAgICsgJ1xcdTIwMjlcXHVGRUZGJztcbiAgICB2YXIgemVyb1dpZHRoID0gJ1xcdTIwMGInO1xuICAgIHZhciB3c1JlZ2V4Q2hhcnMgPSAnWycgKyB3cyArICddJztcbiAgICB2YXIgdHJpbUJlZ2luUmVnZXhwID0gbmV3IFJlZ0V4cCgnXicgKyB3c1JlZ2V4Q2hhcnMgKyB3c1JlZ2V4Q2hhcnMgKyAnKicpO1xuICAgIHZhciB0cmltRW5kUmVnZXhwID0gbmV3IFJlZ0V4cCh3c1JlZ2V4Q2hhcnMgKyB3c1JlZ2V4Q2hhcnMgKyAnKiQnKTtcbiAgICB2YXIgaGFzVHJpbVdoaXRlc3BhY2VCdWcgPSBTdHJpbmdQcm90b3R5cGUudHJpbSAmJiAod3MudHJpbSgpIHx8ICF6ZXJvV2lkdGgudHJpbSgpKTtcbiAgICBkZWZpbmVQcm9wZXJ0aWVzKFN0cmluZ1Byb3RvdHlwZSwge1xuICAgICAgICAvLyBodHRwOi8vYmxvZy5zdGV2ZW5sZXZpdGhhbi5jb20vYXJjaGl2ZXMvZmFzdGVyLXRyaW0tamF2YXNjcmlwdFxuICAgICAgICAvLyBodHRwOi8vcGVyZmVjdGlvbmtpbGxzLmNvbS93aGl0ZXNwYWNlLWRldmlhdGlvbnMvXG4gICAgICAgIHRyaW06IGZ1bmN0aW9uIHRyaW0oKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMgPT09ICd1bmRlZmluZWQnIHx8IHRoaXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiY2FuJ3QgY29udmVydCBcIiArIHRoaXMgKyAnIHRvIG9iamVjdCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuICRTdHJpbmcodGhpcykucmVwbGFjZSh0cmltQmVnaW5SZWdleHAsICcnKS5yZXBsYWNlKHRyaW1FbmRSZWdleHAsICcnKTtcbiAgICAgICAgfVxuICAgIH0sIGhhc1RyaW1XaGl0ZXNwYWNlQnVnKTtcbiAgICB2YXIgdHJpbSA9IGNhbGwuYmluZChTdHJpbmcucHJvdG90eXBlLnRyaW0pO1xuXG4gICAgdmFyIGhhc0xhc3RJbmRleEJ1ZyA9IFN0cmluZ1Byb3RvdHlwZS5sYXN0SW5kZXhPZiAmJiAnYWJj44GC44GEJy5sYXN0SW5kZXhPZign44GC44GEJywgMikgIT09IC0xO1xuICAgIGRlZmluZVByb3BlcnRpZXMoU3RyaW5nUHJvdG90eXBlLCB7XG4gICAgICAgIGxhc3RJbmRleE9mOiBmdW5jdGlvbiBsYXN0SW5kZXhPZihzZWFyY2hTdHJpbmcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgdGhpcyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgUyA9ICRTdHJpbmcodGhpcyk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoU3RyID0gJFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgICAgICAgICAgdmFyIG51bVBvcyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gJE51bWJlcihhcmd1bWVudHNbMV0pIDogTmFOO1xuICAgICAgICAgICAgdmFyIHBvcyA9IGlzQWN0dWFsTmFOKG51bVBvcykgPyBJbmZpbml0eSA6IEVTLlRvSW50ZWdlcihudW1Qb3MpO1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gbWluKG1heChwb3MsIDApLCBTLmxlbmd0aCk7XG4gICAgICAgICAgICB2YXIgc2VhcmNoTGVuID0gc2VhcmNoU3RyLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBrID0gc3RhcnQgKyBzZWFyY2hMZW47XG4gICAgICAgICAgICB3aGlsZSAoayA+IDApIHtcbiAgICAgICAgICAgICAgICBrID0gbWF4KDAsIGsgLSBzZWFyY2hMZW4pO1xuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHN0ckluZGV4T2Yoc3RyU2xpY2UoUywgaywgc3RhcnQgKyBzZWFyY2hMZW4pLCBzZWFyY2hTdHIpO1xuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGsgKyBpbmRleDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgIH1cbiAgICB9LCBoYXNMYXN0SW5kZXhCdWcpO1xuXG4gICAgdmFyIG9yaWdpbmFsTGFzdEluZGV4T2YgPSBTdHJpbmdQcm90b3R5cGUubGFzdEluZGV4T2Y7XG4gICAgZGVmaW5lUHJvcGVydGllcyhTdHJpbmdQcm90b3R5cGUsIHtcbiAgICAgICAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaFN0cmluZykge1xuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTGFzdEluZGV4T2YuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgIH0sIFN0cmluZ1Byb3RvdHlwZS5sYXN0SW5kZXhPZi5sZW5ndGggIT09IDEpO1xuXG4gICAgLy8gRVMtNSAxNS4xLjIuMlxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSByYWRpeFxuICAgIGlmIChwYXJzZUludCh3cyArICcwOCcpICE9PSA4IHx8IHBhcnNlSW50KHdzICsgJzB4MTYnKSAhPT0gMjIpIHtcbiAgICAgICAgLyogZ2xvYmFsIHBhcnNlSW50OiB0cnVlICovXG4gICAgICAgIHBhcnNlSW50ID0gKGZ1bmN0aW9uIChvcmlnUGFyc2VJbnQpIHtcbiAgICAgICAgICAgIHZhciBoZXhSZWdleCA9IC9eWy0rXT8wW3hYXS87XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gcGFyc2VJbnQoc3RyLCByYWRpeCkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3RyID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgICAgICAgICAvLyBoYW5kbGUgU3ltYm9scyBpbiBub2RlIDguMy84LjRcbiAgICAgICAgICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWltcGxpY2l0LWNvZXJjaW9uLCBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgICAgICAgICAgICAgICAgJycgKyBzdHI7IC8vIGpzY3M6aWdub3JlIGRpc2FsbG93SW1wbGljaXRUeXBlQ29udmVyc2lvblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBzdHJpbmcgPSB0cmltKFN0cmluZyhzdHIpKTtcbiAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdGVkUmFkaXggPSAkTnVtYmVyKHJhZGl4KSB8fCAoaGV4UmVnZXgudGVzdChzdHJpbmcpID8gMTYgOiAxMCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG9yaWdQYXJzZUludChzdHJpbmcsIGRlZmF1bHRlZFJhZGl4KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0ocGFyc2VJbnQpKTtcbiAgICB9XG5cbiAgICAvLyBodHRwczovL2VzNS5naXRodWIuaW8vI3gxNS4xLjIuM1xuICAgIGlmICgxIC8gcGFyc2VGbG9hdCgnLTAnKSAhPT0gLUluZmluaXR5KSB7XG4gICAgICAgIC8qIGdsb2JhbCBwYXJzZUZsb2F0OiB0cnVlICovXG4gICAgICAgIHBhcnNlRmxvYXQgPSAoZnVuY3Rpb24gKG9yaWdQYXJzZUZsb2F0KSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24gcGFyc2VGbG9hdChzdHJpbmcpIHtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXRTdHJpbmcgPSB0cmltKFN0cmluZyhzdHJpbmcpKTtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gb3JpZ1BhcnNlRmxvYXQoaW5wdXRTdHJpbmcpO1xuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQgPT09IDAgJiYgc3RyU2xpY2UoaW5wdXRTdHJpbmcsIDAsIDEpID09PSAnLScgPyAtMCA6IHJlc3VsdDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0ocGFyc2VGbG9hdCkpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmcobmV3IFJhbmdlRXJyb3IoJ3Rlc3QnKSkgIT09ICdSYW5nZUVycm9yOiB0ZXN0Jykge1xuICAgICAgICB2YXIgZXJyb3JUb1N0cmluZ1NoaW0gPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ3VuZGVmaW5lZCcgfHwgdGhpcyA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJjYW4ndCBjb252ZXJ0IFwiICsgdGhpcyArICcgdG8gb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmFtZSA9IHRoaXMubmFtZTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgbmFtZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICBuYW1lID0gJ0Vycm9yJztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9ICRTdHJpbmcobmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbXNnID0gdGhpcy5tZXNzYWdlO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBtc2cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gJyc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBtc2cgIT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgbXNnID0gJFN0cmluZyhtc2cpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFuYW1lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1zZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbXNnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gbmFtZSArICc6ICcgKyBtc2c7XG4gICAgICAgIH07XG4gICAgICAgIC8vIGNhbid0IHVzZSBkZWZpbmVQcm9wZXJ0aWVzIGhlcmUgYmVjYXVzZSBvZiB0b1N0cmluZyBlbnVtZXJhdGlvbiBpc3N1ZSBpbiBJRSA8PSA4XG4gICAgICAgIEVycm9yLnByb3RvdHlwZS50b1N0cmluZyA9IGVycm9yVG9TdHJpbmdTaGltO1xuICAgIH1cblxuICAgIGlmIChzdXBwb3J0c0Rlc2NyaXB0b3JzKSB7XG4gICAgICAgIHZhciBlbnN1cmVOb25FbnVtZXJhYmxlID0gZnVuY3Rpb24gKG9iaiwgcHJvcCkge1xuICAgICAgICAgICAgaWYgKGlzRW51bShvYmosIHByb3ApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gICAgICAgICAgICAgICAgaWYgKGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2MuZW51bWVyYWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGVuc3VyZU5vbkVudW1lcmFibGUoRXJyb3IucHJvdG90eXBlLCAnbWVzc2FnZScpO1xuICAgICAgICBpZiAoRXJyb3IucHJvdG90eXBlLm1lc3NhZ2UgIT09ICcnKSB7XG4gICAgICAgICAgICBFcnJvci5wcm90b3R5cGUubWVzc2FnZSA9ICcnO1xuICAgICAgICB9XG4gICAgICAgIGVuc3VyZU5vbkVudW1lcmFibGUoRXJyb3IucHJvdG90eXBlLCAnbmFtZScpO1xuICAgIH1cblxuICAgIGlmIChTdHJpbmcoL2EvbWlnKSAhPT0gJy9hL2dpbScpIHtcbiAgICAgICAgdmFyIHJlZ2V4VG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgICAgICAgIHZhciBzdHIgPSAnLycgKyB0aGlzLnNvdXJjZSArICcvJztcbiAgICAgICAgICAgIGlmICh0aGlzLmdsb2JhbCkge1xuICAgICAgICAgICAgICAgIHN0ciArPSAnZyc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pZ25vcmVDYXNlKSB7XG4gICAgICAgICAgICAgICAgc3RyICs9ICdpJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLm11bHRpbGluZSkge1xuICAgICAgICAgICAgICAgIHN0ciArPSAnbSc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc3RyO1xuICAgICAgICB9O1xuICAgICAgICAvLyBjYW4ndCB1c2UgZGVmaW5lUHJvcGVydGllcyBoZXJlIGJlY2F1c2Ugb2YgdG9TdHJpbmcgZW51bWVyYXRpb24gaXNzdWUgaW4gSUUgPD0gOFxuICAgICAgICBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nID0gcmVnZXhUb1N0cmluZztcbiAgICB9XG59KSk7XG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHJlZ2lzdGVyZWRPYmplY3RzID0gW107XHJcbiAgICB2YXIgaGFuZGxlcnMgPSBbXTtcclxuXHJcbiAgICB2YXIgdHJpZ2dlciA9IGZ1bmN0aW9uIChvYmplY3RJbmRleCwgZXZlbnROYW1lLCBwYXJhbXMpIHtcclxuICAgICAgICB2YXIgb2JqID0gcmVnaXN0ZXJlZE9iamVjdHNbb2JqZWN0SW5kZXhdO1xyXG4gICAgICAgIGhhbmRsZXJzW29iamVjdEluZGV4XVtldmVudE5hbWVdLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgeC5jYWxsKG9iaiwgcGFyYW1zKTtcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgQWN0aXZlWE9iamVjdC5vbiA9IGZ1bmN0aW9uIChvYmosIGV2ZW50TmFtZSwgcGFyYW1ldGVyTmFtZXMsIGhhbmRsZXIpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHBhcmFtZXRlck5hbWVzKSAhPT0gJ1tvYmplY3QgQXJyYXldJykge1xyXG4gICAgICAgICAgICAvL3BhcmFtZXRlck5hbWVzIGlzIGFuIG9wdGlvbmFsIGFyZ3VtZW50XHJcbiAgICAgICAgICAgIGhhbmRsZXIgPSBwYXJhbWV0ZXJOYW1lcztcclxuICAgICAgICAgICAgcGFyYW1ldGVyTmFtZXMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmplY3RJbmRleCA9IHJlZ2lzdGVyZWRPYmplY3RzLmluZGV4T2Yob2JqKTtcclxuICAgICAgICBpZiAob2JqZWN0SW5kZXggPT0gLTEpIHtcclxuICAgICAgICAgICAgcmVnaXN0ZXJlZE9iamVjdHMucHVzaChvYmopO1xyXG4gICAgICAgICAgICBvYmplY3RJbmRleCA9IHJlZ2lzdGVyZWRPYmplY3RzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICAgIGhhbmRsZXJzW29iamVjdEluZGV4XSA9IHt9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaGFuZGxlcnNbb2JqZWN0SW5kZXhdW2V2ZW50TmFtZV0gPT09IHVuZGVmaW5lZCkgeyAvL2V4cGxpY2l0IGNoZWNrIGFnYWluc3QgdW5kZWZpbmVkLCBiZWNhdXNlIGl0IG1pZ2h0IGJlIGFuIGVtcHR5IGFycmF5XHJcbiAgICAgICAgICAgIHZhciBkZWYgPSBcImZ1bmN0aW9uIG9iajo6XCIgKyBldmVudE5hbWUgKyBcIiAoXCIgKyBwYXJhbWV0ZXJOYW1lcy5qb2luKCcsICcpICsgXCIpIHtcIiArXHJcbiAgICAgICAgICAgICAgICBcInZhciBwYXJhbXMgPSB7IFwiICtcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlck5hbWVzLm1hcChmdW5jdGlvbiAoeCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB4ICsgJzonICsgeDtcclxuICAgICAgICAgICAgICAgIH0pLmpvaW4oJywnKSArXHJcbiAgICAgICAgICAgICAgICBcIiB9O1wiICtcclxuICAgICAgICAgICAgICAgIFwidHJpZ2dlciggXCIgKyBvYmplY3RJbmRleCArIFwiLCAnXCIgKyBldmVudE5hbWUgKyBcIicsIHBhcmFtcyk7XCIgK1xyXG4gICAgICAgICAgICAgICAgcGFyYW1ldGVyTmFtZXMubWFwKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwiaWYgKCBcIiArIHggKyBcIiAhPT0gcGFyYW1zLlwiICsgeCArIFwiICkgXCIgKyB4ICsgXCIgPSBwYXJhbXMuXCIgKyB4ICsgXCI7XCI7XHJcbiAgICAgICAgICAgICAgICB9KS5qb2luKCdcXG4nKSArXHJcbiAgICAgICAgICAgICAgICBcIn07XCI7XHJcbiAgICAgICAgICAgIGV2YWwoZGVmKTtcclxuICAgICAgICAgICAgaGFuZGxlcnNbb2JqZWN0SW5kZXhdW2V2ZW50TmFtZV0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaGFuZGxlcnNbb2JqZWN0SW5kZXhdW2V2ZW50TmFtZV0ucHVzaChoYW5kbGVyKTtcclxuICAgIH07XHJcblxyXG4gICAgQWN0aXZlWE9iamVjdC5vZmYgPSBmdW5jdGlvbiAob2JqLCBldmVudE5hbWUsIGhhbmRsZXIpIHtcclxuICAgICAgICBpZiAoIW9iaikge1xyXG4gICAgICAgICAgICByZWdpc3RlcmVkT2JqZWN0cy5mb3JFYWNoKGZ1bmN0aW9uICh4KSB7XHJcbiAgICAgICAgICAgICAgICBBY3RpdmVYT2JqZWN0Lm9mZih4KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJlZ2lzdGVyZWRPYmplY3RzID0gW107XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBvYmplY3RJbmRleCA9IHJlZ2lzdGVyZWRPYmplY3RzLmluZGV4T2Yob2JqKTtcclxuICAgICAgICB2YXIgaGFuZGxlcnNPYmplY3QgPSBoYW5kbGVyc1tvYmplY3RJbmRleF07XHJcbiAgICAgICAgaWYgKCFldmVudE5hbWUpIHtcclxuICAgICAgICAgICAgT2JqZWN0LmtleXMoaGFuZGxlcnNPYmplY3QpLmZvckVhY2goZnVuY3Rpb24gKHgpIHtcclxuICAgICAgICAgICAgICAgIEFjdGl2ZVhPYmplY3Qub2ZmKG9iaiwgeCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZWdpc3RlcmVkT2JqZWN0c1tvYmplY3RJbmRleF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghaGFuZGxlcikge1xyXG4gICAgICAgICAgICBoYW5kbGVyc09iamVjdFtldmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBoYW5kbGVySW5kZXggPSBoYW5kbGVyc09iamVjdFtldmVudE5hbWVdLmluZGV4T2YoaGFuZGxlcik7XHJcbiAgICAgICAgd2hpbGUgKGhhbmRsZXJJbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXJzT2JqZWN0W2V2ZW50TmFtZV1baGFuZGxlckluZGV4XSA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgaGFuZGxlckluZGV4ID0gaGFuZGxlcnNPYmplY3RbZXZlbnROYW1lXS5pbmRleE9mKGhhbmRsZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgQWN0aXZlWE9iamVjdC5oYXNSZWdpc3RlcmVkT2JqZWN0cyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZE9iamVjdHMubGVuZ3RoID4gMDtcclxuICAgIH07XHJcblxyXG4gICAgQWN0aXZlWE9iamVjdC5zZXQgPSBmdW5jdGlvbiAob2JqLCBwcm9wZXJ0eU5hbWUsIHBhcmFtZXRlcnMsIG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgdmFyIHBhcmFtZXRlclN0cmluZyA9IHBhcmFtZXRlcnMubWFwKGZ1bmN0aW9uICh4LCBpbmRleCkge1xyXG4gICAgICAgICAgICByZXR1cm4gJ3BhcmFtZXRlcnNbJyArIGluZGV4ICsgJ10nO1xyXG4gICAgICAgIH0pLmpvaW4oJywgJyk7XHJcbiAgICAgICAgZXZhbCgnb2JqLicgKyBwcm9wZXJ0eU5hbWUgKyAnKCcgKyBwYXJhbWV0ZXJTdHJpbmcgKyAnKSA9IG5ld1ZhbHVlJyk7XHJcbiAgICB9O1xyXG59KSgpOyIsIldTY3JpcHQuRWNobygnSGVsbG8sIHdvcmxkJyk7XHJcbldTY3JpcHQuRWNobyhBY3RpdmVYT2JqZWN0Lm9uKTtcclxuV1NjcmlwdC5FY2hvKFtdLmZvckVhY2gpOyJdfQ==