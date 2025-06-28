import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8001/api';

function ResumePage({ currentUserId }) {
  const [createForm, setCreateForm] = useState({
    userId: currentUserId || '', jobType: '', region: '', selfIntroduction: '', desiredDailyWage: '', skills: '',
  });
  const [updateForm, setUpdateForm] = useState({
    id: '', jobType: '', region: '', selfIntroduction: '', desiredDailyWage: '', skills: '',
  });
  const [resumes, setResumes] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('jobType');
  const [searchResults, setSearchResults] = useState([]);

  const fetchResumes = async () => {
    if (!currentUserId) {
      setResumes([]);
      return;
    }
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes/user/${currentUserId}`);
      setResumes(response.data.data.resumes || []);
    } catch (error) {
      setMessage(`Error fetching resumes: ${error.response?.data?.message || error.message}`);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, [currentUserId]); // currentUserId가 변경될 때마다 다시 불러오기

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
      const payload = { ...createForm, skills: createForm.skills.split(',').map(s => s.trim()) };
      const response = await axios.post(`${API_BASE_URL}/resumes`, payload);
      setMessage(`Create Success: ${response.data.message}`);
      fetchResumes();
    } catch (error) {
      setMessage(`Create Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...updateForm, skills: updateForm.skills.split(',').map(s => s.trim()) };
      const response = await axios.put(`${API_BASE_URL}/resumes/${updateForm.id}`, payload);
      setMessage(`Update Success: ${response.data.message}`);
      fetchResumes();
    } catch (error) {
      setMessage(`Update Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/resumes/${id}`);
      setMessage(`Delete Success: ${response.data.message}`);
      fetchResumes();
    } catch (error) {
      setMessage(`Delete Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/resumes/search/similarity?query=${searchQuery}&field=${searchField}`);
      setSearchResults(response.data);
      setMessage(`Search Success: Found ${response.data.length} results.`);
    } catch (error) {
      setMessage(`Search Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>Resume Page</h2>

      <h3>Create Resume</h3>
      <form onSubmit={handleCreateSubmit}>
        <input name="userId" placeholder="User ID" value={createForm.userId} onChange={handleCreateChange} /><br/>
        <input name="jobType" placeholder="Job Type" value={createForm.jobType} onChange={handleCreateChange} /><br/>
        <input name="region" placeholder="Region" value={createForm.region} onChange={handleCreateChange} /><br/>
        <textarea name="selfIntroduction" placeholder="Self Introduction" value={createForm.selfIntroduction} onChange={handleCreateChange}></textarea><br/>
        <input name="desiredDailyWage" type="number" placeholder="Desired Daily Wage" value={createForm.desiredDailyWage} onChange={handleCreateChange} /><br/>
        <input name="skills" placeholder="Skills (comma-separated)" value={createForm.skills} onChange={handleCreateChange} /><br/>
        <button type="submit">Create</button>
      </form>

      <h3>Update Resume</h3>
      <form onSubmit={handleUpdateSubmit}>
        <input name="id" placeholder="Resume ID to Update" value={updateForm.id} onChange={handleUpdateChange} /><br/>
        <input name="jobType" placeholder="Job Type" value={updateForm.jobType} onChange={handleUpdateChange} /><br/>
        <input name="region" placeholder="Region" value={updateForm.region} onChange={handleUpdateChange} /><br/>
        <textarea name="selfIntroduction" placeholder="Self Introduction" value={updateForm.selfIntroduction} onChange={handleUpdateChange}></textarea><br/>
        <input name="desiredDailyWage" type="number" placeholder="Desired Daily Wage" value={updateForm.desiredDailyWage} onChange={handleUpdateChange} /><br/>
        <input name="skills" placeholder="Skills (comma-separated)" value={updateForm.skills} onChange={handleUpdateChange} /><br/>
        <button type="submit">Update</button>
      </form>

      <h3>Search Resumes (Similarity)</h3>
      <form onSubmit={handleSearchSubmit}>
        <input name="searchQuery" placeholder="Search Query" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /><br/>
        <input name="searchField" placeholder="Search Field (e.g., jobType)" value={searchField} onChange={(e) => setSearchField(e.target.value)} /><br/>
        <button type="submit">Search</button>
      </form>

      {searchResults.length > 0 && (
        <div>
          <h4>Search Results:</h4>
          <ul>
            {searchResults.map((r) => (
              <li key={r.id}>ID: {r.id}, Type: {r.jobType}, Region: {r.region}</li>
            ))}
          </ul>
        </div>
      )}

      <h3>Your Resumes</h3>
      {resumes.length > 0 ? (
        <ul>
          {resumes.map((r) => (
            <li key={r.id}>
              ID: {r.id}, Type: {r.jobType}, Region: {r.region}, Wage: {r.desiredDailyWage}
              <button onClick={() => handleDelete(r.id)} style={{ marginLeft: '10px' }}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No resumes found.</p>
      )}

      {message && <p><strong>Message:</strong> {message}</p>}
    </div>
  );
}

export default ResumePage;
