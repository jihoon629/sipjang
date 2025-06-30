import React, { useState } from 'react';
import * as authService from '../services/authService';

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
      const response = await authService.signup(registerForm);
      setMessage(`Register Success: ${response.message}`);
    } catch (error) {
      setMessage(`Register Error: ${error.message}`);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(loginForm);
      setMessage(`Login Success: ${response.message} (Token will be in HTTP-only cookie)`);
      const meResponse = await authService.getCurrentUser();
      if (meResponse.id) {
        setCurrentUserId(meResponse.id);
        setMessage(prev => prev + ` User ID: ${meResponse.id}`);
      } else {
        setMessage(prev => prev + ` Failed to get user ID from /auth/me`);
      }
    } catch (error) {
      setMessage(`Login Error: ${error.message}`);
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
