var express = require('express');

var favicon = require('serve-favicon');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();
app.use(express.static(__dirname + ''));
app.use(express.static(__dirname + '/partials'));

app.use(express.static('src'));
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));



var Firebase = require('firebase');
/*var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});*/

// listen for changes to Firebase data
var fb = new Firebase('https://glowing-heat-6414.firebaseio.com/habits/');
fb.on('child_added',   function(oldChildSnapshot) {
  // code to handle child removal.
  console.log("a")
});
fb.on('child_changed', createOrUpdateIndex);
fb.on('child_removed', removeIndex);

function createOrUpdateIndex() {
  console.log('ayyyyy');
/*
  client.index(this.index, this.type, snap.val(), snap.key())
    .on('data', function(data) { console.log('indexed ', snap.key()); })
    .on('error', function(err) { /!* handle errors *!/ });
*/
}
function removeIndex() {
  console.log('lmao');

  /*  client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
      if( error ) console.error('failed to delete', snap.key(), error);
      else console.log('deleted', snap.key());
    });*/
}

var port = process.env.PORT || 3030;
app.listen(port);
console.log("Listening on port " + port);
