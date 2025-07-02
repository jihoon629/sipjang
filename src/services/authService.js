// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://172.30.112.26/api';

// axios 인스턴스 생성 시 withCredentials 옵션 추가
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 중요: 다른 출처(cross-origin)간 요청에 쿠키를 포함시키기 위해 필요
});

// 백엔드에서 httpOnly 쿠키를 사용하므로, 프론트엔드에서 직접 헤더에 토큰을 추가할 필요가 없습니다.
// 따라서 요청 인터셉터는 필요하지 않습니다.

export const signup = async (userData) => {
  try {
    console.log('Data passed to authService.signup:', userData);
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error in authService:', error.response ? error.response.data : error.message);
    console.error('Full error object in authService:', error);
    throw error.response ? error.response.data : new Error('Signup failed in authService');
  }
};

export const login = async (credentials) => {
  console.log('[authService] Attempting to log in with credentials:', credentials);
  try {
    const response = await apiClient.post('/auth/login', credentials);
    console.log('[authService] Login API call successful. Response:', response.data);
    // 로그인 성공 시 서버가 httpOnly 쿠키로 토큰을 설정해 줄 것이므로,
    // 프론트엔드에서 토큰을 직접 저장할 필요가 없습니다.
    return response.data.user; // user 객체만 반환
  } catch (error) {
    console.error('[authService] Login API call failed:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const getCurrentUser = async () => {
  console.log('[authService] Attempting to get current user...');
  try {
    // withCredentials: true 설정으로 인해 브라우저가 자동으��� 쿠키를 포함하여 요청합니다.
    const response = await apiClient.get('/auth/me');
    console.log('[authService] Get current user API call successful. Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[authService] Get current user API call failed:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Failed to get current user');
  }
};

export const logout = async () => {
  console.log('[authService] Attempting to log out...');
  try {
    // 서버에 로그아웃 요청을 보내 서버 측 세션/쿠키를 무효화합니다.
    await apiClient.post('/auth/logout');
    console.log('[authService] Logout API call successful.');
  } catch (error) {
    console.error('[authService] Logout API call failed:', error.response ? error.response.data : error.message);
    // 에러가 발생하더라도 클라이언트 측에서는 할 수 있는 추가적인 작업이 제한적입니다.
  }
  // 서버가 쿠키를 삭제하므로 클라이언트 측에서는 특별한 처리가 필요 없습니다.
};

// 다른 인증 관련 API 호출 함수들...
