"use client";
import { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import NetworkInstance from "@/app/api/NetworkInstance";
// Sample Data
import { MainSwiperData, MainSwiperData2 } from "../../constant/Alldata";

const MainBannerSlider2 = () => {
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
  const mainSliderRef = useRef<Slider | null>(null);
  const thumbSliderRef = useRef<Slider | null>(null);
  // slider arrow
  const [nav1, setNav1] = useState<Slider | undefined>(undefined);
  const [nav2, setNav2] = useState<Slider | undefined>(undefined);
  useEffect(() => {
    setNav1(mainSliderRef.current || undefined);
    setNav2(thumbSliderRef.current || undefined);
  }, []);

  const mainSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: false,
    infinite: true,
    // asNavFor: thumbSliderRef.current!,
    asNavFor: nav2,
  };

  const thumbSettings = {
    slidesToShow: 2,
    slidesToScroll: 1,
    dots: false,
    centerMode: false,
    infinite: true,
    focusOnSelect: true,
    // asNavFor: mainSliderRef.current!,
    asNavFor: nav1,
  };

  return (
    <div className="row main-slide">
      {/* Main Slider */}
      <div className="col-lg-6">
        <Slider ref={mainSliderRef} {...mainSettings} className="slider-main">
          {products.map((item, index) => (
            <div className="content-info" key={index}>
              <h1 className="title">{item.name}</h1>
              <div className="swiper-meta-items">
                <div className="meta-content">
                  <span className="price-name">Price</span>
                  <span className="price-num d-inline-block">
                    &#8358;{item.price}
                  </span>
                </div>
              </div>
              <div className="content-btn m-b30">
                <Link
                  href="/shop-cart"
                  className="btn btn-secondary me-xl-3 me-2 btnhover20"
                >
                  ADD TO CART
                </Link>
                <Link
                  href={`/product-default/${item._id}`}
                  className="btn btn-outline-secondary btnhover20"
                >
                  VIEW DETAIL{" "}
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="col-lg-6">
        <Slider
          ref={thumbSliderRef}
          {...thumbSettings}
          className="slider-thumbs"
        >
          {products.map((item, i) => (
            <div className="banner-media" key={i} data-name={item.name}>
              <div className="img-preview">
                <Image
                  width={100}
                  height={100}
                  src={item.productImages[0]?.url || "/fallback.jpg"}
                  alt="banner-media"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};
export default MainBannerSlider2;
