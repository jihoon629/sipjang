
import React, { useState } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

import { FiChevronLeft } from "react-icons/fi";
import { MdEmail, MdLock } from "react-icons/md";
import { BsEye, BsEyeSlash } from "react-icons/bs";


function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      alert("로그인 성공");
      navigate("/");
    } catch (error) {
      alert("로그인 실패: " + (error.message || "알 수 없는 오류"));
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <button className="login-back" type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
          <FiChevronLeft size={24} /> 뒤로
        </button>
        <span className="login-title" style={{fontWeight:700}}>로그인</span>
      </header>
      <div className="login-logo-box">
        <div className="login-logo-gradient"><span className="login-logo-text">내</span></div>
        <div className="login-logo-title">내일</div>
        <div className="login-logo-desc">블록체인 건설 일자리 플랫폼</div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-label">이메일</label>
        <div className="login-input-box">
          <span className="login-input-icon"><MdEmail size={20} /></span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="이메일을 입력하세요" required />
        </div>

        <label className="login-label">비밀번호</label>
        <div className="login-input-box">
          <span className="login-input-icon"><MdLock size={20} /></span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
          <span className="login-input-eye" onClick={() => setShowPassword((v) => !v)} style={{cursor:'pointer'}}>
            {showPassword ? <BsEyeSlash size={18}/> : <BsEye size={18}/>} 
          </span>
        </div>

        <button className="login-btn-main" type="submit">로그인</button>
      </form>

      <Link to="#" className="login-forgot">비밀번호를 잊으셨나요?</Link>
      <div className="login-divider"><span>또는</span></div>
      <button className="login-btn-social google">Google로 계속하기</button>
      <div className="login-bottom">
        계정이 없으신가요? <Link to="/signup" className="login-signup-link">회원가입</Link>
      </div>
    </div>
  );
}

export default Login;
