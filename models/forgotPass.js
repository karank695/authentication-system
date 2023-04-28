const mongoose = require('mongoose');
const forgotPassSchema = new mongoose.Schema({
    email: { type: String, required: true },
    token: { type: String, require: true },
    expire:{type:Boolean,require:true}
});
const ForgotPass = mongoose.model('ForgotPass', forgotPassSchema);
module.exports = ForgotPass;