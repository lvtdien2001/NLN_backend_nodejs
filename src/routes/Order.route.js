const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const OrderController = require('../controllers/Order.controller');

router.post('/', verifyToken, OrderController.create);

module.exports = router
