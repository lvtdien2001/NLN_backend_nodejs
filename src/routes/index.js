

const authRouter = require('./Auth.route');
const categoryRouter = require('./Category.route');

function route(app) {
   
  
    app.use('/api/auth', authRouter);
    app.use('/api/category', categoryRouter);
    
    
}
module.exports = route;