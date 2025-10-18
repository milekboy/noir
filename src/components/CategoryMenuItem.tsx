"use client";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useState, useEffect } from "react";
import { categories } from "@/constant/Alldata";

interface Category {
  _id: string;
  name: string;
}

export default function CategoryMenuItem() {
  const [category, setCategory] = useState<Category[]>([]);
  const networkInstance = NetworkInstance();
  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProducts = async () => {
    try {
      const res = await networkInstance.get("category/get-all-categories");

      setCategory(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  // create an array of objects of all the categories from the uncommented code below with all the details including subcategories and links
  // then map through the array to display the categories and subcategories in the menu below


  return (
    <ul className="nav navbar-nav">
      {categories
        .filter(
          (item) =>
            item.name !== "Owambe ready\n" &&
            item.name !== "Try-on Ready Picks\n\n\n"
        )
        .map((item, ind) => (
          <li className="has-mega-menu cate-drop " key={ind}>
            <Link href="/collections">
              <i className="icon feather icon-arrow-right" />
              <span>{item.name}</span>
              <span className="menu-icon">
                <i className="icon feather icon-chevron-right" />
              </span>
              {/* {item.name === "Women" ? (
                <span className="menu-icon">
                  <i className="icon feather icon-chevron-right" />
                </span>
              ) : item.name === "Men\n\n" ? (
                <span className="menu-icon">
                  <i className="icon feather icon-chevron-right" />
                </span>
              ) : null} */}
            </Link>
            {item.name ? (
              <div className="mega-menu ms- ">
                <div className="row ">
                  {item.subcategories.map((subcat, ind) => (
                    <div key={ind} className="col-md-3 col-sm-4 col-6">
                      <Link href={"/collections"} className="menu-title">
                        {/* Clothing
                         */}
                        {subcat.title}
                      </Link>
                      <ul>
                        {/* <li>
                        <Link href={"/shop-standard"}>New in Clothing</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Chinos</Link>
                      </li> */}
                        {subcat.items.map((item, ind) => (
                          <li key={ind}>
                            <Link href={`/collections?category=${item.name}`}>
                              {item.name}
                              {item.badge && (
                                <span className="badge bg-primary">{item.badge}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                       
                      </ul>{" "}
                    </div>
                  ))}
               
                </div>
              </div>
            ) : null}
          </li>
        ))}
    </ul>
  );

}
