  
const express = require("express");
const router = express.Router();
const db = require('../models'); // import all tables
const bcrypt = require('bcryptjs'); // password encrypt



router.get("/registration", (req, res) => {
  res.render('registration');
});


router.post("/registration", async (req, res) => {

  // get info from user input
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;


  // encrypt password
  try {

  // encrypt password
  let passwordEncrypted = bcrypt.hashSync(password,8);

  // insert user in db
  let insert = await db.users.create({
    username: username,
    email: email,
    password: passwordEncrypted,
    roleID: 1
  })
  res.redirect('/login')
  }
  catch (error){
    res.send(`error: can't register this username`);
  }
});

module.exports = router;