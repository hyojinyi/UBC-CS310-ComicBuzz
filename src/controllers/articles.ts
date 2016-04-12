'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var assign = require('object-assign');
var wrap = require('co-express');
var only = require('only');
var Article1 = mongoose.model('Article');
var User1 = mongoose.model('User');
var ImgM = mongoose.model('ImgModel');


/**
 * Load
 * When called this will get the article you want with the associated article object ID passed through
 * If there is no article associated with such ID, an Error will be thrown
 */

exports.load = wrap(function* (req, res, next, id) 
{
    console.log(id);
    
    // Populate req.article by querying it with the id of that article passed through
    req.article = yield Article1.load(id);
    
    // Check if the article does not exist
    if (!req.article) 
    {
        // Return an error back saying "Article not found"
        return next(new Error('Article not found'));
    }
    
    // Call next, article is valid and there, move on ahead
    next();
});

/**
 * List
 */

exports.index = wrap(function* (req, res) 
{
    // Make a variable called page
    // This will set how big of a page we want
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    
    // Set a variable limit for how many articles to query for a page
    var limit = 30;
    
    // Set a variable options that has the limit and the page
    var options = 
    {
        // Set limit to the limit described above
        limit: limit,
        // Set the page variable of options to the one described above
        page: page
    };
    
    // Get the article based on the options we laid out
    var articles = yield Article1.list(options);
    
    // Get a hard count of how many articles we got
    var count = yield Article1.count();
    
    // Render the page with all these articles
    res.render('layouts/default', 
    {
        // Set the render variable to 'Articles'
        title: 'Articles',
        // Set the render articles to articles
        articles: articles,
        // Set the render page to page plus 1 in case they have a big screen
        page: page + 1,
        // Set the pages as well to a celing of count/limit
        pages: Math.ceil(count / limit)
    });
});

exports.topcomics = wrap(function* (req, res) 
{
  var options = {
      criteria :{published: '2'},
      limit: 12,
      page: 0
  };
  var articles = yield Article1.list(options);
  //console.log(articles);
  res.render('topcomics', {
      comics: articles
  });
    
});

/**
 * New article
 */

exports.new = function (req, res){
  res.render('upload', {
    title: 'New Article',
    article: new Article1({})
  });
};

/**
 * Create an article
 * Upload an image
 */

exports.create = wrap(function* (req, res) 
{
    var article = new Article1(only(req.body, 'title body tags'));
    var images = req.files;
    
    
    article.title = req.body.title;
    article.body = req.body.body;
    article.tags.push = req.tags;
    article.user = req.user;
    //change URL before store it in mongoose db.
    for (var i =0; i < images.length;i++ ){
            var URL_ = images[i].path;
            var splitted = URL_.split('/');
            console.log('splitted is:'+splitted);
            var _URL = '/'+splitted[2]+'/'+splitted[3];
            console.log('_URL new is: '+_URL);
            images[i].path = _URL;
        }
        console.log("new images are :"+images);
    
    yield article.uploadAndSave(images);
    
    
});


exports.addCell = wrap(function* (req, res) 
{
    var returnArt = req.article;
    var article = new Article1(only(req.body, 'title body'));
    var images = req.files;
    console.log("**************** images :     %s **************** ", images)
    article.title = "fakeTitle";
    article.body = "fakeBody";
    var _cells = req.article.cells;
    
    //change URL before store it in mongoose db.
    for (var i =0; i < images.length;i++ ){
            var URL_ = images[i].path;
            var splitted = URL_.split('/');
            console.log('splitted is:'+splitted);
            var _URL = '/'+splitted[2]+'/'+splitted[3];
            console.log('_URL new is: '+_URL);
            images[i].path = _URL;
        }
        console.log("new images are :"+images);
        
    yield article.uploadAndSave(images);
    console.log("**************** article :     %s **************** ", article);

    var newArray = article.cells;
    
    console.log("**************** _cells :     %s **************** ", _cells);
    console.log("**************** article :     %s **************** ", newArray);
    
    var temp = _cells.concat(newArray); 
    
    returnArt.update({'cells': temp}, function(err,model) {
                if(err){
                    console.log(err);
                    return res.send(err);
                } 
            });
            
    console.log("**************** temp :     %s **************** ", temp);
    
    res.render('testpage', {
        title: returnArt.title,
        article: returnArt,
        myCells: returnArt.cells,
        myContributors: returnArt.contributors
    });

});

/**
 * Update article
 */

exports.update = wrap(function* (req, res){
  var article = req.article;
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  assign(article, only(req.body, 'title body tags'));
  yield article.uploadAndSave(images);
  res.redirect('/articles/' + article._id);
});

/**
 * Show
 */

exports.show = function (req, res){
    if (typeof req.user == 'undefined'){
        var msg = 'Please log in to view comic';
        return res.redirect('/signup');
    }
    var images = req.article.cells;
    console.log('Tags is   :'+req.article.tags);
    var str = req.article.tags.toString();
    var display_tags = str.split(',');
    //var art = req.article;
    //console.log('art is  :'+art);
    //var u_id = req.user._id;
    //var re = typeof u_id;
    //console.log('typeof u_id is '+re);
    //var doc = art.likers._id(new_id);
    //console.log(doc);
    //console.log('==========');
    //console.log(art.likers);
   // var likedone = art.likers.id(u_id);

    var query = req.user._id +req.article._id;
    var ty = typeof query;
    console.log('query  :'+query);
    var len = req.article.likers.length;
    console.log('len is'+len);
    var flag = 1;
    for (var i = 0;i<=len;i++){
        if (query === req.article.likers[i]){
             flag = 2;
             console.log('MATCH');
             break;
        }
        
    }
    console.log('flag is :'+flag);
    
    //  Article1.find({ liked: query }, function(err,cb){
    //      console.log('+++++++++++');
    //      console.log(cb);
    //  });
    //var flag = 1;
    
    // console.log('Likedone is :'+likedone);
    // var flag; 
    // if (likedone == undefined ){
    //     // if flag == 1 ====> a article not liked by user 
    //     flag = 1; 
    // }
    // else {
    //     flag = 2;
    // }
   console.log('The flag is :'+flag);
   res.render('comics', {
    title: req.article.title,
    article: req.article,
    display_tags:display_tags,
    myCells: images,
    flag:flag
  });
};
/**
 *  Star a article by a user 
 */

exports.getstarred = wrap(function* (req, res) 
{   
    console.log('At articles getstarred '); 
    var thisarticle = req.article;
    var thisuser = req.user;
    var liked = req.user._id + req.article._id
           thisarticle.likers.push(liked);
           thisarticle.save();
           console.log(thisarticle);
           
   res.redirect('/comics/'+thisarticle._id);
    

    
    
    
 });



/**
 * Show for testpage
 */

exports.show2 = function (req, res){
    var images = req.article.cells;
  res.render('testpage', {
    title: req.article.title,
    article: req.article,
    myCells: images
  });
};

exports.publish = function (req,res){
    
    var article_ = req.article; 
    var images = req.article.cells;
    console.log('Before book being published'+article_.published);
    article_.publish();
    console.log('After book being published'+article_.published);
        var images = article_.cells;
        
    
    res.render('comics', {
    title: article_.title,
    article: article_,
    myCells: images
  });
    
};
/**
 * Search all published articles by keywords 
 * 
 */

exports.search = wrap ( function*(req,res){
    console.log('ENTER search FUNCTION at articles');
    console.log('----------------------');
    console.log('----------------------');
    console.log('----------------------');
    console.log('req.body.content   is');
    console.log(req.body.content);
    var kw = req.body.content;
    // Article1.find( { $or:[ { "body": { "$regex": kw, "$options": "i" } }, {'name':param}, {'nickname':param} ]}, 
   Article1.find( { $or:[ { "body": { "$regex": kw, "$options": "i" } },{ "title": { "$regex": kw, "$options": "i" } }]}, 
  function(err,tagged_articles){
     console.log(tagged_articles);
     res.render('tagsearch', {
     title: 'Article with keyword:' + req.body.content,
     articles: tagged_articles,
  });
     
});
//     Article1.find(
//     { "body": { "$regex": kw, "$options": "i" } },
//     function(err,tagged_articles) { 
//         console.log(tagged_articles);

        
//     } 
// );
    
});

/**
 * Delete an article
 * Remove a article form mongoose use findByIdAndRemove
 */

exports.destroy = wrap(function* (req, res) {
    console.log(req.user);
    console.log(req.article);
    var id_togo = req.article._id;
          Article1.findByIdAndRemove( id_togo, function(err){
          console.log('at findOneAndRemove');
      });
  res.redirect('/users/'+req.user.id);
});


/** showmycomics
 * Show my comics: retrive all comics (articles) created by user and 
 * dispaly it on usercomics.html WE ARE RETARDED 
 * parm: username 
 * return: unpublished_articles && published_articles
 */

exports.showmycomics = wrap(function* (req, res){
    if (typeof req.user == 'undefined'){
        return res.redirect('/signup');
    }
   console.log('articles:showmycomics');

   //Nested query
      Article1.find({ 'user': req.user._id, published:1 },  function (err, unpublished_articles) {
        if (err) {
            console.log('error in find one!!!!!!!!!!!!!!!!!!!!!!!')
        }
            Article1.find({ 'user': req.user._id, published:2 },  function (err, published_articles) {
        if (err) {
            console.log('error in find one!!!!!!!!!!!!!!!!!!!!!!!')
        }
            //  Response contains two collections of users' articles
            res.render('usercomics',{unpublished_articles:unpublished_articles,published_articles:published_articles });
        
       
         });

    });
   
});

/**
 * Update Article.cells order
 * 
 */
exports.cellReorder = wrap(function* (req, res) {
    
    if (req.article.published == 2) return;
    
    try {
        var sessUser = req.user._id;}
        catch (err) {
            sessUser = undefined;
        };
    var _artUser = req.article.user._id;
    var _artContributors = req.article.contributors;
    var myID = req.article._id;
    
    var before = req.body.num1;
    var after = req.body.num2;
    console.log("************************** before + after ************************** " + "req1: " + before + "// req2: " + after);
    
    var art1 = yield Article1.findOne({'_id': myID}, function(err, cb) {
        if (err) {
            console.log("okay........ this isn't working...... ducks.");
            res.send(err);
        }
    });
    console.log("**************** art1 : %s ************* ", art1);

    var authPass = art1.isAuthContributor(sessUser);
    
    var query = yield Article1.findOne({ '_id': myID }, 'user title body cells contributors', function (err, article) {
        
        console.log("**************** authPass : %s ************* ", authPass);
        if ((sessUser == undefined) || (typeof(sessUser) == User1 )) {
            res.render('testpage', {
                title: article.title,
                article: article,
                myCells: article.cells
                });
            
        } else if (authPass){
            
            console.log("!!!!!!        Yay!       You can edit this comic !!!!!!!!!! "); 
            
            if (err) {
                console.log('error in find one!!!!!!!!!!!!!!!!!!!!!!!')};
            
            console.log('The title is: %s with the body: %s and has %s cells was created by %s', article.title, article.body, article.cells, article.user);
        
            var cellArray = article.cells;
            for (var i = 0; i < cellArray.length; i++) {
                console.log('The imageURL of cellArray number: %s is %s', i, cellArray[i].ImageURL);
                }
        
            var newArray = article.updateCellOrder(before, after);
        
            article.update({'cells': newArray}, function(err,model) {
                if(err){
                    console.log(err);
                    return res.send(err);
                } 
            });
            
            console.log('**************** the article is now: %s *************', newArray);        

            res.render('testpage', {
                title: article.title,
                article: article,
                myCells: newArray,
                cellNum: newArray.length
                });
        }
       
        });
    console.log('**************** done **************'); 

});

/**
 * 
 * Add contributors to acticle 
 * REQ:
 * only article.user can add people
 * @param: user.username
 * 
 */

exports.addContributor = wrap(function*(req, res) {
    console.log('**************** in addContributor CONTROLLERS ***************'); 
    var owner = req.article.user;
    console.log('**************** owner: %s **************', owner); 
    var sessUser = req.user;
    console.log('**************** sessUser: %s **************', sessUser); 
    var newList;
    var myID = req.article._id;
    var _art = yield Article1.findOne({'_id': myID}, function(err, cb) {
        if (err) {
            console.log("okay........ this isn't working...... ducks.");
            res.send(err);
        }
    });
    
    console.log('**************** owner and sessUser: %s   and  %s    **************', owner._id.toString(),sessUser._id.toString()); 

    if (owner._id.toString() == sessUser._id.toString()) {
        var contributor = req.body.newContributor; 
        console.log("************ contributor : %s **************", contributor);
        
        var toAdd = yield User1.findOne({'username': contributor}, function (err, cb) {
            if (err) {
                console.log("problem in find user Username!!!!!!!!!! " + err);
            }; 
            console.log("*********************** cb : %s !!!!!!!!", cb);
        });
        
        console.log("*********************** toAdd : %s !!!!!!!!", toAdd)
        
        var newList = _art.addNewContributor(toAdd);
        console.log("*********************** newList : %s !!!!!!!!", newList)

        _art.update({'contributors': newList}, function(err,model) {
                if(err){
                    console.log(err);
                    return res.send(err);
                };
            });
        
        res.render('testpage', {
                title: _art.title,
                article: _art,
                myCells: _art.cells,
                myContributors: _art.contributors,
                
                });
    } else {
        //some sort of error message popup
        return;
    }
    
    console.log('**************** done **************'); 
  
});