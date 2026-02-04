import API from "./axiosAPI";
import axios from "axios";

const API_URL = "https://jobportal-backend-13-qev7.onrender.com/api"; // adjust to your backend URL

// Upload resume
export const uploadResumeAPI = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/resume/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // expects { message, resumeUrl }
};

// ✅ Upload profile picture
export const uploadProfilePicAPI = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(`${API_URL}/user/upload-profile-pic`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data; // expects { message, profilePicId }
};
