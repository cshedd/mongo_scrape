var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var cheerio = require('cheerio');

// Use logger to pass everything through (middleware)

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));
// Creates and lands into public folder
app.use(express.static('public'));

// Database configuration with mongoose  (this is where mongo URI goes)
mongoose.connect('mongodb://localhost/mongo_scrape');
var db = mongoose.connection;

// Show any mongoose errors
db.on('error', function (err) {
	console.log('Mongoose Error: ', err);
});

//Logged in to db through mongoose, log message
db.once('open', function() {
	console.log('Mongoose connection successful.');
});

// Set our models (require schemas)
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

// Routes

// Route index
app.get('/', function(req, res) {
	res.send(index.html);
});

// Route using site and cheerio
app.get('/scrape', function(req, res) {
  request('http://www.thehackernews.com/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('article h2').each(function(i, element) {

				var result = {};

				result.title = $(this).children('a').text();
				result.link = $(this).children('a').attr('href');

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
		res.send("Scrape Finished");
	});		

// Route to see articles saved
app.get('/articles', function(req, res) {
	Article.find({}, function(err, doc){
		if (err) {
			console.log(err);
		} else {
			res.json(doc);
		}
	});
});

// Route
app.get('/articles/:id', function(req, res) {
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

app.post('/articles/:id', function(req, res) {
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


app.listen(3000, function() {
	console.log('App running on port 3000');
});

// MONGODB URI for documentation
// 'mongodb://heroku_pvzdghgl:7ksb7uqr7nv73b2dc5pkgc0sul@ds013456.mlab.com:13456/heroku_pvzdghgl'