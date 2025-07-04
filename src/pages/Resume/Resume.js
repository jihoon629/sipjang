import "./Resume.css";

import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { resumeAPI } from "../../services/resumesService";
import { useUser } from "../../contexts/UserContext";
import { updateUser } from "../../services/usersService";
import AddressPopup from "../../components/AddressPopup/AddressPopup";

function Resume() {
  const navigate = useNavigate();
  const { user, fetchUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasExistingResume, setHasExistingResume] = useState(false);
  const [currentResume, setCurrentResume] = useState(null); // 현재 편집 중인 이력서
  const [isCreatingNew, setIsCreatingNew] = useState(false); // 새로 작성 모드인지

  // API 필드에 맞는 이력서 데이터 상태 - 빈 폼으로 시작
  const [resumeData, setResumeData] = useState({
    name: "",
    jobType: "",
    region: "",
    selfIntroduction: "",
    desiredDailyWage: "",
    skills: [],
    history: "",
    phone: "",
    certificateImages: []
  });

  // 사용자 정보가 로드되면 이름 초기화 (최초 한 번만)
  const [nameInitialized, setNameInitialized] = useState(false);
  
  useEffect(() => {
    if (user && user.username && resumeData.name === "" && !nameInitialized) {
      setResumeData(prev => ({
        ...prev,
        name: user.username
      }));
      setNameInitialized(true);
    }
  }, [user, resumeData.name, nameInitialized]);


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
            name: latestResume.name || user?.username || "",
            jobType: latestResume.jobType || "",
            region: latestResume.region || "",
            selfIntroduction: latestResume.selfIntroduction || "",
            desiredDailyWage: latestResume.desiredDailyWage || "",
            skills: latestResume.skills ? (typeof latestResume.skills === 'string' ? JSON.parse(latestResume.skills) : latestResume.skills) : [],
            history: latestResume.history ? latestResume.history.toString() : "",
            phone: latestResume.phone || "",
            certificateImages: latestResume.certificateImages ? (typeof latestResume.certificateImages === 'string' ? JSON.parse(latestResume.certificateImages) : latestResume.certificateImages) : []
          });
          setNameInitialized(true); // 이력서 로드 시에도 초기화 완료로 표시
          
          
          console.log('[Resume] 기존 이력서 로드 완료:', latestResume);
          
          // 블록체인 경력 조회
          loadBlockchainExperience();
        } else {
          // 이력서가 없으면 편집 모드로 시작
          setHasExistingResume(false);
          setEditMode(true);
          setIsCreatingNew(true);
          setCurrentResume(null);
          setNameInitialized(false); // 새로 작성 시에는 이름 초기화 허용
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
        setNameInitialized(false); // 에러 시에도 이름 초기화 허용
      } finally {
        setLoading(false);
      }
    };

    loadExistingResume();
  }, [user]);

  // 블록체인 경력 조회
  const loadBlockchainExperience = async () => {
    if (!user || !user.id) return;
    
    try {
      setBlockchainLoading(true);
      const experience = await resumeAPI.getBlockchainExperience(user.id);
      console.log('[Resume] 블록체인 경력 조회 결과:', experience);
      
      // API 응답 구조에 따른 처리
      let experienceData = experience;
      if (experience && experience.data) {
        experienceData = experience.data;
      }
      
      setBlockchainExperience(Array.isArray(experienceData) ? experienceData : []);
    } catch (error) {
      console.error('[Resume] 블록체인 경력 조회 실패:', error);
      setBlockchainExperience([]);
    } finally {
      setBlockchainLoading(false);
    }
  };

  // 블록체인 경력 데이터
  const [blockchainExperience, setBlockchainExperience] = useState([]);
  const [blockchainLoading, setBlockchainLoading] = useState(false);
  
  // 주소 팝업 상태
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  
  // 이미지 모달 상태
  const [showImageModal, setShowImageModal] = useState(false);
  const [modalImageUrl, setModalImageUrl] = useState('');


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

  // 자격증 이미지 첨부 핸들러
  const handleCertificateImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      //모든 파일을 한 번에 FormData에 추가
      const formData = new FormData();
      files.forEach(file => {
        formData.append('certificateImages', file);
      });
        
      //api/upload/certificate-images 엔드포인트로 POST 요청
      const response = await fetch('/api/upload/certificate-images', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || '이미지 업로드 실패');
        }
        
      const result = await response.json();
      console.log('업로드 응답', result); // 디버깅

      const uploadedUrls = result.data?.imageUrls || [];

      if (uploadedUrls.length === 0) {
        throw new Error('업로드된 이미지 URL가 없습니다.');
      }
      
      setResumeData(prev => ({
        ...prev,
        certificateImages: [...(prev.certificateImages || []), ...uploadedUrls]
      }));
      
      alert(`${uploadedUrls.length}개 이미지가 업로드되었습니다.`);
    } catch (error) {
      console.error('자격증 이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 자격증 이미지 삭제 핸들러
  const handleCertificateImageRemove = (indexToRemove) => {
    setResumeData(prev => ({
      ...prev,
      certificateImages: prev.certificateImages.filter((_, index) => index !== indexToRemove)
    }));
  };

  // 주소 팝업 열기
  const handleAddressPopupOpen = () => {
    setShowAddressPopup(true);
  };

  // 주소 선택 핸들러
  const handleAddressSelect = (addressData) => {
    // 도로명주소 + 시군구 정보를 조합하여 희망 지역에 설정
    const regionText = `${addressData.siNm} ${addressData.sggNm} ${addressData.emdNm}`;
    setResumeData(prev => ({
      ...prev,
      region: regionText.trim()
    }));
    setShowAddressPopup(false);
  };

  // 주소 팝업 닫기
  const handleAddressPopupClose = () => {
    setShowAddressPopup(false);
  };

  // 이미지 모달 열기
  const handleImageClick = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowImageModal(true);
  };

  // 이미지 모달 닫기
  const handleImageModalClose = () => {
    setShowImageModal(false);
    setModalImageUrl('');
  };

  // 기존 이력서 삭제
  const handleDeleteResume = async () => {
    if (!currentResume || !currentResume.id) {
      alert('삭제할 이력서가 없습니다.');
      return;
    }
    
    const confirmDelete = window.confirm('정말로 이력서를 삭제하시겠습니까?\n삭제된 이력서는 복구할 수 없습니다.');
    if (!confirmDelete) return;
    
    try {
      await resumeAPI.deleteResume(currentResume.id);
      
      // 상태 초기화
      setHasExistingResume(false);
      setCurrentResume(null);
      setEditMode(true);
      setIsCreatingNew(true);
      setResumeData({
        name: "",
        jobType: "",
        region: "",
        selfIntroduction: "",
        desiredDailyWage: "",
        skills: [],
        history: "",
        phone: "",
        certificateImages: []
      });
      
      alert('이력서가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('이력서 삭제 실패:', error);
      alert('이력서 삭제에 실패했습니다. 다시 시도해주세요.');
    }
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
      const historyValue = resumeData.history && resumeData.history !== "" ? parseInt(resumeData.history, 10) || 0 : 0;
      console.log('[Resume] history 변환:', resumeData.history, '->', historyValue, typeof historyValue);
      
      const resumePayload = {
        userId: user.id,
        name: resumeData.name,
        jobType: resumeData.jobType,
        region: resumeData.region,
        selfIntroduction: resumeData.selfIntroduction,
        desiredDailyWage: resumeData.desiredDailyWage,
        skills: resumeData.skills,
        history: historyValue,
        phone: resumeData.phone,
        certificateImages: resumeData.certificateImages
      };

      // 이름이 변경된 경우 사용자 정보도 업데이트
      console.log('[Resume] 이름 변경 확인:', { 
        resumeName: resumeData.name, 
        userUsername: user.username, 
        isChanged: resumeData.name !== user.username 
      });
      
      if (resumeData.name !== user.username) {
        try {
          console.log('[Resume] 사용자 이름 업데이트 시도:', { 
            userId: user.id, 
            oldUsername: user.username, 
            newUsername: resumeData.name 
          });
          
          const updateResult = await updateUser(user.id, { username: resumeData.name });
          console.log('[Resume] 사용자 이름 업데이트 API 응답:', updateResult);
          
          // 사용자 정보 새로고침
          await fetchUser();
          console.log('[Resume] 사용자 이름 업데이트 완료:', resumeData.name);
        } catch (error) {
          console.error('사용자 이름 업데이트 실패:', error);
          console.error('에러 상세:', error.response?.data || error.message);
          // 사용자 정보 업데이트 실패해도 이력서 저장은 계속 진행
        }
      }

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
          name: currentResume.name || "",
          jobType: currentResume.jobType || "",
          region: currentResume.region || "",
          selfIntroduction: currentResume.selfIntroduction || "",
          desiredDailyWage: currentResume.desiredDailyWage || "",
          skills: currentResume.skills ? (typeof currentResume.skills === 'string' ? JSON.parse(currentResume.skills) : currentResume.skills) : [],
          history: currentResume.history ? currentResume.history.toString() : "",
          phone: currentResume.phone || "",
          certificateImages: currentResume.certificateImages ? (typeof currentResume.certificateImages === 'string' ? JSON.parse(currentResume.certificateImages) : currentResume.certificateImages) : []
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
          {!editMode && hasExistingResume ? (
            <>
              <button className="resume-edit-btn" onClick={handleEditExisting}>편집</button>
              <button className="resume-delete-btn" onClick={handleDeleteResume}>삭제</button>
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
                value={resumeData.name}
                onChange={handleResumeChange}
                placeholder="이름을 입력하세요"
              />
            ) : (
              <div className="resume-form-value">{resumeData.name}</div>
            )}
          </div>
          <div className="resume-form-item">
            <label className="resume-form-label">경력</label>
            {editMode ? (
              <input 
                className="resume-form-input"
                type="number"
                name="history"
                value={resumeData.history}
                onChange={handleResumeChange}
                placeholder="경력 (년)"
              />
            ) : (
              <div className="resume-form-value">{resumeData.history}년</div>
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
              <div className="resume-address-input-group">
                <input 
                  className="resume-form-input"
                  type="text"
                  name="region"
                  value={resumeData.region}
                  onChange={handleResumeChange}
                  placeholder="희망 근무 지역"
                  readOnly
                />
                <button
                  type="button"
                  className="resume-address-search-btn"
                  onClick={handleAddressPopupOpen}
                >
                  주소 검색
                </button>
              </div>
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
        {blockchainLoading ? (
          <div className="resume-loading-experience">
            블록체인 경력을 불러오는 중...
          </div>
        ) : blockchainExperience.length > 0 ? (
          <div className="resume-career-list">
            {blockchainExperience.map((exp, index) => (
              <div key={index} className="resume-career-item blockchain">
                <div className="resume-career-title">{exp.jobTitle || '작업 완료'}</div>
                <div className="resume-career-meta">
                  {exp.workPeriod || `${exp.startDate} ~ ${exp.endDate}`} · 블록체인 인증
                </div>
                <div className="resume-career-timestamp">
                  인증일: {new Date(exp.timestamp || exp.createdAt).toLocaleDateString('ko-KR')}
                </div>
                {exp.employerName && (
                  <div className="resume-career-employer">
                    고용주: {exp.employerName}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="resume-no-experience">
            <div className="resume-no-experience-icon">🔗</div>
            <div className="resume-no-experience-title">블록체인 인증 경력이 없습니다</div>
            <div className="resume-no-experience-desc">
              일자리를 통해 근무를 완료하면<br />
              블록체인에 자동으로 경력이 기록됩니다.
            </div>
          </div>
        )}
      </div>

      {/* 자격증 & 교육 */}
      <div className="resume-section">
        <div className="resume-section-title">
          <span role="img" aria-label="자격증">📝</span> 자격증 & 교육
        </div>
        {editMode ? (
          <div className="resume-certificate-upload">
            <div className="resume-certificate-upload-area">
              <input
                type="file"
                id="certificate-upload"
                multiple
                accept="image/*"
                onChange={handleCertificateImageUpload}
                className="resume-certificate-input"
              />
              <label htmlFor="certificate-upload" className="resume-certificate-label">
                <div className="resume-certificate-icon">📷</div>
                <div className="resume-certificate-text">
                  자격증 이미지를 첨부하세요
                  <br />
                  <small>여러 파일 선택 가능 (JPG, PNG)</small>
                </div>
              </label>
            </div>
            {resumeData.certificateImages.length > 0 && (
              <div className="resume-certificate-list">
                {resumeData.certificateImages.map((imageUrl, index) => (
                  <div key={index} className="resume-certificate-item">
                    <img 
                      src={imageUrl} 
                      alt={`자격증 ${index + 1}`}
                      className="resume-certificate-image"
                      onClick={() => handleImageClick(imageUrl)}
                      style={{ cursor: 'pointer' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleCertificateImageRemove(index)}
                      className="resume-certificate-remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="resume-certificate-display">
            {resumeData.certificateImages.length > 0 ? (
              <div className="resume-certificate-gallery">
                {resumeData.certificateImages.map((imageUrl, index) => (
                  <div key={index} className="resume-certificate-item-display">
                    <img 
                      src={imageUrl} 
                      alt={`자격증 ${index + 1}`}
                      className="resume-certificate-image-display"
                      onClick={() => handleImageClick(imageUrl)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="resume-no-certificates">
                <div className="resume-no-certificates-icon">📝</div>
                <div className="resume-no-certificates-text">
                  등록된 자격증이 없습니다
                  <br />
                  <small>편집 모드에서 자격증 이미지를 추가할 수 있습니다</small>
                </div>
              </div>
            )}
          </div>
        )}
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

      {/* 하단 액션 버튼들 */}
      {editMode && (
        <div className="resume-action-buttons">
          <button className="resume-cancel-btn" onClick={handleCancelEdit}>취소</button>
          <button className="resume-save-btn" onClick={handleSaveResume}>저장</button>
        </div>
      )}
      
      {/* 주소 팝업 */}
      {showAddressPopup && (
        <AddressPopup
          onAddressSelect={handleAddressSelect}
          onClose={handleAddressPopupClose}
        />
      )}

      {/* 이미지 모달 */}
      {showImageModal && (
        <div className="image-modal-overlay" onClick={handleImageModalClose}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button"
              className="image-modal-close" 
              onClick={handleImageModalClose}
            >
              ✕
            </button>
            <img 
              src={modalImageUrl} 
              alt="자격증 원본" 
              className="image-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Resume;
