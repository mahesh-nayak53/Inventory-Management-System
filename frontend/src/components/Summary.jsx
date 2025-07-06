import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

const Summary = () => {
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalStock: 0,
    ordersToday: 0,
    revenue: 0,
    outOfStock: [],
    highestSaleProduct: null,
    lowStock: [],
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/api/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setDashboardData(response.data.dashboardData);
    } catch (error) {
      alert("Error fetching dashboard data.", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const graphData = [
    { name: "Day 1", Stock: 120, Revenue: 450000, HighSale: 25 },
    { name: "Day 2", Stock: 135, Revenue: 490000, HighSale: 20 },
    { name: "Day 3", Stock: 110, Revenue: 440000, HighSale: 28 },
    {
      name: "Today",
      Stock: dashboardData.totalStock,
      Revenue: dashboardData.revenue,
      HighSale: dashboardData.highestSaleProduct?.totalQuantity || 0,
    },
    { name: "Day 5", Stock: 125, Revenue: 500000, HighSale: 26 },
    { name: "Day 6", Stock: 130, Revenue: 520000, HighSale: 30 },
    { name: "Day 7", Stock: 140, Revenue: 540000, HighSale: 32 },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 px-4 py-4">
      <h1 className="text-2xl font-bold text-[#320404] bg-gradient-to-b from-white to bg-gray-300 p-5 rounded-md">
        Dashboard Overview
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-300 p-4 rounded-xl shadow-md border border-blue-300 transition transform hover:scale-105 hover:shadow-xl text-center">
          <p className="text-blue-800 text-lg font-semibold">Total Products</p>
          <p className="text-3xl font-bold mt-2 text-blue-900">{dashboardData.totalProducts}</p>
        </div>
        <div className="bg-green-300 p-4 rounded-xl shadow-md border border-green-300 transition transform hover:scale-105 hover:shadow-xl text-center">
          <p className="text-green-800 text-lg font-semibold">Stock Available</p>
          <p className="text-3xl font-bold mt-2 text-green-900">{dashboardData.totalStock}</p>
        </div>
        <div className="bg-yellow-300 p-4 rounded-xl shadow-md border border-yellow-300 transition transform hover:scale-105 hover:shadow-xl text-center">
          <p className="text-yellow-800 text-lg font-semibold">New Orders</p>
          <p className="text-3xl font-bold mt-2 text-yellow-900">{dashboardData.ordersToday}</p>
        </div>
        <div className="bg-red-300 p-4 rounded-xl shadow-md border border-red-300 transition transform hover:scale-105 hover:shadow-xl text-center">
          <p className="text-red-800 text-lg font-semibold">Total Revenue</p>
          <p className="text-3xl font-bold mt-2 text-red-900">₹{dashboardData.revenue}</p>
        </div>
      </div>

      {/* Graph + Info Cards */}
      <div className="grid md:grid-cols-[2fr_1fr] gap-4 mt-4">
        {/* Area Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Weekly Inventory Metrics</h2>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={graphData} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
              <defs>
                <linearGradient id="stockColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="saleColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name">
                <Label value="" offset={-25} position="insideBottom" />
              </XAxis>
              <YAxis>
                <Label value="" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Area type="monotone" dataKey="Stock" stroke="#10B981" fill="url(#stockColor)" />
              <Area type="monotone" dataKey="Revenue" stroke="#3B82F6" fill="url(#revenueColor)" />
              <Area type="monotone" dataKey="HighSale" stroke="#F59E0B" fill="url(#saleColor)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Info Cards Section */}
        <div className="grid grid-cols-1 gap-3">
          {/* Out of Stock */}
          <div className="bg-red-100 px-3 py-4 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg text-sm text-center">
            <h3 className="font-bold text-red-700 text-base mb-2">Out of Stock Products</h3>
            {dashboardData.outOfStock.length > 0 ? (
              <ul className="space-y-1 text-red-800 font-semibold">
                {dashboardData.outOfStock.map((product, index) => (
                  <li key={index}>
                    {product.name}{" "}
                    <span className="text-red-400 font-normal">({product.categoryId.categoryName})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500 font-semibold">No products out of stock</p>
            )}
          </div>

          {/* High Sale Product */}
          <div className="bg-purple-100 px-3 py-4 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg text-sm text-center">
            <h3 className="font-bold text-purple-700 text-base mb-2">High Sale Product</h3>
            {dashboardData.highestSaleProduct?.name ? (
              <div className="text-purple-800 font-semibold space-y-1">
                <p>Name: {dashboardData.highestSaleProduct.name}</p>
                <p>Category: {dashboardData.highestSaleProduct.category}</p>
                <p>Total Sold: {dashboardData.highestSaleProduct.totalQuantity}</p>
              </div>
            ) : (
              <p className="text-purple-500 font-semibold">No data available</p>
            )}
          </div>

          {/* Low Stock */}
          <div className="bg-orange-100 px-3 py-4 rounded-lg shadow-md transition hover:scale-105 hover:shadow-lg text-sm text-center">
            <h3 className="font-bold text-orange-700 text-base mb-2">Low Stock Products</h3>
            {dashboardData.lowStock.length > 0 ? (
              <ul className="space-y-1 text-orange-800 font-semibold">
                {dashboardData.lowStock.map((product, index) => (
                  <li key={index}>
                    <strong>{product.name}</strong> - {product.stock} left{" "}
                    <span className="text-orange-400 font-normal">({product.categoryId.categoryName})</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-orange-500 font-semibold">No low stock items</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
