// src/pages/ManageJobs.jsx
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import API from "../api/axiosAPI";
import JobCard from "../components/JobCard";
import ManageApplications from "../components/ManageApplication";

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const [editingJobId, setEditingJobId] = useState(null);
  const [editingJobData, setEditingJobData] = useState({});

  const loadJobs = async () => {
    try {
      const { data } = await API.get("/jobs");
      setJobs(data.data || []);
    } catch (err) {
      console.error("Error loading jobs:", err);
      toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleDelete = async (jobId) => {
    console.log("Deleting job:", jobId);
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await API.delete(`/jobs/${jobId}`);
      console.log("Delete response:", res);
      toast.success("Job deleted");
      setJobs((prev) => prev.filter((job) => job._id !== jobId));
      if (selectedJob === jobId) setSelectedJob(null);
      if (editingJobId === jobId) {
        setEditingJobId(null);
        setEditingJobData({});
      }
    } catch (err) {
      console.error("Error deleting job (ManageJobs):", err.response || err);
      toast.error("Failed to delete job");
    }
  };

  const handleEditClick = (job) => {
    console.log("Editing job:", job._id);
    setEditingJobId(job._id);
    setEditingJobData({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingJobData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    console.log("Saving job:", editingJobId, editingJobData);
    try {
      const res = await API.put(`/jobs/${editingJobId}`, editingJobData);
      console.log("Save response:", res);
      toast.success("Job updated successfully");
      const updatedJob = res.data;
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === editingJobId ? updatedJob : job))
      );
      setEditingJobId(null);
      setEditingJobData({});
    } catch (err) {
      console.error("Error updating job (ManageJobs):", err.response || err);
      toast.error("Failed to update job");
    }
  };

  const handleCancelEdit = () => {
    console.log("Cancel editing");
    setEditingJobId(null);
    setEditingJobData({});
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Jobs</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Jobs List</h2>
          <div className="space-y-4">
            {jobs.length === 0 && <p className="text-gray-500">No jobs available</p>}
            {jobs.map((job) => {
              const isEditing = editingJobId === job._id;
              const formData = isEditing
                ? editingJobData
                : {
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    type: job.type,
                    salary: job.salary,
                    description: job.description,
                  };

              return (
                <div key={job._id} className="cursor-pointer">
                  <JobCard
                    job={job}
                    isEditing={isEditing}
                    formData={formData}
                    onInputChange={handleInputChange}
                    onSave={handleSave}
                    onCancelEdit={handleCancelEdit}
                    onEditClick={() => handleEditClick(job)}
                    onDelete={() => handleDelete(job._id)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {selectedJob ? (
            <ManageApplications jobId={selectedJob} />
          ) : (
            <p className="text-gray-500">Select a job to view applications</p>
          )}
        </div>
      </div>
    </div>
  );
}
