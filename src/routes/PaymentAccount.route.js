const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/admin');
const verifyToken = require('../middleware/auth');

const PaymentController = require('../controllers/PaymentAccount.controller');

// @desc Create payment account
router.post('/', verifyToken, PaymentController.create);

// @desc Get info account
router.get('/', verifyToken, PaymentController.findOne);

// @desc Update info account
router.put('/', verifyToken, PaymentController.update);

module.exports = router
