const mongoose = require('mongoose');
require('dotenv').config({path:'../.env'});
async function main() {
    mongoose.connect(process.env.MONGO_URI);
}
main().then(() => {
    console.log('connected successfully');
}).catch((err) => {
    console.log(err);
})