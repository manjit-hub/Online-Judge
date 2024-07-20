// Description: This is the main file for the authenticator service.
// Path cd .\chill-code\BackEnd\Authenticator

// Import necessary modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors'); // Added for CORS configuration
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Added to handle environment variables
const nodemailer = require('nodemailer');
const {getVerificationEmailTemplate} = require('./getVerificationEmailTemplate');

// Load environment variables from .env file
dotenv.config(); // Added to load environment variables

// Import Models 
const User = require('./models/User');
const Problem = require('./models/Problem');
const EmailVerify = require('./models/EmailVerify');
const TempUser = require('./models/TempUser');

// Middleware configuration
app.use(cors({
    origin: ['http://localhost:3000'], // Add Frontend URL ",'https://chill-code-cyan.vercel.app','https://chillcode.tech','https://www.chillcode.tech' "
    credentials: true // Allow cookies to be sent with requests
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

// --[nodemailer] for sending otp---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
});

// Send OTP verification to email
const sentOtpVerificationEmail = async ({email}, res) =>{
    try{
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

        const htmlContent = getVerificationEmailTemplate(otp);
        // mail options
        const mailOptions = {
            from: process.env.AUTH_EMAIL,
            to: email,
            subject : "Verify Your Email",
            html : htmlContent
        }

        // hash the otp
        const saltRound = 10;
        const hashedOtp = await bcrypt.hash(otp, saltRound);
        const newOTPVerificaton = new EmailVerify({
            email : email,
            otp : hashedOtp,
            expiresAt: Date.now() + 3600000
        });
        await newOTPVerificaton.save();

        // send mail
        await transporter.sendMail(mailOptions);
        return {
            success : true,
            status: "Pending",
            message : "OTP sent to your email !"
        };
    } catch(error){ 
        console.log("Error generating OTP !");
        return {
            success : false,
            status : "Failed",
            message : error.message
        }
    }
}
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
        const tempUser = await TempUser({
            fullName,
            email,
            password: hashedPassword
        });
        await tempUser.save();

        const otpResponse = await sentOtpVerificationEmail({email}, res);
        if (!otpResponse.success) {
            return res.status(500).json({
                message: 'Error sending OTP',
                success: false,
                error: otpResponse.message
            });
        }
        
        res.status(200).json({ 
            message: 'OTP sent to your email !',
            success : true,
            otpStatus: otpResponse.status,
            otpMessage: otpResponse.message
         }); 
    }
    catch (error) {
        console.error(error); 
        res.status(500).send("Internal server error");
    }
});

// --------------------------------SIGN UP -> VERIFY OTP ---------------------------------
app.post("/verifyOTP", async (req, res) =>{
    try {
        const {otp, email} = req.body;
        if(!otp || !email){
            return res.status(400).send("Empty OTP Details !!");
        }
        const otpVerificationRecord = await EmailVerify.find({email});

        if(otpVerificationRecord.length <= 0){
            return res.status(400).send("No OTP found !!");
        }
        const {expiresAt} = otpVerificationRecord[0];
        const hashedOtp = otpVerificationRecord[0].otp;

        if(expiresAt < Date.now()){
            await EmailVerify.deleteMany({email});
            return res.status(400).send("OTP Expired !!");
        }
        const isOtpValid = await bcrypt.compare(otp, hashedOtp);
        if(!isOtpValid){
            return res.status(400).send("Invalid OTP !!");
        }
        
        const tempUser = await TempUser.findOne({ email });
        if(!tempUser){
            return res.status(400).send("No temporary user found!!");
        }

        // add permanently to db
        const user = new User({
            fullName: tempUser.fullName,
            email: tempUser.email,
            password: tempUser.password
        });
        await user.save();
        
        //remove TempUser
        await TempUser.deleteOne({email});
        await EmailVerify.deleteMany({email});
        
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "30d",
        });
        user.password = undefined;

        return res.json({
            success : true,
            status : "Verified :)",
            message : "Successfully Verified !!",
            user,
            token
        })
    } catch(error){
        console.error("Error Verifing OTP !!");
        res.json({
            success : false,
            status : "Error",
            message : "Error Verifing OTP !!"
        })
    }
})

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
            token, // token in response
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
    // console.log(token);
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


// --------------------------------------Save Problem Solved ------------------------------
app.put('/solved/:userId', async (req, res) => {
    const { userId } = req.params;
    const { problemId } = req.body;
    if(!problemId){
        return res.status(400).json({error: 'Problem Id is required.'})
    }
    try{
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }
        // console.log(`problem saving userId: ${userId} & problemId: ${problemId}`)
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { solvedProblems: problemId } },
            { new: true }
          );
        if(!user){
            return res.status(404).json({ error: 'User not found or not logged in' });
        }

        // Add the new problemId to the solvedProblems array if it's not already there
        // if(!user.solvedProblems.includes(problemId)) {
        //     // console.log(`Adding problemId: ${problemId}`);
        //     user.solvedProblems.push(problemId);
        //   }
        // await user.save();
        res.json({success: true, user});
    } catch (error) {
        console.error('Error updating solved problems:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//-------------------------Display Solved Problems----------------------------------------------
app.get('/user/:userId/solved-problems', async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId).populate('solvedProblems');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ solvedProblems : user.solvedProblems });
    } catch (error) {
      console.error('Error fetching solved problems:', error);
      res.status(500).json({ error: 'Server error' });
    }
});