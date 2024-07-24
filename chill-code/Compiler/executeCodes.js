import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process'; // Must use {} 

// Automation to create a new code file => To store exe files
const outputPath = path.join(path.resolve(), 'Output');

// Now check whether the path exists or not; if not, create that filepath
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
}

const executeCPP = (filePath, inputFilePath) => {
    // name the exe file accordingly => codeFileName.exe
    const jobId = path.basename(filePath).split(".")[0]; // split the filePath on the basis of '.' and give 0th index
    // const opfileName = `${jobId}.out`;  Make sure to convert into '.out' while deploying on server, as it runs on LINUX
    const outPath = path.join(outputPath, `${jobId}.exe`); // Move the file to the 'outputPath' file path => NOT VISIBLE UNTIL SOMETHING WRITTEN ON IT
    
    // Promise : A promise in JavaScript is an object that represents the eventual completion (or failure) of an asynchronous operation
    // It is like async await
    return new Promise((resolve, reject) => {
        exec(`g++ ${filePath} -o ${outPath} && cd ${outputPath} && ./${jobId}.out < ${inputFilePath}`, // For Linux:  ./${opfileName} .. For Window: .\\${jobId}.exe
            (error, stdout, stderr) => { 
                if (error) {
                    reject(error);
                    return;
                }
                if (stderr) {
                    reject(stderr);
                    return;
                }
                resolve(stdout);
            }
        );
    });
};

// Python execution:
const executePY = (filePath, inputFilePath) => {};

// JavaScript execution:
const executeJS = (filePath, inputFilePath) => {};

// Java execution:
const executeJAVA = (filePath, inputFilePath) => {};

export { executeCPP, executePY, executeJS, executeJAVA };
