module.exports = {
    set_from_subdirs: set_from_subdirs,
    set_from_module: set_from_module,
    show_express_routes : show_express_routes
};

var file_walker = require('filewalker'),
    path = require('path'),
    fs = require('fs');

function show_express_routes(router, title) {
    var routes = router._router ? router._router.stack : router.stack ? router.stack : router;
    show(routes, 'express', title);
}

function set_from_subdirs(scanPath, page_router, api_router, ignore_folders){
    if(!ignore_folders) ignore_folders = {};
    var options = {
        recursive: false
    };
    var started = Date.now();
    file_walker(scanPath, options).on('dir', function (p, s) {
        //console.log(p);
        if(!ignore_folders[p]) {
            set_from_module(path.join(scanPath, p, p + '.js'), page_router, api_router);
        }
        //else console.log('ignoring page route:'+p);
    }).on('done', function () {
        var duration = Date.now() - started;
        console.log('Scanned routes from %d dirs, %d files in %d ms', this.dirs, this.files, duration);
    }).walk();
}

function set_from_module(modulepath, page_router, api_router){
    if (fs.existsSync(modulepath)) {
        try {
            var module = require(modulepath);
            if (page_router && module.page_routes) {
                module.page_routes(page_router);
                console.log("\tLoading page route module:" + modulepath);
            }
            if (api_router && module.api_routes) {
                module.api_routes(api_router);
                console.log("\tLoading api route module:" + modulepath);
            }
        } catch (e) {
            console.error("Route module failed to load:", modulepath);
            //Doesn't matter, go ahead with next directory
        }
    }
}

function show(routes, src, title) {

    var Table = require('cli-table');
    var table;

    if (src == 'restify') {
        console.log('\n********************************************');
        console.log('\t\t',title ? title: 'RESTIFY ROUTES');
        console.log('********************************************\n');
        table = new Table({head : ["", "Name", "Path"]});
        for (var key in routes) {
            if (routes.hasOwnProperty(key)) {
                var val = routes[key];
                var _o = {};
                _o[val.method] = [val.name, val.spec.path];
                table.push(_o);

            }
        }
    }
    else {
        console.log('\n********************************************');
        console.log('\t\t',title ? title: 'EXPRESS ROUTES');
        console.log('********************************************\n');
        table = new Table({head : ["", "Path"]});
        for (var key in routes) {
            if (routes.hasOwnProperty(key)) {
                var val = routes[key];
                if (val.route) {
                    val = val.route;
                    var _o = {};
                    _o[val.stack[0].method] = [val.path];
                    table.push(_o);
                }
            }
        }
    }
    console.log(table.toString());

    return table;
}