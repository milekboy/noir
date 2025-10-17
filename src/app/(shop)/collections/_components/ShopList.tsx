"use client";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { Modal, Tab } from "react-bootstrap";
import Image from "next/image"; // ✅ added
import CommanBanner from "@/components/CommanBanner";
import IMAGES from "@/constant/theme";
import PaginationBlog from "@/elements/Shop/PaginationBlog";
import SelectBoxOne from "@/elements/Shop/SelectBoxOne";
import SelectBoxTwo from "@/elements/Shop/SelectBoxTwo";
import SelectBoxFour from "@/elements/Shop/SelectBoxFour";
import SelectBoxFive from "@/elements/Shop/SelectBoxFive";
import SelectBoxSix from "@/elements/Shop/SelectBoxSix";
import SelectBoxSeven from "@/elements/Shop/SelectBoxSeven";
// import SelectBoxEight from "@/elements/Shop/SelectBoxEight"; // ❌ commented (not used)
import ShopSidebar from "@/elements/Shop/ShopSidebar";

import ShopGridCard from "@/elements/Shop/ShopGridCard";
import ModalSlider from "@/components/ModalSlider";
import BasicModalData from "@/components/BasicModalData";
import ShopCategorySlider from "@/elements/Shop/ShopCategorySlider";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import NetworkInstance from "@/app/api/NetworkInstance";

// import { label } from "three/src/nodes/TSL.js"; // ❌ remove

export default function ShopList({
  selectedCategory,
}: {
  selectedCategory: string | null;
}) {
  const handleResetFilters = () => {
    setSelectedColor(null);
    setSelectedSize(null);
    setSelectedPriceRange([1000, 10000]);
  };

  interface ProductImage {
    url: string;
    public_id: string;
    filename: string;
  }

  interface Product {
    _id: string;
    name: string;
    price: any;
    category: string;
    productImages: ProductImage[];
    description: string;
    color: string;
    size: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const networkInstance = NetworkInstance();
  //api call

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProducts = async () => {
    try {
      const res = await networkInstance.get("product/get-all-products");

      setProducts(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const [detailModal, setDetailModal] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<
    [number, number]
  >([1000, 10000]);

  const onPriceChange = (range: [number, number]) =>
    setSelectedPriceRange(range);
  const onColorChange = (color: string) => setSelectedColor(color);
  const onSizeChange = (size: string) => setSelectedSize(Number(size));

  // const filteredCategory =
  //   selectedCategory && products.length > 0
  //     ? products.filter((item) => item.category === selectedCategory)
  //     : products;

  // const filteredProducts = filteredCategory.filter((item) => {
  //   const price = item.price;
  //   const matchColor = selectedColor ? item.color === selectedColor : true;
  //   const matchSize = selectedSize
  //     ? item.size === selectedSize.toString()
  //     : true;
  //   const matchPrice =
  //     price >= selectedPriceRange[0] && price <= selectedPriceRange[1];
  //   return matchColor && matchSize && matchPrice;
  // });

  const [showFilters, setShowFilters] = useState(true);

  const [hovered, setHovered] = useState<string | null>(null);

  // const navItems = [
  //   {
  //     href: "/collections",
  //     label: "Women",
  //     dropdown: [
  //       { label: "New in Clothing", link: "/shop-list" },
  //       { label: "Dresses", link: "/shop-list", badge: "HOT" },
  //       { label: "Blazers & Co-ords", link: "/shop-list" },
  //       { label: "Cardigans", link: "/shop-list", badge: "NEW" },
  //       { label: "Hoodies & Sweatshirts", link: "/shop-list" },
  //       { label: "Jackets & Coats", link: "/shop-list" },
  //       { label: "Jeans", link: "/shop-list" },
  //       { label: "Tops & Blouses", link: "/shop-list" },
  //       { label: "Skirts & Shorts", link: "/shop-list" },
  //       { label: "Trousers & Leggings", link: "/shop-list" },
  //       { label: "Suits & Tailoring", link: "/shop-list" },

  //       { label: "New in Shoes", link: "/shop-list" },
  //       { label: "Heels", link: "/shop-list" },
  //       { label: "Boots & Ankle Boots", link: "/shop-list" },
  //       { label: "Loafers & Mules", link: "/shop-list" },
  //       { label: "Sneakers", link: "/shop-list" },
  //       { label: "Sandals & Slides", link: "/shop-list" },

  //       { label: "Handbags", link: "/shop-list" },
  //       { label: "Mini Bags", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Belts", link: "/shop-list" },
  //       { label: "Sunglasses", link: "/shop-list" },
  //       { label: "Hats & Caps", link: "/shop-list" },
  //       { label: "Scarves", link: "/shop-list" },
  //       { label: "Jewelry", link: "/shop-list" },
  //       { label: "Watches", link: "/shop-list" },

  //       { label: "Summer Dresses", link: "/shop-list" },
  //       { label: "Winter Coats", link: "/shop-list" },
  //       { label: "Rainwear", link: "/shop-list" },
  //       { label: "Holiday Shop", link: "/shop-list", badge: "HOT" },
  //       { label: "Resort Wear", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Men",
  //     dropdown: [
  //       { label: "New in Clothing", link: "/shop-list" },
  //       { label: "Chinos", link: "/shop-list" },
  //       { label: "Cardigans", link: "/shop-list", badge: "NEW" },
  //       { label: "Hoodies and Sweatshirts", link: "/shop-list" },
  //       { label: "Jackets and Coats", link: "/shop-list" },
  //       { label: "Jeans", link: "/shop-list" },
  //       { label: "Shirts", link: "/shop-list" },
  //       { label: "T-Shirts & Polos", link: "/shop-list" },
  //       { label: "Shorts", link: "/shop-list" },
  //       { label: "Suits & Tailoring", link: "/shop-list" },

  //       { label: "New in Shoes", link: "/shop-list" },
  //       { label: "Sneakers", link: "/shop-list" },
  //       { label: "Boots", link: "/shop-list" },
  //       { label: "Loafers", link: "/shop-list" },
  //       { label: "Sandals & Slides", link: "/shop-list" },
  //       { label: "Formal Shoes", link: "/shop-list" },

  //       { label: "Bags & Backpacks", link: "/shop-list" },
  //       { label: "Belts", link: "/shop-list" },
  //       { label: "Sunglasses", link: "/shop-list" },
  //       { label: "Caps & Hats", link: "/shop-list" },
  //       { label: "Scarves & Gloves", link: "/shop-list" },
  //       { label: "Wallets", link: "/shop-list" },
  //       { label: "Watches", link: "/shop-list", badge: "TRENDING" },

  //       { label: "Gym T-Shirts", link: "/shop-list" },
  //       { label: "Performance Shorts", link: "/shop-list" },
  //       { label: "Track Pants", link: "/shop-list" },
  //       { label: "Sports Jackets", link: "/shop-list" },
  //       { label: "Running Shoes", link: "/shop-list" },
  //       { label: "Sports Bags", link: "/shop-list" },

  //       { label: "Summer Essentials", link: "/shop-list" },
  //       { label: "Winter Coats", link: "/shop-list" },
  //       { label: "Rain Jackets", link: "/shop-list" },
  //       { label: "Holiday Outfits", link: "/shop-list", badge: "HOT" },
  //       { label: "Resort Wear", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Corporate but Chic",
  //     dropdown: [
  //       { label: "Blazers", link: "/shop-list", badge: "HOT" },
  //       { label: "Tailored Trousers", link: "/shop-list" },
  //       { label: "Pencil Skirts", link: "/shop-list" },
  //       { label: "Shirt Dresses", link: "/shop-list" },
  //       { label: "Silk Blouses", link: "/shop-list" },
  //       { label: "Smart Jumpsuits", link: "/shop-list" },

  //       { label: "Pointed Heels", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Loafers", link: "/shop-list" },
  //       { label: "Block Heels", link: "/shop-list" },
  //       { label: "Ankle Boots", link: "/shop-list" },
  //       { label: "Chic Flats", link: "/shop-list" },

  //       { label: "Trench Coats", link: "/shop-list" },
  //       { label: "Tailored Coats", link: "/shop-list" },
  //       { label: "Structured Jackets", link: "/shop-list" },
  //       { label: "Cropped Blazers", link: "/shop-list" },

  //       { label: "Leather Totes", link: "/shop-list", badge: "HOT" },
  //       { label: "Statement Belts", link: "/shop-list" },
  //       { label: "Minimalist Watches", link: "/shop-list" },
  //       { label: "Silk Scarves", link: "/shop-list" },
  //       { label: "Delicate Jewelry", link: "/shop-list" },

  //       { label: "Classic White Shirts", link: "/shop-list" },
  //       { label: "Neutral Trousers", link: "/shop-list" },
  //       { label: "Black Dresses", link: "/shop-list" },
  //       { label: "Nude Pumps", link: "/shop-list" },
  //       { label: "Structured Handbags", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Girls' Night Look",
  //     dropdown: [
  //       { label: "Sequin Dresses", link: "/shop-list" },
  //       { label: "Mini Skirts", link: "/shop-list" },
  //       { label: "Bodysuits", link: "/shop-list" },
  //       { label: "Corset Tops", link: "/shop-list" },
  //       { label: "Party Dresses", link: "/shop-list", badge: "HOT" },

  //       { label: "High Heels", link: "/shop-list" },
  //       { label: "Strappy Sandals", link: "/shop-list" },
  //       { label: "Platform Heels", link: "/shop-list" },

  //       { label: "Clutch Bags", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Bold Earrings", link: "/shop-list" },
  //       { label: "Statement Necklaces", link: "/shop-list" },

  //       { label: "Bold Lipsticks", link: "/shop-list" },
  //       { label: "Shimmery Jackets", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Smart Casual Staples",
  //     dropdown: [
  //       { label: "Polo Shirts", link: "/shop-list" },
  //       { label: "Chinos", link: "/shop-list" },
  //       { label: "Casual Blazers", link: "/shop-list" },
  //       { label: "Denim Jackets", link: "/shop-list" },
  //       { label: "Button-Down Shirts", link: "/shop-list" },

  //       { label: "Loafers", link: "/shop-list" },
  //       { label: "Casual Sneakers", link: "/shop-list" },
  //       { label: "Chelsea Boots", link: "/shop-list", badge: "HOT" },

  //       { label: "Leather Belts", link: "/shop-list" },
  //       { label: "Casual Watches", link: "/shop-list" },
  //       { label: "Messenger Bags", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Back to Campus",
  //     dropdown: [
  //       { label: "Hoodies", link: "/shop-list" },
  //       { label: "Graphic Tees", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Joggers", link: "/shop-list" },
  //       { label: "Denim", link: "/shop-list" },
  //       { label: "Varsity Jackets", link: "/shop-list" },

  //       { label: "Sneakers", link: "/shop-list" },
  //       { label: "Backpacks", link: "/shop-list" },
  //       { label: "Caps", link: "/shop-list" },

  //       { label: "Laptop Sleeves", link: "/shop-list" },
  //       { label: "Water Bottles", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Gym & Go",
  //     dropdown: [
  //       { label: "Sports Bras", link: "/shop-list" },
  //       { label: "Leggings", link: "/shop-list" },
  //       { label: "Performance Tees", link: "/shop-list" },
  //       { label: "Tracksuits", link: "/shop-list", badge: "HOT" },

  //       { label: "Trainers", link: "/shop-list" },
  //       { label: "Running Shoes", link: "/shop-list" },

  //       { label: "Duffel Bags", link: "/shop-list" },
  //       { label: "Water Bottles", link: "/shop-list" },
  //       { label: "Caps", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Summer Looks",
  //     dropdown: [
  //       { label: "Swimwear", link: "/shop-list" },
  //       { label: "Sundresses", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Shorts", link: "/shop-list" },
  //       { label: "Linen Shirts", link: "/shop-list" },
  //       { label: "Flip Flops", link: "/shop-list" },

  //       { label: "Straw Hats", link: "/shop-list" },
  //       { label: "Beach Bags", link: "/shop-list" },
  //       { label: "Sunglasses", link: "/shop-list" },
  //       { label: "Holiday Outfits", link: "/shop-list", badge: "HOT" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Travel Light",
  //     dropdown: [
  //       { label: "Travel Backpacks", link: "/shop-list", badge: "HOT" },
  //       { label: "Crossbody Bags", link: "/shop-list" },
  //       { label: "Wrinkle-Free Shirts", link: "/shop-list" },
  //       { label: "Packable Jackets", link: "/shop-list" },
  //       { label: "Comfy Sneakers", link: "/shop-list" },

  //       { label: "Suitcases", link: "/shop-list" },
  //       { label: "Travel Accessories", link: "/shop-list" },
  //       { label: "Neck Pillows", link: "/shop-list" },
  //     ],
  //   },
  //   {
  //     href: "/collections",
  //     label: "Layered Looks",
  //     dropdown: [
  //       { label: "Overshirts", link: "/shop-list" },
  //       { label: "Cardigans", link: "/shop-list", badge: "TRENDING" },
  //       { label: "Vests", link: "/shop-list" },
  //       { label: "Denim Jackets", link: "/shop-list" },
  //       { label: "Bomber Jackets", link: "/shop-list" },

  //       { label: "Chunky Scarves", link: "/shop-list" },
  //       { label: "Beanies", link: "/shop-list" },
  //       { label: "Gloves", link: "/shop-list" },
  //     ],
  //   },
  // ];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [alignRight, setAlignRight] = useState(false);

  useEffect(() => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      if (rect.right > window.innerWidth) {
        setAlignRight(true); // shift to the right side
      } else {
        setAlignRight(false); // default left side
      }
    }
  }, [hovered]);

  const router = useRouter();

  // // ✅ Breadcrumb state
  // const [breadcrumb, setBreadcrumb] = useState<string[]>([
  //   "Home",
  //   "Collections",
  // ]);

  // // ✅ Handle dropdown click
  // const handleDropdownClick = (parent: string, child: string) => {
  //   setBreadcrumb(["Home", "Collections", parent, child]);
  //   router.push(`/collections?category=${encodeURIComponent(child)}`);
  // };

  // const [products, setProducts] = useState<Product[]>([]);

  const [hoveredSub, setHoveredSub] = useState<string | null>(null);

  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchNavItems = async () => {
      try {
        const res = await networkInstance.get("category/get-all-categories");
        // sanitize labels
        console.log(res.data);
        const cleanData = res.data.map((item: any) => ({
          ...item,
          label: item.label?.trim().replace(/\n/g, ""), // remove \n and spaces
          dropdown: item.dropdown?.map((drop: any) => ({
            ...drop,
            label: drop.label?.trim().replace(/\n/g, ""),
          })),
        }));
        setNavItems(cleanData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchNavItems();
  }, []);

  // const handleDropdownClick = (parentLabel: string, subLabel: string) => {
  //   console.log(`Clicked ${subLabel} inside ${parentLabel}`);
  // };

  console.log(navItems);

  const [breadcrumb, setBreadcrumb] = useState<string[]>(["Home"]);
  const handleDropdownClick = (parentName: string, subName: string) => {
    setBreadcrumb(["Home", "Collections", parentName, subName]);
    console.log(
      `Breadcrumb updated: Home > Collections > ${parentName} > ${subName}`
    );
  };

  interface CategoryProps {
    id: string;
    image: [];
    label: string;
    subCategory: SubCategoryProps[];
  }
  interface SubCategoryProps {
    id: string;
    label: string;
    image: string[];
    badge: string;
  }
  const [selectedCollection, setSelectedCollection] = useState("Collections");
  const [param, setParam] = useState<string | null>("");
  const [categoryData, setCategoryData] = useState<CategoryProps>();

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  useEffect(() => {
    setParam(categoryParam);
  }, [categoryParam]);

  // Select default category data based on the category query parameter
  useEffect(() => {
    if (!categoryParam || !navItems || navItems.length === 0) return;
    const target = categoryParam.trim().toLowerCase();
    const match = navItems.find(
      (it: any) => it?.label?.trim()?.toLowerCase() === target
    );
    if (match) {
      setCategoryData(match);
    }
  }, [categoryParam, navItems]);

  useEffect(() => {
    categoryData?.label;
    // setCategoryData()
    // console.log(categoryData, "categorydata")
  }, [categoryData]);
  return (
    <div className="page-content bg-light">
      {/* <CommanBanner
        mainText="Collections"
        currentText="Collections"
        parentText="Home"
        image={IMAGES.BackBg1.src}
      /> */}

      {/* Header */}
      <header
        style={{
          width: "100%",
          borderBottom: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 30px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <h4
              style={{
                color: "black",
                fontWeight: "bold",
                letterSpacing: "1px",
                textTransform: "uppercase",
                textAlign: "center",
                margin: 0,
              }}
            >
              {breadcrumb[breadcrumb.length - 1] === "Home"
                ? `${ param ? param : ""} Collections`
                : breadcrumb.length > 0
                ? `${breadcrumb[breadcrumb.length - 1]} Collections`
                : " "}
            </h4>
          </div>

          <div style={{ width: "80px" }}></div>
        </div>

        {/* Category navigation */}

        <div>
          <nav
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "30px",
              padding: "10px 0",
              borderTop: "1px solid #eee",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              position: "relative",
              backgroundColor: "#000",
              zIndex: 100,

              // ✅ Mobile scrolling
              // overflowX: window.innerWidth > 764 ? "auto" : "hidden",
              whiteSpace: "nowrap",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge
            }}
            className="mobile-scroll"
          >
            {navItems.map((item: any, index: number) => (
              <div
                key={index}
                style={{ position: "relative", flex: "0 0 auto" }} // ✅ Prevent shrink
                onMouseEnter={() => setHovered(item.label)}
                onMouseLeave={() => setHovered(null)}
              >
                <Link
                  href={`/collections?category=${item.label}`}
                  style={{
                    color: "#fff",
                    textDecoration: "none",
                    padding: "6px 10px",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    handleDropdownClick(item.label, "");
                    router.push(`/collections?category=${item.label}`);
                    window.location.reload();
                  }}
                >
                  {item.label}
                </Link>

                {item.subCategory?.length > 0 && hovered === item.label && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      backgroundColor: "#fff",
                      border: "1px solid #eee",
                      borderRadius: "6px",
                      width: "700px",
                      padding: "20px 25px",
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr",
                      gap: "20px",
                      zIndex: 1000,
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        columnGap: "20px",
                        rowGap: "6px",
                        alignItems: "flex-start",
                      }}
                    >
                      {item.subCategory.map((drop: any, i: number) => (
                        <Link
                          key={i}
                          href={drop.link || "#"}
                          style={{
                            flex: "0 0 45%",
                            color: "#333",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: 400,
                            padding: "2px 0",
                            transition: "all 0.2s ease",
                            whiteSpace: "nowrap",
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            handleDropdownClick(item.label, drop.label);
                            setCategoryData(item);
                            router.push("#");
                          }}
                        >
                          {drop.label}
                          {drop.badge && (
                            <span
                              style={{
                                marginLeft: "6px",
                                fontSize: "10px",
                                color: "red",
                                fontWeight: 600,
                              }}
                            >
                              {drop.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      {item.images?.map((img: string, idx: number) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`${item.name}-${idx}`}
                          width={300}
                          height={400}
                          style={{
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {breadcrumb.length > 0 && (
            <nav
              aria-label="breadcrumb"
              style={{
                padding: "10px 20px",
                fontSize: "14px",
                color: "#444",
              }}
            >
              {breadcrumb.map((crumb: string, idx: number) => (
                <span key={idx} style={{ marginRight: "6px" }}>
                  <Link
                    href={`${
                      breadcrumb[idx] === "Collections"
                        ? "/collections"
                        : breadcrumb[idx] === "Home"
                        ? "/"
                        : `/collections?category=${encodeURIComponent(crumb)}`
                    }`}
                    onClick={() => {
                      window.location.reload();
                    }}
                    style={{
                      color: "#000",
                      fontWeight: idx === breadcrumb.length - 1 ? 600 : 400,
                      cursor:
                        idx === breadcrumb.length - 1 ? "default" : "pointer",
                    }}
                  >
                    {breadcrumb.length > 3 ? (
                      crumb
                    ) : (
                      <p style={{ fontWeight: !searchParams ? 600 : 400 }}>
                       <Link href={"/"}> Home{" "}</Link>
                        <span style={{ margin: "0 6px", color: "#999" }}>
                          {">"}
                        </span>{" "}
                      <Link href={"/collections"}>  Collections{" "}</Link>
                        {
                        categoryParam &&  (<>
                            {" "}
                            <span style={{ margin: "0 6px", color: "#999" }}>
                              {">"}
                            </span>{" "}
                            <Link
                              href={`/collections?category=${categoryParam}`}
                            >
                              {" "}
                              {`${categoryParam}`}
                            </Link>
                          </>)
                        }
                      </p>
                    )}
                  </Link>
                  {idx < breadcrumb.length - 1 && (
                    <span style={{ margin: "0 6px", color: "#999" }}>
                      {">"}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          )}
        </div>

        <style jsx>{`
          .mobile-scroll::-webkit-scrollbar {
            display: none;
          }

          @media (max-width: 556px) {
            .mobile-scroll {
              justify-content: flex-start !important;
              gap: 20px !important;
            }
          }
        `}</style>
      </header>

      {/* ✅ Dynamic Breadcrumb */}
      {/* <div
              style={{
                backgroundColor: "#f9f9f9",
                padding: "10px 30px",
                borderBottom: "1px solid #eee",
                fontSize: "13px",
              }}
            >
              <nav aria-label="breadcrumb">
                <ol
                  style={{
                    display: "flex",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                    gap: "8px",
                    color: "#555",
                  }}
                >
                  {breadcrumb.map((crumb, index) => (
                    <li key={index} style={{ display: "flex", alignItems: "center" }}>
                      <Link
                        href="#"
                        style={{
                          color: index === breadcrumb.length - 1 ? "#000" : "#555",
                          fontWeight: index === breadcrumb.length - 1 ? "600" : "400",
                          textDecoration: "none",
                        }}
                        onClick={() => {
                          // ✅ allow backward navigation
                          setBreadcrumb((prev) => prev.slice(0, index + 1));
                          if (crumb === "Home") router.push("/");
                          else if (crumb === "Collections")
                            router.push("/collections");
                        }}
                      >
                        {crumb}
                      </Link>
                      {index < breadcrumb.length - 1 && (
                        <span style={{ margin: "0 6px", color: "#999" }}>/</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div> */}

      <section className="content-inner-3 pt-3">
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-xl-3 d-lg-none">
              <div className="sticky-xl-top ">
                <Link
                  href={"#"}
                  className={`panel-close-btn ${mobileSidebar ? "active" : ""}`}
                  onClick={() => setMobileSidebar(false)}
                >
                  ✕
                </Link>
                <div
                  className={`shop-filter mt-xl-2 mt-0 ${
                    mobileSidebar ? "active" : ""
                  }`}
                >
                  <aside>
                    <div className="d-flex align-items-center justify-content-between m-b30">
                      <h6
                        className="title mb-0 fw-normal d-flex"
                        style={{ color: "black" }}
                      >
                        <i className="flaticon-filter me-3" />
                        Filter
                      </h6>
                    </div>
                    <ShopSidebar
                      onPriceChange={onPriceChange}
                      onColorChange={onColorChange}
                      onSizeChange={onSizeChange}
                      selectedColor={selectedColor}
                      selectedSize={selectedSize}
                      selectedPriceRange={selectedPriceRange}
                    />
                    {/* <button
                      type="button"
                      onClick={handleResetFilters}
                      className="btn btn-sm font-14 btn-secondary btn-sharp"
                    >
                      RESET
                    </button> */}
                  </aside>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-80 col-xl-12 col-sm-">
             {param && <h4 className="mb-3" style={{ color: "black" }}>
                New In
              </h4>}
              <div className="row">
                <div className="col-xl-12">
                  <ShopCategorySlider
                    categorySelect={categoryData?.subCategory ?? []}
                  />
                </div>
              </div>
              <div
                className="d-flex justify-content-space-between align-items-center m-b30"
                style={{ marginTop: "30px" }}
              >
                {/* Select boxes (shown/hidden based on state) */}
                {showFilters && (
                  <div className="d-flex align-items-center">
                    <SelectBoxFour />
                    <SelectBoxFive />
                    <SelectBoxSix />
                    <SelectBoxSeven />
                    {/* <SelectBoxEight /> */}
                  </div>
                )}

                {/* Filter button */}
                <div
                  className="d-flex align-items-center justify-content-end mb-3 w-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowFilters((prev) => !prev)}
                >
                  <h6
                    className="title mb-0 fw-normal d-flex align-items-center"
                    style={{ color: "black", fontSize: "0.95rem" }}
                  >
                    <i
                      className="flaticon-filter me-2"
                      style={{ color: "black" }}
                    />
                    <span className="d-none d-sm-inline">Filter</span>
                  </h6>
                </div>
              </div>

              <Tab.Container defaultActiveKey={"Grid"}>
                <div className="filter-wrapper border-top p-t20">
                  <div className="filter-left-area">
                    <ul className="filter-tag">
                      <li>
                        <Link href={"#"} className="tag-btn">
                          Dresses{" "}
                          <i className="icon feather icon-x tag-close" />
                        </Link>
                      </li>
                    </ul>
                    <span>Showing 1–5 Of {products.length} Results</span>
                  </div>
                  <div className="filter-right-area">
                    <Link
                      href={"#"}
                      className="panel-btn"
                      onClick={() => setMobileSidebar(true)}
                    >
                      Filter
                    </Link>
                    <div className="form-group">
                      <SelectBoxOne />
                    </div>
                    <div className="form-group Category">
                      <SelectBoxTwo />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <Tab.Content className="col-12 tab-content shop-">
                    {/* <Tab.Pane eventKey={"List"}>
                      <div className="row">
                        {products.slice(0, 6).map((item, index) => (
                          <div
                            className="col-md-12 col-sm-12 col-xxxl-6"
                            key={item._id}
                          >
                            {" "}
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={item.price}
                              showdetailModal={() => setDetailModal(true)}
                              _id={""}
                              category={""}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane> */}

                    <Tab.Pane eventKey={"Grid"}>
                      <div className="row gx-xl-4 g-3">
                        {products.map((item, index) => (
                          <div
                            className="col-6 col-xl-3 col-lg-3 col-md-3 col-sm-6 m-b30"
                            key={index}
                          >
                            <ShopGridCard
                              image={
                                item.productImages[0]?.url || "/fallback.jpg"
                              }
                              title={item.name}
                              price={`₦${item.price}`} // ✅ now always 2000
                              showdetailModal={() => setDetailModal(true)}
                              _id={item._id}
                              category={item.category || ""}
                            />
                          </div>
                        ))}
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </div>
              </Tab.Container>

              {/* Pagination */}
              <div className="row page mt-0">
                <div className="col-md-6">
                  <p className="page-text">Showing 1–5 of Results</p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Blog Pagination">
                    <ul className="pagination style-1">
                      <PaginationBlog />
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      <Modal
        className="quick-view-modal"
        centered
        show={detailModal}
        onHide={() => setDetailModal(false)}
      >
        <button
          type="button"
          className="btn-close"
          onClick={() => setDetailModal(false)}
        >
          <i className="icon feather icon-x" />
        </button>
        <div className="modal-body">
          <div className="row g-xl-4 g-3">
            <div className="col-xl-6 col-md-6">
              <div className="dz-product-detail mb-0">
                <div className="swiper-btn-center-lr">
                  <ModalSlider />
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-md-6">
              <BasicModalData />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
