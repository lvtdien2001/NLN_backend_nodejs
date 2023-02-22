const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = Schema({
    fullName:{
        type: String,
        required: true
    },  
    username:{
        type: String,
        required: true,
        unique: true
    },  
    password: {type: String, required: true, minlength: 8,},
    admin:{
        type: Boolean,
        default: false,
    },
    cash:{
        type: Number,
        default: 0
    },
    phoneNumber:{
        type: String,
        default: "Chưa có số điện thoại"
    },
    gender: {
        type: Boolean,
        default: false
    },
    address:{
        description: String,
        provinceName: String,
        districtName: String,
        wardName: String,
    },
    cart: [
        {
            productID: { type: Schema.Types.ObjectId, ref: 'products' },
            quantiry: Number,
        }
    ]
    ,
    image: {
        type: String
    },
    cloudinary_id : {
        type: String
    },
}, {timestamps: true});


module.exports = mongoose.model('users', UserSchema);