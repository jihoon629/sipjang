import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function SearchPage() {
  const [similarityQuery, setSimilarityQuery] = useState('');
  const [similarityField, setSimilarityField] = useState('jobType');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userSearchField, setUserSearchField] = useState('username');
  const [userSearchRole, setUserSearchRole] = useState('');
  const [compareUser1, setCompareUser1] = useState('');
  const [compareUser2, setCompareUser2] = useState('');
  const [compareField, setCompareField] = useState('username');
  const [message, setMessage] = useState('');
  const [results, setResults] = useState(null);

  const handleSimilaritySearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/search/similarity?query=${similarityQuery}&field=${similarityField}`);
      setResults(response.data);
      setMessage(`Similarity Search Success: Found ${response.data.length} results.`);
    } catch (error) {
      setMessage(`Similarity Search Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${API_BASE_URL}/search/users?query=${userSearchQuery}&searchField=${userSearchField}&role=${userSearchRole}`);
      setResults(response.data);
      setMessage(`User Search Success: Found ${response.data.length} results.`);
    } catch (error) {
      setMessage(`User Search Error: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleCompareUsers = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/search/compare`, {
        userId1: compareUser1,
        userId2: compareUser2,
        field: compareField,
      });
      setResults(response.data);
      setMessage(`Compare Users Success: Similarity Score ${response.data.similarityScore}`);
    } catch (error) {
      setMessage(`Compare Users Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h2>Search Page</h2>

      <h3>Similarity Search</h3>
      <form onSubmit={handleSimilaritySearch}>
        <input placeholder="Query" value={similarityQuery} onChange={(e) => setSimilarityQuery(e.target.value)} /><br/>
        <input placeholder="Field (e.g., jobType)" value={similarityField} onChange={(e) => setSimilarityField(e.target.value)} /><br/>
        <button type="submit">Search</button>
      </form>

      <h3>User Search</h3>
      <form onSubmit={handleUserSearch}>
        <input placeholder="Query" value={userSearchQuery} onChange={(e) => setUserSearchQuery(e.target.value)} /><br/>
        <input placeholder="Search Field (e.g., username)" value={userSearchField} onChange={(e) => setUserSearchField(e.target.value)} /><br/>
        <input placeholder="Role (optional)" value={userSearchRole} onChange={(e) => setUserSearchRole(e.target.value)} /><br/>
        <button type="submit">Search Users</button>
      </form>

      <h3>Compare Users</h3>
      <form onSubmit={handleCompareUsers}>
        <input placeholder="User ID 1" value={compareUser1} onChange={(e) => setCompareUser1(e.target.value)} /><br/>
        <input placeholder="User ID 2" value={compareUser2} onChange={(e) => setCompareUser2(e.target.value)} /><br/>
        <input placeholder="Field (e.g., username)" value={compareField} onChange={(e) => setCompareField(e.target.value)} /><br/>
        <button type="submit">Compare</button>
      </form>

      {message && <p><strong>Message:</strong> {message}</p>}
      {results && (
        <div>
          <h4>Results:</h4>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
