const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/users');
const env = require('./environment');
passport.use(new googleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
}, function (accessToken, refreshToken, profile, done) {
    //find user
    User.findOne({
        email: profile.emails[0].value
    }).then((user) => {
        if (user) {
            return done(null, user);
        } else {
            console.log('not a registered user');
            return done(null, false);
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
