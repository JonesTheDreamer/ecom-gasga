// src/contexts/ProductContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "./axios";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const getAllProducts = async () => {
    const res = await axios.get("/products");
    return res.data;
  };

  const getProduct = async (id) => {
    const res = await axios.get(`/products/${id}`);
    return res.data;
  };

  const createProduct = async (formData) => {
    const res = await axios.post("/products", formData);
    return res.data;
  };

  const updateProduct = async (id, formData) => {
    const res = await axios.post(`/products/${id}`, formData);
    return res.data;
  };

  const deleteProduct = async (id) => {
    const res = await axios.delete(`/products/${id}`, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  };

  return (
    <ProductContext.Provider
      value={{
        getAllProducts,
        getProduct,
        createProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
