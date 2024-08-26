import React,{useEffect,useState} from 'react';
import './ChatPage.css'
import ChatClient from '../chat-component/chat-client';
import { jwtDecode } from 'jwt-decode';
import FriendsList from '../friend-component/friend-component';


function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log('Decoded token:', decodedToken);
      setUsername(decodedToken.username);

      const fetchMessages = async () => {
        const response = await fetch('http://192.168.0.107:5000/messages', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setMessages(data);
        } else {
          alert(data.message);
        }
      };

      fetchMessages();
    }
  }, []);

  return (
    <div className="ChatPage">

      <div className="friend-list-container">
        <FriendsList>
          Friends!
        </FriendsList>
      </div>
      <header className="Chat-header">
        <h1>Chat App</h1>
        {messages.map((msg) => (
          <div key={msg.id}>
            <strong>{username}:</strong>{msg.text}</div>
        ))}
        <ChatClient username={username}/>
        <div>
        
        </div>
      </header>
    </div>
  );
}

export default ChatPage;
