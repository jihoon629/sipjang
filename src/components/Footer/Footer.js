import "./Footer.css";
import { Link, useLocation } from "react-router-dom";

function Footer() {
  const { pathname } = useLocation();
  return (
    <footer className="footer-nav">
      <Link to="/" className={pathname === "/" ? "active" : ""}>
        <svg className="footer-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M4 10.5V19a1 1 0 0 0 1 1h3.5v-5.5h7V20H19a1 1 0 0 0 1-1v-8.5a1 1 0 0 0-.34-.75l-7-6a1 1 0 0 0-1.32 0l-7 6A1 1 0 0 0 4 10.5Z" stroke={pathname === "/" ? "#4666e4" : "#444"} strokeWidth="1.7" strokeLinejoin="round"/>
        </svg>
        <div className="footer-label">홈</div>
      </Link>

      <Link to="/jobs" className={pathname.startsWith("/jobs") ? "active" : ""}>
        <svg className="footer-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="7" width="18" height="12" rx="2" stroke={pathname.startsWith("/jobs") ? "#4666e4" : "#444"} strokeWidth="1.7"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" stroke={pathname.startsWith("/jobs") ? "#4666e4" : "#444"} strokeWidth="1.7"/>
        </svg>
        <div className="footer-label">일자리</div>
      </Link>

      <Link to="/application" className={pathname.startsWith("/application") ? "active" : ""}>
        <svg className="footer-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9Zm0-4v-4m0 0V7m0 4h4m-4 0H8" stroke={pathname.startsWith("/application") ? "#4666e4" : "#444"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="footer-label">지원내역</div>
      </Link>

      <Link to="/mypage" className={pathname.startsWith("/mypage") ? "active" : ""}>
        <svg className="footer-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8.5" r="4" stroke={pathname.startsWith("/mypage") ? "#4666e4" : "#444"} strokeWidth="1.7"/>
          <path d="M4 20c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke={pathname.startsWith("/mypage") ? "#4666e4" : "#444"} strokeWidth="1.7"/>
        </svg>
        <div className="footer-label">프로필</div>
      </Link>
    </footer>
  );
}
export default Footer;
