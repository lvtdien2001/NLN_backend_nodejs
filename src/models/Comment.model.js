const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    status: {
        type: Number,
        // enum: [0, 1, 2], //0: create, 1: Đã comment, 2: Đã sửa rồi
        default: 0
    },
    content: {
        type: String,
        default: ''
    },
    rate: {
        type: Number,
        enum: [ 1, 2, 3, 4, 5]
    }
}, {timestamps: true})

module.exports = mongoose.model('comments', CommentsSchema)
