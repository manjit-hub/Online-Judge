import express from 'express';
import { generateFile } from './generateFile.js'; 
import { executeCPP, executePY, executeJS, executeJAVA } from './executeCodes.js';
import cors from 'cors';
const app = express();

// Middleware next 3 lines: 
app.use(cors());
app.use(express.json()); // Accept any data from FrontEnd
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.send("Compiler Running");
});

app.post("/run", async (req, res) => {
    const { lang = "cpp", code } = req.body; // making cpp as default language
    if (!code) {
        return res.status(500).json({ success: false, error: "Code not found" }); // success-> use in production grade
    }
    try {
        // Create a file using {lang, code}
        const filePath = generateFile(lang, code);

        //Automate the execution of code using terminal
        let output;
        if(lang == 'cpp') output = await executeCPP(filePath);
        res.json({ filePath, output});
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message })
    }
});

app.post("/submit", async (req, res) => {

})

// Start the server
const PORT = process.env.PORT || 8000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
