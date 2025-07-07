

import React from "react";
import "./AIJobs.css";
import { useNavigate } from "react-router-dom";
import { useAIJobs } from "../../contexts/AIJobsContext";
import AIJobCard from "../../components/AIJobCard/AIJobCard";

function AIJobs() {
  const navigate = useNavigate();
  const { recommendations, loading, error, refetch } = useAIJobs();

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
            <AIJobCard job={job} key={job.id} />
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
