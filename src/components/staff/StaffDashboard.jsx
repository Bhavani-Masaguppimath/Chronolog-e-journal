import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [staffId, setStaffId] = useState("");

  useEffect(() => {
    const storedId = localStorage.getItem("staffId");
    const storedUsername = localStorage.getItem("staffUsername");

    if (!storedId || !storedUsername) {
      navigate("/staff/login");
    } else {
      setStaffId(storedId);
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("staffId");
    localStorage.removeItem("staffUsername");
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome, {username}</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <h5 className="text-muted">Your ID: {staffId}</h5>
      <p>You can now create journal topics and assignments for your assigned classes.</p>

      <div className="mt-4">
  <div className="card">
    <div className="card-body">
      <h5 className="card-title">Add Journal Topic</h5>
      <p className="card-text">Create journal topics and upload related files for assigned class and subject.</p>
      <button className="btn btn-primary" onClick={() => navigate("/staff/add-journal-topic")}>
        Go to Add Journal Topic
      </button>
      <Link to="/staff/view-submissions" className="btn btn-outline-info mt-3">
  View Submitted Journals & Give Feedback
</Link>
    </div>
  </div>
</div>

    </div>

    
  );
};

export default StaffDashboard;
