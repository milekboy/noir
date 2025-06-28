"use client";
import Link from "next/link";
import CommanBanner from "@/components/CommanBanner";
import NetworkInstance from "@/app/api/NetworkInstance";
import IMAGES from "@/constant/theme";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function ShopCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
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

  const networkInstance = NetworkInstance();
  useEffect(() => {
    async function getCart() {
      try {
        const cartId = localStorage.getItem("cartId");
        if (!cartId) {
          console.log("No cart ID found.");
        }

        const res = await networkInstance.get(`/cart/view/${cartId}`);

        setCartItems(res.data.items);
      } catch (err: any) {
        console.log("Error fetching cart:", err?.response?.data || err);
      }
    }
    getCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleRemove = (index: number) => {
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  function handleIncrease(ind: number) {
    setCartItems((prev) => {
      const updateData = [...prev];
      updateData[ind] = {
        ...updateData[ind],
        quantity: updateData[ind].quantity + 1,
      };
      return updateData;
    });
  }
  function handledDecrease(ind: number) {
    setCartItems((prev) => {
      const updateData = [...prev];
      updateData[ind] = {
        ...updateData[ind],
        quantity:
          updateData[ind].quantity > 0
            ? updateData[ind].quantity - 1
            : updateData[ind].quantity,
      };
      return updateData;
    });
  }
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
                      <tr key={ind}>
                        <td className="product-item-img">
                          <Image
                            height={100}
                            width={100}
                            src={
                              data.productDetails.image[0]?.url ||
                              "/fallback.jpg"
                            }
                            alt="/"
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
                              <span
                                className="input-group-addon bootstrap-touchspin-prefix"
                                style={{ display: "none" }}
                              ></span>
                              <input
                                type="text"
                                value={data.quantity}
                                name="demo_vertical2"
                                className="form-control"
                                style={{ display: "block" }}
                                readOnly
                              />
                              <span
                                className="input-group-addon bootstrap-touchspin-postfix"
                                style={{ display: "none" }}
                              ></span>
                              <span className="input-group-btn-vertical">
                                <button
                                  className="btn btn-default bootstrap-touchspin-up"
                                  type="button"
                                  onClick={() => handleIncrease(ind)}
                                >
                                  <i className="fa-solid fa-plus" />
                                </button>
                                <button
                                  className="btn btn-default bootstrap-touchspin-down"
                                  type="button"
                                  onClick={() => handledDecrease(ind)}
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="product-item-totle">
                          ₦{data.productDetails.price * data.quantity}.00
                        </td>
                        <td className="product-item-close">
                          <Link href="#">
                            <i
                              className="ti-close"
                              onClick={() => handleRemove(ind)}
                            />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="row shop-form m-t30">
                <div className="col-md-6">
                  <div className="form-group">
                    <div className="input-group mb-0">
                      <input
                        name="dzEmail"
                        required
                        type="text"
                        className="form-control"
                        placeholder="Coupon Code"
                      />
                      <div className="input-group-addon">
                        <button
                          name="submit"
                          value="Submit"
                          type="submit"
                          className="btn coupon"
                        >
                          Apply Coupon
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 text-end">
                  <Link href="/shop-standard" className="btn btn-secondary">
                    UPDATE CART
                  </Link>
                </div>
              </div>
            </div>
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
                    <span className=" font-14">FREE</span>
                    <h6 className="dz-title">Enjoy The Product</h6>
                  </div>
                </div>
                <div className="icon-bx-wraper style-4 m-b30">
                  <div className="icon-bx">
                    <Image src={IMAGES.ShopIconBox} alt="/" />
                  </div>
                  <div className="icon-content">
                    <h6 className="dz-title">Enjoy The Product</h6>
                    <p>
                      Lorem Ipsum is simply dummy text of the printing and
                      typesetting
                    </p>
                  </div>
                </div>
                <div className="save-text d-none">
                  <i className="icon feather icon-check-circle"></i>
                  <span className="m-l10 ">
                    You will save ₹504 on this order
                  </span>
                </div>
                <table>
                  <tbody>
                    <tr className="total">
                      <td>
                        <h6 className="mb-0">Total</h6>
                      </td>
                      <td className="price"> ₦{totalPrice}</td>
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
