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
var elasticSearchURLs = [
  'http://localhost:9200',
  'https://paas:6f0aa4d02b9330765a79b677dd412747@dori-us-east-1.searchly.com'
];
var client = new elasticsearch.Client({
  host: elasticSearchURLs[0],
  //host: 'localhost:9200',
  log: 'trace'
});

// listen for changes to Firebase data
var fb = new Firebase('https://glowing-heat-6414.firebaseio.com/attempts/');
fb.on('child_added', createOrUpdateIndex);
fb.on('child_changed', createOrUpdateIndex);
fb.on('child_removed', removeIndex);

client.indices.create({
  index: 'attempt',
}, function (error, response) {
  //console.log(response);
});

function createOrUpdateIndex(snapshot) {
  //console.log('createOrUpdateIndex');

  client.index({
    index: 'attempt',
    type: 'internal',
    id: snapshot.key(),
    body: snapshot.val()
  }, function (error, response) {
    if (error) {
      //console.log("Error indexing user : " + error);
    }
  });

  /*  client.index(this.index, this.type, snap.val(), snap.key())
   .on('data', function(data) { //console.log('indexed ', snap.key()); })
   .on('error', function(err) { /!* handle errors *!/ });*/
}
function removeIndex(snapshot) {
  //console.log('removeIndex');
  client.delete({
    index: 'attempt',
    type: 'internal',
    id: snapshot.key()
  }, function (error, response) {
    if (error) {
      //console.log("Error deleting user : " + error);
    }
  });

  /*  client.deleteDocument(this.index, this.type, snap.key(), function(error, data) {
   if( error ) console.error('failed to delete', snap.key(), error);
   else //console.log('deleted', snap.key());
   });*/
}


setInterval(function () {

  client.search({ //https://dashboard.searchly.com/17573/installation/nodejs#
    index: 'attempt',
    type: 'internal',
    body: {
      query: {
        match: {
          text: "lazy"
        }
      }
    }
  }).then(function (resp) {
    console.log(resp + "RESP RESP RESP RESP RESP RESP RESP RESP RESP RESP");
  }, function (err) {
    //console.log(err.message);
  });
}, 5000);


var port = process.env.PORT || 3030;
app.listen(port);
//console.log("Listening on port " + port);
