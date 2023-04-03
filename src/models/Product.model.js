const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = Schema({
    name:{
        type: String,
        required: true
    },
    productor: {
        type: Schema.Types.ObjectId, ref: 'productors', 
   },
    category: {
         type: Schema.Types.ObjectId, ref: 'categories', 
    },
    image: {
        type: String
    },
    cloudinary_id: {
        type: String
    }
    
    
}, {timestamps: true});


module.exports = mongoose.model('products', ProductSchema);