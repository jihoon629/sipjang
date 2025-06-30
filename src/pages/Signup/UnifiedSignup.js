import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import "./Signup.css";

function UnifiedSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: "", // 'worker' or 'employer'
    username: "",
    email: "",
    password: "",
    passwordCheck: "",
    agree: false,
    company: "" // only for employer
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.passwordCheck) {
      return alert("비밀번호가 일치하지 않습니다.");
    }
    if (!form.role) {
      return alert("사용자 유형을 선택해주세요.");
    }
    try {
      const requestBody = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
        ...(form.role === "employer" && { company: form.company })
      };
      await signup(requestBody);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      alert("회원가입 실패: " + (err.message || "서버 오류"));
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      <div className="role-buttons">
        <button
          className={form.role === "worker" ? "selected" : ""}
          onClick={() => setForm({ ...form, role: "worker" })}
        >
          근로자
        </button>
        <button
          className={form.role === "employer" ? "selected" : ""}
          onClick={() => setForm({ ...form, role: "employer" })}
        >
          고용주
        </button>
      </div>

      <form className="signup-form" onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="이름"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="이메일"
          type="email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="비밀번호"
          type="password"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="passwordCheck"
          placeholder="비밀번호 확인"
          type="password"
          value={form.passwordCheck}
          onChange={handleChange}
        />


        <label>
          <input
            type="checkbox"
            name="agree"
            checked={form.agree}
            onChange={handleChange}
          />
          이용약관 및 개인정보처리방침에 동의합니다.
        </label>

        <button type="submit" disabled={!form.agree}>
          회원가입 완료
        </button>
      </form>
    </div>
  );
}

export default UnifiedSignup;
