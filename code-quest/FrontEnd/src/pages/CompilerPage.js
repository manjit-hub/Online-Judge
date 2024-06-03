import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import './CompilerPageCSS.css';

function CompilerPage() {
    const { _id: problemId } = useParams(); // Assuming you are passing problem ID as a route parameter
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState("");
    const [manualTestCase, setManualTestCase] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/compiler/${problemId || ''}`);
                setProblem(response.data);
            } 
            catch (error) {
                console.error('Error fetching problem data:', error);
            }
        };

        fetchProblem();
    }, [problemId]);

    const handleLanguageChange = (e) => {
        setSelectedLanguage(e.target.value);
    };

    const handleCodeChange = (e) =>{
        setCode(e.target.value);
    }

    const handleManualTestCaseChange = (e) => {
        setManualTestCase(e.target.value);
    };

    const handleRun = () => {
        console.log("Run clicked");
    };
    const handleSubmit = () => {
        console.log("Submit clicked");
    };
    return (
        <div>
            {/* HEADER  */}
            <div className="headerComp">
                <div className="left">
                    <img src="/Assets/logo.png" alt="Logo" />
                </div>
                <div className="right">
                    <Link to="/problems">Problems</Link>
                    <Link to="/"><img src="/Assets/ProfileLogo.png" className="profileLogo" alt="Logo" /></Link>
                </div>
            </div>

            {/* CONTENT  */}
            <div className="contentCompiler">
                <div className="ProblemDesc">
                    {problem ? (
                        <div>
                            <h1>{`${problem.number}: ${problem.title}`}</h1>
                            <p>{problem.description}</p>
                            {problem.testCases.map((testCase, index) => (
                                <>
                                <div key={index}>
                                    <h3>{`Test Case ${index + 1}`}</h3>
                                    <p><strong>Input:</strong> {testCase.input}</p>
                                    <p><strong>Output:</strong> {testCase.output}</p>
                                    <p><strong>Explanation:</strong> <br /> {testCase.explanation}</p>
                                </div>
                                <p>{`Accepted : ${problem.acceptance_rate}`}</p>
                                </>
                            ))}
                        </div>
                    ) : (
                        <p>Loading problem...</p>
                    )}
                </div>
                <div className="Comp">
                    <div className="firstTop">
                        <div className="actionButtons">
                            <button className="runButton" onClick={handleRun}>Run</button>
                            <button className="submitButton" onClick={handleSubmit}>Submit</button>
                        </div>
                        <div className="rightSide">
                            <div className="editorial"><Link to="/">Editorials</Link></div>
                            <div className="dropdown">
                            <select id="languageSelect" value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="js">JavaScript</option>
                                <option value="py">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="cs">C#</option>
                                <option value="rb">Ruby</option>
                                <option value="go">Go</option>
                                <option value="swift">Swift</option>
                                <option value="kt">Kotlin</option>
                            </select>
                            </div>
                        </div>
                    </div>
                    {/* Code Editor */}
                    <div className="codeEditor">
                        <textarea
                            className="codeInput"
                            value={code}
                            onChange={handleCodeChange}
                            placeholder="Write your code here..."
                        />
                    </div>
                    {/* Input Box  */}
                    <div className="manualTestCaseInput">
                        <textarea
                            className="manualTestCase"
                            value={manualTestCase}
                            onChange={handleManualTestCaseChange}
                            placeholder="Enter your test cases here..."
                        />
                    </div>
                    {/* Output Box  */}
                    <div className="outputBox">
                        <textarea
                            className="outputDisplay"
                            value={output}
                            readOnly
                            placeholder="Output will be displayed here..."
                        />
                    </div>
                    {/* Buttons 
                    <div className="actionButtons">
                        <button className="runButton" onClick={handleRun}>Run</button>
                        <button className="submitButton" onClick={handleSubmit}>Submit</button>
                    </div> */}

                </div>
            </div>
        </div>
    );
}

export default CompilerPage;
