"use client";

import { useContext, useEffect, useRef, useState } from "react";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { useRouter } from "next/navigation";
import NetworkInstance from "@/app/api/NetworkInstance";
import Image from "next/image";
import { CartContext } from "@/components/CartContext";

export default function ShopCheckout() {
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingDetails, setShippingDetails] = useState<Shipping>({
    email: "",
    phoneNumber: "",
    fullName: "",
    lastName: "",
    street: "",
    state: "",
    apartment: "",
    city: "",
    firstName: "",
    country: "",
  });
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

  interface Shipping {
    country: string;
    firstName: string;
    lastName: string;
    street: string;
    state: string;
    apartment: string;
    city: string;
    email: string;
    phoneNumber: string;
    fullName: string;
  }
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !document.getElementById("flutterwave-script")
    ) {
      const script = document.createElement("script");
      script.id = "flutterwave-script";
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.async = true;
      script.onload = () => {
        setFlutterwaveLoaded(true);
      };
      document.body.appendChild(script);
    } else {
      setFlutterwaveLoaded(true); // already loaded
    }
  }, []);

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

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.productDetails.price * item.quantity,

    0
  );
  const { setCartCount } = useContext(CartContext);

  const [flutterwaveLoaded, setFlutterwaveLoaded] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const updateShipping = async (e: any) => {
    console.log;
    const requestData = {
      ...shippingDetails,
      fullName:
        `${shippingDetails.firstName} ${shippingDetails.lastName}`.trim(),
    };
    console.log(requestData);
    try {
      const response = await networkInstance.post(
        `/shipping-address/create`,
        requestData
      );
      if (response?.status === 200 || response?.status === 201) {
        const shippingId = response.data.shippingAddress._id;
        localStorage.setItem("shippingId", shippingId);
        console.log(shippingId, "-shippingID");

        makePayment();
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);

    setShippingDetails((prev) => ({
      ...prev,
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      // default empty so user can still type
      country: prev.country,
      state: prev.state,
      city: prev.city,
      street: prev.street,
    }));
  }, []);

  useEffect(() => {
    async function getShippingDetails() {
      try {
        const shippingId = localStorage.getItem("shippingId");
        if (!shippingId) {
          console.log("No shipping ID found.");
          return;
        }

        const res = await networkInstance.get(
          `/shipping-address/get/${shippingId}`
        );
        setShippingDetails(res.data);
      } catch (err) {
        console.log("Error fetching shipping details:", err);
      }
    }

    getShippingDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const publicKey = "FLWPUBK_TEST-f797b2a19e6d343574e84c5c036b2d44-X";
  function initiateFlutter(
    transactionRef: any,
    amount: any,
    customer: {
      email: any;
      phoneNumber: any;
      firstName: any;
      lastName: any;
      ShippingAddressId?: string | null;
    }
  ) {
    if (
      !flutterwaveLoaded ||
      typeof (window as any).FlutterwaveCheckout !== "function"
    ) {
      console.log("script has not been loaded");
      alert("Payment system not ready. Please wait a moment.");
      return;
    }
    console.log("-payment");

    (window as any).FlutterwaveCheckout({
      public_key: publicKey,
      tx_ref: transactionRef,
      amount: amount,
      currency: "NGN",
      customer: {
        email: customer.email,
        phonenumber: customer.phoneNumber,
        name: `${customer.firstName} ${customer.lastName}`,
      },
      redirect_url: "/account-order-confirmation",
      callback: async function (data: {
        status: string;
        tx_ref: any;
        transaction_id: any;
      }) {
        try {
          await networkInstance.post("/order/webhook", {
            data: {
              status: data.status,
              tx_ref: data.tx_ref,
              transaction_id: data.transaction_id,
            },
          });

          if (data.status === "successful") {
            setCartCount(0);
            console.log("Payment successful! Your order is confirmed.");
            localStorage.removeItem("cartId");
            localStorage.removeItem("shippingId");

            router.push("/account-order-confirmation");
          } else {
            console.log("❌ Payment failed or was cancelled.");
          }
        } catch (err) {
          console.error("Error sending status to webhook:", err);
          alert("Something went wrong while updating your payment status.");
        }
      },
      onclose: function () {
        console.log("Payment popup closed");
      },
      customizations: {
        title: "Product Payment",
        description: "Payment for product",
      },
    });
  }
  const makePayment = async () => {
    const cartId = localStorage.getItem("cartId");
    const ShippingAddressId = localStorage.getItem("shippingId");
    if (!cartId) {
      console.log("No cart ID found.");

      return;
    }

    try {
      const cartRes = await networkInstance.get(`/cart/view/${cartId}`);

      // Check for missing products
      if (!cartRes.data.items || cartRes.data.items.length === 0) {
        console.log("No valid items found in cart.");
        return;
      }

      const validItems = cartRes.data.items.filter(
        (item: { productDetails: { name: any } }) =>
          item.productDetails && item.productDetails.name
      );

      if (validItems.length === 0) {
        console.log("Cart items contain invalid products.");
        return;
      }

      const response = await networkInstance.post(`/order/create/${cartId}`, {
        ShippingAddressId,
      });

      if (response?.status === 200 || response?.status === 201) {
        console.log(response);
        const transactionId = response.data.transactionId;
        const customer = {
          email: shippingDetails?.email || "",
          phoneNumber: shippingDetails?.phoneNumber || "",
          firstName: shippingDetails?.firstName || "",
          lastName: shippingDetails?.lastName || "",
          ShippingAddressId: ShippingAddressId,
        };

        initiateFlutter(transactionId, totalPrice, customer);
      }
    } catch (err: any) {
      if (
        err.response?.data?.message?.includes("duplicate key") ||
        err.message?.includes("duplicate key")
      ) {
        localStorage.removeItem("cartId");
        console.log(ShippingAddressId);
        localStorage.removeItem("shippingId");
        alert("You've already placed an order for this cart.");
      }

      console.log("Payment error:", err);
    }
  };

  return (
    <div className="page-content bg-light">
      <CommanBanner
        parentText="Home"
        mainText="Shop Checkout"
        currentText="Shop Checkout"
        image={IMAGES.BackBg1.src}
      />
      <div className="content-inner-1">
        <div className="container">
          <div className="row shop-checkout">
            <div className="col-xl-8">
              <h4 className="title m-b15">Billing details</h4>

              <form className="row" ref={formRef}>
                <div className="col-md-6">
                  <div className="form-group m-b25">
                    <label className="label-title">First Name</label>
                    <input
                      name="firstName"
                      value={shippingDetails.firstName}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          firstName: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group m-b25">
                    <label className="label-title">Last Name</label>
                    <input
                      name="lastName"
                      value={shippingDetails.lastName}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          lastName: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="m-b25 value-select">
                    <label className="label-title">
                      Country / Region <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.country}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          country: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group m-b25">
                    <label className="label-title">
                      Street address <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.street}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          street: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="m-b25 value-select">
                    <label className="label-title">
                      State <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.state}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          state: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="m-b25 value-select">
                    <label className="label-title">
                      City/ Town<span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.city}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          city: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="form-group m-b25">
                    <label className="label-title">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.phoneNumber}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="form-group m-b25">
                    <label className="label-title">
                      Email address <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.email}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          email: e.target.value,
                        })
                      }
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-12 m-b25">
                  <div className="form-group">
                    <label className="label-title">
                      Order notes (optional)
                    </label>
                    <textarea
                      id="comments"
                      placeholder="Notes about your order, e.g. special notes for delivery."
                      className="form-control"
                      name="comment"
                      cols={90}
                      rows={5}
                      required
                    ></textarea>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-xl-4 side-bar">
              <h4 className="title m-b15">Your Order</h4>
              <div className="order-detail sticky-top">
                {cartItems.map((data, ind) => (
                  <div key={ind} className="cart-item style-1">
                    <div className="dz-media">
                      <Image
                        height={200}
                        width={200}
                        src={
                          data.productDetails.image[0]?.url || "/fallback.jpg"
                        }
                        alt="/"
                      />
                    </div>
                    <div className="dz-content">
                      <h6 className="title mb-0">{data.productDetails.name}</h6>
                      <span className="price">
                        ₦{Number(data.productDetails.price).toLocaleString()}.00
                      </span>
                    </div>
                  </div>
                ))}

                <table>
                  <tbody>
                    <tr className="subtotal">
                      <td>Subtotal</td>
                      <td className="price">
                        ₦{Number(totalPrice).toLocaleString()}.00
                      </td>
                    </tr>

                    <tr className="total">
                      <td>Total</td>

                      <td className="price">
                        {" "}
                        ₦{Number(totalPrice).toLocaleString()}.00
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p className="text">
                  Your information is used solely to process your order and
                  enhance your experience on our website. We respect your
                  privacy and never share your data without your consent.
                  {/* <Link href="#">privacy policy.</Link> */}
                </p>

                <button
                  onClick={updateShipping}
                  className="btn btn-secondary w-100"
                >
                  PLACE ORDER
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function FlutterwaveCheckout(arg0: {
  public_key: string | undefined;
  tx_ref: any;
  amount: any;
  currency: string;
  customer: { email: any; phonenumber: any; name: string };
  callback: (data: any) => Promise<void>;
  onclose: () => void;
  customizations: { title: string; description: string };
}) {
  throw new Error("Function not implemented.");
}
