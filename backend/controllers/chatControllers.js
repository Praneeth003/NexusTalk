import Chat from "../models/chatModel.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const accessChat = asyncHandler(async(req,res) =>{
    // User Id of the second user with whom the chat is needed has to be sent in the body of the request
    const {userId} = req.body;
    if(!userId){
        console.log("UserId param is not present in the request");
        return res.sendStatus(400);
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        // These user ids correspond to the loggedin user(user._id) and the provied user(userId)
        $and: [
            {users: {$elemMatch: {$eq: req.user._id}}},
            {users: {$elemMatch: {$eq: userId }}},
        ]
    }).populate("users", "-password").populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name profilepic email"
    });
    if(isChat.length > 0){
        res.send(isChat[0]);
    }else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try{
            const createdChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({_id: createdChat._id}).populate("users", "-password").populate("latestMessage");
            res.status(200).send(fullChat);
        }catch(error){
            res.status(400);
            res.send(error.message);
        }
    }
});

const fetchChats = asyncHandler(async(req,res) =>{
    try{
        const chats = await Chat.find({users: {$elemMatch: {$eq: req.user._id}}}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password").sort({updatedAt: -1});
        const chatsWithMessages = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name profilepic email"
        });
        res.status(200).send(chatsWithMessages);
    }catch(error){
        res.status(400);
        res.send(error.message);
    }
});

const createGroupChat = asyncHandler(async(req,res) =>{
    if(!req.body.users || !req.body.name){
        console.log("Users and name params are required");
        return res.status(400).send({message: "Users and group name are required"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        console.log("Group chat must have atleast 2 users");
        return res.status(400).send({message: "Group chat must have atleast 2 users"});
    }
    // Add the logged in user as well to the group
    users.push(req.user._id);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user._id
        });
        const fullChat = await Chat.findOne({_id: groupChat._id}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
        res.status(200).send(fullChat);
    }
    catch(error){
        res.status(400);
        res.send(error.message);
    }
});

const renameGroupChat = asyncHandler(async(req,res) =>{
    if(!req.body.chatId || !req.body.name){
        console.log("ChatId and name params are required");
        return res.sendStatus(400).send({message: "ChatId and name params are required"});
    }
    else{
    try{
        const chat = await Chat.findOneAndUpdate({_id: req.body.chatId}, {chatName: req.body.name}, {new: true}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
        res.status(200).send(chat);
    }catch(error){
        res.status(400);
        res.send(error.message);
    }
    }
});

const addUserToGroup = asyncHandler(async(req,res) =>{
    if(!req.body.chatId || !req.body.userId){
        console.log("ChatId and userId params are required");
        return res.status(400).send({message: "ChatId and userId params are required"});
    }
    try{
        const chat = await Chat.findOne({_id: req.body.chatId});
        if(chat.groupAdmin.toString() !== req.user._id.toString()){
            console.log("Only the group admin can add users to the group");
            return res.status(400).send({message: "Only the group admin can add users to the group"});
        }
        const user = await User.findOne({_id: req.body.userId});
        if(!user){
            console.log("User not found");
            return res.status(400).send({message: "User not found"});
        }
        if(chat.users.includes(req.body.userId)){
            console.log("User is already present in the group");
            return res.status(400).send({message: "User is already present in the group"});
        }
        chat.users.push(req.body.userId);
        await chat.save();
        const fullChat = await Chat.findOne({_id: req.body.chatId}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
        res.status(200).send(fullChat);
    }catch(error){
        res.status(400);
        res.send(error.message);
    }
});

const removeUserFromGroup = asyncHandler(async(req,res) =>{
    if(!req.body.chatId || !req.body.userId){
        console.log("ChatId and userId params are required");
        res.status(400).send({message: "ChatId and userId params are required"});
    }
    else{
        try{
            const chat = await Chat.findOne({_id: req.body.chatId});
            if(chat.groupAdmin.toString() !== req.user._id.toString()){
                console.log("Only the group admin can remove users from the group");
                return res.status(400).send({message: "Only the group admin can remove users from the group"});
            }
            if(chat.groupAdmin.toString() === req.body.userId.toString()){
                console.log("Group admin cannot be removed from the group");
                return res.status(400).send({message: "Group admin cannot be removed from the group"});
            }

            if(chat.users.length < 3){
                console.log("Group chat must have atleast 2 users");
                return res.status(400).send({message: "Group chat must have atleast 2 users"});
            }
            const user = await User.findOne({_id: req.body.userId});
            if(!user){
                console.log("User not found");
                return res.status(400).send({message: "User not found"});
            }
            if(!chat.users.includes(req.body.userId)){
                console.log("User is not present in the group");
                return res.status(400).send({message: "User is not present in the group"});
            }
            chat.users = chat.users.filter((id) => id.toString() !== req.body.userId.toString());
            await chat.save();
            const fullChat = await Chat.findOne({_id: req.body.chatId}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
            return res.status(200).send(fullChat);
        }catch(error){
            res.status(500).send(error.message);
        }
    }
});

const leaveGroup = asyncHandler(async(req,res) =>{
    if(!req.body.chatId){
        console.log("ChatId param is required");
        res.status(400).send({message: "ChatId param is required"});
    }
    else{
        try{
            const chat = await Chat.findOne({_id: req.body.chatId});
            if(chat.groupAdmin.toString() === req.user._id.toString()){
                await Chat.deleteOne({_id: req.body.chatId});
                return res.status(200).send({message: "Group has been deleted"});

            }
            // if(chat.users.length < 3){
            //     console.log("Group chat must have atleast 2 users");
            //     return res.status(400).send({message: "Group chat must have atleast 2 users"});
            // }
            if(!chat.users.includes(req.user._id)){
                console.log("User is not present in the group");
                return res.status(400).send({message: "User is not present in the group"});
            }
            chat.users = chat.users.filter((id) => id.toString() !== req.user._id.toString());
            await chat.save();
            const fullChat = await Chat.findOne({_id: req.body.chatId}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
            return res.status(200).send(fullChat);
        }catch(error){
            res.status(400);
            res.send(error.message);
        }
    }
}
);



export {accessChat, fetchChats, createGroupChat, renameGroupChat, addUserToGroup, removeUserFromGroup, leaveGroup};