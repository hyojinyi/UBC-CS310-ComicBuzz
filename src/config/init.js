var masterpass = require('./passport');
var mongoose = require('mongoose');
var User2 = mongoose.model('User');
const local = require('./passport/local');
module.exports = function (passport) {
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session
    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });
    passport.deserializeUser(function (id, done) {
        User2.findById(id, function (err, user) {
            //console.log('deserializing user:' , user);
            done(err, user);
        });
    });
    // use these strategies
    passport.use(local);
    // Setting up Passport Strategies for Login and SignUp/Registration
    masterpass(passport);
};
