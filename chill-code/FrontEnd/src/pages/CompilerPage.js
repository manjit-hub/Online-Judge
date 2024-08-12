import React, { useState } from 'react';
import './CompilerPageCSS.css';

function CompilerPage() {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');

  const handleRun = () => {
    // Logic to run code
  };

  const handleSubmit = () => {
    // Logic to submit code
  };

  return (
    <div className="compiler-container">
      <div className="toolbar">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <button className="blue" onClick={handleRun}>Run</button>
        <button className="green" onClick={handleSubmit}>Submit</button>
      </div>
      <div className="editor">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your code here..."
        />
      </div>
      <div className="output">
        <h3>Output:</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default CompilerPage;
