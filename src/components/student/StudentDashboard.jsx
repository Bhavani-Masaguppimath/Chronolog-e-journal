import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const [topics, setTopics] = useState([]);
  const username = localStorage.getItem("username");
  const studentId = localStorage.getItem("studentId");
  const classId = localStorage.getItem("classId");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/journal-topics/${classId}`)
      .then((res) => res.json())
      .then((data) => setTopics(data))
      .catch((err) => console.error("Error fetching topics", err));
  }, [classId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/student/login");
  };

  const handleViewFeedback = () => {
    navigate("/student/feedback-history");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg mb-4">
        <div className="card-body text-center">
          <h2 className="text-primary mb-3">🎓 Welcome, Student</h2>
          <p><strong>Username:</strong> {username}</p>
          <p><strong>Student ID:</strong> {studentId}</p>
          <p><strong>Class ID:</strong> {classId}</p>
          <div className="mt-3">
            <button className="btn btn-info me-3" onClick={handleViewFeedback}>
              📄 View Feedback History
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>
              🔓 Logout
            </button>
          </div>
        </div>
      </div>

      <h4 className="text-secondary mb-3">📝 Journal Topics</h4>
      {topics.length === 0 ? (
        <p>No journal topics available.</p>
      ) : (
        <div className="row">
          {topics.map((topic) => (
            <div className="col-md-6 mb-4" key={topic.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{topic.title}</h5>
                  <p><strong>Subject:</strong> {topic.subject_name}</p>
                  <p>{topic.description}</p>
                  {topic.file_path && (
                    <a
                      href={`http://localhost:5000/${topic.file_path}`}
                      className="btn btn-outline-primary btn-sm mb-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      📎 View Attachment
                    </a>
                  )}
                  <br />
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      localStorage.setItem("topicId", topic.id);
                      navigate("/student/upload-journal");
                    }}
                  >
                    ⬆️ Upload Journal
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
