import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

function JobPostingDetailPage({ currentUserId }) { // currentUserId 프롭 추가
  const [jobPosting, setJobPosting] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const { id } = useParams();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) {
      return;
    }
    fetched.current = true;

    const fetchPageData = async () => {
      try {
        setLoading(true);
        // 공고 상세 정보 가져오기
        const jobResponse = await axios.get(`${API_BASE_URL}/job-postings/${id}`);
        if (jobResponse.data && jobResponse.data.status === 'success') {
          setJobPosting(jobResponse.data.data);
        } else {
          throw new Error('Failed to load job posting details.');
        }

        // 로그인한 사용자의 이력서 목록 가져오기
        if (currentUserId) {
          const resumeResponse = await axios.get(`${API_BASE_URL}/resumes/user/${currentUserId}`);
          if (resumeResponse.data && resumeResponse.data.status === 'success') {
            setResumes(resumeResponse.data.data.resumes || []);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPageData();
    }
  }, [id, currentUserId]);

  const handleApply = async () => {
    if (!selectedResumeId) {
      setMessage('지원할 이력서를 선택해주세요.');
      return;
    }
    try {
      setMessage('');
      const response = await axios.post(`${API_BASE_URL}/job-postings/${id}/apply`, {
        resumeId: selectedResumeId,
      });
      setMessage(response.data.message || '성공적으로 지원했습니다.');
    } catch (err) {
      setMessage(err.response?.data?.message || '지원 중 오류가 발생했습니다.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!jobPosting) {
    return <div>No job posting found.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Job Posting Details</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h3>{jobPosting.title}</h3>
        {/* ... 공고 상세 정보 ... */}
        <p><strong>ID:</strong> {jobPosting.id}</p>
        <p><strong>Job Type:</strong> {jobPosting.jobType}</p>
        <p><strong>Posted by:</strong> {jobPosting.user?.username || 'N/A'} ({jobPosting.user?.email})</p>
        <p><strong>Region:</strong> {jobPosting.region}</p>
        <p><strong>Daily Wage:</strong> {jobPosting.dailyWage}원</p>
        <p><strong>Description:</strong> {jobPosting.siteDescription}</p>
        <p><strong>Required Skills:</strong> {jobPosting.requiredSkills}</p>
        <p><strong>Work Period:</strong> {jobPosting.workStartDate} ~ {jobPosting.workEndDate}</p>
        <p><strong>Work Hours:</strong> {jobPosting.workHours}</p>
        <p><strong>Contact:</strong> {jobPosting.contactInfo}</p>
        <p><strong>Views:</strong> {jobPosting.viewCount}</p>
        <p><strong>Last Updated:</strong> {new Date(jobPosting.updatedAt).toLocaleString()}</p>

        {/* 지원하기 섹션 */}
        {currentUserId && (
          <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            <h4>Apply for this Job</h4>
            {resumes.length > 0 ? (
              <div>
                <select 
                  value={selectedResumeId} 
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  style={{ padding: '8px', marginRight: '10px' }}
                >
                  <option value="">-- Select Your Resume --</option>
                  {resumes.map(resume => (
                    <option key={resume.id} value={resume.id}>
                      ID: {resume.id} ({resume.jobType} in {resume.region})
                    </option>
                  ))}
                </select>
                <button onClick={handleApply} disabled={!selectedResumeId}>
                  Apply with Selected Resume
                </button>
              </div>
            ) : (
              <p>You have no resumes. Please create one to apply.</p>
            )}
            {message && <p style={{ marginTop: '15px', color: 'blue' }}>{message}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default JobPostingDetailPage;
