import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProblemCSS.css';

function AddProblemPage() {
  const [problemData, setProblemData] = useState({
    title: '',
    difficulty: 'Easy', // Set default difficulty to Easy
    description: '',
    acceptanceRate: 0, // Initialize acceptance rate to 0
    testCases: [{ input: '', output: '', explanation: '' }], // Add explanation field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProblemData({
      ...problemData,
      [name]: value,
    });
  };

  const handleTestCaseChange = (index, e) => {
    const { name, value } = e.target;
    const newTestCases = [...problemData.testCases];
    newTestCases[index][name] = value;
    setProblemData({ ...problemData, testCases: newTestCases });
  };

  const addTestCase = () => {
    setProblemData({
      ...problemData,
      testCases: [...problemData.testCases, { input: '', output: '', explanation: '' }],
    });
  };

  const removeTestCase = () => {
    if (problemData.testCases.length > 1) {
      setProblemData({
        ...problemData,
        testCases: problemData.testCases.slice(0, -1),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/problemslist', problemData);
      toast.success('Problem added successfully', { position: 'top-center' });
      console.log('Problem added:', response.data);
      // Reset form
      setProblemData({
        title: '',
        difficulty: 'Easy',
        description: '',
        acceptanceRate: 0,
        testCases: [{ input: '', output: '', explanation: '' }], // Reset testCases
      });
    } catch (error) {
      toast.error('Error adding problem', { position: 'top-center' });
      console.error('Error adding problem:', error);
    }
  };

  return (
    <div className="add-problem-page">
      <h1>Add New Problem</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input type="text" name="title" value={problemData.title} onChange={handleChange} required />
        </label>
        <label>
          Difficulty:
          <select name="difficulty" value={problemData.difficulty} onChange={handleChange} required>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </label>
        <label>
          Acceptance Rate:
          <input type="number" name="acceptanceRate" value={problemData.acceptanceRate} onChange={handleChange} required />
        </label>
        <label>
          Description:
          <label><textarea name="description" className='descTxt' value={problemData.description} onChange={handleChange} required /> </label>
        </label>
        <div className="test-cases">
          <h3>Test Cases</h3>
          {problemData.testCases.map((testCase, index) => (
            
            <div key={index}>
              <label>
                Input:
                <input type="text" name="input" value={testCase.input} onChange={(e) => handleTestCaseChange(index, e)} required />
              </label>
              <label>
                Output:
                <input type="text" name="output" value={testCase.output} onChange={(e) => handleTestCaseChange(index, e)} required />
              </label>
              <label>
                Explanation:
                <input type="text" name="explanation" value={testCase.explanation} onChange={(e) => handleTestCaseChange(index, e)} />
              </label>
            </div>
          ))}
          <div className="AddPrbBtn">
            <button type="button" onClick={addTestCase}>Add Test Case</button>
            <button type="button" onClick={removeTestCase}>Remove Test Case</button>
          </div>
        </div>
        <button type="submit" className="submitBtn">Add Problem</button>
      </form>
      <ToastContainer position="top-center" />
    </div>
  );
}

export default AddProblemPage;