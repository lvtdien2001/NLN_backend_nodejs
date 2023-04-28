const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth');
const verifyAdmin = require('../middleware/admin');
const user  = require('../controllers/User.controller')

router.get('/', verifyToken, verifyAdmin, user.findAll);

module.exports = router
