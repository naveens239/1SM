'use strict';
$(function () {
    setEvents();
    //init();
});

function setEvents() {
    //Set html element event handlers
    $('#fbLink').click(facebookLogin);
    $('#googleLink').click(googleLogin);
    $('#btnLocalLoginMobile').click(function(){ return validate_login('#formLoginPhone', true)});
    $('#btnLocalLoginEmail').click(function(){ return validate_login('#formLoginEmail', false)});
    $('#btnLocalSignUpMobile').click(function(){ return validate_signup('#formSignupMobile', true)});
    $('#btnLocalSignUpEmail').click(function(){ return validate_signup('#formSignupEmail', false)});
    //$('#btnLogout').click(logout);
    //$('#btnForgotPassword').click(validate_forgot_password);
}

/*function init() {
    window.app = {
        authState: function (state, user) {
            console.log('in parent authState, [state:' + state + '][user:' + user + ']');
            switch (state) {
                case 'success':
                    //sessionService.authSuccess(user);
                    window.app.user = user;
                    window.location = '/vendor_profile';
                    break;
                case 'failure':
                    //sessionService.authFailed();
                    window.app.user = null;
                    break;
            }
        }
    };
}*/

function validate_login(formId, isMobile){
    var emailConstraint = { username: modules.common.constraints.email };
    var phoneConstraint = { username: modules.common.constraints.mobile};
    var username = $(formId + ' input[name=username]').val();

    if(isMobile){
        var uidNotPhone = validate({username: username}, phoneConstraint, {flatten: true});
        if (uidNotPhone) {
            alert('User name should be your 10 digit mobile number');
            return false;
        }
    }
    else {
        var uidNotEmail = validate({username: username}, emailConstraint, {flatten: true});
        if (uidNotEmail) {
            alert('User name should be your email id');
            return false;
        }
    }

    var pwdConstraint = { password: {presence:true}};
    var pwd = $(formId + ' input[name=password]').val();
    var pwdError = validate({password:pwd}, pwdConstraint);
    if(pwdError){
        alert('Please enter a password');
        return false;
    }
    return true;
}

function validate_signup(formId, isMobile){
    var password = $(formId + ' input[name=password]').val();
    var password2 = $(formId + ' input[name=password2]').val();
    if(password !== password2){
        alert('Both passwords should be the same');
        return false;
    }
    return validate_login(formId, isMobile);
}

function validate_forgot_password(){
    /*var username = $('#formForgotPassword input[name=username]').val();
    var emailConstraint = { username: modules.common.constraints.email };

    var uidNotEmail = validate({username: username}, emailConstraint, {flatten: true});
    if (uidNotEmail) {
        alert('Please enter your registered email id.');
        return false;
    }*/
    return true;
}

function facebookLogin() {
    /*var url = '/auth/facebook',
        width = 800,
        height = 350,
        top = (window.outerHeight - height) / 2,
        left = (window.outerWidth - width) / 2;
    window.open(url, 'facebook_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);*/
    window.location = '/auth/facebook';
}

function googleLogin() {
    /*var url = '/auth/google',
        width = 800,
        height = 350,
        top = (window.outerHeight - height) / 2,
        left = (window.outerWidth - width) / 2;
    window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars=0,top=' + top + ',left=' + left);*/
    window.location = '/auth/google';
}