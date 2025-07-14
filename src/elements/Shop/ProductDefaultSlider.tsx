"use client";
import Link from "next/link";
import IMAGES from "../../constant/theme";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import { useState } from "react";
import LightGallery from "lightgallery/react";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import Image from "next/image";
import { useEffect } from "react";
import NetworkInstance from "@/app/api/NetworkInstance";

interface ProductImage {
  url: string;
}

interface PopularProduct {
  productImages: ProductImage[];
  description: string;
  name: string;
  price: string;
  category: string;
  _id: string;
}

/** The product returned from the API. */

export default function ProductDefaultSlider() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const [product, setProduct] = useState<PopularProduct | null>(null);

  // const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const network = NetworkInstance();

    async function fetchProduct() {
      try {
        const res = await network.get(
          "/product/get-product/685e1123bc259461ad56b4ea"
        );

        console.log(res.data);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to load product", error);
      }
    }

    fetchProduct();
  }, []);

  console.log(product?.productImages[0].url);

  return (
    <div className="swiper-btn-center-lr">
      <LightGallery plugins={[lgThumbnail, lgZoom]} selector={".DZoomImage"}>
        <Swiper
          className="product-gallery-swiper2 rounded"
          spaceBetween={0}
          updateOnWindowResize={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Thumbs]}
        >
          <SwiperSlide>
            <div className="dz-media">
              <Link
                className="mfp-link lg-item DZoomImage"
                href={product?.productImages?.[0]?.url || "#"}
                data-src={product?.productImages?.[0]?.url}
              >
                <i className="feather icon-maximize dz-maximize top-left" />
                {/* <Image src={product?.productImages[0].url} width={1000} height={1000} alt="" className=" d-none"/>  */}
                {product?.productImages?.[0]?.url && (
                  <Image
                    src={
                      "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                    }
                    width={1000}
                    height={1000}
                    alt="product1"
                  />
                )}
              </Link>
              {/* <Image src={IMAGES.productdetail2png1} alt="product1" /> */}
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="dz-media">
              <Link
                className="mfp-link lg-item DZoomImage"
                href={IMAGES.productdetail2png2.src}
                data-src={IMAGES.productdetail2png2.src}
              >
                <i className="feather icon-maximize dz-maximize top-left" />
                <Image
                  src={
                    "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                  }
                  width={1000}
                  height={1000}
                  alt="product2"
                  className="d-none"
                />
              </Link>
              <Image
                src={
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                }
                width={1000}
                height={1000}
                alt="product2"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="dz-media">
              <Link
                className="mfp-link lg-item DZoomImage"
                href={"www.facebook.com"}
                data-src={
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                }
              >
                <i className="feather icon-maximize dz-maximize top-left" />
                {/* <Image
                  src={
                    "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                  }
                  width={1000}
                  height={1000}
                  alt="product3"
                /> */}
              </Link>
              <Image
                src={
                  "https://res.cloudinary.com/dk6wshewb/image/upload/v1750995787/uploads/hcw00lvijppetxwe7sso.png"
                }
                width={1000}
                height={1000}
                alt="product3"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </LightGallery>
      <Swiper
        className="product-gallery-swiper thumb-swiper-lg"
        spaceBetween={10}
        slidesPerView={2}
        //freeMode: true,
        //watchSlidesProgress: true,
        // @ts-ignore
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
      >
        <SwiperSlide>
          {/* <Image src={IMAGES.productdetail2thumbpng1} alt="product1" /> */}

          {/* <Image src={product?.productImages[0].url} width={1000} height={1000} alt="product" className="d-none" /> */}
          {product?.productImages ? (
            <Image
              src={product?.productImages[0].url}
              width={1000}
              height={1000}
              alt={product?.name}
            />
          ) : (
            "null"
          )}
        </SwiperSlide>
        <SwiperSlide>
          {product?.productImages ? (
            <Image
              src={product?.productImages[0].url}
              width={1000}
              height={1000}
              alt={product?.name}
            />
          ) : (
            "null"
          )}
        </SwiperSlide>
        <SwiperSlide>
          {product?.productImages ? (
            <Image
              src={product?.productImages[0].url}
              width={1000}
              height={1000}
              alt={product?.name}
            />
          ) : (
            "null"
          )}
        </SwiperSlide>
      </Swiper>
    </div>
  );

  //   const [images, setImages] = useState<ImageData | null>(null);

  // useEffect(() => {
  //   fetch("localhost:8000/api/product/get-product/685e1123bc259461ad56b4ea")
  //     .then((res) => res.json())
  //     .then((data: ImageData) => {
  //       console.log("Product Images:", data);
  //       setImages(data);
  //     })
  //     .catch((err) => console.error("Error loading images:", err));
  // }, []);

  // // Handle loading state
  // if (!images) return <div>Loading images...</div>;

  // return (
  //   <div>
  //     <h2>Slides</h2>
  //     {images.slides.map((img) => (
  //       <Image key={img.id} src={img.src} alt={img.alt} width={200} height={200} />
  //     ))}

  //     <h2>Thumbnails</h2>
  //     {images.thumbnails.map((img) => (
  //       <Image key={img.id} src={img.src} alt={img.alt} width={100} height={100} />
  //     ))}
  //   </div>
  // );
}