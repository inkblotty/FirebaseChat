var socket = io();
//var fireData = new Firebase('https://l0j8qken6y1.firebaseio-demo.com/');

socket.on('new connection', function() {
	if (!socket.user) {
		var user = prompt('Choose a username');
		socket['user'] = user;
	};

	$('#username').html(user);

	displayStatusMessage(user + ' entered the room');
});

socket.on('chat message', function(msg) {
	displayChatMessage(msg[0], msg[1]);
});

socket.on('disconnect message', function(user) {
	displayStatusMessage(user + ' disconnected');
});

/*
fireData.on('child_added', function(snapshot) {
	var message = snapshot.val();
	//console.log(message.text);
	displayChatMessage(message.name, message.text);
});
*/

$('.message').keypress(function(e) {
	if (e.keyCode === 13) {
		var msg = $('.message').val();
		var name = socket.user;
		//var newObj = {name: name, text: msg};

		socket.emit('chat message', [name, msg]);

		//fireData.push(newObj);
		$('.message').val('');

		return false;
	};
});

function displayChatMessage(name, text) {
	$('.chat-window').append('<div class="msg-obj"><span class="disp-user">' + name + '</span> : ' + '<span class="disp-msg">' + text + '</span></div>');
}

function displayStatusMessage(text) {
	$('.chat-window').append('<div class="update">' + text + '</div>');
}