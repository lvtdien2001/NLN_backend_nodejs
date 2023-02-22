const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name:{
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    images: [
        {
            image: String,
            cloudinary_id : String,
        }
    ],
    currentQuantity: {
        type: Number,
        required: true
    },
    detailInfor: {
        color: Array,
        productor: String,
        description: String
    },
    category: {
        type: string
    }
    
    
}, {timestamps: true});


module.exports = mongoose.model('products', UserSchema);