var mongoose = require('mongoose');
var categories_schema = new mongoose.Schema(
    {
        text : String,
        price: Number,
        notes: String,
        state: {
            selected: Boolean,
            opened: Boolean
        }
    });
//Note: adding separately for recursive schema definition to work
categories_schema.add(
    {
        children: [categories_schema]
    });

module.exports = mongoose.model('categories', categories_schema);