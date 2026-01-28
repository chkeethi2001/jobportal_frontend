// src/pages/admin/ManageUsers.jsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import API from "../../api/axiosAPI.js";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    password: "",
  });

  const loadUsers = async () => {
    try {
      const { data } = await API.get("/admin/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error loading users:", err);
      toast.error("Failed to load users");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      setUsers(users.filter((user) => user._id !== userId));
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Failed to delete user");
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
      password: "", // optional
    });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({
      firstname: "",
      lastname: "",
      email: "",
      role: "",
      password: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveUpdate = async (userId) => {
    try {
      const payload = {
        ...formData,
      };

      // If password is empty, don't include it
      if (!payload.password) {
        delete payload.password;
      }

      const { data } = await API.patch(`/admin/users/${userId}`, payload);
      toast.success("User updated successfully");

      setUsers((prevUsers) =>
        prevUsers.map((u) => (u._id === userId ? data.user : u))
      );

      handleCancelEdit();
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Manage Recruiters</h1>

      {users.length === 0 ? (
        <p className="text-gray-500 text-center text-lg">No users found</p>
      ) : (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => {
            const isEditing = editingUserId === user._id;
            const initials = `${user.firstname?.[0] || ""}${user.lastname?.[0] || ""}`.toUpperCase();
            const fullName = `${user.firstname} ${user.lastname}`;

            return (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Avatar + Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center uppercase shadow-sm text-lg">
                    {initials || "U"}
                  </div>

                  <div className="space-y-1">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          name="firstname"
                          value={formData.firstname}
                          onChange={handleInputChange}
                          className="block text-sm border px-2 py-1 rounded w-full"
                          placeholder="First Name"
                        />
                        <input
                          type="text"
                          name="lastname"
                          value={formData.lastname}
                          onChange={handleInputChange}
                          className="block text-sm border px-2 py-1 rounded w-full"
                          placeholder="Last Name"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block text-sm border px-2 py-1 rounded w-full"
                          placeholder="Email"
                        />
                        <input
                          type="text"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="block text-sm border px-2 py-1 rounded w-full"
                          placeholder="Role"
                        />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block text-sm border px-2 py-1 rounded w-full"
                          placeholder="New Password (optional)"
                        />
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-medium text-gray-800">{fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                        {user.createdAt && (
                          <p className="text-xs text-gray-400">
                            Registered on: {format(new Date(user.createdAt), "dd MMM yyyy, hh:mm a")}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => handleSaveUpdate(user._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded-md text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-md text-sm font-medium"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
