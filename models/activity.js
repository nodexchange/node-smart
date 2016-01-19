var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ErrorLog = new Schema({
    errorCode: String,
    text: String,
    time: Date,
    type: String,
    section: String,
    subsection: String
});

module.exports = mongoose.model('logs', ErrorLog);
