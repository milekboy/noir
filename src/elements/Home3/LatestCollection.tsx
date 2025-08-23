import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import SwiperTestimonial from "./SwiperTestimonial";
import Image from "next/image";
import ProductRollup from "@/components/ProductRollup";

export default function LatestoCollection() {
  return (
    <div className="row align-items-center mt-2" >
      <div className="col-lg-12 col-md-12 col-sm-12 m-b3 d-flex justify-content-start ">
        <div className="dz-medi style-2 wow fadeInUp text-center w-100" data-wow-delay="0.2s">
          {/* <Image src={IMAGES.ShopPorductPng3} alt="about"/> */}
          <h1 className="title align-self-start m-b3 display-3 font-bold text-white">
            Smart Wardrobe{" "}
          </h1>
        <center>  <p className=" text-white text-center w-10">
            AI learns
            your unique style preferences, favorite colors, fits, and trends —
            so every suggestion feels like it was handpicked by your personal
            stylist.
          </p></center>
          {/* <button className="btn btn-white btn-md">See more..</button> */}
        </div>
      </div>
      <div className="col-lg-12 col-md-12 col-sm-12 m-b3 ">
        <div className="about-wraper   position-relative ">
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
