var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Log = new Schema({
    errorCode: String,
    type: String,
    text: String,
    time: {type: Date, default: Date.now},
    section: String,
    subsection: String
});

module.exports = mongoose.model('log', Log);
