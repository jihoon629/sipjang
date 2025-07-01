
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getJobPostings } from "../../../services/jobPostingsService";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [selected, setSelected] = useState("전체");
  const navigate = useNavigate();

  const filters = ["전체", "건설", "급구"];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getJobPostings();
        setJobs(data.data.postings);
      } catch (err) {
        console.error("Error fetching jobs", err);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = selected === "전체" ? jobs : jobs.filter((j) => j.jobType === selected || (selected === "급구" && j.title.includes("급구")));

  return (
    <div className="joblist-page">

      <div className="joblist-header">
        <span className="joblist-title">일자리</span>
      </div>
      <div className="joblist-searchbar">
        <input className="joblist-search" placeholder="직종, 지역 검색..." />
      </div>
      <div className="joblist-filters">
        {filters.map((f) => (
          <button key={f} className={`joblist-filter${selected === f ? " selected" : ""}`} onClick={() => setSelected(f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="joblist-cards">
        {filteredJobs.map((job) => (
          <div className="joblist-card" key={job.id}>
            <div className="joblist-card-row">
              <span className="joblist-title-main">{job.title}</span>
              <div className="joblist-pay-group">
                <span className="joblist-pay">{job.dailyWage.toLocaleString()}원</span>
                <span className="joblist-period">1일</span>
              </div>
            </div>
            <div className="joblist-company">{job.user?.username}</div>
            <div className="joblist-location-row">
              <span className="joblist-location">📍 {job.region}</span>
            </div>
            <button className="joblist-apply-btn" onClick={() => navigate(`/jobs/${job.id}`)}>지원하기</button>
          </div>
        ))}
      </div>

    </div>
  );
}


export default JobList;
