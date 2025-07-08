import { apiClient } from './authService';
// 전체 구인공고 조회
export const getJobPostings = async () => {
  try {
    const response = await apiClient.get('/job-postings');
    return response.data;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
};

// 구인공고 상세 조회
export const getJobPostingDetails = async (id) => {
  try {
    const response = await apiClient.get(`/job-postings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job posting details for id ${id}:`, error);
    throw error;
  }
};

// 사용자별 구인공고 조회
export const getUserJobPostings = async (userId) => {
  try {
    const response = await apiClient.get(`/job-postings/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job postings for user ${userId}:`, error);
    throw error;
  }
};

// 구인공고 생성
export const createJobPosting = async (data) => {
  try {
    const response = await apiClient.post('/job-postings', data);
    return response.data;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
};

// 구인공고 수정
export const updateJobPosting = async (id, data) => {
  try {
    const response = await apiClient.put(`/job-postings/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating job posting ${id}:`, error);
    throw error;
  }
};

// 구인공고 삭제
export const deleteJobPosting = async (id) => {
  try {
    const response = await apiClient.delete(`/job-postings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job posting ${id}:`, error);
    throw error;
  }
};

// 구인공고 유사도 검색
export const searchJobPostings = async (query, field) => {
  try {
    const response = await apiClient.get(`/job-postings/search/similarity?query=${query}&field=${field}`);
    return response.data;
  } catch (error) {
    console.error('Error searching job postings:', error);
    throw error;
  }
};


// 공고에 지원하기
export const applyToJob = async (id, resumeId) => {
  try {
    const response = await apiClient.post(`/job-postings/${id}/apply`, { resumeId });
    return response.data;
  } catch (error) {
    console.error(`Error applying to job posting ${id}:`, error);
    throw error;
  }
};

// 특정 공고의 지원자 목록 조회
export const getJobApplicants = async (id) => {
  try {
    const response = await apiClient.get(`/job-postings/${id}/applications`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching applicants for job posting ${id}:`, error);
    throw error;
  }
};

// 특정 공고의 모든 완료된 지원서에 급여 일괄 기록
export const recordPaymentsForAll = async (jobPostingId, paymentDate) => {
  try {
    const response = await apiClient.post(`/job-postings/${jobPostingId}/record-payments-for-all`, { paymentDate });
    return response.data;
  } catch (error) {
    console.error(`Error recording payments for job posting ${jobPostingId}:`, error);
    throw error;
  }
};

// 거리 기반 구인공고 검색
export const searchJobPostingsByDistance = async (lat, lon, dist) => {
  try {
    const response = await apiClient.get(`/job-postings/search/distance?lat=${lat}&lon=${lon}&dist=${dist}`);
    return response.data;
  } catch (error) {
    console.error(`Error searching job postings by distance:`, error);
    throw error;
  }
};

// 구인공고 상태 수정
export const updateJobPostingStatus = async (id, status) => {
  try {
    const response = await apiClient.put(`/job-postings/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating job posting status ${id}:`, error);
    throw error;
  }
};