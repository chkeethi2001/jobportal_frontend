// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addUser } from "../redux/slices/authSlice.js";
import axios from "axios";
import { loginAPI } from "../API's.js";
import { changePasswordAPI } from "../api/authAPI.js";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordChangeMessage, setPasswordChangeMessage] = useState("");
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((s) => s.auth);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login request payload:", form);

    try {
      // Use your loginAPI function that returns data
      const response = await axios.post(loginAPI, form);
      if (response.status === 200) {
        dispatch(addUser(response.data));
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.role);

        if (
          response.data.role === "superadmin" &&
          response.data.mustChangePassword
        ) {
          // Show popup modal for changing password
          setShowChangePasswordModal(true);
        } else {
          // Normal redirect flow
          if (response.data.role === "superadmin") {
            navigate("/dashboard");
          } else if (response.data.role === "admin") {
            navigate("/manage-users");
          } else {
            navigate("/");
          }
        }
      }
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setPasswordChangeLoading(true);
    setPasswordChangeMessage("");

    try {
      const token = localStorage.getItem("token");
      const response = await changePasswordAPI(
        { oldPassword, newPassword },
        token
      );

      if (response.success) {
        setPasswordChangeMessage(
          "Password changed successfully! Redirecting..."
        );
        setTimeout(() => {
          setShowChangePasswordModal(false);
          navigate("/dashboard");
        }, 1500);
      } else {
        setPasswordChangeMessage(
          response.message || "Failed to change password."
        );
      }
    } catch (error) {
      setPasswordChangeMessage(error.message || "Server error");
    } finally {
      setPasswordChangeLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white py-3 rounded hover:bg-blue-600 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          If not registered?{" "}
          <Link to="/register" className="text-blue-900 hover:underline">
            Register here
          </Link>
        </p>
      </div>

      {/* Modal for Change Password */}
      {showChangePasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Change Password
            </h3>
            <form
              onSubmit={handlePasswordChangeSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={passwordChangeLoading}
                className="bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
              >
                {passwordChangeLoading ? "Updating..." : "Update Password"}
              </button>
            </form>
            {passwordChangeMessage && (
              <p className="mt-4 text-center text-red-600">
                {passwordChangeMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
