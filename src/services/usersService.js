
import { apiClient } from './authService';

// 블록체인 경력 조회
export const getUserExperience = async (id) => {
  try {
    const response = await apiClient.get(`/users/${id}/experience`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user experience for id ${id}:`, error);
    throw error;
  }
};

// 사용자 정보 업데이트
export const updateUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    throw error;
  }
};
