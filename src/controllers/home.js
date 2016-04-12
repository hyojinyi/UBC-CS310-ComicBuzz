var util = require('util');
/*!
 * Module dependencies.
 */
exports.index = function (req, res) {
    res.render('index');
};
exports.contact = function (req, res) {
    res.render('contact-us');
};
exports.about = function (req, res) {
    res.render('about-us');
};
exports.license = function (req, res) {
    res.render('license');
};
exports.terms = function (req, res) {
    res.render('termsofuse');
};
exports.privacy = function (req, res) {
    res.render('privacypolicy');
};
// exports.usercomics = function(req,res) {
//     res.render('usercomics')
// };
exports.comiceditor = function (req, res) {
    res.render('comic_editor');
};
exports.upload = function (req, res) {
    res.render('upload');
};
// exports.testpage = function(req, res) {
//     console.log("testpage in home.ts!!!!!!!!")
//     res.render('testpage')
// };
// exports.testpagePublish = function(req,res) {
//     res.render('testpagePublish')
// };
exports.editor = function (req, res) {
    res.render('editor');
};
exports.settings = function (req, res) {
    res.render('settings');
};
exports.messages = function (req, res) {
    res.render('messages');
};
