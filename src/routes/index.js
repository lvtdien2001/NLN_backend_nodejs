const authRouter = require('./Auth.route');
const categoryRouter = require('./Category.route');
const productorRouter = require('./Productor.route');
const productRouter = require('./Product.route');
const cartRouter = require('./Cart.route');
const orderRouter = require('./Order.route');
const PaymentAccountRouter = require('./PaymentAccount.route');
const CommentRouter = require('./Comment.route');
const addressRouter = require('./Address.route');

function route(app) {

    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/productor', productorRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/payment', PaymentAccountRouter);
    app.use('/api/order', orderRouter);
    app.use('/api/comment', CommentRouter);
    app.use('/api/address', addressRouter);

}

module.exports = route;
