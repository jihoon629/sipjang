import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobPostingDetails, applyToJob } from "../../../services/jobPostingsService";
import { getUserResumes } from "../../../services/resumesService";
import { useUser } from "../../../contexts/UserContext"; // useUser 훅 가져오기
import "./JobDetail.css";

function JobDetail() {
  const { id } = useParams();
  const { user } = useUser(); // 로그인한 사용자 정보 가져오기
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

  const handleApplyClick = async () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await getUserResumes(user.id);
      const resumes = response.data.resumes;

      if (resumes && resumes.length > 0) {
        const firstResume = resumes[0];
        // eslint-disable-next-line no-restricted-globals
        if (confirm(`'${firstResume.title || '제목 없는 이력서'}' 이력서로 지원하시겠습니까?`)) {
          await applyToJob(id, firstResume.id);
          alert("지원이 완료되었습니다.");
        }
      } else {
        alert("제출할 이력서가 없습니다. 먼저 이력서를 작성해주세요.");
      }
    } catch (err) {
      console.error("Error submitting application", err);
      alert("지원 중 오류가 발생했습니다.");
    }
  };

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
          <button className="jobdetail-btn apply" onClick={handleApplyClick}>지원하기</button>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
