const express  = require('express');
const app  = express();
const http =require('http');
const cors = require("cors");
const {Server} = require("socket.io");
const { constants } = require('fs');

app.use(cors());

const users=[];

const server = http.createServer(app);
const PORT = process.env.PORT || 3001;
const io = new Server(server , {
    cors : {
        origin: "*",
        methods : ["GET","POST"],
    },
});

io.on("connection" , (socket)=>{
    console.log(`User Connected : ${socket.id}`);

    socket.on("join_room", (data) =>{
        const exist = users.find((user) => (user.room === data.room && user.username === data.username));       // finding from whole array so mapping it
        if (exist) {
            console.log(exist);
            console.log("Username already exist");
            // callback({error: 'Username already exist :/'});
            return;
        }
        // console.log(exist);
        users.push({id:socket.id,room:data.room,username:data.username});
        socket.join(data.room);
        console.log(`User with ID: ${socket.id} joined room: ${data.room}`);
    });

    socket.on("send_message", (data) => {
        const exist = users.find((user) => (user.id === socket.id));       // finding from whole array so mapping it
        if (exist) {
            socket.to(data.room).emit("receive_message",data);
        }
    });
    socket.on("disconnect", ()=>{
        const lol = users.findIndex((user) => (user.id === socket.id));

        if (lol !== -1) {
            users.splice(lol, 1)[0];
            console.log('Deleted');
        }
        console.log("User Disconnected",socket.id);
    });
});

server.listen(PORT, () => console.log("server started on https://localhost:3001"));