import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import './CompilerPageCSS.css';
import { UserContext } from './UserContext';

function CompilerPage() {
    const user = useContext(UserContext);
    const { problemId, userId } = useParams();
    const navigate = useNavigate();
    const [problem, setProblem] = useState(null);
    const [selectedLanguage, setSelectedLanguage] = useState("cpp");
    const [code, setCode] = useState(`
    #include <bits/stdc++.h> 
    using namespace std;

    int main() {

        cout << "Hello World!";
        
        return 0;  
    }`);
    const [manualTestCase, setManualTestCase] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/problems/${problemId}`);
                setProblem(response.data.problem);
                if (response.data.redirectUrl) {
                    navigate(response.data.redirectUrl);
                }
            } catch (error) {
                console.error('Error fetching problem data:', error);
                toast.error('Error fetching problem data', {
                    position: "top-center",
                });
            }
        };

        fetchProblem();
    }, [problemId, navigate]);

    const handleLanguageChange = (e) => {
        const lang = e.target.value;
        setSelectedLanguage(lang);
        setCode((code) => ({ ...code, lang }));
    };

    const onClickProfileBtn = () => {
        if (user && user._id) { 
          navigate(`/profile/${user._id}`); 
        } else {
          console.error('User ID not found');
        }
      };

    const handleRun = async () => {
        const payload = {
            language: selectedLanguage,
            code,
            manualTestCase,
        };
        if(!code || !manualTestCase) setOutput("Input data is missing !!");
        try {
            const { data } = await axios.post('http://localhost:8000/problems/run', payload);
            console.log(data);
            setOutput(data.output);
        } catch (error) {
            console.log(error.response);
        }
    }

    const handleSubmit = async (e) => {
        const payload = {
            language: selectedLanguage,
            code,
            problemId
        };
        try {
            const { data } = await axios.post('http://localhost:8000/problems/submit', payload);
            console.log(data);

            if (data.success) {
                toast.success(data.verdict, {
                    position: "top-center",
                });
                setOutput(data.verdict);
            } else {
                toast.error(data.verdict, {
                    position: "top-center",
                });
                setOutput(`Verdict: ${data.verdict} \nFailed Test Case: ${JSON.stringify(data.failedTestCase)}`);
            }
        } catch (error) {
            console.error('Error during submission:', error);
            const errorMessage = error.response?.data?.error || "An unexpected error occurred";
            toast.error(errorMessage, {
                position: "top-center",
            });
            setOutput(`Error: ${errorMessage}`);
        }
    };

    return (
        <div>
            {/* HEADER */}
            <div className="headerComp">
                <div className="left">
                    <img src="/Assets/logo.png" alt="Logo" />
                </div>
                <div className="right">
                    <Link to="/problemslist">Problems</Link>
                    <button className="cmpBtn" onClick={onClickProfileBtn}>
                        <img src="/Assets/ProfileLogo.png" className="profileLogo" alt="Logo" />
                    </button>
                </div>
            </div>

            {/* CONTENT */}
            <div className="contentCompiler">
                <div className="ProblemDesc">
                    {problem ? (
                        <div>
                            <h1>{`${problem.number}: ${problem.title}`}</h1>
                            <p>{problem.description}</p>
                            {problem.testCases.slice(0, 2).map((testCase, index) => ( //ONLY FIRST TWO TESCASES
                                <div key={index}>
                                    <h3>{`Test Case ${index + 1}`}</h3>
                                    <p><strong>Input:</strong> {testCase.input}</p>
                                    <p><strong>Output:</strong> {testCase.output}</p>
                                    {testCase.explanation && testCase.explanation.trim() !== '' && (
                                        <p><strong>Explanation:</strong> <br /> {testCase.explanation}</p>
                                    )}
                                </div>
                            ))}
                            <p>{`Acceptance Rate : ${problem.acceptance_rate} %`}</p>
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
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="Write your code here..."
                        />
                    </div>
                    {/* Input Box */}
                    <div className="manualTestCaseInput">
                        <textarea
                            className="manualTestCase"
                            value={manualTestCase}
                            onChange={(e) => setManualTestCase(e.target.value)}
                            placeholder="Enter your test cases here..."
                        />
                    </div>
                    {/* Output Box */}
                    <div className="outputBox">
                        <textarea
                            className="outputDisplay"
                            value={output}
                            readOnly
                            placeholder="Output will be displayed here..."
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CompilerPage;
