"use client";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ShopCatSlider } from "../../constant/Alldata";
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
    name: string;
    image: string[];
    __v: number;
  }
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
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  return (
    <Swiper
      className="category-swiper"
      modules={[Autoplay]}
      loop={true}
      slidesPerView={7}
      spaceBetween={20}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
      }}
      breakpoints={{
        1600: { slidesPerView: 7 },
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
            className="shop-card "
          >
            <div
              style={{ cursor: "pointer", minHeight: "100px" }}
              className="dz-media rounded overflow-hidden"
              
            >
              <Image
                src={
                  item.image[0] ||
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
                }
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-50 object-cover"
                style={{height:"100px!important"}}
              />
            </div>
            <div className="dz-content position-absolute d-flex justify-content-center align-items-center w-100" style={{bottom:50 , left:0}}>
              <h6 className="title w-auto p-2 px-3 bg-white rounded-5 border-1 border-black" >
                <Link href={`/shop-list?category=${item._id}`}>
                  {item.name}
                </Link>
              </h6>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
