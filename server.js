var express = require('express');

var favicon = require('serve-favicon');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + ''));
app.use(express.static(__dirname + '/partials'));

app.use(express.static('src'));
app.use(express.static('public'));

var port = process.env.PORT || 3030;
app.listen(port);
console.log("Listening on port " + port);
