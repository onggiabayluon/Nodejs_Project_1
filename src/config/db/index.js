const mongoose = require('mongoose');

async function connect() {

    try {
        await mongoose.connect('mongodb://localhost:27017/ducchuy_dev', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        });
        console.log("Connect success to DB!!");
    } catch (error) {
        console.log("Connect failed to DB!!");
    }
}

module.exports = { connect };