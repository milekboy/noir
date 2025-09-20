"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import NetworkInstance from "@/app/api/NetworkInstance";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/bundle";

export default function ShopCategorySlider({
  onCategorySelect,
}: {
  onCategorySelect: (id: string) => void;
}) {
  interface Category {
    _id: string;
    label: string;
    image: string[];
    __v: number;
  }

  const [category, setCategory] = useState<Category[]>([]);
  const networkInstance = NetworkInstance();

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const res = await networkInstance.get("category/get-all-categories");
      setCategory(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <Swiper
      className="category-swiper"
      modules={[Autoplay]}
      loop
      slidesPerView={4}
      spaceBetween={20}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        1600: { slidesPerView: 6 },
        1200: { slidesPerView: 5 },
        991: { slidesPerView: 4 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
        320: { slidesPerView: 1 },
      }}
    >
      {category.map((item, index) => (
        <SwiperSlide key={index}>
          <div
            onClick={() => onCategorySelect(item._id)}
            className="flex items-center gap-4 p-3 border rounded-md bg-white hover:shadow-sm transition cursor-pointer"
            style={{ display: "flex", alignItems: "center" }}
          >
            {/* Bigger Image */}
            <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded">
              <Image
                src={
                  item.image[0] ||
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
                }
                alt={item.label}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text beside image */}
            <h6 className="text-base font-medium whitespace-nowrap" style={{ float: "right" }}>
              <Link href={`/shop-list?category=${item._id}`}>
                {item.label}
              </Link>
            </h6>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
