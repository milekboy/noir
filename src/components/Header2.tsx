"use client";
import { Offcanvas } from "react-bootstrap";
import IMAGES from "../constant/theme";
import { Fragment, useContext, useEffect, useReducer, useState } from "react";
import Link from "next/link";
import HeadSearchBar from "./HeadSearchBar";
import HeaderSideShoppingCard from "./HeaderSideShopingCard";
import Header2Menus from "./Header2Menus";
import CategoryMenuItem from "./CategoryMenuItem";
import Categorydropdown from "./CategoryDropdown";
import Image from "next/image";
import NetworkInstance from "@/app/api/NetworkInstance";
import { usePathname } from "next/navigation";
import { get } from "http";
import useCartContext, { CartContext, CartProvider } from "./CartContext";
import useWishListContext, {
  WishlistContext,
  WishlistProvider,
} from "./WishlistContext";
import SearchInput from "./SearchInput";

interface State {
  headerFix: boolean;
  isBottom: boolean;
  isActive: boolean;
  previousScroll: number;
  openSidebar: boolean;
  openSearchBar: boolean;
  headShoppingSidebar: boolean;
  basketShoppingCard: boolean;
  categoryActive: boolean;
}

type Action =
  | { type: "FIX_HEADER"; payload: boolean }
  | { type: "FIX_BOTTOM"; payload: boolean }
  | { type: "SET_IS_ACTIVE"; payload: boolean }
  | { type: "SET_PREVIOUS_SCROLL"; payload: number }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_SEARCH_BAR" }
  | { type: "TOGGLE_HEAD_SHOPPING_SIDEBAR" }
  | { type: "TOGGLE_BASKET_SHOPPING_CARD" }
  | { type: "TOGGLE_CATEGORY_ACTIVE" };

const initialState = {
  headerFix: false,
  isBottom: false,
  isActive: false,
  previousScroll: 0,
  openSidebar: false,
  openSearchBar: false,
  headShoppingSidebar: false,
  basketShoppingCard: false,
  categoryActive: false,
};
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

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FIX_HEADER":
      return { ...state, headerFix: action.payload };
    case "FIX_BOTTOM":
      return { ...state, isBottom: action.payload };
    case "SET_IS_ACTIVE":
      return { ...state, isActive: action.payload };
    case "SET_PREVIOUS_SCROLL":
      return { ...state, previousScroll: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, openSidebar: !state.openSidebar };
    case "TOGGLE_SEARCH_BAR":
      return { ...state, openSearchBar: !state.openSearchBar };
    case "TOGGLE_HEAD_SHOPPING_SIDEBAR":
      return { ...state, headShoppingSidebar: !state.headShoppingSidebar };
    case "TOGGLE_BASKET_SHOPPING_CARD":
      return { ...state, basketShoppingCard: !state.basketShoppingCard };
    case "TOGGLE_CATEGORY_ACTIVE":
      return { ...state, categoryActive: !state.categoryActive };
    default:
      throw new Error();
  }
}

export const CategoryMenu = ({ state, handleToggleClick }: any) => {
  return (
    <div className="browse-category-menu  bg-primar d-md-none d-lg-block">
      <div className="d-flex ">
        <Link
          href="#"
          className={`category-btn  bg-blac ${
            state.categoryActive ? "active" : ""
          } `}
          onClick={handleToggleClick}
        >
          <div className="category-menu me-3 ">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </Link>
        {/* <Image src={IMAGES.logo} alt="logo" /> */}
      </div>

      <div
        className="category-menu-items"
        style={{
          display: state.categoryActive ? "block" : "none",
          transition: "all 0.5s ease",
        }}
      >
        <CategoryMenuItem />
      </div>
    </div>
  );
};

export default function Header2() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [transparent, setTransparent] = useState(true);
  const [wishlist, setWishlist] = useState<WishlistType[]>([]);
  const router = usePathname();
  const { setCartCount, fetchCartCount, cartCount } = useContext(CartContext);
  const { wishListCount, setWishListCount, fetchWishListCount } =
    useContext(WishlistContext);

  const scrollHandler = () => {
    if (window.scrollY > 80) {
      dispatch({ type: "FIX_HEADER", payload: true });
      setTransparent(false);
    } else {
      dispatch({ type: "FIX_HEADER", payload: false });
      setTransparent(true);
    }
  };
  const handleToggleClick = () => {
    dispatch({ type: "TOGGLE_CATEGORY_ACTIVE" });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 768) {
        const currentScroll = window.scrollY;
        const bodyHeight = document.body.scrollHeight;
        const windowHeight = window.innerHeight;
        dispatch({
          type: "FIX_BOTTOM",
          payload: currentScroll + windowHeight >= bodyHeight,
        });
        dispatch({
          type: "SET_IS_ACTIVE",
          payload: currentScroll > state.previousScroll,
        });
        dispatch({ type: "SET_PREVIOUS_SCROLL", payload: currentScroll });
      }
    };
    const combinedHandler = () => {
      scrollHandler();
      handleScroll();
    };
    window.addEventListener("scroll", combinedHandler);
    return () => {
      window.removeEventListener("scroll", combinedHandler);
    };
  }, [state.previousScroll]);

  const [cartItems, setCartItems] = useState([]);

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
  }, [cartItems]);
  // console.log("cartItems", cartItems);

  useEffect(() => {
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
    getWishlist();
  }, [wishlist]);

  const [targetDate] = useState(() => {
    const t = new Date();
    // example: 13 days, 2 hours, 3 minutes, 34 seconds from now
    t.setDate(t.getDate() + 13);
    t.setHours(t.getHours() + 2);
    t.setMinutes(t.getMinutes() + 3);
    t.setSeconds(t.getSeconds() + 34);
    return t;
  });
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function update() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;
      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ days, hours, minutes, seconds });
    }

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  // console.log("cartcount", cartCount);

  return (
    <Fragment>
      <header className="site-header mo-left header style-2">
        <div className="bg-black d-flex align-items-center  px-5 py-1 justify-content-between ">
          <div className="d-flex justify-content-between align-items-center gap-2 mx-auto text-white">
            LunchSale! Up to 50% Off on Selected Items.
            <div className="d-fle justify-content-between align-items-center gap-2 text-secondary">
              <span
                className="px-1 bg-white rounded-sm "
                // style={{ fontSize: "14px!important" }}
              >
                {timeLeft.days}
              </span>
              <span
                className="px-1 text-white fs-6"
                style={{ fontSize: "14px!important" }}
              >
                Days
              </span>
              <span className="px-1 bg-white rounded-sm">{timeLeft.hours}</span>
              <span
                className="px-1 text-white fs-6"
                style={{ fontSize: "14px!important" }}
              >
                Hr
              </span>
              <span className="px-1 bg-white rounded-sm">
                {timeLeft.minutes}
              </span>
              <span
                className="px-1 text-white fs-6"
                style={{ fontSize: "14px!important" }}
              >
                Min
              </span>
              <span
                className="px-1 bg-white rounded-sm"
                style={{ fontSize: "16px!important" }}
              >
                {timeLeft.seconds}
              </span>
              <span
                className="px-1 text-white fs-6"
                style={{ fontSize: "14px!important" }}
              >
                Sec
              </span>
            </div>
            {/* <p className="bg-primary">Limited Offer New Arrivals 🎉</p> */}
          </div>
          <div className=" ">
            <Link
              href={"/help-and-support"}
              className="text-white me-2 text-underline text-lg"
            >
              Help
            </Link>
            <span className="me-2">|</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 32 32"
            >
              <path fill="#fff" d="M10 4H22V28H10z"></path>
              <path
                d="M5,4h6V28H5c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                fill="#3b8655"
              ></path>
              <path
                d="M25,4h6V28h-6c-2.208,0-4-1.792-4-4V8c0-2.208,1.792-4,4-4Z"
                transform="rotate(180 26 16)"
                fill="#3b8655"
              ></path>
              <path
                d="M27,4H5c-2.209,0-4,1.791-4,4V24c0,2.209,1.791,4,4,4H27c2.209,0,4-1.791,4-4V8c0-2.209-1.791-4-4-4Zm3,20c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V8c0-1.654,1.346-3,3-3H27c1.654,0,3,1.346,3,3V24Z"
                opacity=".15"
              ></path>
              <path
                d="M27,5H5c-1.657,0-3,1.343-3,3v1c0-1.657,1.343-3,3-3H27c1.657,0,3,1.343,3,3v-1c0-1.657-1.343-3-3-3Z"
                fill="#fff"
                opacity=".2"
              ></path>
            </svg>
          </div>
        </div>
        <div
          className={`sticky-header main-bar-wraper navbar-expand-lg   ${
            state.headerFix ? "is-fixed" : ""
          }`}
        >
          <div
            className={`main-bar clearfix ${
              transparent ? "bg-transparent" : ""
            }`}
            style={{
              boxShadow: transparent ? "none" : "0 2px 10px rgba(0,0,0,0.1)",
            }}
          >
            <div className="container clearfix d-lg-flex d-block">
              {/* <!-- Website Logo --> */}
              {/* <CategoryMenu state={state} handleToggleClick={handleToggleClick} /> */}
              <div className="logo-header  d-md-flex justify-content-start flex-row logo-dark d-lg-none">
                <CategoryMenu
                  state={state}
                  handleToggleClick={handleToggleClick}
                />
                <Link href="/">
                  <Image src={IMAGES.logo} alt="logo" className="" />
                </Link>
              </div>

              {/* <!-- Nav Toggle Button --> */}
              <button
                className={`navbar-toggler collapsed navicon justify-content-end ${
                  state.openSidebar ? "open" : ""
                }`}
                onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {/* <!-- Main Nav --> */}
              <div
                className={`header-nav w3menu navbar-collapse collapse justify-content-start ${
                  state.openSidebar ? "show" : ""
                }`}
              >
                <CategoryMenu
                  state={state}
                  handleToggleClick={handleToggleClick}
                />
                <div className="logo-heade logs">
                  <Link href="/">
                    <Image src={IMAGES.logo} alt="logo" className="w-md-100" />
                  </Link>
                </div>
                <div></div>
                <div></div>
                {/* {router === "/collections" || router === "/" ? ( */}
                <SearchInput />
                {/* ) : null} */}
                {/* ---------------------------------------- */}
                <ul className="nav navbar-nav  w-100 d-md-none d-sm-none">
                  <Header2Menus />
                </ul>
                <div className="dz-social-icon d-none">
                  <ul>
                    <li>
                      <Link
                        className="fab fa-facebook-f"
                        target="_blank"
                        href="https://www.facebook.com/dexignzone"
                      ></Link>
                    </li>
                    <li>
                      <Link
                        className="fab fa-twitter"
                        target="_blank"
                        href="https://twitter.com/dexignzones"
                      ></Link>
                    </li>
                    <li>
                      <Link
                        className="fab fa-linkedin-in"
                        target="_blank"
                        href="https://www.linkedin.com/showcase/3686700/admin/"
                      ></Link>
                    </li>
                    <li>
                      <Link
                        className="fab fa-instagram"
                        target="_blank"
                        href="https://www.instagram.com/dexignzone/"
                      ></Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* <!-- EXTRA NAV --> */}
              <div
                className={`extra-nav ${state.isBottom ? "bottom-end" : ""} ${
                  state.isActive ? "active" : ""
                }`}
              >
                <div className="extra-cell">
                  <ul className="header-right">
                    <li className="nav-item login-link">
                      <Link className="nav-link" href="/login">
                        Login / Register
                      </Link>
                    </li>

                    <li className="nav-item search-link d-lg-none">
                      <Link
                        href="#"
                        className="nav-link"
                        onClick={() => dispatch({ type: "TOGGLE_SEARCH_BAR" })}
                      >
                        <i className="iconly-Light-Search" />
                      </Link>
                    </li>

                    <li className="nav-item wishlist-link">
                      <Link
                        className="nav-link"
                        href={"#"}
                        onClick={() =>
                          dispatch({ type: "TOGGLE_HEAD_SHOPPING_SIDEBAR" })
                        }
                      >
                        <i className="iconly-Light-Heart2" />
                        <span className="badge badge-circle">
                          {wishListCount}
                        </span>
                      </Link>
                    </li>
                    <li className="nav-item cart-link">
                      <Link
                        href={"#"}
                        className="nav-link cart-btn"
                        onClick={() =>
                          dispatch({ type: "TOGGLE_BASKET_SHOPPING_CARD" })
                        }
                      >
                        <i className="iconly-Broken-Buy" />
                        <span className="badge badge-circle">{cartCount}</span>
                        {/* <span className="badge badge-circle">{CartContext}</span> */}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/*  SearchBar  */}
      <Offcanvas
        className="dz-search-area dz-offcanvas offcanvas-top"
        show={state.openSearchBar}
        onHide={() => dispatch({ type: "TOGGLE_SEARCH_BAR" })}
        placement={"top"}
      >
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={() => dispatch({ type: "TOGGLE_SEARCH_BAR" })}
        >
          &times;
        </button>
        <HeadSearchBar />
      </Offcanvas>
      {/*  SearchBar  */}

      {/*  Sidebar cart  */}
      <Offcanvas
        className="dz-offcanvas offcanvas-end"
        placement="end"
        tabIndex={-1}
        show={state.headShoppingSidebar}
        onHide={() => dispatch({ type: "TOGGLE_HEAD_SHOPPING_SIDEBAR" })}
      >
        <button
          type="button"
          className="btn-close"
          onClick={() => dispatch({ type: "TOGGLE_HEAD_SHOPPING_SIDEBAR" })}
        >
          &times;
        </button>
        <div className="offcanvas-body">
          <div className="product-description">
            <HeaderSideShoppingCard tabactive="Wishlist" />
          </div>
        </div>
      </Offcanvas>

      {/*  Shopping Sidebar Basket   */}
      <Offcanvas
        className="dz-offcanvas offcanvas-end"
        placement="end"
        tabIndex={-1}
        show={state.basketShoppingCard}
        onHide={() => dispatch({ type: "TOGGLE_BASKET_SHOPPING_CARD" })}
      >
        <button
          type="button"
          className="btn-close"
          onClick={() => dispatch({ type: "TOGGLE_BASKET_SHOPPING_CARD" })}
        >
          &times;
        </button>
        <div className="offcanvas-body">
          <div className="product-description">
            <HeaderSideShoppingCard tabactive="ShoppingCart" />
          </div>
        </div>
      </Offcanvas>
    </Fragment>
  );
}
