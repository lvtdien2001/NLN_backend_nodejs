
const Address = require('../models/Address.model');



const dotenv = require('dotenv');

dotenv.config();


exports.createProductor = async (req, res) => {
    const {phoneNumber,
        fullName,
        province,
        provinceCode,
        district,
        districtCode,
        ward,
        wardCode,
        description} = req.body;
    if(!fullName || !phoneNumber || !provinceCode || !districtCode || !wardCode || !province || !description) {
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
            description
        })

        await newAddress.save();
       
        res.status(200).json({success: true, message: "Created Address successfully", newAddress})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}




