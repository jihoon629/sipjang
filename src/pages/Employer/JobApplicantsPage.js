import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJobApplicants } from "../../services/jobPostingsService";
import { updateApplicationStatus, completeApplication } from "../../services/applicationsService";
import "./JobApplicantsPage.css";

function JobApplicantsPage() {
  const { jobPostingId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await getJobApplicants(jobPostingId);
      const fetchedApplicants = response.data?.applications || response.data || [];
      setApplicants(fetchedApplicants);
      setError(null);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      setError("지원자 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobPostingId]);

  const handleStatusChange = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, status);
      alert(`지원 상태가 ${status}로 변경되었습니다.`);
      fetchApplicants(); // 상태 변경 후 목록 새로고침
    } catch (err) {
      console.error("Error updating application status:", err);
      alert("상태 변경에 실패했습니다.");
    }
  };

  const handleCompleteApplication = async (applicationId) => {
    if (window.confirm("이 지원을 완료하고 블록체인에 경력을 기록하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        await completeApplication(applicationId);
        alert("업무 완료 및 경력 기록이 성공적으로 처리되었습니다.");
        fetchApplicants(); // 완료 후 목록 새로고침
      } catch (err) {
        console.error("Error completing application:", err);
        alert("업무 완료 처리에 실패했습니다.");
      }
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "대기 중";
      case "approved": return "승인됨";
      case "rejected": return "거절됨";
      case "completed": return "완료됨";
      default: return status;
    }
  };

  if (loading) {
    return <div className="job-applicants-page">로딩 중...</div>;
  }

  if (error) {
    return <div className="job-applicants-page" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="job-applicants-page">
      <div className="job-applicants-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로</button>
        <h2>지원자 관리</h2>
      </div>
      {applicants.length === 0 ? (
        <p>이 공고에 지원한 지원자가 없습니다.</p>
      ) : (
        <div className="applicants-list">
          {applicants.map((applicant) => (
            <div className="applicant-card" key={applicant.id} onClick={() => navigate(`/employer/applicant-details/${applicant.resumeId}/${applicant.applicantId}`)}>
              <div className="applicant-info">
                <h3>{applicant.applicant?.username || "이름 없음"}</h3>
                <p>이메일: {applicant.applicant?.email || "정보 없음"}</p>
                <p>현재 상태: <strong>{getStatusText(applicant.status)}</strong></p>
                {applicant.resume && (
                  <div className="resume-preview">
                    <h4>이력서 정보:</h4>
                    <p>직종: {applicant.resume.jobType}</p>
                    <p>지역: {applicant.resume.region}</p>
                    {/* 추가 이력서 정보 표시 가능 */}
                  </div>
                )}
              </div>
              <div className="applicant-actions">
                {applicant.status === "pending" && (
                  <>
                    <button className="action-btn approve-btn" onClick={() => handleStatusChange(applicant.id, "approved")}>승인</button>
                    <button className="action-btn reject-btn" onClick={() => handleStatusChange(applicant.id, "rejected")}>거절</button>
                  </>
                )}
                {applicant.status === "approved" && (
                  <button className="action-btn complete-btn" onClick={() => handleCompleteApplication(applicant.id)}>업무 완료 (경력 기록)</button>
                )}
                {applicant.status === "completed" && (
                  <span className="status-message">업무 완료 및 경력 기록됨</span>
                )}
                {applicant.status === "rejected" && (
                  <span className="status-message">거절된 지원</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobApplicantsPage;