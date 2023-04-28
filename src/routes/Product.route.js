const express = require('express');
const router = express.Router();

const verifyAdmin = require('../middleware/admin')
const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const ProductController = require('../controllers/product.controller');
const DetailProductController = require('../controllers/DetailProduct.controller');


// create a new product
router.post('/', verifyToken, verifyAdmin, upload.single('image') ,ProductController.createProduct);

// update information product
router.put('/:id', verifyToken, verifyAdmin, ProductController.updateInformationProduct);
router.delete('/:id', verifyToken, verifyAdmin, ProductController.deleteProduct)

// get all products
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// detail
router.post('/detail/:product',verifyToken, verifyAdmin, upload.single('image'), DetailProductController.create);
router.delete('/detail/:id', verifyToken, verifyAdmin, DetailProductController.deleteDetailProduct)
router.put('/detail/:id', verifyToken, verifyAdmin, DetailProductController.updateDetailProduct)

//get all detail products
router.get('/detail/:product', DetailProductController.getDetailProduct);
//get hot product
router.get('/detail/hot/latest', DetailProductController.getHotProduct);
//get suggest product
router.get('/detail/suggest/latest', DetailProductController.getSuggestProduct);
// get product by category
router.get('/detail/category/:id', DetailProductController.findByCategory);

module.exports = router;
