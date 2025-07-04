import axios from 'axios';

const API_URL = '/api/favorites';

// 사용자의 즐겨찾기 목록 가져오기
export const getFavorites = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        throw error;
    }
};

// 즐겨찾기 추가
export const addFavorite = async (jobPostingId) => {
    try {
        const response = await axios.post(`${API_URL}/${jobPostingId}`);
        return response.data;
    } catch (error) {
        console.error('Error adding favorite:', error);
        throw error;
    }
};

// 즐겨찾기 삭제
export const removeFavorite = async (jobPostingId) => {
    try {
        const response = await axios.delete(`${API_URL}/${jobPostingId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing favorite:', error);
        throw error;
    }
};