import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [edit, setEdit] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        const { name, email, address } = response.data.user;
        setUser((prev) => ({ ...prev, name, email, address }));
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      alert("Error fetching user profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: user.name,
        email: user.email,
        address: user.address,
      };
      if (user.password) payload.password = user.password;

      const response = await axios.put("http://localhost:3000/api/users/profile", payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert("Profile updated successfully");
        setEdit(false);
        fetchUser();
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  const handleCancel = () => {
    fetchUser();
    setEdit(false);
    setUser((prev) => ({ ...prev, password: "" }));
  };

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Profile Settings
      </h1>

      <div className="mt-6 w-full max-w-[500px] bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6">User Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              disabled={!edit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              disabled={!edit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={user.address}
              onChange={(e) => setUser({ ...user, address: e.target.value })}
              disabled={!edit}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {edit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {!edit ? (
            <button
              type="button"
              onClick={() => setEdit(true)}
              className="bg-yellow-400 text-white font-semibold px-6 py-2 rounded-md hover:bg-yellow-500 transition"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-orange-400 text-white font-semibold px-6 py-2 rounded-md hover:bg-orange-500 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-red-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-red-600 transition"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
