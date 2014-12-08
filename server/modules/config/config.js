var config = {
};

module.exports = {
    getConfig: getConfig,
    init: init
};

function getConfig(){
    return config;
}

function init(environment) {
    var fs = require('fs'),
        _ = require('underscore'),
        config_path = './config',
        config_base = config_path + '.base';

    config = require(config_base);//start with base configuration

    if (environment) {
        //extend with env specific configuration
        var env_config_file = config_path + '.' + environment + '.js';
        if (fs.existsSync(env_config_file)) {
            _.extend(config, require(env_config_file));
        }

        //Additional params
        config.isProduction = (environment === 'production');
        config.isDevelopment = (environment === 'development');
        config.environment = environment;
    }
    return config;
}