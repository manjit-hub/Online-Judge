// ProblemsPage.js
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import './ProblemsCSS.css';
import { UserContext } from './UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTachometerAlt, FaTrophy, FaComments, FaChartLine, FaUser, FaPlus } from 'react-icons/fa';

const CodingProblems = () => {
  const [codingProblems, setCodingProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/problemslist`);
        setCodingProblems(response.data);
      } catch (error) {
        console.error('Error fetching problems:', error);
      }
    };

    fetchProblems();
  }, []);

  return (
    <div className="list">
      <ToastContainer />
      <table>
        <thead>
          <tr>
            <th>NUMBER</th>
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
              <td>
                <div className="prbTitle">
                  <Link to={`/problems/${problem._id}`}>{problem.title}</Link>
                </div>
              </td>
              <td>{problem.difficulty}</td>
              <td>{problem.solved ? 'Yes' : 'No'}</td>
              <td>{problem.acceptance_rate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProblemsPage = () => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTags, setActiveTags] = useState([]);
  const navigate = useNavigate();
  const user = useContext(UserContext);

  // Check if user is not logged in
  if (!user || !user.user || !user.user._id) {
    toast.error("Please log in to view problems", { position: "top-center" });
    return <Navigate to="/login" replace />;
  }

  const handleDashMainBtnClick = () => {
    setIsMinimized(prevState => !prevState);
  };

  const onClickProfileBtn = () => {
    if (user && user.user._id) {
      navigate(`/profile/${user.user._id}`);
    } else {
      console.error('User ID not found');
      toast.error('User ID not found!', { position: "top-center" });
      setTimeout(() => {
        navigate(`/login`);
      }, 2000);
    }
  };

  const handleTagClick = (tag) => {
    setActiveTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  return (
    <div>
      <div className="split">
        <div className={`dashboard ${isMinimized ? 'minimized' : ''}`}>
          <button className='btnPrb dashMainBtn' onClick={handleDashMainBtnClick}>
            <FaTachometerAlt className="icon" />
            <span>Dashboard</span>
          </button>
          {/* Dashboard buttons */}
          <button className='btnPrb'>
            <FaTrophy className="icon" />
            <span>Leaderboard</span>
          </button>
          <button className='btnPrb'>
            <FaComments className="icon" />
            <span>Discussion</span>
          </button>
          <button className='btnPrb'>
            <FaChartLine className="icon" />
            <span>Progress</span>
          </button>
          <button className='btnPrb' onClick={onClickProfileBtn}>
            <FaUser className="icon" />
            <span>Profile</span>
          </button>
          
          {/* Conditional Add Problem button for Admin */}
          {user?.user?.Admin && (
            <button className='btnPrb' onClick={() => navigate('/problems/add-problem')}>
              <FaPlus className="icon" />
              <span>Add Problem</span>
            </button>
          )}
        </div>

        <div className="prbRightSide">
          <div className="search">
            <h1>Problems</h1>
            <input type="text" className="inpPrb" placeholder="Search Problem" />
          </div>

          <div className="tags">
            <button
              className={`PrbTagsBtn ${activeTags.includes('All') ? 'active' : ''}`}
              onClick={() => handleTagClick('All')}
            >
              All
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Easy') ? 'active' : ''}`}
              onClick={() => handleTagClick('Easy')}
            >
              Easy
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Medium') ? 'active' : ''}`}
              onClick={() => handleTagClick('Medium')}
            >
              Medium
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Hard') ? 'active' : ''}`}
              onClick={() => handleTagClick('Hard')}
            >
              Hard
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Binary Search') ? 'active' : ''}`}
              onClick={() => handleTagClick('Binary Search')}
            >
              Binary Search
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Recursion') ? 'active' : ''}`}
              onClick={() => handleTagClick('Recursion')}
            >
              Recursion
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('DP') ? 'active' : ''}`}
              onClick={() => handleTagClick('DP')}
            >
              DP
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Back Tracking') ? 'active' : ''}`}
              onClick={() => handleTagClick('Back Tracking')}
            >
              Back Tracking
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Graph') ? 'active' : ''}`}
              onClick={() => handleTagClick('Graph')}
            >
              Graph
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('Array') ? 'active' : ''}`}
              onClick={() => handleTagClick('Array')}
            >
              Array
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('String') ? 'active' : ''}`}
              onClick={() => handleTagClick('String')}
            >
              String
            </button>
            <button
              className={`PrbTagsBtn ${activeTags.includes('LinkedList') ? 'active' : ''}`}
              onClick={() => handleTagClick('LinkedList')}
            >
              LinkedList
            </button><button
              className={`PrbTagsBtn ${activeTags.includes('LinkedList') ? 'active' : ''}`}
              onClick={() => handleTagClick('LinkedList')}
            >
              Trie
            </button>
          </div>

          <CodingProblems />
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
