import asyncHandler from 'express-async-handler';
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";
import Chat from "../models/chatModel.js";



const sendMessage = asyncHandler(async(req,res) =>{
    const {content, chatId} = req.body;
    if(!content || !chatId){
        console.log("No message or chat id");
        return res.sendStatus(400);
    }
    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId
    };
    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender", "name profilePic")
        message = await message.populate("chat")
        message = await User.populate(message, {path: "chat.users", select: "name email profilePic"});
        await Chat.findByIdAndUpdate(chatId, {latestMessage: message});
        res.status(201).send(message);
    }catch(error){
        console.log(error);
        res.status(400);
    }
});


export {sendMessage};