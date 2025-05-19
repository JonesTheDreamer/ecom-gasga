// src/contexts/UserContext.js
import { createContext, useContext, useState } from "react";
import axios from "./axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const login = async (credentials) => {
    try {
      const res = await axios.post("/login", credentials);
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("role", res.data.user.role);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await axios.post("/logout");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  };

  const register = async (data) => {
    const res = await axios.post("/register", data);
    sessionStorage.setItem("token", res.data.token);
    sessionStorage.setItem("role", res.data.user.role);
    return res.data;
  };

  return (
    <UserContext.Provider value={{ login, logout, register }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
