import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

function LLMTestPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [message, setMessage] = useState('');

  const handleLLMTest = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.get(`${API_BASE_URL}/test-llm?prompt=${encodeURIComponent(prompt)}`);
      setResponse(result.data.response);
      setMessage('LLM Test Success!');
    } catch (error) {
      setMessage(`LLM Test Error: ${error.response?.data?.error || error.message}`);
      setResponse('');
    }
  };

  return (
    <div>
      <h2>LLM Test Page</h2>
      <form onSubmit={handleLLMTest}>
        <textarea
          placeholder="Enter your prompt for LLM (e.g., '안녕, 제미나이! 간단한 자기소개 부탁해.')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows="5"
          cols="50"
        ></textarea><br/>
        <button type="submit">Send to LLM</button>
      </form>

      {message && <p><strong>Message:</strong> {message}</p>}
      {response && (
        <div>
          <h3>LLM Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}

export default LLMTestPage;
