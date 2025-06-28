"use client";
import { useState, useContext } from "react";
import Link from "next/link";
import { CartContext } from "@/components/CartContext";
import Image, { StaticImageData } from "next/image";
import NetworkInstance from "@/app/api/NetworkInstance";
interface cardType {
  image: string | StaticImageData;
  title: string;
  price?: string;
  _id: string;
  category: string;
  showdetailModal?: (() => void | undefined) | undefined;
}

export default function ShopGridCard(props: cardType) {
  const [heartIcon, setHeartIcon] = useState(false);
  const [basketIcon, setBasketIcon] = useState(false);
  const { setCartCount, fetchCartCount } = useContext(CartContext);

  const addToCart = async () => {
    const payload: Record<string, any> = {
      productId: props._id,
      categoryId: props.category,
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
    <div className="shop-card style-1">
      <div className="dz-media">
        <Image width={400} height={400} src={props.image} alt="shop" />
        <div className="shop-meta">
          <Link
            href={"#"}
            className="btn btn-secondary btn-md btn-rounded"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            onClick={props.showdetailModal}
          >
            <i className="fa-solid fa-eye d-md-none d-block" />
            <span className="d-md-block d-none">Quick View</span>
          </Link>
          <div
            className={`btn btn-primary meta-icon dz-wishicon ${
              heartIcon ? "active" : ""
            }`}
            onClick={() => setHeartIcon(!heartIcon)}
          >
            <i className="icon feather icon-heart dz-heart" />
            <i className="icon feather icon-heart-on dz-heart-fill" />
          </div>
          <div
            className={`btn btn-primary meta-icon dz-carticon  ${
              basketIcon ? "active" : ""
            }`}
            onClick={() => {
              setBasketIcon(!basketIcon);
              addToCart();
            }}
          >
            <i className="flaticon flaticon-basket" />
            <i className="flaticon flaticon-shopping-basket-on dz-heart-fill" />
          </div>
        </div>
      </div>
      <div className="dz-content">
        <h5 className="title">
          <Link href="/shop-list">{props.title}</Link>
        </h5>
        <h5 className="price">{props.price}</h5>
      </div>
      <div className="product-tag">
        <span className="badge ">Get 20% Off</span>
      </div>
    </div>
  );
}
