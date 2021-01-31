const express = require("express");
const router = express.Router();
let passport = require('passport');

router.get("/login",  (req, res) => {
  res.render('login')
});



router.post('/login', passport.authenticate('local', {
  successRedirect: '/admin/protected',
  failureRedirect: '/login'
}))

// router.post("/login", passport.authenticate('local',
//     { failureRedirect: '/login',
//       failureFlash: true }), function(req, res) {
//         if (req.body.rememberMe === 'on') {
//           req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
//         } else {
//           req.session.cookie.expires = false; // Cookie expires at end of session
//         }
//       res.redirect('/admin/protected');
// });

module.exports = router;