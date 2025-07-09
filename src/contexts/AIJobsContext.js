
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import { getJobRecommendations, getUserResumes } from '../services/resumesService';
import { useUser } from './UserContext';

const AIJobsContext = createContext();

export const useAIJobs = () => useContext(AIJobsContext);

export const AIJobsProvider = ({ children }) => {
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false); // 데이터 요청 여부 플래그
  const fetchedRef = useRef(fetched);

  useEffect(() => {
    fetchedRef.current = fetched;
  }, [fetched]);

  const fetchRecommendations = useCallback(async (force = false) => {
    if (!user || !user.id) {
      setError("로그인이 필요합니다.");
      return;
    }

    // 강제 새로고침이 아니고, 이미 데이터가 있다면 실행하지 않음
    if (!force && fetchedRef.current) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userResumesResponse = await getUserResumes(user.id);
      const userResumes = userResumesResponse.data?.resumes || userResumesResponse.data || [];

      if (userResumes.length === 0) {
        setError("등록된 이력서가 없습니다. 이력서를 먼저 작성해주세요.");
        setRecommendations([]);
        setFetched(true); // 이력서 없는 상태도 확인된 상태임
        return;
      }

      const resumeId = userResumes[0].id;
      const response = await getJobRecommendations(resumeId);
      const fetchedRecommendations = response.data?.postings || [];
      
      setRecommendations(fetchedRecommendations);
      setFetched(true);
    } catch (err) {
      console.error("Error fetching AI job recommendations:", err);
      setError(err.message || "AI 추천 공고를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refetch = useCallback(() => {
    fetchRecommendations(true); // 강제 새로고침
  }, [fetchRecommendations]);

  useEffect(() => {
    // 로그아웃 시 데이터 초기화
    if (!user) {
        setRecommendations([]);
        setFetched(false);
        setError(null);
    }
  }, [user]);

  const value = {
    recommendations,
    loading,
    error,
    refetch, // refetch 함수 제공
  };

  return (
    <AIJobsContext.Provider value={value}>
      {children}
    </AIJobsContext.Provider>
  );
};
