/*import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './home-page/HomePage';
import ChatPage from './chat-page/ChatPage';
import About from './about-page/AboutPage';
import LoginPage from './login-page/LoginPage';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/chat">Chat</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element = {<LoginPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;*/

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Home from './home-page/HomePage';
import ChatPage from './chat-page/ChatPage';
import LoginPage from './login-page/LoginPage';
import "./App.css"

function App() {
  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar  className='matToolbar'>
            <Typography variant="h6" >
              <Button color = "inherit" component = {Link} to="/">Local Messenger</Button>
            </Typography>

            <Button color="inherit" component={Link} to="/chat">Chat</Button>
            <Button color="inherit" component={Link} to="/login">Login</Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

