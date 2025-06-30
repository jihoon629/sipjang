
import axios from 'axios';

const API_URL = 'http://localhost:8001/api/applications';

// 지원 상태 변경 (승인/거절)
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await axios.put(`${API_URL}/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating application status for id ${id}:`, error);
    throw error;
  }
};

// 평가 완료 및 경력 기록
export const completeApplication = async (id) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing application for id ${id}:`, error);
    throw error;
  }
};
