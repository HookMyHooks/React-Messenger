
import React, { useState, useEffect } from 'react'; //Hooks
import io from 'socket.io-client'; //connect as a client
import { useParams } from 'react-router-dom'; 
import { jwtDecode } from 'jwt-decode';

//Initialize socket connection
const socket = io('http://192.168.188.26:5000');

const FriendChatClient = ({username}) => {
    const [messages, setMessages] = useState([]); //state to store all received messages
    const [message, setMessage] = useState(''); //state to store the current message input by user 
    const {friendId} = useParams();
  useEffect(() => {
    socket.on('message', (message) => {   //listen for message event from the server
      setMessages((prevMessages) => [...prevMessages, message]); //update all messages
    });
    //console.log(`username: ${username} \n`)
    return () => {
      socket.off('message'); //clean up to prevent memory leaks
    };
  }, []);

  useEffect(() => {
    console.log(`hatz: ${username}`)
  }, [username]);
  

  

  const sendMessage = async () => { // send the message to server - to the 'message' event handling
    console.log(`message: ${message}`   );
    const token = localStorage.getItem('token'); // Get the token from local storage
    const decodedToken = jwtDecode(token);
    if (message.trim() !== "") {
      try {
        const response = await fetch('http://192.168.188.26:5000/api/messages', { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            text: message,
            receiverId: friendId
          }),
         });

        if (response.ok) {
          const result = await response.json();
          console.log('Message saved:', result);
          
          const messageObject = {senderId: decodedToken.userId,receiverId:friendId, username: username, content: message };
          socket.emit('message', messageObject); // Emit the message to other connected clients
          setMessage(''); // Clear the input after sending the message
        } else {
          const errorData = await response.json();
          console.error('Error saving message:', errorData.message);
          alert('Error saving message: ' + errorData.message);
        }
      } catch (error) {
        console.error('Error during message send:', error);
        alert('An error occurred while sending the message. Please try again.');
      }
    }
  };

  const handleKeyDown = (e) =>
  {
    if(e.key == 'Enter'){
      sendMessage();
    }
  }

  return (
    <div>
      <div>
        {
          messages.map((msg, index) => 
            (
              <div key={index}>
                <strong>{msg.username}</strong>: {msg.content}
                <div>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</div>
              </div>
            )
          ) //render each message that has been mapped in a 'div'
        }
      </div>
      <input
        type="text"
        value={message} //bind the input value to the 'message' state
        onChange={(e) => setMessage(e.target.value)} //update the message state with the current input value
        onKeyDown={handleKeyDown}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
export default FriendChatClient;