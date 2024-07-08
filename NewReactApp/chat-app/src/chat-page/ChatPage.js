import React from 'react';
import './ChatPage.css'
import ChatClient from '../chat-component/chat-client';

function ChatPage() {
  return (
    <div className="ChatPage">
      <header className="Chat-header">
        <h1>Chat App</h1>
        <ChatClient />
      </header>
    </div>
  );
}

export default ChatPage;
