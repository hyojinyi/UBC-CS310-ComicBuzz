
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose');
var User1 = mongoose.model('User');
const local1 = require('./passport/local');

/**
 * Expose
 */

module.exports = function (passport) {

  // serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(function(id, done) {
    User1.findOne({ _id: id }, function (err, user) {
      done(err, user)
    })
  })

  // use these strategies
  passport.use(local1);
};