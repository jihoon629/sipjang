import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getResumeDetails, getBlockchainExperience } from "../../services/resumesService";
import "./ApplicantDetailPage.css";

function ApplicantDetailPage() {
  const { resumeId, userId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 이력서 상세 정보 가져오기
        const resumeResponse = await getResumeDetails(resumeId);
        const fetchedResume = resumeResponse.data || resumeResponse;
        // skills 필드가 문자열인 경우 파싱
        if (fetchedResume.skills && typeof fetchedResume.skills === 'string') {
          try {
            fetchedResume.skills = JSON.parse(fetchedResume.skills);
          } catch (e) {
            console.error("Failed to parse skills string:", e);
            fetchedResume.skills = []; // 파싱 실패 시 빈 배열로 설정
          }
        }
        setResume(fetchedResume);

        // 블록체인 경력 정보 가져오기
        const experienceResponse = await getBlockchainExperience(userId);
        setExperience(experienceResponse.data || experienceResponse);

        setError(null);
      } catch (err) {
        console.error("Error fetching applicant details:", err);
        setError("지원자 상세 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resumeId, userId]);

  if (loading) {
    return <div className="applicant-detail-page">로딩 중...</div>;
  }

  if (error) {
    return <div className="applicant-detail-page" style={{ color: 'red' }}>{error}</div>;
  }

  if (!resume) {
    return <div className="applicant-detail-page">이력서 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="applicant-detail-page">
      <div className="applicant-detail-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>{resume.user?.username || "지원자"} 상세 정보</h2>
      </div>

      <div className="detail-section">
        <h3>이력서 정보</h3>
        <p><strong>희망 직종:</strong> {resume.jobType}</p>
        <p><strong>희망 지역:</strong> {resume.region}</p>
        <p><strong>희망 일급:</strong> {resume.desiredDailyWage?.toLocaleString()}원</p>
        <p><strong>경력:</strong> {resume.history}년</p>
        <p><strong>기술:</strong> {resume.skills?.join(', ') || '없음'}</p>
        <p><strong>자기소개:</strong> {resume.selfIntroduction || '없음'}</p>
        <p><strong>연락처:</strong> {resume.phone || '없음'}</p>
      </div>

      <div className="detail-section">
        <h3>블록체인 인증 경력</h3>
        {experience.length > 0 ? (
          experience.map((exp, index) => (
            <div key={index} className="experience-card">
              <p><strong>공고 제목:</strong> {exp.jobTitle}</p>
              <p><strong>근무 기간:</strong> {exp.workPeriod}</p>
              <p><strong>인증일:</strong> {new Date(exp.timestamp).toLocaleDateString('ko-KR')}</p>
            </div>
          ))
        ) : (
          <p>블록체인에 기록된 경력이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default ApplicantDetailPage;