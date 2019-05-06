function isValidListener(listener) {
    if (typeof listener === 'function') {
          return true
    } else if (listener && typeof listener === 'object') {
          return isValidListener(listener.listener)
    } else {
          return false
    }
};
function indexOf(array, item) {
  if (array.indexOf) {
      return array.indexOf(item);
  } else {
      var result = -1;
      for (var i = 0, len = array.length; i < len; i++) {
          if (array[i] === item) {
              result = i;
              break;
          }
      }
      return result;
    }
};
function EventEmitter() {
  this.__event = {};
};

EventEmitter.prototype.on = function(eventName, listener) {
        if (!eventName || !listener) return;

        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var events = this.__events;
        var listeners = events[eventName] = events[eventName] || [];
        var listenerIsWrapped = typeof listener === 'object';

        // 不重复添加事件
        if (indexOf(listeners, listener) === -1) {
            listeners.push(listenerIsWrapped ? listener : {
                listener: listener,
                once: false
            });
        }
        return this;
    };

EventEmitter.prototype.once = function(eventName, listener) {
    return this.on(eventName, {
          listener: listener,
          once: true
    })
};

EventEmitter.prototype.off = function(eventName, listener) {
  var listeners = this.__events[eventName];
  if (!listeners) return;

  var index;
  for (var i = 0, len = listeners.length; i < len; i++) {
    if (listeners[i] && listeners[i].listener === listener) {
        index = i;
        break;
    }
  }

  if (typeof index !== 'undefined') {
    listeners.splice(index, 1, null)
  }

  return this;
};

EventEmitter.prototype.emit = function(eventName, args) {
  var listeners = this.__events[eventName];
  if (!listeners) return;
  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];
    if (listener) {
      listener.listener.apply(this, args || []);
      if (listener.once) {
          this.off(eventName, listener.listener)
      }
    }
  }
  return this;
};
