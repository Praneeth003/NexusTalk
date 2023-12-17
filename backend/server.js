import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();
connectDB();
const app = express();


//Middleware to parse incoming JSON data
app.use(express.json());

app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler); 

const port = process.env.PORT;
app.listen(port, () =>{
    console.log(`Server is running at port ${port}`);
})