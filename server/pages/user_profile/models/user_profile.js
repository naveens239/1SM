var mongoose = require('mongoose');

var identifiers_schema =
    {
        mobile       : String,
        altphone     : String,
        landphone    : String,
        email        : String,
        youtube      : String,
        facebook     : String,
        twitter      : String,
        website      : String,
        addressline1 : String,
        addressline2 : String,
        city         : String,
        pincode      : Number,
        state        : String
    };

var bank_schema =
    {
        account_name    : String,
        bank_name       : String,
        branch          : String,
        branch_district : String,
        branch_place    : String,
        branch_pincode  : String,
        account_number  : String,
        ifsc            : String
    };

var user_profile_schema = new mongoose.Schema(
    {
        username            : String,
        name                : String,//company or personal name
        featured            : Number,//stores the rank of featured vendors. rank <=0 or if this field is not there means not featured.
        identifiers         : identifiers_schema,
        services            : [ String ],
        best_way_to_contact : String,
        created             : { type : Date, default : Date.now },
        bank                : bank_schema
    });

var USER_PROFILE = 'user_profile';

module.exports = mongoose.model(USER_PROFILE, user_profile_schema);;