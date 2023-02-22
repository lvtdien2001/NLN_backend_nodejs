
const dotenv = require('dotenv')

dotenv.config();

const cloudinary = require('cloudinary').v2;

const cloudName = process.env.CLOUD_NAME ;
const APIKey = process.env.API_KEY ;
const APISecret = process.env.API_SECRET ;
cloudinary.config({
    cloud_name: cloudName,
    api_key: APIKey,
    api_secret: APISecret,
    secure:true
})

module.exports = cloudinary;