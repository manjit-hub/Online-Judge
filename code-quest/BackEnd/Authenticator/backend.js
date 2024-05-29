// Description: This is the main file for the authenticator service.
// Path cd .\code-quest\BackEnd\Authenticator

// Import necessary modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Added for CORS configuration
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Added to handle environment variables

// Load environment variables from .env file
dotenv.config(); // Added to load environment variables

// Import User model
const User = require('./models/User');

// Middleware configuration
app.use(cors({
    origin: 'http://localhost:3000', // Added: Frontend URL
    credentials: true // Added: Allow cookies to be sent with requests
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
const { DBConnection } = require("./Database/db");
DBConnection();

// Basic route
app.get("/", (req, res) => {
    res.send("Hello World, coming from backend.js");
});

// ------------------------------------ REGISTRATION PART ---------------------------------
app.post("/signup", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!(fullName && email && password)) {
            return res.status(400).send("Please fill all the fields");
        }
        
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).send("User already exists with the same email!");
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { // Changed: Used process.env.SECRET_KEY
            expiresIn: "1h",
        });
        user.password = undefined;

        res.status(200).json({ message: 'You have successfully registered!', user, token }); // Added: token in response
    } catch (error) {
        console.error(error); // Changed: More detailed error logging
        res.status(500).send("Internal server error");
    }
});

// ------------------------------------- LOGIN PART --------------------------------------
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(400).send("Please fill all the fields");
        }

        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Password is incorrect!");
        }

        const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, { // Changed: Used process.env.SECRET_KEY
            expiresIn: "1h",
        });
        userExist.password = undefined;

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // Changed: Cookie expiration set to 1 day
            httpOnly: true,
        };

        res.status(200).cookie("token", token, options).json({
            message: 'You have successfully logged in!',
            success: true,
            token, // Added: token in response
        });
    } catch (error) {
        console.error(error); // Changed: More detailed error logging
        res.status(500).send("Internal server error");
    }
});

// ------------------------------------- UPDATE ------------------------------------------
app.put("/update", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Authentication required!");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Changed: Used process.env.SECRET_KEY
        const userId = decoded.id;

        const { fullName, email, password, newPassword } = req.body;

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        if (fullName) userExist.fullName = fullName;
        if (email) userExist.email = email;

        if (password && newPassword) {
            const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
            if (!isPasswordCorrect) {
                return res.status(400).send("Current password is incorrect!");
            }
            userExist.password = await bcrypt.hash(newPassword, 10);
        }

        await userExist.save();

        res.status(200).json({ message: 'User data updated successfully!', user: userExist });
    } catch (error) {
        console.error(error); // Changed: More detailed error logging
        res.status(500).send("Internal server error");
    }
});

// ------------------------------------- DELETE ------------------------------------------
app.delete("/delete", async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).send("Authentication required!");
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Changed: Used process.env.SECRET_KEY
        const userId = decoded.id;

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User account deleted successfully!' });
    } catch (error) {
        console.error(error); // Changed: More detailed error logging
        res.status(500).send("Internal server error");
    }
});

// Start the server
const PORT = process.env.PORT || 5000; // Changed: Used process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
