const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const cart  = require('../controllers/Cart.controller')

router.get('/', verifyToken, cart.findAll);
router.post('/:productId', verifyToken, cart.create);
router.put('/:cartId', verifyToken, cart.update);
router.delete('/:cartId', verifyToken, cart.delete);
// router.delete('/', verifyToken, cart.deleteAll);

module.exports = router
