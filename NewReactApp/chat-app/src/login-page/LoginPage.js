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

                <div className="wrap-input-7">
                    <input className="input" type="text" placeholder="Username" />
                    <span className="focus-border">
                        <i />
                    </span>
                </div>

                <div className="wrap-input-7">
                    <input className="input" type="text" placeholder="Password" />
                    <span className="focus-border">
                        <i />
                    </span>
                </div>
            </div>
            
            <div className="buttonContainer">
                <button type="button" className="CancelButton" onClick={handleCancel}> Cancel</button>
                <button type="submit" className="LoginButton" onClick={handleCancel}>LogIn </button> 
                   
            </div>
            
        </form>
                //for now navigate to "/" in both cases

               
              
    )

}

export default LoginPage;