var express = require('express');
var app = express();
var path = require('path');
var port = 3000;
var http = require('http').Server(app);

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});