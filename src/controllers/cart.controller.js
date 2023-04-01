const Carts = require('../models/Carts.model');
const Product = require('../models/Product.model');

// @route GET /api/cart
// @desc get all product in user's cart
// @access protected (customer)
exports.findAll = async (req, res) => {
    try {
        const cart = await Carts
            .find({ user: req.userId })
            .populate(
                'detailProduct', 
                ['price', 'color', 'image', 'quantity', 'size', 'product']
            )
        
        let result = [], count = 0;
        cart.forEach(async product => {
            // Get name product from Product Model
            const getNameProduct = async () => {
                const productInfo = await Product.findOne({ 
                    _id: product.detailProduct.product 
                });
                return productInfo.name;
            }
            const name = await getNameProduct();

            // Format data will response
            result.push({
                cartId: product._id,
                detailProductId: product.detailProduct._id,
                name,
                quantity: product.quantity,
                price: product.detailProduct.price,
                color: product.detailProduct.color,
                image: product.detailProduct.image,
                size: product.detailProduct.size,
            })
            count++;
            
            if (count===cart.length){
                return res.json({
                    success: true,
                    cart: result
                })
            }
        }) 
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

        const cart = await Carts.findOne({
            user,
            detailProduct
        })

        // Product have in the cart
        if (cart) {
            const updateCondition = {
                detailProduct,
                user
            }
            const updateCart = await Carts.findOneAndUpdate(
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
        const newCart = new Carts({
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

// @route DELETE /api/cart/:cartId
// @desc remove a product from cart
// @access protected (customer)
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