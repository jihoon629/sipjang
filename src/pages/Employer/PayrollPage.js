import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { getUserJobPostings, recordPaymentsForAll } from "../../services/jobPostingsService";
import "./PayrollPage.css";

function PayrollPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]); // 오늘 날짜로 초기화

  useEffect(() => {
    if (user?.id) {
      fetchJobPostings(user.id);
    }
  }, [user]);

  const fetchJobPostings = async (userId) => {
    try {
      setLoading(true);
      const response = await getUserJobPostings(userId);
      const postings = response.data?.postings || response.data || [];
      setJobPostings(postings);
      setError(null);
    } catch (err) {
      console.error("Error fetching job postings:", err);
      setError("공고 목록을 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecordPayments = async (jobPostingId) => {
    if (!paymentDate) {
      alert("급여 지급일을 입력해주세요.");
      return;
    }

    if (window.confirm(`선택된 날짜(${paymentDate})로 이 공고의 모든 승인된 지원자들에게 급여를 일괄 기록하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        const result = await recordPaymentsForAll(jobPostingId, paymentDate); // paymentDate 전달
        alert(`급여 기록 완료! 성공: ${result.data.successCount}건, 실패: ${result.data.failCount}건`);
        // 급여 기록 후 공고 목록을 새로고침하여 최신 상태 반영
        if (user?.id) {
          fetchJobPostings(user.id);
        }
      } catch (err) {
        console.error("Error recording payments:", err);
        alert("급여 기록에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <div className="payroll-page">로딩 중...</div>;
  }

  if (error) {
    return <div className="payroll-page" style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div className="payroll-page">
      <div className="payroll-header">
        <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로</button>
        <h2>급여 관리</h2>
      </div>

      <div className="payment-date-selection">
        <label htmlFor="paymentDate">지급일 선택:</label>
        <input
          type="date"
          id="paymentDate"
          value={paymentDate}
          onChange={(e) => setPaymentDate(e.target.value)}
        />
      </div>

      {jobPostings.length === 0 ? (
        <p>등록된 공고가 없습니다.</p>
      ) : (
        <div className="job-postings-list">
          {jobPostings.map((posting) => (
            <div className="posting-card" key={posting.id}>
              <h3>{posting.title}</h3>
              <p>직종: {posting.jobType}</p>
              <p>지역: {posting.region}</p>
              <div className="posting-actions">
                <button
                  className="action-btn payroll-btn"
                  onClick={() => handleRecordPayments(posting.id)}
                >
                  일괄 급여 기록
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PayrollPage;