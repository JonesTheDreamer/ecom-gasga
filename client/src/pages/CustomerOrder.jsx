import React, { useEffect, useState } from "react";
import { useOrder } from "../OrderContext";
import Sidebar from "./Sidebar";

const CustomerOrder = () => {
  const { showUserOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("All");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await showUserOrders();
        setOrders(res.orders || []);
        setFilteredOrders(res.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };
    loadOrders();
  }, []);

  const handleDateFilter = (date) => {
    setSelectedDate(date);
    if (date === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) =>
            new Date(order.created_at).toDateString() ===
            new Date(date).toDateString()
        )
      );
    }
  };

  // Get unique dates from orders
  const uniqueDates = [
    ...new Set(
      orders.map((order) => new Date(order.created_at).toDateString())
    ),
  ];

  return (
    <div className="flex min-h-screen bg-black text-white font-poppins">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-poetsen text-gold mb-6">Your Orders</h1>

        <div className="mb-6 flex items-center gap-4">
          <label htmlFor="filter" className="font-semibold text-white">
            Filter by Date:
          </label>
          <select
            id="filter"
            value={selectedDate}
            onChange={(e) => handleDateFilter(e.target.value)}
            className="bg-black border border-gold text-white px-4 py-2 rounded"
          >
            <option value="All">All</option>
            {uniqueDates.map((date, idx) => (
              <option key={idx} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredOrders.length === 0 && (
            <p className="text-gray-400">No orders found.</p>
          )}

          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#111] p-6 rounded-lg shadow-md border border-gold"
            >
              <h2 className="text-xl font-poetsen text-gold mb-2">
                Order #{order.id}
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <div className="space-y-4">
                {order.order_products.map((op) => (
                  <div
                    key={op.id}
                    className="bg-[#1a1a1a] rounded-md p-4 flex gap-4 items-center"
                  >
                    <img
                      src={op.product.image_url}
                      alt={op.product.name}
                      className="w-24 h-24 object-cover rounded shadow"
                    />
                    <div className="flex-1">
                      <h3 className="font-poetsen text-lg text-gold">
                        {op.product.name}
                      </h3>
                      <p className="text-sm text-gray-300">
                        Price: ₱{op.product.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-300">
                        Quantity: {op.quantity}
                      </p>
                      <p className="text-sm text-gray-300">
                        Total: ₱
                        {(op.quantity * op.product.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-700 mt-4 pt-2 text-right">
                <p className="font-semibold text-white">
                  Order Total: ₱
                  {order.order_products
                    .reduce(
                      (acc, op) => acc + op.product.price * op.quantity,
                      0
                    )
                    .toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerOrder;
