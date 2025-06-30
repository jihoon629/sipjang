
import React, { useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // 경로 확인 필요


function Login() {
  const navigate = useNavigate();
  // const { loginUser } = useUser(); // useUser 훅 사용 (사용하지 않으므로 주석 처리)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // 새로운 시도 전에 에러 메시지 초기화

    // 클라이언트 측 유효성 검사
    if (!email || !password) {
      setErrorMessage("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }


    

    if (password.length < 6) { // 최소 비밀번호 길이 설정 (예시: 6자)
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true); // 로딩 시작
    try {
      await login({ email, password });
      alert("로그인 성공");
      navigate("/"); // 홈 또는 메인 페이지로 이동
    } catch (error) {
      setErrorMessage(error.message || "로그인 실패: 알 수 없는 오류"); // 에러 메시지 상태 업데이트
    } finally {
      setLoading(false); // 로딩 종료
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
          <span className="login-input-icon">🔒</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요" required />
          <span className="login-input-eye">👁️</span>
        </div>

        <button className="login-btn-main" type="submit" disabled={loading}>{loading ? '로그인 중...' : '로그인'}</button>
        {errorMessage && <p className="login-error-message">{errorMessage}</p>} {/* 에러 메시지 표시 */}
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
