
import { apiClient } from './authService';

// 내 지원 내역 조회
export const getMyApplications = async () => {
  try {
    const response = await apiClient.get('/ /my');
    return response.data;
  } catch (error) {
    console.error('Error fetching my applications:', error);
    throw error;
  }
};

// 지원 상태 변경 (승인/거절)
export const updateApplicationStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/applications/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating application status for id ${id}:`, error);
    throw error;
  }
};

// 평가 완료 및 경력 기록
export const completeApplication = async (id) => {
  try {
    const response = await apiClient.post(`/applications/${id}/complete`);
    return response.data;
  } catch (error) {
    console.error(`Error completing application for id ${id}:`, error);
    throw error;
  }
};

// 내 급여 내역 조회
export const getMySalaries = async () => {
  try {
    const response = await apiClient.get('/salaries/my');
    return response.data;
  } catch (error) {
    console.error('Error fetching my salaries:', error);
    throw error;
  }
};