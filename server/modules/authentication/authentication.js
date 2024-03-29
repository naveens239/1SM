var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,//TODO: google oauth2 is being retired, so google plus login should be implemented.
    FacebookStrategy = require('passport-facebook').Strategy,
    LocalStrategy = require('passport-local').Strategy,
    passport = require('passport'),
    core = require(__server_path + '/core'),
    config = core.require_module('config').getConfig(),
    UserModel = core.require_model('user');

module.exports = {
    init_session: init_session,
    page_routes  : function (router) {
        //google
        router.get('/auth/google', passport.authenticate('google', {scope : ['https://www.googleapis.com/auth/userinfo.email']}));
        router.get('/auth/google/callback', passport.authenticate('google', success_failure_json()));
        //facebook
        router.get('/auth/facebook', passport.authenticate('facebook'));
        router.get('/auth/facebook/callback', passport.authenticate('facebook', success_failure_json()));
        //login
        router.post('/login/mobile', passport.authenticate('local_login_mobile', success_failure_json(true)));
        router.post('/login/email', passport.authenticate('local_login_email', success_failure_json(true)));
        //signup
        router.post('/signup/mobile', passport.authenticate('local_signup_mobile', success_failure_json(true)));
        router.post('/signup/email', passport.authenticate('local_signup_email', success_failure_json(true)));
        //login/signup success/failure
        router.get('/login/success', function (req, res, next) {
            console.log('in login/success, user:' + JSON.stringify(req.session.passport.user));
            res.redirect("/user_profile");
        });
        router.get('/login/failure', function (req, res, next) {
            res.redirect("/");
        });
        //logout
        router.get('/logout', function (req, res) {
            console.log('in logout');
            req.logout();
            res.redirect('/');
        });
    }
};

function success_failure_json(flash){
    var data = {
        successRedirect : '/login/success',
        failureRedirect : '/login/failure'
    };
    if(flash){
        data['failureFlash'] = true;
    }
    return data;
}

passport.use(new FacebookStrategy({
    clientID     : config.oauth.facebook.clientID,
    clientSecret : config.oauth.facebook.clientSecret,
    callbackURL  : config.oauth.facebook.callbackURL
}, callback_facebook));

passport.use(new GoogleStrategy({
    clientID     : config.oauth.google.clientID,
    clientSecret : config.oauth.google.clientSecret,
    callbackURL  : config.oauth.google.callbackURL
}, callback_google));

function callback_facebook(accessToken, refreshToken, profile, done){
    return callback_social("facebook", accessToken, refreshToken, profile, done);
}

function callback_google(accessToken, refreshToken, profile, done){
    return callback_social("google", accessToken, refreshToken, profile, done);
}

function callback_social(which_social, accessToken, refreshToken, profile, done) {
    console.log('-------------------------------------------------------------------');
    console.log(which_social + ' login');
    console.log('[accessToken:', accessToken, ']\n[refreshToken:', refreshToken, ']');
    console.log('-------------------------------------------------------------------');
    UserModel.findOne({username : profile.id}, function (err, user) {
        if (err) {
            console.log(err);
            return done(err, user);
        }
        if (user) {
            return done(null, user);
        }

        var user = new UserModel({
            username : profile.id,
            social : which_social
        });

        user.save(function (err, insertedUser) {
            if (err) {
                console.log(err);
                return done(err, insertedUser);
            }
            console.log('inserted user:' + insertedUser);
            return done(err, insertedUser);
        });
    });
}

passport.use('local_login_email', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, callbackLocalLogin));

passport.use('local_login_mobile', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, callbackLocalLoginMobile));

passport.use('local_signup_email', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, callbackLocalSignUp));

passport.use('local_signup_mobile', new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, callbackLocalSignUpMobile));

function callbackLocalLoginMobile(username, password, done) {
    return callbackLocalLogin(core.prefix_country_code(username), password, done);
}

function callbackLocalLogin(username, password, done) {

    UserModel.findOne({username : username}, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, {message : 'Incorrect username.'});
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {message : 'Incorrect password.'});
            }
        });
    });
}

function callbackLocalSignUpMobile(username, password, done) {
    return callbackLocalSignUp(core.prefix_country_code(username), password, done);
}

function callbackLocalSignUp(username, password, done) {
    UserModel.findOne({username : username}, function (err, user) {
        if (err) {
            console.log(err);
            return done(err, user);
        }
        if (user) {
            return done(null, false, {message : 'User already signed up.'});
        }

        var user = new UserModel({
            username : username,
            password : password
        });

        user.save(function (err, insertedUser) {
            if (err) {
                console.log(err);
                return done(err, insertedUser);
            }
            console.log('inserted user:' + insertedUser);
            return done(err, insertedUser);
        });
    });
}

//serialize and deserialize
passport.serializeUser(function (user, done) {
    console.log('serializeUser: ' + user);
    user.password = "";
    done(null, user);
    //done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log('deserializeUser: ' + id);
    done(null, id);
    //TODO: instead of saving all vendor data in session, need to fetch the key and get remaining using deserializeUser
    /*UserModel.findById(id, function(err, user) {
     done(err, user);
     });*/
});

function init_session(app){
    var session = require('express-session'),
        flash = require('express-flash');

    //var MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret            : 'vandrum secret',
        saveUninitialized : true, //to avoid deprecated msg
        resave            : true //to avoid deprecated msg
        /*,store: new MongoStore({
         db: config.dbip + ":27017"
         })*/
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
}