const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSoldSchema = new Schema({
    order: {
        type: Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    detailProduct: {
        type: Schema.Types.ObjectId,
        ref: 'detailproducts',
        required: true
    },
    quantity: {
        type: Number
    }
}, {timestamps: true})

module.exports = mongoose.model('products-sold', ProductSoldSchema)
