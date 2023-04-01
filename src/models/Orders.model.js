const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = Schema({
    user: { type: Schema.Types.ObjectId, ref: 'users' },
    status: {
        type: String,
        enum: ['Đang đợi duyệt', 'Đang vận chuyển', 'Đã nhận', 'Đã hủy', 'Đã trả hàng']
    },
    paymentMethod: {
        type: String,
        enum: ['Thanh toán trực tuyến', 'Thanh toán khi nhận hàng']
    },
    isPayment: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});


module.exports = mongoose.model('orders', OrdersSchema);