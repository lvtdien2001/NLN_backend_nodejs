
const Productor = require('../models/Productor.model');

const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();


exports.createProductor = async (req, res) => {
    const {name, description} = req.body;
    if(!name) {
        return res.status(400).json({success: false, message: "Missing name or description"})
    }
    try {
       
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "avatar" });
        
        const newProductor = new Productor({
            name,
            description,
            image: result.secure_url,
            cloudinary_id: result.public_id
        })

        await newProductor.save();
       
        res.status(200).json({success: true, message: "Created productor successfully", newProductor})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}

exports.getProductor = async (req, res) => {

    try {
        
        const allProductor = await Productor.find();
       
        res.status(200).json({success: true, message: "get all productor successfully", allProductor})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}


