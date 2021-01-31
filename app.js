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
app.use(helmet());

// init session
app.use(passport.initialize());
app.use(passport.session());

//sub routes
app.use(require('./routes'));
app.use(require('./routes/login'));
app.use(require('./routes/registration'));


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