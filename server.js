import http from 'http';
import {Server} from 'socket.io';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

import connectDB from './src/db/db-cnn.js';
import User from'./src/db/models/users.js';
import messagesModel from './src/db/models/messages.js';

import dotenv from 'dotenv';
dotenv.config();


//routes
import renderDashboard_route from './src/routes/dashboard_render_routes.js';
import login_route from './src/routes/login_routes.js';
import signup_route from './src/routes/signup_routes.js';
import loadChat_route from './src/routes/load_chat_route.js';

//middlewares
import protect from './src/middlewares/protected.js' ;


//services
import writeMsg from './src/services/write_msg.js';



const JWT_SECRET = process.env.JWT_SECRET;
const port= process.env.PORT;

// These two lines replace the old __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

//  //Now this will work:
//  console.log(__dirname);           // prints the directory path of current file
//  console.log(__filename);          // prints full path to current file


const app = express();
connectDB();

//---------------server-------------------------------------------
const Myserver = http.createServer(app);                        // return an instance of server


    
const io = new Server(Myserver, {
    cors: {
        origin: "*",           // ← change this in production!
        methods: ["GET", "POST"]
    }
    
});

//-----------------------------jwt atuh habdling (middlewhare)------------------------------------------------

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//     });
// };








//-------------------------------express Middleware handling--------------------------------------------


// Add these two lines
app.use(express.json());          // ← parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));  // ← optional but useful (for form data)

// serving static file's
app.use(express.static("public"));





//--------------------------------------Routes--------------------------------------

// ================= / ===================
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','login.html'));
});



// =============== login ==================

app.post('/api/login',login_route);



//============= signup ==============

app.post('/api/Signup',signup_route);



//============== loading user dashboard protected =====================

app.get('/onbording/dashboard',protect,renderDashboard_route);



//============== load chats for a perticular user =====================

//  body - fetChat={
//         senderid:currenUser.dataset.userrid.trim(),
//         receiverid:connectedUser.dataset.ruserrid.trim()
//     }

app.post('/user/loadchat',protect,loadChat_route);


//------------------ Socket.io handling  -------------------------------------

io.use((socket,next)=>{
    const token = socket.handshake.auth.token

    if (!token) return next(new Error("Authentication required"));

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return next(new Error("Invalid token"));
        socket.user = decoded;   // { userId, name }
        next();
    });
});

// online users hendling
const onlineUsers = new Map();

// When a user connects
io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    onlineUsers.set(socket.user.uId, socket.id);    // later bind it with uId insted name 

    console.log(onlineUsers);

    
    
    // Listen for "privat" from this client
    socket.on("privat", (msg) => {


        // const emitmsg ={
        //             receiveriid: rid,
        //             context: msginp.value,
        //             senderiid: sid
        //         }




        console.log("Server hearing msg");
        console.log(msg);
        console.log(onlineUsers.get(msg.senderiid));

        //writing it to db
        writeMsg(msg);

        //

        io.to(onlineUsers.get(msg.receiveriid)).emit('privat',msg);

    });


    //handling 'disconnect'
    socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.id}`);
        
    });
    
});




// --------------------------------server listens at port------------------------
Myserver.listen(port,()=>{
    console.log('server started ')
});