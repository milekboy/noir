// components/CartContext.js
"use client";
import { createContext, useState, useEffect } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

export const CartContext = createContext();
const networkInstance = NetworkInstance();
export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = async () => {
    try {
      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        console.log("No cart ID found.");
        return;
      }
      // console.log(cartId);
      const res = await networkInstance.get(`/cart/view/${cartId}`);
      const cartItems = res.data.items || [];
      setCartCount(cartItems.length);
      console.log("Fetched cart count:", cartId);
    } catch (err) {
      console.log("Error fetching cart:", err?.response?.data || err);
    }
  };

  useEffect(() => {
    fetchCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};
