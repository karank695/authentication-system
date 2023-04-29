const User = require('../models/users');
const CryptoJS = require('crypto-js');
const env = require('../config/environment');
//function for rendering home page
module.exports.home = (req, res) => {
    res.render('home');
}
//function for rendering about page
module.exports.about = (req, res) => {
    res.render('about');
}
//function for redirecting to home after sign up
module.exports.signup = (req, res) => {
    req.flash('success', 'you Signed Up succesfully');
    res.redirect('/');
}
//function to redirect after checking of existence of user in database
module.exports.exist = (req, res) => {
    req.flash('info', 'acount already existed');
    res.redirect('/');
}
//function to create user upon sign up
module.exports.createUser = (req, res) => {
    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                return res.status(200).json({
                    message: 'existed'
                });
            } else {
                let encPassword = CryptoJS.AES.encrypt(req.body.password, env.CUSTOM_SECRET_KEY).toString();
                User.create({
                    name: req.body.fname + " " + req.body.lname,
                    email: req.body.email,
                    phone: req.body.phone,
                    password: encPassword,
                    dob: req.body.date,
                    gender: req.body.gender
                }).then((data) => {
                    return res.status(200).json({
                        message: 'created'
                    });
                }).catch((err) => {
                    console.log(err);
                })
            }
        }).catch((err) => {
            console.log(err);
        })


}
//function to createSession
module.exports.createSession = (req, res) => {
    req.flash('success', 'logged in successfully');
    return res.redirect('/about');
}
module.exports.captchaValidation = (req, res) => {
        const response_key = req.body['g-recaptcha-response'];
        const secret_key = env.CAPTCHA_SECRET_KEY;
        const url =
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;
        fetch(url, {
                method: "post",
            })
            .then((response) => response.json())
            .then((google_response) => {

                // google_response is the object return by
                // google as a response
                if (google_response.success == true) {
                    //   if captcha is verified
                    req.flash('success', 'logged in successfully');
                    return res.redirect(307,'/createSession');
                } else {
                    // if captcha is not verified
                    req.flash('error', 'You must have to fill captcha');
                    return res.redirect('/');
                }
            })
            .catch((error) => {
                // Some error while verify captcha
                return res.json({
                    error
                });
            });
}

//function to change password
module.exports.change = (req, res) => {
    if (req.body.newPassword != req.body.confirmPassword) {
        req.flash('error', 'password not matched');
        return res.redirect('back');
    }
    User.findOne({
            email: req.body.email
        })
        .then((data) => {
            if (data) {
                let bytes = CryptoJS.AES.decrypt(data.password, env.CUSTOM_SECRET_KEY);
                let decPassword = bytes.toString(CryptoJS.enc.Utf8);
                console.log('data.password', data.password);
                if (req.body.oldPassword != decPassword) {
                    req.flash('error', 'you have entered wrong password')
                    return res.redirect('back');
                }
                let encPassword = CryptoJS.AES.encrypt(req.body.newPassword, env.CUSTOM_SECRET_KEY).toString();
                User.updateOne({
                    $set: {
                        password: encPassword
                    }
                }).then(() => {
                    req.flash('success', 'password changed successfully');
                    res.redirect('/about');
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                req.flash('error', 'you entered wrong credentials')
                return res.redirect('back');
            }
        })
        .catch((err) => {
            console.log(err);
        });
}
//function to render page for reset password
module.exports.renderResetPassPage = (req, res) => {
    return res.render('resetPass');
}
//function for signing out
module.exports.signout = (req, res) => {
    req.session.destroy(function (err) {
        if (err) throw err;
    })
    return res.redirect('/');
}