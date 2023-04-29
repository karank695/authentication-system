const express = require('express');
const app = express();
require('dotenv').config({ path: __dirname + '/.env' });
const PORT = process.env.PORT;
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const db = require('./config/connection');
const flash = require('connect-flash');
const session = require('express-session');
const customMiddleware = require('./config/customMiddleware');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const LocalStrategy = require('./config/passport-local-strategy');
const JWTStrategy = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-strategy');
const CryptoJS = require('crypto-js');
const fetch = require('isomorphic-fetch');

//setting path for static resources
app.use(express.static('assets'));
//using express body parser
app.use(express.urlencoded({ extended: true }));

//setting view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))
app.use(expressLayouts);
app.use(session({
    name: 'karan',
    secret:'something',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: (60 * 100 * 1000)
    }
}));
app.use(flash());
app.use(customMiddleware.setFlash);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(passport.setAuthenticatedProfile);
app.use('/', require('./routers/routers'));

// console.log(app.get('env'));
app.listen(7000,() => {
    console.log(`I am listening at port ${PORT}`);
})