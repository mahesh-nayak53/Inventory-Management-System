import React, { useEffect, useState } from "react";
import axios from "axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/orders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      } else {
        console.error("Error fetching orders:", response.data.message);
        alert("Error fetching orders. Please try again");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders. Please try again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="w-full px-6 py-4">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to-gray-300 p-4 rounded">
        Orders
      </h1>

      {loading ? (
        <div className="text-lg mt-6">Loading...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <table className="w-full text-center border border-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="border py-2 px-4">SL. No</th>
                <th className="border py-2 px-4">Product</th>
                <th className="border py-2 px-4">Category</th>
                <th className="border py-2 px-4">Quantity</th>
                <th className="border py-2 px-4">Total Price</th>
                <th className="border py-2 px-4">Order Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border py-2 px-4">{index + 1}</td>
                  <td className="border py-2 px-4">{order.product.name}</td>
                  <td className="border py-2 px-4">
                    {order.product.categoryId.categoryName}
                  </td>
                  <td className="border py-2 px-4">{order.quantity}</td>
                  <td className="border py-2 px-4">₹ {order.totalPrice}</td>
                  <td className="border py-2 px-4">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-4 text-gray-400">
                    No orders available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;
