const Order = require('../models/Order.model');
const DetailProduct = require('../models/DetailProduct.model');
const cloudinary = require('../utils/cloudinary');

// @route GET /api/order/all
// @desc get all order
// @access private (admin)
exports.findAll = async (req, res) => {
    try {

        const orders = await Order
            .find()
            .populate({
                path: 'products',
                populate: { path: 'detail' }
            })
            .populate('user')
            
            .sort({'createdAt': -1});

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
exports.findByUser = async (req, res) => {
    try {
        const user = req.userId;

        const orders = await Order
            .find({user})
            .populate({
                path: 'products',
                populate: { path: 'detail' }
            })
            .sort({'createdAt': -1})

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
            description,
            status,
            isPayment } = req.body;

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

        for (let i=0; i<products.length; i++){
            const detail = await DetailProduct
                .findById(products[i].detail)
                .populate('product', ['name']);

            // @desc Cap nhat so luong san pham trong kho
            await DetailProduct.findByIdAndUpdate(
                products[i].detail, 
                {
                    quantity: detail.quantity - products[i].quantity
                },
                { new: true }
            )
            
            products[i].name = detail.product.name;
        }

        const newOrder = new Order({
            user, status, products, totalAmount, paymentMethod, isPayment, phoneNumber, fullName, province, district, ward, description
        })
        
        await newOrder.save();
        await newOrder.populate('user');
        await newOrder.populate({
            path: 'products',
            populate: {path: 'detail'}
        })

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

// @route POST /api/order/return/:id
// @desc update order return
// @access private
exports.returnOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = req.userId;

        const { reason } = req.body;

        const order = await Order.findOne({ _id: id, user: userId });

        if (!order){
            return res.status(401).json({
                success: false,
                message: 'User not authorised or order not found'
            })
        }

        const result = await cloudinary.uploader.upload(req.file.path, { folder: "returnProducts" });
        let returnOrderData = {
            returnOrder: {
                reason,
                image: result.secure_url,
                isChecked: false
            },
            status: 'Trả hàng'
        }

        returnOrderData = await Order
            .findOneAndUpdate({_id: id}, returnOrderData, {new:true})
            .populate('user')
            .populate({
                path: 'products',
                populate: {path: 'detail'}
            })

        res.status(200).json({
            success: true,
            message: 'Successfully',
            order: returnOrderData
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/order/return/:id
// @desc checked order return
// @access private
exports.updateReturnOrder = async (req, res) => {
    try {
        const id = req.params.id;

        const order = await Order.findOne({ _id: id });

        if (!order){
            return res.status(401).json({
                success: false,
                message: 'User not authorised or order not found'
            })
        }

        let updateData = {
            returnOrder: {
                reason: order.returnOrder.reason,
                image: order.returnOrder.image,
                isChecked: true
            }
        }

       updateData = await Order
        .findByIdAndUpdate(id, updateData, {new:true})
        .populate('user')
        .populate({
            path: 'products',
            populate: {path: 'detail'}
        })

        res.status(200).json({
            success: true,
            message: 'Successfully',
            order: updateData
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/order/:orderId
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
            _id: orderId
        }
        updateOrder = await Order
            .findOneAndUpdate(updateCondition, updateOrder, {new: true})
            .populate('user', ['-password'])
            .populate({
                path: 'products',
                populate: {path: 'detail'}
            });
        
        if (!updateOrder) {
            return res.status(401).json({
                success: false,
                message: 'Order not found or user not authorised'
            })
        }

        const orders = await Order
            .find({user})
            .populate({
                path: 'products',
                populate: { path: 'detail' }
            })
            .sort({'createdAt': -1})

        res.status(200).json({
            success: true,
            orders,
            updateOrder
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route DELETE /api/order/:id
// @desc delete order
// @access private
exports.delete = async (req, res) => {
    try {
        const orderId = req.params.id;
        const userId = req.userId;

        const deleteCondition = {
            _id: orderId,
            user: userId
        }

        const deleteOrder = await Order.findOneAndDelete(deleteCondition);

        if (!deleteOrder) {
            return res.status(400).json({
                success: false,
                message: 'Order not found or user not authorised'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Delete order successfully',
            order: deleteOrder
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
// @route GET /api/order/grossing
// @desc get all order 
// @access 
exports.findAllOrders = async (req, res) => {
    try {
        const {year} = req.query

        const orders = await Order
            .find({"isPayment": true, "status" : "Đã nhận", "createdAt": {
                $gte: `${year-1}-01-01T00:00:00.000Z`,
                $lt: `${year}-01-01T00:00:00.000Z`,
            }})


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