var SmartEvent = function(type) {
  this.type = type;
  this.target = null;
  this.currentTarget = null;
}

SmartEvent.prototype.property = function(name, value) {
  if (name != 'type' && name != 'target') {
    this[name] = value;
  }
  return this;
}

module.exports = SmartEvent;
