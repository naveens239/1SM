'use strict';

var core = require(__server_path + '/core'),
    mockUI = core.require_module('mock_ui'),
    _ = require('underscore');

module.exports = {
    page_routes: function (router) {
        router.get('/', function(req, res){res.redirect('/home')});
        router.get('/home', home);//mock ui would take care of this for now until business logic is ready

        //test
        router.post('/homesubmit', homesubmit);
    }
};

function home(req, res) {
    console.log('in /home');
    var response_data = _.extend(mockUI.read_mock_data(req), core.is_logged_in(req, true));
        res.render('home/home', response_data);
}

function homesubmit(req, res) {
    //_.each(req.body, function (value, key) {
    //});
    console.log(req.body.checked_categories);
    res.redirect('/home');
}