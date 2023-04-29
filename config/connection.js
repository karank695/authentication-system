const mongoose = require('mongoose');
require('dotenv').config();
async function main() {
    mongoose.connect("mongodb://localhost/authentication_db");
    // mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log('connected successfully');
}).catch((err) => {
    console.log(err);
})