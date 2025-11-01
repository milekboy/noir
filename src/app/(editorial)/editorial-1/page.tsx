"use client";
import Link from "next/link";
import { useState } from "react";
import { Camera, PenTool, Scissors, TrendingUp } from "lucide-react";
import UniqueFashionBlog from "@/elements/About/UniqueFashionBlog";
import TeamCreators from "@/elements/About/TeamCreators";

const Editorial1 = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const trends = [
    {
      icon: <TrendingUp className="text-dark mb-3" size={36} />,
      image: "/assets/images/blog/trend1.jpg",
      title: "Bold Neutrals Are Redefining Streetwear",
      desc: "Muted tones dominate the runway — balancing calmness with confidence.",
      more: " Designers are now pairing understated shades with strong silhouettes, bringing a new wave of minimalist energy to urban fashion. This blend of subtle and striking elements redefines casual sophistication.",
    },
    {
      icon: <Scissors className="text-dark mb-3" size={36} />,
      image: "/assets/images/blog/trend2.jpg",
      title: "Textures That Speak Volumes",
      desc: "Structured linen and brushed cotton — the season’s new language of luxury.",
      more: " Beyond the surface, these fabrics embody depth and tactility. The play of texture not only enhances the aesthetic appeal but also captures a tactile connection between comfort and refinement.",
    },
    {
      icon: <PenTool className="text-dark mb-3" size={36} />,
      image: "/assets/images/blog/trend3.jpg",
      title: "The Revival of Modern Tailoring",
      desc: "Precision cuts and versatile layers breathe life into contemporary tailoring.",
      more: " A modern twist on the classic suit — combining relaxed fits with refined craftsmanship. These looks are versatile enough to transcend day-to-night styling effortlessly.",
    },
  ];

  return (
    <div className="page-content bg-light text-dark">
      {/* HERO SECTION */}
    <section className="dz-bnr-inr dz-bnr-inr-sm bg-light py-5">
  <div className="container">
    <div className="row align-items-center">
      {/* TEXT SECTION */}
      <div className="col-lg-8 col-md-8">
        <h1 className="fw-bold mb-3">
          The <span className="text-dark">Noir Editorial</span> — Where Fashion Meets Storytelling
        </h1>
        <p className="lead text-muted">
          Explore our world of style, creativity, and craftsmanship.  
          Discover behind-the-scenes stories, designer insights, and trend narratives that define Noir’s vision.
        </p>
        <nav aria-label="breadcrumb" className="breadcrumb-row mt-4">
          <ul className="breadcrumb">
            <li className="breadcrumb-item"><Link href="/">Home</Link></li>
            <li className="breadcrumb-item active">Editorial</li>
          </ul>
        </nav>
      </div>

      {/* IMAGE SECTION */}
      <div className="col-lg-4 col-md-4 text-center">
        <div
          style={{
            width: "100%",
            maxWidth: "350px",
            height: "350px",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: "16px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/assets/images/background/women1.jpeg"
            alt="Editorial Banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  </div>
</section>


      {/* FEATURE STORY */}
 <section className="content-inner bg-white py-5">
  <div className="container">
    <div className="row align-items-center gy-4">
      {/* IMAGE */}
      <div className="col-lg-6 text-center">
        <div
          style={{
            width: "100%",
            maxWidth: "500px",
            height: "350px",
            margin: "0 auto",
            overflow: "hidden",
            borderRadius: "20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src="/assets/images/blog/pic2.jpg"
            alt="Feature Story"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </div>
      </div>

      {/* TEXT */}
      <div className="col-lg-6">
        <h2 className="fw-bold mb-3">Inside the Craft — The Art of Minimalist Fashion</h2>
        <p className="text-muted">
         This collection captures the delicate balance between simplicity and sophistication, embracing the beauty found in understated design. Every stitch, texture, and silhouette tells a story of modern elegance, quiet confidence, and the timeless art of refined craftsmanship that defines Noir’s vision.
        </p>
        {/* <Link href="/blog-details" className="btn btn-dark rounded-pill mt-3 px-4">
          Read Full Story
        </Link> */}
      </div>
    </div>
  </div>
</section>


      {/* TREND HIGHLIGHTS */}
      <section className="content-inner bg-light py-5">
        <div className="container text-center">
          <h2 className="fw-bold mb-5">Trend Highlights</h2>
          <div className="row g-4">
            {trends.map((trend, i) => (
              <div key={i} className="col-md-4">
                <div className="card border-0 shadow-sm h-100 rounded-4 overflow-hidden hover-lift transition-all">
              
                  <div className="p-4 text-start">
                    <div className="d-flex align-items-center gap-2">
                      {trend.icon}
                      <h5 className="fw-semibold mb-2">{trend.title}</h5>
                    </div>
                    <p className="text-muted mb-3">
                      {trend.desc}
                      {expandedIndex === i && (
                        <span className="d-block mt-2 fade-in">{trend.more}</span>
                      )}
                    </p>
                    <button
                      onClick={() => toggleExpand(i)}
                      className="btn btn-outline-dark btn-sm rounded-pill"
                    >
                      {expandedIndex === i ? "See Less" : "Read More"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEHIND THE SCENES VIDEO */}
      <section className="about-banner overflow-visible position-relative">
        <video autoPlay loop muted playsInline className="w-100 rounded-0" id="video-background">
          <source src="/assets/videos/editorial-behind.mp4" type="video/mp4" />
        </video>
        <div className="about-info text-white position-absolute top-50 start-50 translate-middle text-center p-5 bg-black bg-opacity-50 rounded-4">
          <Camera size={40} className="mb-3 text-white" />
          <h3 className="dz-title text-white mb-3">
            <Link href="/editorial" className="text-white text-decoration-none">
              Behind the Scenes
            </Link>
          </h3>
          <p className="text-light mb-0">
            Step into our creative studio where fabrics come alive,  
            ideas unfold, and craftsmanship meets innovation.  
            Every frame captures the artistry behind Noir’s creations.
          </p>
        </div>
      </section>

      {/* LATEST EDITORIAL POSTS */}
      <section className="content-inner py-5">
        <UniqueFashionBlog />
      </section>

      {/* EDITORIAL TEAM */}
      <section className="content-inner py-5 bg-white">
        <div className="container">
          <div className="section-head text-center mb-5">
            <h2 className="fw-bold">Meet the Editorial Team</h2>
            <p className="text-muted">
              The storytellers, photographers, and designers shaping Noir’s creative vision.
            </p>
          </div>
          <TeamCreators />
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="get-in-touch bg-dark text-white text-center py-5">
        <div className="container">
          <h2 className="fw-bold mb-3">Share Your Story with Noir</h2>
          <p className="text-light mb-4">
            Have a creative idea or editorial feature in mind? Let’s collaborate and make it iconic.
          </p>
          <Link href="/contact-us-1" className="btn btn-light rounded-pill px-4">
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
};




import CommanLayout from "@/components/CommanLayout";

export default function EditorialPage(){
    return(
        <CommanLayout>
            <Editorial1 />
        </CommanLayout>
    )
}


