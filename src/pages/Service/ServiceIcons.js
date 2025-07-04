import { FaComments, FaHistory, FaStore, FaQuestionCircle, FaEnvelopeOpenText } from "react-icons/fa";
import React from "react";



// 파란색 그라데이션 아이콘 래퍼
const BlueGradientIcon = ({ children, id }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" style={{ display: "inline-block", verticalAlign: "middle" }}>
    <defs>
      <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#5a7cff" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {React.cloneElement(children, { fill: `url(#${id})`, color: undefined })}
  </svg>
);

export const serviceIcons = {
  chat: (
    <BlueGradientIcon id="chat-gradient">
      <FaComments size={32} />
    </BlueGradientIcon>
  ),
  chatHistory: (
    <BlueGradientIcon id="history-gradient">
      <FaHistory size={32} />
    </BlueGradientIcon>
  ),
  store: (
    <BlueGradientIcon id="store-gradient">
      <FaStore size={32} />
    </BlueGradientIcon>
  ),
  inquiry: (
    <BlueGradientIcon id="inquiry-gradient">
      <FaEnvelopeOpenText size={32} />
    </BlueGradientIcon>
  ),
  inquiryHistory: (
    <BlueGradientIcon id="inquiry-history-gradient">
      <FaEnvelopeOpenText size={32} />
    </BlueGradientIcon>
  ),
  faq: (
    <BlueGradientIcon id="faq-gradient">
      <FaQuestionCircle size={32} />
    </BlueGradientIcon>
  ),
};
