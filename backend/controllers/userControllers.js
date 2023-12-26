import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";


async function registerUser(req,res){
    const {name, email, password, profilepic} = req.body;
    if(!name || !email || !password){
        res.status(400);
        res.send("Please fill all fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        res.send("User already exists");
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
        res.send("Failed to create user");
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
        res.send("Invalid Email or Password");
    }
}
// We can search either by name or email
const allUsers = async(req,res) => {
    const keyword = req.query.search
    ? {
        $or: [
            {name: {$regex: req.query.search, $options: "i"}},
            {email: {$regex: req.query.search, $options: "i"}},
        ],
    }
    : {};
   const users = await User.find(keyword).find({_id: {$ne: req.user_id}}); 
   res.send(users);
};

export {registerUser, authUser, allUsers};