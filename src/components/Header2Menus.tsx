"use client";

import Link from "next/link";
import IMAGES from "../constant/theme";
import CountdownBlog from "./CountdownBlog";
import { Fragment, useReducer } from "react";
import {
  menuData2,
  menuData3,
  menuData4,
  menuDataOne,
  portfolioMenu,
} from "../constant/Alldata";
import Image from "next/image";

interface reduType {
  type: string;
  index: number;
}

interface stateType {
  home: boolean;
  openMenu: number | null;
}

const initialState = {
  home: false,
  openMenu: null,
};

const reducer = (state: stateType, action: reduType) => {
  switch (action.type) {
    case "home":
      return { ...state, home: !state.home };
    case "toggleMenu":
      return {
        ...state,
        openMenu: state.openMenu === action.index ? null : action.index,
      };
    default:
      return state;
  }
};
export default function Header2Menus() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ul className="nav navbar-nav ">
      <li
        className={`has-mega-menu sub-menu-down auto-width menu-left ${
          state.openMenu === 0 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 0 })}
      >
        <Link href="#">
          <span>Home</span>
        </Link>
      </li>
      <li
        className={`has-mega-menu sub-menu-down ${
          state.openMenu === 1 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 1 })}
      >
        <Link href="">
          <span>Shop</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
        <div className="mega-menu">
          <div className="mega-menu-content">
            <h5   className="text-black">hello</h5>
        <ul>
          <li><Link href="/shop-list">Shop List</Link></li>
          <li><Link href="/shop-cart">Shopping Cart</Link></li>
          <li><Link href="/shop-wishlist">Wishlist</Link></li>
          <li><Link href="/shop-details">Product Details</Link></li>
        </ul>
          </div>
         
        </div>
      </li>

      <li
        className={`has-mega-menu sub-menu-down auto-width ${
          state.openMenu === 3 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 3 })}
      ></li>

      <li
        className={`has-mega-menu sub-menu-down wide-width ${
          state.openMenu === 5 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 5 })}
      >
        <Link href="/shop-checkout">
          <span>Checkout</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
    </ul>
  );
}
