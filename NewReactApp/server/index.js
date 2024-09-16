const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const pool = require('./db'); // Import the database connection
const jwt = require('jsonwebtoken');

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
let connectedUsers = {};



// Handle Socket Connections
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('message', (message) => {
    io.emit('message', message);
  });


  socket.on('joinRoom', ({ userId, friendId }) => {
    // Create a room with a unique name based on the user IDs
    const room = [userId, friendId].sort().join('-');  // Create a room ID based on user IDs
    socket.join(room);
    console.log(`User ${userId} joined room ${room}`);
  });

  // Handle sending a message to a specific room
    socket.on('message', (message) => {
    const { senderId, receiverId, username, content } = message;
    const room = [senderId, receiverId].sort().join('-'); // Ensure the room name is consistent
    const messageWithUsername = { ...message, username };
    io.to(room).emit('message', messageWithUsername);
  });


  //Handle User On-Connect
  socket.on('join',(username) =>
  {
    connectedUsers[username] = socket.id; // Map userId to socket.id
    console.log(connectedUsers);
    io.emit('usersConnected', Object.keys(connectedUsers)); // Send the updated list of connected users to all clients
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    for(const [userId,socketId] of Object.entries(connectedUsers))
    {
      if(socketId==socket.id)
      {
        delete connectedUsers[userId];
        break;
      }
    }
    io.emit('usersConnected', Object.keys(connectedUsers)); // Send the updated list of connected users to all clients

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

    const result = await pool.query('SELECT * FROM users u WHERE u.username = $1 AND u.password = $2;', [username, password]);
    console.log('Query result:', result.rows);

    if (result.rows.length > 0) {
      const token = jwt.sign({
        userId: result.rows[0].id_user,
        username: result.rows[0].username 
      }, SECRET_KEY, { expiresIn: '2h' });
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
    const newPassword = PasswordHash(password);

    // Check if the username already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1;', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Insert the new user into the database
    const result = await pool.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;', [username, newPassword]);
    
    if (result.rows.length > 0) {
      console.log("ye");
      console.log(result.rows[0]);
      const token = jwt.sign({
        userId: result.rows[0].id_user,
        username: result.rows[0].username 
      }, SECRET_KEY, { expiresIn: '2h' });
      res.json({ success: true, message: 'User registered successfully' , token});

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


app.put('/api/messages',verifyToken,async(req,res) =>{
  const {text,receiverId} = req.body;
  const userId = req.user.userId;
  console.log(text);
  if (!text) {
    return res.status(400).json({ success: false, message: 'Message text is required' });
  }

  try{
    const result = await pool.query(
      'INSERT INTO individual_messages (id,sender_id,receiver_id,content,timestamp) VALUES (DEFAULT,$1,$2,$3,DEFAULT) RETURNING *',
      [userId,receiverId,text]
    );
    res.status(200).json({
      success: true,
      message: 'Message sent', 
      messageId:result.rows[0].id,
    });
  }catch(err){
    console.error('Db error:', err);
    res.status(500).json({
      success: false, 
      message:'Server error'
    });
  }

});


app.post('/api/messages', verifyToken, async (req, res) => {
  const userId = req.user.userId;  // Assuming user is authenticated
  const { friendId } = req.body;
  if (!friendId) {
    return res.status(400).json({ success: false, message: 'Friend ID is required' });
  }
  console.log("messages method called");

  try {
    const messages = await pool.query(`
      SELECT 
        m.id, 
        u1.username AS sender_username, 
        u2.username AS receiver_username, 
        m.content, 
        m.timestamp
      FROM 
        individual_messages m
      JOIN 
        users u1 ON m.sender_id = u1.id_user
      JOIN 
        users u2 ON m.receiver_id = u2.id_user
      WHERE 
        (m.sender_id = $1 AND m.receiver_id = $2)
        OR (m.sender_id = $2 AND m.receiver_id = $1)
      ORDER BY 
        m.timestamp ASC
    `, [userId, friendId]);

    if (messages.rows.length === 0) {
      return res.json([]);  // Return an empty array if there are no messages
    }

    res.json(messages.rows);  // Return the messages as JSON
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ success: false, message: 'Server error fetching messages' });
  }
});


//Add friend
app.post('/addFriend', verifyToken, async (req, res) => {
  const friendName  = req.body.username;
  const userId = req.user.userId; 
  console.log("addFriend method called: ", friendName);
  try {
    const findFriendId = await pool.query(
      'SELECT id_user FROM users WHERE username = $1;'
    ,[friendName]);

    if(findFriendId.rows.length > 0)
    {
      const friendId = findFriendId.rows[0].id_user;

      const result  = await pool.query(
        `INSERT INTO friends (user_id, friend_id,status) VALUES
        ($1,$2,'pending') 
        RETURNING *;`
      ,[userId, friendId]);

      if(result.rows.length > 0)
      {
        const message = "Friend Added";
        console.log(message);
        res.status(200).json({success: true, message: message});
      }
      else{
        res.status(501).json({success: false, message: "Server query error"});
      }
    }
    else{
      console.log("User not found");
      res.status(502).json({success:false, message:"User not found?"});
    }
  } catch (err) {
    console.error('Error adding friend:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});




//Accept friend
app.post('/friend/accept', verifyToken, async (req, res) => {
  const friendName = req.body.username;
  const userId = req.user.userId;

  console.log("friend/accept friendname:", friendName)

  try {
    const findFriendId = await pool.query(
      'SELECT id_user FROM users WHERE username = $1;'
    ,[friendName]);


    if(findFriendId.rows.length>0)
    {
      const result = await pool.query(
        'UPDATE friends SET status = $1 WHERE user_id = $2 AND friend_id = $3 RETURNING *;',
        ['accepted', findFriendId.rows[0].id_user , userId]
        );
     
        if(result.rows.length > 0 )
        {
          res.status(200).json({success: true, message: 'friend accepted'})
        }
        else
        {
          res.status(500).json({success:false, message:`Couldnt update to 'accepted' state`})
        }
     }    
     else
     {
      res.status(501).json({success:false, message: `Couldnt find user`});
     }

  } catch (err) {
    console.error('Error accepting friend:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



//List Pending Requests
app.get('/friend/friendRequests', verifyToken, async(req,res) =>{

  const userId = req.user.userId; 
  console.log("friend requests method called: ");
try{
      const result  = await pool.query(
        `SELECT f.*, u.username 
         FROM friends f 
         JOIN users u ON f.user_id = u.id_user 
         WHERE f.friend_id = $1 AND f.status = 'pending'; `
      ,[userId]);

      if(result.rows.length > 0)
      {
        const message = "Friend Requests Found!";
        console.log(message, result.rows);
        res.status(200).json({success: true, message: message, pendingRequests: result.rows});
      }
      else{
        res.status(401).json({success: true, message: "There are no requests", pendingRequests: []});
      }
    
  } catch (err) {
    console.error('Error adding friend:', err);
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
      const query = await pool.query(
        'SELECT u.id_user, u.username FROM users u ' +
      'JOIN friends f ON (u.id_user = f.user_id) ' +
      `WHERE f.friend_id = $1 AND f.status = 'accepted';`,
      [userID]);

      // Combine the results from both queries
    const friendsList = [...result.rows, ...query.rows];

    if (friendsList.length > 0) {
      res.status(200).json({ success: true, message: "Found friends", friends: friendsList });
    } else {
      res.status(200).json({ success: true, message: "No friends found", friends: [] });
    }

  } catch (err) {
    console.error('Error retrieving friends:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



app.get('/api/users/:friendId',async(req,res)=>{
  const {friendId} = req.params;
  console.log('api/users/id called');
  try{
    const result = await pool.query(
      'SELECT username from users where id_user = $1',[friendId]
    );
    if(result.rows.length ===0)
      return res.status(404).json({
        success:false,
        message: 'Friend user not found'
      });
      console.log(result.rows[0].username);
    res.json({username:result.rows[0].username}) 
  }catch(err)
  {
    console.error('Error fetching username:', err);
    res.status(500).json({ success: false, message: 'Server error fetching username' });
  }
})



//***** END ROUTES ******\\

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
