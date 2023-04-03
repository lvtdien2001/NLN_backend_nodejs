const Order = require('../models/Order.model');
const DetailProduct = require('../models/DetailProduct.model');

// @route POST /api/order
// @desc create a bill
// @access private
exports.create = async (req, res) => {
    try {
        const user = req.userId;
        const { products, payMethod, isPayment, phoneNumber,
            fullName,
            province,
            district,
            ward,
            description } = req.body;

        let status;
        if (payMethod==='Thanh toán trực tuyến'){
            status='Đang vận chuyển';

            products.forEach( async product => {
                const { detail, price, quantity } = product;

                // Update quantity
                const detailProduct = await DetailProduct.findOne({ _id: detail });
                const currentQuantity = detailProduct.quantity;

                const updateCondition = {
                    _id: detail
                }

                await DetailProduct.findOneAndUpdate(
                    updateCondition,
                    { quantity: currentQuantity - quantity },
                    { new: true }
                )
            })
        }
        else if (payMethod==='Thanh toán khi nhận hàng'){
            status='Đang đợi duyệt'
        }
        else return res.status(400).json({
            success: false,
            message: 'Invalid payment method'
        })

        const newBill = new Order({
            user,
            status,
            products,
            payMethod,
            isPayment,
            phoneNumber,
            fullName,
            province,
            district,
            ward,
            description
        })

        await newBill.save();

        res.json({
            success: true,
            message: 'Create bill successfully',
            bill: newBill
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}