import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Home from './home-page/HomePage';
import LoginPage from './login-page/LoginPage';
import "./App.css"
import { useState,useEffect } from 'react';
import RegisterPage from './register-page/RegisterPage';
import { jwtDecode } from 'jwt-decode';
import FriendsPage from './friends-page/FriendsPage';
import FriendChatPage from './chat-page/FriendChatPage';
  
function App() {

  const [isLoggedIn,setIsLoggedIn] = useState(false);



  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

      if (decodedToken.exp < currentTime) {
        // Token has expired
        alert('Session has expired. Please log in again.');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        // Token is valid, user remains logged in
        setIsLoggedIn(true);
      }
  } else {
    setIsLoggedIn(false);
  }
}, []);

  return (
    <Router>
      <div>
        <AppBar position="static">
          <Toolbar  className='matToolbar'>
            <Typography variant="h6" >
              <Button color = "inherit" component = {Link} to="/">Local Messenger</Button>
            </Typography>

            {!isLoggedIn && <Button color="inherit" component={Link} to="/login">Login</Button>}
            {!isLoggedIn && <Button color = "inherit" component ={Link} to = "/register">Register</Button>}
            {isLoggedIn && <Button color = "inherit" component = {Link} to = "/friends">Friends</Button>}
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn}/>}/>
          <Route path = "/friends" element = {<FriendsPage/>}/>
          <Route path = "/chat/:friendId" element = {<FriendChatPage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;

