const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AddressSchema = Schema({
    phoneNumber: {
        type: String
    },
    fullName: {
        type: String
    },
    province: {
        type:String
    },
    provinceCode: {
        type: Number
    },
    district: {
        type:String
    },
    districtCode: {
        type: Number
    },
    ward: {
        type:String
    },
    wardCode: {
        type: Number
    },
    description: {
        type: String
    }
    
}, {timestamps: true});


module.exports = mongoose.model('addresses', AddressSchema);