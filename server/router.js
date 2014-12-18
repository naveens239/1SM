/**
 * Define server routes
 */
'use strict';

var express = require('express'),
    page_router = express.Router(),
    api_router = express.Router(),
    path = require('path'),
    core = require('./core');

//---- Router middleware --------------------
//TODO: need to track all server calls made by the user and put it in db (may be when exception occurs)
page_router.use(function (req, res, next) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log('router.js: ', req.method, req.url, 'from', ip);
    next();
});

//---- Generic route definitions ----------------
api_router.post('/exception', post_exception);
/* Log exceptions in db */
function post_exception(req, res) {
    console.log('write to db:');
    console.log(req.param('utc_date') + ':' + req.param('timezone') + ':' + req.param('browser_name') + ":" + req.param('browser_version') + ":" + req.param('message'));//or req.body.message if bodyParser is used

    //TODO: write these params to exception table/document using req.db.xyz query so that it would use either mongodb or cassandra module
    //TODO: use a generic function passing these params as json so that the same can also be called in server side exceptions

    res.end();//so that callback of the post request in core.js gets called
}
var routes_module = core.require_module('routes');
routes_module.set_from_subdirs(path.join(__dirname, 'pages'), page_router, api_router);//load page specific routes
routes_module.set_from_subdirs(path.join(__dirname, 'modules'), page_router, api_router);//load module specific routes
//routes_module.set_from_module(path.join(__dirname, 'modules/authentication/authentication.js'), page_router, api_router);//load authentication routes

module.exports = {
    page_router: page_router,
    api_router: api_router
};