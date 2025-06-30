import "./Resume.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { resumeAPI } from "../../services/resumesService";

function Resume() {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);

  // API 필드에 맞는 이력서 데이터 상태
  const [resumeData, setResumeData] = useState({
    jobType: "건설",
    region: "서울",
    selfIntroduction: "성실하게 일합니다.",
    desiredDailyWage: 170000,
    skills: ["용접", "미장"] // 배열로 변경
  });

  // 간단한 프로필 정보 (이름, 경력만)
  const [profile, setProfile] = useState({
    name: "김철수",
    experience: "15년 경력"
  });

  // 기술 선택 옵션들
  const skillOptions = [
    "용접", "미장", "타일", "도장", "철근", "목공", "전기", "배관", 
    "석공", "조적", "방수", "단열", "유리", "지붕", "토목", "조경"
  ];

  // 블록체인 경력 데이터 (API에서 가져올 데이터 시뮬레이션)
  const [blockchainExperience] = useState([
    {
      docType: "experience",
      jobPostingId: "1",
      jobTitle: "서울 강남 현장 인력 급구",
      workerId: "1",
      employerId: "2",
      workPeriod: "2024-01-01 ~ 2024-06-30",
      timestamp: "2024-07-01T10:00:00.000Z"
    },
    {
      docType: "experience",
      jobPostingId: "2",
      jobTitle: "부산 해운대 아파트 신축",
      workerId: "1",
      employerId: "3",
      workPeriod: "2023-06-01 ~ 2023-12-31",
      timestamp: "2024-01-01T10:00:00.000Z"
    }
  ]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => {
    const { name, value } = e.target;
    setResumeData({ ...resumeData, [name]: value });
  };

  // 기술 추가/제거 핸들러
  const handleSkillToggle = (skill) => {
    const currentSkills = resumeData.skills;
    if (currentSkills.includes(skill)) {
      setResumeData({ 
        ...resumeData, 
        skills: currentSkills.filter(s => s !== skill)
      });
    } else {
      setResumeData({ 
        ...resumeData, 
        skills: [...currentSkills, skill]
      });
    }
  };

  const handleSaveResume = async () => {
    try {
      // 이력서 저장 API 호출
      await resumeAPI.saveResume(resumeData);
      console.log('이력서 저장 성공:', resumeData);
      setEditMode(false);
      alert('이력서가 성공적으로 저장되었습니다.');
    } catch (error) {
      console.error('이력서 저장 실패:', error);
      alert('이력서 저장에 실패했습니다. 다시 시도해주세요.');
    }
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
          <button className="resume-edit-btn" onClick={handleSaveResume}>저장</button>
        ) : (
          <button className="resume-edit-btn" onClick={() => setEditMode(true)}>편집</button>
        )}
      </div>

      {/* 프로필 정보 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="프로필">👤</span> 프로필 정보
        </div>
        <div className="resume-form-grid">
          <div className="resume-form-item">
            <label className="resume-form-label">이름</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="이름을 입력하세요"
              />
            ) : (
              <div className="resume-form-value">{profile.name}</div>
            )}
          </div>
          <div className="resume-form-item">
            <label className="resume-form-label">경력</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="text"
                name="experience"
                value={profile.experience}
                onChange={handleProfileChange}
                placeholder="경력을 입력하세요 (예: 15년 경력)"
              />
            ) : (
              <div className="resume-form-value">{profile.experience}</div>
            )}
          </div>
        </div>
      </div>

      {/* 기본 정보 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="정보">📋</span> 기본 정보
        </div>
        <div className="resume-form-grid">
          <div className="resume-form-item">
            <label className="resume-form-label">희망 직종</label>
            {editMode ? (
              <select 
                className="resume-form-select"
                name="jobType"
                value={resumeData.jobType}
                onChange={handleResumeChange}
              >
                <option value="건설">건설</option>
                <option value="운송">운송</option>
                <option value="제조">제조</option>
                <option value="서비스">서비스</option>
                <option value="기타">기타</option>
              </select>
            ) : (
              <div className="resume-form-value">{resumeData.jobType}</div>
            )}
          </div>
          <div className="resume-form-item">
            <label className="resume-form-label">희망 지역</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="text"
                name="region"
                value={resumeData.region}
                onChange={handleResumeChange}
                placeholder="희망 근무 지역"
              />
            ) : (
              <div className="resume-form-value">{resumeData.region}</div>
            )}
          </div>
          <div className="resume-form-item">
            <label className="resume-form-label">희망 일급</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="number"
                name="desiredDailyWage"
                value={resumeData.desiredDailyWage}
                onChange={handleResumeChange}
                placeholder="희망 일급 (원)"
              />
            ) : (
              <div className="resume-form-value">{resumeData.desiredDailyWage?.toLocaleString()}원</div>
            )}
          </div>
        </div>
      </div>

      {/* 전문 기술 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="기술">🛠️</span> 전문 기술
        </div>
        {editMode ? (
          <div className="resume-skill-selector">
            <div className="resume-skill-selector-label">보유 기술을 선택하세요:</div>
            <div className="resume-skill-options">
              {skillOptions.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className={`resume-skill-option ${
                    resumeData.skills.includes(skill) ? 'selected' : ''
                  }`}
                  onClick={() => handleSkillToggle(skill)}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="resume-skill-list">
            {resumeData.skills.map((skill, index) => (
              <span key={index} className="resume-skill">{skill}</span>
            ))}
          </div>
        )}
      </div>

      {/* 자기소개 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="소개">💬</span> 자기소개
        </div>
        {editMode ? (
          <textarea 
            className="resume-form-textarea"
            name="selfIntroduction"
            value={resumeData.selfIntroduction}
            onChange={handleResumeChange}
            placeholder="자기소개를 입력하세요"
            rows={4}
          />
        ) : (
          <div className="resume-intro-text">{resumeData.selfIntroduction}</div>
        )}
      </div>

      {/* 블록체인 인증 경력 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="경력">🔗</span> 블록체인 인증 경력
        </div>
        {blockchainExperience.length > 0 ? (
          <div className="resume-career-list">
            {blockchainExperience.map((exp, index) => (
              <div key={index} className="resume-career-item blockchain">
                <div className="resume-career-title">{exp.jobTitle}</div>
                <div className="resume-career-meta">
                  {exp.workPeriod} · 블록체인 인증
                </div>
                <div className="resume-career-timestamp">
                  인증일: {new Date(exp.timestamp).toLocaleDateString('ko-KR')}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="resume-no-experience">
            아직 블록체인에 기록된 경력이 없습니다.
          </div>
        )}
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
