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
                            <Link href={"/collections"}>
                              {item.name}
                              {item.badge && (
                                <span className="badge bg-primary">NEW</span>
                              )}
                            </Link>
                          </li>
                        ))}
                        {/* <li>
                        <Link href={"/shop-standard"}>Holiday Shop</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Jackets and Coats</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Jeans</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Joggers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Polo Shirts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Shorts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Trousers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>T-Shirts</Link>
                      </li> */}
                      </ul>{" "}
                    </div>
                  ))}
                  {/* <div className="col-md-3 col-sm-4 col-6">
                    <Link href={"/shop-standard"} className="menu-title">
                      Suits & Formalwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>Blazers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Formal Shirts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Smart Trousers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Suits</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Ties</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Waistcoats</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Footwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}> All Footwear</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Casual Shoes</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Sandals</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Slippers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Smart Shoes</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Trainers</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-3 col-sm-4 col-6">
                    <Link href={"/shop-standard"} className="menu-title">
                      Underwear & Socks
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}> Socks</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>
                          Underwear
                          <span className="badge bg-orange">Feture</span>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Vests</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Accessories
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>All Accessories</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Belts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Hats</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>
                          Sunglasses
                          <span className="badge bg-purple">SALE</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Nightwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>All Nightwear</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Dressing Gowns</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Pyjamas</Link>
                      </li>
                    </ul>
                  </div> */}
                </div>
              </div>
            ) : null}
          </li>
        ))}
    </ul>
  );
  return (
    <ul className="nav navbar-nav">
      {/* {category
        .filter(
          (item) =>
            item.name !== "Owambe ready\n" &&
            item.name !== "Try-on Ready Picks\n\n\n"
        )
        .map((item, ind) => (
          <li className="has-mega-menu cate-drop " key={ind}>
            <Link href="/shop-standard">
              <i className="icon feather icon-arrow-right" />
              <span>{item.name}</span>
              {item.name === "Women" ? (
                <span className="menu-icon">
                  <i className="icon feather icon-chevron-right" />
                </span>
              ) : item.name === "Men\n\n" ? (
                <span className="menu-icon">
                  <i className="icon feather icon-chevron-right" />
                </span>
              ) : null}
            </Link>
            {item.name === "Women" ? (
              <div className="mega-menu">
                <div className="row">
                  <div className="col-md-3 col-sm-4 col-6">
                    <Link href={"#"} className="menu-title">
                      Clothing
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>New in Clothing</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Chinos</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>
                          Sweatshirts
                          <span className="badge bg-primary">NEW</span>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Holiday Shop</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Jackets and Coats</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Jeans</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Joggers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Polo Shirts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Shorts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Trousers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>T-Shirts</Link>
                      </li>
                    </ul>{" "}
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    <Link href={"/shop-standard"} className="menu-title">
                      Suits & Formalwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>Blazers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Formal Shirts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Smart Trousers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Suits</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Ties</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Waistcoats</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Footwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}> All Footwear</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Casual Shoes</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Sandals</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Slippers</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Smart Shoes</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Trainers</Link>
                      </li>
                    </ul>
                  </div>

                  <div className="col-md-3 col-sm-4 col-6">
                    <Link href={"/shop-standard"} className="menu-title">
                      Underwear & Socks
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}> Socks</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>
                          Underwear
                          <span className="badge bg-orange">Feture</span>
                        </Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Vests</Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Accessories
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>All Accessories</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Belts</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Hats</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>
                          Sunglasses
                          <span className="badge bg-purple">SALE</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-3 col-sm-4 col-6">
                    {" "}
                    <Link href={"/shop-standard"} className="menu-title">
                      Nightwear
                    </Link>
                    <ul>
                      <li>
                        <Link href={"/shop-standard"}>All Nightwear</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Dressing Gowns</Link>
                      </li>
                      <li>
                        <Link href={"/shop-standard"}>Pyjamas</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : null}
          </li>
        ))} */}
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Women</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu" style={{marginTop: "-20px"}}>
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jackets & Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Handbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Lingerie
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Bras</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Knickers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Men</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu" style={{marginTop: "-50px"}}>
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Chinos</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hoodies and Sweatshirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jackets and Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jeans</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Joggers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Polo Shirtsr</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Suits & Formalwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Formal Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Smart Trousers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ties</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Waistcoats</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Corporate But Chic</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>satin button blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Structured peplum tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Fitted turtlenecks
                    <span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Wrap blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Puff-sleeve</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sheath dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Midi wrap dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Belted shirt dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pencil dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cigarette pants</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
               Suits & Formalwear
              </Link>

              <ul>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Formal Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Smart Trousers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ties</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Waistcoats</Link>
                </li>
              </ul>
            </div> */}

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              {/* <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link> */}
              {/* <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul> */}
            </div>
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Girls' Night Looks</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Satin camisole</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Off-shoulder</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Metallic crop top</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Corset-style blouse</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sheer mesh top</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Little black dress</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Bodycon midi</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Slip dress</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>One-shoulder</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazer dress</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>crossbody bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Statement earrings</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>body chain</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Rhinestone</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Stiletto heels</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Platform sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pointed-toe pumps</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ankle boots</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>

            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span> Smart Casual Staples</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crisp white</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Neutral t-shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Polo shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>crewneck knits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Casual blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Chinos</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tailored trousers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Midi skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Smart shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Denim jacket</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>leather belt</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Neutral tote bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Simple wristwatch</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Subtle jewelry</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Loafers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Chelsea boots</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ballet flats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>derby shoes</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>
      {/* <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span> Women Casual</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jackets & Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Handbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Lingerie
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Bras</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Knickers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Men Casual</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jackets & Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Handbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Lingerie
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Bras</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Knickers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li> */}
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Back to Campus</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu" style={{ marginTop: "-50px" }}>
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Oversized t-shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Basic tank</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cropped hoodies</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Button-down shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Lightweight knits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>High-waisted jeans</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cargo pants</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Denim shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leggings</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Casual skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Oversized cardigan</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Backpack</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbody bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Baseball cap</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Minimalist jewelry</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>New Balance</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Chunky trainers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Casual ankle boots</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Birkenstocks</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Accessories Corner</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Bags
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Structured tote</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Mini crossbody</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Clutch</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Backpack</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Statement bag</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li> */}
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Block-heel sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Classic pumps</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Classic pumps</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ankle boots</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Watches
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Leather-strap watch</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Metal bracelet watch</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sporty digital watch</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li> */}
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Jewelry Corner
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Velvet trays</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Minimalist jewelry</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Watches + Bracelets</Link>
                </li>
             
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Gym & Go</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Tops
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Breathable tank tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cropped sports tees</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Zip-up hoodies<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Longline sports bras</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Biker shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Joggers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Oversized sweatshirt</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sleek gym duffel</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbody</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Minimalist backpack</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Baseball cap</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Chunky trainers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Lightweight</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Slip-on sneakers</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li> */}
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>
      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Summer Looks</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Dresses
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Flowy sundress</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Slip dress</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Tiered maxi dress
                    <span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirt dress</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cut-out mini dress</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Tops
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Linen button-down</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cropped tank tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Off-shoulder tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Graphic tees</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Halter neck tops</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Woven straw bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbody mini bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Oversized sunglasses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Straw hat</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Delicate gold</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Colorful hair scarf</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Strappy sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Espadrilles</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Platform slides</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Open-toe block heels</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>

      {/* <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Back to Campus</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Clothing
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>New in Clothing</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Blazers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Cardigans<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dresses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jackets & Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Handbags</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Jewellery</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Lingerie
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Bras</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Knickers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li>
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </li> */}

      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Travel Light</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu">
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Tops
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Neutral t-shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Lightweight blouse</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    linen shorts<span className="badge bg-primary">NEW</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Versatile skirt</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Jackets & Coats</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shirts & Blouses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shorts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Skirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sportswear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Swimwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>T-Shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trousers</Link>
                </li> */}
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Accessories</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbody bag</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tote/backpack</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sunglasses</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Minimal jewelry</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Strappy sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>One dressy shoe</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Shapewear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li> */}
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Collections
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}> Denim</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Festival Outfits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Women's Suits</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Workwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>

      <li className="cate-drop">
        <Link href={"/shop-standard"}>
          <i className="icon feather icon-arrow-right" />
          <span>Layered Looks</span>
          <span className="menu-icon">
            <i className="icon feather icon-chevron-right" />
          </span>
        </Link>
        <div className="mega-menu" style={{ marginTop: "-50px" }}>
          <div className="row">
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"#"} className="menu-title">
                Base Layers
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Fitted t-shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Ribbed tank tops</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Slim turtlenecks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Camisoles</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                Mid Layers
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Oversized shirts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Cardigans</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crewneck sweaters</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Hoodies</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Vests</Link>
                </li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Accessories
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>Belts</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Crossbody</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Beanies</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Layered necklaces</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Socks</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Tights</Link>
                </li> */}
              </ul>
            </div>

            <div className="col-md-3 col-sm-4 col-6">
              <Link href={"/shop-standard"} className="menu-title">
                {" "}
                Shoes
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>White sneakers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Chelsea boots</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Loafers</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Heeled ankle boots</Link>
                </li>
                {/* <li>
                  <Link href={"/shop-standard"}>Leopard Print</Link>
                </li> */}
              </ul>
            </div>
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Footwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Footwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Sandals</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Shoes</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>
                    Slippers<span className="badge bg-purple">SALE</span>
                  </Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Trainers</Link>
                </li>
              </ul>
            </div> */}
            {/* <div className="col-md-3 col-sm-4 col-6">
              {" "}
              <Link href={"/shop-standard"} className="menu-title">
                Nightwear
              </Link>
              <ul>
                <li>
                  <Link href={"/shop-standard"}>All Nightwear</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Dressing Gowns</Link>
                </li>
                <li>
                  <Link href={"/shop-standard"}>Pyjamas</Link>
                </li>
              </ul>
            </div> */}
          </div>
        </div>
      </li>

      {/* <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Smart Casual Staples</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
                 <ul className="sub-menu">
                    <li><Link href={"/shop-standard"}>Thermostats</Link></li>
                    <li><Link href={"/shop-standard"}>Lighting</Link></li>
                    <li><Link href={"/shop-standard"}>Security Systems</Link></li>
                    <li><Link href={"/shop-standard"}>Locks</Link></li>
                    <li><Link href={"/shop-standard"}>Home Assistants</Link></li>
                    <li><Link href={"/shop-standard"}>Entertainment Systems</Link></li>
                    <li><Link href={"/shop-standard"}>Blinds And Shades</Link></li>
                    <li><Link href={"/shop-standard"}>Appliances</Link></li>
                    <li><Link href={"/shop-standard"}>Water Monitors</Link></li>
                    <li><Link href={"/shop-standard"}>Gardening Systems</Link></li>
                </ul>
            </li> */}
      {/* <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Men Casual</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Back to Campus</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Accessories Corner </span>
                    <span className="badge bg-purple">SALE</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Gym & Go</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Travel Light</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Summer Looks</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li>
            <li>
                <Link href={"/shop-standard"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Genz Fashion</span>
                     <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
            </li> */}
      {/* <li className="menu-items">
                <Link href={"#"}>
                    <i className="flaticon-blocks me-3"/>
                    <span>More</span>
                </Link>
            </li> */}
    </ul>
  );
}
