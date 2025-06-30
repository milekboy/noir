"use client";
import Link from "next/link";
import { useContext, useEffect, useRef, useState } from "react";
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import { Accordion } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import Image from "next/image";
import { CartContext } from "@/components/CartContext";
import router from "next/router";

export default function ShopCheckout() {
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
      callback: async function (data: {
        status: string;
        tx_ref: any;
        transaction_id: any;
      }) {
        console.log("Flutterwave response:", data);

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
              <Accordion
                className="dz-accordion accordion-sm"
                id="accordionFaq"
                defaultActiveKey={"0"}
              >
                <Accordion.Item eventKey="0">
                  <Accordion.Header
                    className="accordion-header"
                    id="headingOne"
                  >
                    Returning customer? Click here to login
                    <span className="toggle-close"></span>
                  </Accordion.Header>
                  <Accordion.Body className="accordion-body">
                    <p className="m-b0">
                      If your order has not yet shipped, you can contact us to
                      change your shipping address
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header
                    className="accordion-header"
                    id="headingTwo"
                  >
                    Have a coupon? Click here to enter your code
                    <span className="toggle-close"></span>
                  </Accordion.Header>
                  <Accordion.Body>
                    <p className="m-b0">
                      If your order has not yet shipped, you can contact us to
                      change your shipping address
                    </p>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
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
                      Apartment <span className="text-danger">*</span>
                    </label>
                    <input
                      name="firstName"
                      value={shippingDetails.apartment}
                      onChange={(e) =>
                        setShippingDetails({
                          ...shippingDetails,
                          apartment: e.target.value,
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
                  <div className="form-group m-b5">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="basic_checkbox_1"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_1"
                      >
                        Create an account?{" "}
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="basic_checkbox_2"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="basic_checkbox_2"
                      >
                        Ship to a different address?
                      </label>
                    </div>
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
                        {" "}
                        ₦{data.productDetails.price}.00
                      </span>
                    </div>
                  </div>
                ))}

                <table>
                  <tbody>
                    <tr className="subtotal">
                      <td>Subtotal</td>
                      <td className="price">₦{totalPrice}</td>
                    </tr>
                    <tr className="title">
                      <td>
                        <h6 className="title font-weight-500">Shipping</h6>
                      </td>
                      <td></td>
                    </tr>
                    <tr className="shipping">
                      <td>
                        <div className="custom-control custom-checkbox">
                          <input
                            className="form-check-input radio"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="flexRadioDefault1"
                          >
                            Free shipping
                          </label>
                        </div>
                        <div className="custom-control custom-checkbox">
                          <input
                            className="form-check-input radio"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault2"
                          />
                          <label
                            className="form-check-label ms-1"
                            htmlFor="flexRadioDefault2"
                          >
                            Flat Rate:
                          </label>
                        </div>
                      </td>
                      <td className="price">0</td>
                    </tr>
                    <tr className="total">
                      <td>Total</td>
                      <td className="price">₦{totalPrice}</td>
                    </tr>
                  </tbody>
                </table>

                <div
                  className="accordion dz-accordion accordion-sm"
                  id="accordionFaq1"
                >
                  <div className="accordion-item">
                    <div className="accordion-header" id="heading1">
                      <div
                        className="accordion-button collapsed custom-control custom-checkbox border-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse1"
                        role="navigation"
                        aria-expanded="true"
                        aria-controls="collapse1"
                      >
                        <input
                          className="form-check-input radio"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault3"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault3"
                        >
                          Direct bank transfer
                        </label>
                      </div>
                    </div>
                    <div
                      id="collapse1"
                      className="accordion-collapse collapse show"
                      aria-labelledby="heading1"
                      data-bs-parent="#accordionFaq1"
                    >
                      <div className="accordion-body">
                        <p className="m-b0">
                          Make your payment directly into our bank account.
                          Please use your Order ID as the payment reference.
                          Your order will not be shipped until the funds have
                          cleared in our account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <div className="accordion-header" id="heading2">
                      <div
                        className="accordion-button collapsed custom-control custom-checkbox border-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse2"
                        role="navigation"
                        aria-expanded="true"
                        aria-controls="collapse2"
                      >
                        <input
                          className="form-check-input radio"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault5"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault5"
                        >
                          Cash on delivery
                        </label>
                      </div>
                    </div>
                    <div
                      id="collapse2"
                      className="accordion-collapse collapse"
                      aria-labelledby="collapse2"
                      data-bs-parent="#accordionFaq1"
                    >
                      <div className="accordion-body">
                        <p className="m-b0">
                          Make your payment directly into our bank account.
                          Please use your Order ID as the payment reference.
                          Your order will not be shipped until the funds have
                          cleared in our account.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-item">
                    <div className="accordion-header" id="heading3">
                      <div
                        className="accordion-button collapsed custom-control custom-checkbox border-0"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapse3"
                        role="navigation"
                        aria-expanded="true"
                        aria-controls="collapse3"
                      >
                        <input
                          className="form-check-input radio"
                          type="radio"
                          name="flexRadioDefault"
                          id="flexRadioDefault4"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexRadioDefault4"
                        >
                          Paypal
                        </label>
                        <Image src={IMAGES.ShopPayment} alt="/" />
                        <Link href="#">What is PayPal?</Link>
                      </div>
                    </div>
                    <div
                      id="collapse3"
                      className="accordion-collapse collapse"
                      aria-labelledby="heading3"
                      data-bs-parent="#accordionFaq1"
                    >
                      <div className="accordion-body">
                        <p className="m-b0">
                          Make your payment directly into our bank account.
                          Please use your Order ID as the payment reference.
                          Your order will not be shipped until the funds have
                          cleared in our account.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text">
                  Your personal data will be used to process your order, support
                  your experience throughout this website, and for other
                  purposes described in our{" "}
                  <Link href="#">privacy policy.</Link>
                </p>
                <div className="form-group">
                  <div className="custom-control custom-checkbox d-flex m-b15">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="basic_checkbox_3"
                    />
                    <label
                      className="form-check-label"
                      htmlFor="basic_checkbox_3"
                    >
                      I have read and agree to the website terms and conditions{" "}
                    </label>
                  </div>
                </div>
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
