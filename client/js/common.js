'use strict';
var commonModule = (function () {
    return {
        string_to_array: string_to_array,
        form_to_object : form_to_object,
        bind_data      : bind_data,
        constraints    : {
            email: { email: true },
            mobile: { format: { pattern: /^\d{10}$/ } }
        }
    };
    /**
     * Converts form data into json objects
     */
    function form_to_object(formSelector) {
        var formData = {};
        $(formSelector).serializeArray().map(function (x) {
            if (formData[x.name] === undefined) {
                //first occurrence of key and we don't know if value is supposed to be an array or not
                formData[x.name] = x.value;
            }
            else {
                //key occurred again, hence make previous value entry an array and push the new one in that array
                formData[x.name] = string_to_array(formData[x.name]);
                formData[x.name].push(x.value);
            }
        });
        return formData;
    }

    function string_to_array(val) {
        return (typeof val === 'string') ? val.split(null) : val ? val : [];
    }

    function set_select(name, values, container_selector) {
        if (!container_selector) container_selector = "";
        $.each(string_to_array(values), function (key, value) {
            $(container_selector + " select[name=" + name + "] option[value='" + value + "']").prop('selected', true);
        });
    }

    function set_radio(name, value, container_selector) {
        if (!container_selector) container_selector = "";
        $(container_selector + " input[name=" + name + "][value='" + value + "']").prop('checked', true);
    }

    function set_checkbox(name, values, container_selector) {
        if (!container_selector) container_selector = "";
        $.each(string_to_array(values), function (key, value) {
            $(container_selector + " input[name=" + name + "][value='" + value + "']").prop('checked', true);
        });
    }

    function bind_data_for_type(element, type, name, value, container_selector) {
        //alert('type:'+type+' - '+name+':'+value);
        switch (type) {
            case 'textarea':
                element.html(value);
                break;
            case 'radio':
                set_radio(name, value, container_selector);
                break;
            case 'checkbox':
                set_checkbox(name, value, container_selector);
                break;
            case 'select':
                set_select(name, value, container_selector);
                break;
            default ://includes type==text
                element.val(value);
                break;
        }
    }

    function bind_data(model, container_selector) {
        var element, type, tagName;
        //alert('in bind_data:'+JSON.stringify(model));
        if (!container_selector) container_selector = '';
        $.each(model, function (element_name, element_value) {
            element = $(container_selector + ' [name=' + element_name + ']');
            if (element) {
                tagName = element.prop('tagName');
                if (tagName) tagName = tagName.toLowerCase();

                if (tagName === 'textarea' || tagName === "select") {
                    type = tagName;
                }
                else {
                    type = element.attr('type');
                    if (type) type = type.toLowerCase();
                }

                bind_data_for_type(element, type, element_name, element_value, container_selector);
            }
        });
    }
})();

if ((typeof module) !== 'undefined') {
    module.exports = commonModule;
}