const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
require('dotenv').config({ path: __dirname + '../.env' });

passport.use(new googleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, function (accessToken, refreshToken, profile, done) {
    //find user
    User.findOne({
        email: profile.emails[0].value
    }).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: CryptoJS.AES.encrypt(req.body.password, process.env.CUSTOM_SECRET_KEY).toString()
            }).then((data) => {
                console.log(data);
                return done(null, user);
            }).catch((err) => {
                console.log(err);
            })
        }
    }).catch((err) => {
        console.log('error in creating user google-strategy', err);
        return;
    })
}));

passport.setAuthenticatedProfile = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}
module.exports = passport;
