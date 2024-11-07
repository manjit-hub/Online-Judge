import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import {Helmet} from "react-helmet";
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProblemsPage from './pages/ProblemsPage';
import AddProblemPage from './pages/AddProblemPage';
import CompilerPage from './pages/CompilerPage';
import ProfilePage from './pages/ProfilePage';
import { UserProvider } from './pages/UserContext';
import Header from './pages/Header';
import Footer from './pages/Footer';
import { ThemeProvider } from './pages/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import MouseTrail from './pages/MouseTrail';

function App() {
  const location = useLocation();
  return (
    <ThemeProvider>
      <UserProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Chill N Code</title>
          <link rel="canonical" href="http://mysite.com/example" />
          <meta name="description" content="Helmet application" />
        </Helmet>
        <Header />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/problemslist" element={<ProblemsPage />} />
          <Route path="/problems/add-problem" element={<AddProblemPage />} />
          <Route path="/problems/:problemId" element={<CompilerPage />} />
          <Route path="/profile/:userId" element={<ProfilePage />} />
        </Routes>
        {location.pathname === '/' && <Footer />}
      </UserProvider>
      {/* <MouseTrail /> */}
    </ThemeProvider>
  );
}

export default App;
