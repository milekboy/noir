"use client";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/components/CartContext";

import NetworkInstance from "@/app/api/NetworkInstance";
import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import Image from "next/image";
import { toast } from "react-toastify";
import { WishlistContext } from "@/components/WishlistContext";
interface ProductImage {
  url: string;
  public_id: string;
  filename: string;
}

interface Product {
  _id: string;
  name: string;
  price: any;
  category: string;
  productImages: ProductImage[];
  description: string;
  color: string;
  size: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface BestOfferBlogProps {
  product: Product;
  quantity: number;
}
export default function BestOfferBlog({ product,quantity }: BestOfferBlogProps) {
  const { setCartCount, fetchCartCount } = useContext(CartContext);
  const router = useRouter();
  const { wishListCount, setWishListCount } = useContext(WishlistContext);
  const [isDisabled, setIsDisabled] =useState(false);

  const addToCart = async () => {
    const payload: Record<string, any> = {
      productId: product._id,
      categoryId: product.category,
      quantity: quantity++,
    };

    const existingCartId = localStorage.getItem("cartId");
    if (existingCartId) {
      payload.cartId = existingCartId;
    } else {
      setCartCount((prev: number) => prev + 1);
    }

    try {
      const response = await NetworkInstance().post("/cart/add", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
       toast("Product added to cart", {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 2000,
    });

      if (response?.status === 200 || response?.status === 201) {
        fetchCartCount();
        
        const newCartId = response.data?.cartId;

        if (newCartId) {
          localStorage.setItem("cartId", newCartId);
        }

        console.log("product added to cart");
      }
    } catch (err: any) {
      console.error("Not added to cart:", err?.response?.data || err, payload);
    }
  };

  const addToWishlist = async () => {
    setWishListCount((prev: any) => prev + 1);
    toast("Product added to wishlist", {
      theme: "dark",
      hideProgressBar: true,
      position: "bottom-right",
      autoClose: 2000,
    });
    const payload: Record<string, any> = {
      productId: product._id,
    };

    const existingSessionId = localStorage.getItem("sessionId");
    if (existingSessionId) {
      payload.sessionId = existingSessionId;
    }
    try {
      const response = await NetworkInstance().post("/wishlist", payload, {
        headers: {
          "Content-Type": "application/json",
          "x-session-id": existingSessionId,
        },
      });
      if (response?.status === 200 || response?.status === 201) {
        const sessionId = response.data?.sessionId;

        console.log(response.data.sessionId);

        if (sessionId) {
          localStorage.setItem("sessionId", sessionId);
        } else {
          console.log("No session ID found");
        }
      }
    } catch (err: any) {
      console.error(
        "Not added to wishlist:",
        err?.response?.data || err,
        payload
      );
    }
  };

  const wishlistCheck = async (id: string) => {
  //  setIsDisabled(true);
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await NetworkInstance().get("/wishlist", {
        headers: {
          "x-session-id": sessionId,
        },
      });
      console.log("Wishlist data:", res.data.wishlist);
      console.log(id)
      if (res.data.wishlist.some((item: any) => item._id === id)) {
        setIsDisabled(true);
      
     
      } else {
        setIsDisabled(false);
      }
      // setWishlist(res.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }

  }


  useEffect(() => {
    wishlistCheck(product._id);
  }, [isDisabled, product._id]);
  return (
    <div className="cart-detail">
      <Link href={"#"} className="btn btn-outline-secondary w-100 m-b20">
        Bank Offer 5% Cashback
      </Link>
      <div className="icon-bx-wraper style-4 m-b15">
        <div className="icon-bx">
          <i className="flaticon flaticon-ship" />
        </div>
        <div className="icon-content">
          <span className=" font-14">Easy Returns</span>
          <h6 className="dz-title">30 Days</h6>
        </div>
      </div>
      <div className="icon-bx-wraper style-4 m-b30">
        <div className="icon-bx">
          <Image src={IMAGES.ShopIconBox} alt="/" />
        </div>
        <div className="icon-content">
          <h6 className="dz-title">Enjoy The Product</h6>
          <p>
            Explore a wide range of high-quality products carefully selected to
            elevate your everyday experience.
          </p>
        </div>
      </div>
      <div className="save-text">
        <i className="icon feather icon-check-circle" />
        <span className="m-l10">You will save ₦504 on this order</span>
      </div>
      <table>
        <tbody>
          <tr className="total">
            <td>
              <h6 className="mb-0">Total</h6>
            </td>
            <td className="price"> ₦{product.price.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <span className="btn btn-outline-secondary btn-icon m-b20" style={{ pointerEvents: isDisabled ? "none" : "auto",opacity: isDisabled ? 0.5 :1  }} onClick={() =>{ setIsDisabled(true);  addToWishlist(); }}>
        <svg
          width="19"
          height="17"
          viewBox="0 0 19 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: SVGICON.BlankHeart }}
        ></svg>
       {isDisabled ? "Added To Wishlist ":  "Add To Wishlist"}
      </span>
      <button
        onClick={() => {
          addToCart();
        }}
        className="btn btn-secondary w-100"
      >
        ADD TO CART
      </button>
    </div>
  );
}
