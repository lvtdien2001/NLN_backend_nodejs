const authRouter = require('./Auth.route');
const categoryRouter = require('./Category.route');
const productorRouter = require('./Productor.route');
const productRouter = require('./Product.route');
const cartRouter = require('./Cart.route');
const addressRouter = require('./Address.route');
const orderRouter = require('./Order.route');
const CommentRouter = require('./Comment.route');
const PaymentRouter = require('./Payment.route');
const searchRouter = require('./Search.route');
const userRoute = require('./User.route');

function route(app) {
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/productor', productorRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/payment', PaymentRouter);
    app.use('/api/address', addressRouter);
    app.use('/api/comment', CommentRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/search', searchRouter);
    app.use('/api/user', userRoute);
}

module.exports = route;
