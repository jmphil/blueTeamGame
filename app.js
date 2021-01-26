const express = require('express');
const app = express();
const helmet = require('helmet');

//body parser
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//views 
app.set('view engine', 'ejs');

//public folder
app.use(express.static('public'));
app.use(helmet());


//sub routes
app.use(require('./routes'));


// start server
app.listen(3000, () => {
    console.log("Server running on port 3000");
})