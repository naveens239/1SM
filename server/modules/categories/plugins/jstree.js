'use strict';

var core = require(__server_path + '/core');

module.exports = {
    transform:transform
};

function transform(results) {
    console.log("inside plugin jstree's transform");
}