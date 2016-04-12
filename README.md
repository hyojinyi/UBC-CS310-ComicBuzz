# Comic Buzz || The Buzzers #
## CPSC 310 Project | Term 2 2015 - 2016 ##
- - - -
![picture alt](src/public/images/logo.png) 

App is now hosted at:            comicbuzz310.herokuapp.com
### Please view in full-screen ###
### Note: This version of the project is not connected to a database; key must be connected in app.ts/js ###

#### Contributors ####
Team Buzzers - Abhi, Larry, Hyojin, Joel, Adrien

#### Navigation ####
* src/models 
    * article.ts/js -- contains the Image Mongoose Schema, Article Mongoose Schema and related functionality
    * user.ts/js -- contains the User Mongoose Schema, related functionality including salt password hashing and authorization
* src/controllers
    * articles.ts/js -- client-side controller for comic-related query
    * home.ts/js -- client-side controller for index and pages rendering
    * star.ts/js -- only contains references to Article Mongoose Schema and User Mongoose Schema -- can be used for future functionality
    * tags.ts/js -- client-side controller for tag search, renders the tagseach page
    * user.ts/js -- client-side controller for user-related functionality and query
* src/configs
    * configs.ts/js -- configuation and set default routes as 'root: path.normalize(__dirname + '/..')'
    * express.ts/js -- app = express(), contains passport middleware, set cookies
    * imager.ts/js -- contains S3 storage _NOT USED; perhaps in future updates_
    * ~~init.ts/s -- passport session setup, required for persistent login sessions~~
    * passport.ts/js -- passport session setup, required for persistent login sessions
    * routes.ts/js -- contains Express middleware router
* src/views
_error pages_
    * {404, 422, 500, error }.html
_user story pages_
    * index.html -- home page
    * comics.html -- routed through './comics/:id; can be used to see user specific draft and published comics along with the **Like**, **Edit**, **Publish**, **Delete** buttons
    * login.html -- login page for existing users, can be used to get to **Signup**
    * profile.html -- user-specific profile, displays user's name and email as well as published comics
    * signup.html -- routed to when users are not signed in; allows guests to signup to access full functionality
    * tagsearch.html -- renders the search results from tag search
    * topcomics.html -- shows the recent comics published by all users
    * upload.html -- upload page; uses DropzoneJS
    * testpage -- routed through './testpage/:id' can be used to edit existing draft comics by adding cells, adding contributors and reordering the cells -- uses DropzoneJS
    * usercomics -- shows user specific published and draft comics
    * userlist -- shows a collection of users in the database and links to their personal profile page
_miscellaneous pages -- non-user story related_
    * setting.html
    * contact-us.html
    * about-us.html
    * license.html
    * privacypolicy.html    
    * termsofuse.html
    * header.html
    * show.html 
* src/public/uploads : saves comics locally before pushing to the database
# UBC-CS310-ComicBuzz
