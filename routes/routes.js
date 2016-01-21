var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var IQEvent = require('../event/IQEvent');
var router = express.Router();
var Routes = function() {
  this.init();
};
Routes.prototype = {
  init: function(event) {
    var self = this;
    this.createRoutes();
  },
  /**
   * Add eventManager event listeners
   */
  addSmartListeners: function() {
    var self = this;
    self.eventManager.addEventListener(IQEvent.SERVER, function(event) {
      switch (event.header) {
        case IQEvent.HEADERS.socket:
            self.init(event);
          break;
      }
    });
  },
  /**
   *  Create the routing table entries + handlers for the application.
   */
  createRoutes: function() {
    var self = this;
    router.get('/', function (req, res) {
        res.render('index', { user : req.user });
    });

    router.get('/register', function(req, res) {
        res.render('register', { });
    });

    router.post('/register', function(req, res, next) {
        Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
            if (err) {
              return res.render("register", {info: "Sorry. That username already exists. Try again."});
            }

            passport.authenticate('local')(req, res, function () {
                req.session.save(function (err) {
                    if (err) {
                        return next(err);
                    }
                    res.redirect('/');
                });
            });
        });
    });


    router.get('/login', function(req, res) {
        res.render('login', { user : req.user });
    });

    router.post('/login', passport.authenticate('local'), function(req, res, next) {
        req.session.save(function (err) {
            if (err) {
              console.log(err);
                return next(err);
            }
            res.redirect('/dashboard');
        });
    });

    router.get('/logout', function(req, res, next) {
        req.logout();
        req.session.save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    });

    // ADMIN
    router.get('/dashboard', function (req, res) {
      if (req.user) {
        self.dispatchRenderEvent('dashboard',req, res);
      } else {
        res.render('login', { user : req.user });
      }
    });
    // ADMIN
    router.get('/dashboard-posts', function (req, res) {
      if (req.user) {
        self.dispatchRenderEvent('dashboard-posts', req, res);
        //res.render('dashboard-posts', { user : req.user });
      } else {
        res.render('login', { user : req.user });
      }
    });

    router.get('/dashboard-accounts', function (req, res) {
      if (req.user) {
        self.dispatchRenderEvent('dashboard-accounts', req, res);
        //res.render('dashboard-posts', { user : req.user });
      } else {
        res.render('login', { user : req.user });
      }
    });

    router.post('/api/data/dashboard-accounts', function(req, res, next) {
      if (req.user) {
        console.log('[dashboard-accounts] authorised to make the request');
        var json = '{"current":1,"rowCount":10,"rows":[{"id":19,"sender":"123@test.de","received":"2014-05-30T22:15:00"},{"id":14,"sender":"123@test.de","received":"2014-05-30T20:15:00"},...],"total":1123}';
        res.json(json);
      } else {
        console.log('[dashboard-accounts] NOT authorised to make the request');
        res.json({});
      }
    });


    /* DEBUG */
    router.get('/debug/:action', function(req, res) {
      switch(req.query.section) {
        case 'activity':
          self.dispatchServerIQEvent(IQEvent.HEADERS.debug, 'activity', req.query.action);
          self.sendHtmlResponse(res, 'debug activity  '+Math.random()*2000 + ' ::: ');
          break;
      }
      //self.dispatchServerIQEvent(IQEvent.HEADERS.debug, 'buy');
      // self.sendHtmlResponse(res, 'Dispatched Budget Buy '+Math.random()*2000 + ' ::: ');
    });
  },

  sendHtmlResponse: function(res, message) {
    res.send('<html><body><p>' + message + '</p></body></html>');
  },

  dispatchRenderEvent: function(header, req, res) {
    var event = new IQEvent(IQEvent.EXPRESS_RENDER);
    event.header = header;
    event.request = req;
    event.response = res;
    this.eventManager.dispatchEvent(event);
  },

  dispatchServerIQEvent: function(header, route, action) {
    var event = new IQEvent(IQEvent.SERVER);
    event.header = header;
    event.route = route;
    event.action = action;
    this.eventManager.dispatchEvent(event);
  },

  getRoutes: function() {
    return router;
  }
};

module.exports = function(settings, eventManager) {
  Routes.prototype.settings = settings;
  Routes.prototype.eventManager = eventManager;
  return Routes;
};
