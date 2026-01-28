// src/pages/JobFormPage.jsx

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axiosAPI";
import { toast } from "react-toastify";

export default function JobFormPage() {
  const { jobId } = useParams(); // If jobId exists, it's edit mode
  const isEdit = Boolean(jobId);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    type: "full-time",
    salary: "",
    experience: "", // ✅ added
    description: "",
  });

  useEffect(() => {
    if (isEdit) {
      // Fetch job details if editing
      async function fetchJob() {
        try {
          const { data } = await API.get(`/jobs/${jobId}`);
          setForm({
            title: data.data.title || "",
            company: data.data.company || "",
            location: data.data.location || "",
            type: data.data.type || "full-time",
            salary: data.data.salary || "",
            experience: data.data.experience || "", // ✅ added
            description: data.data.description || "",
          });
        } catch (error) {
          toast.error("Failed to load job details");
        }
      }
      fetchJob();
    }
  }, [isEdit, jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await API.put(`/jobs/${jobId}`, form);
        toast.success("Job updated successfully");
      } else {
        await API.post("/jobs", form);
        toast.success("Job created successfully");
      }
      navigate("/manage-jobs"); // Redirect to manage jobs page after submit
    } catch (error) {
      toast.error("Failed to submit job form");
      console.error("Job submit error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Job" : "Create Job"}</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="company"
          value={form.company}
          onChange={handleChange}
          placeholder="Company"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-2 rounded"
          required
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="remote">Remote</option>
          <option value="contract">Contract</option>
        </select>
        <input
          type="number"
          name="salary"
          value={form.salary}
          onChange={handleChange}
          placeholder="Salary"
          className="border p-2 rounded"
          min="0"
        />
        {/* ✅ Added Experience Field */}
        <input
          type="number"
          name="experience"
          value={form.experience}
          onChange={handleChange}
          placeholder="Experience (in years)"
          className="border p-2 rounded"
          min="0"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Job Description"
          className="border p-2 rounded"
          rows={5}
          required
        ></textarea>

        <button
          type="submit"
          className="bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          {isEdit ? "Save Changes" : "Create Job"}
        </button>
      </form>
    </div>
  );
}
