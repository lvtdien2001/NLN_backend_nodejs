const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const URI = process.env.DATABASE_URL ;


async function connect() {
    try {
        await mongoose.connect(URI);
        console.log('connect success');
    } catch (error) {
        console.log('connect failure');
        console.log('[error]', error);
    }
}
module.exports = { connect };