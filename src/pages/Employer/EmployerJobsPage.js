import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { getUserJobPostings, updateJobPostingStatus } from "../../services/jobPostingsService";
import { useNavigate } from "react-router-dom";
import "./EmployerJobsPage.css";

function EmployerJobsPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [postings, setPostings] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMyPostings(user.id);
        }
    }, [user]);

    const fetchMyPostings = async (userId) => {
        try {
            const res = await getUserJobPostings(userId);
            setPostings(res.data.postings);
        } catch (err) {
            console.error("공고 불러오기 실패:", err);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        if (window.confirm(`정말로 공고를 ${newStatus === 'closed' ? '마감' : '모집중'}으로 변경하시겠습니까?`)) {
            try {
                const res = await updateJobPostingStatus(jobId, newStatus);
                const updatedJobPosting = res.data; // API 응답에서 업데이트된 공고 정보 추출

                setPostings(prevPostings =>
                    prevPostings.map(job =>
                        job.id === jobId ? { ...job, status: updatedJobPosting.status } : job
                    )
                );
            } catch (err) {
                console.error("공고 상태 변경 실패:", err);
                alert("공고 상태 변경에 실패했습니다.");
            }
        }
    };

    return (
        <div className="employer-jobs-wrapper">
            <h2 className="page-title">내 공고 목록</h2>

            <div className="job-card-list">
                {postings.map((job) => {
                    console.log(`Job ID: ${job.id}, Status: ${job.status}`);
                    return (
                    <div className="job-card gradient-bg" key={job.id}>
                        <div className="job-card-header">
                            <h3 className="job-title">{job.title}</h3>
                            <span className={`job-status ${job.status === 'closed' ? 'closed' : ''}`}>
                                {job.status === 'closed' ? '마감' : '모집중'}
                            </span>
                            <span className="job-pay">
                                {job.dailyWage?.toLocaleString()}원
                            </span>
                        </div>
                        <p className="job-company">{job.jobType}</p>
                        <div className="job-location">📍 {job.region}</div>
                        <div className="job-footer">
                            <div className="job-footer-button-group">
                                <button
                                    className="view-btn"
                                    onClick={() => navigate(`/job-edit/${job.id}`)}
                                >공고 수정</button>

                                {job.status !== 'closed' && (
                                    <button
                                        className="view-btn"
                                        onClick={() => handleStatusChange(job.id, 'closed')}
                                    >공고 마감</button>
                                )}

                                <button
                                    className="view-btn"
                                    onClick={() => navigate(`/employer/job-applicants/${job.id}`)}
                                >지원자 관리</button>
                            </div>
                        </div>
                    </div>
                    );
                })}
            </div>
        </div>
    );
}

export default EmployerJobsPage;
