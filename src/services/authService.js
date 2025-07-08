// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = '/api';

// axios 인스턴스 생성 시 withCredentials 옵션 추가
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false, // 쿠키 대신 세션 스토리지를 사용하므로 false로 설정  
});

// 요청 인터셉터: 모든 요청에 토큰을 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('jwtToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
); 
 
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
    // 로그인 성공 시 응답 본문에서 토큰을 받아 세션 스토리지에 저장
    if (response.data.token) {
      sessionStorage.setItem('jwtToken', response.data.token);
    }
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
  } finally {
    // 로그아웃 성공 여부와 관계없이 클라이언트 측 세션 스토리지에서 토큰 제거
    sessionStorage.removeItem('jwtToken');
  }
};
