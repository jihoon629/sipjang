import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import AddressPopup from "../../components/AddressPopup/AddressPopup";
import "./JobPostCreatePage.css";

// 직종 목록 분리
const GENERAL_WORKERS = [
  // 일반 직종
  "보통인부", "자재정리", "신호수", "준공청소", "해체정리", "작업팀장", "세대청소", 
  "곰방", "양중", "안전관리", "안전시설", "화재감시자", "안전감시단", "농촌", 
  "경계석공", "토류판공", "보양공", "전기공", "알폼", "경비원", "할석공", 
  "직영-건축반장", "직영-안전반장", "미화", "고정 신호수",
];

const SKILLED_WORKERS = [
  // 기능공 직종
  "건축배관", "형틀목공", "강구조", "건축목공", "철근", "비계", "조경", "석공", 
  "도장", "미장", "토공", "조적", "타일", "일반용접", "콘크리트", "수장", "방수", 
  "덕트", "창호", "도배", "건축기계설비", "철거", "건출", "일반기계설비", 
  "패널조립", "보온", "유리", "플랜트기계설비", "제관", "플랜트계측설비", 
  "코킹", "포장", "벌목", "궤도", "상하수도배관", "보링", "발파", "지붕", 
  "플랜트배관", "잠수", "플랜트제관", "플랜트용접", "준설", "플랜트전기설비", 
  "플랜트보온", "보일러", "일반특수용접", "플랜트덕트", "플랜트특수용접",
];

// 기타 추가
const OTHER_JOB_TYPES = ["기타"];

function JobPostCreatePage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [form, setForm] = useState({
        title: "",
        jobType: "",
        region: "",
        siteDescription: "",
        dailyWage: "",
        requiredSkills: "",
        workStartDate: "",
        workEndDate: "",
        workStartHour: "09:00",
        workEndHour: "18:00",
        contactInfo: "",
    });
    const [showAddressPopup, setShowAddressPopup] = useState(false);
    const [showJobTypeDropdown, setShowJobTypeDropdown] = useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleAddressSelect = (addressData) => {
        const regionText = addressData.roadFullAddr || addressData.jibunAddr;
        setForm(prev => ({
            ...prev,
            region: regionText.trim()
        }));
        setShowAddressPopup(false);
    };

    const handleJobTypeSelect = (jobType) => {
        setForm(prev => ({
            ...prev,
            jobType: jobType
        }));
        setShowJobTypeDropdown(false);
    };

    const handleSubmit = async () => {
        try {
            if (!user || !user.id) {
                alert("로그인이 필요합니다.");
                return;
            }

            // 필수 입력 검증
            if (!form.title || !form.jobType || !form.region || !form.dailyWage || 
                !form.workStartDate || !form.workEndDate) {
                alert("필수 항목을 모두 입력해주세요. (제목, 직종, 지역, 일급, 시작일, 종료일)");
                return;
            }

            const payload = {
                userId: user.id,
                title: form.title,
                jobType: form.jobType,
                region: form.region,
                dailyWage: parseInt(form.dailyWage.replace(/,/g, '')),
                workStartDate: form.workStartDate,
                workEndDate: form.workEndDate,
                workHours: `${form.workStartHour}-${form.workEndHour}`,
                contactInfo: form.contactInfo,
                requiredSkills: form.requiredSkills,
                siteDescription: form.siteDescription,
            };

            await axios.post("/api/job-postings", payload);
            alert("공고 등록 완료!");
            navigate("/employerjobs");
        } catch (err) {
            console.error("등록 실패:", err.response?.data || err.message);
            alert("등록 실패: 입력값을 확인해주세요.");
        }
    };

    // 일급 입력 시 천 단위 쉼표 추가
    const handleDailyWageChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            value = parseInt(value).toLocaleString();
        }
        setForm({ ...form, dailyWage: value });
    };

    return (
        <div className="job-post-create-wrapper">
            <h2 className="form-title">공고 작성</h2>
            <div className="form-grid">
                <div className="form-field">
                    <label>제목 <span className="required">*</span></label>
                    <input 
                        name="title" 
                        value={form.title} 
                        onChange={handleChange}
                        placeholder="공고 제목을 입력하세요" 
                    />
                </div>
                <div className="form-field">
                    <label>직종 <span className="required">*</span></label>
                    <div className="custom-select-container">
                        <input 
                            name="jobType" 
                            value={form.jobType} 
                            onChange={handleChange}
                            onClick={() => setShowJobTypeDropdown(!showJobTypeDropdown)}
                            placeholder="직종을 선택하세요"
                            readOnly
                        />
                        {showJobTypeDropdown && (
                            <div className="custom-select-options">
                                <div className="job-type-categories">
                                    <div className="job-type-category">
                                        <h4 className="category-title">일반인부</h4>
                                        <div className="job-type-list">
                                            {GENERAL_WORKERS.map((jobType) => (
                                                <div 
                                                    key={jobType} 
                                                    className="job-type-option"
                                                    onClick={() => handleJobTypeSelect(jobType)}
                                                >
                                                    {jobType}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="job-type-category">
                                        <h4 className="category-title">기능공</h4>
                                        <div className="job-type-list">
                                            {SKILLED_WORKERS.map((jobType) => (
                                                <div 
                                                    key={jobType} 
                                                    className="job-type-option"
                                                    onClick={() => handleJobTypeSelect(jobType)}
                                                >
                                                    {jobType}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="job-type-other">
                                    {OTHER_JOB_TYPES.map((jobType) => (
                                        <div 
                                            key={jobType} 
                                            className="job-type-option other"
                                            onClick={() => handleJobTypeSelect(jobType)}
                                        >
                                            {jobType}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-field">
                    <label>지역 <span className="required">*</span></label>
                    <div className="resume-address-input-group">
                        <input
                            name="region"
                            value={form.region}
                            onChange={handleChange}
                            readOnly
                            placeholder="주소 검색 버튼을 클릭하세요"
                        />
                        <button
                            type="button"
                            className="resume-address-search-btn"
                            onClick={() => setShowAddressPopup(true)}
                        >
                            주소 검색
                        </button>
                    </div>
                </div>
                <div className="form-field">
                    <label>연락처 <span className="required">*</span></label>
                    <input 
                        name="contactInfo" 
                        value={form.contactInfo} 
                        onChange={handleChange}
                        placeholder="연락 가능한 전화번호를 입력하세요" 
                    />
                </div>
                <div className="form-field-inline">
                    <div className="form-field">
                        <label>시작일 <span className="required">*</span></label>
                        <input 
                            type="date" 
                            name="workStartDate" 
                            value={form.workStartDate} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div className="form-field">
                        <label>종료일 <span className="required">*</span></label>
                        <input 
                            type="date" 
                            name="workEndDate" 
                            value={form.workEndDate} 
                            onChange={handleChange} 
                        />
                    </div>
                </div>
                <div className="form-field">
                    <label>일급 <span className="required">*</span></label>
                    <input 
                        name="dailyWage" 
                        value={form.dailyWage} 
                        onChange={handleDailyWageChange}
                        placeholder="숫자만 입력하세요" 
                    />
                </div>
                <div className="form-field">
                    <label>근무 시간</label>
                    <div className="time-select-inline">
                        <select name="workStartHour" value={form.workStartHour} onChange={handleChange}>
                            {hours.map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                        <span>~</span>
                        <select name="workEndHour" value={form.workEndHour} onChange={handleChange}>
                            {hours.map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-field form-field-required-skills">
                    <label>요구 역량</label>
                    <textarea 
                        name="requiredSkills" 
                        value={form.requiredSkills} 
                        onChange={handleChange} 
                        rows="2"
                        placeholder="필요한 기술이나 경험을 입력하세요" 
                    />
                </div>
                <div className="form-field form-field-site-description">
                    <label>현장 설명</label>
                    <textarea 
                        name="siteDescription" 
                        value={form.siteDescription} 
                        onChange={handleChange} 
                        rows="4"
                        placeholder="작업 현장에 대한 상세 설명을 입력하세요" 
                    />
                </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit}>등록 완료</button>
            {showAddressPopup && (
                <AddressPopup
                    onAddressSelect={handleAddressSelect}
                    onClose={() => setShowAddressPopup(false)}
                />
            )}
        </div>
    );
}

export default JobPostCreatePage;