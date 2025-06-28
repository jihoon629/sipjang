
import React, { useState } from 'react';
import axios from 'axios';

const RecommendationPage = () => {
    const [resumeId, setResumeId] = useState('');
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleFetchRecommendations = async () => {
        if (!resumeId) {
            setError('이력서 ID를 입력해주세요.');
            return;
        }
        setLoading(true);
        setError(null);
        setRecommendations([]);

        try {
            const response = await axios.get(`http://localhost:8001/api/resumes/${resumeId}/recommendations`, {
                withCredentials: true,
            });
            
            if (response.data && response.data.status === 'success') {
                setRecommendations(response.data.data.postings || []);
            } else {
                setError(response.data.message || '추천 정보를 가져오는데 실패했습니다.');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || '서버 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>이력서 기반 채용 공고 추천</h1>
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="number"
                    value={resumeId}
                    onChange={(e) => setResumeId(e.target.value)}
                    placeholder="이력서 ID를 입력하세요"
                    style={{ padding: '10px', width: '200px', marginRight: '10px' }}
                />
                <button onClick={handleFetchRecommendations} disabled={loading} style={{ padding: '10px 15px' }}>
                    {loading ? '추천 찾는 중...' : '추천 받기'}
                </button>
            </div>

            {error && <p style={{ color: 'red' }}><strong>오류:</strong> {error}</p>}

            {recommendations.length > 0 && (
                <div>
                    <h2>추천 결과</h2>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {recommendations.map((rec) => (
                            <li key={rec.id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '15px', marginBottom: '15px' }}>
                                <h3>{rec.jobType}</h3>
                                <p><strong>지역:</strong> {rec.region}</p>
                                <p><strong>일급:</strong> {rec.dailyWage}원</p>
                                <p><strong>필요 기술:</strong> {rec.requiredSkills}</p>
                                <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f8ff', border: '1px solid #add8e6', borderRadius: '4px' }}>
                                    <p><strong>✨ 추천 점수:</strong> {rec.recommendation?.matchScore || 'N/A'}</p>
                                    <p><strong>💬 추천 이유:</strong> {rec.recommendation?.reason || 'N/A'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default RecommendationPage;
