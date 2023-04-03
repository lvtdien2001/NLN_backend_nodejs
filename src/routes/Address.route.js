const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const Address  = require('../controllers/Address.controller')


router.post('/', verifyToken, Address.create);
router.delete('/:id', verifyToken, Address.delete);

module.exports = router
