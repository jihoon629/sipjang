
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header/Header";
import Footer from "../../../components/Footer/Footer";
import "./JobDetail.css";

function JobDetail() {
  const navigate = useNavigate();
  // 실제 서비스라면 id로 fetch, 지금은 샘플 데이터
  const job = {
    title: "철근공 구함",
    company: "대한건설",
    pay: 150000,
    period: "3일",
    rating: 4.8,
    certified: true,
    location: "서울 강남구 테헤란로 123",
    distance: "2.3km",
    time: "2시간 전",
    worktime: "08:00 - 18:00",
    payday: "2024-01-15",
    desc: "아파트 신축 현장에서 철근 작업을 담당하실 분을 모집합니다.",
    requirements: ["철근공 경력 3년 이상", "안전교육 이수자", "체력 우수자"],
    facilities: ["식사 제공", "주차 가능", "안전장비 지급"],
  };
  return (
    <div className="jobdetail-page">
      <Header />
      <div className="jobdetail-header-bar">
        <button className="jobdetail-back-btn" onClick={() => navigate(-1)} aria-label="뒤로가기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <span className="jobdetail-header-title">현장 정보</span>
        <button className="jobdetail-call-btn" aria-label="전화하기">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.09 8.81 2 2 0 0 1 5.11 6.62h3a2 2 0 0 1 2 1.72c.13 1.13.37 2.22.72 3.26a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c1.04.35 2.13.59 3.26.72a2 2 0 0 1 1.72 2z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
      <div className="jobdetail-card">
        <div className="jobdetail-row1">
          <div>
            <div className="jobdetail-title-main">{job.title}</div>
            <div className="jobdetail-company">{job.company}</div>
          </div>
          <div className="jobdetail-pay-col">
            <div className="jobdetail-pay">{job.pay.toLocaleString()}원</div>
            <div className="jobdetail-period">{job.period}</div>
          </div>
        </div>
        <div className="jobdetail-row2">
          <span className="jobdetail-rating">⭐ {job.rating}</span>
          {job.certified && <span className="jobdetail-badge-cert" title="인증 완료">✔️</span>}
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">📍 위치</div>
          <div className="jobdetail-location">{job.location}</div>
          <div className="jobdetail-distance">{job.distance} 거리</div>
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">⏰ 근무시간</div>
          <div>{job.worktime}</div>
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">💰 급여 지급일</div>
          <div>{job.payday}</div>
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">📝 업무 내용</div>
          <div>{job.desc}</div>
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">✅ 지원 자격</div>
          <ul className="jobdetail-list">
            {job.requirements.map((r, i) => <li key={i}>• {r}</li>)}
          </ul>
        </div>
        <div className="jobdetail-section">
          <div className="jobdetail-label">🏢 현장 시설</div>
          <ul className="jobdetail-list">
            {job.facilities.map((f, i) => <li key={i}>• {f}</li>)}
          </ul>
        </div>
      </div>
      <div className="jobdetail-bottom-bar">
        <button className="jobdetail-photo-btn">현장 사진</button>
        <button className="jobdetail-apply-btn">지원하기</button>
      </div>
      <Footer />
    </div>
  );
}
export default JobDetail;
