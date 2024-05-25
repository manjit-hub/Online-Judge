// Description: This is the main file for the authenticator service.
// Path: cd .\code-quest\BackEnd\Authenticator

// Create a Server => Imported express
const express = require('express');
const app = express();

const { DBConnection } = require("./Database/db");
DBConnection();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => { // Always make "/" route
    res.send("Hello World, coming from backend.js");
});

const User = require('./models/User'); // capital "Model" will not work. Collide with "model" 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTRATION PART
app.post("/register", async (req, res) => {
    try {
        // res.send("<h1>This is register page, coming from backend.js</h1>");
        // GET ALL THE DATA FROM FRONTEND
        const { fullName, email, password } = req.body; // Storing data in 'request' in the 'body' form.
        // CHECK ALL THE DATA IS FILLED/ EXIST
        if (!(fullName && email && password)) { // If anything will be missing then return 0 => !0 = true
            return res.status(400).send("Please fill all the fields");
        }
        // CHECK IF USER ALREADY EXIST
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).send("User already exists with the same email!");
        }
        // HASHING/ENCRYPT THE PASSWORD => Using bcrypt to encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);
        // SAVE USER INFO IN DATA BASE
        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
        })
        // GENERATE A TOKEN FOR USER AND SEND IT TO THE BACKEND
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, { //user._id :: Standard naming
            expiresIn: "1h",
        });
        user_token = token; // Everything will be stored in token
        user.password = undefined; // Make password to undefined -> Security purpose

        res.status(200).json({ message: 'You have successfuly registered !', user });

    }
    catch (error) {
        console.log(error);
    }

});

// LOGIN PART
// LOGIN PART
app.post("/login", async (req, res) => {
    try {
        // GET ALL THE DATA FROM FRONTEND
        const { email, password } = req.body;

        // CHECK ALL THE DATA IS FILLED/EXIST
        if (!(email && password)) {
            return res.status(400).send("Please fill all the fields");
        }

        // CHECK IF USER ALREADY EXISTS
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).send("User not found!");
        }

        // HASHING/ENCRYPT THE PASSWORD => Using bcrypt to encrypt password
        const hashedPassword = await bcrypt.hash(password, 10);

        // CHECK IF PASSWORD IS CORRECT
        const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
        if (!isPasswordCorrect) {
            return res.status(400).send("Password is incorrect!");
        }

        // GENERATE A TOKEN FOR USER AND SEND IT TO THE BACKEND
        const token = jwt.sign({ id: userExist._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        user_token = token; // Everything will be stored in token
        userExist.password = undefined; // Make the password undefined, so that it kept unknown => Security Purpose

        // STORE TOKEN IN COOKIES
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true,
        };

        // SENDING THE TOKEN
        res.status(200).cookie("token", token, options).json({
            message: 'You have successfully logged in!',
            success: true,
            token,
        });
    } catch (error) {
        console.log(error); // Log the error for debugging
        res.status(500).send("Internal server error"); // Return a generic error message
    }
});


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);

});
