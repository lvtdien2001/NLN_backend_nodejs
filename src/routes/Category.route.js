const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')

const CategoryController = require('../controllers/category.controller');



router.post('/',verifyToken ,CategoryController.createCategory);

router.get('/', CategoryController.getCategory);



module.exports = router;