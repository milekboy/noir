// components/CartContext.js
"use client";
import { createContext, useState, useEffect, useContext } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

export const WishlistContext = createContext();
const networkInstance = NetworkInstance();
export const WishlistProvider = ({ children }) => {
  const [wishListCount, setWishListCount] = useState(0);

  const fetchWishListCount = async () => {
    try {
    //   const cartId = localStorage.getItem("cartId");
    //   if (!cartId) {
    //     console.log("No cart ID found.");
    //     return;
    //   }
      // console.log(cartId);
      const res = await networkInstance.get(`/wishlist`, {
        headers: {
          "x-session-id": localStorage.getItem("sessionId") || "",
        }
      });

      const wishListItems = res.data.wishlist || [];
      setWishListCount(wishListItems.length);
      console.log(res)
    } catch (err) {
      console.log("Error fetching cart:", err?.response?.data || err);
    }
  };

  useEffect(() => {
    fetchWishListCount();
  }, [wishListCount]);

  return (
    <WishlistContext.Provider value={{ wishListCount, setWishListCount, fetchWishListCount }}>
      {children}
    </WishlistContext.Provider>
  );
};

export default function useWishlistContext() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
