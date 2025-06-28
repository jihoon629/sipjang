import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function AuthPage({ setCurrentUserId }) {
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'worker',
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, registerForm);
      setMessage(`Register Success: ${response.data.message}`);
    } catch (error) {
      setMessage(`Register Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, loginForm);
      setMessage(`Login Success: ${response.data.message} (Token will be in HTTP-only cookie)`);
      // 로그인 성공 후 /auth/me 엔드포인트 호출하여 사용자 ID 가져오기
      const meResponse = await axios.get(`${API_BASE_URL}/auth/me`);
      if (meResponse.data && meResponse.data.id) {
        setCurrentUserId(meResponse.data.id);
        setMessage(prev => prev + ` User ID: ${meResponse.data.id}`);
      } else {
        setMessage(prev => prev + ` Failed to get user ID from /auth/me`);
      }
    } catch (error) {
      setMessage(`Login Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>Auth Page</h2>

      <h3>Register</h3>
      <form onSubmit={handleRegisterSubmit}>
        <input type="text" name="username" placeholder="Username" value={registerForm.username} onChange={handleRegisterChange} /><br/>
        <input type="email" name="email" placeholder="Email" value={registerForm.email} onChange={handleRegisterChange} /><br/>
        <input type="password" name="password" placeholder="Password" value={registerForm.password} onChange={handleRegisterChange} /><br/>
        <select name="role" value={registerForm.role} onChange={handleRegisterChange}>
          <option value="worker">Worker</option>
          <option value="employer">Employer</option>
        </select><br/>
        <button type="submit">Register</button>
      </form>

      <h3>Login</h3>
      <form onSubmit={handleLoginSubmit}>
        <input type="email" name="email" placeholder="Email" value={loginForm.email} onChange={handleLoginChange} /><br/>
        <input type="password" name="password" placeholder="Password" value={loginForm.password} onChange={handleLoginChange} /><br/>
        <button type="submit">Login</button>
      </form>

      {message && <p><strong>Message:</strong> {message}</p>}
    </div>
  );
}

export default AuthPage;
