import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import FriendChatClient from '../chat-component/friendChat-client';

const socket = io('http://192.168.0.107:5000'); // Your server URL

const FriendChatPage = () => {
  // Create a state variable `messages` to hold the chat messages and a function `setMessages` to update it
  const [messages, setMessages] = useState([]);
  const { friendId } = useParams();
  const [currentUser, setCurrentUser] = useState('');
  const [targetUser,setTargetUser] = useState('');
  


  const fetchMessages = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://192.168.0.107:5000/api/messages`, {
        method: 'POST',  
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ friendId })  // Send friendId in the request body
      });
  
      // Check if the response status is OK (status 200)
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error fetching messages: ${response.status} ${errorText}`);
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
  
      const data = await response.json();  // Parse the JSON response
      
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
      
        // Emit userId when the user joins
        const userId = decodedToken.userId;
        const roomInfo = { userId, friendId };
        console.log(`User ${userId} with ${friendId}`);
      
        socket.emit('joinRoom', roomInfo);  // Tell the server to join the room
        setCurrentUser(decodedToken.username);


      const fetchUsername = async () => {
       try {
          const response = await fetch(`http://192.168.0.107:5000/api/users/${friendId}`);
        
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const data = await response.json();
          setTargetUser(data.username);  // Set the fetched username
        } catch (err) {
          console.log('Error', err) // Set error if any
        }
      };
      
      fetchUsername();
     
      fetchMessages(friendId);
    

    }
  }, [friendId]);
  
  useEffect(() => {
    console.log(`Current User: ${currentUser}`);
    console.log(`Target User: ${targetUser}`);


  }, [currentUser, targetUser]);
  
  return (
    <div className="chat-container">
      {messages.map((msg, index) => (
          <div key={index} >        
          <strong> {msg.sender_username}:</strong>  {msg.content} 
          <div>{new Date(msg.timestamp).toLocaleTimeString()}</div>
        </div>  
      ))}


      <FriendChatClient username={currentUser}/>

      

    </div>
    
  );
};

export default FriendChatPage;
