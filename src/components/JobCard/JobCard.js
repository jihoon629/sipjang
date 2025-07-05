import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job, recommendation }) {
  const navigate = useNavigate();
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1은 양쪽 날짜 포함
    return diffDays;
  };
  return (
    <div className="jobcard-container">
      <div className="jobcard-header">
        <span className="jobcard-title">{job.title}</span>
        {job.urgent && <span className="jobcard-badge">급구</span>}
        <span className="jobcard-available" title="모집중">●</span>
        <span className="jobcard-pay">
          {job.dailyWage?.toLocaleString()}원
        </span>
        <span className="jobcard-period">{calculateDays(job.workStartDate, job.workEndDate)}일</span>
        
      </div>
     
      {recommendation && (
        <div className="jobcard-recommendation-info">
          <span className="jobcard-matchrate">{recommendation.matchScore} 점</span>
          <div className="jobcard-reason"><b>매칭 이유:</b> {recommendation.reason.replace(/점\)/g, '점)\n')}</div>
        </div>
      )}
      <div className="jobcard-location">
        <span className="jobcard-location-icon">📍</span>
        {job.region || "지역 미정"}
      </div>

      <div className="jobcard-bottom">
        <span className="jobcard-rating">⭐ {job.rating ?? 4.5}</span>
        <button
          className="jobcard-apply"
          onClick={() => navigate(`/jobs/${job.id}`)}
        >
          지원하기
        </button>
      </div>
    </div>
  );
}

export default JobCard;
