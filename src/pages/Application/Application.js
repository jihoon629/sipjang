import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyApplications } from "../../services/applicationsService";
import { getJobPostingDetails } from "../../services/jobPostingsService";
import { useUser } from "../../contexts/UserContext";
import "./Application.css";

// 지원 상태에 따른 스타일을 반환하는 헬퍼 함수
const getStatusStyle = (status) => {
  switch (status) {
    case 'completed':
      return {
        text: '업무 완료',
        color: '#2f80ed',
        icon: '🏅',
        message: '업무가 성공적으로 완료되어 블록체인에 경력이 기록되었습니다.'
      };
    case 'approved':
      return {
        text: '지원 성공',
        color: '#219653',
        icon: '✔️',
        message: '해당 일자리에 배정되었습니다.\n현장 담당자와 연락을 기다려주세요.'
      };

    case 'rejected':
      return {
        text: '지원 탈락',
        color: '#e74c3c',
        icon: '❌',
        message: '해당 일자리에 배정되지 않았습니다.\n근처 다른 일자리에 지원해 보세요.'
      };
    case 'pending':
    default:
      return {
        text: '검토 중',
        color: '#f2994a',
        icon: '⏳',
        message: '지원서가 검토 중입니다.\n결과가 곧 업데이트될 예정입니다.'
      };
  }
};

function Application() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      const fetchApplications = async () => {
        try {
          setLoading(true);
          const response = await getMyApplications();
          // API 응답 구조에 따라 data.applications 또는 data로 접근
          const apps = response.data?.applications || response.data || [];
          setApplications(apps);
          setError(null);
        } catch (err) {
          setError("지원 내역을 불러오는 데 실패했습니다.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchApplications();
    }
  }, [user]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString, options) => {
    if (!dateString) return "날짜 정보 없음";
    const defaultOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options || defaultOptions);
  };

  const handleContactClick = async (jobPostingId) => {
    try {
      const response = await getJobPostingDetails(jobPostingId);
      const jobData = response.data || response; // 데이터 구조에 유연하게 대응
      const contactInfo = jobData.contactInfo;

      if (contactInfo) {
        window.location.href = `tel:${contactInfo}`;
      } else {
        alert("담당자 연락처 정보가 없습니다.");
      }
    } catch (error) {
      console.error("연락처 정보 조회 실패:", error);
      alert("연락처 정보를 불러오는 데 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="application-page"><h2 className="application-title">지원내역</h2><p>로딩 중...</p></div>;
  }

  if (error) {
    return <div className="application-page"><h2 className="application-title">지원내역</h2><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className="application-page">
      <h2 className="application-title">지원내역</h2>
      <div className="application-list">
        {applications.length > 0 ? (
          applications.map(app => {
            const statusStyle = getStatusStyle(app.status);
            return (
              <div className="application-card styled" key={app.id}>
                <div className="application-status-row">
                  <span className="application-status-icon" style={{ color: statusStyle.color }}>{statusStyle.icon}</span>
                  <span className="application-status-label" style={{ color: statusStyle.color }}>{statusStyle.text}</span>
                </div>
                <div className="application-meta-row">
                  {/* API 응답에 jobPosting.jobType이 있다면 표시 */}
                  {app.jobPosting?.jobType && <span className="application-meta">{app.jobPosting.jobType}</span>}
                  <span className="application-meta">{formatDate(app.createdAt)}</span>
                </div>
                <div className="application-job-title styled">{app.jobPosting?.title || "공고 제목 없음"}</div>
                <div className="application-company styled">{app.jobPosting?.user?.username || "회사 정보 없음"}</div>
                
                {/* 급여 정보 표시 */}
                {(app.status === 'approved' || app.status === 'completed') && app.paymentAmount && (
                  <div className="application-payment-info">
                    <span className="payment-label">지급된 급여:</span>
                    <span className="payment-amount">{app.paymentAmount.toLocaleString()}원</span>
                    <span className="payment-date">({formatDate(app.paymentDate, { year: 'numeric', month: 'long', day: 'numeric' })})</span>
                  </div>
                )}

                <div className="application-detail-box">
                  <div className="application-detail-date">{formatDate(app.updatedAt)}</div>
                  <div className="application-detail-status-row">
                    <span className="application-detail-status-icon" style={{ color: statusStyle.color }}>{statusStyle.icon}</span>
                    <span className="application-detail-status-label" style={{ color: statusStyle.color }}>{statusStyle.text}</span>
                  </div>
                  <div className="application-detail-msg">{statusStyle.message.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
                </div>
                
                {/* 버튼 영역 */}
                {app.status === 'completed' ? (
                  <button className="application-another-btn completed" onClick={() => navigate('/mypage')}>경력 확인하기</button>
                ) : app.status === 'approved' ? (
                  <button className="application-another-btn success" onClick={() => handleContactClick(app.jobPostingId)}>담당자와 연락하기</button>
                ) : (
                  <button className="application-another-btn" onClick={() => navigate('/jobs')}>다른 일자리 둘러보기</button>
                )}
              </div>
            );
          })
        ) : (
          <div className="application-empty-bg">
            <div className="application-empty">
              <div className="application-empty-icon-outer">
                <div className="application-empty-icon-inner">
                  <div className="application-empty-face">
                    <div className="application-empty-face-mouth" />
                  </div>
                </div>
              </div>
              <div className="application-empty-text">
                지원한 일자리가 없습니다.<br />
                주변 일자리를 확인해 보세요.
              </div>
              <button className="application-empty-btn-main" onClick={() => navigate('/jobs')}>주변 일자리 확인하기</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Application;
