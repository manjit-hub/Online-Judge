import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import googleLogo from "./GoogleLogo.png";

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
                    "http://localhost:5000/verifyOTP",
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
                    "http://localhost:5000/signup",
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
                        <p className="checking">or</p>
                        <button className="google">
                            <img src={googleLogo} alt="Google Logo" className="google-logo" />Continue with Google
                        </button>
                    </div>
                </form>
                <p className="last">Already have an account?</p>
                <Link to="/login" className="last">Log In</Link>
            </div>
            <ToastContainer />
        </div>
    );
}

export default SignupPage;
