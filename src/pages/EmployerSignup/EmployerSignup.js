
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EmployerSignup.css";

function EmployerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordCheck: "",
    company: "",
    agree: false,
  });
  const [showPw, setShowPw] = useState(false);
  const [showPwCheck, setShowPwCheck] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="signup-container">
      <div className="signup-statusbar" />
      <header className="signup-header">
        <button className="signup-back-btn" aria-label="뒤로가기" onClick={() => navigate("/signup")}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="signup-title">회원가입</div>
      </header>
      <main className="signup-main">
        <div className="signup-card-icon employer">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#FFF4E6"/><rect x="16" y="18" width="16" height="16" rx="2" stroke="#FF9C4B" strokeWidth="2"/><rect x="20" y="22" width="8" height="8" rx="1" stroke="#FF9C4B" strokeWidth="2"/></svg>
        </div>
        <div className="signup-role-title employer">고용주 회원가입</div>
        <button className="signup-type-switch employer" type="button" onClick={() => navigate("/signup")}>다른 유형 선택</button>
        <form className="signup-form">
          <label>이름
            <input name="name" value={form.name} onChange={handleChange} placeholder="이름을 입력하세요" autoComplete="off" />
          </label>
          <label>이메일
            <div className="signup-input-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#F5F7FA"/><path d="M4 6.5l6 5 6-5" stroke="#B0B8C1" strokeWidth="1.5" strokeLinejoin="round"/><rect x="4" y="6.5" width="12" height="7" rx="2" stroke="#B0B8C1" strokeWidth="1.5"/></svg>
              <input name="email" value={form.email} onChange={handleChange} placeholder="이메일을 입력하세요" autoComplete="off" />
            </div>
          </label>
          <label>휴대폰 번호
            <div className="signup-phone-row">
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="010-1234-5678" autoComplete="off" />
              <button type="button" className="signup-cert-btn employer">인증</button>
            </div>
          </label>
          <label>비밀번호
            <div className="signup-input-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#F5F7FA"/><path d="M6 10v2a4 4 0 0 0 8 0v-2" stroke="#B0B8C1" strokeWidth="1.5"/><rect x="7" y="7" width="6" height="5" rx="2" stroke="#B0B8C1" strokeWidth="1.5"/></svg>
              <input type={showPw ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="비밀번호를 입력하세요" autoComplete="off" />
              <button type="button" className="signup-eye-btn" onClick={() => setShowPw((v) => !v)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10C3.333 5.833 7.5 3.333 10 3.333c2.5 0 6.667 2.5 8.333 6.667-1.666 4.167-5.833 6.667-8.333 6.667-2.5 0-6.667-2.5-8.333-6.667Z" stroke="#B0B8C1" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="#B0B8C1" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </label>
          <label>비밀번호 확인
            <div className="signup-input-icon">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect width="20" height="20" rx="4" fill="#F5F7FA"/><path d="M6 10v2a4 4 0 0 0 8 0v-2" stroke="#B0B8C1" strokeWidth="1.5"/><rect x="7" y="7" width="6" height="5" rx="2" stroke="#B0B8C1" strokeWidth="1.5"/></svg>
              <input type={showPwCheck ? "text" : "password"} name="passwordCheck" value={form.passwordCheck} onChange={handleChange} placeholder="비밀번호를 다시 입력하세요" autoComplete="off" />
              <button type="button" className="signup-eye-btn" onClick={() => setShowPwCheck((v) => !v)}>
                <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M1.667 10C3.333 5.833 7.5 3.333 10 3.333c2.5 0 6.667 2.5 8.333 6.667-1.666 4.167-5.833 6.667-8.333 6.667-2.5 0-6.667-2.5-8.333-6.667Z" stroke="#B0B8C1" strokeWidth="1.5"/><circle cx="10" cy="10" r="2.5" stroke="#B0B8C1" strokeWidth="1.5"/></svg>
              </button>
            </div>
          </label>
          <label>회사명
            <input name="company" value={form.company} onChange={handleChange} placeholder="회사명을 입력하세요" autoComplete="off" />
          </label>
          <label className="signup-agree">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            이용약관 및 개인정보처리방침에 동의합니다.
          </label>
          <button type="submit" className="signup-submit-btn employer" disabled={!form.agree}>
            <svg width="22" height="22" fill="none" viewBox="0 0 22 22" style={{marginRight:8}}><circle cx="11" cy="11" r="11" fill="#e47a3f"/><path d="M7 11.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            회원가입 완료
          </button>
        </form>
      </main>
    </div>
  );
}

export default EmployerSignup;
