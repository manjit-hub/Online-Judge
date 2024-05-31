import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import axios from 'axios';
import './CompilerPageCSS.css';

function CompilerPage() {
    const { problemId } = useParams(); // Assuming you are passing problem ID as a route parameter
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/retproblems/${problemId || ''}`);
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
                                    if(testCase.input)<p><strong>Input:</strong> {testCase.input}</p>
                                    if(testCase.output)<p><strong>Output:</strong> {testCase.output}</p>
                                    if(testCase.explanation) <p><strong>Explanation:</strong> {testCase.explanation}</p>
                                </div>
                                <p>{`Accepted ${problem.acceptance_rate}`}</p>
                                </>
                            ))}
                        </div>
                    ) : (
                        <p>Loading problem...</p>
                    )}
                </div>
                <div className="Comp">
                    <div id="firstTop">
                        <div className="editorial"><Link to="/">Editorials</Link></div>
                        <div className="dropdown">
                            <select id="languageSelect" value={selectedLanguage} onChange={handleLanguageChange}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                                <option value="cpp">C++</option>
                                <option value="csharp">C#</option>
                                <option value="ruby">Ruby</option>
                                <option value="go">Go</option>
                                <option value="swift">Swift</option>
                                <option value="kotlin">Kotlin</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CompilerPage;
