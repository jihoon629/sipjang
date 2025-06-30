
import React from "react";
import "./Main.css";
import constructionImage from "../../assets/123.jpg";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  return (
    <div className="main-wrapper">
      <div className="main-container">
        <div className="main-left">
          <span className="main-badge">블록체인 기반 플랫폼</span>
          <h1 className="main-title">
            <span className="highlight-blue">내</span>
            <span className="highlight-orange">일</span>과 함께하는<br />
            안전한 건설 일자리
          </h1>
          <p className="main-description">
            블록체인 기술로 투명하고 안전한 급여 지급을 보장하며,<br />
            AI 매칭으로 최적의 일자리를 찾아드립니다.
          </p>
          <div className="main-buttons">
            <button className="btn-primary">지금 시작하기</button>
            <button className="btn-secondary">일자리 둘러보기</button>
          </div>
          <div className="main-stats">
            <div><strong>50K+</strong><br />등록 사용자</div>
            <div><strong>4.9</strong><br />평균 평점</div>
            <div><strong>98%</strong><br />만족도</div>
          </div>
        </div>
        <div className="main-right">
          <div className="image-box">
            <img src={constructionImage} alt="건설 현장" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Main;
