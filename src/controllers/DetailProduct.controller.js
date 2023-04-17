
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
        
        const products = await DetailProduct.find().sort({"price": -1});

        const hotProducts = [];
        for (let i=0; hotProducts.length<4; i++){
            let flag = false;
            for (let j=0; j<hotProducts.length; j++){
                if (products[i].product.toString() === hotProducts[j].product.toString())
                    flag = true;
                }
            if (flag) continue;
            hotProducts.push(products[i]);
            
        }
     
        res.status(200).json({success: true, message: "get hot product successfully", hotProducts})

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
        
        // const suggestProduct = await DetailProduct.find().sort({"quantity": -1}).limit(12)
        const products = await DetailProduct
            .find()
            .populate('product', ['name']);
        const suggestProducts = [];
        for (let i=0; suggestProducts.length<12; i++){
            let flag = false;
            for (let j=0; j<suggestProducts.length; j++){
                if (products[i].product._id.toString() === suggestProducts[j].product._id.toString())
                    flag=true;
                }
            if (flag) continue;
            suggestProducts.push(products[i]);
            
        }                    
       
        res.status(200).json({success: true, message: "get suggest product successfully", suggestProducts})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}

// @route /api/product/detail/category/:id
// @desc get all product by category
// @access public
exports.findByCategory = async (req, res) => {
    if (req.params.id === undefined){
        return res.status(401).json({
            success: false,
            message: 'Category of params not found'
        })
    }
    try {
        const {id} = req.params;
        const allProducts = await DetailProduct
            .find()
            .populate('product', ['category', 'name', 'productor'])
        
        const products = allProducts.filter(detail => detail.product.category.toString()===id);

        const result = [];
        for (let i=0; i<products.length; i++){
            let flag = false;
            for (let j=0; j<result.length; j++){
                if (products[i].product._id.toString() === result[j].product._id.toString())
                    flag=true;
                }
            if (flag) continue;
            result.push(products[i]);
            
        }      

        res.status(200).json({
            success: true,
            result
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
