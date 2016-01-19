var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();


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
    res.render('dashboard-home', { user : req.user });
  } else {
    res.render('login', { user : req.user });
  }
});

// ADMIN
router.get('/dashboard-posts', function (req, res) {
  if (req.user) {
    res.render('dashboard-posts', { user : req.user });
  } else {
    res.render('login', { user : req.user });
  }
});

/* DEBUG */
router.get('/debug/:action', function(req, res) {
  switch(req.query.section) {
    case 'activity':
      if (req.query.action == 'add') {
        console.log('READY TO ADD');
      }
      break;
  }
  //self.dispatchServerSmartEvent(SmartEvent.HEADERS.debug, 'buy');
  // self.sendHtmlResponse(res, 'Dispatched Budget Buy '+Math.random()*2000 + ' ::: ');
});


module.exports = router;
