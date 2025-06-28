import React from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  return (
    <div className="login-page">
      <header className="login-header">
        <button className="login-back" type="button" aria-label="뒤로가기" onClick={() => navigate("/")}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="login-title">로그인</span>
      </header>
      <div className="login-logo-box">
        <div className="login-logo-gradient">
          <span className="login-logo-text">내</span>
        </div>
        <div className="login-logo-title">내일</div>
        <div className="login-logo-desc">블록체인 건설 일자리 플랫폼</div>
      </div>
      <form className="login-form">
        <label>이메일</label>
        <div className="login-input-box">
          <span className="login-input-icon">📧</span>
          <input type="email" placeholder="이메일을 입력하세요" />
        </div>
        <label>비밀번호</label>
        <div className="login-input-box">
          <span className="login-input-icon">🔒</span>
          <input type="password" placeholder="비밀번호를 입력하세요" />
          <span className="login-input-eye">👁️</span>
        </div>
        <button className="login-btn-main" type="submit">로그인</button>
      </form>
      <Link to="#" className="login-forgot">비밀번호를 잊으셨나요?</Link>
      <div className="login-divider"><span>또는</span></div>
      <button className="login-btn-social google"><span className="login-social-icon" />Google로 계속하기</button>
      <div className="login-bottom">
        계정이 없으신가요? <Link to="/signup" className="login-signup-link">회원가입</Link>
      </div>
    </div>
  );
}

export default Login;