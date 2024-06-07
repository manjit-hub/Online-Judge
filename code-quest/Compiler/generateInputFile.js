import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Automation to create a new Inputs Folder
const dirInput = path.join(path.resolve(), 'Inputs');

// Now check whether the path exists or not; if not, create that filepath
if (!fs.existsSync(dirInput)) {
    fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = async (input) => {
    const jobId = uuidv4(); // generate random jobId i.e file name
    const inputFileName = `${jobId}.txt`;
    const inputFilePath = path.join(dirInput, inputFileName); // Move the file to the dirInput file path=> But it will not show inside Inputs folder until we write something on that file
    await fs.writeFileSync(inputFilePath, input); // Write the input into the file inputFilePath
    return inputFilePath;
};

export { generateInputFile };