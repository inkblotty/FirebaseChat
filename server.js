var express = require('express');
var app = express();

var path = require('path');
var port = process.env.PORT || 8080;
var http = require('http').Server(app);

var io = require('socket.io')(http);

var users = [];
var sockets = [];

function User(username, socket) {
	this.username = username,
	this.socket = socket
}

app.use(express.static(path.join(__dirname, 'public')));

io.sockets.on('connection', function(socket) {
	io.emit('new connection');

	//socket.emit('auth');

	socket.on('auth', function(data) {
		sockets.push(socket);
		var usr = new User(data.username, socket)
		users.push(usr);

		// notify everyone who came in
		io.sockets.emit('userJoined', {newuser: usr.username});

		// add usernames to roster
		var roster = [];
		users.forEach(function(user) {
			roster.push(user.username);
		});
		// then tell all clients
		io.sockets.emit('updateRoster', roster);
	});

	socket.on('chat', function(data) {
		var u = users[sockets.indexOf(socket)]

		//console.log(u.username, data);
		io.sockets.emit('chat message', {from:u.username, msg:data.msg});
	});

	socket.on('show roster', function() {
		var roster = [];
		users.forEach(function(user) {
			roster.push(user.username);
		});
		// then tell all clients
		io.sockets.emit('updateRoster', roster);
	});

	socket.on('disconnect', function() {
		var index = sockets.indexOf(socket);
		var usr = users[index] ? users[index].username : null;

		// remove from both sockets array
		// and users array
		sockets.splice(index, 1);
		users.splice(index, 1);

		var roster = [];
		users.forEach(function(user) {
			roster.push(user.username);
		});
		// then tell all clients

		io.sockets.emit('updateRoster', roster);
		io.sockets.emit('update status', usr + ' has disconnected');
	});

/*
	function sendUpdateRoster() {
		var roster = [];
		users.forEach(function(user) {
			roster.push(user.username);
		});
		// then do:
		io.sockets.emit('updateRoster', {newroster: roster});
	}*/

	socket.on('update status', function(msg) {
		io.emit('update status', msg);
	});

	socket.on('disconnect', function() {
		io.emit('disconnect message', socket.id);
	});
});

http.listen(port, function() {
	console.log('listening on *:' + port);
});