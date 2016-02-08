var express = require('express');
var app = express();
var path = require('path');
var port = 3000;
var http = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, function() {
	console.log('listening on *:3000');
});