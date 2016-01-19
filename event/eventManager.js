var EventController = function() {
  this.eventTypes = {};
};

EventController.prototype.addEventListener = function(type, handler, obj) {
  if (typeof this.eventTypes[type] == 'undefined') {
    this.eventTypes[type] = [];
  }
  if (!this.inArray(handler, this.eventTypes[type])) {
    if (typeof obj == 'undefined') {
      this.eventTypes[type].push(handler);
    } else {
      this.eventTypes[type].push({'ref': obj, 'handler': handler});
    }
  }
}

EventController.prototype.removeEventListener = function(type, handler, obj) {
  if (typeof this.eventTypes[type] == 'undefined') {
    return;
  }
  var typeLength = this.eventTypes[type].length;
  for (var i = 0; i < typeLength; i++) {
    var callbackObj = this.eventTypes[type][i];
    var callbackType = (typeof obj == 'undefined') ? 'function' : 'object';
    if (callbackType == typeof callbackObj) {
      switch (callbackType) {
        case 'function':
          if (callbackObj == handler) {
            this.eventTypes[type].splice(i, 1);
          }
          break;
        case 'object':
          if (callbackObj.handler == handler && callbackObj.ref == obj) {
            this.eventTypes[type].splice(i, 1);
          }
          break;
      }
    }
  }
}

EventController.prototype.dispatchEvent = function(event) {
  if (typeof event == 'string') {
    event = new SmartEvent(event);
  }

  if ((typeof event.type == 'string') && (typeof this.eventTypes[event.type] != 'undefined')) {
    if (typeof event.target == 'undefined' || event.target === null) {
      event.target = this;
    }
    event.currentTarget = this;
    /*
     * Clone event types as an event handler could call removeEventListener API, altering the
     * specific eventType array.
     */
    var header = '';
    if (event.header) {
      header = ' && header: '+event.header;
    }
    if (this.settings.DEBUG.ENABLED && this.settings.DEBUG.LOGGING) {
      console.log('[EventController]' +': '+event.type + header);
    }
    var eventTypeClone = this.eventTypes[event.type].slice(0);
    for (var i = 0; i < eventTypeClone.length; i++) {
      var callbackObj = eventTypeClone[i];
      if (typeof callbackObj == 'object') {
        callbackObj.handler.call(callbackObj.ref, event);
      } else {
        callbackObj(event);
      }
    }
  } else {
    if (this.settings.DEBUG.ENABLED && this.settings.DEBUG.LOGGING) {
      console.log('[EventController] ' + ' NO HANDLER FOR : '+event.type);
    }
  }
}
EventController.prototype.inArray = function(needle, haystack) {
  if (this.isArray(haystack)) {
    for (var i = 0; i < haystack.length; i++) {
      if (haystack[i] == needle) {
        return true;
      }
    }
  } else {
    for (var key in haystack) {
      if (haystack.hasOwnProperty(key) && haystack[key] == needle) {
        return true;
      }
    }
  }
  return false;
}
EventController.prototype.isArray = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() == 'array';
}

module.exports = function(settings) {
  EventController.prototype.settings = settings;
  return EventController;
}
