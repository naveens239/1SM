var mongoose = require('mongoose'),
    core     = require(__server_path + '/core');

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
        is_vendor           : Boolean,
        vendor_name         : String,
        featured            : Number,//stores the rank of featured vendors. rank <=0 or if this field is not there means not featured.
        identifiers         : identifiers_schema,
        services            : [String],
        best_way_to_contact : String,
        created             : {type : Date, default : Date.now},
        bank                : bank_schema
    });

user_profile_schema.pre('save', function(next) {
    console.log('in user_profile_schema pre save');
    var user_profile = this;
    //prefix country code if needed
    if(user_profile.identifiers.mobile){
        user_profile.identifiers.mobile = core.prefix_country_code(user_profile.identifiers.mobile);
    }
    next();
});

module.exports = mongoose.model('user_profile', user_profile_schema);