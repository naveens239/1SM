'use strict';
var file_walker = require('filewalker'),
    express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    fs = require('fs'),
    client_path = path.join(__dirname, '..', 'client'),
    _ = require('underscore');

//view config
var app = express();
app.set('views', path.join(client_path, 'pages'));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.static(client_path));
rp(path.join(client_path, 'partials'));

//route config
var pages = ['home'];
//register root route
app.get('/', function(req, res){
    res.redirect('/home');
});

var _config = rj('./server/config_ui_flow.json');
//register dynamic routes, ignore those pages from page routes
var ignore_pages={};
rdr(_config.dynamic_routes, ignore_pages, app);

//register all page routes except those in ignore_pages
rpr(path.join(client_path, 'pages'), ignore_pages, app);

//start server
var server = app.listen(3001, function () {
    console.log('Server listening on port ' + server.address().port);
});

/*if(app.get('env') === 'development') {
    setTimeout(function () {
        var routes_module = require('./modules/routes');
        routes_module.show_express_routes(app);
    }, 100);
}*/
//---------------------------------------------------------------------
//register dynamic routes
function rdr(dynamic_routes, ignore_pages, app){
    if(dynamic_routes){
        _.each(dynamic_routes, function(route, page){
            //console.log(route);
            app.get(route, d_rcb);
            ignore_pages[page] = true;
        });
    }
}

//register page routes
function rpr(scanPath, ignore_pages, app){
    var options = {
        recursive: false
    };
    var started = Date.now();
    file_walker(scanPath).on('dir', function (p, s) {
        if(!ignore_pages[p]) {
            app.get('/' + p, rcb);
        }
        //else console.log('ignoring page route:'+p);
    }).on('done', function () {
        //var duration = Date.now() - started;
        //console.log('Registered routes from %d dirs, %d files in %d ms', this.dirs, this.files, duration);
    }).walk();
}

//routes based on command line args
/*
 for (var i = 2; i < process.argv.length; i++) {
 pages.push(process.argv[i].replace('.html', ''));
 }
 for(var i=0; i<pages.length; i++){
 app.get('/' + pages[i], rcb);
 }*/
//render call back
function rcb(req, res) {
    var page_name = req.path.replace(/^\//, ''),
        data = rj('./test/test_data/'+page_name+'.json');
    res.render(page_name + '/' + page_name, data);
}

//dynamic render call back
function d_rcb(req, res){
    //console.log(req.path);
    var page_name = req.path.replace(/^\//, ''),
        data = {};

    //if page is dynamic
    if(page_name.indexOf('/')!== -1){
        page_name = page_name.split('/')[0];
        var dynamic_routes = _config.dynamic_routes,
            route = dynamic_routes[page_name];

        _.each(req.params, function(value, key){
            //if param matched config's route definition
            if(route.indexOf(':'+key) !== -1){
                data = rj('./test/test_data/'+page_name+'.json', value);
            }
        });

    }

    //console.log(JSON.stringify(data));
    res.render(page_name + '/' + page_name, data);
}

//register partials
function rp(scanPath) {
    var started = Date.now();
    file_walker(scanPath).on('file', function (p, s) {
        rpf(scanPath, p);
    }).on('done', function () {
        //var duration = Date.now() - started;
        //console.log('Registered partials from %d dirs, %d files in %d ms', this.dirs, this.files, duration);
    }).walk();
}

//register partial file
function rpf(scanPath, file) {
    var template, tagStart = "", tagEnd = "", ext = path.extname(file);

    if (ext === '.js') {
        tagStart = '<script>';
        tagEnd = '</script>';
    } else if (ext === '.css') {
        tagStart = '<style>';
        tagEnd = '</style>';
    }
    template = tagStart + fs.readFileSync(path.join(scanPath, file), 'utf8') + tagEnd;
    hbs.registerPartial(file, template);
}

//read json static page data if available
function rj(json_file, key) {
    var json;
    try {
        if (fs.existsSync(json_file)) {
            json = JSON.parse(fs.readFileSync(json_file));
            if(key){
                json = json[key];
            }
        }
    }catch (e){
        //nothing
    }
    return json ? json:{};
}
