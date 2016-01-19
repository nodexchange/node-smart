var mongoose = require('mongoose');
var SmartEvent = require('../event/SmartEvent.js');
var MongooseSchema = require('../database/MongooseSchema.js');

var MongooseController = function() {

  var ip_addr = process.env.OPENSHIFT_NODEJS_IP   || '127.0.0.1';
  var port    = process.env.OPENSHIFT_NODEJS_PORT || '8080';

  var connection_string = '127.0.0.1:27017/YOUR_APP_NAME';
  // if OPENSHIFT env variables are present, use the available connection info:
  if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    this.connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME;
  }

  this.settings = {
    'localhost': 'mongodb://localhost/',
    'live': 'mongodb://localhost/'
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

    mongoose.connect(database, function(err) {
      if (err) throw err;
    });
    mongoose.connection.on('error', function() {
      console.error.bind(console, 'connection error:');
    });
    mongoose.connection.on('open', function() {
      var buy = mongoose.model('Bought', mongoose.Schema(MongooseSchema.BOUGHT));
      var sell = mongoose.model('Sold', mongoose.Schema(MongooseSchema.SOLD));
      var retire = mongoose.model('Retired', mongoose.Schema(MongooseSchema.RETIRED));
      var budget = mongoose.model('Budget', mongoose.Schema(MongooseSchema.BUDGET_ACCOUNT));
      var report = mongoose.model('Report', mongoose.Schema(MongooseSchema.DAILY_REPORT));

      var event = new SmartEvent(SmartEvent.MONGOOSE_READY);
      event.mongoose = mongoose;
      event.buy = buy;
      event.sell = sell;
      event.retire = retire;
      event.budget = budget;
      event.report = report;

      self.smartDispatcher.dispatchEvent(event);
    });
  }
}

module.exports = function(smartDispatcher, settings) {
  MongooseController.prototype.smartDispatcher = smartDispatcher;
  MongooseController.prototype.settings = settings;
  return MongooseController;
}
