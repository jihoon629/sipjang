
import { useState, useEffect } from "react";
import FilterModal from "../FilterModal/FilterModal";
import FilterIcon from "../../../components/Icons/FilterIcon";
import { useNavigate } from "react-router-dom";
import { getJobPostings } from "../../../services/jobPostingsService";
import { useUser } from "../../../contexts/UserContext"; // useUser 훅 가져오기
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [search, setSearch] = useState("");
  const [favoriteMsg, setFavoriteMsg] = useState("");
  const [showFavoriteMsg, setShowFavoriteMsg] = useState(false);
  
  const navigate = useNavigate();
  const { user, isFavorited, toggleFavorite } = useUser(); // UserContext 사용

  // 즐겨찾기 버튼 클릭 핸들러
  const handleFavoriteClick = async (jobId) => {
    if (!user) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm("로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?")) {
        navigate("/login");
      }
      return;
    }

    const wasFavorited = isFavorited(jobId);
    try {
      await toggleFavorite(jobId);
      setFavoriteMsg(wasFavorited ? "즐겨찾기에서 해제되었습니다." : "즐겨찾기가 등록되었습니다.");
    } catch (error) {
      console.error("Failed to toggle favorite", error);
      setFavoriteMsg("오류가 발생했습니다.");
    } finally {
      setShowFavoriteMsg(true);
      setTimeout(() => setShowFavoriteMsg(false), 1500);
    }
  };

  // 필터 버튼 목록
  const filters = [
    { key: "filter", label: "필터", icon: <FilterIcon style={{marginRight:6}} size={20}/> },
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // getJobPostings가 반환하는 객체 구조에 맞게 수정
        const response = await getJobPostings();
        setJobs(response.data.postings || []);
      } catch (err) {
        console.error("Error fetching jobs", err);
        setJobs([]); // 에러 발생 시 빈 배열로 초기화
      }
    };
    fetchJobs();
  }, []);

  // 클라이언트 사이드 필터링 로직
  let filteredJobs = jobs;
  if (filterValues["직종"] && filterValues["직종"].length > 0) {
    filteredJobs = filteredJobs.filter((job) => filterValues["직종"].some((type) => job.jobType?.includes(type)));
  }
  if (filterValues["현장"] && filterValues["현장"].length > 0) {
    if (filterValues["현장"].includes("즐겨찾기")) {
      filteredJobs = filteredJobs.filter((job) => isFavorited(job.id));
    } else {
      filteredJobs = filteredJobs.filter((job) => filterValues["현장"].some((tag) => job.tags?.includes(tag)));
    }
  }
  if (filterValues["일자"] && filterValues["일자"].length > 0) {
    const now = new Date();
    filteredJobs = filteredJobs.filter((job) => {
      if (!job.workStartDate) return false;
      const jobDate = new Date(job.workStartDate);
      return filterValues["일자"].some((cond) => {
        if (cond === "내일") {
          const tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          return jobDate.toDateString() === tomorrow.toDateString();
        }
        if (cond === "모레") {
          const afterTomorrow = new Date(now);
          afterTomorrow.setDate(now.getDate() + 2);
          return jobDate.toDateString() === afterTomorrow.toDateString();
        }
        if (cond === "7일이내") {
          const week = new Date(now);
          week.setDate(now.getDate() + 7);
          return jobDate >= now && jobDate <= week;
        }
        if (cond === "30일이내") {
          const month = new Date(now);
          month.setDate(now.getDate() + 30);
          return jobDate >= now && jobDate <= month;
        }
        return false;
      });
    });
  }
  if (search.trim() !== "") {
    const q = search.trim().toLowerCase();
    filteredJobs = filteredJobs.filter(
      (job) =>
        job.title?.toLowerCase().includes(q) ||
        job.region?.toLowerCase().includes(q) ||
        job.user?.username?.toLowerCase().includes(q)
    );
  }

  // 즐겨찾기 우선 정렬
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    const aFav = isFavorited(a.id) ? 1 : 0;
    const bFav = isFavorited(b.id) ? 1 : 0;
    return bFav - aFav;
  });

  return (
    <div className="joblist-page">
      <div className="joblist-header" style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginRight:24}}>
        <span className="joblist-title">검색으로 원하는 일자리 골라보기</span>
        <button
          className="joblist-reset-btn"
          style={{background:'none', border:'none', color:'#b0b0b0', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center'}}
          onClick={() => {
            setFilterValues({});
            setSearch("");
          }}
        >
          <span style={{marginRight:2, fontSize:18, opacity:0.7}}>↻</span> 초기화
        </button>
      </div>
      <div className="joblist-searchbar">
        <input
          className="joblist-search"
          placeholder="직종, 지역 검색..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="joblist-filters">
        {filters.map((f) => (
          <button
            key={f.key || f.label}
            className={`joblist-filter`}
            onClick={() => setFilterModalOpen(true)}
            style={{fontWeight:700, boxShadow:'0 2px 8px #4666e41a', border:'1.5px solid #e5e7eb', background:'#fff'}}
          >
            {f.icon}
            {f.label}
          </button>
        ))}
      </div>
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={(vals) => setFilterValues(vals)}
        selected={filterValues}
        setSelected={setFilterValues}
        scrollable={true}
      />
      {showFavoriteMsg && (
        <div className="joblist-favorite-toast">
          {favoriteMsg.includes("등록") ? (
            <svg width="18" height="18" viewBox="0 0 32 32" style={{marginRight:8, flexShrink:0}}>
              <circle cx="16" cy="16" r="16" fill="#19c11c"/>
              <path d="M10 17.5l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 32 32" style={{marginRight:8, flexShrink:0}}>
              <circle cx="16" cy="16" r="16" fill="#ffd600"/>
              <path d="M16 10v7" stroke="#333" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="22.5" r="1.5" fill="#333"/>
            </svg>
          )}
          {favoriteMsg}
        </div>
      )}
      <div className="joblist-cards">
        {sortedJobs.map((job) => (
          <div
            className="joblist-card"
            key={job.id}
          >
            <div className="joblist-card-row" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start'}}>
              <span className="joblist-title-main">{job.title}</span>
              <span className="joblist-pay">{job.dailyWage.toLocaleString()}원</span>
            </div>
            <div className="joblist-card-row" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'-2px', marginBottom:'4px'}}>
              <div style={{display:'flex', alignItems:'center', gap:8}}>
                <span className="joblist-desc" style={{color:'#222', fontSize:'1.01rem'}}>{job.description}</span>
              </div>
              <span className="joblist-period">{job.workStartDate}~{job.workEndDate}</span>
            </div>
            <div className="joblist-company" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
            <span>{job.jobType}</span>
            <button
                onClick={() => handleFavoriteClick(job.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  color: isFavorited(job.id) ? '#ffd600' : '#ccc',
                  marginLeft: 8,
                  marginRight: 0
                }}
                title={isFavorited(job.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                aria-label="즐겨찾기"
              >
                {isFavorited(job.id) ? '★' : '☆'}
              </button>
            </div>
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
