// src/contexts/CartContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const getAllCarts = async () => {
    const res = await axios.get("/carts");
    return res.data;
  };

  const createCart = async (data) => {
    console.log(data);

    const res = await axios.post("/carts", data);
    return res.data;
  };

  const getCart = async (id) => {
    const res = await axios.get(`/carts/${id}`);
    return res.data;
  };

  const updateCart = async (id, data) => {
    const res = await axios.put(`/carts/${id}`, data);
    return res.data;
  };

  const deleteCart = async (id) => {
    const res = await axios.delete(`/carts/${id}`);
    return res.data;
  };

  return (
    <CartContext.Provider
      value={{
        getAllCarts,
        createCart,
        getCart,
        updateCart,
        deleteCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
