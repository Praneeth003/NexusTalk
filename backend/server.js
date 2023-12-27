import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js"; 
import chatRoutes from "./routes/chatRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
import {notFound, errorHandler} from "./middleware/errorMiddleware.js";
import messageRoutes from "./routes/messageRoutes.js";
import {Server} from "socket.io";
import http from "http";
import path from "path";

dotenv.config();
connectDB();
const app = express();

//Middleware to enable CORS
app.use(cors());

//Middleware to parse incoming JSON data
app.use(express.json());





app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

//Deployment code
const __dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    }
    );
}
// else{
//     app.get('/', (req, res) => {
//         res.send('API is running...');
//     });
// }


app.use(notFound);
app.use(errorHandler); 

const port = process.env.PORT;

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

io.on("connection", (socket) => {
    console.log("Connected to a Socket.IO server");
    // Create a new chat room for the user
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });
    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room);
    });
    socket.on('new message', (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if(user._id == newMessageReceived.sender._id) return;
            socket.in(user._id).emit('message received', newMessageReceived);
        });
    });
});

