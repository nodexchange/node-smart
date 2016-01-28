var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PostSchema = new Schema({
    title: String,
    text: String,
    smallImage: String,
    largeImage: String,
    time: {type: Date, default: Date.now},
    type: String,
    companyName: String,
    index: String,
    clicks: String,
    section: String,
    subsection: String,
    tags: String,
    author: String,
    originalUrl: String,
    highlited: Boolean,
    published: Boolean
});

module.exports = mongoose.model('posts', PostSchema);
