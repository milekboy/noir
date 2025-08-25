"use client";

import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import IMAGES from "@/constant/theme";
import FeaturedBlog from "@/components/FeaturedBlog";
import CollectionBlog from "@/elements/Home/CollectionBlog";
import DzTextSlider from "@/elements/Home/DzTextSlider";
import ProductSection from "@/elements/Home/ProductSection";
import SummerSaleBlog from "@/elements/Home/SummerSaleBlog";
import LatestoCollection from "@/elements/Home3/LatestCollection";
import Image from "next/image";

const MainSection = () => {
  const [openVideo, setOpenVideo] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Auto show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Hero Image Fade Logic
  const heroImages = [IMAGES.herobg, IMAGES.herobg3, IMAGES.herobg4];
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        setFade(true);
      }, 500);
    }, 9000);
    return () => clearInterval(interval);
  }, [heroImages]);

  const nextImage = (currentImage + 1) % heroImages.length;

  return (
    <Fragment>
      {/* ---------- Hero Section ---------- */}
      <div
        className="h-100vh mb-5 "
        style={{
          zIndex: 1,
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div className="hero-banner d-flex justify-content-start align-items-center h-100">
          <div className="container">
            <div className="row justify-content-start">
              <div
                className="col-lg-4 col-md-10 col-sm-12 text-start d-flex flex-column justify-content-end"
                style={{ height: "500px", position: "relative" }}
              >
                <h1 className="text-white mb-4">Virtual Try-on NOW LIVE!</h1>
                <p className="text-white mb-5">
                  Discover the latest trends in fashion and style with our
                  exclusive collections.
                </p>
                <Link href="/try-on" className="btn btn-primary w-50">
                  Try Now
                </Link>
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Image
              src={heroImages[currentImage]}
              alt="hero-banner"
              className="w-100 h-100"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -2,
                objectFit: "cover",
                objectPosition: "top",
                opacity: fade ? 1 : 0,
                transition: "opacity 1s ease-in-out",
              }}
            />
            <Image
              src={heroImages[nextImage]}
              alt="hero-banner-next"
              className="w-100 h-100"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: -3,
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
          </div>
        </div>
      </div>

      {/* ---------- Page Content ---------- */}
      <div className="page-content bg-ligh ">
        <section className="shop-sectio overflow-hidden m-b30">
          <div className="container">
            <FeaturedBlog />
          </div>
        </section>

        <section
          className="overflow-hidden py-4"
          style={{ background: "#1F1F1F" }}
        >
          <div className="container">
            <LatestoCollection />
          </div>
        </section>

        <section className="content-inner-3 overflow-hidden ">
          <div className="dz-features-wrapper overflow-hidden">
            <DzTextSlider />
          </div>
        </section>

        <section className="content-inne mt-5 ">
          <div className="container">
            <ProductSection />
          </div>
        </section>

        <section className=" adv-area">
          <div className="container ">
            <SummerSaleBlog />
          </div>
        </section>

        <section className=" collection-bx content-inner-3 overflow-hidden">
          <CollectionBlog />
        </section>

        {/* ---------- Video Modal ---------- */}
        <Modal
          className="quick-view-modal"
          show={openVideo}
          onHide={() => setOpenVideo(false)}
          centered
        >
          <button
            type="button"
            className="btn-close"
            onClick={() => setOpenVideo(false)}
          >
            <i className="icon feather icon-x" />
          </button>
          <div className="modal-body">
            <video width="100%" height="100%" controls autoPlay>
              <source src="/assets/images/video.mp4" type="video/mp4" />
            </video>
          </div>
        </Modal>

        {/* ---------- Automatic Popup (Image + Text) ---------- */}

        <Modal
          className="promo-popup"
          show={showPopup}
          onHide={() => setShowPopup(false)}
          centered
          size="xl"
          dialogClassName="custom-modal"
        >
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowPopup(false)}
            style={{
              position: "absolute",
              right: "15px",
              top: "15px",
              zIndex: 10,
            }}
          >
            <i className="icon feather icon-x" />
          </button>

          <div
            className="modal-body d-flex p-0"
            style={{
              minHeight: "650px",
              height: "650px",
              maxHeight: "90vh",
              background: "#f9f9f9",
              borderRadius: "10px",
            }}
          >
            {/* Left: Image Slideshow */}
            <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
              <Image
                src={heroImages[currentImage]} // slideshow image
                alt="Promo"
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: fade ? 1 : 0,
                  transition: "opacity 1s ease-in-out",
                }}
              />
              <Image
                src={heroImages[(currentImage + 1) % heroImages.length]}
                alt="Next Promo"
                className="w-100 h-100"
                style={{
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: fade ? 0 : 1,
                  transition: "opacity 1s ease-in-out",
                }}
              />
              {/* Promo Badge */}
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  left: "20px",
                  background: "#ff4757",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: "30px",
                  fontWeight: "bold",
                  fontSize: "14px",
                }}
              >
                🔥 Limited Offer
              </div>
            </div>

            {/* Right: Text Section */}
            <div
              style={{
                flex: 1,
                padding: "70px 50px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                background: "#fff",
                position: "relative",
                borderTopRightRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
            >
              <h2
                className="mb-3"
                style={{ fontSize: "2.5rem", color: "#000", fontWeight: "700" }}
              >
                New Arrivals 🎉
              </h2>
              <p
                className="mb-4"
                style={{
                  fontSize: "18px",
                  marginTop: "10px",
                  lineHeight: "1.6",
                  color: "#333",
                }}
              >
                Step into the season with our latest collection of{" "}
                <strong>must-have pieces</strong>. From effortlessly chic
                staples to <em>statement looks</em> that turn heads, our{" "}
                <strong>New Arrivals</strong> are designed to keep you stylish
                for every occasion.
              </p>

              {/* CTA Buttons */}
              <div style={{ display: "flex", gap: "15px", marginTop: "20px" }}>
                <Link href="/shop-list" className="btn btn-primary btn-lg">
                  Shop Now
                </Link>
                <Link href="/login" className="btn btn-outline-dark btn-lg">
                  Sign Up
                </Link>
              </div>

              {/* Mini product previews */}
              {/* <div style={{ display: "flex", gap: "10px", marginTop: "40px" }}>
          <Image
            src={IMAGES.herobg}
            alt="Mini Product 1"
            width={80}
            height={100}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
          <Image
            src={IMAGES.herobg3}
            alt="Mini Product 2"
            width={80}
            height={100}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
          <Image
            src={IMAGES.herobg4}
            alt="Mini Product 3"
            width={80}
            height={100}
            style={{ objectFit: "cover", borderRadius: "10px" }}
          />
        </div> */}
            </div>
          </div>
        </Modal>
      </div>
    </Fragment>
  );
};

export default MainSection;
