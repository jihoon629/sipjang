
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
