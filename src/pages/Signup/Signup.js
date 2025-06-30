
import "./Signup.css";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  return (
    <div className="signup-container">
      <div className="signup-statusbar" />
      <header className="signup-header">
        <button className="signup-back-btn" aria-label="뒤로가기" onClick={() => navigate("/login")}> 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="signup-title">회원가입</div>
      </header>
      <main className="signup-main">
        <h2 className="signup-question">어떤 분이신가요?</h2>
        <div className="signup-sub">사용자 유형을 선택해주세요</div>
        <div className="signup-card-list">
          <div className="signup-card" onClick={() => navigate("/worker-signup")}
            style={{ cursor: "pointer" }}>
            <div className="signup-card-icon worker">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#EAF1FF"/><path d="M24 16c-3.314 0-6 2.686-6 6v2h12v-2c0-3.314-2.686-6-6-6Z" stroke="#4666e4" strokeWidth="2"/><path d="M18 28v-2h12v2c0 2.21-3.582 4-8 4s-8-1.79-8-4Z" stroke="#4666e4" strokeWidth="2"/></svg>
            </div>
            <div className="signup-card-title">근로자</div>
            <div className="signup-card-desc">건설 현장에서 일하고 싶어요</div>
            <ul className="signup-card-list-detail">
              <li>일자리 검색 및 지원</li>
              <li>급여 자동 정산</li>
              <li>경력 관리</li>
            </ul>
          </div>
          <div className="signup-card" onClick={() => navigate("/employer-signup")}
            style={{ cursor: "pointer" }}>
            <div className="signup-card-icon employer">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="24" fill="#FFF4E6"/><rect x="16" y="18" width="16" height="16" rx="2" stroke="#FF9C4B" strokeWidth="2"/><rect x="20" y="22" width="8" height="8" rx="1" stroke="#FF9C4B" strokeWidth="2"/></svg>
            </div>
            <div className="signup-card-title">고용주</div>
            <div className="signup-card-desc">인력을 구하고 싶어요</div>
            <ul className="signup-card-list-detail">
              <li>일자리 등록</li>
              <li>근로자 매칭</li>
              <li>급여 관리</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Signup;
