Mongo-Scrape

This app scrapes news from HackerNews site (using Mongoose and Cheerio) so that users can leave comments on the latest news. Whenever a user visits HackerNews, the app will scrape stories from there. Cheerio grabs the site content and Mongoose saves it to the MongoDB database. All users can leave and delete comments on the articles collected, and all stored comments are visible to every user. 

The following npm packages must be installed:

-express
-express-handlebars
-mongoose
-body-parser
-cheerio
-request

To prepare Heroku host for later deploy, set up an mLab provision. mLab is a remote MongoDB database that Heroku supports natively.

-Create Heroku app in directory
-Run this command in terminal:  
  -  heroku addons:create mongolab
  -  This adds free mLab provision to application
-Find URI string that connects Mongoose to mLab. Run this command to grab that string:
  -  heroku config | grep MONGODB_URI
  -  The value after MONGODB_URI is URI string. Copy to document for later.
-When ready to connect Mongoose with remote database, paste URI string as long argument of mongoose.connect() function.  
