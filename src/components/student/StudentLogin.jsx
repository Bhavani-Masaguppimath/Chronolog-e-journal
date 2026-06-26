import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentLogin = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/studentlogin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success && data.user.role === "student") {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("username", data.user.username);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("studentId", data.user.studentId);
        localStorage.setItem("classId", data.user.classId);
        navigate("/student/dashboard");
      } else {
        alert("Invalid credentials or not a student.");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    }
  };

  return (
    <div className="container mt-5">
      <h3>Student Login</h3>
      <form onSubmit={handleSubmit} className="card p-4 shadow">
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-primary">Login</button>
      </form>
    </div>
  );
};

export default StudentLogin;
