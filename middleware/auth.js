const jwt = require('jsonwebtoken')

const protect = (req, res, next)=>{
    const token = req.headers.authorization?.split(" ")[1]
    // console.log(token)
    if(!token){
        return res.status(401).json({message:'Not authorized, no token'})
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
        
    } catch (error) {
        console.log(error.message)
        if(error.message) return res.status(401).json({message:'Session Expired!'})
        return res.status(401).json({message:'Invalid token!'})
    }
    
}

const authorize = (...roles)=>{
    
    return (req,res,next)=>{
        // console.log(roles, req.user.role, roles.includes(req.user.role))
        if(!roles.includes(req.user.role)) {
            return res.status(401).json({message:'Access denied'})
        }
        next();
    }
}



module.exports = {protect, authorize}