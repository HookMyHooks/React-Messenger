const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const pool = require('./db'); // Import the database connection

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

function PasswordHash(passString) {
  let len = passString.length;
  let h = 0;
  for (let i = 0; i < len; i++) {
    h = 33 * h + passString.charCodeAt(i); // Use charCodeAt to get the Unicode value
  }
  return h;
}

// Track connected clients
const connectedClients = [];

// Handle Socket Connections
io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user registration or login via socket
  const addClient = (username) => {
    // Check if the user is already connected
    if (!connectedClients.some(client => client.username === username)) {
      connectedClients.push({ id: socket.id, username });
      io.emit('clientsUpdated', connectedClients); // Notify all clients
    }
  };

  socket.on('register', (username) => {
    addClient(username);
  });

  socket.on('login', (username) => {
    addClient(username);
  });

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove client from the list
    const index = connectedClients.findIndex(client => client.id === socket.id);
    if (index !== -1) {
      connectedClients.splice(index, 1);
      io.emit('clientsUpdated', connectedClients); // Notify all clients
    }
  });
});

//***** ROUTES *****\\

// Login route
app.post('/login', async (req, res) => {
  let { username, password } = req.body;
  console.log("post method accessed");

  try {
    password = PasswordHash(password);
    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2;', [username, password]);
    if (result.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Register Route
app.put('/register', async (req, res) => {
  let { username, password } = req.body;
  console.log("register route called");

  try {
    password = PasswordHash(password);

    // Check if the username already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Insert the new user into the database
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;', [username, password]);

    if (result.rows.length > 0) {
      res.json({ success: true, message: 'User registered successfully' });
    } else {
      res.json({ success: false, message: 'Registration failed' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Endpoint to get connected clients
app.get('/clients', (req, res) => {
  res.json({ clients: connectedClients });
});

//***** END ROUTES ******\\

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
