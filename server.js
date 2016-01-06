var express = require('express');

var app = express();

app.configure(function(){

app.use(express.static(__dirname + '/public'));
});

app.get('/', function(req, res){
	res.render("index.html");
});

app.get('/hallo', function(req, res){
	res.render("hallo.html");
});

app.listen(1337);
