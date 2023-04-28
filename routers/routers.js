const express = require('express');
const passport = require('passport');
const router = express.Router();
const homeController = require('../controllers/homeController');
router.get('/', homeController.home);
router.post('/createUser', homeController.createUser);
router.post('/createSession', passport.authenticate('local', {
    failureRedirect: '/',
    failureFlash: true,
    failureFlash:'invalid username or password.'
}) ,homeController.createSession);
router.get('/about', passport.checkAuthentication,homeController.about);
router.get('/signup', homeController.signup);
router.get('/accountExisted', homeController.exist);
router.get('/sign-out', homeController.signout);
router.post('/changed', homeController.change);
router.get('/resetPass', homeController.renderResetPassPage);
router.get('/login', homeController.home);
router.use('/', require('../routers/forgotPass'));
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), homeController.about);

module.exports = router;