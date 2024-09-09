import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const socket = io('http://192.168.0.107:5000'); // Your server URL

const FriendChatPage = () => {
  // Create a state variable `messages` to hold the chat messages and a function `setMessages` to update it
  const [messages, setMessages] = useState([]);
  const { friendId } = useParams();


// Join a room with the friend when starting a conversation
  const joinRoom = () => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
    
    // Emit userId when the user joins
    const userId = decodedToken.userId;
    
    const roomInfo = { userId, friendId };
    console.log(`User ${userId} with ${friendId}`);
  
    socket.emit('joinRoom', roomInfo);  // Tell the server to join the room
    }
  };
  
  // Function to fetch messages from the server
  /*const fetchMessages = async (friendId) => {

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/messages?friendId=${friendId}`,{
            headers:{'Authorization': `Bearer ${token}`,}
      }
        
      );
      const data = await response.json();
      setMessages(data);  // Update the messages state with the data from the server
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };*/
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/messages?friendId=${friendId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
  
      // Check if the response status is OK (status 200)
      if (!response.ok) {
        // Log the entire response for debugging
        const errorText = await response.text();  // Get the raw response as text
        console.error(`Error fetching messages: ${response.status} ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
  
      // Parse the JSON response
      const data = await response.json();
      setMessages(data);  // Update the messages state with the data from the server
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  
  // Automatically fetch messages when the component loads or when friendId changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
    
    // Emit userId when the user joins
    const userId = decodedToken.userId;
    
    const roomInfo = { userId, friendId };
    console.log(`User ${userId} with ${friendId}`);
  
    socket.emit('joinRoom', roomInfo);  // Tell the server to join the room
    }
    fetchMessages(friendId);
  }, [friendId]);
  
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
        <div key={index} className={msg.senderId === localStorage.getItem('userId') ? 'my-message' : 'friend-message'}>
          <p>{msg.content}</p>
          <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
        </div>
      ))}
      {/* Other UI for sending messages */}
    </div>
  );
};

export default FriendChatPage;
