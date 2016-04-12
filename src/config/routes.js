/*!
 * Module dependencies.
 */
// Note: We can require users, articles and other cotrollers because we have
// set the NODE_PATH to be ./router/controllers (package.json # scripts # start)
var express = require('express');
var util = require('util');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.png'); //Appending .jpg
    }
});
var upload = multer({ storage: storage });
var router = express.Router();
var users = require('../controllers/users');
var home = require('../controllers/home');
var articles = require('../controllers/articles');
var tags = require('../controllers/tags');
var auth = require('./middlewares/authorization');
var article = require('../models/article');
/**
 * Route middlewares
 */
var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];
/**
 * Expose routes
 */
module.exports = function (passport) {
    // home route
    router.get('/', home.index);
    router.get('/index', home.index);
    router.get('/about', home.about);
    router.get('/license', home.license);
    router.get('/termsofuse', home.terms);
    router.get('/privacypolicy', home.privacy);
    router.get('/contact', home.contact);
    //router.get('/profile', articles.profile);
    router.get('/topcomics', articles.topcomics);
    router.get('/about-us', home.about);
    router.get('/settings', home.settings);
    router.get('/messages', home.messages);
    //router.get('/profile', home.profile);
    router.get('/editor', home.editor);
    router.get('/upload', articles.new);
    router.post('/upload', upload.any(), articles.create);
    // user routes
    router.get('/login', users.login);
    router.get('/signup', users.signup);
    router.get('/logout', users.logout);
    router.post('/users', users.create);
    router.post('/users/session', passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }), users.session);
    router.param('userId', users.load);
    router.get('/users/:userId', users.showProfile);
    // Comic Routes
    router.param('id', articles.load);
    router.get('/comics/:id', articles.show);
    router.post('/comics/:id/publish', articles.publish);
    router.get('/comics/:id', articles.publish);
    router.post('/comics/:id/publish', articles.publish);
    router.get('/comics/:id', articles.publish);
    router.delete('/comics/:id/delete', articles.destroy);
    // Starred 
    router.post('/comics/:id/likeit', articles.getstarred);
    // usercomic routes 
    router.get('/usercomics', articles.showmycomics);
    // tag routes
    router.get('/tags/:tag', tags.index);
    // search by keywords 
    router.post('/comics/search', articles.search);
    // userlist 
    router.get('/userlist', users.getusers);
    // editor page routes
    router.get('/testpage/:id', articles.show2, upload.any());
    router.post('/testpage/:id/edit', articles.cellReorder);
    router.post('/testpage/:id/edit2', articles.addContributor);
    router.post('/testpage/:id/edit3', upload.any(), articles.addCell);
    // error handling
    router.use(function (err, req, res, next) {
        // treat as 404
        if (err.message
            && (~err.message.indexOf('not found')
                || (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        if (err.stack.includes('ValidationError')) {
            res.status(422).render('422', { error: err.stack });
            return;
        }
        // error page
        res.status(500).render('500', { error: err.stack });
    });
    // assume 404 since no middleware responded
    router.use(function (req, res) {
        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Not found'
        });
    });
    return router;
};
