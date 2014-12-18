'use strict';

var core = require(__server_path + '/core');

module.exports = {
    api_routes: function(router){
        router.get('/categories', categories);
    }
};

function categories(req, res){
    var categories_model = core.require_model('categories');

    categories_model.find({},{'__v':0 },function(err, categories){
        if(err) {
            res.send(false);
        } else {
            //Note: do any conversions here before sending the data back
            res.send(categories);
        }
    });
}