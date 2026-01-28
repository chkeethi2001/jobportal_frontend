// src/components/UserCard.jsx
import React from "react";

const UserCard = ({ user, resumeUrl }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 hover:shadow-2xl transition-shadow duration-300">
      
      {/* Profile Picture */}
      <img
        src={user.profilePicId ? `/api/user/profile-pic/${user.profilePicId}` : "/default-avatar.png"}
        alt="Profile"
        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-md"
      />

      {/* User Info */}
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800">
          {user.firstname} {user.lastname}
        </h3>
        <p className="text-gray-500 mt-1"><b>Email:</b> {user.email}</p>
        <p className="text-gray-500 mt-1"><b>Role:</b> <span className="capitalize">{user.role}</span></p>
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-1 rounded-lg shadow-sm transition-colors duration-200"
          >
            View Resume
          </a>
        ) : (
          <p className="text-gray-400 mt-2">No resume uploaded</p>
        )}
      </div>

      {/* Optional action buttons */}
      {/* Example: message, view profile */}
      <div className="flex flex-col space-y-2">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg transition-colors duration-200">
          Message
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg transition-colors duration-200">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default UserCard;
