'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var wrap = require('co-express');
const Article = mongoose.model('Article');

/**
 * List items tagged with a tag and send to tagsearch page 
 */

exports.index = wrap(function* (req, res) {
            var query = req.params.tag;
            console.log('This tag is   :'+query);
            Article.find({ 'tags': query }, function (err, tagged_articles) {
            if (err) {
                console.log('error in find one!!!!!!!!!!!!!!!!!!!!!!!');
            }
    console.log(tagged_articles);
    res.render('tagsearch', {
    title: 'Articles tagged ' + req.params.tag,
    articles: tagged_articles,
    // page: page + 1,
    // pages: Math.ceil(count / limit)
  });
        });
});
