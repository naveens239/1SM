module.exports = {
    activate    : activate
};

var file_walker = require('filewalker'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    routes_module = require(path.join(__server_path, 'modules/routes')),
    mock_ui_config={},
    MOCK_DATA_PATH = path.join(__dirname, 'mock_data');

function activate(router){
    mock_ui_config = read_json_file(path.join(__server_path, 'modules/mock_ui/mock_ui_config.json'));
    console.log('mock ui config:'+JSON.stringify(mock_ui_config));

    //ignore already registered routes
    var existing_routes = routes_module.fetch_express_routes(router);

    //ignore 'GET' routes so that mock routes wont overwrite them
    var ignore_pages={}, json_val;
    console.log('existing gets::')
    _.each(existing_routes, function(json){
        json_val = json['get'];
        if(json_val){
            console.log(json_val);
            ignore_pages[json_val.replace('/','')] = true;
        }
    });

    //register dynamic routes, ignore them while adding mock routes
    register_dynamic_routes(mock_ui_config.dynamic_routes, ignore_pages, router);

    //register all page routes except those in ignore_pages
    register_page_routes(path.join(__client_path, 'pages'), ignore_pages, router);

}

function register_dynamic_routes(dynamic_routes, ignore_pages, router){
    if(dynamic_routes){
        _.each(dynamic_routes, function(route, page){
            //console.log(route);
            router.get(route, dynamic_render_callback);
            ignore_pages[page] = true;
        });
    }
}

function register_page_routes(scanPath, ignore_pages, router){
    var options = {
        recursive: false
    };
    var started = Date.now();
    file_walker(scanPath).on('dir', function (p, s) {
        if(!ignore_pages[p]) {
            router.get('/' + p, render_callback);
        }
        //else console.log('ignoring page route:'+p);
    }).on('done', function () {
        //var duration = Date.now() - started;
        //console.log('Registered routes from %d dirs, %d files in %d ms', this.dirs, this.files, duration);
    }).walk();
}

function render_callback(req, res) {
    var page_name = req.path.replace(/^\//, ''),
        data = read_json_file(path.join(MOCK_DATA_PATH, page_name+'.json'));
    res.render(page_name + '/' + page_name, data);
}

//dynamic render call back
function dynamic_render_callback(req, res){
    //console.log(req.path);
    var page_name = req.path.replace(/^\//, ''),
        data = {};

    //if page is dynamic
    if(page_name.indexOf('/')!== -1){
        page_name = page_name.split('/')[0];
        var dynamic_routes = mock_ui_config.dynamic_routes,
            route = dynamic_routes[page_name];

        _.each(req.params, function(value, key){
            //if param matched config's route definition
            if(route.indexOf(':'+key) !== -1){
                data = read_json_file(path.join(MOCK_DATA_PATH, page_name+'.json'), value);
            }
        });

    }

    //console.log(JSON.stringify(data));
    res.render(page_name + '/' + page_name, data);
}

function read_json_file(json_file, key) {
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