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
        } else {
            if (!fullName || !email || !password) {
                return handleError("Please fill in all fields");
            }
            try {
                const { data } = await axios.post(
                    `https://api.chillcode.tech/signup`,
                    { ...inputValue }
                );
                const { success, message, userId } = data;
                if (success) {
                    handleSuccess(message);
                    setInputValue({
                        ...inputValue,
                        userId: userId,
                    });
                    setIsUserCreated(true);
                } else {
                    handleError(message); // Display specific error message based on response
                }
            } catch (error) {
                const errorMessage = error.response && error.response.data
                    ? error.response.data
                    : "An unexpected error occurred";
                handleError(errorMessage);
            }
        }
    };

    return (
        <div className="container">
            <div className="header">
                <h2>Sign Up</h2>
            </div>
            <form onSubmit={handleSubmit} className="form">
                <div className="input-container">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        value={inputValue.fullName}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={inputValue.email}
                        onChange={handleOnChange}
                    />
                </div>
                <div className="input-container">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={inputValue.password}
                        onChange={handleOnChange}
                    />
                </div>
                {isUserCreated && (
                    <div className="input-container">
                        <label htmlFor="otp">OTP</label>
                        <input
                            type="text"
                            name="otp"
                            value={inputValue.otp}
                            onChange={handleOnChange}
                        />
                    </div>
                )}
                <button type="submit" className={isUserCreated ? "green" : "blue"}>
                    {isUserCreated ? "Verify OTP" : "Sign Up"}
                </button>
                <ToastContainer />
                <div className="footer">
                    <p>Already have an account?</p>
                    <Link to="/login">Log In</Link>
                </div>
            </form>
        </div>
    );
}

export default SignupPage;
