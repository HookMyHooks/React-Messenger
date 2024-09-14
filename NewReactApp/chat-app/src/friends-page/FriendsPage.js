import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import FriendsList from '../friend-component/friend-component';
import { jwtDecode } from 'jwt-decode';
import "./FriendsPage.css"
import { useNavigate } from 'react-router-dom';

const socket = io('http://192.168.0.107:5000'); // Your server URL

const FriendsPage = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleAddFriendClick = (user) => {
    setSelectedUser(user); // Set the selected user
  };

  // Function to close the pop-up
  const closePopup = () => {
    setSelectedUser(null); // Reset selected user to null
  };

  const clickAddFriend =() => {

  }


  useEffect(()=>{
    const token = localStorage.getItem('token');
    var decodedToken = null;
    if (token) {
      decodedToken = jwtDecode(token);
    }
    const index = connectedUsers.indexOf(decodedToken.username);
    if (index > -1) { // only splice array when item is found
      connectedUsers.splice(index, 1); // 2nd parameter means remove one item only
    }    // Listen for connected users
  })

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token on friends page:', decodedToken);
    
    // Emit userId when the user joins
    const user = decodedToken.username;
    
    socket.emit('join', user);
  }
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(()=>{
    socket.on('usersConnected', (users) => {
      setConnectedUsers(users);
    });
    

  });

useEffect(()=>{
  console.log(connectedUsers)
})


  return (
    <div>
      <h2>Connected Users</h2>
      <ul>
        {connectedUsers.map((user) => (
          <li key={user}>
            {user}
            <button onClick={() => handleAddFriendClick(user)}>Add Friend</button>
            </li>
        ))}
      </ul>



      {selectedUser && (
        <AddFriendPopup user={selectedUser} onClose={closePopup} onAdd={clickAddFriend} />
      )}

      <h2>Friends List</h2>
      <FriendsList></FriendsList>
    </div>
  );
};



function AddFriendPopup({ user, onClose, onAdd}) {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Add {user} as a friend?</h3>
        <button onClick={onAdd}>
          Add Friend
        </button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default FriendsPage;
