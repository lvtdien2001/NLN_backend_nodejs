const Order = require('../models/Order.model');
const DetailProduct = require('../models/DetailProduct.model');

// @route GET /api/order/:orderId
// @desc get a bill by id
// @access private
exports.findById = async (req, res) => {
    try {
        const user = req.userId;
        const orderId = req.params.orderId;

        const bill = await Order
            .findById(orderId)
            .populate({
                path: 'products',
                populate: { path: 'detail' }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            })
        }

        res.status(200).json({
            success: true,
            bill
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route GET /api/order
// @desc get all order by user
// @access private
exports.findAll = async (req, res) => {
    try {
        const user = req.userId;

        const orders = await Order
            .find({user})
            .populate({
                path: 'products',
                populate: { path: 'detail' }
            })

        res.status(200).json({
            success: true,
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

// @route POST /api/order
// @desc create a bill
// @access private
exports.create = async (req, res) => {
    try {
        const user = req.userId;
        const { 
            products,
            totalAmount,
            paymentMethod,
            phoneNumber,
            fullName,
            province,
            district,
            ward,
            description } = req.body;


        for (let i=0; i<products.length; i++){
            const detail = await DetailProduct.findById(products[i].detail).populate('product', ['name']);
            products[i].name = detail.product.name;
        }

        if (!province || !district || !ward || !description){
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            })
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        const newOrder = new Order({
            user, products, totalAmount, paymentMethod, phoneNumber, fullName, province, district, ward, description
        })

        await newOrder.save();

        res.json({
            success: true,
            message: 'Create bill successfully',
            bill: newOrder
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/isPayment/order/:orderId
// @desc update isPayment status
// @access private
exports.update = async (req, res) => {
    try {
        const user = req.userId;
        const orderId = req.params.orderId;
        const { isPayment, status } = req.body;

        let updateOrder = {
            isPayment,
            status
        }
        const updateCondition = {
            _id: orderId,
            user
        }
        updateOrder = await Order.findOneAndUpdate(updateCondition, updateOrder, {new: true});
        
        if (!updateOrder) {
            return res.status(401).json({
                success: false,
                message: 'Order not found or user not authorised'
            })
        }

        res.status(200).json({
            success: true,
            order: updateOrder
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}