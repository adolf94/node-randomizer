const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const {Server} = require("socket.io");
const io =new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
} )
const cors = require('cors')
const chatSocket = require("./chatSocket")


app.use(cors())

app.get('/', (req, res) => { 
  res.send("Test")
});

io.on('connection', (socket) => {
  console.log('a user connected');
  chatSocket(socket,io);
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});