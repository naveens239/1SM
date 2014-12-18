'use strict';

var core = require(__server_path + '/core'),
    jstree = core.require_plugin('jstree');

module.exports = {
    api_routes: function(router){
        router.get('/categories', categories);
    }
};

function categories(req, res) {
    var categories_model = core.require_model('categories'),
        query = {};
    if(req.query.key){
        console.log('search key::'+req.query.key);
        //query = {path:{}} //TODO: build the query using req.query.key
    }

    categories_model.find(query, {'__v':0 }, function(err, results){
        if(err) {
            res.send(false);
        } else {
            //Note: do any conversions here using appropriate plugins before sending the data back
            jstree.transform(results);

            res.send(results);
        }
    });
}