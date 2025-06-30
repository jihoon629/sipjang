import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as jobPostingsService from '../services/jobPostingsService';
import * as resumesService from '../services/resumesService';

function JobPostingDetailPage({ currentUserId }) {
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
        const jobResponse = await jobPostingsService.getJobPostingDetails(id);
        if (jobResponse.status === 'success') {
          setJobPosting(jobResponse.data);
        } else {
          throw new Error('Failed to load job posting details.');
        }

        if (currentUserId) {
          const resumeResponse = await resumesService.getUserResumes(currentUserId);
          if (resumeResponse.status === 'success') {
            setResumes(resumeResponse.data.resumes || []);
          }
        }
      } catch (err) {
        setError(err.message || 'An error occurred.');
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
      const response = await jobPostingsService.applyToJob(id, selectedResumeId);
      setMessage(response.message || '성공적으로 지원했습니다.');
    } catch (err) {
      setMessage(err.message || '지원 중 오류가 발생했습니다.');
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
