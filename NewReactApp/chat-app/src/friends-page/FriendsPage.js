import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import FriendsList from '../friend-component/friend-component';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://192.168.0.107:5000'); // Your server URL

const FriendsPage = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
    
    // Emit userId when the user joins
    const userId = decodedToken.userId;
    
    socket.emit('join', userId);

    // Listen for connected users
    socket.on('usersConnected', (users) => {
      setConnectedUsers(users);
    });
  }
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>Connected Users</h2>
      <ul>
        {connectedUsers.map((user) => (
          <li key={user}>{user}</li>
        ))}
      </ul>


      <h2>Friends List</h2>
      <FriendsList></FriendsList>
    </div>
  );
};

export default FriendsPage;
