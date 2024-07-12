//Imports
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

//EndImports


//Initialize
const app = express();
app.use(cors());
app.use(express.json());


/*
// Example of a GET route to fetch messages
app.get('/messages', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
*/

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


/*
// index.js

const express = require('express');
const pool = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies




// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
*/
