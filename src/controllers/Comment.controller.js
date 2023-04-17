const Comment = require('../models/Comment.model');

// @route POST /api/comment?productId
// @desc create comment when status order is 'Đã nhận'
// @access protected (customer)
exports.create = async (req, res) => {
    try {
        const user = req.userId;
        const product = req.query.productId;
        const { status, rate, content } = req.body;
        if(!content || content === '') {
            return res.status(400).json({
                success: false,
                message: 'Invalid content'
            })
        }
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
// @route GET /api/comment?product=${productId}
// @desc update comment
// @access protected (customer)
exports.findByUser = async (req, res) => {
    try {
        const user = req.userId;
        const product = req.query.product
        const comment = await Comment 
        .findOne({
            // user: user
            user,
            product
        })
        .populate('user', ['fullName', 'gender', 'image'])
        
        // Neu k tim thay comment
        if(!comment){
            return res.status(400).json({
                success: false,
                message: 'Comment not found'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Successlly',
            comment
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
        const comment = await Comment.findOne({_id: commentId,user });

        if(!comment){
           return res.status(400).json({
                success: false,
                message: 'Comment not found or user not authoriused'
            })
        }
        if (comment && comment.status === 2) {
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

// @route get /api/comment/:productID
// @desc update comment
// @access protected (customer)
exports.getCommentByProduct = async (req, res) => {
    try {
      const allComments = await Comment.find({product: req.params.productId}).populate('user',['fullName','image'])
        
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

