import jwt from "jsonwebtoken";
import User from "../models/userModel.js";


const protect = async(req,res, next) =>{
    let token = req.headers.authorization.split(" ")[1];

     if(!token){
        res.status(401);
        return res.status(401).json({ message: 'Authorization token is missing' });
    }

    try{
        //Decoding token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        req.user = await User.findById(decoded.id).select("-password");
        next();
    }catch(error){
        res.status(401);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
    
   
};

export {protect};


