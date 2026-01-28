
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Briefcase,
  IndianRupee,
  Pencil,
  Trash2,
  Save,
  X,
} from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function JobCard({ job, onDelete, onUpdate, status }) {
  const { role } = useSelector((state) => state.auth);
   const navigate = useNavigate();

  const isRecruiter = role === "recruiter";
  const isJobSeeker = role === "jobseeker";
  const isAdmin = role === "admin" || role === "superadmin";

  const [editMode, setEditMode] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const [editedJob, setEditedJob] = useState({
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    salary: job.salary,
    description: job.description,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(`/api/jobs/${job._id}`, editedJob, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEditMode(false);
      onUpdate?.(res.data);
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditedJob({
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
    });
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      onDelete?.(job._id);
    }
  };

  return (
    <div className="border rounded-2xl p-6 shadow-md bg-white hover:shadow-lg transition duration-300 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="w-full">
          {editMode ? (
            <>
              <input
                type="text"
                name="company"
                value={editedJob.company}
                onChange={handleChange}
                className="text-lg font-bold text-gray-900 border-b w-full mb-1"
              />
              <input
                type="text"
                name="title"
                value={editedJob.title}
                onChange={handleChange}
                className="text-xl font-semibold text-black-900 border-b w-full"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-bold text-gray-900">{job.company}</h3>
              <p className="text-xl font-semibold text-black-900">{job.title}</p>
            </>
          )}

          {/* Location, Type, Salary */}
          <div className="flex gap-3 mt-2 text-sm text-gray-600 flex-wrap">
            {editMode ? (
              <>
                <input
                  type="text"
                  name="location"
                  value={editedJob.location}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Location"
                />
                <input
                  type="text"
                  name="type"
                  value={editedJob.type}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Job Type"
                />
                <input
                  type="text"
                  name="salary"
                  value={editedJob.salary}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 text-sm"
                  placeholder="Salary"
                />
              </>
            ) : (
              <>
                {job?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" /> {job.location}
                  </span>
                )}
                {job?.type && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" /> {job.type}
                  </span>
                )}
                {job?.salary && (
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" /> {job.salary}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Bookmark (Jobseeker only) */}
        {isJobSeeker && (
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="text-gray-500 hover:text-yellow-500 transition"
          >
            {bookmarked ? (
              <BookmarkCheck className="w-6 h-6" />
            ) : (
              <Bookmark className="w-6 h-6" />
            )}
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mt-4">
        {editMode ? (
          <textarea
            name="description"
            value={editedJob.description}
            onChange={handleChange}
            className="w-full border p-2 rounded text-sm"
            rows="3"
          />
        ) : (
          <p className="text-gray-700 text-sm leading-relaxed">
            {job.description?.slice(0, 150)}...
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-3">
        {/* Jobseeker - Apply Button or Status */}
        {isJobSeeker && !editMode && (
         status ? (
  <span
    className={`flex-1 text-center py-2 rounded-xl font-medium
      ${
        status === "Accepted"
          ? "bg-green-100 text-green-700"
          : status === "Rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
  >
    {status}
  </span>
) : (
  <button
  onClick={() => navigate(`/apply/${job._id}`)}
  className="flex-1 bg-blue-900 text-white py-2 rounded-xl hover:bg-blue-800 transition font-medium"
>
  Apply Now
</button>

)
        )}

        {/* Recruiter - Edit / Save / Delete */}
        {isRecruiter &&
          (editMode ? (
            <>
              <button
                onClick={handleSave}
                className="flex-1 bg-green-700 text-white py-2 rounded-xl hover:bg-green-600 transition font-medium flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-500 text-white py-2 rounded-xl hover:bg-gray-400 transition font-medium flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditMode(true)}
                className="flex-1 bg-yellow-600 text-white py-2 rounded-xl hover:bg-yellow-500 transition font-medium flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-700 text-white py-2 rounded-xl hover:bg-red-600 transition font-medium flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          ))}
      </div>
    </div>
  );
}
