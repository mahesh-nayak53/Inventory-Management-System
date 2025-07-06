import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CustomerProducts = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProduct, setFilteredProduct] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [orderData, setOrderData] = useState({
    productId: "",
    quantity: 1,
    total: 0,
    stock: 0,
    price: 0,
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
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

  const handleSearch = (e) => {
    setFilteredProduct(
      products.filter((product) =>
        product.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handlecategory = (e) => {
    setFilteredProduct(
      products.filter((product) =>
        product.categoryId._id === e.target.value
      )
    );
  };

  const handleOrderChange = (product) => {
    setOrderData({
      productId: product._id,
      quantity: 1,
      total: product.price,
      stock: product.stock,
      price: product.price,
    });
    setOpenModal(true);
  };

  const closeModel = () => {
    setOpenModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/orders/add", orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        setOpenModal(false);
        setOrderData({
          productId: "", quantity: 1, stock: 0, total: 0, price: 0,
        });
        alert("Order placed successfully");
      }
    } catch (error) {
      alert("Error placing order. Please try again");
    }
  };

  const IncreaseQuantity = (e) => {
    if (e.target.value > orderData.stock) {
      alert("Not enough stock available");
    } else {
      setOrderData((prev) => ({
        ...prev,
        quantity: parseInt(e.target.value),
        total: parseInt(e.target.value) * parseInt(orderData.price),
      }));
    }
  };

  return (
    <div className="px-6 py-4 w-full">
      <h1 className='text-2xl bg-gradient-to-b from-white to-gray-300 p-5 text-[#320404] font-bold'>Products</h1>

      <div className='py-4 flex justify-between items-center'>
        <select name="category" className='bg-white border rounded p-2' onChange={handlecategory}>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search..."
          onChange={handleSearch}
          className="border p-2 bg-gray-200 rounded shadow px-4"
        />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-4">
        <table className="w-full border-collapse border border-gray-300 mt-4 text-center">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">SL.No</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Supplier</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredProduct.map((product, index) => (
              <tr key={product._id} className="hover:bg-gray-50">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{product.name}</td>
                <td className="border p-2">{product.categoryId.categoryName}</td>
                <td className="border p-2">{product.supplierId.name}</td>
                <td className="border p-2">₹{product.price}</td>
                <td className="border p-2">
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
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-green-400 hover:bg-green-600 text-white rounded"
                    onClick={() => handleOrderChange(product)}
                  >
                    Order
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredProduct.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No records found.</div>
        )}
      </div>

      {openModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Place Order</h2>
            <button
              className="absolute top-3 right-4 text-2xl font-bold hover:text-red-500"
              onClick={closeModel}
            >
              ×
            </button>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input
                type="number"
                name="quantity"
                value={orderData.quantity}
                onChange={IncreaseQuantity}
                min="1"
                placeholder="Enter Quantity"
                className="w-full border rounded px-3 py-2"
              />
              <p>Total: ₹{orderData.total}</p>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="w-full bg-orange-400 hover:bg-orange-500 text-white py-2 rounded"
                >
                  Confirm Order
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

export default CustomerProducts;
