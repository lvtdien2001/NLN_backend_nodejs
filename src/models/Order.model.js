const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    status: {
        type: String,
        default: 'Chờ xác nhận',
        enum: ['Chờ xác nhận', 'Chờ lấy hàng', 'Đang vận chuyển', 'Đã nhận', 'Đã hủy', 'Đã trả hàng']
    },
    products: [
        {
            detail: {
                type: Schema.Types.ObjectId,
                ref: 'detailproducts'
            },
            price: { type: Number },
            quantity: { type: Number },
            name: {type: String}
        }
    ],
    totalAmount: {
        type: Number
    },
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


module.exports = mongoose.model('orders', OrderSchema);