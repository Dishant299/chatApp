import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/user.js';
import messageRouter from './routes/messageRoute.js';
import { Server  } from 'socket.io';

const app = express(); 
const server = http.createServer(app); 

//initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

//store online users
export const userSocketMap = {}; //{user._id: socketId}

//socket.io connection handler
io.on('connection',(socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User connected",userId);

    if(userId) userSocketMap[userId] = socket.id;

    // Emit online users to all connected clients
    io.emit('getOnlineUsers',Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("user disconnected",userId);
        delete userSocketMap[userId];
        io.emit('getOnlineUsers',Object.keys(userSocketMap));
    })
})

//middleware
app.use(express.json({limit:"4mb"}));
app.use(cors());

//route
app.use('/api/status', (req,res) => res.send('server is live'));
app.use('/api/auth',userRouter);
app.use('/api/messages',messageRouter);


const PORT = process.env.PORT || 4000;

// connect mongodb
await connectDB();

server.listen(PORT, () => console.log('server is running on PORT: ' + PORT)); 


