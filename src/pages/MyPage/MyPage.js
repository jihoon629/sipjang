import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import { useUser } from "../../contexts/UserContext";
import { getUserResumes } from "../../services/resumesService";
import { getMyApplications } from "../../services/applicationsService";

function MyPage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [userResume, setUserResume] = useState(null);
  const [completedApplicationsCount, setCompletedApplicationsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchUserResume = async () => {
      try {
        const response = await getUserResumes(user.id);
        const resumes = response?.data?.resumes || [];
        if (resumes.length > 0) {
          setUserResume(resumes[0]);
        }
      } catch (error) {
        console.error('이력서 정보 가져오기 실패:', error);
      }
    };

    const fetchCompletedApplications = async () => {
      try {
        const response = await getMyApplications();
        const applications = response?.data?.applications || [];

        const completed = applications.filter(app => app.status === 'completed');
        const completedCount = completed.length;
        const totalCount = applications.length;
        const incomeSum = completed.reduce((acc, app) => acc + (app.paymentAmount || 0), 0);

        setCompletedApplicationsCount(completedCount);
        setTotalApplicationsCount(totalCount);
        setTotalIncome(incomeSum);
      } catch (error) {
        console.error('완료된 지원 내역 가져오기 실패:', error);
        setCompletedApplicationsCount(0);
        setTotalApplicationsCount(0);
        setTotalIncome(0);
      }
    };

    fetchUserResume();
    fetchCompletedApplications();
  }, [user]);

  // 평점 계산: 신뢰도 기반으로 5.0 만점으로 계산
  const rating = totalApplicationsCount > 0 
    ? Math.round((completedApplicationsCount / totalApplicationsCount) * 5.0 * 10) / 10
    : 0;

  // 평점에 따른 뱃지 설정
  const getBadgeInfo = (rating) => {
    if (rating >= 4.5) {
      return { text: '근면성실', style: { background: 'linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3, #54a0ff)', color: 'white' } };
    } else if (rating >= 4.0) {
      return { text: '성실한', style: { background: '#4CAF50', color: 'white' } };
    } else if (rating >= 3.0) {
      return { text: '시작점', style: { background: '#FFC107', color: 'black' } };
    }
    return { text: '인증 완료', style: { background: '#E0E0E0', color: 'black' } };
  };

  const badgeInfo = getBadgeInfo(rating);

  const defaultUser = {
    name: user?.username || "사용자",
    desc: "이력서를 작성해주세요",
    rating: rating,
    done: 0,
    income: 0,
  };

  const displayUser = userResume ? {
    name: user?.username || userResume.name || "사용자",
    desc: `${userResume.jobType || "직종 미입력"} · ${userResume.history || 0}년 경력`,
    rating: rating,
    done: completedApplicationsCount,
    income: totalIncome,
  } : defaultUser;

  return (
    <div className="mypage-page">
      <div className="mypage-profile-card">
        <div className="mypage-profile-row">
          <div className="mypage-profile-img">
            <div className="mypage-avatar-fallback"></div>
          </div>
          <div className="mypage-profile-info">
            <div className="mypage-profile-name">{displayUser.name}</div>
            <div className="mypage-profile-desc">{displayUser.desc}</div>
            <div className="mypage-profile-rating-row">
              <span className="mypage-profile-rating">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: 2 }}>
                  <path d="M8 1.5l2.09 4.26 4.66.68-3.38 3.29.8 4.65L8 12.77l-4.17 2.19.8-4.65L1.25 6.44l4.66-.68L8 1.5z" fill="#FFD600" stroke="#FFD600" strokeWidth="1" />
                </svg>
                <span className="mypage-profile-score">{displayUser.rating}</span>
              </span>
              <span className="mypage-profile-badge" style={badgeInfo.style}>{badgeInfo.text}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mypage-stats-row">
        <div className="mypage-stat-box">
          <span className="mypage-stat-value blue">{displayUser.done}</span>
          <span className="mypage-stat-label">완료한 작업</span>
        </div>
        <div className="mypage-stat-box">
          <span className="mypage-stat-value green">₩{displayUser.income.toLocaleString("ko-KR")}</span>
          <span className="mypage-stat-label">총 수입</span>
        </div>
      </div>

      <div className="mypage-menu-list">
        <div className="mypage-menu-item" onClick={() => navigate('/resume')}>
          <span className="mypage-menu-icon" style={{ background: "#E6F0FF" }}>
            📄
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">내 이력서</div>
            <div className="mypage-menu-desc">프로필 및 경력 관리</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/calendar')}>
          <span className="mypage-menu-icon" style={{ background: "#E6FCEF" }}>
            💸
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">급여 관리</div>
            <div className="mypage-menu-desc">지급일 및 수입 현황</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/nearby')}>
          <span className="mypage-menu-icon" style={{ background: "#E6FCEF" }}>
            📍
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">내 주변</div>
            <div className="mypage-menu-desc">근처 일자리</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/aijobs')}>
          <span className="mypage-menu-icon" style={{ background: "#F7F7F7" }}>
            🤖
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">AI 매칭</div>
            <div className="mypage-menu-desc">일자리 자동 매칭</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/service')}>
          <span className="mypage-menu-icon" style={{ background: "#FFEAEA" }}>
            ❗
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">고객센터</div>
            <div className="mypage-menu-desc">문의 및 신고</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>
      </div>

      <button className="mypage-logout-btn" onClick={handleLogout}>로그아웃</button>
    </div>
  );
}

export default MyPage;
