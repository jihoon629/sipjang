
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import { FiChevronLeft } from "react-icons/fi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { FaHardHat } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import React, { useState } from "react";
import "./Signup.css";

function UnifiedSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: 유형선택, 2: 폼입력
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [form, setForm] = useState({
    role: "", // 'worker' or 'employer'
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
    agree: false,
    company: "",
    phone: "",
    specialty: ""
  });
  // const specialties = ["철근공", "미장공", "목공", "기타"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const handleRoleSelect = (role) => {
    setForm((prev) => ({ ...prev, role }));
    setStep(2);
  };
  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setForm((prev) => ({ ...prev, role: "" }));
    } else {
      navigate(-1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordCheck) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    if (!form.role) {
      return alert("사용자 유형을 선택해주세요.");
    }
    if (!form.agree) {
      return alert("약관에 동의해주세요.");
    }
    if (!form.username || !form.email || !form.password) {
      return alert("모든 필수 정보를 입력해주세요.");
    }
    // 근로자 전문분야 입력 제거: 해당 유효성 검사도 제거
    try {
      const requestBody = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role
      };
      await signup(requestBody);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패: " + (err.message || "서버 오류"));
    }
  };

  // 카드형 역할 선택 화면
  if (step === 1) {
    return (
      <div className="signup-container">
        <div className="signup-topbar">
          <button className="back-btn" onClick={handleBack}><FiChevronLeft size={24} /> 뒤로</button>
          <div className="signup-title-main">회원가입</div>
        </div>
        <hr className="signup-divider" />
        <div className="role-select-title">어떤 분이신가요?</div>
        <div className="role-select-desc">사용자 유형을 선택해주세요</div>
        <div className="role-card-list">
          <div
            className={`role-card worker${form.role === "worker" ? " selected" : ""}`}
            onClick={() => handleRoleSelect("worker")}
          >
            <div className="role-card-icon worker"><FaHardHat size={48} /></div>
            <div className="role-card-title">근로자</div>
            <div className="role-card-desc">건설 현장에서 일하고 싶어요</div>
            <ul className="role-card-feature-list">
              <li>일자리 검색 및 지원</li>
              <li>급여 자동 정산</li>
              <li>경력 관리</li>
            </ul>
          </div>
          <div
            className={`role-card employer${form.role === "employer" ? " selected" : ""}`}
            onClick={() => handleRoleSelect("employer")}
          >
            <div className="role-card-icon employer"><HiOutlineBuildingOffice2 size={48} /></div>
            <div className="role-card-title">고용주</div>
            <div className="role-card-desc">인력을 구하고 싶어요</div>
            <ul className="role-card-feature-list">
              <li>일자리 등록</li>
              <li>근로자 매칭</li>
              <li>급여 관리</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 유형별 회원가입 폼
  return (
    <div className={`signup-container ${form.role}`}> 
      <div className="signup-topbar">
        <button className="back-btn" onClick={handleBack}><FiChevronLeft size={24} /> 뒤로</button>
        <div className="signup-title-main">회원가입</div>
      </div>
      <hr className="signup-divider" />
      <div className="signup-form-header">
        <div className={`role-form-icon ${form.role}`}>{form.role === "worker" ? <FaHardHat size={56} /> : <HiOutlineBuildingOffice2 size={56} />}</div>
        <div className="form-title">{form.role === "worker" ? "근로자" : "고용주"}</div>
        {/* <div className="change-role" onClick={() => setStep(1)} style={{color:'#2563eb', cursor:'pointer', fontWeight:500, marginBottom:16}}>다른 유형 선택</div> */}
      </div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            name="username"
            placeholder="이름을 입력하세요"
            value={form.username}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <span className="input-icon"><MdEmail size={20} /></span>
          <input
            name="email"
            placeholder="이메일을 입력하세요"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="input-group">
          <span className="input-icon"><MdLock size={20} /></span>
          <input
            name="password"
            placeholder="비밀번호를 입력하세요"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <span className="pw-toggle" onClick={() => setShowPassword((v) => !v)} style={{cursor:'pointer'}}>{showPassword ? <BsEyeSlash size={18}/> : <BsEye size={18}/>}</span>
        </div>
        <div className="input-group">
          <span className="input-icon"><MdLock size={20} /></span>
          <input
            name="passwordCheck"
            placeholder="비밀번호를 다시 입력하세요"
            type={showPasswordCheck ? "text" : "password"}
            value={form.passwordCheck}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <span className="pw-toggle" onClick={() => setShowPasswordCheck((v) => !v)} style={{cursor:'pointer'}}>{showPasswordCheck ? <BsEyeSlash size={18}/> : <BsEye size={18}/>}</span>
        </div>
        {/* 근로자 전문분야 입력 제거 */}
        <label className="agree-label">
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          이용약관 및 개인정보처리방침에 동의합니다.
        </label>
        <button
          type="submit"
          className={`submit-btn ${form.role}`}
          disabled={!form.agree}
          style={{background: form.role === 'worker' ? '#2563eb' : '#e76a1e'}}
        >
          <span style={{marginRight:6}}>{form.role === 'worker' ? <FaHardHat size={18}/> : <HiOutlineBuildingOffice2 size={18}/>}</span> 회원가입 완료
        </button>
      </form>
    </div>
  );
}

export default UnifiedSignup;
