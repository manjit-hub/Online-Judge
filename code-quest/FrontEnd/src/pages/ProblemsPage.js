import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProblemsCSS.css';

const CodingProblems = () => {
  const [codingProblems, setCodingProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/problems');
        setCodingProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="list">
      <table>
        <thead>
          <tr>
            <th>NO</th>
            <th>TITLE</th>
            <th>DIFFICULTY</th>
            <th>SOLVED</th>
            <th>ACCEPTANCE RATE</th>
          </tr>
        </thead>
        <tbody>
          {codingProblems.map((problem, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{problem.title}</td>
              <td>{problem.difficulty}</td>
              <td>{problem.solved}</td>
              <td>{problem.acceptance_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProblemsPage() {
  return (
    <div className="split">
      <div className="dashboard">
        <button className='btnPrb'><img src="/Assets/DashboardLogo.png" alt="Logo" />Dashboard</button>
        <button className='btnPrb'><img src="/Assets/3LineLogo.png" alt="Logo" />Leaderboard</button>
        <button className='btnPrb'><img src="/Assets/DiscussionLogo.png" alt="Logo" />Discussion</button>
        <button className='btnPrb'><img src="/Assets/ProgressLogo.png" alt="Logo" />Progress</button>
        <button className='btnPrb'><img src="/Assets/ProfileLogo.png" alt="Logo" />Profile</button>
      </div>

      <div className="rightSide">
        <div className="search">
          <h1>Problems</h1>
          <input type="text" className="inpPrb" placeholder="Search Problems" />
        </div>

        <div className="tags">
          <button className='PrbTagsBtn'>All</button>
          <button className='PrbTagsBtn'>Easy</button>
          <button className='PrbTagsBtn'>Medium</button>
          <button className='PrbTagsBtn'>Hard</button>
          <button className='PrbTagsBtn'>Binary Search</button>
          <button className='PrbTagsBtn'>Recursion</button>
          <button className='PrbTagsBtn'>DP</button>
          <button className='PrbTagsBtn'>Back Tracking</button>
          <button className='PrbTagsBtn'>Graph</button>
          <button className='PrbTagsBtn'>Array</button>
          <button className='PrbTagsBtn'>String</button>
          <button className='PrbTagsBtn'>LinkedList</button>
        </div>

        {/* Problems component */}
        <CodingProblems />
      </div>
    </div>
  );
}

export default ProblemsPage;
