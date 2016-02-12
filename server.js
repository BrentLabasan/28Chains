var express = require('express');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
app.use(express.static(__dirname + ''));
app.use(express.static(__dirname + '/partials'));
app.use(express.static(__dirname + '/public'));

app.use(express.static('src'));

var port = process.env.PORT || 3030;
app.listen(port);
console.log("Listening on port " + port);
