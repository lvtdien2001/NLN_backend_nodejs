
const Category = require('../models/Category.model');



const dotenv = require('dotenv');

dotenv.config();

exports.createCategory = async (req, res) => {
    const {category} = req.body;
    try {
        
       
        const newCategory = new Category({
            category
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


