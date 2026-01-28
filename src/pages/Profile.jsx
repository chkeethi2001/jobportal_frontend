// src/pages/Profile.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "../redux/slices/resumeSlice";
import ResumeUpload from "../components/ResumeUpload";
import ProfilePicMenu from "../components/ProfilePicMenu";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, resumeUrl, loading } = useSelector((state) => state.resume);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-20 text-lg">Loading profile...</p>;

  return (
    <div className="p-6 flex justify-center">
      {user ? (
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl overflow-hidden">
          {/* Banner */}
          <div className="bg-gradient-to-r from-gray-500 to-indigo-600 h-32 relative">
            <ProfilePicMenu user={user} dispatch={dispatch} fetchProfile={fetchProfile} />

          </div>

          {/* User Info */}
          <div className="pt-20 pb-8 px-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.firstname} {user.lastname}
            </h2>
            <p className="text-gray-500 mt-1">{user.email}</p>
            <p className="text-gray-400 mt-2">Role: <span className="capitalize">{user.role}</span></p>

            {/* Resume Section */}
            <div className="mt-4">
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200"
                >
                  View Resume
                </a>
              ) : (
                <p className="text-gray-500">No resume uploaded yet</p>
              )}
            </div>

            {/* Upload Section (Jobseekers only) */}
            {user.role === "jobseeker" && (
              <div className="mt-6">
                <ResumeUpload />
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-20">No user found</p>
      )}
    </div>
  );
};

export default Profile;
