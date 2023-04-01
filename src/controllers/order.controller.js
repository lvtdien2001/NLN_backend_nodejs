const Order = require('../models/Orders.model');
const ProductSold = require('../models/ProductSold.model');
const PaymentAccount = require('../models/PaymentAccount.model');

exports.create = async (req, res) => {
    try {
        const user = req.userId;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}