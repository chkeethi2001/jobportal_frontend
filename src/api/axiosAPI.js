// src/api/axiosAPI.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
});


// Attach token automatically
API.interceptors.request.use((req) => {
  const storedData = localStorage.getItem("token"); 
  if (storedData) {
    const token = storedData;
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});



export const updateApplicationStatusAPI = (appId, status) =>
  API.patch(`/applications/${appId}/status`,{status});


// 🔹 Fetch all jobs 
export const fetchJobsAPI = (filters = {}) =>
  API.get("/jobs", { params: filters });



export default API;
