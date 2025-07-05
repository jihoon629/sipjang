
import axios from 'axios';

const API_BASE_URL = '/api';

// axios 인스턴스 생성 (인증 관련 설정 통일)
const apiClient = axios.create({
  withCredentials: true, // 쿠키 포함
});

// 이력서 상세 조회
export const getResumeDetails = async (id) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resume details for id ${id}:`, error);
    throw error;
  }
};

// 사용자별 이력서 조회
export const getUserResumes = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/resumes/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching resumes for user ${userId}:`, error);
    throw error;
  }
};

// 이력서 생성
export const createResume = async (data) => {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/resumes`, data);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

// 이력서 저장 (createResume의 별칭)
export const saveResume = async (data) => {
  return createResume(data);
};

// 이력서 수정
export const updateResume = async (id, data) => {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/resumes/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating resume ${id}:`, error);
    throw error;
  }
};

// 이력서 삭제
export const deleteResume = async (id) => {
  try {
    const response = await apiClient.delete(`${API_BASE_URL}/resumes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting resume ${id}:`, error);
    throw error;
  }
};

// 이력서 유사도 검색
export const searchResumes = async (query, field) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/resumes/search/similarity?query=${query}&field=${field}`);
    return response.data;
  } catch (error) {
    console.error('Error searching resumes:', error);
    throw error;
  }
};

// 블록체인 경력 조회
export const getBlockchainExperience = async (userId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/users/${userId}/experience`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching blockchain experience for user ${userId}:`, error);
    throw error;
  }
};

export const getJobRecommendations = async (resumeId) => {
  try {
    const response = await apiClient.get(`${API_BASE_URL}/resumes/${resumeId}/recommendations`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI job recommendations for resume ${resumeId}:`, error);
    throw error;
  }
};

// Resume.js에서 사용할 래퍼 객체 (API.md 사양에 맞춤)
export const resumeAPI = {
  getResume: getResumeDetails,
  createResume: createResume,
  saveResume: saveResume,
  updateResume: updateResume,
  deleteResume: deleteResume,
  getUserResumes: getUserResumes,
  getBlockchainExperience: getBlockchainExperience,
  searchResumes: searchResumes,
  getJobRecommendations: getJobRecommendations // 새로 추가
};

