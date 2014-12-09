'use strict';

var core = require(__server_path + '/core'),
    mockUI = require(__server_path + '/modules/mock_ui/mock_ui'),
    _ = require('underscore');

module.exports = {
    page_routes: function (router) {
        router.get('/', function(req, res){res.redirect('/home')});
        router.get('/home', home);//mock ui would take care of this for now until business logic is ready
    }
}

function home(req, res) {
    var response_data = _.extend(mockUI.read_mock_data(req), core.is_logged_in(req));
        res.render('home/home', response_data);
}
