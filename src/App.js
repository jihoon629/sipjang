
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import WorkerSignup from "./pages/WorkerSignup/WorkerSignup";
import EmployerSignup from "./pages/EmployerSignup/EmployerSignup";
import JobList from "./pages/Jobs/JobList/JobList";
import JobDetail from "./pages/Jobs/JobDetail/JobDetail";
import MyPage from "./pages/MyPage/MyPage";
import HomePage from "./pages/Home/HomePage";
import Calendar from "./pages/Calendar/Calendar";
import Resume from "./pages/Resume/Resume";
import Nearby from "./pages/Nearby/Nearby";

import AIJobs from "./pages/AIJobs/AIJobs";
import Messages from "./pages/Messages/Messages";

function App() {
  return (
    <Router>
      <div className="app">
        {/* Tailwind 제거, 기존 CSS 사용 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/main" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/worker-signup" element={<WorkerSignup />} />
          <Route path="/employer-signup" element={<EmployerSignup />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/nearby" element={<Nearby />} />
          <Route path="/aijobs" element={<AIJobs />} />
          <Route path="/messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
