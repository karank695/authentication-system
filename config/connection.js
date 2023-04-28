const mongoose = require('mongoose');
async function main() {
    mongoose.connect("mongodb://localhost/authentication_db");
}
main().then(() => {
    console.log('connected successfully');
}).catch((err) => {
    console.log(err);
})