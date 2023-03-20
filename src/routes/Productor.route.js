const express = require('express');
const router = express.Router();


const verifyToken = require('../middleware/auth')
const verifyAdmin = require('../middleware/admin')
const upload = require('../utils/multer');
const ProductorController = require('../controllers/productor.controller');



router.post('/', verifyToken, verifyAdmin, upload.single('image') ,ProductorController.createProductor);
router.get('/', verifyToken, ProductorController.getProductor);



module.exports = router;