// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 외부에서도 호출 가능하게 정의
  const fetchUser = async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 앱 최초 로드 시 사용자 정보 자동 확인
  useEffect(() => {
    fetchUser();
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout user:', error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        loginUser,
        logoutUser,
        fetchUser, // ✅ 외부 컴포넌트에서 useUser().fetchUser 가능
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// ✅ Context를 쉽게 가져올 수 있게 훅 제공
export const useUser = () => useContext(UserContext);
