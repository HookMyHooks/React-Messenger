import './friend-component.css';




import React, { useState, useEffect } from 'react';

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    console.log('Fetching friends...');
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://192.168.0.107:5000/friends', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log('Friends data:', data);
        if (response.ok) {
          setFriends(data.friends);
        } else {
          console.error('Error fetching friends:', data.message);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchFriends();
  }, []);

  if (friends.length === 0) {
    return <div>No friends to display.</div>;
  }

  return (
    <div>
      
      {friends.map((friend) => (
        <div key={friend.user_id} className="friend-card">
          
          <div>{friend.username}</div>
        </div>
      ))}
    </div>
  );
};

export default FriendsList;