const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index");
});

router.get('/logout', (req, res) => {
    //session is cleared
    req.logout();  //on the req object by passport
  
    res.redirect('/')
  })

module.exports = router;