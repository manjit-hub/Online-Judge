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
const Problem = require('./models/Problem');

// Middleware configuration
app.use(cors({
    origin: 'https://code-quest-cyan.vercel.app', // Added: Frontend URL
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
        
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { // Used process.env.SECRET_KEY
            expiresIn: "30d",
        });
        user.password = undefined;

        res.status(200).json({ message: 'You have successfully registered!', user, token, success : true }); // token in response + made success 'true', so will treated as successfull registration
    } 
    catch (error) {
        console.error(error); 
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

        const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, { 
            expiresIn: "30d",
        });
        userExist.password = undefined;

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //Cookie expiration set to 1 day
            // httpOnly: true, USE ONLY IF WORKING ON LOCAL HOST. // No need this during deployment in AWS
            sameSite: "None", 
            secure: true
        };

        res.status(200).cookie("token", token, options).json({
            message: 'You have successfully logged in!',
            success: true,
            token, // Added: token in response
        });
    } catch (error) {
        console.error(error); 
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

        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Used process.env.SECRET_KEY
        const userId = decoded.id;

        const { fullName, email, oldPassword, newPassword } = req.body;

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        // Verify the old password before proceeding with updates
        const isPasswordCorrect = await bcrypt.compare(oldPassword, userExist.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Please enter correct password!");
        }

        if (fullName) userExist.fullName = fullName;
        if (email) userExist.email = email;

        if (newPassword) {
            userExist.password = await bcrypt.hash(newPassword, 10);
        }

        await userExist.save();

        res.status(200).json({ message: 'User data updated successfully!', user: userExist });
    } catch (error) {
        console.error(error); 
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

        const decoded = jwt.verify(token, process.env.SECRET_KEY); 
        const userId = decoded.id;

        const userExist = await User.findById(userId);
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        // Compare with Entered Password
        const { password } = req.body;
        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Current password is incorrect!");
        }

        await User.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User account deleted successfully!' });
    } catch (error) {
        console.error(error); 
        res.status(500).send("Internal server error");
    }
});


// ------------------------------------ FETCH PROBLEMS ------------------------------------
app.get("/problemslist", async (req, res) => {
    try {
        const problems = await Problem.find({});
        res.status(200).json(problems);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});

// ------------------------------------ ADD PROBLEM ------------------------------------
app.post("/problems/add-problem", async (req, res) => {
    try {
        const { title, difficulty, description, acceptanceRate, inputFormat, outputFormat, testCases } = req.body;

        if (!title || !difficulty || !description || !acceptanceRate || !inputFormat || !outputFormat) {
            return res.status(400).send("Please fill all required fields");
        }

        // Get the highest current problem number and increment it for the new problem
        const highestProblem = await Problem.findOne().sort('-number').exec();
        const newProblemNumber = highestProblem ? highestProblem.number + 1 : 1;

        const problem = new Problem({
            number: newProblemNumber,
            title,
            difficulty,
            description,
            inputFormat,
            outputFormat,
            acceptance_rate: acceptanceRate,
            testCases,
        });

        await problem.save();
        res.status(201).json({ message: 'Problem added successfully', problem });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal server error");
    }
});
// -----------------------FETCH CURRENT USER DATA -----------------------------------------
app.get("/auth/me", async (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
        return res.status(401).send("Authentication required!");
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expired. Please log in again.' });
        }
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});


// --------------------------------DISPLAY PROFILE------------------------------------------
app.get("/profile/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ error: 'User not found in profile' });
        }
        res.json({ success: true, user });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ error: 'Error fetching user data' });
    }
});


// ------------------------------------- LOGOUT ------------------------------------------
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Successfully logged out" });
})

// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
