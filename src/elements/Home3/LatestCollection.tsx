import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import SwiperTestimonial from "./SwiperTestimonial";
import Image from "next/image";
import ProductRollup from "@/components/ProductRollup";

export default function LatestoCollection() {
  return (
    <div className="row align-items-center g- " >
      <div className="col-lg-5 col-md-12 col-sm-12 m-b3 d-flex justify-content-start ">
        <div className="dz-medi style-2 wow fadeInUp" data-wow-delay="0.2s">
          {/* <Image src={IMAGES.ShopPorductPng3} alt="about"/> */}
          <h1 className="title align-self-start m-b30 display-2 font-bold">
            Smart Wardrobe{" "}
          </h1>
          <p>
            We’ve reimagined the way you dress for every occasion. Our AI learns
            your unique style preferences, favorite colors, fits, and trends —
            so every suggestion feels like it was handpicked by your personal
            stylist. No more endless scrolling or decision fatigue. Just open
            Smart Wardrobe, choose your category, and discover full-outfit ideas
            that match your mood, personality, and occasion — instantly.
          </p>
          {/* <button className="btn btn-white btn-md">See more..</button> */}
        </div>
      </div>
      <div className="col-lg-7 col-md-12 col-sm-12 m-b30 ">
        <div className="about-wraper   position-relative">
          <div
            className="section-head style-1 wow fadeInUp d-lg-flex justify-content-between align-items-center"
            data-wow-delay="0.4s"
          >
            {/* <h3 className="title align-self-end">AI Outfit suggestion</h3> */}
            {/* <Link
              href="/shop-standard"
              className="icon-button d-md-block d-none ms-md-auto m-b"
            >
              <div className="text-row word-rotate-box c-black">
                <ProductRollup />
                <svg
                  className="badge__emoji"
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  dangerouslySetInnerHTML={{ __html: SVGICON.ArrowRightSvg }}
                ></svg>
              </div>
            </Link> */}
          </div>
          <SwiperTestimonial />
        </div>
      </div>
    </div>
  );
}
