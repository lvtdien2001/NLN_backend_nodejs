const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailProductSchema = Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    price: {
        type: Number,
        default: 0
    },
    color: {
        type: String,
        default: null
    },
    image: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        default: 0
    },
    size: {
        type: String,
        default: null
    },
    cloudinary_id: {
        type: String
    }
}, {timestamps: true});


module.exports = mongoose.model('detailproducts', DetailProductSchema);