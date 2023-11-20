import express from "express";
import dotenv from "dotenv";
import  chats from "./data/dummydata.js";
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
const app = express();

app.use(cors());


app.get("/", (req,res) =>{
    res.send("<h1>Yeah!</h1>");
});

app.get("/api/chat", (req,res) =>{
    res.send(chats);
});

app.get("/api/chat/:id", (req,res)=>{
    const reqChat = chats.find((i) => i._id === req.params.id);
    console.log(reqChat);
    res.send(reqChat);
});

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Server is running at port ${port}`);
})