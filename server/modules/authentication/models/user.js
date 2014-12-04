var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    mobile: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
});

// Hash the password
userSchema.pre('save', function(next) {
    console.log('in pre save');
    var user = this,
        SALT_FACTOR = 2;

    if (!user.isModified('password')) return next();

    //prefix country code if needed
    var country_code = '+91',//TODO: calculate it based on ip if not already specified in db
        usernameIsEmail = (user.username.indexOf('@') > 0),//TODO: find using reusable validator
        usernameIsMobile = (user.username.length == 10);//TODO: find using reusable validator

    if(usernameIsMobile && user.username.indexOf(country_code)==-1){
        user.username = country_code + user.username;
    }

    //set email, mobile
    if(!user.email && usernameIsEmail){
        user.email = user.username;
    }
    if(!user.mobile && usernameIsMobile){
        user.mobile = user.username;
    }
    if(user.mobile && user.mobile.indexOf(country_code)==-1){
        user.mobile = country_code + user.mobile;
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
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('users', userSchema);
