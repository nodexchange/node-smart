var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ActivitySchema = new Schema({
    author: String,
    text: String,
    time: {type: Date, default: Date.now},
    type: String,
    section: String,
    subsection: String
});

module.exports = mongoose.model('activity', ActivitySchema);
