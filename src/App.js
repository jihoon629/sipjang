import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import JobPostingPage from './pages/JobPostingPage';
import JobPostingDetailPage from './pages/JobPostingDetailPage';
import ApplicationsManagePage from './pages/ApplicationsManagePage';
import ResumePage from './pages/ResumePage';
import ResumeDetailPage from './pages/ResumeDetailPage'; // 이력서 상세 페이지 임포트
import SearchPage from './pages/SearchPage';
import LLMTestPage from './pages/LLMTestPage';
import RecommendationPage from './pages/RecommendationPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import ExperiencePage from './pages/ExperiencePage'; // 경력 페이지 임포트
import axios from 'axios';
import { getCurrentUser } from './services/authService';

axios.defaults.withCredentials = true;

function App() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser();
        if (user && user.id) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.log('Failed to fetch current user on app load.', error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Sipjang Test Frontend</h1>
      <p>Current User ID: {currentUserId || 'Not Logged In'}</p>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
          <li><Link to="/auth">Auth</Link></li>
          <li><Link to="/job-postings">Job Postings</Link></li>
          <li><Link to="/resumes">Resumes</Link></li>
          <li><Link to="/my-applications">My Applications</Link></li>
          {currentUserId && <li><Link to={`/users/${currentUserId}/experience`}>My Experience</Link></li>}
          <li><Link to="/search">Search</Link></li>
          <li><Link to="/llm-test">LLM Test</Link></li>
          <li><Link to="/recommend">Recommend</Link></li>
        </ul>
      </nav>

      <hr style={{ margin: '20px 0' }} />

      <Routes>
        <Route path="/auth" element={<AuthPage setCurrentUserId={setCurrentUserId} />} />
        <Route path="/job-postings" element={<JobPostingPage currentUserId={currentUserId} />} />
        <Route path="/job-postings/:id" element={<JobPostingDetailPage currentUserId={currentUserId} />} />
        <Route path="/job-postings/:id/applications" element={<ApplicationsManagePage />} />
        <Route path="/resumes" element={<ResumePage currentUserId={currentUserId} />} />
        <Route path="/resumes/:id" element={<ResumeDetailPage />} />
        <Route path="/my-applications" element={<MyApplicationsPage />} />
        <Route path="/users/:id/experience" element={<ExperiencePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/llm-test" element={<LLMTestPage />} />
        <Route path="/recommend" element={<RecommendationPage />} />
        <Route path="/" element={<h2>Welcome! Select a section from above.</h2>} />
      </Routes>
    </div>
  );
}

export default App;
