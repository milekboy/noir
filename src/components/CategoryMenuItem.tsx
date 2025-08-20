"use client"
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useState, useEffect } from "react";


interface Category {
    _id: string;
    name: string;
  }


export default function CategoryMenuItem(){

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
          console.log(res.data);
          console.log(category);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
    return(
        <ul className="nav navbar-nav">
          {category.map((item, ind)=>(   <li className="has-mega-menu cate-drop" key={ind}>
                <Link href="/shop-standard">
                    <i className="icon feather icon-arrow-right"/>
                   <span>{item.name}</span>
                    <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
                <div className="mega-menu">
                    <div className="row">
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"#"} className="menu-title">Clothing</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>New in Clothing</Link></li>
                                <li><Link href={"/shop-standard"}>Chinos</Link></li>
                                <li><Link href={"/shop-standard"}>Sweatshirts<span className="badge bg-primary">NEW</span></Link></li>
                                <li><Link href={"/shop-standard"}>Holiday Shop</Link></li>
                                <li><Link href={"/shop-standard"}>Jackets and Coats</Link></li>
                                <li><Link href={"/shop-standard"}>Jeans</Link></li>
                                <li><Link href={"/shop-standard"}>Joggers</Link></li>
                                <li><Link href={"/shop-standard"}>Polo Shirts</Link></li>
                                <li><Link href={"/shop-standard"}>Shorts</Link></li>
                                <li><Link href={"/shop-standard"}>Trousers</Link></li>
                                <li><Link href={"/shop-standard"}>T-Shirts</Link></li>
                            </ul>              </div>
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title">Suits & Formalwear</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Blazers</Link></li>
                                <li><Link href={"/shop-standard"}>Formal Shirts</Link></li>
                                <li><Link href={"/shop-standard"}>Smart Trousers</Link></li>
                                <li><Link href={"/shop-standard"}>Suits</Link></li>
                                <li><Link href={"/shop-standard"}>Ties</Link></li>
                                <li><Link href={"/shop-standard"}>Waistcoats</Link></li>
                                
                            </ul>            
                            </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Footwear</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}> All Footwear</Link></li>
                                <li><Link href={"/shop-standard"}>Casual Shoes</Link></li>
                                <li><Link href={"/shop-standard"}>Sandals</Link></li>
                                <li><Link href={"/shop-standard"}>Slippers</Link></li>
                                <li><Link href={"/shop-standard"}>Smart Shoes</Link></li>
                                <li><Link href={"/shop-standard"}>Trainers</Link></li>
                            </ul>
              </div>
    
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title">Underwear & Socks</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}> Socks</Link></li>
                                <li><Link href={"/shop-standard"}>Underwear<span className="badge bg-orange">Feture</span></Link></li>
                                <li><Link href={"/shop-standard"}>Vests</Link></li>
                      </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Accessories</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>All Accessories</Link></li>
                                <li><Link href={"/shop-standard"}>Belts</Link></li>
                                <li><Link href={"/shop-standard"}>Hats</Link></li>
                                <li><Link href={"/shop-standard"}>Sunglasses<span className="badge bg-purple">SALE</span></Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Nightwear</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>All Nightwear</Link></li>
                                <li><Link href={"/shop-standard"}>Dressing Gowns</Link></li>
                                <li><Link href={"/shop-standard"}>Pyjamas</Link></li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </li> ))}
            {/* <li className="cate-drop">
                <Link href={"#"}>
                    <i className="icon feather icon-arrow-right"/>
                    <span>Women Casual</span>
                    <span className="menu-icon">
                        <i className="icon feather icon-chevron-right"/>
                    </span>
                </Link>
               <div className="mega-menu">
                    <div className="row">
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"#"} className="menu-title">Clothing</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>New in Clothing</Link></li>
                                <li><Link href={"/shop-standard"}>Blazers</Link></li>
                                <li><Link href={"/shop-standard"}>Cardigans<span className="badge bg-primary">NEW</span></Link></li>
                                <li><Link href={"/shop-standard"}>Dresses</Link></li>
                                <li><Link href={"/shop-standard"}>Jackets & Coats</Link></li>
                                <li><Link href={"/shop-standard"}>Shirts & Blouses</Link></li>
                                <li><Link href={"/shop-standard"}>Shorts</Link></li>
                                <li><Link href={"/shop-standard"}>Skirts</Link></li>
                                <li><Link href={"/shop-standard"}>Sportswear</Link></li>
                                <li><Link href={"/shop-standard"}>Swimwear</Link></li>
                                <li><Link href={"/shop-standard"}>T-Shirts</Link></li>
                                <li><Link href={"/shop-standard"}>Tops</Link></li>
                                <li><Link href={"/shop-standard"}>Trousers</Link></li>
                            </ul>              
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title">Accessories</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>All Accessories</Link></li>
                                <li><Link href={"/shop-standard"}>Handbags</Link></li>
                                <li><Link href={"/shop-standard"}>Hats</Link></li>
                                <li><Link href={"/shop-standard"}>Jewellery</Link></li>
                                <li><Link href={"/shop-standard"}>Sunglasses</Link></li>
                            </ul>            
                            </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title"> Lingerie</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>Bras</Link></li>
                                <li><Link href={"/shop-standard"}>Knickers</Link></li>
                                <li><Link href={"/shop-standard"}>Nightwear</Link></li>
                                <li><Link href={"/shop-standard"}>Shapewear</Link></li>
                                <li><Link href={"/shop-standard"}>Socks</Link></li>
                                <li><Link href={"/shop-standard"}>Tights</Link></li>
                            </ul>
              </div>
    
                        <div className="col-md-3 col-sm-4 col-6"><Link href={"/shop-standard"} className="menu-title"> Collections</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}> Denim</Link></li>
                                <li><Link href={"/shop-standard"}>Festival Outfits</Link></li>
                                <li><Link href={"/shop-standard"}>Women's Suits</Link></li>
                                <li><Link href={"/shop-standard"}>Workwear</Link></li>
                                <li><Link href={"/shop-standard"}>Leopard Print</Link></li>
                      </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Footwear</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>All Footwear</Link></li>
                                <li><Link href={"/shop-standard"}>Sandals</Link></li>
                                <li><Link href={"/shop-standard"}>Shoes</Link></li>
                                <li><Link href={"/shop-standard"}>Slippers<span className="badge bg-purple">SALE</span></Link></li>
                                <li><Link href={"/shop-standard"}>Trainers</Link></li>
                            </ul>
                        </div>
                        <div className="col-md-3 col-sm-4 col-6"> <Link href={"/shop-standard"} className="menu-title">Nightwear</Link>
                            <ul>
                                <li><Link href={"/shop-standard"}>All Nightwear</Link></li>
                                <li><Link href={"/shop-standard"}>Dressing Gowns</Link></li>
                                <li><Link href={"/shop-standard"}>Pyjamas</Link></li>
                            </ul>
                        </div>
                        
                    </div>
                </div>
            </li> */}
            
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
    )
}