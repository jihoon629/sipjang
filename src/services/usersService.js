
import axios from 'axios';

const API_URL = 'http://localhost:8001/api/users';

// 블록체인 경력 조회
export const getUserExperience = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/experience`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching user experience for id ${id}:`, error);
    throw error;
  }
};
