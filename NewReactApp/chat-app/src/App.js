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
import { useState } from 'react';
import RegisterPage from './register-page/RegisterPage';

function App() {
const [isLoggedIn,setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar  className='matToolbar'>
            <Typography variant="h6" >
              <Button color = "inherit" component = {Link} to="/">Local Messenger</Button>
            </Typography>

            {isLoggedIn && <Button color="inherit" component={Link} to="/chat">Chat</Button>}
            {!isLoggedIn && <Button color="inherit" component={Link} to="/login">Login</Button>}
            {!isLoggedIn && <Button color = "inherit" component ={Link} to = "/register">Register</Button>}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn}/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

