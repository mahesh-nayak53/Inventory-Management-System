import React, { useEffect, useState } from "react";
import {
  FaBox,
  FaCog,
  FaHome,
  FaShoppingCart,
  FaSignOutAlt,
  FaTable,
  FaTruck,
  FaUsers,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink } from "react-router-dom"; // FIXED HERE
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin-dashboard",
      icon: <FaHome />,
      isParent: true,
    },
    {
      name: "Categories",
      path: "/admin-dashboard/categories",
      icon: <FaTable />,
      isParent: false,
    },
    {
      name: "Products",
      path: "/admin-dashboard/products",
      icon: <FaBox />,
      isParent: false,
    },
    {
      name: "Suppliers",
      path: "/admin-dashboard/suppliers",
      icon: <FaTruck />,
      isParent: false,
    },
    {
      name: "Orders",
      path: "/admin-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Users",
      path: "/admin-dashboard/users",
      icon: <FaUsers />,
      isParent: false,
    },
    {
      name: "Profile",
      path: "/admin-dashboard/profile",
      icon: <FaCog />,
      isParent: false,
    },
    {
      name: "Logout",
      path: "/admin-dashboard/logout",
      icon: <FaSignOutAlt />,
      isParent: false,
    },
  ];

  const customerItems = [
    {
      name: "Products",
      path: "/customer-dashboard",
      icon: <FaBox />,
      isParent: true,
    },
    {
      name: "Orders",
      path: "/customer-dashboard/orders",
      icon: <FaShoppingCart />,
      isParent: false,
    },
    {
      name: "Profile",
      path: "/customer-dashboard/profile",
      icon: <FaCog />,
      isParent: false,
    },
    {
      name: "Logout",
      path: "/customer-dashboard/logout",
      icon: <FaSignOutAlt />,
      isParent: false,
    },
  ];

  const { user } = useAuth();
  const [menuLinks, setMenuLinks] = useState(customerItems);

  useEffect(() => {
    if (user && user.role === "admin") {
      setMenuLinks(menuItems);
    } else if (user?.role === "customer") {
      setMenuLinks(customerItems);
    } else {
      setMenuLinks([]);
    }
  }, []);
  return (
    <div className="flex flex-col h-screen fixed bg-[#252724] text-white w-16 md:w-64">
      {/* <div className='h-16 flex items-center justify-center'>
        <span className='hidden md:block text-2xl font-bold'>InventoryEase</span>
        <span className='ml-4 md:hidden text-xl font-bold'></span>
      </div> */}

      <div className="h-20 flex items-center justify-center md:justify-start px-4 gap-2">
        <FaUserCircle className="text-6xl md:text-3xl text-orange-300 " />
        <span className="hidden md:block text-2xl hover:text-orange-300 font-bold">
          {user?.name || "User"}
        </span>
      </div>

      <div>
        <ul className="space-y-2 p-2">
          {menuLinks.map((item) => (
            <li key={item.name}>
              <NavLink
                end={item.isParent}
                to={item.path}
                className={({ isActive }) =>
                  (isActive ? "bg-orange-500 " : "") +
                  "flex items-center p-2 rounded-md hover:bg-orange-300 transition duration-200"
                }
              >
                <span className="text-xl mr-2">{item.icon}</span>
                <span className="hidden md:block">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
