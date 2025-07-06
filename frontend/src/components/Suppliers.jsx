import React, { useEffect, useState } from "react";
import axios from "axios";

const Suppliers = () => {
  const [addModal, setAddModal] = useState(false);
  const [editSupplier, setEditSupplier] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    number: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/supplier", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setSuppliers(response.data.suppliers);
      setFilteredSuppliers(response.data.suppliers);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase().trim();
    setFilteredSuppliers(
      suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(query)
      )
    );
  };

  const handleEdit = (supplier) => {
    setEditSupplier(supplier._id);
    setFormData({
      name: supplier.name,
      email: supplier.email,
      number: supplier.number,
      address: supplier.address,
    });
    setAddModal(true);
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this supplier?");
    if (confirm) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/supplier/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Supplier deleted successfully");
          fetchSuppliers();
        } else {
          alert("Error deleting supplier");
        }
      } catch (err) {
        alert("Error deleting supplier. Please try again.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editSupplier
      ? `http://localhost:3000/api/supplier/${editSupplier}`
      : "http://localhost:3000/api/supplier/add";
    const method = editSupplier ? axios.put : axios.post;

    try {
      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert(`Supplier ${editSupplier ? "updated" : "added"} successfully`);
        closeModal();
        fetchSuppliers();
      } else {
        alert("Failed to save supplier");
      }
    } catch (error) {
      alert("Something went wrong. Try again.");
    }
  };

  const closeModal = () => {
    setAddModal(false);
    setEditSupplier(null);
    setFormData({
      name: "",
      email: "",
      number: "",
      address: "",
    });
  };

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Supplier Management
      </h1>

      <div className="mt-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="border p-2 bg-gray-100 rounded shadow-sm w-full max-w-xs"
        />
        <button
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded ml-4"
          onClick={() => setAddModal(true)}
        >
          Add Supplier
        </button>
      </div>

      {loading ? (
        <div className="text-lg mt-6">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <table className="w-full text-center border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="border py-2 px-4">SL. No</th>
                <th className="border py-2 px-4">Name</th>
                <th className="border py-2 px-4">Email</th>
                <th className="border py-2 px-4">Phone</th>
                <th className="border py-2 px-4">Address</th>
                <th className="border py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.map((supplier, index) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="border py-2 px-4">{index + 1}</td>
                  <td className="border py-2 px-4">{supplier.name}</td>
                  <td className="border py-2 px-4">{supplier.email}</td>
                  <td className="border py-2 px-4">{supplier.number}</td>
                  <td className="border py-2 px-4">{supplier.address}</td>
                  <td className="border py-2 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(supplier)}
                        className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(supplier._id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-400">
                    No suppliers available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {addModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-2xl shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">
              {editSupplier ? "Edit Supplier" : "Add Supplier"}
            </h1>
            <button
              className="absolute top-4 right-4 text-2xl font-bold text-red-500 hover:text-red-600"
              onClick={closeModal}
            >
              ×
            </button>
            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="border p-2 rounded"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="border p-2 rounded"
              />

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500"
                >
                  {editSupplier ? "Save Changes" : "Add Supplier"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Suppliers;
