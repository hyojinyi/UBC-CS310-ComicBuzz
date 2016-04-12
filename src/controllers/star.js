'use strict';
var mongoose = require('mongoose');
var wrap = require('co-express');
var Article1 = mongoose.model('Article');
var User1 = mongoose.model('User');
