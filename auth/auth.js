const jwt = require('jsonwebtoken')

//it is a middleware for a authorization. We can use which is protected route in the project.
const verifyJWT = (req, res, next) => {
   /*  if we use the tokken in teh req header
    const authHeader = req.headers.authorization   
    if (!authHeader) {
        return res.status(401).send({ message: 'Authorization header missing' })
    }
    const token = authHeader.split(' ')[1];         // Extract the token (Bearer <token>)
    */

    const token = req.cookies.token
    if (!token) {
        return res.status(401).send({ message: 'Token missing in cookies' });
    }
    // console.log('verifyJWT:', req.body,token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // console.log('decoded:', decoded)       
        req.body.user= decoded; 
        next() 
    } catch (err) {
        res.status(401).send({ message: 'Invalid or expired token' })
    }
}

module.exports = verifyJWT