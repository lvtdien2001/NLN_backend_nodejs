const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/admin')
const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const upload2 = require('../utils/multerStorageCloudinary');

const ProductController = require('../controllers/product.controller');
const DetailProductController = require('../controllers/DetailtProduct.controller');


// create a new product
router.post('/', verifyToken, verifyAdmin, upload.array('images') ,ProductController.createProduct);

// update information product
router.put('/:id', verifyToken, verifyAdmin, ProductController.updateInformationProduct);

// get all products
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);


/** Detail Product */
// @desc Get all detail product with product ID
router.get('/detail/:productId', verifyToken, verifyAdmin, DetailProductController.findAll);

// @desc Create a detail product
router.post('/detail', verifyToken, verifyAdmin, upload2.single('image'), DetailProductController.create);

module.exports = router;