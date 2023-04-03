const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const Category = require('../controllers/category.controller');



router.post('/',verifyToken, upload.single('image') ,Category.createCategory);

router.get('/', Category.getCategory);



module.exports = router;