import React, { useState, useEffect } from "react";
import "./FilterModal.css";

const TAB_LIST = [
  { key: "지역", label: "지역" },
  { key: "일자", label: "일자" },
  { key: "혜택", label: "혜택" },
  { key: "직종", label: "직종" },
];

export const REGION_GROUPS = [
  {
    group: "서울특별시",
    items: [
      "종로구", "중구", "용산구", "성동구", "광진구", "동대문구", "중랑구", "성북구", "강북구", "도봉구", "노원구", "은평구", "서대문구", "마포구", "양천구", "강서구", "구로구", "금천구", "영등포구", "동작구", "관악구", "서초구", "강남구", "송파구", "강동구"
    ]
  },
  {
    group: "부산광역시",
    items: [
      "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "해운대구", "사하구", "금정구", "강서구", "연제구", "수영구", "사상구", "기장군"
    ]
  },
  {
    group: "대구광역시",
    items: [
      "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"
    ]
  },
  {
    group: "인천광역시",
    items: [
      "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"
    ]
  },
  {
    group: "광주광역시",
    items: [
      "동구", "서구", "남구", "북구", "광산구"
    ]
  },
  {
    group: "대전광역시",
    items: [
      "동구", "중구", "서구", "유성구", "대덕구"
    ]
  },
  {
    group: "울산광역시",
    items: [
      "중구", "남구", "동구", "북구", "울주군"
    ]
  },
  {
    group: "세종특별자치시",
    items: ["세종특별자치시"]
  },
  {
    group: "경기도",
    items: [
      "수원시", "용인시", "고양시", "화성시", "성남시", "부천시", "남양주시", "안산시", "평택시", "안양시", "시흥시", "파주시", "김포시", "의정부시", "광주시", "하남시", "양주시", "광명시", "군포시", "오산시", "이천시", "안성시", "구리시", "포천시", "의왕시", "양평군", "여주시", "동두천시", "과천시", "가평군", "연천군"
    ]
  },
  {
    group: "충청북도",
    items: [
      "청주시", "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"
    ]
  },
  {
    group: "충청남도",
    items: [
      "천안시", "공주시", "보령시", "아산시", "서산시", "논산시", "계룡시", "당진시", "금산군", "부여군", "서천군", "청양군", "홍성군", "예산군", "태안군"
    ]
  },
  {
    group: "전라남도",
    items: [
      "목포시", "여수시", "순천시", "나주시", "광양시", "담양군", "곡성군", "구례군", "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"
    ]
  },
  {
    group: "경상북도",
    items: [
      "포항시", "경주시", "김천시", "안동시", "구미시", "영주시", "영천시", "상주시", "문경시", "경산시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"
    ]
  },
  {
    group: "경상남도",
    items: [
      "창원시", "진주시", "통영시", "사천시", "김해시", "밀양시", "거제시", "양산시", "의령군", "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군"
    ]
  },
  {
    group: "강원특별자치도",
    items: [
      "춘천시", "원주시", "강릉시", "동해시", "태백시", "속초시", "삼척시", "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"
    ]
  },
  {
    group: "전북특별자치도",
    items: [
      "전주시", "군산시", "익산시", "정읍시", "남원시", "김제시", "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"
    ]
  },
  {
    group: "제주특별자치도",
    items: [
      "제주시", "서귀포시"
    ]
  }
];

const FILTERS = {
  지역: REGION_GROUPS,
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
  const [tab, setTab] = useState("지역");
  const [localSelected, setLocalSelected] = useState(selected || {});
  const [regionGroup, setRegionGroup] = useState(null);

  // 지역 2단계에서만 지역 선택이 동작하도록 별도 핸들러 분리 (이제 즉시 적용 X, 상태만 변경)
  const handleRegionSelect = (item) => {
    setLocalSelected((prev) => {
      const prevArr = prev[tab] || [];
      // 이미 선택된 경우 해제, 아니면 단일 선택
      return {
        ...prev,
        [tab]: prevArr.includes(item) ? [] : [item],
      };
    });
  };

  // 외부 selected prop이 바뀌면 localSelected도 동기화
  useEffect(() => {
    setLocalSelected(selected || {});
  }, [selected]);

  // 모달이 닫힐 때 지역 2단계 선택도 초기화
  useEffect(() => {
    if (!open) setRegionGroup(null);
  }, [open]);

  if (!open) return null;

  // 탭별 버튼 렌더링
  const renderTabContent = () => {
    if (tab === "지역") {
      if (!regionGroup) {
        // 1단계: 시/도 그룹 버튼
        return (
          <div className="filter-btn-group">
            {FILTERS.지역.map((cat) => (
              <button
                key={cat.group}
                className={regionGroup === cat.group ? "filter-btn selected" : "filter-btn"}
                onClick={() => setRegionGroup(cat.group)}
              >
                {cat.group}
              </button>
            ))}
          </div>
        );
      } else {
        // 2단계: 상단에 <뒤로> <선택된 시/도> 한 줄, 아래에 시/군/구 버튼
        const selectedCat = FILTERS.지역.find((cat) => cat.group === regionGroup);
        if (!selectedCat) return null;
        return (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <button className="filter-btn" onClick={() => setRegionGroup(null)}>&lt; 뒤로</button>
              <button className="filter-btn selected" disabled>{regionGroup}</button>
            </div>
            <div className="filter-btn-group">
              {selectedCat.items && selectedCat.items.length > 0 ? (
                selectedCat.items.map((item) => (
                  <button
                    key={item}
                    className={
                      localSelected[tab]?.includes(item)
                        ? "filter-btn selected"
                        : "filter-btn"
                    }
                    onClick={() => handleRegionSelect(item)}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <div style={{ color: '#888', padding: '24px 0', textAlign: 'center', width: '100%' }}>
                  하위 행정구역이 없습니다.
                </div>
              )}
            </div>
          </>
        );
      }
    }
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
    // 지역이 선택되지 않은 경우 지역 필터를 완전히 제거
    const filtered = { ...localSelected };
    if (filtered["지역"] && filtered["지역"].length === 0) {
      delete filtered["지역"];
    }
    if (onApply) onApply(filtered);
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
          {TAB_LIST.map((t, idx) => (
            <button
              key={t.key}
              className={`filter-modal-tab${tab === t.key ? " active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="filter-modal-tabline" style={{ left: `${(TAB_LIST.findIndex((t) => t.key === tab)) * 100 / (TAB_LIST.length)}%` }} />
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
