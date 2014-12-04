'use strict';
var fs           = require('fs');

module.exports = {
    getDirectoriesSync: getDirectoriesSync,
    getFilesSync      : getFilesSync,
    bind_data         : bind_data,
    isEmail           : isEmail,
    isMobile          : isMobile,
    isValid           : isValid
};

function getDirectoriesSync(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getFilesSync(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isFile();
    });
}

function bind_data(json) {
    var bindScript = '<script src="js/common.js"></script>' +
        '<script>$(function () { commonModule.bind_data(' + JSON.stringify(json) + '); });</script>';
    return {bind_data: bindScript};
}

//TODO: need to modularize validator and move isEmail, isMobile and isValid to client's common.js so that both client and server can reuse the code
function isEmail(obj) {
    var commonModule = require(__client_path + '/js/common.js');
    return isValid(obj, {email: commonModule.constraints.email});
}

function isMobile(obj) {
    var commonModule = require(__client_path + '/js/common.js');
    return isValid(obj, {mobile: commonModule.constraints.mobile});
}

function isValid(obj, constraint) {
    var validator    = require(__client_path + '/js/libs/validate.min.js');
    var errors = validator.validate(obj, constraint);
    return !errors;
}