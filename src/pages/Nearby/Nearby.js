
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./Nearby.css";

function Nearby() {
  const navigate = useNavigate();
  const mapRef = useRef(null);

  useEffect(() => {
    // 카카오맵 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_API_KEY&autoload=false";
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current;
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5,
        };
        new window.kakao.maps.Map(container, options);
      });
    };
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return (
    <div className="nearby-page">
      <header className="nearby-header-bar">
        <button className="nearby-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="nearby-header-title">내 주변 일자리</span>
        <button className="nearby-header-icon" aria-label="필터/위치"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 10.5a8.38 8.38 0 0 1-1.9 5.4c-1.5 1.9-3.8 3.1-6.1 3.1s-4.6-1.2-6.1-3.1A8.38 8.38 0 0 1 3 10.5" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10.5" r="3.5" stroke="#222" strokeWidth="2"/></svg></button>
      </header>
      <div className="nearby-map-box">
        <div ref={mapRef} className="nearby-map" />
      </div>
      <div className="nearby-list-title"><b>근처 일자리</b> <span className="nearby-list-count">(2개)</span></div>
      <div className="nearby-job-list">
        <div className="nearby-job-card">
          <div className="nearby-job-row">
            <div className="nearby-job-title">철근공 구함 <span className="nearby-job-distance">2.3km</span></div>
            <div className="nearby-job-pay">150,000원</div>
          </div>
          <div className="nearby-job-company">대한건설</div>
          <div className="nearby-job-location">서울 강남구 테헤란로 123</div>
        </div>
        <div className="nearby-job-card">
          <div className="nearby-job-row">
            <div className="nearby-job-title">미장공 모집 <span className="nearby-job-distance">5.1km</span></div>
            <div className="nearby-job-pay">130,000원</div>
          </div>
          <div className="nearby-job-company">현대건축</div>
          <div className="nearby-job-location">경기 성남시 분당구</div>
        </div>
      </div>
    </div>
  );
}

export default Nearby;
