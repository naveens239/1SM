var core = require('../../server/core');
core.set_globals();

var expect = require('chai').expect,
    _ = require('underscore'),
    flatten = require('flat'),
    categories_model = core.require_model('categories'),
    config_module = core.require_module('config'),
    categories_array = require('./categories.json');

config_module.init('development');//initialized only once
var config = config_module.getConfig();
core.databaseConfig(config.dbconfig);

var traverse_path;

 describe("Model::categories", function() {
     it("drop collection", drop);
     it("insert test data", insert);
 });


function drop(done) {
    categories_model.remove({}, function (err) {
        expect(err).to.not.be.ok;
        done();
    });
}

function insert(done) {
    _.each(categories_array, function(value){
        traverse_path = [];
        _.each(flatten(value), callback_insert);
    });
    done();
}

function callback_insert(value, key) {
    var path_array=[],
        counter = key.split('children').length - 1;
    // inserting value at the count of children
    traverse_path[counter] = value;
    // retrieving path
    for (var j = 0; j < counter; j++) {
        path_array.push(traverse_path[j]);
    }
    save_in_db(value, path_array.join(','));
}

function save_in_db(text, path){
    //TODO: also pass children
    console.log('text:',text,'; path:', path);
    var category = new categories_model({
        'text': text,
        'path': path
    });
    category.save(function (err, doc) {
        expect(err).to.not.be.ok;
    });
}
