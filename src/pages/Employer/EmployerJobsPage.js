import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // useNavigate 추가
import "./EmployerJobsPage.css";

function EmployerJobsPage() {
    const { user } = useUser();
    const navigate = useNavigate(); // useNavigate 초기화
    const [postings, setPostings] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMyPostings(user.id);
        }
    }, [user]);

    const fetchMyPostings = async (userId) => {
        try {
            const res = await axios.get(`/api/job-postings/user/${userId}`);
            setPostings(res.data.data.postings);
        } catch (err) {
            console.error("공고 불러오기 실패:", err);
        }
    };

    return (
        <div className="employer-jobs-wrapper">
            <h2 className="page-title">내 공고 목록</h2>

            <div className="job-card-list">
                {postings.map((job) => (
                    <div className="job-card gradient-bg" key={job.id}>
                        <div className="job-card-header">
                            <h3 className="job-title">{job.title}</h3>
                            <span className="job-pay">
                                {job.dailyWage?.toLocaleString()}원
                            </span>
                        </div>
                        <p className="job-company">{job.jobType}</p>
                        <div className="job-location">📍 {job.region}</div>
                        <div className="job-footer">
                            <button
                                className="view-btn"
                                onClick={() => window.location.href = `/job-edit/${job.id}`}
                            >공고 수정
                            </button>
                            <button
                                className="view-btn"
                                onClick={() => navigate(`/employer/job-applicants/${job.id}`)}
                            >지원자 관리
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default EmployerJobsPage;
