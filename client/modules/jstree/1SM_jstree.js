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
            "animation" : 0,
            "check_callback" : true,
            "themes" : { "stripes" : true },
            'data' : {
                'url' : 'api/categories'
            }
        },
        "plugins" : [ "checkbox", "state", "wholerow" ]
    });

}