const Carts = require('../models/Carts.model');

exports.findAll = async (req, res) => {
    try {
        const carts = await Carts
            .find({ user: req.userId })
            .populate('product', ['name', 'price', 'images', 'currentQuantity'])

        res.json({
            success: true,
            carts
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

exports.create = async (req, res) => {
    const { quantity } = req.body;

    try {
        const newCart = new Carts({
            product: req.params.productId,
            quantity,
            user: req.userId
        });

        await newCart.save();

        res.json({
            success: true,
            message: 'Product added into the cart successfully',
            cart: newCart
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
    const { quantity } = req.body;

    try {
        let updateCart = {
            quantity
        }
        const updateCondition = {
            _id: req.params.cartId,
            user: req.userId
        }
        updateCart = await Carts.findOneAndUpdate(updateCondition, updateCart, {new:true});

        //User not authorised to update cart or cart not found
        if (!updateCart){
            return res
                .status(404)
                .json({
                    success: false,
                    message: 'Cart not found or user not authorised'
                })
        }

        res.json({
            success: true,
            message: 'Update cart successfully',
            cart: updateCart
        })
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
        const deleteCondition = {
            _id: req.params.cartId,
            user: req.userId
        }
        const deleteCart = await Carts.findOneAndDelete(deleteCondition);

        // User not authorised or cart not found
        if (!deleteCart){
            return res 
                .status(404)
                .json({
                    success: false,
                    message: 'Cart not found or user not authorised'
                })
        }

        res.json({
            success: true,
            message: 'Cart removed successfully',
            cart: deleteCart
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}