var mongoose = require('mongoose');
var IQEvent = require('../event/IQEvent');

var MongooseController = function() {

  var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
  var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

  var connection_string = '127.0.0.1:27017/NODE-SMART';
  // if OPENSHIFT env variables are present, use the available connection info:
  if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    this.connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }

  this.settings = {
    'localhost': 'mongodb://localhost/node-smart',
    'live': 'mongodb://localhost/node-smart'
  }
  this.init();
}

MongooseController.prototype = {
  init: function() {
    if (process.env.OPENSHIFT_NODEJS_IP) {
      var database = 'mongodb://'+this.connectionString;
    } else {
      var database = this.settings.localhost;
    }
    var self = this;

    var activityModel = require('../models/activity');

    mongoose.connect(database, function(err) {
      if (err) throw err;
    });
    mongoose.connection.on('error', function() {
      console.error.bind(console, 'connection error:');
    });
    mongoose.connection.on('open', function() {
      var event = new IQEvent(IQEvent.MONGOOSE_READY);
      event.mongoose = mongoose;
      event.activity = activityModel;
      //event.users = users;
      self.events.dispatchEvent(event);
    });
  }
}

module.exports = function(settings, eventManager) {
  MongooseController.prototype.events = eventManager;
  MongooseController.prototype.settings = settings;
  return MongooseController;
}
