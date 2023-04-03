const Comment = require('../models/Comment.model');

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
// @route GET /api/comment
// @desc update comment
// @access protected (customer)
exports.findByUser = async (req, res) => {
    try {
        const user = req.userId;
        const comments = await Comment
        .find({
            // user: user
            user
        })
        .populate('user', ['fullName', 'gender', 'image'])

        // Neu k tim thay comment
        if(!comments){
            return res.status(400).json({
                success: false,
                message: 'Comment not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Successlly',
            comments
        })

    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

// @route PUT /api/comment/:commentId
// @desc update comment
// @access protected (customer)
exports.update = async (req, res) => {
    try {
        const user = req.userId;
        const commentId = req.params.commentId;
        
        const { rate, content } = req.body;
        const comment = await Comment.findOne({_id: commentId});

        if (comment && comment.status===2) {
            return res.status(400).json({
                success: false,
                message: 'Invalid comment'
            })
        }

        let updateComment = {
            rate, content, status: comment.status+1
        }
        const updateCondition = {
            _id: commentId,
            user,
            status: 0||1
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

// @route get /api/comment/:productID
// @desc update comment
// @access protected (customer)
exports.getCommentByProduct = async (req, res) => {
    try {
      const allComments = await Comment.find({product: req.params.product})
        
      res.json({
        success: true,
        message: 'Comment update successfully',
        allComments
    })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

