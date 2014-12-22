var mongoose = require('mongoose');
var categories_schema = new mongoose.Schema(
    {
        text : String,
        path: String,
        children: [String]
    });
module.exports = mongoose.model('categories', categories_schema);