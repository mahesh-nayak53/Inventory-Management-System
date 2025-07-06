import React, { useEffect, useState } from "react";
import axios from "axios";

const Produts = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    supplierId: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        setSuppliers(response.data.suppliers);
        setCategories(response.data.categories);
        setProducts(response.data.products);
        setFilteredProduct(response.data.products);
      } else {
        alert("Error fetching products. Please try again");
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId._id,
      supplierId: product.supplierId._id,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3000/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        });
        if (response.data.success) {
          alert("Product deleted successfully");
          fetchProducts();
        } else {
          alert("Error deleting product. Please try again");
        }
      } catch (error) {
        alert("Error deleting product. Please try again");
      }
    }
  };

  const closeModel = () => {
    setOpenModal(false);
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      categoryId: "",
      supplierId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editProduct
        ? `http://localhost:3000/api/products/${editProduct}`
        : "http://localhost:3000/api/products/add";

      const method = editProduct ? axios.put : axios.post;

      const response = await method(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert(editProduct ? "Product updated successfully" : "Product added successfully");
        fetchProducts();
        closeModel();
      } else {
        alert("Error saving product. Please try again");
      }
    } catch (error) {
      alert("Error saving product. Please try again");
    }
  };

  const handleSearch = (e) => {
    setFilteredProduct(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div className="px-6 py-4 w-full">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Product Management
      </h1>

      <div className="flex justify-between items-center mt-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="border p-2 bg-gray-100 rounded shadow-sm w-full max-w-xs"
        />
        <button
          className="px-4 py-2 bg-orange-400 hover:bg-orange-500 text-white rounded ml-4"
          onClick={() => setOpenModal(true)}
        >
          Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <table className="w-full text-center border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="border  py-2 px-4">SL.No</th>
              <th className="border  py-2 px-4">Product</th>
              <th className="border  py-2 px-4">Category</th>
              <th className="border  py-2 px-4">Supplier</th>
              <th className="border  py-2 px-4">Price</th>
              <th className="border  py-2 px-4">Stock</th>
              <th className="border  py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border  py-2 px-4">{index + 1}</td>
                <td className="border  py-2 px-4">{product.name}</td>
                <td className="border  py-2 px-4">{product.categoryId.categoryName}</td>
                <td className="border  py-2 px-4">{product.supplierId.name}</td>
                <td className="border  py-2 px-4">₹{product.price}</td>
                <td className="border  py-2 px-4">
                  <span className={
                    product.stock === 0
                      ? "text-red-500"
                      : product.stock < 5
                      ? "text-yellow-500"
                      : "text-green-500"
                  }>
                    {product.stock}
                  </span>
                </td>
                <td className="border  py-2 px-4">
                  <div className="flex justify-center gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProduct.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-400">
                  No products available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">
              {editProduct ? "Edit Product" : "Add Product"}
            </h2>
            <button
              className="absolute top-3 right-4 text-2xl font-bold hover:text-red-500"
              onClick={closeModel}
            >
              ×
            </button>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price"
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="number"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter Stock"
                className="w-full border rounded px-3 py-2"
              />
              <select
                name="categoryId"
                className="w-full border rounded px-3 py-2"
                value={formData.categoryId}
                onChange={handleChange}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
              <select
                name="supplierId"
                className="w-full border rounded px-3 py-2"
                value={formData.supplierId}
                onChange={handleChange}
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier._id} value={supplier._id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded"
                >
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                  onClick={closeModel}
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

export default Produts;
