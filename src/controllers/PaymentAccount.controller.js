const argon2 = require('argon2');
const PaymentAccount = require('../models/PaymentAccount.model');

// @route POST /api/payment
// @desc create a payment for user
// @access protected (customer)
exports.create = async (req, res) => {
    try {
        const { balance, password } = req.body;
        const user = req.userId;
        //Check user has account?
        const accountUser = await PaymentAccount.findOne({ user });
        if (accountUser){
            return res.status(400).json({
                success: false,
                message: 'User already has payment account'
            })
        }

        //Hash password
        const hashedPassword = await argon2.hash(password);

        const newAccount = new PaymentAccount({
            user,
            balance,
            password: hashedPassword
        })
        await newAccount.save();

        res.json({
            success: true,
            message: 'Create payment account successfully',
            account: newAccount
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route POST /api/payment
// @desc create a payment for user
// @access protected (customer)
exports.findOne = async (req, res) => {
    try {
        const user = req.userId;
        const account = await PaymentAccount.findOne({ user });

        if (!account){
            return res.status(400).json({
                success: false,
                message: 'This user have not payment account'
            })
        }

        res.json({
            success: true,
            account
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/payment
// @desc update info payment account
// @access protected (customer)
exports.update = async (req, res) => {
    try {
        const user = req.userId;
        const { password } = req.body;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}