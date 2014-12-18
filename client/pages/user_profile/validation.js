/**
 * dependency on validate.min.js of http://validatejs.org/
 */
var validateModule = (function () {

    var constraints = {
        "#vendor_form"  : {
            vendor_name: { presence: true }/*,
            mobile     : { presence: { message: "^Please enter your mobile number" } }
            password: {
             presence: true,
             length: {
             minimum: 6,
             message: "must be at least 6 characters"
             }
             }*/
        },
        "#services_form": {
            //either select_services or other_services logic implemented in doValidate
            select_services: { presence: { message: "^Please select/enter provided services" }},
            other_services: { presence: true }
        }
    };

    function doValidate(formSelector, formData) {
        if (!formData) {
            formData = modules.common.form_to_object(formSelector);
        }

        var errors = validate(formData, constraints[formSelector]);//TODO: calls global validate method. need to make module

        if(formSelector === "#services_form" && errors){
            if(errors.select_services && errors.other_services){//if both fields have errors
                delete errors.other_services;//show only one error
            }
            else{
                //since either select_services or other_services is valid, remove the invalid error msg
                errors = undefined;
            }
        }

        return getErrorsArray(errors);
    }

    function getErrorsArray(errors){
        if(!errors) return errors;

        var errorsArray = [];
        $.each(errors, function(key, value){
            errorsArray.push(value);
        });

        return errorsArray;
    }
    /**
     * Shows validation errors. returns false if there are errors. returns the formData if there are no errors.
     */
    function showValidateErrors(formSelector, formData){
        if(!formData) formData = modules.common.form_to_object(formSelector);
        var errors = doValidate(formSelector, formData);
        if (errors) {
            alert(errors.join('\n'));
            return false;
        }
        return formData;
    }

    return {
        doValidate: doValidate,
        showValidateErrors: showValidateErrors
    };

})();