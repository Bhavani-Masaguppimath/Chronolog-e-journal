import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AssignClassSubject = () => {
  const [staffList, setStaffList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  const [staffId, setStaffId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, classRes, subjectRes] = await Promise.all([
        fetch("http://localhost:5000/staffs"),
        fetch("http://localhost:5000/classes"),
        fetch("http://localhost:5000/subjects"),
      ]);

      const staffData = await staffRes.json();
      const classData = await classRes.json();
      const subjectData = await subjectRes.json();

      setStaffList(staffData);
      setClassList(classData);
      setSubjectList(subjectData);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/assign-class-subject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId, classId, subjectId }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Class and subject assigned to staff successfully!");
        setStaffId("");
        setClassId("");
        setSubjectId("");
      } else {
        setMessage("Assignment failed.");
      }
    } catch (err) {
      console.error("Submit error", err);
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3 className="text-center mb-4">Assign Class and Subject to Staff</h3>

      {message && (
        <div className="alert alert-info text-center">{message}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Select Staff</label>
          <select
            className="form-select"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            required
          >
            <option value="">-- Choose Staff --</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.username}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select Class</label>
          <select
            className="form-select"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            required
          >
            <option value="">-- Choose Class --</option>
            {classList.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Select Subject</label>
          <select
            className="form-select"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            required
          >
            <option value="">-- Choose Subject --</option>
            {subjectList.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-3">
          Assign
        </button>

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

export default AssignClassSubject;
