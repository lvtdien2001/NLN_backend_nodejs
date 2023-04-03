const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    category: {
        type: String,
    },
    image: {
        type:String
    },
    cloudinary_id : {
        type:String
    }
    
}, {timestamps: true});


module.exports = mongoose.model('categories', CategorySchema);