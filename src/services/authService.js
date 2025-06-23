// src/services/authService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const signup = async (userData) => {
  try {
    // 백엔드 엔드포인트가 /auth/signup 이라고 가정합니다.
    // 실제 엔드포인트에 맞게 수정해주세요.
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Signup failed');
  }
};

export const login = async (credentials) => {
  try {
    // 백엔드 엔드포인트가 /auth/login 이라고 가정합니다.
    // 실제 엔드포인트에 맞게 수정해주세요.
    const response = await apiClient.post('/auth/login', credentials);
    // 로그인 성공 시 보통 토큰 등을 반환합니다. 필요에 따라 저장 로직을 추가할 수 있습니다.
    // 예: localStorage.setItem('token', response.data.token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// 필요한 경우 로그아웃 함수 등도 추가할 수 있습니다.
// export const logout = () => {
//   localStorage.removeItem('token');
//   // 추가적인 로그아웃 처리
// };