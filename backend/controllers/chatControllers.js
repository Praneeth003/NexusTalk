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

export {accessChat, fetchChats};