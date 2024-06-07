import express from 'express';
import { generateFile } from './generateFile.js'; 
import { generateInputFile} from './generateInputFile.js';
import { executeCPP, executePY, executeJS, executeJAVA } from './executeCodes.js';
import cors from 'cors';
const app = express();

import mongoose from 'mongoose';
import Problem from '../BackEnd/Authenticator/models/Problem.js';
// Middleware next 3 lines: 
app.use(cors());
app.use(express.json()); // Accept any data from FrontEnd
app.use(express.urlencoded({ extended: true }));

// Database connection
import { DBConnection } from "../BackEnd/Authenticator//Database/db.js";
DBConnection();

app.get("/", (req, res) => {
    res.send("Compiler Running");
});
app.get("/problems/:problemId", async (req, res) => {
    const { problemId } = req.params;
    try {
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
        res.json({ problem });
    } catch (error) {
        console.error('Error fetching problem data:', error);
        res.status(500).json({ error: 'Error fetching problem data' });
    }
});

app.post("/problems/run", async (req, res) => {
    const { lang = "cpp", code, manualTestCase : input } = req.body; // making cpp as default language
    if (!code) {
        return res.status(500).json({ success: false, error: "Code not found" }); // success-> use in production grade
    }
    if (input=="") {
        return res.status(500).json({ success: false, error: "Please Input" }); // success-> use in production grade
    }
    try {
        // Create a file using {lang, code}
        const filePath = await generateFile(lang, code,);

        //Create a file for CustomInput
        const inputFilePath = await generateInputFile(input);

        // //Automate the execution of code using terminal
        let output;
        if(lang == 'cpp') output = await executeCPP(filePath, inputFilePath);
        return res.json({ success : true,filePath, inputFilePath, output});

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

app.post("/problems/submit", async (req, res) => {

})

// Start the server
const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
