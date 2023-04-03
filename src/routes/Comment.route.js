const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth')

const CommentController = require('../controllers/comment.controller');



router.post('/',verifyToken ,CommentController.create);
router.put('/:commentId',verifyToken ,CommentController.update);

 router.get('/',verifyToken ,CommentController.findByUser);



module.exports = router;