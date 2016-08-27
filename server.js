var express = require('express');
var routes = require('./controllers/controller.js');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var request = require('request');
var exphbs = require('express-handlebars');

// Use handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Use logger to pass everything through (middleware)
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false
}));

// Creates and lands into public folder
app.use(express.static('public'));

// To use routes
app.use('/', routes);

app.listen(process.env.PORT || 3000, function() {
	process.env.PORT == undefined? console.log("App listening on Port 3000"):console.log("App listening on PORT" + process.env.PORT);
});

