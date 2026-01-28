import React, { useEffect, useState } from "react";
import axios from "axios";
import UserCard from "../../components/UserCard";

const UsersListPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="p-6 space-y-4">
      {users.length ? (
        users.map((user) => (
          <UserCard key={user.id} user={user} resumeUrl={user.resumeUrl} />
        ))
      ) : (
        <p className="text-gray-500 text-center">No users found</p>
      )}
    </div>
  );
};

export default UsersListPage;
