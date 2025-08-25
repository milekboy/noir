"use client";
import Link from "next/link";
import { Dropdown } from "react-bootstrap";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useState, useEffect } from "react";

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
  const categories = [
    {
      name: "Women",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "New in Clothing", link: "/shop-standard" },
            { name: "Dresses", link: "/shop-standard", badge: "HOT" },
            { name: "Blazers & Co-ords", link: "/shop-standard" },
            {
              name: "Cardigans",
              link: "/shop-standard",
              badge: "NEW",
            },
            { name: "Hoodies & Sweatshirts", link: "/shop-standard" },
            { name: "Jackets & Coats", link: "/shop-standard" },
            { name: "Jeans", link: "/shop-standard" },
            { name: "Tops & Blouses", link: "/shop-standard" },
            { name: "Skirts & Shorts", link: "/shop-standard" },
            { name: "Trousers & Leggings", link: "/shop-standard" },
            { name: "Suits & Tailoring", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "New in Shoes", link: "/shop-standard" },
            { name: "Heels", link: "/shop-standard" },
            { name: "Boots & Ankle Boots", link: "/shop-standard" },
            { name: "Loafers & Mules", link: "/shop-standard" },
            { name: "Sneakers", link: "/shop-standard" },
            { name: "Sandals & Slides", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Handbags", link: "/shop-standard" },
            {
              name: "Mini Bags",
              link: "/shop-standard",
              badge: "TRENDING",
            },
            { name: "Belts", link: "/shop-standard" },
            { name: "Sunglasses", link: "/shop-standard" },
            { name: "Hats & Caps", link: "/shop-standard" },
            { name: "Scarves", link: "/shop-standard" },
            { name: "Jewelry", link: "/shop-standard" },
            { name: "Watches", link: "/shop-standard" },
          ],
        },
        // {
        //   title: "Activewear",
        //   items: [
        //     { name: "Sports Bras", link: "/shop-standard" },
        //     { name: "Leggings", link: "/shop-standard" },
        //     { name: "Workout Tops", link: "/shop-standard" },
        //     { name: "Track Jackets", link: "/shop-standard" },
        //     { name: "Running Shoes", link: "/shop-standard" },
        //     { name: "Gym Bags", link: "/shop-standard" },
        //   ],
        // },
        {
          title: "Seasonal Picks",
          items: [
            { name: "Summer Dresses", link: "/shop-standard" },
            { name: "Winter Coats", link: "/shop-standard" },
            { name: "Rainwear", link: "/shop-standard" },
            { name: "Holiday Shop", link: "/shop-standard", badge: "HOT" },
            { name: "Resort Wear", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Men",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "New in Clothing", link: "/shop-standard" },
            { name: "Chinos", link: "/shop-standard" },
            { name: "Cardigans", link: "/shop-standard", badge: "NEW" },
            { name: "Hoodies and Sweatshirts", link: "/shop-standard" },
            { name: "Jackets and Coats", link: "/shop-standard" },
            { name: "Jeans", link: "/shop-standard" },
            { name: "Shirts", link: "/shop-standard" },
            { name: "T-Shirts & Polos", link: "/shop-standard" },
            { name: "Shorts", link: "/shop-standard" },
            { name: "Suits & Tailoring", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "New in Shoes", link: "/shop-standard" },
            { name: "Sneakers", link: "/shop-standard" },
            { name: "Boots", link: "/shop-standard" },
            { name: "Loafers", link: "/shop-standard" },
            { name: "Sandals & Slides", link: "/shop-standard" },
            { name: "Formal Shoes", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Bags & Backpacks", link: "/shop-standard" },
            { name: "Belts", link: "/shop-standard" },
            { name: "Sunglasses", link: "/shop-standard" },
            { name: "Caps & Hats", link: "/shop-standard" },
            { name: "Scarves & Gloves", link: "/shop-standard" },
            { name: "Wallets", link: "/shop-standard" },
            { name: "Watches", link: "/shop-standard", badge: "TRENDING" },
          ],
        },
        {
          title: "Activewear",
          items: [
            { name: "Gym T-Shirts", link: "/shop-standard" },
            { name: "Performance Shorts", link: "/shop-standard" },
            { name: "Track Pants", link: "/shop-standard" },
            { name: "Sports Jackets", link: "/shop-standard" },
            { name: "Running Shoes", link: "/shop-standard" },
            { name: "Sports Bags", link: "/shop-standard" },
          ],
        },
        {
          title: "Seasonal Picks",
          items: [
            { name: "Summer Essentials", link: "/shop-standard" },
            { name: "Winter Coats", link: "/shop-standard" },
            { name: "Rain Jackets", link: "/shop-standard" },
            { name: "Holiday Outfits", link: "/shop-standard", badge: "HOT" },
            { name: "Resort Wear", link: "/shop-standard" },
          ],
        },
      ],
    },

    {
      name: "Corporate but Chic",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "Blazers", link: "/shop-standard", badge: "HOT" },
            { name: "Tailored Trousers", link: "/shop-standard" },
            { name: "Pencil Skirts", link: "/shop-standard" },
            { name: "Shirt Dresses", link: "/shop-standard" },
            { name: "Silk Blouses", link: "/shop-standard" },
            { name: "Smart Jumpsuits", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            {
              name: "Pointed Heels",
              link: "/shop-standard",
              badge: "TRENDING",
            },
            { name: "Loafers", link: "/shop-standard" },
            { name: "Block Heels", link: "/shop-standard" },
            { name: "Ankle Boots", link: "/shop-standard" },
            { name: "Chic Flats", link: "/shop-standard" },
          ],
        },
        {
          title: "Outerwear",
          items: [
            { name: "Trench Coats", link: "/shop-standard" },
            { name: "Tailored Coats", link: "/shop-standard" },
            { name: "Structured Jackets", link: "/shop-standard" },
            { name: "Cropped Blazers", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Leather Totes", link: "/shop-standard", badge: "HOT" },
            { name: "Statement Belts", link: "/shop-standard" },
            { name: "Minimalist Watches", link: "/shop-standard" },
            { name: "Silk Scarves", link: "/shop-standard" },
            { name: "Delicate Jewelry", link: "/shop-standard" },
          ],
        },
        {
          title: "Workwear Essentials",
          items: [
            { name: "Classic White Shirts", link: "/shop-standard" },
            { name: "Neutral Trousers", link: "/shop-standard" },
            { name: "Black Dresses", link: "/shop-standard" },
            { name: "Nude Pumps", link: "/shop-standard" },
            { name: "Structured Handbags", link: "/shop-standard" },
          ],
        },
      ],
    },

    {
      name: "Girls' Night Look",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "Bodycon Dresses", link: "/shop-standard", badge: "HOT" },
            { name: "Mini Skirts", link: "/shop-standard" },
            { name: "Sequin Tops", link: "/shop-standard", badge: "NEW" },
            { name: "Leather Pants", link: "/shop-standard" },
            { name: "Corset Tops", link: "/shop-standard" },
            { name: "Co-ord Sets", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            {
              name: "Strappy Heels",
              link: "/shop-standard",
              badge: "TRENDING",
            },
            { name: "Platform Sandals", link: "/shop-standard" },
            { name: "Pointed Toe Heels", link: "/shop-standard" },
            { name: "Ankle Boots", link: "/shop-standard" },
          ],
        },
        {
          title: "Outerwear",
          items: [
            { name: "Faux Fur Jackets", link: "/shop-standard", badge: "HOT" },
            { name: "Leather Jackets", link: "/shop-standard" },
            { name: "Blazer Dresses", link: "/shop-standard" },
            { name: "Chic Cropped Jackets", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Clutch Bags", link: "/shop-standard", badge: "TRENDING" },
            { name: "Statement Earrings", link: "/shop-standard" },
            { name: "Layered Necklaces", link: "/shop-standard" },
            { name: "Bold Rings", link: "/shop-standard" },
            { name: "Sparkly Hair Clips", link: "/shop-standard" },
          ],
        },
        {
          title: "Party Essentials",
          items: [
            {
              name: "Little Black Dress",
              link: "/shop-standard",
              badge: "ICONIC",
            },
            { name: "Metallic Dresses", link: "/shop-standard" },
            { name: "High Shine Makeup", link: "/shop-standard" },
            { name: "Statement Heels", link: "/shop-standard" },
            { name: "Mini Shoulder Bags", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Smart Casual Staples",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "Blazers", link: "/shop-standard", badge: "HOT" },
            { name: "Tailored Trousers", link: "/shop-standard" },
            { name: "Polo Shirts", link: "/shop-standard" },
            { name: "Oxford Shirts", link: "/shop-standard" },
            { name: "Midi Skirts", link: "/shop-standard" },
            { name: "Smart Jeans", link: "/shop-standard", badge: "TRENDING" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "Loafers", link: "/shop-standard", badge: "NEW" },
            { name: "Chelsea Boots", link: "/shop-standard" },
            { name: "Block Heels", link: "/shop-standard" },
            { name: "White Sneakers", link: "/shop-standard" },
          ],
        },
        {
          title: "Outerwear",
          items: [
            { name: "Trench Coats", link: "/shop-standard" },
            { name: "Light Blazers", link: "/shop-standard" },
            { name: "Cardigans", link: "/shop-standard" },
            { name: "Denim Jackets", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Leather Belts", link: "/shop-standard" },
            { name: "Crossbody Bags", link: "/shop-standard" },
            { name: "Watches", link: "/shop-standard", badge: "CLASSIC" },
            { name: "Minimalist Jewelry", link: "/shop-standard" },
            { name: "Silk Scarves", link: "/shop-standard" },
          ],
        },
        {
          title: "Everyday Staples",
          items: [
            { name: "Neutral Tees", link: "/shop-standard" },
            { name: "Slim-Fit Trousers", link: "/shop-standard" },
            { name: "Breton Stripes", link: "/shop-standard" },
            { name: "Chinos", link: "/shop-standard" },
            { name: "Smart Knitwear", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Back to Campus",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "Hoodies & Sweatshirts", link: "/shop-standard" },
            { name: "T-Shirts & Polos", link: "/shop-standard" },
            { name: "Casual Shirts", link: "/shop-standard" },
            { name: "Jeans & Chinos", link: "/shop-standard" },
            { name: "Joggers & Track Pants", link: "/shop-standard" },
            { name: "Jackets & Windbreakers", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "Sneakers", link: "/shop-standard", badge: "TRENDING" },
            { name: "Casual Shoes", link: "/shop-standard" },
            { name: "Slip-Ons", link: "/shop-standard" },
            { name: "Boots", link: "/shop-standard" },
            { name: "Sandals & Slides", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Backpacks", link: "/shop-standard", badge: "HOT" },
            { name: "Laptop Bags", link: "/shop-standard" },
            { name: "Caps & Hats", link: "/shop-standard" },
            { name: "Watches", link: "/shop-standard" },
            { name: "Wallets", link: "/shop-standard" },
            { name: "Phone Accessories", link: "/shop-standard" },
          ],
        },
        {
          title: "Essentials",
          items: [
            { name: "Water Bottles", link: "/shop-standard" },
            { name: "Stationery", link: "/shop-standard" },
            { name: "Tech Gadgets", link: "/shop-standard" },
            { name: "Notebooks & Planners", link: "/shop-standard" },
            { name: "Headphones & Earbuds", link: "/shop-standard" },
          ],
        },
        {
          title: "Loungewear",
          items: [
            { name: "Comfy Joggers", link: "/shop-standard" },
            { name: "Oversized Hoodies", link: "/shop-standard" },
            { name: "Relaxed Tees", link: "/shop-standard" },
            { name: "Slides", link: "/shop-standard" },
            { name: "Pyjamas & Sleepwear", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Gym & Go",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Activewear",
          items: [
            { name: "Sports Bras", link: "/shop-standard", badge: "HOT" },
            { name: "Leggings", link: "/shop-standard" },
            { name: "Biker Shorts", link: "/shop-standard", badge: "TRENDING" },
            { name: "Tank Tops", link: "/shop-standard" },
            { name: "Performance Tees", link: "/shop-standard" },
          ],
        },
        {
          title: "Outerwear",
          items: [
            { name: "Track Jackets", link: "/shop-standard" },
            { name: "Zip-Up Hoodies", link: "/shop-standard" },
            { name: "Lightweight Wind", link: "/shop-standard", badge: "NEW" },
            { name: "Oversized Sweatshirts", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "Running Shoes", link: "/shop-standard" },
            { name: "Training Sneakers", link: "/shop-standard", badge: "HOT" },
            { name: "Slip-On Sneakers", link: "/shop-standard" },
            { name: "Sport Sandals", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Gym Bags", link: "/shop-standard", badge: "TRENDING" },
            { name: "Water Bottles", link: "/shop-standard" },
            { name: "Fitness Trackers", link: "/shop-standard" },
            { name: "Caps & Headbands", link: "/shop-standard" },
            { name: "Sport Socks", link: "/shop-standard" },
          ],
        },
        {
          title: "Athleisure Staples",
          items: [
            { name: "Joggers", link: "/shop-standard" },
            { name: "Crop Hoodies", link: "/shop-standard" },
            { name: "Oversized Tees", link: "/shop-standard" },
            { name: "Seamless Sets", link: "/shop-standard", badge: "HOT" },
            { name: "Everyday Sneakers", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Summer Looks",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            { name: "Summer Dresses", link: "/shop-standard", badge: "HOT" },
            { name: "Linen Shirts", link: "/shop-standard" },
            { name: "Shorts & Skirts", link: "/shop-standard" },
            { name: "Crop Tops & Tanks", link: "/shop-standard" },
            { name: "Kaftans & Kimonos", link: "/shop-standard" },
            { name: "Lightweight Trousers", link: "/shop-standard" },
          ],
        },
        {
          title: "Swimwear",
          items: [
            { name: "Bikinis", link: "/shop-standard", badge: "TRENDING" },
            { name: "One-Piece Swimsuits", link: "/shop-standard" },
            { name: "Swim Shorts", link: "/shop-standard" },
            { name: "Cover-Ups", link: "/shop-standard" },
            { name: "Beach Sets", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "Sandals", link: "/shop-standard" },
            { name: "Slides", link: "/shop-standard", badge: "NEW" },
            { name: "Espadrilles", link: "/shop-standard" },
            { name: "Flip Flops", link: "/shop-standard" },
            { name: "Light Sneakers", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Straw Hats", link: "/shop-standard", badge: "HOT" },
            { name: "Sunglasses", link: "/shop-standard" },
            { name: "Beach Bags", link: "/shop-standard" },
            { name: "Light Scarves", link: "/shop-standard" },
            { name: "Jewelry (Bright & Fun)", link: "/shop-standard" },
          ],
        },
        {
          title: "Resort Wear",
          items: [
            { name: "Maxi Dresses", link: "/shop-standard" },
            { name: "Printed Co-ords", link: "/shop-standard" },
            { name: "Linen Co-ords", link: "/shop-standard" },
            { name: "Holiday Party Dresses", link: "/shop-standard" },
            { name: "Evening Sandals", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Travel Light",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Clothing",
          items: [
            {
              name: "Wrinkle-Free Dresses",
              link: "/shop-standard",
              badge: "HOT",
            },
            { name: "Jumpsuits & Rompers", link: "/shop-standard" },
            { name: "Lightweight Trousers", link: "/shop-standard" },
            { name: "Breathable Tees", link: "/shop-standard" },
            {
              name: "Packable Outerwear",
              link: "/shop-standard",
              badge: "NEW",
            },
          ],
        },
        {
          title: "Footwear",
          items: [
            {
              name: "Slip-On Sneakers",
              link: "/shop-standard",
              badge: "TRENDING",
            },
            { name: "Comfort Sandals", link: "/shop-standard" },
            { name: "Lightweight Trainers", link: "/shop-standard" },
            { name: "Foldable Flats", link: "/shop-standard" },
          ],
        },
        {
          title: "Travel Essentials",
          items: [
            { name: "Carry-On Bags", link: "/shop-standard", badge: "HOT" },
            { name: "Weekender Bags", link: "/shop-standard" },
            { name: "Packing Cubes", link: "/shop-standard" },
            { name: "Travel Wallets", link: "/shop-standard" },
            { name: "Neck Pillows", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Crossbody Bags", link: "/shop-standard" },
            { name: "Sunglasses", link: "/shop-standard" },
            { name: "Scarves & Wraps", link: "/shop-standard" },
            { name: "Hats & Caps", link: "/shop-standard" },
            { name: "Compact Umbrellas", link: "/shop-standard" },
          ],
        },
        {
          title: "Layering Staples",
          items: [
            { name: "Light Cardigans", link: "/shop-standard" },
            { name: "Overshirts", link: "/shop-standard" },
            { name: "Puffer Jackets", link: "/shop-standard", badge: "NEW" },
            { name: "Denim Jackets", link: "/shop-standard" },
            { name: "Versatile Blazers", link: "/shop-standard" },
          ],
        },
      ],
    },
    {
      name: "Layered Looks",
      icon: "icon feather icon-arrow-right",
      menuIcon: "icon feather icon-chevron-right",
      subcategories: [
        {
          title: "Base Layers",
          items: [
            { name: "Turtlenecks", link: "/shop-standard", badge: "TRENDING" },
            { name: "Long-Sleeve Tees", link: "/shop-standard" },
            { name: "Slim Fit Tops", link: "/shop-standard" },
            { name: "Camis & Tanks", link: "/shop-standard" },
            { name: "Seamless Bodysuits", link: "/shop-standard" },
          ],
        },
        {
          title: "Mid Layers",
          items: [
            { name: "Cardigans", link: "/shop-standard" },
            { name: "Sweatshirts", link: "/shop-standard" },
            { name: "Overshirts", link: "/shop-standard" },
            { name: "Vests & Gilets", link: "/shop-standard", badge: "HOT" },
            { name: "Lightweight Knits", link: "/shop-standard" },
          ],
        },
        {
          title: "Outerwear",
          items: [
            { name: "Trench Coats", link: "/shop-standard" },
            {
              name: "Denim Jackets",
              link: "/shop-standard",
              badge: "TRENDING",
            },
            { name: "Blazers", link: "/shop-standard" },
            { name: "Bomber Jackets", link: "/shop-standard" },
            { name: "Wool Coats", link: "/shop-standard" },
          ],
        },
        {
          title: "Accessories",
          items: [
            { name: "Blanket Scarves", link: "/shop-standard", badge: "NEW" },
            { name: "Beanies & Berets", link: "/shop-standard" },
            { name: "Statement Belts", link: "/shop-standard" },
            { name: "Gloves", link: "/shop-standard" },
            { name: "Layered Jewelry", link: "/shop-standard" },
          ],
        },
        {
          title: "Footwear",
          items: [
            { name: "Ankle Boots", link: "/shop-standard", badge: "HOT" },
            { name: "Chunky Sneakers", link: "/shop-standard" },
            { name: "Chelsea Boots", link: "/shop-standard" },
            { name: "Knee-High Boots", link: "/shop-standard" },
            { name: "Loafers", link: "/shop-standard" },
          ],
        },
      ],
    },
  ];

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
            <Link href="/shop-standard">
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
              <div className="mega-menu ms-2 ">
                <div className="row ">
                  {item.subcategories.map((subcat, ind) => (
                    <div key={ind} className="col-md-3 col-sm-4 col-6">
                      <Link href={"#"} className="menu-title">
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
                            <Link href={"/shop-standard"}>
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
