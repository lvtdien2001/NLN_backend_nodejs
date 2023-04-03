
const DetailProduct = require('../models/DetailProduct.model');

const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');

dotenv.config();


// method POST api/product?productor&category
// create product
// having token and isAdmin = true
exports.create = async (req, res) => {
    const {
       
        price,
        color,
        quantity,
        size
    } = req.body;
    if(
        !price||
        !color||
        !quantity
        ) {
        return res.status(400).json({success: false, message: "Vui lòng nhập tên sản phẩm"})
    }
    try {
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "detailProducts" });
        

       
        const newDetail = new DetailProduct({
           
            price,
            color,
            quantity,
            size,
            product: req.params.product,
            image: result.secure_url,
            cloudinary_id: result.public_id

        })

        await newDetail.save();
       
        res.status(200).json({success: true, message: "Created detail successfully", newDetail})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router create'});
    }
}

// method GET 
// get All products
// public
exports.getDetailProduct = async (req, res) => {
    if(req.params.product === "undefined") {
        return;
    }
    try {
        
        const detailProduct = await DetailProduct.find({product: req.params.product})
                            
       
        
       
        res.status(200).json({success: true, message: "get all detail product successfully", detailProduct})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}

// method GET api/product/detail
// get All products
// public
exports.getHotProduct = async (req, res) => {
    
    try {
        
        const hotProduct = await DetailProduct.find().sort({"price": -1}).limit(4)
                            
       
        
       
        res.status(200).json({success: true, message: "get hot product successfully", hotProduct})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}
// method GET api/product/detail
// get All products
// public
exports.getSuggestProduct = async (req, res) => {
    
    try {
        
        const suggestProduct = await DetailProduct.find().sort({"quantity": -1}).limit(12)
                            
       
        
       
        res.status(200).json({success: true, message: "get suggest product successfully", suggestProduct})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}

