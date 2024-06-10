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

        res.status(200).json({ message: 'You have successfully registered!', user, token, success : true }); // Added: token in response + made success 'true', so will treated as successfull registration
    } 
    catch (error) {
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

        const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, { 
            expiresIn: "1h",
        });
        userExist.password = undefined;

        const options = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), //Cookie expiration set to 1 day
            httpOnly: true,
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
        const { title, difficulty, description, acceptanceRate, testCases } = req.body;

        if (!title || !difficulty || !description || !acceptanceRate) {
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

// // ------------------------------------ DISPLAY SPECIFIC PROBLEM ------------------------------------
// app.get("/problemslist/:problemId?", async (req, res) => {
//     try {
//         const { problemId } = req.params;

//         if (!problemId) {
//             const defaultProblem = {
//                 _id: "665996ba33f86e7e57f5b43e",
//                 number: 1,
//                 title: "Sum of All Subset XOR Totals",
//                 difficulty: "Easy",
//                 solved: "No",
//                 acceptance_rate: 34.78,
//                 description: "The XOR total of an array is defined as the bitwise XOR of all its elements, or 0 if the array is empty.\n For example, the XOR total of the array [2,5,6] is 2 XOR 5 XOR 6 = 1.\nGiven an array nums, return the sum of all XOR totals for every subset of nums. \n\nNote: Subsets with the same elements should be counted multiple times.\n\nAn array a is a subset of an array b if a can be obtained from b by deleting some (possibly zero) elements of b.",
//                 testCases: [
//                     {
//                         input: "nums = [1,3]",
//                         output: "6",
//                         explanation: "Subset XOR totals: [1], [3], [1,3], []. Their XOR totals are 1, 3, 2, 0 respectively. \n Sum = 1+3+2+0 = 6." 
//                     }
//                 ]
//             };
//             return res.status(200).json({ problem: defaultProblem, redirectUrl: "/compiler/665996ba33f86e7e57f5b43e" });
//         }

//         const problem = await Problem.findById(problemId);

//         if (!problem) {
//             return res.status(404).json({ message: "Problem not found" });
//         }
//         res.status(200).json({ problem, redirectUrl: `/compiler/${problemId}` });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal server error");
//     }
// });



// Start the server
const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
});
