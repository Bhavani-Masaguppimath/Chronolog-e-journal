import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [feedbacks, setFeedbacks] = useState({});
  const staffId = localStorage.getItem("staffId");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/submitted-journals/${staffId}`)
      .then((res) => res.json())
      .then((data) => setSubmissions(data))
      .catch((err) => console.error(err));
  }, [staffId]);

  const handleFeedbackChange = (id, value) => {
    setFeedbacks({ ...feedbacks, [id]: value });
  };

  const handleFeedbackSubmit = async (submissionId) => {
    try {
      const res = await fetch("http://localhost:5000/give-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_id: submissionId,
          feedback: feedbacks[submissionId] || "",
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Feedback submitted!");
        window.location.reload();
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Submitted Journals</h3>
      {submissions.map((s) => (
        <div key={s.submission_id} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{s.topic_title}</h5>
            <p><strong>Student:</strong> {s.username}</p>
            <p><strong>Submitted At:</strong> {new Date(s.submitted_at).toLocaleString()}</p>
            <p><strong>Content:</strong> {s.content}</p>
            {s.file_path && (
              <a
                href={`http://localhost:5000/${s.file_path}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-primary mb-2"
              >
                Download File
              </a>
            )}

            <div className="mb-2">
              <label><strong>Feedback:</strong></label>
              <textarea
                className="form-control"
                rows="2"
                defaultValue={s.feedback}
                onChange={(e) => handleFeedbackChange(s.submission_id, e.target.value)}
              ></textarea>
            </div>
            <button
              className="btn btn-success"
              onClick={() => handleFeedbackSubmit(s.submission_id)}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      ))}
      <button className="btn btn-secondary" onClick={() => navigate("/staff/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ViewSubmissions;
