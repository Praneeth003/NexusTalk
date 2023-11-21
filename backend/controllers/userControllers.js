import User from "../models/userModel"

async function registerUser(req,res){
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        res.status(400);
        throw new error("Please enter all the required fields");
    }

    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
        profilepic
    });
    if(user){
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            profilepic: user.profilepic,
        });
    }else{
        res.status(400);
        throw("Failed to create user");
    }

    }

export default registerUser;