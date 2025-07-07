import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import "./HomePage.css";
import { useUser } from "../../contexts/UserContext";
import { getJobPostings } from "../../services/jobPostingsService";
import { getMyApplications } from "../../services/applicationsService";

function HomePage() {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  const [jobs, setJobs] = useState([]);
  const [completedApplicationsCount, setCompletedApplicationsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);

  useEffect(() => {
    if (!user) fetchUser();

    const fetchJobs = async () => {
      try {
        const data = await getJobPostings();
        // 상위 3개만 추출
        setJobs(data.data.postings.slice(0, 3));
      } catch (err) {
        console.error("Error fetching job postings:", err);
      }
    };

    fetchJobs();
  }, [user, fetchUser]);

  // 완료된 지원 내역 카운트 가져오기
  useEffect(() => {
    const fetchCompletedApplications = async () => {
      if (!user || !user.id) {
        return;
      }

      try {
        const response = await getMyApplications();
        // API 응답 구조를 response.data.applications로 가정하고 안전하게 접근
        const applications = response?.data?.applications || [];
        
        // status가 'completed'인 항목만 카운트 (사용자 ID 필터링은 불필요)
        const completedCount = applications.filter(app => app.status === 'completed').length;
        const totalCount = applications.length;
        
        setCompletedApplicationsCount(completedCount);
        setTotalApplicationsCount(totalCount);
      } catch (error) {
        console.error('완료된 지원 내역 가져오기 실패:', error);
        setCompletedApplicationsCount(0);
        setTotalApplicationsCount(0);
      }
    };

    fetchCompletedApplications();
  }, [user]);

  const isEmployer = user?.role === "employer";
  
  // 신뢰도 계산: 완료된 지원 / 전체 지원 * 100 (최대 100%)
  const trustPercentage = totalApplicationsCount > 0 
    ? Math.round((completedApplicationsCount / totalApplicationsCount) * 100)
    : 0;
    
  // 평점 계산: 신뢰도 기반으로 5.0 만점으로 계산
  const rating = totalApplicationsCount > 0 
    ? Math.round((trustPercentage / 100) * 5.0 * 10) / 10  // 소수점 한 자리
    : 0;
    
  const stats = { 
    done: completedApplicationsCount, // 실제 완료된 작업 수
    rating: rating, 
    trust: trustPercentage 
  };

  return (
    <div className="home-page">
      {/* 상단 인사/통계 카드 */}
      <div className="main-stats-card">
        <div className="main-stats-card-bg">
          <div className="main-stats-card-info">
            <div className="main-stats-card-title">
              <strong>안녕하세요, {user ? user.username : "방문자"}님!</strong>
              <div className="main-stats-card-sub">
                {user
                  ? "오늘도 좋은 하루 되세요"
                  : "내일을 위한 준비를 시작해보세요"}
              </div>
            </div>

            {user ? (
              <div className="main-stats-card-numbers">
                <div>
                  <span className="main-stats-card-number">{stats.done}</span>
                  <div className="main-stats-card-label">완료한 일</div>
                </div>
                <div>
                  <span className="main-stats-card-number">{stats.rating}</span>
                  <div className="main-stats-card-label">평점</div>
                </div>
                <div>
                  <span className="main-stats-card-number">{stats.trust}%</span>
                  <div className="main-stats-card-label">신뢰도</div>
                </div>
              </div>
            ) : (
              <div className="main-stats-card-buttons">
                <button className="btn-primary" onClick={() => navigate("/signup")}>
                  지금 시작하기
                </button>
                <button className="btn-secondary" onClick={() => navigate("/login")}>
                  로그인
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="shortcut-grid">
        {isEmployer ? (
          <>
            <a className="shortcut-card" href="/Employerjobs">
              <div className="shortcut-icon" style={{ background: "#f3e8ff" }}>📢</div>
              <div className="shortcut-title">내 공고</div>
              <div className="shortcut-desc">등록한 공고 목록</div>
            </a>
            <a className="shortcut-card" href="/job-create">
              <div className="shortcut-icon" style={{ background: "#e6f9e6" }}>➕</div>
              <div className="shortcut-title">공고 등록</div>
              <div className="shortcut-desc">새로운 일자리 등록</div>
            </a>
            <a className="shortcut-card" href="/employer/payroll">
              <div className="shortcut-icon" style={{ background: "#e6f0ff" }}>📅</div>
              <div className="shortcut-title">급여 관리</div>
              <div className="shortcut-desc">지급 일정 관리</div>
            </a>
          </>
        ) : (
          <>
            <a className="shortcut-card" href="/resume">
              <div className="shortcut-icon" style={{ background: "#f3e8ff" }}>📄</div>
              <div className="shortcut-title">내 이력서</div>
              <div className="shortcut-desc">프로필 관리</div>
            </a>
            <a className="shortcut-card" href="/calendar">
              <div className="shortcut-icon" style={{ background: "#e6f9e6" }}>📅</div>
              <div className="shortcut-title">급여 달력</div>
              <div className="shortcut-desc">지급일 확인</div>
            </a>
            <a className="shortcut-card" href="/nearby">
              <div className="shortcut-icon" style={{ background: "#e6f0ff" }}>📍</div>
              <div className="shortcut-title">내 주변</div>
              <div className="shortcut-desc">근처 일자리</div>
            </a>
          </>
        )}
        <a className="shortcut-card" href="/mypage">
          <div className="shortcut-icon" style={{ background: "#fff4e6" }}>⚙️</div>
          <div className="shortcut-title">마이페이지</div>
          <div className="shortcut-desc">설정 관리</div>
        </a>
      </div>

      {/* 매칭 알림 */}
      {!isEmployer && (
        <div className="matching-alert" onClick={() => navigate("/aijobs")}>
          <span className="matching-dot" />
          <span className="matching-text">새로운 매칭! 2개의 일자리가 매칭되었습니다</span>
          <span className="matching-arrow">&gt;</span>
        </div>
      )}

      {/* 추천 일자리 */}
      {!isEmployer && jobs.length > 0 && (
        <div className="job-section">
          <div className="job-section-header">
            <span className="job-section-title">최신 공고</span>
            <a href="/jobs" className="job-section-more">전체보기</a>
          </div>
          {jobs.map((job) => (
            <JobCard job={job} key={job.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
