var IQEvent = require('../event/IQEvent.js');

var RequestHelper = function() {
  this.addEventListeners();
};

RequestHelper.prototype = {
  init: function() {
    var self = this;
    //TODO(martin): CONSIDER DB CALLS / REQUEST / NETWORK CACHE HERE
    //
/* request structure
== Option 1 ==
calls come through
router receives it
dispatchesEvent
requestreceives it
checks the last date since db data updated
returns db data
sends back the response with the data included.
==

== Improve calls speeds, i.e. only latest 10 etc.


  */
  },

  addEventListeners: function() {
    var self = this;
    self.events.addEventListener(IQEvent.MONGOOSE_READY, function(event) {
      self.activity = event.activity;
    });

    self.events.addEventListener(IQEvent.EXPRESS_RENDER, function(event) {
      self.activity.find({}, function(err, response) {
        event.response.json(response);
      });
    });
    self.events.addEventListener(IQEvent.SERVER, function(event) {
      if (event.header == IQEvent.HEADERS.debug) {
        switch (event.route) {
          case 'activity':
            if (event.action == 'add') {
              self.dummyActivities();
            } else if (event.action == 'log') {
              self.log();
            } else if (event.action == 'flush') {
              self.flush();
            }
            break;
        }
      }
    });
  },
};

module.exports = function(settings, eventManager) {
  RequestHelper.prototype.events = eventManager;
  RequestHelper.prototype.settings = settings;
  return RequestHelper;
};
