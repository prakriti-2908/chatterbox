const express = require('express');
const clc = require('cli-color');
const { Server } = require('socket.io');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

// variables
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    }
});

app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
    })
);

io.on('connection', (socket) => {
    // console.log(`Socket is connected : ${socket.id}`);

    socket.emit('welcome', "welcome to the server");

    // socket.broadcast.emit('joineNotification', socket.id);

    socket.on('disconnected', ({msg,room}) => {
        // console.log(room);
        socket.to(room).emit('leftNotification', msg);
    });

    socket.on('message', ({ msg, room, name }) => {
        // console.log(msg, name, socket.id);
        socket.to(room).emit("receive-message", { msg, name });
    });

    socket.on('join-room', ({ room, msg, name }) => {
        socket.join(room);
        socket.to(room).emit("receive-message", { msg, name });
    });
});


app.get('/', (req, res) => {
    return res.send("Server is listening");
});

server.listen(PORT, () => {
    console.log(clc.yellowBright("SERVER is listening on :"));
    console.log(clc.yellowBright(`http://localhost:${PORT}`));
});
