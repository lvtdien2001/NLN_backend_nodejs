

const authRouter = require('./Auth.route');
const productRouter = require('./Product.route');
function route(app) {
   
  
    app.use('/api/auth', authRouter);
    app.use('/api/products', productRouter);
    
    
}
module.exports = route;