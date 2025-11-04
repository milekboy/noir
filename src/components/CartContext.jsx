// components/CartContext.js
"use client";
import { createContext, useState, useEffect, useContext } from "react";
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

      const res = await networkInstance.get(`/cart/view/${cartId}`);
      const cartItems = res.data.items || [];
      setCartCount(cartItems.length);
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

export default function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
