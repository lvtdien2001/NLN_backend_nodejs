const express = require('express');
const router = express.Router();

const upload = require('../utils/multer');
const verifyToken = require('../middleware/auth');
const verifyAdmin = require('../middleware/admin');
const OrderController = require('../controllers/Order.controller');

router.get('/all', verifyToken, verifyAdmin, OrderController.findAll);
router.get('/', verifyToken, OrderController.findByUser);
router.get('/:orderId', verifyToken, OrderController.findById);
// router.get('/', verifyToken, OrderController.findByUserAndByProduct);

router.post('/', verifyToken, OrderController.create);

// Yeu cau tra hang
router.post('/return/:id', verifyToken, upload.single('image'), OrderController.returnOrder);
router.put('/return/:id', verifyToken, OrderController.updateReturnOrder);

router.put('/:orderId', verifyToken, OrderController.update);

router.delete('/:id', verifyToken, OrderController.delete);
//grossing
router.get('/orderbyGross/grossing', verifyToken, verifyAdmin, OrderController.findAllOrders);

module.exports = router
