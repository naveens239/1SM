'use strict';
var _ = require('underscore'),
    path = require('path'),
    fs = require('fs');

module.exports = {
    databaseConfig     : databaseConfig,
    render_page        : render_page,
    set_globals        : set_globals,
    require_module     : require_module,
    require_model      : require_model,
    is_logged_in       : is_logged_in,
    get_country_code   : get_country_code,
    prefix_country_code: prefix_country_code,
    remove_country_code: remove_country_code,
    flat_data_to_model : flat_data_to_model,
    model_to_flat_data : model_to_flat_data,
    defaults           : defaults,
    bind_data          : bind_data,
    isEmail            : isEmail,
    isMobile           : isMobile,
    isValid            : isValid
};

function databaseConfig(dbconfig) {
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + dbconfig.dburl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback() {
        console.log('Mongoose connected to DB');
    });
    return mongoose;
}

function render_page(req, res, before_model_fetch, after_model_fetch) {
    console.log('in core.render_page:' + req.path);

    if (before_model_fetch) {
        var result = before_model_fetch(req, res);
        if (!result) return;
    }

    var page_name = req.path.replace(/^\//, ''),
        model = require_model(page_name, true),
        flat_data = {};

    if (model) {
        model.findOne(result.fetch_query, function (err, result_model) {
            if (err) {
                console.log('error fetching data:'+err);
                return;
            }
            console.log('result_model:'+result_model);
            if (result_model) {
                model_to_flat_data(result_model, flat_data);
            }

            if (after_model_fetch) {
                flat_data = after_model_fetch(result_model, flat_data, req, res);
            }
            console.log('flat_data ::' + JSON.stringify(flat_data));

            var response_data = _.extend(is_logged_in(req, true), bind_data(flat_data));
            res.render(page_name + '/' + page_name, response_data);
        });
    } else {
        res.render(page_name + '/' + page_name);
    }
}

function set_globals() {
    var root_path = path.join(__dirname, '..');
    global.__server_path = path.join(root_path, 'server');
    global.__client_path = path.join(root_path, 'client');
}

function require_module(module) {
    return require(path.join(__server_path, 'modules', module, module));
}

function require_model(model_name, check_if_exists) {
    var model_path = path.join(__server_path, 'models', model_name);
    if (check_if_exists) {
        if (fs.existsSync(model_path + '.js')) {
            return require(model_path);
        }
        return null;
    }
    else {
        return require(model_path);
    }
}

function is_logged_in(req, read_country_code) {
    var data = {is_logged_in: !!req.session.passport.user};
    if (read_country_code) {
        _.extend(data, {country_code: get_country_code()});
    }
    return data;
}

function get_country_code() {
    return '+91';
}

function prefix_country_code(mobile) {
    var country_code = get_country_code();
    return (mobile.indexOf(country_code) === -1) ? country_code + mobile : mobile;
}

function remove_country_code(mobile) {
    return mobile ? mobile.replace(get_country_code(), "") : mobile;
}

//TODO: move this to _ library using mixin ?
//same as _.defaults with the additional check of hasOwnProperty
function defaults(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
        var source = arguments[i];
        for (var prop in source) {
            if (hasOwnProperty.call(source, prop)) {//ppc: added to _.defaults logic
                if (obj[prop] === void 0) obj[prop] = source[prop];
            }
        }
    }
    return obj;
}

function model_to_flat_data(model, flat_data) {
    var keys = _.without(_.keys(model.schema.paths), '_id', '__v'),
        data_key, model_pointer;

    if (!flat_data) flat_data = {};

    _.each(keys, function (key) {
        model_pointer = traverse_upto_last(model, key);
        data_key = key.split(".").pop();//last element
        flat_data[data_key] = model_pointer[data_key];
    });

    return flat_data;
}

//copies flat data to anywhere in the model where the key matches
function flat_data_to_model(flat_data, model) {
    var keys = _.without(_.keys(model.schema.paths), '_id', '__v'),
        data_key, model_pointer;

    _.each(keys, function (key) {
        model_pointer = traverse_upto_last(model, key);
        data_key = key.split(".").pop();//last element

        if (flat_data[data_key]) {
            model_pointer[data_key] = flat_data[data_key];
        }
    });
}

function traverse_upto_last(model, model_key) {
    var new_obj = model,
        keyArray = model_key.split(".");

    while (keyArray.length > 1) {
        model_key = keyArray.shift();//first element
        new_obj = new_obj[model_key];
    }
    return new_obj;
}

function bind_data(json) {
    var bindScript = '<script src="/modules/common.js"></script>' +
        '<script>$(function () { modules.common.bind_data(' + JSON.stringify(json) + '); });</script>';
    return {bind_data: bindScript};
}

//TODO: need to modularize validator and move isEmail, isMobile and isValid to client's common.js so that both client and server can reuse the code
function isEmail(obj) {
    var commonModule = require(__client_path + '/modules/common.js');
    return isValid(obj, {email: commonModule.constraints.email});
}

function isMobile(obj) {
    var commonModule = require(__client_path + '/modules/common.js');
    return isValid(obj, {mobile: commonModule.constraints.mobile});
}

function isValid(obj, constraint) {
    var validator = require(__client_path + '/js/libs/validate.min.js');
    var errors = validator.validate(obj, constraint);
    return !errors;
}