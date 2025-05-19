import React, { useEffect, useState } from "react";
import { useProduct } from "../ProductContext";
import { useOrder } from "../OrderContext";
import { useNavigate } from "react-router-dom";
import EmployeeSidebar from "./Sidebar";

const EmployeeDashboard = () => {
  const { getAllProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const { getAllOrders } = useOrder();
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [productStats, setProductStats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const req = async () => {
      const p = await getAllProducts();
      setProducts(p.products);
      const o = await getAllOrders();
      setOrders(o.orders);
    };
    req();
  }, []);

  useEffect(() => {
    const stats = products.map((product) => {
      let totalSold = 0;
      let quantitySold = 0;
      let lastSoldDate = null;

      orders.forEach((order) => {
        order.order_products.forEach((op) => {
          if (op.product_id === product.id) {
            totalSold += op.quantity * product.price;
            quantitySold += op.quantity;

            const soldDate = new Date(order.created_at);
            if (!lastSoldDate || soldDate > new Date(lastSoldDate)) {
              lastSoldDate = soldDate;
            }
          }
        });
      });

      return {
        ...product,
        totalSold,
        quantitySold,
        lastSoldDate: lastSoldDate ? lastSoldDate.toLocaleDateString() : "None",
      };
    });

    setProductStats(stats);
  }, [products, orders]);

  const filteredProducts = productStats.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-black text-white font-poppins">
      <EmployeeSidebar />
      <div className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gold font-poetsen">
            Product Insights
          </h1>
          <button
            onClick={() => navigate("/admin/product")}
            className="bg-amber-300 cursor-pointer text-black px-5 py-2 rounded shadow hover:bg-yellow-500 transition"
          >
            + Add Product
          </button>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-1/3 bg-gray-800 text-white p-2 mb-6 rounded border border-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 shadow-lg rounded-lg p-6 cursor-pointer transition duration-300 hover:scale-105"
              onClick={() => navigate(`/admin/product/${product.id}`)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h2 className="text-xl font-bold text-gold font-poetsen mb-1">
                {product.name}
              </h2>
              <p className="text-gray-400">{product.description}</p>
              <div className="mt-4 text-sm">
                <p>
                  <span className="text-white">Price:</span> ₱{product.price}
                </p>
                <p>
                  <span className="text-white">Stock:</span> {product.stock}
                </p>
                <p>
                  <span className="text-white">Items Sold:</span>{" "}
                  {product.quantitySold}
                </p>
                <p>
                  <span className="text-white">Total Earned:</span> ₱
                  {product.totalSold}
                </p>
                <p>
                  <span className="text-white">Last Sold:</span>{" "}
                  {product.lastSoldDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
