

// import Header from "../../../components/Header/Header";
// import Footer from "../../../components/Footer/Footer";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JobList.css";

const jobs = [
  {
    id: 1,
    title: "철근공 구함",
    company: "대한건설",
    location: "서울 강남구 테헤란로 123",
    pay: 150000,
    period: "3일",
    distance: "2.3km",
    rating: 4.8,
    urgent: true,
    time: "2시간 전",
    certified: true,
    type: "철근공"
  },
  {
    id: 2,
    title: "미장공 모집",
    company: "현대건축",
    location: "경기 성남시 분당구",
    pay: 130000,
    period: "1주",
    distance: "5.1km",
    rating: 4.9,
    urgent: false,
    time: "4시간 전",
    certified: true,
    type: "미장공"
  },
];

const filters = ["전체", "철근공", "미장공", "목공", "급구"];


function JobList() {
  const [selected, setSelected] = useState("전체");
  const navigate = useNavigate();
  const filtered = selected === "전체" ? jobs : jobs.filter(j => j.type === selected || (selected === "급구" && j.urgent));
  return (
    <div className="joblist-page">
      
      <div className="joblist-header">
        <span className="joblist-title">일자리</span>
      </div>
      <div className="joblist-searchbar">
        <input className="joblist-search" placeholder="직종, 지역 검색..." />
      </div>
      <div className="joblist-filters">
        {filters.map(f => (
          <button key={f} className={"joblist-filter" + (selected === f ? " selected" : "")} onClick={() => setSelected(f)}>{f}</button>
        ))}
      </div>
      <div className="joblist-cards">
        {filtered.map(job => (
          <div className="joblist-card" key={job.id}>
            <div className="joblist-card-row">
              <span className="joblist-title-main">{job.title}</span>
              {job.urgent && <span className="joblist-badge-urgent">급구</span>}
              {job.certified && <span className="joblist-badge-cert" title="인증 완료">✔️</span>}
              <span className="joblist-pay">{job.pay.toLocaleString()}원</span>
              <span className="joblist-period">{job.period}</span>
            </div>
            <div className="joblist-company">{job.company}</div>
            <div className="joblist-location-row">
              <span className="joblist-location">📍 {job.location} · {job.distance}</span>
            </div>
            <div className="joblist-meta-row">
              <span className="joblist-time">⏰ {job.time}</span>
              <span className="joblist-rating">⭐ {job.rating}</span>
            </div>
            <button className="joblist-apply-btn" onClick={() => navigate(`/jobs/${job.id}`)}>지원하기</button>
          </div>
        ))}
      </div>
      
    </div>
  );
}
export default JobList;
