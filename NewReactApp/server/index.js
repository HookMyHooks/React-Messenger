//Imports
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
//EndImports


//Initialize
const app = express();
app.use(cors());


//Http server and Socket.IO instance
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});


//Handle Socket Connections
io.on('connection', (socket) => {
  console.log('New client connected'); //socket = new connected client
  
  //handle message event
  socket.on('message', (message) => {
    io.emit('message', message); //broadcasts the received message to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


//Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
