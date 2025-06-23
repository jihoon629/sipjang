// src/components/GoogleLoginButton.js
import React from 'react';

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // 백엔드의 Google 인증 시작 라우트로 직접 이동
    // 이 URL은 백엔드 authRoutes.js 에 정의된 router.get('/google', ...) 경로와 일치해야 합니다.
    const googleAuthUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:8001/api'}/auth/google`;
    window.location.href = googleAuthUrl;
  };

  return (
    <button onClick={handleGoogleLogin} style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer' }}>
      <img 
        src="https://developers.google.com/identity/images/g-logo.png" // Google 로고 이미지 (선택 사항)
        alt="Google logo" 
        style={{ marginRight: '10px', height: '20px', verticalAlign: 'middle' }} 
      />
      Google로 로그인
    </button>
  );
};

export default GoogleLoginButton;