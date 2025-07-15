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
                href={IMAGES.productdetail2png1.src}
                data-src={IMAGES.productdetail2png1.src}
              >
                <i className="feather icon-maximize dz-maximize top-left" />
              </Link>
              <Image
                width={900}
                height={900}
                src={images[0]?.url}
                alt="product1"
              />
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
                  width={900}
                  height={900}
                  alt="product2"
                  src={images[0]?.url}
                  className=" d-none"
                />
              </Link>
              <Image
                width={900}
                height={900}
                src={images[0]?.url}
                alt="product1"
              />
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
                  width={900}
                  height={900}
                  alt="product2"
                  src={images[0]?.url}
                  className=" d-none"
                />
              </Link>
              <Image
                width={900}
                height={900}
                src={images[0]?.url}
                alt="product1"
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
          <Image src={images[0]?.url} width={100} height={100} alt="product1" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={images[0]?.url} width={100} height={100} alt="product1" />
        </SwiperSlide>
        <SwiperSlide>
          <Image src={images[0]?.url} width={100} height={100} alt="product1" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
