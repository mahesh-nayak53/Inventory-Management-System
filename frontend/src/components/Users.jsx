import axios from "axios";
import React, { useEffect, useState } from "react";

const Users = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "",
  });

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/users/add", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        alert("User added successfully");
        setFormData({
          name: "",
          email: "",
          password: "",
          address: "",
          role: "",
        });
        fetchUsers();
      } else {
        alert("Error adding user. Please try again");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user. Please try again");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete user?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        });
        if (response.data.success) {
          alert("User deleted successfully");
          fetchUsers();
        } else {
          alert("Error deleting user. Please try again");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Error deleting user. Please try again");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(query)));
  };

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Users Management
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Form Section */}
        <div className="lg:w-1/3 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">Add User</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="customer">Customer</option>
            </select>
            <button
              type="submit"
              className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500"
            >
              Add User
            </button>
          </form>
        </div>

        {/* Table Section */}
        <div className="lg:w-2/3">
          <input
            type="text"
            placeholder="Search user by name..."
            onChange={handleSearch}
            className="p-2 w-full mb-2 rounded shadow border"
          />
          <div className="bg-white rounded-xl shadow-lg p-4">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="w-full border-collapse border border-gray-200 text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border p-2">SL.No</th>
                    <th className="border p-2">Name</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Role</th>
                    <th className="border p-2">Address</th>
                    <th className="border p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="border p-2">{index + 1}</td>
                      <td className="border p-2">{user.name}</td>
                      <td className="border p-2">{user.email}</td>
                      <td className="border p-2">{user.role}</td>
                      <td className="border p-2">{user.address}</td>
                      <td className="border p-2">
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          onClick={() => handleDelete(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="py-4 text-gray-400">
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
