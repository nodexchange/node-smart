var IQEvent = require('../event/IQEvent.js');

var ActivityController = function() {
  this.addEventListeners();
};

ActivityController.prototype = {
  init: function() {
    var self = this;
    //    self.events.dispatchEvent(event);
  },

  addEventListeners: function() {
    var self = this;
    self.events.addEventListener(IQEvent.MONGOOSE_READY, function(event) {
      self.activity = event.activity;
    });

    self.events.addEventListener(IQEvent.EXPRESS_RENDER, function(event) {
      
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

  log: function() {
    this.activity.find({}, function(err, response) {
      console.log(response);
    });
  },

  dummyActivities: function() {
    var self = this;
    var dummyData = [
      {author:'Martin Buchannon', text:'created new page', section:'Contact', subsection:'Wireframes Taiga Tribe', action:'save'},
      {author:'Michael Buchannon', text:'updated new page', section:'Contact', subsection:'Wireframes Taiga Tribe', action:'save'},
      {author:'Tom Buchannon', text:'removed new page', section:'Contact', subsection:'Wireframes Taiga Tribe', action:'save'},
      {author:'Carl Buchannon', text:'cloned new page', section:'Contact', subsection:'Wireframes Taiga Tribe', action:'save'}
    ];
    // TODO(martin): check if that works.
    var saveFnc = function(err, response) {
      if (err) {
        console.log('[Error]' + ' SAVE ERROR: ITEM : ' + ' Error message: '+err);
        self.events.dispatchEvent(new SmartEvent(SmartEvent.TRANSACTION_ERROR));
        return console.error(err);
      }
      console.log('saved');
    };
    for (var i=0; i<dummyData.length; i++) {
      var activity = new self.activity(dummyData[i]);
      activity.save(saveFnc);
    }
  },
  flush: function() {
    this.activity.remove({}, function(err) {
      console.log('collection removed');
    });
  },
};

module.exports = function(settings, eventManager) {
  ActivityController.prototype.events = eventManager;
  ActivityController.prototype.settings = settings;
  return ActivityController;
};
