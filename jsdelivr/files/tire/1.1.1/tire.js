/*!
 * tire.js
 * Copyright (c) 2012-2013 Fredrik Forsmo
 * Version: 1.1.1
 * Released under the MIT License.
 */
(function (window, undefined) {

  var document   = window.document
    , _tire      = window.tire
    , _$         = window.$
    , idExp      = /^#[\w\-]+$/
    , classExp   = /^\.[\w\-]+$/
    , tagNameExp = /^[\w\-]+$/
    , tagExp     = /<([\w:]+)/
    , slice      = [].slice;
  
  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  
  // If slice is not available we provide a backup
  try {
    slice.call(document.documentElement.childNodes, 0)[0].nodeType;
  } catch(e) {
    slice = function (i) {
      i = i || 0;
      var elem, results = [];
      for (; (elem = this[i]); i++) {
        results.push(elem);
      }
      return results;
    };
  }
  
  var tire = function (selector, context) {
    return new tire.fn.find(selector, context);
  };
  
  tire.fn = tire.prototype = {
  
    /**
     * Default length is zero
     */
  
    length: 0,
  
    /**
     * Extend `tire.fn`
     *
     * @param {Object} o
     */
  
    extend: function (o) {
      for (var k in o) {
        this[k] = o[k];
      }
    },
  
    /**
     * Find elements by selector
     *
     * @param {String|Object|Function|Array} selector
     * @param {Object} context
     *
     * @return {Object}
     */
  
    find: function (selector, context) {
      var elms = [], attrs;
  
      if (!selector) {
        return this;
      }
  
      if (tire.isFunction(selector)) {
        return tire.ready(selector);
      }
  
      if (selector.nodeType) {
        this.selector = '';
        this.context = selector;
        return this.set([selector]);
      }
  
      if (selector.length === 1 && selector[0].nodeType) {
        this.selector = selector.selector;
        this.context = selector[0];
        return this.set(selector);
      }
  
      context = this.context ? this.context : (context || document);
  
      if (tire.isPlainObject(context)) {
        attrs = context;
        context = document;
      }
  
      if (tire.isString(selector)) {
        this.selector = selector;
        if (idExp.test(selector) && context.nodeType === context.DOCUMENT_NODE) {
          elms = (elms = context.getElementById(selector.substr(1))) ? [elms] : [];
        } else if (context.nodeType !== 1 && context.nodeType !== 9) {
          elms = [];
        } else if (tagExp.test(selector)) {
          var tmp = context.createElement('div');
          tmp.innerHTML = selector;
          this.each.call(slice.call(tmp.childNodes, 0), function () {
            elms.push(this);
          });
        } else {
          elms = slice.call(
            classExp.test(selector) && context.getElementsByClassName !== undefined ? context.getElementsByClassName(selector.substr(1)) :
            tagNameExp.test(selector) ? context.getElementsByTagName(selector) :
            context.querySelectorAll(selector)
          );
        }
      } else if (selector.nodeName || selector === window) {
        elms = [selector];
      } else if (tire.isArray(selector)) {
        elms = selector;
      }
  
      if (selector.selector !== undefined) {
        this.selector = selector.selector;
        this.context = selector.context;
      } else if (this.context === undefined) {
        if (elms[0] !== undefined && !tire.isString(elms[0])) {
          this.context = elms[0];
        } else {
          this.context = document;
        }
      }
  
      return this.set(elms).each(function () {
        return attrs && $(this).attr(attrs);
      });
    },
  
    /**
     * Fetch property from elements
     *
     * @param {String} prop
     * @return {Array}
     */
  
    pluck: function (prop) {
      var result = [];
      this.each(function () {
        if (this[prop]) result.push(this[prop]);
      });
      return result;
    },
  
    /**
     * Run callback for each element in the collection
     *
     * @param {Function} callback
     * @return {Object}
     */
  
    each: function(target, callback) {
      var i, key;
  
      if (typeof target === 'function') {
        callback = target;
        target = this;
      }
  
      if (target === this || target instanceof Array) {
        for (i = 0; i < target.length; ++i) {
          if (callback.call(target[i], i, target[i]) === false) break;
        }
      } else {
        for (key in target) {
          if (target.hasOwnProperty(key) && callback.call(target[key], key, target[key]) === false) break;
        }
      }
  
      return target;
    },
  
    /**
     * Set elements to tire object before returning `this`
     *
     * @param {Array} elements
     * @return {Object}
     */
  
    set: function (elements) {
      var i = 0;
      for (; i < elements.length; i++) {
        this[i] = elements[i];
      }
      this.length = i;
      return this;
    }
  };
  
  /**
   * Extend `tire` with arguments, if the arguments length is one the extend target is `tire`
   */
  
  tire.extend = function () {
    var target = arguments[0] || {};
  
    if (typeof target !== 'object' && typeof target !== 'function') {
      target = {};
    }
  
    if (arguments.length === 1) target = this;
  
    tire.fn.each(slice.call(arguments), function (index, value) {
      for (var key in value) {
        if (target[key] !== value[key]) target[key] = value[key];
      }
    });
  
    return target;
  };
  
  tire.fn.find.prototype = tire.fn;
  
  tire.extend({
  
    // We sould be able to use slice outside
    slice: slice,
  
    // We sould be able to use each outside
    each: tire.fn.each,
  
    /**
     * Trim string
     *
     * @param {String} str
     * @return {String}
     */
  
    trim: function (str) {
      return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
    },
  
    /**
     * Check if the element matches the selector
     *
     * @param {Object} element
     * @param {String} selector
     * @return {Boolean}
     */
  
    matches: function (element, selector) {
      if (!element || element.nodeType !== 1) return false;
  
      // Trying to use matchesSelector if it is available
      var matchesSelector = element.webkitMatchesSelector || element.mozMatchesSelector || element.oMatchesSelector || element.matchesSelector;
      if (matchesSelector) {
        return matchesSelector.call(element, selector);
      }
  
      // querySelectorAll fallback
      if (document.querySelectorAll !== undefined) {
        var nodes = element.parentNode.querySelectorAll(selector);
  
        for (var i = 0; i < nodes.length; i++) {
          if (nodes[i] === element) return true;
        }
      }
  
      return false;
    },
  
    /**
     * Check if the `obj` is a function
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isFunction: function (obj) {
      return typeof obj === 'function';
    },
  
    /**
     * Check if the `obj` is a array
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isArray: function (obj) {
      return obj instanceof Array;
    },
  
    /**
     * Check if the `obj` is a string
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isString: function (obj) {
      return typeof obj === 'string';
    },
  
    /**
     * Check if the `obj` is a number
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isNumeric: function (obj) {
      return typeof obj === 'number';
    },
  
    /**
     * Check if the `obj` is a object
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isObject: function (obj) {
      return obj instanceof Object && !this.isArray(obj) && !this.isFunction(obj) && !this.isWindow(obj);
    },
  
    /**
     * Check if `obj` is a plain object
     *
     * @param {Object} obj
     * @return {Boolean}
     */
  
    isPlainObject: function (obj) {
      if (!obj || !this.isObject(obj) || this.isWindow(obj) || obj.nodeType) {
        return false;
      } else if (obj.__proto__ === Object.prototype) {
        return true;
      } else {
        var key;
        for (key in obj) {}
        return key === undefined || {}.hasOwnProperty.call(obj, key);
      }
    },
  
    /**
     * Check if `obj` is a `window` object
     */
  
    isWindow: function (obj) {
      return obj !== null && obj !== undefined && (obj === obj.window || 'setInterval' in obj);
    },
  
    /**
     * Parse JSON string to object.
     *
     * @param {String} str
     * @return {Object|null}
     */
  
    parseJSON: function (str) {
      if (!this.isString(str) || !str) {
        return null;
      }
  
      str = this.trim(str);
  
      if (window.JSON && window.JSON.parse) {
        return window.JSON.parse(str);
      }
  
      // Solution to fix JSON parse support for older browser. Not so nice but it works.
      try { return (new Function('return ' + str))(); }
      catch (e) { return null; }
    },
  
    /**
     * Calling .noConflict will restore the window.$` to its previous value.
     *
     * @param {Boolean} name Restore `tire` to it's previous value.
     * @return {Object}
     */
  
    noConflict: function (name) {
      if (name) {
        window.tire = _tire;
      }
  
      window.$ = _$;
      return tire;
    }
  });
  tire.fn.extend({
  
    /**
     * Add classes to element collection
     *
     * @param {String} value
     */
  
    addClass: function (value) {
      if (value && tire.isString(value)) {
        return this.each(function (index, elm) {
          if (elm.nodeType === 1) {
            var classNames = value.split(/\s+/);
            if (!elm.className && classNames.length === 1) {
              elm.className = value;
            } else {
              var className = elm.className;
  
              for (var i = 0; i < classNames.length; i++) {
                if (className.indexOf(classNames[i]) === -1) {
                  className += ' ' + classNames[i];
                }
              }
  
              elm.className = tire.trim(className);
            }
          }
        });
      }
    },
  
    /**
     * Remove classes from element collection
     *
     * @param {String} value
     */
  
    removeClass: function (value) {
      return this.each(function (index, elm) {
        if (value && tire.isString(value)) {
          var classNames = value.split(/\s+/);
          if (elm.nodeType === 1 && elm.className) {
            if (classNames.length === 1) {
             elm.className = elm.className.replace(value, '');
            } else {
              for (var i = 0; i < classNames.length; i++) {
                elm.className = elm.className.replace(classNames[i], '');
              }
            }
  
            elm.className = tire.trim(elm.className.replace(/\s{2}/g, ' '));
  
            if (elm.className === '') {
              elm.removeAttribute('class');
            }
          }
        }
      });
    },
  
    /**
     * Check if the first element in the collection has classes
     *
     * @param {String} value
     * @return {Boolean}
     */
  
    hasClass: function (value) {
      var classNames = (this[0] ? this[0] : this).className.split(/\s+/)
        , values = value.split(/\s+/)
        , i = 0;
  
      if (values.length > 1) {
        var hasClasses = false;
        for (i = 0; i < values.length; i++) {
          hasClasses = this.hasClass.call(this, values[i]);
        }
        return hasClasses;
      } else if (tire.isString(value)) {
        for (i = 0; i < classNames.length; i++) {
          if (classNames[i] === value) return true;
        }
        return false;
      }
    },
  
    /**
     * Get attribute from element
     * Set attribute to element collection
     *
     * @param {String} name
     * @param {String|Object} value
     *
     * @return {Object|String}
     */
  
    attr: function (name, value) {
      if (tire.isObject(name)) {
        return this.each(function () {
          for (var key in name) {
            if (this.setAttribute) {
              // Firefox 3.5 fix "null + '';"
              this.setAttribute(key, name[key] === null ? name[key] + '' : name[key]);
            }
          }
        });
      } else if ((value || value === null || value === false) && tire.isString(name)) {
        return this.each(function () {
          if (this.setAttribute) {
            // Firefox 3.5 fix "null + '';"
            this.setAttribute(name, value === null ? value + '' : value);
          }
        });
      } else if (tire.isString(name)) {
        var attribute;
        for (var i = 0; i < this.length; i++) {
          if (this[i].getAttribute !== undefined && (attribute = this[i].getAttribute(name)) !== null) {
            break;
          } else {
            continue;
          }
        }
        return attribute;
      }
    },
  
    /**
     * Shortcut for data-* attributes.
     *
     * @param {String} name
     * @param {String|Object} value
     *
     * @return {Object|String}
     */
  
    data: function (name, value) {
      value = this.attr('data-' + name, serializeValue(value));
      return value instanceof tire ? value : deserializeValue(value);
    },
  
    /**
     * Remove attributes from element collection
     *
     * @param {String} name
     *
     * @return {Object}
     */
  
    removeAttr: function (name) {
      return this.each(function () {
        if (name && this.nodeType === 1) {
          var attrNames = name.split(/\s+/);
          for (var i = 0; i < attrNames.length; i++) {
            this.removeAttribute(attrNames[i]);
          }
        }
      });
    }
  });
  
  /**
   * Serialize value into string
   *
   * @param {Object} value
   *
   * @return {String}
   */
  
  function serializeValue (value) {
    try {
      return value ? (tire.isPlainObject(value) || tire.isArray(value)) &&
      JSON.stringify ? JSON.stringify(value) : value : value;
    } catch (e) {
      return value;
    }
  }
  
  /**
   * Deserialize value from string to true, false, null, number, object or array.
   *
   * @param {String} value
   *
   * @return {Object}
   */
  
  function deserializeValue (value) {
    var num;
    try {
      return value ? value === 'true' || (value === 'false' ? false :
      value === 'null' ? null : !isNaN(num = Number(value)) ? num :
      /^[\[\{]/.test(value) ? tire.parseJSON(value) : value) : value;
    } catch (e) {
      return value;
    }
  }
  tire.fn.extend({
  
    /**
     * Get css property
     * Set css properties
     *
     * Examples:
     *
     *  // Get property
     *  $('div').css('color'); will return the css property
     *
     *  // Set properties
     *  $('div').css('color', 'black');
     *  $('div').css({ color: 'black', backgroundColor: 'white' });
     *
     * @param {String|Object} prop
     * @param {String} value
     * @return {String|Object}
     */
  
    css: function (prop, value) {
      if (tire.isString(prop) && value === undefined) {
        return this.length > 0 ? getPropertyValue(this[0], prop) : undefined;
      }
  
      return this.each(function () {
        if (this.style !== undefined) {
          if (tire.isString(prop)) {
            this.style[prop] = value;
          } else {
            for (var key in prop) {
              this.style[key] = prop[key];
            }
          }
        }
      });
    },
  
    /**
     * Hide elements in collection
     *
     * @return {Object}
     */
  
    hide: function () {
      return this.css('display', 'none');
    },
  
    /**
     * Show elements in collection
     *
     * @return {Object}
     */
  
    show: function () {
      return this.each(function () {
        if (this.style !== undefined) {
          try { // This don't work in IE8.
            if (this.style.display === 'none') this.style.display = null;
          } catch (e) {}
          if (getPropertyValue(this, 'display') === 'none') this.style.display = 'block';
        }
      });
    }
  });
  
  function getPropertyValue(elm, prop) {
    var value = '';
    if (document.defaultView && document.defaultView.getComputedStyle) {
      prop = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
      value = document.defaultView.getComputedStyle(elm, '').getPropertyValue(prop);
    } else if (elm.currentStyle) {
      value = elm.currentStyle[prop];
    } else {
      value = elm.style[prop];
    }
    return !!value ? value : '';
  }
  var domReady = (function () {
    var addEventListener = !!document.addEventListener,
        isReady = false,
        toplevel = false,
        testEl = document.documentElement,
        fns = [];
  
    if (addEventListener) {
      document.addEventListener('DOMContentLoaded', done, true);
      window.addEventListener('load', ready, false);
    } else {
      document.attachEvent('onreadystatechange', done);
      window.attachEvent('onload', ready);
  
      if (testEl.doScroll && window === window.top) {
        scrollCheck();
      }
    }
  
    function done () {
      if (addEventListener) {
        document.removeEventListener('DOMContentLoaded', done, false);
      } else {
        document.readyState === 'complete' && document.detachEvent('onreadystatechange', done);
      }
      ready();
    }
  
    // If IE is used, use the trick by Diego Perini
    // http://javascript.nwbox.com/IEContentLoaded/
    function scrollCheck () {
      if (isReady) return;
  
      try {
        testEl.doScroll('left');
      } catch(e) {
        setTimeout(scrollCheck, 10);
      }
  
      ready();
    }
  
    function ready () {
      if (isReady) return;
  
      isReady = true;
  
      for (var i = 0; i < fns.length; i++) {
        fns[i].call(document, tire);
      }
    }
  
    return function (callback) {
      return isReady ? callback.call(document, tire) : fns.push(callback);
    };
  })();
  
  /**
   * Adding domReady to tire and tire.fn
   */
  
  tire.ready = tire.fn.ready = domReady;
  
  tire.fn.extend({
  
    /**
     * Check if the first element in the element collection matches the selector
     *
     * @param {String|Object} selector The selector match
     * @return {Boolean}
     */
  
    is: function (selector) {
      return this.length > 0 && tire.matches(this[0], selector);
    },
  
    /**
     * Get the first element that matches the selector, beginning at the current element and progressing up through the DOM tree.
     *
     * @param {String} selector
     * @param {Object} context
     * @return {Object}
     */
  
    closest: function (selector, context) {
      var node = this[0];
  
      while (node && !tire.matches(node, selector)) {
        node = node.parentNode;
        if (!node || !node.ownerDocument || node === context || node.nodeType === 11) break;
      }
  
      return tire(node);
    },
  
    /**
     * Get immediate parents of each element in the collection.
     * If CSS selector is given, filter results to include only ones matching the selector.
     *
     * @param {String} selector
     * @return {Object}
     */
  
    parent: function (selector) {
      var parent = this.pluck('parentNode');
      return selector === undefined ? tire(parent) : tire(parent).filter(selector);
    },
  
    /**
     * Get immediate children of each element in the current collection.
     * If selector is given, filter the results to only include ones matching the CSS selector.
     *
     * @param {String} selector
     * @return {Object}
     */
  
    children: function (selector) {
      var children = [];
      this.each(function () {
        tire.each(tire.slice.call(this.children, 0), function (index, value) {
          children.push(value);
        });
      });
      return selector === undefined ? tire(children) : tire(children).filter(selector);
    },
  
    /**
     * Get text for the first element in the collection
     * Set text for every element in the collection
     *
     * $('div').text() => div text
     *
     * @param {String} text
     * @return {Object|String}
     */
  
    text: function (text) {
      if (text === undefined) {
        return this.length > 0 ? this[0].textContent === undefined ? this[0].innerText : this[0].textContent : null;
      } else {
        return this.each(function () {
          this.textContent = text;
        });
      }
    },
  
    /**
     * Get value for input/select elements
     * Set value for input/select elements
     *
     * @param {String} value
     * @return {Object|String}
     */
  
    val: function (value) {
      if (!arguments.length) {
        if (this.length > 0) {
          return this[0].multiple ? this.find('option').filter(function () {
            return this.selected;
          }).pluck('value') : this[0].value;
        }
  
        return null;
      } else {
        return this.each(function () {
          if (this.nodeType !== 1) {
            return;
          } else if (value === null || value === undefined) {
            value = '';
          } else if (tire.isNumeric(value)) {
            value += '';
          }
          this.value = value;
        });
      }
    },
  
    /**
     * Empty `innerHTML` for elements
     *
     * @return {Object}
     */
  
    empty: function () {
      return this.each(function () {
        this.innerHTML = '';
      });
    },
  
    /**
     * Get html for the first element in the collection
     * Set html for every elements in the collection
     *
     * @param {String|Object} html
     * @param {String} location
     *??@return {String|Object}
     */
  
    html: function (html, location) {
      if (arguments.length === 0) {
        return this.length > 0 ? this[0].innerHTML : null;
      }
  
      location = location || 'inner';
  
      if (html instanceof tire) {
        var self = this;
        return html.each(function (index, elm) {
          self.html.call(self, elm, location);
        });
      }
  
      return this.each(function () {
        if (location === 'inner') {
          if (tire.isString(html) || tire.isNumeric(html)) {
            this.innerHTML = html;
          } else {
            this.innerHTML = '';
            this.appendChild(html);
          }
        } else if (location === 'remove') {
          this.parentNode.removeChild(this);
        } else {
          var wrapped  = wrap(html)
            , children = wrapped.childNodes
            , parent;
  
          if (location === 'prepend') {
            this.insertBefore(wrapped, this.firstChild);
          } else if (location === 'append') {
            this.insertBefore(wrapped, null);
          } else if (location === 'before') {
            this.parentNode.insertBefore(wrapped, this);
          } else if (location === 'after') {
            this.parentNode.insertBefore(wrapped, (this.nextElementSibling ? this.nextElementSibling : this.nextSibling));
          }
  
          parent = wrapped.parentNode;
          while (children.length) {
            parent.insertBefore(children[0], wrapped);
          }
          parent.removeChild(wrapped);
        }
      });
    }
  });
  
  tire.each(['prepend', 'append', 'before', 'after', 'remove'], function (index, name) {
    tire.fn[name] = function (name) {
      return function (html) {
        return this.html(html, name);
      };
    }(name);
  });
  
  function wrap (html) {
    var elm = document.createElement('div');
    if (tire.isString(html) || tire.isNumeric(html)) {
      elm.innerHTML = html;
    } else {
      elm.appendChild(html);
    }
    return elm;
  }
  tire.fn.extend({
  
    /**
     * Filter element collection
     *
     * @param {String|Function} obj
     * @return {Object}
     */
  
    filter: function (obj) {
      if (tire.isFunction(obj)) {
        var elements = [];
        this.each(function (index, elm) {
          if (obj.call(elm, index)) {
            elements.push(elm);
          }
        });
        return tire(elements);
      } else {
        return this.filter(function () {
          return tire.matches(this, obj);
        });
      }
    },
  
    /**
     * Get elements in list but not with this selector
     *
     * @param {String} selector
     * @return {Object}
     */
  
    not: function (selector) {
      return this.filter(function () {
        return !tire.matches(this, selector);
      });
    },
  
    /**
     * Get the element at position specified by index from the current collection.
     *
     * @param {Integer} index
     * @return {Object}
     */
  
    eq: function (index) {
      return index === -1 ? tire(slice.call(this, this.length -1)) : tire(slice.call(this, index, index + 1));
    },
  
    /**
     * Retrieve the DOM elements matched by the tire object.
     *
     * @param {Integer} index
     * @return {object}
     */
  
    get: function (index) {
      return index === undefined ? slice.call(this) : this[index >= 0 ? index : index + this.length];
    },
  
    /**
     * Clone elements
     *
     * @return {Object}
     */
  
    clone: function () {
      var res = [];
      this.each(function () {
        res.push(this.cloneNode(true));
      });
      return tire(res);
    }
  });
  var _eventId = 1
    , c = {};
  
  /**
   * Get tire event id
   *
   * @param {Object} element The element to get tire event id from
   * @return {Integer}
   */
  
  function getEventId (element) {
    return element._eventId || (element._eventId = _eventId++);
  }
  
  /**
   * Get event handlers
   *
   * @param {Integer} id
   * @param {String} eventName
   * @return {Array}
   */
  
  function getEventHandlers (id, eventName) {
    c[id] = c[id] || {};
    return c[id][eventName] = c[id][eventName] || [];
  }
  
  /**
   * Create event handler
   *
   * @param {Object} element
   * @param {String} eventName
   * @param {Function} callback
   */
  
  function createEventHandler (element, eventName, callback) {
    var id = getEventId(element)
      , handlers = getEventHandlers(id, eventName);
  
    var fn = function (event) {
      if (callback.call(element, event) === false) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
  
    fn.guid = callback.guid = callback.guid || ++_eventId;
    handlers.push(fn);
    return fn;
  }
  
  /**
   * Add event to element, no support for delegate yet.
   * Using addEventListener or attachEvent (IE)
   *
   * @param {Object} element
   * @param {String} eventName
   * @param {Function} callback
   */
  
  function addEvent (element, eventName, callback) {
    var handler = createEventHandler(element, eventName, callback);
  
    if (element.addEventListener) {
      element.addEventListener(eventName, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent('on' + eventName, handler);
    }
  }
  
  /**
   * Remove event to element, no support for undelegate yet.
   * Using removeEventListener or detachEvent (IE)
   *
   * @param {Object} element
   * @param {String} eventName
   * @param {Function} callback (optional)
   */
  
  function removeEvent (element, eventName, callback) {
    var id = getEventId(element)
      , handlers = getEventHandlers(id, eventName);
  
    for (var i = 0; i < handlers.length; i++) {
      if (callback === undefined || callback.guid === handlers[i].guid) {
        if (element.removeEventListener) {
          element.removeEventListener(eventName, handlers[i], false);
        } else if (element.detachEvent) {
          var name = 'on' + eventName;
          if (tire.isString(element[name])) element[name] = null;
          element.detachEvent(name, handlers[i]);
        }
        c[id][eventName].remove(i, 1);
      }
    }
  
    delete c[id];
  }
  
  /**
   * Run callback for each event name
   *
   * @param {String} eventName
   * @param {Function} callback
   */
  
  function eachEvent(eventName, callback) {
    tire.each(eventName.split(' '), function (index, name) {
      callback(name);
    });
  }
  
  tire.events = tire.events || {};
  
  tire.fn.extend({
  
    /**
     * Add event to element
     *
     * @param {String} eventName
     * @param {Function} callback
     * @return {Object}
     */
  
    on: function (eventName, callback) {
      return this.each(function () {
        var self = this;
        eachEvent(eventName, function (name) {
          addEvent(self, name, callback);
        });
      });
    },
  
    /**
     * Remove event from element
     *
     * @param {String} eventName
     * @param {Function} callback (optional)
     * @return {Object}
     */
  
    off: function (eventName, callback) {
      return this.each(function () {
        var self = this;
        eachEvent(eventName, function (name) {
          removeEvent(self, name, callback);
        });
      });
    },
  
    /**
     * Trigger specific event for element collection
     *
     * @param {String} eventName The event to trigger
     * @param {Object} data JSON Object to use as the event's `data` property
     * @return {Object}
     */
  
    trigger: function (eventName, data) {
      return this.each(function (index, elm) {
        if (elm === document && !elm.dispatchEvent) elm = document.documentElement;
  
        var event
          , createEvent = !!document.createEvent;
  
        if (createEvent) {
          event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, true);
        } else {
          event = document.createEventObject();
          event.cancelBubble = true;
        }
  
        event.data = data || {};
        event.eventName = eventName;
  
        if (createEvent) {
          elm.dispatchEvent(event);
        } else {
          try { // fire event in < IE 9
            elm.fireEvent('on' + eventName, event);
          } catch (e) { // solution to trigger custom events in < IE 9
            elm.attachEvent('onpropertychange', function (ev) {
              if (ev.eventName === eventName && ev.srcElement._eventId) {
                var handlers = getEventHandlers(ev.srcElement._eventId, ev.eventName);
                if (handlers.length) {
                  for (var i = 0; i < handlers.length; i++) {
                    handlers[i](ev);
                  }
                }
              }
            });
            elm.fireEvent('onpropertychange', event);
          }
        }
      });
    }
  
  });
  /**
   * Create a JSONP request
   *
   * @param {String} url
   * @param {Object} options
   */
  
  function ajaxJSONP(url, options) {
    var name = (name = /callback\=([A-Za-z0-9\-\.]+)/.exec(url)) ? name[1] : 'jsonp' + (+new Date())
      , elm = document.createElement('script');
  
    elm.onerror = function () {
      tire(elm).remove();
      try { delete window[name]; }
      catch (e) { window[name] = undefined; }
      if (tire.isFun(options.error)) options.error('abort');
    };
    
    window[name] = function (data) {
      tire(elm).remove();
      try { delete window[name]; }
      catch (e) { window[name] = undefined; }
      ajaxSuccess(data, null, options);
    };
    
    options.data = tire.param(options.data);
    elm.src = url.replace(/\=\?/, '=' + name);
    tire('head')[0].appendChild(elm);
  }
  
  /**
   * Ajax success. Check if the dataType is JSON and try to parse it or just return the response text/xml.
   *
   * @param {Object} data
   * @param {Object} xhr
   * @param {Object} options
   * @return {Object}
   */
  
  function ajaxSuccess(data, xhr, options) {
    var res;
    if (xhr) {
      if ((options.dataType === 'json' || false) && (res = tire.parseJSON(xhr.responseText)) === null) res = xhr.responseText;
      if (options.dataType === 'xml') res = xhr.responseXML;
      res = res || xhr.responseText;
    }
    if (!res && data) res = data;
    if (tire.isFunction(options.success)) options.success(res);
  }
          
  tire.fn.extend({
    
    /**
     * Ajax method to create ajax request with XMLHTTPRequest (or ActiveXObject).
     * Supports JSONP, no cross domain yet.
     *
     * @param {String|Object} url
     * @param {Object|Function} options
     * @return {Object}
     */
    
    ajax: function (url, options) {
      options = options || {};
      
      if (tire.isObject(url)) {
        if (tire.isFunction(options)) {
          url.success = url.success || options;
        }
        options = url;
        url = options.url;
      }
      
      if (tire.isFunction(options)) options = { success: options };
      
      options.dataType = (options.dataType || '').toLowerCase();
          
      // won't do anything without a url
      if (!url) return;
      
      var self = this
        , method = (options.type || 'GET').toUpperCase()
        , params = options.data || null
        , jsonp = options.dataType === 'jsonp' || false
        , xhr
        , mime = { // support for script needed
            html: 'text/html',
            text: 'text/plain',
            xml: 'application/xml, text/xml',
            json: 'application/json'
        };
      
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) { // < IE 9
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }
      
      for (var k in mime) {
        if (url.indexOf('.' + k) !== -1 && !options.dataType) options.dataType = k;
      }
      
      // test for jsonp
      if (jsonp || /\=\?|callback\=/.test(url)) {
        if (!/\=\?/.test(url)) url = (url + '&callback=?').replace(/[&?]{1,2}/, '?');
        ajaxJSONP(url, options);
        return this;
      }
      
      if (xhr) {
        xhr.queryString = params;
        xhr.open(method, url, true);
        xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        
        if ((mime = mime[options.dataType]) !== undefined) {
          xhr.setRequestHeader('Accept', mime);
          if (mime.indexOf(',') !== -1) mime = mime.split(',')[0];
          if (xhr.overrideMimeType) xhr.overrideMimeType(mime);
        }
        
        if (options.contentType || options.data && method !== 'GET') {
          xhr.setRequestHeader('Content-Type', (options.contentType || 'application/x-www-form-urlencoded'));
        }
  
        for (var key in options.headers) {
          if (options.headers.hasOwnProperty(key)) {
            xhr.setRequestHeader(key, options.headers[key]);
          }
        }
        
        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
              if (options.success !== undefined) {
                ajaxSuccess(null, xhr, options);
              }
            } else if (options.error !== undefined) {
              options.error(xhr, options);
            }
          }
        };
        
        xhr.send(tire.param(params));
      }
  
      return this;
    }
  });
  
  tire.extend({
    ajax: tire.fn.ajax,
    
    /**
     * Create a serialized representation of an array or object.
     *
     * @param {Array|Object} obj
     * @param {Obj} prefix
     * @return {String}
     */
    
    param: function (obj, prefix) {
      var str = [];
      this.each(obj, function (p, v) {
        var k = prefix ? prefix + '[' + p + ']' : p;
        str.push(tire.isObject(v) ? tire.param(v, k) : encodeURIComponent(k) + '=' + encodeURIComponent(v));
      });
      return str.join('&').replace('%20', '+');
    }
  });

  // Expose tire to the global object
  window.$ = window.tire = tire;

  // Expose tire as amd module
  if (typeof define === 'function' && define.amd) {
    define('tire', [], function () {
      return tire;
    });
  }
}(window));
