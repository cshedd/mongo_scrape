var express = require('express');
var router = express.Router();
var request = require('request');

// Set our models (require schemas)
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');

// Scrapers
var mongoose = require('mongoose');
var cheerio = require('cheerio');

// Database configuration with mongoose  (this is where mongo URI goes)
mongoose.connect('mongodb://localhost/scrapeDB' || 'mongodb://heroku_pvzdghgl:7ksb7uqr7nv73b2dc5pkgc0sul@ds013456.mlab.com:13456/heroku_pvzdghgl');
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});

//Logged in to db through mongoose, log message
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

// Route for home
router.get('/', function(req, res) {
	res.redirect('/home');
});

// Route using site and cheerio
router.get('/home', function(req, res) {
  	request('http://www.thehackernews.com/', function(error, response, html) {
	    var $ = cheerio.load(html);
	    $('article h2').each(function(i, element) {

			var result = {};

			result.title = $(this).children('a').text();
			result.link = $(this).children('a').attr('href');
			console.log(result);

			var entry = new Article (result);

			entry.save(function(err, doc) {
			  if (err) {
			    console.log(err);
			  } else {
			    console.log(doc);
			  }
			});
		});
	});	
	res.render('home');
});		

// Route to see articles saved
router.get('/articles', function(req, res) {
	Article.find({}, function(err, doc){
		if (err) {
			console.log(err);
		} else {
			res.json(doc); //this is where json is displayed
		}
	});
});

// Route
router.get('/articles/:id', function(req, res) {
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route to delete notes
router.post('/deletenote/:id', function(req, res) {
	console.log(req.params.id);
	Note.findOne({ '_id': req.params.id })
	.remove('note')
	.exec(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route to replace existing note of article with new one
router.post('/articles/:id', function(req, res) {
	var newNote = new Note(req.body);

	newNote.save(function(err, doc) {
		if (err) {
			console.log(err);
		} else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc) {
				if (err) {
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});


module.exports = router;

// router.listen(3000, function() {
// 	console.log('App running on port 3000');
// });

// MONGODB URI for documentation
// 'mongodb://heroku_pvzdghgl:7ksb7uqr7nv73b2dc5pkgc0sul@ds013456.mlab.com:13456/heroku_pvzdghgl'

//home route, take what get from mongo and render that with home template. in home template, need to have an {(#each article)} <br> {(this.title)} , and then render and send it
// in home within articles div