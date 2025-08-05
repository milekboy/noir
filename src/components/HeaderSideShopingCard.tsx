"use client";
import { useState, useEffect } from "react";
import { Tab, Nav } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import Link from "next/link";
import { ShopProductItem, ShopProductItemtype } from "../constant/Alldata";
import Image from "next/image";

interface propType {
  tabactive: string;
}

interface Images {
  url: string;
  public_id: string;
  filename: string;
}
interface WishlistType {
  _id: string;
  name: string;
  price: number;
  category: string;
  productImages: Images[];
}
export default function HeaderSideShoppingCard(props: propType) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
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
  const [arayitem, setArrayitem] =
    useState<ShopProductItemtype[]>(ShopProductItem);
  const [shoppingItem, setShoppingItem] =
    useState<ShopProductItemtype[]>(ShopProductItem);

  const handleRemove = async (index: number) => {
    const cartId = localStorage.getItem("cartId");
    const item = cartItems[index];
    setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));

    try {
      await networkInstance.delete(`/cart/remove/${cartId}`, {
        data: {
          productId: item.product,
          quantity: item.quantity,
        },
      });
    } catch (err: any) {
      console.log(err);
    }
  };
  const handlePrice = (index: number) => {
    setShoppingItem((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  async function handleIncrease(ind: number) {
    const cartId = localStorage.getItem("cartId");
    const item = cartItems[ind];

    setCartItems((prev) => {
      const updateData = [...prev];
      updateData[ind] = {
        ...updateData[ind],
        quantity: updateData[ind].quantity + 1,
      };
      return updateData;
    });

    try {
      await networkInstance.put(`/cart/update-quantity/${cartId}`, {
        productId: item.product,
        quantity: 1,
      });
    } catch (err: any) {
      console.log("Error increasing quantity: ", err);
    }
  }
  async function handledDecrease(ind: number) {
    const cartId = localStorage.getItem("cartId");
    const item = cartItems[ind];

    setCartItems((prev) => {
      const updateData = [...prev];
      updateData[ind] = {
        ...updateData[ind],
        quantity: updateData[ind].quantity - 1,
      };
      return updateData;
    });

    try {
      await networkInstance.put(`/cart/update-quantity/${cartId}`, {
        productId: item.product,
        quantity: -1,
      });
    } catch (err: any) {
      console.log("Error increasing quantity: ", err);
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.productDetails.price * item.quantity,

    0
  );

  const getWishlist = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      const res = await NetworkInstance().get("/wishlist", {
        headers: {
          "x-session-id": sessionId,
        },
      });

      setWishlist(res.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  async function handleDelete(productId: string, index: number) {
    setWishlist((prev) => prev.filter((_, i) => i !== index));
    try {
      const sessionId = localStorage.getItem("sessionId");
      await NetworkInstance().delete(`/wishlist/${productId}`, {
        headers: {
          "x-session-id": sessionId,
        },
      });
    } catch (err: any) {
      console.log("error: ", err);
    }
  }
  useEffect(() => {
    getWishlist();
  }, []);
  return (
    <div className="dz-tabs">
      <Tab.Container defaultActiveKey={props.tabactive}>
        <Nav as="ul" className="nav nav-tabs center">
          <Nav.Item as="li">
            <Nav.Link as="button" className="nav-link" eventKey="ShoppingCart">
              Shopping Cart
              <span className="badge badge-light">{cartItems.length}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item as="li">
            <Nav.Link as="button" eventKey="Wishlist">
              Wishlist
              <span className="badge badge-light">{wishlist.length}</span>
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content className="pt-4" id="dz-shopcart-sidebar">
          <Tab.Pane eventKey="ShoppingCart">
            <div className="shop-sidebar-cart">
              <ul className="sidebar-cart-list">
                {cartItems.map((elem, index) => (
                  <li key={index}>
                    <div className="cart-widget">
                      <div className="dz-media me-3">
                        <Image
                          width={100}
                          height={100}
                          src={
                            elem.productDetails.image[0]?.url || "/fallback.jpg"
                          }
                          alt="card"
                        />
                      </div>
                      <div className="cart-content">
                        <h6 className="title">
                          <Link href="/product-thumbnail">
                            {" "}
                            {elem.productDetails.name}
                          </Link>
                        </h6>
                        <div className="d-flex align-items-center">
                          <div className="btn-quantity light quantity-sm me-3">
                            <div className="input-group bootstrap-touchspin">
                              <span
                                className="input-group-addon bootstrap-touchspin-prefix"
                                style={{ display: "none" }}
                              ></span>
                              <input
                                type="text"
                                value={elem.quantity}
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
                                  onClick={() => handleIncrease(index)}
                                >
                                  <i className="fa-solid fa-plus" />
                                </button>
                                <button
                                  className="btn btn-default bootstrap-touchspin-down"
                                  type="button"
                                  onClick={() => handledDecrease(index)}
                                >
                                  <i className="fa-solid fa-minus" />
                                </button>
                              </span>
                            </div>
                          </div>
                          <h6 className="dz-price mb-0">
                            ₦{elem.productDetails.price * elem.quantity}.00
                          </h6>
                        </div>
                      </div>
                      <Link
                        href="#"
                        className="dz-close"
                        onClick={() => handleRemove(index)}
                      >
                        <i className="ti-close" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cart-total">
                <h5 className="mb-0">Subtotal:</h5>
                <h5 className="mb-0"> ₦{totalPrice}.00</h5>
              </div>
              <div className="mt-auto">
                <div className="shipping-time">
                  <div className="dz-icon">
                    <i className="flaticon flaticon-ship" />
                  </div>
                  <div className="shipping-content">
                    <h6 className="title pe-4">
                      Congratulations , you've got free shipping!
                    </h6>
                    <div className="progress">
                      <div
                        className="progress-bar progress-animated border-0"
                        style={{ width: "75%" }}
                      >
                        <span className="sr-only">75% Complete</span>
                      </div>
                    </div>
                  </div>
                </div>
                <Link
                  href="/shop-checkout"
                  className="btn btn-outline-secondary btn-block m-b20"
                >
                  Checkout
                </Link>
                <Link href="/shop-cart" className="btn btn-secondary btn-block">
                  View Cart
                </Link>
              </div>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="Wishlist">
            <div className="shop-sidebar-cart">
              <ul className="sidebar-cart-list">
                {wishlist.map((elem, index) => (
                  <li key={index}>
                    <div className="cart-widget">
                      <div className="dz-media me-3">
                        <Image src={elem.productImages[0].url} width={1000} height={1000} alt="media" />
                      </div>
                      <div className="cart-content">
                        <h6 className="title">
                          <Link href="/product-thumbnail">{elem.name}</Link>
                        </h6>
                        <div className="d-flex align-items-center">
                          <h6 className="dz-price  mb-0">${elem.price}.00</h6>
                        </div>
                      </div>
                      <Link
                        href="#"
                        className="dz-close"
                        onClick={() => handleDelete(elem._id,index)}
                      >
                        <i className="ti-close" />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <Link
                  href="/shop-wishlist"
                  className="btn btn-secondary btn-block"
                >
                  Check Your Favourite
                </Link>
              </div>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}
