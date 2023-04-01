const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')
const upload = require('../utils/multer');
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', verifyToken, authController.getUser);


router.put('/',verifyToken ,authController.updateUser);
router.put('/image',verifyToken , upload.single('image'),authController.updateImage);

// update address default
router.put('/:id', verifyToken, authController.updateAddress)


module.exports = router;