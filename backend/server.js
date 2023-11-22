import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; 
import cors from "cors";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();
const app = express();

//Middleware to parse incoming JSON data
app.use(express.json());

app.use(cors());


app.get("/", (req,res) =>{
    res.send("<h1>Yeah!</h1>");
});

app.use('/api/user', userRoutes)

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Server is running at port ${port}`);
})