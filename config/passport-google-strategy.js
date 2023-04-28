const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
passport.use(new googleStrategy({
    clientID: '334208010118-g3p8qd33ohbtc1sh3r01f84oe6kem68c.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:8000/auth/google/callback'
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