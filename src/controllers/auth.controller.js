const argon2 = require('argon2')
const jwt = require('jsonwebtoken');

const User = require('../models/User.model');
const Address = require('../models/Address.model');
const cloudinary = require('../utils/cloudinary');

const dotenv = require('dotenv');


dotenv.config();

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
                    .populate('address',['-user'])
                    .select('-password');
        const addressCondition = {user: req.userId}
        const allAddresses = await Address.find(addressCondition).select('-user');
        if(!user) {
            return res.status(400).json({success: false, message:'User not found'})
        }

        res.json({success: true, user, allAddresses})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error', api:'get Change router'});
    }
}

exports.register = async (req, res, next) => {
    const {username, password,  gender, fullName} = req.body;
    // simple validation
    if (!username || !password)
        return res.status(400).json({success:false, message: 'Tên đăng nhập hoặc mật khẩu không đúng'})
        
    try {
        // check for exiting id
        const user = await User.findOne({username})
                                    
        

      
        if (user ) {
            return res.status(400).json({success: false, message :'Username đã tồn tại!! '});
        }

        // all Good
        

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            image: gender ? 
            'https://res.cloudinary.com/dkzebfbq2/image/upload/v1667321172/avatardefault_zo3shv.png' :
            'https://res.cloudinary.com/dkzebfbq2/image/upload/v1676716155/1000_F_279669366_Lk12QalYQKMczLEa4ySjhaLtx1M2u7e6_sozfwx.jpg' ,
            gender,
            fullName,
            username,
            password: hashedPassword,
            isAdmin:false
        })
        await newUser.save();

        // Return token
        const secret = process.env.ACCESS_TOKEN_SECRECT
        const accessToken = jwt.sign({userId: newUser._id,isAdmin: false},secret )

        res.status(200).json({success: true, message:'Chúc mừng bạn đã đăng ký tài khoản thành công', accessToken})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}

exports.login = async (req, res, next) => {
    const {username, password} = req.body;

    // simple validation
    if (!username || !password)
        return res.status(400).json({success:false, message: 'Tên đăng nhập hoặc mật khẩu không đúng'})

    try {
        // Check for exiting user
        const user = await User.findOne({username});
    
        if (!user ) {
            return res.status(400).json({success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng'});
        }

        // Username found
        const passwordValid = await argon2.verify(user.password, password);
        if(!passwordValid) {
            return res.status(400).json({success: false, message: 'Tên đăng nhập hoặc mật khẩu không đúng'});
        }

        // All good
        
        // Return token
        const secret = process.env.ACCESS_TOKEN_SECRECT
        const accessToken = jwt.sign({userId: user._id, isAdmin: user.isAdmin},secret )
  
        res.status(200).json({success: true, message:'Đăng nhập thành công', accessToken})

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: 'Internal server error'})
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const {gender, phoneNumber, fullName} = req.body
        let updateInfo = {
            gender,
            phoneNumber,
            fullName
          
        };
        
        const infoUpdateCondition = {_id: req.userId};
        updateInfo = await User.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true});
        

            // user not authorised to update post or post not found
            if (!updateInfo) {
                return res.status(401).json({success: false, message:'Không thể cập nhật'})
            }
            
           
            
            res.status(200).json({success: true, message: 'Bạn đã cập nhật thông tin thành công !!!', info: updateInfo});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

exports.updateAddress = async (req, res, next) => {
    try {
        
        let updateInfo = {
           address: req.params.id
        };
        
        const infoUpdateCondition = {_id: req.userId};
        updateInfo = await User.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true});
        

            // user not authorised to update post or post not found
            if (!updateInfo) {
                return res.status(401).json({success: false, message:'Không thể cập nhật'})
            }
            
           
            
            res.status(200).json({success: true, message: 'Bạn đã cập nhật thông tin thành công !!!'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

exports.updateImage = async (req, res, next) => {
    try {
        const person = await User.findById(req.userId)
                                        
        if(person.cloudinary_id) {
            await cloudinary.uploader.destroy(person.cloudinary_id);
        }
       
        
        const result = await cloudinary.uploader.upload(req.file.path,{ folder: "avatarUser" });
        

        let updateInfo = {
            image: result.secure_url,
            cloudinary_id: result.public_id,
        };
        const infoUpdateCondition = {_id: req.userId};

            updateInfo = await User.findOneAndUpdate(infoUpdateCondition, updateInfo, {new: true})
                                        .populate('address',['-user'])
                                        .select('-password');

            // user not authorised to update post or post not found
            if (!updateInfo) {
                return res.status(401).json({success: false, message:'Không thể cập nhật !!! '})
            }


        res.status(200).json({success: true, message: 'Congratulation !!!', info: updateInfo});
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: error
        });
    }
}

