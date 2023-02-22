const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrdersSchema = Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'users' },
    products: [
        {
            productID: { type: Schema.Types.ObjectId, ref: 'products' },
            quantity: String,
            amount: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['waiting', 'beingTransported', 'received']
    }
    
    
}, {timestamps: true});


module.exports = mongoose.model('orders', UserSchema);