var IQEvent = require('../event/IQEvent.js');
var async = require('async');

var PostHelper = function() {
  this.activity = {};
  this.accounts = {};
  this.addEventListeners();
};

PostHelper.prototype = {
  init: function() {
    var self = this;
  },

  addEventListeners: function() {
    var self = this;
    self.events.addEventListener(IQEvent.MONGOOSE_READY, function(event) {
      self.activity = event.activity;
      self.accounts = event.accounts;
    });
    self.events.addEventListener(IQEvent.POST.JSON.ACCOUNTS, function(event) {
      var action = event.request.body.action;
      if (!event.request.user) {
        event.request.json({result:'NOT AUTHORISED', action:action});
        return;
      }
      switch (action) {
        case 'remove':
          return self.removeAccount(event);
        break;
      }
      res.json({result:'NOT FOUND', action:action});
      //self.renderJSON(event);
    });
  },
  removeAccount: function(event) {
    var self = this;
    try {
      var req = event.request;
      var res = event.response;
      self.accounts.find({_id:req.body.id}).remove(function(err, response) {
        if (err) {
          console.error(err);
          res.json({result:'FAILURE', action:req.body.action});
          return
        }
        res.json({result:'SUCCESS', action:req.body.action});
        //self.smartDispatcher.dispatchEvent(new SmartEvent(SmartEvent.TRANSACTION_COMPLETE));
      });
    } catch (e) {
      console.error(e);
    }

  }
};

module.exports = function(settings, eventManager) {
  PostHelper.prototype.events = eventManager;
  PostHelper.prototype.settings = settings;
  return PostHelper;
};
