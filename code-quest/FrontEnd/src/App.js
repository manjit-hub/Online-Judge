import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsPage from './pages/ProblemsPage';
import AddProblemPage from './pages/AddProblemPage';
import CompilerPage from './pages/CompilerPage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/problemslist" element={<ProblemsPage />} />
        <Route path="/add-problem" element={<AddProblemPage />} />
        <Route path="/problems/:problemId" element={<CompilerPage />} />
      </Routes>

      {/* <CompilerPage/> */}
    </div>
  );
}

export default App;
