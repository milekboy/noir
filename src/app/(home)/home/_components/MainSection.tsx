"use client";

import Link from "next/link";
import { Fragment, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import IMAGES, { SVGICON } from "@/constant/theme";
import FeaturedBlog from "@/components/FeaturedBlog";
import AboutusBlog from "@/elements/Home/AboutusBlog";
import AllProduction from "@/elements/Home/AllProduction";
import BlockbusterDeal from "@/elements/Home/BlockbusterDeal";
import CollectionBlog from "@/elements/Home/CollectionBlog";
import DzTextSlider from "@/elements/Home/DzTextSlider";
import FeaturedNowSlider from "@/elements/Home/FeaturedNowSlider";
import GreatSaving from "@/elements/Home/GreatSaving";
import HottestBlog from "@/elements/Home/HottestBlog";
import LatestNewsRollup from "@/elements/Home/LatestNewsRollup";
import MainBannerSlider2 from "@/elements/Home/MainbannerSlider2";
import OffersectionSlider from "@/elements/Home/OffersectionSlider";
import ProductSection from "@/elements/Home/ProductSection";
import ShortListBlog from "@/elements/Home/ShortListBlog";
import SponsoredSlider from "@/elements/Home/SponsoredSlider";
import SummerSaleBlog from "@/elements/Home/SummerSaleBlog";
import TradingSliderBlog from "@/elements/Home/TradingSliderBlog";
import Image from "next/image";
import MoreCollectionBlog from "@/elements/Home/MoreCollectionBlog";
import ScrollablePreference from "@/elements/Home/ScrollablePreference";
import LatestoCollection from "@/elements/Home3/LatestCollection";

// import ScrollablePreference from "@/elements/Home/ScrollablePreference";

const MainSection = () => {
  const [openVideo, setOpenVideo] = useState(false);

  // Fade between two images every 4s in a loop

  const heroImages = [IMAGES.herobg, IMAGES.herobg3, IMAGES.herobg4]; // Replace IMAGES.herobg2 with your second image

  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % heroImages.length);
        // setCurrentImage(currentImage === heroImages.length - 1 ? 0 : currentImage + 1);
        setFade(true);
      }, 300); // fade out duration
    }, 8000);
    return () => clearInterval(interval);
  }, [heroImages]);
  const nextImage = (currentImage + 1) % heroImages.length;
  return (
    <Fragment>
      <div
        className="h-100vh mb-5 "
        style={{
          zIndex: 1,
          width: "100%",
          height: "100vh",
          // position: "relative",
          overflow: "hidden"
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
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} >
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
      <div className="page-content bg-ligh ">
        {/* <div className="main-slider-wrapper">
                    <div className="slider-inner">
                        <MainBannerSlider2 />
                        <div className="bottom-content align-items-end wow fadeInUp" data-wow-delay="1.0s">
                            <svg xmlns="http://www.w3.org/2000/svg" width="76" height="76" viewBox="0 0 76 76" fill="none">
                                <path d="M52.6617 37.6496L58.7381 40.0325L75.0609 49.0874L66.6016 63.7422L49.9214 54.6872L45.1557 50.7554L46.1088 57.1892V75.18H28.952V57.1892L30.0243 50.5171L24.9011 54.6872L8.45924 63.7422L0 49.0874L16.3228 39.7942L22.3991 37.6496L16.3228 35.1475L0 26.2117L8.45924 11.557L25.1394 20.4928L30.0243 24.6629L28.952 18.3482V0H46.1088V18.3482L45.1557 24.4246L49.9214 20.4928L66.6016 11.557L75.0609 26.2117L58.7381 35.3858L52.6617 37.6496Z" fill="black" />
                            </svg>
                          <div
                                style={{
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.color = "#555";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.color = "#000";
                                }}
                                >
                                <h5 className="sub-title" style={{ margin: "0", fontWeight: "bold" }}>NOIR</h5>
                                <h4 style={{ margin: "0" }}>Black and bold</h4>
                        </div>

                        </div>
                        <svg className="star-1" xmlns="http://www.w3.org/2000/svg" width="94" height="94" viewBox="0 0 94 94" fill="none">
                            <path d="M47 0L53.8701 30.4141L80.234 13.766L63.5859 40.1299L94 47L63.5859 53.8701L80.234 80.234L53.8701 63.5859L47 94L40.1299 63.5859L13.766 80.234L30.4141 53.8701L0 47L30.4141 40.1299L13.766 13.766L40.1299 30.4141L47 0Z" fill="#FEEB9D" />
                        </svg>
                        <svg className="star-2" xmlns="http://www.w3.org/2000/svg" width="82" height="94" viewBox="0 0 82 94" fill="none">
                            <path d="M41 0L45.277 39.592L81.7032 23.5L49.554 47L81.7032 70.5L45.277 54.408L41 94L36.723 54.408L0.296806 70.5L32.446 47L0.296806 23.5L36.723 39.592L41 0Z" fill="black" />
                        </svg> */}
        {/* <Link href={"#"} className="animation-btn popup-youtube" 
                            onClick={()=>setOpenVideo(true)}
                        > */}

        {/* <Link href={"#"} className="animation-btn popup-youtube" 
                          
                        >
                            <div className="text-row word-rotate-box c-black">
                                <MoreCollectionBlog />
                                <i className="fa-solid fa-play text-dark badge__emoji" />
                            </div>
                        </Link>
                    </div>
                </div> */}
        <section className="shop-sectio overflow-hidden m-b30" style={{ marginBottom: "50px", marginTop: "0px!important", paddingTop: "0px!important" }}>
          <div className="container">
            <FeaturedBlog />
          </div>
        </section>
        {/* <section className="content-inner overflow-hidden">
          <div className="container">
            <AboutusBlog />
          </div>
        </section> */}
        <section
          className=" overflow-hidden py-4  "
          style={{ background: "#1F1F1F" }}
        >
          <div className="container">
            {/* <ScrollablePreference /> */}
            <LatestoCollection />
          </div>
        </section>
        <section className="content-inner-3 overflow-hidden ">
          <div className="dz-features-wrapper overflow-hidden">
            <DzTextSlider />
          </div>
        </section>
        {/*  Products  Section Start */}
        <section className="content-inne mt-5 ">
          <div className="container">
            <ProductSection />
          </div>
        </section>
        <section className=" adv-area">
          <div className="container " >
            <SummerSaleBlog />
          </div>
        </section>
        {/* <section className="content-inner-2 overflow-hidden">
          <div className="container">
            <AllProduction />
          </div>
        </section>
        <section className="content-inner overflow-hidden p-b0">
          <div className="container">
            <GreatSaving />
          </div>
        </section> */}
        {/* Map Area Start
                <section className="content-inner-3 overflow-hidden " id="Maping">
			        <div className="container-fluid p-0">
                        <HottestBlog />
                    </div>
                </section>     */}

        {/*  Blockbuster deal Start */}
        {/* <section className="content-inner-2 overflow-hidden">

        {/*  Blockbuster deal Start */}

        {/*  Offer Section Start */}
        {/* <section className="content-inner-2">

                    <div className="container">	
                        <div className="section-head style-1 wow fadeInUp d-flex justify-content-between m-b30" data-wow-delay="0.2s">
                            <div className="left-content">
                                <h2 className="title">Featured offer for you</h2>
                            </div>
                            <Link href="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1">See All 
                                <i className="icon feather icon-chevron-right font-18" />
                            </Link>			
                        </div>
                    </div>                
                    <div className="container-fluid px-3">
                        <OffersectionSlider />
                    </div>
                </section> */}
        {/* <section className="content-inner  overflow-hidden">
          <div className="container">
            <div
              className="section-head style-1 wow fadeInUp d-flex justify-content-between"
              data-wow-delay="0.2s"
            >
              <div className="left-content">
                <h2 className="title">Featured now </h2>
              </div>
              <Link
                href="/shop-list"
                className="text-secondary font-14 d-flex align-items-center gap-1"
              >
                See All
                <i className="icon feather icon-chevron-right font-18" />
              </Link>
            </div>
            <FeaturedNowSlider />
          </div>
        </section>
        {/* Short List Slider --> */}
        {/* <section className="content-inner overflow-hidden p-b0">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12 m-b30">
                <div className="about-box style-1 clearfix h-100">
                  <div className="dz-media h-100">
                    <Image src={IMAGES.AboutPic2} alt="" />
                    <div className="media-contant">
                      <h2 className="title">
                        Recent Additions to Your Shortlist
                      </h2>
                      <Link href="/shop-list" className="btn btn-white">
                        Shop Now
                      </Link>
                    </div>
                    <svg
                      className="title animation-text"
                      viewBox="0 0 1320 300"
                    >
                      <text x="0" y="">
                        Shortlist
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 align-self-center">
                <ShortListBlog />
              </div>
            </div>
          </div>
        </section>  */}
        {/*  company sponsored Start */}
        {/* <section className="content-inner-2">
        <section className="content-inner  overflow-hidden">
          <div className="container">
            <div
              className="section-head style-1 wow fadeInUp d-flex justify-content-between"
              data-wow-delay="0.2s"
            >
              <div className="left-content">
                <h2 className="title">Featured now </h2>
              </div>
              <Link
                href="/shop-list"
                className="text-secondary font-14 d-flex align-items-center gap-1"
              >
                See All
                <i className="icon feather icon-chevron-right font-18" />
              </Link>
            </div>
            <FeaturedNowSlider />
          </div>
        </section>
        {/* Short List Slider --> */}
        {/* <section className="content-inner overflow-hidden p-b0">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-12 m-b30">
                <div className="about-box style-1 clearfix h-100">
                  <div className="dz-media h-100">
                    <Image src={IMAGES.AboutPic2} alt="" />
                    <div className="media-contant">
                      <h2 className="title">
                        Recent Additions to Your Shortlist
                      </h2>
                      <Link href="/shop-list" className="btn btn-white">
                        Shop Now
                      </Link>
                    </div>
                    <svg
                      className="title animation-text"
                      viewBox="0 0 1320 300"
                    >
                      <text x="0" y="">
                        Shortlist
                      </text>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-md-12 align-self-center">
                <ShortListBlog />
              </div>
            </div>
          </div>
        </section> */}
        {/*  company sponsored Start */}
        {/* <section className="content-inner-2">
                    <div className="container">	
                        <div className="section-head style-1 wow fadeInUp d-flex  justify-content-between" data-wow-delay="0.2s">
                            <div className="left-content">
                                <h2 className="title">Sponsored</h2>
                            </div>
                            <Link href="/shop-list" className="text-secondary font-14 d-flex align-items-center gap-1">See All 
                                <i className="icon feather icon-chevron-right font-18" />
                            </Link>                            			
                        </div>
                        <SponsoredSlider />
                    </div>
                </section> */}

       

        <section className=" collection-bx content-inner-3 overflow-hidden">
          <CollectionBlog />
        </section>
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
      </div>
    </Fragment>
  );
};
{
  /* </section> */
}

//         <section className=" collection-bx content-inner-3 overflow-hidden">
//           <CollectionBlog />
//         </section>
//         <Modal
//           className="quick-view-modal"
//           show={openVideo}
//           onHide={() => setOpenVideo(false)}
//           centered
//         >
//           <button
//             type="button"
//             className="btn-close"
//             onClick={() => setOpenVideo(false)}
//           >
//             <i className="icon feather icon-x" />
//           </button>
//           <div className="modal-body">
//             <video width="100%" height="100%" controls autoPlay>
//               <source src="/assets/images/video.mp4" type="video/mp4" />
//             </video>
//           </div>
//         </Modal>
//       </div>
//     </Fragment>
//   );
// };
export default MainSection;
