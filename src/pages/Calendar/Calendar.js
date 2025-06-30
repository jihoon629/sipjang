import React, { useState, useMemo } from "react";
import "./Calendar.css";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";

const payData = [
  {
    company: "대한건설",
    date: "2024-01-15",
    amount: 150000,
    status: "확정",
  },
  {
    company: "현대건축",
    date: "2024-01-20",
    amount: 130000,
    status: "대기",
  },
  {
    company: "삼성건설",
    date: "2024-01-25",
    amount: 140000,
    status: "확정",
  },
];


const payStatusColor = {
  "확정": "pay-status-confirmed",
  "대기": "pay-status-pending",
};

function getMonthMatrix(year, month) {
  // month: 1-based (1=January)
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const matrix = [];
  let week = Array(7).fill(null);
  let dayOfWeek = firstDay.getDay();
  for (let d = 1; d <= lastDay.getDate(); d++) {
    week[dayOfWeek] = d;
    if (dayOfWeek === 6 || d === lastDay.getDate()) {
      matrix.push([...week]);
      week = Array(7).fill(null);
    }
    dayOfWeek = (dayOfWeek + 1) % 7;
  }
  return matrix;
}

function Calendar() {
  const navigate = useNavigate();

  // 오늘 날짜
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 1-based
  const days = useMemo(() => getMonthMatrix(year, month), [year, month]);

  // 메모 상태: { '2024-01-15': '메모내용', ... }
  const [memos, setMemos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("calendarMemos") || "{}")
    } catch { return {}; }
  });
  const [memoModal, setMemoModal] = useState({ open: false, date: null, value: "" });

  // 급여 일정이 있는 날짜 (예시: 2024년 1월만)
  const payDays = useMemo(() => {
    if (year === 2024 && month === 1) {
      return { 15: "confirmed", 20: "pending", 25: "confirmed" };
    }
    return {};
  }, [year, month]);

  // 월 이름 한글
  const monthNames = [
    "1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"
  ];

  // 이전/다음 달 이동
  const goPrevMonth = () => {
    if (month === 1) {
      setYear(y => y - 1);
      setMonth(12);
    } else {
      setMonth(m => m - 1);
    }
  };
  const goNextMonth = () => {
    if (month === 12) {
      setYear(y => y + 1);
      setMonth(1);
    } else {
      setMonth(m => m + 1);
    }
  };

  // 날짜 클릭 시 메모 모달 열기
  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setMemoModal({ open: true, date: key, value: memos[key] || "" });
  };
  // 메모 저장
  const handleMemoSave = () => {
    setMemos(prev => {
      const next = { ...prev, [memoModal.date]: memoModal.value };
      localStorage.setItem("calendarMemos", JSON.stringify(next));
      return next;
    });
    setMemoModal({ open: false, date: null, value: "" });
  };
  // 메모 모달 닫기
  const handleMemoClose = () => setMemoModal({ open: false, date: null, value: "" });

  return (
    <div className="calendar-page">
      <Header />
      <div className="calendar-content">
        <div className="calendar-header-row">
          <button className="calendar-back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <span className="calendar-header-title">급여 달력</span>
        </div>
        <div className="calendar-box">
          <div className="calendar-title calendar-title-flex">
            <button className="calendar-month-btn" onClick={goPrevMonth} aria-label="이전 달">&#60;</button>
            <span>{year}년 {monthNames[month - 1]}</span>
            <button className="calendar-month-btn" onClick={goNextMonth} aria-label="다음 달">&#62;</button>
          </div>
          <table className="calendar-table">
            <thead>
              <tr>
                <th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
              </tr>
            </thead>
            <tbody>
              {days.map((week, i) => (
                <tr key={i}>
                  {week.map((day, j) => {
                    const key = day ? `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}` : null;
                    return (
                      <td key={j}>
                        {day ? (
                          <span
                            className={[
                              "calendar-day",
                              payDays[day] === "confirmed"
                                ? "confirmed"
                                : payDays[day] === "pending"
                                ? "pending"
                                : "",
                              year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate()
                                ? "today" : "",
                              memos[key] ? "memoed" : ""
                            ].join(" ")}
                            onClick={() => handleDayClick(day)}
                            tabIndex={0}
                            aria-label={key + (memos[key] ? ` 메모 있음: ${memos[key]}` : "")}
                          >
                            {day}
                          </span>
                        ) : null}
                      </td>
                    );
                  })}
      {/* 메모 모달 */}
      {memoModal.open && (
        <div className="calendar-memo-modal-bg" onClick={handleMemoClose}>
          <div className="calendar-memo-modal" onClick={e => e.stopPropagation()}>
            <div className="calendar-memo-modal-title">메모 ({memoModal.date})</div>
            <textarea
              className="calendar-memo-textarea"
              value={memoModal.value}
              onChange={e => setMemoModal(m => ({ ...m, value: e.target.value }))}
              placeholder="메모를 입력하세요"
              rows={4}
              autoFocus
            />
            <div className="calendar-memo-modal-btns">
              <button className="calendar-memo-btn" onClick={handleMemoSave}>저장</button>
              <button className="calendar-memo-btn cancel" onClick={handleMemoClose}>취소</button>
            </div>
          </div>
        </div>
      )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="calendar-pay-title">예정된 급여</div>
        <div className="calendar-pay-list">
          {payData.map((item, idx) => (
            <div className="calendar-pay-card" key={idx}>
              <div className="calendar-pay-row">
                <span className="calendar-pay-company">{item.company}</span>
                <span className="calendar-pay-amount">{item.amount.toLocaleString()}원</span>
              </div>
              <div className="calendar-pay-row2">
                <span className="calendar-pay-date">{item.date}</span>
                <span className={`calendar-pay-status ${payStatusColor[item.status]}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
