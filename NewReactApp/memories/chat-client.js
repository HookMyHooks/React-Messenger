
import React, { useState, useEffect } from 'react'; //Hooks
import io from 'socket.io-client'; //connect as a client

//Initialize socket connection
const socket = io('http://192.168.0.107:5000');
//http://25.65.131.176:5000

const ChatClient = ({username}) => {
  const [messages, setMessages] = useState([]); //state to store all received messages
  const [message, setMessage] = useState(''); //state to store the current message input by user 

  useEffect(() => {
    socket.on('message', (message) => {   //listen for message event from the server
      setMessages((prevMessages) => [...prevMessages, message]); //update all messages
    });

    return () => {
      socket.off('message'); //clean up to prevent memory leaks
    };
  }, []);

  

  const sendMessage = async () => { // send the message to server - to the 'message' event handling
    console.log(message);
    if (message.trim() !== "") {
      try {
        const token = localStorage.getItem('token'); // Get the token from local storage
        const response = await fetch('http://192.168.0.107:5000/messages', { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ text: message }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Message saved:', result);
          
          const messageObject = { username, content: message };
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
};

export default ChatClient;
