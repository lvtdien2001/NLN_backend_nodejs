const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartSchema = Schema({
   product: { 
      type: Schema.Types.ObjectId, 
      ref: 'products' 
   },
   quantity: Number,
   user: { 
      type: Schema.Types.ObjectId, 
      ref: 'users' 
   }
}, {timestamps: true});


module.exports = mongoose.model('carts', CartSchema);