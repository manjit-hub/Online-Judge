import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddProblemCSS.css';

function AddProblemPage() {
  const [problemData, setProblemData] = useState({
    title: '',
    difficulty: 'Easy',
    description: '',
    inputFormat: '', 
    outputFormat: '', 
    acceptanceRate: 0, 
    tags: [],
    testCases: [{ input: '', inputValue: '', output: '', explanation: '' }], // Add explanation field
  });

  const [allTags, setAllTags] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/tags`);
        setAllTags(response.data);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  // Handle tag selection
  const handleTagChange = (tagId) => {
    setProblemData((prevData) => ({
      ...prevData,
      tags: prevData.tags.includes(tagId)
        ? prevData.tags.filter(id => id !== tagId)
        : [...prevData.tags, tagId]
    }));
  };

  // Filtered tags based on search term
  const filteredTags = allTags.filter(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
      testCases: [...problemData.testCases, { input: '', inputValue: '', output: '', explanation: '' }],
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
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/add-problem`, problemData);
      toast.success('Problem added successfully', { position: 'top-center' });
      console.log('Problem added:', response.data);
      // Reset form
      setProblemData({
        title: '',
        difficulty: 'Easy',
        description: '',
        inputFormat: '', 
        outputFormat: '', 
        acceptanceRate: 0,
        testCases: [{ input: '', inputValue: '', output: '', explanation: '' }], 
        tags: [],
      });
    } catch (error) {
      toast.error('Error adding problem', { position: 'top-center' });
      console.error('Error adding problem:', error.message);
    }
  };

  return (
      <div className="add-problem-page">
        <h1 className='tc'>Add New Problem</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group title">
            <label>Title:</label>
            <input type="text" name="title" value={problemData.title} onChange={handleChange} required />
          </div>

          <div className="flex-row">
            <div className="form-group">
              <label>Difficulty:</label>
              <select name="difficulty" value={problemData.difficulty} onChange={handleChange} required>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="form-group acc_rate">
              <label>Acceptance Rate:</label>
              <input type="number" name="acceptanceRate" value={problemData.acceptanceRate} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea name="description" className="descTxt" value={problemData.description} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Input Format:</label>
            <textarea name="inputFormat" className="inputOutputTxt" value={problemData.inputFormat} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Output Format:</label>
            <textarea name="outputFormat" className="inputOutputTxt" value={problemData.outputFormat} onChange={handleChange} required />
          </div>

          {/* Assigned Tags Section */}
          <div className="form-group">
            <label>Assigned Tags:</label>
            <div>
              {problemData.tags.map(tagId => {
                const tag = allTags.find(tag => tag._id === tagId);
                return tag ? <span key={tagId} className="assigned-tag">{tag.name}</span> : null;
              })}
              <button onClick={() => setIsModalOpen(true)} className="assign-tags-btn">Assign Tags</button>
            </div>
          </div>

          {/* Modal for Tags */}
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>Close</button>
                <input type="text" placeholder="Search tags" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="modal-search" />
                <div className="tags-list">
                  {filteredTags.map(tag => (
                    <label key={tag._id} className={`tag-item ${problemData.tags.includes(tag._id) ? 'selected' : ''}`} onClick={() => handleTagChange(tag._id)}>
                      {tag.name}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Test Cases Section */}
          <div className="test-cases">
            <h3>Test Cases</h3>
            {problemData.testCases.map((testCase, index) => (
              <div key={index}>
                <div className="form-group">
                  <label>Input Display:</label>
                  <input type="text" name="input" placeholder="To display on problem description!" value={testCase.input} onChange={(e) => handleTestCaseChange(index, e)} required />
                </div>
                <div className="form-group">
                  <label>Input on Compiler:</label>
                  <input type="text" name="inputValue" placeholder="In the format of input to the Compiler!" value={testCase.inputValue} onChange={(e) => handleTestCaseChange(index, e)} required />
                </div>
                <div className="form-group">
                  <label>Output:</label>
                  <input type="text" name="output" value={testCase.output} onChange={(e) => handleTestCaseChange(index, e)} required />
                </div>
                <div className="form-group">
                  <label>Explanation:</label>
                  <input type="text" name="explanation" value={testCase.explanation} onChange={(e) => handleTestCaseChange(index, e)} />
                </div>
              </div>
            ))}
            <div className="AddPrbBtn">
              <button type="button" className="addTCBtn" onClick={addTestCase}>Add Another Test Case</button>
              <button type="button" className="removeBtn" onClick={removeTestCase}>Remove Current Test Case</button>
              <button type="submit" className="submitBtn">Add Problem</button>
            </div>
          </div>

          
        </form>

        <ToastContainer position="top-center" />
      </div>
  );
}

export default AddProblemPage;
