import React, { useState } from "react";
import { useSelector } from "react-redux";
import { User, Mail, Lock } from "lucide-react";
import API from "../api/axiosAPI";

export default function CreateAdminPage() {
  const { role, token } = useSelector((state) => state.auth); 
  const normalizedRole = role?.toLowerCase();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post(
        "/admin/create-admin",
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );

      alert(res.data.message);
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating admin");
    }
  };

  if (normalizedRole !== "superadmin") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-200 via-red-300 to-red-400">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Denied</h2>
          <p className="text-gray-600">
            Only <span className="font-semibold">Super Admins</span> can create
            admins.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-blue-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 transform transition duration-500 hover:scale-[1.02]"
      >
        <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-6">
          Create New Admin
        </h2>

        {/* First Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Last Name */}
        <div className="relative mb-4">
          <User className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Password */}
        <div className="relative mb-6">
          <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
          <input
            type="password"
            placeholder="Temporary Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-300"
        >
          Create Admin
        </button>
      </form>
    </div>
  );
}
