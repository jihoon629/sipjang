import React, { useState, useEffect } from "react";
import "./FilterModal.css";

const TAB_LIST = [
  { key: "현장", label: "현장" },
  { key: "일자", label: "일자" },
  { key: "혜택", label: "혜택" },
  { key: "직종", label: "직종" },
];

const FILTERS = {
  현장: ["즐겨찾기", "출역현장"],
  일자: ["내일", "모레", "7일이내", "30일이내"],
  혜택: ["식사제공", "숙소제공", "교통비지원"],
  직종: [
    { group: "일반인부", items: [
      "보통인부", "자재정리", "신호수", "준공청소", "해체정리", "작업팀장", "세대청소", "곰방", "양중",
      "안전관리", "안전시설", "화재감시자", "안전감시단", "농촌",  "경계석공", "토류판공", "보양공", "전기공", "알폼", "경비원", 
      "할석공", "직영-건축반장", "직영-안전반장", "미화", "고정 신호수"
    ] },
    { group: "기능공", items: [
      "건축배관", "형틀목공", "강구조", "건축목공", "철근", "비계", "조경", "석공", "도장", "미장", "토공", "조적", "타일", "일반용접",
      "콘크리트", "수장", "방수", "덕트", "창호", "도배", "건축기계설비", "철거", "건출", "일반기계설비", "패널조립", "보온", "유리", 
      "플랜트기계설비", "제관", "플랜트계측설비", "코킹", "포장", "벌목", "궤도", "상하수도배관", "보링", "발파", "지붕", "플랜트배관", 
      "잠수", "플랜트제관", "플랜트용접", "준설", "플랜트전기설비", "플랜트보온", "보일러", "일반특수용접", "플랜트덕트", "플랜트특수용접"
    ] },
        { group: "기타", items: [
        "기타"
    ] },
  ]
};


export default function FilterModal({ open, onClose, onApply, selected, setSelected, scrollable }) {
  const [tab, setTab] = useState("현장");
  const [localSelected, setLocalSelected] = useState(selected || {});

  // 외부 selected prop이 바뀌면 localSelected도 동기화
  useEffect(() => {
    setLocalSelected(selected || {});
  }, [selected]);

  if (!open) return null;

  // 탭별 버튼 렌더링
  const renderTabContent = () => {
    if (tab === "직종") {
      return (
        <div className="filter-jobtype-section">
          {FILTERS.직종.map((cat) => (
            <div key={cat.group} className="filter-jobtype-group">
              <div className="filter-jobtype-title">{cat.group}</div>
              <div className="filter-jobtype-btns">
                {cat.items.map((item) => (
                  <button
                    key={item}
                    className={
                      localSelected[tab]?.includes(item)
                        ? "filter-btn selected"
                        : "filter-btn"
                    }
                    onClick={() => {
                      setLocalSelected((prev) => {
                        const prevArr = prev[tab] || [];
                        return {
                          ...prev,
                          [tab]: prevArr.includes(item)
                            ? prevArr.filter((v) => v !== item)
                            : [...prevArr, item],
                        };
                      });
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="filter-btn-group">
          {FILTERS[tab].map((item) => (
            <button
              key={item}
              className={
                localSelected[tab]?.includes(item)
                  ? "filter-btn selected"
                  : "filter-btn"
              }
              onClick={() => {
                setLocalSelected((prev) => {
                  const prevArr = prev[tab] || [];
                  return {
                    ...prev,
                    [tab]: prevArr.includes(item)
                      ? prevArr.filter((v) => v !== item)
                      : [...prevArr, item],
                  };
                });
              }}
            >
              {item}
            </button>
          ))}
        </div>
      );
    }
  };

  const handleReset = () => {
    setLocalSelected({});
    // 외부 상태도 초기화
    if (setSelected) setSelected({});
  };
  const handleApply = () => {
    if (onApply) onApply(localSelected);
    if (onClose) onClose();
  };

  return (
    <div className="filter-modal-overlay">
      <div className="filter-modal-sheet" style={scrollable ? {maxHeight:'90vh', overflowY:'auto'} : {}}>
        <div className="filter-modal-header">
          <span className="filter-modal-title">전체 필터</span>
          <button className="filter-modal-close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="filter-modal-tabs">
          {TAB_LIST.map((t) => (
            <button
              key={t.key}
              className={`filter-modal-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="filter-modal-tabline" style={{ left: `${TAB_LIST.findIndex((t) => t.key === tab) * 25}%` }} />
        <div className="filter-modal-content">{renderTabContent()}</div>
        <div className="filter-modal-bottom">
          <button className="filter-modal-reset" onClick={handleReset}>
            ↻ 초기화
          </button>
          <button className="filter-modal-apply" onClick={handleApply}>
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
}
