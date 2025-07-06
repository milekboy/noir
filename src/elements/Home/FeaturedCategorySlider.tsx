"use client"

import Link from "next/link";
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FeaturedSliderData } from '../../constant/Alldata';
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

    // console.log(category)
    return (
        <Swiper 
            slidesPerView = {5}
            spaceBetween = {15}
            loop = {true}                       
            navigation = {{
                nextEl: ".shop-button-next",
                prevEl: ".shop-button-prev",
            }}
            className="swiper-shop"
            modules={[Navigation]}
            breakpoints= {{
                1600: {
                    slidesPerView: 5,
                },
                1400: {
                    slidesPerView: 4,
                },
                991: {
                    slidesPerView: 3,
                },
                767: {
                    slidesPerView: 3,
                },
                575: {
                    slidesPerView: 2,
                },
                340: {
                    slidesPerView: 2,
                },
            }}
        >
            {category.map((item, ind)=>(
                <SwiperSlide key={ind}>
                    <div className="shop-box style-1 wow fadeInUp" data-wow-delay="0.2s">
                        <div className="dz-media">
                            <Image src={
                                item.image[0] ||
                                "https://res.cloudinary.com/dk6wshewb/image/upload/v1751085914/uploads/yx8zj5qvm8fgpiad93t4.jpg"
                                } alt={item.name}
                                width={200}
                                height={200} />
                        </div>
                        <h6 className="product-name"><Link href="/shop-with-category">{item.name}</Link></h6>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default FeaturedCategorySlider; 