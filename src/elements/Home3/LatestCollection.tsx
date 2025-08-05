import Link from "next/link";
import IMAGES, { SVGICON } from "../../constant/theme";
import SwiperTestimonial from "./SwiperTestimonial";
import Image from "next/image";
import ProductRollup from "@/components/ProductRollup";

export default function LatestoCollection() {
  return (
    <div className="row align-items-center">
      <div className="col-lg-4 col-md-12 m-b30 d-flex justify-content-start ">
        <div className="dz-medi style-2 wow fadeInUp" data-wow-delay="0.2s">
          {/* <Image src={IMAGES.ShopPorductPng3} alt="about"/> */}
          <h1 className="title align-self-start m-b30 display-1 font-bolder">AI Outfit suggestion</h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rerum,
            soluta atque ut totam facere ducimus magnam incidunt eos voluptatem
            quia, nulla assumenda aspernatur. Voluptatem sapiente quidem maxime
            velit porro ad, ullam amet aliquid quo possimus facere commodi quod
            mollitia culpa magnam obcaecati, inventore recusandae voluptates
            atque sed! Reiciendin.
          </p>
          <button className="btn btn-white btn-md">See more..</button>
        </div>
      </div>
      <div className="col-lg-8 col-md-12 m-b30">
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
