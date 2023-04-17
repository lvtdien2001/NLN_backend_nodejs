const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const OrderController = require('../controllers/Order.controller');

router.get('/:orderId', verifyToken, OrderController.findById);
router.get('/', verifyToken, OrderController.findAll);
router.post('/', verifyToken, OrderController.create);
router.put('/:orderId', verifyToken, OrderController.update);

module.exports = router
