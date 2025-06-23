// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
// import HomePage from './pages/HomePage'; // 예시: 홈페이지 컴포넌트

// 기본 App.css를 사용하거나 필요에 따라 스타일을 수정합니다.
import './App.css';

// 간단한 네비게이션 스타일
const navStyle = {
  backgroundColor: '#f0f0f0',
  padding: '10px 20px',
  marginBottom: '20px',
  display: 'flex',
  gap: '15px',
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  fontWeight: 'bold',
};

// 임시 홈페이지 컴포넌트 (실제 프로젝트에서는 별도 파일로 만듭니다)
function HomePage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>환영합니다!</h1>
      <p>애플리케이션의 메인 페이지입니다.</p>
    </div>
  );
}


function App() {
  return (
    <Router>
      <div>
        <nav style={navStyle}>
          <Link to="/" style={linkStyle}>홈</Link>
          <Link to="/login" style={linkStyle}>로그인</Link>
          <Link to="/signup" style={linkStyle}>회원가입</Link>
        </nav>

        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} /> {/* 기본 홈페이지 라우트 */}
          {/* 다른 라우트들을 여기에 추가할 수 있습니다. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;