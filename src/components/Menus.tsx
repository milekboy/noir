import Link from "next/link";
import IMAGES from "../constant/theme";
import CountdownBlog from "./CountdownBlog";
import { Fragment, useReducer } from "react";
import {
  accountMenuItem,
  menuData2,
  menuData3,
  menuData4,
  menuDataOne,
  portfolioMenu,
} from "../constant/Alldata";
import Image from "next/image";

// Pages Menu Items
// interface MenuItem4 {
//     title: string;
//     links: { name: string; path: string }[];
//     subMenu?: MenuItem4[];
// }

// interface stateType{
//     home : boolean;
//     collpase0 : boolean;

// }

// const initialState = {
//     home : false,
//     collpase0 : false,

// };
// const reducer = (state : stateType, action : reduType) =>{
//     switch (action.type){
//         case 'home':
//             return { ...state, home: !state.home }

//         default:
//             return state
//     }
// }

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
export default function Menus() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ul className="nav navbar-nav">
      <li
        className={`has-mega-menu sub-menu-down auto-width menu-left ${
          state.openMenu === 0 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 0 })}
      >
        <Link href="/">
          <span>Home</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
      <li
        className={`has-mega-menu sub-menu-down ${
          state.openMenu === 1 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 1 })}
      >
        <Link href="/shop-standard">
          <span>Shop</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>

      <li
        className={`has-mega-menu sub-menu-down ${
          state.openMenu === 4 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 4 })}
      >
        <Link href="/shop-with-category">
          <span>Category</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
      <li
        className={`has-mega-menu sub-menu-down wide-width ${
          state.openMenu === 5 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 5 })}
      >
        <Link href="/contact-us-1">
          <span>Contact Us</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
      <li
        className={`has-mega-menu sub-menu-down auto-width  ${
          state.openMenu === 2 ? "open" : ""
        }`}
        onClick={() => dispatch({ type: "toggleMenu", index: 2 })}
      >
        <Link href="/registration">
          <span>Registration</span>
          <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
      <li
        className={`sub-menu-down ${state.openMenu === 6 ? "open" : ""}`}
        onClick={() => dispatch({ type: "toggleMenu", index: 6 })}
      >
        <Link href="/login">
          <span>Login</span> <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
      <li
        className={`sub-menu-down ${state.openMenu === 6 ? "open" : ""}`}
        onClick={() => dispatch({ type: "toggleMenu", index: 6 })}
      >
        <Link href="/shop-checkout">
          <span>Checkout</span> <i className="fas fa-chevron-down tabindex" />
        </Link>
      </li>
    </ul>
  );
}
