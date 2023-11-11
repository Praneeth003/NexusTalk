import express from "express";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req,res) =>{
    res.send("<h1>Yeah!</h1>");
});

const port = process.env.PORT ;
app.listen(port, () =>{
    console.log(`Server is running at port ${port}`);
})