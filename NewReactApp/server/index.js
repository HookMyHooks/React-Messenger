const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const jwt = require('jsonwebtoken')

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

const SECRET_KEY = 'your_jwt_secret_key'; // Secret key for JWT

// Handle Socket Connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});


// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Received token:', token); // Log the token
  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    console.log('Decoded token on server:', decoded); // Log the decoded token
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error); // Log the error details
    return res.status(401).json({ message: 'Invalid token' });
  }
};

//***** ROUTES *****\\


// Login route
app.post('/login', async (req, res) => {
  let { username, password } = req.body;
  console.log("Login post method accessed");
  console.log(`Received username: ${username}, password: ${password}`);

  try {
    password = PasswordHash(password);
    console.log(`Hashed password: ${password}`);

    const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2;', [username, password]);
    console.log('Query result:', result.rows);

    if (result.rows.length > 0) {
      const token = jwt.sign({
        userId: result.rows[0].id_user,
        username: result.rows[0].username 
      }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//Register Route

app.put('/register', async(req,res) =>
{
  let {username,password} = req.body;
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




// Protected route example
app.get('/messages', verifyToken, async (req, res) => {
  console.log("GET /messages accessed");
  try {
    const result = await pool.query('SELECT * FROM messages;');
    console.log('Query result:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



app.put('/messages', verifyToken, async (req, res) => {
  const { text } = req.body; // Destructure to extract the text from req.body
  console.log(text);
  if (!text) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO messages (text) VALUES ($1) RETURNING id;',
      [text]
    ); 
    
    res.status(200).json({
      success: true,
      message: 'Message inserted into table',
      messageId: result.rows[0].id, // Return the ID of the inserted message
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//Add friend
app.post('/friends', verifyToken, async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId; 

  try {
    const result = await pool.query(
      'INSERT INTO friends (user_id, friend_id, status) VALUES ($1, $2, $3) RETURNING *;',
      [userId, friendId, 'pending']
    );
    res.status(200).json({ success: true, friendRequest: result.rows[0] });
  } catch (err) {
    console.error('Error adding friend:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




//Accept friend
app.put('/friends/accept', verifyToken, async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      'UPDATE friends SET status = $1 WHERE user_id = $2 AND friend_id = $3 RETURNING *;',
      ['accepted', friendId, userId]
    );
    res.status(200).json({ success: true, friend: result.rows[0] });
  } catch (err) {
    console.error('Error accepting friend:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




//List friends
app.get('/friends', verifyToken, async (req, res) => {
  const userID = req.user.userId;
  console.log(userID);

  try {
    const result = await pool.query(
      'SELECT u.id_user, u.username FROM users u ' +
      'JOIN friends f ON (u.id_user = f.friend_id) ' +
      'WHERE f.user_id = $1 AND f.status = $2;',
      [userID, 'accepted']
    );
    
    res.status(200).json({ success: true, friends: result.rows });
  } catch (err) {
    console.error('Error retrieving friends:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




//***** END ROUTES ******\\

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
