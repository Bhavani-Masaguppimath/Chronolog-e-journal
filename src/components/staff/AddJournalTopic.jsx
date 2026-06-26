import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AddJournalTopic = () => {
  const [assignments, setAssignments] = useState([]);
  const [formData, setFormData] = useState({
    staff_assignment_id: "",
    title: "",
    description: "",
    file: null,
  });
  const navigate = useNavigate();

  const staffId = localStorage.getItem("staffId");

  useEffect(() => {
    fetch(`http://localhost:5000/staff-assignments/${staffId}`)
      .then((res) => res.json())
      .then((data) => setAssignments(data))
      .catch((err) => console.error("Failed to fetch assignments", err));
  }, [staffId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const topicData = new FormData();
    topicData.append("staff_assignment_id", formData.staff_assignment_id);
    topicData.append("title", formData.title);
    topicData.append("description", formData.description);
    topicData.append("file", formData.file);

    try {
      const response = await fetch("http://localhost:5000/add-journal-topic", {
        method: "POST",
        body: topicData,
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Journal topic added successfully!");
        navigate("/staff/dashboard");
      } else {
        alert("Failed to add journal topic.");
      }
    } catch (err) {
      console.error("Error submitting form", err);
      alert("An error occurred while submitting the form.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Add Journal Topic</h3>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Select Class & Subject</label>
          <select
            name="staff_assignment_id"
            className="form-select"
            required
            value={formData.staff_assignment_id}
            onChange={handleChange}
          >
            <option value="">--Select--</option>
            {assignments.map((a) => (
              <option key={a.id} value={a.id}>
                {a.class_name} - {a.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Topic Title</label>
          <input
            type="text"
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Upload File</label>
          <input
            type="file"
            name="file"
            className="form-control"
            onChange={handleFileChange}
          />
        </div>

        <button className="btn btn-success">Submit</button>
        <button
          className="btn btn-secondary ms-2"
          type="button"
          onClick={() => navigate("/staff/dashboard")}
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default AddJournalTopic;
