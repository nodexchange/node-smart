var IQEvent = require('../event/IQEvent.js');
var async = require('async');

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
      self.accounts = event.accounts;
    });

    self.events.addEventListener(IQEvent.RENDER.DASHBOARD.HOME, function(event) {
      var req = event.request;
      var res = event.response;
      self.renderDashboard(req, res);
    });

    self.events.addEventListener(IQEvent.RENDER.DASHBOARD.ACCOUNTS, function(event) {
      var req = event.request;
      var res = event.response;
      self.renderDashboardAccounts(req, res);
    });

    self.events.addEventListener(IQEvent.RENDER.DASHBOARD.POSTS, function(event) {
      var req = event.request;
      var res = event.response;
      self.renderDashboardPosts(req, res);
    });

    self.events.addEventListener(IQEvent.REQUEST.JSON.ACCOUNTS, function(event) {
      self.renderJSON(event);
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
  getActivities: function(cb) {
    var self = this;
    self.activity.find({}).limit(10).cache().exec(cb);
    // self.activity.find({}).limit(10).cache().exec(function(err, activities) {
    //   //res.render('dashboard-posts', { user : req.user });
    //   res.render('dashboard-home', { user : req.user, activities: activities });
    // });
  },

  getAccounts: function(cb) {
    var self = this;
    self.accounts.find({}).limit(10).cache().exec(cb);
    // self.activity.find({}).limit(10).cache().exec(function(err, activities) {
    //   //res.render('dashboard-posts', { user : req.user });
    //   res.render('dashboard-home', { user : req.user, activities: activities });
    // });
  },

  getData: function(cb) {
    var self = this;
    async.parallel([self.getActivities(cb)], function(err, data) {
      if (!err) cb.apply(null, data);
    });
  },

  renderDashboard: function(req, res) {
    var self = this;
    self.getData(function(err, data) {
      res.render('dashboard-home', { user : req.user, activities: data });
    });

  },
  renderDashboardPosts: function(req, res) {
    var self = this;
    self.getData(function(err, data) {
      res.render('dashboard-posts', { user : req.user, activities: data });
    });
  },
  renderDashboardAccounts: function(req, res) {
    var self = this;
    self.getData(function(err, data) {
      res.render('dashboard-accounts', { user : req.user, activities: data });
    });
  },
  renderJSON: function(event) {
    var self = this;
    var req = event.request;
    var res = event.response;
    if (!req.user) {
      res.json({});
      return;
    }
    switch (event.type) {
      case IQEvent.REQUEST.JSON.ACCOUNTS:
        self.getAccounts(function(err, data) {
          var json = {"total":data.length,"rows":data};
          res.json(json);
        });
        break;
    }

  }
};

module.exports = function(settings, eventManager) {
  RequestHelper.prototype.events = eventManager;
  RequestHelper.prototype.settings = settings;
  return RequestHelper;
};
