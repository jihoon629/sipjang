import "./Resume.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Resume() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  // 임시 상태(실제 서비스라면 useState로 각 항목별 관리)
  const [profile, setProfile] = useState({
    name: "김철수",
    desc: "철근공 · 15년 경력",
    rating: 4.8,
    projects: 127,
    trust: 98,
    done: 127,
    exp: 15,
  });

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  return (
    <div className="resume-page">
      {/* 상단 네비게이션 */}
      <div className="resume-header-bar">
        <button className="resume-back-btn" onClick={() => navigate("/")} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="resume-header-title">내 이력서</span>
        {editMode ? (
          <button className="resume-edit-btn" onClick={() => setEditMode(false)}>저장</button>
        ) : (
          <button className="resume-edit-btn" onClick={() => setEditMode(true)}>편집</button>
        )}
      </div>

      {/* 프로필 카드 */}
      <div className="resume-profile-card">
        <div className="resume-profile-row">
          <div className="resume-profile-img"></div>
          <div className="resume-profile-info">
            {editMode ? (
              <>
                <input
                  className="resume-profile-name-input"
                  name="name"
                  value={profile.name}
                  onChange={handleProfileChange}
                  style={{ fontWeight: 700, fontSize: "1.13rem", marginBottom: 2 }}
                />
                <input
                  className="resume-profile-desc-input"
                  name="desc"
                  value={profile.desc}
                  onChange={handleProfileChange}
                  style={{ fontSize: "0.98rem", color: "#666", marginBottom: 2 }}
                />
              </>
            ) : (
              <>
                <div className="resume-profile-name">{profile.name}</div>
                <div className="resume-profile-desc">{profile.desc}</div>
              </>
            )}
            <div className="resume-profile-rating">
              <span className="resume-profile-star">★</span>
              <span className="resume-profile-score">{profile.rating}</span>
              <span className="resume-profile-projects">· 완료 프로젝트 {profile.projects}개</span>
            </div>
          </div>
        </div>
        <div className="resume-profile-stats">
          <div className="resume-profile-stat">
            <span className="resume-profile-stat-value blue">{profile.trust}%</span>
            <span className="resume-profile-stat-label">신뢰도</span>
          </div>
          <div className="resume-profile-stat">
            <span className="resume-profile-stat-value green">{profile.done}</span>
            <span className="resume-profile-stat-label">완료 작업</span>
          </div>
          <div className="resume-profile-stat">
            <span className="resume-profile-stat-value orange">{profile.exp}년</span>
            <span className="resume-profile-stat-label">경력</span>
          </div>
        </div>
      </div>

      {/* 전문 기술 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="기술">🛠️</span> 전문 기술
        </div>
        <div className="resume-skill-list">
          <span className="resume-skill">철근 배근</span>
          <span className="resume-skill">철근 절단</span>
          <span className="resume-skill">도면 해독</span>
          <span className="resume-skill">안전 관리</span>
          <span className="resume-skill">품질 검사</span>
        </div>
      </div>

      {/* 주요 경력 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="경력">📂</span> 주요 경력
        </div>
        <div className="resume-career-list">
          <div className="resume-career-item">
            <div className="resume-career-title">롯데월드타워 신축공사</div>
            <div className="resume-career-meta">2019.03 - 2021.12 · 대림산업</div>
            <div className="resume-career-desc">초고층 건물 철근 작업 담당, 안전사고 제로 달성</div>
          </div>
          <div className="resume-career-item">
            <div className="resume-career-title">강남 아파트 재건축</div>
            <div className="resume-career-meta">2017.06 - 2019.02 · 현대건설</div>
            <div className="resume-career-desc">대규모 아파트 단지 철근 시공, 품질 우수상 수상</div>
          </div>
          <div className="resume-career-item">
            <div className="resume-career-title">인천공항 제2터미널</div>
            <div className="resume-career-meta">2015.01 - 2017.05 · 삼성물산</div>
            <div className="resume-career-desc">공항 터미널 철근 구조물 시공</div>
          </div>
        </div>
      </div>

      {/* 자격증 & 교육 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="자격증">📝</span> 자격증 & 교육
        </div>
        <div className="resume-cert-list">
          <div className="resume-cert-item">
            <span className="resume-cert-name">철근공 기능사</span>
            <span className="resume-cert-date">2008.05</span>
          </div>
          <div className="resume-cert-item">
            <span className="resume-cert-name">건설안전기사</span>
            <span className="resume-cert-date">2012.11</span>
          </div>
          <div className="resume-cert-item">
            <span className="resume-cert-name">크레인 운전기능사</span>
            <span className="resume-cert-date">2015.03</span>
          </div>
          <div className="resume-cert-item">
            <span className="resume-cert-name">산업안전보건교육 (40시간)</span>
            <span className="resume-cert-date">2024.01</span>
          </div>
        </div>
      </div>

      {/* 연락처 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="연락처">📞</span> 연락처
        </div>
        <div className="resume-contact-list">
          <div className="resume-contact-item">
            <span className="resume-contact-icon">📱</span>
            <span>010-1234-5678</span>
          </div>
          <div className="resume-contact-item">
            <span className="resume-contact-icon">📧</span>
            <span>kim.cs@email.com</span>
          </div>
          <div className="resume-contact-item">
            <span className="resume-contact-icon">🏠</span>
            <span>서울시 강남구 거주</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
