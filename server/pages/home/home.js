'use strict';

module.exports = {
    page_routes: function (router) {
        router.get('/', home);
        router.get('/home', home);
    }
}

function home(req, res) {
        res.render('home/home');
}
