"use client";

import Link from "next/link";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import NetworkInstance from "@/app/api/NetworkInstance";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  image: string[];
  __v: number;
}

const FeaturedCategorySlider = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const networkInstance = NetworkInstance();
  const [loading, setLoading] = useState(true);
  
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
    } finally {
      setLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="d-flex gap-4 overflow-hidden py-2">
      {Array.from({ length: 5 }).map((_, ind) => (
        <div
          key={ind}
          className="flex-shrink-0"
          style={{
            width: "235px",
            transform: ind % 2 ? "translateY(55px)" : "translateY(0)",
          }}
        >
          <div className="dz-media">
            <div
              style={{
                width: "100%",
                height: "300px",
                backgroundColor: "#e0e0e0",
                position: "relative",
                borderRadius:"23px",
                overflow: "hidden",
              }}
            >
              {/* Shining effect */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                  animation: "shine 2s ease-in-out infinite",
                }}
              />
            </div>
            <div
              className="mt-2"
              style={{ transform: "translateY(-20px)" }}
            >
              {/* <div
                style={{
                  width: "80px",
                  height: "12px",
                  backgroundColor: "#e0e0e0",
                  position: "relative",
                  borderRadius:"23px",
                  overflow: "hidden",
                }}
              >
                
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                    animation: "shine 2s ease-in-out infinite",
                    animationDelay: "0.3s",
                  }}
                />
              </div> */}
            </div>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );

  // console.log(category)
  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Swiper
      slidesPerView={5}
      spaceBetween={0}
      autoplay={{
        delay: 100,
      }}
      speed={1000}
      parallax={true}
      loop={true}
      navigation={{
        nextEl: ".shop-button-next",
        prevEl: ".shop-button-prev",
      }}
      className="swiper-shop"
      modules={[Navigation, Autoplay]}
      breakpoints={{
        1600: {
          slidesPerView: 5,
        },
        1400: {
          slidesPerView: 5,
        },
        991: {
          slidesPerView: 4,
        },
        767: {
          slidesPerView: 3,
        },
        575: {
          slidesPerView: 2,
        },
        340: {
          slidesPerView: 1,
        },
      }}
    >
      {category.map((item, ind) => (
        <SwiperSlide key={ind}>
          <div
            className={`shop-box style-1 wow fadeInUp me-4 ${
              ind % 2 ? "tran" : ""
            }`}
            data-wow-delay="0.2s"
            style={{
              transform: ind % 2 ? "translateY(60px)" : "translateY(0)",
            }}
          >
            <div className="dz-media ">
              <Image
                src={
                  item.image[0] ||
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
                }
                alt={item.name}
                width={500}
                height={500}
                style={{
                  objectPosition: "top"
                }}
                className=""
              />
              <h6
                className="product-name text-[10px] position-absolut"
                style={{ transform: "translateY(-70px)" }}
              >
                <Link href="/shop-with-category">{item.name}</Link>
              </h6>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default FeaturedCategorySlider;
