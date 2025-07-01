import "./Resume.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { resumeAPI } from "../../services/resumesService";
import { useUser } from "../../contexts/UserContext";

function Resume() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [currentResume, setCurrentResume] = useState(null); // 현재 편집 중인 이력서
  const [isCreatingNew, setIsCreatingNew] = useState(false); // 새로 작성 모드인지

  // API 필드에 맞는 이력서 데이터 상태 - 빈 폼으로 시작
  const [resumeData, setResumeData] = useState({
    jobType: "",
    region: "",
    selfIntroduction: "",
    desiredDailyWage: "",
    skills: [],
    experience: "",
    phone: ""
  });

  // 간단한 프로필 정보 (이름만) - 사용자 정보에서 가져올 예정
  const [profile, setProfile] = useState({
    name: ""
  });

  // 기술 선택 옵션들
  const skillOptions = [
    "용접", "미장", "타일", "도장", "철근", "목공", "전기", "배관", 
    "석공", "조적", "방수", "단열", "유리", "지붕", "토목", "조경"
  ];

  // 페이지 로드 시 기존 이력서 조회
  useEffect(() => {
    const loadExistingResume = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        console.log('[Resume] 기존 이력서 조회 시도:', user.id);
        const userResumes = await resumeAPI.getUserResumes(user.id);
        console.log('[Resume] API 응답 결과:', userResumes);
        console.log('[Resume] 응답 타입:', typeof userResumes);
        console.log('[Resume] 배열인가?', Array.isArray(userResumes));
        
        // 응답 구조에 따른 처리
        let resumes = userResumes;
        if (userResumes && userResumes.data && userResumes.data.resumes) {
          resumes = userResumes.data.resumes; // API가 { status: "success", data: { resumes: [...] } } 형태로 응답하는 경우
        } else if (userResumes && userResumes.data) {
          resumes = userResumes.data; // API가 { data: [...] } 형태로 응답하는 경우
        }
        
        console.log('[Resume] 처리된 resumes:', resumes);
        
        if (resumes && resumes.length > 0) {
          // 가장 최근 이력서 로드
          const latestResume = resumes[0];
          setHasExistingResume(true);
          setCurrentResume(latestResume); // 현재 이력서 설정
          
          // 백엔드 데이터를 프론트엔드 형식으로 변환
          setResumeData({
            jobType: latestResume.jobType || "",
            region: latestResume.region || "",
            selfIntroduction: latestResume.selfIntroduction || "",
            desiredDailyWage: latestResume.desiredDailyWage || "",
            skills: latestResume.skills ? (typeof latestResume.skills === 'string' ? JSON.parse(latestResume.skills) : latestResume.skills) : [],
            experience: latestResume.experience || "",
            phone: latestResume.phone || ""
          });
          
          // 사용자 정보 설정
          if (latestResume.user) {
            setProfile({
              name: latestResume.user.username || user.name || ""
            });
          } else {
            setProfile({
              name: user.name || ""
            });
          }
          
          console.log('[Resume] 기존 이력서 로드 완료:', latestResume);
        } else {
          // 이력서가 없으면 편집 모드로 시작
          setHasExistingResume(false);
          setEditMode(true);
          setIsCreatingNew(true);
          setCurrentResume(null);
          setProfile({
            name: user.name || ""
          });
          console.log('[Resume] 기존 이력서 없음, 새로 작성 모드');
          console.log('[Resume] userResumes 상세:', JSON.stringify(userResumes, null, 2));
        }
      } catch (error) {
        console.error('[Resume] 이력서 로드 실패:', error);
        // 에러 발생 시에도 편집 모드로 시작
        setHasExistingResume(false);
        setEditMode(true);
        setIsCreatingNew(true);
        setCurrentResume(null);
        setProfile({
          name: user.name || ""
        });
      } finally {
        setLoading(false);
      }
    };

    loadExistingResume();
  }, [user]);

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

  // 새 이력서 작성 시작
  const handleCreateNew = () => {
    setIsCreatingNew(true);
    setCurrentResume(null);
    setEditMode(true);
    // 빈 폼으로 초기화
    setResumeData({
      jobType: "",
      region: "",
      selfIntroduction: "",
      desiredDailyWage: "",
      skills: [],
      experience: "",
      phone: ""
    });
  };

  // 기존 이력서 편집 시작
  const handleEditExisting = () => {
    setIsCreatingNew(false);
    setEditMode(true);
  };

  // 이력서 저장/업데이트
  const handleSaveResume = async () => {
    try {
      // 로그인 상태 확인
      if (!user || !user.id) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      // 필수 필드 검증
      if (!resumeData.jobType || !resumeData.region) {
        alert('희망 직종과 희망 지역은 필수 입력 항목입니다.');
        return;
      }

      // 백엔드 모델에 맞는 데이터 구조로 변환
      const resumePayload = {
        userId: user.id,
        jobType: resumeData.jobType,
        region: resumeData.region,
        selfIntroduction: resumeData.selfIntroduction,
        desiredDailyWage: resumeData.desiredDailyWage,
        skills: resumeData.skills,
        experience: resumeData.experience,
        phone: resumeData.phone,
        certificateImages: null
      };

      if (isCreatingNew || !currentResume) {
        // 새 이력서 생성
        console.log('새 이력서 생성 시도:', resumePayload);
        const newResume = await resumeAPI.createResume(resumePayload);
        setCurrentResume(newResume);
        setHasExistingResume(true);
        setIsCreatingNew(false);
        alert('새 이력서가 성공적으로 생성되었습니다.');
      } else {
        // 기존 이력서 업데이트
        console.log('이력서 업데이트 시도:', currentResume?.id, resumePayload);
        if (!currentResume?.id) {
          console.error('currentResume.id가 없습니다:', currentResume);
          alert('이력서 ID를 찾을 수 없습니다. 페이지를 새로고침해주세요.');
          return;
        }
        const updatedResume = await resumeAPI.updateResume(currentResume.id, resumePayload);
        console.log('업데이트된 이력서 응답:', updatedResume);
        // 응답 구조에 따라 적절히 처리
        const resumeToSet = updatedResume?.data || updatedResume;
        setCurrentResume({ ...currentResume, ...resumeToSet });
        alert('이력서가 성공적으로 수정되었습니다.');
      }
      
      setEditMode(false);
    } catch (error) {
      console.error('이력서 저장/업데이트 실패:', error);
      alert('이력서 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 편집 취소
  const handleCancelEdit = () => {
    if (isCreatingNew) {
      // 새로 작성 취소 시 기존 데이터로 복귀
      if (currentResume) {
        setResumeData({
          jobType: currentResume.jobType || "",
          region: currentResume.region || "",
          selfIntroduction: currentResume.selfIntroduction || "",
          desiredDailyWage: currentResume.desiredDailyWage || "",
          skills: currentResume.skills ? (typeof currentResume.skills === 'string' ? JSON.parse(currentResume.skills) : currentResume.skills) : [],
          experience: currentResume.experience || "",
          phone: currentResume.phone || ""
        });
      }
      setIsCreatingNew(false);
    }
    setEditMode(false);
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="resume-page">
        <div className="resume-header-bar">
          <button className="resume-back-btn" onClick={() => navigate("/")} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="resume-header-title">내 이력서</span>
        </div>
        <div style={{padding: '50px', textAlign: 'center'}}>
          <div>이력서를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="resume-page">
      {/* 상단 네비게이션 */}
      <div className="resume-header-bar">
        <button className="resume-back-btn" onClick={() => navigate("/")} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="resume-header-title">
          {editMode ? (isCreatingNew ? '새 이력서 작성' : '이력서 편집') : '내 이력서'}
        </span>
        <div className="resume-header-buttons">
          {editMode ? (
            <>
              <button className="resume-cancel-btn" onClick={handleCancelEdit}>취소</button>
              <button className="resume-save-btn" onClick={handleSaveResume}>저장</button>
            </>
          ) : hasExistingResume ? (
            <>
              <button className="resume-edit-btn" onClick={handleEditExisting}>편집</button>
              <button className="resume-new-btn" onClick={handleCreateNew}>새로 작성</button>
            </>
          ) : null}
        </div>
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
                type="number"
                name="experience"
                value={resumeData.experience}
                onChange={handleResumeChange}
                placeholder="경력 (년)"
              />
            ) : (
              <div className="resume-form-value">{resumeData.experience}년</div>
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
        <div className="resume-form-grid">
          <div className="resume-form-item">
            <label className="resume-form-label">전화번호</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="tel"
                name="phone"
                value={resumeData.phone}
                onChange={handleResumeChange}
                placeholder="전화번호를 입력하세요 (예: 010-1234-5678)"
              />
            ) : (
              <div className="resume-form-value">{resumeData.phone}</div>
            )}
          </div>
          <div className="resume-form-item">
            <label className="resume-form-label">이메일</label>
            <div className="resume-form-value">{user?.email || ''}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resume;
