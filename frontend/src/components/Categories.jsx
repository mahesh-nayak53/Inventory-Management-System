import axios from "axios";
import React, { useEffect, useState } from "react";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCatgories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);
  const [filteredCategories, setFilteredCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setCatgories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editCategory) {
      const response = await axios.put(
        `http://localhost:3000/api/category/${editCategory}`,
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );
      if (response.data.success) {
        setEditCategory(null);
        setCategoryName("");
        setCategoryDescription("");
        alert("Category Updated successfully");
        fetchCategories();
      } else {
        alert("Error editing category. Please try again");
      }
    } else {
      const response = await axios.post(
        "http://localhost:3000/api/category/add",
        { categoryName, categoryDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        setCategoryName("");
        setCategoryDescription("");
        alert("Category added successfully");
        fetchCategories();
      } else {
        alert("Error adding category. Please try again");
      }
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `http://localhost:3000/api/category/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Category deleted successfully");
          fetchCategories();
        } else {
          alert("Error deleting category. Please try again");
        }
      } catch (error) {
        alert("Error deleting category. Please try again");
      }
    }
  };

  const handleEdit = async (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();

    if (!query) {
      setFilteredCategories([]);
      return;
    }

    const filtered = categories.filter((category) =>
      category.categoryName.toLowerCase().includes(query)
    );

    setFilteredCategories(filtered);
  };

  const handleCancel = async () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  if (loading) return <div className="p-6 text-lg">Loading...</div>;

  return (
    <div className="px-6 py-4 w-full">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Category Management
      </h1>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="border p-2 bg-gray-100 rounded shadow-sm w-full max-w-xs"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-6">
        {/* Form */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-center mb-4">
              {editCategory ? "Edit Category" : "Add Category"}
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Category Description"
                value={categoryDescription}
                onChange={(e) => setCategoryDescription(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500 transition"
                >
                  {editCategory ? "Save Changes" : "Add Category"}
                </button>
                {editCategory && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <table className="w-full text-center border border-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border  py-2 px-4">SL. No</th>
                  <th className="border  py-2 px-4">
                    Category Name
                  </th>
                  <th className="border  py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {(filteredCategories.length > 0
                  ? filteredCategories
                  : categories
                ).map((category, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border py-2 px-4">
                      {index + 1}
                    </td>
                    <td className="border  py-2 px-4">
                      {category.categoryName}
                    </td>
                    <td className="border  py-2 px-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(category)}
                          className="bg-yellow-300 text-white px-4 py-1 rounded hover:bg-yellow-400"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(category._id)}
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-gray-400">
                      No categories available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
