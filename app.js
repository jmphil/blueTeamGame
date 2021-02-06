const express = require('express');
const app = express();
const socket = require('socket.io');
const helmet = require('helmet');

//body parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());


// import passport
const passport = require('passport');
require('./auth/passport-config')(passport);

// set cookie information
var cookieSession = require('cookie-session');
app.use(cookieSession({
    name: 'session',
    keys: ['Some secret'],
    maxAge: 14 * 24 * 60 * 60 * 1000 //ms
}));

//views 
app.set('view engine', 'ejs');

//public folder
app.use(express.static('public'));

app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );

// init session
app.use(passport.initialize());
app.use(passport.session());

//sub routes
app.use(require('./routes'));
app.use(require('./routes/game'));
app.use(require('./routes/login'));
app.use(require('./routes/registration'));

//Content Security Policy
// app.use(function (req, res, next) {
//     res.setHeader(
//       'Report-To',
//       '{"group":"csp-endpoint","max_age":10886400,"endpoints":[{"url":"http://your_server_ip:5500/__cspreport__"}],"include_subdomains":true}'
//     );
//     res.setHeader(
//       'Content-Security-Policy',
//       "default-src 'self'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://images.unsplash.com; script-src 'self' https://code.jquery.com/jquery-3.5.1.min.js ; style-src 'self' https://fonts.googleapis.com https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js; frame-src 'self' "
//     );rt__;
//     next();
//   });



// start server with sockets
let server = app.listen (3000, () => {
    console.log("Server is running on port 3000");
});

let io = socket(server);
io.on('connection' , (socket) => {
    console.log('Client connected!!');
    io.emit('msgFromServer', "Welcome to the game!");
    socket.on('msgFromClient', (msgClient) => {
        io.emit('msgFromServer', msgClient)
    })
})

// Requiring JSONs
var users = [];
var words = require('./resources/words');
var wordcount;

// Setup new word function that takes a random postion in the word array
function newWord() {
	wordcount = Math.floor(Math.random() * (words.length));
	return words[wordcount];
};

// Setup connection event in the io object and send userlist
io.on('connection', function (socket) {
	io.emit('userlist', users);

	// Setup join event on the socket, passing the username to the users table and logging the info
	socket.on('join', function(name) {
		socket.username = name;
		socket.join(name);
		console.log(socket.username + ' has joined. ID: ' + socket.id);
		users.push(socket.username);

		// Put user in drawer or guesser room depending on other active users
		if(users.length == 1 || typeof io.sockets.adapter.rooms['drawer'] === 'undefined') {
			socket.join('drawer');
			io.in(socket.username).emit('drawer', socket.username);
			console.log(socket.username + ' is a drawer');
			io.in(socket.username).emit('draw word', newWord());
		}else{
			socket.join('guesser');
			io.in(socket.username).emit('guesser', socket.username);
			console.log(socket.username + ' is a guesser');
		}
	
		io.emit('userlist', users);
	});

	// Draw event through the socket
	socket.on('draw', function(obj) {
		socket.broadcast.emit('draw', obj);
	});

	// Guess event through the socket
	socket.on('guessword', function(data) {
		io.emit('guessword', { username: data.username, guessword: data.guessword})
		console.log('guessword event triggered on server from: ' + data.username + ' with word: ' + data.guessword);
	});

	// Disconnect behavior
	socket.on('disconnect', function() {
		for (var i = 0; i < users.length; i++) {
			if(users[i] == socket.username) {
				users.splice(i, 1);
			};
		};
		
		console.log(socket.username + ' has disconnected.');
		io.emit('userlist', users);

		// Make new drawer if the drawer disconnects
		if(typeof io.sockets.adapter.rooms['drawer'] === "undefined") {
			var x = Math.floor(Math.random() * (users.length));
			console.log(users[x]);
			io.in(users[x]).emit('new drawer', users[x]);
		};
	});

	// New drawer behavior
	socket.on('new drawer', function(name) {
		socket.leave('guesser');
		socket.join('drawer');
		console.log('new drawer emit: ' + name);
		socket.emit('drawer', name);	
		io.in('drawer').emit('draw word', newWord());
	});

	// Swap rooms ability (force new drawer with doubleclick)
	socket.on('swap rooms', function(data) {
		socket.leave('drawer');
		socket.join('guesser');
		socket.emit('guesser', socket.username);
		io.in(data.to).emit('drawer', data.to);
		io.in(data.to).emit('draw word', newWord());
		io.emit('reset', data.to);
	});

	// Correct answer behavior
	socket.on('correct answer', function(data) {
		io.emit('correct answer', data);
		console.log(data.username + ' guessed correctly with ' + data.guessword);
	});

	// Clear screen behavior
	socket.on('clear screen', function(name) {
		io.emit('clear screen', name);
	});

})