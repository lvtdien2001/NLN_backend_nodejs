

const authRouter = require('./Auth.route');
const categoryRouter = require('./Category.route');
const productorRouter = require('./Productor.route');
const productRouter = require('./Product.route');
const cartRouter = require('./Cart.route');

function route(app) {
  
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/productor', productorRouter);
    app.use('/api/product', productRouter);
    app.use('/api/carts', cartRouter);

}

module.exports = route;
