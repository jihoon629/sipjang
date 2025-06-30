
import axios from 'axios';

const API_URL = 'http://localhost:8001/api/job-postings';

// 전체 구인공고 조회
export const getJobPostings = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching job postings:', error);
    throw error;
  }
};

// 구인공고 상세 조회
export const getJobPostingDetails = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job posting details for id ${id}:`, error);
    throw error;
  }
};

// 사용자별 구인공고 조회
export const getUserJobPostings = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job postings for user ${userId}:`, error);
    throw error;
  }
};

// 구인공고 생성
export const createJobPosting = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating job posting:', error);
    throw error;
  }
};

// 구인공고 수정
export const updateJobPosting = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating job posting ${id}:`, error);
    throw error;
  }
};

// 구인공고 삭제
export const deleteJobPosting = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting job posting ${id}:`, error);
    throw error;
  }
};

// 구인공고 유사도 검색
export const searchJobPostings = async (query, field) => {
  try {
    const response = await axios.get(`${API_URL}/search/similarity?query=${query}&field=${field}`);
    return response.data;
  } catch (error) {
    console.error('Error searching job postings:', error);
    throw error;
  }
};


// 공고에 지원하기
export const applyToJob = async (id, resumeId) => {
  try {
    const response = await axios.post(`${API_URL}/${id}/apply`, { resumeId });
    return response.data;
  } catch (error) {
    console.error(`Error applying to job posting ${id}:`, error);
    throw error;
  }
};

// 특정 공고의 지원자 목록 조회
export const getJobApplicants = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/applications`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching applicants for job posting ${id}:`, error);
    throw error;
  }
};
