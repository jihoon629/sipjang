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
        <div className="jobdetail-title-row">
          <div className="jobdetail-title">{job.title}</div>
          <div className="jobdetail-location">📍 {job.region}</div>
        </div>

        <div className="jobdetail-summary">
          <div className="jobdetail-pay">일급 {job.dailyWage.toLocaleString()} 원</div>
          <div className="jobdetail-period">{job.workStartDate} ~ {job.workEndDate}</div>
        </div>

        <div className="jobdetail-meta">
          <div><strong>직종:</strong> {job.jobType || "더미데이터입니다"}</div>
          <div><strong>현장 설명:</strong> {job.siteDescription || "더미데이터입니다"}</div>
          <div><strong>요구 역량:</strong> {job.requiredSkills || "더미데이터입니다"}</div>
          <div><strong>근무 시간:</strong> {job.workHours || "더미데이터입니다"}</div>
          <div><strong>연락처:</strong> {job.contactInfo || "더미데이터입니다"}</div>
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