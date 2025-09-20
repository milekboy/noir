// app/components/ShopCart.tsx
"use client";

import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import NetworkInstance from "@/app/api/NetworkInstance";
import IMAGES from "@/constant/theme";
import { useState, useEffect } from "react";
import Image from "next/image";

interface ProductImage {
  url: string;
  public_id: string;
  filename: string;
}

interface ProductDetails {
  _id: string;
  name: string;
  price: number;
  image: ProductImage[];
}

interface CartItem {
  _id: string;
  product: string;
  productDetails: ProductDetails;
  quantity: number;
}

export default function ShopCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    async function getCart() {
      // guard: only run in browser
      if (typeof window === "undefined") return;

      const cartId = localStorage.getItem("cartId");
      if (!cartId) {
        console.log("No cart ID found.");
        return;
      }

      try {
        const networkInstance = NetworkInstance();
        const res = await networkInstance.get(`/cart/view/${cartId}`);
        setCartItems(res.data.items);
      } catch (err: any) {
        console.log("Error fetching cart:", err?.response?.data || err);
      }
    }

    getCart();
  }, []);

  const handleRemove = async (index: number) => {
    if (typeof window === "undefined") return;

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    const item = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));

    try {
      const networkInstance = NetworkInstance();
      await networkInstance.delete(`/cart/remove/${cartId}`, {
        data: {
          productId: item.product,
          quantity: item.quantity,
        },
      });
    } catch (err: any) {
      console.log("Error removing item:", err?.response?.data || err);
    }
  };

  const handleIncrease = async (ind: number) => {
    if (typeof window === "undefined") return;

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    const item = cartItems[ind];
    setCartItems((prev) => {
      const updated = [...prev];
      updated[ind] = { ...updated[ind], quantity: updated[ind].quantity + 1 };
      return updated;
    });

    try {
      const networkInstance = NetworkInstance();
      await networkInstance.put(`/cart/update-quantity/${cartId}`, {
        productId: item.product,
        quantity: 1,
      });
    } catch (err: any) {
      console.log("Error increasing quantity:", err);
    }
  };

  const handleDecrease = async (ind: number) => {
    if (typeof window === "undefined") return;

    const cartId = localStorage.getItem("cartId");
    if (!cartId) return;

    const item = cartItems[ind];
    setCartItems((prev) => {
      const updated = [...prev];
      updated[ind] = { ...updated[ind], quantity: updated[ind].quantity - 1 };
      return updated;
    });

    try {
      const networkInstance = NetworkInstance();
      await networkInstance.put(`/cart/update-quantity/${cartId}`, {
        productId: item.product,
        quantity: -1,
      });
    } catch (err: any) {
      console.log("Error decreasing quantity:", err?.response?.data || err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.productDetails.price * item.quantity,
    0
  );

  return (
    <div className="page-content bg-light">
      <CommanBanner
        parentText="Home"
        currentText="Shop Cart"
        mainText="Shop Cart"
        image={IMAGES.BackBg1.src}
      />

      <section className="content-inner shop-account">
        <div className="container">
          <div className="row">
            {/* Cart Items Table */}
            <div className="col-lg-8">
              <div className="table-responsive">
                <table className="table check-tbl">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th></th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Subtotal</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((data, ind) => (
                      <tr key={data._id}>
                        <td className="product-item-img">
                          <Image
                            src={
                              data.productDetails.image[0]?.url ||
                              "/fallback.jpg"
                            }
                            alt={data.productDetails.name}
                            width={100}
                            height={100}
                          />
                        </td>
                        <td className="product-item-name">
                          {data.productDetails.name}
                        </td>
                        <td className="product-item-price">
                          ₦{data.productDetails.price}.00
                        </td>
                        <td className="product-item-quantity">
                          <div className="quantity btn-quantity style-1 me-3">
                            <div className="input-group bootstrap-touchspin">
                              <input
                                type="text"
                                value={data.quantity}
                                className="form-control"
                                readOnly
                              />
                              <div className="input-group-btn-vertical">
                                <button
                                  className="btn btn-default"
                                  onClick={() => handleIncrease(ind)}
                                >
                                  <i className="fa-solid fa-plus" />
                                </button>
                                <button
                                  className="btn btn-default"
                                  onClick={() => handleDecrease(ind)}
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="product-item-totle">
                          ₦{data.productDetails.price * data.quantity}.00
                        </td>
                        <td className="product-item-close">
                          <button
                            onClick={() => handleRemove(ind)}
                            className="btn btn-link text-danger"
                          >
                            <i className="ti-close" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Coupon & Update Cart */}
              <div className="row shop-form m-t30">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-group mb-0">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Coupon Code"
                      />
                      <div className="input-group-addon">
                        <button type="button" className="btn coupon">
                          Apply Coupon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <Link href="/shop-list" className="btn btn-secondary">
                    UPDATE CART
                  </Link>
                </div>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="col-lg-4">
              <h4 className="title mb15">Cart Total</h4>
              <div className="cart-detail">
                <Link
                  href="#"
                  className="btn btn-outline-secondary w-100 m-b20"
                >
                  Bank Offer 5% Cashback
                </Link>
                <div className="icon-bx-wraper style-4 m-b15">
                  <div className="icon-bx">
                    <i className="flaticon flaticon-ship"></i>
                  </div>
                  <div className="icon-content">
                    <span className="font-14">FREE</span>
                    <h6 className="dz-title">Enjoy The Product</h6>
                  </div>
                </div>
                <div className="icon-bx-wraper style-4 m-b30">
                  <div className="icon-bx">
                    <Image src={IMAGES.ShopIconBox} alt="Icon" />
                  </div>
                  <div className="icon-content">
                    <h6 className="dz-title">Enjoy The Product</h6>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting industry.
                    </p>
                  </div>
                </div>
                <table>
                  <tbody>
                    <tr className="total">
                      <td>
                        <h6 className="mb-0">Total</h6>
                      </td>
                      <td className="price">₦{totalPrice}.00</td>
                    </tr>
                  </tbody>
                </table>
                <Link href="/shop-checkout" className="btn btn-secondary w-100">
                  PLACE ORDER
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
