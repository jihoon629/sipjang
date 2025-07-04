import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useCallback } from "react";
import { useUser } from "../../contexts/UserContext";
import { getUserResumes } from "../../services/resumesService";
import { searchJobPostingsByDistance } from "../../services/jobPostingsService";
import "./Nearby.css";

function Nearby() {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const { user } = useUser();
  
  const [jobPostings, setJobPostings] = useState([]);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 마커들을 정리하는 함수
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  }, []);

  // Google Maps 스크립트 로드
  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.google && window.google.maps) {
      setIsScriptLoaded(true);
      return;
    }

    // 이미 스크립트가 DOM에 있는지 확인
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsScriptLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDco6eiL8iltEdylzgCkpTHSjz-TzlBDXA&libraries=places`;
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      setError("Google Maps를 로드할 수 없습니다.");
      setIsLoading(false);
    };
    
    document.body.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 마커 정리
      clearMarkers();
    };
  }, [clearMarkers]);

  // 사용자 위치 기반 지도 초기화
  const initializeMapWithUserLocation = useCallback(async () => {
    if (!user?.id || !window.google?.maps) return;

    try {
      const response = await getUserResumes(user.id);
      const resumes = response?.data?.resumes || [];
      
      if (resumes.length === 0) {
        throw new Error("이력서 정보가 없습니다.");
      }

      const region = resumes[0].region;
      const geocoder = new window.google.maps.Geocoder();
      
      return new Promise((resolve, reject) => {
        geocoder.geocode({ address: region }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            resolve(location);
          } else {
            reject(new Error("주소를 찾을 수 없습니다."));
          }
        });
      });
    } catch (error) {
      console.error("사용자 위치 초기화 실패:", error);
      throw error;
    }
  }, [user]);

  // 기본 위치로 지도 초기화
  const initializeDefaultMap = useCallback(() => {
    if (!window.google?.maps) return null;
    
    return new window.google.maps.LatLng(37.5665, 126.9780); // 서울 시청
  }, []);

  // 지도 생성 및 초기화
  const createMap = useCallback(async () => {
    if (!isScriptLoaded || !mapRef.current) return;

    try {
      setIsLoading(true);
      setError(null);

      let center;
      let userLocation = null;

      try {
        userLocation = await initializeMapWithUserLocation();
        center = userLocation;
      } catch (error) {
        console.warn("사용자 위치 사용 불가, 기본 위치 사용:", error.message);
        center = initializeDefaultMap();
      }

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: center,
        zoom: 13,
      });

      setMap(newMap);

      // 사용자 위치 마커 추가
      if (userLocation) {
        const userMarker = new window.google.maps.Marker({
          position: userLocation,
          map: newMap,
          title: '내 위치',
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="#ffffff" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          }
        });
        markersRef.current.push(userMarker);

        // 주변 일자리 검색
        await searchNearbyJobs(userLocation.lat(), userLocation.lng());
      }

    } catch (error) {
      console.error("지도 초기화 실패:", error);
      setError("지도를 초기화할 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [isScriptLoaded, initializeMapWithUserLocation, initializeDefaultMap]);

  // 주변 일자리 검색
  const searchNearbyJobs = useCallback(async (lat, lng) => {
    try {
      const response = await searchJobPostingsByDistance(lat, lng, 50);
      const jobs = response?.data?.postings || [];
      console.log("Received job postings data:", jobs);
      setJobPostings(jobs);
    } catch (error) {
      console.error("일자리 검색 실패:", error);
      setError("일자리 정보를 불러올 수 없습니다.");
    }
  }, []);

  // 일자리 마커 추가
  const addJobMarkers = useCallback(() => {
    if (!map || jobPostings.length === 0) return;

    // 기존 일자리 마커들만 제거 (사용자 위치 마커는 유지)
    const jobMarkers = markersRef.current.filter(marker => 
      marker.getTitle() !== '내 위치'
    );
    jobMarkers.forEach(marker => marker.setMap(null));
    markersRef.current = markersRef.current.filter(marker => 
      marker.getTitle() === '내 위치'
    );

    // 새 일자리 마커 추가
    jobPostings.forEach(job => {
      if (job.location?.coordinates) {
        const [lng, lat] = job.location.coordinates;
        const marker = new window.google.maps.Marker({
          position: new window.google.maps.LatLng(lat, lng),
          map,
          title: job.title,
          icon: {
            url: 'data:image/svg+xml;base64,' + btoa(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#EA4335" stroke="#ffffff" stroke-width="2"/>
                <circle cx="12" cy="10" r="3" fill="#ffffff"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(24, 24),
          }
        });

        // 마커 클릭 시 일자리 상세 페이지로 이동
        marker.addListener('click', () => {
          navigate(`/jobs/${job.id}`);
        });

        markersRef.current.push(marker);
      }
    });
  }, [map, jobPostings, navigate]);

  // 스크립트 로드 후 지도 초기화
  useEffect(() => {
    if (isScriptLoaded) {
      createMap();
    }
  }, [isScriptLoaded, createMap]);

  // 일자리 데이터 변경 시 마커 업데이트
  useEffect(() => {
    addJobMarkers();
  }, [addJobMarkers]);

  // 유효한 일자리 필터링
  const validJobPostings = jobPostings.filter(job => 
    job.location?.coordinates && job.location.coordinates.length === 2
  );

  const handleJobCardClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  if (error) {
    return (
      <div className="nearby-page">
        <header className="nearby-header-bar">
          <button className="nearby-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <span className="nearby-header-title">내 주변 일자리</span>
        </header>
        <div className="nearby-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>다시 시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="nearby-page">
      <header className="nearby-header-bar">
        <button className="nearby-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="nearby-header-title">내 주변 일자리</span>
        <button className="nearby-header-icon" aria-label="필터/위치">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 10.5a8.38 8.38 0 0 1-1.9 5.4c-1.5 1.9-3.8 3.1-6.1 3.1s-4.6-1.2-6.1-3.1A8.38 8.38 0 0 1 3 10.5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="10.5" r="3.5" stroke="#222" strokeWidth="2"/>
          </svg>
        </button>
      </header>
      
      <div className="nearby-map-box">
        <div ref={mapRef} className="nearby-map" />
        {isLoading && (
          <div className="nearby-loading">
            <div className="loading-spinner"></div>
            <p>지도를 불러오는 중...</p>
          </div>
        )}
      </div>
      
      <div className="nearby-list-title">
        <b>근처 일자리</b> 
        <span className="nearby-list-count">({validJobPostings.length}개)</span>
      </div>
      
      <div className="nearby-job-list">
        {validJobPostings.length === 0 && !isLoading ? (
          <div className="nearby-no-jobs">
            <p>주변에 일자리가 없습니다.</p>
          </div>
        ) : (
          validJobPostings.map(job => (
            <div 
              className="nearby-job-card" 
              key={job.id} 
              onClick={() => handleJobCardClick(job.id)}
            >
              <div className="nearby-job-row">
                <div className="nearby-job-title">
                  {job.title} 
                  <span className="nearby-job-distance">
                    {job.distance ? `${job.distance.toFixed(1)}km` : 'N/A'}
                  </span>
                </div>
                <div className="nearby-job-pay">
                  {job.dailyWage?.toLocaleString() || '0'}원
                </div>
              </div>
              <div className="nearby-job-company">{job.user?.username || '회사명 없음'}</div>
              <div className="nearby-job-location">{job.region || '지역 정보 없음'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Nearby;