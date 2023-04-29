const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
require('dotenv').config();
passport.use(new googleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL:process.env.CALLBACK_URL 
}, function (accessToken, refreshToken, profile, done) {
    //find user
    User.findOne({
        email:profile.emails[0].value
    }).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            console.log('not a registered user');
            return done(null, false);
        }
    }).catch((err) => {
        console.log('error in creating user google-strategy',err);
        return;
    })
}))
module.exports = passport;