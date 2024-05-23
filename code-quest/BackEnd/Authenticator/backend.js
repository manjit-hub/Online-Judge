//Description : This is the main file for the authenticator service.

//Path : cd .\code-quest\BackEnd\Authenticator

//Create a Server => Imported express
const express = require('express');
const app = express();
// import {DBConnection} from './Database/db';
const {DBConnection} = require("./Database/db");

DBConnection();
app.get("/",(req, res) =>{  //Always make "/" route
    res.send("Hello World, coming from backend.js");
});

//REGISTRATION PART
app.post("/register",(req, res) =>{ //NOT DISPLAY ON frontend as it's POST method
    res.send("<h1>This is register page, coming from backend.js</h1>");
    //GET ALL THE DATA FROM FRONTEND
    const {fullName, email, password} = req.body; // Storing data in 'request' in the 'body' form.
    //CHECK ALL THE DATA IS FILLED/ EXIST
    if(!(fullName && email && userId && password)){ // If anything will be missing then return 0 => !0 = true
        res.status(400).send("Please fill all the fields");
    }
    //CHECK IF USER ALREADY EXIST

    //HASHING/ENCRYPT THE PASSWORD
    //SAVE USER INFO IN DATA BASE
    //GENERATE A TOKEN FOR USER AND SEND IT TO THE BECKEND
});

app.listen(5000, () =>{
    console.log("Server is running on port 5000");
});