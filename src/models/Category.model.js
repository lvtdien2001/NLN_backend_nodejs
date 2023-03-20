const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = Schema({
    category: {
        type: String,
        enum: ['Laptop', 'Tablet', 'Smartphone','Iphone']
    }
    
}, {timestamps: true});


module.exports = mongoose.model('categories', CategorySchema);