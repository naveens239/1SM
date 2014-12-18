'use strict';
var modules = modules || {};
modules.jstree = (function () {
    return {
        fetch_categories: fetch_categories
    };
})();

function fetch_categories(elementId) {

    $(elementId).jstree({
        "core" : {
            'data' : {
                'url' : 'api/categories'
            },
            'themes': {
                'name': 'proton',
                'responsive': true
            }
        },
        "plugins" : [ "checkbox", "state", "wholerow" ]
    });

}