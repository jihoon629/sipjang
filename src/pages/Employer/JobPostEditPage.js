// src/pages/Employer/JobPostEditPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobPostCreatePage.css";

function JobPostEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`/api/job-postings/${id}`);
                const data = res.data.data;
                setForm({
                    title: data.title,
                    jobType: data.jobType,
                    region: data.region,
                    siteDescription: data.siteDescription,
                    dailyWage: data.dailyWage,
                    requiredSkills: data.requiredSkills,
                    workStartDate: data.workStartDate,
                    workEndDate: data.workEndDate,
                    workHours: data.workHours,
                    contactInfo: data.contactInfo,
                });
            } catch (err) {
                console.error("공고 상세 불러오기 실패:", err);
            }
        };
        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/api/job-postings/${id}`, form);
            alert("수정 완료!");
            navigate("/employerjobs");
        } catch (err) {
            alert("수정 실패");
        }
    };

    if (!form) return <div>로딩 중...</div>;

    return (
        <div className="job-post-create-wrapper">
            <h2 className="form-title">공고 수정</h2>
            <div className="form-grid">
                <input name="title" value={form.title} onChange={handleChange} placeholder="제목" />
                <input name="jobType" value={form.jobType} onChange={handleChange} placeholder="직종" />
                <input name="region" value={form.region} onChange={handleChange} placeholder="지역" />
                <input name="siteDescription" value={form.siteDescription} onChange={handleChange} placeholder="현장 설명" />
                <input name="dailyWage" value={form.dailyWage} onChange={handleChange} placeholder="일급" />
                <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="필요 기술" />
                <input name="workStartDate" value={form.workStartDate} onChange={handleChange} placeholder="시작일" />
                <input name="workEndDate" value={form.workEndDate} onChange={handleChange} placeholder="종료일" />
                <input name="workHours" value={form.workHours} onChange={handleChange} placeholder="근무 시간" />
                <input name="contactInfo" value={form.contactInfo} onChange={handleChange} placeholder="연락처" />
            </div>
            <button className="submit-btn" onClick={handleUpdate}>수정 완료</button>
        </div>
    );
}

export default JobPostEditPage;
