import React, { useRef, useState } from "react";
import axios from "axios";

const ProfilePicMenu = ({ user, dispatch, fetchProfile }) => {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      setUploading(true);
      const token = localStorage.getItem("token");
      await axios.post("/api/users/profile/pic", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchProfile());
      setPreview(""); // reset preview after successful upload
    } catch (err) {
      console.error(err);
      alert("Failed to upload profile picture");
    } finally {
      setUploading(false);
      setOpen(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("/api/user/profile/pic", {
        headers: { Authorization: `Bearer ${token}` },
      });
      dispatch(fetchProfile());
      setPreview(""); // reset preview after delete
      setOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete profile picture");
    }
  };

  return (
    <div className="relative">
      <img
        src={
          preview ||
          (user._id
            ? `/api/user/${user._id}/profile-pic`
            : "/default-avatar.png")
        }
        alt="Profile"
        className={`w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg cursor-pointer ${
          uploading ? "opacity-50" : ""
        }`}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <div className="absolute top-0 left-0 mt-32 bg-white shadow-lg rounded-lg w-40 z-10">
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => fileInputRef.current.click()}
            disabled={uploading}
          >
            Upload / Replace
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
            onClick={handleDelete}
            disabled={uploading}
          >
            Delete
          </button>
          <button
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

export default ProfilePicMenu;
