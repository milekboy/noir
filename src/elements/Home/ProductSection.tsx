import Link from "next/link";
import { useReducer, useEffect, useState, useContext } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";
import { Modal } from "react-bootstrap";
import { masonryData, headfilterData } from "../../constant/Alldata";
import ModalSlider from "../../components/ModalSlider";
import ProductInputButton from "../Shop/ProductInputButton";
import Image from "next/image";
import { CartContext } from "@/components/CartContext";
import { toast } from "react-toastify";
import {WishlistContext} from "./../../components/WishlistContext";

interface MenuItem {
  image: string;
  discount: string;
  name: string;
  price: string;
  category: string;
  hert: boolean;
  id: number;
}

type HeartIconsState = { [key: number]: boolean };

// Define the initial state
const initialState = {
  heartIcon: {} as HeartIconsState,
  basketIcon: {} as HeartIconsState,
  detailModal: false,
  activeMenu: 0,
  data: masonryData,
};

// Define the reducer function
function reducer(state: typeof initialState, action: any) {
  switch (action.type) {
    case "TOGGLE_HEART":
      return {
        ...state,
        heartIcon: {
          ...state.heartIcon,
          [action.index]: !state.heartIcon[action.index],
        },
      };
    case "TOGGLE_BASKET":
      return {
        ...state,
        basketIcon: {
          ...state.basketIcon,
          [action.index]: !state.basketIcon[action.index],
        },
      };
    case "SET_DETAIL_MODAL":
      return {
        ...state,
        detailModal: action.value,
      };
    case "SET_ACTIVE_MENU":
      return {
        ...state,
        activeMenu: action.index,
      };
    case "SET_DATA":
      return {
        ...state,
        data: action.data,
      };
    default:
      throw new Error();
  }
}

const ProductSection = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleHide = () => {
    dispatch({ type: "SET_DETAIL_MODAL", value: false });
  };

  const filterCategory = (name: string, ind: number) => {
    document.querySelectorAll(".card-container").forEach((ell) => {
      ell.setAttribute("style", "transform:scale(0);");
    });
    dispatch({ type: "SET_ACTIVE_MENU", index: ind });
    const updateData = masonryData.filter((el) => el.category.includes(name));
    dispatch({ type: "SET_DATA", data: updateData });
    setTimeout(() => {
      document.querySelectorAll(".card-container").forEach((ell) => {
        ell.setAttribute(
          "style",
          "transform:scale(1);transition:all .5s linear"
        );
      });
    }, 200);
  };

  const toggleHeart = (index: number) => {
    dispatch({ type: "TOGGLE_HEART", index });
  };

  const toggleBasket = (index: number) => {
    dispatch({ type: "TOGGLE_BASKET", index });
  };

  interface productImages {
    url: string;
  }

  interface PopularProduct {
    productImages: productImages[];
    description: string;
    name: string;
    price: string;
    category: string;
    _id: number;
  }

  const [product, setProduct] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const networkInstance = NetworkInstance();
  const { setCartCount, fetchCartCount } = useContext(CartContext);
  const [categoryName, setCategoryName] = useState<string | null>("");
  const {wishListCount, setWishListCount} = useContext(WishlistContext);

  useEffect(() => {
    async function displayProduct() {
      try {
        const res = await networkInstance.get("/product/get-all-products");
        console.log(res.data);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }

    displayProduct();
  }, []);

  const addToCart = async (props: any) => {
       setCartCount((prev: number) => prev + 1);
    const payload: Record<string, any> = {
      productId: props._id,
      categoryId: props.category,
      quantity: 1,
    };

    const existingCartId = localStorage.getItem("cartId");
    if (existingCartId) {
      payload.cartId = existingCartId;
    }
    // } else {
    //   setCartCount((prev: number) => prev + 1);
    // }

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
          autoClose: 5000,
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

  const addToWishlist = async (item: any) => {
    setWishListCount((prev: any) => prev+ 1)
    toast("Product added to wishlist", {
          theme: "dark",
          hideProgressBar: true,
          position: "bottom-right",
          autoClose: 2000,
        });
    const payload: Record<string, any> = {
      productId: item._id,
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
  // Add this near your other state declarations
  const [categoryMap, setCategoryMap] = useState<{ [key: string]: string }>({});

  // Replace the existing getCategoryName function with this improved version
  const getCategoryName = async (item: any) => {
    // First check if we already have the category name cached
    if (categoryMap[item.category]) {
      setCategoryName(categoryMap[item.category]);
      return categoryMap[item.category];
    }

    if (item.category) {
      try {
        const response = await NetworkInstance().get(
          `category/get-category/${item.category}`
        );
        if (response?.status === 200) {
          // Cache the result
          setCategoryMap((prev) => ({
            ...prev,
            [item.category]: response.data.label,
          }));
          setCategoryName(response.data.label);
          return response.data.label;
        }
      } catch (error) {
        console.error("Error fetching category name:", error);
        return "";
      }
    }
    return "";
  };

  // useEffect(() => {
  //   setCategoryName(categoryName);
  // }, [categoryName]);

  // Add this useEffect after your other useEffects
  useEffect(() => {
    // Pre-fetch all category names
    const fetchAllCategories = async () => {
      if (product.length > 0) {
        const uniqueCategories = [
          ...new Set(product.map((item) => item.category)),
        ];
        for (const category of uniqueCategories) {
          if (!categoryMap[category]) {
            try {
              const response = await NetworkInstance().get(
                `category/get-category/${category}`
              );
              if (response?.status === 200) {
                setCategoryMap((prev) => ({
                  ...prev,
                  [category]: response.data.label,
                }));
              }
            } catch (error) {
              console.error(`Error fetching category ${category}:`, error);
            }
          }
        }
      }
    };

    fetchAllCategories();
  }, [product]);

  // Loading skeleton component
  const LoadingSkeleton = () => {
    return (
      <div className="row g-xl-4 g-3">
        {Array.from({ length: 8 }).map((_, ind) => (
          <div key={ind} className="col-6 col-xl-3 col-lg-3 col-md-4 col-sm-6">
            <div className="shop-card">
              <div
                className="dz-media"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "350px",
                  overflow: "hidden",
                  position: "relative",
                  backgroundColor: "#e0e0e0",
                  borderRadius: "25px", // All corners rounded
                }}
              >
                {/* Shining effect */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    animation: "shine 2s ease-in-out infinite",
                    animationDelay: `${ind * 0.1}s`,
                  }}
                />
              </div>

              <div className="dz-content">
                <div
                  style={{
                    width: "50%",
                    height: "20px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shining effect for title */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      animation: "shine 2s ease-in-out infinite",
                      animationDelay: `${ind * 0.1 + 0.3}s`,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: "30%",
                    height: "18px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "4px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shining effect for price */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      animation: "shine 2s ease-in-out infinite",
                      animationDelay: `${ind * 0.1 + 0.5}s`,
                    }}
                  />
                </div>
              </div>
              <div className="product-tag">
                <div
                  style={{
                    width: "80px",
                    height: "24px",
                    backgroundColor: "#e0e0e0",
                    borderRadius: "12px",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Shining effect for badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                      animation: "shine 2s ease-in-out infinite",
                      animationDelay: `${ind * 0.1 + 0.7}s`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
        <style jsx>{`
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 100%;
            }
          }
        `}</style>
      </div>
    );
  };

  //   useEffect(() => {
  //     getProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    <>
      <div className="row justify-content-md-between align-items-start">
        <div className="col-lg-6 col-md-12">
          <div className="section-head style-1 m-b30 ">
            <div className="left-content">
              <h2 className="title" style={{ color: "#000" }}>
                Most popular products
              </h2>
            </div>
          </div>
        </div>
        <div className="col-lg-6 col-md-12">
          <div className="site-filters clearfix style-1 align-items-center ms-lg-auto">
            <ul className="filters">
              {headfilterData.map((item, ind) => (
                <li
                  className={`btn ${state.activeMenu === ind ? "active" : ""}`}
                  key={ind}
                  onClick={() => {
                    filterCategory(item.title, ind);
                  }}
                >
                  <input type="radio" />
                  <Link href={"#"}>{item.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="clearfix">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <ul id="masonry" className="row g-xl-4 g-3">
            {product.slice(0, 8).map((item, ind) => (
              <div
                className="card-container col-6 col-xl-3 col-lg-3 col-md-4 col-sm-6 Tops wow fadeInUp"
                data-wow-delay="0.6s"
                key={item._id}
              >
                {/* ✅ Wrap whole card in Link */}
                {/* <Link
                  href={`/collections/${categoryName}/${item._id}`}
                  onMouseEnter={() => getCategoryName(item)}
                  onMouseLeave={() => setCategoryName("")}
                  onClick={() => getCategoryName(item)}
                  style={{ textDecoration: "none", color: "inherit" }}
                > */}
                <div className="shop-card" style={{ cursor: "pointer" }}>
                  <div
                    className="dz-media"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "350px",
                      overflow: "hidden",
                      position: "relative",
                      zIndex: -10,
                    }}
                  >
                    <Image
                      src={
                        item.productImages[0]?.url ||
                        "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
                      }
                      alt={item.name}
                      width={200}
                      height={200}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />

                    <div className="shop-meta">
                      {/* ✅ Restored the View button */}
                      <Link
                        href={`/collections/${
                          categoryMap[item.category] || "loading"
                        }/${item._id}`}
                        className="btn btn-secondary btn-md btn-rounded"
                        onClick={(e) => {
                          // If we don't have the category name yet, prevent navigation
                          if (!categoryMap[item.category]) {
                            e.preventDefault();
                            getCategoryName(item).then((categoryName) => {
                              if (categoryName) {
                                window.location.href = `/collections/${categoryName}/${item._id}`;
                              }
                            });
                          }
                        }}
                        onMouseEnter={() => getCategoryName(item)}
                      >
                        <i className="fa-solid fa-eye d-md-none d-block" />
                        <span className="d-md-block d-none">View</span>
                      </Link>

                      <div
                        className={`btn btn-primary meta-icon dz-wishicon ${
                          state.heartIcon[ind] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleHeart(ind);
                          addToWishlist(item);
                        }}
                      >
                        <i className="icon feather icon-heart dz-heart" />
                        <i className="icon feather icon-heart-on dz-heart-fill" />
                      </div>

                      <div
                        className={`btn btn-primary meta-icon dz-carticon ${
                          state.basketIcon[ind] ? "active" : ""
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleBasket(ind);
                          addToCart(item);
                        }}
                      >
                        <i className="flaticon flaticon-basket" />
                        <i className="flaticon flaticon-basket-on dz-heart-fill" />
                      </div>
                    </div>
                  </div>

                  <div className="dz-content">
                    <h5 className="title">{item.name}</h5>
                    <h5 className="price">&#8358;{item.price}</h5>
                  </div>
                  <div className="product-tag">
                    <span className="badge">Get 20% Off</span>
                  </div>
                </div>
                {/* </Link> */}
              </div>
            ))}
          </ul>
        )}
        <div className="d-flex justify-content-center align-items-center my-5">
          <Link
            href="/collections"
            className="btn btn-primary bg-black border-black  "
          >
            See more products
          </Link>
        </div>
      </div>
      <Modal
        className="quick-view-modal"
        show={state.detailModal}
        onHide={handleHide}
        centered
      >
        <button type="button" className="btn-close" onClick={handleHide}>
          <i className="icon feather icon-x" />
        </button>
        <div className="modal-body">
          <div className="row g-xl-4 g-3">
            <div className="col-xl-6 col-md-6">
              <div className="dz-product-detail mb-0">
                <ModalSlider />
              </div>
            </div>
            <div className="col-xl-6 col-md-6">
              <div className="dz-product-detail style-2 ps-xl-3 ps-0 pt-2 mb-0">
                <div className="dz-content">
                  <div className="dz-content-footer">
                    <div className="dz-content-start">
                      <span className="badge bg-secondary mb-2">
                        SALE 20% Off
                      </span>
                      <h4 className="title mb-1">
                        <Link href="/shop-list">
                          Cozy Knit Cardigan Sweater
                        </Link>
                      </h4>
                      <div className="review-num">
                        <ul className="dz-rating me-2">
                          <li className="star-fill">
                            <i className="flaticon-star-1" />
                          </li>
                          <li className="star-fill">
                            <i className="flaticon-star-1" />
                          </li>
                          <li className="star-fill">
                            <i className="flaticon-star-1" />
                          </li>
                          <li>
                            <i className="flaticon-star-1" />
                          </li>
                          <li>
                            <i className="flaticon-star-1" />
                          </li>
                        </ul>
                        <span className="text-secondary me-2">4.7 Rating</span>
                        <Link href={"#"}>(5 customer reviews)</Link>
                      </div>
                    </div>
                  </div>
                  <p className="para-text">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has.
                  </p>
                  <div className="meta-content m-b20 d-flex align-items-end">
                    <div className="me-3">
                      <span className="form-label">Price</span>
                      <span className="price">
                        $125.75 <del>$132.17</del>
                      </span>
                    </div>
                    <div className="btn-quantity light me-0">
                      <label className="form-label">Quantity</label>
                      <ProductInputButton />
                    </div>
                  </div>
                  <div className=" cart-btn">
                    <Link
                      href="/shop-cart"
                      className="btn btn-secondary text-uppercase"
                    >
                      Add To Cart
                    </Link>
                    <Link
                      href="/shop-wishlist"
                      className="btn btn-md btn-outline-secondary btn-icon"
                    >
                      <svg
                        width="19"
                        height="17"
                        viewBox="0 0 19 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.24805 16.9986C8.99179 16.9986 8.74474 16.9058 8.5522 16.7371C7.82504 16.1013 7.12398 15.5038 6.50545 14.9767L6.50229 14.974C4.68886 13.4286 3.12289 12.094 2.03333 10.7794C0.815353 9.30968 0.248047 7.9162 0.248047 6.39391C0.248047 4.91487 0.755203 3.55037 1.67599 2.55157C2.60777 1.54097 3.88631 0.984375 5.27649 0.984375C6.31552 0.984375 7.26707 1.31287 8.10464 1.96065C8.52734 2.28763 8.91049 2.68781 9.24805 3.15459C9.58574 2.68781 9.96875 2.28763 10.3916 1.96065C11.2292 1.31287 12.1807 0.984375 13.2197 0.984375C14.6098 0.984375 15.8885 1.54097 16.8202 2.55157C17.741 3.55037 18.248 4.91487 18.248 6.39391C18.248 7.9162 17.6809 9.30968 16.4629 10.7792C15.3733 12.094 13.8075 13.4285 11.9944 14.9737C11.3747 15.5016 10.6726 16.1001 9.94376 16.7374C9.75136 16.9058 9.50417 16.9986 9.24805 16.9986ZM5.27649 2.03879C4.18431 2.03879 3.18098 2.47467 2.45108 3.26624C1.71033 4.06975 1.30232 5.18047 1.30232 6.39391C1.30232 7.67422 1.77817 8.81927 2.84508 10.1066C3.87628 11.3509 5.41011 12.658 7.18605 14.1715L7.18935 14.1743C7.81021 14.7034 8.51402 15.3033 9.24654 15.9438C9.98344 15.302 10.6884 14.7012 11.3105 14.1713C13.0863 12.6578 14.6199 11.3509 15.6512 10.1066C16.7179 8.81927 17.1938 7.67422 17.1938 6.39391C17.1938 5.18047 16.7858 4.06975 16.045 3.26624C15.3152 2.47467 14.3118 2.03879 13.2197 2.03879C12.4197 2.03879 11.6851 2.29312 11.0365 2.79465C10.4585 3.24179 10.0558 3.80704 9.81975 4.20255C9.69835 4.40593 9.48466 4.52733 9.24805 4.52733C9.01143 4.52733 8.79774 4.40593 8.67635 4.20255C8.44041 3.80704 8.03777 3.24179 7.45961 2.79465C6.811 2.29312 6.07643 2.03879 5.27649 2.03879Z"
                          fill="black"
                        ></path>
                      </svg>
                      Add To Wishlist
                    </Link>
                  </div>
                  <div className="dz-info mb-0">
                    <ul>
                      <li>
                        <strong>SKU:</strong>
                      </li>
                      <li>PRT584E63A</li>
                    </ul>
                    <ul>
                      <li>
                        <strong>Category:</strong>
                      </li>
                      <li>
                        <Link href="/shop-standard">Dresses,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Jeans,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Swimwear,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Summer,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Clothing</Link>
                      </li>
                    </ul>
                    <ul>
                      <li>
                        <strong>Tags:</strong>
                      </li>
                      <li>
                        <Link href="/shop-standard">Casual</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Athletic,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Workwear,</Link>
                      </li>
                      <li>
                        <Link href="/shop-standard">Accessories</Link>
                      </li>
                    </ul>
                    <div className="dz-social-icon">
                      <ul>
                        <li>
                          <Link
                            target="_blank"
                            className="text-dark"
                            href="https://www.facebook.com/dexignzone"
                          >
                            <i className="fab fa-facebook-f" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            className="text-dark"
                            href="https://www.behance.net/dexignzone"
                          >
                            <i className="fa-brands fa-behance" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            className="text-dark"
                            href="https://www.youtube.com/@dexignzone1723"
                          >
                            <i className="fa-brands fa-youtube" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            className="text-dark"
                            href="https://www.linkedin.com/showcase/3686700/admin/"
                          >
                            <i className="fa-brands fa-linkedin-in" />
                          </Link>
                        </li>
                        <li>
                          <Link
                            target="_blank"
                            className="text-dark"
                            href="https://www.instagram.com/dexignzone/"
                          >
                            <i className="fab fa-instagram" />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProductSection;
