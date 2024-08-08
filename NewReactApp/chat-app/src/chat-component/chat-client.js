
import React, { useState, useEffect } from 'react'; //Hooks
import io from 'socket.io-client'; //connect as a client

//Initialize socket connection
const socket = io('http://192.168.0.108:5000');
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

  const sendMessage = () => //send the message to server - to the 'message' event handling
  {
    const messageObject = {username, content:message}
    if(message != ""){
      socket.emit('message', messageObject);
      setMessage(''); //set the current message to the empty string
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
