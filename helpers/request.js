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
      var req = event.request;
      var res = event.response;
      var header = event.header;
      console.log(header);
      switch (header) {
        case 'dashboard':
          self.renderDashboard(req, res);
          //res.render('dashboard-home', { user : req.user });
          break;
        case 'dashboard-posts':
          self.renderDashboardPosts(req, res);
          break;
      }
      //self.activity.find({}).limit(10).cache().exec(function(err, activities) {
      //  console.log(activities);
      //})
/*
self.activity.find({}, function(err, response) {
  event.response.json(response);
})
      async.parallel([
    getUserProfile,
    getRecentActivity,
    getSubscriptions,
    getNotifications
  ], function(err, results) {
    //This callback runs when all the functions complete
  });

      Post.find().limit(10).exec(function(err, posts) {
  //send posts to client
});

      */;
    });
  },
  renderDashboard: function(req, res) {
    var self = this;
    self.activity.find({}).limit(10).cache().exec(function(err, activities) {
      console.log(activities);
      //res.render('dashboard-posts', { user : req.user });
      res.render('dashboard-home', { user : req.user });
    })

  },
  renderDashboardPosts: function(req, res) {
    res.render('dashboard-posts', { user : req.user });
  }
};

module.exports = function(settings, eventManager) {
  RequestHelper.prototype.events = eventManager;
  RequestHelper.prototype.settings = settings;
  return RequestHelper;
};
