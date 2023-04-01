const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentAccountSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    balance: {
        type: Number,
        default: 1000000000
    },
    password: {
        type: String,
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model('payment-accounts', PaymentAccountSchema)
