var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Activity = new Schema({
    author: String,
    type: String,
    text: String,
    time: Date,
    section: String,
    subsection: String
});

module.exports = mongoose.model('logs', ErrorLog);
