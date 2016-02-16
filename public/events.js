var socket = io();
//var fireData = new Firebase('https://l0j8qken6y1.firebaseio-demo.com/');

socket.on('new connection', function() {
	if (!socket.user) {
		var user = prompt('Choose a username');
		socket['user'] = user;
		$('#username').html(user);

		users.current.push({user: user});
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
	/*users.newList.push({user:socket['user']});
	roleCall(socket['user']);*/
	displayStatusMessage('a user disconnected');
});

/*
fireData.on('child_added', function(snapshot) {
	var message = snapshot.val();
	//console.log(message.text);
	displayChatMessage(message.name, message.text);
});
*/

var users = {
	current: [],
	newList: []
};

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
			socket.emit('chat message', [name, msg]);
			//var newObj = {name: name, text: msg};
			//fireData.push(newObj);
		}

		$('.message').val('');

		return false;
	};
});

function roleCall(username) {
	users.current.forEach(function(old) {
		if (users.newList.indexOf(old) === -1) {
			displayStatusMessage(old.user + ' bye bye toodles noodles');
		}
	});

	console.log('current users: ', users.current);

	users.current = users.newList;
	users.newList = [];
}

function displayChatMessage(name, text) {
	$('.chat-window').append('<div class="msg-obj"><span class="disp-user">' + name + '</span> : ' + '<span class="disp-msg">' + text + '</span></div>');
}

function displayStatusMessage(text) {
	$('.chat-window').append('<div class="update">' + text + '</div>');
}