import React from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Create Class",
      description: "Add new class to the system.",
      route: "/admin/create-class",
    },
    {
      title: "Create Subject",
      description: "Add subjects for each class.",
      route: "/admin/create-subject",
    },
    {
      title: "Create Staff",
      description: "Register new teaching staff.",
      route: "/admin/create-staff",
    },
    {
      title: "Assign Class & Subject",
      description: "Assign staff to specific class and subject.",
      route: "/admin/assign-class-subject",
    },
    {
      title: "Create Student",
      description: "Register new student.",
      route: "/admin/create-student",
    },
  ];

  const handleLogout = () => {
    // If needed, you can clear any session or token here
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-center">Welcome, Admin!</h2>
        <button className="btn btn-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        {options.map((option, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <div className="card shadow-sm h-100">
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{option.title}</h5>
                <p className="card-text">{option.description}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={() => navigate(option.route)}
                >
                  Go to {option.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
