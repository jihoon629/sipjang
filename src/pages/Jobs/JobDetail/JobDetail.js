import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobPostingDetails } from "../../../services/jobPostingsService";
import "./JobDetail.css";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getJobPostingDetails(id);
        setJob(data.data);
      } catch (err) {
        console.error("Error fetching job detail", err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!job) return <div className="jobdetail-page">불러오는 중...</div>;

  return (
    <div className="jobdetail-page">
      <div className="jobdetail-card">
        <div className="jobdetail-title">{job.title}</div>

        <div className="jobdetail-table">
          <div className="row"><span className="label">회사명</span><span className="value">{job.user?.username || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">위치</span><span className="value">📍 {job.region}</span></div>
          <div className="row"><span className="label">일급</span><span className="value">{job.dailyWage.toLocaleString()}원</span></div>
          <div className="row"><span className="label">기간</span><span className="value">{job.workStartDate} ~ {job.workEndDate}</span></div>
          <div className="row"><span className="label">직종</span><span className="value">{job.jobType || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">근무 시간</span><span className="value">{job.workHours || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">연락처</span><span className="value">{job.contactInfo || "더미데이터입니다"}</span></div>
        </div>

        <div className="jobdetail-section">
          <div className="section-title">요구 역량</div>
          <div className="section-content">{job.requiredSkills || "더미데이터입니다"}</div>
        </div>

        <div className="jobdetail-section">
          <div className="section-title">현장 설명</div>
          <div className="section-content">{job.siteDescription || "더미데이터입니다"}</div>
        </div>

        <div className="jobdetail-buttons">
          <button className="jobdetail-btn view">현장 보기</button>
          <button className="jobdetail-btn apply">지원하기</button>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;