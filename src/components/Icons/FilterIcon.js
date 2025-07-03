import React from "react";

// 간단한 필터(깔때기) SVG 아이콘 컴포넌트
export default function FilterIcon({ size = 16, color = "#222", style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6a1 1 0 0 1 1-1h14a1 1 0 0 1 .8 1.6l-5.6 7.47V19a1 1 0 0 1-1.45.89l-2-1A1 1 0 0 1 10 18v-4.93L4.2 7.6A1 1 0 0 1 4 6Z"
        fill={color}
      />
    </svg>
  );
}
