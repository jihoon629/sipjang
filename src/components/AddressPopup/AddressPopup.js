import React from 'react';
import './AddressPopup.css';

const AddressPopup = ({ onAddressSelect, onClose }) => {

  // 카카오 주소 검색 API 사용 (팝업 방식)
  const handleApiSearch = React.useCallback(() => {
    if (!window.daum || !window.daum.Postcode) {
      return;
    }

    // 팝업 윈도우로 주소 검색 실행
    new window.daum.Postcode({
      oncomplete: function(data) {
        // 주소 데이터 처리
        const addressData = {
          roadFullAddr: data.roadAddress || data.jibunAddress,
          roadAddrPart1: data.roadAddress || data.jibunAddress,
          addrDetail: '',
          roadAddrPart2: '',
          engAddr: '',
          jibunAddr: data.jibunAddress || data.roadAddress,
          zipNo: data.zonecode || '',
          siNm: data.sido || '',
          sggNm: data.sigungu || '',
          emdNm: data.bname || '',
        };
        
        onAddressSelect(addressData);
        onClose();
      }
    }).open();
  }, [onAddressSelect, onClose]);

  // 컴포넌트 마운트 시 카카오 API 스크립트 로드 및 자동 실행
  React.useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      // 스크립트가 이미 로드되어 있으면 바로 실행
      handleApiSearch();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.onload = () => {
      // 스크립트 로드 완료 후 자동 실행
      setTimeout(() => handleApiSearch(), 100); // 약간의 지연을 줘서 안정성 확보
    };
    script.onerror = () => console.error('카카오 주소 API 로드 실패');
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [handleApiSearch]);

  return (
    <div className="address-popup-overlay">
      <div className="address-popup-content">
        <div className="address-popup-header">
          <h3>주소 검색</h3>
          <button type="button" className="address-popup-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="address-popup-body">
          <div className="address-popup-loading">
            <p>카카오 주소 검색을 시작합니다...</p>
            <p>팝업 창이 나타나지 않으면 브라우저의 팝업 차단을 해제해주세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressPopup;