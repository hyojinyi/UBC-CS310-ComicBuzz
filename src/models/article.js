/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ImgModel = new Schema({
    _id: false,
    Date: { type: Date, default: Date.now },
    ImageURL: { type: String, default: '' },
    Position: { type: Number, default: '' } });
mongoose.model('ImgModel', ImgModel);
/**
 * Article Schema
 */
var ArticleSchema = new Schema({
    title: { type: String, required: true },
    published: { type: String, default: 1 },
    body: { type: String, required: true },
    user: { type: Schema.ObjectId, ref: 'User' },
    comments: [{
            body: { type: String, default: '' },
            user: { type: Schema.ObjectId, ref: 'User' },
            createdAt: { type: Date, default: Date.now }
        }],
    tags: [String],
    cells: [ImgModel],
    //likers: [{type: Schema.ObjectId, ref: 'User'}],
    likers: [String],
    createdAt: { type: Date, default: Date.now },
    contributors: [{ type: Schema.ObjectId, ref: 'User' }]
});
/**
 * Validations
 */
ArticleSchema.path('title').required(true, 'Article title cannot be blank');
ArticleSchema.path('body').required(true, 'Article body cannot be blank');
/**
 * Pre-remove hook
 */
ArticleSchema.pre('remove', function (next) {
    next();
});
/**
 * Methods
 */
ArticleSchema.methods = {
    /**
     * Set article to published
     * Default is false == draft
     * Toggle between published and draft
     */
    setPublished: function () {
        if (this.published == "") {
            this.published = false;
        }
        else
            this.published = true;
    },
    /**
     * update cell order
     * before: Number -- index of before cell
     * after: Number -- index of where you want the cell to be
     */
    updateCellOrder: function (before, after) {
        console.log("************** updateCellOrder function in articles.ts ************");
        var _Array = this.cells;
        var newArray = [ImgModel];
        var first = [ImgModel];
        var middle = [ImgModel];
        var last = [ImgModel];
        var sizeOf = _Array.length;
        var bookmark;
        var bookmark2;
        if (before < after) {
            bookmark = before;
            bookmark2 = after;
        }
        else if (before > after) {
            bookmark = after;
            bookmark2 = before;
        }
        ;
        console.log("********sizeOf the input array*********  " + sizeOf);
        //there is no reordering you can do when there is only 1 or no cells
        // no reording if before is after
        if ((sizeOf < 2) || (parseInt(before) == parseInt(after))) {
            console.log("************** size of is <2 or before == after ************");
            newArray = _Array;
            console.log('The ORIGINAL ARRAY WAS %s', _Array);
            console.log('The NEW ARRAY IS %s', newArray);
        }
        else {
            for (var i = 0; i < parseInt(bookmark); i++) {
                first[i] = _Array[i];
            }
            ;
            if (parseInt(bookmark) + 1 != bookmark2) {
                console.log("bookmark +1 = %s, bookmark2 =%s", (parseInt(bookmark) + 1), parseInt(bookmark2));
                for (var j = (parseInt(bookmark) + 1); j < parseInt(bookmark2); j++) {
                    middle[j] = _Array[j];
                }
            }
            ;
            if (parseInt(bookmark2) + 1 != sizeOf) {
                console.log("bookmark2 +1 = %s, sizeOf =%s", (parseInt(bookmark2) + 1), parseInt(sizeOf));
                if (parseInt(bookmark2) + 1 < parseInt(sizeOf)) {
                    for (var k = (parseInt(bookmark2) + 1); k < parseInt(sizeOf); k++) {
                        last[k] = _Array[k];
                    }
                }
                ;
            }
            ;
            // console.log("******** first array is %s**********", first);
            // console.log("********** bookmark is: %s**********", _Array[bookmark]);
            // console.log("********** middle array is: %s**********", middle);
            // console.log("********** bookmark2 is: %s**********", _Array[bookmark2]);
            // console.log("********** last array is: %s**********", last);
            if (before < after) {
                if (parseInt(after) == parseInt(sizeOf) - 1) {
                    newArray = first.concat(middle, _Array[bookmark2], _Array[bookmark]);
                }
                newArray = first.concat(middle, _Array[bookmark2], _Array[bookmark], last);
            }
            else if (before > after) {
                newArray = first.concat(_Array[bookmark2], _Array[bookmark], middle, last);
            }
            ;
            newArray = newArray.filter(function (n) {
                return (n != undefined) && (n != ImgModel);
            });
            console.log('The ORIGINAL ARRAY WAS %s', _Array);
            console.log('The NEW ARRAY IS %s', newArray);
            console.log("************** DONE ************");
        }
        return newArray;
    },
    /**
     * Save article and upload image
     *
     * @param {Object} images
     * @api private
     */
    uploadAndSave: function (images) {
        // Uncomment this line if you want to check if the images are passed through
        //console.log(images);
        for (var i = 0; i < images.length; i++) {
            //console.log(images[i]);
            var testString = images[i].path;
            //console.log(testString);
            //console.log(i);
            this.cells.push({
                Date: Date.now(),
                ImageURL: testString,
                Position: i
            });
            console.log(" I am here 2 ");
            console.log(i);
        }
        //console.log("It gets here");
        return this.save(function (err, resp) {
            if (err) {
                console.log(err);
            }
            else {
                console.log("all is good");
            }
        });
    },
    fullTextSearch: function (keyword) {
        this.find({ $text: { $search: keyword } })
            .limit(20)
            .exec(function (err, items) {
            console.log();
            console.log("items", items);
        });
    },
    /**
    * Publish article
    *
    * @param {User} user
    * @param {Object} comment
    * @api private
    */
    publish: function () {
        console.log('***************publish at article.ts');
        if (this.published == 2) {
            console.log('**************it is published');
        }
        else {
            this.published = 2;
            console.log('it is published now****************');
        }
        return this.save();
    },
    /**
     * Add comment
     *
     * @param {User} user
     * @param {Object} comment
     * @api private
     */
    addComment: function (user, comment) {
        this.comments.push({
            body: comment.body,
            user: user._id
        });
        if (!this.user.email)
            this.user.email = 'email@product.com';
        /*notify.comment({
          article: this,
          currentUser: user,
          comment: comment.body
        });*/
        return this.save();
    },
    /**
     * Remove comment
     *
     * @param {commentId} String
     * @api private
     */
    removeComment: function (commentId) {
        var index = this.comments
            .map(comment => comment.id)
            .indexOf(commentId);
        if (~index)
            this.comments.splice(index, 1);
        else
            throw new Error('Comment not found');
        return this.save();
    },
    /**
     * Add user to contributor list
     * @param: User
     * return contributor array
     */
    addNewContributor: function (user) {
        this.contributors.push(user);
        //   console.log('********** article.contributors : %s **********', this.contributors)
        return this.contributors;
    },
    /**
     * Number of contributors
     *
     * return number of contributors to article
     */
    numContributors: function () {
        var _contributors = this.contributors;
        console.log("************* numContributors !!!! contributors ************** %s", _contributors);
        var cat = 0;
        for (var user in _contributors) {
            cat++;
        }
        return cat;
    },
    /**
     * Check if user is authorized contributor to comic/article
     * default: false
     * @param {userID} String // user._id
     */
    isAuthContributor: function (userID) {
        var auth = false; //default
        var _contributors = this.contributors;
        console.log("************ userID (given to query): %s *************", userID);
        console.log("************* contributors ************** %s", _contributors);
        console.log("************* this.user id ************** %s", this.user);
        var _userID = new String(userID);
        var _thisUser = new String(this.user);
        console.log(" the comparison to given and the article owner is : *** %s ***", (_userID.toString() == _thisUser.toString()));
        console.log("************* _userID.toString **************" + _userID.toString());
        console.log("************* _thisUser.toString **************" + _thisUser.toString());
        if (_userID.toString() == _thisUser.toString()) {
            auth = true;
        }
        console.log("********* this.contributors.length ******* :   %s ", this.contributors.length);
        for (var i = 0; i < this.contributors.length; i++) {
            console.log("**************** contributor id [%s] : %s *************", i, _contributors[i]._id);
            if (_userID.toString() == _contributors[i].toString()) {
                auth = true;
                break;
            }
            ;
        }
        ;
        return auth;
    }
};
/**
 * Statics
 * These are methods defined on the model only
 * All you need to do in order to create a new model method would be
 * "name": function("The parameter passed in")
 * {
 *      Do whatever you want
 * }
 * Look at the bottom two as examples if you get stuck
 */
ArticleSchema.statics =
    {
        /**
        * Find a comic by id
        * Return the comic that we find back based on the id we passed through
        *
        * @param {ObjectId} id
        * @api private
        */
        load: function (_id) {
            var test_without_populate = this.findOne({ _id: _id });
            //console.log('test_without_populate is :'+test_without_populate);
            var query_results = this.findOne({ _id: _id })
                .populate('user', 'name email username')
                .populate('comments.user')
                .exec();
            //console.log('query_results at article.load is :'+query_results);
            return query_results;
        },
        loadcomics: function (userid) {
            return this.findOne({ 'user': userid })
                .populate('user', 'name email username')
                .exec();
        },
        /**
         * List articles
         *
         * @param {Object} options
         * @api private
         */
        list: function (options) {
            var criteria = options.criteria || {};
            var page = options.page || 0;
            var limit = options.limit || 30;
            return this.find(criteria)
                .populate('user', 'name username')
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(limit * page)
                .exec();
        }
    };
mongoose.model('Article', ArticleSchema);
