var express = require('express');
var app = express();

var path = require('path');
var port = process.env.PORT || 8080;
var http = require('http').Server(app);

var io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', function(socket) {
	io.emit('new connection');

	socket.on('chat message', function(msg) {
		io.emit('chat message', msg);
	});

	socket.on('update status', function(msg) {
		io.emit('update status', msg);
	});

	socket.on('disconnect', function() {
		io.emit('disconnect message');
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});