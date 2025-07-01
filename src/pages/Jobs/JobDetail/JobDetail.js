
import { useNavigate } from "react-router-dom";
// import Header from "../../../components/Header/Header";
// import Footer from "../../../components/Footer/Footer";
import "./JobDetail.css";

function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getJobPostingDetails(id);
        setJob(data.data);
      } catch (err) {
        console.error("Error fetching job detail", err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!job) return <div className="jobdetail-page">불러오는 중...</div>;

  return (
    <div className="jobdetail-page">
      
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
        <div className="jobdetail-title">{job.title}</div>

        <div className="jobdetail-table">
          <div className="row"><span className="label">회사명</span><span className="value">{job.user?.username || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">위치</span><span className="value">📍 {job.region}</span></div>
          <div className="row"><span className="label">일급</span><span className="value">{job.dailyWage.toLocaleString()}원</span></div>
          <div className="row"><span className="label">기간</span><span className="value">{job.workStartDate} ~ {job.workEndDate}</span></div>
          <div className="row"><span className="label">직종</span><span className="value">{job.jobType || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">근무 시간</span><span className="value">{job.workHours || "더미데이터입니다"}</span></div>
          <div className="row"><span className="label">연락처</span><span className="value">{job.contactInfo || "더미데이터입니다"}</span></div>
        </div>

        <div className="jobdetail-section">
          <div className="section-title">요구 역량</div>
          <div className="section-content">{job.requiredSkills || "더미데이터입니다"}</div>
        </div>

        <div className="jobdetail-section">
          <div className="section-title">현장 설명</div>
          <div className="section-content">{job.siteDescription || "더미데이터입니다"}</div>
        </div>

        <div className="jobdetail-buttons">
          <button className="jobdetail-btn view">현장 보기</button>
          <button className="jobdetail-btn apply">지원하기</button>
        </div>
      </div>
      <div className="jobdetail-bottom-bar">
        <button className="jobdetail-photo-btn">현장 사진</button>
        <button className="jobdetail-apply-btn">지원하기</button>
      </div>
      
    </div>
  );
}

export default JobDetail;