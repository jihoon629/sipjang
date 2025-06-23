// src/pages/SocialAuthCallbackPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SocialAuthCallbackPage = () => {
  const location = useLocation(); // 현재 URL 정보를 가져옴
  const navigate = useNavigate(); // 페이지 이동을 위해
  const [message, setMessage] = useState('Google 로그인 처리 중...');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    // 백엔드에서 에러를 쿼리 파라미터로 전달했을 경우 (선택적)
    const authError = params.get('error'); 

    if (authError) {
      console.error('Google OAuth Error:', authError);
      setError(`Google 로그인 실패: ${authError}`);
      setMessage('');
      // 로그인 페이지로 다시 보내거나 에러 메시지 표시
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (token) {
      console.log('Received token:', token);
      // 실제 애플리케이션에서는 이 토큰을 사용하여 사용자 정보를 가져오거나,
      // Context API 또는 상태 관리 라이브러리(Redux, Zustand 등)에 로그인 상태를 업데이트합니다.
      localStorage.setItem('authToken', token); // 예: localStorage에 토큰 저장
      
      // 사용자 정보를 가져오기 위해 추가 API 호출 가능 (선택 사항)
      // 예: const userProfile = await fetchUserProfile(token);
      // setUser(userProfile); // 전역 상태 업데이트

      setMessage('Google 로그인 성공! 잠시 후 메인 페이지로 이동합니다.');
      // 로그인 성공 후 리디렉션 (예: 대시보드 또는 사용자가 이전에 있던 페이지)
      setTimeout(() => {
        // navigate(localStorage.getItem('intendedRoute') || '/dashboard');
        // localStorage.removeItem('intendedRoute'); // 사용 후 제거
        navigate('/dashboard'); // 간단하게 대시보드로 이동
      }, 2000); // 2초 후 이동
    } else {
      console.error('토큰을 받지 못했습니다.');
      setError('로그인 처리 중 오류가 발생했습니다. 토큰이 없습니다.');
      setMessage('');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>소셜 로그인 처리</h1>
      {message && <p>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SocialAuthCallbackPage;