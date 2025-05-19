import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";
import {
  FaHome,
  FaShoppingCart,
  FaBoxOpen,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    {
      label: "Home",
      path: sessionStorage.getItem("role") === "admin" ? "/admin" : "/customer",
      icon: <FaHome />,
    },
    {
      label: "Cart",
      path: "/customer/cart",
      icon: <FaShoppingCart />,
      show: sessionStorage.getItem("role") === "customer",
    },
    {
      label: "Orders",
      path:
        sessionStorage.getItem("role") === "admin"
          ? "/admin/order"
          : "/customer/order",
      icon: <FaBoxOpen />,
    },
  ];

  return (
    <div className="w-[20vw] max-h-screen bg-black text-gold shadow-xl font-[Poppins] p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-3xl font-[Poppins] font-bold">The Watcher</h2>
        <h5 className="mb-8 text-[.75rem]">
          Time is essential, watch is a must
        </h5>
        <nav className="space-y-4">
          {navItems
            .filter((item) => item.show !== false)
            .map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded hover:bg-amber-400 hover:text-black transition bg-amber-300`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-8 px-3 py-2 rounded hover:bg-amber-300 hover:text-black transition text-amber-300"
      >
        <FaSignOutAlt />
        <span className="font-medium">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
