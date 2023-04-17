const Cart = require('../models/Cart.model');
const Product = require('../models/Product.model');
const DetailProduct = require('../models/DetailProduct.model');

// @route GET /api/cart
// @desc get all product in user's cart
// @access protected (customer)
exports.findAll = async (req, res) => {
    try {
        const cart = await Cart
            .find({ user: req.userId })
            .populate('detailProduct')
        let names = [];
        
        for (let i=0; i<cart.length; i++){
            const productId = cart[i].detailProduct.product;
            const product = await Product.findById(productId);
            // console.log(product);
            names.push(product.name);
        }

        res.json({
            success: true,
            cart,
            names
        })
        // let result = [], count = 0;
        // cart.forEach(async product => {
        //     // Get name product from Product Model
        //     const getNameProduct = async () => {
        //         const productInfo = await Product.findOne({ 
        //             _id: product.detailProduct.product 
        //         });
        //         return productInfo.name;
        //     }
        //     const name = await getNameProduct();

        //     const detailProduct = {
        //         id: product.detailProduct._id,
        //         quantity: product.detailProduct.quantity
        //     }

        //     // Format data will response
        //     result.push({
        //         cartId: product._id,
        //         productId: product.detailProduct.product,
        //         detailProduct,
        //         name,
        //         quantity: product.quantity,
        //         price: product.detailProduct.price,
        //         color: product.detailProduct.color,
        //         image: product.detailProduct.image,
        //         size: product.detailProduct.size,
        //     })
        //     count++;
            
        //     if (count===cart.length){
        //         return res.json({
        //             success: true,
        //             cart: result
        //         })
        //     }
        // }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route POST /api/cart/:productId
// @desc add a product into user's cart
// @access protected (customer)
exports.create = async (req, res) => {
    
    try {
        const user = req.userId;
        const { quantity } = req.body;
        const detailProduct = req.params.productId;

        const product = await DetailProduct.findById(detailProduct);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        const cart = await Cart.findOne({
            user,
            detailProduct
        })

        // Product have been in the cart
        if (cart) {
            const updateCondition = {
                detailProduct,
                user
            }
            const updateCart = await Cart.findOneAndUpdate(
                updateCondition, 
                {quantity: cart.quantity+quantity},
                {new: true}
            )
            return res.json({
                success: true,
                message: 'Product added into the cart successfully',
                cart: updateCart
            })
        }

        // Product haven't in the cart
        const newCart = new Cart({
            detailProduct,
            quantity,
            user
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

// @route PUT /api/cart/:cartId
// @desc update product information in user's cart
// @access protected (customer)
exports.update = async (req, res) => {
    try {
        const cartId = req.params.cartId;

        const cart = await Cart.findOne({ _id: cartId }).populate('detailProduct', ['quantity']);
        const { detailProduct } = cart;

        const orderQuantity = req.body.quantity;
        const inventoryQuantity = detailProduct.quantity;

        if (orderQuantity > inventoryQuantity){
            return res.status(400).json({
                success: false,
                message: 'Invalid quantity'
            })
        }

        let updateCart = {
            quantity: orderQuantity
        }
        const updateCondition = {
            _id: req.params.cartId,
            user: req.userId
        }
        updateCart = await Cart.findOneAndUpdate(updateCondition, updateCart, {new:true});

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

// @route DELETE /api/cart/:cartId
// @desc remove a product from cart
// @access protected (customer)
exports.delete = async (req, res) => {
    try {
        const deleteCondition = {
            _id: req.params.cartId,
            user: req.userId
        }
        const deleteCart = await Cart.findOneAndDelete(deleteCondition);

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
