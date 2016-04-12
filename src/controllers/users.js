'use strict';
/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var wrap = require('co-express');
var User1 = mongoose.model('User');
var Articles = mongoose.model('Article');
/**
 * Load
 */
exports.load = wrap(function* (req, res, next, _id) {
    console.log(_id);
    const criteria = { _id: _id };
    req.profile = yield User1.load({ criteria: criteria });
    if (!req.profile)
        return next(new Error('User not found'));
    next();
});
/**
 * Create user
 */
exports.create = wrap(function* (req, res) {
    const user = new User1(req.body);
    user.provider = 'local';
    yield user.save();
    req.logIn(user, err => {
        if (err)
            req.flash('info', 'Sorry! We are not able to log you in!');
        return res.redirect('/');
    });
});
/**
 *  Show profile
 */
exports.showProfile = function (req, res) {
    if (typeof req.user == 'undefined') {
        var msg = 'Please log in to view comic';
        return res.redirect('/signup');
    }
    const user = req.profile;
    Articles.find({ 'user': user._id }, function (err, myarticles) {
        if (err) {
            console.log('error in find one!!!!!!!!!!!!!!!!!!!!!!!');
        }
        User1.findOne({ '_id': user._id }, function (err, oneUser) {
            console.log('oneUser is:' + oneUser);
            res.render('profile', {
                title: oneUser.name,
                user: oneUser,
                myarticles: myarticles
            });
        });
    });
};
//TODO
exports.signin = function () { };
/**
 * Auth callback
 */
exports.authCallback = login;
/**
 * Show login form
 */
exports.login = function (req, res) {
    res.render('login', { title: 'Login' });
};
/**
 * Show sign up form
 */
exports.signup = function (req, res) {
    res.render('signup');
};
/**
 * Logout
 */
exports.logout = function (req, res) {
    req.logout();
    res.redirect('/login');
};
/**
 * Session
 */
exports.session = login;
/**
 * Login
 */
function login(req, res) {
    const redirectTo = req.session.returnTo
        ? req.session.returnTo
        : '/';
    delete req.session.returnTo;
    res.redirect(redirectTo);
}
exports.getusers = wrap(function* (req, res) {
    // console.log("************************** getusers (users.ts) ************************** ");
    if (typeof req.user == 'undefined') {
        return res.redirect('/signup');
    }
    var query = User1.find({}, function (err, users) {
        if (err) {
            console.log('error at users.ts line:109 ');
        }
        console.log(users);
        res.render('userlist', { users: users });
    });
});
/* helper page for header creation */
exports.header = function (req, res) {
    res.render('header');
};
