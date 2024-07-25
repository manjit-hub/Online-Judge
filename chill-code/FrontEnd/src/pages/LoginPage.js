import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
    });

    const { email, password } = inputValue;

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
            ...inputValue,
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                `https://api.chillcode.tech/login`,
                { ...inputValue },
                { withCredentials: true }
            );
            const { success, message } = data;

            if (success) {
                handleSuccess(message);
                setTimeout(() => {
                    navigate("/problemslist");
                }, 2000);
                setInputValue({
                    email: "",
                    password: "",
                });
            } else {
                handleError(message);
                setInputValue({
                    email : inputValue.email,
                    password: "",
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data || "Something went wrong";
            handleError(errorMessage);
            setInputValue({
                email : inputValue.email,
                password: "",
            });
        }
    };

    const handleGoogleLogin = async() =>{
        window.open(
            `https://api.chillcode.tech/auth/google`,
            "_self"
        );
    }

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
                    </div>
                </form>
                <p className="checking">or</p>
                        <button className="gsi-material-button" onClick={handleGoogleLogin}>
                            <div className="gsi-material-button-state"></div>
                            <div className="gsi-material-button-content-wrapper">
                                <div className="gsi-material-button-icon">
                                <svg version="1.1" viewBox="0 0 48 48" style={{ display: 'block' }}>
                                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                                    <path fill="none" d="M0 0h48v48H0z"></path>
                                </svg>
                                </div>
                                <span className="gsi-material-button-contents">Continue with Google</span>
                                <span style={{ display: 'none' }}>Continue with Google</span>
                            </div>
                        </button>
                <p className="last">Don't have an account?</p>
                <Link to="/signup" className="last">Sign up</Link>
            </div>
            <ToastContainer />
        </div>
    );
}

export default LoginPage;
