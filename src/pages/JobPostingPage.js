import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as jobPostingsService from '../services/jobPostingsService';

function JobPostingPage({ currentUserId }) {
  const [createForm, setCreateForm] = useState({
    userId: currentUserId || '', title: '', jobType: '', region: '', siteDescription: '', dailyWage: '',
    requiredSkills: '', workStartDate: '', workEndDate: '', workHours: '', contactInfo: '',
  });
  const [updateForm, setUpdateForm] = useState({
    id: '', title: '', jobType: '', region: '', siteDescription: '', dailyWage: '',
    requiredSkills: '', workStartDate: '', workEndDate: '', workHours: '', contactInfo: '',
  });
  const [jobPostings, setJobPostings] = useState([]);
  const [allJobPostings, setAllJobPostings] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('jobType');
  const [searchResults, setSearchResults] = useState([]);

  const fetchUserJobPostings = async () => {
    if (!currentUserId) {
      setJobPostings([]);
      return;
    }
    try {
      const response = await jobPostingsService.getUserJobPostings(currentUserId);
      setJobPostings(response.data.postings || []);
    } catch (error) {
      setMessage(`Error fetching user job postings: ${error.message}`);
    }
  };

  const fetchAllJobPostings = async () => {
    try {
      const response = await jobPostingsService.getJobPostings();
      setAllJobPostings(response.data.postings || []);
      setMessage('All job postings loaded.');
    } catch (error) {
      setMessage(`Error fetching all job postings: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUserJobPostings();
  }, [currentUserId]);

  useEffect(() => {
    setCreateForm(prev => ({ ...prev, userId: currentUserId || '' }));
  }, [currentUserId]);

  const handleCreateChange = (e) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e) => {
    setUpdateForm({ ...updateForm, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...createForm, requiredSkills: createForm.requiredSkills.split(',').map(s => s.trim()) };
      const response = await jobPostingsService.createJobPosting(payload);
      setMessage(`Create Success: ${response.message}`);
      fetchUserJobPostings();
    } catch (error) {
      setMessage(`Create Error: ${error.message}`);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...updateForm, requiredSkills: updateForm.requiredSkills.split(',').map(s => s.trim()) };
      const response = await jobPostingsService.updateJobPosting(updateForm.id, payload);
      setMessage(`Update Success: ${response.message}`);
      fetchUserJobPostings();
    } catch (error) {
      setMessage(`Update Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await jobPostingsService.deleteJobPosting(id);
      setMessage(`Delete Success: ${response.message}`);
      fetchUserJobPostings();
    } catch (error) {
      setMessage(`Delete Error: ${error.message}`);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await jobPostingsService.searchJobPostings(searchQuery, searchField);
      setSearchResults(response.data.postings || []);
      setMessage(`Search Success: Found ${response.data.postings.length} results.`);
    } catch (error) {
      setMessage(`Search Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2>Job Posting Page</h2>

      <h3>Create Job Posting</h3>
      <form onSubmit={handleCreateSubmit}>
        {/* ... 폼 입력 필드들 ... */}
        <input name="userId" placeholder="User ID" value={createForm.userId} onChange={handleCreateChange} readOnly /><br/>
        <input name="title" placeholder="Title" value={createForm.title} onChange={handleCreateChange} /><br/>
        <input name="jobType" placeholder="Job Type" value={createForm.jobType} onChange={handleCreateChange} /><br/>
        <input name="region" placeholder="Region" value={createForm.region} onChange={handleCreateChange} /><br/>
        <textarea name="siteDescription" placeholder="Site Description" value={createForm.siteDescription} onChange={handleCreateChange}></textarea><br/>
        <input name="dailyWage" type="number" placeholder="Daily Wage" value={createForm.dailyWage} onChange={handleCreateChange} /><br/>
        <input name="requiredSkills" placeholder="Required Skills (comma-separated)" value={createForm.requiredSkills} onChange={handleCreateChange} /><br/>
        <input name="workStartDate" type="date" placeholder="Work Start Date" value={createForm.workStartDate} onChange={handleCreateChange} /><br/>
        <input name="workEndDate" type="date" placeholder="Work End Date" value={createForm.workEndDate} onChange={handleCreateChange} /><br/>
        <input name="workHours" placeholder="Work Hours" value={createForm.workHours} onChange={handleCreateChange} /><br/>
        <input name="contactInfo" placeholder="Contact Info" value={createForm.contactInfo} onChange={handleCreateChange} /><br/>
        <button type="submit">Create</button>
      </form>

      <h3>Update Job Posting</h3>
      <form onSubmit={handleUpdateSubmit}>
        {/* ... 폼 입력 필드들 ... */}
        <input name="id" placeholder="Job Posting ID to Update" value={updateForm.id} onChange={handleUpdateChange} /><br/>
        <input name="title" placeholder="Title" value={updateForm.title} onChange={handleUpdateChange} /><br/>
        <input name="jobType" placeholder="Job Type" value={updateForm.jobType} onChange={handleUpdateChange} /><br/>
        <input name="region" placeholder="Region" value={updateForm.region} onChange={handleUpdateChange} /><br/>
        <textarea name="siteDescription" placeholder="Site Description" value={updateForm.siteDescription} onChange={handleUpdateChange}></textarea><br/>
        <input name="dailyWage" type="number" placeholder="Daily Wage" value={updateForm.dailyWage} onChange={handleUpdateChange} /><br/>
        <input name="requiredSkills" placeholder="Required Skills (comma-separated)" value={updateForm.requiredSkills} onChange={handleUpdateChange} /><br/>
        <input name="workStartDate" type="date" placeholder="Work Start Date" value={updateForm.workStartDate} onChange={handleUpdateChange} /><br/>
        <input name="workEndDate" type="date" placeholder="Work End Date" value={updateForm.workEndDate} onChange={handleUpdateChange} /><br/>
        <input name="workHours" placeholder="Work Hours" value={updateForm.workHours} onChange={handleUpdateChange} /><br/>
        <input name="contactInfo" placeholder="Contact Info" value={updateForm.contactInfo} onChange={handleUpdateChange} /><br/>
        <button type="submit">Update</button>
      </form>

      <h3>Search Job Postings (Similarity)</h3>
      <form onSubmit={handleSearchSubmit}>
        {/* ... 폼 입력 필드들 ... */}
        <input name="searchQuery" placeholder="Search Query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><br/>
        <input name="searchField" placeholder="Search Field (e.g., jobType)" value={searchField} onChange={(e) => setSearchField(e.target.value)} /><br/>
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <h4>Search Results:</h4>
          <ul>
            {searchResults.map((jp) => (
              <li key={jp.id}>
                ID: {jp.id}, Title: {jp.title}, Type: {jp.jobType}, Region: {jp.region}
                <Link to={`/job-postings/${jp.id}`} style={{ marginLeft: '10px' }}>Details</Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h3>Your Job Postings</h3>
      {jobPostings.length > 0 ? (
        <ul>
          {jobPostings.map((jp) => (
            <li key={jp.id}>
              ID: {jp.id}, Title: {jp.title}, Type: {jp.jobType}, Region: {jp.region}, Wage: {jp.dailyWage}
              <Link to={`/job-postings/${jp.id}`} style={{ marginLeft: '10px' }}>Details</Link>
              <Link to={`/job-postings/${jp.id}/applications`} style={{ marginLeft: '10px' }}>View Applicants</Link>
              <button onClick={() => handleDelete(jp.id)} style={{ marginLeft: '10px' }}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No job postings found for the current user.</p>
      )}

      <hr />

      <h3>All Job Postings</h3>
      <button onClick={fetchAllJobPostings}>Load All Job Postings</button>
      {allJobPostings.length > 0 ? (
        <ul>
          {allJobPostings.map((jp) => (
            <li key={jp.id}>
              ID: {jp.id}, Title: {jp.title}, Type: {jp.jobType}, Region: {jp.region}, Wage: {jp.dailyWage}, Posted by: {jp.user?.username || 'N/A'}
              <Link to={`/job-postings/${jp.id}`} style={{ marginLeft: '10px' }}>Details</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No job postings found or not loaded yet.</p>
      )}

      {message && <p><strong>Message:</strong> {message}</p>}
    </div>
  );
}

export default JobPostingPage;
