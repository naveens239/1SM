var mongoose = require('mongoose');

var service_schema = new mongoose.Schema(
    {
        service_name : String,
        price        : Number,
        price_unit   : String,
        location     : String,
        notes        : String
    });
//Note: adding separately for recursive schema definition to work
service_schema.add(
    {
        services : [service_schema]
    });

module.exports = {
    model  : mongoose.model('service', service_schema)
};