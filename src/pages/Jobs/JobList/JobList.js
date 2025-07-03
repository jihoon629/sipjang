
import { useState, useEffect } from "react";
import FilterModal from "../FilterModal/FilterModal";
import FilterIcon from "../../../components/Icons/FilterIcon";
import { useNavigate } from "react-router-dom";
import { getJobPostings } from "../../../services/jobPostingsService";
import "./JobList.css";

function JobList() {
  const [jobs, setJobs] = useState([]);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("job_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const [favoriteMsg, setFavoriteMsg] = useState("");
  const [showFavoriteMsg, setShowFavoriteMsg] = useState(false);
  const [confirmUnfavorite, setConfirmUnfavorite] = useState({ open: false, jobId: null });
  const navigate = useNavigate();

  // 즐겨찾기 버튼 클릭 핸들러
  const handleFavoriteClick = (jobId) => {
    if (favorites.includes(jobId)) {
      setConfirmUnfavorite({ open: true, jobId });
    } else {
      setFavorites((prev) => {
        const updated = [...prev, jobId];
        localStorage.setItem("job_favorites", JSON.stringify(updated));
        setFavoriteMsg("즐겨찾기가 등록되었습니다");
        setShowFavoriteMsg(true);
        setTimeout(() => setShowFavoriteMsg(false), 1500);
        return updated;
      });
    }
  };

  // 즐겨찾기 해제 모달 - 예
  const confirmUnfavoriteYes = () => {
    setFavorites((prev) => {
      const updated = prev.filter((id) => id !== confirmUnfavorite.jobId);
      localStorage.setItem("job_favorites", JSON.stringify(updated));
      setConfirmUnfavorite({ open: false, jobId: null });
      setFavoriteMsg("즐겨찾기에서 해제되었습니다.");
      setShowFavoriteMsg(true);
      setTimeout(() => setShowFavoriteMsg(false), 1500);
      return updated;
    });
  };
  // 즐겨찾기 해제 모달 - 아니요
  const confirmUnfavoriteNo = () => {
    setConfirmUnfavorite({ open: false, jobId: null });
  };

  // 필터 버튼 목록 (필터 버튼만 남김)
  const filters = [
    { key: "filter", label: "필터", icon: <FilterIcon style={{marginRight:6}} size={20}/> },
  ];

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

  // 실제 필터링 로직 (예시: 직종, 현장 등)
  let filteredJobs = jobs;
  if (filterValues["직종"] && filterValues["직종"].length > 0) {
    // "기타"가 선택된 경우: 일반인부, 기능공에 속하지 않는 직종만 필터링
    if (filterValues["직종"].includes("기타")) {
      // 일반인부, 기능공 전체 아이템 목록
      const excludeList = [
        ...(
          [
            "보통인부", "자재정리", "신호수", "준공청소", "해체정리", "작업팀장", "세대청소", "곰방", "양중",
            "안전관리", "안전시설", "화재감시자", "안전감시단", "농촌",  "경계석공", "토류판공", "보양공", "전기공", "알폼", "경비원", 
            "할석공", "직영-건축반장", "직영-안전반장", "미화", "고정 신호수"
          ]
        ),
        ...(
          [
            "건축배관", "형틀목공", "강구조", "건축목공", "철근", "비계", "조경", "석공", "도장", "미장", "토공", "조적", "타일", "일반용접",
            "콘크리트", "수장", "방수", "덕트", "창호", "도배", "건축기계설비", "철거", "건출", "일반기계설비", "패널조립", "보온", "유리", 
            "플랜트기계설비", "제관", "플랜트계측설비", "코킹", "포장", "벌목", "궤도", "상하수도배관", "보링", "발파", "지붕", "플랜트배관", 
            "잠수", "플랜트제관", "플랜트용접", "준설", "플랜트전기설비", "플랜트보온", "보일러", "일반특수용접", "플랜트덕트", "플랜트특수용접"
          ]
        )
      ];
      filteredJobs = filteredJobs.filter((job) => {
        // job.jobType이 excludeList에 포함되지 않은 경우만 통과
        return job.jobType && !excludeList.some((type) => job.jobType.includes(type));
      });
    } else {
      filteredJobs = filteredJobs.filter((job) => filterValues["직종"].some((type) => job.jobType?.includes(type)));
    }
  }
  if (filterValues["현장"] && filterValues["현장"].length > 0) {
    // 즐겨찾기 필터가 포함되어 있으면 즐겨찾기만 보여줌
    if (filterValues["현장"].includes("즐겨찾기")) {
      filteredJobs = filteredJobs.filter((job) => favorites.includes(job.id));
    } else {
      filteredJobs = filteredJobs.filter((job) => filterValues["현장"].some((tag) => job.tags?.includes(tag)));
    }
  }
  // 일자 필터링 (내일/모레/7일이내/30일이내)
  if (filterValues["일자"] && filterValues["일자"].length > 0) {
    const now = new Date();
    filteredJobs = filteredJobs.filter((job) => {
      if (!job.date) return false;
      const jobDate = new Date(job.date);
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
  // 검색어 필터링
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
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
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
          {favoriteMsg === "즐겨찾기가 등록되었습니다" ? (
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
              <span className="joblist-period">1일</span>
            </div>
            <div className="joblist-company" style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <span>{job.user?.username}</span>
              <button
                onClick={() => handleFavoriteClick(job.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 22,
                  color: favorites.includes(job.id) ? '#ffd600' : '#ccc',
                  marginLeft: 8,
                  marginRight: 0
                }}
                title={favorites.includes(job.id) ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                aria-label="즐겨찾기"
              >
                {favorites.includes(job.id) ? '★' : '☆'}
              </button>
      {confirmUnfavorite.open && (
        <div className="joblist-unfavorite-modal-bg">
          <div className="joblist-unfavorite-modal">
            <div className="joblist-unfavorite-title">
              즐겨찾기를 해제하시겠어요?
            </div>
            <div className="joblist-unfavorite-desc">
              즐겨찾기를 해제하시면 홈 화면 상단에서 이 일자리를 보실 수 없습니다.
            </div>
            <div className="joblist-unfavorite-btns">
              <button onClick={confirmUnfavoriteNo} className="joblist-unfavorite-btn-no">아니요</button>
              <button onClick={confirmUnfavoriteYes} className="joblist-unfavorite-btn-yes">예</button>
            </div>
          </div>
        </div>
      )}
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
