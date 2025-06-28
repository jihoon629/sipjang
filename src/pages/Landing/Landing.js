import { Link } from "react-router-dom";
import "./Landing.css";

function Landing() {
  return (
    <div className="landing-container">
      <main className="landing-main">
        <section className="intro-text">
          <span className="tag">블록체인 기반 플랫폼</span>
          <h1>
            <span className="highlight">내일</span>과 함께하는<br />
            안전한 건설 일자리
          </h1>
          <p>블록체인 기술로 투명하고 안전한 급여 지급을 보장하며,<br />
            AI 매칭으로 최적의 일자리를 찾아드립니다.</p>
          <div className="cta-buttons">
            <button className="start-btn">지금 시작하기</button>
            <button className="outline-btn">일자리 둘러보기</button>
          </div>
          <div className="stats">
            <div><strong>50K+</strong><br />등록 사용자</div>
            <div><strong>4.9</strong><br />평균 평점</div>
            <div><strong>98%</strong><br />만족도</div>
          </div>
        </section>
        <section className="intro-image">
          <img src="/assets/site-preview.png" alt="건설 현장" />
        </section>
      </main>
    </div>
  );
}

export default Landing;
