import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';

function SignupPage() {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        fullName: "",
        email: "",
        password: "",
        otp: "",
        userId: ""
    });
    const [isUserCreated, setIsUserCreated] = useState(false);
    const { fullName, email, password, otp } = inputValue;

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
        if(isUserCreated){
            try{
                const { data } = await axios.post(
                    `https://api.chillcode.tech/verifyOTP`,
                    { otp: inputValue.otp, email: inputValue.email},
                    { withCredentials: true } // It will assign a special cookies, token to the data
                );
                const {success, message} = data;
                if (success) {;
                    handleSuccess(message);
                    setTimeout(() => {
                        navigate("/login");
                    }, 2000); // Waits 1000 mili seconds
                    setInputValue({
                        ...inputValue,
                        fullName: "",
                        email: "",
                        password: "",
                        otp: "",
                        userId: "",
                    });
                } 
                else {
                    handleError(message); // Display specific error message based on response
                }
            } catch(error){
                const errorMessage = error.response && error.response.data
                ? error.response.data
                : "An unexpected error occurred while verifying otp";
                handleError(errorMessage);
            }
        } else{
            try {
                const { data } = await axios.post(
                    `https://api.chillcode.tech/signup`,
                    { ...inputValue },
                    { withCredentials: true } // It will assign a special cookies, token to the data
                );
                const { success, message} = data;
                if (success) {
                    handleSuccess(message);
                    setIsUserCreated(true);
                    setInputValue({ ...inputValue});
                } else {
                    handleError(message);
                }
            } 
            catch (error) {
                const errorMessage = error.response && error.response.data
                ? error.response.data
                : "An unexpected error occurred while creating user";
                handleError(errorMessage);
            }
        }
    };

    const handleGoogleLogin = async () =>{
        console.log("handleGoogleLogin");
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
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}> 
                    <div className="boxes">
                        <h5>Full Name</h5> 
                        <input
                            type="text"
                            name="fullName"
                            value={fullName}
                            placeholder="Enter your full name"
                            onChange={handleOnChange}
                        />
                        <h5>Email</h5>
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
                        {isUserCreated && (
                            <>
                                <h5>Enter OTP</h5>
                                <input
                                    type="text"
                                    name="otp"
                                    value={otp}
                                    placeholder="Enter the OTP"
                                    onChange={handleOnChange}
                                />
                            </>
                        )}
                        <button className="loginPg" type="submit">
                            {isUserCreated ? "Verify" : "Sign Up"}
                        </button>
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
                <p className="last">Already have an account?</p>
                <Link to="/login" className="last">Log In</Link>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SignupPage;
