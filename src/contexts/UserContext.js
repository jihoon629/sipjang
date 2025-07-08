// src/contexts/UserContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { getCurrentUser, logout } from '../services/authService';
import * as favoriteService from '../services/favoriteService'; // favoriteService import

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set()); // 즐겨찾기 상태 (Set으로 변경하여 성능 최적화)

  // 즐겨찾기 목록 가져오기
  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    try {
      const response = await favoriteService.getFavorites();
      // 응답 데이터가 { data: [...] } 형태일 수 있으므로 확인
      const favoritePostings = response.data || response; 
      const favoriteIds = new Set(favoritePostings.map(fav => fav.job_posting_id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
      setFavorites(new Set()); // 에러 발생 시 초기화
    }
  }, [user]);


  // ��용자 정보 가져오기
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setUser(null);
      sessionStorage.removeItem('jwtToken'); // 토큰이 유효하지 않으면 세션 스토리지에서 제거
    } finally {
      setLoading(false);
    }
  }, []);

  // 앱 최초 로드 시 사용자 정보 자동 확인
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // 사용자가 변경될 때마다 즐겨찾기 목록 갱신
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites(new Set()); // 로그아웃 시 즐겨찾기 초기화
    }
  }, [user, fetchFavorites]);


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

  // 즐겨찾기 토글 함수
  const toggleFavorite = async (jobPostingId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(jobPostingId)) {
      await favoriteService.removeFavorite(jobPostingId);
      newFavorites.delete(jobPostingId);
    } else {
      await favoriteService.addFavorite(jobPostingId);
      newFavorites.add(jobPostingId);
    }
    setFavorites(newFavorites);
  };

  // 특정 공고가 즐겨찾기되었는지 확인하는 함수
  const isFavorited = (jobPostingId) => {
    return favorites.has(jobPostingId);
  };


  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        favorites, // 즐겨찾기 목록
        loginUser,
        logoutUser,
        fetchUser,
        toggleFavorite, // 즐겨찾기 토글 함수
        isFavorited, // 즐겨찾기 확인 함수
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

