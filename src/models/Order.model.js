const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    status: {
        type: String,
        enum: ['Đang đợi duyệt', 'Đang vận chuyển', 'Đã nhận', 'Đã hủy', 'Đã trả hàng']
    },
    products: [
        {
            detail: {
                type: Schema.Types.ObjectId,
                ref: 'detailproducts'
            },
            price: { type: Number },
            quantity: { type: Number }
        }
    ],
    paymentMethod: {
        type: String,
        enum: ['Thanh toán trực tuyến', 'Thanh toán khi nhận hàng']
    },
    isPayment: {
        type: Boolean,
        default: false
    },
    phoneNumber: {
        type: String
    },
    fullName: {
        type: String
    },
    province: {
        type:String
    },
    district: {
        type:String
    },
    ward: {
        type:String
    },
    description: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('orders', OrdersSchema);