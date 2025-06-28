// src/pages/SignupPage.js
import React, { useState } from 'react';
import { signup } from '../services/authService';
// import { useNavigate } from 'react-router-dom';

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
  width: 'calc(100% - 22px)', // padding과 border 고려
};

const selectStyle = { // select 태그를 위한 스타일 추가
  marginBottom: '10px',
  padding: '10px',
  fontSize: '16px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  width: '100%', // select는 padding 적용 방식이 input과 다를 수 있어 100%로 설정
  boxSizing: 'border-box', // padding과 border를 width/height에 포함
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
  const [role, setRole] = useState('worker'); // role 상태 추가, 기본값 'worker'
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!username || !email || !password || !role) { // role 유효성 검사 추가
      setError('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const userData = { username, email, password, role }; // role 추가
      const data = await signup(userData);
      console.log('Signup successful:', data);
      setSuccessMessage('회원가입에 성공했습니다! 로그인 페이지로 이동합니다.');
      setUsername('');
      setEmail('');
      setPassword('');
      setRole('worker'); // 필드 초기화 시 role도 초기화
      // 예: navigate('/login');
      // setTimeout(() => navigate('/login'), 2000);
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
        <div> {/* 역할 선택 드롭다운 추가 */}
          <label htmlFor="role" style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>역할 선택:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={selectStyle} // 새로운 스타일 적용
            required
          >
            <option value="worker">Worker</option>
            <option value="employer">Employer</option>
          </select>
        </div>
        <button type="submit" style={buttonStyle}>가입하기</button>
      </form>
    </div>
  );
}

export default SignupPage;