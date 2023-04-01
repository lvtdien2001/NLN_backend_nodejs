const DetailProduct = require('../models/DetailProduct.model');
const cloudinary = require('../utils/cloudinary');

// @route GET /api/product/detail?productId
// @desc get all elements have product=query.productId
// @access admin required
exports.findAll = async (req, res) => {
    try {
        const { productId } = req.params;

        if(!productId){
            return res.satus(400).json({
                success: false,
                message: 'Invalid query'
            })
        }

        const details = await DetailProduct
            .find({ product: productId })
            .populate('product', ['name', 'productor', 'category'])

        res.json({
            success: true,
            detailProducts: details
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route POST /api/product/detail?product
// @desc create a detail of product
// @access admin required
exports.create = async (req, res) => {
    const { price, color, quantity, size } = req.body;
    const { product } = req.query;

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: 'Image not found'
        })
    }

    try {
        const newDetail = new DetailProduct({
            product,
            price,
            color,
            quantity,
            size,
            image: req.file.path
        });

        await newDetail.save();

        res.json({
            success: true,
            message: 'Successfully',
            detailtProduct: newDetail
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.update = async (req, res) => {

    try {
      

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.delete = async (req, res) => {
    try {
      
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}