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
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});

// listen for changes to Firebase data
var fb = new Firebase('https://glowing-heat-6414.firebaseio.com/habits/');
fb.on('child_added', createOrUpdateIndex);
fb.on('child_changed', createOrUpdateIndex);
fb.on('child_removed', removeIndex);

function createOrUpdateIndex(snapshot) {
  console.log('createOrUpdateIndex');

  client.index({
    index: 'firebase',
    type: 'habits',
    id: snapshot.key(),
    body: snapshot.val()
  }, function(error, response){
    if(error){
      console.log("Error indexing user : " + error);
    }
  });

/*  client.index(this.index, this.type, snap.val(), snap.key())
    .on('data', function(data) { console.log('indexed ', snap.key()); })
    .on('error', function(err) { /!* handle errors *!/ });*/
}
function removeIndex(snapshot) {
  console.log('removeIndex');
  client.delete({
    index: 'firebase',
    type: 'habits',
    id: snapshot.key()
  }, function(error, response){
    if(error){
      console.log("Error deleting user : " + error);
    }
  });

  /*  client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
      if( error ) console.error('failed to delete', snap.key(), error);
      else console.log('deleted', snap.key());
    });*/
}

var port = process.env.PORT || 3030;
app.listen(port);
console.log("Listening on port " + port);
