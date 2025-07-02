import React from "react";
import "./Support.css";


import { useNavigate } from "react-router-dom";



function Support() {
  const navigate = useNavigate();
  // 예시 데이터 (실제 데이터 연동 시 구조에 맞게 수정)
  const applications = [
    {
      id: 1,
      status: '지원 성공',
      statusColor: '#219653',
      statusIcon: '✔️',
      jobTitle: '경기도 수원시 영통구 영통동 A-2BL 아파트 건설공사 2공구(삼성)',
      company: '삼성건설',
      people: 4,
      date: '오늘 오전 8:30',
      detailDate: '25.7.2 (수) 오전 8:30',
      detailStatus: '지원 성공',
      detailStatusColor: '#219653',
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

  return (
    <div className="support-page">
      <h2 className="support-title">지원내역</h2>
      <div className="support-list">
        {applications.map(app => (
          <div className="support-card styled" key={app.id}>
            <div className="support-status-row">
              <span className="support-status-icon" style={{color: app.statusColor}}>{app.statusIcon}</span>
              <span className="support-status-label" style={{color: app.statusColor}}>{app.status}</span>
            </div>
            <div className="support-meta-row">
              <span className="support-meta">보통인부 {app.people}명</span>
              <span className="support-meta">{app.date}</span>
            </div>
            <div className="support-job-title styled">{app.jobTitle}</div>
            <div className="support-company styled">{app.company}</div>
            <div className="support-detail-box">
              <div className="support-detail-date">{app.detailDate}</div>
              <div className="support-detail-status-row">
                <span className="support-detail-status-icon" style={{color: app.detailStatusColor}}>{app.detailStatusIcon}</span>
                <span className="support-detail-status-label" style={{color: app.detailStatusColor}}>{app.detailStatus}</span>
              </div>
              <div className="support-detail-msg">{app.detailMsg.split('\n').map((line, i) => <div key={i}>{line}</div>)}</div>
            </div>
            {app.status === '지원 성공' ? (
              <button className="support-another-btn success" onClick={() => alert('담당자와 연락 기능은 추후 제공됩니다.')}>담당자와 연락하기</button>
            ) : (
              <button className="support-another-btn" onClick={() => navigate('/jobs')}>다른 일자리 둘러보기</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Support;
