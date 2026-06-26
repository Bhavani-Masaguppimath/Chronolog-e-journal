import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const cardData = [
    {
      title: "Admin Login",
      description: "Manage classes, subjects, and staff assignments.",
      image: "/images/admin.png",
      onClick: () => navigate("/admin/login"),
    },
    {
      title: "Staff Login",
      description: "Give journal topics and check student submissions.",
      image: "/images/staff.png",
      onClick: () => navigate("/staff/login"),
    },
    {
      title: "Student Login",
      description: "View journal topics and upload your assignments.",
      image: "/images/student.png",
      onClick: () => navigate("/student/login"),
    },
  ];

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Welcome to Journal Management System</h2>
      <div className="row justify-content-center">
        {cardData.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={card.image}
                className="card-img-top"
                alt={card.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title text-center">{card.title}</h5>
                <p className="card-text text-center">{card.description}</p>
                <button
                  className="btn btn-primary mt-auto"
                  onClick={card.onClick}
                >
                  Go to {card.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
