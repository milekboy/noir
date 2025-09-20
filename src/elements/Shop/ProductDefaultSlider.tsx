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

export interface ProductDefaultSliderProps {
  images: {
    url: string;
    public_id: string;
    filename: string;
  }[];
}

export default function ProductDefaultSlider({
  images,
}: ProductDefaultSliderProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className="swiper-btn-center-lr">
      {/* LightGallery wrapper */}
      <LightGallery
        plugins={[lgThumbnail, lgZoom]}
        selector=".DZoomImage"
        speed={500}
      >
        <Swiper
          className="product-gallery-swiper2 rounded"
          spaceBetween={0}
          updateOnWindowResize={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[Thumbs]}
        >
          {/* Slide 1 */}
          <SwiperSlide>
            <div className="dz-media" style={{ position: "relative" }}>
              <Link
                className="mfp-link lg-item DZoomImage"
                href={images[0]?.url}
                data-src={images[0]?.url}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 2,
                  fontSize: "20px",
                  color: "#fff",
                }}
              >
                <i className="feather icon-maximize dz-maximize" />
              </Link>
              <Image
                style={{ cursor: "pointer" }}
                width={900}
                height={900}
                src={images[0]?.url}
                alt="product1"
                onClick={(e) => {
                  e.preventDefault();
                  (
                    document.querySelectorAll(".DZoomImage")[0] as HTMLElement
                  )?.click();
                }}
              />
            </div>
          </SwiperSlide>

          {/* Slide 2 */}
          <SwiperSlide>
            <div className="dz-media" style={{ position: "relative" }}>
              <Link
                className="mfp-link lg-item DZoomImage"
                href={images[1]?.url || images[0]?.url}
                data-src={images[1]?.url || images[0]?.url}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 2,
                  fontSize: "20px",
                  color: "#fff",
                }}
              >
                <i className="feather icon-maximize dz-maximize" />
              </Link>
              <Image
                style={{ cursor: "pointer" }}
                width={900}
                height={900}
                src={images[1]?.url || images[0]?.url}
                alt="product2"
                onClick={(e) => {
                  e.preventDefault();
                  (
                    document.querySelectorAll(".DZoomImage")[1] as HTMLElement
                  )?.click();
                }}
              />
            </div>
          </SwiperSlide>

          {/* Slide 3 */}
          <SwiperSlide>
            <div className="dz-media" style={{ position: "relative" }}>
              <Link
                className="mfp-link lg-item DZoomImage"
                href={images[2]?.url || images[0]?.url}
                data-src={images[2]?.url || images[0]?.url}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 2,
                  fontSize: "20px",
                  color: "#fff",
                }}
              >
                <i className="feather icon-maximize dz-maximize" />
              </Link>
              <Image
                style={{ cursor: "pointer" }}
                width={900}
                height={900}
                src={images[2]?.url || images[0]?.url}
                alt="product3"
                onClick={(e) => {
                  e.preventDefault();
                  (
                    document.querySelectorAll(".DZoomImage")[2] as HTMLElement
                  )?.click();
                }}
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </LightGallery>

      {/* Thumbnail Swiper */}
      <Swiper
        className="product-gallery-swiper thumb-swiper-lg"
        spaceBetween={10}
        slidesPerView={3}
        onSwiper={setThumbsSwiper as any}
        modules={[Thumbs]}
      >
        {[0, 1, 2].map((i) => {
          const img =
            images.length > 0
              ? images[i % images.length]
              : { url: "/placeholder.png" }; // fallback
          return (
            <SwiperSlide key={`thumb-${i}`}>
              <Image
                src={img.url}
                width={100}
                height={100}
                alt={`thumb-${i}`}
                style={{ cursor: "pointer" }}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
