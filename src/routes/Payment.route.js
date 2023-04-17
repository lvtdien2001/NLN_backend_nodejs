const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/admin');
const verifyToken = require('../middleware/auth');

const PaymentController = require('../controllers/Payment.controller');

// @desc Create payment url
router.post('/', verifyToken, PaymentController.create);

// @desc Check data has not been changed
router.get('/vnpay_ipn', verifyToken, PaymentController.checksum);

module.exports = router
