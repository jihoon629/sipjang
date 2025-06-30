import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as usersService from '../services/usersService';

function ExperiencePage() {
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: userId } = useParams();

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        setLoading(true);
        const response = await usersService.getUserExperience(userId);
        if (response.status === 'success') {
          setExperience(response.data);
        } else {
          setError('Failed to load experience.');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching experience.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchExperience();
    }
  }, [userId]);

  if (loading) {
    return <div>Loading work experience...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Work Experience for User #{userId}</h2>
      <p>This data is securely stored on the blockchain.</p>
      {experience.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {experience.map((exp, index) => (
            <li key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
              <h4>{exp.jobTitle}</h4>
              <p><strong>Job Posting ID:</strong> {exp.jobPostingId}</p>
              <p><strong>Employer ID:</strong> {exp.employerId}</p>
              <p><strong>Work Period:</strong> {exp.workPeriod}</p>
              <p><strong>Recorded on:</strong> {new Date(exp.timestamp).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No work experience found for this user.</p>
      )}
    </div>
  );
}

export default ExperiencePage;
