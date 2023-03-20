const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/admin')
const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const ProductController = require('../controllers/product.controller');



// create a new product
router.post('/', verifyToken, verifyAdmin, upload.array('images') ,ProductController.createProduct);

// update information product
router.put('/:id', verifyToken, verifyAdmin, ProductController.updateInformationProduct);

// get all products
router.get('/', ProductController.getAllProducts);


module.exports = router;