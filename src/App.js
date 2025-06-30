import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";

import Main from "./pages/Main/Main";
import Login from "./pages/Login/Login";
import UnifiedSignup from "./pages/Signup/UnifiedSignup"; 
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
    <UserProvider>
      <Router>
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
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
