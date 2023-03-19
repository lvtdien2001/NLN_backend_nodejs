const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String
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
    productor: String,
    color: Array,
    category: {
         type: Schema.Types.ObjectId, ref: 'categorys', 
    }
    
    
}, {timestamps: true});


module.exports = mongoose.model('products', ProductSchema);