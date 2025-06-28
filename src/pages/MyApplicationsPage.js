import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/applications/my`);
        if (response.data && response.data.status === 'success') {
          setApplications(response.data.data.applications || []);
        } else {
          setError('Failed to load applications.');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred while fetching applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return { color: 'green', fontWeight: 'bold' };
      case 'rejected':
        return { color: 'red', fontWeight: 'bold' };
      case 'completed':
        return { color: 'blue', fontWeight: 'bold' };
      case 'pending':
      default:
        return { color: 'orange', fontWeight: 'bold' };
    }
  };

  if (loading) {
    return <div>Loading your applications...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>My Job Applications</h2>
      {applications.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {applications.map((app) => (
            <li key={app.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
              <h4><Link to={`/job-postings/${app.jobPosting.id}`}>{app.jobPosting.title}</Link></h4>
              <p><strong>Posted by:</strong> {app.jobPosting.user?.username || 'N/A'}</p>
              <p><strong>Applied on:</strong> {new Date(app.created_at).toLocaleDateString()}</p>
              <p>
                <strong>Status:</strong>
                <span style={getStatusStyle(app.status)}>{app.status.toUpperCase()}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have not applied to any jobs yet.</p>
      )}
    </div>
  );
}

export default MyApplicationsPage;
