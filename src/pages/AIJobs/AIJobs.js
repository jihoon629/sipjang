

import "./AIJobs.css";
import { useNavigate } from "react-router-dom";

const jobs = [
  {
    id: 1,
    title: "철근공 구함",
    company: "대한건설",
    pay: 150000,
    matchRate: 95,
    reason: "경력과 위치가 완벽하게 일치합니다",
    urgent: true,
  },
  {
    id: 2,
    title: "목공 모집",
    company: "삼성건설",
    pay: 140000,
    matchRate: 87,
    reason: "기술과 평점이 우수합니다",
    urgent: true,
  },
];

function AIJobs() {
  const navigate = useNavigate();
  return (
    <div className="aijobs-page">
      <div className="aijobs-header-bar">
        <button className="aijobs-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="aijobs-header-title">매칭 알림</span>
        <span className="aijobs-badge">2개</span>
      </div>
      <div className="aijobs-list">
        {jobs.map((job, idx) => (
          <div className="aijobs-card" key={job.id}>
            <div className="aijobs-card-top">
              <span className="aijobs-new">● 새로운 매칭!</span>
              <span className="aijobs-matchrate">{job.matchRate}% 일치</span>
            </div>
            <div className="aijobs-title-row">
              <div className="aijobs-title">{job.title}</div>
            </div>
            <div className="aijobs-company">{job.company}</div>
            <div className="aijobs-pay">{job.pay.toLocaleString()}원</div>
            <div className="aijobs-reason"><b>매칭 이유:</b> {job.reason}</div>
            <div className="aijobs-btn-row">
              <button className="aijobs-reject">거절</button>
              <button className="aijobs-accept">수락</button>
            </div>
          </div>
        ))}
      </div>
      <div className="aijobs-allchecked">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#F3F4F6" />
          <path d="M12 21l6 6 10-10" stroke="#B0B6C1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="aijobs-allchecked-text">모든 매칭을 확인했습니다</div>
      </div>
    </div>
  );
}

export default AIJobs;
