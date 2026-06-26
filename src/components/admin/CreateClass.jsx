import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateClass = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/add-class", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Class added successfully!");
        setName("");
      } else {
        setMessage("Failed to add class.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("Server error while adding class.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "500px" }}>
      <h3 className="text-center mb-4">Create Class</h3>

      {message && (
        <div className="alert alert-info text-center" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Class Name</label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter class name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 mb-3">
          Save Class
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

export default CreateClass;
