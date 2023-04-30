const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String,required:true },
    phone: { type: String },
    password: { type: String,required:true },
    dob: { type: Date},
    gender:{type:String}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
