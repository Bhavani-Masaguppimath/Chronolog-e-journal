import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateClass from "./components/admin/CreateClass";
import CreateStaff from "./components/admin/CreateStaff";
import CreateSubject from "./components/admin/CreateSubject";
import AssignClassSubject from "./components/admin/AssignClassSubject";
import CreateStudent from "./components/admin/CreateStudent";
import StaffLogin from "./components/staff/StaffLogin";
import StaffDashboard from "./components/staff/StaffDashboard";
import AddJournalTopic from "./components/staff/AddJournalTopic";
import ViewSubmissions from "./components/staff/ViewSubmissions";

import StudentLogin from "./components/student/StudentLogin";
import StudentDashboard from "./components/student/StudentDashboard";
import UploadJournal from "./components/student/UploadJournal";
import FeedbackHistory from "./components/student/FeedbackHistory";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/create-class" element={<CreateClass />} />
        <Route path="/admin/create-staff" element={<CreateStaff />} />
        <Route path="/admin/create-subject" element={<CreateSubject />} />
        <Route path="/admin/assign-class-subject" element={<AssignClassSubject />} />
        <Route path="/admin/create-student" element={<CreateStudent />} />

        {/* Other Routes */}
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/add-journal-topic" element={<AddJournalTopic />} />
        <Route path="/staff/view-submissions" element={<ViewSubmissions />} />


        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/upload-journal" element={<UploadJournal />} />
        <Route path="/student/feedback-history" element={<FeedbackHistory />} />
       
      </Routes>
    </Router>
  );
}

export default App;
