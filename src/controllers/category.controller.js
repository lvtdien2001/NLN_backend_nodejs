
const Category = require('../models/Category.model');

const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();

exports.createCategory = async (req, res) => {
    const {category} = req.body;
    try {
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "category" });
        

        
       
        const newCategory = new Category({
            category,
            image: result.secure_url,
            cloudinary_id: result.public_id,
        })

        await newCategory.save();
       
        res.status(200).json({success: true, message: "Created successfully", newCategory})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}

exports.getCategory = async (req, res) => {

    try {
        
        const allCategory = await Category.find();
       
        res.status(200).json({success: true, message: "get Category successfully", allCategory})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}


