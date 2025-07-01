import { useNavigate } from "react-router-dom";
import JobCard from "../../components/JobCard/JobCard";
import "./HomePage.css";
import { useUser } from "../../contexts/UserContext"; // UserContext 임포트

function HomePage() {
  const navigate = useNavigate();
  const { user } = useUser(); // useUser 훅 사용

  // 샘플 데이터 (실제 연동 전)
  const stats = { done: 12, rating: 4.8, trust: 98 };
  const jobs = [
    {
      title: "철근공 구함",
      urgent: true,
      pay: 150000,
      period: "3일",
      company: "대한건설",
      location: "서울 강남구 테헤란로 123",
      distance: 2.3,
      rating: 4.8,
    },
    {
      title: "미장공 모집",
      urgent: false,
      pay: 130000,
      period: "1주",
      company: "현대건축",
      location: "경기 성남시 분당구",
      distance: 5.1,
      rating: 4.9,
    },
  ];

  return (
    <div className="home-page">
      {/* 상단 인사/통계 카드 */}
      <div className="main-stats-card">
        <div className="main-stats-card-bg">
          <div className="main-stats-card-info">
            <div className="main-stats-card-title">
              <strong>안녕하세요, {user?.username || "김철수"}님!</strong>
              <div className="main-stats-card-sub">오늘도 좋은 하루 되세요</div>
            </div>
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
          </div>
          <div className="main-stats-card-profile">
            <div className="main-stats-card-profile-img" />
          </div>
        </div>
      </div>

      {/* 바로가기 버튼 영역 */}
      <div className="shortcut-grid">
        <a className="shortcut-card" href="/resume">
          <div className="shortcut-icon" style={{ background: "#f3e8ff" }}>
            <span role="img" aria-label="이력서">
              📄
            </span>
          </div>
          <div className="shortcut-title">내 이력서</div>
          <div className="shortcut-desc">프로필 관리</div>
        </a>
        <a className="shortcut-card" href="/calendar">
          <div className="shortcut-icon" style={{ background: "#e6f9e6" }}>
            <span role="img" aria-label="달력">
              📅
            </span>
          </div>
          <div className="shortcut-title">급여 달력</div>
          <div className="shortcut-desc">지급일 확인</div>
        </a>
        <a className="shortcut-card" href="/nearby">
          <div className="shortcut-icon" style={{ background: "#e6f0ff" }}>
            <span role="img" aria-label="주변">
              📍
            </span>
          </div>
          <div className="shortcut-title">내 주변</div>
          <div className="shortcut-desc">근처 일자리</div>
        </a>
        <a className="shortcut-card" href="/mypage">
          <div className="shortcut-icon" style={{ background: "#fff4e6" }}>
            <span role="img" aria-label="마이페이지">
              ⚙️
            </span>
          </div>
          <div className="shortcut-title">마이페이지</div>
          <div className="shortcut-desc">설정 관리</div>
        </a>
      </div>

      {/* 매칭 알림 */}
      <div className="matching-alert" style={{cursor:'pointer'}} onClick={() => navigate('/aijobs')}>
        <span className="matching-dot" />
        <span className="matching-text">
          새로운 매칭! 2개의 일자리가 매칭되었습니다
        </span>
        <span className="matching-arrow">&gt;</span>
      </div>

      {/* 추천 일자리 */}
      <div className="job-section">
        <div className="job-section-header">
          <span className="job-section-title">추천 일자리</span>
          <a href="/jobs" className="job-section-more">
            전체보기
          </a>
        </div>
        {jobs.map((job, i) => (
          <JobCard job={job} key={i} />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
