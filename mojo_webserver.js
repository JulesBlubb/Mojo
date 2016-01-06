//include filesystem object
var http = require('http');
var $ = require('jquery');
var jsdom = require('jsdom');
var fs = require('fs');
var test = require('./test.js');
console.log(test.test);

//define the http
var s =  http.createServer(function(req, res){
    //include the test.html file and respond it to the user on any url request
    console.log(req.url);
   // if(req.url.indexOf('.html') != -1){
        fs.readFile(__dirname + '/public/html/index.html', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });

// }
/*
 if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
      fs.readFile(__dirname + '/public/js/script.js', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        res.write(data);
        res.end();
      });

    }*/

   if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

      fs.readFile(__dirname + '/public/css/style.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });

   }
});
//start up the server
s.listen(8000);
console.log('Server running at http://127.0.0.1:1337/');
/*
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});


var connect = require('connect');
var server = connect().
use(function(req, res) {
res.end('Hello World!');
}).
listen(64084);
console.log("Server has started and is listening to http://theme.t-jark.de:64084");








client.bulk({
  body: [
    // action description
    { index:  { _index: 'myindex', _type: 'mytype', _id: 1 } },
     // the document to index
    { title: 'foo' },
    // action description
    { update: { _index: 'myindex', _type: 'mytype', _id: 2 } },
    // the document to update
    { doc: { title: 'foo' } },
    // action description
    { delete: { _index: 'myindex', _type: 'mytype', _id: 3 } },
    // no document needed for this delete
  ]
}, function (err, resp) {
  console.trace('sthm. happened');
});
*/
//client.search({
//  index: 'twitter',
//  type: 'tweets',
//  body: {
//    query: {
//      match: {
//        body: 'elasticsearch'
//      }
//    }
//  }
//}).then(function (resp) {
//    var hits = resp.hits.hits;
//}, function (err) {
//    console.trace(err.message);
//});
