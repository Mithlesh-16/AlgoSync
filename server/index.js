const express = require('express')
const http = require('http')
const {Server} = require('socket.io')
const cors = require('cors')
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json())

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req, res) => {
    res.send("AlgoSync Server is Running..!")
});

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('join_room', (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room : ${roomId}`);
    })

    socket.on('code_change', ({roomId, code}) => {
        socket.to(roomId).emit('recieve_code', code);
    })

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});