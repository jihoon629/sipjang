import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

function ResumeDetailPage() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const fetched = useRef(false);

  useEffect(() => {
    if (fetched.current) {
      return;
    }
    fetched.current = true;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/resumes/${id}`);
        if (response.data && response.data.status === 'success') {
          setResume(response.data.data);
        } else {
          setError('Failed to load resume details.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  if (!resume) {
    return <div>No resume found.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Resume Details</h2>
      <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '20px' }}>
        <h3>{resume.user?.username || 'N/A'}'s Resume</h3>
        <p><strong>Resume ID:</strong> {resume.id}</p>
        <p><strong>Owner:</strong> {resume.user?.username || 'N/A'} ({resume.user?.email})</p>
        <hr />
        <p><strong>Job Type:</strong> {resume.jobType}</p>
        <p><strong>Desired Region:</strong> {resume.region}</p>
        <p><strong>Desired Daily Wage:</strong> {resume.desiredDailyWage}원</p>
        <p><strong>Skills:</strong> {resume.skills}</p>
        <p><strong>Self Introduction:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
          {resume.selfIntroduction}
        </p>
        <hr />
        <p><strong>Last Updated:</strong> {new Date(resume.updatedAt).toLocaleString()}</p>
      </div>

      {resume.blockchainExperience && resume.blockchainExperience.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h2>Blockchain Verified Experience</h2>
          <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '20px', backgroundColor: '#f0f8ff' }}>
            {resume.blockchainExperience.map((exp, index) => (
              <div key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '10px', marginBottom: '10px' }}>
                <h4>{exp.jobTitle}</h4>
                <p><strong>Job Posting ID:</strong> {exp.jobPostingId}</p>
                <p><strong>Employer ID:</strong> {exp.employerId}</p>
                <p><strong>Work Period:</strong> {exp.workPeriod}</p>
                <p><strong>Recorded on:</strong> {new Date(exp.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeDetailPage;
