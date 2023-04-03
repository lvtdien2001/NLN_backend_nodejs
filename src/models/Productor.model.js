const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductorSchema = Schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: String,
    cloudinary_id : String,
     
    
    
}, {timestamps: true});


module.exports = mongoose.model('productors', ProductorSchema);