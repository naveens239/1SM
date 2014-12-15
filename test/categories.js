var core = require('../server/core');
core.set_globals();

var expect = require('chai').expect,
    _ = require('underscore'),
    categories_model = core.require_model('categories'),
    config_module = core.require_module('config');

config_module.init('development');//initialized only once
var config = config_module.getConfig();

var test_data = [
    {
        text: 'Featured 3d models',
        notes       : 'Featured 3d models',
        state : {
            selected : true
        },
        children    : [
            { text: 'Art'},
            { text: 'Accessories', children:[
                { text: 'Cases'},{ text: 'Key chains'}
            ]},
            { text: 'Gadgets'}
        ]
    },
    {
        text: 'Featured 3d vendors',
        notes       : 'Featured 3d vendors'
    }
];

core.databaseConfig(config.dbconfig);

var category;

describe("Model::categories", function () {

    it("drop collection", function(done){
        categories_model.remove({}, function(err) {
            expect(err).to.not.be.ok;
            done();
        });
    });

    it("insert test data", function (done) {

        _.each(test_data, function(obj){
            category = new categories_model(obj);
            category.save(function(err, doc){
                expect(err).to.not.be.ok;
            });
        });
        done();
    });
});