var socket = io();
//var fireData = new Firebase('https://l0j8qken6y1.firebaseio-demo.com/');

socket.on('new connection', function() {
	if (!socket.user) {
		//var user = prompt('Choose a username');
		//socket['user'] = user;
		//displayStatusMessage(socket.id + ': ' + socket.user);

		//users.current[socket.id] = user;
		// socket.emit('update status', user + ' has entered the room');

		var username = prompt("choose a username") || "guest";
		$('#username').html(username);
		socket['user'] = username;
		socket.emit('auth', {username: username});
	}
});

socket.on('userJoined', function(data) {
	displayStatusMessage(data.newuser + ' has joined');
});

function updateRoster(newroster) {
	$('.roster-names').html('');
	newroster.forEach(function(username) {
		$('.roster-names').append('<div class="rost-name">' + username + '</div>');
	});
}

socket.on('chat message', function(msg) {
	//console.log(msg);
	displayChatMessage(msg.from, msg.msg);
});

socket.on('update status', function(msg) {
	console.log(msg);
	displayStatusMessage(msg);
});

socket.on('updateRoster', function(newRoster) {
	updateRoster(newRoster);
});

/*
fireData.on('child_added', function(snapshot) {
	var message = snapshot.val();
	//console.log(message.text);
	displayChatMessage(message.name, message.text);
});
*/

function roleCall() {
	socket.emit('show roster');
}

function displayChatMessage(name, text) {
	$('.chat-window').append('<div class="msg-obj"><span class="disp-user">' + name + '</span> : ' + '<span class="disp-msg">' + text + '</span></div>');
}

function displayStatusMessage(text) {
	$('.chat-window').append('<div class="update">' + text + '</div>');
}

$('.message').keypress(function(e) {
	if (e.keyCode === 13) {
		var msg = $('.message').val();
		var name = socket.user;

		if (msg.indexOf('<script') > -1) {
			msg = '';
			displayStatusMessage(socket.user + ': invalid input');
		}
		else {
			msg = msg.replace(/(<([^>]+)>)/ig,"")
			socket.emit('chat', {name:name, msg:msg});
			//var newObj = {name: name, text: msg};
			//fireData.push(newObj);
		}

		$('.message').val('');

		return false;
	};
});

$('#roster-icon').on('click', function(e) {
	roleCall();
});