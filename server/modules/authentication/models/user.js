var mongoose = require('mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    core     = require(__server_path + '/core');

var user_schema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    mobile: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

user_schema.pre('save', function(next) {
    console.log('in user_schema pre save');
    var user = this,
        SALT_FACTOR = 2;

    if (!user.isModified('password')) return next();

    //prefix country code if needed
    var usernameIsEmail = (user.username.indexOf('@') > 0),//TODO: find using reusable validator
        usernameIsMobile = (user.username.length == 10);//TODO: find using reusable validator

    if(usernameIsMobile){
        user.username = core.prefix_country_code(user.username);
    }

    //set email, mobile
    if(user.mobile){
        user.mobile = core.prefix_country_code(user.mobile);
    }
    if(!user.email && usernameIsEmail){
        user.email = user.username;
    }
    if(!user.mobile && usernameIsMobile){
        user.mobile = user.username;
    }

    //encrypt password
    bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, null, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Compare password
user_schema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', user_schema);
