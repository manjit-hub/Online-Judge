import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Automation to create a new code file
const dirCode = path.join(path.resolve(), 'Codes');

// We can also create Language specific folder
// const generateFile = (lang, code) => {
// let dirCode;
// if(lang == 'cpp') dirCode = path.join(path.resolve(), 'Codes/C++');
// else if(lang == 'py') dirCode = path.join(path.resolve(), 'Codes/Python');
// else if(lang == 'js') dirCode = path.join(path.resolve(), 'Codes/JavaScript');

// Now check whether the path exists or not; if not, create that filepath
if (!fs.existsSync(dirCode)) {
    fs.mkdirSync(dirCode, { recursive: true });
}

const generateFile = (lang, code) => {
    const jobId = uuidv4(); // generate random jobId i.e file name
    const fileName = `${jobId}.${lang}`;
    const filePath = path.join(dirCode, fileName); // Move the file to the dirCode file path=> But it will not show inside Codes folder until we write something on that file
    fs.writeFileSync(filePath, code); // Write the code into the file
    return filePath;
};

export { generateFile };