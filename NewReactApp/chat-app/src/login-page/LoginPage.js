import React, { useState } from "react";
import "./LoginPage.css"
import { useNavigate } from 'react-router-dom';

function LoginPage({setIsLoggedIn})
{
    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");

    //handle Cancel Button
    const handleCancel = () => {
        navigate('/');
    };



    //handle Login Button
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Send login data to the server
            const response = await fetch('http://192.168.0.108:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            console.log('Server response:', result);

            if (result.success) {
                setIsLoggedIn(true);
                navigate('/chat', {state:{username}}); // Redirect on successful login

            } else {
                alert('Invalid credentials, please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="loginDiv">
                <h1 className="LoginText">Login With Your Credentials</h1>

                <div className="wrap-input-7">
                    <input 
                        className="input" 
                        type="text" 
                        placeholder="Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required 
                    />
                    <span className="focus-border">
                        <i />
                    </span>
                </div>

                <div className="wrap-input-7">
                    <input 
                        className="input" 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <span className="focus-border">
                        <i />
                    </span>
                </div>
            </div>
            
            <div className="buttonContainer">
                <button type="button" className="CancelButton" onClick={handleCancel}> Cancel</button>
                <button type="submit" className="LoginButton">LogIn</button> 
            </div>
        </form>
    );
}

export default LoginPage;