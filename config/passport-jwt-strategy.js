const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const ForgotPass = require('../models/forgotPass');
const env = require('./environment');
const opts = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.CUSTOM_SECRET_KEY
}
passport.use(new JWTStrategy(opts, function (jwtPayLoad, done) {
    ForgotPass.findById(jwtPayLoad._id).then((data) => {
        if (data) {
            return done(null, data);
        } else {
            return done(null, false);
        }
    }).catch((err) => {
        console.log('error in finding user from JWT');
        return;
    })
}));

module.exports = passport;