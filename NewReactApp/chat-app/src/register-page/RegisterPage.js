import "./RegisterPage.css"
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function RegisterPage({setIsLoggedIn})
{
    const navigate = useNavigate();

    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");


    //handle Cancel Button
    const handleCancel = () => {
        navigate('/');
    };
    


    //handle Register Button with route on sv

    const handleRegister = async (e) => {
        e.preventDefault();

        try {


            // Send login data to the server
            const response = await fetch('http://192.168.0.107:5000/register', {
                method: 'PUT',
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




    //return form
    return (
        <form onSubmit={handleRegister}>
            <div className="RegisterDiv">
                <h1 className="RegisterText">Registration</h1>

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
                <button type="button" className="CancelButton" onClick={handleCancel}>Cancel</button>
                <button type="submit" className="RegisterButton">Register!</button> 
            </div>
        </form>
    );


}

export default RegisterPage;