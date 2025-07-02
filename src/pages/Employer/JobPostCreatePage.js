// src/pages/Employer/JobPostCreatePage.js
import React, { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import "./JobPostCreatePage.css";

function JobPostCreatePage() {
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
        workHours: "",
        contactInfo: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            const res = await axios.post("/api/job-postings", {
                ...form,
                userId: user.id,
            });
            alert("공고 등록 완료!");
            window.location.href = "/employerjobs";
        } catch (err) {
            alert("등록 실패");
        }
    };

    return (
        <div className="job-post-create-wrapper">
            <h2 className="form-title">공고 등록</h2>
            <div className="form-grid">
                <input name="title" placeholder="제목" onChange={handleChange} />
                <input name="jobType" placeholder="직종" onChange={handleChange} />
                <input name="region" placeholder="지역" onChange={handleChange} />
                <input name="siteDescription" placeholder="현장 설명" onChange={handleChange} />
                <input name="dailyWage" placeholder="일급 (숫자만)" onChange={handleChange} />
                <input name="requiredSkills" placeholder="필요 기술" onChange={handleChange} />
                <input name="workStartDate" placeholder="시작일 (YYYY-MM-DD)" onChange={handleChange} />
                <input name="workEndDate" placeholder="종료일 (YYYY-MM-DD)" onChange={handleChange} />
                <input name="workHours" placeholder="근무시간 (예: 09:00-18:00)" onChange={handleChange} />
                <input name="contactInfo" placeholder="연락처" onChange={handleChange} />
            </div>
            <button className="submit-btn" onClick={handleSubmit}>등록하기</button>
        </div>
    );
}

export default JobPostCreatePage;
