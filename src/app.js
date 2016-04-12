/**
 * Module dependencies
 */
var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs");
var join = require('path').join;
var config = require('./config/config');
var models = join(__dirname, '/models');
var port = process.env.PORT || 3000;
//var cloudinary = require('cloudinary');
var compression = require('compression');
var cookieSession = require('cookie-session');
var methodOverride = require('method-override');
var csrf = require('csurf');
var multer = require('multer');
var swig = require('swig');
var mongoStore = require('connect-mongo')(session);
var winston = require('winston');
var helpers = require('view-helpers');
var pkg = require('../package.json');
var env = process.env.NODE_ENV || 'development';
/**
 * Expose
 */
var mConnect = mongoose.connect('**** INSERT mLab KEY HERE **** '); // connect to our database
console.log('=======================================');
console.log('=============== mConnect =============');
console.log('===============' + mConnect + '================');
console.log('=======================================');
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// set views path, template engine and default layout
/* app.engine('html', require('ejs').__express);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');*/
/*
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'jade');*/
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
// Mongoose Schema Models
fs.readdirSync(models)
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => require(join(models, file)));
// Swig templating engine settings
if (env === 'development' || env === 'test') {
    swig.setDefaults({
        cache: false
    });
}
// expose package.json to views
app.use(function (req, res, next) {
    res.locals.pkg = pkg;
    res.locals.env = env;
    next();
});
app.use(methodOverride(function (req) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
// CookieParser should be above session
app.use(cookieParser());
app.use(cookieSession({ secret: 'secret' }));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: pkg.name,
    store: new mongoStore({
        url: '**** INSERT mLab KEY HERE ****',
        collection: 'sessions'
    })
}));
// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(helpers(pkg.name));
// Initialize Passport
var initPassport = require('./config/init');
initPassport(passport);
// routes ======================================================================
var routes = require('./config/routes')(passport);
app.use('/', routes);
/*// Our Routes
require('../src/config/passport')(passport);
require('../src/config/express')(app, passport);
require('../src/config/routes')(app, passport);*/
// cloudinary ===================================================================
// cloudinary.config({
//     cloud_name: 'cs310project',
//     api_key: '174523219495379',
//     api_secret: 'Hkyna0fcP82cWAK910aDqpQ4ELg'
});
module.exports = app;
