const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const carts  = require('../controllers/cart.controller')

router.get('/', verifyToken, carts.findAll);
router.post('/:productId', verifyToken, carts.create);
router.put('/:cartId', verifyToken, carts.update);
router.delete('/:cartId', verifyToken, carts.delete);

module.exports = router
