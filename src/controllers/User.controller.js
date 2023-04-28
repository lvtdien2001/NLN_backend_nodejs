const User = require('../models/User.model');
const Order = require('../models/Order.model');

// @route GET /api/user
// @desc get all users
// @access protected (admin)
exports.findAll = async (req, res) => {
    try {
        
        const users = await User.find().populate('address').select('-password')

        const orders = await Order.find();

        res.status(200).json({
            success: true,
            users,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

