/*-----------------------------------------------------------------------------+
| Products:  com.iskitz.dom.events.EventTarget
|            com.iskitz.dom.events.EventException
|            com.iskitz.util.Collection
|            com.iskitz.util.Iterator
|
|           (c) 2003-2005 Michael Lee, iSkitz.com, All rights reserved.
|+-----------------------------------------------------------------------------+
| Author:   Michael A. I. Lee [iskitz@yahoo.com]
| Created:  Thursday,  May       12, 2003    [2005.05.12]
| Modified: Friday,    October   21, 2005    [2005.10.21 - 13:56:46 EST]
| Version:  0.2
|+-----------------------------------------------------------------------------+
| DOM2 EventTarget Emulation.
*-----------------------------------------------------------------------------*/
Package("com.iskitz.util");
com.iskitz.util.Collection = function (members, copy) {
  this.add = function add(object) {
    var _length = _members.length;
    _members[_members.length] = object;
    return _length < _members.length;
  };
  this.addAll = function addAll(object) {
    if (object == undefined) throw "Cannot add from undefined object!";
    var _isArray = object.constructor == Array;
    var _isCollection = object.constructor == com.iskitz.util.Collection;
    var _length = _members.length;
    if (_isArray) _addArray(object);
    else if (_isCollection) _addCollection(object);
    else throw "Invalid object type! Requires Array or Collection";
    return _length < _members.length;
  };
  this.clear = function clear() {
    return (_members = []);
  };
  this.contains = function contains(object) {
    return _indexOf(object) >= 0;
  };
  this.containsAll = function containsAll(object) {
    var _object = object.toArray();
    for (var i = _object.length; --i >= 0; )
      if (!this.contains(_object[i])) return false;
    return true;
  };
  this.isEmpty = function isEmpty() {
    return _members.length == 0;
  };
  this.iterator = function iterator() {
    return typeof Iterator == "undefined"
      ? new com.iskitz.util.Iterator(this)
      : new Iterator(this);
  };
  this.remove = function remove(object) {
    var i = _indexOf(object);
    if (i == -1) return false;
    _members[i] = undefined;
    for (var j = _members.length - 1; i < j; i++)
      _members[i] == _members[i + 1];
    _members.length--;
    return true;
  };
  this.removeAll = function removeAll(object) {
    var _length = _members.length;
    var _object = object.toArray();
    for (var i = _object.length; --i >= 0; ) this.remove(_object[i]);
    return _length > _members.length;
  };
  this.size = function size() {
    return _members.length;
  };
  this.toArray = function toArray() {
    var _arrayCopy = [];
    for (var i = 0, j = _members.length; i < j; i++)
      _arrayCopy[i] = _members[i];
    return _arrayCopy;
  };
  this.toString = function toString() {
    var _output =
      _members.length > 0 ? "[" : "[object com.iskitz.util.Collection";
    var _end = _members.length - 1;
    for (var i = 0; i < _members.length; i++) {
      _output += "" + eval(_members[i]);
      if (i < _end) _output += ", ";
    }
    return _output + "]\n";
  };
  var _members = [];
  if (members != undefined)
    if (copy == undefined || !copy) _members = members;
    else this.add(members);
  var _addArray = function _addArray(array) {
    for (var i = 0; i < array.length; i++) _members[_members.length] = array[i];
  };
  var _addCollection = function _addCollection(collection) {
    var _collection = collection.toArray();
    for (var i = 0, j = _collection.length; i < j; i++)
      _members[_members.length] = _collection[i];
  };
  var _indexOf = function _indexOf(object) {
    for (var i = 0; i < _members.length; i++)
      if (_members[i] == object) return i;
    return -1;
  };
};
Package("com.iskitz.util");
Import("com.iskitz.util.Collection");
com.iskitz.util.Iterator = function (object) {
  if (
    !object ||
    object.constructor != Collection ||
    !(object instanceof Collection)
  )
    throw "Invalid Collection object";
  var _object = object.toArray();
  var _index = 0;
  this.hasNext = function hasNext() {
    return _index < _object.length;
  };
  this.next = function next() {
    return _object[_index++];
  };
  this.remove = function remove() {
    object.remove(_object[_index]);
  };
  this.toString = function toString() {
    return "[object com.iskitz.util.Iterator]";
  };
};
Import("com.iskitz.util.Iterator");
Package("com.iskitz.dom.events");
com.iskitz.dom.events.EventException = function () {
  function EventException() {
    var Class = com.iskitz.dom.events.EventException.prototype;
    Class.UNSPECIFIED_EVENT_TYPE_ERR = 0;
    Class.getClass = function getClass() {
      return Class;
    };
  }
  if (!com.iskitz.dom.events.EventException.prototype.getClass)
    EventException();
  this.toString = function toString() {
    var gotMatch = false;
    var code = 0;
    for (var exceptionCode in this)
      if (this[exceptionCode] == code) {
        gotMatch = true;
        break;
      }
    return "EventException: " + gotMatch
      ? exceptionCode + " = "
      : "Unknown exception - " +
          code +
          " :: Event type must be initialized before dispatching!";
  };
};
Package("com.iskitz.dom.events");
Import("com.iskitz.dom.events.EventException");
Import("com.iskitz.util.Collection");
com.iskitz.dom.events.EventTarget = function (target) {
  if (!target) target = this;
  if (
    !com.iskitz.util.Collection ||
    (target.addEventListener && target.removeEventListener)
  )
    return;
  var listeners = {},
    listenersVIP = {},
    tempListener;
  function createBaseListener(type) {
    target[type] = handleEvent;
  }
  function handleEvent(e) {
    var type = "on" + (e = e || event).type;
    var baseEventListener = target[type];
    var allListeners = [listeners[type], listenersVIP[type]];
    for (var iterator, i = allListeners.length; --i >= 0; ) {
      if (!allListeners[i]) continue;
      iterator = allListeners[i].iterator();
      if (!iterator) continue;
      for (var listener; iterator.hasNext(); ) {
        listener = iterator.next();
        if (!listener || listener.constructor != Function) continue;
        target[type] = listener;
        logListener("doing", target, type, listener);
        target[type](e);
        target[type] = baseEventListener;
      }
    }
    return true;
  }
  target.addEventListener = function addEventListener(
    type,
    listener,
    useCapture
  ) {
    if (!(type && listener)) return;
    type = "on" + type;
    if (!(listeners[type] || listenersVIP[type])) {
      if (this[type]) {
        if (!listeners[type])
          listeners[type] = new com.iskitz.util.Collection();
        listeners[type].add(this[type]);
      }
      createBaseListener(type);
    }
    tempListener = useCapture ? listenersVIP : listeners;
    if (!tempListener[type])
      tempListener[type] = new com.iskitz.util.Collection();
    if (tempListener[type].contains(listener)) return;
    tempListener[type].add(listener);
    logListener("added", target, type, listener);
  };
  var _destroy = target.destroy;
  target.destroy = function destroy() {
    listeners = listenersVIP = tempListener = undefined;
    if (typeof _destroy == "function") _destroy();
  };
  target.dispatchEvent = function dispatchEvent(e) {
    if (!e) return true;
    if (!e.type) throw new EventException();
    var type = "on" + e.type;
    if (typeof this[type] == "function") this[type](e);
    return true;
  };
  target.removeEventListener = function removeEventListener(
    type,
    listener,
    useCapture
  ) {
    if (!type) return;
    type = "on" + type;
    tempListener = useCapture ? listenersVIP : listeners;
    if (!tempListener[type]) return;
    tempListener[type].remove(listener);
    logListener("removed", target, type, listener);
  };
  var prevMessages = "";
  function logListener(action, target, type, listener) {
    if (typeof Logger == "undefined") return;
    var re = /function\s+(\w+)\(/;
    var id = target.getId ? target.getId() : target.id;
    var msg =
      "\n" +
      action.toUpperCase() +
      " [" +
      id +
      "." +
      type +
      "\t=" +
      re.exec(listener.toString())[1] +
      "]";
    if (typeof Logger != "undefined") {
      msg = prevMessages + msg;
      Logger.log(msg.replace(/\n/gi, "<br>"));
      prevMessages = "";
    } else {
      prevMessages += msg;
    }
  }
};
