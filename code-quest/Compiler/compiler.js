import express from 'express';
import { generateFile } from './generateFile.js'; 
import { generateInputFile} from './generateInputFile.js';
import { executeCPP, executePY, executeJS, executeJAVA } from './executeCodes.js';
import cors from 'cors';
const app = express();

import mongoose from 'mongoose';
import Problem from './models/Problem.js';
// Middleware next 3 lines: 
app.use(cors());
app.use(express.json()); // Accept any data from FrontEnd
app.use(express.urlencoded({ extended: true }));

// Database connection
import DBConnection from './Database/db.js';
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
        return res.status(500).json({ success: false, error: "Code not found"}); // success-> use in production grade
    }
    if (!input) {
        return res.status(500).json({ success: false, error: "Input not found"}); // success-> use in production grade
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
    const { lang = "cpp", code, problemId } = req.body;
    if (!code || !problemId) {
        return res.status(400).json({ success: false, error: "Code or Problem ID not found" });
    }

    try {
        // Fetch problem and its test cases
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }

        // Generate code file
        const filePath = await generateFile(lang, code);

        // Iterate through each test case
        for (let testCase of problem.testCases) {
            // Generate input file for each test case
            const inputFilePath = await generateInputFile(testCase.inputValue);

            // Execute the code for each test case
            let output;
            try {
                if (lang === 'cpp') output = await executeCPP(filePath, inputFilePath);
                // Add similar blocks for other languages as needed

                // Trim any extra whitespace from the output and expected output
                const cleanedOutput = output.trim();
                const expectedOutput = testCase.output.trim();

                if (cleanedOutput !== expectedOutput) {
                    return res.json({ 
                        success: false,
                        verdict: "Wrong Answer", 
                        failedTestCase: testCase.input
                    });
                }
            } catch (error) {
                return res.json({ 
                    success: false,
                    error: error.message, 
                    verdict: error.message,
                    failedTestCase: testCase.input
                });
            }
        }

        return res.json({ 
            success: true,
            verdict: "Accepted",
            output: "Accepted"
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
