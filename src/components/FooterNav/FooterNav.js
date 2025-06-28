import { Link, useLocation } from "react-router-dom";
import "./FooterNav.css";

function FooterNav() {
  const { pathname } = useLocation();

  return (
    <nav className="footer-nav">
      <Link to="/" className={pathname === "/" ? "active" : ""}>홈</Link>
      <Link to="/jobs" className={pathname === "/jobs" ? "active" : ""}>일자리</Link>
      <Link to="/messages" className={pathname === "/messages" ? "active" : ""}>메시지</Link>
      <Link to="/profile" className={pathname === "/profile" ? "active" : ""}>프로필</Link>
    </nav>
  );
}
export default FooterNav;
