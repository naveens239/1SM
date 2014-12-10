//set global paths
var path = require('path');
var root_path = path.join(__dirname, '..');
global.__server_path = path.join(root_path, 'server');
global.__client_path = path.join(root_path, 'client');


var expect = require('chai').expect,
    core = require(__server_path + '/core'),
    user_profile_model = require(__server_path + '/pages/user_profile/models/user_profile'),
    _ = require('underscore');

var test_data = {
    "vendor_name"         : "v1",
    "email"               : "ppc@gmail.com",
    "website"             : "w",
    "fbpage"              : "f",
    "youtube"             : "y",
    "twitter"             : "t",
    "mobile"              : "11111",
    "altphone"            : "22222",
    "landphone"           : "33333",
    "addressline1"        : "add1",
    "addressline2"        : "add2",
    "state"               : "Kerala",
    "city"                : "tvm",
    "pincode"             : "66666",
    "best_way_to_contact" : ["Email", "Mobile"],
    "account_name"        : "a1",
    "bank_name"           : "b1",
    "branch"              : "c1",
    "branch_district"     : "d1",
    "branch_place"        : "e1",
    "branch_pincode"      : "f1",
    "account_number"      : "g1"
};

var profile;

describe("Flat Data to Model Test", function () {

    it("should copy to model", function () {
        profile = new user_profile_model();

        core.flat_data_to_model(test_data, profile);
        //console.log(profile);

        expect(profile.identifiers.email).to.equal(test_data.email);
        expect(profile.bank.bank_name).to.equal(test_data.bank_name);
    });
});

describe("Model to Flat Data Test", function () {
    it("should copy from model", function () {
        //profile = new user_profile_model();
        //core.flat_data_to_model(test_data, profile);

        var flat_data = core.model_to_flat_data(profile);
        //console.log('flat_data:'+JSON.stringify(flat_data));

        expect(flat_data.email).to.equal(profile.identifiers.email);
        expect(flat_data.bank_name).to.equal(profile.bank.bank_name);
    });
});
