
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./WorkerSignup.css";

function WorkerSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    passwordCheck: "",
    field: "",
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

  const handleFieldSelect = (field) => {
    setForm((prev) => ({ ...prev, field }));
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
        <div className="signup-card-icon worker">
          <svg width="64" height="64" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#EAF1FF"/><path d="M24 16c-3.314 0-6 2.686-6 6v2h12v-2c0-3.314-2.686-6-6-6Z" stroke="#4666e4" strokeWidth="2"/><path d="M18 28v-2h12v2c0 2.21-3.582 4-8 4s-8-1.79-8-4Z" stroke="#4666e4" strokeWidth="2"/></svg>
        </div>
        <div className="signup-role-title">근로자 회원가입</div>
        <button className="signup-type-switch" type="button" onClick={() => navigate("/signup")}>다른 유형 선택</button>
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
              <button type="button" className="signup-cert-btn">인증</button>
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
          <div className="signup-field-label">전문 분야</div>
          <div className="signup-field-row">
            {['철근공', '미장공', '목공', '기타'].map((f) => (
              <button
                type="button"
                key={f}
                className={`signup-field-btn${form.field === f ? ' selected' : ''}`}
                onClick={() => handleFieldSelect(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <label className="signup-agree">
            <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
            이용약관 및 개인정보처리방침에 동의합니다.
          </label>
          <button type="submit" className="signup-submit-btn" disabled={!form.agree}>
            <svg width="22" height="22" fill="none" viewBox="0 0 22 22" style={{marginRight:8}}><circle cx="11" cy="11" r="11" fill="#4666e4"/><path d="M7 11.5l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            회원가입 완료
          </button>
        </form>
      </main>
    </div>
  );
}

export default WorkerSignup;
