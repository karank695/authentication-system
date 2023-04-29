
const ForgotPass = require('../models/forgotPass');
const forgotPassMailer = require('../mailers/forgotPassMailer');
const CryptoJS = require('crypto-js');
const User = require('../models/users');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:__dirname+'../.env'});
module.exports.forgot = (req, res) => {
    return res.render('forgotPass');
}
module.exports.createToken = (req, res) => {
    let email = req.body.email;
    let encToken = jwt.sign(email, process.env.CUSTOM_SECRET_KEY)
    console.log('encToken ',encToken);
    ForgotPass.create({
        email: req.body.email,
        token: encToken,
        expire:false
    }).then((forgotPass) => {
        forgotPassMailer.newMail(forgotPass);
        req.flash('info', 'Reset email has been sent successfully');
        return res.redirect('/');
    })
        .catch((err) => {
            console.log(err);
    })
    
}
module.exports.reset = (req, res) => {
    ForgotPass.findOne({ token: req.params.token }).then((data) => {
        if (data) {
            return res.render('genPass',{token:req.params.token});
        } else {
            return res.send('<h1 style="color:red">Link is expired.....</h1>');
    }
    }).catch((err) => {
        console.log(err);
    })
}
module.exports.generatePass = (req, res) => {
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Password not matching');
        return res.redirect('back');
    }
    if (req.body.password == '' || req.body.confirmPassword == '') {
        req.flash('error', 'please enter your new password');
        return res.redirect('back');
    }
    let newPassword = req.body.password;
    let encPassword = CryptoJS.AES.encrypt(newPassword, process.env.CUSTOM_SECRET_KEY).toString();
    ForgotPass.findOne({ token: req.params.token }).then((data) => {
        let email = data.email;
        User.findOneAndUpdate({ email: email }, { $set: { password: encPassword } })
            .then((data) => {
                console.log('req ',req.params.token);
                    ForgotPass.findOneAndDelete({
                        token: req.params.token
                    }).then((data) => {
                        console.log(data);
                        console.log('token deleted');
                    }).catch((err) => {
                        console.log(err);
                    })
                req.flash('info', 'New password is created');
                res.redirect('/');
            })
            .catch((err) => {
                console.log(err);
            });
    }).catch((err) => {
        console.log(err);
    });
}