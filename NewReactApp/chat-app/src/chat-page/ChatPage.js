import React from 'react';
import './ChatPage.css'
import ChatClient from '../chat-component/chat-client';
import { useLocation } from 'react-router-dom';

function ChatPage() {
  const location = useLocation();
  const { username } = location.state || {};

  return (
    <div className="ChatPage">
      <header className="Chat-header">
        <h1>Chat App</h1>
        <ChatClient username ={username}/>
      </header>
    </div>
  );
}

export default ChatPage;
