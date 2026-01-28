// src/pages/EditJob.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axiosAPI";
import { toast } from "react-toastify";

export default function EditJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [jobData, setJobData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    experience: "",
  });

  useEffect(() => {
    async function fetchJob() {
      try {
        const { data } = await API.get(`/jobs/${jobId}`);
        setJobData(data.data); // Adjust if API returns differently
      } catch (error) {
        toast.error("Failed to load job details");
      }
    }
    if (jobId) fetchJob();
  }, [jobId]);

  const handleChange = (e) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/jobs/${jobId}`, jobData);
      toast.success("Job updated successfully");
      navigate("/manage-jobs"); // Redirect back after update
    } catch (error) {
      toast.error("Failed to update job");
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Job</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={jobData.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="company"
          value={jobData.company}
          onChange={handleChange}
          placeholder="Company"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={jobData.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="type"
          value={jobData.type}
          onChange={handleChange}
          placeholder="Job Type (Full-time, Part-time, etc.)"
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="salary"
          value={jobData.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="border p-2 rounded"
        />
        <textarea
          name="description"
          value={jobData.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="border p-2 rounded"
          rows={5}
          required
        ></textarea>
        <input
          type="text"
          name="experience"
          value={jobData.experience}
          onChange={handleChange}
          placeholder="Experience required"
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
