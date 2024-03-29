/**
 * The js starting point of the app, referenced from package.json
 */
'use strict';

var express = require('express'),
    path = require('path'),
    core = require('./core'),
    hbs = require('hbs'),
    _ = require('underscore');

core.set_globals();
var app = express();

//load env specific config file
var config_module = core.require_module('config');
config_module.init(app.get('env'));//initialized only once
var config = config_module.getConfig();
console.log('environment:' + config.environment);

//setup fb,google,local authentication with session
var auth_module = core.require_module('authentication');
auth_module.init_session(app);

viewConfig();
core.databaseConfig(config.dbconfig);
internationalizationConfig();
routeConfig();
errorConfig();
//loggerConfig();

//load all partials
var partials_module = core.require_module('partials');
partials_module.registerAll(path.join(__client_path, 'partials'));

startServer();

//-----------------------

function viewConfig() {
    var bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser');

    app.set('views', path.join(__client_path, 'pages'));
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    //var favicon = require('serve-favicon');
    //app.use(favicon());//TODO: shouldn't we give path like app.use(favicon(__client_path + '/favicon.ico')); ?

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(express.static(__client_path));//Anything under client will not go through routing
}

function internationalizationConfig() {
    var i18n = require('i18n-2');
    i18n.expressBind(app, {
        locales  : ['en', 'ml'],
        directory: 'server/locales',
        extension: '.json'
    });
}

function routeConfig() {
    var router = require('./router');
    app.use('/', router.page_router);
    app.use('/api', router.api_router);

    //activate mock ui so that mock pages with json data and business logic pages would co exist.
    setTimeout(function () {
        var mock_ui_module = core.require_module('mock_ui');
        mock_ui_module.activate(router.page_router);
    }, 100);//delay so that all existing routes would be set before mock routes would be added

    //list all routes in dev
    if (config.isDevelopment) {
        setTimeout(function () {
            var routes_module = core.require_module('routes');
            routes_module.show_express_routes(router.page_router.stack, "PAGE ROUTES");
            routes_module.show_express_routes(router.api_router.stack, "API ROUTES");
        }, 500);
    }
}

function errorConfig() {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {//TODO: how is this working?
        var err = new Error('Path Not Found: ' + req.url);
        err.status = 404;

        //TODO: save the error url in db.

        next(err);
    });
    // error handlers
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);

        res.render('error', {
            message: err.message,
            error  : config.isDevelopment ? err : {} //show stacktrace only in development
        });
    });
}

//function loggerConfig() {
    //var logger = require('morgan');//TODO: how to use morgan correctly? is it needed?
    //app.use(logger('dev'));
//}

function startServer() {
    var server = app.listen(config.port, function () {
        console.log('Express server listening on port ' + server.address().port);
    });
    return server;
}
