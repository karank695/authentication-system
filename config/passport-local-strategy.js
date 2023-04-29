const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/users');
const CryptoJS = require('crypto-js');
const env = require('./environment');
//setting passport local strategy
passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (email, password, done) {
        User.findOne({
            email: email
        }).then((user) => {
            
            if (!user) {
                return done(null, false);
            }
            let bytes = CryptoJS.AES.decrypt(user.password,env.CUSTOM_SECRET_KEY );
            let decPassword = bytes.toString(CryptoJS.enc.Utf8);
            if (decPassword != password) {
                return done(null, false);
           }
            return done(null, user);
        }).catch((err) => {
            console.log(err);
        })
    }
));

//serializing the user to set cookie
passport.serializeUser(function (user, done){
    return done(null, user.id);
})

//deserializing the user

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        return done(null, user);
    }).catch((err) => {
        console.log(err);
    })
})

//middleware to check authentication
passport.checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/');
}
//setting user to locals 
passport.setAuthenticatedUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;
