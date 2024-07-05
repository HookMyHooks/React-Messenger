import './App.css';
import React from 'react';
import Chat from './chat-component/chat-client';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat App</h1>
        <Chat />
      </header>
    </div>
  );
}

export default App;
