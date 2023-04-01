const Comment = require('../models/Comments.model');

// @route POST /api/comment?productId
// @desc create comment when status order is 'Đã nhận'
// @access protected (customer)
exports.create = async (req, res) => {
    try {
        const user = req.userId;
        const product = req.query.productId;
        const { status, rate, content } = req.body;

        const newComment = new Comment({
            user,
            product,
            status,
            content,
            rate
        })

        await newComment.save();

        res.status(200).json({
            success: true,
            message: 'Create comment successfully',
            comment: newComment
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/comment/:commentId?productId
// @desc update comment
// @access protected (customer)
exports.update = async (req, res) => {
    try {
        const user = req.userId;
        const commentId = req.params.commentId;
        
        const { rate, content, status } = req.body;
        
        let updateComment = {
            rate, content, status
        }
        const updateCondition = {
            _id: commentId,
            user
        }
        updateComment = await Comment.findOneAndUpdate(updateCondition, updateComment, {new: true});

        res.json({
            success: true,
            message: 'Comment update successfully',
            updateComment
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}