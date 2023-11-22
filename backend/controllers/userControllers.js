import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";

async function registerUser(req,res){
    const {name, email, password, profilepic} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new Error("Please enter all the required fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        profilepic
    });
    if(user){
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilepic,
            token: generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("Failed to create user");
    }
}

async function authUser(req,res){
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user && (await user.matchPassword(password))){
         res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            profilepic: user.profilepic,
            token: generateToken(user._id),
        });
    }else{
        res.status(400);
        throw new Error("Incorrect email or password");
    }
}

export {registerUser, authUser};