
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs');
const db = require('../models');


const init = (passport) => {
    passport.use( new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    async (req, username, password, done) =>{
        console.log(`inside passport.use: username ${username}, password: ${password}`);
        console.log(req.body.rememberMe);
        //database call
    /*
        plan
        find username (db.users.findAll)
        compare password entered to password in db (bcrypt.compare)
        if there is a match for password return done(null, user)
        if no match for username OR password, return done(null, false)

      */

    let records = await db.users.findAll({ where: { username: username } });

    if (records) {
        let record = records[0];

        bcrypt.compare(password, record.password, (err, response) => {
        if (response) {
            done(null, record);
        } else {
            done(null, false);
        }
        });
    } else {
        done(null, false);
    }
}));

passport.serializeUser((user, done) => {
    console.log("serialize");
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log("deserialize");
    try{
        var record = await db.users.findByPk(id);
        done(null, record);
    }
    catch(error){
        done(null, null)
    }
});
};


module.exports = init;