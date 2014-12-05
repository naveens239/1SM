var fs = require('fs'),
    _ = require('underscore'),
    isProduction = false,
    isDevelopment = false,
    config = {};

module.exports = function (environment) {
    //fetch only if environment is passed. need to be done only once at the start.
    if (environment) {
        fetchConfig(environment);
    }

    return {
        getConfig     : function () {return config;},
        isProduction  : isProduction,
        isDevelopment : isDevelopment
    };
};


function fetchConfig(environment) {
    var config_path = './config',
        config_base = config_path + '.base';

    config = require(config_base);//start with base configuration

    //extend with env specific configuration
    var env_config_file = config_path + '.' + environment + '.js';
    if (fs.existsSync(env_config_file)) {
        _.extend(config, require(env_config_file));
    }

    isProduction = (environment === 'production');
    isDevelopment = (environment === 'development');
}