import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadJournal = () => {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const topicId = localStorage.getItem("topicId");
  const studentId = localStorage.getItem("studentId");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !file) {
      alert("Please enter some content or select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("topic_id", topicId);
    formData.append("student_id", studentId);
    formData.append("content", content);
    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await fetch("http://localhost:5000/upload-journal", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("Journal submitted successfully!");
        navigate("/student/dashboard");
      } else {
        alert("Failed to submit journal.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Upload Journal</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Your Content</label>
          <textarea
            className="form-control"
            rows="5"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload File (optional)</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Journal
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/student/dashboard")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default UploadJournal;
