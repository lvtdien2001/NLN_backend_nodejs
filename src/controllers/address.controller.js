const Address = require('../models/Address.model');

const dotenv = require('dotenv');

dotenv.config();

// POST /api/address
// create a new address
// having token
exports.create = async (req, res) => {
    const {phoneNumber,
        fullName,
        province,
        provinceCode,
        district,
        districtCode,
        ward,
        wardCode,

        description} = req.body;
    if(!fullName || !phoneNumber || !provinceCode || !districtCode || !wardCode || !description) {
        return res.status(400).json({success: false, message: "Missing field"})
    }

    try {
        const newAddress = new Address({
            phoneNumber,
            fullName,
            province,
            provinceCode,
            district,
            districtCode,
            ward,
            wardCode,
            description,
            user: req.userId
        })

        await newAddress.save();
       
        res.status(200).json({success: true, message: "Created Address successfully", newAddress})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}

exports.delete = async (req, res) => {
    try {
        const addressCondition = {_id: req.params.id, user: req.userId}

        await Address.deleteOne(addressCondition);

        res.status(200).json({success: true, message: "Deleted Address successfully"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'});
    }
}
