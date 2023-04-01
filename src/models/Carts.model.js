const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = Schema({
   detailProduct: { 
      type: Schema.Types.ObjectId, 
      ref: 'detailproducts' 
   },
   quantity: Number,
   user: { 
      type: Schema.Types.ObjectId, 
      ref: 'users' 
   }
}, {timestamps: true});


module.exports = mongoose.model('carts', CartSchema);