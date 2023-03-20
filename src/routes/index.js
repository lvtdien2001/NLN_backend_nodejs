

const authRouter = require('./Auth.route');
const categoryRouter = require('./Category.route');
const productorRouter = require('./Productor.route');
const productRouter = require('./Product.route');
function route(app) {
   
  
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    app.use('/api/productor', productorRouter);
    app.use('/api/product', productRouter);
    
}
module.exports = route;