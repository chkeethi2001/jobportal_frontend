import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Layout
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Service from "./pages/Service";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Protected & Role-Based Routes
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Job-related Pages
import JobListPage from "./pages/JobListPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ApplyPage from "./pages/ApplyPage";
import JobFormPage from "./pages/JobFormPage";
import EditJob from "./pages/Edit job.jsx";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import ApplicantsListPage from "./pages/ApplicantsListPage";
import ManageApplications from "./components/ManageApplication";

// Admin Pages
import ManageUsers from "./pages/admin/ManageUsers";
import UsersListPage from "./pages/admin/UsersListPage";
import CreateAdminPage from "./pages/CreateAdminPage";
import CreateRecruiterPage from "./pages/CreateRecruiterPage";

// Superadmin/Admin Shared Pages
import Dashboard from "./pages/Dashboard";

// Profile
import Profile from "./pages/Profile";

// Fallback Pages (Optional: You can extract them into separate components)
const NotFound = () => <div className="text-center py-10 text-2xl">404 - Page Not Found</div>;
const Unauthorized = () => <div className="text-center py-10 text-xl text-red-600">Access Denied</div>;

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/services" element={<Service />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/apply/:jobId" element={<ApplyPage />} />

          {/* Superadmin Routes */}
          <Route
            path="/create-admin"
            element={
              <RoleBasedRoute allowedRoles={["superadmin"]}>
                <CreateAdminPage />
              </RoleBasedRoute>
            }
          />

          {/* Jobseeker Routes */}
          <Route
            path="/my-applications"
            element={
              <RoleBasedRoute allowedRoles={["jobseeker"]}>
                <MyApplicationsPage />
              </RoleBasedRoute>
            }
          />

          {/* Recruiter/Admin Shared Routes */}
          <Route
            path="/jobs/create"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <JobFormPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/jobs/edit/:id"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <JobFormPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/edit-job/:jobId"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <EditJob />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/applicants"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <ApplicantsListPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/applications"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <ManageApplications />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RoleBasedRoute allowedRoles={["recruiter", "admin"]}>
                <Dashboard />
              </RoleBasedRoute>
            }
          />

          {/* Admin-only Routes */}
          <Route
            path="/manage-users"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <UsersListPage />
              </RoleBasedRoute>
            }
          />
          <Route
            path="/create-recruiter"
            element={
              <RoleBasedRoute allowedRoles={["admin"]}>
                <CreateRecruiterPage />
              </RoleBasedRoute>
            }
          />

          {/* Authenticated (Any Role) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Fallback Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
