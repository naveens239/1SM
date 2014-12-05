var mongoose = require('mongoose');
var service_schema = require('./service').schema;

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

/*var services =
 {
 select_services          : [String],
 other_services           : String,
 other_services_location  : String,
 select_catering          : [String],
 other_menu               : String,
 menu_pricing             : String,
 select_catering_loc      : [String],
 menu_notes               : String,
 other_photo_pack         : String,
 photo_pricing            : String,
 select_photography_loc   : [String],
 photo_notes              : String,
 other_video_pack         : String,
 video_pricing            : String,
 select_videography_loc   : [String],
 video_notes              : String,
 other_stream_pack        : String,
 stream_pricing           : String,
 select_stream_loc        : [String],
 stream_notes             : String,
 other_makeup_pack        : String,
 makeup_pricing           : String,
 select_bridal_makeup_loc : [String],
 bridal_notes             : String,
 jewellery_notes          : String,
 bridalwear_notes         : String,
 designer_notes           : String,
 cosmetics_notes          : String,
 cards_notes              : String,
 travel_notes             : String,
 accessories_notes        : String,
 venue_notes              : String
 };*/

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
        vendor_name         : String,
        featured            : Number,//stores the rank of featured vendors. rank <=0 or if this field is not there means not featured.
        identifiers         : identifiers_schema,
        services            : [ service_schema ],
        best_way_to_contact : String,
        created_by_agent_id : String,
        created             : { type : Date, default : Date.now },
        gallery_notes       : String,
        bank                : bank_schema
    });

module.exports = {
    model: mongoose.model('user_profile', user_profile_schema),
    schema: {
        identifiers: identifiers_schema,
        bank: bank_schema
    }
};