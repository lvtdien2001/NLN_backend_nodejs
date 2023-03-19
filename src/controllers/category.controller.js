
const Category = require('../models/Category.model');



const dotenv = require('dotenv');

dotenv.config();

exports.createCategory = async (req, res) => {
    const {category, quantiy} = req.body;
    try {
        
       
        const newCategory = new Category({
            category,
            quantiy
        })

        await newCategory.save();
       
        res.status(200).json({success: true, message: "Created successfully", newCategory})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}


