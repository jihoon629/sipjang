import React from "react";
import "./Application.css";


import { useNavigate } from "react-router-dom";



function Application() {
  const navigate = useNavigate();
  const [showEmpty, setShowEmpty] = React.useState(false);

  // 예시 데이터 (실제 데이터 연동 시 구조에 맞게 수정)
  const applications = [
    {
      id: 1,
      status: '지원 성공',
      statusColor: '#22c55e',
      statusIcon: '✔️',
      jobTitle: '경기도 수원시 영통구 영통동 A-2BL 아파트 건설공사 2공구(삼성)',
      company: '삼성건설',
      people: 4,
      date: '오늘 오전 8:30',
      detailDate: '25.7.2 (수) 오전 8:30',
      detailStatus: '지원 성공',
      detailStatusColor: '#22c55e',
      detailStatusIcon: '✔️',
      detailMsg: '해당 일자리에 배정되었습니다.\n현장 담당자와 연락을 기다려주세요.'
    },
    {
      id: 2,
      status: '지원 탈락',
      statusColor: '#e74c3c',
      statusIcon: '❌',
      jobTitle: '경기도 의왕시 의왕월암 A-1BL 아파트 건설공사 1공구(우리)',
      company: '우리건설',
      people: 6,
      date: '어제 오전 6:55',
      detailDate: '25.3.3 (월) 오후 4:37',
      detailStatus: '지원 탈락',
      detailStatusColor: '#e74c3c',
      detailStatusIcon: '⭑',
      detailMsg: '해당 일자리에 배정되지 않았습니다.\n근처 다른 일자리에 지원해 보세요.'
    }
  ];

  // 지원내역 토글 버튼
  const handleToggle = () => setShowEmpty((prev) => !prev);

  // 실제로 보여줄 데이터
  const displayApplications = showEmpty ? [] : applications;

  return (
    <div className="application-page application-empty-bg">
      <h2 className="application-title">지원내역</h2>
      <button className="application-toggle-btn" onClick={handleToggle}>
        {showEmpty ? '지원내역 임시 추가' : '지원내역 없는 화면 보기'}
      </button>
      <div className="application-list">
        {displayApplications.length === 0 ? (
          <div className="application-empty">
            <div className="application-empty-icon-outer">
              <div className="application-empty-icon-inner">
                <span className="application-empty-face" aria-label="empty-face">
                  <span className="application-empty-face-mouth" />
                </span>
              </div>
            </div>
            <div className="application-empty-text">
              지원한 일자리가 없습니다.<br/>주변 일자리를 확인해 보세요.
            </div>
            <button className="application-empty-btn-main" onClick={() => navigate('/nearby')}>주변 일자리 확인하기</button>
          </div>
        ) : (
          displayApplications.map(app => (
            <div className="application-card styled" key={app.id}>
              <div className="application-status-row">
                <span className="application-status-icon" data-color={app.statusColor}>
                  <span className={app.status === '지원 성공' ? 'application-status-svg application-status-success' : 'application-status-svg application-status-fail'} />
                </span>
                <span className="application-status-label" data-color={app.statusColor}>{app.status}</span>
              </div>
              <div className="application-meta-row">
                <span className="application-meta">보통인부 {app.people}명</span>
                <span className="application-meta">{app.date}</span>
              </div>
              <div className="application-job-title styled">{app.jobTitle}</div>
              <div className="application-company styled">{app.company}</div>
              <div className="application-detail-box">
                <div className="application-detail-date">{app.detailDate}</div>
                <div className="application-detail-status-row">
                <span className="application-detail-status-icon" data-color={app.detailStatusColor}>
                  <span className={app.detailStatus === '지원 성공' ? 'application-status-svg application-status-success' : 'application-status-svg application-status-fail'} />
                </span>
                <span className="application-detail-status-label" data-color={app.detailStatusColor}>{app.detailStatus}</span>
                </div>
                <div className="application-detail-msg">{app.detailMsg.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
              </div>
              {app.status === '지원 성공' ? (
                <button className="application-another-btn success" onClick={() => alert('담당자와 연락 기능은 추후 제공됩니다.')}>담당자와 연락하기</button>
              ) : (
                <button className="application-another-btn" onClick={() => navigate('/jobs')}>다른 일자리 둘러보기</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Application;
