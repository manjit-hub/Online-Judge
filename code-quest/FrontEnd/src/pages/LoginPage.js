import React, { useState } from "react"; 
import { useNavigate, Link } from "react-router-dom"; 
import axios from "axios"; 
import { ToastContainer, toast } from "react-toastify"; 
import 'react-toastify/dist/ReactToastify.css'; 
import googleLogo from "./GoogleLogo.png";

function LoginPage() {
    const navigate = useNavigate(); 
    const [inputValue, setInputValue] = useState({ 
        email: "",
        password: "",
    });

    const { email, password } = inputValue; 

    const handleOnChange = (e) => { // THIS FUNCTION STORES ANY CHANGES TO THAT INPUT BOX
        const { name, value } = e.target;
        setInputValue({
            ...inputValue, // SPREAD ALL THE DATA INSIDE OBJECT/ARRAY INTO ELEMENTS
            [name]: value,
        });
    };

    const handleError = (err) =>
        toast.error(err, {
            position: "top-center",
        });

    const handleSuccess = (msg) =>
        toast.success(msg, {
            position: "top-center",
        });

    const handleSubmit = async (e) => {  // e is EVENT OBJECT which is automatically passed when an event occurs
        e.preventDefault(); // It prevents the default behavior associated with the event from occurring
        try {
            const { data } = await axios.post(
                "http://localhost:5000/login",
                { ...inputValue },
                { withCredentials: true }
            );
            const { success, message } = data; 

            if (success) { 
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/problems"); 
                }, 1000);
            } 
            else { 
                handleError(message); // Display specific error message based on response
            }
        } 
        catch (error) {
            const errorMessage = error.response.data; // Get error message from backend
            handleError(errorMessage); // Display specific error message from backend
        }
        setInputValue({
            ...inputValue,
            email: "",
            password: "",
        });
    };

    return (
        <div className="LoginPage">
            <div className="header">
                <img src="/Assets/logo.png" alt="Logo" />
            </div>
            <div className="content">
                <h2>Log In</h2>
                <form onSubmit={handleSubmit}> 
                    <div className="boxes">
                        <h5 className="top">Email</h5> 
                        <input
                            type="email" 
                            name="email"
                            value={email}
                            placeholder="Enter your email"
                            onChange={handleOnChange} 
                        />
                        <h5>Password</h5>
                        <input
                            type="password" 
                            name="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={handleOnChange} 
                        />
                        <button className="loginPg" type="submit">Log In</button> 
                        <p className="checking">or</p>
                        <button className="google">
                            <img src={googleLogo} alt="Google Logo" className="google-logo" />Continue with Google
                        </button>
                    </div>
                </form>
                <p className="last">Don't have an account?</p>
                <Link to="/signup" className="last">Sign up</Link> 
            </div>
            <ToastContainer /> 
        </div>
    );
}

export default LoginPage;