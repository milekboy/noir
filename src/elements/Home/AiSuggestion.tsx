// app/components/ProductSection.tsx
"use client";

import Link from "next/link";
import { useEffect, useReducer } from "react";
import { Modal } from "react-bootstrap";
import { masonryData, headfilterData } from "../../constant/Alldata";
import ModalSlider from "../../components/ModalSlider";
import ProductInputButton from "../Shop/ProductInputButton";
import Image from "next/image";
import AiNetworkInstance from "@/app/api/AiNetworkInstance";

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

interface State {
  heartIcon: HeartIconsState;
  basketIcon: HeartIconsState;
  detailModal: boolean;
  activeMenu: number;
  data: MenuItem[];
}

type Action =
  | { type: "TOGGLE_HEART"; index: number }
  | { type: "TOGGLE_BASKET"; index: number }
  | { type: "SET_DETAIL_MODAL"; value: boolean }
  | { type: "SET_ACTIVE_MENU"; index: number }
  | { type: "SET_DATA"; data: MenuItem[] };

const initialState: State = {
  heartIcon: {},
  basketIcon: {},
  detailModal: false,
  activeMenu: 0,
  data: masonryData,
};

function reducer(state: State, action: Action): State {
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
      return { ...state, detailModal: action.value };
    case "SET_ACTIVE_MENU":
      return { ...state, activeMenu: action.index };
    case "SET_DATA":
      return { ...state, data: action.data };
    default:
      throw new Error("Unhandled action type");
  }
}

export default function ProductSection() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const networkInstance = AiNetworkInstance();
    const cartID = localStorage.getItem("cartId");
    if (!cartID) {
      console.log("No cart ID found.");
      return;
    }

    async function fetchData() {
      try {
        const response = await networkInstance.get(
          `recommendations?cartID=${cartID}`
        );
        const products: MenuItem[] = response.data;
        console.log("Fetched products:", products);
        dispatch({ type: "SET_DATA", data: products });
      } catch (error: any) {
        console.error("Error fetching products:", error);
      }
    }

    fetchData();
  }, []);

  const handleHide = () => dispatch({ type: "SET_DETAIL_MODAL", value: false });

  const filterCategory = (name: string, ind: number) => {
    document.querySelectorAll(".card-container").forEach((el) => {
      (el as HTMLElement).style.transform = "scale(0)";
    });
    dispatch({ type: "SET_ACTIVE_MENU", index: ind });
    const updateData = masonryData.filter((el) => el.category.includes(name));
    dispatch({ type: "SET_DATA", data: updateData });
    setTimeout(() => {
      document.querySelectorAll(".card-container").forEach((el) => {
        (el as HTMLElement).style.cssText =
          "transform:scale(1);transition:all .5s linear";
      });
    }, 200);
  };

  const toggleHeart = (index: number) =>
    dispatch({ type: "TOGGLE_HEART", index });
  const toggleBasket = (index: number) =>
    dispatch({ type: "TOGGLE_BASKET", index });

  return (
    <>
      <div className="row justify-content-md-between align-items-start">
        <div className="col-lg-6 col-md-12">
          <div className="section-head style-1 m-b30">
            <div className="left-content">
              <h2 className="title">AI Suggestions</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="clearfix">
        <ul id="masonry" className="row g-xl-4 g-3">
          {/* {state.data.map((item, ind) => (
            <div
              className="card-container col-6 col-xl-3 col-lg-3 col-md-4 col-sm-6 Tops wow fadeInUp"
              data-wow-delay="0.6s"
              key={item.id}
            >
              <div className="shop-card">
                <div className="dz-media">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                  />
                  <div className="shop-meta">
                    <button
                      className="btn btn-secondary btn-md btn-rounded"
                      onClick={() =>
                        dispatch({ type: "SET_DETAIL_MODAL", value: true })
                      }
                    >
                      <i className="fa-solid fa-eye d-md-none d-block" />
                      <span className="d-md-block d-none">Quick View</span>
                    </button>
                    <button
                      className={`btn btn-primary meta-icon dz-wishicon ${
                        state.heartIcon[ind] ? "active" : ""
                      }`}
                      onClick={() => toggleHeart(ind)}
                    >
                      <i className="icon feather icon-heart dz-heart" />
                      <i className="icon feather icon-heart-on dz-heart-fill" />
                    </button>
                    <button
                      className={`btn btn-primary meta-icon dz-carticon ${
                        state.basketIcon[ind] ? "active" : ""
                      }`}
                      onClick={() => toggleBasket(ind)}
                    >
                      <i className="flaticon flaticon-basket" />
                      <i className="flaticon flaticon-basket-on dz-heart-fill" />
                    </button>
                  </div>
                </div>
                <div className="dz-content">
                  <h5 className="title">
                    <Link href="/shop-list">{item.name}</Link>
                  </h5>
                  <h5 className="price">&#8358;{item.price}</h5>
                </div>
                <div className="product-tag">
                  <span className="badge">Get {item.discount}% Off</span>
                </div>
              </div>
            </div>
          ))} */}
        </ul>
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
                {/* ...rest of your modal content... */}
                <ProductInputButton />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
