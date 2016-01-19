var IQEvent = function(type) {
  this.type = type;
  this.target = null;
  this.currentTarget = null;
}

IQEvent.prototype.property = function(name, value) {
  if (name != 'type' && name != 'target') {
    this[name] = value;
  }
  return this;
}

IQEvent.HEADERS = {};

// ============= Express ===========================
IQEvent.SERVER = 'server'
IQEvent.MONGOOSE_READY = 'mongooseReady';
IQEvent.EXPRESS_RENDER = 'expressRender';
IQEvent.HEADERS.debug = 'debug';


module.exports = IQEvent;
