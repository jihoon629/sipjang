import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import AddressPopup from "../../components/AddressPopup/AddressPopup";
import "./JobPostCreatePage.css";

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

    const handleSubmit = async () => {
        try {
            if (!user || !user.id) {
                alert("로그인이 필요합니다.");
                return;
            }

            const payload = {
                userId: user.id,
                title: form.title,
                jobType: form.jobType,
                region: form.region,
                dailyWage: form.dailyWage,
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

    return (
        <div className="job-post-create-wrapper">
            <h2 className="form-title">공고 작성</h2>
            <div className="form-grid">
                <div className="form-field">
                    <label>제목</label>
                    <input name="title" value={form.title} onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>직종</label>
                    <input name="jobType" value={form.jobType} onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>지역</label>
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
                    <label>연락처</label>
                    <input name="contactInfo" value={form.contactInfo} onChange={handleChange} />
                </div>
                <div className="form-field-inline">
                    <div className="form-field">
                        <label>시작일</label>
                        <input type="date" name="workStartDate" value={form.workStartDate} onChange={handleChange} />
                    </div>
                    <div className="form-field">
                        <label>종료일</label>
                        <input type="date" name="workEndDate" value={form.workEndDate} onChange={handleChange} />
                    </div>
                </div>
                <div className="form-field">
                    <label>일급</label>
                    <input name="dailyWage" value={form.dailyWage} onChange={handleChange} />
                </div>
                <div className="form-field">
                    <label>근무 시간</label>
                    <div className="time-select-inline">
                        <select name="workStartHour" value={form.workStartHour} onChange={handleChange}>
                            {hours.map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                        <select name="workEndHour" value={form.workEndHour} onChange={handleChange}>
                            {hours.map((hour) => (
                                <option key={hour} value={hour}>{hour}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="form-field form-field-required-skills">
                    <label>요구 역량</label>
                    <textarea name="requiredSkills" value={form.requiredSkills} onChange={handleChange} rows="2" />
                </div>
                <div className="form-field form-field-site-description">
                    <label>현장 설명</label>
                    <textarea name="siteDescription" value={form.siteDescription} onChange={handleChange} rows="4" />
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
