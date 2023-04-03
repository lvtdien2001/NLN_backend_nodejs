const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DetailProductSchema = Schema({
    product: {
        type: Schema.Types.ObjectId, ref: 'products', 
    },
    price: {
        type: Number
    },
    color: {
        type: String
    },
    quantity: {
        type: Number
    },
    size: {
        type: String,
        default: null
    },
    image: {
        type: String
    },
    cloudinary_id: {
        type: String
    }
    
    
}, {timestamps: true});


module.exports = mongoose.model('detailproducts', DetailProductSchema);