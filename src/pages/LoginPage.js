// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate import
import { login } from '../services/authService';
// 라우팅을 위해 react-router-dom의 useNavigate를 사용할 수 있습니다.
// import { useNavigate } from 'react-router-dom';
import GoogleLoginButton from '../components/GoogleLoginButton'; // <-
const pageStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '80vh',
  fontFamily: 'Arial, sans-serif',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const inputStyle = {
  marginBottom: '10px',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
};

const buttonStyle = {
  padding: '10px 15px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: '#28a745', // 로그인 버튼 색상 변경
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const errorStyle = {
  color: 'red',
  marginBottom: '10px',
  fontSize: '14px',
};

const successStyle = {
    color: 'green',
    marginBottom: '10px',
    fontSize: '14px',
};


// src/pages/LoginPage.js
// ... (import 구문 및 스타일, 함수 정의는 그대로)

function LoginPage() {
    const [email, setemail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
  
    // handleGoogleLogin 함수는 GoogleLoginButton 컴포넌트 내부에서 처리하므로
    // LoginPage에서는 직접 사용할 필요가 없습니다.
    // const handleGoogleLogin = () => {
    //   window.location.href = 'http://localhost:8001/api/auth/google';
    // };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setSuccessMessage('');
  
      if (!email || !password) {
        setError('사용자 이름(또는 이메일)과 비밀번호를 모두 입력해주세요.');
        return;
      }
  
      try {
        const credentials = { email, password };
        const data = await login(credentials);
        console.log('Login successful:', data);
        setSuccessMessage('로그인에 성공했습니다! 메인 페이지로 이동합니다.');
  
        setTimeout(() => {
          navigate('/'); 
        }, 1000);
        
      } catch (err) {
        setError(err.message || '로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.');
        console.error('Login page error:', err);
      }
    };
  
    return (
      // GoogleLoginButton을 다른 요소들을 감싸는 용도로 사용하지 않습니다.
      // GoogleLoginButton은 독립적인 버튼입니다.
      <div style={pageStyle}>
        <h2>로그인</h2>
  
        {/* Google 로그인 버튼을 여기에 배치합니다. */}
        <div style={{ marginBottom: '20px' }}> {/* 버튼과 폼 사이 간격 추가 */}
          <GoogleLoginButton />
        </div>
        
        {/* 기존 로그인 폼 */}
        <form onSubmit={handleSubmit} style={formStyle}>
          {error && <p style={errorStyle}>{error}</p>}
          {successMessage && <p style={successStyle}>{successMessage}</p>}
          <div>
            <input
              type="text"
              placeholder="사용자 이름 또는 이메일"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <button type="submit" style={buttonStyle}>로그인</button>
        </form>
        {/* <p style={{ marginTop: '15px' }}>
          계정이 없으신가요? <a href="/signup">회원가입</a>
        </p> */}
      </div>
    );
  }
  
  export default LoginPage;
