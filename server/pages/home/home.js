'use strict';

module.exports = {
    page_routes: function (router) {
        router.get('/', function(req, res){res.redirect('/home')});
        //router.get('/home', home);//mock ui would take care of this for now until business logic is ready
    }
}

function home(req, res) {
        res.render('home/home');
}
