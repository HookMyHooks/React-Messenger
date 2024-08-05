import React, { useState, useEffect } from 'react'; // Hooks
import io from 'socket.io-client'; // Connect as a client

// Initialize socket connection
const socket = io('http://192.168.0.108:5000');

const ChatClient = ({ username }) => {
  const [messages, setMessages] = useState([]); // State to store all received messages
  const [message, setMessage] = useState(''); // State to store the current message input by user
  const [clients, setClients] = useState([]); // State to store connected clients

  // Emit the register event once when the component mounts
  useEffect(() => {
    socket.emit('register', username);

    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for the clientsUpdated event
    socket.on('clientsUpdated', (updatedClients) => {
      setClients(updatedClients);
    });

    // Clean up to prevent memory leaks
    return () => {
      socket.off('message');
      socket.off('clientsUpdated');
    };
  }, [username]); // Dependency array includes username

  // Function to send a message
  const sendMessage = () => {
    const messageObject = { username, content: message };
    if (message !== "") {
      socket.emit('message', messageObject);
      setMessage(''); // Clear the input after sending
    }
  };

  // Handle the "Enter" key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div>
      <h2>Connected Clients</h2>
      <ul>
        {clients.map((client, index) => (
          <li key={index}>{client.username}</li>
        ))}
      </ul>

      <h2>Messages</h2>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.username}</strong>: {msg.content}
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message} // Bind the input value to the 'message' state
        onChange={(e) => setMessage(e.target.value)} // Update the message state with the current input value
        onKeyDown={handleKeyDown} // Handle key press
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatClient;
