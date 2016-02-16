var socket = io();
//var fireData = new Firebase('https://l0j8qken6y1.firebaseio-demo.com/');

socket.on('new connection', function() {
	if (!socket.user) {
		var user = prompt('Choose a username');
		socket['user'] = user;
		$('#username').html(user);

		currentUsers.push({user: user});
		socket.emit('update status', user + ' has entered the room');
	};
});

socket.on('chat message', function(msg) {
	displayChatMessage(msg[0], msg[1]);
});

socket.on('update status', function(msg) {
	displayStatusMessage(msg);
});

socket.on('disconnect message', function() {
	newCurrent.push({user:socket['user']});
	roleCall(socket['user']);
});

/*
fireData.on('child_added', function(snapshot) {
	var message = snapshot.val();
	//console.log(message.text);
	displayChatMessage(message.name, message.text);
});
*/

var currentUsers = [];
var newCurrent = [];

$('.message').keypress(function(e) {
	if (e.keyCode === 13) {
		var msg = $('.message').val();
		var name = socket.user;
		//var newObj = {name: name, text: msg};

		if (msg.indexOf('<script') > -1) {
			msg = 'invalid input';
			displayStatusMessage(socket.user, ': ' + msg);
		}
		else {
			socket.emit('chat message', [name, msg]);
		}

		//fireData.push(newObj);
		$('.message').val('');

		return false;
	};
});

function roleCall(username) {
	currentUsers.forEach(function(old) {
		if (newCurrent.indexOf(old) === -1) {
			displayStatusMessage(old.user + ' bye bye toodles noodles');
		}
	});

	currentUsers = newCurrent;
	newCurrent = [];
}

function displayChatMessage(name, text) {
	$('.chat-window').append('<div class="msg-obj"><span class="disp-user">' + name + '</span> : ' + '<span class="disp-msg">' + text + '</span></div>');
}

function displayStatusMessage(text) {
	$('.chat-window').append('<div class="update">' + text + '</div>');
}