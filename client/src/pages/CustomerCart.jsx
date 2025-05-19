import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useCart } from "../CartContext";
import { useOrder } from "../OrderContext";

const CustomerCart = () => {
  const { getAllCarts, updateCart, deleteCart } = useCart();
  const [carts, setCarts] = useState([]);
  const [selected, setSelected] = useState([]);
  const { createOrder } = useOrder();

  useEffect(() => {
    loadCarts();
  }, []);

  const loadCarts = async () => {
    const response = await getAllCarts();
    if (response.carts) {
      console.log(response.carts);
      setCarts(response.carts);
    }
  };

  const handleUpdateQuantity = async (id, newQty) => {
    if (newQty <= 0) return;
    await updateCart(id, { quantity: newQty });
    loadCarts();
  };

  const handleDelete = async (id) => {
    await deleteCart(id);
    loadCarts();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getTotal = () => {
    return carts
      .filter((cart) => selected.includes(cart.id))
      .reduce((acc, cart) => acc + cart.product.price * cart.quantity, 0);
  };

  const handleCheckout = async () => {
    const selectedItems = carts.filter((cart) => selected.includes(cart.id));

    if (selectedItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    const orderProducts = selectedItems.map((cart) => ({
      product_id: cart.product.id,
      quantity: cart.quantity,
    }));

    try {
      const response = await createOrder(orderProducts);
      if (response) {
        alert("Order placed successfully!");
        setSelected([]);
        loadCarts(); // refresh cart
      } else {
        console.log(response);

        alert("Failed to place order.");
      }
    } catch (err) {
      alert(
        "Error: " + (err?.response?.data?.message || "Could not place order.")
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar role="customer" />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-poetsen text-amber-300 mb-6">Your Cart</h1>

        {carts.length === 0 ? (
          <p className="text-gray-400 font-poppins">Your cart is empty.</p>
        ) : (
          <div className="space-y-6">
            {carts.map((cart) => (
              <div
                key={cart.id}
                className="bg-gray-900 shadow-lg rounded-lg p-4 flex items-center gap-6"
              >
                <img
                  src={cart.product.image_url}
                  alt={cart.product.name}
                  className="w-32 h-32 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-xl font-poetsen text-amber-300">
                    {cart.product.name}
                  </h2>
                  <p className="text-gray-400 font-poppins">
                    Price: ₱{cart.product.price.toLocaleString()} <br />
                    Stock: {cart.product.stock} <br />
                    Subtotal: ₱
                    {(cart.product.price * cart.quantity).toLocaleString()}
                  </p>

                  <div className="mt-2 flex items-center gap-4">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(cart.id, cart.quantity - 1)
                      }
                      className="bg-amber-300 text-black px-3 py-1 rounded hover:bg-yellow-400 cursor-pointer"
                    >
                      -
                    </button>
                    <p className="text-lg font-poppins">{cart.quantity}</p>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(cart.id, cart.quantity + 1)
                      }
                      className="bg-amber-300 text-black px-3 py-1 rounded hover:bg-yellow-400 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <label className="flex items-center gap-2 font-poppins cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.includes(cart.id)}
                      onChange={() => toggleSelect(cart.id)}
                    />
                    Include
                  </label>
                  <button
                    onClick={() => handleDelete(cart.id)}
                    className="text-red-500 hover:underline font-poppins text-sm cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-8 text-right font-poppins text-xl">
              <span className="text-white mr-2">Total:</span>
              <span className="text-amber-300 font-poetsen">
                ₱{getTotal().toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <button
                className="mt-4 bg-amber-300 text-black px-6 py-2 rounded font-poetsen hover:bg-yellow-400 cursor-pointer"
                onClick={handleCheckout}
              >
                Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerCart;
