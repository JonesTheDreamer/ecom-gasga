import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useProduct } from "../ProductContext";
import { useCart } from "../CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const { getProduct } = useProduct();
  const { createCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState();
  useEffect(() => {
    const req = async () => {
      const data = await getProduct(id);
      setSelectedProduct(data.product);
    };
    req();
  }, [id]);

  const handleAddToCart = () => {
    if (quantity > 0 && quantity <= selectedProduct.stock) {
      createCart({ product_id: selectedProduct.id, quantity });
      alert("Item added to cart");
    }
  };

  return (
    <div className="flex min-h-screen items-center bg-black text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        {selectedProduct ? (
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row bg-gray-900 rounded-lg shadow-lg overflow-hidden">
            <img
              src={selectedProduct.image_url}
              alt={selectedProduct.name}
              className="w-full md:w-1/2 object-cover h-96"
            />

            <div className="p-6 md:w-1/2 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-[Poppins] font-bold text-gold mb-2">
                  {selectedProduct.name}
                </h1>
                <p className="text-gray-300 font-[Poppins] mb-4">
                  {selectedProduct.description}
                </p>
                <p className="text-xl font-[Poppins] text-white mb-2">
                  Price: ₱{selectedProduct.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400 font-[Poppins]">
                  Stock left: {selectedProduct.stock}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 cursor-pointer bg-amber-300 text-black font-bold rounded hover:bg-amber-400"
                >
                  -
                </button>
                <p className="text-lg font-[Poppins]">{quantity}</p>
                <button
                  onClick={() =>
                    setQuantity((q) => (q < selectedProduct.stock ? q + 1 : q))
                  }
                  className="px-3 py-1 cursor-pointer bg-amber-300 text-black font-bold rounded hover:bg-amber-400"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-6 bg-amber-300 hover:bg-amber-400 text-black font-poetsen px-6 py-2 rounded transition cursor-pointer"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center font-[Poppins] text-gray-400">
            Loading product...
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
