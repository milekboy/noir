"use client";
import { useContext } from "react";
import { useRouter } from "next/navigation";
import { CartContext } from "@/components/CartContext";

import NetworkInstance from "@/app/api/NetworkInstance";
import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import Image from "next/image";
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
}
export default function BestOfferBlog({ product }: BestOfferBlogProps) {
  const { setCartCount, fetchCartCount } = useContext(CartContext);
  const router = useRouter();
  const addToCart = async () => {
    const payload: Record<string, any> = {
      productId: product._id,
      categoryId: product.category,
      quantity: 1,
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

      if (response?.status === 200 || response?.status === 201) {
        fetchCartCount();
        router.push("/shop-cart");
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
            Lorem Ipsum is simply dummy text of the printing and typesetting
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
            <td className="price"> ₦{product.price}</td>
          </tr>
        </tbody>
      </table>
      <Link
        href="/shop-wishlist"
        className="btn btn-outline-secondary btn-icon m-b20"
      >
        <svg
          width="19"
          height="17"
          viewBox="0 0 19 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          dangerouslySetInnerHTML={{ __html: SVGICON.BlankHeart }}
        ></svg>
        Add To Wishlist
      </Link>
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
