import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

export const isLogin = async (req, res, next) => {
    try {
        
        const token = req.cookies.jwt;
        
        if (!token) {
            console.log('No JWT token found in cookies');
            return res.status(401).send({ success: false, message: "User Unauthorized - No token" })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
       
        
        if (!decode) {
            return res.status(401).send({ success: false, message: "User Unauthorized - Invalid token" })
        }

        const user = await User.findById(decode.userId).select("-password");
      
        
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" })
        }
        
        req.user = user;
        
        next()
    } catch (error) {
        console.log(`Error in isLogin middleware: ${error.message}`);
        res.status(500).send({
            success: false,
            message: error.message
        })
    }
}