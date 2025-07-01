import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import "./Header.css";
import { useUser } from "../../contexts/UserContext"; // UserContext 임포트

function Header() {
  const { user } = useUser(); // useUser 훅 사용
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo" tabIndex={0} aria-label="홈으로 이동">
          <span className="logo-badge">내</span><span className="logo-text">일</span>
        </Link>
      </div>

      <div className="header-right">
        {isMobile ? (
          user ? (
            <>
              <button className="icon-button"><Bell size={20} /></button>
              <Link to="/mypage" className="icon-button" aria-label="마이페이지로 이동"><User size={20} /></Link>
            </>
          ) : (
            <>
              <Link to="/login" className="btn login-btn">로그인</Link>
              <Link to="/signup" className="btn signup-btn">회원가입</Link>
            </>
          )
        ) : (
          // 데스크탑 메뉴 영역 (예: 홈 / 일자리 / 지도 등 넣고 싶으면 여기에)
          <nav className="desktop-nav">
            <Link to="/jobs" className="nav-link">일자리</Link>
            <Link to="/mypage" className="nav-link">마이페이지</Link>
            {user ? (
              <span className="welcome-text">{user.username}님</span>
            ) : (
              <>
                <Link to="/login" className="btn login-btn">로그인</Link>
                <Link to="/signup" className="btn signup-btn">회원가입</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
