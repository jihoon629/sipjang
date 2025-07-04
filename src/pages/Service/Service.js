import React from "react";
import "./Service.css";
import { serviceIcons } from "./ServiceIcons";

const iconList = [
  { key: "chat", label: "톡상담하기" },
  { key: "chatHistory", label: "톡상담내역" },
  { key: "store", label: "일거리찾기" },
  { key: "inquiry", label: "1:1 문의하기" },
  { key: "inquiryHistory", label: "1:1 문의내역" },
  { key: "faq", label: "FAQ" },
];

// 각 아이콘 클릭 시 동작할 함수 정의
function handleIconClick(key) {
  switch (key) {
    case "chat":
      window.open("https://open.kakao.com/o/sipjang-chat", "_blank");
      break;
    case "chatHistory":
      alert("최근 톡상담 내역이 없습니다. 문의가 필요하시면 '톡상담하기'를 이용해 주세요.");
      break;
    case "store":
      window.location.href = "/jobs";
      break;
    case "inquiry":
      window.location.href = "mailto:12345@12345";
      break;
    case "inquiryHistory":
      alert("최근 1:1 문의 내역이 없습니다. 궁금한 점은 '1:1 문의하기'를 통해 남겨주세요.");
      break;
    case "faq": {
      const faqHtml = `
        <html>
        <head>
          <title>자주 묻는 질문(FAQ)</title>
          <meta charset='utf-8' />
          <style>
            body { font-family: 'Pretendard', 'Noto Sans KR', Arial, sans-serif; margin: 24px; color: #222; background: #f8fafc; }
            h1 { color: #2563eb; font-size: 1.5rem; margin-bottom: 18px; }
            ul { padding-left: 18px; }
            li { margin-bottom: 12px; line-height: 1.7; }
            strong { color: #2563eb; }
          </style>
        </head>
        <body>
          <h1>자주 묻는 질문(FAQ)</h1>
          <ul>
            <li><strong>1. 회원가입/로그인 관련 문의</strong><br />
              - 이메일, SNS 계정으로 간편 가입이 가능합니다.<br />
              - 비밀번호를 잊으셨다면 '비밀번호 찾기'를 이용해 주세요.
            </li>
            <li><strong>2. 일거리 찾기/지원 방법</strong><br />
              - '일거리찾기' 메뉴에서 원하는 공고를 검색 후 지원할 수 있습니다.
            </li>
            <li><strong>3. 이력서 작성 및 관리</strong><br />
              - 마이페이지 &gt; 이력서 관리에서 이력서를 작성/수정할 수 있습니다.
            </li>
            <li><strong>4. 기업 회원 문의</strong><br />
              - 기업 회원은 별도 인증 후 공고 등록이 가능합니다.
            </li>
            <li><strong>5. 기타 서비스 이용 문의</strong><br />
              - 고객센터 1:1 문의 또는 카카오톡 상담을 이용해 주세요.
            </li>
          </ul>
        </body>
        </html>
      `;
      const faqWin = window.open('', 'faqWin', 'width=420,height=600,scrollbars=yes');
      if (faqWin) {
        faqWin.document.write(faqHtml);
        faqWin.document.close();
      }
      break;
    }
    default:
      break;
  }
}

export default function Service() {
  return (
    <div className="service-container">
      <h1 className="service-title service-title-gradient">
        <span className="gradient-text">고객센터</span>
      </h1>
      <div className="service-icons-section">
        <div className="service-icons-title">무엇을 도와드릴까요?</div>
        <div className="service-icons-grid">
          {iconList.map(({ key, label }) => (
            <div
              className="service-icon-item"
              key={key}
              style={{ cursor: "pointer" }}
              onClick={() => handleIconClick(key)}
              tabIndex={0}
              role="button"
              aria-label={label}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") handleIconClick(key); }}
            >
              <div className="service-icon-circle">{serviceIcons[key]}</div>
              <div className="service-icon-label">{label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="service-notice-section">
        <div className="service-notice-title">공지사항</div>
        <div className="service-notice-content">개인정보 이용내역 안내</div>
      </div>

      <div className="service-contact-section">
        <div className="service-contact-row">
          <span className="service-contact-label">카카오톡 문의 안내</span>
          <span className="service-contact-phone">010-####-####</span>
        </div>
        <div className="service-contact-row">
          <span className="service-contact-label">이메일 문의 안내</span>
          <span className="service-contact-phone">12345@12345</span>
        </div>
      </div>
    </div>
  );
}
