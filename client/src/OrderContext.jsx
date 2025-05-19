// src/contexts/OrderContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const getAllOrders = async () => {
    const res = await axios.get("/orders");
    return res.data;
  };

  const createOrder = async (orderProducts) => {
    const res = await axios.post("/orders", { orderProducts: orderProducts });
    // console.log(res.data.orders);

    return res.data;
  };

  const showUserOrders = async () => {
    const res = await axios.get("/orders/user");
    return res.data;
  };

  return (
    <OrderContext.Provider
      value={{ getAllOrders, createOrder, showUserOrders }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => useContext(OrderContext);
