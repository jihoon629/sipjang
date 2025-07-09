
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AIJobCard.css';

const DetailItem = ({ label, score, description }) => (
  <div className="detail-item">
    <div className="detail-label-score">
      <span className="detail-label">{label}</span>
      <span className="detail-score">{score}점</span>
    </div>
    <p className="detail-description">“{description}”</p>
  </div>
);

const AIJobCard = ({ job }) => {
  console.log('Rendering AIJobCard with job data:', JSON.stringify(job, null, 2));
  const navigate = useNavigate();
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);

  if (!job || !job.recommendation) {
    return null; // 렌더링할 데이터가 없으면 아무것도 표시하지 않음
  }

  const { recommendation } = job;
  const { reasonDetails, matchScore } = recommendation;

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  const calculateStrokeDashoffset = (score) => {
    const circumference = 2 * Math.PI * 45; // 반지름 45
    return circumference - (score / 100) * circumference;
  };

  return (
    <div className="ai-job-card">
      <div className="card-main-info">
        <div className="job-details">
          <h3 className="job-title" onClick={() => navigate(`/jobs/${job.id}`)}>{job.title}</h3>
          <div className="job-meta">
            <span className="job-wage">일급 {job.dailyWage ? `${job.dailyWage.toLocaleString()}원` : '미정'}</span>
            <span className="job-region">{job.region}</span>
          </div>
        </div>
        <div className="match-score-visual">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="progress-bg" />
            <circle
              cx="50"
              cy="50"
              r="45"
              className="progress-bar"
              strokeDasharray={2 * Math.PI * 45}
              strokeDashoffset={calculateStrokeDashoffset(matchScore)}
            />
            <text x="50" y="50" className="match-score-text">{matchScore}점</text>
          </svg>
        </div>
      </div>

      <div className="card-actions">
        <button className="details-toggle-btn" onClick={toggleDetails}>
          {isDetailsVisible ? '상세 이유 닫기' : '상세 이유 보기'}
        </button>
        <button className="apply-btn" onClick={() => navigate(`/jobs/${job.id}`)}>
          지원하러 가기
        </button>
      </div>

      {isDetailsVisible && reasonDetails && (
        <div className="recommendation-details">
          <h4 className="details-title">AI 추천 상세 점수</h4>
          <DetailItem label="직종 일치도" {...reasonDetails.jobTypeMatch} />
          <DetailItem label="지역 근접성" {...reasonDetails.locationProximity} />
          <DetailItem label="기술 적합성" {...reasonDetails.skillCompatibility} />
          <DetailItem label="경력 적합성" {...reasonDetails.careerSuitability} />
          <DetailItem label="급여 적정성" {...reasonDetails.salaryAdequacy} />
        </div>
      )}
    </div>
  );
};

export default AIJobCard;
