'use strict';
var _ = require('underscore');

module.exports = {
    flatdata_to_model:flatdata_to_model,
    defaults        : defaults,
    bind_data       : bind_data,
    isEmail         : isEmail,
    isMobile        : isMobile,
    isValid         : isValid
};

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

//copies flat data to anywhere in the model where the key matches
function flatdata_to_model(flatdata, model){
    var keys = _.without(_.keys(model.schema.paths), '_id', '__v'),
        data_key, model_pointer;

    _.each(keys, function(key){
        model_pointer = traverse_upto_last(model, key);
        data_key = key.split(".").pop();//last element

        if(flatdata[data_key]){
            model_pointer[data_key] = flatdata[data_key];
        }
    });
}

function traverse_upto_last(model, model_key){
    var new_obj = model,
        keyArray = model_key.split(".");

    while(keyArray.length>1){
        model_key = keyArray.shift();//first element
        new_obj = new_obj[model_key];
    }
    return new_obj;
}

function bind_data(json) {
    var bindScript = '<script src="js/common.js"></script>' +
        '<script>$(function () { commonModule.bind_data(' + JSON.stringify(json) + '); });</script>';
    return {bind_data : bindScript};
}

//TODO: need to modularize validator and move isEmail, isMobile and isValid to client's common.js so that both client and server can reuse the code
function isEmail(obj) {
    var commonModule = require(__client_path + '/js/common.js');
    return isValid(obj, {email : commonModule.constraints.email});
}

function isMobile(obj) {
    var commonModule = require(__client_path + '/js/common.js');
    return isValid(obj, {mobile : commonModule.constraints.mobile});
}

function isValid(obj, constraint) {
    var validator = require(__client_path + '/js/libs/validate.min.js');
    var errors = validator.validate(obj, constraint);
    return !errors;
}