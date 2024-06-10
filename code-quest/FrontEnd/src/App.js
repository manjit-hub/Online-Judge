import { Routes, Route } from 'react-router-dom';
import './App.css';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsPage from './pages/ProblemsPage';
import AddProblemPage from './pages/AddProblemPage';
import CompilerPage from './pages/CompilerPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './pages/UserContext';
function App() {
  return (
    <div>
      <UserProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/problemslist" element={<ProblemsPage />} />
          <Route path="/problems/add-problem" element={<AddProblemPage />} />
          <Route path="/problems/:problemId" element={<CompilerPage />} />
          <Route path="profile/:userId" element={<ProfilePage/>} />
        </Routes>
      </UserProvider>

      {/* <ProfilePage/> */}
    </div>
  );
}

export default App;
