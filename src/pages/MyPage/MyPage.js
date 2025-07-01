
import { useNavigate } from "react-router-dom";
// import Header from "../../components/Header/Header";
// import Footer from "../../components/Footer/Footer";
import "./MyPage.css";

function MyPage() {
  const navigate = useNavigate();
  const user = {
    name: "김철수",
    desc: "철근공 · 15년 경력",
    rating: 4.8,
    done: 127,
    income: "2,450만",
  };
  return (
    <div className="mypage-page">
      
      <div className="mypage-header-bar">
        <button className="mypage-back-btn" onClick={() => navigate('/')} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="mypage-header-title">마이페이지</span>
      </div>
      <div className="mypage-profile-card">
        <div className="mypage-profile-row">
          <div className="mypage-profile-img">
            <img src={require("../../assets/123.jpg")} alt="프로필" />
          </div>
          <div className="mypage-profile-info">
            <div className="mypage-profile-name">{user.name}</div>
            <div className="mypage-profile-desc">{user.desc}</div>
            <div className="mypage-profile-rating-row">
              <span className="mypage-profile-rating">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight:2}}>
                  <path d="M8 1.5l2.09 4.26 4.66.68-3.38 3.29.8 4.65L8 12.77l-4.17 2.19.8-4.65L1.25 6.44l4.66-.68L8 1.5z" fill="#FFD600" stroke="#FFD600" strokeWidth="1"/>
                </svg>
                <span className="mypage-profile-score">{user.rating}</span>
              </span>
              <span className="mypage-profile-badge">인증 완료</span>
            </div>
          </div>
          <button className="mypage-profile-edit">편집</button>
        </div>
      </div>
      <div className="mypage-stats-row">
        <div className="mypage-stat-box">
          <span className="mypage-stat-value blue">{user.done}</span>
          <span className="mypage-stat-label">완료한 작업</span>
        </div>
        <div className="mypage-stat-box">
          <span className="mypage-stat-value green">₩{user.income}</span>
          <span className="mypage-stat-label">총 수입</span>
        </div>
      </div>
      <div className="mypage-menu-list">
        <div className="mypage-menu-item">
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
        <div className="mypage-menu-item">
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
        <div className="mypage-menu-item">
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
        <div className="mypage-menu-item">
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
        <div className="mypage-menu-item">
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
        <div className="mypage-menu-item">
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
      <button className="mypage-logout-btn">로그아웃</button>
      
    </div>
  );
}

export default MyPage;
