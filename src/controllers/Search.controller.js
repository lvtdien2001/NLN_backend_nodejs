const Products = require('../models/Product.model');
const DetailProducts = require('../models/DetailProduct.model');

// @route GET /api/search?q
// @desc Search products
// @access public
exports.findAll = async (req, res) => {
    try {
        const searchValue = req.query.q;
        const lowCaseSearchValue = searchValue.toLowerCase();

        if (!searchValue){
            return res.status(400).json({
                success: false,
                message: 'Invalid search value'
            })
        }

        const products = await Products.find().populate('category').populate('productor');

        const searchResult = products.filter(product => {
            const name = product.name.toLowerCase();
            return name.includes(lowCaseSearchValue);
        })
        
        res.json({
            success: true,
            message: 'Search products successfully',
            searchResult
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
    
}