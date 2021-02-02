const express = require("express");
const router = express.Router();
const passport = require('passport');
const db = require('../models');


router.get("/login",  (req, res) => {
  res.render('login')
});



router.post('/login', passport.authenticate('local', {
  successRedirect: '/game',
  failureRedirect: '/login',
  failureFlash : true // allow flash messages
}))



module.exports = router;