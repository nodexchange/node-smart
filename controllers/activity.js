var SmartEvent = require('../event/SmartEvent.js');

var ActivityController = function() {
  this.init();
}

ActivityController.prototype = {
  init: function() {
    var self = this;
//    self.smartDispatcher.dispatchEvent(event);
  },
  
  log: function() {
    this.activity.find({}, function(err, response) {
      console.log(response);
    });
  }
}

module.exports = function(smartDispatcher, settings) {
  ActivityController.prototype.smartDispatcher = smartDispatcher;
  ActivityController.prototype.settings = settings;
  return ActivityController;
}
