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
            throw new Error(error.message);
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
        throw new Error(error.message);
    }
});

const createGroupChat = asyncHandler(async(req,res) =>{
    if(!req.body.users || !req.body.name){
        console.log("Users and name params are required");
        return res.sendStatus(400).send({message: "Users and group name are required"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        console.log("Group chat must have atleast 2 users");
        return res.sendStatus(400).send({message: "Group chat must have atleast 2 users"});
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
        throw new Error(error.message);
    }
});

const renameGroupChat = asyncHandler(async(req,res) =>{
    if(!req.body.chatId || !req.body.name){
        console.log("ChatId and name params are required");
        return res.sendStatus(400).send({message: "ChatId and name params are required"});
    }
    try{
        const chat = await Chat.findOneAndUpdate({_id: req.body.chatId}, {chatName: req.body.name}, {new: true}).populate("users", "-password").populate("latestMessage").populate("groupAdmin", "-password");
        res.status(200).send(chat);
    }catch(error){
        res.status(400);
        throw new Error(error.message);
    }
});



export {accessChat, fetchChats, createGroupChat, renameGroupChat};