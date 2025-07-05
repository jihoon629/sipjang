

import React, { useEffect, useState } from "react";
import "./AIJobs.css";
import { useNavigate } from "react-router-dom";
import { getJobRecommendations } from "../../services/resumesService";
import { getUserResumes } from "../../services/resumesService";
import { useUser } from "../../contexts/UserContext";
import JobCard from "../../components/JobCard/JobCard"; // JobCard 컴포넌트 임포트

function AIJobs() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user || !user.id) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // 1. 사용자의 이력서 ID 가져오기
        const userResumesResponse = await getUserResumes(user.id);
        const userResumes = userResumesResponse.data?.resumes || userResumesResponse.data || [];

        if (userResumes.length === 0) {
          setError("등록된 이력서가 없습니다. 이력서를 먼저 작성해주세요.");
          setLoading(false);
          return;
        }

        const resumeId = userResumes[0].id; // 첫 번째 이력서 사용

        // 2. AI 추천 공고 가져오기
        const response = await getJobRecommendations(resumeId);
        const fetchedRecommendations = response.data?.postings || [];
        console.log("Fetched AI Job Recommendations:", fetchedRecommendations);
        setRecommendations(fetchedRecommendations);
        setError(null);
      } catch (err) {
        console.error("Error fetching AI job recommendations:", err);
        setError(err.message || "AI 추천 공고를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  if (loading) {
    return (
      <div className="aijobs-page">
        <div className="aijobs-header-bar">
          <button className="aijobs-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="aijobs-header-title">매칭 알림</span>
          <span className="aijobs-badge">{recommendations.length}개</span>
        </div>
        <div className="aijobs-loading">AI 추천 공고를 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="aijobs-page">
        <div className="aijobs-header-bar">
          <button className="aijobs-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="aijobs-header-title">매칭 알림</span>
          <span className="aijobs-badge">0개</span>
        </div>
        <div className="aijobs-error">
          <p>{error}</p>
          {error.includes("이력서") && (
            <button className="aijobs-error-btn" onClick={() => navigate('/resume')}>이력서 작성하기</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="aijobs-page">
      <div className="aijobs-header-bar">
        <button className="aijobs-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="aijobs-header-title">매칭 알림</span>
        <span className="aijobs-badge">{recommendations.length}개</span>
      </div>
      <div className="aijobs-list">
        {recommendations.length > 0 ? (
          recommendations.map((job) => (
            <JobCard job={job} recommendation={job.recommendation} key={job.id} />
          ))
        ) : (
          <div className="aijobs-allchecked">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#F3F4F6" />
              <path d="M12 21l6 6 10-10" stroke="#B0B6C1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="aijobs-allchecked-text">추천할 만한 공고가 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIJobs;
