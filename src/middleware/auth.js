const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRECT;

    if( !token ) {
       return res.status(401).json({success: false, message:'Access token not found'})
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.userId;
        req.isAdmin = decoded.isAdmin;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({success: false, message: 'Invalid token'})
    }
}

module.exports = verifyToken