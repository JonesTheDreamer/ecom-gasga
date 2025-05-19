import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useProduct } from "../ProductContext";
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const { getAllProducts } = useProduct();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const req = async () => {
      const data = await getAllProducts();
      setProducts(data.products);
    };
    req();
  }, []);

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <div className="flex bg-black text-white min-h-screen">
      <Sidebar role="customer" />
      <div className="flex-1 p-8">
        <h1 className="text-4xl text-gold mb-6">Shop Watches</h1>
        <input
          type="text"
          placeholder="Search watches..."
          className="mb-6 w-full max-w-md px-4 py-2 rounded bg-gray-800 text-white border border-gold focus:outline-none focus:ring-2 focus:ring-gold"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer"
              onClick={() => navigate(`/customer/product/${product.id}`)}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl text-gold mb-2">{product.name}</h2>
                <p className="text-gray-300 font-[Poppins]">
                  {product.description}
                </p>
                <div className="mt-3 flex justify-between items-center text-sm font-[Poppins]">
                  <span>₱{product.price.toLocaleString()}</span>
                  <span className="text-gray-400">Stock: {product.stock}</span>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <p className="col-span-full text-gray-400 font-[Poppins]">
              No products match your search.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
