// dependencies
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var settings = require('./config/settings');
var IQEvent = require('./event/IQEvent');
var EventManager = require('./event/eventManager')(settings);
var events = new EventManager();
var RequestHelper = require('./helpers/request')(settings, events);
var PostHelper = require('./helpers/post')(settings, events);
var Activity = require('./controllers/activity')(settings, events);
var Mongoose = require('./controllers/mongoose')(settings, events);
var Routes = require('./routes/routes')(settings, events);
var users = require('./routes/users');

var requestHelper = new RequestHelper();
var postHelper = new PostHelper();
var activity = new Activity();
var mongoose = new Mongoose();
var routes = new Routes();

var packageJson = require('./package.json');
// console.log(packageJson.version);
// console.log(process.release);
// console.log(process.uptime());

var app = express();

app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes.getRoutes());

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
//mongoose.connect('mongodb://localhost/node-smart');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

console.log("listening on " + app.get('port') + "!");
