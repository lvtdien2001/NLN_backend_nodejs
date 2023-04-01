const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const address  = require('../controllers/address.controller')


router.post('/', verifyToken, address.create);
router.delete('/:id', verifyToken, address.delete);

module.exports = router
