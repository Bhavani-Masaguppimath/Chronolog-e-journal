import React, { useEffect, useState } from "react";

const FeedbackHistory = () => {
  const studentId = localStorage.getItem("studentId");
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/student/journal-submissions/${studentId}`)
      .then((res) => res.json())
      .then((data) => setJournals(data))
      .catch((err) => console.error("Error fetching submissions", err));
  }, [studentId]);

  return (
    <div className="container mt-5">
      <h3 className="text-primary text-center mb-4">📚 Your Journal Submissions</h3>

      {journals.length === 0 ? (
        <p className="text-center">No submissions found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>Topic</th>
                <th>Description</th>
                <th>Submitted File</th>
                <th>Submitted At</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {journals.map((journal) => (
                <tr key={journal.id}>
                  <td>{journal.title}</td>
                  <td>{journal.content}</td>
                  <td>
                    <a
                      href={`http://localhost:5000/${journal.file_path}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm"
                    >
                      📎 View File
                    </a>
                  </td>
                  <td>{new Date(journal.submitted_at).toLocaleString()}</td>
                  <td>{journal.feedback || "⏳ Awaiting feedback"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="text-center mt-4">
        <a href="/student/dashboard" className="btn btn-secondary">⬅️ Back to Dashboard</a>
      </div>
    </div>
  );
};

export default FeedbackHistory;
