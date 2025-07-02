// App.js

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import JobList from "./pages/Jobs/JobList/JobList";
import JobDetail from "./pages/Jobs/JobDetail/JobDetail";
import Login from "./pages/Login/Login";
import UnifiedSignup from "./pages/Signup/UnifiedSignup";
import Main from "./pages/Main/Main";
import HomePage from "./pages/Home/HomePage";
import MyPage from "./pages/MyPage/MyPage";
import Calendar from "./pages/Calendar/Calendar";
import Resume from "./pages/Resume/Resume";
import Nearby from "./pages/Nearby/Nearby";
import AIJobs from "./pages/AIJobs/AIJobs";
import EmployerJobsPage from "./pages/Employer/EmployerJobsPage";
import JobPostCreatePage from "./pages/Employer/JobPostCreatePage";
import JobPostEditPage from "./pages/Employer/JobPostEditPage"; 







function App() {
  return (
    <UserProvider>
      <Router>
        <Header />
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<UnifiedSignup />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/nearby" element={<Nearby />} />
            <Route path="/aijobs" element={<AIJobs />} />
            <Route path="/Employerjobs" element={<EmployerJobsPage />} />
            <Route path="/job-create" element={<JobPostCreatePage />} />
            <Route path="/job-edit/:id" element={<JobPostEditPage />} />
          </Routes>
        </div>
        <Footer />
      </Router>

    </UserProvider>
  );
}

export default App;
