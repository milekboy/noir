"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { ShopCatSlider } from "../../constant/Alldata";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/bundle";

export default function ShopCategorySlider() {
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
      {ShopCatSlider.map((item, index) => (
        <SwiperSlide key={index}>
          <div className="shop-card">
            <div className="dz-media rounded overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                width={200}
                height={200}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="dz-content">
              <h6 className="title">
                <Link href={`/shop-list?category=${item.id}`}>{item.name}</Link>
              </h6>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
