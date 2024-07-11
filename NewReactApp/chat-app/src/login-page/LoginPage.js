import React from "react";
import "./LoginPage.css"
import { useNavigate } from 'react-router-dom';

function LoginPage()
{
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    };


    return(
        <form>
            <div className = "loginDiv">
                <h1 className="LoginText">Login With Your Credentials</h1>

                <label>Username: 
                    <input type="text" name ="username"/>
                </label>

                <label>
                    Password:
                    <input type="text" name="password"/>
                </label>
            </div>
            <div className="ButtonDiv">
                <button type="button" className="CancelButton" onClick={handleCancel}> Cancel</button>
                <button type="submit" className="LoginButton">LogIn</button>
            </div>
        </form>

    )
}

export default LoginPage;