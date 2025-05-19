import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useOrder } from "../OrderContext";
import { format } from "date-fns";

const EmployeeOrders = () => {
  const { getAllOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data.orders || []);
      setFilteredOrders(data.orders || []);
      console.log(data.orders);
    };
    fetchOrders();
  }, []);

  const getDateOptions = () => {
    const uniqueDates = new Set(
      orders.map((order) => format(new Date(order.created_at), "yyyy-MM-dd"))
    );
    return ["All", ...Array.from(uniqueDates)];
  };

  const handleFilterChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date === "All") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(
        orders.filter(
          (order) => format(new Date(order.created_at), "yyyy-MM-dd") === date
        )
      );
    }
  };

  return (
    <div className="flex bg-black text-white min-h-screen font-poetsen">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl text-gold">My Orders</h1>
          <select
            value={selectedDate}
            onChange={handleFilterChange}
            className="bg-gray-800 border border-gray-600 p-2 rounded text-white"
          >
            {getDateOptions().map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-gray-400">No orders to display.</p>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 rounded-lg p-6 shadow-md border border-gray-800"
              >
                <div className="flex justify-between mb-4">
                  <p className="text-lg text-gold">Order #{order.id}</p>
                  <p className="text-sm text-gray-400">
                    Date: {format(new Date(order.created_at), "MMMM dd, yyyy")}
                  </p>
                </div>
                <div className="space-y-4">
                  {order.order_products.map((op) => (
                    <div
                      key={op.id}
                      className="flex gap-4 border-b border-gray-800 pb-4"
                    >
                      <img
                        src={op.product.image_url}
                        alt={op.product.name}
                        className="w-24 h-24 object-cover rounded shadow"
                      />
                      <div className="flex-1">
                        <p className="text-lg text-white">{op.product.name}</p>
                        <p className="text-gray-400 text-sm">
                          {op.product.description}
                        </p>
                        <div className="flex justify-between mt-2 text-sm text-gray-300">
                          <span>₱{op.product.price.toLocaleString()}</span>
                          <span>Qty: {op.quantity}</span>
                          <span>
                            Subtotal: ₱
                            {(op.product.price * op.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right text-gold font-semibold text-lg">
                  Total: ₱
                  {order.order_products
                    .reduce(
                      (sum, op) => sum + op.product.price * op.quantity,
                      0
                    )
                    .toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeOrders;
