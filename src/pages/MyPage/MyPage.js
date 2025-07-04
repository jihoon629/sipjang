import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyPage.css";
import { useUser } from "../../contexts/UserContext";
import { getUserResumes } from "../../services/resumesService"; // 올바른 함수명으로 import
import { getMyApplications } from "../../services/applicationsService";

function MyPage() {
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();
  const [userResume, setUserResume] = useState(null);
  const [completedApplicationsCount, setCompletedApplicationsCount] = useState(0);

  const handleLogout = async () => {
    try {
      await logoutUser();
      alert("로그아웃되었습니다.");
      navigate("/"); // 로그아웃 후 홈으로 이동
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (!user || !user.id) return;

    // 사용자 이력서 정보 가져오기
    const fetchUserResume = async () => {
      try {
        const response = await getUserResumes(user.id);
        // API 응답 구조를 response.data.resumes��� 가정하고 안전하게 접근
        const resumes = response?.data?.resumes || [];
        if (resumes.length > 0) {
          setUserResume(resumes[0]); // 가장 최근 이력서 사용
        }
      } catch (error) {
        console.error('이력서 정보 가져오기 실패:', error);
      }
    };

    // 완료된 지원 내역 카운트 가져오기
    const fetchCompletedApplications = async () => {
      try {
        const response = await getMyApplications();
        // API 응답 구조를 response.data.applications로 가정하고 안전하게 접근
        const applications = response?.data?.applications || [];
        
        // status가 'completed'인 항목만 카운트 (사용자 ID 필터링은 불필요)
        const completedCount = applications.filter(app => app.status === 'completed').length;
        
        setCompletedApplicationsCount(completedCount);
      } catch (error) {
        console.error('완료된 지원 내역 가져오기 실패:', error);
        setCompletedApplicationsCount(0);
      }
    };

    fetchUserResume();
    fetchCompletedApplications();
  }, [user]);

  // 기본 사용자 정보 (이력서가 없을 때)
  const defaultUser = {
    name: user?.username || "사용자",
    desc: "이력서를 작성해주세요",
    rating: 0,
    done: 0,
    income: "0",
  };

  // 실제 사용자 정보 생성
  const displayUser = userResume ? {
    name: user?.username || userResume.name || "사용자",
    desc: `${userResume.jobType || "직종 미입력"} · ${userResume.history || 0}년 경력`,
    rating: 4.8, // 기본값
    done: completedApplicationsCount, // 실제 완료된 작업 수
    income: "2,450만", // 기본값 (추후 실제 데이터로 교체)
  } : defaultUser;


  return (
    <div className="mypage-page">
      {/* 프로필 카드 */}
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
              <span className="mypage-profile-badge">인증 완료</span>
            </div>
          </div>
          <button className="mypage-profile-edit">편집</button>
        </div>
      </div>

      <div className="mypage-stats-row">
        <div className="mypage-stat-box">
          <span className="mypage-stat-value blue">{displayUser.done}</span>
          <span className="mypage-stat-label">완료한 작업</span>
        </div>
        <div className="mypage-stat-box">
          <span className="mypage-stat-value green">₩{displayUser.income}</span>
          <span className="mypage-stat-label">총 수입</span>
        </div>
      </div>

      <div className="mypage-menu-list">
        <div className="mypage-menu-item" onClick={() => navigate('/resume')} tabIndex={0} role="button">
          <span className="mypage-menu-icon" style={{ background: "#E6F0FF" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#E6F0FF" />
              <path d="M12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 8c-2.21 0-4 1.12-4 2.5V18h8v-0.5c0-1.38-1.79-2.5-4-2.5Z" stroke="#3A6FF8" strokeWidth="1.5" />
            </svg>
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">내 이력서</div>
            <div className="mypage-menu-desc">프로필 및 경력 관리</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/payroll')}>
          <span className="mypage-menu-icon" style={{ background: "#E6FCEF" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#E6FCEF" />
              <path d="M7 12h10M12 7v10" stroke="#2DBD6E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">급여 관리</div>
            <div className="mypage-menu-desc">지급일 및 수입 현황</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/resume?tab=certificate')}>
          <span className="mypage-menu-icon" style={{ background: "#F3EEFF" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#F3EEFF" />
              <path d="M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z" stroke="#A285E6" strokeWidth="1.5" />
              <path d="M9.5 13l2 2 3-3" stroke="#A285E6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">신원 인증</div>
            <div className="mypage-menu-desc">본인인증 및 자격증 등록</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/resume?tab=review')}>
          <span className="mypage-menu-icon" style={{ background: "#FFF4E6" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFF4E6" />
              <path d="M12 7l2.09 4.26L19 12.27l-3.41 3.32L15.18 19 12 16.77 8.82 19l.59-5.41L5 12.27l4.91-.99L12 7z" stroke="#FF9C4B" strokeWidth="1.5" fill="none" />
            </svg>
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">평가 관리</div>
            <div className="mypage-menu-desc">받은 평가 및 후기</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/resume?tab=alarm')}>
          <span className="mypage-menu-icon" style={{ background: "#F7F7F7" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#F7F7F7" />
              <path d="M12 8v4l3 3" stroke="#A3A3A3" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <div className="mypage-menu-text">
            <div className="mypage-menu-title">알림 설정</div>
            <div className="mypage-menu-desc">매칭 및 급여 알림</div>
          </div>
          <span className="mypage-menu-arrow">&gt;</span>
        </div>

        <div className="mypage-menu-item" onClick={() => navigate('/support')}>
          <span className="mypage-menu-icon" style={{ background: "#FFEAEA" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#FFEAEA" />
              <path d="M8 8l8 8M8 16l8-8" stroke="#E53E3E" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
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