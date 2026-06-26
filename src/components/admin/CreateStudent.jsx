import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateStudent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const res = await fetch("http://localhost:5000/create-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, classId }),
    });

    const data = await res.json();
    if (data.success) {
      setMessage("Student created successfully.");
      setUsername("");
      setPassword("");
      setClassId("");
    } else {
      setMessage("Failed to create student.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Create Student</h3>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Select Class</label>
          <select
            className="form-select"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">-- Select Class --</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary w-100 mb-3">Create</button>

        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => navigate("/admin/dashboard")}
        >
          Back to Dashboard
        </button>
      </form>
    </div>
  );
};

export default CreateStudent;
