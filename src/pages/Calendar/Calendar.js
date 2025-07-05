import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMySalaries } from "../../services/applicationsService";
import "./Calendar.css";

const payStatusColor = {
  "확정": "pay-status-confirmed",
  "대기": "pay-status-pending",
};

function getMonthMatrix(year, month) {
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
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memos, setMemos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("calendarMemos") || "{}");
    } catch {
      return {};
    }
  });
  const [memoModal, setMemoModal] = useState({ open: false, date: null, value: "" });

  useEffect(() => {
    const fetchSalaries = async () => {
      setLoading(true);
      try {
        const response = await getMySalaries();
        const fetchedSalaries = response.data?.applications || response.data || [];
        setSalaries(fetchedSalaries);
        setError(null);
      } catch (err) {
        setError(err.message || "급여 정보를 불러오는데 실패했습니다.");
        console.error("급여 데이터 로딩 중 예외 발생:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaries();
  }, []);

  const days = useMemo(() => getMonthMatrix(year, month), [year, month]);

  const payDays = useMemo(() => {
    const daysMap = {};
    salaries.forEach(salary => {
      if (salary.paymentDate) {
        const salaryDate = new Date(salary.paymentDate);
        if (salaryDate.getFullYear() === year && salaryDate.getMonth() + 1 === month) {
          daysMap[salaryDate.getDate()] = "confirmed";
        }
      }
    });
    return daysMap;
  }, [year, month, salaries]);

  const totalMonthlyIncome = useMemo(() => {
    return salaries
      .filter(salary => {
        const d = new Date(salary.paymentDate);
        return d.getFullYear() === year && d.getMonth() + 1 === month;
      })
      .reduce((sum, salary) => sum + (salary.paymentAmount || 0), 0);
  }, [salaries, year, month]);

  const filteredSalaries = useMemo(() => {
    return salaries.filter(salary => {
      const d = new Date(salary.paymentDate);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
  }, [salaries, year, month]);

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

  const goPrevMonth = () => {
    if (month === 1) { setYear(y => y - 1); setMonth(12); }
    else { setMonth(m => m - 1); }
  };
  const goNextMonth = () => {
    if (month === 12) { setYear(y => y + 1); setMonth(1); }
    else { setMonth(m => m + 1); }
  };

  const handleDayClick = (day) => {
    if (!day) return;
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setMemoModal({ open: true, date: key, value: memos[key] || "" });
  };

  const handleMemoSave = () => {
    setMemos(prev => {
      const next = { ...prev, [memoModal.date]: memoModal.value };
      localStorage.setItem("calendarMemos", JSON.stringify(next));
      return next;
    });
    setMemoModal({ open: false, date: null, value: "" });
  };

  const handleMemoClose = () => setMemoModal({ open: false, date: null, value: "" });

  return (
    <div className="calendar-page">
      <div className="calendar-content">
        <div className="calendar-header-row">
          <button className="calendar-back-btn" onClick={() => navigate(-1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 19l-7-7 7-7" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="calendar-header-title">급여 달력</span>
        </div>

        <div className="calendar-box">
          <div className="calendar-title calendar-title-flex">
            <button className="calendar-month-btn" onClick={goPrevMonth}>&#60;</button>
            <span>{year}년 {monthNames[month - 1]}</span>
            <button className="calendar-month-btn" onClick={goNextMonth}>&#62;</button>
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
                    const isToday = year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
                    const dayClass = [
                      "calendar-day",
                      payDays[day] ? payDays[day] : "",
                      isToday ? "today" : "",
                      memos[key] ? "memoed" : ""
                    ].join(" ");

                    return (
                      <td key={j}>
                        {day && (
                          <span
                            className={dayClass}
                            onClick={() => handleDayClick(day)}
                            tabIndex={0}
                            aria-label={key + (memos[key] ? ` 메모 있음: ${memos[key]}` : "")}
                          >
                            {day}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="calendar-pay-title">
          받은 월급 (총 {totalMonthlyIncome.toLocaleString()}원)
        </div>

        <div className="calendar-pay-title">받은 급여 내역</div>
        <div className="calendar-pay-list">
          {loading && <p>급여 내역을 불러오는 중입니다...</p>}
          {error && <p style={{ color: 'red' }}>오류: {error}</p>}
          {!loading && !error && filteredSalaries.length === 0 && (
            <p>이번 달 받은 급여 내역이 없습니다.</p>
          )}
          {!loading && !error && filteredSalaries.map((item) => (
            <div className="calendar-pay-card" key={item.id}>
              <div className="calendar-pay-row">
                <span className="calendar-pay-company">{item.jobPosting?.title || '알 수 없는 공고'}</span>
                <span className="calendar-pay-amount">{item.paymentAmount?.toLocaleString() || 0}원</span>
              </div>
              <div className="calendar-pay-row2">
                <span className="calendar-pay-date">{item.paymentDate}</span>
                <span className={`calendar-pay-status ${payStatusColor['확정']}`}>확정</span>
              </div>
            </div>
          ))}
        </div>
      </div>

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
    </div>
  );
}

export default Calendar;
