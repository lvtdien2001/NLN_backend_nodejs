

const verifyAdmin = (req, res, next) => {
    if(req.isAdmin) {
        next()
    } else {
        res.status(403).json("You are not admin")
    }
   
}

module.exports = verifyAdmin