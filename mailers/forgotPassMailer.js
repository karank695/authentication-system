const nodeMailer = require('../config/nodemailer');
exports.newMail = (forgotPass) => {
    let htmlString = nodeMailer.renderTemplate({ forgotPass: forgotPass }, '/forgotMail.ejs');
    console.log('inside newforgotpass mailer');
    console.log(forgotPass);
    nodeMailer.transporter.sendMail({
        from: 'krn0869@gmail.com',
        to: forgotPass.email,
        subject: 'mail is sent for forgot password',
        html:htmlString
    }, (err, info) => {
        if (err) {
            console.log('error in sending mail', err);
            return;
        }
        console.log('message sent', info);
        return;
    })
}