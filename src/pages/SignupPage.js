// src/pages/SignupPage.js
import React, { useState } from 'react';
import { signup } from '../services/authService';
// 라우팅을 위해 react-router-dom의 useNavigate를 사용할 수 있습니다.
// import { useNavigate } from 'react-router-dom';

// 기본 스타일 (인라인으로 작성, 실제 프로젝트에서는 CSS 파일이나 CSS-in-JS 사용 권장)
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
  backgroundColor: '#007bff',
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

function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // const navigate = useNavigate(); // 로그인 성공 후 페이지 이동을 위해

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !email || !password) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const userData = { username, email, password };
      const data = await signup(userData);
      console.log('Signup successful:', data);
      setSuccessMessage('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.'); // 성공 메시지 설정
      // 성공 후 로그인 페이지로 이동하거나, 사용자 정보를 상태에 저장하는 등의 처리를 할 수 있습니다.
      // 예: navigate('/login');
      // 필드 초기화
      setUsername('');
      setEmail('');
      setPassword('');

      // 잠시 후 로그인 페이지로 리다이렉트 (예시)
      // setTimeout(() => {
      //   navigate('/login');
      // }, 2000);

    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error('Signup page error:', err);
    }
  };

  return (
    <div style={pageStyle}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit} style={formStyle}>
        {error && <p style={errorStyle}>{error}</p>}
        {successMessage && <p style={successStyle}>{successMessage}</p>}
        <div>
          <input
            type="text"
            placeholder="사용자 이름"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit" style={buttonStyle}>가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage; // <--- 이 부분을 정확히 확인