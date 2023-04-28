const express = require('express');
const router = express.Router();
const forgotController = require('../controllers/forgotPassController');
router.get('/forgotPassword', forgotController.forgot);
router.post('/forgotPassword/createToken', forgotController.createToken);
router.get('/resetPassword/:token(*)', forgotController.reset)
router.post('/password-generated/:token', forgotController.generatePass);
module.exports = router;