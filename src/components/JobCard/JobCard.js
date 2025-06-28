
import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
  const navigate = useNavigate();
  return (
    <div className="jobcard-container">
      <div className="jobcard-header">
        <span className="jobcard-title">{job.title}</span>
        {job.urgent && <span className="jobcard-badge">급구</span>}
        <span className="jobcard-available" title="모집중">●</span>
        <span className="jobcard-pay">{job.pay.toLocaleString()}원</span>
        <span className="jobcard-period">{job.period}</span>
      </div>
      <div className="jobcard-company">{job.company}</div>
      <div className="jobcard-location">
        <span className="jobcard-location-icon">📍</span>
        {job.location} · {job.distance}km
      </div>
      <div className="jobcard-bottom">
        <span className="jobcard-rating">⭐ {job.rating}</span>
        <button className="jobcard-apply" onClick={() => navigate(`/jobs/${job.id}`)}>지원하기</button>
      </div>
    </div>
  );
}
export default JobCard;
