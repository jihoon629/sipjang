import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as jobPostingsService from '../services/jobPostingsService';
import * as applicationsService from '../services/applicationsService';

function ApplicationsManagePage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: jobPostingId } = useParams();

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobPostingsService.getJobApplicants(jobPostingId);
      if (response.status === 'success') {
        setApplications(response.data.applications || []);
      } else {
        setError('Failed to load applications.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while fetching applications.');
    } finally {
      setLoading(false);
    }
  }, [jobPostingId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      await applicationsService.updateApplicationStatus(applicationId, status);
      fetchApplications();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleComplete = async (applicationId) => {
    try {
      await applicationsService.completeApplication(applicationId);
      fetchApplications();
    } catch (err) {
      alert(`Failed to complete application: ${err.message}`);
    }
  };

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
    return <div>Loading applications...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Applications for Job Posting #{jobPostingId}</h2>
      {applications.length > 0 ? (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '10px', textAlign: 'left' }}>Applicant</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Submitted Resume</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Experience</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Applied On</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid #ccc' }}>
                <td style={{ padding: '10px' }}>{app.applicant.username} ({app.applicant.email})</td>
                <td style={{ padding: '10px' }}>
                  {app.resume ? (
                    <Link to={`/resumes/${app.resume.id}`}>
                      Resume #{app.resume.id}
                    </Link>
                  ) : (
                    'N/A'
                  )}
                </td>
                <td style={{ padding: '10px' }}>
                  <Link to={`/users/${app.applicant.id}/experience`}>View</Link>
                </td>
                <td style={{ padding: '10px' }}>{new Date(app.created_at).toLocaleDateString()}</td>
                <td style={{ padding: '10px' }}>
                  <span style={getStatusStyle(app.status)}>{app.status.toUpperCase()}</span>
                </td>
                <td style={{ padding: '10px' }}>
                  {app.status === 'pending' && (
                    <>
                      <button onClick={() => handleStatusUpdate(app.id, 'approved')} style={{ marginRight: '5px', color: 'white', backgroundColor: 'green' }}>Approve</button>
                      <button onClick={() => handleStatusUpdate(app.id, 'rejected')} style={{ color: 'white', backgroundColor: 'red' }}>Reject</button>
                    </>
                  )}
                  {app.status === 'approved' && (
                    <button onClick={() => handleComplete(app.id)} style={{ color: 'white', backgroundColor: 'blue' }}>
                      Complete (Record Experience)
                    </button>
                  )}
                  {app.status === 'completed' && (
                    <span>Recorded</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No applications found for this job posting.</p>
      )}
    </div>
  );
}

export default ApplicationsManagePage;
